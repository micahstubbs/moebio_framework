import Polygon from "src/dataTypes/geometry/Polygon";
import Point from "src/dataTypes/geometry/Point";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import NumberList from "src/dataTypes/numeric/NumberList";

/**
 * @classdesc Tools to convert geometric data types.
 *
 * @namespace
 * @category geometry
 */
function GeometryConversions() {}
export default GeometryConversions;

/**
 * @todo write docs
 */
GeometryConversions.twoNumberListsToPolygon = function(numberList0, numberList1) { //TODO:change name to NumberTableToPolygon
  var n = Math.min(numberList0.length, numberList1.length);
  var polygon = new Polygon();
  for(var i = 0; i < n; i++) {
    polygon[i] = new Point(numberList0[i], numberList1[i]);
  }
  return polygon;
};

/**
 * converts a Polygon into a NumberTable
 * @param {Polygon} polygon
 * @return {NumberTable}
 * tags:conversion
 */
GeometryConversions.PolygonToNumberTable = function(polygon) {
  if(polygon == null) return null;

  var numberTable = new NumberTable();
  numberTable[0] = new NumberList();
  numberTable[1] = new NumberList();

  polygon.forEach(function(p) {
    numberTable[0].push(p.x);
    numberTable[1].push(p.y);
  });

  return numberTable;
};
