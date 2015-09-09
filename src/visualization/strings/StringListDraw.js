import List from "src/dataTypes/lists/List";
import Table from "src/dataTypes/lists/Table";
import Point from "src/dataTypes/geometry/Point";
import NumberList from "src/dataTypes/numeric/NumberList";
import Polygon from "src/dataTypes/geometry/Polygon";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import DrawTexts from "src/tools/graphic/DrawTexts";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/**
 * @classdesc Operators that contain visualization method algoritms and return a Table with parameters for StringListPrimitive
 *
 * @namespace
 * @category drawing
 */
function StringListDraw() {}
export default StringListDraw;

/**
 * @todo write docs
 */
StringListDraw.simpleTagCloud = function(stringList, weights, frame, font, interLineFactor, graphics) {
  font = font == null ? 'Arial' : font;
  interLineFactor = interLineFactor == null ? 1.2 : interLineFactor;

  var i;
  var j;
  var xx;
  var yy;
  var tag;
  var wT;

  var sT;
  var maxST;

  var K = 20;
  var i0Line;

  var normWeigths = NumberListOperators.normalizedToMax(weights);

  var sizes;
  var positions;

  var notFinished = true;

  var trys = 0;

  while(notFinished) {
    var interLine = K * interLineFactor;
    xx = 0;
    yy = 0; //interLine;
    maxST = 0;
    i0Line = 0;

    sizes = new NumberList();
    positions = new Polygon();

    for(i = 0; stringList[i] != null; i++) {
      tag = stringList[i];
      sT = Math.floor(Math.sqrt(normWeigths[i]) * K);

      sizes.push(sT);

      graphics.context.font = String(sT) + 'px ' + font;
      wT = graphics.context.measureText(tag).width;

      if(xx + wT > frame.width) {
        xx = 0;
        yy += (maxST * interLineFactor + 1);
        maxST = 0;
        for(j = i0Line; j < i; j++) {
          positions[j].y = yy;
        }
        i0Line = i;
      }

      maxST = Math.max(maxST, sT);
      positions.push(new Point(xx, yy));
      xx += wT + sT * 0.2;
    }

    yy += (maxST * interLineFactor + 1);
    for(j = i0Line; stringList[j] != null; j++) {
      positions[j].y = yy;
    }


    notFinished = false;
    if(yy < frame.height * 0.97) {
      K = 0.5 * K + 0.5 * K * frame.height / (yy + interLine);
      notFinished = true;
    }
    if(yy >= frame.height * 0.995) {
      K = 0.5 * K + 0.5 * K * frame.height / (yy + interLine);
      notFinished = true;
    }
    trys++;
    if(trys > 10) notFinished = false;
  }

  var table = new Table();
  table[0] = stringList;
  table[1] = positions;
  table[2] = sizes;

  return table;
};



/**
 * @todo write docs
 */
StringListDraw.tagCloudRectangles = function(stringList, weights, frame, mode, margin, graphics) {
  mode = mode == null ? 0 : mode;
  margin = margin == null ? 0 : margin;

  var normWeights = NumberListOperators.normalizedToMax(weights.sqrt());

  var roundSizes = (mode === 0);

  var rectangles = new List();
  var textSizes = new NumberList();

  var rectanglesPlaced = new List();

  var dL = 6;

  var a = 0;
  var r = 0;

  var px;
  var py;
  var center;
  var rMax = 0;

  switch(mode) {
    case 0: //open triangle
      px = frame.x;
      py = frame.y;
      break;
    case 2: //rectangle
      var jump = 5;
      var nStep = 0;
      var nSteps = 1;
      var pc = new Point();
      break;
    case 1: //circle
      px = 0;
      py = 0;
      center = frame.getCenter();
      break;
  }

  var w;
  var h;
  var prop = frame.width / frame.height;

  for(var i = 0; stringList[i] != null; i++) {
    textSizes[i] = roundSizes ? Math.round(normWeights[i] * 12) * dL : normWeights[i] * 12 * dL;

    DrawTexts.setContextTextProperties('black', textSizes[i], graphics.fontName, null, null, 'bold');
    w = Math.ceil((2 + graphics.context.measureText(stringList[i]).width) / dL) * dL;
    h = textSizes[i];

    switch(mode) {
      case 0: //open triangle
        while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
          px += dL;
          py -= dL;
          if(py < frame.y) {
            py = frame.y; //TODO this used to be p.x - but p is not defined.
            px = frame.x;
          }
        }
        break;
      case 1: //circle
        if(i === 0) {
          px = center.x - w * 0.5;
          py = center.y - h * 0.5;
        } else {
          a = i * 0.1;
          r = 0;
          while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
            r += 1;
            a += r * 0.005;

            px = center.x + prop * r * Math.cos(a) - w * 0.5;
            py = center.y + r * Math.sin(a) - h * 0.5;
          }
          rMax = Math.max(rMax, prop * r + w * 0.5);
        }
        break;
      case 2: //rectangle
        if(i === 0) {
          pc = center.clone();
          px = pc.x - w * 0.5;
          py = pc.y - h * 0.5;
        } else {
          nStep = 0;
          nSteps = 1;
          a = 0;
          pc = center.clone();
          while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
            nStep++;

            pc.x += prop * jump * Math.cos(a);
            pc.y += jump * Math.sin(a);

            px = pc.x - w * 0.5;
            py = pc.y - h * 0.5;

            if(nStep >= nSteps) {
              a += Math.PI * 0.5;
              nSteps += 0.5;
              nStep = 0;
            }
          }
          rMax = Math.max(Math.abs(pc.x - center.x) + w * 0.5, rMax);
        }
        break;

    }

    rectangles[i] = new Rectangle(px, py, w, h);
    rectanglesPlaced.push(rectangles[i]);
  }

  if(mode == 1 || mode == 2) {
    var rectangle;
    prop = 0.5 * frame.width / rMax;
    for(i = 0; rectangles[i] != null; i++) {
      rectangle = rectangles[i];
      rectangle.x = center.x + (rectangle.x - center.x) * prop;
      rectangle.y = center.y + (rectangle.y - center.y) * prop;
      rectangle.width *= prop;
      rectangle.height *= prop;
      textSizes[i] *= prop;
    }
  }

  var table = new Table();
  table[0] = stringList;
  table[1] = rectangles;
  table[2] = textSizes;

  return table;
};

/**
 * @ignore
 */
StringListDraw._pointInRectangles = function(rectangles, px, py, width, height, margin) {
  var rect;
  for(var i = 0; rectangles[i] != null; i++) {
    rect = rectangles[i];
    if(px + width > (rect.x - margin) && px < (rect.x + rect.width + margin) && (py + height) > (rect.y - margin) && py < (rect.y + rect.height + margin)) return true;
  }
  return false;
};