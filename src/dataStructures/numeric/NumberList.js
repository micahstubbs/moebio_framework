import List from "src/dataStructures/lists/List";
import StringList from "src/dataStructures/strings/StringList";
import Interval from "src/dataStructures/numeric/Interval";
import ListGenerators from "src/operators/lists/ListGenerators";
import Polygon from "src/dataStructures/geometry/Polygon";
import Point from "src/dataStructures/geometry/Point";
import { typeOf } from "src/tools/utils/code/ClassUtils";

NumberList.prototype = new List();
NumberList.prototype.constructor = NumberList;

/**
 * @classdesc List structure for Numbers.
 *
 * @constructor
 * @description Creates a new NumberList.
 * @category numbers
 */
function NumberList() {
  var args = [];

  for(var i = 0; i < arguments.length; i++) {
    arguments[i] = Number(arguments[i]);
  }
  var array = List.apply(this, arguments);
  array = NumberList.fromArray(array);
  //
  return array;
}
export default NumberList;

NumberList.fromArray = function(array, forceToNumber) {
  forceToNumber = forceToNumber == null ? true : forceToNumber;

  var result = List.fromArray(array);

  if(forceToNumber) {
    for(var i = 0; i < result.length; i++) {
      result[i] = Number(result[i]);
    }
  }

  result.type = "NumberList";

  //assign methods to array:
  result.unit = NumberList.prototype.unit;
  result.tenPower = NumberList.prototype.tenPower;
  result.getMin = NumberList.prototype.getMin;
  result.getMax = NumberList.prototype.getMax;
  result.getAmplitude = NumberList.prototype.getAmplitude;
  result.getMinMaxInterval = NumberList.prototype.getMinMaxInterval;
  result.getSum = NumberList.prototype.getSum;
  result.getProduct = NumberList.prototype.getProduct;
  result.getInterval = NumberList.prototype.getInterval;
  result.getNormalized = NumberList.prototype.getNormalized;
  result.getNormalizedToMax = NumberList.prototype.getNormalizedToMax;
  result.getNormalizedToSum = NumberList.prototype.getNormalizedToSum;
  result.toPolygon = NumberList.prototype.toPolygon;

  //statistics
  result.getAverage = NumberList.prototype.getAverage;
  result.getNorm = NumberList.prototype.getNorm;
  result.getStandardDeviation = NumberList.prototype.getStandardDeviation;
  result.getVariance = NumberList.prototype.getVariance;
  result.getMedian = NumberList.prototype.getMedian;
  result.getQuantiles = NumberList.prototype.getQuantiles;

  //sorting
  result.getSorted = NumberList.prototype.getSorted;
  result.getSortIndexes = NumberList.prototype.getSortIndexes;
  result.factor = NumberList.prototype.factor;
  result.add = NumberList.prototype.add;
  result.subtract = NumberList.prototype.subtract;
  result.divide = NumberList.prototype.divide;
  result.dotProduct = NumberList.prototype.dotProduct;
  result.distance = NumberList.prototype.distance;
  result.sqrt = NumberList.prototype.sqrt;
  result.pow = NumberList.prototype.pow;
  result.log = NumberList.prototype.log;
  result.isEquivalent = NumberList.prototype.isEquivalent;
  result.toStringList = NumberList.prototype.toStringList;

  //transform
  result.approach = NumberList.prototype.approach;

  //override
  result.clone = NumberList.prototype.clone;
  result._slice = Array.prototype.slice;
  result.slice = NumberList.prototype.slice;

  return result;
};
NumberList.prototype.unit = "";
NumberList.prototype.tenPower = 0;

NumberList.prototype.getMin = function() { //TODO:store result and retrieve while the NumberList doesn't change;
  if(this.length == 0) return null;
  var i;
  var min = this[0];
  for(i = 1; i < this.length; i++) {
    min = Math.min(min, this[i]);
  }
  return min;
};

NumberList.prototype.getMax = function() { //TODO:store result and retrieve while the NumberList doesn't change;
  if(this.length == 0) return null;
  var i;
  var max = this[0];
  for(i = 1; i < this.length; i++) {
    max = Math.max(max, this[i]);
  }
  return max;
};

NumberList.prototype.getAmplitude = function() {
  if(this.length == 0) return 0;
  var min = this[0];
  var max = this[0];
  for(var i = 1; this[i] != null; i++) {
    min = Math.min(min, this[i]);
    max = Math.max(max, this[i]);
  }
  return max - min;
};

