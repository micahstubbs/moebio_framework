function NetworkGenerators(){};


/**
 * builds a random network, several options
 * @param  {Number} nNodes number of nodes
 * @param  {Number} pRelation probability of a relation being created between 2 nodes
 * 
 * @param  {Number} mode 0:simple random 1:clusterized
 * @param  {Boolean} randomRelationsWeights adds a random weigth to relations
 * @return {Network}
 * tags:generator
 */
NetworkGenerators.createRandomNetwork = function(nNodes, pRelation, mode, randomRelationsWeights){
	if(nNodes==null || pRelation==null) return null;
	
	mode = mode==null?0:mode;
	
	var i, j;
	var network = new Network();
	var node;
	
	for(i=0; i<nNodes; i++){
		network.addNode(new Node("n"+i, "n"+i));
	}
	
	switch(mode){
		case 0:
			for(i=0; i<nNodes-1; i++){
				node = network.nodeList[i];
				for(j=i+1; j<nNodes; j++){
					if(Math.random()<pRelation) network.addRelation(new Relation(i+"_"+j, i+"_"+j, node, network.nodeList[j], randomRelationsWeights?Math.random():1));
				}
			}
			return network;
		case 1:
			var nPairs = nNodes*(nNodes-1)*0.5;
			var pending;
			var maxDegree = 0;
			var otherNode;
			var id;
			for(i=0; i<nPairs; i++){
				if(Math.random()<pRelation){
					pending = true;
					while(pending){
						node = network.nodeList[Math.floor(network.nodeList.length*Math.random())];
						if(Math.random()<(node.nodeList.length+1)/(maxDegree+1)){
							while(pending){
								otherNode = network.nodeList[Math.floor(network.nodeList.length*Math.random())];
								id = node.id+"_"+otherNode.id;
								if(network.relationList.getNodeById(id)!=null || network.relationList.getNodeById(otherNode.id+"_"+node.id)!=null) continue;
								if(Math.random()<(otherNode.nodeList.length+1)/(maxDegree+1)){
									network.addRelation(new Relation(id, id, node, otherNode, randomRelationsWeights?Math.random():1));
									pending = false;
								}
							}
						}
					}
				}
			}
			return network;
	}
	
}

/**
 * weightsForRelationsMethod 0:dotProduct (more efficient) 1:cosinus similarity
 * http://en.wikipedia.org/wiki/Cosine_similarity
 */
NetworkGenerators.createTextsCoOccurrencesNetwork = function(strings, texts, weightsForRelationsMethod, minimum){
	var occurrencesTable = StringListOperators.countStringsOccurrencesOnTexts(strings, texts, weightsForRelationsMethod, minimum);
	return NetworkGenerators.createNetworkFromOccurrencesTable(occurrencesTable);
}

NetworkGenerators.createNetworkFromOccurrencesTable = function(occurrencesTable, weightsForRelationsMethod, minimum){
	weightsForRelationsMethod= weightsForRelationsMethod==null?0:weightsForRelationsMethod;
	minimum= minimum==null?0:minimum;
	
	var network = new Network();
	var i;
	var j;
	var string0;
	var string1;
	var weight;
	var node0;
	var node1;
	var norm0;
	var norm1;
	for(i=0;occurrencesTable[i]!=null;i++){
		string0=occurrencesTable[i].name;
		if(i==0){
			node0 = new Node(string0, string0);
			network.addNode(node0);
		} else {
			node0 = network.nodeList[i];
		}
		norm0 = occurrencesTable[i].getSum();
		node0.weight = norm0;
		for(j=i+1;occurrencesTable[j]!=null;j++){
			string1=occurrencesTable[j].name;
			if(i==0){
				node1 = new Node(string1, string1);
				network.addNode(node1);
			} else {
				node1 = network.nodeList[j];
			}
			norm1 = occurrencesTable[j].getSum();
			node1.weight = norm1;
			
			switch(weightsForRelationsMethod){
				case 0:
					weight = occurrencesTable[i].dotProduct(occurrencesTable[j]);
					break;
				case 1:
					weight = NumberListOperators.cosinus(occurrencesTable[i], occurrencesTable[j]);
					break;
			}
			
			if(weight>minimum){
				network.createRelation(node0, node1, string0+"_"+string1, weight);
			}
		}
	}
	
	return network;
}

/**
 * Creates a network using a list and measuring the relation weight with a given method
 * a Relation is created between two nodes if and only if the returned weight is > 0
 * @param {List} list List of objects that define the nodes 
 * @param {Function} weightFunction method used to eval each pair of nodes
 * @param {StringList} names optional, names of Nodes
 * @return {Network} a network with number of nodes equal to the length of the List
 */
