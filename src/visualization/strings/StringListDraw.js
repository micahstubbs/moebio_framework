function StringListDraw() {}

StringListDraw.tagCloudRectangles = function(stringList, weights, frame) {

  var normWeights = table[1].sqrt().getNormalizedToMax();

  rectangles = new List();
  textPositions = new Polygon();
  textSizes = new NumberList();

  var rectanglesPlaced = new List();

  var dL = 6;

  var a = 0;
  var r = 0;
  var p = new Point(0, 0);

  var w;
  var h;

  for(var i = 0; words[i] != null; i++) {
    //words[i] = words[i].toUpperCase();
    textSizes[i] = Math.round(weights[i] * 16) * dL;

    DrawTexts.setContextTextProperties('black', textSizes[i], 'Arial', null, null, 'bold');
    w = Math.ceil((2 + context.measureText(stringList[i]).width) / dL) * dL;
    h = textSizes[i];

    while(StringListDraw._pointInRectangles(rectanglesPlaced, p, w, h)) {
      p.x += dL;
      p.y -= dL;
      if(p.y < 0) {
        p.y = p.x;
        p.x = 0;
      }
    }

    rectangles[i] = new Rectangle(p.x, p.y, w, h);
    rectanglesPlaced.push(rectangles[i]);
  }
};

StringListDraw._pointInRectangles = function(rectangles, p, width, height) {
  var rect;
  for(var i = 0; rectangles[i] != null; i++) {
    rect = rectangles[i];
    if(p.x + width > rect.x && p.x < (rect.x + rect.width) && p.y + height > rect.y && p.y < (rect.y + rect.height)) return true;
  }
  return false;
};