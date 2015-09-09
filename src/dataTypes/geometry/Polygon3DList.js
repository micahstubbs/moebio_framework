import List from "src/dataTypes/lists/List";

Polygon3DList.prototype = new List();
Polygon3DList.prototype.constructor = Polygon3DList;

/**
 * @classdesc A {@link List} structure for storing {@link Polygon3D} instances.
 *
 * @description Creates a new Polygon3DList.
 * @constructor
 * @category geometry
 */
function Polygon3DList() {
  var array = List.apply(this, arguments);
  array = Polygon3DList.fromArray(array);
  return array;
}
export default Polygon3DList;

Polygon3DList.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Polygon3DList";
  return result;
};
