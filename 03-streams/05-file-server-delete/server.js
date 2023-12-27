const url = require('url');
const http = require('http');
const path = require('path');
const fs = require("fs");

const server = new http.Server();

server.on('request', (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname.slice(1);

    const filepath = path.join(__dirname, 'files', pathname);

    switch (req.method) {
        case 'DELETE':
            if (pathname.indexOf('/') > 0) {
                res.statusCode = 400;
                res.end('Subdirectories are not supported');
                return;
            }

            if (!fs.existsSync(filepath)) {
                res.statusCode = 404;
                res.end('File not found');
                return;
            }
            try {
                fs.unlinkSync(filepath, () => {})
                res.statusCode = 200;
                res.end('File deleted');
            } catch (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal Server Error');
            }
            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
