TwitterSearch.prototype.constructor = TwitterSearch;

/**
 * TwitterSearch, builds a Table:
 * 0: date, 1: tweet id, 2: user id, 3: user name, 4: iso language code, 5: thumbnail url, 6: geo coordinate, 7: tweet, 8: to user id, 9: source
 * 
 * 
 * @constructor
 */

function TwitterSearch(configuration) {
  this._conf = configuration;
  this._warnFunction = configuration.warnFunction;
  this.returnTable = configuration.returnTable;
  this.target = configuration.target;

  this._searchString = '';
  this._newSearchString = '';
  this._string = '';
  this._newString = '';
  this._drawString = '';

  this._maxResults;
  this._nPage;

  this._table;
  this._fileData = null;

  this.loading = false;
  this.nLoaded;
  this.nMaxToLoad;
  this.preventRepetitions = false;

  //list members
  this._loadedMembers;
  this._accountName;
  this._listName;

  this.cancelled = false;

  //multi search
  this._tS;
  this.multiResults;
}

TwitterSearch.prototype.cancel = function() {
  this.cancelled = true;
};

TwitterSearch.prototype.search = function(searchString, language, excludeWords, maxResults, refresh) {
  if(this.cancelled) return;

  c.log("TwitterSearch.prototype.search | searchString, language, excludeWords, maxResults, refresh:", searchString, language, excludeWords, maxResults, refresh);

  this._newSearchString = this.expand(searchString);
  this._maxResults = maxResults != undefined ? maxResults : -1;
  this.nMaxToLoad = this._maxResults;
  this._nPage = 1;
  this.nLoaded = 0;

  this.clean();

  var nResultsPerPage = maxResults < 100 ? maxResults : 100;

  this.loading = true;

  if(!this.preventRepetitions || this._searchString != this._newSearchString) {
    this._string = "Loading Twitter Data";
    this._isComplete = false;
    this._searchString = this._newSearchString;
    TwitterApi.searchKeyword(this._searchString, this.onComplete, nResultsPerPage, 1, this);
  }
};

TwitterSearch.prototype.multiSearch = function(searchStrings, language, excludeWords, maxResults, refresh) {
  this._tS = new TwitterSearch(this._conf);
  this._tS._warnFunction = this._onCompleteMulti;
  this._tS.target = this;
  this._searchStrings = searchStrings;
  this._maxResults = maxResults != undefined ? maxResults : -1;
  this._iMulti = 0;
  this.loading = true;
  this._next();
};
TwitterSearch.prototype._next = function() {
  c.log("\n\n\n\n\n\n\n\n\nmultiSearch, _iMulti/_searchStrings.length, next:", this._iMulti + "/" + this._searchStrings.length, this._searchStrings[this._iMulti]);
  this._tS.search(this._searchStrings[this._iMulti], null, null, this._maxResults);
  this._iMulti++;
};
TwitterSearch.prototype._onCompleteMulti = function(results) {
  if(this.multiResults == null) this.multiResults = new List();
  this.multiResults = this.multiResults.concat(results);

  if(!this._tS.loading) {
    if(this._iMulti < this._searchStrings.length) {
      this._next();
    } else {
      this.loading = false;
    }
  }

  this._warnFunction.call(this.target, results);
};


TwitterSearch.prototype.clean = function() {
  this._table = null;
  this._idList = null;
};

