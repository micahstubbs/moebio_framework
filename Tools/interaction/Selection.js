function Selection(configuration) {
  this.buttonsTexts = configuration.buttonsTexts || [];
  this.warnFunction = configuration.warnFunction;
  this.target = configuration.target;
  this.textStyle = configuration.textStyle == null ?
    {
      fontSize: 12,
      fontColor: 'black',
      fontName: LOADED_FONT
    } :
    configuration.textStyle;
  this.multiple = configuration.multiple == null ? true : configuration.multiple;
  this.oneActive = configuration.oneActive;
  this.vertical = configuration.vertical == null ? true : configuration.vertical;
  this.x = configuration.x || 0;
  this.y = configuration.y || 0;
  this.space = configuration.space == null ? (this.vertical ? 16 : 30) : configuration.space;
  this.buttonStyle = configuration.buttonStyle || 'circle';
  this.actives = configuration.actives || ListGenerators.createListWithSameElement(this.buttonsTexts.length, false);
  this.id = configuration.id;

  this.iOver = -1;
  this.lastToChange = -1;
  this.iActive;

  if(this.oneActive && this.actives.indexOf(true) == -1 && this.buttonsTexts.length > 0) this.actives[0] = true;

  switch(this.buttonStyle) {
    case 'circle':
      this.drawButtonFunction = this.drawButtonCircle;
      break;
  }

  if(!this.vertical) {
    this.xPositions = new NumberList();
    var x0 = 0;
    setText('black', configuration.fontSize, configuration.fontName);
  }

  setText(this.textStyle.fontColor, this.textStyle.fontSize, this.textStyle.fontName);

  for(var i = 0; this.buttonsTexts[i] != null; i++) {
    if(this.vertical) {

    } else {
      this.xPositions[i] = x0;
      x0 += context.measureText(this.buttonsTexts[i]).width + this.space + 12;
    }
  }
  if(!this.vertical) this.xPositions[i] = x0;

  addInteractionEventListener('mousedown', this.onMouse, this);

}

Selection.prototype.onMouse = function() {
  if(this.iOver != -1) {
    if(!this.multiple && !this.actives[this.iOver]) {
      for(var i = 0; this.buttonsTexts[i] != null; i++) {
        this.actives[i] = (i == this.iOver);
      }
      this.lastToChange = this.iOver;
      this.iActive = this.iOver;
      this.warnFunction.call(this.target, this.id);
    } else if(!this.multiple && this.oneActive && this.actives[this.iOver]) {
      //nothing
    } else {
      this.actives[this.iOver] = !this.actives[this.iOver];
      this.lastToChange = this.iOver;
      this.warnFunction.call(this.target, this.id);
    }
  }
}

Selection.prototype.draw = function() {
  this.iOver = -1;
  for(var i = 0; this.buttonsTexts[i] != null; i++) {
    if(this.vertical) {
      this.drawButtonFunction(this.buttonsTexts[i], this.x, this.y + i * this.space, this.actives[i]);
    } else {
      this.drawButtonFunction(this.buttonsTexts[i], this.x + this.xPositions[i], this.y, this.actives[i]);
      if(mY > this.y && mY < this.y + 14 && mX > this.x + this.xPositions[i] && mX < this.x + this.xPositions[i + 1]) this.iOver = i;
    }
  }
  if(this.iOver != -1) canvas.style.cursor = 'pointer';
}

Selection.prototype.drawButtonCircle = function(text, x, y, active) {
  setText(this.textStyle.fontColor, this.textStyle.fontSize, this.textStyle.fontName);
  fText(text, x + 10, y);

  setStroke(this.textStyle.fontColor);
  setLW(1);
  sCircle(x, y + this.textStyle.fontSize * 0.5, 5);

  if(active) fCircle(x, y + this.textStyle.fontSize * 0.5, 3);
}