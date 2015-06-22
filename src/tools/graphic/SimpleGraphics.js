import { context, TwoPi, mX, mY, mP, canvas } from 'src/Global';
import Polygon from 'src/dataStructures/geometry/Polygon';
import Point from 'src/dataStructures/geometry/Point';
import GeometryOperators from 'src/operators/geometry/GeometryOperators';

/**
 * @module SimpleGraphics
 *
 * @classdesc Graphic and text methods globally accesible
 * that work with context.
 */


//drawing

/**
 * Draws a filled in Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setFill('steelblue');
 * fRect(10, 10, 40, 40);
 *
 */
export function fRect(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  context.fillRect(x, y, width, height);
};

/**
 * Draws a stroked Rectangle - showing just an outline.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setStroke('orange');
 * sRect(10, 10, 40, 40);
 *
 */
export function sRect(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  context.strokeRect(x, y, width, height);
};

/**
 * Draws a filled and stroked Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * fsRect(10, 10, 40, 40);
 *
 */
export function fsRect(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  context.fillRect(x, y, width, height);
  context.strokeRect(x, y, width, height);
};

/**
 * Draws a filled in Circle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setFill('steelblue');
 * fCircle(40, 40, 20);
 *
 */
export function fCircle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.fill();
};

/**
 * Draws a stroked Circle.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setStroke('orange');
 * sCircle(40, 40, 20);
 *
 */
export function sCircle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.stroke();
};

/**
 * Draws a filled and stroked Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setStroke('steelblue');
 * sCircle(40, 40, 20);
 *
 */
export function fsCircle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.fill();
  context.stroke();
};

/**
 * Draws a filled in Ellipse.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setFill('steelblue');
 * fEllipse(40, 40, 20, 30);
 */
export function fEllipse(x, y, rW, rH) {
  var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
    ox = rW * k, // control point offset horizontal
    oy = rH * k, // control point offset vertical
    xe = x + rW, // x-end
    ye = y + rH; // y-end
  context.beginPath();
  context.moveTo(x - rW, y);
  context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  context.moveTo(x - rW, y);
  context.closePath();
  context.fill();
};

/**
 * Draws a stroked Ellipse.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setStroke('orange');
 * sEllipse(40, 40, 20, 30);
 */
export function sEllipse(x, y, rW, rH) {
  var k = 0.5522848,
    ox = rW * k,
    oy = rH * k,
    xe = x + rW,
    ye = y + rH;
  context.beginPath();
  context.moveTo(x - rW, y);
  context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  context.moveTo(x - rW, y);
  context.closePath();
  context.stroke();
};

/**
 * Draws a filled and stroked Ellipse.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setFill('steelblue');
 * setStroke('steelblue');
 * fsEllipse(40, 40, 20, 30);
 */
export function fsEllipse(x, y, rW, rH) {
  var k = 0.5522848,
    ox = rW * k,
    oy = rH * k,
    xe = x + rW,
    ye = y + rH;
  context.beginPath();
  context.moveTo(x - rW, y);
  context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  context.moveTo(x - rW, y);
  context.closePath();
  context.fill();
  context.stroke();
};

/**
 * Draws a line from a start position to an end position
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @example
 * setStroke('black');
 * line(0, 0, 40, 40);
 */
export function line(x0, y0, x1, y1) {
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.stroke();
};

/**
 * Draws a bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo|bezierCurveTo}
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} cx0 First curve control point x position.
 * @param {Number} cy0 First cure control point y position.
 * @param {Number} cx1 Second curve control point x position.
 * @param {Number} cy1 Second cure control point y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @example
 * setStroke('black');
 * bezier(10, 10, 10, 0, 40, 0, 40, 10);
 */
export function bezier(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
  context.beginPath();
  context.moveTo(x0, y0);
  context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
  context.stroke();
};


/**
 * @ignore
 */
function _lines() {
  if(arguments == null) return;

  var args = arguments[0];
  context.beginPath();
  context.moveTo(args[0], args[1]);
  for(var i = 2; args[i + 1] != null; i += 2) {
    context.lineTo(args[i], args[i + 1]);
  }
};

/**
 * @ignore
 */
