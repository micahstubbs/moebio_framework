function ImageDraw() {};


/**
 * draws an image
 * @param  {Rectangle} frame
 * @param  {Image} image to be drawn
 * 
 * @param  {Number} mode: 0: adjust to rectangle, 1: center and mask, 2: center and eventual reduction (image smaller than rectangle), 3: adjust to rectangle preserving proportions (image bigger than rectangle), 4: fill repeated from corner, 5: fill repeated from 0,0
 * tags:draw
 */
ImageDraw.drawImage = function(frame, image, mode) {
  mode = mode || 0;
  Draw.fillRectangleWithImage(frame, image, mode);
}


/**
 * draws a visualization and captures an image
 * @param  {String} visFunction visualization function
 * @param  {Number} width
 * @param  {Number} height
 *
 * @param {Object} argument0 first argument of the visualization function
 * @param {Object} argument1 second argument of the visualization function
 * @param {Object} argument2 third argument of the visualization function
 * @param {Object} argument3 fourth argument of the visualization function
 * @return {Image}
 * tags:
 */
ImageDraw.captureVisualizationImage = function(visFunctionName, width, height) {
  c.log('visFunctionName', visFunctionName);
  if(visFunctionName == null ||  width == null || (!width > 0) || height == null || !(height > 0)) return;

  var frame = new Rectangle(0, 0, width, height);

  var args = Array.prototype.slice.call(arguments);
  args = [frame].concat(args.slice(3));

  var visFunction;

  if(visFunctionName.indexOf('.') == -1) {
    visFunction = this[visFunctionName];
  } else {
    c.log(visFunctionName.split('.')[0], this[visFunctionName.split('.')[0]], this['mY']);
    if(this[visFunctionName.split('.')[0]] == null) return;
    visFunction = this[visFunctionName.split('.')[0]][visFunctionName.split('.')[1]];
  }

  if(visFunction == null) return null;

  c.log('ImageDraw.captureVisualizationImage | args', args);
  c.log('ImageDraw.captureVisualizationImage | visFunction==null', visFunction == null);

  var newCanvas = document.createElement("canvas");
  newCanvas.width = width;
  newCanvas.height = height;
  var newContext = newCanvas.getContext("2d");
  newContext.clearRect(0, 0, width, height);

  var mainContext = context;
  context = newContext;

  ////draw
  //setStroke('black', 2);
  //line(0,0,width,height);
  //line(width,0,0,height);
  visFunction.apply(this, args);
  ////

  context = mainContext;

  var im = new Image();
  im.src = newCanvas.toDataURL();

  return im;
}