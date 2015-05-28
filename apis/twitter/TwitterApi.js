/**
 * Twitter API 
 * @constructor
 */
function TwitterApi() {};
/**
 * gather tweets from twitterUser. 
 * @param {String} twittID the twitter user
 * @param {Function} onComplete a function that will be called onDataComplete
 * @param callee the object to call onComplete in the correct scope. if null, onComplete will be called at arguments.callee
 * @return {Object} returns a JSON object with data
 * 
 */
// TwitterApi.searchUsers=function(twittID, onComplete, callee){
// this.network=network;
// var d=new Date();
// var date=d.getTime();
// var target = callee?callee:arguments.callee;
// var url="http://apps2.impure.com/impureDataServices/twitter/twitterStreamApi.php&service=searchUsers&q="+twittID+"&fields=id_str, text&method=POST&maxResults=100";
// 	
// //Loader.loadData(url, function(e){
// Loader.loadJSONP(url, function(e){
// //TODO: fix this method to receive LoadEvent!
// c.log('TwitterApi.searchUsers e:', e);
// var obj=jQuery.parseJSON(e.result);
// onComplete.call(target, obj);
// //trace(jQuery.parseJSON(data));
// });
// }
/**
 * gather tweets that contain a specific string. 
 * @param {String} searchString search string
 * @param {Function} onComplete a function that will be called onDataComplete
 * @param callee the object to call onComplete in the correct scope. if null, onComplete will be called at arguments.callee.
 * @return {Object} returns a JSON Object with data
 * 
 */
TwitterApi.searchKeyword = function(searchString, onComplete, nResults, page, callee) {
  var d = new Date();
  var date = d.getTime();
  var target = callee ? callee : arguments.callee;
  var url = "http://search.twitter.com/search.json?&q=" + searchString + "&rpp=" + nResults + "&page=" + page + "&noCacheRandom=" + date;

  c.log("TwitterApi.searchKeyword | url:", url);

  try {
    Loader.loadJSONP(url, function(e) {
      if(e.errorType == 0) {
        //e.result=jQuery.parseJSON(e.result);
      }
      onComplete.call(target, e);
    }, this);
  } catch(error) {
    c.log('¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶ error Loader.loadJSONP at TwitterApi.searchKeyword, error:', error);
  }
  //c.log('3. TwitterApi.searchKeyword:['+searchString+']');
}

/**
 * gather tweets that contain a specific string. 
 * @param {String} searchString search string
 * @param {Function} onComplete a function that will be called onDataComplete
 * @param callee the object to call onComplete in the correct scope. if null, onComplete will be called at arguments.callee.
 * @return {Object} returns a JSON Object with data
 * 
 */
TwitterApi.loadListMembers = function(accountName, listName, cursor, onComplete, callee) {
  var d = new Date();
  var date = d.getTime();
  var target = callee ? callee : arguments.callee;
  var url = "https://api.twitter.com/1/lists/members.json?slug=" + listName + "&owner_screen_name=" + accountName + "&cursor=" + cursor + "&noCacheRandom=" + date;
  c.log('TwitterApi.loadListMembers, url:' + url);
  try {
    Loader.loadJSONP(url, function(e) {
      if(e.errorType == 0) {
        //e.result=jQuery.parseJSON(e.result);
      }
      onComplete.call(target, e);
    }, this);
  } catch(error) {
    c.log('¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶ error Loader.loadJSONP at TwitterApi.loadListMembers, error:', error);
  }
}