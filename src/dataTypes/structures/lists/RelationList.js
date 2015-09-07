import NodeList from 'src/dataTypes/structures/lists/NodeList';

RelationList.prototype = new NodeList();
RelationList.prototype.constructor = RelationList;
/**
 * RelationList
 * @constructor
 */

/**
 * @classdesc A sub-class of {@link List} for storing {@link Relations|Relation}.
 *
 * @description create a new RelationList.
 * @constructor
 * @category networks
 */
function RelationList() {
  var array = NodeList.apply(this, arguments);
  array.name = "";
  //assign methods to array:
  array = RelationList.fromArray(array);
  //
  return array;
}
export default RelationList;

/**
 * Convert raw array of Relations into a RelationList.
 *
 * @param {Relation[]} array Array to convert to a RelationList.
 * @return {RelationList}
 */
RelationList.fromArray = function(array) {
  var result = NodeList.fromArray(array);
  result.type = "RelationList";
  //assign methods to array:
  result.addRelation = RelationList.prototype.addRelation;
  result.addRelationIfNew = RelationList.prototype.addRelationIfNew;
  result.removeRelation = RelationList.prototype.removeRelation;
  result.getRelationsWithNode = RelationList.prototype.getRelationsWithNode;
  result.getFirstRelationBetweenNodes = RelationList.prototype.getFirstRelationBetweenNodes;
  result.getFirstRelationByIds = RelationList.prototype.getFirstRelationByIds;
  result.getAllRelationsBetweenNodes = RelationList.prototype.getAllRelationsBetweenNodes;
  result.getRelatedNodesToNode = RelationList.prototype.getRelatedNodesToNode;
  result.nodesAreConnected = RelationList.prototype.nodesAreConnected;

  return result;
};

/**
 * Add new Relation to the list.
 *
 * @param {Relation} relation Relation to add.
 */
//TODO:remove?
RelationList.prototype.addRelation = function(relation) {
  this.addNode(relation);
};

/**
 * Removes Relation from the list.
 *
 * @param {Relation} relation Relation to remove.
 */
RelationList.prototype.removeRelation = function(relation) {
    this.removeNode(relation);
};

/**
 * Returns all relations that are directly connected to the given Node.
 *
 * @param {Node} node Node to search
 * @return {Relation[]} Containing Relations that contain node.
 */
RelationList.prototype.getRelationsWithNode = function(node) {
  var i;
  var filteredRelations = [];
  for(i = 0; this[i] != null; i++) {
    var relation = this[i];
    if(relation.node0 == node || relation.node1 == node) {
      filteredRelations.push(relation);
    }
  }

  // TODO: convert to RelationList?
  return filteredRelations;
};

/**
 * Returns all Nodes related to a given Node.
 *
 * @param {Node} node
 * @return a RelationList with relations that contain node
 */
RelationList.prototype.getRelatedNodesToNode = function(node) {
  var i;
  var relatedNodes = new NodeList();
  for(i = 0; i < this.length; i++) {
    var relation = this[i];
    if(relation.node0.id == node.id) {
      relatedNodes.push(relation.node1);
    }
    if(relation.node1.id == node.id) {
      relatedNodes.push(relation.node0);
    }
  }
  return relatedNodes;
};



/**
 * Returns all Relations between two Nodes.
 *
 * @param {Node} node0 Source Node.
 * @param {Node} node1 Destination Node.
 * @param {Boolean} directed Consider Relation directional in nature (default: false).
 * @return {Relation[]} With Relations that contain node0 and node1.
 * tags:
 */
RelationList.prototype.getAllRelationsBetweenNodes = function(node0, node1, directed) {
  //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
  var i;
  directed = directed == null ? false : directed;
  var filteredRelations = [];
  for(i = 0; this[i] != null; i++) {
    var relation = this[i];
    if((relation.node0 == node0 && relation.node1 == node1) || (!directed && relation.node0 == node1 && relation.node1 == node0)) {
      filteredRelations.push(relation);
    }
  }
  // TODO: convert to RelationList ?
  return filteredRelations;
};


/**
 * Checks if two nodes are related, returns a boolean
 *
 * @param  {Node} node0
 * @param  {Node} node1
 * @param  {Boolean} directed true if relation must be directed
 * @return {Boolean}
 * tags:
 */
RelationList.prototype.nodesAreConnected = function(node0, node1, directed) {
  if(node0.toNodeList.getNodeById(node1.id) != null) return true;
  return !directed && node1.toNodeList.getNodeById(node0.id) != null;
};


/**
 * Returns the first Relation between two Nodes.
 *
 * @param {Node} node0 Source Node.
 * @param {Node} node1 Destination Node.
 * @param {Boolean} directed consider relation direction (default: false).
 * @return {Relation[]} With Relations that contain node0 and node1.
 * tags:
 */
RelationList.prototype.getFirstRelationBetweenNodes = function(node0, node1, directed) { //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected) //TODO: make it work with ids
  directed = directed == null ? false : directed;

  for(var i = 0; this[i] != null; i++) {
    if((this[i].node0.id == node0.id && this[i].node1.id == node1.id) || (!directed && this[i].node1.id == node0.id && this[i].node0.id == node1.id)) return this[i];
  }
  return null;
};


/**
 * Returns first relations between two Nodes.
 *
 * @param {String} id0 Id of the source Node.
 * @param {String} id1 Id of the destination Node.
 * @param {Boolean} directed Consider relation directional (default: false).
 * @return {Relation[]} With Relations that contain node0 and node1 (with node0.id = id0 and node1.id = id1).
 */
RelationList.prototype.getFirstRelationByIds = function(id0, id1, directed) {
  //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
  //TODO: make it work with ids
  var i;
  var _directed = directed || false;
  var relation;
  for(i = 0; this[i] != null; i++) {
    relation = this[i];
    if(relation.node0.id == id0 && relation.node1.id == id1) {
      return relation;
    }
  }
  if(_directed) return null;
  //c.log("<->");
  for(i = 0; this[i] != null; i++) {
    relation = this[i];
    if(relation.node0.id == id1 && relation.node1.id == id0) {
      //c.log("<--- ", relation.node0.name, relation.node1.name);
      // TODO: convert to RelationList ?
      return relation;
    }
  }
  return null;
};

