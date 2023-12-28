const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  const limit = 1024*1024;
  switch (req.method) {
    case 'POST':
      if(pathname.indexOf('/') > 0 ){
        res.statusCode = 400;
        res.end('Subdirectories are not supported');
        return;
      }
      if (fs.existsSync(filepath)) {
        res.statusCode = 409;
        res.end('File exist');
        return;
      }
      const fileWriteStream = fs.createWriteStream(filepath,{ flags: 'wx' });
      const limitSizeStream = new LimitSizeStream({ limit });

      req.pipe(limitSizeStream).pipe(fileWriteStream); //

      fileWriteStream.on('error', (err) => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal server error');
        }
        fs.unlink(filepath, () => {});
      });

      fileWriteStream.on('finish',()=>{
        res.statusCode = 201;
        res.end('Done');
      });

      limitSizeStream.on('error', (err) => {
        if (!res.headersSent) {
          res.statusCode = 413;
          res.end('File too large');
        }
        fileWriteStream.destroy();
        fs.unlink(filepath, () => {});
      });

      req.on('aborted', () => {
        fileWriteStream.destroy();
        fs.unlink(filepath, () => {}); // Delete the file
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
