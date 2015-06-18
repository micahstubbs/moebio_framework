DataModel.prototype = {};
DataModel.prototype.constructor = DataModel;

/**
 * @classdesc Basic DataType from which other types are derived.
 *
 * @description Creates a new DataModel.
 * @constructor
 * @category basics
 */
function DataModel() {
  Object.apply(this);
  this.type = "DataModel";
}
DataModel.prototype.destroy = function() {
  delete this.type;
  delete this.name;
};
DataModel.prototype.setType = function(type) {
  this.type = type;
};

DataModel.prototype.getType = function(type) {
  //TODO: remove type param
  return this.type;
};
DataModel.prototype.toString = function() {

};
