'use strict';

const http = require('http');
const xml2js = require('xml2js');

const validContentTypes = ['application/json', 'text/plain', 'text/xml', ];

const server = http.createServer(function (req, res) {
    const contentType = req.headers['content-type'];
    console.log("Content-Type received: " + contentType);
    
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method not allowed. Please use POST.');
        return;
      }

    if(!validContentTypes.includes(contentType)) {
        console.log("Unsupported Content-Type: " + contentType);
        res.writeHead(415, { 'Content-Type': 'text/plain' });
        res.end(`Unsupported Content-Type: ${contentType}. Supported types: ${validContentTypes.join(', ')}`);
        return;
    }

    var reqBody = '';

    req.on('data', (data) => {
        reqBody += data;
    });

    req.on('end', (end) => {
        try {
            let parsedBody;
      
            if (contentType === 'application/json') {
                parsedBody = JSON.parse(reqBody);
                res.end(JSON.stringify(parsedBody));
            } else if (contentType === 'text/plain') {
                parsedBody = reqBody;
                res.end(parsedBody);
            } else if (contentType === 'text/xml') {
                xml2js.parseString(reqBody, (err, result) => {
                    if (!err) {
                        parsedBody = reqBody;
                        res.end(parsedBody);
                    } else {
                        console.error(err);
                        res.writeHead(400, { 'Content-Type': contentType });
                        res.end('Bad Request, unable to parse request body.')
                    }
                });
            }

            res.writeHead(200, { 'Content-Type': contentType });            
        } catch(err) {
            console.log(err);
            res.writeHead(400, { 'Content-Type': contentType });
            res.end(JSON.stringify('Bad Request, unable to parse request body.'))
        }
    });
});

server.listen(8080);

console.log('Node.js web server at port 8000 is running...');

module.exports = { server };