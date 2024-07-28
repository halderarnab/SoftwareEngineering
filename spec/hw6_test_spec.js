const jasmine = require('jasmine');

const { server, ping } = require('../hw6_A');
const { callURL } = require('../hw6_B');

const supertest = require('supertest');

describe("Application Server Tests:", function () {
    let count;
    beforeAll(function () {
        count = 0;
        if (server.listening)
            server.close();
        server.listen(8080);
        console.log("Node.js web server at port 8080 is running...")
        console.log("\n=====================Executing Test Cases============================");
    });

    afterAll(function () {
        console.log("\n======================Execution Finished=============================");
        server.close();
    });

    beforeEach(function () {
        count++;
        console.log("\n---------------------------------------");
        console.log("Executing TC " + count + ".");
    });

    afterEach(function () {
        console.log("\nFinished executing TC " + count + ".");
        console.log("---------------------------------------");
    });

    it("Should return 415 for unsupported Content-Type.", async function () {
        await supertest(server)
            .post('')
            .send('Some Text')
            .set('Content-Type', 'application/pdf')
            .expect(415, 'Unsupported Content-Type: application/pdf. Supported types: text/plain');
    });

    it("Should return 405 for GET method.", async function () {
        await supertest(server)
            .get('')
            .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for PUT method.", async function () {
        await supertest(server)
            .put('')
            .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for DELETE method.", async function () {
        await supertest(server)
            .delete('')
            .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for PATCH method.", async function () {
        await supertest(server)
            .patch('')
            .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 405 for OPTIONS method.", async function () {
        await supertest(server)
            .options('')
            .expect(405, 'Method not allowed. Please use POST.');
    });

    it("Should return 200 for text/plain Content-Type.", async function () {
        await supertest(server)
            .post('')
            .send('This is a sample plain text.')
            .set('Content-Type', 'text/plain')
            .expect(200);
    });

    it("ping() function works for server in India.", async function () {
        ping("http://rknec.edu/");
    });

    it("ping() function works for google.com.", async function () {
        ping("https://google.com/");
    });

    it("ping() function works for server in Japan.", async function () {
        ping("https://www.locaping.com/result/9aWecPh7");
    });

    it("ping() function works for server in Spain.", async function () {
        ping("https://www.locaping.com/result/LZ0MsxvQ");
    });

    it("callURL() function works.", async function () {
        callURL("http://localhost:8080/", "This is not it.");
        callURL("http://localhost:8080/", "This is it.");
        callURL("http://localhost:8080/", "Why is this it.");
        callURL("http://localhost:8080/", "Bye Bye.");
    });
});