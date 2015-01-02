NetworkOperators = function(){};


NetworkOperators.filterNodesByMinDegree = function(network, minDegree){
	var i;
	for(i=0; network.nodeList[i]!=null; i++){
		if(network.nodeList[i].nodeList.length<minDegree){
			network.removeNode(network.nodeList[i]);
			i--;
		}
	}
	return null;
}


NetworkOperators.degreeBetweenNodes = function(network, node0, node1){
	if(node0==node1) return 0;
	var nodes = node0.nodeList;
	var d=1;
	var newNodes;
	var i;
	
	//while(nodes.indexOf(node1)==-1){//TODO: check if getNodeById is faster
	while(nodes.getNodeById(node1.id)==null){
		newNodes = nodes.clone();
		for(i=0;nodes[i]!=null;i++){
			newNodes = ListOperators.concat(newNodes, nodes[i].nodeList);//TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
		}
		newNodes = newNodes.getWithoutRepetitions();
		if(nodes.length==newNodes.length) return -1;
		nodes = newNodes;
		d++;
	}
	
	return d;
}

NetworkOperators.shortestPath = function(network, node0, node1, includeExtremes){
	var tree = NetworkOperators.spanningTree(network, node0, node1);
	var path = new NodeList();
	if(includeExtremes) path.addNode(node1);
	var node = tree.nodeList.getNodeById(node1.id);
	if(node==null) return null;
	while(node.parent.id!=node0.id){
		path.addNode(node.parent.node);
		node = node.parent;
		if(node==null) return null;
	}
	if(includeExtremes) path.addNode(node0);
	return path.getReversed();
}


/**
 * finds all shortest paths between two nodes
 * @param  {Network} network
 * @param  {Node} node0
 * @param  {Node} node1
 * 
 * @param  {NodeList} shortPath in case a shortPath has been calculated previously
 * @return {Table} list of paths (nodeLists)
 */
NetworkOperators.shortestPaths = function(network, node0, node1, shortPath){
	if(shortPath==null) shortPath = NetworkOperators.shortestPath(network, node0, node1, true);

	var lengthShortestPaths = shortPath.length;

	var allPaths = new Table();
	var firstPath = new NodeList();
	var i;

	firstPath.addNode(node0);
	allPaths.push(firstPath);


	var all = NetworkOperators._extendPaths(allPaths, node1, lengthShortestPaths);

	c.l('1. all.length', all.length);

	for(i=0; all[i]!=null; i++){
		if(all[i][all[i].length-1]!=node1){
			all.splice(i, 1);
			i--;
		}
	}

	c.l('2. all.length', all.length);

	return all;
}

NetworkOperators._extendPaths = function(allPaths, nodeDestiny, maxLength){

	if(allPaths[0].length >= maxLength) return allPaths;

	var i, j;
	var next;
	var node;

	var newPaths = new Table();
	var path, newPath;

	for(i=0; allPaths[i]!=null; i++){
		path = allPaths[i];
		node = path[path.length-1];
		next = node.nodeList.getWithoutRepetitions();

		for(j=0; next[j]!=null; j++){
			if(path.getNodeById(next[j].id)==null){
				newPath = path.clone();
				newPath.addNode(next[j]);
				newPaths.push(newPath);
			}
		}

	}

	allPaths = newPaths;

	return NetworkOperators._extendPaths(allPaths, nodeDestiny, maxLength);

}

/**
 * finds all loops in the network
 * @param  {Network} network
 * @return {Table} list of nodeLists
 * tags:analytics
 */
