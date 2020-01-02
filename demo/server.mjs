/* eslint-env node */

import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIRNAME, "..");

const NOT_FOUND = `
<!DOCTYPE http>
<html>
  <head>
    <meta charset="utf-8">
    <title>Not Found</title>
  </head>
  <body>
    <h1>Not Found</h1>
    <a href="/">Back to main page</a>
  </body>
</html>
`;

function main() {
  const server = http.createServer(async (request, response) => {
    const filename = request.url === "/" ? "/demo/index.html" : request.url;
    const [ext] = filename.split(".").slice(-1);

    let mime;
    if (ext === "html") {
      mime = "text/html;charset=utf-8";
    } else if (ext === "mjs") {
      mime = "application/javascript";
    } else if (ext === "js" || ext === "cjs") {
      mime = "text/javascript;charset=utf-8";
    } else if (ext === "css") {
      mime = "text/css;charset=utf8";
    } else if (ext === "json") {
      mime = "application/json";
    } else {
      mime = "text/plain;charset=utf-8";
    }

    const pathname = path.join(ROOT, filename);

    try {
      const file = await fs.readFile(pathname);

      console.log(`Serving "${request.url}" -- ${mime} 200`);
      response.writeHead(200, { "Content-Type": mime });
      response.end(file);
    } catch (error) {
      console.error(error);
      response.end(NOT_FOUND);
      response.writeHead(404, { "Content-Type": "text/html" });
    }
  });

  server.listen(8000, "localhost", () => {
    const { address, port } = server.address();

    console.log(`Opened demo server on: http://${address}:${port}/`);
  });
}

main();
