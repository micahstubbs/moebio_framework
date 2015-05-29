Rectangle.prototype = new DataModel();
Rectangle.prototype.constructor = Rectangle;
/**
 * Rectangle
 * @constructor
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

Rectangle.prototype.getRight = function() {
  return this.x + this.width;
};

Rectangle.prototype.getBottom = function() {
  return this.y + this.height;
};

Rectangle.prototype.setRight = function(value) {
  this.width = value - this.x;
};

Rectangle.prototype.setBottom = function(value) {
  this.height = value - this.y;
};



Rectangle.prototype.getTopLeft = function() {
  return new Point(this.x, this.y);
};
Rectangle.prototype.getTopRight = function() {
  return new Point(this.x + this.width, this.y);
};

Rectangle.prototype.getBottomRight = function() {
  return new Point(this.x + this.width, this.y + this.height);
};
Rectangle.prototype.getBottomLeft = function() {
  return new Point(this.x, this.y + this.height);
};
Rectangle.prototype.getCenter = function() {
  return new Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
};
Rectangle.prototype.getRandomPoint = function() {
  return new Point(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
};

Rectangle.prototype.getIntersection = function(rectangle) {
  if(rectangle.x + rectangle.width < this.x || rectangle.x > this.x + this.width || rectangle.y + rectangle.height < this.y || rectangle.y > this.y + this.height) return null;
  var xR = Math.max(rectangle.x, this.x);
  var yR = Math.max(rectangle.y, this.y);
  return new Rectangle(xR, yR, Math.min(rectangle.x + rectangle.width, this.x + this.width) - xR, Math.min(rectangle.y + rectangle.height, this.y + this.height) - yR);
};

Rectangle.prototype.interpolate = function(rectangle, t) {
  var mint = 1 - t;
  return new Rectangle(mint * this.x + t * rectangle.x, mint * this.y + t * rectangle.y, mint * this.width + t * rectangle.width, mint * this.height + t * rectangle.height);
};

Rectangle.prototype.getRatio = function() {
  return Math.max(this.width, this.height) / Math.min(this.width, this.height);
};

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

/**
 * check if a point belong to the rectangle
 * @param  {Point} point
 * @return {Boolean}
 * tags:geometry
 */
Rectangle.prototype.containsPoint = function(point) {
  return(this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
};


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




Rectangle.prototype.getNormalRectangle = function() {
  return new Rectangle(Math.min(this.x, this.x + this.width), Math.min(this.y, this.y + this.height), Math.abs(this.width), Math.abs(this.height));
};

/**
 * return true if it interstects a rectangle
 * @param  {Rectangle} rectangle
 * @return {Boolean}
 * tags:geometry
 */
Rectangle.prototype.intersectsRectangle = function(rectangle) {
  return !(this.x + this.width < rectangle.x) && !(this.y + this.height < rectangle.y) && !(rectangle.x + rectangle.width < this.x) && !(rectangle.y + rectangle.height < this.y);


  if(this.x + this.width < rectangle.x) return false;
  if(this.y + this.height < rectangle.y) return false;
  if(rectangle.x + rectangle.width < this.x) return false;
  if(rectangle.y + rectangle.height < this.y) return false;
  return true;



	return this.containsPoint(rectangle.getTopLeft()) || this.containsPoint(rectangle.getTopRight()) || this.containsPoint(rectangle.getBottomLeft()) || this.containsPoint(rectangle.getBottomRight()) 
	|| rectangle.containsPoint(this.getTopLeft()) || rectangle.containsPoint(this.getTopRight()) || rectangle.containsPoint(this.getBottomLeft()) || rectangle.containsPoint(this.getBottomRight());
};

Rectangle.prototype.expand = function(expantion, centerPoint) {
  centerPoint = centerPoint || new Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
  return new Rectangle((this.x - centerPoint.x) * expantion + centerPoint.x, (this.y - centerPoint.y) * expantion + centerPoint.y, this.width * expantion, this.height * expantion);
};

Rectangle.prototype.isEqual = function(rectangle) {
  return this.x == rectangle.x && this.y == rectangle.y && this.width == rectangle.width && this.height == rectangle.height;
};

Rectangle.prototype.clone = function() {
  return new Rectangle(this.x, this.y, this.width, this.height);
};

Rectangle.prototype.toString = function() {
  return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
};

Rectangle.prototype.destroy = function() {
  delete this.x;
  delete this.y;
  delete this.width;
  delete this.height;
};