import ListOperators from "src/operators/lists/ListOperators";
import NodeList from "src/dataStructures/structures/lists/NodeList";
import RelationList from "src/dataStructures/structures/lists/RelationList";
import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import Node from "src/dataStructures/structures/elements/Node";
import NumberList from "src/dataStructures/numeric/NumberList";
import Tree from "src/dataStructures/structures/networks/Tree";
import Relation from "src/dataStructures/structures/elements/Relation";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import Network from "src/dataStructures/structures/networks/Network";

/**
 * @classdesc Provides a set of tools that work with Networks.
 *
 * @namespace
 * @category networks
 */
function NetworkOperators() {}
export default NetworkOperators;

/**
 * Filters Network in-place to remove Nodes with less then minDegree connections.
 *
 * @param {Network} network Network to filter
 * @param {Number} minDegree The minimum number of Relations a
 * Node must have to remain in the Network.
 * @return {null}
 */
NetworkOperators.filterNodesByMinDegree = function(network, minDegree) {
  var i;
  for(i = 0; network.nodeList[i] != null; i++) {
    if(network.nodeList[i].nodeList.length < minDegree) {
      network.removeNode(network.nodeList[i]);
      i--;
    }
  }
  return null;
};


/**
 *
 * @param {Network} network Network to work on.
 * @param {Node} node0 Source Node.
 * @param {Node} node1 Destination Node
 * @return {Number}
 */
NetworkOperators.degreeBetweenNodes = function(network, node0, node1) {
  if(network == null || node0 == null || node1 == null) return null;

  if(node0 == node1) return 0;
  var nodes = node0.nodeList;
  var d = 1;
  var newNodes;
  var i;
  var nNodes;

  //while(nodes.indexOf(node1)==-1){//TODO: check if getNodeById is faster
  while(nodes.getNodeById(node1.id) == null) {
    newNodes = nodes.clone();
    nNodes = nodes.length;
    for(i = 0; i<nNodes; i++) {
      newNodes = ListOperators.concat(newNodes, nodes[i].nodeList); //TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
    }
    newNodes = newNodes.getWithoutRepetitions();
    if(nodes.length == newNodes.length) return -1;
    nodes = newNodes;
    d++;
  }

  return d;
};

/**
 * return a nodeList with all the nodes connected to two given nodes in a network
 * @param  {Network} network
 * @param  {Node} node0
 * @param  {Node} node1
 * @return {NodeList}
 * tags:
 */
NetworkOperators.getNodesBetweenTwoNodes = function(network, node0, node1){
  var nodeList = new NodeList();
  var nNodes = network.nodeList.length;
  var i;
  var node;
  //network.nodeList.forEach(function(node){
  for(i=0; i<nNodes; i++){
    node = network.nodeList[i];
    if(node.id!=node0.id && node.id!=node1.id && node0.nodeList.getNodeById(node.id)!=null && node1.nodeList.getNodeById(node.id)!=null) nodeList.addNode(node);
  }
  return nodeList;
};

/**
 * Returns a NodeList with the Nodes in the Network that are part of the
 * first shortest path found between the two input nodes.
 *
 * @param {Network} network Network to work on.
 * @param {Node} node0 Source Node.
 * @param {Node} node1 Destination Node.
 * @param {Boolean} includeExtremes If true, include node0 and node1 in the returned list.
 * @return {NodeList} Nodes in the shortest path between node0 and node1.
 */
NetworkOperators.shortestPath = function(network, node0, node1, includeExtremes) {
  if(network == null || node0 == null || node1 == null) return null;

  var tree = NetworkOperators.spanningTree(network, node0, node1);
  var path = new NodeList();
  if(includeExtremes) path.addNode(node1);
  var node = tree.nodeList.getNodeById(node1.id);

  if(node == null) return null;

  // console.log('---'); return;
  //


  while(node.parent.id != node0.id) {
    path.addNode(node.parent.node);
    node = node.parent;
    if(node == null) return null;
    //console.log('    >', node0.id, node1.id, node.id,  node.parent==null?'no parent!':node.parent.id);
  }

  // console.log('shortestPath, path', path);
  if(includeExtremes) path.addNode(node0);
  return path.getReversed();
};


/**
 * Finds all shortest paths between two nodes.
 *
 * @param  {Network} network Network to work on.
 * @param  {Node} node0 Source Node.
 * @param  {Node} node1 Destination Node.
 *
 * @param  {NodeList} shortPath In case a shortPath has been calculated previously
 * @param {Tree} spanningTree previously calculated spanning tree centered on node0
 * @return {Table} List of paths (NodeLists)
 */
