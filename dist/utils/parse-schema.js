"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseType = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * @description 解析 type schema
 * @param path
 * @returns
 */
function parseType({ _path, store, docs, outDir, }) {
    if (store[_path]) {
        return store[_path];
    }
    // 寻找schema
    const paths = _path.replace('#/', '').split('/');
    let res = docs;
    let index = 0;
    while (index < paths.length) {
        res = res[paths[index]];
        index++;
    }
    // property 分析
    const name = paths[paths.length - 1];
    const { properties, type, required } = res;
    const list = [];
    const func = (key) => {
        const isRequired = (required || []).includes(key);
        if (properties[key].type === 'array') {
            // 数组类型
            if (properties[key].items && properties[key].items.$ref) {
                if (properties[key].items.$ref === _path) {
                    // 自引用
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${name}[];`);
                }
                else {
                    const it = parseType({
                        _path: properties[key].items.$ref,
                        store,
                        docs,
                        outDir,
                    });
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare}[];`);
                }
            }
            else if (properties[key].items && properties[key].items.type) {
                list.push(`  ${key}${isRequired ? '' : '?'}: ${properties[key].items.type}[];`);
            }
            else {
                list.push(`  ${key}${isRequired ? '' : '?'}: any[];`);
            }
        }
        else if (properties[key].type === 'object') {
            // 对象类型
            if (properties[key].items.$ref) {
                if (properties[key].items.$ref === _path) {
                    // 自引用
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
                }
                else {
                    const it = parseType({
                        _path: properties[key].items.$ref,
                        store,
                        outDir,
                        docs,
                    });
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
                }
            }
            else {
                list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
            }
        }
        else if (properties[key].allOf) {
            if (properties[key].allOf.length) {
                if (properties[key].allOf[0].$ref === _path) {
                    // 自引用
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
                }
                else {
                    const it = parseType({
                        store,
                        docs,
                        outDir,
                        _path: properties[key].allOf[0].$ref,
                    });
                    list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
                }
            }
            else {
                list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
            }
        }
        else {
            // 基本类型类型
            list.push(`  ${key}${isRequired ? '' : '?'}: ${properties[key].type};`);
        }
    };
    Object.keys(properties).forEach(func);
    const content = `interface ${name} {\n${list.join('\n')}\n}`;
    fs_extra_1.default.writeFileSync(path_1.default.resolve(process.cwd(), outDir, 'types.d.ts'), 'declare ' + content + '\n\n', {
        flag: 'a',
    });
    store[_path] = {
        name,
        content,
        declare: `{\n${list.join('\n')}\n}`,
    };
    return store[_path];
}
exports.parseType = parseType;
