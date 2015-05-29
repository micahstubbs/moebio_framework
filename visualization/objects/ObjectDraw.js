function ObjectDraw() {}


/**
 * counts the number of times the function is called
 * @param  {Rectangle} frame
 * @param  {Object} object
 * tags:draw
 */
ObjectDraw.count = function(frame, object) {
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

  if(MOUSE_DOWN && frame.containsPoint(mP)) frame.memory.n = 0;

  setText('black', 12);
  fText(frame.memory.n, frame.x + 10, frame.y + 10);
};