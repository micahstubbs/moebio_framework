/*
 * In this operators tweets are treated as objects, so they can take into account metadata for url treatmente, etc…
 * A tweet object is typically like this:
{
	created_at: "Tue, 23 Oct 2012 13:59:51 +0000",
	entities: {
		hashtags: [ ],
		urls: [
			{
				url: "http://t.co/vHPEc6hE",
				expanded_url: "http://OFA.BO/S2yKVv",
				display_url: "OFA.BO/S2yKVv",
				indices: [
					117,
					137
				]
			}
		],
		user_mentions: [
			{
				screen_name: "BarackObama",
				name: "Barack Obama",
				id: 813286,
				id_str: "813286",
				indices: [
					3,
					15
				]
			}
		]
	},
	from_user: "sesparr",
	from_user_id: 263483165,
	from_user_id_str: "263483165",
	from_user_name: "Sue Sparr",
	geo: null,
	id: 260742332637409280,
	id_str: "260742332637409282",
	iso_language_code: "en",
	metadata: {
		result_type: "recent"
	},
	profile_image_url: "http://a0.twimg.com/profile_images/1267506956/Flower_Profile_Pic_normal.JPG",
	profile_image_url_https: "https://si0.twimg.com/profile_images/1267506956/Flower_Profile_Pic_normal.JPG",
	source: "&lt;a href=&quot;http://twitter.com/&quot;&gt;web&lt;/a&gt;",
	text: "RT @BarackObama: CNN's John King: "There's no question" the President won the debate. "He's the commander in chief." http://t.co/vHPEc6hE",
	to_user: null,
	to_user_id: 0,
	to_user_id_str: "0",
	to_user_name: null
}
*/
/**
 * @constructor
 */
function TweetsOperators() {}


