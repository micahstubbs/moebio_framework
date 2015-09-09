InputTextField.prototype.constructor = InputTextField;


function InputTextField(id) {
  this.id = id;

  this.x = 0;
  this.y = 0;
  this.width = 200;
  this.height = 18;

  this.hovered = false;
  this.focused = false;

  this.baseText;

  this.textColor = 'black';
  this.textSize = '14';
  this.textFont = 'Arial';
  this.textAlign = 'left';
  this.textbaseLine = 'top';
  this.textStyle = '';

  this.backgroundColor = 'rgba(255,255,255,0.8)';
  this.borderStyle = null;
  this.borderWidth = 1;

  this.cursorVisible = true;
  this._intervalID = setInterval(this.cursorCycle, 500, this);

  addInteractionEventListener("mousedown", this.onMouse, this);
  addInteractionEventListener("keydown", this.onKeyDown, this);
  this._time = 0;

  this.allSelected = false;

  this.enterFunctionTarget;
  this.enterFunction;

  this._assocativeKeys = {
      49: ["1", "!", "‘"],
      71: ["g", "G", "@"],
      186: [";", ":", "¶"],
      187: ["=", "+", "±"],
      189: ["-", "_", "–"]
    }; //TODO: switch on all browsers!!!!! see: http://unixpapa.com/js/key.html
}


InputTextField.prototype.onMouse = function(event) {
  this.focused = this.hovered;
  clearInterval(this._intervalID);
  if(this.focused) {
    this.allSelected = new Date().getTime() - this._time < 400;
    this._time = new Date().getTime();
    this._intervalID = setInterval(this.cursorCycle, 500, this);
  } else {
    this.allSelected = false;
  }
  this.cursorVisible = this.focused;
};

InputTextField.prototype.setEnterFunction = function(enterFunction, target) {
  this.enterFunction = enterFunction;
  this.enterFunctionTarget = target;
};


InputTextField.prototype.cursorCycle = function(target) {
  target.cursorVisible = !target.cursorVisible;
};


InputTextField.prototype.onKeyDown = function(e) {
  if(!this.focused) return;
  var x = '';
  if(document.all) {
    var evnt = window.event;
    x = evnt.keyCode;
  } else {
    x = e.keyCode;
  }
  if(x == 8) {
    if(this.allSelected) {
      this.text = "";
    } else {
      this.text = this.text.substr(0, this.text.length - 1);
    }
  } else if(x == 13) {
    if(this.enterFunction != null) {
      this.enterFunction.call(this.enterFunctionTarget, this.id);
    }
  } else {
    var character = String.fromCharCode(x);
    console.log("onKeyDown x:" + x + ", character: [" + character + "]");
    if(this._assocativeKeys[x] != null) {
      if(this.allSelected) {
        this.text = "";
      }
      if(e.shiftKey) {
        character = this._assocativeKeys[x][1];
      } else if(e.altKey) {
        character = this._assocativeKeys[x][2];
      } else {
        character = this._assocativeKeys[x][0];
      }
      this.text += character;
    } else if(character.match(/[a-zA-Z0-9 _\-#@:$%^&*\(\)\.]/)) {
      if(this.allSelected) {
        this.text = "";
      }
      if(e.shiftKey) {
        if(character.match(/[0-9]/)) {
          character = ") ! @ # $ % ^ & * (".split(" ")[Number(character)];
        } else {
          character = character.toUpperCase();
        }
      } else {
        character = character.toLowerCase();
      }
      this.text += character;
    }
  }
  this.allSelected = false;
};


InputTextField.prototype.draw = function(context) {
  this.hovered = mouseY > this.y && mouseY < this.y + this.height && mouseX > this.x && mouseX < this.x + this.width;
  if(this.hovered) canvas.style.cursor = 'text';

  //background

  context.fillStyle = this.backgroundColor;
  context.fillRect(this.x, this.y, this.width, this.height);



  DrawTexts.setContextTextProperties(this.textColor, this.textSize, this.textFont, this.textAlign, this.textbaseLine, this.textStyle);

  var text = this.text;

  var textWidthComplete = context.measureText(text).width;
  var textWidth = textWidthComplete;

  while(textWidth > this.width) {
    text = this.text.substr(0, text.length - 2) + "…";
    textWidth = context.measureText(text).width;
  }



  if(textWidthComplete < this.width) {
    if(this.cursorVisible) {
      context.strokeStyle = 'black';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(this.x + textWidthComplete + 2, this.y + 2);
      context.lineTo(this.x + textWidthComplete + 2, this.y + this.height - 2);
      context.stroke();
    }
  }


  //selection

  if(this.allSelected) {
    context.fillStyle = 'rgb(150,150,150)';
    context.fillRect(this.x + 1, this.y + 2, textWidth - 2, this.height - 4);
  }

  //draw text

  DrawTexts.setContextTextProperties(this.textColor, this.textSize, this.textFont, this.textAlign, this.textbaseLine, this.textStyle);

  context.fillStyle = text == "" || text == null ? 'gray' : this.textColor;
  text = (text == "" || text == null) && this.baseText != null ? this.baseText : text;
  context.fillText(text, this.x, this.y);
};

InputTextField.prototype.setText = function(text) {
  this.text = text;
};

InputTextField.prototype.getText = function() {
  return this.text;
};