
init = function init() {
};

cycle = function cycle() {
  // using drawing functions to create a dynamic square
  // cW & cH is canvas Width & Height
  // mX & mY is mouse X & Y
  mo.setFill('steelblue');
  mo.fRect(mo.cW / 2, mo.cH / 2, (mo.mX / 2), (mo.mY / 2));

  // add a circle that can detect mouse over
  mo.setFill('grey');
  var over = mo.fCircleM(100, 100, 60);

  // if mouse over, change color to orange
  if(over) {
    mo.setFill('orange');
    mo.fCircle(100, 100, 60);
    mo.setStroke('grey');
    mo.sCircle(100, 100, 70);
    mo.setCursor('pointer');
  }

  // if mouse pressed, change color to orange
  if((mo.MOUSE_DOWN || mo.MOUSE_PRESSED) && over) {
    mo.setFill('red');
    mo.fCircle(100, 100, 60);
  }

};
