const jasmine = require('jasmine');

const { server } = require('../hw4');

const supertest = require('supertest');

describe("Application Server Tests:", function() {
    let count;
    beforeAll(function () {
        count = 0;
        if (server.listening)
            server.close();
        server.listen(8080);
        console.log("Node.js web server at port 8000 is running...")
        console.log("\n=====================Executing Test Cases============================");
    });

    afterAll(function () {
        console.log("\n======================Execution Finished=============================");
        server.close();
    });

    beforeEach(function () {
        count++;
        console.log("\n---------------------------------------");
        console.log("Executing TC "+ count + ".");
    });

    afterEach(function () {
        console.log("\nFinished executing TC "+ count + ".");
        console.log("---------------------------------------");
    });

    it("Should return 415 for unsupported Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send('Some Text')
        .set('Content-Type', 'application/pdf')
        .expect(415, 'Unsupported Content-Type: application/pdf. Supported types: application/json, text/plain, text/xml');
    });

    it("Should return 405 for GET method.", async function() {
        await supertest(server)
        .get('')
        .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for PUT method.", async function() {
        await supertest(server)
        .put('')
        .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for DELETE method.", async function() {
        await supertest(server)
        .delete('')
        .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for PATCH method.", async function() {
        await supertest(server)
        .patch('')
        .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for OPTIONS method.", async function() {
        await supertest(server)
        .options('')
        .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 200 for valid JSON Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send('{"message": "Hello, World!"}')
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Hello, World!"}');
    });

    it("Should return 400 for invalid JSON Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send('Invalid JSON')
        .set('Content-Type', 'application/json')
        .expect(400, '"Bad Request, unable to parse request body."');
    });

    it("Should return 200 for text/plain Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send('This is a sample plain text.')
        .set('Content-Type', 'text/plain')
        .expect(200, 'This is a sample plain text.');
    });

    const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<note>' +
    '<to>Tove</to>' +
    '<from>Jani</from>' +
    '<heading>Reminder</heading>' +
    '<body>Don\'t forget me this weekend!</body>' + 
    '</note>';

    it("Should return 200 for valid text/xml Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send(xml)
        .set('Content-Type', 'text/xml')
        .expect(200);
    });

    const invalidXML = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<note>' +
    '<to>Tove</to>' +
    '<from>Jani</from>' +
    '<heading>Reminder</heading>' +
    '<body>Don\'t forget me this weekend!</body>';
    
    it("Should return 400 for valid text/xml Content-Type.", async function() {
        await supertest(server)
        .post('')
        .send(invalidXML + "<disrupt>")
        .set('Content-Type', 'text/xml')
        .expect(400, 'Bad Request, unable to parse request body.');
    });
});