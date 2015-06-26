
init = function init() {
};

cycle = function cycle() {
  // using drawing functions to create a dynamic square
  // cW & cH is canvas Width & Height
  // mX & mY is mouse X & Y
  setFill('steelblue');
  fRect(cW / 2, cH / 2, (mX / 2), (mY / 2));

  // add a circle that can detect mouse over
  setFill('grey');
  var over = fCircleM(100, 100, 60);

  // if mouse over, change color to orange
  if(over) {
    setFill('orange');
    fCircle(100, 100, 60);
    setStroke('grey');
    sCircle(100, 100, 70);
    setCursor('pointer');
  }

  // if mouse pressed, change color to orange
  if((MOUSE_DOWN || MOUSE_PRESSED) && over) {
    setFill('red');
    fCircle(100, 100, 60);
  }

};
