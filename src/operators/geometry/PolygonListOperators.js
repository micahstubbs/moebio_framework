import PolygonList from "src/dataTypes/geometry/PolygonList";
import PolygonOperators from "src/operators/geometry/PolygonOperators";

/**
 * @classdesc Tools to manipulate {@link PolygonList|Polygon Lists}.
 *
 * @namespace
 * @category geometry
 */
function PolygonListOperators() {}
export default PolygonListOperators;

/**
 * @todo write docs
 */
PolygonListOperators.simplifyPolygons = function(polygonList, margin, removeEmptyPolygons) {
  var newPolygonList = new PolygonList();
  var newPolygon;
  for(var i = 0; polygonList[i] != null; i++) {
    newPolygon = PolygonOperators.simplifyPolygon(polygonList[i], margin);
    if(newPolygon.length > 0 || !removeEmptyPolygons) {
      newPolygonList.push(newPolygon);
    }
  }
  return newPolygonList;
};
