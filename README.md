# swagger-json-to-axios
根据 swagger json schema 生成 Frontend API Config 文件。

## 特性
- 仅支持 swagger json v3
- 按照 tag 划分为多个文件
- 支持参数类型标注 以及 返回值类型标注
- 将所有的类型提取到一个文件中
- 支持配置本地的 swagger json 文件 或者 http 资源

## 用法

局部安装：
```shell
# 安装
yarn add wjta
# 使用
npx sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"
```

全局安装：
```shell
yarn add wjta -g
sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"
```

支持两个选项:
```text
-o --outDir # 输出目录，如果目录不存在，则自动创建目录
-s --source # swagger json 文件目录, 如果以http开头，则为远程文件
-b --banner # 每个文件顶部内部, 默认 为 `import { request } from "@/utils/request"`
```

配置远程的 swagger json 文件:
```shell
sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"
```

配置本地的 swagger json 文件:
```shell
sjta -o example/auto-service -s "./example/document.json"
```
