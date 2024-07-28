//Arnab Halder, ash186.
'use strict';

const http = require('http');
const xml2js = require('xml2js');

//Part A, function provided in the question.
let ping = function (serverURL) {
    return new Promise((resolve, reject) => {
        const urlFormat = new RegExp('(https?|ftp|file)://[-A-Za-z0-9 +& @# /%?= ~_ | !:,.;]+[-A - Za - z0 - 9 +& @# /%=~_ |]');
        if (!urlFormat.test(serverURL))
            reject(`Invalid URL: ${serverURL}`);

        const myRequest = new Request(serverURL, {
            method: "GET",
            mode: "no-cors",
            cache: "no-cache",
            referrerPolicy: "no-referrer"
        });

        let sendTime = new Date();
        fetch(myRequest)
            .then(() => {
                let receiveTime = new Date();
                resolve(receiveTime.getTime() - sendTime.getTime());
            })
            .catch(() => resolve(false));
    });
};

//Function to call the ping() function 10 times and find the average "rtt".
const avgRTT = async function () {
    const serverURL = "https://www.rutgers.edu/";
    //List to store the promises returned by calling the ping() function.
    var promises = [];
    //Store the list of promises returned by calling the ping() function.
    for (var i = 0; i < 10; i++) {
        promises.push(ping(serverURL));
    }

    try {
        //Fetch all the promises in results.
        const results = await Promise.all(promises);
        var sum = 0;
        //The condition (res !== false) is used to consider the scenario where the
        //ping() function fails and does not return any value or returns undefined.
        var validResults = results.filter((res) => res !== false);

        validResults.forEach((res_1) => {
            sum += res_1;
        });

        console.log("Sum: ", sum);
        // console.log("Average RTT: ", sum / validResults.length);
        return sum / validResults.length;
    } catch (error) {
        console.error('Error:', error);
    }
}

//Storing the average rtt in "rtt" to use inside the server. 
var rtt;
avgRTT().then((avg) => {
    console.log("Average: ", avg);
    rtt = avg;
});

//List of valid content types.
const validContentTypes = ['text/plain'];

//PartB: Server side.
//Server logic.
const server = http.createServer(function (req, res) {
    //Create the random delay between 0 and rtt.
    const delay = Math.random() * rtt;
    //The callback function inside setTimeout() helps in simulating the delay from client to server.
    //This simulation can only be ensured by performing the actions inside the callback function.
    setTimeout(() => {
        let parsedBody;
        const contentType = req.headers['content-type'];
        console.log("Content-Type received: " + contentType);

        //Check if method type is POST.
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method not allowed. Please use POST.');
            return;
        }
        //Check if content type is valid.
        if (!validContentTypes.includes(contentType)) {
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
                if (contentType === 'text/plain') {
                    parsedBody = reqBody;
                    //Passing "data" received from request and "rtt" in response.
                    res.end(JSON.stringify({ "data": parsedBody, "rtt": rtt }));
                }
                res.writeHead(200, { 'Content-Type': contentType });
            } catch (err) {
                console.log(err);
                res.writeHead(400, { 'Content-Type': contentType });
                res.end(JSON.stringify('Bad Request, unable to parse request body.'))
            }
        });
        console.log("Ending delay of: ", delay);
    }, delay);
});

server.listen(8080);

console.log('Node.js web server at port 8080 is running...');

module.exports = { server, ping };