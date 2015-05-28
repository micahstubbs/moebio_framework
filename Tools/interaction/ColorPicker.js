/*
 */
ColorPicker.prototype.constructor = ColorPicker;

/**
 * modes
 * 0: frame to frame draggin vector
 * 1: from click point dragging
 * @constructor
 */
function ColorPicker() {
  this.x = 0;
  this.y = 0;
  this.width = 200;
  this.height = 200;

  this.nH = 10;
  this.nV = 10;

  this.saturation = 1;
  this.dHue = 360 / (this.nH + 1);
  this.dLight = 1 / (this.nH + 2);

  this.visible = false;

  this.backgroundColor = 'rgb(200,200,200)';

  this.margin = 2;
}


ColorPicker.prototype.draw = function() {
  var dX = this.width / (this.nH);
  var dY = this.height / this.nV;

  var dXMargined = dX - 2 * this.margin;
  var dYMargined = dY - 2 * this.margin;

  context.fillStyle = this.backgroundColor;
  context.fillRect(this.x, this.y, this.width, this.height);

  for(var i = 0; i < this.nH; i++) {
    for(var j = 0; j < this.nV; j++) {
      context.fillStyle = this.colorAtSquare(i, j);
      context.fillRect(this.x + i * dX + this.margin, this.y + j * dY + this.margin, dXMargined, dYMargined);
    }
  }
}

ColorPicker.prototype.colorAtSquare = function(i, j) {
  if(i < this.nH - 1) return ColorOperators.HSLtoHEX(i * this.dHue, this.saturation, (j + 1) * this.dLight);
  return ColorOperators.grayByLevel(j / (this.nV - 1));
}

ColorPicker.prototype.colorBelowMouse = function() {
  if(mouseX < this.x || mouseX > this.x + this.width || mouseY < this.y || mouseY > this.y + this.height) return null;
  return this.colorFromCoordinate(mouseX - this.x, mouseY - this.y);
}

ColorPicker.prototype.colorFromCoordinate = function(x, y) {
  return this.colorAtSquare(this.nH * x / this.width, this.nV * y / this.height);
}