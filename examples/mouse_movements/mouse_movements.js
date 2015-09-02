window.onload = function() {

  var points = [ {x: 250, y: 250} ];

  var graphics = new mo.Graphics({
    container: "#maindiv",

    dimensions: {
      width: 500,
      height: 500,
    },

    cycle: function() {
      // The size of the circles will be controlled by the mouse position
      // mX & mY is mouse X & Y
      var radius = (this.mX + this.mY) / 30;
      if(radius < 10) {
        radius = 10;
      }
      if(radius > 50) {
        radius = 50;
      }

      // When drawing shapes we can get information as to whether the mouse
      // is over them, or whether the mouse is pressed.
      for(var i = 0; i < points.length; i++) {
        var point = points[i];
        // add a circle that can detect mouse over
        this.setFill('grey');
        var over = this.fCircleM(point.x, point.y, radius);

        // if mouse over, change color to orange
        if(over) {
          this.setFill('orange');
          this.fCircle(point.x, point.y, radius);
          this.setStroke('grey');
          this.sCircle(point.x, point.y, radius + 10);
          this.setCursor('pointer');
        }
        // if mouse pressed, change color to orange
        if((this.MOUSE_DOWN || this.MOUSE_PRESSED) && over) {
          this.setFill('red');
          this.fCircle(point.x, point.y, radius);
        }
      }
    }
  });

  // We can also add custom interaction handlers to the graphics object
  // as a whole. These allows us to access standard DOM event information
  // in addition to the what is stored in the graphics object.

  // Lets add a circle where-ever the mouse is clicked
  graphics.on('click', function(e){
    points.push({
      x: e.offsetX,
      y: e.offsetY
    });
  });

  // Its not limited to mouse interaction, we can also listen for keypresses
  graphics.on('keydown', function(){
    points.push({
      x: graphics.mX,
      y: graphics.mY
    });
  });
};
