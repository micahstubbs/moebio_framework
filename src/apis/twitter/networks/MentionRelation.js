MentionRelation.prototype = new Relation();
MentionRelation.prototype.constructor = MentionRelation;

/**
 * MentionRelation 
 * @constructor
 */
function MentionRelation(nodeUser0, nodeUser1, nTweet, tweet) {
  var id = "m_" + nodeUser0.id + "_" + nodeUser1.id + "_" + nTweet;
  Relation.apply(this, [id, id, nodeUser0, nodeUser1, 1, true]);

  this.nTweet = nTweet;
  this.isRT = false;
  this.tweet = tweet;
}