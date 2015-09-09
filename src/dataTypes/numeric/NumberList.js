import List from "src/dataTypes/lists/List";
import Interval from "src/dataTypes/numeric/Interval";
import { typeOf } from "src/tools/utils/code/ClassUtils";

NumberList.prototype = new List();
NumberList.prototype.constructor = NumberList;

/**
 * @classdesc List structure for Numbers. Provides basic data type for
 * storing and working with numbers in a List.
 *
 * Additional functions that work on NumberList can be found in:
 * <ul>
 *  <li>Operators:   {@link NumberListOperators}</li>
 *  <li>Conversions: {@link NumberListConversions}</li>
 *  <li>Generators: {@link NumberListGenerators}</li>
 * </ul>
 *
 * @constructor
 * @description Creates a new NumberList.
 * @category numbers
 */
function NumberList() {
  var args = [];

  for(var i = 0; i < arguments.length; i++) {
    args[i] = Number(arguments[i]);
  }
  var array = List.apply(this, args);
  array = NumberList.fromArray(array);
  return array;
}
export default NumberList;

/**
 * Creates a new NumberList from a raw array of numbers.
 *
 * @param {Number[]} array The array of numbers to create the list from.
 * @param {Boolean} forceToNumber If true, explicitly converts values in array to Numbers.
 * @return {NumberList} New NumberList containing values in array
 */
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
  result.sqrt = NumberList.prototype.sqrt;
  result.pow = NumberList.prototype.pow;
  result.log = NumberList.prototype.log;
  result.floor = NumberList.prototype.floor;
  result.isEquivalent = NumberList.prototype.isEquivalent;

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

/**
 * Returns minimum value in the List. Null if the NumberList is empty.
 *
 * @return {Number} The min value.
 */
NumberList.prototype.getMin = function() {
  //TODO:store result and retrieve while the NumberList doesn't change;
  if(this.length === 0) return null;
  var i;
  var min = this[0];
  for(i = 1; i < this.length; i++) {
    min = Math.min(min, this[i]);
  }
  return min;
};

/**
 * Returns maximum value in the List. Null if the NumberList is empty.
 *
 * @return {Number} The max value.
 */
NumberList.prototype.getMax = function() {
  //TODO:store result and retrieve while the NumberList doesn't change;
  if(this.length === 0) return null;
  var i;
  var max = this[0];
  var l = this.length;
  for(i = 1; i < l; i++) {
    max = Math.max(max, this[i]);
  }
  return max;
};

/**
 * Finds the range of the values in the NumberList.
 *
 * @return {Number} The difference between the minimum and maximum value in the List.
 */
NumberList.prototype.getAmplitude = function() {
  if(this.length === 0) return 0;
  var min = this[0];
  var max = this[0];
  var l = this.length;
  for(var i = 1; i<l; i++) {
    min = Math.min(min, this[i]);
    max = Math.max(max, this[i]);
  }
  return max - min;
};

/**
 * Provides the min and max values as an {@link Interval}.
 *
 * @return {Interval} Interval containing the min and max values of the List.
 */
NumberList.prototype.getMinMaxInterval = function() { //deprecated?
  return new Interval(this.getMin(), this.getMax());
};

/**
 * Returns the total sum of values in the NumberList.
 *
 * @return {Number} Sum of all values in the List.
 * tags:
 */
NumberList.prototype.getSum = function() {
  if(this.length === 0) return 0;
  var i;
  var sum = this[0];
  var l = this.length;
  for(i = 1; i < l; i++) {
    sum += this[i];
  }
  return sum;
};

/**
 * Returns the product of values in the NumberList.
 *
 * @return {Number} The product of all values in the NumberList.
 * tags:
 */
NumberList.prototype.getProduct = function() {
  if(this.length === 0) return null;
  var i;
  var product = this[0];
  var l = this.length;
  for(i = 1; i < l; i++) {
    product *= this[i];
  }
  return product;
};