NetworkOperators.shortestPaths = function(network, node0, node1, shortPath, spanningTree) {
  if(network == null || node0 == null || node1 == null) return null;

  var i;
  var allPaths = new Table();


  if(node0.nodeList.getNodeById(node1.id)!=null){
    allPaths.push(new NodeList(node0, node1));
    return allPaths;
  }

  //c.clear();

  if(spanningTree==null) spanningTree = NetworkOperators.spanningTree(network, node0, node1);

  //console.log('[•--•] node0.id, node1.id', node0.id, node1.id);
  // console.log('[•--•] shortestPaths | spanningTree.nodeList.length, spanningTree.nLevels', spanningTree.nodeList.length, spanningTree.nLevels);

  // for(var i=0; i<spanningTree.nLevels; i++){
  //   // console.log('  [•--•] level:'+i, spanningTree.getNodesByLevel(i).getIds().join(','));
  // }

  //first we seek for the nodes in paths

  var n = spanningTree.nLevels;
  //console.log('[•--•] spanningTree.nLevels:', n);

  // console.log('[•--•] spanningTree.getNodesByLevel(spanningTree.nLevels-1).getNodeById(node1.id)', spanningTree.getNodesByLevel(spanningTree.nLevels-1).getNodeById(node1.id) );

  var level1 = new NodeList(node1);
  var extended_from_1 = NetworkOperators.adjacentNodeList(network, level1, false);
  var level0 = ListOperators.intersection(extended_from_1, spanningTree.getNodesByLevel(n-2));//spanningTree.getNodesByLevel(n-2);

  // console.log('[•--•] node1.nodeList', node1.nodeList.getIds().join(','));
  // console.log('[•--•] level1', level1.getIds().join(','));
  // console.log('[•--•] level on tree:', spanningTree.getNodesByLevel(n-2).getIds().join(','));
  // console.log('[•--•] extended_from_1', extended_from_1.getIds().join(','));
  // console.log('[•--•] ----> level0', level0.getIds().join(','));

  var relationsTable = new Table();
  var relationsBetween;

  relationsTable.push(NetworkOperators.getRelationsBetweenNodeLists(network, level0, level1, false));

  // console.log('  [•--•] relationsTable[last]', relationsTable[relationsTable.length-1].getIds().join(','));

  while(n>2){
    n--;
    level1 = level0;

    //interection of level1 xpanded and level n-2 in tree

    level0 = ListOperators.intersection(NetworkOperators.adjacentNodeList(network, level1, false), spanningTree.getNodesByLevel(n-2));
    // console.log('\n  [•--•] n:', n);
    // console.log('  [•--•] level1', level1.getIds().join(','));
    // console.log('  [•--•] level0', level0.getIds().join(','));

    relationsBetween = NetworkOperators.getRelationsBetweenNodeLists(network, level0, level1, false);
    //console.log('  [•--•] relationsBetween.length', relationsBetween.length);

    relationsTable.push(relationsBetween);
    // console.log('  [•--•] relationsTable[last]', relationsTable[relationsTable.length-1].getIds().join(','));
  }

  relationsTable = relationsTable.getReversed();

  //console.log('\n  [•--•] relationsTable', relationsTable );

  // console.log('[•--•] relationsTable.getLengths()', relationsTable.getLengths() );

  //console.log('[•--•] STOP for now'); return;

  //console.log('\n\n[•--•] /////////--- build paths ----///////');

  for(var i=0; relationsTable[0][i]!=null; i++){
    allPaths.push( new NodeList(node0, relationsTable[0][i].getOther(node0)) );
  }

  var newPaths;

  var _findNewPaths = function(path, relations){
    var newPaths = new Table();
    var finalNode = path[path.length-1];
    var newPath;

    // console.log('   finalNode.id:',finalNode.id);

    relations.forEach(function(relation){
      // console.log('         test relation:', relation.id);
      if(finalNode.relationList.getNodeById(relation.id)){
        newPath = path.clone();
        newPath.addNode(relation.getOther(finalNode));
        // console.log('                newPath:',newPath.getIds().join(','));
        newPaths.push(newPath);
      }
    });

    return newPaths;
  };

  var toAdd;
  var nPaths;
  var path;

  // console.log('[•--•] allPaths', allPaths);
  // console.log('[•--•] allPaths[0]', allPaths[0]);

  while(allPaths[0].length<spanningTree.nLevels){
    //console.log('\nallPaths[0].length', allPaths[0].length);

    newPaths = new Table();
    nPaths = allPaths.length;
    //allPaths.forEach(function(path){
    for(i=0; i<nPaths; i++){
      path = allPaths[i];
      // console.log('        path:',path.getIds().join(','));
      toAdd = _findNewPaths(path, relationsTable[path.length-1]);
      // console.log('          added '+toAdd.length+' paths');
      newPaths = newPaths.concat(toAdd);
    }
    allPaths = newPaths;
    // console.log('  [•--•] allPaths[0].length', allPaths[0].length);
  }


  //console.log('allPaths.length:',allPaths.length);
  // console.log('allPaths!!!!:',allPaths);

  // allPaths.forEach(function(path, i){
  //   console.log('[•--•] path '+i+': '+path.getIds().join(','));
  // });

  return allPaths;




  // if(shortPath == null) shortPath = NetworkOperators.shortestPath(network, node0, node1, true);

  // var lengthShortestPaths = shortPath.length;


  // var firstPath = new NodeList();
  // var i;

  // firstPath.addNode(node0);
  // allPaths.push(firstPath);


  // var all = NetworkOperators._extendPaths(allPaths, node1, lengthShortestPaths);

  // for(i = 0; all[i] != null; i++) {
  //   if(all[i][all[i].length - 1] != node1) {
  //     all.splice(i, 1);
  //     i--;
  //   }
  // }

  // return all;
};

/**
 * finds all relations between two nodeLists
 * @param  {Network} network
 * @param  {NodeList} nodeList0
 * @param  {NodeList} nodeList1
 * @param  {Boolean} directed if true (default value), it finds relations pointing to first nodeList to second
 * @return {RelationList}
 * tags:
 */
NetworkOperators.getRelationsBetweenNodeLists = function(network, nodeList0, nodeList1, directed){
  if(nodeList0==null || nodeList1==null) return null;

  if(directed==null) directed=true;

  var relations = new RelationList();
  var nRelations = network.relationList.length;
  var relation;
  var i;

  //network.relationList.forEach(function(relation){
  for(i=0; i<nRelations; i++){
    relation = network.relationList[i];
    if(
      (nodeList0.getNodeById(relation.node0.id)!=null && nodeList1.getNodeById(relation.node1.id)!=null) ||
      (!directed && nodeList0.getNodeById(relation.node1.id)!=null && nodeList1.getNodeById(relation.node0.id)!=null)
    ){
      relations.addRelation(relation);
    }
  }

  return relations;
};


/**
 * @ignore
 */
NetworkOperators._extendPaths = function(allPaths, nodeDestiny, maxLength) {

  if(allPaths[0].length >= maxLength) return allPaths;

  var i, j;
  var next;
  var node;

  var newPaths = new Table();
  var path, newPath;
  var nPaths = allPaths.length;
  var nNext;

  for(i = 0; i<nPaths; i++) {
    path = allPaths[i];
    node = path[path.length - 1];
    next = node.nodeList.getWithoutRepetitions();
    nNext = next.length;

    for(j = 0; j<nNext; j++) {
      if(path.getNodeById(next[j].id) == null) {
        newPath = path.clone();
        newPath.addNode(next[j]);
        newPaths.push(newPath);
      }
    }

  }

  allPaths = newPaths;

  return NetworkOperators._extendPaths(allPaths, nodeDestiny, maxLength);

};

