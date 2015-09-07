
import Polygon from "src/dataTypes/geometry/Polygon";
import StringList from "src/dataTypes/strings/StringList";
import Point from "src/dataTypes/geometry/Point";

/**
 * @classdesc NumberList Conversions
 *
 * @namespace
 * @category numbers
 */
function NumberListConversions() {}
export default NumberListConversions;

/**
 * Builds an {@link Polygon} from the NumberList,
 * using each consecutive pair of values in the numberList as
 * x and y positions.
 *
 * @param {NumberList} numberlist The NumberList to convert to a Polygon.
 * @return {Polygon} Polygon representing the values
 * in the NumberList as x/y coordinates.
 */
NumberListConversions.toPolygon = function(numberlist) {
  if(numberlist.length === 0) return null;
  var polygon = new Polygon();
  for(var i = 0; numberlist[i + 1] != null; i += 2) {
    polygon.push(new Point(numberlist[i], numberlist[i + 1]));
  }
  return polygon;
};

/**
 * Returns a new {@link StringList} with all values converted to strings
 *
 * @param {NumberList} numberlist The NumberList to convert.
 * @return {StringList} New list.
 */
NumberListConversions.toStringList = function(numberlist) {
  var i;
  var stringList = new StringList();
  for(i = 0; numberlist[i] != null; i++) {
    stringList[i] = String(numberlist[i]);
  }
  stringList.name = numberlist.name;
  return stringList;
};
