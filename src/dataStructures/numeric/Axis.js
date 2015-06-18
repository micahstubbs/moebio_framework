Axis.prototype = new DataModel();
Axis.prototype.constructor = Axis;


//this object is deprecated

/**
 * @classdesc Axis for 1D data.
 *
 * @constructor
 * @description Creates a new Axis.
 * @category numbers
 */
function Axis(departureInterval, arrivalInterval) {
  departureInterval = departureInterval == null ? new Interval(0, 1) : departureInterval;
  arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;

  DataModel.apply(this, arguments);
  this.departureInterval = departureInterval;
  this.arrivalInterval = arrivalInterval;

  this.departureAmplitude;
  this.arrivalAmplitude;

  this.setDepartureInterval(departureInterval);
  this.setArrivalInterval(arrivalInterval);

  this.type = "Axis";
}



Axis.prototype.setDepartureInterval = function(departureInterval) {
  this.departureInterval = departureInterval;
  c.log('--> departureInterval', departureInterval);
  this.departureAmplitude = departureInterval.getSignedAmplitude();

};
Axis.prototype.setArrivalInterval = function(arrivalInterval) {
  this.arrivalInterval = arrivalInterval;
  this.arrivalAmplitude = arrivalInterval.getSignedAmplitude();
};

Axis.prototype.project = function(x) {
  return this.arrivalInterval.x + this.arrivalAmplitude * (x - this.departureInterval.x) / this.departureAmplitude;
};


/**
 * to be called once interval values changed
 */
Axis.prototype.update = function() {
  this.departureAmplitude = this.departureInterval.getSignedAmplitude();
  this.arrivalAmplitude = this.arrivalInterval.getSignedAmplitude();
};


Axis.prototype.toString = function() {
  return "Axis[" + this.departureInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
};