/**
 * Finds all loops in the network
 *
 * @param  {Network} network
 * @param {Number} minSize minimum size of loops
 * @return {Table} list of nodeLists
 * tags:analytics
 */
NetworkOperators.loops = function(network, minSize) {
  if(network == null) return null;

  var i, j, k, loops;

  var allLoops = new Table();

  for(i = 0; network.nodeList[i] != null; i++) {
    loops = NetworkOperators._getLoopsOnNode(network.nodeList[i]);

    for(k = 0; allLoops[k] != null; k++) {
      for(j = 0; loops[j] != null; j++) {
        if(NetworkOperators._sameLoop(loops[j], allLoops[k])) {
          loops.splice(j, 1);
          j--;
        }
      }
    }
    allLoops = allLoops.concat(loops);
  }

  if(minSize) allLoops = allLoops.getFilteredByPropertyValue("length", minSize, "greater");

  allLoops.sort(function(a0, a1) {
    return a0.length > a1.length ? -1 : 1;
  });

  allLoops.forEach(function(loop) {
    console.log(loop.getIds().join('-'));
  });

  return allLoops;
};

NetworkOperators._sameLoop = function(loop0, loop1) {
  if(loop0.length != loop1.length) return false;
  if(loop1.getNodeById(loop0[0].id) == null) return false;

  var i1 = loop1.indexOf(loop0[0]);
  var l = loop0.length;
  for(var i = 1; loop0[i] != null; i++) {
    if(loop0[i] != loop1[(i + i1) % l]) return false;
  }
  return true;
};

/**
 * @ignore
 */
NetworkOperators._getLoopsOnNode = function(central) {
  if(central.toNodeList.length === 0 || central.fromNodeList.length === 0) return [];

  var columns = new Table();
  var nl = new NodeList();
  var n, i, j;
  var node;

  nl.addNode(central);
  columns.push(nl);

  NetworkOperators._loopsColumns(central.toNodeList, 1, columns, 1);

  //purge
  for(n = 1; columns[n]; n++) {
    for(i = 1; columns[i] != null; i++) {
      for(j = 0; columns[i][j] != null; j++) {
        node = columns[i][j];
        delete node.onColumn;
        if(node.toNodeList.length === 0) {
          columns[i].removeNodeAtIndex(j);
          j--;
        }
      }
    }
  }

  /////////////////////
  //build loops
  var loops = new Table();
  var loop;
  for(i = 1; columns[i] != null; i++) {
    for(j = 0; columns[i][j] != null; j++) {
      node = columns[i][j];
      //if(node.toNodeList.indexOf(central)!=-1){
      if(node.toNodeList.getNodeById(central.id) != null) {
        loop = new NodeList(node);
        loops.push(loop);
        NetworkOperators._pathsToCentral(columns, i, loop, loops);
      }
    }
  }

  loops.sort(function(a0, a1) {
    return a0.length > a1.length ? -1 : 1;
  });

  return loops;
};

/**
 * @ignore
 */
NetworkOperators._pathsToCentral = function(columns, iColumn, path, paths) {
  if(path.finished) return;

  if(iColumn === 0) {
    path.finished = true;
    return;
  }

  var i;
  var node = path[0];
  var prevNode;
  var prevPath;
  var newPath;
  var first = true;

  var nodesToCheck = columns[iColumn - 1].clone();
  nodesToCheck.addNodes(columns[iColumn]);

  var lPrevColumn = columns[iColumn - 1].length;

  for(i = 0; nodesToCheck[i] != null; i++) {
    prevNode = nodesToCheck[i];
    //if(node==prevNode || path.indexOf(prevNode)!=-1 || (prevPath!=null && prevPath.indexOf(prevNode)!=-1)) continue;
    if(node == prevNode || path.getNodeById(prevNode.id) != null || (prevPath != null && prevPath.getNodeById(prevNode.id) != null)) continue;

    //if(prevNode.toNodeList.indexOf(node)!=-1){

    if(prevNode.toNodeList.getNodeById(node.id) != null) {
      if(first) {
        prevPath = path.clone();

        path.unshift(prevNode);
        path.ids[prevNode.id] = prevNode;

        NetworkOperators._pathsToCentral(columns, i < lPrevColumn ? (iColumn - 1) : iColumn, path, paths);
        first = false;
      } else {
        newPath = prevPath.clone();

        paths.push(newPath);

        newPath.unshift(prevNode);
        newPath.ids[prevNode.id] = prevNode;

        NetworkOperators._pathsToCentral(columns, i < lPrevColumn ? (iColumn - 1) : iColumn, newPath, paths);
      }
    }
  }
};

/**
 * @ignore
 */
NetworkOperators._loopsColumns = function(nodeList, iColumn, columns) {
  if(columns[iColumn] == null) columns[iColumn] = new NodeList();
  var node;
  var newNodeList = new NodeList();
  for(var i = 0; nodeList[i] != null; i++) {
    node = nodeList[i];
    if(!node.onColumn) {
      node.onColumn = true;
      columns[iColumn].addNode(node);
      newNodeList.addNodes(node.toNodeList);
    }
  }
  newNodeList = newNodeList.getWithoutRepetitions();
  for(i = 0; newNodeList[i] != null; i++) {
    if(newNodeList[i].onColumn) {
      newNodeList.removeNodeAtIndex(i);
      //newNodeList.ids[newNodeList[i].id] = null;
      //newNodeList.splice(i, 1);
      i--;
    }
  }
  if(newNodeList.length > 0) NetworkOperators._loopsColumns(newNodeList, iColumn + 1, columns);
};




/**
 * Builds a spanning tree of a Node in a Network (not very efficient)
 * @param  {Network} network
 *
 * @param  {Node} node0 Parent of the tree (first node on network.nodeList by default)
 * @param  {Node} nodeLimit Optional node in the network to prune the tree
 * @return {Tree}
 * tags:
 */
