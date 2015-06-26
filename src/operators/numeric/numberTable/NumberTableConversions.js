import Polygon from "src/dataStructures/geometry/Polygon";
import Point from "src/dataStructures/geometry/Point";

function NumberTableConversions() {}
export default NumberTableConversions;

/**
 * converts a numberTable with at least two lists into a Polygon
 * @param  {NumberTable} numberTable with at least two numberLists
 * @return {Polygon}
 * tags:conversion
 */
NumberTableConversions.numberTableToPolygon = function(numberTable) {
  if(numberTable.length < 2) return null;

  var i;
  var n = Math.min(numberTable[0].length, numberTable[1].length);
  var polygon = new Polygon();

  for(i = 0; i < n; i++) {
    polygon[i] = new Point(numberTable[0][i], numberTable[1][i]);
  }

  return polygon;
};