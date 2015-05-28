LoadEvent.prototype = new Object();
LoadEvent.prototype.constructor = LoadEvent;

/**
 * LoadEvent
 * @constructor
 */
function LoadEvent() {
  Object.apply(this);
  this.result = null;
  this.errorType = 0;
  this.errorMessage = "";
  this.url;
}