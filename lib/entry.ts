import { run } from './index';

const { program } = require('commander');

program
  .option('-o, --outDir <type>', 'output dir')
  .option('-s, --source <type>', 'swagger json path')
  .option('-b, --banner <type>', 'banner')

program.parse(process.argv);

const options = program.opts();

run(options)