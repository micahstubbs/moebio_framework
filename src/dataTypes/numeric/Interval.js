import DataModel from "src/dataTypes/DataModel";
import Point from "src/dataTypes/geometry/Point";

Interval.prototype = new Point();
Interval.prototype.constructor = Interval;

/**
 * @classdesc Provide reasoning around numeric intervals.
 * Intervals have a start and end value.
 *
 * @constructor
 * @param {Number} x Interval's start value.
 * @param {Number} y Interval's end value.
 * @description Creates a new Interval.
 * @category numbers
 */
function Interval(x, y) {
  DataModel.apply(this, arguments);
  this.x = Number(x);
  this.y = Number(y);
  this.type = "Interval";
}
export default Interval;

/**
 * Finds the minimum value of the Interval.
 *
 * @return {Number} the minimum value in the interval
 */
Interval.prototype.getMin = function() {
  return Math.min(this.x, this.y);
};

/**
 * Finds the maximum value of the Interval.
 *
 * @return {Number} the max value in the interval
 */
Interval.prototype.getMax = function() {
  return Math.max(this.x, this.y);
};

/**
 * Finds the range between the min and max of the Interval.
 *
 * @return {Number} the absolute difference between the starting and ending values.
 */
Interval.prototype.getAmplitude = function() {
  return Math.abs(this.y - this.x);
};

/**
 * Finds the range between the min and max of the Interval.
 * If the starting value of the Interval is less then the ending value,
 * this will return a negative value.
 *
 * @return {Number} the difference between the starting and ending values.
 */
Interval.prototype.getSignedAmplitude = function() {
  return this.y - this.x;
};

/**
 * Returns the middle value between the min and max of the Interval.
 *
 * @return {Number} the difference between the starting and ending values.
*/
Interval.prototype.getMiddle = function() {
  return (this.x + this.y)*0.5;
};

/**
 * Returns a random value within the min and max of the Interval.
 *
 * @return {Number} A random value.
*/
Interval.prototype.getRandom = function() {
  return this.x + (this.y - this.x)*Math.random();
};

/**
 * Returns 1 if end value is greater then start value, and -1 if that is reversed.
 * If min and max values are equal, returns 0.
 *
 * @return {Number} The sign of the Interval.
*/
Interval.prototype.getSign = function() {
  if(this.x == this.y) return 0;
  return Math.abs(this.y - this.x)/(this.y - this.x);
};

/**
 * Returns a new Interval with its start and stop values scaled by the input value.
 *
 * @param {Number} value Value to scale Interval by.
 * @return {Interval} The scaled Interval.
 */
Interval.prototype.getScaled = function(value) {
  var midAmp = 0.5 * (this.y - this.x);
  var middle = (this.x + this.y) * 0.5;
  return new Interval(middle - midAmp * value, middle + midAmp * value);
};

/**
 * Returns a new Interval with its start and stop values scaled by the input value,
 * but first pulling out a given proportion of the Interval to Scale.
 *
 * @param {Number} value Value to scale Interval by.
 * @param {Number} proportion of Interval to keep in scaling.
 * @return {Interval} The scaled Interval.
*/
Interval.prototype.getScaledFromProportion = function(value, proportion) {
  var antiP = 1 - proportion;
  var amp0 = proportion * (this.y - this.x);
  var amp1 = antiP * (this.y - this.x);
  var middle = antiP * this.x + proportion * this.y;
  return new Interval(middle - amp0 * value, middle + amp1 * value);
};

/**
* Adds provided value to the start and stop values of the Interval.
* Returns the new Interval
* @param {Number} Number to add to each side of the Interval.
* @return {Interval} New added Interval.
*/
Interval.prototype.add = function(value) {
  return new Interval(this.x + value, this.y + value);
};

/**
* Swap start and stop values of this Interval.
*/
Interval.prototype.invert = function() {
  var swap = this.x;
  this.x = this.y;
  this.y = swap;
};

/**
 * Returns a value in interval range
 * 0 -> min
 * 1 -> max
 * @param value between 0 and 1 (to obtain values between min and max)
 *
 */
Interval.prototype.getInterpolatedValue = function(value) {
  //TODO: should this be unsigned amplitude?
  return value * Number(this.getSignedAmplitude()) + this.x;
};

/**
* Returns a value between 0 and 1 representing the normalized input value in the Interval.
* @param {Number} value Number to inverse interpolate.
* @return {Number} Inverse interpolation of input for this Interval.
*/
Interval.prototype.getInverseInterpolatedValue = function(value) {
  return(value - this.x) / this.getSignedAmplitude();
};

/**
* Interpolates each value in a given NumberList and provides a new NumberList
* containing the interpolated values.
*
* @param {NumberList}  numberList NumberList to interpolate.
* @return {NumberList} NumberList of interpolated values.
*/
Interval.prototype.getInterpolatedValues = function(numberList) {
  var newNumberList = [];
  var nElements = numberList.length;
  for(var i = 0; i < nElements; i++) {
    newNumberList.push(this.getInterpolatedValue(numberList[i]));
  }
  return newNumberList;
};

/**
* Inverse Interpolate each value in a given NumberList and provides a new NumberList
* containing these values.
*
* @param {NumberList}  numberList NumberList to inverse interpolate.
* @return {NumberList} NumberList of inverse interpolated values.
*/
Interval.prototype.getInverseInterpolatedValues = function(numberList) {
  var newNumberList = [];
  var nElements = numberList.length;
  for(var i = 0; i < nElements; i++) {
    newNumberList.push(this.getInverseInterpolatedValue(numberList[i]));
  }
  return newNumberList;
};

/**
* @todo write docs
*/
Interval.prototype.intersect = function(interval) {
  return new Interval(Math.max(this.x, interval.x), Math.min(this.y, interval.y));
};

/**
 * Create a new interval with the same proporties values
 *
 * @return {Interval} Copied Interval.
 */
Interval.prototype.clone = function() {
  var newInterval = new Interval(this.x, this.y);
  newInterval.name = name;
  return newInterval;
};

/**
 * Indicates if a number is included in the Interval.
 *
 * @param value Number to test.
 * @return {Boolean} True if the value is inside the Interval.
 */
Interval.prototype.contains = function(value) {
  if(this.y > this.x) return value >= this.x && value <= this.y;
  return value >= this.y && value <= this.y;
};

/**
 * Indicates if provided interval contains the same values.
 *
 * @param interval Interval to compare with.
 * @return {Boolean} true if the are the same.
 */
Interval.prototype.isEquivalent = function(interval) {
  return this.x == interval.x && this.y == interval.y;
};

/**
 * Provides a String representation of the Interval.
 *
 * @return {String} String representation.
 *
 */
Interval.prototype.toString = function() {
  return "Interval[x:" + this.x + "| y:" + this.y + "| amplitude:" + this.getAmplitude() + "]";
};
