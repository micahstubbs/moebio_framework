//TODO: delete many functions that are deprectaed, replaced by SimpleGraphics.js functions

//include(frameworksRoot+"operators/geometry/GeometryOperators.js");
/**
 * @classdesc Draw basic shapes
 * 
 * @namespace
 * @category geometry
 */
function Draw() {}

Draw.drawSmoothPolygon = function(polygon, closed, amount) { //TODO: add tx, ty
  amount = amount == null ? 30 : amount;
  var controlPoints;

  if(polygon.length < 2) return null;
  if(polygon.length == 2) {
    var a = Math.atan2(polygon[1].y - polygon[0].y, polygon[1].x - polygon[0].x) - 0.5 * Math.PI;
    var cosa = amount * Math.cos(a);
    var sina = amount * Math.sin(a);
    context.moveTo(polygon[0].x, polygon[0].y);
    context.bezierCurveTo(
      polygon[0].x + cosa, polygon[0].y + sina,
      polygon[1].x + cosa, polygon[1].y + sina,
      polygon[1].x, polygon[1].y
    );
    context.bezierCurveTo(
      polygon[1].x - cosa, polygon[1].y - sina,
      polygon[0].x - cosa, polygon[0].y - sina,
      polygon[0].x, polygon[0].y
    );
    return;
  }
  var i;
  var nPoints = polygon.length;
  var prevPoint = polygon[nPoints - 1];
  var point = polygon[0];
  var nextPoint = polygon[1];
  controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
  var prevCP = controlPoints[1];
  var cP;
  context.moveTo(point.x, point.y);
  prevPoint = point;
  var nSteps = nPoints + Number(closed);
  for(i = 1; i < nSteps; i++) {
    point = polygon[i % nPoints];
    nextPoint = polygon[(i + 1) % nPoints];
    controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
    cP = controlPoints[0];
    context.bezierCurveTo(prevCP.x, prevCP.y, cP.x, cP.y, point.x, point.y);
    prevCP = controlPoints[1];
    prevPoint = point;
  }
};

/**
 * modes:
 * 0: adjust to rectangle
 * 1: center and mask
 * 2: center and eventual reduction (image smaller than rectangle)
 * 3: adjust to rectangle preserving proportions (image bigger than rectangle)
 * 4: fill repeated from corner
 * 5: fill repeated from 0,0
 */
