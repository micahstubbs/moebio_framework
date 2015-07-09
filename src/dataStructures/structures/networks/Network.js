import DataModel from "src/dataStructures/DataModel";
import NodeList from "src/dataStructures/structures/lists/NodeList";
import RelationList from "src/dataStructures/structures/lists/RelationList";
import Node from "src/dataStructures/structures/elements/Node";
import Relation from "src/dataStructures/structures/elements/Relation";

Network.prototype = new DataModel();
Network.prototype.constructor = Network;

/**
 * @classdesc Networks are a DataType to store network data.
 *
 * Networks have nodes stored in a NodeList,
 * and relations (edges) stored in a RelationList.
 * @description Create a new Network instance.
 * @constructor
 * @category networks
 */
function Network() {
  this.type = "Network";

  this.nodeList = new NodeList();
  this.relationList = new RelationList();
}
export default Network;

/**
 * Get Nodes of the Network as a NodeList
 * @return {NodeList}
 * tags:
 */
Network.prototype.getNodes = function() {
  return this.nodeList;
};

/**
 * Get Relations (edges) of the Network as
 * a RelationList.
 * @return {RelationList}
 * tags:
 */
Network.prototype.getRelations = function() {
  return this.relationList;
};

/**
 * get nodes ids property
 * @return {StringList}
 * tags:
 */
Network.prototype.getNodesIds = function() {
  return this.nodeList.getIds();
};



/*
 * building methods
 */

/**
 * Add a node to the network
 * @param {Node} node A new node that will be added to the network.
 */
Network.prototype.addNode = function(node) {
  this.nodeList.addNode(node);
};

/**
 * Retrieve a node from the nodeList of the Network with the given name (label).
 * @param {String} name The name of the node to retrieve from the Network.
 * @return {Node} The node with the given name. Null if no node with that name
 * can be found in the Network.
 */
Network.prototype.getNodeWithName = function(name) {
  return this.nodeList.getNodeWithName(name);
};

/**
 * Retrieve node from Network with the given id.
 * @param {String} id ID of the node to retrieve
 * @return {Node} The node with the given id. Null if a node with this id is not
 * in the Network.
 */
Network.prototype.getNodeWithId = function(id) {
  return this.nodeList.getNodeWithId(id);
};

/**
 * Add a new Relation (edge) to the Network between two nodes.
 * @param {Node} node0 The source of the relation.
 * @param {Node} node1 The destination of the relation.
 * @param {String} id The id of the relation.
 * @param {Number} weight A numerical weight associated with the relation (edge).
 * 
 * @param {String} content Information associated with the relation.
 */
Network.prototype.createRelation = function(node0, node1, id, weight, content) {
  this.addRelation(new Relation(id, id, node0, node1, weight, content));
};

/**
 * Add an existing Relation (edge) to the Network.
 * @param {Relation} relation The relation to add to the network.
 */
Network.prototype.addRelation = function(relation) {
  this.relationList.addNode(relation);
  relation.node0.nodeList.addNode(relation.node1);
  relation.node0.relationList.addNode(relation);
  relation.node0.toNodeList.addNode(relation.node1);
  relation.node0.toRelationList.addNode(relation);
  relation.node1.nodeList.addNode(relation.node0);
  relation.node1.relationList.addNode(relation);
  relation.node1.fromNodeList.addNode(relation.node0);
  relation.node1.fromRelationList.addNode(relation);
};

/**
 * Create a new Relation between two nodes in the network
 * @param {Node} node0 The source of the relation.
 * @param {Node} node1 The destination of the relation.
 * @param {String} id The id of the relation. If missing, an id will be generated
 * based on the id's of node0 and node1.
 * @param {Number} weight=1 A numerical weight associated with the relation (edge).
 * @param {String} content Information associated with the relation.
 * @return {Relation} The new relation added to the Network.
 */
Network.prototype.connect = function(node0, node1, id, weight, content) {
  id = id || (node0.id + "_" + node1.id);
  weight = weight || 1;
  var relation = new Relation(id, id, node0, node1, weight);
  this.addRelation(relation);
  relation.content = content;
  return relation;
};



/*
 * removing methods
 */

/**
 * Remove a node from the Network
 * @param {Node} node The node to remove.
 */
Network.prototype.removeNode = function(node) {
  this.removeNodeRelations(node);
  this.nodeList.removeNode(node);
};

