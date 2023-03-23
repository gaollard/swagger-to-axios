"use strict";
// export function parseProp(properties: any, key: string, required?: string[]) {
//   let list: string[] = [];
//   // Object.keys(properties).forEach((key) => {
//   //   const isRequired = (required || []).includes(key);
//   //   if (properties[key].type === 'array') {
//   //     // 数组类型
//   //     if (properties[key].items && properties[key].items.$ref) {
//   //       if (properties[key].items.$ref === _path) {
//   //         // 自引用
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${name}[];`);
//   //       } else {
//   //         const it = parseType(properties[key].items.$ref);
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare}[];`);
//   //       }
//   //     } else {
//   //       list.push(`  ${key}${isRequired ? '' : '?'}: any[];`);
//   //     }
//   //   } else if (properties[key].type === 'object') {
//   //     // 对象类型
//   //     if (properties[key].items.$ref) {
//   //       if (properties[key].items.$ref === _path) {
//   //         // 自引用
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
//   //       } else {
//   //         const it = parseType(properties[key].items.$ref);
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
//   //       }
//   //     } else {
//   //       list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
//   //     }
//   //   } else if (properties[key].allOf) {
//   //     if (properties[key].allOf.length) {
//   //       if (properties[key].allOf[0].$ref === _path) {
//   //         // 自引用
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${name};`);
//   //       } else {
//   //         const it = parseType(properties[key].allOf[0].$ref);
//   //         list.push(`  ${key}${isRequired ? '' : '?'}: ${it.declare};`);
//   //       }
//   //     } else {
//   //       list.push(`  ${key}${isRequired ? '' : '?'}: {};`);
//   //     }
//   //   } else {
//   //     // 基本类型类型
//   //     list.push(`  ${key}${isRequired ? '' : '?'}: ${properties[key].type};`);
//   //   }
//   // });
// }
