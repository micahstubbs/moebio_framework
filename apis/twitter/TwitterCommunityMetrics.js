function TwitterCommunityMetrics(){};

TwitterCommunityMetrics.calculteFriendship=function(centralNode, network){
	return TwitterCommunityMetrics._calculteMetric(centralNode, network, TwitterCommunityMetrics.friendshipFunction);
}
TwitterCommunityMetrics.friendshipFunction=function(centralNode, network, node, relation, max){
	if(relation==null){
		node['friendship'] = 0;
		return 0;
	}
	var directed = relation.node0==centralNode;
	var to = directed?relation.toWeight:relation.fromWeight;
	var from = directed?relation.fromWeight:relation.toWeight;
	var maxDistance = Math.sqrt(2*Math.pow(max, 2));
	var value;
	if(node==centralNode){
		value = 0;
	} else if(to==0 && from==0){
		value = 0;
	} else {
		value = (Math.min(to, from)/Math.max(to, from))*Math.sqrt(Math.pow(to, 2)+Math.pow(from, 2))/maxDistance;
	}
	node['friendship'] = value;
	return value;
}

TwitterCommunityMetrics.calculateHeroism=function(centralNode, network){
	return TwitterCommunityMetrics._calculteMetric(centralNode, network, TwitterCommunityMetrics.heroismFunction);
}
TwitterCommunityMetrics.heroismFunction=function(centralNode, network, node, relation, max){
	if(relation==null){
		node['heorism'] = 0;
		return 0;
	}
	var directed = relation.node0==centralNode;
	var to = directed?relation.toWeight:relation.fromWeight;
	var from = directed?relation.fromWeight:relation.toWeight;
	var value;
	if(node==centralNode){
		value = 0;
	} else if(to==0 && from==0){
		value = 0;
	} else {
		value = (to/(from+1))/max;
	}
	
	node['heroism'] = value;
	return value;
}


TwitterCommunityMetrics.calculateFanatism=function(centralNode, network){
	return TwitterCommunityMetrics._calculteMetric(centralNode, network, TwitterCommunityMetrics.fanatismFunction);
}
TwitterCommunityMetrics.fanatismFunction=function(centralNode, network, node, relation, max){
	if(relation==null){
		node['fanatismFunction'] = 0;
		return 0;
	}
	var directed = relation.node0==centralNode;
	var to = directed?relation.toWeight:relation.fromWeight;
	var from = directed?relation.fromWeight:relation.toWeight;
	var value;
	if(node==centralNode){
		value = 0;
	} else if(to==0 && from==0){
		value = 0;
	} else {
		value = (from/(to+1))/max;
	}
	node['fanatism'] = value;
	return value;
}

TwitterCommunityMetrics.calculateCommunityInput=function(centralNode, network){
	return TwitterCommunityMetrics._calculteMetric(centralNode, network, TwitterCommunityMetrics.CommunityInputFunction);
}
TwitterCommunityMetrics.CommunityInputFunction=function(centralNode, network, node, relation, max){
	var maxRelations = 0;
	var maxWeight = 0;
	for(var i=0; network.nodeList[i]!=null; i++){
		if(network.nodeList[i]!=null && network.nodeList[i]!=centralNode) maxRelations = Math.max(maxRelations, network.nodeList[i].relationList.length);
	}
	for(i=0; network.relationList[i]!=null; i++){
		maxWeight = Math.max(maxWeight, network.relationList[i].weight);
	}
	
	var value;
	
	if(centralNode==null){
		value = 0;
		var other;
		for(i=0; node.relationList[i]!=null; i++){
			other = node.relationList[i].getOther(node);
			if(other.relationList.length>0){
				value += node.relationList[i].weight/maxWeight;
			}
		}
		value/=maxRelations;
	} else {
		var nRelations = node.relationList.length/maxRelations;
		value = TwitterCommunityMetrics.friendshipFunction(centralNode, network, node, relation, max)*((relation==null?0:relation.weight)/maxWeight)*nRelations;
	}
	
	node['communityInput'] = value;
	return value;
}



TwitterCommunityMetrics._calculteMetric=function(centralNode, network, metricFunction){
	var metricValues = new NumberList();
	var node;
	var relation;
	
	var max = TwitterCommunityMetrics.getMaxToFrom(centralNode, network);
	
	for(var i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];
		relation = centralNode==null?null:network.relationList.getFirstRelationBetweenNodes(centralNode, node);
		metricValues[i] = metricFunction(centralNode, network, node, relation, max);
	}
	return metricValues;
}


TwitterCommunityMetrics.getMaxToFrom=function(centralNode, network){
	if(centralNode==null) return 0;
	
	var max = 0;
	var relation;
	
	for(var i=0; network.relationList[i]!=null; i++){
		relation = network.relationList[i];
		if((relation.node0!=centralNode && relation.node1!=centralNode) || (relation.node0==relation.node1)) continue;
		max = Math.max(max, relation.toWeight, relation.fromWeight);
	}
	
	return max;
}

TwitterCommunityMetrics.getCommunityMembers=function(network, centralNodeName, max){
	var centralNode = centralNodeName==null?null:network.nodeList.getNodeByName(centralNodeName);
	
	max=max||8;
	var interval = new Interval(0, max);
	
	var communityInput = TwitterCommunityMetrics.calculateCommunityInput(centralNode, network);
	
	//c.log('TwitterCommunityMetrics.getCommunityMembers | communityInput:', communityInput);
	
	var communityMembers = network.nodeList.getSortedByProperty('communityInput').getSubList(interval);
	
	communityInput = communityInput.sortNumeric(true).getSubList(interval).getNormalizedToMax();
	
	// c.log('communityMembers.length', communityMembers.length);
	// for(var i=0; communityMembers[i]!=null; i++){
		// c.log(communityMembers[i].name);
		// c.log('     communityInput:',  communityMembers[i].communityInput, communityInput[i]);
	// }
	
	var communityInputNorm = communityInput.getNormalizedToSum();
	var communityMembersNames = new StringList();
	
	var node;
	
	for(i=0; communityMembers[i]!=null; i++){
		node = communityMembers[i];
		if(node.communityInput>0){
			communityMembersNames.push(node.name);
		}
	}
	return communityMembersNames;
}