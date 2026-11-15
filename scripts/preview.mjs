import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '4173' },
    base: { type: 'string', default: '/' },
  },
});
const base = '/' + values.base.split('/').filter(Boolean).map(encodeURIComponent).join('/');
const prefix = base === '/' ? '/' : base + '/';
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.pdf': 'application/pdf', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (url.pathname === base && base !== '/') {
      response.writeHead(308, { Location: prefix + url.search }).end();
      return;
    }
    if (!url.pathname.startsWith(prefix)) throw new Error('Outside base path');
    const path = resolve(dist, decodeURIComponent(url.pathname.slice(prefix.length)));
    if (!(path + sep).startsWith(dist)) throw new Error('Outside site');
    const isDirectory = (await stat(path)).isDirectory();
    if (isDirectory && !url.pathname.endsWith('/')) {
      response.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
      return;
    }
    const file = isDirectory ? resolve(path, 'index.html') : path;
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).on('error', () => response.destroy()).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Page not found');
  }
});

server.listen(Number(values.port), '127.0.0.1', () => {
  console.log(`Local: http://127.0.0.1:${server.address().port}${prefix}`);
});
