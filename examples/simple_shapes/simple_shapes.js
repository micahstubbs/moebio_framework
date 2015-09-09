function drawSimpleShapes() {

  var width = 60;
  var height = 40;
  var margin = 20;
  var on;

  function drawRects(g, x, y) {
    // using drawing functions to create a dynamic square
    // cW & cH is canvas Width & Height
    // mX & mY is mouse X & Y
    g.setFill('steelblue');
    g.setStroke('orange');

    // Rectangles
    g.fRect(x, y, width, height);
    x += width + margin;
    g.sRect(x, y, width, height);
    x += width + margin;
    g.fsRect(x, y, width, height);

    x += width + margin;

    // interactive rectangles

    g.setStroke('orange');
    g.setFill('steelblue');
    var on = false;
    on = g.fRectM(x, y, width, height);
    if(on) {
      g.setFill('red');
      g.fRect(x, y, width, height);
    }
    x += width + margin;
    on = g.sRectM(x, y, width, height);
    if(on) {
      g.setStroke('black');
      g.sRect(x, y, width, height);
    }
    x += width + margin;

    g.setStroke('orange');
    g.setFill('steelblue');
    on = g.fsRectM(x, y, width, height);
    if(on) {
      g.setFill('red');
      g.setStroke('black');
      g.fsRect(x, y, width, height);
    }

    g.setStroke('orange');
    g.setFill('steelblue');
  }

  function drawCircles(g, x, y) {
    // y += height + (margin * 2);
    // x = margin + width / 2;

    // Circles
    g.fCircle(x, y, height / 2);
    x += margin + width;
    g.sCircle(x, y, height / 2);
    x += margin + width;
    g.fsCircle(x, y, height / 2);

    x += margin + width;

    // interactive circles

    on = g.fCircleM(x, y, height / 2);
    if(on) {
      g.setFill('red');
      g.fCircle(x, y, height / 2);
    }

    x += margin + width;

    g.setStroke('orange');
    g.setFill('steelblue');

    on = g.sCircleM(x, y, height / 2);
    if(on) {
      g.setStroke('black');
      g.sCircle(x, y, height / 2);
    }

    x += margin + width;

    g.setStroke('orange');
    g.setFill('steelblue');

    on = g.fsCircleM(x, y, height / 2);
    if(on) {
      g.setStroke('black');
      g.setFill('red');
      g.fsCircle(x, y, height / 2);
    }

    g.setStroke('orange');
    g.setFill('steelblue');

    y += height + margin;
    x = margin + width / 2;

    // Ellipses
    g.fEllipse(x, y, width / 2, height / 2);
    x += margin + width;
    g.sEllipse(x, y, width / 2, height / 2);
    x += margin + width;
    g.fsEllipse(x, y, width / 2, height / 2);

    y += height + margin;
    x = margin;
  }

  function drawLines(g, x, y) {
    g.line(x, y, x + width, y + height / 2);
    x += margin + width;
    y += height / 2;

    g.bezier(x, y, x, y - height, x + width, y - height, x + width, y );

    // interactive lines

    x += margin + width;
    y -= height / 2;

    g.setStroke('orange');

    on = g.lineM(x, y, x + width, y + height / 2);
    if(on) {
      g.setStroke('red');
      g.line(x, y, x + width, y + height / 2);
    }

    x += margin + width;
    y += height / 2;

    g.setStroke('orange');

    on = g.bezierM(x, y, x, y - height, x + width, y - height, x + width, y );
    if(on) {
      g.setStroke('red');
      g.bezier(x, y, x, y - height, x + width, y - height, x + width, y );
    }

    g.setStroke('orange');

    // Line Segments

    y += height + margin;
    x = margin;

    g.fLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
    x += margin + width;
    g.sLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
    x += margin + width;
    g.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
    x += margin + width;

    var linesOn = g.fsLinesM(x, y - height, x + width, y + (height / 3), x + width, y - height);
    if (linesOn) {
      g.setFill('red');
      g.setStroke('black');
      g.fsLines(x, y - height, x + width, y + (height / 3), x + width, y - height);
    }

    y += height + margin;
    x = margin;
  }

  function drawText(g, x, y) {
    g.setStroke('orange');
    g.setFill('steelblue');
    g.setText('black', 30, 'Arial');
    var text = 'hello';

    g.fText(text, x, y);
    x += margin + width;
    g.sText(text, x, y);
    x += margin + width;
    g.fsText(text, x, y);
    x += margin + width;
    g.fTextRotated(text, x, y, (20 * Math.PI / 180));

    // interactive text

    x += margin + width;
    g.setText('black', 30, 'Arial');
    on = g.fTextM(text, x, y, 30);
    if(on) {
      g.setText('red', 30, 'Arial');
      g.setFill('red');
      g.fText(text, x, y);
    }

    x += margin + width;
    g.setText('black', 30, 'Arial');
    g.setStroke('orange');
    on = g.fsTextM(text, x, y, 30);
    if(on) {
      g.setText('red', 30, 'Arial');
      g.setStroke('black');
      g.fsText(text, x, y);
    }

    x += margin + width;
    g.setText('black', 30, 'Arial');
    g.setStroke('orange');
    on = g.fTextRotatedM(text, x, y, (20 * Math.PI / 180), 30);
    if(on) {
      g.setText('red', 30, 'Arial');
      g.fTextRotated(text, x, y, (20 * Math.PI / 180));
    }
  }


  var g = new mo.Graphics({
    container: "#maindiv",
    dimensions: {
      width: 600,
      height: 500
    },
    cycle: function() {
      drawRects(this, 20, 20);
      drawCircles(this, 40, 100);
      drawLines(this, 20, 200);
      drawText(this, 20, 300);
    }
  });
  g.setBackgroundColor('Azure');
  g.setBackgroundAlpha(1);
}

window.onload = function() {
  drawSimpleShapes();
};
