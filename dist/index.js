"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fetch_json_1 = require("./fetch-json");
let importRequest = `import { request } from "@/utils/request"`;
let swaggerJson;
let outDir;
let source;
function run(param) {
    return __awaiter(this, void 0, void 0, function* () {
        outDir = param.outDir;
        source = param.source;
        importRequest = param.banner || importRequest;
        swaggerJson = (yield (0, fetch_json_1.fetchJson)(source));
        fs_extra_1.default.removeSync(outDir);
        fs_extra_1.default.mkdirpSync(outDir);
        const tagMap = {
            default: [],
        };
        const apiPathMap = swaggerJson.paths;
        const apiPaths = Object.keys(apiPathMap);
        const genAPI = (name, url, method, options) => {
            const { reqModel, reqModelName, resModel, resModelName } = options;
            const list = [];
            if (reqModel && resModel) {
                list.push(`export ${reqModel}\n`);
                list.push(`export ${resModel}\n`);
                list.push(`export const ${name} = (params: ${reqModelName}) => {
  return request<${resModelName}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
            }
            else if (reqModel) {
                list.push(`export ${reqModel}\n`);
                list.push(`export const ${name} = (params: ${reqModelName}) => {
  return request<{}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
            }
            else if (resModel) {
                list.push(`export ${resModel}\n`);
                list.push(`export const ${name} = (params: {}) => {
  return request<${resModelName}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
            }
            else {
                list.push(`export const ${name} = (params: {}) => {
  return request<{}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
            }
            return list.join("\n");
        };
        apiPaths.forEach((apiPath) => {
            const pathConf = apiPathMap[apiPath];
            Object.keys(pathConf).forEach((method) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                if (!(method === "post" || method === "get")) {
                    return;
                }
                const handleConf = pathConf[method];
                const apiPaths = apiPath.split("/");
                const reqParams = (_d = (_c = (_b = (_a = handleConf === null || handleConf === void 0 ? void 0 : handleConf.requestBody) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b["application/json"]) === null || _c === void 0 ? void 0 : _c["schema"]) === null || _d === void 0 ? void 0 : _d.$ref;
                const reqModel = reqParams ? parseRequestParams(reqParams) : null;
                const resParams = (_j = (_h = (_g = (_f = (_e = handleConf.responses) === null || _e === void 0 ? void 0 : _e.default) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g["application/json"]) === null || _h === void 0 ? void 0 : _h["schema"]) === null || _j === void 0 ? void 0 : _j.$ref;
                const resModel = resParams ? parseRequestParams(resParams) : null;
                const item = genAPI(apiPaths[apiPaths.length - 1], apiPath, method.toLocaleUpperCase(), {
                    reqModel: reqModel ? reqModel.content : "",
                    reqModelName: reqModel ? reqModel.name : "",
                    resModel: resModel ? resModel.content : "",
                    resModelName: resModel ? resModel.name : "",
                });
                if (handleConf.tags && handleConf.tags.length) {
                    const tag = handleConf.tags[0];
                    tagMap[tag] = tagMap[tag] || [];
                    tagMap[tag].push(item);
                }
                else {
                    tagMap["default"].push(item);
                }
            });
        });
        Object.keys(tagMap).forEach((tag) => {
            fs_extra_1.default.writeFileSync(`${outDir}/${tag}.ts`, `${importRequest};\n\n` + tagMap[tag].join("\n\n"));
        });
    });
}
exports.run = run;
/**
 * @description 解析 type schema
 * @param path
 * @returns
 */
function parseRequestParams(_path) {
    const paths = _path.replace("#/", "").split("/");
    let res = swaggerJson;
    let index = 0;
    while (index < paths.length) {
        res = res[paths[index]];
        index++;
    }
    const name = paths[paths.length - 1];
    const { properties, type, required } = res;
    let list = [];
    Object.keys(properties).forEach((key) => {
        const isRequired = (required || []).includes(key);
        if (properties[key].type === "array") {
            // 数组类型
            if (properties[key].items && properties[key].items.$ref) {
                const it = parseRequestParams(properties[key].items.$ref);
                list.push(`  ${key}${isRequired ? "" : "?"}: ${it.declare}[];`);
            }
            else {
                list.push(`  ${key}${isRequired ? "" : "?"}: any[];`);
            }
        }
        else if (properties[key].type === "object") {
            // 对象类型
            if (properties[key].items.$ref) {
                const it = parseRequestParams(properties[key].items.$ref);
                list.push(`  ${key}${isRequired ? "" : "?"}: ${it.declare};`);
            }
            else {
                list.push(`  ${key}${isRequired ? "" : "?"}: {};`);
            }
        }
        else {
            // 基本类型类型
            list.push(`  ${key}${isRequired ? "" : "?"}: ${properties[key].type};`);
        }
    });
    const content = `interface ${name} {\n${list.join("\n")}\n}`;
    fs_extra_1.default.writeFileSync(path_1.default.resolve(process.cwd(), outDir, "types.ts"), "export " + content + "\n\n", {
        flag: "a",
    });
    return {
        name,
        content,
        declare: `{\n${list.join("\n")}\n}`,
    };
}
