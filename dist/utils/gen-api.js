"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAPI = void 0;
const config_1 = __importDefault(require("../config"));
function genAPI(name, url, method, options) {
    const { reqModel, reqModelName, resModel, resModelName } = options;
    const list = [];
    const methodName = config_1.default.requestMethod;
    const callContent = `({\n    url: "${url}",\n    method: "${method}",\n    data: params\n  })`;
    if (reqModel && resModel) {
        list.push(`export const ${name} = (params: ${reqModelName}) => {\n  return ${methodName}<${resModelName}>${callContent};\n}`);
    }
    else if (reqModel) {
        list.push(`export const ${name} = (params: ${reqModelName}) => {\n  return ${methodName}<{}>${callContent};\n}`);
    }
    else if (resModel) {
        list.push(`export const ${name} = (params: {}) => {\n  return ${methodName}<${resModelName}>${callContent};\n}`);
    }
    else {
        list.push(`export const ${name} = (params: {}) => {\n  return ${methodName}<{}>${callContent};\n}`);
    }
    return list.join('\n');
}
exports.genAPI = genAPI;
