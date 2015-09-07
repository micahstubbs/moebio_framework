import List from "src/dataTypes/lists/List";

Polygon3D.prototype = new List();
Polygon3D.prototype.constructor = Polygon3D;

/**
 * @classdesc Polygon3D brings the {@link Polygon} concept into three
 * dimensions through the use of {@link Point3D}.
 *
 * @description Creates a new Polygon3D.
 * @constructor
 * @category geometry
 */
function Polygon3D() {
  var array = List.apply(this, arguments);
  array = Polygon3D.fromArray(array);
  return array;
}
export default Polygon3D;

/**
 * @todo write docs
 */
Polygon3D.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Polygon3D";
  //assign methods to array:
  return result;
};
