import List from "src/dataTypes/lists/List";

RectangleList.prototype = new List();
RectangleList.prototype.constructor = RectangleList;
/**
 * @classdesc A {@link List} structure for storing {@link Rectangle} instances.
 *
 * @description Creates a new RectangleList.
 * @constructor
 * @category geometry
 */
function RectangleList() {
  var array = List.apply(this, arguments);
  array = RectangleList.fromArray(array);
  return array;
}
export default RectangleList;

/**
 * @todo write docs
 */
RectangleList.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "RectangleList";

  result.getFrame = RectangleList.prototype.getFrame;
  result.add = RectangleList.prototype.add;
  result.factor = RectangleList.prototype.factor;
  result.getAddedArea = RectangleList.prototype.getAddedArea;
  result.getIntersectionArea = RectangleList.prototype.getIntersectionArea;

  return result;
};


/**
 * @todo write docs
 */
RectangleList.prototype.getFrame = function() {//TODO: use RectangleOperators.minRect
  if(this.length === 0) return null;

  var frame = this[0].clone();
  frame.width = frame.getRight();
  frame.height = frame.getBottom();
  for(var i = 1; this[i] != null; i++) {
    frame.x = Math.min(frame.x, this[i].x);
    frame.y = Math.min(frame.y, this[i].y);

    frame.width = Math.max(this[i].getRight(), frame.width);
    frame.height = Math.max(this[i].getBottom(), frame.height);
  }

  frame.width -= frame.x;
  frame.height -= frame.y;

  return frame;
};

// TODO:finish RectangleList methods

/**
 * @ignore
 */
RectangleList.prototype.add = function() {

};

/**
 * @ignore
 */
RectangleList.prototype.factor = function() {

};


/**
 * @ignore
 */
RectangleList.prototype.getAddedArea = function() {};

/**
 * @todo write docs
 */
RectangleList.prototype.getIntersectionArea = function() {
  var rect0;
  var rect1;
  var intersectionArea = 0;
  var intersection;
  for(var i = 0; this[i + 1] != null; i++) {
    rect0 = this[i];
    for(var j = i + 1; this[j] != null; j++) {
      rect1 = this[j];
      intersection = rect0.getIntersection(rect1);
      intersectionArea += intersection == null ? 0 : intersection.getArea();
    }
  }

  return intersectionArea;
};
