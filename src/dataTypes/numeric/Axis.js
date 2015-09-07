/* global console */

import DataModel from "src/dataTypes/DataModel";
import Interval from "src/dataTypes/numeric/Interval";

Axis.prototype = new DataModel();
Axis.prototype.constructor = Axis;


//this object is deprecated

/**
 * @ignore
 *
 * @classdesc Axis for 1D data.
 *
 * @constructor
 * @description Creates a new Axis.
 * @category numbers
 */
function Axis(departureInterval, arrivalInterval) {
  //TODO why assign the incoming param, could this be moved to lines 20-21
  departureInterval = departureInterval == null ? new Interval(0, 1) : departureInterval;
  arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;

  DataModel.apply(this, arguments);
  this.departureInterval = departureInterval;
  this.arrivalInterval = arrivalInterval;

  this.setDepartureInterval(departureInterval);
  this.setArrivalInterval(arrivalInterval);

  this.type = "Axis";
}
export default Axis;



/**
 * @todo write docs
 */
Axis.prototype.setDepartureInterval = function(departureInterval) {
  this.departureInterval = departureInterval;
  console.log('--> departureInterval', departureInterval);
  this.departureAmplitude = departureInterval.getSignedAmplitude();

};

/**
 * @todo write docs
 */
Axis.prototype.setArrivalInterval = function(arrivalInterval) {
  this.arrivalInterval = arrivalInterval;
  this.arrivalAmplitude = arrivalInterval.getSignedAmplitude();
};

/**
 * @todo write docs
 */
Axis.prototype.project = function(x) {
  return this.arrivalInterval.x + this.arrivalAmplitude * (x - this.departureInterval.x) / this.departureAmplitude;
};

/*
 * to be called once interval values changed
 */
/**
 * @todo write docs
 */
Axis.prototype.update = function() {
  this.departureAmplitude = this.departureInterval.getSignedAmplitude();
  this.arrivalAmplitude = this.arrivalInterval.getSignedAmplitude();
};

/**
 * @todo write docs
 */
Axis.prototype.toString = function() {
  return "Axis[" + this.departureInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
};
