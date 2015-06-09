RTRelation.prototype = new Relation();
RTRelation.prototype.constructor = RTRelation;

/**
 * RTRelation 
 * @constructor
 */
function RTRelation(nodeUser0, nodeUser1, nUser0, nUser1, nTweet0, nTweet1) {
  var id = "r_" + nodeUser0.id + "-" + nodeUser1.id + "-" + nTweet0 + "-" + nTweet1;
  Relation.apply(this, [id, id, nodeUser0, nodeUser1, 1, true]);

  this.nUser0 = nUser0;
  this.nUser1 = nUser1;
  this.nTweet0 = nTweet0;
  this.nTweet1 = nTweet1;
}