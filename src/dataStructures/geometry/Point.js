import DataModel from "src/dataStructures/DataModel";

Point.prototype = new DataModel();
Point.prototype.constructor = Point;

/**
 * @classdesc Represents an individual 2D point in space.
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
* @todo write docs
*/
Point.prototype.getNorm = function() {
  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
};

/**
* @todo write docs
*/
Point.prototype.getAngle = function() {
  return Math.atan2(this.y, this.x);
};



/**
* @todo write docs
*/
Point.prototype.factor = function(k) {
  if(k >= 0 || k < 0) return new Point(this.x * k, this.y * k);
  if(k.type != null && k.type == 'Point') return new Point(this.x * k.x, this.y * k.y);
};

/**
* @todo write docs
*/
Point.prototype.normalize = function() {
  var norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  return new Point(this.x / norm, this.y / norm);
};

/**
* @todo write docs
*/
Point.prototype.normalizeToValue = function(k) {
  var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  return new Point(this.x * factor, this.y * factor);
};



/**
* @todo write docs
*/
Point.prototype.subtract = function(point) {
  return new Point(this.x - point.x, this.y - point.y);
};

/**
* @todo write docs
*/
Point.prototype.add = function(point) {
  return new Point(point.x + this.x, point.y + this.y);
};

/**
* @todo write docs
*/
Point.prototype.addCoordinates = function(x, y) {
  return new Point(x + this.x, y + this.y);
};

/**
* @todo write docs
*/
Point.prototype.distanceToPoint = function(point) {
  return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
};

/**
* @todo write docs
*/
Point.prototype.distanceToPointSquared = function(point) {
  return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
};

/**
* @todo write docs
*/
Point.prototype.angleToPoint = function(point) {
  return Math.atan2(point.y - this.y, point.x - this.x);
};

/**
* @todo write docs
*/
Point.prototype.expandFromPoint = function(point, factor) {
  return new Point(point.x + factor * (this.x - point.x), point.y + factor * (this.y - point.y));
};


/**
* @todo write docs
*/
Point.prototype.interpolate = function(point, t) {
  return new Point((1 - t) * this.x + t * point.x, (1 - t) * this.y + t * point.y);
};

/**
* @todo write docs
*/
Point.prototype.cross = function(point) {
  return this.x * point.y - this.y * point.x;
};

/**
* @todo write docs
*/
Point.prototype.dot = function(point) {
  return this.x * point.x + this.y * point.y;
};

/**
* @todo write docs
*/
Point.prototype.getRotated = function(angle, center) {
  center = center == null ? new Point() : center;

  return new Point(Math.cos(angle) * (this.x - center.x) - Math.sin(angle) * (this.y - center.y) + center.x, Math.sin(angle) * (this.x - center.x) + Math.cos(angle) * (this.y - center.y) + center.y);
};

/**
* @todo write docs
*/
Point.prototype.clone = function() {
  return new Point(this.x, this.y);
};

/**
* @todo write docs
*/
Point.prototype.toString = function() {
  return "(x=" + this.x + ", y=" + this.y + ")";
};

/**
* @todo write docs
*/
Point.prototype.destroy = function() {
  delete this.type;
  delete this.name;
  delete this.x;
  delete this.y;
};