NetworkOperators.spanningTree = function(network, node0, nodeLimit) { //TODO: this method is horribly inneficient // add: level limt
  if(network==null) return;

  node0 = node0==null?network.nodeList[0]:node0;

  var tree = new Tree();
  var parent = new Node(node0.id, node0.name);
  parent.node = node0;
  tree.addNodeToTree(parent);

  //console.log('spanningTree | network, node0.id, nodeLimit.id', network, node0.id, nodeLimit==null?'nodeLimit=null':nodeLimit.id);

  var nodes = node0.nodeList;
  var newNodes;
  var newNode;
  var nodeInPrevNodes;
  var i;
  var id;

  var limitReached = false;

  for(i = 0; nodes[i] != null; i++) {
    newNode = new Node(nodes[i].id, nodes[i].name);
    if(newNode.id == parent.id) continue;
    newNode.node = nodes[i];
    tree.addNodeToTree(newNode, parent);
    //console.log('  spanningTree | add:', newNode.id)
    //console.log('                               spanningTree add node: newNode.id, nodeLimit.id', newNode.id, nodeLimit.id);
    if(nodeLimit != null && newNode.id == nodeLimit.id){
      limitReached = true;
      //console.log('       spanningTree | limitReached!');
    }
  }
  //console.log('spanningTree |  limitReached A',  limitReached);

  if(limitReached) return tree;

  var accumulated = nodes.clone();
  accumulated.addNode(node0);

  var N = 0;

  while(true) {
    newNodes = new NodeList(); //nodes.clone();
    for(i = 0; nodes[i] != null; i++) {
      newNodes.addNodes(nodes[i].nodeList); //TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
    }
    //console.log('N '+N);
    newNodes = newNodes.getWithoutRepetitions();
    // console.log('      newNodes.getIds()', newNodes.getIds().join(','));
    // console.log('      accumulated.getIds()', accumulated.getIds().join(','));
    newNodes.removeElements(accumulated);
    // console.log('      newNodes.removeElements(accumulated) | newNodes.getIds()', newNodes.getIds().join(','));
    //console.log('newNodes.length (if 0 return tree)', newNodes.length)
    if(newNodes.length == 0) return tree;

    for(i = 0; newNodes[i] != null; i++) {
      newNode = new Node(newNodes[i].id, newNodes[i].name);
      // console.log('                   ++'+newNodes[i].id);
      newNode.node = newNodes[i];
      for(var j = 0; newNodes[i].nodeList[j] != null; j++) {
        id = newNodes[i].nodeList[j].id;
        nodeInPrevNodes = nodes.getNodeById(id);
        if(nodeInPrevNodes != null && newNode.id != id) {
          tree.addNodeToTree(newNode, tree.nodeList.getNodeById(id));
          break;
        }
      }
      if(nodeLimit != null && newNode.id == nodeLimit.id){
        limitReached = true;
      }
    }

    //console.log('spanningTree |  limitReached B (if true return tree)',  limitReached);
    if(limitReached) limitReached = true;

    if(limitReached) return tree;

    nodes = newNodes;
    // console.log('     --concat');
    accumulated = accumulated.concat(newNodes);

    N++;
    if(N>network.nodeList){
      //console.log('/////////////////STOP');
      return null;
    }
  }

  //console.log('return spanningTree:', tree);
  return tree;
};

/**
 * find nodes in next degree to a list of nodes (adjacent nodes)
 * @param  {Network} network
 * @param  {NodeList} nodeList
 * @param  {Boolean} returnConcat if true (false bu default) return nodeList and adjacent, if false only adjacent
 * @param {Boolean} directional (false by default) adjacent nodes are only the ones pointed by direct relations from nodes in the nodeList
 * @return {NodeList}
 * tags:
 */
NetworkOperators.adjacentNodeList = function(network, nodeList, returnConcat, directional){
  if(network==null || nodeList==null) return null;

  var newNodeList = returnConcat?nodeList.clone():new NodeList();
  var i, j;
  var node0, node1;

  if(directional){
    for(i=0; nodeList[i]!=null; i++){
      for(j=0; nodeList[i].toNodeList[j]!=null; j++){
        node1 = nodeList[i].toNodeList[j].id;
        if(nodeList.getNodeById(node1)==null && newNodeList.getNodeById(node1)==null) newNodeList.addNode(node1);
      }
    }

    return newNodeList;
  }

  for(i=0; nodeList[i]!=null; i++){
    for(j=0; nodeList[i].relationList[j]!=null; j++){
      node0 = nodeList[i].relationList[j].node0;
      node1 = nodeList[i].relationList[j].node1;
      if(nodeList.getNodeById(node0.id)==null && newNodeList.getNodeById(node0.id)==null ) newNodeList.addNode(node0);
      if(nodeList.getNodeById(node1.id)==null && newNodeList.getNodeById(node1.id)==null ) newNodeList.addNode(node1);
    }
  }

  return newNodeList;

};

NetworkOperators.degreesPartition = function(network, node) {
  //TODO:optionally add a NodeList of not connected Nodes
  var list0 = new NodeList(node);
  var nodes = node.nodeList;
  var nextLevel = nodes;
  var nextNodes;
  var externalLayer;
  var i;
  var j;
  var nodesTable = new Table(list0);
  var added = nextLevel.length > 0;

  if(added) nodesTable.push(nextLevel);

  var listAccumulated = nextLevel.clone();
  listAccumulated.push(node);

  while(added) {
    externalLayer = new NodeList();
    for(i = 0; nextLevel[i] != null; i++) {
      nextNodes = nextLevel[i].nodeList;
      for(j = 0; nextNodes[j] != null; j++) {
        if(listAccumulated.indexOf(nextNodes[j]) == -1) { //fix this
          externalLayer.push(nextNodes[j]);
          listAccumulated.push(nextNodes[j]);
        }
      }
    }
    added = externalLayer.length > 0;
    if(added) {
      nextLevel = externalLayer;
      nodesTable.push(nextLevel);
    }
  }

  return nodesTable;
};

NetworkOperators.degreesFromNodeToNodes = function(network, node, nodeList) {
  //TODO: probably very unefficient
  var table = NetworkOperators.degreesPartition(network, node);
  var degrees = new NumberList();
  degrees.max = 0;
  var j;
  for(var i = 0; nodeList[i] != null; i++) {
    if(nodeList[i] == node) {
      degrees[i] = 0;
    } else {
      for(j = 1; table[j] != null; j++) {
        if(table[j].indexOf(nodeList[i]) != -1) { //use getNodeById
          degrees[i] = j;
          degrees.max = Math.max(degrees.max, j);
          break;
        }
      }
    }
    if(degrees[i] == null) degrees[i] = -1;
  }
  return degrees;
};

