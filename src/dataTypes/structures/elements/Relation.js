import Node from "src/dataTypes/structures/elements/Node";

Relation.prototype = Object.create(Node.prototype);
Relation.prototype.constructor = Relation;

/**
 * Relation
 * @classdesc Relations represent the edges that connect Nodes
 * in a Network DataType.
 *
 * @description create a new Relation.
 * @constructor
 * @param {String} id ID of the Relation.
 * @param {String} name Name of the Relation.
 * @param {Node} node0 Source of the Relation.
 * @param {Node} node1 Destination of the Relation.
 * @param {Number} weight Edge weight associated with Relation.
 * Defaults to 1.
 * @param {String} content Other data to associate with this Relation.
 * @category networks
 */
function Relation(id, name, node0, node1, weight, content) {
  Node.call(this, id, name);
  this.type = "Relation";

  this.node0 = node0;
  this.node1 = node1;
  this.weight = weight == null ? 1 : weight;
  this.content = content == null ? "" : content;
}
export default Relation;

/**
 * @todo write docs
 */
Relation.prototype.destroy = function() {
  Node.prototype.destroy.call(this);
  delete this.node0;
  delete this.node1;
  delete this.content;
};

/**
 * given a node returns the other node of a relation
 * @param  {Node} node
 * @return {Node}
 * tags:
 */
Relation.prototype.getOther = function(node) {
  return node == this.node0 ? this.node1 : this.node0;
};

/**
 * @todo write docs
 */
Relation.prototype.clone = function() {
  var relation = new Relation(this.id, this.name, this.node0, this.node1);

  relation.x = this.x;
  relation.y = this.y;
  relation.z = this.z;

  relation.nodeType = this.nodeType;

  relation.weight = this.weight;
  relation.descentWeight = this.descentWeight;

  return relation;
};
