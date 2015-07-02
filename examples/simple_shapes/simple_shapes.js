
init = function init() {
};

cycle = function cycle() {
  // using drawing functions to create a dynamic square
  // cW & cH is canvas Width & Height
  // mX & mY is mouse X & Y
  mo.setFill('steelblue');
  mo.setStroke('orange');

  // fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));
  var width = 60;
  var height = 40;
  var margin = 20;
  var x = margin;
  var y = margin;

  // Rectangles
  mo.fRect(x, y, width, height);
  x += width + margin;
  mo.sRect(x, y, width, height);
  x += width + margin;
  mo.fsRect(x, y, width, height);

  x += width + margin;

  // interactive rectangles

  mo.setStroke('orange');
  mo.setFill('steelblue');
  var on = false;
  on = mo.fRectM(x, y, width, height);
  if(on) {
    mo.setFill('red');
    mo.fRect(x, y, width, height);
  }
  x += width + margin;
  on = mo.sRectM(x, y, width, height);
  if(on) {
    mo.setStroke('black');
    mo.sRect(x, y, width, height);

  }
  x += width + margin;

  mo.setStroke('orange');
  mo.setFill('steelblue');
  on = mo.fsRectM(x, y, width, height);
  if(on) {
    mo.setFill('red');
    mo.setStroke('black');
    mo.fsRect(x, y, width, height);
  }

  mo.setStroke('orange');
  mo.setFill('steelblue');

  y += height + (margin * 2);
  x = margin + width / 2;

  // Circles
  mo.fCircle(x, y, height / 2);
  x += margin + width;
  mo.sCircle(x, y, height / 2);
  x += margin + width;
  mo.fsCircle(x, y, height / 2);

  x += margin + width;

  // interactive circles

  on = mo.fCircleM(x, y, height / 2);
  if(on) {
    mo.setFill('red');
    mo.fCircle(x, y, height / 2);
  }

  x += margin + width;

  mo.setStroke('orange');
  mo.setFill('steelblue');

  on = mo.sCircleM(x, y, height / 2);
  if(on) {
    mo.setStroke('black');
    mo.sCircle(x, y, height / 2);
  }

  x += margin + width;

  mo.setStroke('orange');
  mo.setFill('steelblue');

  on = mo.fsCircleM(x, y, height / 2);
  if(on) {
    mo.setStroke('black');
    mo.setFill('red');
    mo.fsCircle(x, y, height / 2);
  }

  mo.setStroke('orange');
  mo.setFill('steelblue');

  y += height + margin;
  x = margin + width / 2;

  // Ellipses
  mo.fEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  mo.sEllipse(x, y, width / 2, height / 2);
  x += margin + width;
  mo.fsEllipse(x, y, width / 2, height / 2);

  y += height + margin;
  x = margin;

  // lines
  mo.line(x, y, x + width, y + height / 2);
  x += margin + width;
  y += height / 2;

  mo.bezier(x, y, x, y - height, x + width, y - height, x + width, y );

  // interactive lines

  x += margin + width;
  y -= height / 2;

  mo.setStroke('orange');

  on = mo.lineM(x, y, x + width, y + height / 2);
  if(on) {
    mo.setStroke('red');
    mo.line(x, y, x + width, y + height / 2);
  }

  x += margin + width;
  y += height / 2;

  mo.setStroke('orange');

  on = mo.bezierM(x, y, x, y - height, x + width, y - height, x + width, y );
  if(on) {
    mo.setStroke('red');
    mo.bezier(x, y, x, y - height, x + width, y - height, x + width, y );
  }

  mo.setStroke('orange');

  // Line Segments

  y += height + margin;
  x = margin;

  mo.fLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  mo.sLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;
  mo.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  x += margin + width;

  var linesOn = mo.fsLinesM(x, y - height, x + width, y + (height / 3), x + width, y - height);
  if (linesOn) {
    mo.setFill('red');
    mo.setStroke('black');
    mo.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
  }

  y += height + margin;
  x = margin;

  // text

  mo.setStroke('orange');
  mo.setFill('steelblue');
  mo.setText('black', 30, 'Ariel');
  var text = 'hello';

  mo.fText(text, x, y);
  x += margin + width;
  mo.sText(text, x, y);
  x += margin + width;
  mo.fsText(text, x, y);
  x += margin + width;
  mo.fTextRotated(text, x, y, (20 * Math.PI / 180));

  // interactive text

  x += margin + width;
  mo.setText('black', 30, 'Ariel');
  on = mo.fTextM(text, x, y, 30);
  if(on) {
    mo.setText('red', 30, 'Ariel');
    mo.setFill('red');
    mo.fText(text, x, y);
  }

  x += margin + width;
  mo.setText('black', 30, 'Ariel');
  mo.setStroke('orange');
  on = mo.fsTextM(text, x, y, 30);
  if(on) {
    mo.setText('red', 30, 'Ariel');
    mo.setStroke('black');
    mo.fsText(text, x, y);
  }

  x += margin + width;
  mo.setText('black', 30, 'Ariel');
  mo.setStroke('orange');
  on = mo.fTextRotatedM(text, x, y, (20 * Math.PI / 180), 30);
  if(on) {
    mo.setText('red', 30, 'Ariel');
    mo.fTextRotated(text, x, y, (20 * Math.PI / 180));
  }

};
