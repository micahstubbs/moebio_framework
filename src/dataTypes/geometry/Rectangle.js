import DataModel from "src/dataTypes/DataModel";
import Point from "src/dataTypes/geometry/Point";

Rectangle.prototype = new DataModel();
Rectangle.prototype.constructor = Rectangle;

/**
 * @classdesc Rectangle shape with x, y, width, and height.
 *
 * @description Creates a new Rectangle.
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @constructor
 * @category geometry
 */
function Rectangle(x, y, width, height) {
  DataModel.apply(this);
  this.name = "";
  this.type = "Rectangle";
  this.x = Number(x) || 0;
  this.y = Number(y) || 0;
  this.width = Number(width) || 0;
  this.height = Number(height) || 0;
}
export default Rectangle;

/**
 * Gets the position of the top right corner of the Rectangle.
 * @return {Number} Top-right corner.
 */
Rectangle.prototype.getRight = function() {
  return this.x + this.width;
};

/**
 * Gets the position of the bottom left corner of the Rectangle.
 * @return {Number} Bottom-left corner.
 */
Rectangle.prototype.getBottom = function() {
  return this.y + this.height;
};

/**
 * Sets the position of the top right corner of the Rectangle by reducing the
 * width of the Rectangle to set it to the input value.
 * @param {Number} New value of Top-right corner.
 */
Rectangle.prototype.setRight = function(value) {
  this.width = value - this.x;
};

/**
 * Sets the position of the bottom left corner of the Rectangle by reducing the
 * height of the Rectangle to set it to the input value.
 * @param {Number} New value of bottom-left corner.
 */
Rectangle.prototype.setBottom = function(value) {
  this.height = value - this.y;
};

/**
 * Gets the position of the top left corner of the Rectangle as a {@link Point}.
 * @return {Point} Top-Left corner.
 */
Rectangle.prototype.getTopLeft = function() {
  return new Point(this.x, this.y);
};

/**
 * Gets the position of the top right corner of the Rectangle as a {@link Point}.
 * @return {Point} Top-Right corner.
 */
Rectangle.prototype.getTopRight = function() {
  return new Point(this.x + this.width, this.y);
};

/**
 * Gets the position of the bottom right corner of the Rectangle as a {@link Point}.
 * @return {Point} Bottom-Right corner.
 */
Rectangle.prototype.getBottomRight = function() {
  return new Point(this.x + this.width, this.y + this.height);
};

/**
 * Gets the position of the bottom left corner of the Rectangle as a {@link Point}.
 * @return {Point} Bottom-Left corner.
 */
Rectangle.prototype.getBottomLeft = function() {
  return new Point(this.x, this.y + this.height);
};

/**
 * Gets the position of the middle of the Rectangle as a {@link Point}.
 * @return {Point} Center of Rectangle
 */
Rectangle.prototype.getCenter = function() {
  return new Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
};

/**
 * Returns a random {@link Point} constrained to be within the bounds of the Rectangle.
 * @return {Point} Random Point in Rectangle.
 */
