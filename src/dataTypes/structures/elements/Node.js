import DataModel from "src/dataTypes/DataModel";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import RelationList from "src/dataTypes/structures/lists/RelationList";
import Loader from "src/tools/loaders/Loader";

Node.prototype = new DataModel();
Node.prototype.constructor = Node;

/**
 * @classdesc Represents a single node element in a Network. Can have both an id as well
 * as a name.
 *
 * @description Create a new Node.
 * @param {String} id ID of the Node
 * @param {String} name string (label) name to be assigned to node
 * @constructor
 * @category networks
 */
function Node(id, name) {
  this.id = id == null ? '' : id;
  this.name = name != null ? name : '';
  this.type = "Node";

  this.nodeType = null;

  this.x = 0;
  this.y = 0;
  this.z = 0;

  this.nodeList = new NodeList();
  this.relationList = new RelationList();

  this.toNodeList = new NodeList();
  this.toRelationList = new RelationList();

  this.fromNodeList = new NodeList();
  this.fromRelationList = new RelationList();

  this.weight = 1;
  this.descentWeight = 1;

  //tree
  this.level = 0;
  this.parent = null;

  //physics:
  this.vx = 0;
  this.vy = 0;
  this.vz = 0;
  this.ax = 0;
  this.ay = 0;
  this.az = 0;
}
export default Node;

/**
 * Removes all Relations and connected Nodes from
 * the current Node.
 */
Node.prototype.cleanRelations = function() {
  this.nodeList = new NodeList();
  this.relationList = new RelationList();

  this.toNodeList = new NodeList();
  this.toRelationList = new RelationList();

  this.fromNodeList = new NodeList();
  this.fromRelationList = new RelationList();
};

//TODO: complete with all properties
Node.prototype.destroy = function() {
  DataModel.prototype.destroy.call(this);
  delete this.id;
  delete this.name;
  delete this.nodeType;
  delete this.x;
  delete this.y;
  delete this.z;
  delete this.nodeList;
  delete this.relationList;
  delete this.toNodeList;
  delete this.toNodeList;
  delete this.fromNodeList;
  delete this.fromRelationList;
  delete this.parent;
  delete this.weight;
  delete this.descentWeight;
  delete this.level;
  delete this.vx;
  delete this.vy;
  delete this.vz;
  delete this.ax;
  delete this.ay;
  delete this.az;
};

/**
 * Returns the number of Relations connected to this Node.
 *
 * @return {Number} Number of Relations (edges) connecting to this Node instance.
 */
Node.prototype.getDegree = function() {
  return this.relationList.length;
};

//treeProperties:


/**
 * Returns the parent Node of this Node if it is part of a {@link Tree}.
 *
 * @return {Node} Parent Node of this Node.
 */
Node.prototype.getParent = function() {
  return this.parent;
};

/**
 * Returns the leaves under a node in a Tree,
 *
 * <strong>Warning:</strong> If this Node is part of a Network that is not a tree, this method could run an infinite loop.
 * @return {NodeList} Leaf Nodes of this Node.
 * tags:
 */
Node.prototype.getLeaves = function() {
    var leaves = new NodeList();
    var addLeaves = function(node) {
      if(node.toNodeList.length === 0) {
        leaves.addNode(node);
        return;
      }
      node.toNodeList.forEach(addLeaves);
    };
    addLeaves(this);
    return leaves;
  };


/**
 * Uses an image as a visual representation to this Node.
 *
 * @param {String} urlImage The URL of the image to load.
 */
Node.prototype.loadImage = function(urlImage) {
  Loader.loadImage(urlImage, function(e) {
    this.image = e.result;
  }, this);
};


/**
 * Makes a copy of this Node.
 *
 * @return {Node} New Node that is a copy of this Node.
 */
Node.prototype.clone = function() {
  var newNode = new Node(this.id, this.name);

  newNode.x = this.x;
  newNode.y = this.y;
  newNode.z = this.z;

  newNode.nodeType = this.nodeType;

  newNode.weight = this.weight;
  newNode.descentWeight = this.descentWeight;

  return newNode;
};