Draw.fillRectangleWithImage = function(rectangle, image, mode, backColor) {
  if(backColor != null) {
    context.fillStyle = backColor;
    context.beginPath();
    context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.fill();
  }

  var sx;
  var sy;
  var dx;
  var dy;
  var dWidth;
  var dHeight;

  switch(mode) {

    case 0:
      context.drawImage(image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      break;
    case 1:
      sx = Math.max(image.width - rectangle.width, 0) * 0.5;
      sy = Math.max(image.height - rectangle.height, 0) * 0.5;
      dx = rectangle.x + Math.max(rectangle.width - image.width, 0) * 0.5;
      dy = rectangle.y + Math.max(rectangle.height - image.height, 0) * 0.5;
      dWidth = Math.min(image.width, rectangle.width);
      dHeight = Math.min(image.height, rectangle.height);
      context.drawImage(image, sx, sy, dWidth, dHeight, dx, dy, dWidth, dHeight);
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
      context.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight);
      break;
    case 3:
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
      context.drawImage(image, sx, sy, sw, sh, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      break;
    case 4:
      break;
    case 5:
      break;
  }
};


/**
 * Draws an ellipse using the current state of the canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {Number} x The center x coordinate
 * @param {Number} y The center y coordinate
 * @param {Number} rW The horizontal radius of the ellipse
 * @param {Number} rH The vertical radius of the ellipse

 */
Draw.drawEllipse = function(x, y, rW, rH) {
  var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
    ox = rW * k, // control point offset horizontal
    oy = rH * k, // control point offset vertical
    xe = x + rW, // x-end
    ye = y + rH; // y-end

  context.moveTo(x - rW, y);
  context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  context.moveTo(x - rW, y);
};

/**
 * Draws a polygon
 * @param {CanvasRenderingContext2D} context
 * @param {Polygon} Polygon to draw
 * @param {Boolean} close polygon
 * @param {Number} tx horizontal translation
 * @param {Number} ty vertical translation
 */
Draw.drawPolygon = function(polygon, close, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var i;
  context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
  for(i = 1; polygon[i] != null; i++) {
    context.lineTo(tx + polygon[i].x, ty + polygon[i].y);
  }
  if(close) {
    context.lineTo(tx + polygon[0].x, ty + polygon[0].y);
  }
};

Draw.drawPolygonWithControlPoints = function(polygon, controlPoints, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var i;
  context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
  for(i = 1; polygon[i] != null; i++) {
    context.bezierCurveTo(tx + controlPoints[(i - 1) * 2].x, ty + controlPoints[(i - 1) * 2].y,
      tx + controlPoints[i * 2 - 1].x, ty + controlPoints[i * 2 - 1].y,
      tx + polygon[i].x, ty + polygon[i].y);
  }
};

Draw.drawBezierPolygon = function(bezierPolygon, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var bI;
  var N = Math.floor((bezierPolygon.length - 1) / 3);
  var i;
  context.moveTo(tx + bezierPolygon[0].x, ty + bezierPolygon[0].y);
  for(i = 0; i < N; i++) {
    bI = i * 3 + 1;

    context.bezierCurveTo(
      tx + bezierPolygon[bI].x, ty + bezierPolygon[bI].y,
      tx + bezierPolygon[bI + 1].x, ty + bezierPolygon[bI + 1].y,
      tx + bezierPolygon[bI + 2].x, ty + bezierPolygon[bI + 2].y
    );
  }
};

Draw.drawBezierPolygonTransformed = function(bezierPolygon, transformationFunction) {
  if(bezierPolygon == null ||  bezierPolygon.length == 0) return;

  var bI;
  var N = Math.floor((bezierPolygon.length - 1) / 3);
  var i;
  var p0 = transformationFunction(bezierPolygon[0]);
  var p1;
  var p2;

  context.moveTo(p0.x, p0.y);
  for(i = 0; i < N; i++) {
    bI = i * 3 + 1;

    p0 = transformationFunction(bezierPolygon[bI]);
    p1 = transformationFunction(bezierPolygon[bI + 1]);
    p2 = transformationFunction(bezierPolygon[bI + 2]);

    context.bezierCurveTo(
      p0.x, p0.y,
      p1.x, p1.y,
      p2.x, p2.y
    );
  }
};

Draw.drawPolygonTransformed = function(polygon, transformationFunction) {
  var p = transformationFunction(polygon[0]);
  context.moveTo(p.x, p.y);
  for(i = 0; polygon[i] != null; i++) {
    p = transformationFunction(polygon[i]);
    context.lineTo(p.x, p.y);
  }
};


Draw.drawSliderRectangle = function(x, y, width, height) {
  context.arc(x + width * 0.5, y, width * 0.5, Math.PI, TwoPi);
  context.lineTo(x + width, y);
  context.arc(x + width * 0.5, y + height, width * 0.5, 0, Math.PI);
  context.lineTo(x, y);
  //context.fillRect(x, y, width, height);
};



/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} context
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 */
Draw.drawRoundRect = function(x, y, width, height, radius) {
  radius = radius || 0;
  var bottom = y + height;
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, bottom, x + width - radius, bottom);
  context.lineTo(x + radius, bottom);
  context.quadraticCurveTo(x, bottom, x, bottom - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
};

Draw.drawEquilateralTriangle = function(x, y, radius, angle) { //deprecated
  angle = angle || 0;
  context.moveTo(radius * Math.cos(angle) + x, radius * Math.sin(angle) + y);
  context.lineTo(radius * Math.cos(angle + 2.0944) + x, radius * Math.sin(angle + 2.0944) + y);
  context.lineTo(radius * Math.cos(angle + 4.1888) + x, radius * Math.sin(angle + 4.1888) + y);
  context.lineTo(radius * Math.cos(angle) + x, radius * Math.sin(angle) + y);
};