/**
 * Builds an Interval with min and max value from the NumberList
 *
 * @return {Interval} with starting value as the min of the NumberList
 * and ending value as the max.
 * tags:
 */
NumberList.prototype.getInterval = function() {
  if(this.length === 0) return null;
  var max = this[0];
  var min = this[0];
  var l = this.length;
  for(var i = 1; i<l; i++) {
    max = Math.max(max, this[i]);
    min = Math.min(min, this[i]);
  }
  var interval = new Interval(min, max);
  return interval;
};


<<<<<<< HEAD:src/dataStructures/numeric/NumberList.js

/**
 * simplifies the numberList either by replacing numbers by its order of magnitude, or by quantiles
 * 
 * @param  {Number} method simplification method:<br>0:significant digits<br>1:number of quantile<br>2:rounded by quantile<br>3:order of magnitude<br>4:rounded by order of magnitude
 * @param  {Number} param different meaning according to choosen method:<br>0:number of significant digits<br>1:number of quantiles<br>2:number of quantiles<br>3:no need of param<br>4:no need of param
 * @return {NumberList} simplified list
 * tags:
 */
NumberList.prototype.getNumbersSimplified = function(method, param) {
  var newList;
  var i, j;

  method = method||0;
  param = param||0;

  newList = new NumberList();
  newList.name = this.name;

  switch(method){
    case 0:
      var power = Math.pow(10, param);
      this.forEach(function(val){
        newList.push(Math.floor(val/power)*power);
      });
      break;
    case 1:
    case 2:
      param = Math.min( param||10, Math.floor(this.length/2) );
      var quantiles = this.getQuantiles(param);
      var val;
      for(i=0; this[i]!==undefined; i++){
        val = this[i];
        if(val<quantiles[0]){
          method==1?newList.push(0):newList.push(quantiles._min);
        } else {
          for(j=0; quantiles[j]!==undefined; j++){
            if( val>=quantiles[j] && (j+1==quantiles.length || val<quantiles[j+1]) ){
              method==1?newList.push(j+1):newList.push(quantiles[j]);
              break;
            }
          }
        }
      }
      if(method==1) newList.name = this.name + " (n quantile)";
      break;
    case 3:
      newList.name = this.name + " (order of magnitude)";
      this.forEach(function(val){
        newList.push(Math.floor( Math.log(val)/Math.log(10) ));
      });
      break;
    case 4:
      this.forEach(function(val){
        newList.push( Math.pow ( 10, Math.floor( Math.log(val)/Math.log(10) ) ) );
      });
      break;
  }

  return newList;
}


/**
 * Builds an {@link Polygon} from the NumberList,
 * using each consecutive pair of values in the numberList as
 * x and y positions.
 *
 * @return {Polygon} Polygon representing the values
 * in the NumberList as x/y coordinates.
 */
NumberList.prototype.toPolygon = function() {
  if(this.length === 0) return null;
  var polygon = new Polygon();
  for(var i = 0; this[i + 1] != null; i += 2) {
    polygon.push(new Point(this[i], this[i + 1]));
  }
  return polygon;
};


/////////statistics

/**
 * Calculates mean of the NumberList.
 *
 * @return {Number} Mean of all values in the List.
 * tags:statistics
 */
NumberList.prototype.getAverage = function() {
  return this.getSum()/this.length;
};

/**
 * Calculates the geometric mean of the NumberList.
 *
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getGeometricMean = function() {
  var s = 0;
  //this.forEach(function(val) {
  var l = this.length;
  for(var i = 0; i<l; i++) {
    s += Math.log(this[i]);
  }
  return Math.pow(Math.E, s / this.length);
};

/**
 * Calculates the norm of the NumberList (treated as a vector).
 *
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getNorm = function() {
  var sq = 0;
  var l = this.length;
  for(var i = 0; i<l; i++) {
    sq += Math.pow(this[i], 2);
  }
  return Math.sqrt(sq);
};

/**
 * Calculates the variance of the NumberList.
 *
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getVariance = function() {
  var sd = 0;
  var average = this.getAverage();
  var l = this.length;
  for(var i = 0; i<l; i++) {
    sd += Math.pow(this[i] - average, 2);
  }
  return sd / this.length;
};

/**
 * Calculates the standard deviation.
 *
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getStandardDeviation = function() {
  return Math.sqrt(this.getVariance());
};

/**
 * Calculates the median of the numberList
 *
 * @return {Number}
 * tags:statistics
 */