/**
 * Builds a dendrogram from a Network.
 *
 * @param  {Network} network
 * @return {Tree}
 * tags:analysis
 */
NetworkOperators.buildDendrogram = function(network) {
  if(network == null) return null;

  var tree = new Tree();
  var nodeList = new NodeList();

  var closest;
  var node0;
  var node1;
  var newNode;
  var id;
  var i;
  var nNodes = network.nodeList.length;

  var pRelationPair = 2 * network.relationList.length / (nNodes * (nNodes - 1));

  for(i = 0; network.nodeList[i] != null; i++) {
    newNode = new Node("[" + network.nodeList[i].id + "]", "[" + network.nodeList[i].id + "]");
    newNode.nodes = new NodeList(network.nodeList[i]);
    tree.addNode(newNode);
    nodeList[i] = newNode;
  }


  while(nodeList.length > 1) {
    closest = NetworkOperators._getClosestPair(nodeList, true, pRelationPair);

    node0 = nodeList[closest[0]];
    node1 = nodeList[closest[1]];

    id = "[" + node0.id + "-" + node1.id + "]";

    newNode = new Node(id, id);
    newNode.weight = closest.strength;

    tree.addNode(newNode);
    tree.createRelation(newNode, node0, id + "-" + node0.id);
    tree.createRelation(newNode, node1, id + "-" + node1.id);

    newNode.node = new Node(id, id);
    newNode.nodes = node0.nodes.concat(node1.nodes);

    for(i = 0; node0.nodeList[i] != null; i++) {
      newNode.node.nodeList.addNode(node0.nodeList[i]);
      newNode.node.relationList.addRelation(node0.relationList[i]);
    }
    for(i = 0; node1.nodeList[i] != null; i++) {
      newNode.node.nodeList.addNode(node1.nodeList[i]);
      newNode.node.relationList.addRelation(node1.relationList[i]);
    }

    nodeList.removeElement(node0);
    nodeList.removeElement(node1);
    nodeList.addNode(newNode);
  }


  //recalculate levels for nodes here
  for(i = 0; tree.nodeList[i] != null; i++) {
    node0 = tree.nodeList[i];
    if(node0.nodes.length > 1) {
      node0.level = Math.max(node0.nodeList[0].level, node0.nodeList[1].level) + 1;
    }
  }

  return tree;
};

/**
 * @ignore
 */
NetworkOperators._getClosestPair = function(nodeList, returnIndexes, pRelationPair) {
  var indexes;
  var nodes;

  if(nodeList.length == 2) {
    var index = nodeList[0].nodeList.indexOf(nodeList[1]);
    //var index = nodeList[0].nodeList.indexOfElement(nodeList[1]);
    if(returnIndexes) {
      indexes = [0, 1];
      indexes.strength = index == -1 ? 0 : nodeList[0].relationList[index].weight;
      return indexes;
    }
    nodes = new NodeList(nodeList[0], nodeList[1]);
    nodes.strength = index == -1 ? 0 : nodeList[0].relationList[index].weight;
    return nodes;
  }

  var i;
  var j;

  var nodeList0;

  var strength;
  var maxStrength = -1;

  for(i = 0; nodeList[i + 1] != null; i++) {
    nodeList0 = nodeList[i].nodes;
    for(j = i + 1; nodeList[j] != null; j++) {
      strength = NetworkOperators._strengthBetweenSets(nodeList0, nodeList[j].nodes, pRelationPair);
      //console.logog('        i,j,strength, nodeList0.length, nodeList[j].nodes.length', i, j, strength, nodeList0.length, nodeList[j].nodes.length);
      if(strength > maxStrength) {
        indexes = [i, j];
        maxStrength = strength;
        //console.logog('    ---> i, j, new maxStrength', i, j, maxStrength);
      }
    }
  }
  indexes.strength = maxStrength;
  if(returnIndexes) return indexes;
  nodes = new NodeList(nodeList[indexes[0]], nodeList[indexes[1]]);
  nodes.strength = maxStrength;
  return nodes;

};

/**
 * @ignore
 */
NetworkOperators._strengthBetweenSets = function(nodeList0, nodeList1, pRelationPair) {
  var strength = 0;
  var i, j;
  var node0;

  for(i = 0; nodeList0[i] != null; i++) {
    node0 = nodeList0[i];
    for(j = 0; node0.nodeList[j] != null; j++) {
      if(nodeList1.indexOf(node0.nodeList[j]) != -1) {
      //if(nodeList1.getNodeById(node0.nodeList[j].id) != null) { // <----- seemed to be slower!
        strength += node0.relationList[j].weight;
      }
    }
  }

  return strength / (nodeList0.length * nodeList1.length * pRelationPair);
};



/**
 * Builds a Table of clusters, based on an dendrogram Tree (if not provided it will be calculated), and a weight bias
 * @param  {Network} network
 *
 * @param  {Tree} dendrogramTree Dendrogram Tree, if precalculated, changes in weight bias will perform faster
 * @param  {Number} minWeight Weight bias, criteria to group clusters (0.5 default)
 * @return {Table} List of NodeLists
 * tags:analysis
 */
NetworkOperators.buildNetworkClusters = function(network, dendrogramTree, minWeight) {
  if(network == null) return;

  if(dendrogramTree == null) dendrogramTree = NetworkOperators.buildDendrogram(network);
  minWeight = minWeight || 0.5;

  var clusters = new Table();

  NetworkOperators._iterativeBuildClusters(dendrogramTree.nodeList[dendrogramTree.nodeList.length - 1], clusters, minWeight);

  return clusters;
};

/**
 * @ignore
 */
NetworkOperators._iterativeBuildClusters = function(node, clusters, minWeight) {
  if(node.nodeList.length == 1) {
    clusters.push(new NodeList(node.node));
    return;
  }

  if(node.nodeList[0].nodes.length == 1 || node.nodeList[0].weight > minWeight) {
    clusters.push(node.nodeList[0].nodes);
  } else {
    NetworkOperators._iterativeBuildClusters(node.nodeList[0], clusters, minWeight);
  }

  if(node.nodeList[1].nodes.length == 1 || node.nodeList[1].weight > minWeight) {
    clusters.push(node.nodeList[1].nodes);
  } else {
    NetworkOperators._iterativeBuildClusters(node.nodeList[1], clusters, minWeight);
  }
};




