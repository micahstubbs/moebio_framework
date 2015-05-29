TweetNode.prototype = new Node();
TweetNode.prototype.constructor = TweetNode;

/**
 * TweetNode 
 * @constructor
 */
function TweetNode(nTweetFromUser, userId) {
  var id = userId + "_" + nTweetFromUser;
  Node.apply(this, [id, id]);

  this.nTweetFromUser = nTweetFromUser;
  this.userId = userId;

  this.nThread = -1;
}