Rectangle.prototype.getRandomPoint = function() {
  return new Point(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
};

/**
 * Returns a Rectangle that is the overlap of this Rectangle and the input Rectangle.
 * @param {Rectangle} rectangle Rectangle to overlap on this Rectangle.
 * @return {Rectangle} Overlaping area of the two as a Rectangle.
 */
Rectangle.prototype.getIntersection = function(rectangle) {
  if(rectangle.x + rectangle.width < this.x || rectangle.x > this.x + this.width || rectangle.y + rectangle.height < this.y || rectangle.y > this.y + this.height) return null;
  var xR = Math.max(rectangle.x, this.x);
  var yR = Math.max(rectangle.y, this.y);
  return new Rectangle(xR, yR, Math.min(rectangle.x + rectangle.width, this.x + this.width) - xR, Math.min(rectangle.y + rectangle.height, this.y + this.height) - yR);
};

/**
 * Returns a new Rectangle that is the interpolation between the current Rectangle
 * and the given Rectangle at some time t. The input t is a value between 0 and 1.
 * @param {Rectangle} rectangle Rectangle to interpolate to.
 * @return {Rectangle} Overlaping area of the two as a Rectangle.
 */
Rectangle.prototype.interpolate = function(rectangle, t) {
  var mint = 1 - t;
  return new Rectangle(mint * this.x + t * rectangle.x, mint * this.y + t * rectangle.y, mint * this.width + t * rectangle.width, mint * this.height + t * rectangle.height);
};

/**
 * Returns the width / height ratio.
 * @return {Number} ratio of the Rectangle.
 */
Rectangle.prototype.getRatio = function() {
  return Math.max(this.width, this.height) / Math.min(this.width, this.height);
};

/**
 * Returns the width * height area of the Rectangle
 * @return {Number} area of the Rectangle.
 */
Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

/**
 * Checks if a Point is within the bounds of this Rectangle.
 * @param  {Point} point Point to check.
 * @return {Boolean} true if Point is in Rectangle.
 * tags:geometry
 */
Rectangle.prototype.containsPoint = function(point) {
  return(this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
};


/**
 * Checks if a Point is on the border of the Rectangle within some margin.
 * @param  {Point} point Point to check.
 * @param  {Number} margin Area around border to include in the 'border' of the Rectangle.
 * @return {Boolean} true if Point is on the border.
 * tags:geometry
 */
Rectangle.prototype.pointIsOnBorder = function(point, margin) {
  margin = margin == null ? 1 : margin;
  if(point.x >= this.x - margin && point.x <= this.x + this.width + margin) {
    if(point.y >= this.y - margin && point.y <= this.y + margin) return true;
    if(point.y >= this.y + this.height - margin && point.y <= this.y + this.height + margin) return true;
    if(point.y >= this.y - margin && point.y <= this.y + this.height + margin) {
      if(point.x < this.x + margin || point.x > this.x + this.width - margin) return true;
    }
  }
  return false;
};

/**
 * Creates a new Rectangle from this Rectangle which has no negative values for
 * width and height.
 * @return {Rectangle} new Normalized Rectangle.
 */
Rectangle.prototype.getNormalRectangle = function() {
  return new Rectangle(Math.min(this.x, this.x + this.width), Math.min(this.y, this.y + this.height), Math.abs(this.width), Math.abs(this.height));
};

/**
 * Returns true if provided Rectangle overlaps this Rectangle.
 * @param  {Rectangle} rectangle Rectangle to check.
 * @return {Boolean} true if the two Rectangles overlap.
 * tags:geometry
 */
Rectangle.prototype.intersectsRectangle = function(rectangle) {
  return (this.x + this.width >= rectangle.x) && (this.y + this.height >= rectangle.y) && (rectangle.x + rectangle.width >= this.x) && (rectangle.y + rectangle.height >= this.y);
};

/**
 * Expands Rectangle by multiplying dimensions by the given expansion around a
 * given center point. If no center point is provided, the new Rectangle is
 * expanded around the center of the current Rectangle.
 * @param {Number} expansion Factor to expand by.
 * @param {Point} centerPoint Center point of the expansion. Center of Rectangle by default.
 * @return {Rectangle} Expanded Rectangle.
 */
Rectangle.prototype.expand = function(expansion, centerPoint) {
  centerPoint = centerPoint || new Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
  return new Rectangle((this.x - centerPoint.x) * expansion + centerPoint.x, (this.y - centerPoint.y) * expansion + centerPoint.y, this.width * expansion, this.height * expansion);
};

/**
 * Returns true if this Rectangle is equal to the provided Rectangle.
 * @param  {Rectangle} rectangle Rectangle to compare.
 * @return {Boolean} true if two Rectangles are equal.
 */
Rectangle.prototype.isEqual = function(rectangle) {
  return this.x == rectangle.x && this.y == rectangle.y && this.width == rectangle.width && this.height == rectangle.height;
};

/**
 * Returns copy of this Rectangle.
 * @return {Rectangle} Copy of this Rectangle.
 */
Rectangle.prototype.clone = function() {
  return new Rectangle(this.x, this.y, this.width, this.height);
};

/**
* Provides a string representation of the Rectangle.
* @return {String} string output.
*/
Rectangle.prototype.toString = function() {
  return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
};

/**
 * Deletes Rectangle.
 */
Rectangle.prototype.destroy = function() {
  delete this.x;
  delete this.y;
  delete this.width;
  delete this.height;
};
