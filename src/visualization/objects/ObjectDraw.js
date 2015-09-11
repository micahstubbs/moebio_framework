
/**
 * @classdesc Functions for drawing objects.
 *
 * @namespace
 * @category drawing
 */
function ObjectDraw() {}
export default ObjectDraw;


/**
 * counts the number of times the function is called
 * @param  {Rectangle} frame
 * @param  {Object} object
 * tags:draw
 */
ObjectDraw.count = function(frame, object, graphics) {
  if(graphics==null) graphics = frame.graphics;
  
  if(frame.memory == null) {
    frame.memory = {
      n: 1,
      object: object
    };
  }

  if(frame.memory.object != object) {
    frame.memory.object = object;
    frame.memory.n++;
  }

  if(graphics.MOUSE_DOWN && frame.containsPoint(graphics.mP)) frame.memory.n = 0;

  graphics.setText('black', 12);
  graphics.fText(frame.memory.n, frame.x + 10, frame.y + 10);
};