/**
 * Adds PageRank as <strong>fromPageRank</strong> and <strong>toPageRank</strong> properties See {@link http://en.wikipedia.org/wiki/Page_rank|Page Rank} for more details. fromPageRank or toPageRank will be added as propertie to Nodes.
 * I use two different pageranks, since a Network whose relations measure influence would require a pagerank to measure nodes influence into the system.
 *
 * @param {Network} network
 * @param {Boolean} From=true Optional, default:true, to set if the PageRank uses the in-relations or out-relations
 * @param {Boolean} useRelationsWeigh=false Optional, default:false, set to true if relations weight will affect the metric balance, particularly interesting if some weights are negative
 * tags:analytics,transformative
 */
NetworkOperators.addPageRankToNodes = function(network, from, useRelationsWeight) {
  //TODO:deploy useRelationsWeight
  from = from == null ? true : from;

  var n;
  var i;
  var j;
  var d = 0.85; //dumping factor;
  var N = network.nodeList.length;
  var base = (1 - d) / N;
  var propName = from ? "fromPageRank" : "toPageRank";
  var node;
  var otherNode;
  var nodeList;

  network.minFromPageRank = network.minToPageRank = 99999999;
  network.maxFromPageRank = network.maxToPageRank = -99999999;


  for(i = 0; network.nodeList[i] != null; i++) {
    node = network.nodeList[i];
    node[propName] = 1 / N;
  }

  for(n = 0; n < 300; n++) {
    for(i = 0; network.nodeList[i] != null; i++) {
      node = network.nodeList[i];

      nodeList = from ? node.fromNodeList : node.toNodeList;
      node[propName] = base;

      for(j = 0; nodeList[j] != null; j++) {
        otherNode = nodeList[j];
        node[propName] += d * otherNode[propName] / (from ? otherNode.toNodeList.length : otherNode.fromNodeList.length);
      }

      if(n == 299) {
        if(from) {
          network.minFromPageRank = Math.min(network.minFromPageRank, node[propName]);
          network.maxFromPageRank = Math.max(network.maxFromPageRank, node[propName]);
        } else {
          network.minToPageRank = Math.min(network.minToPageRank, node[propName]);
          network.maxToPageRank = Math.max(network.maxToPageRank, node[propName]);
        }
      }
    }
  }
};


/**
 * Builds a fusioned Network from a list of network codes, with nodes with same names coming from different source networks (called hubs) connected
 * @param  {List} noteworksList
 *
 * @param  {Number} hubsDistanceFactor distance between repeated nodes (hubs)
 * @param  {Number} hubsForceWeight strength factor for the relation when using a forces engine
 * @return {Network}
 */
NetworkOperators.fusionNoteworks = function(noteworksList, hubsDistanceFactor, hubsForceWeight) {
  var networks = new List();

  noteworksList.forEach(function(map, i) {
    var subfix = "map_" + i + "_";
    var net = NetworkEncodings.decodeNoteWork(map);
    net = net.clone(net.nodesPropertiesNames, net.relationsPropertiesNames, subfix);
    net.id = "map_" + i;
    networks.push(net);
  });

  return NetworkOperators.fusionNetworks(networks, hubsDistanceFactor, hubsForceWeight);
};


/**
 * Builds a fusioned Network, with nodes with same names coming from different source networks (called hubs) connected
 * @param  {List} networks list of networks
 *
 * @param  {Number} hubsDistanceFactor distance between repeated nodes (hubs)
 * @param  {Number} hubsForceWeight strength factor for the relation when using a forces engine
 * @return {Network} fusioned Network
 */
NetworkOperators.fusionNetworks = function(networks, hubsDistanceFactor, hubsForceWeight) {
  hubsDistanceFactor = hubsDistanceFactor == null ? 1 : hubsDistanceFactor;
  hubsForceWeight = hubsForceWeight == null ? 1 : hubsForceWeight;

  var fusionNet = new Network();
  var newNode;
  var newRelation;
  var i, j;
  var mapsCluster = new Table();

  var colors = ColorListGenerators.createDefaultCategoricalColorList(networks.length).getInterpolated('black', 0.17).getInterpolated('white', 0.55);

  networks.forEach(function(net, i) {
    mapsCluster[i] = new NodeList();

    net.nodeList.forEach(function(node) {

      newNode = fusionNet.nodeList.getNodeById(node.id);

      if(newNode == null) {
        newNode = new Node(node.id, node.name);
        newNode.basicId = node.basicId;
        newNode.mapId = "map_" + i;
        newNode.mapsIds = [newNode.mapId];
        newNode.color = colors[i];
        newNode.nMaps = 1;
        newNode.weight = node.weight;
        fusionNet.addNode(newNode);
        mapsCluster[i].addNode(newNode);
      } else {
        newNode.nMaps += 1;
        newNode.mapsIds.push("map_" + i);
        newNode.color = 'rgb(200,200,200)';
      }
    });

  });



  networks.forEach(function(net) {
    net.relationList.forEach(function(relation) {
      newRelation = new Relation(relation.id, relation.name, fusionNet.nodeList.getNodeById(relation.node0.id), fusionNet.nodeList.getNodeById(relation.node1.id));
      newRelation.color = relation.color;
      newRelation.content = relation.content;
      newRelation.description = relation.description;
      newRelation.weight = relation.weight;
      fusionNet.addRelation(newRelation);
    });
  });

  var node0;

  for(i = 0; fusionNet.nodeList[i] != null; i++) {
    node0 = fusionNet.nodeList[i];
    for(j = i + 1; fusionNet.nodeList[j] != null; j++) {
      if(node0.name == fusionNet.nodeList[j].name) {
        //newRelation = new Relation(node0.id+'_'+fusionNet.nodeList[j].id, node0.id+'_'+fusionNet.nodeList[j].id, node0, fusionNet.nodeList[j]);
        newRelation = new Relation(node0.id + '_' + fusionNet.nodeList[j].id, "same variable", node0, fusionNet.nodeList[j]);
        newRelation.color = 'black';
        newRelation.distanceFactor = hubsDistanceFactor;
        newRelation.forceWeight = hubsForceWeight;
        fusionNet.addRelation(newRelation);

        newRelation = new Relation(fusionNet.nodeList[j].id + '_' + node0.id, "same variable", fusionNet.nodeList[j], node0);
        newRelation.color = 'black';
        newRelation.distanceFactor = hubsDistanceFactor;
        newRelation.forceWeight = hubsForceWeight;
        fusionNet.addRelation(newRelation);

        newRelation.node0.nMaps += 1;
        newRelation.node1.nMaps += 1;
      }
    }
  }

  for(i = 0; fusionNet.nodeList[i] != null; i++) {
    fusionNet.nodeList[i].hubWeight = Math.sqrt(fusionNet.nodeList[i].nMaps - 1);
  }

  fusionNet.mapsCluster = mapsCluster;

  return fusionNet;
};

