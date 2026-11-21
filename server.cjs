// Servidor local sem dependências. Módulos JavaScript precisam ser servidos por HTTP.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "dist");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
http
  .createServer((req, res) => {
    try {
      const requestPath = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = path.resolve(
        root,
        "." + (requestPath === "/" ? "/index.html" : requestPath),
      );
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end("Acesso negado");
        return;
      }
      fs.stat(file, (error, stat) => {
        if (error || !stat.isFile()) {
          res.writeHead(404);
          res.end("Arquivo não encontrado");
          return;
        }
        res.writeHead(200, {
          "Content-Type":
            mime[path.extname(file)] || "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        });
        fs.createReadStream(file).pipe(res);
      });
    } catch {
      res.writeHead(400);
      res.end("Endereço inválido");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`ROOMLAB V.2: http://localhost:${port}\nCtrl+C para encerrar.`),
  );
