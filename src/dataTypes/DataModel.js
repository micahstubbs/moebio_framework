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
	// TODO. What is the intent in this line. I don't think its needed.
  Object.apply(this);
  this.type = "DataModel";
}
export default DataModel;

/**
 * @todo write docs
 */
DataModel.prototype.destroy = function() {
	// TODO. Why is this being done? It is in a few
	// places in the codebase. Also this.name isn't
	// defined here.
  delete this.type;
  delete this.name;
};

/**
 * @todo write docs
 */
DataModel.prototype.setType = function(type) {
  this.type = type;
};

/**
 * @todo write docs
 */
DataModel.prototype.getType = function() {
  return this.type;
};

/**
 * @todo write docs
 */
DataModel.prototype.toString = function() {

};
