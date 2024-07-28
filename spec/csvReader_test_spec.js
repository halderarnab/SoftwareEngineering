const jasmine = require('jasmine');

const {  printCSV, evaluateFormula, evaluateSum, extractFormula, calculateFormulaValue } = require('../csvReader');

describe("csvReader Tests:", function() {
    let count;
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
    });

    afterEach(function () {
        console.log("\nFinished executing TC "+ count + ".");
        console.log("---------------------------------------");
    });

    it("File recevied is not a CSV file", function() {
        expect(printCSV("notCSV.txt")).toBe("notCSV.txt is not a CSV file.");        
    });
    
    it("File recevied is a CSV file", function() {
        expect(printCSV("100.csv")).toBe("Successfully Executed.");
    });

    it("File recevied is not a CSV file but file name ends in .csv", function() {
        expect(printCSV("notCSV.csv")).toBe("Exception thrown.");
    });

    it("Evaluate Formula function works", function() {
        expect(evaluateFormula()).toBe("Formula evaluated.");
    });

    it("calculateFormulaValue function works with 'sum'.", function() {
        printCSV("100.csv");
        expect(calculateFormulaValue("=sum(a1:a3)")).toBe(23);
    });

    it("calculateFormulaValue function works with 'average'.", function() {
        printCSV("100.csv");
        expect(calculateFormulaValue("=average(b2:d4)")).toBe(15.666666666666666);
    });

    it("calculateFormulaValue function works with 'count'.", function() {
        printCSV("100.csv");
        expect(calculateFormulaValue("=count(b1:E1)")).toBe(4);
    });

    it("calculateFormulaValue function does not works when the opeartion is not sum, average or count.", function() {
        // printCSV("100.csv");
        expect(calculateFormulaValue("=test(b1:E1)")).toBe("Invalid Operation");
    });

    it("extractFormula function works.", function() {
        const formula = "=sum(A1:A3)";
        const {calc, range} = extractFormula(formula);
        expect(calc).toBe("sum");
        expect(range).toEqual(["A1", "A3"]);
    });

    it("extractFormula function returns error on invalid input.", function() {
        const formula = "sum(A1:A3)";
        expect(extractFormula(formula)).toBe("Error: Invalid formula entered.");
    });

    it("evaluateSum function works.", function() {
        printCSV("100.csv");
        const range = ["A1", "A3"] ;
        const { sum, count } = evaluateSum(range);
        expect(sum).toBe(23);
        expect(count).toBe(3);
    });

    it("evaluateSum function works with inverse input.", function() {
        printCSV("100.csv");
        const range = ["A3", "D1"] ;
        const { sum, count } = evaluateSum(range);
        expect(sum).toBe(110);
        expect(count).toBe(12);
    });
});