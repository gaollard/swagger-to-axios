
import fs from 'fs-extra';
import path from 'path'

const configPath = path.resolve(process.cwd(), 'sjta.config.json');

const config: {
  banner: string;
  requestMethod: string;
} = configPath ? require(configPath) : {
  banner: 'import { request } from "@/utils/request"',
  requestMethod: "request"
}

export default config;