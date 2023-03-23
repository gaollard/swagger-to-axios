import fs from 'fs-extra';
import { genAPI } from './utils/gen-api';
import { fetchJson } from './utils/fetch-json';
import { IParseType } from './interface/IParseType';
import { OpenAPIObject } from './interface/open-api-spec.interface';
import { parseType } from './utils/parse-schema';

let importRequest = `import { request } from "@/utils/request"`;
let docs: OpenAPIObject;
let outDir: string;
let source: string;
let store: Record<string, IParseType> = {};

export async function run(param: {
  outDir: string;
  source: string;
  banner?: string;
}) {
  outDir = param.outDir;
  source = param.source;
  importRequest = param.banner || importRequest;
  docs = (await fetchJson(source)) as OpenAPIObject;

  fs.removeSync(outDir);
  fs.mkdirpSync(outDir);

  const tagMap: Record<string, any[]> = { default: [] };
  const apiPathMap = docs.paths;
  const apiPaths = Object.keys(apiPathMap);

  apiPaths.forEach((apiPath) => {
    const pathConf = apiPathMap[apiPath];

    Object.keys(pathConf).forEach((method) => {
      if (!(method === 'post' || method === 'get')) {
        return;
      }

      const handleConf = pathConf[method] as any;
      const apiPaths = apiPath.split('/');

      const reqParams =
        handleConf?.requestBody?.content?.['application/json']?.['schema']
          ?.$ref;
      const reqModel = reqParams
        ? parseType({ _path: reqParams, store, docs, outDir })
        : null;

      // 响应参数
      const resSchema =
        handleConf.responses?.default?.content?.['application/json']?.[
          'schema'
        ];
      const isArrayResSchema = resSchema?.type === 'array';
      const resParams = !isArrayResSchema
        ? resSchema?.$ref
        : resSchema.items.$ref;
      const resModel = resParams
        ? parseType({ _path: resParams, store, docs, outDir })
        : null;

      const item = !isArrayResSchema
        ? genAPI(
            apiPaths[apiPaths.length - 1],
            apiPath,
            method.toLocaleUpperCase(),
            {
              reqModel: reqModel ? reqModel.content : '',
              reqModelName: reqModel ? reqModel.name : '',
              resModel: resModel ? resModel.name : '',
              resModelName: resModel ? resModel.name : '',
            },
          )
        : genAPI(
            apiPaths[apiPaths.length - 1],
            apiPath,
            method.toLocaleUpperCase(),
            {
              reqModel: reqModel ? reqModel.content : '',
              reqModelName: reqModel ? reqModel.name : '',
              resModel: resModel ? resModel.name : '',
              resModelName: resModel ? resModel.name + '[]' : '',
            },
          );

      if (handleConf.tags && handleConf.tags.length) {
        const tag = handleConf.tags[0];
        tagMap[tag] = tagMap[tag] || [];
        tagMap[tag].push(item);
      } else {
        tagMap['default'].push(item);
      }
    });
  });

  Object.keys(tagMap).forEach((tag) => {
    fs.writeFileSync(
      `${outDir}/${tag}.ts`,
      `${importRequest};\n\n` + tagMap[tag].join('\n\n'),
    );
  });
}
