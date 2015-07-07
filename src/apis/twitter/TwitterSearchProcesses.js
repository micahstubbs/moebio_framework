function TwitterSearchProcesses() {}

TwitterSearchProcesses.MENTIONS_REGEXP = /@[a-zA-Z0-9_]+('|\?|:| |;|.|,|")?/gi;
TwitterSearchProcesses.RT_REGEXP = /\b(rt|RT|MT):? /gi;

/**
 * This will be the lasting method
 */
TwitterSearchProcesses.buildUsersNetwork = function(results, biDirectional) {
  biDirectional = biDirectional == null ? false : biDirectional;

  var network = new Network();
  var tweetObject;
  var node;
  var relation;
  var mentionsArray;
  var j;
  var k;

  //c.log('\n\n\nTwitterSearchProcesses.buildUsersNetwork | results', results);

  for(var i = 0; results[i] != null; i++) {
    tweetObject = results[i];
    node = network.nodeList.getNodeById(tweetObject.from_user_id_str);
    if(node == null) {
      node = new TwitterUserNode(tweetObject.from_user, tweetObject.from_user_name, tweetObject.from_user_id_str, i, tweetObject.profile_image_url);
      network.addNode(node);
      //c.log('      tweetObject.from_user_id_str', tweetObject.from_user_id_str)
    }


    node.tweets.push(tweetObject.text);
    node.tweetsIds.push(tweetObject.id);
    node.dates.push(new Date(DateOperators.parseDate(tweetObject.created_at)));

    //if(node.name=='moebio') c.log('  ----- tweet:', tweetObject.text);
  }

  c.log('network.nodeList.length', network.nodeList.length);


  var mentionedName;
  var otherNode;
  var relation;
  var isRT;

  for(i = 0; network.nodeList[i] != null; i++) {
    node = network.nodeList[i];
    if(node.name == 'moebio') c.log('\n-node: ', node.name);
    for(j = 0; node.tweets[j] != null; j++) {
      mentionsArray = node.tweets[j].match(TwitterSearchProcesses.MENTIONS_REGEXP);

      //if(node.name=='moebio') c.log('  ----- tweet:', node.tweets[j]);

      if(mentionsArray != null) {
        for(k = 0; mentionsArray[k] != null; k++) {
          mentionedName = mentionsArray[k].substr(1, mentionsArray[k].length - 2);
          otherNode = network.nodeList.getNodeByName(mentionedName);
          if(otherNode != null) {
            relation = network.relationList.getFirstRelationByIds(node.id, otherNode.id, biDirectional);
            if(relation == null) {
              relation = new MergedRelation(node, otherNode);
              network.addRelation(relation);
            } else {
              //if(node.name=='moebio' && otherNode.name=='DIY') c.log('        TwitterSearchProcesses.buildUsersNetwork | relation:', node.name, otherNode.name)
              if(relation.node0 == node) {
                relation.toWeight++;
              } else {
                relation.fromWeight++;
              }
              relation.weight++;
            }
            isRT = node.tweets[j].search(TwitterSearchProcesses.RT_REGEXP) == 0;
            if(isRT) relation.rtWeigth++;
            relation.tweets.push(node.tweets[j]);
            relation.dates.push(node.dates[j]);
            relation.tweetsIds.push(node.tweetsIds[j]);
            //if(node.name=='moebio' && otherNode.name=='DIY') c.log('        moebio-DIY / to, from, total:', relation.toWeight, relation.fromWeight, relation.weight);
          } else {
            //optionally: create a new node for mentioned but not tweeting user
          }
        }
      }
    }
  }

  //c.log('network', network);

  return network;
};

TwitterSearchProcesses.loadThumbnailsFromUsers = function(network) {
  for(var i = 0; network.nodeList[i] != null; i++) {
    network.nodeList[i].loadThumbnail();
  }
};



////////////// methods below will be deprecated


/**
 * from a search table builds a Table in which each row contains the info of each user
 * 0: user ids, 1: user name, 2: n repetitions, 3: indexes in search table, 4: thumbnail url, 5: date of first tweet, 6: date of last tweet, 7: tweets, 8: dates of tweets
 * 
 * @constructor
 */
TwitterSearchProcesses.buildAggregatedTable = function(table) {
  var users_ids = table[2];
  var dates = table[0];
  var images = table[5];
  var texts = table[7];
  var users_names = table[3];

  var repetitions = users_ids.getElementsRepetitionCount();// ListOperators.countElementsRepetitionOnList(users_ids);

  aggregatedTable = new Table();

  aggregatedTable[0] = repetitions[0];
  aggregatedTable[1] = new List();
  aggregatedTable[2] = repetitions[1];
  aggregatedTable[3] = new NumberList();
  aggregatedTable[4] = new List();
  aggregatedTable[5] = new List();
  aggregatedTable[6] = new List();
  aggregatedTable[7] = new List();
  aggregatedTable[8] = new List();
  aggregatedTable[9] = new List();

  var nUsers = aggregatedTable[0].length;

  var i;
  var indexes;
  for(i = 0; i < nUsers; i++) {
    //indexes = ListOperators.getIndexesOfElement(users_ids, aggregatedTable[0][i]);
    indexes = users_ids.indexesOf(aggregatedTable[0][i]);
    aggregatedTable[1][i] = users_names[indexes[0]];
    aggregatedTable[3][i] = indexes;
    aggregatedTable[4][i] = images[indexes[0]];
    aggregatedTable[5][i] = dates[indexes[indexes.length - 1]];
    aggregatedTable[6][i] = dates[indexes[0]];
    aggregatedTable[7][i] = texts.getSubListByIndexes(indexes);
    aggregatedTable[8][i] = dates.getSubListByIndexes(indexes);
  }

  return aggregatedTable;
};

TwitterSearchProcesses.buildMentionsNetwork = function(aggregatedTable) {
  var i;
  var j;
  var k;
  var tweets;
  var user_id;
  var user_name;
  var mentioned;
  var node;
  var index;
  var relation;
  var network = new Network();
  var lowerCaseUserNames = new List();

  var retweetRegex = /\b(rt|RT):? /gi;
  var isRT;

  nUsers = aggregatedTable[0].length;

  for(i = 0; i < nUsers; i++) {
    lowerCaseUserNames.push(aggregatedTable[1][i].toLowerCase());
  }

  for(i = 0; i < nUsers; i++) {
    user_name = aggregatedTable[1][i];
    user_id = aggregatedTable[0][i];
    //node = new Node(i, user_name);
    node = new Node(user_id, user_name);
    network.addNode(node);
  }

  for(i = 0; i < nUsers; i++) {
    user_id = aggregatedTable[0][i];
    user_name = aggregatedTable[1][i];
    tweets = aggregatedTable[7][i];
    for(j = 0; tweets[j] != null; j++) {
      mentioned = StringOperators.getAllTextsBetweenStrings(StringOperators.removePunctuation(tweets[j], " ").toLowerCase() + " ", "@", " ");
      if(mentioned != null) {
        isRT = tweets[j].search(retweetRegex) == 0;
        for(k = 0; mentioned[k] != null; k++) {
          index = lowerCaseUserNames.indexOf(mentioned[k]);
          if(index > -1) {
            relation = new MentionRelation(network.nodeList[i], network.nodeList[index], j, tweets[j]);
            //c.log("    ----> add mention relation:", relation.node0.name, relation.node1.name);
            network.addRelation(relation);
            if(isRT) relation.isRT = true;
          }
        }
      }
    }
  }
  return network;
};

TwitterSearchProcesses.buildRetweetsNetwork = function(table, aggregatedTable) {
  var retweetNetwork = new Network();
  var i;
  var j;
  var retweetRegex = /\b(rt|RT):? @[a-zA-Z0-9_]+(: | |:)?/gi;
  var users_ids = table[0];
  var tweets = table[7];
  var cleanedTweets = new List();
  var user_id;
  var user_name;
  var user_position;
  var nTweets = table[0].length;
  var node;
  var otherNode;
  var tweet;
  var nTweet;
  var index;

  for(i = 0; i < nUsers; i++) {
    user_name = table[3][i];
    user_id = table[2][i];
    user_position = aggregatedTable[0].indexOf(table[2][i]);
    tweet = table[7][i];
    nTweet = aggregatedTable[7][user_position].indexOf(tweet);
    //trace(nTweet, user_position);
    node = new TweetNode(nTweet, user_position);
    retweetNetwork.addNode(node);

    tweet = tweet.toLowerCase().replace(retweetRegex, "");
    index = cleanedTweets.lastIndexOf(tweet);

    if(index > -1) {
      otherNode = retweetNetwork.nodeList[index];
      relation = new RTRelation(otherNode, node, otherNode.userId, node.userId, otherNode.nTweetFromUser, node.nTweetFromUser);
      retweetNetwork.addRelation(relation);
    }

    cleanedTweets.push(tweet);
  }

  for(i = 0; retweetNetwork.nodeList[i] != null; i++) {
    node = retweetNetwork.nodeList[i];
    if(node.toNodeList.length > 0 && node.fromNodeList.length == 0) {
      node.nThread = i;
    } else if(node.fromNodeList.length > 0) {
      node.nThread = node.fromNodeList[0].nThread;
    }
  }

  return retweetNetwork;
};

/**
 * To be deprectaed
 */
TwitterSearchProcesses.buildMergedNetworks = function(mentionsNetwork, rtNetwork, aggregatedTable) {
  var usersIds = aggregatedTable[0];
  var tweets = aggregatedTable[7];
  var dates = aggregatedTable[8];

  var mergedNetwork = new Network();
  mergedNetwork.name = "merged";

  var nodeList = mentionsNetwork.nodeList;
  var newUserNode;
  for(var i = 0; nodeList[i] != null; i++) {
    //newUserNode = new TwitterUserNode(nodeList[i].name, nodeList[i].id, usersIds[i], i, tweets[i].reverse(), dates[i].reverse());
    newUserNode = new TwitterUserNode(nodeList[i].name, nodeList[i].name, usersIds[i], i, null, tweets[i].reverse(), dates[i].reverse());
    newUserNode.thumbnailUrl = aggregatedTable[4][i];
    mergedNetwork.addNode(newUserNode);
  }

  var relation;
  var relationList = mentionsNetwork.relationList;
  var existentRelation;
  var newRelation;
  var node0;
  var node1;

  for(i = 0; relationList[i] != null; i++) {
    relation = relationList[i];
    if(relation.node0.id == relation.node1.id) continue;
    existentRelation = mergedNetwork.relationList.getFirstRelationByIds(relation.node0.id, relation.node1.id);

    if(existentRelation == null) {
      node0 = mergedNetwork.nodeList.getNodeById(relation.node0.id);
      node1 = mergedNetwork.nodeList.getNodeById(relation.node1.id);
      newRelation = new MergedRelation(node0, node1);
      mergedNetwork.addRelation(newRelation);
      if(relation.isRT) {
        newRelation.rtWeight++;
      } else {
        if(newRelation.tweets == null) newRelation.tweets = new StringList();
        newRelation.tweets.push(relation.tweet);
      }
    } else {
      existentRelation.weight++;
      if(existentRelation.node0.id == relation.node0.id) {
        existentRelation.toWeight++;
      } else {
        existentRelation.fromWeight++;
      }
      if(relation.isRT) {
        existentRelation.rtWeight++;
      } else {
        if(existentRelation.tweets == null) existentRelation.tweets = new StringList();
        existentRelation.tweets.push(relation.tweet);
      }
    }

  }
  return mergedNetwork;
};