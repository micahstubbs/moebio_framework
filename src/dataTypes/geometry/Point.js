import DataModel from "src/dataTypes/DataModel";

Point.prototype = new DataModel();
Point.prototype.constructor = Point;

/**
 * @classdesc Represents a 2D point in space.
 *
 * @description Creates a new Point
 * @param {Number} x
 * @param {Number} y
 * @constructor
 * @category geometry
 */
function Point(x, y) {
  DataModel.apply(this, arguments);
  this.type = "Point";
  this.x = Number(x) || 0;
  this.y = Number(y) || 0;
}
export default Point;

/**
* Returns the {@link https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm|Euclidean norm} of the Point.
*/
Point.prototype.getNorm = function() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

/**
* Returns a Number between -π and π representing the angle theta of the Point.
* Uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2|atan2}.
* @return {Number} Angle of Point.
*/
Point.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};

/**
* Returns a new Point scaled by the input factor k. If k is a Number, the x and y
* are scaled by that number. If k is a Point, then the x and y of the two points
* are multiplied.
* @param {Number|Point} k Factor to scale by.
* @return {Point} New scaled Point.
*/
Point.prototype.factor = function(k) {
  if(k >= 0 || k < 0) return new Point(this.x * k, this.y * k);
  if(k.type != null && k.type == 'Point') return new Point(this.x * k.x, this.y * k.y);
};

/**
* Normalize x and y values of the point by the Point's Euclidean Norm.
* @return {Point} Normalized Point.
*/
Point.prototype.normalize = function() {
  var norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  return new Point(this.x / norm, this.y / norm);
};

/**
* Normalize x and y values of the point by the Point's Euclidean Norm and then
* scale them by the input factor k.
* @param {Number} k Factor to scale by.
* @return {Point} Normalized Point.
*/
Point.prototype.normalizeToValue = function(k) {
  var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  return new Point(this.x * factor, this.y * factor);
};

/**
* Subtracts given Point from this Point.
* @param {Point} point The point to subtract
* @return {Point} New subtracted Point.
*/
Point.prototype.subtract = function(point) {
  return new Point(this.x - point.x, this.y - point.y);
};

/**
* Adds given Point to this Point.
* @param {Point} point The point to add
* @return {Point} New added Point.
*/
Point.prototype.add = function(point) {
  return new Point(point.x + this.x, point.y + this.y);
};

/**
* Adds x and y values to this Point
* @param {Number} x X value to add
* @param {Number} y Y value to add
* @return {Point} New Point with added values.
*/
Point.prototype.addCoordinates = function(x, y) {
  return new Point(x + this.x, y + this.y);
};

/**
* Provides the Euclidean distance between this Point and another Point.
* @param {Point} point The point to provide distance to.
* @return {Number} Distance between two points.
*/
Point.prototype.distanceToPoint = function(point) {
  return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
};

/**
* Provides a Euclidean-like distance without square-rooting the result
* between this Point and another Point.
* @param {Point} point The point to provide distance to.
* @return {Number} Distance squared between two points.
*/
Point.prototype.distanceToPointSquared = function(point) {
  return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
};

/**
* Returns a Number between -π and π representing the angle theta between this Point
* and another Point
* Uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2|atan2}.
* @param {Point} point The point to provide angle from.
* @return {Number} Angle of Point.
*/
Point.prototype.angleToPoint = function(point) {
  return Math.atan2(point.y - this.y, point.x - this.x);
};

/**
* Creates a new Point who's x and y values are added to by the factor multiplied
*  by the difference between the current Point and the provided Point.
* @param {Point} point Point to find difference between current point of
* @return {Point} Expanded Point.
*/
Point.prototype.expandFromPoint = function(point, factor) {
  return new Point(point.x + factor * (this.x - point.x), point.y + factor * (this.y - point.y));
};

/**
* Creates a new Point who's x and y values are multiplied by the difference
* between the current Point and the provided Point. The factor value is added
* to both x and y of this new Point.
* @param {Point} point Point to find difference between current point of
* @return {Point} Expanded Point.
*/
Point.prototype.interpolate = function(point, t) {
  return new Point((1 - t) * this.x + t * point.x, (1 - t) * this.y + t * point.y);
};

/**
* Crosses the x and y values.
* Returns the value of this Point's x multiplied by the provided Point's y value,
* subtracted by the provided Point's y value multiplied by this Point's x value.
* @param {Point} point Point to cross
* @return {Number} Crossed value.
*/
Point.prototype.cross = function(point) {
  return this.x * point.y - this.y * point.x;
};

/**
* Calculates the dot product between two points.
* @param {Point} point Point to compute dot product with
* @return {Number} Dot Product
*/
Point.prototype.dot = function(point) {
  return this.x * point.x + this.y * point.y;
};

/**
* Rotates a Point around a given center
* @param {Number} angle Amount to rotate by
* @param {Number} center to rotate around. If not provided, rotate around 0,0
* @return {Point} New Point the result of this Point rotated by angle around center.
*/
Point.prototype.getRotated = function(angle, center) {
  center = center == null ? new Point() : center;

  return new Point(Math.cos(angle) * (this.x - center.x) - Math.sin(angle) * (this.y - center.y) + center.x, Math.sin(angle) * (this.x - center.x) + Math.cos(angle) * (this.y - center.y) + center.y);
};

/**
* Copies this Point.
* @return {Point} Copy of this point
*/
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
* Provides a string representation of the Point.
* @return {String} string output
*/
Point.prototype.toString = function() {
  return "(x=" + this.x + ", y=" + this.y + ")";
};

/**
* Deletes Point.
*/
Point.prototype.destroy = function() {
  delete this.type;
  delete this.name;
  delete this.x;
  delete this.y;
};
