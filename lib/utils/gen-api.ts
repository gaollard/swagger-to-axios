import config from "../config";

export function genAPI(
  name: string,
  url: string,
  method: string,
  options: {
    reqModel: string;
    reqModelName: string;
    resModel: string;
    resModelName: string;
  },
) {
  const { reqModel, reqModelName, resModel, resModelName } = options;
  const list = [];
  const methodName = config.requestMethod;

  const callContent = `({\n    url: "${url}",\n    method: "${method}",\n    data: params\n  })`;

  if (reqModel && resModel) {
    list.push(
      `export const ${name} = (params: ${reqModelName}) => {\n  return ${methodName}<${resModelName}>${callContent};\n}`,
    );
  } else if (reqModel) {
    list.push(
      `export const ${name} = (params: ${reqModelName}) => {\n  return ${methodName}<{}>${callContent};\n}`,
    );
  } else if (resModel) {
    list.push(
      `export const ${name} = (params: {}) => {\n  return ${methodName}<${resModelName}>${callContent};\n}`,
    );
  } else {
    list.push(
      `export const ${name} = (params: {}) => {\n  return ${methodName}<{}>${callContent};\n}`,
    );
  }

  return list.join('\n');
}
