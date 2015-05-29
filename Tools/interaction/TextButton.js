TextButton.prototype.constructor = TextButton;


function TextButton(configuration) {
  var configuration = configuration == null ? {} : configuration;

  this.text = configuration.text == null ? 'button' : configuration.text;

  this.warnFunction = configuration.warnFunction;
  this.target = configuration.target;
  this.id = configuration.id;

  this.fontColor = configuration.fontColor == null ? 'black' : configuration.fontColor;
  this.fontSize = configuration.fontSize == null ? '14' : configuration.fontSize;
  this.fontName = configuration.fontName == null ? 'Arial' : configuration.fontName;
  this.fontStyle = configuration.fontStyle == null ? '' : configuration.fontStyle;

  this.backgroundColor = configuration.backgroundColor;
  this.margin = configuration.margin == null ? 0 : configuration.margin;

  this.x = configuration.x == null ? 0 : configuration.x;
  this.y = configuration.y == null ? 0 : configuration.y;

  this.underline = configuration.underline == null ? false : configuration.underline;

  this.active = configuration.active == null ? true : configuration.active;

  this.on = configuration.on == null ? true : configuration.on;

  this.width;
  this.height;

  this._updateDimensions();

  addInteractionEventListener('mousedown', this.onMouse, this);
}

TextButton.prototype.onMouse = function(e) {
  if(this.active && this.mouseOnButton()) {
    this.on = !this.on;
    this.warnFunction.call(this.target, this.id);
  }
};

TextButton.prototype.setText = function(text) {
  this.text = text;
  this._updateDimensions();
};

TextButton.prototype.setTextProperties = function(fontColor, fontSize, fontName, fontStyle) {
  this.fontColor = fontColor;
  this.fontSize = fontSize;
  this.fontName = fontName;
  this.fontStyle = fontStyle;
  this._updateDimensions();
};

TextButton.prototype._updateDimensions = function() {
  DrawTexts.setContextTextProperties(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);
  this.width = context.measureText(this.text).width;
  this.height = this.fontSize * DrawTexts.POINT_TO_PIXEL;
};

TextButton.prototype.draw = function() {
  if(this.backgroundColor != null) {
    context.fillStyle = this.backgroundColor;
    context.fillRect(this.x - this.margin, this.y - this.margin, this.width + 2 * this.margin, this.height + 2 * this.margin);
  }
  DrawTexts.setContextTextProperties(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);
  context.fillText(this.text, this.x, this.y);

  if(this.underline) {
    var yLine = Math.floor(this.y + this.height * 0.8) + 0.5;
    context.strokeStyle = this.fontColor;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(this.x, yLine);
    context.lineTo(this.x + this.width, yLine);
    context.stroke();
  }

  if(this.active && this.mouseOnButton()) canvas.style.cursor = 'pointer';
};

TextButton.prototype.mouseOnButton = function() {
  return mY > this.y && mY < this.y + this.height && mX > this.x && mX < this.x + this.width;
};