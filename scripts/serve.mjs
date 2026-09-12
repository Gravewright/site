// Local preview only: bind to loopback and confine requests to this directory.
import { createServer } from 'node:http';
import { readFile, stat, realpath } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const port = Number(process.env.PORT || 4173);
const mime = {'.png':'image/png', '.xml':'application/xml; charset=utf-8', '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.webp':'image/webp', '.mp4':'video/mp4', '.vtt':'text/vtt; charset=utf-8', '.txt':'text/plain; charset=utf-8', '.md':'text/plain; charset=utf-8', '.json':'application/json'};
const server = createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, {Allow:'GET, HEAD'}).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const path = await realpath(resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname)));
    if (!path.startsWith(root + sep) || path.split(sep).some(part => part.startsWith('.'))) { res.writeHead(403).end('Forbidden'); return; }
    if (!(await stat(path)).isFile()) throw new Error('Not a file');
    const data = await readFile(path);
    const headers = {'Content-Type':mime[extname(path)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Accept-Ranges':'bytes'};
    // Byte ranges make seeking in the replacement MP4 files work during preview.
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]);
      const end = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
      if (start > end || start >= data.length) { res.writeHead(416, {'Content-Range':`bytes */${data.length}`}).end(); return; }
      res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${data.length}`, 'Content-Length':end-start+1});
      res.end(req.method === 'HEAD' ? undefined : data.subarray(start, end + 1));
    } else {
      res.writeHead(200, {...headers, 'Content-Length':data.length});
      res.end(req.method === 'HEAD' ? undefined : data);
    }
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Local preview: http://127.0.0.1:${port} (Ctrl+C to stop)`));
