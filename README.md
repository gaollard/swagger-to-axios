# swagger-json-to-axios

根据 swagger json schema 生成 Frontend API 文件。

## 特性
- 仅支持 swagger json v3
- 按照 tag 进行文件划分
- 支持参数类型标注 以及 返回值类型标注

## 用法
支持两个选项:
```text
-o --outDir  # 输出目录，如果目录不存在，则自动创建目录
-s, --source # swagger json 文件目录, 如果以http开头，则为远程文件
```

配置远程的 swagger json 文件:
```shell
sjta -o example/auto-service -s "http://task.airtlab.com/static/document.json"
```

配置本地的 swagger json 文件:
```shell
sjta -o example/auto-service -s "./example/document.json"
```