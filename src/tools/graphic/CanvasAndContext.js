// TODO: remove completely?
// Yes this should be removed completely. Graphics should allow an
// offscreen context.

/**
 * @classdesc CanvasAndContext
 *
 * @namespace
 * @category basics
 */
function CanvasAndContext() {}
export default CanvasAndContext;

CanvasAndContext.createInvisibleContext = function(width, height, graphics) {
  width = width || graphics.cW;
  height = height || graphics.cH;

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = graphics.cW;
  tempCanvas.height = graphics.cH;
  return tempCanvas.getContext('2d');
};
