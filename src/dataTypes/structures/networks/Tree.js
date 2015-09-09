import Network from "src/dataTypes/structures/networks/Network";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import Relation from "src/dataTypes/structures/elements/Relation";

Tree.prototype = new Network();
Tree.prototype.constructor = Tree;

/**
 * @classdesc Trees are Networks that have a hierarchical structure.
 *
 * @description Create a new Tree.
 * @constructor
 * @category networks
 */
function Tree() {
  Network.apply(this);
  this.type = "Tree";

  this.nLevels = 0;
  this._createRelation = this.createRelation;
  this.createRelation = this._newCreateRelation;
}
export default Tree;

/**
 * Adds a given Node to the tree, under the given parent Node.
 *
 * @param {Node} node
 * @param {Node} parent
 */
Tree.prototype.addNodeToTree = function(node, parent) {
  this.addNode(node);
  if(parent == null) {
    node.level = 0;
    node.parent = null;
  } else {
    var relation = new Relation(parent.id + "_" + node.id, parent.id + "_" + node.id, parent, node);
    this.addRelation(relation);
    node.level = parent.level + 1;
    node.parent = parent;
  }
  this.nLevels = Math.max(this.nLevels, node.level + 1);
};

/**
 * @ignore
 */
Network.prototype._newCreateRelation = function(parent, node, id, weight) {
  if(id == null) id = this.relationList.getNewId();
  this._createRelation(parent, node, id, weight);
  node.level = parent.level + 1;
  node.parent = parent;
  this.nLevels = Math.max(this.nLevels, node.level + 1);
};

/**
 * Adds a new parent node to the Tree.
 *
 * @param {Node} node New Parent Node.
 * @param {Node} child Node that will become the child.
 */
Tree.prototype.addFather = function(node, child) {
  //TODO: is children supposed to be child?
  if(child.parent != null || this.nodeList.indexOf(child) == -1) return false;
  this.addNode(node);
  child.parent = node;
  child.level = 1;
  this.nLevels = Math.max(this.nLevels, 1);
  this.createRelation(node, child);
};

/**
 * Provides a {@link NodeList} of all the Nodes of the Tree at a given level.
 *
 * @param {Number} level Level (depth) of the Tree to extract Nodes at.
 * @return {NodeList} All Nodes at the given level of the tree.
 */
Tree.prototype.getNodesByLevel = function(level) {
  var newNodeList = new NodeList();
  for(var i = 0; this.nodeList[i] != null; i++) {
    if(this.nodeList[i].level == level) newNodeList.addNode(this.nodeList[i]);
  }
  return newNodeList;
};

/**
 * Returns the leaves (nodes without children) of a tree.
 *
 * @param {Node} node Optional parent Node to start the leaf search from.
 * If no Node is provided, all leaf Nodes are returned.
 * @return {NodeList} Leaves of the Tree or sub-tree.
 * tags:
 */
Tree.prototype.getLeaves = function(node) {
  var leaves = new NodeList();
  if(node) {
    if(node.toNodeList.length === 0) {
      leaves.addNode(node);
      return leaves;
    }
    var addLeaves = function(candidate) {
      if(candidate.toNodeList.length === 0) {
        leaves.addNode(candidate);
      } else {
        candidate.toNodeList.forEach(addLeaves);
      }
    };
    node.toNodeList.forEach(addLeaves);
  } else {
    this.nodeList.forEach(function(candidate) {
      if(candidate.toNodeList.length === 0) leaves.addNode(candidate);
    });
  }
  return leaves;
};

/**
 * assignDescentWeightsToNodes
 *
 * @return {undefined}
 */
Tree.prototype.assignDescentWeightsToNodes = function() {
  this._assignDescentWeightsToNode(this.nodeList[0]);
};

/**
 * @ignore
 */
Tree.prototype._assignDescentWeightsToNode = function(node) {
  var i;
  if(node.toNodeList.length === 0) {
    node.descentWeight = 1;
    return 1;
  }
  for(i = 0; node.toNodeList[i] != null; i++) {
    node.descentWeight += this._assignDescentWeightsToNode(node.toNodeList[i]);
  }
  return node.descentWeight;
};

/**
 * Returns a string indicating the size of the Tree.
 *
 * @return {String} Log message indicating Tree's size.
 */
Tree.prototype.getReport = function() {// @todo to be placed in TreeOperators
  //TODO: remove relation input?
  return "Tree contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
};
