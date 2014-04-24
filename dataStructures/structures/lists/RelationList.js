RelationList.prototype = new NodeList();
RelationList.prototype.constructor=RelationList;
/**
* RelationList
* @constructor
*/

function RelationList () {
	var array=NodeList.apply(this, arguments);
	//
	array.name="";
   	//assign methods to array:
   	array=RelationList.fromArray(array);
   	//
   	return array;
}

RelationList.fromArray=function(array){
	var result=NodeList.fromArray(array);
	result.type="RelationList";
   	//assign methods to array:
   	result.addRelation=RelationList.prototype.addRelation;
   	result.addRelationIfNew=RelationList.prototype.addRelationIfNew;
   	result.removeRelation=RelationList.prototype.removeRelation;
   	result.getRelationsWithNode=RelationList.prototype.getRelationsWithNode;
   	result.getFirstRelationBetweenNodes=RelationList.prototype.getFirstRelationBetweenNodes;
   	result.getFirstRelationByIds=RelationList.prototype.getFirstRelationByIds;
	result.getAllRelationsBetweenNodes=RelationList.prototype.getAllRelationsBetweenNodes;
	result.getRelatedNodesToNode=RelationList.prototype.getRelatedNodesToNode;
	result.nodesAreConnected=RelationList.prototype.nodesAreConnected;
	
	return result;
}

//TODO:remove?
RelationList.prototype.addRelation=function(relation){
	this.addNode(relation);
}

RelationList.prototype.removeRelation=function(relation){
  this.removeNode(relation);
}
/**
* get all relations that contain a given node
* @param {Node} node 
* @return a RelationList with relations that contain node
*/
RelationList.prototype.getRelationsWithNode=function(node){
  var i;
  var filteredRelations=new Array();
  for(i=0; this[i]!=null; i++){
    var relation=this[i];
    if(relation.node0==node || relation.node1==node){
      filteredRelations.push(relation);
    }
  }
  return filteredRelations;
}

/**
* get all Nodes related to a given Node
* @param {Node} node 
* @return a RelationList with relations that contain node
*/
RelationList.prototype.getRelatedNodesToNode=function(node){
  var i;
  var relatedNodes=new NodeList();
  for(i=0; i<this.length; i++){
    var relation=this[i];
    if(relation.node0.id==node.id){
      relatedNodes.push(relation.node1);
    }
    if(relation.node1.id==node.id){
      relatedNodes.push(relation.node0);
    }
  }
  return relatedNodes;
}



/**
* get all relations between two Nodes
* @param {Node} node0 
* @param {Node} node1
* @param {Boolean} directed consider relation direction (default: false)
* @return a RelationList with relations that contain node0 and node1
*/
RelationList.prototype.getAllRelationsBetweenNodes=function(node0, node1, directed){ //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
  var i;
  directed=directed==null?false:directed;
  var filteredRelations=new Array();
  for(i=0; this[i]!=null; i++){
	var relation=this[i];
	if((relation.node0==node0 && relation.node1==node1) || (!directed && relation.node0==node1 && relation.node1==node0) ){
		filteredRelations.push(relation);
    }
  }
  return filteredRelations;
}


/**
* get first Relation between two Nodes
* @param {Node} node0 
* @param {Node} node1
* @param {Boolean} directed consider relation direction (default: false)
* @return a RelationList with relations that contain node0 and node1
*/
RelationList.prototype.getFirstRelationBetweenNodes=function(node0, node1, directed){ //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected) //TODO: make it work with ids
	directed=directed==null?false:directed;
	
	for(var i=0; this[i]!=null; i++){
		if((this[i].node0.id==node0.id && this[i].node1.id==node1.id) || (!directed && this[i].node1.id==node0.id && this[i].node0.id==node1.id) ) return this[i];
	}
	return null;
}

/**
* get first relations between two Nodes
* @param {String} id0 
* @param {String} id1
* @param {Boolean} directed consider relation direction (default: false)
* @return a RelationList with relations that contain node0 and node1 (with node0.id = id0 and node1.id = id1)
*/
RelationList.prototype.getFirstRelationByIds=function(id0, id1, directed){ //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected) //TODO: make it work with ids
	var i;
	var _directed=directed || false;
	var relation;
	for(i=0; this[i]!=null; i++){
		relation=this[i];
		if(relation.node0.id==id0 && relation.node1.id==id1){
			return relation;
		}
	}
	if(_directed) return null;
	//c.log("<->");
	for(i=0; this[i]!=null; i++){
		relation=this[i];
		if(relation.node0.id==id1 && relation.node1.id==id0){
			//c.log("<--- ", relation.node0.name, relation.node1.name);
			return relation;
		}
	}
	return null;
}


RelationList.prototype.nodesAreConnected=function(node0, node1, directed){
	if(node0.toNodeList.getNodeById(node1.id)!=null) return true;
	if(!directed && node0.fromNodeList.getNodeById(node1.id)!=null) return true;
	return false;
}

