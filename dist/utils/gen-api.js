"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAPI = void 0;
function genAPI(name, url, method, options) {
    const { reqModel, reqModelName, resModel, resModelName } = options;
    const list = [];
    const callContent = `({\n    url: "${url}",\n    method: "${method}",\n    data: params\n  })`;
    if (reqModel && resModel) {
        list.push(`export const ${name} = (params: ${reqModelName}) => {\n  return request<${resModelName}>${callContent};\n}`);
    }
    else if (reqModel) {
        list.push(`export const ${name} = (params: ${reqModelName}) => {\n  return request<{}>${callContent};\n}`);
    }
    else if (resModel) {
        list.push(`export const ${name} = (params: {}) => {\n  return request<${resModelName}>${callContent};\n}`);
    }
    else {
        list.push(`export const ${name} = (params: {}) => {\n  return request<{}>${callContent};\n}`);
    }
    return list.join('\n');
}
exports.genAPI = genAPI;
