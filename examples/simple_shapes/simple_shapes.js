
init = function init() {
};

cycle = function cycle() {
  // using drawing functions to create a dynamic square
  // cW & cH is canvas Width & Height
  // mX & mY is mouse X & Y
  MF.setFill('steelblue');
  MF.setStroke('orange');

  // fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));
  var width = 60;
  var height = 40;
  var margin = 20;
  var x = margin;
  var y = margin;

  // Rectangles
  MF.fRect(x, y, width, height);
  x += width + margin;
  MF.sRect(x, y, width, height);
  x += width + margin;
  MF.fsRect(x, y, width, height);

  x += width + margin;

  // interactive rectangles

  MF.setStroke('orange');
  MF.setFill('steelblue');
  var on = false;
  on = MF.fRectM(x, y, width, height);
  if(on) {
    MF.setFill('red');
    MF.fRect(x, y, width, height);
  }
  x += width + margin;
  on = MF.sRectM(x, y, width, height);
  if(on) {
    MF.setStroke('black');
    MF.sRect(x, y, width, height);

  }
  x += width + margin;

  MF.setStroke('orange');
  MF.setFill('steelblue');
  on = MF.fsRectM(x, y, width, height);
  if(on) {
    MF.setFill('red');
    MF.setStroke('black');
    MF.fsRect(x, y, width, height);
  }

  MF.setStroke('orange');
  MF.setFill('steelblue');

  y += height + (margin * 2);
  x = margin + width / 2;

  // Circles
  MF.fCircle(x, y, height / 2);
  x += margin + width;
  MF.sCircle(x, y, height / 2);
  x += margin + width;
  MF.fsCircle(x, y, height / 2);

  x += margin + width;

  // interactive circles

  on = MF.fCircleM(x, y, height / 2);
  if(on) {
    MF.setFill('red');
    MF.fCircle(x, y, height / 2);
  }

  x += margin + width;

  MF.setStroke('orange');
  MF.setFill('steelblue');

  on = MF.sCircleM(x, y, height / 2);
  if(on) {
    MF.setStroke('black');
    MF.sCircle(x, y, height / 2);
  }

  x += margin + width;

  MF.setStroke('orange');
  MF.setFill('steelblue');

  on = MF.fsCircleM(x, y, height / 2);
  if(on) {
    MF.setStroke('black');
    MF.setFill('red');
    MF.fsCircle(x, y, height / 2);
  }

  MF.setStroke('orange');
  MF.setFill('steelblue');

  y += height + margin;
  x = margin + width / 2;

  // Ellipses
  MF.fEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  MF.sEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  MF.fsEllipse(x, y, width / 2, height / 2);

  y += height + margin;
  x = margin;

  // lines
  MF.line(x, y, x + width, y + height / 2);
  x += margin + width;
  y += height / 2;

  MF.bezier(x, y, x, y - height, x + width, y - height, x + width, y );

  // interactive lines

  x += margin + width;
  y -= height / 2;

  MF.setStroke('orange');

  on = MF.lineM(x, y, x + width, y + height / 2);
  if(on) {
    MF.setStroke('red');
    MF.line(x, y, x + width, y + height / 2);
  }

  x += margin + width;
  y += height / 2;

  MF.setStroke('orange');

  on = MF.bezierM(x, y, x, y - height, x + width, y - height, x + width, y );
  if(on) {
    MF.setStroke('red');
    MF.bezier(x, y, x, y - height, x + width, y - height, x + width, y );
  }

  MF.setStroke('orange');

  // Line Segments

  y += height + margin;
  x = margin;

  MF.fLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  MF.sLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  MF.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;

  var linesOn = MF.fsLinesM(x, y - height, x + width, y + (height / 3), x + width, y - height);
  if (linesOn) {
    MF.setFill('red');
    MF.setStroke('black');
    MF.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  }

  y += height + margin;
  x = margin;

  // text

  MF.setStroke('orange');
  MF.setFill('steelblue');
  MF.setText('black', 30, 'Ariel');
  var text = 'hello';

  MF.fText(text, x, y);
  x += margin + width;
  MF.sText(text, x, y);
  x += margin + width;
  MF.fsText(text, x, y);
  x += margin + width;
  MF.fTextRotated(text, x, y, (20 * Math.PI / 180));

  // interactive text

  x += margin + width;
  MF.setText('black', 30, 'Ariel');
  on = MF.fTextM(text, x, y, 30);
  if(on) {
    MF.setText('red', 30, 'Ariel');
    MF.setFill('red');
    MF.fText(text, x, y);
  }

  x += margin + width;
  MF.setText('black', 30, 'Ariel');
  MF.setStroke('orange');
  on = MF.fsTextM(text, x, y, 30);
  if(on) {
    MF.setText('red', 30, 'Ariel');
    MF.setStroke('black');
    MF.fsText(text, x, y);
  }

  x += margin + width;
  MF.setText('black', 30, 'Ariel');
  MF.setStroke('orange');
  on = MF.fTextRotatedM(text, x, y, (20 * Math.PI / 180), 30);
  if(on) {
    MF.setText('red', 30, 'Ariel');
    MF.fTextRotated(text, x, y, (20 * Math.PI / 180));
  }

};
