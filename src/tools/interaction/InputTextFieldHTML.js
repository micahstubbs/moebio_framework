InputTextFieldHTML.prototype.constructor = InputTextFieldHTML;


/**
 * @classdesc Instanciable class that manages and renders a text in a html text area.
 *
 * @param configuration configuration Object with parameters (x, y, width, height, text, fontColor, fontSize, fontName, fontStyle, linkFunction, target…)
 * @constructor
 * @category strings
 */
function InputTextFieldHTML(configuration, graphics) {
  this.id = configuration.id == null ? 0 : configuration.id;
  this.graphics = graphics;

  this.target = configuration.target;

  this.x = configuration.x == null ? 0 : configuration.x;
  this.y = configuration.y == null ? 0 : configuration.y;
  this.width = configuration.width == null ? 200 : configuration.width;
  this.height = configuration.height == null ? 20 : configuration.height;
  this.fontSize = configuration.fontSize == null ? 16 : configuration.fontSize;

  this.enterFunction = configuration.enterFunction;
  this.changeFunction = configuration.changeFunction;
  this.focusFunction = configuration.focusFunction;
  this.blurFunction = configuration.blurFunction;

  this.text = configuration.text;

  this.textarea = configuration.textarea == null ? true : configuration.textarea;
  this.readOnly = configuration.readOnly == null ? false : configuration.readOnly;
  this.border = configuration.border == null ? true : configuration.border;
  this.password = configuration.password;

  this.zIndex = 30;

  this.textColor = configuration.textColor == null ? 'black' : configuration.textColor;
  this.backgroundColor = '#FFFFFF';

  this.main = graphics.container;// document.getElementById('maindiv');
  this.div = document.createElement('div2');
  this.textarea ? this.DOMtext = document.createElement("textarea") : this.DOMtext = document.createElement("input");
  this.password ? this.DOMtext.setAttribute('type', 'password') : this.DOMtext.setAttribute('type', 'text');
  this.div.setAttribute('style', 'position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + ';');

  if(!this.border) this.DOMtext.setAttribute('style', 'border:none');

  this.div.setAttribute('rows', '1');
  this.main.appendChild(this.div);
  this.div.appendChild(this.DOMtext);
  this.DOMtext.parent = this;
  this.added = true;

  this.DOMtext.readOnly = this.readOnly;

  this.DOMtext.onfocus = function() {
    //e.target = this.parent;
    this.parent._onFocus(this.parent);
  };
  this.DOMtext.onblur = function() {
    //e.target = this.parent;
    this.parent._onBlur(this.parent);
  };

  this.DOMtext.value = "";

  //this.graphics.on("keydown", this.onKeyDown, this);
  this.div.addEventListener("keydown", this.onKeyDown, this);

  this.focus = false;

  if(this.changeFunction != null) this.setChangeFunction(this.changeFunction, this.target);
  if(this.enterFunction != null) this.setEnterFunction(this.enterFunction, this.target);
  if(this.focusFunction != null) this.setFocusFunction(this.focusFunction, this.target);
  if(this.blurFunction != null) this.setBlurFunction(this.blurFunction, this.target);

  if(this.text != null) {
    this.setText(this.text);
  } else {
    this.draw();
  }

  // TODO What is this supposed to do?
  this.DOMtext.addEventListener("mousemove", this.graphics._onMouse, false);
  // TODO find out what this was for onMoveCycle doesn't exist anymore
  //if(this.graphics._cycleOnMouseMovement) this.DOMtext.addEventListener('mousemove', onMoveCycle, false);
}
export default InputTextFieldHTML;

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setBorder = function(value) {
  this.border = value;
  this.DOMtext.setAttribute('style', 'border:0; color: ' + this.textColor + '; width:' + (this.width - 7) + 'px;height:' + (this.height - 7) + 'px; font-size:' + this.fontSize + 'px; border:' + (value ? 'yes' : 'none'));
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.draw = function() {
  if(this.x != this._prevX || this.y != this._prevY || this.width != this._prevWidth || this.height != this._prevHeight || this.text != this._prevText) {
    this._prevX = this.x;
    this._prevY = this.y;
    this._prevWidth = this.width;
    this._prevHeight = this.height;
    this._prevText = this.text;

    // this.DOMtext.style = "none";
    this.DOMtext.style.padding = "0px";
    this.DOMtext.style.border = "0px";
    this.DOMtext.style.borderColor = "#FFFFFF";
    this.DOMtext.style.background = "transparent";
    this.DOMtext.style.resize = "none";

    this.DOMtext.setAttribute('style', 'border: 0; color: ' + this.textColor + '; width:' + (this.width - 7) + 'px;height:' + (this.height - 7) + 'px; font-size:' + this.fontSize + 'px');
    this.div.setAttribute('style', 'border: 0; position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + ';');
  }
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setText = function(text, activeChange) {
  activeChange = activeChange == null ? true : activeChange;
  this.text = text;
  this.DOMtext.value = text;

  //var timer = setTimeout(this.onKeyDownDelayed, 4, this);
  this.draw();
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.getText = function() {
  return this.DOMtext.value;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.getSelectionStart = function() {
  return this.DOMtext.selectionStart;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.onKeyDown = function(e) {
  console.log('InputTextFieldHTML.prototype.onKeyDown, e', e);
  console.log('e.srcElement', e.srcElement);
  console.log('e.srcElement.parent', e.srcElement.parent);
  console.log('e.srcElement.parent.onKeyDownDelayed', e.srcElement.parent.onKeyDownDelayed);

  var target = e.srcElement.parent;

  target._eKeyDown = e;
  target._keyCode = e.keyCode;

  target.timer = setTimeout(target.onKeyDownDelayed, 4, target);
  console.log('timer>');
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.onKeyDownDelayed = function(target) {
  console.log('InputTextFieldHTML.prototype.onKeyDownDelayed, target, target.DOMtext', target, target.DOMtext);

  if(target._keyCode == 13 && target.DOMtext == document.activeElement) {
    if(target.enterFunction != null) {
      target.enterFunction.call(target.enterFunctionTarget, target.id);
    }
  }

  if(target.text != target.DOMtext.value) {

    target.text = target.DOMtext.value;
    //var lastChar = target.text.charAt(target.text.length - 1);

    if(target._keyCode != 13) {
      if(target.changeFunction != null) {
        console.log('call target.changeFunctionTarget');
        target.changeFunction.call(target.changeFunctionTarget, target.id);
      }
    }
  }

  this.timer = null;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.forceFocus = function() {
  this.DOMtext.focus();
  this.focus = true;
};

/**
 * @todo write docs
 */
// InputTextFieldHTML.prototype.forceUnfocus = function() {
//   console.log("[!] use InputTextFieldHTML.prototype.forceBlur instead");
//   a.push(0); // TODO where does this come from
// };

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.forceBlur = function() {
  console.log('InputTextFieldHTML.prototype.forceBlur');

  this.DOMtext.blur();
  this.focus = false;
};


/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setEnterFunction = function(enterFunction, target) {
  this.enterFunction = enterFunction;
  this.enterFunctionTarget = target;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setChangeFunction = function(changeFunction, target) {
  this.changeFunction = changeFunction;
  this.changeFunctionTarget = target;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setFocusFunction = function(focusFunction, target) {
  this.focusFunction = focusFunction;
  this.focusFunctionTarget = target;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setBlurFunction = function(blurFunction, target) {
  this.blurFunction = blurFunction;
  this.blurFunctionTarget = target;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setSelection = function(start, end) {
  start = start == null ? 0 : start;
  end = end == null ? this.DOMtext.value.length : end;
  this.DOMtext.selectionStart = start;
  this.DOMtext.selectionEnd = end;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.placeCursor = function(nChar) {
  console.log('InputTextFieldHTML.prototype.placeCursor, nChar', nChar);
  this.setSelection(nChar);
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.setScrollPosition = function(y) {
  if(y <= 1) y = Math.floor(y * this.DOMtext.scrollHeight);
  this.DOMtext.scrollTop = y;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.getScrollPosition = function() {
  return this.DOMtext.scrollTop;
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.getTextHeight = function() {
  return this.DOMtext.scrollHeight;
};

/**
 * @ignore
 */
InputTextFieldHTML.prototype._onFocus = function(target) {
  target.focus = true;
  if(target.focusFunction != null) target.focusFunction.call(target.focusFunctionTarget, target.id);
};

/**
 * @ignore
 */
InputTextFieldHTML.prototype._onBlur = function(target) {
  target.focus = false;
  if(target.blurFunction != null) target.blurFunction.call(target.blurFunctionTarget, target.id);
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.remove = function() {
  console.log('InputTextFieldHTML.prototype.remove, his.added', this.added);

  if(this.added) {
    this.div.removeChild(this.DOMtext);
    this.main.removeChild(this.div);
    this.added = false;
  }
};

/**
 * @todo write docs
 */
InputTextFieldHTML.prototype.readd = function() {
  console.log('InputTextFieldHTML.prototype.readd, his.added', this.added);

  if(!this.added) {
    this.main.appendChild(this.div);
    this.div.appendChild(this.DOMtext);
    this.added = true;
  }
};

/**
 * @todo write docs
 */
// InputTextFieldHTML.prototype.disappear = function() {
//   console.log('[!] InputTextFieldHTML.prototype.disappear replaced by remove');
//   a.push(0); // TODO where does this come from?
//   this.x = -10000;
//   this.draw();
// };
