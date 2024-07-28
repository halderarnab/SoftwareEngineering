class ArrayStats extends Array {
  average() {
    const averageValue = 
    this.reduce((a, b) => a + b, 0) / this.length;
    Object.defineProperty(this, "avgVal", {
      value: averageValue, // add new property of the array
      writable: false, // set avgVal as immutable
    });
    return averageValue;
  }

  stdev() {
    this.sum; 
    if(this.length != 0){
        this.sum = 0;
    }
    const varianceVal = this.map(this.mapperVariance, this);
    const stdevValue = Math.sqrt(this.sum / (this.length - 1));
    Object.defineProperty(this, "sdevVal", {
      value: stdevValue, // add new property of the array
      writable: false,
    });
    return stdevValue;
  }

  mapperVariance(value) {
    this.sum += (value - this.avgVal) ** 2;
    return this.sum;
  }
}
let myArray = new ArrayStats(12,6,30,8,20,22,29,30,12,6,33,81,21,2,19,13);
console.log(myArray.average());
console.log(myArray.stdev());

module.exports = ArrayStats;
