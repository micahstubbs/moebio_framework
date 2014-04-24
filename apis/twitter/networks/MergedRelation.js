MergedRelation.prototype = new Relation();
MergedRelation.prototype.constructor=MergedRelation;

/**
* MergedRelation 
* @constructor
*/
function MergedRelation(nodeUser0, nodeUser1){
	var id = "m_"+nodeUser0.id+"_"+nodeUser1.id;
	Relation.apply(this, [id, id, nodeUser0, nodeUser1, 1, true]);
	
	this.weight = 1;
	this.toWeight = 1;
	this.fromWeight = 0;
	this.rtWeight = 0;
	
	this.tweets = new StringList();
	this.dates = new DateList();
	this.tweetsIds = new StringList();
}

MergedRelation.prototype.clone = function(newNetwork){
	var newNode0 = newNetwork.nodeList.getNodeById(this.node0.id);
	var newNode1 = newNetwork.nodeList.getNodeById(this.node1.id);
	if(newNode0==null || newNode1==null) return null;
	
	var relation = new MergedRelation(newNode0, newNode1);
	
	relation.weight = this.weight;
	relation.toWeight = this.toWeight;
	relation.fromWeight = this.fromWeight;
	relation.rtWeight = this.rtWeight;
	if(this.tweets!=null) relation.tweets = this.tweets.clone();
	
	return relation;
}
