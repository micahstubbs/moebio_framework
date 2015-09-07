import DataModel from "src/dataTypes/DataModel";
import Point from "src/dataTypes/geometry/Point";
import Rectangle from "src/dataTypes/geometry/Rectangle";

Axis2D.prototype = new DataModel();
Axis2D.prototype.constructor = Axis2D;

/**
 * @classdesc Axis for 2D data
 *
 * @constructor
 * @description Creates a new 2d axis.
 * @param  {Rectangle} departureFrame The Departure Frame
 * @param  {Rectangle} arrivalFrame   The Arrival Frame
 * @category numbers
 */
function Axis2D(departureFrame, arrivalFrame) {
  arrivalFrame = arrivalFrame == null ? new Rectangle(0, 0, 1, 1) : arrivalFrame;
  DataModel.apply(this, arguments);
  this.departureFrame = departureFrame;
  this.arrivalFrame = arrivalFrame;

  this.pW = undefined;
  this.pH = undefined;

  this.setFrames(departureFrame, arrivalFrame);

  this.type = "Axis2D";
}
export default Axis2D;

/**
 * Setup frames
 * @param  {Rectangle} departureFrame The Departure Frame
 * @param  {Rectangle} arrivalFrame   The Arrival Frame
 */
Axis2D.prototype.setFrames = function(departureFrame, arrivalFrame) {
  this.departureFrame = departureFrame;
  this.arrivalFrame = arrivalFrame;
  this._update();
};

/**
 * Set departure frame
 * @param  {Object} departureFrame New Departure Frame.
 */
Axis2D.prototype.setDepartureFrame = function(departureFrame) {
  this.departureFrame = departureFrame;
  this._update();
};

/**
 * Set arrival frame
 * @param  {Rectangle} arrivalFrame New arrival Frame.
 */
Axis2D.prototype.setArrivalFrame = function(arrivalFrame) {
  this.arrivalFrame = arrivalFrame;
  this._update();
};


/**
 * Projects a given point from the arrival frame to the departure frame.
 * @param  {Point} point Point to project.
 * @return {Point} projected Point.
 */
Axis2D.prototype.project = function(point) {
  return new Point((point.x - this.departureFrame.x) * this.pW + this.arrivalFrame.x, (point.y - this.departureFrame.y) * this.pH + this.arrivalFrame.y);
};


/**
 * Projects a given X value from the arrival frame to the departure frame.
 * @param  {Number} x X value to project.
 * @return {Number} new X value.
 */
Axis2D.prototype.projectX = function(x) {
  return(x - this.departureFrame.x) * this.pW + this.arrivalFrame.x;
};

/**
 * Projects a given y value from the arrival frame to the departure frame.
 * @param  {Number} y Y value to project.
 * @return {Number} new Y value.
 */
Axis2D.prototype.projectY = function(y) {
  return(y - this.departureFrame.y) * this.pH + this.arrivalFrame.y;
};

/**
 * Projects a given Point from the departure frame to the arrival frame.
 * @param  {Point} point Point to project in the departure frame.
 * @return {Point} reverse projected Point in the arrival frame.
 */
Axis2D.prototype.inverseProject = function(point) {
  return new Point((point.x - this.arrivalFrame.x) / this.pW + this.departureFrame.x, (point.y - this.arrivalFrame.y) / this.pH + this.departureFrame.y);
};


/**
 * Projects a given X value from the departure frame to the arrival frame.
 * @param  {Number} x X value to project.
 * @return {Number} new X value.
 */
Axis2D.prototype.inverseProjectX = function(x) {
  return(x - this.arrivalFrame.x) / this.pW + this.departureFrame.x;
};

/**
 * Projects a given Y value from the departure frame to the arrival frame.
 * @param  {Number} y Y value to project.
 * @return {Number} new Y value.
 */
Axis2D.prototype.inverseProjectY = function(y) {
  return(y - this.arrivalFrame.y) / this.pH + this.departureFrame.y;
};


/**
* @ignore
*/
Axis2D.prototype._update = function() {
  this.pW = this.arrivalFrame.width / this.departureFrame.width;
  this.pH = this.arrivalFrame.height / this.departureFrame.height;
};


/**
 * Convert Axis to string
 * @return {String} String representation of axis.
 */
Axis2D.prototype.toString = function() {
  return "Axis2D[" + this.departureFrame.toString() + ", " + this.arrivalFrame.toString() + "]";
};
