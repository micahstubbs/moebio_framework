/**
 * PolygonGenerators
 * @constructor
 */
function PolygonListOperators() {};


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
}