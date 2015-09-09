import MatrixGenerators from "src/operators/numeric/MatrixGenerators";
import Point from "src/dataTypes/geometry/Point";

/**
 * @classdesc Draw Texts Advanced
 *
 * @namespace
 * @category drawing
 */
function DrawTextsAdvanced() {}
export default DrawTextsAdvanced;

/**
 * @ignore
 */
// DrawTextsAdvanced.characterOnQuadrilater = function(context, character, p0, p1, p2, p3, fontType) {

// };


/**
 * @todo finish docs
 * works only with n=1
 */
DrawTextsAdvanced.textOnQuadrilater = function(text, p0, p1, p2, p3, fontSize, n, graphics) { //TODO:fix, finish
  n = n == null ? 0 : n;

  if(n == 1) {
    var p01 = new Point((p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
    var p03 = new Point((p0.x + p3.x) * 0.5, (p0.y + p3.y) * 0.5);
    var p23 = new Point((p2.x + p3.x) * 0.5, (p2.y + p3.y) * 0.5);
    var p12 = new Point((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5);
    var pc = new Point((p01.x + p23.x) * 0.5, (p01.y + p23.y) * 0.5);
    DrawTextsAdvanced.textOnQuadrilater(text, p0, p01, pc, p03, fontSize, 2);
    DrawTextsAdvanced.textOnQuadrilater(text, p01, p1, p12, pc, fontSize, 3);
    DrawTextsAdvanced.textOnQuadrilater(text, pc, p12, p2, p23, fontSize, 4);
    DrawTextsAdvanced.textOnQuadrilater(text, p03, pc, p23, p3, fontSize, 5);
    return;
  }
  var measure = graphics.context.measureText(text);
  var w = measure.width;
  var h = fontSize; // 64;//*96/72; //TODO: fix this

  var v0, v1, v2;
  switch(n) {
    case 0:
      v0 = new Point(0, 0);
      v1 = new Point(w, 0);
      v2 = new Point(0.000001, h + 0.000001);
      break;
    case 2:
      v0 = new Point(0, 0);
      v1 = new Point(w * 0.5, 0);
      v2 = new Point(0.000001, h * 0.5 + 0.000001);
      break;
    case 3:
      v0 = new Point(w * 0.5, 0);
      v1 = new Point(w, 0);
      v2 = new Point(w * 0.5 + 0.000001, h * 0.5 + 0.000001);
      break;
    case 4:
      v0 = new Point(w * 0.5, h * 0.5);
      v1 = new Point(w, h * 0.5);
      v2 = new Point(w * 0.5 + 0.000001, h + 0.000001);
      break;
    case 5:
      v0 = new Point(0, h * 0.5);
      v1 = new Point(w * 0.5, h * 0.5);
      v2 = new Point(0.000001, h + 0.000001);
      break;
  }


  graphics.context.save();
  DrawTextsAdvanced.applyTransformationOnCanvasFromPoints(v0, v1, v2, p0, p1, p3);

  graphics.context.beginPath();
  graphics.context.moveTo(v0.x - 2, v0.y - 2);
  graphics.context.lineTo(v1.x + 8, v1.y - 2);
  graphics.context.lineTo(v2.x - 2, v2.y + 8);
  graphics.context.clip();

  graphics.context.fillText(text, 0, 0);

  graphics.context.restore();


  v0.x = v1.x + 0.0001;
  v0.y = v2.y + 0.0001;

  graphics.context.save();

  DrawTextsAdvanced.applyTransformationOnCanvasFromPoints(v0, v1, v2, p2, p1, p3);

  graphics.context.beginPath();
  graphics.context.moveTo(v0.x + 4, v0.y + 2);
  graphics.context.lineTo(v1.x + 4, v1.y - 2);
  graphics.context.lineTo(v2.x - 2, v2.y + 2);
  graphics.context.clip();

  graphics.context.fillText(text, 0, 0);

  graphics.context.restore();
};

/**
 * @todo finish docs
 */
DrawTextsAdvanced.applyTransformationOnCanvasFromPoints = function(v0, v1, v2, w0, w1, w2, graphics) { //TODO:find the correct place for this
  var M = MatrixGenerators.createMatrixFromTrianglesMapping(v0, v1, v2, w0, w1, w2);
  graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);
};

/**
 * @todo finish docs
 */
DrawTextsAdvanced.mapRectangleIntoQuadrilater = function(image, xI, yI, wI, hI, v0, v1, v2, v3, graphics) { //TODO:find the correct place for this
  graphics.context.save();

  var M = MatrixGenerators.createMatrixFromTrianglesMapping(new Point(0, 0), new Point(100, 0), new Point(100, 100), v0, v1, v2);
  graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);

  graphics.context.beginPath();
  graphics.context.moveTo(0, 0);
  graphics.context.lineTo(100, 0);
  graphics.context.lineTo(100, 100);
  graphics.context.lineTo(0, 0);
  graphics.context.clip();

  graphics.context.drawImage(image,
    xI, yI, wI, hI,
    0, 0, 100, 100);


  graphics.context.restore();

  //

  graphics.context.save();

  M = MatrixGenerators.createMatrixFromTrianglesMapping(new Point(0, 0), new Point(0, 2), new Point(2, 2), v0, v3, v2);
  graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);

  graphics.context.beginPath();
  graphics.context.moveTo(0, 0);
  graphics.context.lineTo(0, 2);
  graphics.context.lineTo(2, 2);
  graphics.context.lineTo(0, 0);
  graphics.context.clip();

  graphics.context.drawImage(image,
    xI, yI, wI, hI,
    0, 0, 2, 2);


  graphics.context.restore();
};

