Relation.prototype = new Node();
Relation.prototype.constructor = Relation;

/**
 * Relation 
 * @constructor
 */
function Relation(id, name, node0, node1, weight, content) {
  Node.apply(this, [id, name]);
  this.type = "Relation";

  this.node0 = node0;
  this.node1 = node1;
  this.weight = weight == null ? 1 : weight;
  this.content = content == null ? "" : content;
}


Relation.prototype.destroy = function() {
  Node.prototype.destroy.call(this);
  delete this.node0;
  delete this.node1;
  delete this.content;
}

Relation.prototype.getOther = function(node) {
  return node == this.node0 ? this.node1 : this.node0;
}

Relation.prototype.clone = function() {
  var relation = new Relation(this.id, this.name, this.node0, this.node1);

  relation.x = this.x;
  relation.y = this.y;
  relation.z = this.z;

  relation.nodeType = this.nodeType;

  relation.weight = this.weight;
  relation.descentWeight = this.descentWeight;

  return relation;
}