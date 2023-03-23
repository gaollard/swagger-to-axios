"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJson = void 0;
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
function fetchJson(source) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            if (!source.includes('http')) {
                const data = fs_1.default.readFileSync(source, 'utf-8');
                resolve(JSON.parse(data));
            }
            else {
                (0, request_1.default)({
                    url: source
                }, (err, res) => {
                    if (err) {
                        reject(err);
                        process.exit(1);
                    }
                    else {
                        resolve(JSON.parse(res.body));
                    }
                });
            }
        });
    });
}
exports.fetchJson = fetchJson;