TwitterSearch.prototype.onComplete = function(e) {
  c.log("TwitterSearch.prototype.onComplete | this.returnTable, this.cancelled, e:", this.returnTable, this.cancelled, e);
  if(this.cancelled) return;

  var i;
  var nLoading;

  if(this.returnTable) {
    if(e.errorType == 0) {
      this._isComplete = true;

      if(this._table == null) {
        this._table = new Table();
        //
        var created_at_list = new List();
        created_at_list.name = "created_at";
        this._table.push(created_at_list);
        //
        var id_list = new NumberList();
        id_list.name = "id";
        this._table.push(id_list);
        //
        var from_user_id_list = new NumberList();
        from_user_id_list.name = "from_user_id";
        this._table.push(from_user_id_list);
        //
        var from_user_list = new List();
        from_user_list.name = "from_user";
        this._table.push(from_user_list);
        //
        var iso_language_code_list = new List();
        iso_language_code_list.name = "iso_language_code";
        this._table.push(iso_language_code_list);
        //
        var profile_image_url_list = new List();
        profile_image_url_list.name = "profile_image_url";
        this._table.push(profile_image_url_list);
        //
        var geo_list = new List();
        geo_list.name = "geo";
        this._table.push(geo_list);
        //
        var text_list = new List();
        text_list.name = "text";
        this._table.push(text_list);
        //
        var to_user_id_list = new NumberList();
        to_user_id_list.name = "to_user_id";
        this._table.push(to_user_id_list);
        //
        var source_list = new List();
        source_list.name = "source";
        this._table.push(source_list);
      } else {
        created_at_list = this._table[0];
        id_list = this._table[1];
        from_user_id_list = this._table[2];
        from_user_list = this._table[3];
        iso_language_code_list = this._table[4];
        profile_image_url_list = this._table[5];
        geo_list = this._table[6];
        text_list = this._table[7];
        to_user_id_list = this._table[8];
        source_list = this._table[9];
      }
      //
      var maxResults = this._maxResults == -1 ? e.result.results.length : this._maxResults;
      for(i = 0; i < e.result.results.length; i++) {
        var listElement = e.result.results[i];
        created_at_list.push(new Date(DateOperators.parseDate(listElement.created_at)));
        id_list.push(listElement.id);
        from_user_id_list.push(listElement.from_user_id);
        from_user_list.push(listElement.from_user);
        iso_language_code_list.push(listElement.iso_language_code);
        profile_image_url_list.push(listElement.profile_image_url);
        geo_list.push(listElement.geo != null ? listElement.geo : "");
        text_list.push(listElement.text);
        to_user_id_list.push(listElement.to_user_id != null ? listElement.to_user_id : "");
        source_list.push(decodeURI(listElement.source));
      }
      //
      this._fileData = this._table;

    } else {
      return;
      this._string = e.errorMessage;
    }

    this.nLoaded = id_list.length;
    nLoading = id_list == null ? 0 : id_list.length;

  } else {
    if(e.result == null || e.result.results == null || e.result.results.length == null || (e.result.error != null && (e.result.error == "Service Unavailable" || e.result.error == "Internal Server Error"))) {
      //this._warnFunction.call(this.target, null);
      c.log('TwitterSearch onComplete | e.result==null, repeat api query, this._searchString:[' + this._searchString + ']');
      TwitterApi.searchKeyword(this._searchString, this.onComplete, 100, this._nPage, this);
      return;
    }

    var resultList = new StringList();

    if(e.result.results != null) {
      for(i = 0; i < e.result.results.length; i++) {
        resultList.push(e.result.results[i]);
      }
      this.nLoaded += e.result.results.length;
    }
  }

  c.log("this._nPage, this.nLoaded, this._maxResults, e.result.results.length", this._nPage, this.nLoaded, this._maxResults, e.result.results.length);


  if(this._maxResults > this._nPage * 100 && e.result.results.length > 90) {
    this._nPage++;
    TwitterApi.searchKeyword(this._searchString, this.onComplete, 100, this._nPage, this);
    this._string = "Loading " + nLoading + "/" + this._maxResults;
  } else {
    c.log('');
    this._string = "Loaded " + nLoading + "/" + this._maxResults;
    this.loading = false;
  }

  if(!this.returnTable) {
    if(this.target == null) {
      this._warnFunction(this._resultsList);
    } else {
      this._warnFunction.call(this.target, resultList);
    }
  } else {
    if(this.target == null) {
      this._warnFunction(this._fileData);
    } else {
      this._warnFunction.call(this.target, this._fileData);
    }
  }
};

///////these should de static!!!!


TwitterSearch.prototype.expand = function(query) {
  //total single
  var totalPattern = /total\([a-zA-Z0-9_]+\)/g;
  var blocks = query.split(totalPattern);
  var matches = query.match(totalPattern);

  if(matches == null) return query;

  var newQuery = blocks[0];
  var i;
  var account;
  for(i = 0; matches[i] != null; i++) {
    account = matches[i].substr(6, matches[i].length - 7);
    newQuery += ("(to:" + account + " OR from:" + account + " OR @" + account + ")" + blocks[i + 1]);
  }

  var spacePattern = /\) +\(/g;
  newQuery = newQuery.replace(spacePattern, ") OR (");

  return newQuery;
};

TwitterSearch.prototype.getFeaturedAccounts = function(query) {
  var featuredAccounts = new StringList();
  //total single
  var totalPattern = /total\([a-zA-Z0-9_]+\)/g;
  var blocks = query.split(totalPattern);
  var matches = query.match(totalPattern);

  if(matches == null) return query;

  var i;

  for(i = 0; matches[i] != null; i++) {
    featuredAccounts[i] = matches[i].substr(6, matches[i].length - 7);
  }

  return featuredAccounts;
};




/////////list members

TwitterSearch.prototype.loadListMembers = function(accountName, listName, maxResults) {
  if(this.cancelled) return;

  this.loading = true;
  this._accountName = accountName;
  this._listName = listName;
  this._loadedMembers = new StringList();
  TwitterApi.loadListMembers(accountName, listName, -1, this.onCompleteMembers, this);
};

TwitterSearch.prototype.onCompleteMembers = function(e) {
  if(this.cancelled) return;

  //if(e.result==null) TwitterApi.loadListMembers(this._accountName, this._listName, e.result.next_cursor, this.onCompleteMembers, this);

  var i;

  c.log('################# TwitterSearch.prototype.onCompleteMembers');
  c.log('################# e', e);
  c.log('################# e.result.next_cursor:', e.result.next_cursor);
  c.log('################# e.result:', e.result);
  c.log('################# this:', this);
  c.log('################# this._loadedMembers.length:', this._loadedMembers.length);


  if(e.result.users != null) {
    for(i = 0; i < e.result.users.length; i++) {
      this._loadedMembers.push(e.result.users[i]);
    }
  }

  if(e.result.next_cursor == 0) {
    this._warnFunction.call(this.target, this._loadedMembers);
  } else {
    TwitterApi.loadListMembers(this._accountName, this._listName, e.result.next_cursor, this.onCompleteMembers, this);
  }
};