LoadEvent.prototype = {};
LoadEvent.prototype.constructor = LoadEvent;

/**
 * LoadEvent
 * @constructor
 * @category misc
 */
function LoadEvent() {
  Object.apply(this);
  this.result = null;
  this.errorType = 0;
  this.errorMessage = "";
  this.url = '';
}
export default LoadEvent;
