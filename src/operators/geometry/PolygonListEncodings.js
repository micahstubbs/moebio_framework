import PolygonList from "src/dataTypes/geometry/PolygonList";
import StringOperators from "src/operators/strings/StringOperators";
import Polygon from "src/dataTypes/geometry/Polygon";
import Point from "src/dataTypes/geometry/Point";

/**
 * @classdesc Encode and Decode {@link Polygon} as a String.
 *
 * @namespace
 * @category geometry
 */
function PolygonListEncodings() {}
export default PolygonListEncodings;

/**
 * converts a simple format for polygons into a PolygonList
 * @param {String} string
 *
 * @param {String} separatorCoordinates "," by default
 * @param {String} separatorPolygons "/" by default
 * @return {PolygonList}
 * tags:encoding
 */
PolygonListEncodings.StringToPolygonList = function(string, separatorCoordinates, separatorPolygons) {
  separatorCoordinates = separatorCoordinates || ",";
  separatorPolygons = separatorPolygons || "/";

  var polygonList = new PolygonList();
  var polygon;
  var point;

  var pols = StringOperators.splitString(string, separatorPolygons);

  var j;
  var numbers;
  for(var i = 0; pols[i] != null; i++) {
    polygon = new Polygon();
    numbers = StringOperators.splitString(pols[i], separatorCoordinates);
    for(j = 0; numbers[j] != null; j += 2) {
      point = new Point(Number(numbers[j]), Number(numbers[j + 1]));
      polygon.push(point);
    }
    polygonList.push(polygon);
  }
  return polygonList;
};

/**
 * converts a polygonList into a simple text format
 * @param {PolygonList} polygonList
 *
 * @param {String} separatorCoordinates "," by default
 * @param {String} separatorPolygons "/" by default
 * @return {String}
 * tags:encoding
 */
PolygonListEncodings.PolygonListToString = function(polygonList, separatorCoordinates, separatorPolygons) {
  separatorCoordinates = separatorCoordinates || ",";
  separatorPolygons = separatorPolygons || "/";

  var i;
  var j;
  var t = '';
  for(i = 0; polygonList[i] != null; i++) {
    t += (i === 0 ? '' : separatorPolygons);
    for(j = 0; polygonList[i][j] != null; j++) {
      t += (j === 0 ? '' : separatorCoordinates) + polygonList[i][j].x + separatorCoordinates + polygonList[i][j].y;
    }
  }
  return t;
};