NetworkGenerators.createNetworkFromListAndFunction = function(list, weightFunction, names){
	var i;
	var j;
	var w;
	var node;
	var network = new Network();
	
	for(var i=0; list[i+1]!=null; i++){
		if(i==0) network.addNode(new Node("n_0", names==null?"n_0":names[i]));
		node = network.nodeList[i];
		for(var j=i+1; list[j]!=null; j++){
			if(i==0) network.addNode(new Node("n_"+j, names==null?"n_"+j:names[j]));
			w = weightFunction(list[i], list[j]);
			if(w>0){
				network.addRelation(new Relation(i+"_"+j, i+"_"+j, node, network.nodeList[j], w));
			}
		}
	}
	
	return network;
}


/**
 * builds a network from a text, using previously detected words or noun phrases, and with relations built from co-occurrences in sentences
 * relations contain as description the part of the sentence that ends with the second node name (thus being compatible with NoteWork)
 * @param  {String} text
 * @param  {StringList} nounPhrases words, n-grams or noun phrases
 * @return {Network}
 * tags:
 */
NetworkGenerators.createNetworkFromTextAndWords = function(text, nounPhrases){
	if(text==null || nounPhrases==null) return null;

	var network = new Network();

	nounPhrases = nounPhrases.getWithoutRepetitions();

	var sentences = text.split(/\.|\n/g);
	var np, np1; 
	var sentence;
	var node, relation;
	var index, index2;
	var node0, node1;
	//var relationSentence;
	var regex;
	var id;

	nounPhrases.forEach(function(np){
		node = new Node(np, np);
		network.addNode(node);
	});

	sentences.forEach(function(sentence){
		nounPhrases.forEach(function(np){
			node0 = network.nodeList.getNodeById(np);
			regex = NetworkEncodings._regexWordForNoteWork(np);
			index = sentence.search(regex);
			if(index!=-1){
				nounPhrases.forEach(function(np1){
					regex = NetworkEncodings._regexWordForNoteWork(np1);
					index2 = sentence.search(regex);
					if(index2!=-1){
						node1 = network.nodeList.getNodeById(np1);

						relation = network.relationList.getFirstRelationBetweenNodes(node0, node1, true);
						if(relation==null){
							id = node0.id+"_"+node1.id+"|"+sentence;
							relation = new Relation(id, id, node0, node1);
							relation.content = sentence;//.substr(0, index3+1).trim();
							relation.paragraphs = new StringList(relation.content);
							network.addRelation(relation);
						} else {
							relation.paragraphs.push(sentence);
						}
					}
				});
				
				

				// sentenceRight = sentence.substr(index+np.length+2);

				// nounPhrases.forEach(function(np1){
				// 	regex = NetworkEncodings._regexWordForNoteWork(np1);
				// 	index2 = sentenceRight.search(regex);

				// 	if(index2!=-1){
				// 		index3 = sentence.search(regex);
				// 		node1 = network.nodeList.getNodeById(np1);
				// 		relationSentence = sentence.substr(0, index3+np1.length+2).trim();
				// 		relation = new Relation(relationSentence, relationSentence, node0, node1);
				// 		relation.content = sentence.substr(0, index3+1).trim();
				// 		network.addRelation(relation);
				// 	}
				// });
			}
		});
	});

	return network;
}

//replaced by: NetworkConvertions.TableToNetwork
// NetworkGenerators.createNetworkFromPairsTable = function(pairsTable, minPairOccurrences){//TODO: test it (never used)
// 	var pairsStringList = pairsTable[0].toStringList().append("#").append(pairsTable[1].toStringList());
// 	var occurrences = pairsStringList.countOccurrences();
// 	var node0;
// 	var node1;
// 	var network = new Network();
	
// 	for(var i=0; pairsTable[0][i]!=null; i++){
// 		if(occurrences[i]>minPairOccurrences){
// 			node0 = network.nodeList.getNodeById(pairsTable[0][i]);
// 			if(node0==null){
// 				node0 = new Node(pairsTable[0][i], pairsTable[0][i]);
// 				network.addNode(node0);
// 			}
// 			node1 = network.nodeList.getNodeById(pairsTable[1][i]);
// 			if(node1==null){
// 				node1 = new Node(pairsTable[1][i], pairsTable[1][i]);
// 				network.addNode(node1);
// 			}
// 			network.addRelation(new Relation(node0.id+"_"+node1.id, node0.id+"_"+node1.id, node0, node1, occurrences[i]));
// 		}
// 	}
// 	return network;
// }