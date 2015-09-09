import ColorListOperators from "src/operators/graphic/ColorListOperators";
import Point from "src/dataTypes/geometry/Point";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import ColorScale from "src/dataTypes/graphic/ColorScale";
import ColorOperators from "src/operators/graphic/ColorOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/*
 * DrawSimpleVis
 *
 * This class contains methods that draw simple visualizations such as lines, barChart…
 * It's main aim is to allow a first glance on a structure
 * The challenge is to create at least one method for each structure
 *
 * in the future a 'detect element hovered' might be deployed
 *
 * Once this class becomes big and complex enough, a new 'big folder' will be created ('visGraphication'?) with the conventional structure: dates, geometry, graphic, lists, numeric, strings, structures…
 * and with classes named NumberTableGraph… os similar
 *
 *
 * //////// [!] METHODS ARE BEING REMOVED FROM HERE TO BE PLACE ON THEIR CORRECT CLASSES
 * @constructor
 */

function DrawSimpleVis() {}
export default DrawSimpleVis;

DrawSimpleVis.drawSimpleBarChart = function(context, numberList, frame, colors) { //TODO: complete cases (numberLists with negative (and positive) values)
  colors = colors == null ? ColorListOperators.colorListFromColorScale(new ColorScale()) : colors;
  frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;

  var dX = frame.width / numberList.length;

  var bottom = frame.getBottom();
  var normalizedNumberList = NumberListOperators.normalizedToMax(numberList, frame.height);

  var i;
  for(i = 0; numberList[i] != null; i++) {
    context.fillStyle = colors[i];
    context.fillRect(frame.x + i * dX, bottom - normalizedNumberList[i], dX - 1, normalizedNumberList[i]);
  }
};



DrawSimpleVis.drawIntervalsFlowTable = function(context, intervalsFlowTable, frame, colors, bezier) {
  console.log("[!] MOVED TO IntervalTableDraw.js");
  // var nElements = intervalsFlowTable.length;
  // var i;
  // var j;
  //
  // colors = colors==null?ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements):colors;
  // frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
  // bezier = bezier||false;
  //
  // var nCols = intervalsFlowTable[0].length;
  // var dX = frame.width/(nCols-1);
  // var dY = frame.height;
  //
  // var point;
  //
  // var intervalList;
  // var lastIntervalList = intervalsFlowTable[nElements-1];
  // var sY = 0;
  // var mY = 0;
  // var x = frame.x;
  // var y = frame.y;
  //
  // var prevPoint;
  // var prevYsup;
  // var prevsY;
  // var newYsup;
  //
  // var offX;// = dX*0.45;
  //
  // for(i=0; intervalsFlowTable[i]!=null; i++){
  // intervalList = intervalsFlowTable[i];
  //
  // context.fillStyle = colors[i];
  // context.beginPath();
  //
  // //---->
  // sY = (1-lastIntervalList[0].y)*0.5*dY+i*mY+y;
  //
  // point = new Point(x, intervalList[0].y*dY+sY);
  // context.moveTo(point.x, point.y);
  //
  // prevPoint = point;
  //
  // for(j=1;j<nCols;j++){
  // sY = (1-lastIntervalList[j].y)*0.5*dY+i*mY+y;
  //
  // point = new Point(j*dX+x, intervalList[j].y*dY+sY);
  //
  // if(bezier){
  // offX = (point.x-prevPoint.x)*0.45;
  // context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
  // } else {
  // context.lineTo(point.x, point.y);
  // }
  //
  // prevPoint = point;
  // }
  //
  // //<-----
  // point = new Point((nCols-1)*dX+x, intervalList[nCols-1].x*dY+sY);
  // context.lineTo(point.x, point.y);
  // prevPoint = point;
  //
  // for(j=nCols-2;j>=0;j--){
  // sY = (1-lastIntervalList[j].y)*0.5*dY+i*mY+y;
  //
  // point = new Point(j*dX+x, intervalList[j].x*dY+sY);
  //
  //
  // if(bezier){
  // offX = (point.x-prevPoint.x)*0.45;
  // context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
  // } else {
  // context.lineTo(point.x, point.y);
  // }
  //
  // prevPoint = point;
  // }
  //
  // point = new Point(x, intervalList[0].x*dY+sY);
  // context.lineTo(point.x, point.y);
  //
  // context.fill();
  //
  // }
};



