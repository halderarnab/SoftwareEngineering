'use strict';

const http = require('http');
const xml2js = require('xml2js');
const mysql = require('mysql');
const url = require('url');

//Creating connection to the database.
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'testdb',
});

//Connecting to the database.
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});
  
//Valid content types supported by the server.
const validContentTypes = ['application/json'];

//Create the functionalities to be implemented.
const server = http.createServer(function (req, res) {
    //Get the parsed url.
    const parsedUrl = url.parse(req.url, true);
    //Get the pathname.
    const pathname = parsedUrl.pathname;

    const contentType = req.headers['content-type'];
    console.log("Content-Type received: " + contentType);
    
    //Check if the request method received is supported.
    if (req.method !== 'POST' && req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method not allowed. Please use POST, PUT, GET or DELETE.');
        return;
    }

    //Check if the content type received is supported.
    if(!validContentTypes.includes(contentType)) {
        console.log("Unsupported Content-Type: " + contentType);
        res.writeHead(415, { 'Content-Type': 'text/plain' });
        res.end(`Unsupported Content-Type: ${contentType}. Supported types: ${validContentTypes.join(', ')}`);
        return;
    }
    
    //GET method APIs.
    if (req.method === 'GET') {
        if (pathname === '/all') {
            //Retrive all rows from the table.
            db.query('SELECT * FROM testtable', (err, results) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error.' }));
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(JSON.stringify(results));
                }
            });
        } else if (pathname.includes('/id/')) {
            //Retrive a row for a given id from the table.
            const id = parsedUrl.pathname.split('/')[2];
            db.query('SELECT * FROM testtable WHERE id = ?', [id], (err, results) => {
                if (err) {
                    console.log(err);
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error.' }));
                } else if (results.length === 0) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Id not found.' }));
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(JSON.stringify(results[0]));
                }
            });
        } else {
            //Invalid GET url received.
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'URL not found.' }));
        }
    } else if (req.method === 'POST' && pathname === '/createRow' && contentType === 'application/json') {
        //POST API to create row.
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const { id,  col1, col2, col3, col4 } = JSON.parse(body);
            //Check if any of the body parameters are empty.
            if (!id || !col1 || !col2 || !col3 || !col4) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid data.' }));
            } else {
                //Create a new row from the values received in the body.
                db.query('INSERT INTO testtable VALUES (?, ?, ?, ?, ?)', [id, col1, col2, col3, col4], (err) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error.' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(JSON.stringify({ message: 'Row created.' }));
                    }
                });
            }
        });
    } else if (req.method === 'PUT' && pathname === '/updateRow' && contentType === 'application/json') {
        //POST API to update row.
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const { id,  col1, col2, col3, col4 } = JSON.parse(body);
            //Check if the body parameters are empty.
            if (!id || !col1 || !col2 || !col3 || !col4) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid data.' }));
            } else {
                //Update the row for the given id to the values received from the body.
                db.query('UPDATE testtable SET col1 = ?, col2 = ?, col3 = ?, col4 = ? WHERE id = ?', [col1, col2, col3, col4, id], (err, results) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error.' }));
                    } else if (results.affectedRows === 0) {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ error: 'Id not found.' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(JSON.stringify({ message: 'Id updated.' }));
                    }
                });
            }
        });
    } else if (req.method === 'DELETE' && pathname === '/deleteRow' && contentType === 'application/json') {
        //DELETE API to delete row.
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            const { id } = JSON.parse(body);
            //Check if body parameter is empty.
            if (!id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid data.' }));
            } else {
                //Delete the row for the id received from the body.
                db.query('DELETE FROM testtable WHERE id = ?', [id], (err, results) => {
                    if (err) {
                        console.log(err);
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: 'Internal Server Error.' }));
                    } else if (results.affectedRows === 0) {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ error: 'Id not found.' }));
                    } else {
                        res.writeHead(200, { 'Content-Type': contentType });
                        res.end(JSON.stringify({ message: 'Id deleted.' }));
                    }
                });
            }
        });
    } else {
        //Server received an invalid url.
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Resource not found.' }));
    }
});

server.listen(8080);

console.log('Node.js web server at port 8080 is running...');

module.exports = { server };