/**
 * @todo finish docs
 */
DrawTextsAdvanced.getClippedTrianglesData = function(image, xI, yI, wI, hI, graphics) {
  var object = {};

  graphics.context.clearRect(0, 0, wI, hI);
  graphics.context.save();

  graphics.context.beginPath();
  graphics.context.moveTo(0, 0);
  graphics.context.lineTo(wI, 0);
  graphics.context.lineTo(wI, hI);
  graphics.context.lineTo(0, 0);
  graphics.context.clip();

  graphics.context.drawImage(image,
    xI, yI, wI, hI,
    0, 0, wI, hI);

  object.dataTriangle0 = graphics.context.getImageData(0, 0, wI, hI);

  graphics.context.restore();

  //
  graphics.context.clearRect(0, 0, wI, hI);
  graphics.context.save();

  graphics.context.beginPath();
  graphics.context.moveTo(0, 0);
  graphics.context.lineTo(0, hI);
  graphics.context.lineTo(wI, hI);
  graphics.context.lineTo(0, 0);
  graphics.context.clip();

  graphics.context.drawImage(image,
    xI, yI, wI, hI,
    0, 0, wI, hI);

  object.dataTriangle1 = graphics.context.getImageData(0, 0, wI, hI);

  graphics.context.restore();

  return object;
};


/**
 * @todo finish docs
 */
DrawTextsAdvanced.typodeOnQuadrilater = function(text, p0, p1, p2, p3, graphics) { //TODO:fix, finish
  var dX = p1.x - p0.x;
  var h0 = p3.y - p0.y;
  var h1 = p2.y - p1.y;

  graphics.context.lineWidth = 0.01 + (h0 + h1) / 100;
  if(dX < 1.8) return;

  var polygonList = typodeObject[text];
  //c.log(text, polygonList.length);
  var polygon;
  var j;
  var t;
  var mint;

  for(var i = 0; polygonList[i] != null; i++) {
    polygon = polygonList[i];
    graphics.context.beginPath();
    t = polygon[0].x;
    mint = 1 - t;
    graphics.context.moveTo(Math.floor(t * dX + p0.x) + 0.5, Math.floor(polygon[0].y * (mint * h0 + t * h1) + mint * p0.y + t * p1.y) + 0.5);
    for(j = 1; polygon[j] != null; j++) {
      t = polygon[j].x;
      mint = 1 - t;
      graphics.context.lineTo(Math.floor(t * dX + p0.x) + 0.5, Math.floor(polygon[j].y * (mint * h0 + t * h1) + mint * p0.y + t * p1.y) + 0.5);
    }
    graphics.context.stroke();
  }

};