DrawSimpleVis.drawIntervalsWordsFlowTable = function(context, intervalsFlowTable, frame, texts, colors) {
  console.log("[!] MOVED TO IntervalTableDraw.js");
  // var nElements = intervalsFlowTable.length;
  //
  // var i;
  // var j;
  //
  // colors = colors==null?ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements):colors;
  // frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
  //
  // var nCols = intervalsFlowTable[0].length;
  // var dX = frame.width/(nCols-1);
  // var dY = frame.height;
  //
  // var point0;
  // var point1;
  //
  // var nextPoint0;
  // var nextPoint1;
  //
  // var point0Prev = new Point();
  // var point1Prev = new Point();
  //
  // var center;
  // var size;
  //
  // var intervalList;
  // var lastIntervalList = intervalsFlowTable[nElements-1];
  // var sY = 0;
  // var x = frame.x;
  // var y = frame.y;
  //
  // var offX;
  //
  // var text;
  //
  // context.strokeStyle = "rgba(255,255,255,0.4)";
  //
  // context.textBaseline = "top";
  // context.textAlign = "left";
  //
  // var position;
  // var xx;
  // var t;
  // var jumpX = dX;
  // //var lastT=0;
  // var valueLastInterval;
  // var valueX;
  // var valueY;
  // var nChar;
  // var selectedChar;
  // var charWidth;
  // var fontSize;
  //
  // var offX;
  //
  // var factX = (nCols-1)/frame.width;
  //
  // var xj0;
  // var xj1;
  //
  //
  // for(i=0; intervalsFlowTable[i]!=null; i++){
  // intervalList = intervalsFlowTable[i];
  //
  // text = " "+texts[i];
  //
  // xx=0;
  // nChar=0;
  //
  // position=0;
  // j=0;
  // t=0;
  //
  // //console.log("-");
  //
  // sY = (1-lastIntervalList[0].y)*0.5*dY+y;
  // point0 = new Point(x, intervalList[0].x*dY+sY);
  // point1 = new Point(x, intervalList[0].y*dY+sY);
  //
  // do {
  // nChar++;
  // size = (point1.y-point0.y);
  // fontSize = Math.floor(0.3*size+1);
  // context.font         =  fontSize+'px Arial';
  // selectedChar = text.charAt(nChar%text.length);
  // charWidth = context.measureText(selectedChar).width+2;
  // jumpX = charWidth*0.9;
  //
  // xx+=jumpX;
  // position = factX*xx;
  // j = Math.floor(position);
  // t = position - j;
  //
  //
  // if(j+2>nCols) continue;
  //
  // //valueLastInterval = (1-t)*lastIntervalList[j].y + t*lastIntervalList[j+1].y;
  //
  // xj0 = j/factX;
  // xj1 = (j+1)/factX;
  //
  // offX = factX*0.45;
  // valueLastInterval = DrawSimpleVis._bezierValue(xj0, xj1, lastIntervalList[j].y, lastIntervalList[j+1].y, t, offX);
  //
  //
  // prevsY = sY;
  // sY = (1-valueLastInterval)*0.5*dY+y;
  //
  //
  // point0Prev.x = point0.x;
  // point0Prev.y = point0.y;
  // point1Prev.x = point1.x;
  // point1Prev.y = point1.y;
  //
  //
  // //valueX = (1-t)*intervalList[j].x + t*intervalList[j+1].x;
  // //valueY = (1-t)*intervalList[j].y + t*intervalList[j+1].y;
  //
  // valueX = DrawSimpleVis._bezierValue(xj0, xj1, intervalList[j].x, intervalList[j+1].x, t, offX);
  // valueY = DrawSimpleVis._bezierValue(xj0, xj1, intervalList[j].y, intervalList[j+1].y, t, offX);
  //
  //
  // point0 = new Point(xx+x, valueX*dY+sY);
  // point1 = new Point(xx+x, valueY*dY+sY);
  //
  //
  // center = new Point(point0Prev.x+jumpX*0.5, (point0.y+point1.y+point0Prev.y+point1Prev.y)*0.25);
  //
  // //console.log(jumpX);
  //
  // context.fillStyle = colors[i];
  // //context.beginPath();
  //
  // //boundaries
  // // context.beginPath();
  // // context.moveTo(point0Prev.x, point0Prev.y);
  // // context.lineTo(point0.x, point0.y);
  // // context.lineTo(point1.x, point1.y); //move/line to draw or not vertical
  // // context.lineTo(point1Prev.x, point1Prev.y);
  // // context.stroke();
  //
  //
  // if(size>1){
  // //context.fillText(selectedChar,center.x, center.y);
  // context.save();
  // context.globalAlpha = size/20;
  // DrawTextsAdvanced.textOnQuadrilater(selectedChar, point0Prev, point0, point1, point1Prev, fontSize, 1);
  // context.restore();
  // }
  // } while(j+1<nCols);
  // }
};

