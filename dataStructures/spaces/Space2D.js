function Space2D(configuration) {
  configuration = configuration == null ? {} : configuration;

  this.center = configuration.center == null ? new Point(0, 0) : configuration.center;
  this.scale = 1;

  if(configuration.interactionActive) this.activeInteraction();

  this.MIN_SCALE = configuration.minScale == null ? 0.05 : configuration.minScale;
  this.MAX_SCALE = configuration.maxScale == null ? 20 : configuration.maxScale;

  this.active = configuration.interactionActive;
}

Space2D.prototype.activeInteraction = function() {
  if(this.active) return;
  this.active = true;
  addInteractionEventListener('mousedown', this.onMouse, this);
  addInteractionEventListener('mouseup', this.onMouse, this);
  addInteractionEventListener('mousewheel', this.wheel, this);
}

Space2D.prototype.deActivate = function() {
  this.active = false;
  this.dragging = false;
  removeInteractionEventListener('mousedown', this.onMouse, this);
  removeInteractionEventListener('mouseup', this.onMouse, this);
  removeInteractionEventListener('mousemove', this.onMouse, this);
  removeInteractionEventListener('mousewheel', this.wheel, this);
}

Space2D.prototype.stopDragging = function() {
  removeInteractionEventListener('mousemove', this.onMouse, this);
}

Space2D.prototype.project = function(point) {
  return new Point((point.x - this.center.x) * this.scale, (point.y + this.center.y) * this.scale);
}

Space2D.prototype.projectX = function(x) {
  return(x - this.center.x) * this.scale;
}

Space2D.prototype.projectY = function(y) {
  return(y - this.center.y) * this.scale;
}


Space2D.prototype.inverseProject = function(point) {
  return new Point(point.x / this.scale + this.center.x, point.y / this.scale + this.center.y);
}

Space2D.prototype.inverseProjectX = function(x) {
  return x / this.scale + this.center.x;
}

Space2D.prototype.inverseProjectY = function(y) {
  return y / this.scale + this.center.y;
}

Space2D.prototype.move = function(vector, projected) {
  this.center = this.center.subtract(projected ? vector.factor(1 / this.scale) : vector);
}

Space2D.prototype.factorScaleFromPoint = function(point, factor) {
  var k = (1 - 1 / factor) / this.scale;
  this.center.x = k * point.x + this.center.x
  this.center.y = k * point.y + this.center.y;

  this.scale *= factor;
}

Space2D.prototype.fixX = function(xDeparture, xArrival) {
  this.center.x = xDeparture - (xArrival / this.scale);
}
Space2D.prototype.fixY = function(yDeparture, yArrival) {
  this.center.y = yDeparture - (yArrival / this.scale);
}

Space2D.prototype.fixHorizontalInterval = function(departureInterval, arrivalInterval) {
  this.scale = arrivalInterval.getAmplitude() / departureInterval.getAmplitude();
  this.fixX((departureInterval.x + departureInterval.y) * 0.5, cW * 0.5);
}

//////

Space2D.prototype.onMouse = function(e) {
  switch(e.type) {
    case 'mousedown':
      if(!this.active) return;
      this.dragging = true;
      this.prev_mX = mX;
      this.prev_mY = mY;
      addInteractionEventListener('mousemove', this.onMouse, this);
      break;
    case 'mouseup':
      this.dragging = false;
      removeInteractionEventListener('mousemove', this.onMouse, this);
      break;
    case 'mousemove':
      if(!this.active) return;
      this.center.x += (this.prev_mX - mX) / this.scale;
      this.center.y += (this.prev_mY - mY) / this.scale;
      this.prev_mX = mX;
      this.prev_mY = mY;
      break;
  }
}



Space2D.prototype.wheel = function(e) {
  if(!this.active) return;
  if(this.scale <= this.MIN_SCALE && e.value > 0) {
    this.scale = this.MIN_SCALE;
    return;
  }
  if(this.scale >= this.MAX_SCALE && e.value < 0) {
    this.scale = this.MAX_SCALE;
    return;
  }
  this.factorScaleFromPoint(new Point(mX - 0, mY - 0), (1 - 0.02 * e.value));
}