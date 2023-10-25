import fs from 'fs-extra';
import path from 'path';
import { IParseType } from '../interface/IParseType';
import { OpenAPIObject } from '../interface/open-api-spec.interface';

/**
 * @description 解析 type schema
 * @param path
 * @returns
 */
export function parseType({
  _path,
  store,
  docs,
  outDir,
}: {
  _path: string;
  store: Record<string, IParseType>;
  docs: OpenAPIObject;
  outDir: string;
}): IParseType {
  if (store[_path]) {
    return store[_path];
  }

  // 寻找schema
  const paths = _path.replace('#/', '').split('/');
  let res = docs as any;
  let index = 0;
  while (index < paths.length) {
    res = res[paths[index]];
    index++;
  }

  // property 分析
  const name = paths[paths.length - 1];
  const { properties, type, required } = res;
  const list: string[] = [];

  const func = (key: string) => {
    const isRequired = (required || []).includes(key);
    if (properties[key].type === 'array') {
      // 数组类型
      if (properties[key].items && properties[key].items.$ref) {
        if (properties[key].items.$ref === _path) {
          // 自引用
          list.push(`  ${key}${isRequired ? '' : '?'}: ${name}[];`);
        } else {
          const it = parseType({
            _path: properties[key].items.$ref,
            store,
            docs,
            outDir,
          });
          list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare}[];`);
        }
      } else if (properties[key].items && properties[key].items.type) {
        list.push(`  ${key}${isRequired ? '' : '?'}: ${properties[key].items.type}[];`);
      } else {
        list.push(`  ${key}${isRequired ? '' : '?'}: any[];`);
      }
    } else if (properties[key].type === 'object') {
      // 对象类型
      if (properties[key].items.$ref) {
        if (properties[key].items.$ref === _path) {
          // 自引用
          list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
        } else {
          const it = parseType({
            _path: properties[key].items.$ref,
            store,
            outDir,
            docs,
          });
          list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
        }
      } else {
        list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
      }
    } else if (properties[key].allOf) {
      if (properties[key].allOf.length) {
        if (properties[key].allOf[0].$ref === _path) {
          // 自引用
          list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
        } else {
          const it = parseType({
            store,
            docs,
            outDir,
            _path: properties[key].allOf[0].$ref,
          });
          list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
        }
      } else {
        list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
      }
    } else {
      // 基本类型类型
      list.push(`  ${key}${isRequired ? '' : '?'}: ${properties[key].type};`);
    }
  };

  Object.keys(properties).forEach(func);

  const content = `interface ${name} {\n${list.join('\n')}\n}`;

  fs.writeFileSync(
    path.resolve(process.cwd(), outDir, 'types.d.ts'),
    'declare ' + content + '\n\n',
    {
      flag: 'a',
    },
  );

  store[_path] = {
    name,
    content,
    declare: `{\n${list.join('\n')}\n}`,
  };

  return store[_path];
}