NumberList.prototype.getMedian = function() {
  var sorted = this.getSorted(true);
  var prop = (this.length - 1) / 2;
  var entProp = Math.floor(prop);
  var onIndex = prop == entProp;
  return onIndex ? sorted[prop] : (0.5 * sorted[entProp] + 0.5 * sorted[entProp + 1]);
};

/**
 * Builds a partition of n quantiles from the numberList.
 *
 * @param {Number} nQuantiles number of quantiles (the size of the resulting list is nQuantiles-1)
 * @return {NumberList} A number list of the quantiles.
 * tags:statistics
 */
NumberList.prototype.getQuantiles = function(nQuantiles) {//TODO: defines different options for return
  var sorted = this.getSorted(true);
  var prop = this.length / nQuantiles;
  var entProp = Math.floor(prop);
  var onIndex = prop == entProp;
  var quantiles = new NumberList();
  
  for(var i = 0; i < nQuantiles - 1; i++) {
    quantiles[i] = onIndex ? sorted[(i + 1) * prop] : (0.5 * sorted[(i + 1) * entProp] + 0.5 * sorted[(i + 1) * entProp + 1]);
  }

  quantiles._sorted = sorted;
  quantiles._min = sorted[0];
  quantiles._max = sorted[sorted.length-1];

  return quantiles;
};

/////////sorting

/**
 * Returns a new NumberList sorted in either ascending or descending order.
 *
 * @param {Boolean} ascending True if values should be sorted in ascending order.
 * If false, values will be sorted in descending order.
 * @return {NumberList} new sorted NumberList.
 */
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

/**
 * Returns a new NumberList containing the indicies of the values of
 * the original NumberList in sorted order.
 *
 * @param {Boolean} descending If true, values are sorted in descending order.
 * @return {NumberList} NumberList containing the indices of the original NumberList
 * such that accessing the values of the original list at those indices would produce
 * a sorted list.
 * @example
 * var nl = NumberList.fromArray([1,3,2]);
 * var indices = nl.getSortIndexes();
 * indices[0]; // produces 1 as nl[1] == 3.
 */
NumberList.prototype.getSortIndexes = function(descending) {
  if(descending == null) descending = true;

  var pairs = [];
  var newList = new NumberList();
  var l = this.length;

  if(this.length === 0) return newList;

  for(var i = 0; i<l; i++) {
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

/**
 * Returns a new NumberList with the values of
 * the original list multiplied by the input value
 *
 * @param {Number} value The value to multiply each
 * value in the list by.
 * @return {NumberList} New NumberList with values multiplied.
 */
NumberList.prototype.factor = function(value) {
  var i;
  var newNumberList = new NumberList();
  var l = this.length;
  for(i = 0; i < l; i++) {
    newNumberList.push(this[i] * value);
  }
  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * Adds a value or values in a NumberList to the current list.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the sum of the original value and this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the sum of the original value and the
 * value at the same index in the input list.
 *
 * @param {Number|NumberList} object Input value to add to the list.
 * @return {NumberList}
 */
NumberList.prototype.add = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);
  var l = this.length;

  switch(type) {
    case 'number':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] + object;
      }
      break;
    case 'NumberList':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] + object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * Subtracts a value or values in a NumberList from the current list.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the original value minus this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the original value minus the
 * value at the same index in the input list.
 *
 * @param {Number|NumberList} object Input value to subract from the list.
 * @return {NumberList}
 */
