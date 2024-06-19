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
const gen_api_1 = require("./utils/gen-api");
const fetch_json_1 = require("./utils/fetch-json");
const parse_schema_1 = require("./utils/parse-schema");
const config_1 = __importDefault(require("./config"));
let importRequest = config_1.default.banner;
let docs;
let outDir;
let source;
let store = {};
function run(param) {
    return __awaiter(this, void 0, void 0, function* () {
        outDir = param.outDir;
        source = param.source;
        importRequest = param.banner || importRequest;
        docs = (yield (0, fetch_json_1.fetchJson)(source));
        fs_extra_1.default.removeSync(outDir);
        fs_extra_1.default.mkdirpSync(outDir);
        const tagMap = { default: [] };
        const apiPathMap = docs.paths;
        const apiPaths = Object.keys(apiPathMap);
        apiPaths.forEach((apiPath) => {
            const pathConf = apiPathMap[apiPath];
            Object.keys(pathConf).forEach((method) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (!(method === 'post' || method === 'get')) {
                    return;
                }
                const handleConf = pathConf[method];
                const apiPaths = apiPath.split('/');
                const reqParams = (_d = (_c = (_b = (_a = handleConf === null || handleConf === void 0 ? void 0 : handleConf.requestBody) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b['application/json']) === null || _c === void 0 ? void 0 : _c['schema']) === null || _d === void 0 ? void 0 : _d.$ref;
                const reqModel = reqParams
                    ? (0, parse_schema_1.parseType)({ _path: reqParams, store, docs, outDir })
                    : null;
                // 响应参数
                const resSchema = (_h = (_g = (_f = (_e = handleConf.responses) === null || _e === void 0 ? void 0 : _e.default) === null || _f === void 0 ? void 0 : _f.content) === null || _g === void 0 ? void 0 : _g['application/json']) === null || _h === void 0 ? void 0 : _h['schema'];
                const isArrayResSchema = (resSchema === null || resSchema === void 0 ? void 0 : resSchema.type) === 'array';
                const resParams = !isArrayResSchema
                    ? resSchema === null || resSchema === void 0 ? void 0 : resSchema.$ref
                    : resSchema.items.$ref;
                const resModel = resParams
                    ? (0, parse_schema_1.parseType)({ _path: resParams, store, docs, outDir })
                    : null;
                const item = !isArrayResSchema
                    ? (0, gen_api_1.genAPI)(apiPaths[apiPaths.length - 1], apiPath, method.toLocaleUpperCase(), {
                        reqModel: reqModel ? reqModel.content : '',
                        reqModelName: reqModel ? reqModel.name : '',
                        resModel: resModel ? resModel.name : '',
                        resModelName: resModel ? resModel.name : '',
                    })
                    : (0, gen_api_1.genAPI)(apiPaths[apiPaths.length - 1], apiPath, method.toLocaleUpperCase(), {
                        reqModel: reqModel ? reqModel.content : '',
                        reqModelName: reqModel ? reqModel.name : '',
                        resModel: resModel ? resModel.name : '',
                        resModelName: resModel ? resModel.name + '[]' : '',
                    });
                if (handleConf.tags && handleConf.tags.length) {
                    const tag = handleConf.tags[0];
                    tagMap[tag] = tagMap[tag] || [];
                    tagMap[tag].push(item);
                }
                else {
                    tagMap['default'].push(item);
                }
            });
        });
        Object.keys(tagMap).forEach((tag) => {
            fs_extra_1.default.writeFileSync(`${outDir}/${tag}.ts`, `${importRequest};\n\n` + tagMap[tag].join('\n\n'));
        });
    });
}
exports.run = run;
