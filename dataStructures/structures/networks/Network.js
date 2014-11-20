Network.prototype = new DataModel();
Network.prototype.constructor=Network;


/**
* Network
* @constructor
*/
function Network () {
	this.type="Network";
	
	//this._newNodeID=0;
	//this._newRelationID=0;
	this.nodeList=new NodeList();
	this.relationList=new RelationList();
}

/**
 * get nodeList property
 * @return {NodeList}
 * tags:
 */
Network.prototype.getNodes=function(){
	return this.nodeList;
}

/**
 * get relationList property
 * @return {RelationList}
 * tags:
 */
Network.prototype.getRelations=function(){
	return this.relationList;
}

/**
 * get nodes ids property
 * @return {StringList}
 * tags:
 */
Network.prototype.getNodesIds=function(){
	return this.nodeList.getIds();
}



/**
 * building methods
 */

Network.prototype.addNode=function(node){
	this.nodeList.addNode(node);
}
Network.prototype.getNodeWithName=function(name){
	return this.nodeList.getNodeWithName(name);
}
Network.prototype.getNodeWithId=function(id){
	return this.nodeList.getNodeWithId(id);
}

Network.prototype.createRelation = function(node0, node1, id, weight, content){
	this.addRelation(new Relation(id, id, node0, node1, weight, content));
}

Network.prototype.addRelation=function(relation){
 	this.relationList.addNode(relation);
 	relation.node0.nodeList.addNode(relation.node1);
 	relation.node0.relationList.addNode(relation);
 	relation.node0.toNodeList.addNode(relation.node1);
 	relation.node0.toRelationList.addNode(relation);
 	relation.node1.nodeList.addNode(relation.node0);
 	relation.node1.relationList.addNode(relation);
 	relation.node1.fromNodeList.addNode(relation.node0);
 	relation.node1.fromRelationList.addNode(relation);
}

Network.prototype.connect=function(node0, node1, id, weight, content){
	id = id || (node0.id+"_"+node1.id);
	weight = weight || 1;
	var relation = new Relation(id, id, node0, node1, weight);
	this.addRelation(relation);
	relation.content = content;
	return relation;
}



/**
 * removing methods
 */

Network.prototype.removeNode=function(node){
	this.removeNodeRelations(node)
	this.nodeList.removeNode(node);
}

Network.prototype.removeNodeRelations=function(node){
	for(var i=0; node.relationList[i]!=null; i++){
		this.removeRelation(node.relationList[i]);
		i--;
	}
}

Network.prototype.removeNodes=function(){
  this.nodeList.deleteNodes();
  this.relationList.deleteNodes();
}
Network.prototype.removeRelation=function(relation){
	this.relationList.removeElement(relation);
	relation.node0.nodeList.removeNode(relation.node1);
	relation.node0.relationList.removeRelation(relation);
	relation.node0.toNodeList.removeNode(relation.node1);
	relation.node0.toRelationList.removeRelation(relation);
	relation.node1.nodeList.removeNode(relation.node0);
	relation.node1.relationList.removeRelation(relation);
	relation.node1.fromNodeList.removeNode(relation.node0);
	relation.node1.fromRelationList.removeRelation(relation);
}

Network.prototype.removeIsolatedNodes=function(minNumberRelations){
	var i;

	minNumberRelations = minNumberRelations==null?1:minNumberRelations;
	
	for(i=0; this.nodeList[i]!=null; i++){
		if(this.nodeList[i].relationList.length<minNumberRelations){
			this.removeNode(this.nodeList[i]);
			i--;
		}
	}
}




//depreacted: nNodeList is in charge of building its own new ids
// Network.prototype.getNewNodeID=function(){
// 	id=this._newNodeID;
// 	this._newNodeID++;
// 	return id;
// }
// Network.prototype.getNewRelationID=function(){
// 	id=this._newRelationID;
// 	this._newRelationID++;
// 	return id;
// }

Network.prototype.getReport=function(){
	return "network contains "+this.nodeList.length+" nodes and "+this.relationList.length+" relations";
}

Network.prototype.destroy=function(){
	delete this.type;
	//delete this._newNodeID;
	//delete this._newRelationID;
	this.nodeList.destroy();
	this.relationList.destroy();
	delete this.nodeList;
	delete this.relationList;
}