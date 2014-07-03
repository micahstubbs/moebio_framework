Tree.prototype = new Network();
Tree.prototype.constructor=Tree;

/**
* Tree 
* @constructor
*/
function Tree(){
	Network.apply(this);
	this.type="Tree";
	
	this.nLevels=0;
	//this._createRelation = this.createRelation;
	//this.createRelation = this._newCreateRelation;
}
//
Tree.prototype.addNodeToTree=function(node, parent){
	this.addNode(node);
	if(parent==null){
		node.level = 0;
		node.parent = null;
	} else {
		var relation = new Relation(parent.id+"_"+node.id, parent.id+"_"+node.id, parent, node);
		this.addRelation(relation);
		//this._createRelation(parent, node);
		node.level = parent.level+1;
		node.parent = parent;
	}
	this.nLevels = Math.max(this.nLevels, node.level+1);
}

// Network.prototype._newCreateRelation=function(parent, node, id, weight){
// 	this._createRelation(parent, node, id, weight);
// 	node.level = parent.level+1;
// 	node.parent = parent;
// 	this.nLevels = Math.max(this.nLevels, node.level+1);
// }

// Tree.prototype.addFather=function(node, children){
// 	if(child.parent!=null || this.nodeList.indexOf(child)==-1) return false;
// 	this.addNode(node);
// 	child.parent = node;
// 	child.level = 1;
// 	this.nLevels = Math.max(this.nLevels, 1);
// 	this.createRelation(node, child);
// }

Tree.prototype.getNodesByLevel=function(level){
	var newNodeList = new NodeList();
	for(i=0; this.nodeList[i]!=null; i++){
		if(this.nodeList[i].level==level) newNodeList.push(this.nodeList[i]);
	}
	return newNodeList;
}

/**
 * return the leaves (nodes without children) of a tree
 * @return {NodeList}
 * tags:
 */
Tree.prototype.getLeaves=function(){
	var leaves = new NodeList();
	this.nodeList.forEach(function(node){
		if(node.toNodeList.length==0) leaves.push(node); 
	});
	return leaves;
}

Tree.prototype.assignDescentWeightsToNodes=function(){
	this._assignDescentWeightsToNode(this.nodeList[0]);
}
Tree.prototype._assignDescentWeightsToNode=function(node){
	var i;
	if(node.toNodeList.length==0){
		node.descentWeight=1;
		return 1;
	}
	for(i=0;node.toNodeList[i]!=null;i++){
		node.descentWeight+=this._assignDescentWeightsToNode(node.toNodeList[i]);
	}
	return node.descentWeight;
}

Tree.prototype.getReport=function(relation){
  return "Tree contains "+this.nodeList.length+" nodes and "+this.relationList.length+" relations";
}