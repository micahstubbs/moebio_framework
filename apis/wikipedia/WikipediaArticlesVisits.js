WikipediaArticlesVisits.prototype.constructor = WikipediaArticlesVisits;

// include(frameworksRoot+"operators/dates/DateOperators.js");
// include(frameworksRoot+"operators/strings/StringOperators.js");
// include(frameworksRoot+"Tools/loaders/Loader.js");



//try this other api: http://server.lustlab.net/as/wikipageviews/api/list/pageviews/hourly/japan/now

/**
 * WikipediaArticlesVisits, builds a Table:
 * 0: dates 1: n visits article0, 2: n visits article1…
 * 
 * typical query: "http://toolserver.org/~emw/index.php?c=wikistats&m=get_traffic_data&p1=Japan&p2=China&project1=en&from=1/15/2011&to=1/15/2012"
 * web for queries: http://toolserver.org/~emw/wikistats/
 * 
 * @constructor
 */
function WikipediaArticlesVisits(warnFunction, target) {
  this.warnFunction = warnFunction;
  this.target = target;

  this.searchString;

  this.width = 130;
  this.height = 16;
  //
  this._articlesToSeacrh = '';

  this._table;
  this.loading = false;

  this.fakeInfoMode = false;
}

WikipediaArticlesVisits.prototype.search = function(articlesNames, date0, date1, normalized) {
  this.searchString = "http://toolserver.org/~emw/index.php?c=wikistats&m=get_traffic_data&";
  this.normalized = normalized;
  var i;
  for(i = 0; articlesNames[i] != null; i++) {
    this.searchString += "p" + (i + 1) + "=" + articlesNames[i];
    if(articlesNames[i + 1] != null) this.searchString += "&";
  }
  this.searchString += "&project1=en&from=" + (date0.getMonth() + 1) + "/" + date0.getDate() + "/" + date0.getFullYear() + "&to=" + (date1.getMonth() + 1) + "/" + date1.getDate() + "/" + date1.getFullYear();

  c.log("WikipediaArticlesVisits | this.searchString:");
  c.log(this.searchString);

  if(this.fakeInfoMode) {
    Loader.loadData("./resources/data/wpVisitsQuery.txt", this.onComplete, this); // TESTS!!!!
  } else {
    Loader.loadData(this.searchString, this.onComplete, this);
  }
}

WikipediaArticlesVisits.prototype.onComplete = function(e) {
  //c.log("WikipediaArticlesVisits | onComplete | e", e);
  var subTexts = StringOperators.allTextsBetweenStrings(e.result, "[[", "]]");

  var datesStrings = StringOperators.allTextsBetweenStrings(subTexts[0], "[\"", "\",");
  var dates = DateOperators.stringListToDateList(datesStrings, 1, "-");
  //c.log("dates", dates);

  var table = new Table();
  table[0] = dates;

  var i;
  var valuesStrings;
  var numberList;

  for(i = 0; subTexts[i] != null; i++) {
    datesStrings = StringOperators.allTextsBetweenStrings(subTexts[i], "[\"", "\",");
    dates = DateOperators.stringListToDateList(datesStrings, 1, "-");
  }

  for(i = 0; subTexts[i] != null; i++) {
    var valuesStrings = StringOperators.allTextsBetweenStrings(subTexts[i], "\", ", "]");
    var numberList = valuesStrings.toNumberList();
    if(this.normalized) {
      table.push(numberList.getNormalized());
    } else {
      table.push(numberList);
    }
  }


  //c.log("table", table);
  this.warnFunction.call(this.target, table);
}