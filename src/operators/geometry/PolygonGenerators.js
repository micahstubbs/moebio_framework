import Point from "src/dataTypes/geometry/Point";
import Polygon from "src/dataTypes/geometry/Polygon";

/**
 * @classdesc Functions to create Polygons from a set of points
 *
 * @namespace
 * @category geometry
 */
function PolygonGenerators() {}
export default PolygonGenerators;

/**
 * @todo write docs
 */
PolygonGenerators.createPolygon = function(nPoints, mode, frame) {
  var polygon = new Polygon();

  switch(mode) {
    case 0: //random
      for(var i = 0; i < nPoints; i++) {
        polygon.push(new Point(frame.x + frame.width * Math.random(), frame.y + frame.height * Math.random()));
      }
      break;
    case 1: //circle
      break;
  }

  return polygon;
};

// PolygonGenerators.getCirclesDisposedInSpiral=function(weights, frame){ //TODO: this method belongs to another class (?)
// 	var sortedCenters;
// 	var centers = new Polygon();
// 	var sortedRadius;
// 	var radius = new NumberList();
// 	var sortArray = weights.sortNumericIndexedDescending();
// 	//trace("sortArray:", weights, sortArray);
// 	var maxWeight = 0;
// 	var nElements = weights.length;
// 	var i;
// 	var j;

// 	if(nElements==1){
// 		var table=new Table();
// 		var pointList=new Polygon();
// 		var point=new Point()
// 		pointList.push(point);
// 		table.push(pointList);
// 		var list=new List();
// 		list.push(1);
// 		table.push(list);
// 		return table;
// 	}
// 	maxWeight =weights.getMax();


// 	if(maxWeight==0) return null;

// 	var MIN_SPACE_BETWEEN_CIRCLES = 0.1;

// 	sortedRadius = new NumberList(Math.sqrt(weights[sortArray[0]]/maxWeight), Math.sqrt(weights[sortArray[1]]/maxWeight));
// 	sortedCenters = new Polygon(new Point(0,0), new Point(sortedRadius[0] + sortedRadius[1] + MIN_SPACE_BETWEEN_CIRCLES,0));
// 	//trace("sortedCenters:", sortedCenters),
// 	centers[sortArray[0]] = sortedCenters[0];
// 	radius[sortArray[0]] = sortedRadius[0];

// 	centers[sortArray[1]] = sortedCenters[1];
// 	radius[sortArray[1]] = sortedRadius[1];
// 	//trace(centers);
// 	//trace(radius);
// 	var r;
// 	var rI;
// 	var angle = 0;

// 	var testPoint = new Point(0, 0);
// 	var externR = sortedCenters[1].x + sortedRadius[1];

// 	//var ACCUM_J:Number=0;

// 	for(i=2; i<nElements; i++){
// 		rI = Math.sqrt(weights[sortArray[i]]/maxWeight);
// 		//trace(i, "rI", rI);
// 		r = sortedRadius[0] + rI + MIN_SPACE_BETWEEN_CIRCLES;
// 		angle = i;

// 		for(j=0; j<100000; j++){
// 			testPoint.x = r*Math.cos(angle);
// 			testPoint.y = r*Math.sin(angle);

// 			r+=0.01;
// 			angle+=r*0.04;

// 			if(Polygon.testCircleAtPoint(testPoint, rI+MIN_SPACE_BETWEEN_CIRCLES, sortedCenters, sortedRadius) || j==99999){
// 				sortedCenters.push(new Point(testPoint.x, testPoint.y));
// 				sortedRadius.push(rI);
// 				centers[sortArray[i]] = sortedCenters[i];
// 				radius[sortArray[i]] = sortedRadius[i];
// 				externR = Math.max(externR, Math.sqrt(Math.pow(testPoint.x, 2)+Math.pow(testPoint.y, 2)) + rI);
// 				break;
// 			}
// 		}
// 		//ACCUM_J+=j

// 	}
// 	//trace("   packingCircles:ACCUM_J", ACCUM_J);
// 	//trace("c:", centers);
// 	//trace("r:", radius);
// 	var mulVal=1/externR;
// 	for(i=0; i<centers.length; i++){
// 		centers[i].x*=mulVal;
// 		centers[i].y*=mulVal;
// 	}
// 	for(i=0; i<radius.length; i++){
// 		radius[i]*=mulVal;
// 	}
// 	//centers = centers.multiply();
// 	//radius = radius.multiply(1/externR);
// 	//trace("c2:", centers);
// 	//trace("r2:", radius);

// 	return new Array(centers, radius);
// }
