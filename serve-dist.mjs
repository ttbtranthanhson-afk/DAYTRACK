import http from 'node:http';
import { appendFileSync, createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const root = join(workspaceRoot, 'dist');
const port = Number(process.env.PORT ?? 5173);
const log = (message) => appendFileSync(join(workspaceRoot, 'serve-dist.log'), `${new Date().toISOString()} ${message}\n`);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
  const requestedPath = decodeURIComponent(url.pathname);
  const candidate = resolve(join(root, requestedPath));
  const filePath = candidate.startsWith(root) && existsSync(candidate) && statSync(candidate).isFile()
    ? candidate
    : join(root, 'index.html');
  const type = types[extname(filePath)] ?? 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': type });
  createReadStream(filePath).pipe(response);
});

server.on('error', (error) => {
  log(`ERROR ${error.stack ?? error.message}`);
});

server.listen(port, '127.0.0.1', () => {
  log(`DayTrack is running at http://127.0.0.1:${port}/ root=${root}`);
  console.log(`DayTrack is running at http://127.0.0.1:${port}/`);
});