/**
 * Remove all Relations connected to the node from the Network.
 * @param {Node} node Node who's relations will be removed.
 */
Network.prototype.removeNodeRelations = function(node) {
  for(var i = 0; node.relationList[i] != null; i++) {
    this.removeRelation(node.relationList[i]);
    i--;
  }
};

/**
 * Remove all Nodes from the Network.
 */
Network.prototype.removeNodes = function() {
  this.nodeList.deleteNodes();
  this.relationList.deleteNodes();
};

Network.prototype.removeRelation = function(relation) {
  this.relationList.removeElement(relation);
  relation.node0.nodeList.removeNode(relation.node1);
  relation.node0.relationList.removeRelation(relation);
  relation.node0.toNodeList.removeNode(relation.node1);
  relation.node0.toRelationList.removeRelation(relation);
  relation.node1.nodeList.removeNode(relation.node0);
  relation.node1.relationList.removeRelation(relation);
  relation.node1.fromNodeList.removeNode(relation.node0);
  relation.node1.fromRelationList.removeRelation(relation);
};

/**
 * Transformative method, removes nodes without a minimal number of connections
 * @param  {Number} minDegree minimal degree
 * @return {Number} number of nodes removed
 * tags:transform
 */
Network.prototype.removeIsolatedNodes = function(minDegree) {
  var i;
  var nRemoved = 0;
  minDegree = minDegree == null ? 1 : minDegree;

  for(i = 0; this.nodeList[i] != null; i++) {
    if(this.nodeList[i].getDegree() < minDegree) {
      this.nodeList[i]._toRemove = true;
    }
  }

  for(i = 0; this.nodeList[i] != null; i++) {
    if(this.nodeList[i]._toRemove) {
      this.removeNode(this.nodeList[i]);
      nRemoved++;
      i--;
    }
  }

  return nRemoved;
};


/**
 * generates a light clone of the network, with the same nodeList and relationList as the original
 * @return {Network}
 */
Network.prototype.lightClone = function(){
  var newNetwork = new Network();
  newNetwork.nodeList = this.nodeList;
  newNetwork.relationList = this.relationList;
  return newNetwork;
}


/**
 * Clones the network
 * 
 * @param  {StringList} nodePropertiesNames list of preoperties names to be copied from old nodes into new nodes
 * @param  {StringList} relationPropertiesNames
 * 
 * @param  {String} idsSubfix optional sufix to be added to ids
 * @param  {String} namesSubfix optional sufix to be added to names
 * @return {Networked} network with exact structure than original
 * tags:
 */
Network.prototype.clone = function(nodePropertiesNames, relationPropertiesNames, idsSubfix, namesSubfix) {
  var newNetwork = new Network();
  var newNode, newRelation;
  var i;

  idsSubfix = idsSubfix == null ? '' : String(idsSubfix);
  namesSubfix = namesSubfix == null ? '' : String(namesSubfix);

  this.nodeList.forEach(function(node) {
    newNode = new Node(idsSubfix + node.id, namesSubfix + node.name);
    if(idsSubfix != '') newNode.basicId = node.id;
    if(namesSubfix != '') newNode.basicName = node.name;
    if(nodePropertiesNames) {
      nodePropertiesNames.forEach(function(propName) {
        if(node[propName] != null) newNode[propName] = node[propName];
      });
    }
    newNetwork.addNode(newNode);
  });

  this.relationList.forEach(function(relation) {
    newRelation = new Relation(idsSubfix + relation.id, namesSubfix + relation.name, newNetwork.nodeList.getNodeById(idsSubfix + relation.node0.id), newNetwork.nodeList.getNodeById(idsSubfix + relation.node1.id));
    if(idsSubfix != '') newRelation.basicId = relation.id;
    if(namesSubfix != '') newRelation.basicName = relation.name;
    if(relationPropertiesNames) {
      relationPropertiesNames.forEach(function(propName) {
        if(relation[propName] != null) newRelation[propName] = relation[propName];
      });
    }
    newNetwork.addRelation(newRelation);
  });

  return newNetwork;
};


Network.prototype.getReport = function() {
  return "network contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
};

Network.prototype.destroy = function() {
  delete this.type;
  this.nodeList.destroy();
  this.relationList.destroy();
  delete this.nodeList;
  delete this.relationList;
};
