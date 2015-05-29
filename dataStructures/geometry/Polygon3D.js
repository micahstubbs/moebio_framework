Polygon3D.prototype = new List();
Polygon3D.prototype.constructor = Polygon3D;
/**
 * Polygon3D
 * @constructor
 */
function Polygon3D() {
  var array = List.apply(this, arguments);
  array = Polygon3D.fromArray(array);
  return array;
}
Polygon3D.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Polygon3D";
  //assign methods to array:
  return result;
};