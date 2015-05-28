ToolTip.prototype.constructor = ToolTip;


function ToolTip(target) {
  this.target = target == null ? this : target;

  this.width = 500;
  this.height = 200;
  this.visible = false;

  this.text;
  this.lines;
  this.interlines_space = 16;
  this.heightMax = 600;

  this.x = 0;
  this.y = 0;

  this.pointedX = -1;
  this.pointedY = -1;

  this.drawContentFunction = this.drawText;

  this.toolTipPlacement = 4;
  //0: top
  //1: right;
  //2: bottom;
  //3: left;
  //4: automatic

}

ToolTip.prototype.draw = function() {
  if(this.visible) {
    this.drawShape();
    this.drawContentFunction.call(this.target);
  }
}

ToolTip.prototype.drawText = function() {
  DrawTexts.setContextTextProperties('black', 12);
  DrawTexts.fillTextWordWrapWithTextLines(context, this.lines, this.x + 4, this.y + 4, this.height, this.interlines_space);
}



////////// setters

//0: text
ToolTip.prototype.setText = function(newText, size) {
  if(newText == undefined || newText == "") return;
  this.textSize = size || 12;
  if(newText == undefined) newText = "";
  if(newText != this.text) {
    this.text = newText;
    DrawTexts.setContextTextProperties('black', this.textSize, 'Arial', 'right', 'top');
    this.lines = DrawTexts.textWordWrapReturnLines(newText, this.width - 8, this.heightMax);
    this.drawContentFunction = this.drawText;
    this.target = this;
  }
  this.height = this.lines.length * this.interlines_space + 12;
  this.settedMode = 0;
}




// 
// 



//////

ToolTip.prototype.drawShape = function() {
  context.fillStyle = 'rgba(255,255,255,0.9)';
  switch(this.toolTipPlacement) {
    case 2:
      this.x = 0.7 * this.x + 0.3 * Math.min(Math.max(5, mouseX - this.width * 0.3), canvasWidth - this.width - 5);
      this.y = 0.7 * this.y + 0.3 * Math.min(Math.max(5, mouseY + 50), this.pointedY + 30);

      this.drawShapeInPlace(2);
      break;
    case 4:
      var angle = Math.atan2((this.pointedY - canvasHeight * 0.5) / canvasHeight, (this.pointedX - canvasWidth * 0.5) / canvasWidth) + Math.PI;
      var r = Math.sqrt(Math.pow(this.width * 0.5, 2), Math.pow(this.height * 0.5, 2)) * 1.2;
      var center = new Point(this.pointedX + r * Math.cos(angle), this.pointedY + r * Math.sin(angle));

      this.x = center.x - this.width * 0.5;
      this.y = center.y - this.height * 0.5;

      var place;

      if(this.y > this.pointedY) {
        this.y = this.pointedY + 20;
        place = 2;
      } else if(this.y < this.pointedY - this.height) {
        this.y = this.pointedY - this.height - 20;
        place = 0;
      } else if(this.x > this.pointedX) {
        this.x = this.pointedX + 20;
        place = 1;
      } else if(this.x < this.pointedX - this.width) {
        this.x = this.pointedX - this.width - 20;
        place = 3;
      }

      this.drawShapeInPlace(place);
  }
}

ToolTip.prototype.drawShapeInPlace = function(place) {
  context.beginPath();
  switch(place) {
    case 0: //top
      var xSelected = Math.max(Math.min(this.pointedX, this.x + this.width - 10), this.x + 10);

      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.width, this.y);
      context.lineTo(this.x + this.width, this.y + this.height);

      context.lineTo(xSelected + 10, this.y + this.height);
      context.lineTo(this.pointedX, this.pointedY);
      context.lineTo(xSelected - 10, this.y + this.height);

      context.lineTo(this.x, this.y + this.height);
      context.lineTo(this.x, this.y);
      break;
    case 1: //right
      var ySelected = Math.min(Math.max(this.pointedY, this.y + 10), this.y + this.height - 10);

      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.width, this.y);

      context.lineTo(this.x + this.width, this.y + this.height);
      context.lineTo(this.x, this.y + this.height);

      context.lineTo(this.x, ySelected + 10);
      context.lineTo(this.x - 20, this.pointedY);
      context.lineTo(this.x, ySelected - 10);

      context.lineTo(this.x, this.y);
      break;
    case 2: //bottom
      xSelected = Math.max(Math.min(this.pointedX, this.x + this.width - 10), this.x + 10);;

      context.moveTo(this.x, this.y);

      context.lineTo(xSelected - 10, this.y);
      context.lineTo(this.pointedX, this.pointedY);
      context.lineTo(xSelected + 10, this.y);

      context.lineTo(this.x + this.width, this.y);
      context.lineTo(this.x + this.width, this.y + this.height);
      context.lineTo(this.x, this.y + this.height);
      context.lineTo(this.x, this.y);
      break;
    case 3: //left
      ySelected = Math.min(Math.max(this.pointedY, this.y + 10), this.y + this.height - 10);
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.width, this.y);

      context.lineTo(this.x + this.width, ySelected - 10);
      context.lineTo(this.x + this.width + 20, this.pointedY);
      context.lineTo(this.x + this.width, ySelected + 10);

      context.lineTo(this.x + this.width, this.y + this.height);
      context.lineTo(this.x, this.y + this.height);
      context.lineTo(this.x, this.y);
      break;
  }
  context.fill();
}