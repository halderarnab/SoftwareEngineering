const jasmine = require('jasmine');

const ArrayStats = require('../hw3');

describe("Test for class ArrayStats:", function() {
    let count, arr;
    beforeAll(function () {
        count = 0;
        console.log("\n=====================Executing Test Cases============================");
    });

    afterAll(function () {
        console.log("\n======================Execution Finished=============================");
    });

    beforeEach(function () {
        count++;
        console.log("\n---------------------------------------");
        console.log("Executing TC "+ count + ".");
        //Initialize arr with test data.
        arr = new ArrayStats(1, 2, 3, 4);
    });

    afterEach(function () {
        console.log("\nFinished executing TC "+ count + ".");
        console.log("---------------------------------------");
    });

    it("Should calculate the average of the array", function() {
        //Average of [1, 2, 3, 4] = 2.5.
        expect(arr.average()).toBe(2.5);
        expect(arr.avgVal).toBe(2.5);   
    });

    it("Should calculate the standard deviation of the array", function() {
        arr.average();
        //Standard Deviation of [1, 2, 3, 4] = 1.2909944487358056. 
        //Using 3 for precision up to 3 digits after the decimal point.
        expect(arr.stdev()).toBeCloseTo(1.2909, 3);
        expect(arr.sdevVal).toBeCloseTo(1.2909, 3);
    });

    it("Should handle empty array for average and standard deviation", function() {
        arr = new ArrayStats(); // Empty array
        //Average of an empty array should be NaN.
        expect(arr.average()).toBeNaN();
        expect(arr.avgVal).toBeNaN();
        //Standard deviation of an empty array should be NaN.
        expect(arr.stdev()).toBeNaN(); 
        expect(arr.sdevVal).toBeNaN();
    });

    it("Should handle an array with a single element", function() {
        //Array with a single element.
        arr = new ArrayStats([7]);
        //Average of an empty array should be NaN.
        expect(arr.average()).toBe(7);
        expect(arr.avgVal).toBe(7);
        //Standard deviation of an empty array should be NaN.
        expect(arr.stdev()).toBeNaN();
        expect(arr.sdevVal).toBeNaN();
    });

    it("Should successfully run mapperVariance function", function() {
        expect(arr.average()).toBe(2.5);
        expect(arr.sum).toBeUndefined();
        arr.sum = 0;
        expect(arr.mapperVariance(1)).toBe(2.25);
    });
});