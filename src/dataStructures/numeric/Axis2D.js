import DataModel from "src/dataStructures/DataModel";
import Point from "src/dataStructures/geometry/Point";
import Rectangle from "src/dataStructures/geometry/Rectangle";

Axis2D.prototype = new DataModel();
Axis2D.prototype.constructor = Axis2D;

/**
 * @classdesc Axis for 2D data
 *
 * @constructor
 * @description Creates a new 2d axis.
 * @category numbers
 */
function Axis2D(departureFrame, arrivalFrame) {
  arrivalFrame = arrivalFrame == null ? new Rectangle(0, 0, 1, 1) : arrivalFrame;
  DataModel.apply(this, arguments);
  this.departureFrame = departureFrame;
  this.arrivalFrame = arrivalFrame;

  this.pW;
  this.pH;

  this.setFrames(departureFrame, arrivalFrame);

  this.type = "Axis2D";
}
export default Axis2D;

Axis2D.prototype.setFrames = function(departureFrame, arrivalFrame) {
  this.departureFrame = departureFrame;
  this.arrivalFrame = arrivalFrame;
  this._update();
};

Axis2D.prototype.setDepartureFrame = function(departureFrame) {
  this.departureFrame = departureFrame;
  this._update();
};

Axis2D.prototype.setArrivalFrame = function(arrivalFrame) {
  this.arrivalFrame = arrivalFrame;
  this._update();
};


Axis2D.prototype.project = function(point) {
  return new Point((point.x - this.departureFrame.x) * this.pW + this.arrivalFrame.x, (point.y - this.departureFrame.y) * this.pH + this.arrivalFrame.y);
};


Axis2D.prototype.projectX = function(x) {
  return(x - this.departureFrame.x) * this.pW + this.arrivalFrame.x;
};

Axis2D.prototype.projectY = function(y) {
  return(y - this.departureFrame.y) * this.pH + this.arrivalFrame.y;
};

Axis2D.prototype.inverseProject = function(point) {
  return new Point((point.x - this.arrivalFrame.x) / this.pW + this.departureFrame.x, (point.y - this.arrivalFrame.y) / this.pH + this.departureFrame.y);
};


Axis2D.prototype.inverseProjectX = function(x) {
  return(x - this.arrivalFrame.x) / this.pW + this.departureFrame.x;
};

Axis2D.prototype.inverseProjectY = function(y) {
  return(y - this.arrivalFrame.y) / this.pH + this.departureFrame.y;
};




Axis2D.prototype._update = function() {
  this.pW = this.arrivalFrame.width / this.departureFrame.width;
  this.pH = this.arrivalFrame.height / this.departureFrame.height;
};


Axis2D.prototype.toString = function() {
  return "Axis2D[" + this.departureFrame.toString() + ", " + this.arrivalFrame.toString() + "]";
};