function _linesM() {
  if(arguments == null) return;

  var args = arguments[0];
  var p = new Polygon();
  context.beginPath();
  context.moveTo(args[0], args[1]);
  p[0] = new Point(args[0], args[1]);
  for(var i = 2; args[i + 1] != null; i += 2) {
    context.lineTo(args[i], args[i + 1]);
    p.push(new Point(args[i], args[i + 1]));
  }
  return p.containsPoint(mP);
};

/**
 * Draws a filled polygon using a series of
 * x/y positions.
 *
 * @param {...Number} positions x and y positions for the Polygon
 * @example
 * // This draws a filled triangle
 * // Inputs are pairs of x/y positions.
 * setFill('steelblue').
 * fLines(10, 10, 40, 10, 40, 40);
 *
 */
export function fLines() {
  _lines(arguments);
  context.fill();
};

/**
 * Draws a set of line segments using a series of
 * x/y positions as input.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @example
 * // This draws the outline of a triangle.
 * // Inputs are pairs of x/y positions.
 * setStroke('orange');
 * sLines(10, 10, 40, 10, 40, 40, 10, 10);
 *
 */
export function sLines() {
  _lines(arguments);
  context.stroke();
};

/**
 * Draws a filled set of line segments using a series of
 * x/y positions as input.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @example
 * // This draws a filled and outlined triangle.
 * // Inputs are pairs of x/y positions.
 * setFill('steelblue');
 * setStroke('orange');
 * fsLines(10, 10, 40, 10, 40, 40, 10, 10);
 *
 */
export function fsLines() {
  _lines(arguments);
  context.fill();
  context.stroke();
};

/**
 * Draws a mouse-enabled filled set of line segments using a series of
 * x/y positions as input. Returns true if moused over on current
 * cycle iteration.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @returns {Boolean} if true, mouse is currently hovering over lines.
 * @example
 * // Turns Fill Red if moused over
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsLinesM(10, 10, 40, 10, 40, 40, 10, 10);
 * if(on) {
 *   setFill('red');
 *   fsLines(10, 10, 40, 10, 40, 40, 10, 10);
 * }
 *
 */
export function fsLinesM() {
  var mouseOn = _linesM(arguments);
  context.fill();
  context.stroke();
  return mouseOn;
};

/**
 * @ignore
 */
function _polygon(polygon) {
  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for(var i = 1; polygon[i] != null; i++) {
    context.lineTo(polygon[i].x, polygon[i].y);
  }
};

export function fPolygon(polygon) {
  _polygon(polygon);
  context.fill();
};

export function sPolygon(polygon, closePath) {
  _polygon(polygon);
  if(closePath) context.closePath();
  context.stroke();
};

export function fsPolygon(polygon, closePath) {
  _polygon(polygon);
  if(closePath) context.closePath();
  context.fill();
  context.stroke();
};

export function fEqTriangle(x, y, angle, r) {
  _eqTriangle(x, y, angle, r);
  context.fill();
};

export function sEqTriangle(x, y, angle, r) {
  _eqTriangle(x, y, angle, r);
  context.stroke();
};

export function fsEqTriangle(x, y, angle, r) {
  _eqTriangle(x, y, angle, r);
  context.fill();
  context.stroke();
};

function _eqTriangle(x, y, angle, r) {
  context.beginPath();
  angle = angle || 0;
  context.moveTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
  context.lineTo(r * Math.cos(angle + 2.0944) + x, r * Math.sin(angle + 2.0944) + y);
  context.lineTo(r * Math.cos(angle + 4.1888) + x, r * Math.sin(angle + 4.1888) + y);
  context.lineTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
};


//drawing and checking cursor

/**
 * Draws a mouse-enabled filled in Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * var on = fRectM(10, 10, 40, 40);
 * if(on) {
 *   setFill('red');
 *   fRect(10, 10, 40, 40);
 * }
 */
export function fRectM(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  context.fillRect(x, y, width, height);
  return mY > y - margin && mY < y + height + margin && mX > x - margin && mX < x + width + margin;
};

/**
 * Draws a mouse-enabled stroked Rectangle.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setStroke('orange');
 * var on = sRectM(10, 10, 40, 40);
 * if(on) {
 *   setStroke('black');
 *   sRect(10, 10, 40, 40);
 * }
 */
