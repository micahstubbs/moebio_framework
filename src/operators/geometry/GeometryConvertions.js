import Polygon from "src/dataStructures/geometry/Polygon";
import Point from "src/dataStructures/geometry/Point";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import NumberList from "src/dataStructures/numeric/NumberList";

/**
 * @classdesc Tools to convert geometric data types.
 *
 * @namespace
 * @category geometry
 */
function GeometryConvertions() {}
export default GeometryConvertions;

//include(frameworksRoot+"operators/strings/StringOperators.js")

// GeometryConvertions.StringToPolygonList=function(string, sep0, sep1, sep2){
// sep0 = sep0 || ",";
// sep1 = sep1 || " ";
// sep2 = sep2 || "\n";
//
// var polygonList = new PolygonList();
// var polygon;
// var point;
//
// lines = StringOperators.splitString(string, sep2);
//
// var i;
// var j;
// for(i=0; lines[i]!=null; i++){
// polygon = new Polygon();
// var points = StringOperators.splitString(lines[i], sep1);
// for(j=0; points[j]!=null; j++){
// var sPoint = StringOperators.splitString(points[j], sep0);
// point = new Point(Number(sPoint[0]), Number(sPoint[1]));
// polygon.push(point);
// }
// polygonList.push(polygon);
// }
// return polygonList;
// }

/**
 * @todo write docs
 */
GeometryConvertions.twoNumberListsToPolygon = function(numberList0, numberList1) { //TODO:change name to NumberTableToPolygon
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
GeometryConvertions.PolygonToNumberTable = function(polygon) {
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