// DrawSimpleVis._bezierValue = function(x0, x1, y0, y1, t, offX){
// //return y0*(1-t)+y1*t;
// var u = 1-t;
// var p0 = new Point(x0+ t*offX, y0);
// var p1 = new Point(u*(x0+offX) + t*(x1-offX), u*y0 + t*y1);
// var p2 = new Point(x1-u*offX, y1);
//
// var P0 = new Point(u*p0.x + t*p1.x, u*p0.y + t*p1.y);
// var P1 = new Point(u*p1.x + t*p2.x, u*p1.y + t*p2.y);
//
// return u*P0.y + t*P1.y;
// }


DrawSimpleVis.drawStackBarsFlowTable = function(context, intervalsFlowTable, frame, colors) { //TODO: +efficiency
  var nElements = intervalsFlowTable.length;

  var i;
  var j;

  colors = colors == null ? ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements) : colors;
  frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;

  var nCols = intervalsFlowTable[0].length;
  var dX = frame.width / (nCols - 1);
  var dY = frame.height;

  var point0;
  var point1;
  var point2;
  var point3;

  var intervalList;
  var lastIntervalList = intervalsFlowTable[nElements - 1];
  var sY = 0;
  var mY = 0;
  var x = frame.x;
  var y = frame.y;

  context.strokeStyle = "white";

  for(i = 0; intervalsFlowTable[i] != null; i++) {
    intervalList = intervalsFlowTable[i];

    //---->
    sY = (1 - lastIntervalList[0].y) * 0.5 * dY + i * mY + y;

    for(j = 1; j < nCols; j++) {
      sY = (1 - lastIntervalList[j].y) * 0.5 * dY + i * mY + y;

      point0 = new Point(j * dX + x, intervalList[j].x * dY + sY);
      point1 = new Point((j + 1) * dX + x, intervalList[j].x * dY + sY);
      point2 = new Point((j + 1) * dX + x, intervalList[j].y * dY + sY);
      point3 = new Point(j * dX + x, intervalList[j].y * dY + sY);

      context.fillStyle = colors[i];
      context.beginPath();
      context.moveTo(point0.x, point0.y);
      context.lineTo(point1.x, point1.y);
      context.lineTo(point2.x, point2.y);
      context.lineTo(point3.x, point3.y);
      context.lineTo(point0.x, point0.y);
      context.fill();
    }
    context.fill();
  }
};

// DrawSimpleVis.drawNetworMatrix = function(network, frame, colors, relationsColorScaleFunction, margin, directed){
// relationsColorScaleFunction = relationsColorScaleFunction==null?ColorOperators.grayScale:relationsColorScaleFunction;
// margin = margin==null?2:margin;
// directed = directed==null?false:directed;
//
// var i;
// var nodeList = network.nodeList;
// var relationList = network.relationList;
// var relation;
//
// var dX = frame.width/(nodeList.length+1);
// var dY = frame.height/(nodeList.length+1);
// var w=dX-margin;
// var h=dY-margin;
//
// var ix;
// var iy;
//
// for(i=0;nodeList[i]!=null;i++){
// context.fillStyle = colors[i];
// context.fillRect(frame.x+(i+1)*dX, frame.y, w, h);
// context.fillRect(frame.x, frame.y+(i+1)*dY, w, h);
// }
//
// for(i=0;relationList[i]!=null;i++){
// relation = relationList[i];
// context.fillStyle = relationsColorScaleFunction(relation.weight);
// ix = nodeList.indexOf(relation.node0)+1;
// iy = nodeList.indexOf(relation.node1)+1;
// context.fillRect(frame.x+ix*dX, frame.y+iy*dY, w, h);
// if(!directed && (ix!=iy)){
// context.fillRect(frame.x+iy*dX, frame.y+ix*dY, w, h);
// }
// }
// }