/*
 *
 * from https://github.com/upphiminn/jLouvain
 */
NetworkOperators._jLouvain = function() {
  //Constants
  var __PASS_MAX = -1;
  var __MIN    = 0.0000001;

  //Local vars
  var original_graph_nodes;
  var original_graph_edges;
  var original_graph = {};
  var partition_init;

  //Helpers
  function make_set(array){
    var set = {};
    array.forEach(function(d){
      set[d] = true;
    });
    return Object.keys(set);
  }

  function obj_values(obj){
     var vals = [];
     for( var key in obj ) {
         if ( obj.hasOwnProperty(key) ) {
             vals.push(obj[key]);
         }
     }
     return vals;
  }

  function get_degree_for_node(graph, node){
    var neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : [];
    var weight = 0;
    neighbours.forEach(function(neighbour){
      var value = graph._assoc_mat[node][neighbour] || 1;
      if(node == neighbour)
        value *= 2;
      weight += value;
    });
    return weight;
  }

  function get_neighbours_of_node(graph, node){
    if(typeof graph._assoc_mat[node] == 'undefined')
      return [];

    var neighbours = Object.keys(graph._assoc_mat[node]);
    return neighbours;
  }


  function get_edge_weight(graph, node1, node2){
    return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
  }

  function get_graph_size(graph){
    var size = 0;
    graph.edges.forEach(function(edge){
      size += edge.weight;
    });
    return size;
  }

  function add_edge_to_graph(graph, edge){
    update_assoc_mat(graph, edge);

    var edge_index = graph.edges.map(function(d){
      return d.source+'_'+d.target;
    }).indexOf(edge.source+'_'+edge.target);

    if(edge_index != -1)
      graph.edges[edge_index].weight = edge.weight;
    else
      graph.edges.push(edge);
  }

  function make_assoc_mat(edge_list){
    var mat = {};
    edge_list.forEach(function(edge){
      mat[edge.source] = mat[edge.source] || {};
      mat[edge.source][edge.target] = edge.weight;
      mat[edge.target] = mat[edge.target] || {};
      mat[edge.target][edge.source] = edge.weight;
    });

    return mat;
  }

  function update_assoc_mat(graph, edge){
    graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {};
    graph._assoc_mat[edge.source][edge.target] = edge.weight;
    graph._assoc_mat[edge.target] = graph._assoc_mat[edge.target] || {};
    graph._assoc_mat[edge.target][edge.source] = edge.weight;
  }

  function clone(obj){
      if(obj == null || typeof(obj) != 'object')
          return obj;

      var temp = obj.constructor();

      for(var key in obj)
          temp[key] = clone(obj[key]);
      return temp;
  }

  //Core-Algorithm Related
  function init_status(graph, status, part){
    status.nodes_to_com = {};
    status.total_weight = 0;
    status.internals = {};
    status.degrees = {};
    status.gdegrees = {};
    status.loops = {};
    status.total_weight = get_graph_size(graph);

    if(typeof part == 'undefined'){
      graph.nodes.forEach(function(node,i){
        status.nodes_to_com[node] = i;
        var deg = get_degree_for_node(graph, node);
        if (deg < 0)
          throw 'Bad graph type, use positive weights!';
        status.degrees[i] = deg;
        status.gdegrees[node] = deg;
        status.loops[node] = get_edge_weight(graph, node, node) || 0;
        status.internals[i] = status.loops[node];
      });
    }else{
      graph.nodes.forEach(function(node){
        var com = part[node];
        status.nodes_to_com[node] = com;
        var deg = get_degree_for_node(graph, node);
        status.degrees[com] = (status.degrees[com] || 0) + deg;
        status.gdegrees[node] = deg;
        var inc = 0.0;

        var neighbours  = get_neighbours_of_node(graph, node);
        neighbours.forEach(function(neighbour){
          var weight = graph._assoc_mat[node][neighbour];
          if (weight <= 0){
            throw "Bad graph type, use positive weights";
          }

          if(part[neighbour] == com){
            if (neighbour == node){
              inc += weight;
            }else{
              inc += weight/2.0;
            }
          }
        });
        status.internals[com] = (status.internals[com] || 0) + inc;
      });
    }
  }

  function __modularity(status){
    var links = status.total_weight;
    var result = 0.0;
    var communities = make_set(obj_values(status.nodes_to_com));

    communities.forEach(function(com){
      var in_degree = status.internals[com] || 0 ;
      var degree = status.degrees[com] || 0 ;
      if(links > 0){
        result = result + in_degree / links - Math.pow((degree / (2.0*links)), 2);
      }
    });
    return result;
  }

  function __neighcom(node, graph, status){
    // compute the communities in the neighb. of the node, with the graph given by
    // node_to_com

    var weights = {};
    var neighboorhood = get_neighbours_of_node(graph, node);//make iterable;

    neighboorhood.forEach(function(neighbour){
      if(neighbour != node){
        var weight = graph._assoc_mat[node][neighbour] || 1;
        var neighbourcom = status.nodes_to_com[neighbour];
        weights[neighbourcom] = (weights[neighbourcom] || 0) + weight;
      }
    });

    return weights;
  }

  function __insert(node, com, weight, status){
    //insert node into com and modify status
    status.nodes_to_com[node] = +com;
    status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node]||0);
    status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node]||0);
  }

  function __remove(node, com, weight, status){
    //remove node from com and modify status
    status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
    status.internals[com] = ((status.internals[com] || 0) - weight -(status.loops[node] ||0));
    status.nodes_to_com[node] = -1;
  }

  function __renumber(dict){
    var count = 0;
    var ret = clone(dict); //deep copy :)
    var new_values = {};
    var dict_keys = Object.keys(dict);
    dict_keys.forEach(function(key){
      var value = dict[key];
      var new_value =  typeof new_values[value] =='undefined' ? -1 : new_values[value];
      if(new_value == -1){
        new_values[value] = count;
        new_value = count;
        count = count + 1;
      }
      ret[key] = new_value;
    });
    return ret;
  }

  function __one_level(graph, status){
    //Compute one level of the Communities Dendogram.
    var modif = true,
      nb_pass_done = 0,
      cur_mod = __modularity(status),
      new_mod = cur_mod;

    while (modif && nb_pass_done != __PASS_MAX){
      cur_mod = new_mod;
      modif = false;
      nb_pass_done += 1;

      graph.nodes.forEach(function(node){
        var com_node = status.nodes_to_com[node];
        var degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0);
        var neigh_communities = __neighcom(node, graph, status);
        __remove(node, com_node, (neigh_communities[com_node] || 0.0), status);
        var best_com = com_node;
        var best_increase = 0;
        var neigh_communities_entries = Object.keys(neigh_communities);//make iterable;

        neigh_communities_entries.forEach(function(com){
          var incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw;
          if (incr > best_increase){
            best_increase = incr;
            best_com = com;
          }
        });

        __insert(node, best_com, neigh_communities[best_com] || 0, status);

        if(best_com != com_node)
          modif = true;
      });
      new_mod = __modularity(status);
      if(new_mod - cur_mod < __MIN)
        break;
    }
  }

  function induced_graph(partition, graph){
    var ret = {nodes:[], edges:[], _assoc_mat: {}};
    var w_prec, weight;
    //add nodes from partition values
    var partition_values = obj_values(partition);
    ret.nodes = ret.nodes.concat(make_set(partition_values)); //make set
    graph.edges.forEach(function(edge){
      weight = edge.weight || 1;
      var com1 = partition[edge.source];
      var com2 = partition[edge.target];
      w_prec = (get_edge_weight(ret, com1, com2) || 0);
      var new_weight = (w_prec + weight);
      add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight});
    });
    return ret;
  }

  function partition_at_level(dendogram, level){
    var partition = clone(dendogram[0]);
    for(var i = 1; i < level + 1; i++ )
      Object.keys(partition).forEach(function(key){
        var node = key;
        var com  = partition[key];
        partition[node] = dendogram[i][com];
      });
    return partition;
  }


  function generate_dendogram(graph, part_init){

    if(graph.edges.length === 0){
      var part = {};
      graph.nodes.forEach(function(node){
        part[node] = node;
      });
      return part;
    }
    var status = {};

    init_status(original_graph, status, part_init);
    var mod = __modularity(status);
    var status_list = [];
    __one_level(original_graph, status);
    var new_mod = __modularity(status);
    var partition = __renumber(status.nodes_to_com);
    status_list.push(partition);
    mod = new_mod;
    var current_graph = induced_graph(partition, original_graph);
    init_status(current_graph, status);

    while (true){
      __one_level(current_graph, status);
      new_mod = __modularity(status);
      if(new_mod - mod < __MIN)
        break;

      partition = __renumber(status.nodes_to_com);
      status_list.push(partition);

      mod = new_mod;
      current_graph = induced_graph(partition, current_graph);
      init_status(current_graph, status);
    }

    return status_list;
  }

  var core = function(){
    var dendogram = generate_dendogram(original_graph, partition_init);
    return partition_at_level(dendogram, dendogram.length - 1);
  };

  core.nodes = function(nds){
    if(arguments.length > 0){
      original_graph_nodes = nds;
    }
    return core;
  };

  core.edges = function(edgs){
    if(typeof original_graph_nodes == 'undefined')
      throw 'Please provide the graph nodes first!';

    if(arguments.length > 0){
      original_graph_edges = edgs;
      var assoc_mat = make_assoc_mat(edgs);
      original_graph = { 'nodes': original_graph_nodes,
                   'edges': original_graph_edges,
                   '_assoc_mat': assoc_mat };
    }
    return core;

  };

  core.partition_init = function(prttn){
    if(arguments.length > 0){
      partition_init = prttn;
    }
    return core;
  };

  return core;
};

