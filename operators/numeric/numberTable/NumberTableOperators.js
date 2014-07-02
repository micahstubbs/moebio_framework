function NumberTableOperators(){};

/**
 * normlizes each NumberList to min and max values
 * @param  {NumberTable} numberTable
 * @return {NumberTable}
 * tags:math
 */
NumberTableOperators.normalizeLists=function(numberTable){
	return numberTable.getNumberListsNormalized();
}

NumberTableOperators.normalizeListsToMax=function(numberTable){
	var newNumberTable = new NumberTable();
	newNumberTable.name = numberTable.name;
	var i;
	for(i=0;numberTable[i]!=null;i++){
		newNumberTable[i] = numberTable[i].getNormalizedToMax();
	}
	return newNumberTable;
}

/**
 * smooth numberLists by calculating averages with neighbors
 * @param  {NumberTable} numberTable
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {NumberTable}
 * tags:statistics
 */
NumberTableOperators.averageSmootherOnLists = function(numberTable, intensity, nIterations){
	var newNumberTable = new NumberTable();
	newNumberTable.name = numberTable.name;
	numberTable.forEach(function(nL, i){
		newNumberTable[i] = NumberListOperators.averageSmoother(numberTable[i], intensity, nIterations);
	});
	return newNumberTable;
}

//TODO: move to NumberTableConversions
NumberTableOperators.numberTableToNetwork=function(numberTable, method, tolerance){
	tolerance = tolerance==null?0:tolerance;
	
	var network = new Network();
	
	var list0;
	var list1;
	
	var i;
	var j;
	
	var node0;
	var node1;
	var relation;
	
	
	switch(method){
		case 0: // standard deviation
			
			var sd;
			var w;
			
			for(i=0; numberTable[i+1]!=null; i++){
				list0 = numberTable[i];
				
				if(i==0){
					node0 = new Node(list0.name, list0.name);
					network.addNode(node0);
				} else {
					node0 = network.nodeList[i];
				}
				
				
				for(j=i+1; numberTable[j]!=null; j++){
					list1 = numberTable[j];
					
					if(i==0){
						node1 = new Node(list1.name, list1.name);
						network.addNode(node1);
					} else {
						node1 = network.nodeList[j];
					}
					
					
					
					list1 = numberTable[j];
					sd = NumberListOperators.standardDeviationBetweenTwoNumberLists(list0, list1);
					
					w = 1/(1+sd);
					
					if(w>=tolerance){
						relation = new Relation(i+"_"+j, node0.name+"_"+node1.name, node0, node1, w);
						network.addRelation(relation);
					}
				}
			}
		
			break;
		case 1:
			break;
		case 2:
			break;
	}
	
	return network;
}