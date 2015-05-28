DateAxis.prototype = new DataModel();
DateAxis.prototype.constructor = DateAxis;

/**
 * DateAxis
 * @constructor
 */
function DateAxis(departureDateInterval, arrivalInterval) {
  arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;
  DataModel.apply(this, arguments);
  this.departureDateInterval = departureDateInterval;
  this.arrivalInterval = arrivalInterval;

  this.time0;
  this.time1;
  this.dTime;
  this.arrivalAmplitude;

  this.setDepartureDateInterval(departureDateInterval);
  this.setArrivalInterval(arrivalInterval);

  this.type = "DateAxis";
}



DateAxis.prototype.setDepartureDateInterval = function(departureDateInterval) {
  this.departureDateInterval = departureDateInterval;
  this.time0 = this.departureDateInterval.date0.getTime();
  this.time1 = this.departureDateInterval.date1.getTime();
  this.dTime = this.time1 - this.time0;

}
DateAxis.prototype.setArrivalInterval = function(arrivalInterval) {
  this.arrivalInterval = arrivalInterval;
  this.arrivalAmplitude = arrivalInterval.getAmplitude();
}

DateAxis.prototype.project = function(date) {
  return this.arrivalInterval.x + this.arrivalAmplitude * (date.getTime() - this.time0) / this.dTime;
}


/**
 * to be called once intreval values changed
 */
DateAxis.prototype.update = function() {
  this.time0 = this.departureDateInterval.date0.getTime();
  this.time1 = this.departureDateInterval.date1.getTime();
  this.dTime = this.time1 - this.time0;
  this.arrivalAmplitude = this.arrivalInterval.getAmplitude();
}


DateAxis.prototype.toString = function() {
  return "DateAxis[" + this.departureDateInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
}