NetworkOperators.loops = function(network){
	var i, j, k, loops;
	
	allLoops = new Table();
	
	for(i=0; network.nodeList[i]!=null; i++){
		loops = NetworkOperators._getLoopsOnNode(network.nodeList[i]);

		for(k=0; allLoops[k]!=null; k++){
			for(j=0; loops[j]!=null; j++){
				if(NetworkOperators._sameLoop(loops[j], allLoops[k])){
					loops.splice(j, 1);
					j--;
				}
			}
		}
		allLoops = allLoops.concat(loops);
	}

	allLoops.sort(function(a0, a1){return a0.length>a1.length?-1:1});

	allLoops.forEach(function(loop){
		c.l(loop.getIds().join('-'));
	});

	var same = NetworkOperators._sameLoop(allLoops[0], allLoops[1]);

	return allLoops;
}
NetworkOperators._sameLoop = function(loop0, loop1){
	if(loop0.length!=loop1.length) return false;
	if(loop1.getNodeById(loop0[0].id)==null) return false;

	var i1 = loop1.indexOf(loop0[0]);
	var l = loop0.length;
	for(var i=1; loop0[i]!=null; i++){
		if(loop0[i]!=loop1[(i+i1)%l]) return false;
	}
	return true;
}
NetworkOperators._getLoopsOnNode = function(central){
	if(central.toNodeList.length==0 || central.fromNodeList.length==0) return [];
	
	var columns = new Table();
	var nl = new NodeList();
	var n, i, j;

	nl.addNode(central);
	columns.push(nl);

	NetworkOperators._loopsColumns(central.toNodeList, 1, columns, 1);
	
	//purge
	for(n=1; columns[n]; n++){
		for(i=1; columns[i]!=null; i++){
			for(j=0; columns[i][j]!=null; j++){
				node = columns[i][j];
				delete node.onColumn;
				if(node.toNodeList.length==0){
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
	for(i=1; columns[i]!=null; i++){
		for(j=0; columns[i][j]!=null; j++){
			node = columns[i][j];
			//if(node.toNodeList.indexOf(central)!=-1){
			if(node.toNodeList.getNodeById(central.id)!=null){
				loop = new NodeList(node);
				loops.push(loop);
				NetworkOperators._pathsToCentral(columns, i, loop, loops);
			}
		}
	}
	
	loops.sort(function(a0, a1){return a0.length>a1.length?-1:1});
	
	return loops;
}

NetworkOperators._pathsToCentral = function(columns, iColumn, path, paths){
	if(path.finished) return;
	
	if(iColumn==0){
		path.finished = true;
		return;
	}

	var i;
	var node = path[0];
	var prevNode;
	var prevPath;
	var newPath;
	var first = true;

	var nodesToCheck = columns[iColumn-1].clone();
	nodesToCheck.addNodes(columns[iColumn]);

	var lPrevColumn = columns[iColumn-1].length;
	
	for(i=0; nodesToCheck[i]!=null; i++){
		prevNode = nodesToCheck[i];
		//if(node==prevNode || path.indexOf(prevNode)!=-1 || (prevPath!=null && prevPath.indexOf(prevNode)!=-1)) continue;
		if(node==prevNode || path.getNodeById(prevNode.id)!=null || (prevPath!=null && prevPath.getNodeById(prevNode.id)!=null)) continue;
		
		//if(prevNode.toNodeList.indexOf(node)!=-1){
		
		if(prevNode.toNodeList.getNodeById(node.id)!=null){
			if(first){
				prevPath = path.clone();

				path.unshift(prevNode);
				path.ids[prevNode.id] = prevNode;
				
				NetworkOperators._pathsToCentral(columns, i<lPrevColumn?(iColumn-1):iColumn, path, paths);
				first = false;
			} else {
				newPath = prevPath.clone();

				paths.push(newPath);
				
				newPath.unshift(prevNode);
				newPath.ids[prevNode.id] = prevNode;

				NetworkOperators._pathsToCentral(columns, i<lPrevColumn?(iColumn-1):iColumn, newPath, paths);
			}
		}
	}
}

NetworkOperators._loopsColumns = function (nodeList, iColumn, columns){
	if(columns[iColumn]==null) columns[iColumn]=new NodeList();
	var node, otherNode;
	var newNodeList = new NodeList();
	for(var i=0; nodeList[i]!=null; i++){
		node = nodeList[i];
		if(!node.onColumn){
			node.onColumn = true;
			columns[iColumn].addNode(node);
			newNodeList.addNodes(node.toNodeList);
		}
	}
	newNodeList = newNodeList.getWithoutRepetitions();
	for(i=0; newNodeList[i]!=null; i++){
		if(newNodeList[i].onColumn){
			newNodeList.removeNodeAtIndex(i);
			//newNodeList.ids[newNodeList[i].id] = null;
			//newNodeList.splice(i, 1);
			i--;
		}
	}
	if(newNodeList.length>0) NetworkOperators._loopsColumns(newNodeList, iColumn+1, columns);
}




/**
 * builds a spanning tree of a Node in a Network (rather inneficient)
 * @param  {Network} network
 * @param  {Node} node0 parent of tree
 * @param  {Node} nodeLimit optional node in the network to prune the tree
 * @return {Tree}
 * tags:
 */
NetworkOperators.spanningTree = function(network, node0, nodeLimit){//TODO: this method is horribly inneficient // add: level limt
	var tree = new Tree();
	var parent = new Node(node0.id, node0.name);
	parent.node = node0;
	tree.addNodeToTree(parent);
	
	var nodes = node0.nodeList;
	var newNodes;
	var newNode;
	var nodeInPrevNodes;
	var i;
	var id;
	
	var limitReached = false;
	
	for(i=0;nodes[i]!=null;i++){
		newNode = new Node(nodes[i].id, nodes[i].name);
		if(newNode.id==parent.id) continue;
		newNode.node = nodes[i];
		tree.addNodeToTree(newNode, parent);
		if(nodeLimit!=null && newNode.id==nodeLimit.id) limitReached = true;
	}
	
	if(limitReached) return tree;
	
	var accumulated = nodes.clone();
	accumulated.addNode(node0);
	
	while(true){
		newNodes = new NodeList();//nodes.clone();
		for(i=0;nodes[i]!=null;i++){
			newNodes.addNodes(nodes[i].nodeList);//TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
		}
		newNodes = newNodes.getWithoutRepetitions();
		newNodes.removeElements(accumulated);
		if(newNodes.length==0) return tree;
		
		for(i=0;newNodes[i]!=null;i++){
			newNode = new Node(newNodes[i].id, newNodes[i].name);
			newNode.node = newNodes[i];
			for(j=0; newNodes[i].nodeList[j]!=null; j++){
				id = newNodes[i].nodeList[j].id;
				nodeInPrevNodes = nodes.getNodeById(id);
				if(nodeInPrevNodes!=null && newNode.id!=id){
					tree.addNodeToTree(newNode, tree.nodeList.getNodeById(id));
					break;
				}
			}
			if(nodeLimit!=null && newNode.id==nodeLimit.id) limitReached = true;
		}
		
		if(limitReached) limitReached = true;
		
		nodes = newNodes;
		accumulated = accumulated.concat(newNodes);
	}
	
	return tree;
}

NetworkOperators.degreesPartition = function(network, node){//TODO:optionally add a NodeList of not connected Nodes
	var list0 = new NodeList(node);
	var nextLevel =  nodes = node.nodeList;
	var nextNodes;
	var externalLayer;
	var i;
	var j;
	var nodesTable = new Table(list0);
	var added = nextLevel.length>0;
	
	if(added) nodesTable.push(nextLevel);
	
	var listAccumulated = nextLevel.clone();
	listAccumulated.push(node);
	
	while(added){
		externalLayer = new NodeList();
		for(i=0; nextLevel[i]!=null; i++){
			nextNodes = nextLevel[i].nodeList;
			for(j=0; nextNodes[j]!=null; j++){
				if(listAccumulated.indexOf(nextNodes[j])==-1){//fix this
					externalLayer.push(nextNodes[j]);
					listAccumulated.push(nextNodes[j]);
				}
			}
		}
		added = externalLayer.length>0;
		if(added){
			nextLevel = externalLayer;
			nodesTable.push(nextLevel);
		}
	}
	
	return nodesTable;
}

NetworkOperators.degreesFromNodeToNodes = function(network, node, nodeList){//TODO: probably very unefficient
	var table = NetworkOperators.degreesPartition(network, node);
	var degrees = new NumberList();
	degrees.max = 0;
	var j;
	for(var i=0; nodeList[i]!=null; i++){
		if(nodeList[i]==node){
			degrees[i]=0;
		} else {
			for(j=1; table[j]!=null;j++){
				if(table[j].indexOf(nodeList[i])!=-1){//use getNodeById
					degrees[i]=j;
					degrees.max = Math.max(degrees.max, j);
					break;
				}
			}
		}
		if(degrees[i]==null) degrees[i]=-1;
	}
	return degrees;
}

/**
 * builds a dendrogram from a network
 * @param  {Network} network
 * @return {Tree}
 * tags:analysis
 */
NetworkOperators.buildDendrogram = function(network){
	if(network==null) return null;

	var t = new Date().getTime();


	var tree = new Tree();
	
	var nodeList = new NodeList();
	
	var closest;
	var node0;
	var node1;
	var newNode;
	var relations;
	var id;
	var i;
	var nNodes = network.nodeList.length;
	
	var pRelationPair = 2*network.relationList.length/(nNodes*(nNodes-1));
	
	for(i=0; network.nodeList[i]!=null; i++){
		newNode = new Node("["+network.nodeList[i].id+"]", "["+network.nodeList[i].id+"]");
		newNode.nodes = new NodeList(network.nodeList[i]);
		tree.addNode(newNode);
		nodeList[i] = newNode;
	}
	
	
	while(nodeList.length>1){
		closest = NetworkOperators._getClosestPair(nodeList, true, pRelationPair);
		
		node0 = nodeList[closest[0]];
		node1 = nodeList[closest[1]];
		
		id = "["+node0.id+"-"+node1.id+"]";
		
		newNode = new Node(id, id);
		newNode.weight = closest.strength;
		
		tree.addNode(newNode);
		tree.createRelation(newNode, node0, id+"-"+node0.id);
		tree.createRelation(newNode, node1, id+"-"+node1.id);
		
		newNode.node = new Node(id, id);
		newNode.nodes = node0.nodes.concat(node1.nodes);
		
		for(i=0; node0.nodeList[i]!=null; i++){
			newNode.node.nodeList.push(node0.nodeList[i]);
			newNode.node.relationList.push(node0.relationList[i]);
		}
		for(i=0; node1.nodeList[i]!=null; i++){
			newNode.node.nodeList.push(node0.nodeList[i]);
			newNode.node.relationList.push(node0.relationList[i]);
		}
		
		//nodeList.removeElements(new NodeList(node0, node1));
		nodeList.removeElement(node0);
		nodeList.removeElement(node1);
		nodeList.push(newNode);
	}
	
	
	//recalculate levels for nodes here
	for(i=0; tree.nodeList[i]!=null; i++){
		node0 = tree.nodeList[i];
		//c.log(i, )
		if(node0.nodes.length>1){
			node0.level = Math.max(node0.nodeList[0].level, node0.nodeList[1].level)+1;
		}
	}

	//c.log('\n\n\n\nTIME ------>'+ ((new Date().getTime())-t)+"\n\n\n\n");
	
	return tree;
}
NetworkOperators._getClosestPair = function(nodeList, returnIndexes, pRelationPair){
	if(nodeList.length==2){
		var index = nodeList[0].nodeList.indexOf(nodeList[1]);
		//var index = nodeList[0].nodeList.indexOfElement(nodeList[1]);
		
		if(returnIndexes){
			var indexes = [0,1];
			indexes.strength = index==-1?0:nodeList[0].relationList[index].weight;
			return indexes;
		} 
		var nodes = new NodeList(nodeList[0], nodeList[1]);
		nodes.strength = index==-1?0:nodeList[0].relationList[index].weight;
		return nodes;
	}
	
	var i;
	var j;
	
	var nodeList0;
	
	var strength;
	var maxStrength = -1;
	
	var indexesOtherNode;
	var indexes;
	
	for(i=0; nodeList[i+1]!=null; i++){
		nodeList0 = nodeList[i].nodes;
		for(j=i+1; nodeList[j]!=null; j++){
			strength = NetworkOperators._strengthBetweenSets(nodeList0, nodeList[j].nodes, pRelationPair);
			//c.log('        i,j,strength, nodeList0.length, nodeList[j].nodes.length', i, j, strength, nodeList0.length, nodeList[j].nodes.length);
			if(strength>maxStrength){
				indexes = [i, j];
				maxStrength = strength;
				//c.log('    ---> i, j, new maxStrength', i, j, maxStrength);
			}
		}
	}
	indexes.strength = maxStrength;
	if(returnIndexes) return indexes;
	var nodes = new NodeList(nodeList[indexes[0]], nodeList[indexes[1]]);
	nodes.strength = maxStrength;
	return nodes;
	
}
NetworkOperators._strengthBetweenSets = function(nodeList0, nodeList1, pRelationPair){
	var strength = 0;
	var i, j;
	var node0;
	
	for(i=0; nodeList0[i]!=null; i++){
		node0 = nodeList0[i];
		for(j=0; node0.nodeList[j]!=null; j++){
			if(nodeList1.indexOf(node0.nodeList[j])!=-1){
			//if(nodeList1.containsElement(node0.nodeList[j])){
				strength+=node0.relationList[j].weight;
			}
		}
	}
	
	return strength/(nodeList0.length*nodeList1.length*pRelationPair);
}



/**
 * builds a Table of clusters, based on an dendrogram Tree (if not provided it will be calculated), and a weight bias
 * @param  {Network} network
 * 
 * @param  {Tree} dendrogramTree dendrogram Tree, if precalculated, changes in weight bias will perform faster
 * @param  {Number} minWeight weight bias, criteria to group clusters (0.5 default)
 * @return {Table} list of nodeLists
 * tags:analysis
 */
NetworkOperators.buildNetworkClusters = function(network, dendrogramTree, minWeight){
	if(network==null) return;

	if(dendrogramTree==null) dendrogramTree = NetworkOperators.buildDendrogram(network);
	minWeight = minWeight||0.5;

	var clusters = new Table();
		
	NetworkOperators._iterativeBuildClusters(dendrogramTree.nodeList[dendrogramTree.nodeList.length-1], clusters, minWeight);

	return clusters;
}

NetworkOperators._iterativeBuildClusters = function (node, clusters, minWeight){
	if(node.nodeList.length==1) {clusters.push(new NodeList(node.node)); return};
	
	if(node.nodeList[0].nodes.length==1 || node.nodeList[0].weight>minWeight){
		clusters.push(node.nodeList[0].nodes);
	} else {
		NetworkOperators._iterativeBuildClusters(node.nodeList[0], clusters, minWeight);
	}
	
	if(node.nodeList[1].nodes.length==1 || node.nodeList[1].weight>minWeight){
		clusters.push(node.nodeList[1].nodes);
	} else {
		NetworkOperators._iterativeBuildClusters(node.nodeList[1], clusters, minWeight);
	}		
}




/**
 * see http://en.wikipedia.org/wiki/Page_rank, fromPageRank or toPageRank will be added as propertie to nodesç I use two different pageranks, since a Network whose relations measure influence would require a pagerank to measure nodes influence into the system
 * @param {Network} network
 * @param {Boolean} from optional, default:true, to set if the pagerank uses the in-relations or out-relations
 * @param {Boolean} from optional, default:false, to set if relations weight will affect the metric balance, partiularly interesting if some weights are negative
 * tags:analytics,transformative
 */
NetworkOperators.addPageRankToNodes = function(network, from, useRelationsWeight){//TODO:deploy useRelationsWeight
	from = from==null?true:from;
	
	var n;
	var i;
	var j;
	var d = 0.85; //dumping factor;
	var N = network.nodeList.length;
	var base = (1-d)/N;
	var propName = from?"fromPageRank":"toPageRank";
	var node;
	var otherNode;
	var nodeList;

	network.minFromPageRank = network.minToPageRank = 99999999;
	network.maxFromPageRank = network.maxToPageRank = -99999999;

	
	for(i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];
		node[propName] = 1/N;
	}
	
	for(n=0; n<300; n++){
		for(i=0; network.nodeList[i]!=null; i++){
			node = network.nodeList[i];
			
			nodeList = from?node.fromNodeList:node.toNodeList;
			node[propName] = base;
			
			for(j=0; nodeList[j]!=null; j++){
				otherNode = nodeList[j];
				node[propName]+=d*otherNode[propName]/(from?otherNode.toNodeList.length:otherNode.fromNodeList.length);
			}

			if(n==299){
				if(from){
					network.minFromPageRank = Math.min(network.minFromPageRank, node[propName]);
					network.maxFromPageRank = Math.max(network.maxFromPageRank, node[propName]);
				} else{
					network.minToPageRank = Math.min(network.minToPageRank, node[propName]);
					network.maxToPageRank = Math.max(network.maxToPageRank, node[propName]);
				}
			}
		}
	}
}






