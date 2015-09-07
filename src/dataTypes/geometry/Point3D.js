import Point from "src/dataTypes/geometry/Point";

Point3D.prototype = new Point();
Point3D.prototype.constructor = Point3D;
/**
 * @classdesc Point3D represents a point in 3D space.
 *
 * @description Create a new 3D Point.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @constructor
 * @category geometry
 */
function Point3D(x, y, z) {
  Point.apply(this, arguments);
  //this.name='';
  this.type = "Point3D";
  this.z = z;
}
export default Point3D;

/**
* @todo write docs
*/
Point3D.prototype.distanceToPoint3D = function(point3D) {
  return Math.sqrt(Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2));
};

/**
* @todo write docs
*/
Point3D.prototype.distanceToPointSquared = function(point3D) {
  return Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2);
};

/**
* @todo write docs
*/
Point3D.prototype.getNorm = function() {
  return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
};

/**
* @todo write docs
*/
Point3D.prototype.normalizeToValue = function(k) {
  var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  return new Point3D(this.x * factor, this.y * factor, this.z * factor);
};

/**
* @todo write docs
*/
Point3D.prototype.cross = function(point3D) {
  var _x = this.y * point3D.z - this.z * point3D.y;
  var _y = this.z * point3D.x - this.x * point3D.z;
  var _z = this.x * point3D.y - this.y * point3D.x;
  return new Point3D(_x, _y, _z);
};

/**
* @todo write docs
*/
Point3D.prototype.dot = function(point3D) {
  return this.x * point3D.x + this.y * point3D.y + this.z * point3D.z;
};

/**
* @todo write docs
*/
Point3D.prototype.add = function(point) {
  return new Point3D(point.x + this.x, point.y + this.y, point.z + this.z);
};

/**
* @todo write docs
*/
Point3D.prototype.subtract = function(point) {
  return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
};

/**
* @todo write docs
*/
Point3D.prototype.factor = function(k) {
  return new Point3D(this.x * k, this.y * k, this.z * k);
};

/**
* @todo write docs
*/
Point3D.prototype.interpolate = function(point3D, t) {
  return new Point3D((1 - t) * this.x + t * point3D.x, (1 - t) * this.y + t * point3D.y, (1 - t) * this.z + t * point3D.z);
};

/**
* @todo write docs
*/
Point3D.prototype.getAngles = function() {
  var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
  var alfa = 0.5 * Math.PI - Math.atan2(this.z / radius, this.y / radius);
  var beta = -Math.asin(this.x / radius);
  if(alfa < -Math.PI) alfa += 2 * Math.PI;
  if(alfa > Math.PI) alfa -= 2 * Math.PI;
  if(beta < -Math.PI) beta += 2 * Math.PI;
  if(beta > Math.PI) beta -= 2 * Math.PI;
  return new Point3D(alfa, beta, 0);
};

/**
* @todo write docs
*/
Point3D.prototype.getInverseAngles = function() {
  var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
  var alfa = -0.5 * Math.PI + Math.atan2(-this.z / radius, -this.y / radius);
  var beta = Math.asin(-this.x / radius);
  if(alfa < -Math.PI) alfa += 2 * Math.PI;
  if(alfa > Math.PI) alfa -= 2 * Math.PI;
  if(beta < -Math.PI) beta += 2 * Math.PI;
  if(beta > Math.PI) beta -= 2 * Math.PI;
  return new Point3D(alfa, beta, 0);
};


/**
* @todo write docs
*/
Point3D.prototype.clone = function() {
  return new Point3D(this.x, this.y, this.z);
};

/**
* @todo write docs
*/
Point3D.prototype.toString = function() {
  return "(x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")";
};

/**
* @todo write docs
*/
Point3D.prototype.destroy = function() {
  delete this.type;
  delete this.name;
  delete this.x;
  delete this.y;
  delete this.z;
};
