import fs from 'fs';
import request from "request";

export async function fetchJson(source: string) {
  return new Promise((resolve, reject) => {
    if (!source.includes('http')) {
      const data = fs.readFileSync(source, 'utf-8')
      resolve(JSON.parse(data))
    } else {
      request(
        {
          url: source
        },
        (err, res) => {
          if (err) {
            reject(err);
            process.exit(1)
          } else {
            resolve(JSON.parse(res.body));
          }
        }
      );
    }
  });
}