import Network from "src/dataTypes/structures/networks/Network";
import Node from "src/dataTypes/structures/elements/Node";
import Relation from "src/dataTypes/structures/elements/Relation";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import { typeOf } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Includes functions to convert Networks into other DataTypes.
 *
 * @namespace
 * @category networks
 */
function NetworkConversions() {}
export default NetworkConversions;

/**
 * Builds a Network based on a two columns Table, creating relations on co-occurrences.
 * @param {Table} table table with at least two columns (commonly strings)
 *
 * @param {NumberList} numberList Weights of relations.
 * @param {Number} threshold Minimum weight or number of co-occurrences to create a relation.
 * @param {Boolean} allowMultipleRelations (false by default)
 * @param {Number} minRelationsInNode Remove nodes with number of relations below threshold.
 * @param {StringList} stringList Contents of relations.
 * @return {Network}
 * tags:conversion
 */
NetworkConversions.TableToNetwork = function(table, numberList, threshold, allowMultipleRelations, minRelationsInNode, stringList) {
  if(table == null || !table.isTable || table[0] == null || table[1] == null) return;

  //trace("••••••• createNetworkFromPairsTable", table);
  if(allowMultipleRelations == null) allowMultipleRelations = false;
  if(table.length < 2) return null;
  var network = new Network();
  var nElements;

  if(numberList == null) {
    nElements = Math.min(table[0].length, table[1].length);
  } else {
    nElements = Math.min(table[0].length, table[1].length, numberList.length);
  }

  //trace("nElements", nElements);

  if(numberList == null && table.length > 2 && typeOf(table[2]) == "NumberList" && table[2].length >= nElements) numberList = table[2];


  if(typeOf(table[0]) == NodeList && typeOf(table[1]) == NodeList) {
    //....    different methodology here
  }

  var node0;
  var node1;
  var name0;
  var name1;
  var relation;
  var i;
  for(i = 0; i < nElements; i++) {
    name0 = "" + table[0][i];
    name1 = "" + table[1][i];
    //trace("______________ i, name0, name1:", i, name0, name1);
    node0 = network.nodeList.getNodeById(name0);
    if(node0 == null) {
      node0 = new Node(name0, name0);
      network.addNode(node0);
    } else {
      node0.weight++;
    }
    node1 = network.nodeList.getNodeById(name1);
    if(node1 == null) {
      node1 = new Node(name1, name1);
      network.addNode(node1);
    } else {
      node1.weight++;
    }
    if(numberList == null) {
      relation = network.relationList.getFirstRelationByIds(node0.id, node1.id, false);
      if(relation == null ||  allowMultipleRelations) {
        relation = new Relation(name0 + "_" + name1 + network.relationList.length, name0 + "_" + name1, node0, node1, 1);
        network.addRelation(relation);
      } else {
        relation.weight++;
      }
    } else if(numberList[i] > threshold) {
      relation = new Relation(name0 + "_" + name1, name0 + "_" + name1, node0, node1, numberList[i]);
      network.addRelation(relation);
    }

    if(stringList) relation.content = stringList[i];
  }

  if(minRelationsInNode) {
    for(i = 0; network.nodeList[i] != null; i++) {
      if(network.nodeList[i].relationList.length < minRelationsInNode) {
        network.removeNode(network.nodeList[i]);
        i--;
      }
    }
  }

  return network;
};
