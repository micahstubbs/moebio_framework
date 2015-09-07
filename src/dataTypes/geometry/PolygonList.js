import Table from "src/dataTypes/lists/Table";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import { typeOf } from "src/tools/utils/code/ClassUtils";

PolygonList.prototype = new Table();
PolygonList.prototype.constructor = PolygonList;

/**
 * @classdesc A {@link List} structure for storing {@link Polygon} instances.
 *
 * Additional functions that work on NumberTable can be found in:
 * <ul>
 *  <li>Operators:   {@link PolygonListOperators}</li>
 *  <li>Encodings: {@link PolygonListEncodings}</li>
 * </ul>
 *
 *
 * @description Creates a new PolygonList.
 * @constructor
 * @category geometry
 */
function PolygonList() {
  var array = Table.apply(this, arguments);
  array = PolygonList.fromArray(array);
  return array;
}
export default PolygonList;

/**
 * @todo write docs
 */
PolygonList.fromArray = function(array) {
  var result = Table.fromArray(array);
  result.type = "PolygonList";
  result.getFrame = PolygonList.prototype.getFrame;
  result.add = PolygonList.prototype.add;
  result.factor = PolygonList.prototype.factor;
  result.clone = PolygonList.prototype.clone;
  result.getString = PolygonList.prototype.getString;
  return result;
};

/**
 * @todo write docs
 */
PolygonList.prototype.getFrame = function() {
  if(this.length === 0) return null;
  var frameP = this[0].getFrame();
  var rectangle = new Rectangle(frameP.x, frameP.y, frameP.getRight(), frameP.getBottom());
  for(var i = 1; this[i] != null; i++) {
    frameP = this[i].getFrame();
    rectangle.x = Math.min(rectangle.x, frameP.x);
    rectangle.y = Math.min(rectangle.y, frameP.y);
    rectangle.width = Math.max(rectangle.width, frameP.getRight());
    rectangle.height = Math.max(rectangle.height, frameP.getBottom());
  }
  rectangle.width -= rectangle.x;
  rectangle.height -= rectangle.y;

  return rectangle;
};

/**
 * @todo write docs
 */
PolygonList.prototype.add = function(object) {
  var type = typeOf(object);
  var i;
  switch(type) {
    case 'Point':
      var newPolygonList = new PolygonList();
      for(i = 0; this[i] != null; i++) {
        newPolygonList[i] = this[i].add(object);
      }
      newPolygonList.name = this.name;
      return newPolygonList;
  }
};

/**
 * @todo write docs
 */
PolygonList.prototype.factor = function(value) {
  var newPolygonList = new PolygonList();
  for(var i = 0; this[i] != null; i++) {
    newPolygonList[i] = this[i].factor(value);
  }
  newPolygonList.name = this.name;
  return newPolygonList;
};

/**
 * @todo write docs
 */
PolygonList.prototype.clone = function() {
  var newPolygonList = new PolygonList();
  for(var i = 0; this[i] != null; i++) {
    newPolygonList[i] = this[i].clone();
  }
  newPolygonList.name = this.name;
  return newPolygonList;
};

// PolygonList.prototype.getString=function(pointSeparator,polygonSeparator){
// pointSeparator = pointSeparator==null?',':pointSeparator;
// polygonSeparator = polygonSeparator==null?'/':polygonSeparator;
// var j;
// var t='';
// for(var i=0;this[i]!=null;i++){
// t+=(i==0?'':polygonSeparator);
// for(j=0; this[i][j]!=null; j++){
// t+=(j==0?'':pointSeparator)+this[i][j].x+pointSeparator+this[i][j].y;
// }
// }
// return t;
// }