Draw.drawArrowTriangle = function(p0, p1, base) {
  var angle = p0.angleToPoint(p1);
  var height = p0.distanceToPoint(p1);
  Draw.drawTriangleFromBase(p0.x, p0.y, base, height, angle);
};

Draw.drawTriangleFromBase = function(x, y, base, height, angle) {
  context.moveTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
  context.lineTo(x + 0.5 * base * Math.cos(angle - Math.PI * 0.5), y + 0.5 * base * Math.sin(angle - Math.PI * 0.5));
  context.lineTo(x + height * Math.cos(angle), y + height * Math.sin(angle));
  context.lineTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
};

Draw.drawHorizontalFlowPiece = function(x0, x1, y0U, y0D, y1U, y1D, offX) {
  context.moveTo(x0, y0U);
  context.bezierCurveTo(x0 + offX, y0U, x1 - offX, y1U, x1, y1U);
  context.lineTo(x1, y1D);
  context.bezierCurveTo(x1 - offX, y1D, x0 + offX, y0D, x0, y0D);
  context.lineTo(x0, y0U);
};



Draw.drawRectangles = function(rectangleList, x, y, colors, margin, bitmapDataList, bitmapDataDrawMode) {
  margin = margin || 0;
  var twoMargin = 2 * margin;
  var i;
  var rect;
  if(colors != null) var nColors = colors.length;
  var adjustedRect = new Rectangle();
  for(i = 0; rectangleList[i] != null; i++) {
    rect = rectangleList[i];
    if(rect.height <= margin || rect.width <= margin) continue;
    if(colors != null) context.fillStyle = colors[i % nColors];
    context.fillRect(rect.x + x + margin, rect.y + y + margin, rect.width - twoMargin, rect.height - twoMargin);
    if(bitmapDataList != null && bitmapDataList[i] != null) {
      adjustedRect.x = rect.x + x + margin;
      adjustedRect.y = rect.y + y + margin;
      adjustedRect.width = rect.width - twoMargin;
      adjustedRect.height = rect.height - twoMargin;
      Draw.fillRectangleWithImage(context, adjustedRect, bitmapDataList[i], bitmapDataDrawMode);
    }
  }
};

Draw.drawQuadrilater = function(p0, p1, p2, p3, close) {
  close = close == null ? true : close;
  context.moveTo(p0.x, p0.y);
  context.lineTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.lineTo(p3.x, p3.y);
  if(close) context.lineTo(p0.x, p0.y);
};

/**
 * it assumes that both circles centers have same y coordinates
 */
Draw.drawLens = function(circle0, circle1) {
  if(circle1.x < circle0.x) {
    var _circle = circle1.clone();
    circle1 = circle0.clone();
    circle0 = _circle;
  }
  if(circle1.x + circle1.z <= circle0.x + circle0.z) {
    context.arc(circle1.x, circle1.y, circle1.z, 0, TwoPi);
    return;
  } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
    context.arc(circle0.x, circle0.y, circle0.z, 0, TwoPi);
    return;
  }

  var angles = GeometryOperators.circlesLensAngles(circle0, circle1);

  context.arc(circle0.x, circle0.y, circle0.z, angles[0], angles[1]);
  context.arc(circle1.x, circle1.y, circle1.z, angles[2], angles[3]);
};



Draw.drawAndCapture = function(drawFunction, frame, target) {

  var defaultContext = context;
  context = hiddenContext;
  context.canvas.setAttribute('width', frame.width);
  context.canvas.setAttribute('height', frame.height);
  context.clearRect(0, 0, frame.width, frame.height);

  context.translate(-frame.x, -frame.y);

  drawFunction.call(target);

  var image = new Image();
  image.src = context.canvas.toDataURL();

  context = defaultContext;
  return image;
};
