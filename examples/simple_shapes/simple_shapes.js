
init = function init() {
};

cycle = function cycle() {
  // using drawing functions to create a dynamic square
  // cW & cH is canvas Width & Height
  // mX & mY is mouse X & Y
  setFill('steelblue');
  setStroke('orange');

  // fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));
  var width = 60;
  var height = 40;
  var margin = 20;
  var x = margin;
  var y = margin;

  // Rectangles
  fRect(x, y, width, height);
  x += width + margin;
  sRect(x, y, width, height);
  x += width + margin;
  fsRect(x, y, width, height);

  x += width + margin;

  // interactive rectangles

  setStroke('orange');
  setFill('steelblue');
  var on = false;
  on = fRectM(x, y, width, height);
  if(on) {
    setFill('red');
    fRect(x, y, width, height);
  }
  x += width + margin;
  on =sRectM(x, y, width, height);
  if(on) {
    setStroke('black');
    sRect(x, y, width, height);

  }
  x += width + margin;

  setStroke('orange');
  setFill('steelblue');
  on = fsRectM(x, y, width, height);
  if(on) {
    setFill('red');
    setStroke('black');
    fsRect(x, y, width, height);
  }

  setStroke('orange');
  setFill('steelblue');

  y += height + (margin * 2);
  x = margin + width / 2;

  // Circles
  fCircle(x, y, height / 2);
  x += margin + width;
  sCircle(x, y, height / 2);
  x += margin + width;
  fsCircle(x, y, height / 2);

  x += margin + width;

  // interactive circles

  on = fCircleM(x, y, height / 2);
  if(on) {
    setFill('red');
    fCircle(x, y, height / 2);
  }

  x += margin + width;

  setStroke('orange');
  setFill('steelblue');

  on = sCircleM(x, y, height / 2);
  if(on) {
    setStroke('black');
    sCircle(x, y, height / 2);
  }

  x += margin + width;

  setStroke('orange');
  setFill('steelblue');

  on = fsCircleM(x, y, height / 2);
  if(on) {
    setStroke('black');
    setFill('red');
    fsCircle(x, y, height / 2);
  }

  setStroke('orange');
  setFill('steelblue');

  y += height + margin;
  x = margin + width / 2;

  // Ellipses
  fEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  sEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  fsEllipse(x, y, width / 2, height / 2);

  y += height + margin;
  x = margin;

  // lines
  line(x, y, x + width, y + height / 2);
  x += margin + width;
  y += height / 2;

  bezier(x, y, x, y - height, x + width, y - height, x + width, y );

  // interactive lines

  x += margin + width;
  y -= height / 2;

  setStroke('orange');

  on = lineM(x, y, x + width, y + height / 2);
  if(on) {
    setStroke('red');
    line(x, y, x + width, y + height / 2);
  }

  x += margin + width;
  y += height / 2;

  setStroke('orange');

  on = bezierM(x, y, x, y - height, x + width, y - height, x + width, y );
  if(on) {
    setStroke('red');
    bezier(x, y, x, y - height, x + width, y - height, x + width, y );
  }

  setStroke('orange');

  // Line Segments

  y += height + margin;
  x = margin;

  fLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  sLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;

  var linesOn = fsLinesM(x, y - height, x + width, y + (height / 3), x + width, y - height);
  if (linesOn) {
    setFill('red');
    setStroke('black');
    fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  }

  y += height + margin;
  x = margin;

  // text

  setStroke('orange');
  setFill('steelblue');
  setText('black', 30, 'Ariel');
  var text = 'hello';

  fText(text, x, y);
  x += margin + width;
  sText(text, x, y);
  x += margin + width;
  fsText(text, x, y);
  x += margin + width;
  fTextRotated(text, x, y, (20 * Math.PI / 180));

  // interactive text

  x += margin + width;
  setText('black', 30, 'Ariel');
  on = fTextM(text, x, y, 30);
  if(on) {
    setText('red', 30, 'Ariel');
    setFill('red');
    fText(text, x, y);
  }

  x += margin + width;
  setText('black', 30, 'Ariel');
  setStroke('orange');
  on = fsTextM(text, x, y, 30);
  if(on) {
    setText('red', 30, 'Ariel');
    setStroke('black');
    fsText(text, x, y);
  }

  x += margin + width;
  setText('black', 30, 'Ariel');
  setStroke('orange');
  on = fTextRotatedM(text, x, y, (20 * Math.PI / 180), 30);
  if(on) {
    setText('red', 30, 'Ariel');
    fTextRotated(text, x, y, (20 * Math.PI / 180));
  }

};