export function sRectM(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  context.strokeRect(x, y, width, height);
  return mY > y - margin && mY < y + height + margin && mX > x - margin && mX < x + width + margin;
};

/**
 * Draws a mouse-enabled filled and stroked Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsRectM(10, 10, 40, 40);
 * if(on) {
 *   setFill('red');
 *   setStroke('black');
 *   sRect(10, 10, 40, 40);
 * }
 */
export function fsRectM(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  context.fillRect(x, y, width, height);
  context.strokeRect(x, y, width, height);
  return mY > y - margin && mY < y + height + margin && mX > x - margin && mX < x + width + margin;
};

/**
 * Draws a mouse-enabled filled in Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * var on = fCircleM(40, 40, 20);
 * if(on) {
 *  setFill('red');
 *  fCircle(40, 40, 20);
 * }
 *
 */
export function fCircleM(x, y, r, margin) { //check if you can avoid repeat
  margin = margin == null ? 0 : margin;
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.fill();
  return Math.pow(x - mX, 2) + Math.pow(y - mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled stroked Circle.
 * Stroke color is expected to be set using {@link setStroke}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setStroke('orange');
 * var on = sCircleM(40, 40, 20);
 * if(on) {
 *  setStroke('black');
 *  sCircle(40, 40, 20);
 * }
 *
 */
export function sCircleM(x, y, r, margin) {
  margin = margin == null ? 0 : margin;
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.stroke();
  return Math.pow(x - mX, 2) + Math.pow(y - mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled filled and stroked Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsCircleM(40, 40, 20);
 * if(on) {
 *  setFill('red');
 *  setStroke('black');
 *  fsCircle(40, 40, 20);
 * }
 *
 */
export function fsCircleM(x, y, r, margin) {
  margin = margin == null ? 0 : margin;
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi);
  context.stroke();
  context.fill();
  return Math.pow(x - mX, 2) + Math.pow(y - mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled line from a start position to an end position.
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @param {Number} d Distance away from line to count towards mouse interaction.
 * @return {Boolean} Returns true if the mouse is over the line on the current
 * iteration of the cycle function.
 * @example
 * setStroke('black');
 * var on = lineM(0, 0, 40, 40);
 * if(on) {
 *  setStroke('red');
 *  line(0, 0, 40, 40);
 * }
 */
export function lineM(x0, y0, x1, y1, d) {
  d = d || 4;
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.stroke();
  return _distToSegmentSquared(x0, y0, x1, y1) < d * d;
};

/**
 * @ignore
 */
function _distToSegmentSquared(x0, y0, x1, y1) {
  var l2 = Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2);
  if(l2 === 0) return Math.pow(x0 - mX, 2) + Math.pow(y0 - mY, 2);
  var t = ((mX - x0) * (x1 - x0) + (mY - y0) * (y1 - y0)) / l2;
  if(t <= 0) return Math.pow(x0 - mX, 2) + Math.pow(y0 - mY, 2);
  if(t >= 1) return Math.pow(x1 - mX, 2) + Math.pow(y1 - mY, 2);
  var px = x0 + t * (x1 - x0);
  var py = y0 + t * (y1 - y0);
  return Math.pow(px - mX, 2) + Math.pow(py - mY, 2);
};

//TODO:fEqTriangleM, fPolygonM

/**
 * Draws a mouse-enabled bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/bezierCurveTo|bezierCurveTo}.
 *
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} cx0 First curve control point x position.
 * @param {Number} cy0 First cure control point y position.
 * @param {Number} cx1 Second curve control point x position.
 * @param {Number} cy1 Second cure control point y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @param {Number} d Distance away from line to count towards mouse interaction.
 * @return {Boolean} Returns true if the mouse is over the line on the current
 * iteration of the cycle function.
 * @example
 * setStroke('black');
 * var on = bezierM(10, 10, 10, 0, 40, 0, 40, 10);
 * if(on) {
 *  setStroke('red');
 *  bezierM(10, 10, 10, 0, 40, 0, 40, 10);
 * }
 */
export function bezierM(x0, y0, cx0, cy0, cx1, cy1, x1, y1, d) { //TODO: fix this mess!
  d = d == null ? 2 : d;
  context.beginPath();
  context.moveTo(x0, y0);
  context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
  context.stroke();
  if(mX < Math.min(x0, x1, cx0, cx1) - d || mX > Math.max(x0, x1, cx0, cx1) + d || mY < Math.min(y0, y1, cy0, cy1) - d || mY > Math.max(y0, y1, cy0, cy1) + d) return false;
  return GeometryOperators.distanceToBezierCurve(x0, y0, cx0, cy0, cx1, cy1, x1, y1, mP, false) < d;
};



//images

/**
 * draw an image on context, parameters options (s for source, d for destination):
 *	drawImage(image, dx, dy)
 *	drawImage(image, dx, dy, dw, dh)
 *	drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
 *	@param {Image} image
 */
export function drawImage(image) { //TODO: improve efficiency
  if(image == null) return;

  switch(arguments.length) {
    case 3:
      context.drawImage(image, arguments[1], arguments[2]);
      break;
    case 5:
      context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4]);
      break;
    case 9:
      context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
      break;

  }
};

/**
 * fits an image into a rectangle without chagning its proportions (thus probably loosing top-bottom or left-right margins)
 * @param  {Image} image
 * @param  {Rectangle} rectangle frame of the image
 */
export function fitImage(image, rectangle) {
  if(image == null ||  rectangle == null) return;

  var propIm = image.width / image.height;
  var propRc = rectangle.width / rectangle.height;
  var compProp = propIm / propRc;

  if(propIm > propRc) {
    context.drawImage(image, 0.5 * (image.width - image.width / compProp), 0, image.width / compProp, image.height, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  } else {
    context.drawImage(image, 0, 0.5 * (image.height - image.height * compProp), image.width, image.height * compProp, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
};

// styles

export function setFill(style) {
  if(typeof style == "number") {
    if(arguments.length > 3) {
      context.fillStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
      return;
    }
    context.fillStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
    return;
  }
  context.fillStyle = style;
};

/**
 * setStroke - set stroke to draw with in canvas
 *
 * @param {(String|Number)} style If string, then hex value or web color.
 * If Number, then a set of RGB or RGBA integers
 * @param {Number} lineWidth Optional width of line to use. Only valid if style parameter is a string.
 * @example
 * setStroke('steelblue'); // sets stroke to blue.
 * setStroke(0,0,0,0.4); // sets stroke to black with partial opacity.
 * setStroke('black', 0.2); // provides lineWidth to stroke
 */
export function setStroke(style, lineWidth) {
  if(typeof style == "number") {
    if(arguments.length > 3) {
      context.strokeStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
      return;
    }
    context.strokeStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
    return;
  }
  context.strokeStyle = style;
  //TODO: will lineWidth still work if RGB or RGBA is used?
  if(lineWidth) context.lineWidth = lineWidth;
};

export function setLW(lineWidth) {
  context.lineWidth = lineWidth;
};



//clipping

export function clipCircle(x, y, r) {
  context.save();
  context.beginPath();
  context.arc(x, y, r, 0, TwoPi, false);
  context.closePath();
  context.clip();
};

export function clipRectangle(x, y, w, h) {
  context.save();
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + w, y);
  context.lineTo(x + w, y + h);
  context.lineTo(x, y + h);
  context.clip();
};

export function restore() {
  context.restore();
};


// texts

/**
 * Draws filled in text.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * fText("hello", 10, 10);
 *
 */
export function fText(text, x, y) {
  context.fillText(text, x, y);
};

/**
 * Draws stroked text.
 * Stroke color is expected to be set using {@link setStroke}.
 * Additionally, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange');
 * sText("hello", 10, 10);
 *
 */
export function sText(text, x, y) {
  context.strokeText(text, x, y);
};

/**
 * Draws stroked and filled in text.
 * Stroke color is expected to be set using {@link setStroke}.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange');
 * fsText("hello", 10, 10);
 *
 */
export function fsText(text, x, y) {
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
};

/**
 * Draws filled in text, rotated by some angle.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} angle The angle in radians to rotate the text
 * @example
 * setText('black', 30, 'Ariel');
 * fTextRotated("hello", 40, 40, (20 * Math.PI / 180));
 *
 */
export function fTextRotated(text, x, y, angle) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillText(text, 0, 0);
  context.restore();
};

/**
 * Draws a mouse-enabled filled in text.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * var on = fTextM("hello", 10, 10, 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   fText("hello", 10, 10);
 * }
 *
 */
export function fTextM(text, x, y, size) {
  size = size || 12;
  context.fillText(text, x, y);
  return mY > y && mY < y + size && mX > x && mX < x + context.measureText(text).width;
};

/**
 * Draws a mouse-enabled filled and stroked text.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange')
 * var on = fsTextM("hello", 10, 10, 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   setStroke('black')
 *   fsText("hello", 10, 10);
 * }
 *
 */
export function fsTextM(text, x, y, size) {
  size = size || 12;
  context.strokeText(text, x, y);
  context.fillText(text, x, y);
  return mY > y && mY < y + size && mX > x && mX < x + context.measureText(text).width;
};

/**
 * Draws a mouse-enabled filled text rotated by some angle.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} angle The angle in radians to rotate the text
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * var on = fTextRotatedM("hello", 10, 10, (20 * Math.PI / 180), 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   setStroke('black')
 *   fsText("hello", 10, 10);
 * }
 *
 */
export function fTextRotatedM(text, x, y, angle, size) {
  size = size || 12;
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillText(text, 0, 0);
  context.restore();

  var dX = mX - x;
  var dY = mY - y;
  var d = Math.sqrt(dX * dX + dY * dY);
  var a = Math.atan2(dY, dX) - angle;
  var mXT = x + d * Math.cos(a);
  var mYT = y + d * Math.sin(a);

  return mYT > y && mYT < y + size && mXT > x && mXT < x + context.measureText(text).width;
};

export function fTextW(text, x, y) {
  context.fillText(text, x, y);
  return context.measureText(text).width;
};

/**
 * Sets several text canvas rendering properties
 *
 * @param {Object} color optional font color
 * @param {Object} fontSize optional font size
 * @param {Object} fontName optional font name (default: LOADED_FONT)
 * @param {Object} align optional horizontal align ('left', 'center', 'right')
 * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
 * @param {Object} style optional font style ('bold', 'italic', 'underline')
 * @param {Object} ctx optional context
 */
export function setText(color, fontSize, fontName, align, baseline, style) {
  color = color || '#000000';
  fontSize = String(fontSize) || '14';
  fontName = fontName || LOADED_FONT;
  align = align == null ? 'left' : align;
  baseline = baseline == null ? 'top' : baseline;
  style = style == null ? '' : style;

  if(style != '') {
    style += ' ';
  }

  context.fillStyle = color;
  context.font = style + fontSize + 'px ' + fontName;
  context.textAlign = align;
  context.textBaseline = baseline;
};

export function getTextW(text) {
  return context.measureText(text).width;
};


// pixel data

export function getPixelData(x, y) {
  return context.getImageData(x, y, 1, 1).data;
};

export function getPixelColor(x, y) {
  var rgba = context.getImageData(x, y, 1, 1).data;
  return 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
};

export function getPixelColorRGBA(x, y) { //repeated
  return context.getImageData(x, y, 1, 1).data;
};

export function captureCanvas() {
  var im = new Image();
  im.src = canvas.toDataURL();
  return im;
};


/*
TODO: refactor this to not reassign Global.context
export function drawAndcapture(drawFunction, w, h, target) {
  var defaultContext = context;

  context = hiddenContext;

  context.canvas.setAttribute('width', w);
  context.canvas.setAttribute('height', h);

  context.clearRect(0, 0, w, h);

  target == null ? drawFunction.call() : drawFunction.call(target);

  var im = new Image();
  im.src = context.canvas.toDataURL();

  context = defaultContext;

  return im;
};
*/



//cursor

/**
 * Change mouse cursor to given style. See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor|MDN Cursor Page} for all style options.
 * @param {String} name The name of the cursor style.
 */
export function setCursor(name) {
  name = name == null ? 'default' : name;
  canvas.style.cursor = name;
};

//time

export function getMilliseconds() {
  return new Date().getTime();
};