NumberList.prototype.subtract = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);
  var l = this.length;

  switch(type) {
    case 'number':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] - object;
      }
      break;
    case 'NumberList':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] - object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * Returns a new NumberList with each value divided by a input value or values in a NumberList.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the original value divided by this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the original value divided by the
 * value at the same index in the input list.
 *
 * @param {Number|NumberList} object Input value to divide by the list.
 * @return {NumberList}
 */
NumberList.prototype.divide = function(object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);
  var l = this.length;

  switch(type) {
    case 'number':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] / object;
      }
      break;
    case 'NumberList':
      for(i = 0; i<l; i++) {
        newNumberList[i] = this[i] / object[i % object.length];
      }
      break;
  }

  newNumberList.name = this.name;
  return newNumberList;
};


/**
 * Returns a new NumberList containing the square root of
 * the values of the current NumberList.
 *
 * @return {NumberList} NumberList with square rooted values.
 */
NumberList.prototype.sqrt = function() {
  var i;
  var newNumberList = new NumberList();
  var l = this.length;

  for(i = 0; i < l; i++) {
    newNumberList.push(Math.sqrt(this[i]));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * Returns a new NumberList containing values raised to the power
 * of the input value.
 *
 * @param {Number} power Power to raise each value by.
 * @return {NumberList} New NumberList.
 */
NumberList.prototype.pow = function(power) {
  var i;
  var newNumberList = new NumberList();
  var l = this.length;
  for(i = 0; i < l; i++) {
    newNumberList.push(Math.pow(this[i], power));
  }
  newNumberList.name = this.name;
  return newNumberList;
};

/**
 * Returns a transformed version of the list with
 * each value in the new list the log of the value
 * in the current list, with an optional constant
 * added to it.
 *
 * @param {Number} add Optional value to add to the log transformed values.
 * Defaults to 0.
 * @return {NumberList}
 */
NumberList.prototype.log = function(add) {
  add = add || 0;

  var i;
  var newNumberList = new NumberList();
  var l = this.length;
  for(i = 0; i<l; i++) {
    newNumberList[i] = Math.log(this[i] + add);
  }
  newNumberList.name = this.name;

  return newNumberList;
};

/**
 * Returns a new NumberList containing the floor values (removing decimals) of
 * the values of the current NumberList.
 *
 * @return {NumberList} NumberList with integer values.
 */
NumberList.prototype.floor = function() {
  var i;
  var newNumberList = new NumberList();
  var l = this.length;
  for(i = 0; i < l; i++) {
    newNumberList.push(Math.floor(this[i]));
  }
  newNumberList.name = this.name;

  return newNumberList;
};

/**
 * @todo write docs
 */
NumberList.prototype.approach = function(destinty, speed) {
  speed = speed || 0.5;

  var i;
  var antispeed = 1 - speed;

  for(i = 0; this[i] != null; i++) {
    this[i] = antispeed * this[i] + speed * destinty[i];
  }
};

/**
 * Returns true if values in the input NumberList are the same
 * as the values in the current list.
 *
 * @param numberList2 Second NumberList to compare.
 * @return {Boolean} True if all values in both lists match.
 */
NumberList.prototype.isEquivalent = function(numberList) {
  var l = this.length;
  if(numberList.length != l) {
    return false;
  }
  for(var i = 0; i<l; i++) {
    if(this[i] != numberList[i]) return false;
  }
  return true;
};

//transform

NumberList.prototype.approach = function(destinty, speed) {
  speed = speed || 0.5;

  var i;
  var antispeed = 1 - speed;
  var l = this.length;

  for(i = 0; i<l; i++) {
    this[i] = antispeed * this[i] + speed * destinty[i];
  }
  return true;
};

///////overriding

/**
 * @todo write docs
 */
NumberList.prototype.clone = function() {
  var newList = NumberList.fromArray(this._slice(), false);
  newList.name = this.name;
  return newList;
};

/**
 * @todo write docs
 */
NumberList.prototype.slice = function() {
  return NumberList.fromArray(this._slice.apply(this, arguments), false);
};
