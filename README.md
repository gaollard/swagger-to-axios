# swagger-to-axios

根据 swagger json schema 生成 Frontend API Config 文件。

## 特性

- 仅支持 swagger json v3
- 按照 tag 划分为多个文件
- 支持参数类型标注 以及 返回值类型标注
- 将所有的类型提取到一个文件中
- 支持配置本地的 swagger json 文件 或者 http 资源

## 用法

**安装**
```shell
# 局部安装
yarn add sjta
# 全局安装
yarn add sjta -g
```

**使用**
```shell
# 全局安装时
sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"

# 局部安装时
npx sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"
```

支持选项:
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

## 配置文件

工作目录下 `sjta.config.json`

```json
{
  "banner": "import { request } from \"@/utils/request\"",
  "request_method": "request"
}
```

- banner 顶部内容
- request_method 发起请求的方法

## 调试
npx ts-node lib/entry -o example/auto-service -s ./example/document.json