NumberList.prototype.getMinMaxInterval = function() { //deprecated?
  return new Interval(this.getMin(), this.getMax());
};

/**
 * returns the sum of values in the numberList
 * @return {Number}
 * tags:
 */
NumberList.prototype.getSum = function() {
  if(this.length == 0) return 0;
  var i;
  var sum = this[0];
  for(i = 1; i < this.length; i++) {
    sum += this[i];
  }
  return sum;
};

/**
 * return the product of values in the numberList
 * @return {Number}
 * tags:
 */
NumberList.prototype.getProduct = function() {
  if(this.length == 0) return null;
  var i;
  var product = this[0];
  for(i = 1; i < this.length; i++) {
    product *= this[i];
  }
  return product;
};

/**
 * returns a NumberList normalized to the sum
 * @param {Number} factor optional
 * @return {NumberList}
 * tags:
 */
NumberList.prototype.getNormalizedToSum = function(factor, sum) {
  factor = factor == null ? 1 : factor;
  var newNumberList = new NumberList();
  newNumberList.name = this.name;
  if(this.length == 0) return newNumberList;
  var i;
  var sum = sum == null ? this.getSum() : sum;
  if(sum == 0) return this.clone();

  for(i = 0; i < this.length; i++) {
    newNumberList.push(factor * this[i] / sum);
  }
  return newNumberList;
};

/**
 * returns a numberList normalized to min-max interval
 * @param {Number} factor optional
 * @return {NumberList}
 * tags:
 */