TweetsOperators.STOP_WORDS = StringOperators.STOP_WORDS; //StringList.fromArray("t,s,mt,rt,re,m,http,amp,a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your".split(","));
TweetsOperators.ACCOUNT_NAME_REGEXP = /@[a-zA-Z0-9_]+('|\?|:| |;|.|,|")?/gi;


TweetsOperators.getStringFromTweets = function(tweetsArray, separator) {
  separator = separator == null ? " " : separator;

  var string = "";
  for(var i = 0; tweetsArray[i] != null; i++) {
    string += tweetsArray[i].text + separator;
  }
  return string;
};

TweetsOperators.getWordsFromTweets = function(tweetsArray, withoutRepetitions, removeStopWords, sortedByFrequency, includeLinks, limit, minSizeWords) {
  return StringOperators.getWords(TweetsOperators.getStringFromTweets(tweetsArray), withoutRepetitions, removeStopWords ? TweetsOperators.STOP_WORDS : null, sortedByFrequency, includeLinks, limit, minSizeWords);
};

TweetsOperators.getAccountsNamesFromTweets = function(tweetsArray, withoutRepetitions, sortedByFrequency, limit) {
  var string = TweetsOperators.getStringFromTweets(tweetsArray);
  var list = string.match(TweetsOperators.ACCOUNT_NAME_REGEXP);
  return StringOperators.getWords(list.join(' '), withoutRepetitions, null, sortedByFrequency, false, limit);
};

TweetsOperators.getNGramsFromTweets = function(tweetsArray, N) {

};

TweetsOperators.getWordsFrequenciesTable = function(tweetsArray, removeStopWords, includeLinks, limit, minSizeWords) {
  var words = TweetsOperators.getWordsFromTweets(tweetsArray, false, removeStopWords, false, includeLinks, null, minSizeWords);
  return ListOperators.countElementsRepetitionOnList(words, true, false, limit);
};

TweetsOperators.getAccountsNamesFrequenciesTable = function(tweetsArray, limit) {
  var words = TweetsOperators.getAccountsNamesFromTweets(tweetsArray, false, false, null);
  var table = words.getElementsRepetitionCount(true).sliceRows(0, limit-1);
  return table;//ListOperators.countElementsRepetitionOnList(words, true, false, limit);
};

/**
 * returns a Table in which the first list is the accounts names, and the others are the number of occurrences of words
 * @param {Object} tweetsArray
 * @param {Object} removeStopWords
 * @param {Object} includeLinks
 * @param {Object} limit
 * @param {Object} minSizeWords
 */
TweetsOperators.getWordsFrequenciesMergedTable = function(tweetsArray, removeStopWords, includeLinks, limit, minSizeWords) {
  var i;
  var users = tweetsArray.getPropertyValues('from_user');
  var subList;
  var subTable;
  var table;

  users = users.getWithoutRepetitions();

  for(i = 0; users[i] != null; i++) {
    subList = tweetsArray.getFilteredByPropertyValue('from_user', users[i]);
    subTable = TweetsOperators.getWordsFrequenciesTable(subList, removeStopWords, includeLinks, limit, minSizeWords);
    table = table == null ? subTable : TableOperators.mergeDataTables(table, subTable);
    table[i + 1].name = users[i];
  }

  return table;
};

/**
 * returns a Table in which the first list is the accounts names, and the others are the number of occurrences of words, faster algorithm (calculates list of words first)
 * @param {Object} tweetsArray
 * @param {Object} removeStopWords
 * @param {Object} includeLinks
 * @param {Object} limit
 * @param {Object} minSizeWords
 */
TweetsOperators.getWordsFrequenciesMergedTableLight = function(tweetsArray, removeStopWords, includeLinks, limit, minSizeWords) {
  var i, j;
  var users = tweetsArray.getPropertyValues('from_user');
  var subList;
  var words;
  var wordsTable = TweetsOperators.getWordsFrequenciesTable(tweetsArray, removeStopWords, includeLinks, limit, minSizeWords);
  var table = new Table();
  //var match;

  users = users.getWithoutRepetitions();

  table[0] = wordsTable[0];

  for(i = 0; users[i] != null; i++) {
    subList = tweetsArray.getFilteredByPropertyValue('from_user', users[i]);
    text = subList.getPropertyValues('text').join(' ');

    table[i + 1] = new NumberList();
    table[i + 1].name = users[i];

    for(j = 0; wordsTable[0][j] != null; j++) {
      //match = text.match(new RegExp("\\b"+wordsTable[0][j]+"\\b"));
      //table[i+1][j] =  match==null?0:match.length;
      table[i + 1][j] = text.split(wordsTable[0][j]).length - 1;
    }
  }

  return table;
};


TweetsOperators.createCoOccurrencesNetwork = function(tweetsArray, removeStopWords, includeLinks, wordsLimit, coOccurrencesLimit) {
  removeStopWords = removeStopWords == null ? true : removeStopWords;
  includeLinks = includeLinks == null ? true : includeLinks;
  coOccurrencesLimit = coOccurrencesLimit == null ? 0 : coOccurrencesLimit;

  var network = new Network();
  var table = TweetsOperators.getWordsFrequenciesTable(tweetsArray, removeStopWords, includeLinks, wordsLimit);
  var words = table[0];
  var weights = table[1];
  var j;
  var k;

  var word0 = words[0];
  var word1;
  var node0 = new Node(word0, word0);
  var relation;
  var tweetWords;
  node0.weight = weights[0];
  network.addNode(node0);

  for(var i = 0; words[i + 1] != null; i++) {
    word0 = words[i];
    node0 = network.nodeList[i];
    for(j = i + 1; words[j] != null; j++) {
      word1 = words[j];
      if(i == 0) {
        node1 = new Node(word1, word1);
        node1.weight = weights[j];
        network.addNode(node1);
      } else {
        node1 = network.nodeList[j];
      }

      var coOccurrences = 0;
      for(k = 0; tweetsArray[k] != null; k++) {
        tweetWords = tweetsArray[k].text.toLowerCase().match(/\w+/g);
        coOccurrences += Number(tweetWords.indexOf(word0) != -1 && tweetWords.indexOf(word1) != -1);
      }

      if(coOccurrences > coOccurrencesLimit) {
        relation = new Relation(word0 + "_" + word1, word0 + "_" + word1, node0, node1, coOccurrences);
        network.addRelation(relation);
      }
    }
  }

  return network;
};