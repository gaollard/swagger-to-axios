"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const configPath = path_1.default.resolve(process.cwd(), 'sjta.config.json');
const config = configPath ? require(configPath) : {
    banner: 'import { request } from "@/utils/request"',
    requestMethod: "request"
};
exports.default = config;