/**
 * Builds a Table of clusters based on Louvain community detection.
 * @param {Network} network
 * @return {Table} List of NodeLists
 * tags:analysis
 */
NetworkOperators.buildNetworkClustersLouvain = function(network) {
  if(network==null) return network;

  var node_data = [];
  var i;
  for(i=0; i < network.nodeList.length; i++){
    // force nodes to be stringlike since they get used as properties in result
    node_data.push('n'+network.nodeList[i].id);
  }
  var edge_data = [];
  for(i=0; i < network.relationList.length; i++){
    var obj = {source: 'n'+network.relationList[i].node0.id,
               target: 'n'+network.relationList[i].node1.id,
               weight:network.relationList[i].weight};
    edge_data.push(obj);
  }

  // Object with ids of nodes as properties and community number assigned as value.
  var community = NetworkOperators._jLouvain().nodes(node_data).edges(edge_data);
  var result  = community();
  var clusters = new Table();

  if(result)
    for(i=0; i < network.nodeList.length; i++){
      var j = result['n'+network.nodeList[i].id];
      if(clusters[j] == undefined)
        clusters[j]= new NodeList();
      clusters[j].addNode(network.nodeList[i]);
    }
  else{
    // no results mean no communities, make them all unique
    for(i=0; i < network.nodeList.length; i++){
      clusters.push(new NodeList(network.nodeList[i]));
    }
  }
  return clusters;
};


/**
 * @todo write docs
 */
NetworkOperators.getReport = function() {
  return "network contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
};
