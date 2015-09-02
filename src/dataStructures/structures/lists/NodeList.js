import List from "src/dataStructures/lists/List";
import StringList from "src/dataStructures/strings/StringList";
import NumberList from "src/dataStructures/numeric/NumberList";
import Polygon from "src/dataStructures/geometry/Polygon";
import Node from "src/dataStructures/structures/elements/Node";
import Point from "src/dataStructures/geometry/Point";
import { typeOf } from "src/tools/utils/code/ClassUtils";

NodeList.prototype = new List();
NodeList.prototype.constructor = NodeList;

/**
 * @classdesc A sub-class of {@link List} for storing {@link Node|Nodes}.
 *
 * @description create a new NodeList.
 * @constructor
 * @category networks
 */
function NodeList() {
  //var array=List.apply(this, arguments);

  //if(arguments && arguments.length>0) {c.l('UEUEUEUE, arguments.length', arguments.length); var a; a.push(0)};

  var array = NodeList.fromArray([]);

  if(arguments && arguments.length > 0) {
    var args = Array.prototype.slice.call(arguments);

    args.forEach(function(arg) {
      array.addNode(arg);
    });
  }

  return array;
}
export default NodeList;

/**
 * Creates NodeList from raw Array.
 *
 * @param {Node[] | String[]} array Array to convert to
 * @param {Boolean} forceToNode If true, and input array is an array of Strings,
 * convert strings to Node instances with the strings used as the Node's id and name.
 * @return {NodeList}
 */
NodeList.fromArray = function(array, forceToNode) {
  forceToNode = forceToNode == null ? false : forceToNode;

  var result = List.fromArray(array);

  if(forceToNode) {
    for(var i = 0; i < result.length; i++) {
      result[i] = typeOf(result[i]) == "Node" ? result[i] : (new Node(String(result[i]), String(result[i])));
    }
  }

  result.type = "NodeList";
  result.ids = {};
  // TODO: Fix
  Array(); //????

  //assign methods to array:
  result.deleteNodes = NodeList.prototype.deleteNodes;
  result.addNode = NodeList.prototype.addNode;
  result.addNodes = NodeList.prototype.addNodes;
  result.removeNode = NodeList.prototype.removeNode;
  result.removeNodeAtIndex = NodeList.prototype.removeNodeAtIndex;
  result.getNodeByName = NodeList.prototype.getNodeByName;
  result.getNodeById = NodeList.prototype.getNodeById;
  result.getNodesByIds = NodeList.prototype.getNodesByIds;
  result.getNewId = NodeList.prototype.getNewId;
  result.normalizeWeights = NodeList.prototype.normalizeWeights;
  result.getWeights = NodeList.prototype.getWeights;
  result.getIds = NodeList.prototype.getIds;
  result.getDegrees = NodeList.prototype.getDegrees;
  result.getPolygon = NodeList.prototype.getPolygon;

  result._push = Array.prototype.push;
  result.push = function(a) {
    console.log('with nodeList, use addNode instead of push');
    var k;
    k.push(a);
  };

  //overriden
  result.getWithoutRepetitions = NodeList.prototype.getWithoutRepetitions;
  result.removeElements = NodeList.prototype.removeElements;
  result.clone = NodeList.prototype.clone;

  return result;
};

/**
 * Clears NodeList.
 *
 */
NodeList.prototype.removeNodes = function() {
  for(var i = 0; i < this.length; i++) {
    this.ids[this[i].id] = null;
    this.removeElement(this[i]);
  }
};

/**
 * Adds given Node to NodeList.
 *
 * @param {Node} node Node to add
 */
NodeList.prototype.addNode = function(node) {
  this.ids[node.id] = node;
  this._push(node);
};

/**
 * Adds all Nodes from another NodeList to this NodeList.
 *
 * @param {NodeList} nodes Nodes to add.
 */
NodeList.prototype.addNodes = function(nodes) {
  var i;
  for(i = 0; nodes[i] != null; i++) {
    this.addNode(nodes[i]);
  }
};

/**
 * Removes a given node from the list.
 *
 * @param {Node} node Node to remove.
 */
NodeList.prototype.removeNode = function(node) {
  this.ids[node.id] = null;
  this.removeElement(node);
};

/**
 * Removes a Node at a particular index of the NodeList
 *
 * @param {Number} index The index of the Node to remove.
 */
NodeList.prototype.removeNodeAtIndex = function(index) {
  this.ids[this[index].id] = null;
  this.splice(index, 1);
};

/**
 * Normalizes all weights associated with Nodes in NodeList
 * to a value between 0 and 1. Works under the assumption that weights are >= 0.
 */
