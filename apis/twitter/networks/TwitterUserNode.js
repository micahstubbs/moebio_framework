TwitterUserNode.prototype = new Node();
TwitterUserNode.prototype.constructor = TwitterUserNode;

/**
 * UserNode 
 * @constructor
 */

function TwitterUserNode(name, completeName, id, i, thumbnailUrl, tweets, dates, tweetsIds) {
  Node.apply(this, [id, name]);
  this.type = 'TwitterUserNode';

  this.completeName = completeName;
  this.i = i;
  this.thumbnailUrl = thumbnailUrl;

  this.tweets = tweets == null ? new StringList() : tweets;
  this.dates = dates == null ? new DateList() : dates;
  this.tweetsIds = tweetsIds == null ? new StringList() : tweetsIds;

  this._alreadyLoadingOrLoaded = false;

  this._clone = this.clone;


  this.image;
}

TwitterUserNode.prototype.getLastTweet = function() {
  return this.tweets[this.tweets.length - 1];
};
TwitterUserNode.prototype.getLastDate = function() {
  return this.dates[this.dates.length - 1];
};


TwitterUserNode.prototype.loadThumbnail = function() {

  if(!this._alreadyLoadingOrLoaded) Loader.loadImage(this.thumbnailUrl, this.onImageLoaded, this);
  this._alreadyLoadingOrLoaded = true;
};
TwitterUserNode.prototype.onImageLoaded = function(e) {
  this.image = e.result;
};

TwitterUserNode.prototype.clone = function() {
  var node = new TwitterUserNode(this.name, this.completeName, this.id, this.i, this.tweets, this.dates);

  node.x = this.x;
  node.y = this.y;
  node.z = this.z;

  node.nodeType = this.nodeType;

  node.weight = this.weight;
  node.descentWeight = this.descentWeight;

  node.thumbnailUrl = this.thumbnailUrl;
  node.image = this.image;

  node.tweets = this.tweets.clone();
  node.dates = this.dates.clone();

  return node;
};