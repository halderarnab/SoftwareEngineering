const jasmine = require('jasmine');

const { server } = require('../hw5');

const supertest = require('supertest');

describe("Application Server Tests:", function() {
    let count;
    beforeAll(function () {
        count = 0;
        if (server.listening)
            server.close();
        server.listen(3000);
        console.log("Node.js web server at port 3000 is running...")
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
        .expect(415, 'Unsupported Content-Type: application/pdf. Supported types: application/json');
    });

    it("Should return 405 for PATCH method.", async function() {
        await supertest(server)
        .patch('')
        .expect(405, 'Method not allowed. Please use POST, PUT, GET or DELETE.');
    });

    it("Should return 405 for OPTIONS method.", async function() {
        await supertest(server)
        .options('')
        .expect(405, 'Method not allowed. Please use POST, PUT, GET or DELETE.');
    });

    it("Should return all table records, GET /all.", async function() {
        const expectedJSON = [
            {
                "id": 1,
                "Col1": "1",
                "Col2": "2",
                "Col3": "3",
                "Col4": "4"
            },
            {
                "id": 2,
                "Col1": "2",
                "Col2": "3",
                "Col3": "4",
                "Col4": "5"
            },
            {
                "id": 3,
                "Col1": "3",
                "Col2": "4",
                "Col3": "5",
                "Col4": "6"
            },
            {
                "id": 4,
                "Col1": "4",
                "Col2": "5",
                "Col3": "6",
                "Col4": "7"
            },
            {
                "id": 5,
                "Col1": "5",
                "Col2": "5",
                "Col3": "6",
                "Col4": "7"
            }
        ];

        await supertest(server)
        .get('/all')
        .set('Content-Type', 'application/json')
        .expect(200, expectedJSON);
    });

    it("Should return a row for a given id, GET /id/{no}.", async function() {
        const expectedJSON = {
            "id": 1,
            "Col1": "1",
            "Col2": "2",
            "Col3": "3",
            "Col4": "4"
        };

        await supertest(server)
        .get('/id/1')
        .set('Content-Type', 'application/json')
        .expect(200, expectedJSON);
    });

    it("Should return 404 for invalid GET Url (anything not /all or /id/{no}).", async function() {
        await supertest(server)
        .get('/columns')
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"URL not found."}');
    });

    it("Should return 404 for reading a non-existing id, /id/{no}.", async function() {
        await supertest(server)
        .get('/id/10')
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Id not found."}');
    });

    it("Should create a row using POST, /createRow and then delete that row using DELETE, /deleteRow", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": 6,
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Row created."}');

        await supertest(server)
        .delete('/deleteRow')
        .send('{ "id" : 6 }')
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Id deleted."}');
    });

    it("Should delete a row using DELETE, /deleteRow and then create that row using POST, /createRow.", async function() {
        await supertest(server)
        .delete('/deleteRow')
        .send({
            "id": 5
        })
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Id deleted."}');

        await supertest(server)
        .post('/createRow')
        .send({
            "id": 5,
            "col1": "5",
            "col2": "5",
            "col3": "6",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Row created."}');
    });

    it("Should return 400 for blank id in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": '',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 500 for invalid id in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": 'a',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(500, '{"error":"Internal Server Error."}');
    });

    it("Should return 400 for blank col1 in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": '6',
            "col1": "",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col2 in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col3 in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col4 in body of POST /createRow.", async function() {
        await supertest(server)
        .post('/createRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": ""
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank id in body of DELETE /deleteRow.", async function() {
        await supertest(server)
        .delete('/deleteRow')
        .send({
            "id": '',
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 500 for invalid id in body of DELETE /deleteRow.", async function() {
        await supertest(server)
        .delete('/deleteRow')
        .send({
            "id": 'a',
        })
        .set('Content-Type', 'application/json')
        .expect(500, '{"error":"Internal Server Error."}');
    });

    it("Should return 404 for deleting a non-existing id, /deleteRow.", async function() {
        await supertest(server)
        .delete('/deleteRow')
        .send({
            "id": 6,
        })
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Id not found."}');
    });

    it("Should update a row for a given id using PUT, /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": 5,
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Id updated."}');

        await supertest(server)
        .put('/updateRow')
        .send({
            "id": 5,
            "col1": "5",
            "col2": "5",
            "col3": "6",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(200, '{"message":"Id updated."}');
    });

    it("Should return 400 for blank id in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": '',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 500 for invalid id in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": 'a',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(500, '{"error":"Internal Server Error."}');
    });

    it("Should return 404 for updating a non-existing id, /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": 6,
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Id not found."}');
    });

    it("Should return 400 for blank col1 in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": '6',
            "col1": "",
            "col2": "6",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col2 in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "",
            "col3": "7",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col3 in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "",
            "col4": "7"
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 400 for blank col4 in body of PUT /updateRow.", async function() {
        await supertest(server)
        .put('/updateRow')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": ""
        })
        .set('Content-Type', 'application/json')
        .expect(400, '{"error":"Invalid data."}');
    });

    it("Should return 404 for invalid PUT url /updateRows.", async function() {
        await supertest(server)
        .put('/updateRows')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": ""
        })
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Resource not found."}');
    });

    it("Should return 404 for invalid POST url /createRows.", async function() {
        await supertest(server)
        .post('/createRows')
        .send({
            "id": '6',
            "col1": "6",
            "col2": "6",
            "col3": "7",
            "col4": ""
        })
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Resource not found."}');
    });

    it("Should return 404 for invalid DELETE url /deleteRows.", async function() {
        await supertest(server)
        .delete('/deleteRows')
        .send({
            "id": '6'
        })
        .set('Content-Type', 'application/json')
        .expect(404, '{"error":"Resource not found."}');
    });
});