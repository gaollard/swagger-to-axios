"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const { program } = require('commander');
program
    .option('-o, --outDir <type>', 'output dir')
    .option('-s, --source <type>', 'swagger json path')
    .option('-b, --banner <type>', 'banner');
program.parse(process.argv);
const options = program.opts();
(0, index_1.run)(options);