NumberList.prototype.getNormalized = function(factor) {
  factor = factor == null ? 1 : factor;

  if(this.length == 0) return null;

  var i;
  var interval = this.getMinMaxInterval();
  var a = interval.getAmplitude();
  var newNumberList = new NumberList();
  for(i = 0; i < this.length; i++) {
    newNumberList.push(factor * ((this[i] - interval.x) / a));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * returns a numberList normalized to Max
 * @param {Number} factor optional
 * @return {NumberList}
 * tags:
 */
NumberList.prototype.getNormalizedToMax = function(factor) {
  factor = factor == null ? 1 : factor;

  if(this.length == 0) return null;

  var max = this.getMax();
  if(max == 0) {
    max = this.getMin();
    if(max == 0) return ListGenerators.createListWithSameElement(this.length, 0);
  }
  var newNumberList = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    newNumberList.push(factor * (this[i] / max));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * builds an Interval witn min and max value from the numberList
 * @return {Interval}
 * tags:
 */
NumberList.prototype.getInterval = function() {
  if(this.length == 0) return null;
  var max = this[0];
  var min = this[0];
  for(var i = 1; this[i] != null; i++) {
    max = Math.max(max, this[i]);
    min = Math.min(min, this[i]);
  }
  var interval = new Interval(min, max);
  return interval;
};


NumberList.prototype.toPolygon = function() {
  if(this.length == 0) return null;
  var polygon = new Polygon();
  for(var i = 0; this[i + 1] != null; i += 2) {
    polygon.push(new Point(this[i], this[i + 1]));
  }
  return polygon;
};




/////////statistics

/**
 * calculates mean of numberList
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getAverage = function() {
  return this.getSum() / this.length;
};

/**
 * calculates geometric mean of numberList
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getGeometricMean = function() {
  var s = 0;
  this.forEach(function(val) {
    s += Math.log(val);
  });
  return Math.pow(Math.E, s / this.length);
};

/**
 * calculates de norm of the numberList (treated as a vector)
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getNorm = function() {
  var sq = 0;
  for(var i = 0; this[i] != null; i++) {
    sq += Math.pow(this[i], 2);
  }
  return Math.sqrt(sq);
};

/**
 * calculates the variance of the numberList
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getVariance = function() {
  var sd = 0;
  var average = this.getAverage();
  for(var i = 0; this[i] != null; i++) {
    sd += Math.pow(this[i] - average, 2);
  }
  return sd / this.length;
};

/**
 * calculates the standard deviation
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getStandardDeviation = function() {
  return Math.sqrt(this.getVariance());
};

/**
 * calculates the median of the numberList
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getMedian = function(nQuantiles) {
  var sorted = this.getSorted(true);
  var prop = (this.length - 1) / 2;
  var entProp = Math.floor(prop);
  var onIndex = prop == entProp;
  var quantiles = new NumberList();
  return onIndex ? sorted[prop] : (0.5 * sorted[entProp] + 0.5 * sorted[entProp + 1]);
};

/**
 * builds a partition of n quantiles from the numberList
 * @param {Number} nQuantiles number of quantiles
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getQuantiles = function(nQuantiles) {
  var sorted = this.getSorted(true);

  var prop = this.length / nQuantiles;
  var entProp = Math.floor(prop);
  var onIndex = prop == entProp;
  var quantiles = new NumberList();
  for(var i = 0; i < nQuantiles - 1; i++) {
    quantiles[i] = onIndex ? sorted[(i + 1) * prop] : (0.5 * sorted[(i + 1) * entProp] + 0.5 * sorted[(i + 1) * entProp + 1]);
  }
  return quantiles;
};



/////////sorting

NumberList.prototype.getSorted = function(ascending) {
  ascending = ascending == null ? true : ascending;

  if(ascending) {
    return NumberList.fromArray(this.slice().sort(function(a, b) {
      return a - b;
    }), false);
  }
  return NumberList.fromArray(this.slice().sort(function(a, b) {
    return b - a;
  }), false);
};

NumberList.prototype.getSortIndexes = function(descending) {
  if(descending == null) descending = true;

  var pairs = [];
  var newList = new NumberList();

  if(this.length == 0) return newList;

  for(var i = 0; this[i] != null; i++) {
    pairs.push([i, this[i]]);
  }

  if(descending) {
    pairs.sort(function(a, b) {
      if(a[1] < b[1]) return 1;
      return -1;
    });
  } else {
    pairs.sort(function(a, b) {
      if(a[1] < b[1]) return -1;
      return 1;
    });
  }

  for(i = 0; pairs[i] != null; i++) {
    newList.push(pairs[i][0]);
  }
  newList.name = this.name;
  return newList;
};

NumberList.prototype.factor = function(value) {
  var i;
  var newNumberList = new NumberList();
  for(i = 0; i < this.length; i++) {
    newNumberList.push(this[i] * value);
  }
  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.add = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] + object;
      }
      break;
    case 'NumberList':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] + object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.subtract = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] - object;
      }
      break;
    case 'NumberList':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] - object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.divide = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] / object;
      }
      break;
    case 'NumberList':
      for(i = 0; this[i] != null; i++) {
        newNumberList[i] = this[i] / object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.sqrt = function() {
  var i;
  var newNumberList = new NumberList();
  for(i = 0; i < this.length; i++) {
    newNumberList.push(Math.sqrt(this[i]));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.pow = function(power) {
  var i;
  var newNumberList = new NumberList();
  for(i = 0; i < this.length; i++) {
    newNumberList.push(Math.pow(this[i], power));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

NumberList.prototype.log = function(add) {
  add = add || 0;

  var i;
  var newNumberList = new NumberList();
  for(i = 0; this[i] != null; i++) {
    newNumberList[i] = Math.log(this[i] + add);
  }
  newNumberList.name = this.name;

  return newNumberList;
};

NumberList.prototype.dotProduct = function(numberList) {
  var sum = 0;
  var i;
  var nElements = Math.min(this.length, numberList.length);
  for(i = 0; i < nElements; i++) {
    sum += this[i] * numberList[i];
  }
  return sum;
};

/**
 * calculates Euclidean distance between two numberLists
 * @param  {NumberList} numberList
 * @return {Number}
 * tags:
 */
NumberList.prototype.distance = function(numberList) {
  var sum = 0;
  var i;
  var nElements = Math.min(this.length, numberList.length);
  for(i = 0; i < nElements; i++) {
    sum += Math.pow(this[i] - numberList[i], 2);
  }
  return Math.sqrt(sum);
};

NumberList.prototype.isEquivalent = function(numberList) {
  for(i = 0; this[i] != null; i++) {
    if(this[i] != numberList[i]) return false;
  }
  return true;
};

NumberList.prototype.toStringList = function() {
  var i;
  var stringList = new StringList();
  for(i = 0; this[i] != null; i++) {
    stringList[i] = String(this[i]);
  }
  stringList.name = this.name;
  return stringList;
};


//transform

NumberList.prototype.approach = function(destinty, speed) {
  speed = speed || 0.5;

  var i;
  var antispeed = 1 - speed;

  for(i = 0; this[i] != null; i++) {
    this[i] = antispeed * this[i] + speed * destinty[i];
  }
};


///////overriding

NumberList.prototype.clone = function() {
  var newList = NumberList.fromArray(this._slice(), false);
  newList.name = this.name;
  return newList;
};

NumberList.prototype.slice = function() {
  return NumberList.fromArray(this._slice.apply(this, arguments), false);
};
