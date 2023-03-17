import fs from "fs-extra";
import path from "path";
import { fetchJson } from "./fetch-json";
import { OpenAPIObject } from "./open-api-spec.interface";

let importRequest = `import { request } from "@/utils/request"`;
let swaggerJson: OpenAPIObject;
let outDir: string;
let source: string;

export async function run(param: { outDir: string; source: string, banner?: string }) {
  outDir = param.outDir;
  source = param.source;
  importRequest = param.banner || importRequest;
  swaggerJson = (await fetchJson(source)) as OpenAPIObject;

  fs.removeSync(outDir);
  fs.mkdirpSync(outDir);

  const tagMap: Record<string, any[]> = {
    default: [],
  };

  const apiPathMap = swaggerJson.paths;
  const apiPaths = Object.keys(apiPathMap);

  const genAPI = (
    name: string,
    url: string,
    method: string,
    options: {
      reqModel: string;
      reqModelName: string;
      resModel: string;
      resModelName: string;
    }
  ) => {
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
    } else if (reqModel) {
      list.push(`export ${reqModel}\n`);
      list.push(`export const ${name} = (params: ${reqModelName}) => {
  return request<{}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
    } else if (resModel) {
      list.push(`export ${resModel}\n`);
      list.push(`export const ${name} = (params: {}) => {
  return request<${resModelName}>({
    url: "${url}",
    method: "${method}",
    data: params
  });\n}`);
    } else {
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
      if (!(method === "post" || method === "get")) {
        return;
      }

      const handleConf = pathConf[method] as any;
      const apiPaths = apiPath.split("/");

      const reqParams =
        handleConf?.requestBody?.content?.["application/json"]?.["schema"]
          ?.$ref;
      const reqModel = reqParams ? parseRequestParams(reqParams) : null;

      const resParams =
        handleConf.responses?.default?.content?.["application/json"]?.["schema"]
          ?.$ref;
      const resModel = resParams ? parseRequestParams(resParams) : null;

      const item = genAPI(
        apiPaths[apiPaths.length - 1],
        apiPath,
        method.toLocaleUpperCase(),
        {
          reqModel: reqModel ? reqModel.content : "",
          reqModelName: reqModel ? reqModel.name : "",
          resModel: resModel ? resModel.content : "",
          resModelName: resModel ? resModel.name : "",
        }
      );

      if (handleConf.tags && handleConf.tags.length) {
        const tag = handleConf.tags[0];
        tagMap[tag] = tagMap[tag] || [];
        tagMap[tag].push(item);
      } else {
        tagMap["default"].push(item);
      }
    });
  });

  Object.keys(tagMap).forEach((tag) => {
    fs.writeFileSync(
      `${outDir}/${tag}.ts`,
      `${importRequest};\n\n` + tagMap[tag].join("\n\n")
    );
  });
}

/**
 * @description 解析 type schema
 * @param path
 * @returns
 */
function parseRequestParams(_path: string) {
  const paths = _path.replace("#/", "").split("/");
  let res = swaggerJson as any;
  let index = 0;
  while (index < paths.length) {
    res = res[paths[index]];
    index++;
  }

  const name = paths[paths.length - 1];
  const { properties, type, required } = res;

  let list: string[] = [];
  Object.keys(properties).forEach((key) => {
    const isRequired = (required || []).includes(key);
    if (properties[key].type === "array") {
      // 数组类型
      if (properties[key].items && properties[key].items.$ref) {
        const it = parseRequestParams(properties[key].items.$ref);
        list.push(`  ${key}${isRequired ? "" : "?"}: ${it.declare}[];`);
      } else {
        list.push(`  ${key}${isRequired ? "" : "?"}: any[];`);
      }
    } else if (properties[key].type === "object") {
      // 对象类型
      if (properties[key].items.$ref) {
        const it = parseRequestParams(properties[key].items.$ref);
        list.push(`  ${key}${isRequired ? "" : "?"}: ${it.declare};`);
      } else {
        list.push(`  ${key}${isRequired ? "" : "?"}: {};`);
      }
    } else if (properties[key].allOf) {
      if (properties[key].allOf.length) {
        const it = parseRequestParams(properties[key].allOf[0].$ref);
        list.push(`  ${key}${isRequired ? "" : "?"}: ${it.declare};`);
      } else {
        list.push(`  ${key}${isRequired ? "" : "?"}: {};`);
      }
    } else {
      // 基本类型类型
      list.push(`  ${key}${isRequired ? "" : "?"}: ${properties[key].type};`);
    }
  });

  const content = `interface ${name} {\n${list.join("\n")}\n}`;

  fs.writeFileSync(
    path.resolve(process.cwd(), outDir, "types.ts"),
    "export " + content + "\n\n",
    {
      flag: "a",
    }
  );

  return {
    name,
    content,
    declare: `{\n${list.join("\n")}\n}`,
  };
}
