import GeometryOperators from "src/operators/geometry/GeometryOperators";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import { TwoPi } from "src/Global";


//TODO: delete many functions that are deprectaed, replaced by SimpleGraphics.js functions

//include(frameworksRoot+"operators/geometry/GeometryOperators.js");
/**
 * @classdesc Draw basic shapes
 *
 * @namespace
 * @category drawing
 */
function Draw() {}
export default Draw;


/**
 * modes:
 * 0: adjust to rectangle
 * 1: center and mask
 * 2: center and eventual reduction (image smaller than rectangle)
 * 3: adjust to rectangle preserving proportions (image bigger than rectangle)
 * 4: fill repeated from corner
 * 5: fill repeated from 0,0
 */
Draw.fillRectangleWithImage = function(rectangle, image, mode, backColor, graphics) {
  if(backColor != null) {
    graphics.context.fillStyle = backColor;
    graphics.context.beginPath();
    graphics.context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    graphics.context.fill();
  }

  var sx;
  var sy;
  var dx;
  var dy;
  var dWidth;
  var dHeight;

  switch(mode) {

    case 0:
      graphics.context.drawImage(image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      break;
    case 1:
      sx = Math.max(image.width - rectangle.width, 0) * 0.5;
      sy = Math.max(image.height - rectangle.height, 0) * 0.5;
      dx = rectangle.x + Math.max(rectangle.width - image.width, 0) * 0.5;
      dy = rectangle.y + Math.max(rectangle.height - image.height, 0) * 0.5;
      dWidth = Math.min(image.width, rectangle.width);
      dHeight = Math.min(image.height, rectangle.height);
      graphics.context.drawImage(image, sx, sy, dWidth, dHeight, dx, dy, dWidth, dHeight);
      break;
    case 2:
      sx = Math.max(image.width - rectangle.width, 0);
      sy = Math.max(image.height - rectangle.height, 0);
      dWidth = Math.min(image.width, rectangle.width);
      dHeight = Math.min(image.height, rectangle.height);
      var propD = dWidth / dHeight;
      var propB = image.width / image.height;
      if(propD < propB) dHeight = dWidth / propB;
      if(propD > propB) dWidth = dHeight / propB;
      dx = rectangle.x + (rectangle.width - dWidth) * 0.5;
      dy = rectangle.y + (rectangle.height - dHeight) * 0.5;
      graphics.context.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight);
      break;
    case 3:
      var sh, sw;
      if(rectangle.width / rectangle.height < image.width / image.height) {
        sh = image.height;
        sw = sh * rectangle.width / rectangle.height;
        sx = 0.5 * (image.width - sw);
        sy = 0;

      } else {
        sw = image.width;
        sh = sw * rectangle.height / rectangle.width;
        sx = 0;
        sy = 0.5 * (image.height - sh);

      }
      graphics.context.drawImage(image, sx, sy, sw, sh, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      break;
    case 4:
      break;
    case 5:
      break;
  }
};

/**
 * @todo write docs
 */
Draw.drawBezierPolygonTransformed = function(bezierPolygon, transformationFunction, graphics) {
  if(bezierPolygon == null ||  bezierPolygon.length === 0) return;

  var bI;
  var N = Math.floor((bezierPolygon.length - 1) / 3);
  var i;
  var p0 = transformationFunction(bezierPolygon[0]);
  var p1;
  var p2;

  graphics.context.moveTo(p0.x, p0.y);
  for(i = 0; i < N; i++) {
    bI = i * 3 + 1;

    p0 = transformationFunction(bezierPolygon[bI]);
    p1 = transformationFunction(bezierPolygon[bI + 1]);
    p2 = transformationFunction(bezierPolygon[bI + 2]);

    graphics.context.bezierCurveTo(
      p0.x, p0.y,
      p1.x, p1.y,
      p2.x, p2.y
    );
  }
};

/**
 * @todo write docs
 */
Draw.prototype.drawPolygonTransformed = function(polygon, transformationFunction, graphics) {
  var p = transformationFunction(polygon[0]);
  graphics.context.moveTo(p.x, p.y);
  for(var i = 0; polygon[i] != null; i++) {
    p = transformationFunction(polygon[i]);
    graphics.context.lineTo(p.x, p.y);
  }
};


/**
 * @todo write docs
 */
Draw.prototype.drawSliderRectangle = function(x, y, width, height, graphics) {
  graphics.context.arc(x + width * 0.5, y, width * 0.5, Math.PI, TwoPi);
  graphics.context.lineTo(x + width, y);
  graphics.context.arc(x + width * 0.5, y + height, width * 0.5, 0, Math.PI);
  graphics.context.lineTo(x, y);
  //context.fillRect(x, y, width, height);
};

/**
 * @todo write docs
 */
Draw.drawRectangles = function(rectangleList, x, y, colors, margin, bitmapDataList, bitmapDataDrawMode, graphics) {
  margin = margin || 0;
  var twoMargin = 2 * margin;
  var i;
  var rect;
  var nColors;
  if(colors != null) {
    nColors = colors.length;
  }
  var adjustedRect = new Rectangle();
  for(i = 0; rectangleList[i] != null; i++) {
    rect = rectangleList[i];
    if(rect.height <= margin || rect.width <= margin) continue;
    if(colors != null) graphics.context.fillStyle = colors[i % nColors];
    graphics.context.fillRect(rect.x + x + margin, rect.y + y + margin, rect.width - twoMargin, rect.height - twoMargin);
    if(bitmapDataList != null && bitmapDataList[i] != null) {
      adjustedRect.x = rect.x + x + margin;
      adjustedRect.y = rect.y + y + margin;
      adjustedRect.width = rect.width - twoMargin;
      adjustedRect.height = rect.height - twoMargin;
      this.fillRectangleWithImage(graphics.context, adjustedRect, bitmapDataList[i], bitmapDataDrawMode);
    }
  }
};

/**
 * @todo write docs
 */
Draw.drawHorizontalFlowPiece = function(x0, x1, y0U, y0D, y1U, y1D, offX, graphics) {
  graphics.context.moveTo(x0, y0U);
  graphics.context.bezierCurveTo(x0 + offX, y0U, x1 - offX, y1U, x1, y1U);
  graphics.context.lineTo(x1, y1D);
  graphics.context.bezierCurveTo(x1 - offX, y1D, x0 + offX, y0D, x0, y0D);
  graphics.context.lineTo(x0, y0U);
};


/**
 * @todo write docs
 * it assumes that both circles centers have same y coordinates
 */
Draw.drawLens = function(circle0, circle1, graphics) {
  if(circle1.x < circle0.x) {
    var _circle = circle1.clone();
    circle1 = circle0.clone();
    circle0 = _circle;
  }
  if(circle1.x + circle1.z <= circle0.x + circle0.z) {
    graphics.context.arc(circle1.x, circle1.y, circle1.z, 0, TwoPi);
    return;
  } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
    graphics.context.arc(circle0.x, circle0.y, circle0.z, 0, TwoPi);
    return;
  }

  var angles = GeometryOperators.circlesLensAngles(circle0, circle1);

  graphics.context.arc(circle0.x, circle0.y, circle0.z, angles[0], angles[1]);
  graphics.context.arc(circle1.x, circle1.y, circle1.z, angles[2], angles[3]);
};

/**
 * @todo write docs
 */
Draw.drawArrowTriangle = function(p0, p1, base, graphics) {
  var angle = p0.angleToPoint(p1);
  var height = p0.distanceToPoint(p1);
  graphics.drawTriangleFromBase(p0.x, p0.y, base, height, angle);
};
