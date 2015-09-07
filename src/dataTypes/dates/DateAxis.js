import DataModel from "src/dataTypes/DataModel";
import Interval from "src/dataTypes/numeric/Interval";

DateAxis.prototype = new DataModel();
DateAxis.prototype.constructor = DateAxis;

/**
 * @classdesc Date based {@link Axis}.
 *
 * @description Creates a new DateAxis.
 * @constructor
 * @category dates
 */
function DateAxis(departureDateInterval, arrivalInterval) {
  arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;
  DataModel.apply(this, arguments);
  this.departureDateInterval = departureDateInterval;
  this.arrivalInterval = arrivalInterval;

  this.time0 = undefined;
  this.time1 = undefined;
  this.dTime = undefined;
  this.arrivalAmplitude = undefined;

  this.setDepartureDateInterval(departureDateInterval);
  this.setArrivalInterval(arrivalInterval);

  this.type = "DateAxis";
}
export default DateAxis;



/**
* @todo write docs
*/
DateAxis.prototype.setDepartureDateInterval = function(departureDateInterval) {
  this.departureDateInterval = departureDateInterval;
  this.time0 = this.departureDateInterval.date0.getTime();
  this.time1 = this.departureDateInterval.date1.getTime();
  this.dTime = this.time1 - this.time0;

};

/**
* @todo write docs
*/
DateAxis.prototype.setArrivalInterval = function(arrivalInterval) {
  this.arrivalInterval = arrivalInterval;
  this.arrivalAmplitude = arrivalInterval.getAmplitude();
};

/**
* @todo write docs
*/
DateAxis.prototype.project = function(date) {
  return this.arrivalInterval.x + this.arrivalAmplitude * (date.getTime() - this.time0) / this.dTime;
};


/**
* to be called once intreval values changed
* @todo write docs
*/
DateAxis.prototype.update = function() {
  this.time0 = this.departureDateInterval.date0.getTime();
  this.time1 = this.departureDateInterval.date1.getTime();
  this.dTime = this.time1 - this.time0;
  this.arrivalAmplitude = this.arrivalInterval.getAmplitude();
};


/**
* @todo write docs
*/
DateAxis.prototype.toString = function() {
  return "DateAxis[" + this.departureDateInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
};
