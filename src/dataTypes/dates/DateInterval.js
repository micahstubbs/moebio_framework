import DataModel from "src/dataTypes/DataModel";
import Interval from "src/dataTypes/numeric/Interval";

DateInterval.prototype = new DataModel();
DateInterval.prototype.constructor = DateInterval;

/**
 * @classdesc Date Interval
 *
 * @description Creates a new DateInterval.
 * @param {Date} Interval's minimum value.
 * @param {Date} Interval's maximum value.
 * @constructor
 * @category dates
 */
function DateInterval(date0, date1) {
  DataModel.apply(this, arguments);
  this.date0 = date0;
  this.date1 = date1;
  this.type = "DateInterval";
}
export default DateInterval;

/**
* @todo write docs
*/
DateInterval.prototype.toString = function() {
  return "DateInterval[" + this.date0 + ", " + this.date1 + "]";
};

/**
* @todo write docs
*/
DateInterval.prototype.getMax = function() {
  if(this.date1 > this.date0) return this.date1;
  return this.date0;
};

/**
* @todo write docs
*/
DateInterval.prototype.getMin = function() {
  if(this.date0 < this.date1) return this.date0;
  return this.date1;
};

/**
 * converts the dateInterval into an Interval (getting milliseconds time from each date)
 * @return {Interval}
 * tags:conversion
 */
DateInterval.prototype.getTimesInterval = function() {
  return new Interval(this.date0.getTime(), this.date1.getTime());
};

/**
 * factors the dateInterval (specially useful: factor by an interval, in which case a sub-dateInterval is selected)
 * @param  {Object} object could be: interval
 * @return {DateInterval}
 * tags:
 */
DateInterval.prototype.getProduct = function(object) { //TODO: complete with more object types
  if(object == null) return;

  if(object.type == 'Interval') {
    var time0 = this.date0.getTime();
    var time1 = this.date1.getTime();
    var amp = time1 - time0;

    return new DateInterval(new Date(time0 + object.x * amp), new Date(time0 + object.y * amp));
  }

  return null;
};
