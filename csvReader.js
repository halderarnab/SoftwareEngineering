"use strict";

const style = 'font-family: monospace; font-style: italic; font-weight: bold; font-size: 2em;'

const fs = require('fs');

var data;

//Function to read and print CSV file.
function printCSV(fileName) {
  if(fileName.toLowerCase().endsWith(".csv")) {
    try {
      data = fs.readFileSync(fileName, 'utf8');
      //Split "data" on new line ("\n"), these are the rows of the csv file.
      const row = data.split("\n");
      //for loop to iterate over rows.
      for(let i = 0; i < row.length; i++) {
        //Split "row" on comma (","), these are the columns of the i th row.
        const col = row[i].split(",");
        //tmp - string variable to store the formatted row data.
        let tmp = "";
        //for loop to iterate over columns of row i.
        for(let j = 0; j < col.length; j++) {
          //Formatting row data using the delimiter tab ("\t").
          tmp += col[j] + "\t";
        }
        console.log("%c" + tmp, style);
      }
      // console.log("\n%c" + data, style);
    } catch (err) {
      console.error(err);
      return "Exception thrown.";
    }
    return "Successfully Executed.";
  }
  else {
    console.log(fileName + " is not a CSV file.");
    return fileName + " is not a CSV file.";
  }
}

//Function to input the formula from the user.
function evaluateFormula() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question(`Enter the formula: `, formula => {
    readline.close();
    calculateFormulaValue(formula);
  });
  return "Formula evaluated.";
}

function calculateFormulaValue(formula) {
  //Extracts the formula.
  const {calc, range} = extractFormula(formula);
  switch(calc.toUpperCase()) {
    case "SUM":
      const { sum } = evaluateSum(range);
      console.log("SUM: " + sum);
      return sum;
      break;
    
    case "AVERAGE":
      const { sum: sum1, count } = evaluateSum(range);
      console.log("AVERAGE: " + sum1/count);
      return sum1/count;
      break;

    case "COUNT":
      const { count: count1 } = evaluateSum(range);
      console.log("COUNT: " + count1);
      return count1;
      break;
    
    default:
      console.log("Invalid Operation: " + calc.toUpperCase());
      return "Invalid Operation";
  }
  // return "Value calculated";
}

function extractFormula(formula) {
  //calc stores the operation (sum, average, count).
  //range store the range (A1:D3, D4:A2, a3:A1, b2:b6).
  let calc = "", range = [];
  if(formula.startsWith('=')) {
    //Splitting the formula first on '=' then on '('. SUM
    calc = formula.split('=').pop().split('(')[0];
    //Splitting the formula first on '(', then on ')' and then on ':'. ['A1','D3"]
    range = formula.split('(').pop().split(')')[0].split(':');
  }
  else {
    console.error("Invalid formula received! Valid formula starts with '=', Ex - 'SUM(A1:A10).");
    return "Error: Invalid formula entered."
  }
  return {calc, range};
}

function evaluateSum(range) {
  //Variables to store sum and count.
  var sum = 0, count = 0;
  //Converting the uppercase character to number value and substracting 
  //from A's number value to find column indexes.
  var col1 = range[0][0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  var col2 = range[1][0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  //Extracting row values from the range, 'A13'.slice(1) = '13'.
  var row1 = range[0].slice(1);
  var row2 = range[1].slice(1);
  
  //Conditions to find mininum and assigning accoordingly.
  //Allows inverse calculations like =sum(a3:a1), =average(d4:a2)
  if(col1 > col2) {
    const tmp = col1;
    col1 = col2;
    col2 = tmp;
  }

  if(row1 > row2) {
    const tmp = row1;
    row1 = row2;
    row2= tmp;
  }
  //Splitting on new line.
  const rows = data.split("\n");
  for(var i = row1 - 1; i < row2; i++) {
    //splitting on ','.
    const cols = rows[i].split(",");
    //Calculating sum and counting the number of cells added.
    for(var j = col1; j <= col2; j++) {
      sum += Number(cols[j]);
      count++;
    }
  }
  return {sum, count};
}

// let fileName = "100.csv"; //Name of the file, eg - TestFile.csv

let fileName = process.argv[process.argv.length - 1]; //For passing the file name via command line, eg - TestFile.csv
//node csvReader.js 100.csv
printCSV(fileName);
evaluateFormula();

module.exports = { printCSV, evaluateFormula, evaluateSum, extractFormula, calculateFormulaValue };