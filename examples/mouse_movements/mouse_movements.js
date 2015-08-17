window.onload = function() {
  new mo.Graphics({
    container: ".container",
    dimensions: {
      width: 500,
      height: 500,
    },
    cycle: function() {
      // using drawing functions to create a dynamic square
      // cW & cH is canvas Width & Height
      // mX & mY is mouse X & Y
      this.setFill('steelblue');
      this.fRect(this.cW / 2, this.cH / 2, (this.mX / 2), (this.mY / 2));

      // add a circle that can detect mouse over
      this.setFill('grey');
      var over = this.fCircleM(100, 100, 60);

      // if mouse over, change color to orange
      if(over) {
        this.setFill('orange');
        this.fCircle(100, 100, 60);
        this.setStroke('grey');
        this.sCircle(100, 100, 70);
        this.setCursor('pointer');
      }

      // if mouse pressed, change color to orange
      if((this.MOUSE_DOWN || this.MOUSE_PRESSED) && over) {
        this.setFill('red');
        this.fCircle(100, 100, 60);
      }
    }
  });
};