NodeList.prototype.normalizeWeights = function() {
  var i;
  var max = -9999999;
  for(i = 0; this[i] != null; i++) {
    max = Math.max(this[i].weight, max);
  }
  for(i = 0; this[i] != null; i++) {
    this[i].weight /= max;
  }
};


/**
 * Returns Node with given name if present in the NodeList.
 * Very inefficient method. Use {@link .getNodeById} when possible
 *
 * @return {Node} Node with name matching input name. Null if no such Node.
 */
NodeList.prototype.getNodeByName = function(name) {
  var i;
  for(i = 0; i < this.length; i++) {
    if(this[i].name == name) {
      return this[i];
    }
  }
  return null;
};

/**
 * Returns Node in NodeList with given Id.
 *
 * @param  {String} id Id of Node to return.
 * @return {Node}
 * tags:search
 */
NodeList.prototype.getNodeById = function(id) {
  return this.ids[id];
};

/**
 * Returns a new NodeList with all nodes in this
 * NodeList with Id's found in the given {@link NumberList}
 * of ids.
 *
 * @param {NumberList} ids Ids of Nodes to extract.
 * @return {NodeList}
 */
NodeList.prototype.getNodesByIds = function(ids) {
  var newNodelist = new NodeList();
  var node;
  for(var i = 0; ids[i] != null; i++) {
    node = this.ids[ids[i]];
    if(node != null) newNodelist[i] = node;
  }
  return newNodelist;
};

/**
 * Returns a {@link NumberList} of the weights associated
 * with each Node in the NodeList.
 *
 * @return {NumberList}
 * tags:
 */
NodeList.prototype.getWeights = function() {
  var numberList = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    numberList[i] = this[i].weight;
  }
  return numberList;
};

/**
 * Returns a {@link StringList} of all the Ids
 * of the Nodes in the NodeList.
 *
 * @return {StringList}
 * tags:
 */
NodeList.prototype.getIds = function() {
  var list = new StringList();
  for(var i = 0; this[i] != null; i++) {
    list[i] = this[i].id;
  }
  return list;
};

/**
 * Returns a {@link NumberList} with a count of directly
 * connected Relations a Node has for each Node.
 *
 *
 * @return {NumberList} List containing the number
 * of Relations each Node has.
 */
NodeList.prototype.getDegrees = function() {
  var numberList = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    numberList[i] = this[i].nodeList.length;
  }
  return numberList;
};


/**
 * Returns a {@link Polygon} constructed from all Nodes in
 * the NodeList by using the
 * <strong>x</strong> and <strong>y</strong> attributes of
 * the Nodes.
 *
 * @return {Polygon}
 */
NodeList.prototype.getPolygon = function(graphics) {
  var polygon = new Polygon();
  for(var i = 0; this[i] != null; i++) {
    polygon[i] = new Point(this[i].x + graphics.cX, this[i].y + graphics.cY);
  }
  return polygon;
};

NodeList.prototype.getNewId = function() {
  var n = this.length + 1;
  for(var i = 0; i < n; i++) {
    if(this.getNodeById(String(i)) == null) return String(i);
  }
};

/**
 * Returns a copy of this NodeList.
 *
 * @return {NodeList}
 */
NodeList.prototype.clone = function() {
  var newNodeList = new NodeList();
  this.forEach(function(node) {
    newNodeList.addNode(node);
  });
  newNodeList.name = this.name;
  return newNodeList;
};


//methods overriden

/**
 * getWithoutRepetitions
 *
 * @return {undefined}
 * @ignore
 */
NodeList.prototype.getWithoutRepetitions = function() {
  var newList = new NodeList();
  var i;
  newList.name = this.name;
  for(i = 0; this[i]!=null; i++) {
    if(newList.getNodeById(this[i].id) == null) newList.addNode(this[i]);
  }
  return newList;
};

/**
 * removeElements
 *
 * @return {undefined}
 * @ignore
 */
NodeList.prototype.removeElements = function(nodeList) {
  var i;
  for(i = 0; this[i]!=null; i++) {
    //if(elements.indexOf(this[i]) > -1) {
    // c.l('                          this[i].id:', this[i].id);
    // c.l('                          nodeList.getNodeById(this[i].id):', nodeList.getNodeById(this[i].id));
    if( nodeList.getNodeById(this[i].id) != null ){
      this.ids[this[i].id] = null;
      this.splice(i, 1);
      //this.removeNode(this[i]);
      i--;
      // c.l('                            X, i, this.length', i, this.length);
    }
  }
};
