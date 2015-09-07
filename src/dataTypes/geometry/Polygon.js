import List from "src/dataTypes/lists/List";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import Point from "src/dataTypes/geometry/Point";
import NumberList from "src/dataTypes/numeric/NumberList";
import { typeOf } from "src/tools/utils/code/ClassUtils";


Polygon.prototype = new List();
Polygon.prototype.constructor = Polygon;

/**
 * @classdesc A Polygon is a shape created from a list of {@link Point|Points}.
 *
 * @description Creates a new Polygon.
 * @constructor
 * @category geometry
 */
function Polygon() {
  var array = List.apply(this, arguments);
  array = Polygon.fromArray(array);
  return array;
}
export default Polygon;

/**
* @todo write docs
*/
Polygon.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Polygon";

  result.getFrame = Polygon.prototype.getFrame;
  result.getBarycenter = Polygon.prototype.getBarycenter;
  result.add = Polygon.prototype.add;
  result.factor = Polygon.prototype.factor;
  result.getRotated = Polygon.prototype.getRotated;
  result.getClosestPoint = Polygon.prototype.getClosestPoint;
  result.toNumberList = Polygon.prototype.toNumberList;
  result.containsPoint = Polygon.prototype.containsPoint;
  //transform
  result.approach = Polygon.prototype.approach;
  //override
  result.clone = Polygon.prototype.clone;

  return result;
};


/**
* @todo write docs
*/
Polygon.prototype.getFrame = function() {
  if(this.length === 0) return null;
  var rectangle = new Rectangle(this[0].x, this[0].y, this[0].x, this[0].y);
  var p;
  for(var i = 1; this[i] != null; i++) {
    p = this[i];
    rectangle.x = Math.min(rectangle.x, p.x);
    rectangle.y = Math.min(rectangle.y, p.y);
    rectangle.width = Math.max(rectangle.width, p.x);
    rectangle.height = Math.max(rectangle.height, p.y);
  }

  rectangle.width -= rectangle.x;
  rectangle.height -= rectangle.y;

  return rectangle;
};

/**
* @todo write docs
*/
Polygon.prototype.getBarycenter = function(countLastPoint) {
  var i;
  countLastPoint = countLastPoint == null ? true : countLastPoint;
  var cLPN = 1 - Number(countLastPoint);
  if(this.length === 0) return null;
  var barycenter = new Point(this[0].x, this[0].y);
  for(i = 1; this[i + cLPN] != null; i++) {
    barycenter.x += this[i].x;
    barycenter.y += this[i].y;
  }
  barycenter.x /= this.length;
  barycenter.y /= this.length;
  return barycenter;
};

/**
* @todo write docs
*/
Polygon.prototype.add = function(object) {
  var type = typeOf(object);
  var i;
  switch(type) {
    case 'Point':
      var newPolygon = new Polygon();
      for(i = 0; this[i] != null; i++) {
        newPolygon[i] = this[i].add(object);
      }
      newPolygon.name = this.name;
      return newPolygon;
  }
};

/**
 * scales the polygon by a number or a Point
 * @param  {Object} value number or point
 * @return {Polygon}
 * tags:
 */
Polygon.prototype.factor = function(value) {
  var i;
  var newPolygon = new Polygon();
  newPolygon.name = this.name;

  if(value >= 0 || value < 0) {
    for(i = 0; this[i] != null; i++) {
      newPolygon[i] = new Point(this[i].x * value, this[i].y * value);
    }

    return newPolygon;
  } else if(value.type != null && value.type == 'Point') {
    for(i = 0; this[i] != null; i++) {
      newPolygon[i] = new Point(this[i].x * value.x, this[i].y * value.y);
    }

    return newPolygon;
  }

  return null;
};


/**
* @todo write docs
*/
Polygon.prototype.getRotated = function(angle, center) {
  center = center == null ? new Point() : center;

  var newPolygon = new Polygon();
  for(var i = 0; this[i] != null; i++) {
    newPolygon[i] = new Point(Math.cos(angle) * (this[i].x - center.x) - Math.sin(angle) * (this[i].y - center.y) + center.x, Math.sin(angle) * (this[i].x - center.x) + Math.cos(angle) * (this[i].y - center.y) + center.y);
  }
  newPolygon.name = this.name;
  return newPolygon;
};

/**
 * @todo write docs
 */
Polygon.prototype.getClosestPoint = function(point) {
  var closest = this[0];
  var d2Min = Math.pow(point.x - closest.x, 2) + Math.pow(point.y - closest.y, 2);
  var d2;

  for(var i = 1; this[i] != null; i++) {
    d2 = Math.pow(point.x - this[i].x, 2) + Math.pow(point.y - this[i].y, 2);
    if(d2 < d2Min) {
      d2Min = d2;
      closest = this[i];
    }
  }
  return closest;
};

/**
 * @todo write docs
 */
Polygon.prototype.toNumberList = function() {
  var numberList = new NumberList();
  var i;
  for(i = 0; this[i] != null; i++) {
    numberList[i * 2] = this[i].x;
    numberList[i * 2 + 1] = this[i].y;
  }
  return numberList;
};

/**
* @todo write docs
* Thanks http://jsfromhell.com/math/is-point-in-poly AND http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
*/
Polygon.prototype.containsPoint = function(point) {
  var i;
  var j;
  var l;
  var c;
  for(c = false, i = -1, l = this.length, j = l - 1; ++i < l; j = i)
        ((this[i].y <= point.y && point.y < this[j].y) || (this[j].y <= point.y && point.y < this[i].y)) &&
        (point.x < (this[j].x - this[i].x) * (point.y - this[i].y) / (this[j].y - this[i].y) + this[i].x) &&
        (c = !c);
  return c;
};

//transform

/**
 * @todo write docs
 */
Polygon.prototype.approach = function(destiny, speed) {
  speed = speed || 0.5;
  var antispeed = 1 - speed;

  this.forEach(function(point, i) {
    point.x = antispeed * point.x + speed * destiny[i].x;
    point.y = antispeed * point.y + speed * destiny[i].y;
  });
};


/**
 * @todo write docs
 */
Polygon.prototype.clone = function() {
  var newPolygon = new Polygon();
  for(var i = 0; this[i] != null; i++) {
    newPolygon[i] = this[i].clone();
  }
  newPolygon.name = this.name;
  return newPolygon;
};
