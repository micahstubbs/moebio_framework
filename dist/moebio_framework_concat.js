define('src/index', ['exports'], function (exports) {

	'use strict';

	DataModel.prototype = {};
	DataModel.prototype.constructor = DataModel;

	/**
	 * @classdesc Basic DataType from which other types are derived.
	 *
	 * @description Creates a new DataModel.
	 * @constructor
	 * @category basics
	 */
	function DataModel() {
		// TODO. What is the intent in this line. I don't think its needed.
	  Object.apply(this);
	  this.type = "DataModel";
	}


	DataModel.prototype.destroy = function() {
		// TODO. Why is this being done? It is in a few
		// places in the codebase. Also this.name isn't
		// defined here.
	  delete this.type;
	  delete this.name;
	};

	DataModel.prototype.setType = function(type) {
	  this.type = type;
	};

	DataModel.prototype.getType = function() {
	  return this.type;
	};

	DataModel.prototype.toString = function() {

	};

	exports.DataModel = DataModel;

	function DateOperators__DateOperators() {}
	var DateOperators__default = DateOperators__DateOperators;

	DateOperators__DateOperators.millisecondsToHours = 1 / (1000 * 60 * 60);
	DateOperators__DateOperators.millisecondsToDays = 1 / (1000 * 60 * 60 * 24);
	DateOperators__DateOperators.millisecondsToWeeks = 1 / (1000 * 60 * 60 * 24 * 7);
	DateOperators__DateOperators.millisecondsToYears = 0.00000000003169;

	DateOperators__DateOperators.MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	DateOperators__DateOperators.MONTH_NAMES_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	DateOperators__DateOperators.MONTH_NDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	DateOperators__DateOperators.WEEK_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	/**
	 * parses a Date
	 * @param  {String} string date in string format
	 * @param  {String} formatCase 0: <br>MM-DD-YYYY<br>1: YYYY-MM-DD<br>2: MM-DD-YY<br>3: YY-MM-DD
	 * @param  {String} separator
	 * @return {Date}
	 * tags:decoder
	 */
	DateOperators__DateOperators.stringToDate = function(string, formatCase, separator) {
	  separator = separator == null ? "-" : separator;
	  formatCase = formatCase == null ? 1 : formatCase;

	  if(formatCase == 1) {
	    if(separator != "-") string = string.replace(new RegExp(string, "g"), "-");
	    return new Date(string);
	  }

	  var y;
	  var parts = string.split(separator);
	  switch(formatCase) {
	    case 0: //MM-DD-YYYY
	      return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
	    case 1: //YYYY-MM-DD
	      return new Date(string); //Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
	    case 2: //MM-DD-YY
	      y = Number(parts[2]);
	      y = y >= 0 ? y + 2000 : y + 1900;
	      return new Date(y, Number(parts[0]) - 1, Number(parts[1]));
	    case 3: //YY-MM-DD
	      y = Number(parts[0]);
	      y = y >= 0 ? y + 2000 : y + 1900;
	      return new Date(y, Number(parts[1]) - 1, Number(parts[2]));
	  }
	};

	/**
	 * format cases
	 * 0: MM-DD-YYYY
	 * 1: YYYY-MM-DD
	 */
	DateOperators__DateOperators.dateToString = function(date, formatCase, separator) {
	  separator = separator == null ? "-" : separator;
	  formatCase = formatCase == null ? 0 : formatCase;
	  var year = date.getFullYear();
	  var month = date.getMonth() + 1;
	  var day = date.getDate();

	  switch(formatCase) {
	    case 0: //MM-DD-YYYY
	      return month + separator + day + separator + year;
	    case 1: //YYYY-MM-DD
	      return year + separator + month + separator + day;
	  }
	};

	/**
	 * generates current date Date
	 * @return {Date}
	 * tags:generate
	 */
	DateOperators__DateOperators.currentDate = function() {
	  return new Date();
	};

	DateOperators__DateOperators.addDaysToDate = function(date, nDays) {
	  return new Date(date.getTime() + (nDays / DateOperators__DateOperators.millisecondsToDays));
	};

	DateOperators__DateOperators.addMillisecondsToDate = function(date, nMilliseconds) {
	  return new Date(date.getTime() + nMilliseconds);
	};


	DateOperators__DateOperators.parseDate = function(string) {
	  return new Date(Date.parse(string.replace(/\./g, "-")));
	};

	DateOperators__DateOperators.parseDates = function(stringList) {
	  var dateList = new DateList();
	  var i;
	  for(i = 0; stringList[i] != null; i++) {
	    dateList.push(this.parseDate(stringList[i]));
	  }
	  return dateList;
	};

	DateOperators__DateOperators.getHoursBetweenDates = function(date0, date1) {
	  return(date1.getTime() - date0.getTime()) * DateOperators__DateOperators.millisecondsToHours;
	};
	DateOperators__DateOperators.getDaysBetweenDates = function(date0, date1) {
	  return(date1.getTime() - date0.getTime()) * DateOperators__DateOperators.millisecondsToDays;
	};
	DateOperators__DateOperators.getWeeksBetweenDates = function(date0, date1) {
	  return(date1.getTime() - date0.getTime()) * DateOperators__DateOperators.millisecondsToWeeks;
	};
	DateOperators__DateOperators.getYearsBetweenDates = function(date0, date1) {
	  return(date1.getTime() - date0.getTime()) * DateOperators__DateOperators.millisecondsToYears;
	};

	DateOperators__DateOperators.nDayInYear = function(date) {
	  return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) * DateOperators__DateOperators.millisecondsToDays);
	};

	DateOperators__DateOperators.getDateDaysAgo = function(nDays) {
	  return DateOperators__DateOperators.addDaysToDate(new Date(), -nDays);
	};


	/**
	 * gets the week number within a year (weeks start on Sunday, first week may have less than 7 days if start in a day other than sunday
	 * @param {Date} The date whose week you want to retrieve
	 * @return {Number} The week number of the date in its year
	 * tags:generate
	 */
	DateOperators__DateOperators.getWeekInYear = function(date) {
	  var onejan = new Date(date.getFullYear(), 0, 1);
	  return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
	};

	DateOperators__DateOperators.getNDaysInMonth = function(month, year) {
	  return new Date(year, month, 0).getDate();
	};

	exports.DateOperators = DateOperators__default;

	List__List.prototype = new DataModel();
	List__List.prototype.constructor = List__List;

	 /**
	  * @classdesc List is an Array with a type property.
	  *
	  * @description Creates a new List.
	  * @param {} values Comma separated values to add to List
	  * @constructor
	  * @category basics
	  */
	function List__List() {
	  DataModel.apply(this);
	  var array = [];
	  var i;
	  for(i = 0; i < arguments.length; i++) {
	    array.push(arguments[i]);
	  }
	  array = List__List.fromArray(array);
	  //
	  return array;
	}
	var List__default = List__List;


	List__List.fromArray = function(array) { //TODO: clear some of these method declarations
	    array.type = "List";
	    array.name = array.name || "";

	    array.setType = List__List.prototype.setType;
	    array.setArray = List__List.prototype.setArray;
	    array._constructor = List__List;

	    array.getImproved = List__List.prototype.getImproved;
	    array.sameElements = List__List.prototype.sameElements;
	    array.getLength = List__List.prototype.getLength;
	    array.getTypeOfElements = List__List.prototype.getTypeOfElements; //TODO: redundant?
	    array.getTypes = List__List.prototype.getTypes;
	    array.getType = List__List.prototype.getType;
	    array.getLengths = List__List.prototype.getLengths;
	    array.getWithoutRepetitions = List__List.prototype.getWithoutRepetitions;
	    array.getElementsRepetitionCount = List__List.prototype.getElementsRepetitionCount;
	    array.allElementsEqual = List__List.prototype.allElementsEqual;
	    array.countElement = List__List.prototype.countElement;
	    array.countOccurrences = List__List.prototype.countOccurrences;
	    array.getMostRepeatedElement = List__List.prototype.getMostRepeatedElement;
	    array.getMin = List__List.prototype.getMin;
	    array.getMax = List__List.prototype.getMax;
	    array.indexesOf = List__List.prototype.indexesOf;
	    array.indexOfElements = List__List.prototype.indexOfElements;
	    array.indexOfByPropertyValue = List__List.prototype.indexOfByPropertyValue;
	    array.getFirstElementByName = List__List.prototype.getFirstElementByName;
	    array.getElementsByNames = List__List.prototype.getElementsByNames;
	    array.getFirstElementByPropertyValue = List__List.prototype.getFirstElementByPropertyValue;
	    array.add = List__List.prototype.add;
	    array.multiply = List__List.prototype.multiply;
	    array.getSubList = List__List.prototype.getSubList;
	    array.getSubListByIndexes = List__List.prototype.getSubListByIndexes;
	    array.getSubListByType = List__List.prototype.getSubListByType;
	    array.getElementNumberOfOccurrences = List__List.prototype.getElementNumberOfOccurrences;
	    array.getPropertyValues = List__List.prototype.getPropertyValues;
	    array.getRandomElement = List__List.prototype.getRandomElement;
	    array.getRandomElements = List__List.prototype.getRandomElements;
	    array.containsElement = List__List.prototype.containsElement;
	    array.indexOfElement = List__List.prototype.indexOfElement;
	    //sorting:
	    array.sortIndexed = List__List.prototype.sortIndexed;
	    array.sortNumericIndexed = List__List.prototype.sortNumericIndexed;
	    array.sortNumeric = List__List.prototype.sortNumeric;
	    array.sortNumericIndexedDescending = List__List.prototype.sortNumericIndexedDescending;
	    array.sortNumericDescending = List__List.prototype.sortNumericDescending;
	    array.sortOnIndexes = List__List.prototype.sortOnIndexes;
	    array.getReversed = List__List.prototype.getReversed;
	    array.getSortedByProperty = List__List.prototype.getSortedByProperty;
	    array.getSorted = List__List.prototype.getSorted;
	    array.getSortedByList = List__List.prototype.getSortedByList;
	    array.getSortedRandom = List__List.prototype.getSortedRandom;
	    //filter:
	    array.getFilteredByPropertyValue = List__List.prototype.getFilteredByPropertyValue;
	    array.getFilteredByBooleanList = List__List.prototype.getFilteredByBooleanList;
	    //conversion
	    array.toNumberList = List__List.prototype.toNumberList;
	    array.toStringList = List__List.prototype.toStringList;
	    //
	    array.clone = List__List.prototype.clone;
	    array.toString = List__List.prototype.toString;
	    array.getNames = List__List.prototype.getNames;
	    array.applyFunction = List__List.prototype.applyFunction;
	    array.getWithoutElementAtIndex = List__List.prototype.getWithoutElementAtIndex;
	    array.getWithoutElement = List__List.prototype.getWithoutElement;
	    array.getWithoutElements = List__List.prototype.getWithoutElements;
	    array.getWithoutElementsAtIndexes = List__List.prototype.getWithoutElementsAtIndexes;
	    array.getFilteredByFunction = List__List.prototype.getFilteredByFunction;
	    array._concat = Array.prototype.concat;
	    array.concat = List__List.prototype.concat;
	    array.getReport = List__List.prototype.getReport;

	    //transformations
	    array.pushIfUnique = List__List.prototype.pushIfUnique;
	    array.removeElement = List__List.prototype.removeElement;
	    array.removeElementAtIndex = List__List.prototype.removeElementAtIndex;
	    array.removeElementsAtIndexes = List__List.prototype.removeElementsAtIndexes;
	    array.removeElements = List__List.prototype.removeElements;
	    array.removeRepetitions = List__List.prototype.removeRepetitions;
	    array.replace = List__List.prototype.replace;
	    array.assignNames = List__List.prototype.assignNames;
	    array._splice = Array.prototype.splice;
	    array.splice = List__List.prototype.splice;

	    array.isList = true;

	    array.destroy = List__List.prototype.destroy;


	    return array;
	  };
	  //

	/**
	 * improve a List (refining type)
	 * @return {List}
	 * tags:
	 */
	List__List.prototype.getImproved = function() { //TODO: still doesn't solve tha case of a list with several list of different types
	  if(this.length == 0) return this;
	  var typeOfElements = this.getTypeOfElements();

	  //var typeOfElements=="" allAreLists = … finish this

	  //c.log('List.getImproved | typeOfElements: ['+typeOfElements+']');

	  //if(typeOfElements=="" || typeOfElements=="undefined") return this;

	  var newList;
	  switch(typeOfElements) {
	    case "number":
	      newList = NumberList__default.fromArray(this, false);
	      break;
	    case "string":
	      newList = StringList__default.fromArray(this, false);
	      break;
	    case "Rectangle":
	      return this;
	    case "date":
	      newList = DateList.fromArray(this, false);
	      break;
	    case "List":
	    case "DateList":
	    case "IntervalList":
	    case "StringList":
	    case "Table":
	      newList = Table__default.fromArray(this, false);
	      break;
	    case "NumberList":
	      newList = NumberTable__default.fromArray(this, false);
	      break;
	    case "Point":
	      newList = Polygon__default.fromArray(this, false);
	      break;
	    case "Polygon":
	      newList = PolygonList.fromArray(this, false);
	      break;
	    case "Node":
	      newList = NodeList.fromArray(this, false);
	      break;
	    case "Relation":
	      newList = RelationList.fromArray(this, false);
	      break;
	  }



	  if(newList == null ||  newList == "") {
	    //c.l('getImproved | all elelemnts no same type')

	    var allLists = true;
	    var i;
	    for(i = 0; this[i] != null; i++) {
	      //c.l('isList?', i, this[i].isList);
	      if(!(this[i].isList)) {
	        allLists = false;
	        break;
	      }
	    }
	    //c.l('--> allLists');
	    if(allLists) newList = Table__default.fromArray(this, false);
	  }

	  if(newList != null) {
	    newList.name = this.name;
	    return newList;
	  }
	  return this;
	};

	/**
	 * compare elements with another list
	 * @param  {List} list to compare
	 * @return {Boolean} true if all elements are identical
	 * tags:
	 */
	List__List.prototype.sameElements = function(list) {
	  if(this.length != list.length) return false;

	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(this[i] != list[i]) return false;
	  }

	  return true;
	};

	/**
	 * return the number of elements of the list
	 * @return {Number}
	 * tags:
	 */
	List__List.prototype.getLength = function() {
	  return this.length;
	};

	/**
	 * return a numberList with lists lengths (in case of a table) or strings lengths (in case of a stringList)
	 * @return {StringList}
	 * tags:
	 */
	List__List.prototype.getLengths = function() {
	  //overriden by different extentions of List

	  return null;
	};



	List__List.prototype.getTypeOfElements = function() {
	  var typeOfElements = typeOf(this[0]);
	  for(var i = 1; this[i] != null; i++) {
	    if(typeOf(this[i]) != typeOfElements) return "";
	  }
	  return typeOfElements;
	};

	/**
	 * return a stringList with elemnts types
	 * @return {StringList}
	 * tags:
	 */
	List__List.prototype.getTypes = function() {
	  var types = new StringList__default();
	  for(i = 0; this[i] != null; i++) {
	    types[i] = typeOf(this[i]);
	  }
	  return types;
	};


	List__List.prototype.toString = function() {
	  var i;
	  var str = "[";
	  for(i = 0; i < this.length - 1; i++) {
	    str += this[i] + ", ";
	  }
	  str += this[this.length - 1] + "]";
	  return str;
	};

	/**
	 * return a list of names (if any) of elements of the list
	 * @return {StringList}
	 * tags:
	 */
	List__List.prototype.getNames = function() {
	  var stringList = new StringList__default();
	  for(i = 0; this[i] != null; i++) {
	    stringList[i] = this[i].name;
	  }
	  return stringList;
	};

	/**
	 * reverse the list
	 * @return {List}
	 * tags:sort
	 */
	List__List.prototype.getReversed = function() {
	  var newList = instantiateWithSameType(this);
	  for(var i = 0; this[i] != null; i++) {
	    newList.unshift(this[i]);
	  }
	  return newList;
	};

	/**
	 * return a sub-list, params could be: tw numbers, an interval or a NumberList
	 * @param {Object} argument0 number, interval (in this it will include elements with initial and end indexes) or numberList
	 *
	 * @param {Number} argument1 second index
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getSubList = function() {
	  if(arguments[0].isList) {
	    return this.getSubListByIndexes(arguments[0]);
	  } else if(arguments.length > 2) {
	    return this.getSubListByIndexes(arguments);
	  } else if(typeOf(arguments[0]) == 'number') {
	    if(typeOf(arguments[1]) != null && typeOf(arguments[1]) == 'number') {
	      interval = new Interval(arguments[0], arguments[1]);
	    } else {
	      interval = new Interval(arguments[0], this.length - 1);
	    }
	  } else {
	    interval = arguments[0];
	  }

	  var newInterval = new Interval(Math.max(Math.min(Math.floor(interval.x), this.length), 0), Math.max(Math.min(Math.floor(interval.y), this.length - 1), 0));
	  var newList;

	  if(this.type == "NumberList") {
	    newList = NumberList__default.fromArray(this.slice(interval.x, interval.y + 1), false);
	    newList.name = this.name;
	    return newList;
	  } else if(this.type == "StringList") {
	    newList = StringList__default.fromArray(this.slice(interval.x, interval.y + 1), false);
	    newList.name = this.name;
	    return newList;
	  }

	  if(this.type == 'List' || this.type == 'Table') {
	    newList = new List__List();
	  } else {
	    newList = instantiate(typeOf(this));
	  }

	  for(var i = newInterval.x; i <= newInterval.y; i++) {
	    newList.push(this[i]);
	  }
	  newList.name = this.name;
	  if(this.type == 'List' || this.type == 'Table') return newList.getImproved();
	  return newList;
	};

	/**
	 * filters a list by picking elements of certain type
	 * @param  {String} type
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getSubListByType = function(type) {
	  var newList = new List__List();
	  var i;
	  newList.name = this.name;
	  this.forEach(function(element) {
	    if(typeOf(element) == type) newList.push(element);
	  });
	  return newList.getImproved();

	};

	/**
	 * returns all elements in indexes
	 * @param {NumberList} indexes
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getSubListByIndexes = function() { //TODO: merge with getSubList
	  if(this.length < 1) return this;
	  var indexes;
	  if(typeOf(arguments[0]) == 'number') {
	    indexes = arguments;
	  } else {
	    indexes = arguments[0];
	  }
	  if(indexes == null) return;
	  if(this.type == 'List') {
	    var newList = new List__List();
	  } else {
	    newList = instantiate(typeOf(this));
	  }
	  if(indexes.length == 0) return newList;
	  newList.name = this.name;
	  var nElements = this.length;
	  var nPositions = indexes.length;
	  var i;
	  for(i = 0; i < nPositions; i++) {
	    if(indexes[i] < nElements) {
	      newList.push(this[(indexes[i] + this.length) % this.length]);
	    }
	  }

	  if(this.type == 'List' || this.type == 'Table') return newList.getImproved();
	  return newList;
	};

	List__List.prototype.getElementNumberOfOccurrences = function(element) {
	  var nOccurrences = 0;
	  var from = 0;
	  var index = this.indexOf(element, from);
	  while(index > -1) {
	    nOccurrences++;
	    from = index + 1;
	    index = this.indexOf(element, from);
	  }
	  return nOccurrences;
	};


	List__List.prototype.clone = function() { //TODO:check this! fromArray should suffice
	  var clonedList = instantiateWithSameType(this);
	  var i;

	  for(i = 0; this[i] != null; i++) {
	    clonedList.push(this[i]);
	  }
	  clonedList.name = this.name;
	  return clonedList;
	};

	/**
	 * create a new List without repeating elements
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getWithoutRepetitions = function() {
	  var i;
	  var dictionary;

	  newList = instantiateWithSameType(this);
	  newList.name = this.name;

	  if(this.type == 'NumberList' || this.type == 'StringList') {
	    dictionary = {};
	    for(i = 0; this[i] != null; i++) {
	      if(!dictionary[this[i]]) {
	        newList.push(this[i]);
	        dictionary[this[i]] = true;
	      }
	    }
	  } else {
	    for(i = 0; this[i] != null; i++) {
	      if(newList.indexOf(this[i]) == -1) newList.push(this[i]);
	    }
	  }

	  return newList;
	};



	/**
	 * return number of occurrences of an element on a list
	 * @param  {Object} element
	 * @return {Number}
	 * tags:countt
	 */
	List__List.prototype.countElement = function(element) {
	  n = 0;
	  this.forEach(function(elementInList) {
	    if(element == elementInList) n++;
	  });
	  return n;
	};

	/**
	 * returns a numberList of same size as list with number of occurrences for each element
	 * @return {numberList}
	 * tags:count
	 */
	List__List.prototype.countOccurrences = function() { //TODO: more efficient
	  var occurrences = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    occurrences[i] = this.indexesOf(this[i]).length;
	  }
	  return occurrences;
	};

	/**
	 * returns a table with a list of non repeated elements and a list with the numbers of occurrences for each one
	 * @param  {Boolean} sortListsByOccurrences if true both lists in the table will be sorted by number of occurences (most frequent on top), true by default
	 * @return {Table} list (non-repeated elements) and numberList (frequency of each element)
	 * tags:count
	 */
	List__List.prototype.getElementsRepetitionCount = function(sortListsByOccurrences) {
	  sortListsByOccurrences = sortListsByOccurrences == null ? true : sortListsByOccurrences;

	  var obj;
	  var elementList = new List__List();
	  var numberList = new NumberList__default();
	  var nElements = this.length;
	  var index;

	  for(i = 0; i < nElements; i++) {
	    obj = this[i];
	    index = elementList.indexOf(obj);
	    if(index != -1) {
	      numberList[index]++;
	    } else {
	      elementList.push(obj);
	      numberList.push(1);
	    }
	  }

	  var table = new Table__default();
	  table.push(elementList);
	  table.push(numberList);
	  if(sortListsByOccurrences) {
	    // var indexArray=numberList.getSortIndexes();//sortNumericIndexed();
	    // var j;
	    // for(j=0; j<table.length; j++){
	    //  table[j]=table[j].clone().sortOnIndexes(indexArray);
	    // }
	    table = table.getListsSortedByList(numberList, false);
	  }

	  return table;
	};

	List__List.prototype.allElementsEqual = function() {
	  var i;
	  if(this.length < 2) return true;

	  first = this[0];

	  for(i = 1; this[i] != null; i++) {
	    if(this[i] != first) return false;
	  }

	  return true;
	};


	List__List.prototype.getMostRepeatedElement = function() { //TODO: this method should be more efficient
	  return ListOperators.countElementsRepetitionOnList(this, true)[0][0];
	};

	/**
	 * get minimum value
	 * @return {Number}
	 * tags:
	 */
	List__List.prototype.getMin = function() {
	  if(this.length == 0) return null;
	  var min = this[0];
	  var i;
	  for(i = 1; i < this.length; i++) {
	    min = Math.min(min, this[i]);
	  }
	  return min;
	};

	/**
	 * get maximum value
	 * @return {Number}
	 * tags:
	 */
	List__List.prototype.getMax = function() {
	  if(this.length == 0) return null;
	  var max = this[0];
	  var i;
	  for(i = 1; i < this.length; i++) {
	    max = Math.max(max, this[i]);
	  }
	  return max;
	};

	List__List.prototype.add = function(value) {
	  if(value.constructor == Number) {
	    var i;
	    var array = instantiateWithSameType(this);
	    for(i = 0; i < this.length; i++) {
	      array.push(this[i] + value);
	    }
	    return array;
	  }
	};

	/**
	 * selects a random element from list
	 * @return {Object}
	 * tags:
	 */
	List__List.prototype.getRandomElement = function() {
	  return this[Math.floor(this.length * Math.random())];
	};

	/**
	 * creates a list with randomly selected elements
	 * @param  {Number} n number of elements
	 * @param  {Boolean} avoidRepetitions
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getRandomElements = function(n, avoidRepetitions) {
	  avoidRepetitions = avoidRepetitions == null ? true : avoidRepetitions;
	  n = Math.min(n, this.length);
	  var newList = instantiateWithSameType(this);
	  var element;

	  while(newList.length < n) {
	    element = this[Math.floor(this.length * Math.random())];
	    if(!avoidRepetitions || newList.indexOf(element) == -1) newList.push(element);
	  }
	  return newList;
	};


	List__List.prototype.containsElement = function(element) { //TODO: test if this is faster than indexOf
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(this[i] == element) return true;
	  }
	  return false;
	};

	List__List.prototype.indexOfElement = function(element) { //TODO: test if this is faster than indexOf
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(this[i] == element) return i;
	  }
	  return -1;
	};



	/**
	 * return a list of values of a property of all elements
	 * @param  {String} propertyName
	 *
	 * @param  {Object} valueIfNull in case the property doesn't exist in the element
	 * @return {List}
	 * tags:
	 */
	List__List.prototype.getPropertyValues = function(propertyName, valueIfNull) {
	  var newList = new List__List();
	  newList.name = propertyName;
	  var val;
	  for(var i = 0; this[i] != null; i++) {
	    val = this[i][propertyName];
	    newList[i] = (val == null ? valueIfNull : val);
	  }
	  return newList.getImproved();
	};

	List__List.prototype.sortIndexed = function() {
	  var index = [];
	  var i;
	  for(i = 0; i < this.length; i++) {
	    index.push({
	      index: i,
	      value: this[i]
	    });
	  }
	  var comparator = function(a, b) {
	    var array_a = a.value;
	    var array_b = b.value;

	    return array_a < array_b ? -1 : array_a > array_b ? 1 : 0;
	  };
	  index = index.sort(comparator);
	  var result = new NumberList__default();
	  for(i = 0; i < index.length; i++) {
	    result.push(index[i].index);
	  }
	  return result;
	};

	// List.prototype.sortNumericIndexed=function() {
	//  var index = new Array();
	//  var i;
	//  for(i=0; i<this.length; i++){
	//      index.push({index:i, value:this[i]});
	//  }
	//  var comparator = function(a, b) {
	//      var array_a = a.value;
	//      var array_b = b.value;;

	//      return array_a - array_b;
	//  }
	//  index=index.sort(comparator);
	//  var result = new NumberList();
	//  for(i=0; i<index.length; i++){
	//      result.push(index[i].index);
	//  }
	//  return result;
	// }

	// List.prototype.sortNumeric=function(descendant){
	//  var comparator;
	//  if(descendant){
	//    var comparator=function(a, b){
	//      return b - a;
	//    }
	//  } else {
	//    var comparator=function(a, b){
	//      return a - b;
	//    }
	//  }
	//  return this.sort(comparator);
	// }

	List__List.prototype.sortOnIndexes = function(indexes) {
	  var result = instantiateWithSameType(this);
	  result.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(indexes[i] != -1) result.push(this[indexes[i]]);
	  }
	  return result;
	};

	List__List.prototype.getSortedByProperty = function(propertyName, ascending) {
	  ascending = ascending == null ? true : ascending;

	  var comparator;
	  if(ascending) {
	    comparator = function(a, b) {
	      return a[propertyName] > b[propertyName] ? 1 : -1;
	    };
	  } else {
	    comparator = function(a, b) {
	      return b[propertyName] > a[propertyName] ? 1 : -1;
	    };
	  }
	  return this.clone().sort(comparator);
	};

	/**
	 * return a sorted version of the list
	 *
	 * @param  {Boolean} ascending sort (true by default)
	 * @return {List}
	 * tags:sort
	 */
	List__List.prototype.getSorted = function(ascending) {
	  ascending = ascending == null ? true : ascending;

	  var comparator;
	  if(ascending) {
	    comparator = function(a, b) {
	      return a > b ? 1 : -1;
	    };
	  } else {
	    comparator = function(a, b) {
	      return a > b ? -1 : 1;
	    };
	  }
	  return this.clone().sort(comparator);
	};

	/**
	 * sort the list by a list
	 * @param  {List} list used to sort (numberList, stringList, dateList…)
	 *
	 * @param  {Boolean} ascending (true by default)
	 * @return {List} sorted list (of the same type)
	 * tags:sort
	 */
	List__List.prototype.getSortedByList = function(list, ascending) {
	  ascending = ascending == null ? true : ascending;

	  var pairsArray = [];
	  var i;

	  for(i = 0; this[i] != null; i++) {
	    pairsArray[i] = [this[i], list[i]];
	  }

	  var comparator;
	  if(ascending) {
	    comparator = function(a, b) {
	      return a[1] < b[1] ? -1 : 1;
	    };
	  } else {
	    comparator = function(a, b) {
	      return a[1] < b[1] ? 1 : -1;
	    };
	  }

	  pairsArray = pairsArray.sort(comparator);

	  var newList = instantiateWithSameType(this);
	  newList.name = this.name;

	  for(i = 0; this[i] != null; i++) {
	    newList[i] = pairsArray[i][0];
	  }

	  return newList;
	};


	/**
	 * returns a copy of the list with random sorting
	 * @return {List}
	 * tags:sort
	 */
	List__List.prototype.getSortedRandom = function() {
	  var newList = this.clone();
	  newList.name = this.name;
	  newList.sort(function(a, b) {
	    return Math.random() < 0.5 ? 1 : -1;
	  });
	  return newList;
	};

	/**
	 * returns a numberList with the indexes (positions) of an element
	 * @param  {Object} element
	 * @return {NumberList}
	 * tags:
	 */
	List__List.prototype.indexesOf = function(element) {
	  var index = this.indexOf(element);
	  var numberList = new NumberList__default();
	  while(index != -1) {
	    numberList.push(index);
	    index = this.indexOf(element, index + 1);
	  }
	  return numberList;
	};

	/**
	 * return a numberList with indexes (first position) of elements in a list
	 * @param  {List} elements
	 * @return {NumberList}
	 * tags:
	 */
	List__List.prototype.indexOfElements = function(elements) {
	  var numberList = new NumberList__default();
	  for(var i = 0; elements[i] != null; i++) {
	    numberList[i] = this.indexOf(elements[i]);
	  }
	  return numberList;
	};

	/**
	 * returns the first element (or index) of an element in the with a given name
	 * @param  {String} name of element
	 * @param  {Boolean} returnIndex if true returns the index of element (false by default)
	 * @return {List}
	 * tags: filter
	 */
	List__List.prototype.getFirstElementByName = function(name, returnIndex) {
	  for(var i = 0; this[i] != null; i++) {
	    if(this[i].name == name) return returnIndex ? i : this[i];
	  }
	  return returnIndex ? -1 : null;
	};

	/**
	 * returns the first element from each name ([!] to be tested)
	 * @param  {StringList} names of elements to be filtered
	 * @param  {Boolean} returnIndexes if true returns the indexes of elements (false by default)
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getElementsByNames = function(names, returnIndex) {
	  var list = returnIndex ? new NumberList__default() : new List__List();
	  var i;

	  names.forEach(function(name) {
	    for(i = 0; this[i] != null; i++) {
	      if(this[i].name == name) {
	        list.push(returnIndex ? i : this[i]);
	        break;
	      }
	    }
	    list.push(returnIndex ? -1 : null);
	  });

	  return returnIndex ? list : list.getImproved();
	};


	/**
	 * get first elemenet that has some property with a given value
	 * @param  {String} propertyName name of property
	 * @param  {Object} value value of property
	 * @return {Object}
	 * tags:
	 */
	List__List.prototype.getFirstElementByPropertyValue = function(propertyName, value) {
	  for(var i = 0; this[i] != null; i++) {
	    if(this[i][propertyName] == value) return this[i];
	  }
	  return null;
	};

	List__List.prototype.indexOfByPropertyValue = function(propertyName, value) {
	  for(var i = 0; this[i] != null; i++) {
	    if(this[i][propertyName] == value) return i;
	  }
	  return -1;
	};



	/**
	 * filters the list by booleans (also accepts numberList with 0s as false a any other number as true)
	 * @param  {List} booleanList booleanList or numberList
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getFilteredByBooleanList = function(booleanList) {
	  var newList = new List__List();
	  newList.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(booleanList[i]) newList.push(this[i]);
	  }
	  return newList.getImproved();
	};

	/**
	 * filters a list by its elements, and a type of comparison (equal by default)
	 * @param  {Object} value object (for equal or different comparison) or number or date (for equal, different, greater, lesser)
	 * @param  {String} comparison equal (default), different, greater, lesser
	 * @return {List} filtered list
	 * tags:filter
	 */
	List__List.prototype.getFilteredByValue = function(value, comparison) {
	  comparison = comparison == null ? "equal" : comparison;

	  var newList = new List__List();
	  newList.name = "filtered_" + this.name;
	  var i;
	  switch(comparison) {
	    case "equal":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] == propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "different":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] != propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "greater":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "lower":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
	      }
	      break;
	  }

	  return newList.getImproved();
	};

	/**
	 * filters a list by the values of a property on its elements, and a type of comparison (equal by default)
	 * @param  {String} propertyName name of property
	 * @param  {Object} propertyValue object (for equal or different comparison) or number or date (for equal, different, greater, lesser)
	 * @param  {String} comparison equal (default), different, greater, lesser
	 * @return {List} filtered list
	 * tags:filter
	 */
	List__List.prototype.getFilteredByPropertyValue = function(propertyName, propertyValue, comparison) {
	  comparison = comparison == null ? "equal" : comparison;

	  var newList = new List__List();
	  newList.name = "filtered_" + this.name;
	  var i;
	  switch(comparison) {
	    case "equal":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] == propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "different":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] != propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "greater":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
	      }
	      break;
	    case "lower":
	      for(i = 0; this[i] != null; i++) {
	        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
	      }
	      break;
	  }

	  return newList.getImproved();
	};

	/**
	 * conert a list into a NumberList
	 * @return {NumberList}
	 * tags:conversion
	 */
	List__List.prototype.toNumberList = function() {
	  var numberList = new NumberList__default();
	  numberList.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    numberList[i] = Number(this[i]);
	  }
	  return numberList;
	};

	/**
	 * convert a list into a StringList
	 * @return {StringList}
	 * tags:conversion
	 */
	List__List.prototype.toStringList = function() {
	  var i;
	  var stringList = new StringList__default();
	  stringList.name = this.name;
	  for(i = 0; this[i] != null; i++) {
	    if(typeof this[i] == 'number') {
	      stringList[i] = String(this[i]);
	    } else {
	      stringList[i] = this[i].toString();
	    }
	  }
	  return stringList;
	};

	List__List.prototype.applyFunction = function(func) { //TODO: to be tested!
	  var newList = new List__List();
	  newList.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    newList[i] = func(this[i]);
	  }
	  return newList.getImproved();
	};


	//filtering

	List__List.prototype.getWithoutElementsAtIndexes = function(indexes) { //[!] This DOESN'T transforms the List
	  var i;
	  if(this.type == 'List') {
	    var newList = new List__List();
	  } else {
	    newList = instantiate(typeOf(this));
	  }
	  for(i = 0; i < this.length; i++) {
	    if(indexes.indexOf(i) == -1) {
	      newList.push(this[i]);
	    }
	  }
	  if(this.type == 'List') return newList.getImproved();
	  return newList;
	};

	/**
	 * removes an element and returns a new list
	 * @param  {Number} index of element to remove
	 * @return {List}
	 * tags:filter
	 */
	List__List.prototype.getWithoutElementAtIndex = function(index) {
	  if(this.type == 'List') {
	    var newList = new List__List();
	  } else {
	    var newList = instantiateWithSameType(this);
	  }
	  for(var i = 0; this[i] != null; i++) {
	    if(i != index) {
	      newList.push(this[i]);
	    }
	  }
	  newList.name = this.name;
	  if(this.type == 'List') return newList.getImproved();
	  return newList;
	};

	List__List.prototype.getWithoutElement = function(element) {
	  var index = this.indexOf(element);
	  if(index == -1) return this;

	  if(this.type == 'List') {
	    var newList = new List__List();
	  } else {
	    var newList = instantiateWithSameType(this);
	  }

	  newList.name = this.name;

	  var i;
	  for(i = 0; this[i] != null; i++) {
	    if(i != index) newList.push(this[i]);
	  }

	  if(this.type == 'List') return newList.getImproved();
	  return newList;
	};

	List__List.prototype.getWithoutElements = function(list) {
	  if(this.type == 'List') {
	    var newList = new List__List();
	  } else {
	    var newList = instantiateWithSameType(this);
	  }
	  for(var i = 0; this[i] != null; i++) {
	    if(list.indexOf(this[i]) == -1) {
	      newList.push(this[i]);
	    }
	  }
	  newList.name = this.name;
	  if(this.type == 'List') return newList.getImproved();
	  return newList;
	};


	List__List.prototype.getFilteredByFunction = function(func) {
	  var newList = instantiateWithSameType(this);
	  for(var i = 0; this[i] != null; i++) {
	    if(func(this[i])) {
	      newList.push(this[i]);
	    }
	  }
	  newList.name = this.name;
	  if(this.type == 'List') return newList.getImproved();
	  return newList;
	};

	List__List.prototype.concat = function() {
	  if(arguments[0] == null) return this;

	  //c.l('concat | arguments[0].type, this.type', arguments[0].type, this.type);

	  if(arguments[0].type == this.type) {
	    if(this.type == "NumberList") {
	      return NumberList__default.fromArray(this._concat.apply(this, arguments), false);
	    } else if(this.type == "StringList") {
	      return StringList__default.fromArray(this._concat.apply(this, arguments), false);
	    } else if(this.type == "NodeList") { //[!] concat breaks the getNodeById in NodeList
	      return NodeList.fromArray(this._concat.apply(this, arguments), false);
	    } else if(this.type == "DateList") {
	      return DateList.fromArray(this._concat.apply(this, arguments), false);
	    } else if(this.type == "Table") {
	      return Table__default.fromArray(this._concat.apply(this, arguments), false);
	    } else if(this.type == "NumberTable") {
	      return NumberTable__default.fromArray(this._concat.apply(this, arguments), false);
	    }
	  }
	  return List__List.fromArray(this._concat.apply(this, arguments)).getImproved();
	};



	List__List.prototype.getReport = function(level) { //TODO:complete
	  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
	  var text = level > 0 ? (ident + "////report of instance of List////") : "///////////report of instance of List//////////";

	  var length = this.length;
	  var i;

	  text += ident + "name: " + this.name;
	  text += ident + "type: " + this.type;

	  if(length == 0) {
	    text += ident + "single element: [" + this[0] + "]";
	    return text;
	  } else {
	    text += ident + "length: " + length;
	    text += ident + "first element: [" + this[0] + "]";
	  }

	  switch(this.type) {
	    case "NumberList":
	      var min = this.getMin();
	      var max = this.getMax();
	      var average = (min + max) * 0.5;
	      text += ident + "min: " + min;
	      text += ident + "max: " + max;
	      text += ident + "average: " + average;
	      if(length < 101) {
	        text += ident + "numbers: " + this.join(", ");
	      }
	      break;
	    case "StringList":
	    case "List":
	      var freqTable = this.getElementsRepetitionCount(true);
	      text += ident + "number of different elements: " + freqTable[0].length;
	      if(freqTable[0].length < 10) {
	        text += ident + "elements frequency:";
	      } else {
	        text += ident + "some elements frequency:";
	      }

	      for(i = 0; freqTable[0][i] != null && i < 10; i++) {
	        text += ident + "  [" + String(freqTable[0][i]) + "]: " + freqTable[1][i];
	      }

	      var joined;
	      if(this.type == "List") {
	        joined = this.join("], [");
	      } else {
	        joined = this.toStringList().join("], [");
	      }

	      if(joined.length < 2000) text += ident + "strings: [" + joined + "]";
	      break;

	  }

	  ///add ideas to: analyze, visualize


	  return text;
	};


	////transformations

	List__List.prototype.pushIfUnique = function(element) {
	  if(this.indexOf(element) != -1) return; //TODO: implement equivalence
	  this.push(element);
	};

	List__List.prototype.removeElements = function(elements) { //TODO: make it more efficient (avoiding the splice method)
	  for(var i = 0; i < this.length; i++) {
	    if(elements.indexOf(this[i]) > -1) {
	      this.splice(i, 1);
	      i--;
	    }
	  }
	};

	List__List.prototype.removeElement = function(element) {
	  var index = this.indexOf(element);
	  if(index != -1) this.splice(index, 1);
	};

	List__List.prototype.removeElementAtIndex = function(index) { //deprecated
	  this.splice(index, 1);
	};

	List__List.prototype.removeElementsAtIndexes = function(indexes) {
	  indexes = indexes.sort(function(a, b) {
	    return a - b;
	  });

	  for(var i = 0; indexes[i] != null; i++) {
	    this.splice(indexes[i] - i, 1);
	  }
	};

	List__List.prototype.removeRepetitions = function() {
	  for(var i = 0; this[i] != null; i++) {
	    if(this.indexOf(this[i], i + 1) != -1) {
	      this.splice(i, 1);
	    }
	  }
	};

	List__List.prototype.replace = function(elementToFind, elementToInsert) {
	  var l = this.length;
	  for(var i = 0; i < l; i++) {
	    if(this[i] == elementToFind) this[i] = elementToInsert;
	  }
	};

	/**
	 * assign value to property name on all elements
	 * @param  {StringList} names
	 * @return {List}
	 * tags:transform
	 */
	List__List.prototype.assignNames = function(names) {
	  if(names == null) return this;
	  var n = names.length;

	  this.forEach(function(element, i) {
	    element.name = names[i % n];
	  });

	  return this;
	};

	List__List.prototype.splice = function() { //TODO: replace
	  switch(this.type) {
	    case 'NumberList':
	      return NumberList__default.fromArray(this._splice.apply(this, arguments));
	      break;
	    case 'StringList':
	      return StringList__default.fromArray(this._splice.apply(this, arguments));
	      break;
	    case 'NodeList':
	      return NodeList.fromArray(this._splice.apply(this, arguments));
	      break;
	    case 'DateList':
	      return DateList.fromArray(this._splice.apply(this, arguments));
	      break;
	  }
	  return List__List.fromArray(this._splice.apply(this, arguments)).getImproved();
	};

	List__List.prototype.destroy = function() {
	  for(var i = 0; this[i] != null; i++) {
	    delete this[i];
	  }
	};

	exports.List = List__default;

	DateList.prototype = new List__default();
	DateList.prototype.constructor = DateList;

	/**
	 * @classdesc A {@link List} for storing Dates.
	 *
	 * @description Creates a new DateList.
	 * @constructor
	 * @category dates
	 */
	function DateList() {
	  var args = [];
	  for(var i = 0; i < arguments.length; i++) {
	    args[i] = Number(arguments[i]);
	  }
	  var array = List__default.apply(this, args);
	  array = DateList.fromArray(array);
	  //
	  return array;
	}



	DateList.fromArray = function(array, forceToDate) {
	  forceToDate = forceToDate == null ? true : forceToDate;
	  var result = List__default.fromArray(array);

	  if(forceToDate) {
	    for(var i = 0; i < result.length; i++) {
	      result[i] = Date(result[i]);
	    }
	  }

	  result.type = "DateList";
	  //assign methods to array:
	  result.getTimes = DateList.prototype.getTimes;
	  result.toStringList = DateList.prototype.toStringList;
	  result.getMin = DateList.prototype.getMin;
	  result.getMax = DateList.prototype.getMax;
	  return result;
	};

	/**
	 * get a numberList of time (milliseconds) values
	 * @return {NumberList}
	 * tags:conversor
	 */
	DateList.prototype.getTimes = function() {
	  var i;
	  var numberList = new NumberList__default();
	  for(i = 0; this[i] != null; i++) {
	    numberList.push(this[i].getTime());
	  }
	  return numberList;
	};


	DateList.prototype.toStringList = function() {
	  var stringList = new StringList__default();
	  for(var i = 0; this[i] != null; i++) {
	    stringList[i] = DateOperators__default.dateToString(this[i]);
	  }
	  return stringList;
	};

	DateList.prototype.getMin = function() {
	  if(this.length === 0) return null;
	  var min = this[0];
	  var i;
	  for(i = 1; this[i] != null; i++) {
	    min = min < this[i] ? min : this[i];
	  }
	  return min;
	};

	DateList.prototype.getMax = function() {
	  if(this.length === 0) return null;
	  var max = this[0];
	  var i;
	  for(i = 1; this[i] != null; i++) {
	    max = max > this[i] ? max : this[i];
	  }
	  return max;
	};

	exports.DateList = DateList;

	StringList__StringList.prototype = new List__default();
	StringList__StringList.prototype.constructor = StringList__StringList;

	/**
	 * @classdesc {@link List} for storing Strings.
	 *
	 * @constructor
	 * @description Creates a new StringList
	 * @category strings
	 */
	function StringList__StringList() {
	  var args = []; //TODO:why this?, ask M

	  for(var i = 0; i < arguments.length; i++) {
	    args[i] = String(arguments[i]);
	  }
	  var array = List__default.apply(this, args);
	  array = StringList__StringList.fromArray(array);
	  //
	  return array;
	}
	var StringList__default = StringList__StringList;

	StringList__StringList.fromArray = function(array, forceToString) {
	  forceToString = forceToString == null ? true : forceToString;

	  var result = List__default.fromArray(array);
	  if(forceToString) {
	    for(var i = 0; i < result.length; i++) {
	      result[i] = String(result[i]);
	    }
	  }
	  result.type = "StringList";

	  //assign methods to array:
	  result.getLengths = StringList__StringList.prototype.getLengths;
	  result.toLowerCase = StringList__StringList.prototype.toLowerCase;
	  result.toUpperCase = StringList__StringList.prototype.toUpperCase;
	  result.append = StringList__StringList.prototype.append;
	  result.getSurrounded = StringList__StringList.prototype.getSurrounded;
	  result.replace = StringList__StringList.prototype.replace;
	  result.getConcatenated = StringList__StringList.prototype.getConcatenated;
	  result.toNumberList = StringList__StringList.prototype.toNumberList;
	  result.toDateList = StringList__StringList.prototype.toDateList;
	  result.trim = StringList__StringList.prototype.trim;

	  //override
	  result.clone = StringList__StringList.prototype.clone;

	  return result;
	};

	/**
	 * overrides List.prototype.getLengths (see comments there)
	 */
	StringList__StringList.prototype.getLengths = function() {
	  var lengths = new NumberList__default();
	  var string;

	  this.forEach(function(string) {
	    lengths.push(string.length);
	  });

	  return lengths;
	};

	StringList__StringList.prototype.append = function(sufix, after) {
	  after = after == null ? true : after;
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;
	  var sufixIsStringList = ClassUtils__typeOf(sufix) == "StringList";
	  var i;
	  if(after) {
	    for(i = 0; this[i] != null; i++) {
	      newStringList[i] = this[i] + (sufixIsStringList ? sufix[i] : sufix);
	    }
	  } else {
	    for(i = 0; this[i] != null; i++) {
	      newStringList[i] = (sufixIsStringList ? sufix[i] : sufix) + this[i];
	    }
	  }
	  return newStringList;
	};

	/**
	 * prefix and sufix can be string or a StringList
	 */
	StringList__StringList.prototype.getSurrounded = function(prefix, sufix) {
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;
	  var i;

	  var prefixIsStringList = Array.isArray(prefix);
	  var sufixIsStringList = Array.isArray(sufix);

	  for(i = 0; this[i] != null; i++) {
	    newStringList[i] = (prefixIsStringList ? prefix[i] : prefix) + this[i] + (sufixIsStringList ? sufix[i] : sufix);
	  }

	  return newStringList;
	};


	//deprectaed, replaced by replaceInStrings
	StringList__StringList.prototype.replace = function(regExp, string) {
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;

	  for(var i = 0; this[i] != null; i++) {
	    newStringList[i] = this[i].replace(regExp, string);
	  }

	  return newStringList;
	};

	/**
	 * replaces in each string, a sub-string by a string
	 * @param  {String} subString sub-string to be replaced in each string
	 * @param  {String} replacement string to be placed instead
	 * @return {StringList}
	 * tags:
	 */
	StringList__StringList.prototype.replaceSubStringsInStrings = function(subString, replacement) {
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;

	  for(var i = 0; this[i] != null; i++) {
	    newStringList[i] = StringOperators__default.replaceString(string, subString, replacement);
	  }

	  return newStringList;
	};

	StringList__StringList.prototype.getConcatenated = function(separator) {
	  var i;
	  var string = "";
	  for(i = 0; this[i] != null; i++) {
	    string += this[i];
	    if(i < this.length - 1) string += separator;
	  }
	  return string;
	};


	StringList__StringList.prototype.toLowerCase = function() {
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    newStringList[i] = this[i].toLowerCase();
	  }
	  return newStringList;
	};

	StringList__StringList.prototype.toUpperCase = function() {
	  var newStringList = new StringList__StringList();
	  newStringList.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    newStringList[i] = this[i].toUpperCase();
	  }
	  return newStringList;
	};

	StringList__StringList.prototype.toNumberList = function() {
	  var numbers = new NumberList__default();
	  numbers.name = this.name;
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    numbers[i] = Number(this[i]);
	  }
	  return numbers;
	};


	/**
	 * converts a stringList into a dateList
	 *
	 * @param  {String} formatCase format cases:<br>0: MM-DD-YYYY<br>1: YYYY-MM-DD (standard Javascript conversion)
	 * @param  {String} separator "-" by default
	 * @return {DateList}
	 * tags:
	 */
	StringList__StringList.prototype.toDateList = function(formatCase, separator) {
	  var dateList = new DateList();
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    dateList.push(DateOperators__default.stringToDate(this[i], formatCase, separator));
	  }
	  return dateList;
	};

	/**
	 * trims all the strings on the stringList
	 * @return {StringList}
	 * tags:
	 */
	StringList__StringList.prototype.trim = function() {
	  var i;
	  var newStringList = new StringList__StringList();
	  for(i = 0; this[i] != null; i++) {
	    newStringList[i] = this[i].trim();
	  }
	  newStringList.name = this.name;
	  return newStringList;
	};

	///////overriding

	StringList__StringList.prototype.clone = function() {
	  var newList = StringList__StringList.fromArray(this.slice(), false);
	  newList.name = this.name;
	  return newList;
	};

	exports.StringList = StringList__default;

	function StringOperators__StringOperators() {}
	var StringOperators__default = StringOperators__StringOperators;

	StringOperators__StringOperators.ENTER = String.fromCharCode(13);
	StringOperators__StringOperators.ENTER2 = String.fromCharCode(10);
	StringOperators__StringOperators.ENTER3 = String.fromCharCode(8232);

	StringOperators__StringOperators.SPACE = String.fromCharCode(32);
	StringOperators__StringOperators.SPACE2 = String.fromCharCode(160);

	StringOperators__StringOperators.TAB = "	";
	StringOperators__StringOperators.TAB2 = String.fromCharCode(9);

	StringOperators__StringOperators.LINK_REGEX = /(^|\s+)(https*\:\/\/\S+[^\.\s+])/;
	StringOperators__StringOperators.MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	StringOperators__StringOperators.STOP_WORDS = StringList__default.fromArray("t,s,mt,rt,re,m,http,amp,a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your".split(","));

	/**
	 * splits a String by a character (entre by default)
	 * @param  {String} string
	 *
	 * @param  {String} character
	 * @return {StringList}
	 * tags:
	 */
	StringOperators__StringOperators.split = function(string, character) {
	  if(character == null) return StringOperators__StringOperators.splitByEnter(string);
	  return StringList__default.fromArray(string.split(character));
	};


	/**
	 * split a String by enter (using several codifications)
	 * @param  {String} string
	 * @return {StringList}
	 * tags:
	 */
	StringOperators__StringOperators.splitByEnter = function(string) {
	  if(string == null) return null;
	  var stringList = StringOperators__StringOperators.splitString(string, "\n");
	  if(stringList.length > 1) return stringList;
	  var stringList = StringOperators__StringOperators.splitString(string, StringOperators__StringOperators.ENTER2);
	  if(stringList.length > 1) return stringList;
	  var stringList = StringOperators__StringOperators.splitString(string, StringOperators__StringOperators.ENTER3);
	  if(stringList.length > 1) return stringList;
	  return new StringList__default(string);
	};


	/**
	 * replaces in a string ocurrences of a sub-string by another string (base in replace JavaScript method)
	 * @param  {String} string to be modified
	 * @param  {String} subString sub-string to be replaced
	 * @param  {String} replacement string to be placed instead
	 * @return {String}
	 * tags:
	 */
	StringOperators__StringOperators.replaceSubString = function(string, subString, replacement) {
	  if(string == null || subString == null || replacement == null) return null;
	  return string.replace(new RegExp(subString, "g"), replacement);
	};

	/**
	 * replaces in a string ocurrences of sub-strings by a string
	 * @param  {String} string to be modified
	 * @param  {StringList} subStrings sub-strings to be replaced
	 * @param  {String} replacement string to be placed instead
	 * @return {String}
	 * tags:
	 */
	StringOperators__StringOperators.replaceSubStringsByString = function(string, subStrings, replacement) {
	  if(subStrings == null) return;

	  var subString;

	  subStrings.forEach(function(subString) {
	    string = StringOperators__StringOperators.replaceSubString(string, subString, replacement);
	  });

	  return string;
	};

	/**
	 * replaces in a string ocurrences of sub-strings by strings (1-1)
	 * @param  {String} string to be modified
	 * @param  {StringList} subStrings sub-strings to be replaced
	 * @param  {StringList} replacements strings to be placed instead
	 * @return {String}
	 * tags:
	 */
	StringOperators__StringOperators.replaceSubStringsByStrings = function(string, subStrings, replacements) {
	  if(subStrings == null || replacements == null) return;

	  var nElements = Math.min(subStrings.length, replacements.length);
	  var i;
	  var subString;

	  for(i = 0; i < nElements; i++) {
	    string = StringOperators__StringOperators.replaceSubString(string, subStrings[i], replacements[i]);
	  }

	  return string;
	};



	/**
	 * return a substring
	 * @param  {String} string
	 *
	 * @param  {Number} i0 init index
	 * @param  {Number} length of ths substring (if null returns substring from i0 to the end)
	 * @return {String}
	 * tags:filter
	 */
	StringOperators__StringOperators.substr = function(string, i0, length) {
	  i0 = i0 || 0;
	  return string.substr(i0, length);
	};

	/**
	 * split a String by a separator (a String) and returns a StringList
	 * @param  {String} string
	 *
	 * @param  {String} separator
	 * @return {StringList}
	 * tags:
	 */
	StringOperators__StringOperators.splitString = function(string, separator) {
	  if(string == null) return null;
	  if(separator == null) separator = ",";
	  if(typeof separator == "string") separator = separator.replace("\\n", "\n");
	  if(string.indexOf(separator) == -1) return new StringList__default(string);
	  return StringList__default.fromArray(string.split(separator));
	};

	/**
	 * searches for two Strings within a String and returns the String in between
	 * @param  {String} text
	 * @param  {String} subString0
	 *
	 * @param  {String} subString1 if null returns the text after subString0
	 * @return {String}
	 * tags:filter
	 */
	StringOperators__StringOperators.getFirstTextBetweenStrings = function(text, subString0, subString1) {
	  var i0 = text.indexOf(subString0);
	  if(i0 == -1) return null;
	  if(subString1 == "" || subString1 == null) return text.substr(i0 + subString0.length);
	  var i1 = text.indexOf(subString1, i0 + subString0.length + 1);
	  if(i1 == -1) return text.substring(i0 + subString0.length);
	  return text.substr(i0 + subString0.length, i1 - (i0 + subString0.length));
	};

	/**
	 * searches all the Strings contained between two Strings in a String
	 * @param  {String} text
	 * @param  {String} subString0
	 * @param  {String} subString1
	 * @return {StringList}
	 * tags:filter
	 */
	StringOperators__StringOperators.getAllTextsBetweenStrings = function(text, subString0, subString1) { //TODO: improve using indexOf(string, START_INDEX)
	  if(text.indexOf(subString0) == -1) return new StringList__default();
	  var blocks = text.split(subString0);
	  var nBlocks = blocks.length;
	  var stringList = new StringList__default();
	  var block;
	  var index;
	  var i;
	  for(i = 1; i < nBlocks; i++) {
	    block = blocks[i];
	    if(subString1 == subString0) {
	      stringList.push(block);
	    } else {
	      index = block.indexOf(subString1);
	      if(index >= 0) {
	        stringList.push(block.substr(0, index));
	      }
	    }
	  }
	  return stringList;
	};

	/**
	 * associates a value to each text in a StringList, according to number of words containg in each StringList; one lists pushes to negative values, the other to positive. A classic use would be a primitive sentimental analisis using a list of positive adjectives and a list of negative ones
	 * @param  {String} string to be analized
	 * @param  {StringList} negativeStrings list of 'negative' words
	 * @param  {StringList} positiveStrings list of 'positive' words
	 *
	 * @param  {Boolean} normalizeBySize divide score by the string size
	 * @return {Number}
	 * tags:analysis
	 */
	StringOperators__StringOperators.countWordsDichotomyAnalysis = function(string, negativeStrings, positiveStrings, normalizeBySize) {
	  var val = 0;
	  negativeStrings.forEach(function(word) {
	    val -= StringOperators__StringOperators.countWordOccurrences(string, word);
	  });
	  positiveStrings.forEach(function(word) {
	    val += StringOperators__StringOperators.countWordOccurrences(string, word);
	  });
	  if(normalizeBySize) val /= string.length;
	  return val;
	};


	/**
	 * creates a list of urls contained in the html in <a> tags
	 * @param  {String} html to be analyzied
	 *
	 * @param {String} urlSource optional, if provided will be used to build complete urls
	 * @param {Boolean} removeHash if true removes the hastag (anchor) content of the url
	 * @return {StringList} list of urls
	 * tags:html
	 */
	StringOperators__StringOperators.getLinksFromHtml = function(html, urlSource, removeHash) {
	  var doc = document.createElement("html");
	  doc.innerHTML = html;

	  var i;
	  var links = doc.getElementsByTagName("a");
	  var originalUrl, url;
	  var urls = new StringList__default();
	  var index;
	  var urlSourceParts;
	  var parts, blocks;

	  urlSource = urlSource == "" ? null : urlSource;
	  removeHash = removeHash == null ? false : removeHash;

	  if(urlSource) {
	    urlSource = urlSource.trim();

	    if(urlSource.substr(-5) == ".html") {
	      urlSourceParts = urlSource.split("/");
	      urlSource = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/");
	    }
	    if(urlSource.indexOf(-1) == "/") urlSource = urlSource.substr(0, urlSource.length - 1);
	    urlSourceParts = urlSource.split("/");

	    var root = urlSource.replace("//", "**").split("/")[0].replace("**", "//");
	  }


	  for(i = 0; i < links.length; i++) {
	    originalUrl = url = links[i].getAttribute("href");
	    if(url == null) continue;

	    if(url.indexOf('=') != -1) url = url.split('=')[0];

	    //c.log(url);
	    if(urlSource && url.indexOf('http://') == -1 && url.indexOf('https://') == -1 && url.indexOf('wwww.') == -1 && url.indexOf('file:') == -1 && url.indexOf('gopher:') == -1 && url.indexOf('//') != 0) {
	      if(url.substr(0, 9) == "../../../") {
	        url = urlSourceParts.slice(0, urlSourceParts.length - 3).join("/") + "/" + url.substr(9);
	      } else if(url.substr(0, 6) == "../../") {
	        url = urlSourceParts.slice(0, urlSourceParts.length - 2).join("/") + "/" + url.substr(6);
	      } else if(url.substr(0, 3) == "../") {
	        url = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/") + "/" + url.substr(3);
	      } else if(url.charAt(0) == "/") {
	        url = root + url;
	      } else {
	        url = urlSource + "/" + url;
	      }
	    }
	    if(removeHash && url.indexOf("#") != -1) url = url.split('#')[0];
	    if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

	    index = url.indexOf('/../');
	    while(index != -1) {
	      blocks = url.split('/../');
	      parts = blocks[0].replace("//", "**").split("/");
	      url = parts.slice(0, parts.length - 1).join("/").replace("**", "//") + ("/" + blocks.slice(1).join("/../"));
	      index = url.indexOf('/../');
	    }

	    if(url.indexOf('./') != -1) {
	      parts = url.replace("//", "**").split("/");
	      if(parts[0].substr(-1) == ".") {
	        parts[0] = parts[0].substr(0, parts[0].length - 1);
	        url = parts.join('/').replace("**", "//");
	      }
	    }

	    url = url.trim();

	    if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

	    if(url == urlSource) continue;
	    //c.log(urlSource+' | '+originalUrl+' -> '+url);
	    urls.push(url);
	  }

	  urls = urls.getWithoutRepetitions();

	  return urls;
	};


	/**
	 * validates is string contains another string, as string or word (space or punctuation boundaries)
	 * @param {String} text string to be validated
	 * @param {String} string string or word to be searched
	 *
	 * @param {Boolean} asWord if true a word will be searched (false by default)
	 * @param {Boolean} caseSensitive (false by default)
	 * @return {Boolean} returns true if string or word is contained
	 */
	StringOperators__StringOperators.textContainsString = function(text, string, asWord, caseSensitive) {
	  text = caseSensitive ? string : text.toLowerCase();
	  string = caseSensitive ? string : string.toLowerCase();
	  return asWord ?
	    text.match(new RegExp("\\b" + string + "\\b")).length > 0 :
	    text.indexOf(string) != -1;
	};

	/**
	 * print a string in console
	 * @param  {String} string to be printed in console
	 * @param  {Boolean} frame  if true (default) prints ///////////////// on top and bottom
	 * tags:
	 */
	StringOperators__StringOperators.logInConsole = function(string, frame) {
	  frame = frame == null ? true : frame;
	  if(frame) c.log('///////////////////////////////////////////////////');
	  c.log(string);
	  if(frame) c.log('///////////////////////////////////////////////////');
	};




	//////


	StringOperators__StringOperators.getParenthesisContents = function(text, brackets) {
	  var contents = new StringList__default();

	  var subText = text;

	  var contentObject = StringOperators__StringOperators.getFirstParenthesisContentWithIndexes(text, brackets);

	  var nAttempts = 0;
	  while(contentObject.content != "" && contentObject.index1 < subText.length - 1 && nAttempts < text.length) {
	    contents.push(contentObject.content);
	    subText = subText.substr(contentObject.index1 + 2);
	    contentObject = StringOperators__StringOperators.getFirstParenthesisContentWithIndexes(subText, brackets);
	    nAttempts++;
	  }

	  return contents;
	};
	StringOperators__StringOperators.getFirstParenthesisContent = function(text, brackets) {
	  return StringOperators__StringOperators.getFirstParenthesisContentWithIndexes(text, brackets).content;
	};
	StringOperators__StringOperators.getFirstParenthesisContentWithIndexes = function(text, brackets) {
	  var open = brackets ? "[" : "(";
	  var close = brackets ? "]" : ")";

	  var openRegEx = brackets ? /\[/g : /\(/g;
	  var closeRegEx = brackets ? /\]/g : /\)/g;

	  var indexOpen = text.indexOf(open);

	  if(indexOpen == -1) return {
	    "content": "",
	    "index0": 0,
	    "index1": 0
	  };

	  var indexClose = text.indexOf(close);

	  var part = text.substring(indexOpen + 1, indexClose);

	  var openMatch = part.match(openRegEx);
	  var closeMatch = part.match(closeRegEx);

	  var nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);
	  var nAttempts = 0;


	  while((nOpen > 0 || indexClose == -1) && nAttempts < text.length) {
	    indexClose = text.indexOf(close, indexClose);
	    part = text.substring(indexOpen + 1, indexClose + 1);
	    indexClose++;
	    openMatch = part.match(openRegEx);
	    closeMatch = part.match(closeRegEx);
	    nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);

	    nAttempts++;
	  }
	  indexClose = text.indexOf(close, indexClose);

	  return {
	    "content": indexClose == -1 ? text.substring(indexOpen + 1) : text.substring(indexOpen + 1, indexClose),
	    "index0": indexOpen + 1,
	    "index1": indexClose == -1 ? (text.length - 1) : (indexClose - 1)
	  };
	};

	StringOperators__StringOperators.placeString = function(string, stringToPlace, index) {
	  return string.substr(0, index) + stringToPlace + string.substr(index + stringToPlace.length);
	};

	StringOperators__StringOperators.insertString = function(string, stringToInsert, index) {
	  return string.substr(0, index) + stringToInsert + string.substr(index);
	};

	StringOperators__StringOperators.removeEnters = function(string) {
	  return string.replace(/(\StringOperators.ENTER|\StringOperators.ENTER2|\StringOperators.ENTER3)/gi, " ");
	};

	StringOperators__StringOperators.removeTabs = function(string) {
	  return string.replace(/(\StringOperators.TAB|\StringOperators.TAB2|\t)/gi, "");
	};

	StringOperators__StringOperators.removePunctuation = function(string, replaceBy) {
	  replaceBy = replaceBy || "";
	  return string.replace(/[:,.;?!\(\)\"\']/gi, replaceBy);
	};

	StringOperators__StringOperators.removeDoubleSpaces = function(string) {
	  var retString = string;
	  var regExpr = RegExp(/  /);
	  while(regExpr.test(retString)) {
	    retString = retString.replace(regExpr, " ");
	  }
	  return retString;
	};

	StringOperators__StringOperators.removeInitialRepeatedCharacter = function(string, character) {
	  while(string.charAt(0) == character) string = string.substr(1);
	  return string;
	};


	/**
	 * takes plain text from html
	 * @param  {String} html
	 * @return {String}
	 * tags:
	 */
	StringOperators__StringOperators.removeHtmlTags = function(html) {
	  var tmp = document.createElement("DIV");
	  tmp.innerHTML = html;
	  return tmp.textContent || tmp.innerText;
	};

	StringOperators__StringOperators.removeLinks = function(text) {
	  text += ' ';
	  var regexp = /http:\/\/[a-zA-Z0-9\/\.]+( |:|;|\r|\t|\n|\v)/g;
	  return(text.replace(regexp, ' ')).substr(0, text.length - 2);
	};

	StringOperators__StringOperators.removeQuotes = function(string) { //TODO:improve
	  if(string.charAt(0) == "\"") string = string.substr(1);
	  if(string.charAt(string.length - 1) == "\"") string = string.substr(0, string.length - 1);
	  return string;
	};

	// StringOperators.trim = function(string){
	// 	return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	// }

	/**
	 * builds a stringList of words contained in the text
	 * @param  {String} string text to be analyzed
	 *
	 * @param  {Boolean} withoutRepetitions remove words repetitions
	 * @param  {Boolean} stopWords remove stop words
	 * @param  {Boolean} sortedByFrequency  sorted by frequency in text
	 * @param  {Boolean} includeLinks include html links
	 * @param  {Number} limit of words
	 * @param  {Number} minSizeWords minimal number of characters of words
	 * @return {StringList}
	 * tags:
	 */
	StringOperators__StringOperators.getWords = function(string, withoutRepetitions, stopWords, sortedByFrequency, includeLinks, limit, minSizeWords) {
	  if(string == null) return null;

	  minSizeWords = minSizeWords || 0;
	  withoutRepetitions = withoutRepetitions == null ? true : withoutRepetitions;
	  sortedByFrequency = sortedByFrequency == null ? true : sortedByFrequency;
	  includeLinks = includeLinks == null ? true : includeLinks;
	  limit = limit == null ? 0 : limit;

	  var i, j;

	  if(includeLinks) var links = string.match(StringOperators__StringOperators.LINK_REGEX);
	  string = string.toLowerCase().replace(StringOperators__StringOperators.LINK_REGEX, "");

	  var list = string.match(/\w+/g);
	  if(list == null) return new StringList__default();

	  if(includeLinks && links != null) list = list.concat(links);
	  list = StringList__default.fromArray(list).replace(/ /g, "");

	  if(stopWords != null) { //TODO:check before if all stopwrds are strings
	    //list.removeElements(stopWords);

	    for(i = 0; list[i] != null; i++) {
	      for(j = 0; stopWords[j] != null; j++) {
	        if((typeof stopWords[j]) == 'string') {
	          if(stopWords[j] == list[i]) {
	            list.splice(i, 1);
	            i--;
	            break;
	          }
	        } else if(stopWords[j].test(list[i])) {
	          list.splice(i, 1);
	          i--;
	          break;
	        }
	      }
	    }

	  }

	  if(minSizeWords > 0) {
	    for(i = 0; list[i] != null; i++) {
	      if(list[i].length < minSizeWords) {
	        list.splice(i, 1);
	        i--;
	      }
	    }
	  }

	  if(sortedByFrequency) {
	    if(withoutRepetitions) {
	      list = ListOperators.countElementsRepetitionOnList(list, true)[0];
	      if(limit != 0) list = list.substr(0, limit);

	      return list;
	    }

	    var occurrences = ListOperators.countOccurrencesOnList(list);
	    list = list.getSortedByList(occurrences);
	    if(limit != 0) list = list.substr(0, limit);

	    return list;
	  }

	  if(withoutRepetitions) {
	    list = list.getWithoutRepetitions();
	  }

	  if(limit != 0) list = list.splice(0, limit);
	  return list;
	};

	function removeAccentsAndDiacritics(string) {
	  var r = string.replace(new RegExp(/[àáâãäå]/g), "a");
	  r = r.replace(new RegExp(/æ/g), "ae");
	  r = r.replace(new RegExp(/ç/g), "c");
	  r = r.replace(new RegExp(/[èéêë]/g), "e");
	  r = r.replace(new RegExp(/[ìíîï]/g), "i");
	  r = r.replace(new RegExp(/ñ/g), "n");
	  r = r.replace(new RegExp(/[òóôõö]/g), "o");
	  r = r.replace(new RegExp(/œ/g), "oe");
	  r = r.replace(new RegExp(/[ùúûü]/g), "u");
	  r = r.replace(new RegExp(/[ýÿ]/g), "y");

	  r = r.replace(new RegExp(/[ÀÁÂÄÃ]/g), "A");
	  r = r.replace(new RegExp(/Æ/g), "AE");
	  r = r.replace(new RegExp(/Ç/g), "c");
	  r = r.replace(new RegExp(/[ÈÉÊË]/g), "E");
	  r = r.replace(new RegExp(/[ÌÍÎÏ]/g), "I");
	  r = r.replace(new RegExp(/Ñ/g), "N");
	  r = r.replace(new RegExp(/[ÒÓÔÖÕ]/g), "O");
	  r = r.replace(new RegExp(/Œ/g), "OE");
	  r = r.replace(new RegExp(/[ÙÚÛÜ]/g), "U");
	  r = r.replace(new RegExp(/[Ÿ]/g), "Y");

	  return r;
	};

	/**
	 * creates a table with frequent words and occurrences numbers
	 * @param  {String} string text to be analyzed
	 *
	 * @param  {StringList} stopWords
	 * @param  {Boolean} includeLinks
	 * @param  {Number} limit max size of rows
	 * @param  {Number} minSizeWords
	 * @return {Table} contains a list of words, and a numberList of occurrences
	 * tags:words
	 */
	StringOperators__StringOperators.getWordsOccurrencesTable = function(string, stopWords, includeLinks, limit, minSizeWords) {
	  if(string == null) return;
	  if(string.length == 0) return new Table(new StringList__default(), new NumberList());
	  var words = StringOperators__StringOperators.getWords(string, false, stopWords, false, includeLinks, limit, minSizeWords);

	  return ListOperators.countElementsRepetitionOnList(words, true, false, limit);
	};

	StringOperators__StringOperators.indexesOf = function(text, string) { //TODO:test
	  var index = text.indexOf(string);
	  if(index == -1) return new NumberList();
	  var indexes = new NumberList(index);
	  index = text.indexOf(string, index + 1);
	  while(index != -1) {
	    indexes.push(index);
	    index = text.indexOf(string, index + 1);
	  }
	  return indexes;
	};

	/**
	 * returns a string repeated a number of times
	 * @param  {String} text to be repeated
	 * @param  {Number} n number of repetitions
	 * @return {String}
	 * tags:
	 */
	StringOperators__StringOperators.repeatString = function(text, n) {
	  var i;
	  var newText = "";
	  for(i = 0; i < n; i++) {
	    newText += text;
	  }
	  return newText;
	};




	//counting / statistics

	StringOperators__StringOperators.countOccurrences = function(text, string) { //seems to be th emost efficient: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
	  var n = 0;
	  var index = text.indexOf(string);
	  while(index != -1) {
	    n++;
	    index = text.indexOf(string, index + string.length);
	  }
	  return n;
	};

	StringOperators__StringOperators.countWordOccurrences = function(string, word) {
	  var regex = new RegExp("\\b" + word + "\\b");
	  var match = string.match(regex);
	  return match == null ? 0 : match.length;
	};

	StringOperators__StringOperators.countStringsOccurrences = function(text, strings) {
	  var i;
	  var numberList = new NumberList();
	  for(i = 0; strings[i] != null; i++) {
	    numberList[i] = text.split(strings[i]).length - 1;
	  }
	  return numberList;
	};

	//validation

	StringOperators__StringOperators.validateEmail = function(text) {
	  return StringOperators__StringOperators.MAIL_REGEX.test(text);
	};
	StringOperators__StringOperators.validateUrl = function(text) {
	  return StringOperators__StringOperators.LINK_REGEX.test(text);
	};

	/*
	 * All these function are globally available since they are included in the Global class
	 */




	var TYPES_SHORT_NAMES_DICTIONARY = {"Null":"Ø","Object":"{}","Function":"F","Boolean":"b","Number":"#","Interval":"##","Array":"[]","List":"L","Table":"T","BooleanList":"bL","NumberList":"#L","NumberTable":"#T","String":"s","StringList":"sL","StringTable":"sT","Date":"d","DateInterval":"dd","DateList":"dL","Point":".","Rectangle":"t","Polygon":".L","RectangleList":"tL","MultiPolygon":".T","Point3D":"3","Polygon3D":"3L","MultiPolygon3D":"3T","Color":"c","ColorScale":"cS","ColorList":"cL","Image":"i","ImageList":"iL","Node":"n","Relation":"r","NodeList":"nL","RelationList":"rL","Network":"Nt","Tree":"Tr"}



	/*
	 * types are:
	 * number, string, boolean, date
	 * and all data models classes names
	 */
	function ClassUtils__typeOf(o) {
	  var type = typeof o;

	  if(type !== 'object') {
	    return type;
	  }

	  if(o === null) {
	    return 'null';
	  } else if(o.getDate != null) {
	    return 'date';
	  } else {
	    if(o.getType == null) return 'Object';
	    var objectType = o.getType();
	    return objectType;
	  }
	  c.log("[!] ERROR: could not detect type for ", o);
	}

	function VOID() {}

	function ClassUtils__instantiate(className, args) {
	  switch(className) {
	    case 'number':
	    case 'string':
	      return window[className](args);
	    case 'date':
	      if(!args || args.length == 0) return new Date();
	      if(args.length == 1) {
	        if(args[0].match(/\d*.-\d*.-\d*\D\d*.:\d*.:\d*/)) {
	          var dateArray = args[0].split(" ");
	          dateArray[0] = dateArray[0].split("-");
	          if(dateArray[1]) dateArray[1] = dateArray[1].split(":");
	          else dateArray[1] = new Array(0, 0, 0);
	          return new Date(Date.UTC(dateArray[0][0], Number(dateArray[0][1]) - 1, dateArray[0][2], dateArray[1][0], dateArray[1][1], dateArray[1][2]));
	        }
	        //
	        if(Number(args[0]) != "NaN") return new Date(Number(args[0]));
	        else return new Date(args[0]);
	      }
	      return new Date(Date.UTC.apply(null, args));
	      //
	    case 'boolean':
	      return window[className]((args == "false" || args == "0") ? false : true);
	    case 'List':
	    case 'Table':
	    case 'StringList':
	    case 'NumberList':
	    case 'NumberTable':
	    case 'NodeList':
	    case 'RelationList':
	    case 'Polygon':
	    case 'Polygon3D':
	    case 'PolygonList':
	    case 'DateList':
	    case 'ColorList':
	      return window[className].apply(window, args);
	    case null:
	    case undefined:
	    case 'undefined':
	      return null;
	  }
	  //generic instantiation of object:
	  var o, dummyFunction, cl;
	  cl = window[className]; // get reference to class constructor function
	  dummyFunction = function() {}; // dummy function
	  dummyFunction.prototype = cl.prototype; // reference same prototype
	  o = new dummyFunction(); // instantiate dummy function to copy prototype properties
	  cl.apply(o, args); // call class constructor, supplying new object as context

	  return o;
	}

	function getTextFromObject(value, type) {
	  if(value == null) return "Null";
	  if(value.isList) {
	    if(value.length == 0) return "[]";
	    var text = value.toString(); // value.length>6?value.slice(0, 5).forEach(function(v){return getTextFromObject(v, typeOf(v))}).join(','):value.toStringList().join(',').forEach(function(v, typeOf(v)){return getTextFromObject(v, type)});
	    if(text.length > 160) {
	      var i;
	      var subtext;
	      text = "[";
	      for(i = 0; (value[i] != null && i < 6); i++) {
	        subtext = getTextFromObject(value[i], ClassUtils__typeOf(value[i]));
	        if(subtext.length > 40) subtext = subtext.substr(0, 40) + (value[i].isList ? "…]" : "…");
	        text += (i != 0 ? ", " : "") + subtext;
	      }
	      if(value.length > 6) text += ",…";
	      text += "]";
	    }
	    return text;
	  }

	  switch(type) {
	    case "date":
	      return DateOperators.dateToString(value);
	    case "DateInterval":
	      return DateOperators.dateToString(value.date0) + " - " + DateOperators.dateToString(value.date1);
	    case "string":
	      return((value.length > 160) ? value.substr(0, 159) + "…" : value).replace(/\n/g, "↩");
	    case "number":
	      return String(value);
	    default:
	      return "{}"; //value.toString();
	  }
	}


	function ClassUtils__instantiateWithSameType(object, args) {
	  return ClassUtils__instantiate(ClassUtils__typeOf(object), args);
	}

	function isArray(obj) {
	  if(obj.constructor.toString().indexOf("Array") == -1)
	    return false;
	  else
	    return true;
	}
	Date.prototype.getType = function() {
	  return 'date';
	};



	function evalJavaScriptFunction(functionText, args, scope){
		if(functionText==null) return;

		var res;

		var myFunction;

		var good = true;
		var message = '';

		var realCode;

		var lines = functionText.split('\n');

		for(var i=0; lines[i]!=null; i++){
			lines[i] = lines[i].trim();
			if(lines[i] === "" || lines[i].substr(1)=="/"){
				lines.splice(i,1);
				i--;
			}
		}

		var isFunction = lines[0].indexOf('function')!=-1;

		functionText = lines.join('\n');

		if(isFunction){
			if(scope){
				realCode = "scope.myFunction = " + functionText;
			} else {
				realCode = "myFunction = " + functionText;
			}
		} else {
			if(scope){
				realCode = "scope.myVar = " + functionText;
			} else {
				realCode = "myVar = " + functionText;
			}
		}

		try{
			if(isFunction){
				eval(realCode);
				if(scope){
					res = scope.myFunction.apply(scope, args);
				} else {
					res = myFunction.apply(this, args);
				}
			} else {
				eval(realCode);
				if(scope){
					res = scope.myVar;
				} else 	{
					res = myVar;
				}
			}
		} catch(err){
			good = false;
			message = err.message;
			res = null;
		}


	  // var isFunction = functionText.split('\n')[0].indexOf('function') != -1;

	  // if(isFunction) {
	  //   realCode = "myFunction = " + functionText;
	  // } else {
	  //   realCode = "myVar = " + functionText;
	  // }


	  // try {
	  //   if(isFunction) {
	  //     eval(realCode);
	  //     res = myFunction.apply(this, args);
	  //   } else {
	  //     eval(realCode);
	  //     res = myVar;
	  //   }
	  // } catch(err) {
	  //   good = false;
	  //   message = err.message;
	  //   res = null;
	  // }

	  //c.l('resultObject', resultObject);

	  var resultObject = {
	    result: res,
	    success: good,
	    errorMessage: message
	  };

	  return resultObject;
	}

	function argumentsToArray(args) {
	  return Array.prototype.slice.call(args, 0);
	}







	function TimeLogger(name) {
	  var scope = this;
	  this.name = name;
	  this.clocks = {};

	  this.tic = function(clockName) {
	    scope.clocks[clockName] = new Date().getTime();
	    //c.l( "TimeLogger '"+clockName+"' has been started");
	  };
	  this.tac = function(clockName) {
	    if(scope.clocks[clockName] == null) {
	      scope.tic(clockName);
	    } else {
	      var now = new Date().getTime();
	      var diff = now - scope.clocks[clockName];
	      c.l("TimeLogger '" + clockName + "' took " + diff + " ms");
	    }
	  };
	}
	var tl = new TimeLogger("Global Time Logger");

	Point__Point.prototype = new DataModel();
	Point__Point.prototype.constructor = Point__Point;

	/**
	 * @classdesc Represents an individual 2D point in space.
	 *
	 * @description Creates a new Point
	 * @param {Number} x
	 * @param {Number} y
	 * @constructor
	 * @category geometry
	 */
	function Point__Point(x, y) {
	  DataModel.apply(this, arguments);
	  this.type = "Point";
	  this.x = Number(x) || 0;
	  this.y = Number(y) || 0;
	}
	var Point__default = Point__Point;


	Point__Point.prototype.getNorm = function() {
	  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};

	Point__Point.prototype.getAngle = function() {
	  return Math.atan2(this.y, this.x);
	};



	Point__Point.prototype.factor = function(k) {
	  if(k >= 0 || k < 0) return new Point__Point(this.x * k, this.y * k);
	  if(k.type != null && k.type == 'Point') return new Point__Point(this.x * k.x, this.y * k.y);
	};

	Point__Point.prototype.normalize = function() {
	  var norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	  return new Point__Point(this.x / norm, this.y / norm);
	};
	Point__Point.prototype.normalizeToValue = function(k) {
	  var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	  return new Point__Point(this.x * factor, this.y * factor);
	};



	Point__Point.prototype.subtract = function(point) {
	  return new Point__Point(this.x - point.x, this.y - point.y);
	};

	Point__Point.prototype.add = function(point) {
	  return new Point__Point(point.x + this.x, point.y + this.y);
	};

	Point__Point.prototype.addCoordinates = function(x, y) {
	  return new Point__Point(x + this.x, y + this.y);
	};

	Point__Point.prototype.distanceToPoint = function(point) {
	  return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
	};
	Point__Point.prototype.distanceToPointSquared = function(point) {
	  return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
	};
	Point__Point.prototype.angleToPoint = function(point) {
	  return Math.atan2(point.y - this.y, point.x - this.x);
	};
	Point__Point.prototype.expandFromPoint = function(point, factor) {
	  return new Point__Point(point.x + factor * (this.x - point.x), point.y + factor * (this.y - point.y));
	};


	Point__Point.prototype.interpolate = function(point, t) {
	  return new Point__Point((1 - t) * this.x + t * point.x, (1 - t) * this.y + t * point.y);
	};

	Point__Point.prototype.cross = function(point) {
	  return this.x * point.y - this.y * point.x;
	};

	Point__Point.prototype.dot = function(point) {
	  return this.x * point.x + this.y * point.y;
	};

	Point__Point.prototype.getRotated = function(angle, center) {
	  center = center == null ? new Point__Point() : center;

	  return new Point__Point(Math.cos(angle) * (this.x - center.x) - Math.sin(angle) * (this.y - center.y) + center.x, Math.sin(angle) * (this.x - center.x) + Math.cos(angle) * (this.y - center.y) + center.y);
	};



	Point__Point.prototype.clone = function() {
	  return new Point__Point(this.x, this.y);
	};
	Point__Point.prototype.toString = function() {
	  return "(x=" + this.x + ", y=" + this.y + ")";
	};


	Point__Point.prototype.destroy = function() {
	  delete this.type;
	  delete this.name;
	  delete this.x;
	  delete this.y;
	};

	exports.Point = Point__default;

	Interval__Interval.prototype = new Point__default();
	Interval__Interval.prototype.constructor = Interval__Interval;

	/**
	 * @classdesc Provide reasoning around numeric intervals.
	 *
	 * @constructor
	 * @param {Number} x Interval's x value
	 * @param {Number} y Interval's y value
	 * @description Creates a new Interval
	 * @category numbers
	 */
	function Interval__Interval(x, y) {
	  DataModel.apply(this, arguments);
	  this.x = Number(x);
	  this.y = Number(y);
	  this.type = "Interval";
	}
	var Interval__default = Interval__Interval;

	/**
	 * getMin - find the minimum value of the interval
	 *
	 * @return {Number} the minimum value in the interval
	 */
	Interval__Interval.prototype.getMin = function() {
	  return Math.min(this.x, this.y);
	};

	Interval__Interval.prototype.getMax = function() {
	  return Math.max(this.x, this.y);
	};

	Interval__Interval.prototype.getAmplitude = function() {
	  return Math.abs(this.x - this.y);
	};

	Interval__Interval.prototype.getSignedAmplitude = function() {
	  return this.x - this.y;
	};

	Interval__Interval.prototype.getMiddle = function() {
	  return(this.x + this.y) * 0.5;
	};

	Interval__Interval.prototype.getSign = function() {
	  if(this.x == this.y) return 0;
	  return this.getAmplitude() / this.getSignedAmplitude();
	};

	Interval__Interval.prototype.getScaled = function(value) {
	  var midAmp = 0.5 * (this.y - this.x);
	  var middle = (this.x + this.y) * 0.5;
	  return new Interval__Interval(middle - midAmp * value, middle + midAmp * value);
	};

	Interval__Interval.prototype.getScaledFromProportion = function(value, proportion) {
	  var antiP = 1 - proportion;
	  var amp0 = proportion * (this.y - this.x);
	  var amp1 = antiP * (this.y - this.x);
	  var middle = antiP * this.x + proportion * this.y;
	  return new Interval__Interval(middle - amp0 * value, middle + amp1 * value);
	};

	Interval__Interval.prototype.add = function(value) {
	  return new Interval__Interval(this.x + value, this.y + value);
	};

	Interval__Interval.prototype.invert = function() {
	  var swap = this.x;
	  this.x = this.y;
	  this.y = swap;
	};

	/**
	 * return a value in interval range
	 * 0 -> min
	 * 1 -> max
	 * @param value between 0 and 1 (to obtain values between min and max)
	 *
	 */
	Interval__Interval.prototype.getInterpolatedValue = function(value) {
	  return value * Number(this.getSignedAmplitude()) + this.x;
	};

	Interval__Interval.prototype.getInverseInterpolatedValue = function(value) {
	  return(value - this.x) / this.getSignedAmplitude();
	};
	Interval__Interval.prototype.getInterpolatedValues = function(numberList) {
	  var newNumberList = [];
	  var nElements = numberList.length;
	  for(var i = 0; i < nElements; i++) {
	    newNumberList.push(this.getInterpolatedValue(numberList[i]));
	  }
	  return newNumberList;
	};
	Interval__Interval.prototype.getInverseInterpolatedValues = function(numberList) {
	  var newNumberList = [];
	  var nElements = numberList.length;
	  for(var i = 0; i < nElements; i++) {
	    newNumberList.push(this.getInverseInterpolatedValue(numberList[i]));
	  }
	  return newNumberList;
	};

	Interval__Interval.prototype.intersect = function(interval) {
	  return new Interval__Interval(Math.max(this.x, interval.x), Math.min(this.y, interval.y));
	};

	/**
	 * create a new interval with the same proporties values
	 * @return {Interval}
	 *
	 */
	Interval__Interval.prototype.clone = function() {
	  var newInterval = new Interval__Interval(this.x, this.y);
	  newInterval.name = name;
	  return newInterval;
	};

	/**
	 * indicate wether a number is included in the interval
	 * @param value
	 * @return {Boolean}
	 *
	 */
	Interval__Interval.prototype.contains = function(value) {
	  if(this.y > this.x) return value >= this.x && value <= this.y;
	  return value >= this.y && value <= this.y;
	};

	/**
	 * indicate wether other interval contains the same values
	 * @param interval
	 * @return {Boolean}
	 *
	 */
	Interval__Interval.prototype.isEquivalent = function(interval) {
	  return this.x == interval.x && this.y == interval.y;
	};

	/**
	 * create a new interval with the same proporties values
	 * @return {String}
	 *
	 */

	Interval__Interval.prototype.toString = function() {
	  return "Interval[x:" + this.x + "| y:" + this.y + "| amplitude:" + this.getAmplitude() + "]";
	};

	exports.Interval = Interval__default;

	NumberList__NumberList.prototype = new List__default();
	NumberList__NumberList.prototype.constructor = NumberList__NumberList;

	/**
	 * @classdesc List structure for Numbers.
	 *
	 * @constructor
	 * @description Creates a new NumberList.
	 * @category numbers
	 */
	function NumberList__NumberList() {
	  var args = [];

	  for(var i = 0; i < arguments.length; i++) {
	    arguments[i] = Number(arguments[i]);
	  }
	  var array = List__default.apply(this, arguments);
	  array = NumberList__NumberList.fromArray(array);
	  //
	  return array;
	}
	var NumberList__default = NumberList__NumberList;

	NumberList__NumberList.fromArray = function(array, forceToNumber) {
	  forceToNumber = forceToNumber == null ? true : forceToNumber;

	  var result = List__default.fromArray(array);

	  if(forceToNumber) {
	    for(var i = 0; i < result.length; i++) {
	      result[i] = Number(result[i]);
	    }
	  }

	  result.type = "NumberList";

	  //assign methods to array:
	  result.unit = NumberList__NumberList.prototype.unit;
	  result.tenPower = NumberList__NumberList.prototype.tenPower;
	  result.getMin = NumberList__NumberList.prototype.getMin;
	  result.getMax = NumberList__NumberList.prototype.getMax;
	  result.getAmplitude = NumberList__NumberList.prototype.getAmplitude;
	  result.getMinMaxInterval = NumberList__NumberList.prototype.getMinMaxInterval;
	  result.getSum = NumberList__NumberList.prototype.getSum;
	  result.getProduct = NumberList__NumberList.prototype.getProduct;
	  result.getInterval = NumberList__NumberList.prototype.getInterval;
	  result.getNormalized = NumberList__NumberList.prototype.getNormalized;
	  result.getNormalizedToMax = NumberList__NumberList.prototype.getNormalizedToMax;
	  result.getNormalizedToSum = NumberList__NumberList.prototype.getNormalizedToSum;
	  result.toPolygon = NumberList__NumberList.prototype.toPolygon;

	  //statistics
	  result.getAverage = NumberList__NumberList.prototype.getAverage;
	  result.getNorm = NumberList__NumberList.prototype.getNorm;
	  result.getStandardDeviation = NumberList__NumberList.prototype.getStandardDeviation;
	  result.getVariance = NumberList__NumberList.prototype.getVariance;
	  result.getMedian = NumberList__NumberList.prototype.getMedian;
	  result.getQuantiles = NumberList__NumberList.prototype.getQuantiles;

	  //sorting
	  result.getSorted = NumberList__NumberList.prototype.getSorted;
	  result.getSortIndexes = NumberList__NumberList.prototype.getSortIndexes;
	  result.factor = NumberList__NumberList.prototype.factor;
	  result.add = NumberList__NumberList.prototype.add;
	  result.subtract = NumberList__NumberList.prototype.subtract;
	  result.divide = NumberList__NumberList.prototype.divide;
	  result.dotProduct = NumberList__NumberList.prototype.dotProduct;
	  result.distance = NumberList__NumberList.prototype.distance;
	  result.sqrt = NumberList__NumberList.prototype.sqrt;
	  result.pow = NumberList__NumberList.prototype.pow;
	  result.log = NumberList__NumberList.prototype.log;
	  result.isEquivalent = NumberList__NumberList.prototype.isEquivalent;
	  result.toStringList = NumberList__NumberList.prototype.toStringList;

	  //transform
	  result.approach = NumberList__NumberList.prototype.approach;

	  //override
	  result.clone = NumberList__NumberList.prototype.clone;
	  result._slice = Array.prototype.slice;
	  result.slice = NumberList__NumberList.prototype.slice;

	  return result;
	};
	NumberList__NumberList.prototype.unit = "";
	NumberList__NumberList.prototype.tenPower = 0;

	NumberList__NumberList.prototype.getMin = function() { //TODO:store result and retrieve while the NumberList doesn't change;
	  if(this.length == 0) return null;
	  var i;
	  var min = this[0];
	  for(i = 1; i < this.length; i++) {
	    min = Math.min(min, this[i]);
	  }
	  return min;
	};

	NumberList__NumberList.prototype.getMax = function() { //TODO:store result and retrieve while the NumberList doesn't change;
	  if(this.length == 0) return null;
	  var i;
	  var max = this[0];
	  for(i = 1; i < this.length; i++) {
	    max = Math.max(max, this[i]);
	  }
	  return max;
	};

	NumberList__NumberList.prototype.getAmplitude = function() {
	  if(this.length == 0) return 0;
	  var min = this[0];
	  var max = this[0];
	  for(var i = 1; this[i] != null; i++) {
	    min = Math.min(min, this[i]);
	    max = Math.max(max, this[i]);
	  }
	  return max - min;
	};

	NumberList__NumberList.prototype.getMinMaxInterval = function() { //deprecated?
	  return new Interval__default(this.getMin(), this.getMax());
	};

	/**
	 * returns the sum of values in the numberList
	 * @return {Number}
	 * tags:
	 */
	NumberList__NumberList.prototype.getSum = function() {
	  if(this.length == 0) return 0;
	  var i;
	  var sum = this[0];
	  for(i = 1; i < this.length; i++) {
	    sum += this[i];
	  }
	  return sum;
	};

	/**
	 * return the product of values in the numberList
	 * @return {Number}
	 * tags:
	 */
	NumberList__NumberList.prototype.getProduct = function() {
	  if(this.length == 0) return null;
	  var i;
	  var product = this[0];
	  for(i = 1; i < this.length; i++) {
	    product *= this[i];
	  }
	  return product;
	};

	/**
	 * returns a NumberList normalized to the sum
	 * @param {Number} factor optional
	 * @return {NumberList}
	 * tags:
	 */
	NumberList__NumberList.prototype.getNormalizedToSum = function(factor, sum) {
	  factor = factor == null ? 1 : factor;
	  var newNumberList = new NumberList__NumberList();
	  newNumberList.name = this.name;
	  if(this.length == 0) return newNumberList;
	  var i;
	  var sum = sum == null ? this.getSum() : sum;
	  if(sum == 0) return this.clone();

	  for(i = 0; i < this.length; i++) {
	    newNumberList.push(factor * this[i] / sum);
	  }
	  return newNumberList;
	};

	/**
	 * returns a numberList normalized to min-max interval
	 * @param {Number} factor optional
	 * @return {NumberList}
	 * tags:
	 */
	NumberList__NumberList.prototype.getNormalized = function(factor) {
	  factor = factor == null ? 1 : factor;

	  if(this.length == 0) return null;

	  var i;
	  var interval = this.getMinMaxInterval();
	  var a = interval.getAmplitude();
	  var newNumberList = new NumberList__NumberList();
	  for(i = 0; i < this.length; i++) {
	    newNumberList.push(factor * ((this[i] - interval.x) / a));
	  }
	  newNumberList.name = this.name;
	  return newNumberList;
	};

	/**
	 * returns a numberList normalized to Max
	 * @param {Number} factor optional
	 * @return {NumberList}
	 * tags:
	 */
	NumberList__NumberList.prototype.getNormalizedToMax = function(factor) {
	  factor = factor == null ? 1 : factor;

	  if(this.length == 0) return null;

	  var max = this.getMax();
	  if(max == 0) {
	    max = this.getMin();
	    if(max == 0) return ListGenerators.createListWithSameElement(this.length, 0);
	  }
	  var newNumberList = new NumberList__NumberList();
	  for(var i = 0; this[i] != null; i++) {
	    newNumberList.push(factor * (this[i] / max));
	  }
	  newNumberList.name = this.name;
	  return newNumberList;
	};

	/**
	 * builds an Interval witn min and max value from the numberList
	 * @return {Interval}
	 * tags:
	 */
	NumberList__NumberList.prototype.getInterval = function() {
	  if(this.length == 0) return null;
	  var max = this[0];
	  var min = this[0];
	  for(var i = 1; this[i] != null; i++) {
	    max = Math.max(max, this[i]);
	    min = Math.min(min, this[i]);
	  }
	  var interval = new Interval__default(min, max);
	  return interval;
	};


	NumberList__NumberList.prototype.toPolygon = function() {
	  if(this.length == 0) return null;
	  var polygon = new Polygon();
	  for(var i = 0; this[i + 1] != null; i += 2) {
	    polygon.push(new Point(this[i], this[i + 1]));
	  }
	  return polygon;
	};




	/////////statistics

	/**
	 * calculates mean of numberList
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getAverage = function() {
	  return this.getSum() / this.length;
	};

	/**
	 * calculates geometric mean of numberList
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getGeometricMean = function() {
	  var s = 0;
	  this.forEach(function(val) {
	    s += Math.log(val);
	  });
	  return Math.pow(Math.E, s / this.length);
	};

	/**
	 * calculates de norm of the numberList (treated as a vector)
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getNorm = function() {
	  var sq = 0;
	  for(var i = 0; this[i] != null; i++) {
	    sq += Math.pow(this[i], 2);
	  }
	  return Math.sqrt(sq);
	};

	/**
	 * calculates the variance of the numberList
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getVariance = function() {
	  var sd = 0;
	  var average = this.getAverage();
	  for(var i = 0; this[i] != null; i++) {
	    sd += Math.pow(this[i] - average, 2);
	  }
	  return sd / this.length;
	};

	/**
	 * calculates the standard deviation
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getStandardDeviation = function() {
	  return Math.sqrt(this.getVariance());
	};

	/**
	 * calculates the median of the numberList
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getMedian = function(nQuantiles) {
	  var sorted = this.getSorted(true);
	  var prop = (this.length - 1) / 2;
	  var entProp = Math.floor(prop);
	  var onIndex = prop == entProp;
	  var quantiles = new NumberList__NumberList();
	  return onIndex ? sorted[prop] : (0.5 * sorted[entProp] + 0.5 * sorted[entProp + 1]);
	};

	/**
	 * builds a partition of n quantiles from the numberList
	 * @param {Number} nQuantiles number of quantiles
	 * @return {Number}
	 * tags:statistics
	 */
	NumberList__NumberList.prototype.getQuantiles = function(nQuantiles) {
	  var sorted = this.getSorted(true);

	  var prop = this.length / nQuantiles;
	  var entProp = Math.floor(prop);
	  var onIndex = prop == entProp;
	  var quantiles = new NumberList__NumberList();
	  for(var i = 0; i < nQuantiles - 1; i++) {
	    quantiles[i] = onIndex ? sorted[(i + 1) * prop] : (0.5 * sorted[(i + 1) * entProp] + 0.5 * sorted[(i + 1) * entProp + 1]);
	  }
	  return quantiles;
	};



	/////////sorting

	NumberList__NumberList.prototype.getSorted = function(ascending) {
	  ascending = ascending == null ? true : ascending;

	  if(ascending) {
	    return NumberList__NumberList.fromArray(this.slice().sort(function(a, b) {
	      return a - b;
	    }), false);
	  }
	  return NumberList__NumberList.fromArray(this.slice().sort(function(a, b) {
	    return b - a;
	  }), false);
	};

	NumberList__NumberList.prototype.getSortIndexes = function(descending) {
	  if(descending == null) descending = true;

	  var pairs = [];
	  var newList = new NumberList__NumberList();

	  if(this.length == 0) return newList;

	  for(var i = 0; this[i] != null; i++) {
	    pairs.push([i, this[i]]);
	  }

	  if(descending) {
	    pairs.sort(function(a, b) {
	      if(a[1] < b[1]) return 1;
	      return -1;
	    });
	  } else {
	    pairs.sort(function(a, b) {
	      if(a[1] < b[1]) return -1;
	      return 1;
	    });
	  }

	  for(i = 0; pairs[i] != null; i++) {
	    newList.push(pairs[i][0]);
	  }
	  newList.name = this.name;
	  return newList;
	};

	NumberList__NumberList.prototype.factor = function(value) {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  for(i = 0; i < this.length; i++) {
	    newNumberList.push(this[i] * value);
	  }
	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.add = function(object) {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  var type = typeOf(object);

	  switch(type) {
	    case 'number':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] + object;
	      }
	      break;
	    case 'NumberList':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] + object[i % object.length];
	      }
	      break;
	  }

	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.subtract = function(object) {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  var type = typeOf(object);

	  switch(type) {
	    case 'number':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] - object;
	      }
	      break;
	    case 'NumberList':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] - object[i % object.length];
	      }
	      break;
	  }

	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.divide = function(object) {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  var type = typeOf(object);

	  switch(type) {
	    case 'number':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] / object;
	      }
	      break;
	    case 'NumberList':
	      for(i = 0; this[i] != null; i++) {
	        newNumberList[i] = this[i] / object[i % object.length];
	      }
	      break;
	  }

	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.sqrt = function() {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  for(i = 0; i < this.length; i++) {
	    newNumberList.push(Math.sqrt(this[i]));
	  }
	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.pow = function(power) {
	  var i;
	  var newNumberList = new NumberList__NumberList();
	  for(i = 0; i < this.length; i++) {
	    newNumberList.push(Math.pow(this[i], power));
	  }
	  newNumberList.name = this.name;
	  return newNumberList;
	};

	NumberList__NumberList.prototype.log = function(add) {
	  add = add || 0;

	  var i;
	  var newNumberList = new NumberList__NumberList();
	  for(i = 0; this[i] != null; i++) {
	    newNumberList[i] = Math.log(this[i] + add);
	  }
	  newNumberList.name = this.name;

	  return newNumberList;
	};

	NumberList__NumberList.prototype.dotProduct = function(numberList) {
	  var sum = 0;
	  var i;
	  var nElements = Math.min(this.length, numberList.length);
	  for(i = 0; i < nElements; i++) {
	    sum += this[i] * numberList[i];
	  }
	  return sum;
	};

	/**
	 * calculates Euclidean distance between two numberLists
	 * @param  {NumberList} numberList
	 * @return {Number}
	 * tags:
	 */
	NumberList__NumberList.prototype.distance = function(numberList) {
	  var sum = 0;
	  var i;
	  var nElements = Math.min(this.length, numberList.length);
	  for(i = 0; i < nElements; i++) {
	    sum += Math.pow(this[i] - numberList[i], 2);
	  }
	  return Math.sqrt(sum);
	};

	NumberList__NumberList.prototype.isEquivalent = function(numberList) {
	  for(i = 0; this[i] != null; i++) {
	    if(this[i] != numberList[i]) return false;
	  }
	  return true;
	};

	NumberList__NumberList.prototype.toStringList = function() {
	  var i;
	  var stringList = new StringList__default();
	  for(i = 0; this[i] != null; i++) {
	    stringList[i] = String(this[i]);
	  }
	  stringList.name = this.name;
	  return stringList;
	};


	//transform

	NumberList__NumberList.prototype.approach = function(destinty, speed) {
	  speed = speed || 0.5;

	  var i;
	  var antispeed = 1 - speed;

	  for(i = 0; this[i] != null; i++) {
	    this[i] = antispeed * this[i] + speed * destinty[i];
	  }
	};


	///////overriding

	NumberList__NumberList.prototype.clone = function() {
	  var newList = NumberList__NumberList.fromArray(this._slice(), false);
	  newList.name = this.name;
	  return newList;
	};

	NumberList__NumberList.prototype.slice = function() {
	  return NumberList__NumberList.fromArray(this._slice.apply(this, arguments), false);
	};

	exports.NumberList = NumberList__default;

	Polygon__Polygon.prototype = new List__default();
	Polygon__Polygon.prototype.constructor = Polygon__Polygon;

	/**
	 * @classdesc A Polygon is a shape created from a list of {@link Point|Points}.
	 *
	 * @description Creates a new Polygon.
	 * @constructor
	 * @category geometry
	 */
	function Polygon__Polygon() {
	  var array = List__default.apply(this, arguments);
	  array = Polygon__Polygon.fromArray(array);
	  return array;
	}
	var Polygon__default = Polygon__Polygon;

	Polygon__Polygon.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "Polygon";

	  result.getFrame = Polygon__Polygon.prototype.getFrame;
	  result.getBarycenter = Polygon__Polygon.prototype.getBarycenter;
	  result.add = Polygon__Polygon.prototype.add;
	  result.factor = Polygon__Polygon.prototype.factor;
	  result.getRotated = Polygon__Polygon.prototype.getRotated;
	  result.getClosestPoint = Polygon__Polygon.prototype.getClosestPoint;
	  result.toNumberList = Polygon__Polygon.prototype.toNumberList;
	  result.containsPoint = Polygon__Polygon.prototype.containsPoint;
	  //transform
	  result.approach = Polygon__Polygon.prototype.approach;
	  //override
	  result.clone = Polygon__Polygon.prototype.clone;

	  return result;
	};


	Polygon__Polygon.prototype.getFrame = function() {
	  if(this.length == 0) return null;
	  var rectangle = new Rectangle(this[0].x, this[0].y, this[0].x, this[0].y);
	  var p;
	  for(var i = 1; this[i] != null; i++) {
	    p = this[i];
	    rectangle.x = Math.min(rectangle.x, p.x);
	    rectangle.y = Math.min(rectangle.y, p.y);
	    rectangle.width = Math.max(rectangle.width, p.x);
	    rectangle.height = Math.max(rectangle.height, p.y);
	  }

	  rectangle.width -= rectangle.x;
	  rectangle.height -= rectangle.y;

	  return rectangle;
	};

	Polygon__Polygon.prototype.getBarycenter = function(countLastPoint) {
	  var i;
	  countLastPoint = countLastPoint == null ? true : countLastPoint;
	  cLPN = 1 - Number(countLastPoint);
	  if(this.length == 0) return null;
	  var barycenter = new Point(this[0].x, this[0].y);
	  for(i = 1; this[i + cLPN] != null; i++) {
	    barycenter.x += this[i].x;
	    barycenter.y += this[i].y;
	  }
	  barycenter.x /= this.length;
	  barycenter.y /= this.length;
	  return barycenter;
	};

	Polygon__Polygon.prototype.add = function(object) {
	  var type = typeOf(object);
	  var i;
	  switch(type) {
	    case 'Point':
	      var newPolygon = new Polygon__Polygon();
	      for(i = 0; this[i] != null; i++) {
	        newPolygon[i] = this[i].add(object);
	      }
	      newPolygon.name = this.name;
	      return newPolygon;
	      break;
	  }
	};

	/**
	 * scales the polygon by a number or a Point
	 * @param  {Object} value number or point
	 * @return {Polygon}
	 * tags:
	 */
	Polygon__Polygon.prototype.factor = function(value) {
	  var i;
	  var newPolygon = new Polygon__Polygon();
	  newPolygon.name = this.name;

	  if(value >= 0 || value < 0) {
	    for(i = 0; this[i] != null; i++) {
	      newPolygon[i] = new Point(this[i].x * value, this[i].y * value);
	    }

	    return newPolygon;
	  } else if(value.type != null && value.type == 'Point') {
	    for(i = 0; this[i] != null; i++) {
	      newPolygon[i] = new Point(this[i].x * value.x, this[i].y * value.y);
	    }

	    return newPolygon;
	  }

	  return null;
	};


	Polygon__Polygon.prototype.getRotated = function(angle, center) {
	  center = center == null ? new Point() : center;

	  var newPolygon = new Polygon__Polygon();
	  for(var i = 0; this[i] != null; i++) {
	    newPolygon[i] = new Point(Math.cos(angle) * (this[i].x - center.x) - Math.sin(angle) * (this[i].y - center.y) + center.x, Math.sin(angle) * (this[i].x - center.x) + Math.cos(angle) * (this[i].y - center.y) + center.y);
	  }
	  newPolygon.name = this.name;
	  return newPolygon;
	};

	Polygon__Polygon.prototype.getClosestPoint = function(point) {
	  var closest = this[0];
	  var d2Min = Math.pow(point.x - closest.x, 2) + Math.pow(point.y - closest.y, 2);
	  var d2;

	  for(var i = 1; this[i] != null; i++) {
	    d2 = Math.pow(point.x - this[i].x, 2) + Math.pow(point.y - this[i].y, 2);
	    if(d2 < d2Min) {
	      d2Min = d2;
	      closest = this[i];
	    }
	  }
	  return closest;
	};

	Polygon__Polygon.prototype.toNumberList = function() {
	  var numberList = new NumberList();
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    numberList[i * 2] = this[i].x;
	    numberList[i * 2 + 1] = this[i].y;
	  }
	  return numberList;
	};

	/**
	 * Thanks http://jsfromhell.com/math/is-point-in-poly AND http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	 */
	Polygon__Polygon.prototype.containsPoint = function(point) {
	  var i;
	  var j;
	  var l;
	  for(var c = false, i = -1, l = this.length, j = l - 1; ++i < l; j = i)
	        ((this[i].y <= point.y && point.y < this[j].y) || (this[j].y <= point.y && point.y < this[i].y))
	        && (point.x < (this[j].x - this[i].x) * (point.y - this[i].y) / (this[j].y - this[i].y) + this[i].x)
	        && (c = !c);
	  return c;
	};

	//transform

	Polygon__Polygon.prototype.approach = function(destiny, speed) {
	  speed = speed || 0.5;
	  var antispeed = 1 - speed;

	  this.forEach(function(point, i) {
	    point.x = antispeed * point.x + speed * destiny[i].x;
	    point.y = antispeed * point.y + speed * destiny[i].y;
	  });
	};


	Polygon__Polygon.prototype.clone = function() {
	  var newPolygon = new Polygon__Polygon();
	  for(var i = 0; this[i] != null; i++) {
	    newPolygon[i] = this[i].clone();
	  }
	  newPolygon.name = this.name;
	  return newPolygon;
	};

	exports.Polygon = Polygon__default;

	NodeList.prototype = new List__default();
	NodeList.prototype.constructor = NodeList;

	/**
	 * @classdesc A sub-class of {@link List} for storing {@link Node|Nodes}.
	 *
	 * @description create a new NodeList.
	 * @constructor
	 * @category networks
	 */
	function NodeList() {
	  //var array=List.apply(this, arguments);

	  //if(arguments && arguments.length>0) {c.l('UEUEUEUE, arguments.length', arguments.length); var a; a.push(0)};

	  var array = NodeList.fromArray([]);

	  if(arguments && arguments.length > 0) {
	    var args = Array.prototype.slice.call(arguments);

	    args.forEach(function(arg) {
	      array.addNode(arg);
	    });
	  }

	  return array;
	}


	/**
	 * Creates NodeList from raw Array.
	 *
	 * @param {Node[] | String[]} array Array to convert to
	 * @param {Boolean} forceToNode If true, and input array is an array of Strings,
	 * convert strings to Node instances with the strings used as the Node's id and name.
	 * @return {NodeList}
	 */
	NodeList.fromArray = function(array, forceToNode) {
	  forceToNode = forceToNode == null ? false : forceToNode;

	  var result = List__default.fromArray(array);

	  if(forceToNode) {
	    for(var i = 0; i < result.length; i++) {
	      result[i] = ClassUtils__typeOf(result[i]) == "Node" ? result[i] : (new Node(String(result[i]), String(result[i])));
	    }
	  }

	  // TODO: Remove duplicate line?
	  var result = List__default.fromArray(array);
	  result.type = "NodeList";
	  result.ids = {};
	  // TODO: Fix
	  Array(); //????

	  //assign methods to array:
	  result.deleteNodes = NodeList.prototype.deleteNodes;
	  result.addNode = NodeList.prototype.addNode;
	  result.addNodes = NodeList.prototype.addNodes;
	  result.removeNode = NodeList.prototype.removeNode;
	  result.removeNodeAtIndex = NodeList.prototype.removeNodeAtIndex;
	  result.getNodeByName = NodeList.prototype.getNodeByName;
	  result.getNodeById = NodeList.prototype.getNodeById;
	  result.getNodesByIds = NodeList.prototype.getNodesByIds;
	  result.getNewId = NodeList.prototype.getNewId;
	  result.normalizeWeights = NodeList.prototype.normalizeWeights;
	  result.getWeights = NodeList.prototype.getWeights;
	  result.getIds = NodeList.prototype.getIds;
	  result.getDegrees = NodeList.prototype.getDegrees;
	  result.getPolygon = NodeList.prototype.getPolygon;

	  result._push = Array.prototype.push;
	  result.push = function(a) {
	    console.log('with nodeList, use addNode instead of push');
	    var k;
	    k.push(a);
	  };

	  //overriden
	  result.getWithoutRepetitions = NodeList.prototype.getWithoutRepetitions;
	  result.clone = NodeList.prototype.clone;

	  return result;
	};

	/**
	 * Clears NodeList.
	 *
	 */
	NodeList.prototype.removeNodes = function() {
	  for(var i = 0; i < this.length; i++) {
	    this.ids[this[i].id] = null;
	    this.removeElement(this[i]);
	  }
	};

	/**
	 * Adds given Node to NodeList.
	 *
	 * @param {Node} node Node to add
	 */
	NodeList.prototype.addNode = function(node) {
	  this.ids[node.id] = node;
	  this._push(node);
	};

	/**
	 * Adds all Nodes from another NodeList to this NodeList.
	 *
	 * @param {NodeList} nodes Nodes to add.
	 */
	NodeList.prototype.addNodes = function(nodes) {
	  var i;
	  for(i = 0; nodes[i] != null; i++) {
	    this.addNode(nodes[i]);
	  }
	};

	/**
	 * Removes a given node from the list.
	 *
	 * @param {Node} node Node to remove.
	 */
	NodeList.prototype.removeNode = function(node) {
	  this.ids[node.id] = null;
	  this.removeElement(node);
	};

	/**
	 * Removes a Node at a particular index of the NodeList
	 *
	 * @param {Number} index The index of the Node to remove.
	 */
	NodeList.prototype.removeNodeAtIndex = function(index) {
	  this.ids[this[index].id] = null;
	  this.splice(index, 1);
	};

	/**
	 * Normalizes all weights associated with Nodes in NodeList
	 * to a value between 0 and 1. Works under the assumption that weights are >= 0.
	 */
	NodeList.prototype.normalizeWeights = function() {
	  var i;
	  var max = -9999999;
	  for(i = 0; this[i] != null; i++) {
	    max = Math.max(this[i].weight, max);
	  }
	  for(i = 0; this[i] != null; i++) {
	    this[i].weight /= max;
	  }
	};


	/**
	 * Returns Node with given name if present in the NodeList.
	 * Very inefficient method. Use {@link .getNodeById} when possible
	 *
	 * @return {Node} Node with name matching input name. Null if no such Node.
	 */
	NodeList.prototype.getNodeByName = function(name) {
	  var i;
	  for(i = 0; i < this.length; i++) {
	    if(this[i].name == name) {
	      return this[i];
	    }
	  }
	  return null;
	};

	/**
	 * Returns Node in NodeList with given Id.
	 *
	 * @param  {String} id Id of Node to return.
	 * @return {Node}
	 * tags:search
	 */
	NodeList.prototype.getNodeById = function(id) {
	  return this.ids[id];
	};

	/**
	 * Returns a new NodeList with all nodes in this
	 * NodeList with Id's found in the given {@link NumberList}
	 * of ids.
	 *
	 * @param {NumberList} ids Ids of Nodes to extract.
	 * @return {NodeList}
	 */
	NodeList.prototype.getNodesByIds = function(ids) {
	  newNodelist = new NodeList();
	  var node;
	  for(var i = 0; ids[i] != null; i++) {
	    node = this.ids[ids[i]];
	    if(node != null) newNodelist[i] = node;
	  }
	  return newNodelist;
	};

	/**
	 * Returns a {@link NumberList} of the weights associated
	 * with each Node in the NodeList.
	 *
	 * @return {NumberList}
	 * tags:
	 */
	NodeList.prototype.getWeights = function() {
	  var numberList = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    numberList[i] = this[i].weight;
	  }
	  return numberList;
	};

	/**
	 * Returns a {@link StringList} of all the Ids
	 * of the Nodes in the NodeList.
	 *
	 * @return {StringList}
	 * tags:
	 */
	NodeList.prototype.getIds = function() {
	  var list = new StringList__default();
	  for(var i = 0; this[i] != null; i++) {
	    list[i] = this[i].id;
	  }
	  return list;
	};

	/**
	 * Returns a {@link NumberList} with a count of directly
	 * connected Relations a Node has for each Node.
	 *
	 *
	 * @return {NumberList} List containing the number
	 * of Relations each Node has.
	 */
	NodeList.prototype.getDegrees = function() {
	  var numberList = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    numberList[i] = this[i].nodeList.length;
	  }
	  return numberList;
	};


	/**
	 * Returns a {@link Polygon} constructed from all Nodes in
	 * the NodeList by using the
	 * <strong>x</strong> and <strong>y</strong> attributes of
	 * the Nodes.
	 *
	 * @return {Polygon}
	 */
	NodeList.prototype.getPolygon = function() {
	  var polygon = new Polygon__default();
	  for(var i = 0; this[i] != null; i++) {
	    polygon[i] = new Point__default(this[i].x + cX, this[i].y + cY);
	  }
	  return polygon;
	};

	NodeList.prototype.getNewId = function() {
	  var n = this.length + 1;
	  for(var i = 0; i < n; i++) {
	    if(this.getNodeById(String(i)) == null) return String(i);
	  }
	};

	/**
	 * Returns a copy of this NodeList.
	 *
	 * @return {NodeList}
	 */
	NodeList.prototype.clone = function() {
	  var newNodeList = new NodeList();
	  this.forEach(function(node) {
	    newNodeList.addNode(node);
	  });
	  newNodeList.name = this.name;
	  return newNodeList;
	};


	//methods overriden

	/**
	 * getWithoutRepetitions
	 *
	 * @return {undefined}
	 * @ignore
	 */
	NodeList.prototype.getWithoutRepetitions = function() {
	  newList = new NodeList();
	  newList.name = this.name;
	  for(i = 0; this[i] != null; i++) {
	    if(newList.getNodeById(this[i].id) == null) newList.addNode(this[i]);
	  }
	  return newList;
	};

	exports.NodeList = NodeList;

	RelationList.prototype = new NodeList();
	RelationList.prototype.constructor = RelationList;
	/**
	 * RelationList
	 * @constructor
	 */

	/**
	 * @classdesc A sub-class of {@link List} for storing {@link Relations|Relation}.
	 *
	 * @description create a new RelationList.
	 * @constructor
	 * @category networks
	 */
	function RelationList() {
	  var array = NodeList.apply(this, arguments);
	  array.name = "";
	  //assign methods to array:
	  array = RelationList.fromArray(array);
	  //
	  return array;
	}


	/**
	 * Convert raw array of Relations into a RelationList.
	 *
	 * @param {Relation[]} array Array to convert to a RelationList.
	 * @return {RelationList}
	 */
	RelationList.fromArray = function(array) {
	  var result = NodeList.fromArray(array);
	  result.type = "RelationList";
	  //assign methods to array:
	  result.addRelation = RelationList.prototype.addRelation;
	  result.addRelationIfNew = RelationList.prototype.addRelationIfNew;
	  result.removeRelation = RelationList.prototype.removeRelation;
	  result.getRelationsWithNode = RelationList.prototype.getRelationsWithNode;
	  result.getFirstRelationBetweenNodes = RelationList.prototype.getFirstRelationBetweenNodes;
	  result.getFirstRelationByIds = RelationList.prototype.getFirstRelationByIds;
	  result.getAllRelationsBetweenNodes = RelationList.prototype.getAllRelationsBetweenNodes;
	  result.getRelatedNodesToNode = RelationList.prototype.getRelatedNodesToNode;
	  result.nodesAreConnected = RelationList.prototype.nodesAreConnected;

	  return result;
	};

	/**
	 * Add new Relation to the list.
	 *
	 * @param {Relation} relation Relation to add.
	 */
	//TODO:remove?
	RelationList.prototype.addRelation = function(relation) {
	  this.addNode(relation);
	};

	/**
	 * Removes Relation from the list.
	 *
	 * @param {Relation} relation Relation to remove.
	 */
	RelationList.prototype.removeRelation = function(relation) {
	    this.removeNode(relation);
	};

	/**
	 * Returns all relations that are directly connected to the given Node.
	 *
	 * @param {Node} node Node to search
	 * @return {Relation[]} Containing Relations that contain node.
	 */
	RelationList.prototype.getRelationsWithNode = function(node) {
	  var i;
	  var filteredRelations = [];
	  for(i = 0; this[i] != null; i++) {
	    var relation = this[i];
	    if(relation.node0 == node || relation.node1 == node) {
	      filteredRelations.push(relation);
	    }
	  }

	  // TODO: convert to RelationList?
	  return filteredRelations;
	};

	/**
	 * Returns all Nodes related to a given Node.
	 *
	 * @param {Node} node
	 * @return a RelationList with relations that contain node
	 */
	RelationList.prototype.getRelatedNodesToNode = function(node) {
	  var i;
	  var relatedNodes = new NodeList();
	  for(i = 0; i < this.length; i++) {
	    var relation = this[i];
	    if(relation.node0.id == node.id) {
	      relatedNodes.push(relation.node1);
	    }
	    if(relation.node1.id == node.id) {
	      relatedNodes.push(relation.node0);
	    }
	  }
	  return relatedNodes;
	};



	/**
	 * Returns all Relations between two Nodes.
	 *
	 * @param {Node} node0 Source Node.
	 * @param {Node} node1 Destination Node.
	 * @param {Boolean} directed Consider Relation directional in nature (default: false).
	 * @return {Relation[]} With Relations that contain node0 and node1.
	 * tags:
	 */
	RelationList.prototype.getAllRelationsBetweenNodes = function(node0, node1, directed) {
	  //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
	  var i;
	  directed = directed == null ? false : directed;
	  var filteredRelations = [];
	  for(i = 0; this[i] != null; i++) {
	    var relation = this[i];
	    if((relation.node0 == node0 && relation.node1 == node1) || (!directed && relation.node0 == node1 && relation.node1 == node0)) {
	      filteredRelations.push(relation);
	    }
	  }
	  // TODO: convert to RelationList ?
	  return filteredRelations;
	};


	/**
	 * Checks if two nodes are related, returns a boolean
	 *
	 * @param  {Node} node0
	 * @param  {Node} node1
	 * @param  {Boolean} directed true if relation must be directed
	 * @return {Boolean}
	 * tags:
	 */
	RelationList.prototype.nodesAreConnected = function(node0, node1, directed) {
	  if(node0.toNodeList.getNodeById(node1.id) != null) return true;
	  return !directed && node1.toNodeList.getNodeById(node0.id) != null;
	};


	/**
	 * Returns the first Relation between two Nodes.
	 *
	 * @param {Node} node0 Source Node.
	 * @param {Node} node1 Destination Node.
	 * @param {Boolean} directed consider relation direction (default: false).
	 * @return {Relation[]} With Relations that contain node0 and node1.
	 * tags:
	 */
	RelationList.prototype.getFirstRelationBetweenNodes = function(node0, node1, directed) { //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected) //TODO: make it work with ids
	  directed = directed == null ? false : directed;

	  for(var i = 0; this[i] != null; i++) {
	    if((this[i].node0.id == node0.id && this[i].node1.id == node1.id) || (!directed && this[i].node1.id == node0.id && this[i].node0.id == node1.id)) return this[i];
	  }
	  return null;
	};


	/**
	 * Returns first relations between two Nodes.
	 *
	 * @param {String} id0 Id of the source Node.
	 * @param {String} id1 Id of the destination Node.
	 * @param {Boolean} directed Consider relation directional (default: false).
	 * @return {Relation[]} With Relations that contain node0 and node1 (with node0.id = id0 and node1.id = id1).
	 */
	RelationList.prototype.getFirstRelationByIds = function(id0, id1, directed) {
	  //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
	  //TODO: make it work with ids
	  var i;
	  var _directed = directed || false;
	  var relation;
	  for(i = 0; this[i] != null; i++) {
	    relation = this[i];
	    if(relation.node0.id == id0 && relation.node1.id == id1) {
	      return relation;
	    }
	  }
	  if(_directed) return null;
	  //c.log("<->");
	  for(i = 0; this[i] != null; i++) {
	    relation = this[i];
	    if(relation.node0.id == id1 && relation.node1.id == id0) {
	      //c.log("<--- ", relation.node0.name, relation.node1.name);
	      // TODO: convert to RelationList ?
	      return relation;
	    }
	  }
	  return null;
	};

	exports.RelationList = RelationList;

	function Loader() {}


	Loader.proxy = ""; //TODO:install proxy created by Mig at moebio.com
	Loader.cacheActive = false; //TODO: fix!
	Loader.associativeByUrls = {};
	Loader.REPORT_LOADING = false;
	Loader.n_loading = 0;
	Loader.LOCAL_STORAGE_ENABLED = false;

	Loader.PHPurl = "http://intuitionanalytics.com/tests/proxy.php?url=";


	/**
	 * loads string data from server. The defined Loader.proxy will be used.
	 * @param {String} url the URL of the file to be loaded
	 * @param {Function} onLoadData a function that will be called when complete. The function must receive a LoadEvent
	 * @param {callee} the Object containing the onLoadData function to be called
	 * @para, {Object} optional parameter that will be stored in the LoadEvent instance
	 */
	Loader.loadData = function(url, onLoadData, callee, param, send_object_json) {
	  if(Loader.REPORT_LOADING) c.log('load data:', url);
	  Loader.n_loading++;

	  if(Loader.LOCAL_STORAGE_ENABLED) {
	    var result = LocalStorage.getItem(url);
	    if(result) {
	      var e = new LoadEvent();
	      e.url = url;
	      e.param = param;
	      e.result = result;

	      onLoadData.call(target, e);
	    }
	  }



	  if(Loader.REPORT_LOADING) c.log("Loader.loadData | url:", url);

	  var useProxy = String(url).substr(0, 4) == "http";

	  var req = new XMLHttpRequest();

	  var target = callee ? callee : arguments.callee;
	  var onLoadComplete = function() {
	    if(Loader.REPORT_LOADING) c.log('Loader.loadData | onLoadComplete'); //, req.responseText:', req.responseText);
	    if(req.readyState == 4) {
	      Loader.n_loading--;

	      var e = new LoadEvent();
	      e.url = url;
	      e.param = param;
	      //if (req.status == 200) { //MIG
	      if(req.status == 200 || (req.status == 0 && req.responseText != null)) {
	        e.result = req.responseText;
	        onLoadData.call(target, e);
	      } else {
	        if(Loader.REPORT_LOADING) c.log("[!] There was a problem retrieving the data [" + req.status + "]:\n" + req.statusText);
	        e.errorType = req.status;
	        e.errorMessage = "[!] There was a problem retrieving the data [" + req.status + "]:" + req.statusText;
	        onLoadData.call(target, e);
	      }
	    }
	  };

	  // branch for native XMLHttpRequest object
	  if(window.XMLHttpRequest && !(window.ActiveXObject)) {
	    try {
	      req = new XMLHttpRequest();
	    } catch(e) {
	      req = false;
	    }
	    // branch for IE/Windows ActiveX version
	  } else if(window.ActiveXObject) {
	    try {
	      req = new ActiveXObject("Msxml2.XMLHTTP.6.0");
	    } catch(e) {
	      try {
	        req = new ActiveXObject("Msxml2.XMLHTTP.3.0");
	      } catch(e) {
	        try {
	          req = new ActiveXObject("Msxml2.XMLHTTP");
	        } catch(e) {
	          try {
	            req = new ActiveXObject("Microsoft.XMLHTTP");
	          } catch(e) {
	            req = false;
	          }
	        }
	      }
	    }
	  }
	  if(req) {
	    req.onreadystatechange = onLoadComplete; //processReqChange;
	    if(useProxy) {
	      req.open("GET", Loader.proxy + url, true);
	    } else {
	      req.open("GET", url, true);
	    }

	    send_object_json = send_object_json || "";
	    req.send(send_object_json);
	  }
	};


	function LoaderRequest(url, method, data) {
	  this.url = url;
	  this.method = method ? method : "GET";
	  this.data = data;
	}

	Loader.loadImage = function(url, onComplete, callee, param) {
	  Loader.n_loading++;

	  if(Loader.REPORT_LOADING) c.log("Loader.loadImage | url:", url);

	  var target = callee ? callee : arguments.callee;
	  var img = document.createElement('img');

	  if(this.cacheActive) {
	    if(this.associativeByUrls[url] != null) {
	      Loader.n_loading--;
	      //c.log('=====>>>>+==>>>+====>>=====>>>+==>> in cache:', url);
	      var e = new LoadEvent();
	      e.result = this.associativeByUrls[url];
	      e.url = url;
	      e.param = param;
	      onComplete.call(target, e);
	    } else {
	      var cache = true;
	      var associative = this.associativeByUrls;
	    }
	  }

	  img.onload = function() {
	    Loader.n_loading--;
	    var e = new LoadEvent();
	    e.result = img;
	    e.url = url;
	    e.param = param;
	    if(cache) associative[url] = img;
	    onComplete.call(target, e);
	  };

	  img.onerror = function() {
	    Loader.n_loading--;
	    var e = new LoadEvent();
	    e.result = null;
	    e.errorType = 1; //TODO: set an error type!
	    e.errorMessage = "There was a problem retrieving the image [" + img.src + "]:";
	    e.url = url;
	    e.param = param;
	    onComplete.call(target, e);
	  };

	  img.src = Loader.proxy + url;
	};



	// Loader.loadJSON = function(url, onLoadComplete) {
	//   Loader.n_loading++;

	//   Loader.loadData(url, function(data) {
	//     Loader.n_loading--;
	//     onLoadComplete.call(arguments.callee, jQuery.parseJSON(data));
	//   });
	// };


	/**
	Loader.callIndex = 0;
	Loader.loadJSONP = function(url, onLoadComplete, callee) {
	  Loader.n_loading++;

	  Loader.callIndex = Loader.callIndex + 1;
	  var index = Loader.callIndex;

	  var newUrl = url + "&callback=JSONcallback" + index;
	  //var newUrl=url+"?callback=JSONcallback"+index; //   <----  WFP suggestion

	  var target = callee ? callee : arguments.callee;

	  //c.log('Loader.loadJSONP, newUrl:', newUrl);

	  $.ajax({
	    url: newUrl,
	    type: 'GET',
	    data: {},
	    dataType: 'jsonp',
	    contentType: "application/json",
	    jsonp: 'jsonp',
	    jsonpCallback: 'JSONcallback' + index,
	    success: function(data) {
	      Loader.n_loading--;
	      var e = new LoadEvent();
	      e.result = data;
	      onLoadComplete.call(target, e);
	    },
	    error: function(data) {
	      Loader.n_loading--;
	      c.log("Loader.loadJSONP | error, data:", data);

	      var e = new LoadEvent();
	      e.errorType = 1;
	      onLoadComplete.call(target, e);
	    }
	  }); //.error(function(e){
	  // c.log('---> (((error))) B');
	  //
	  // var e=new LoadEvent();
	  // e.errorType=1;
	  // onLoadComplete.call(target, e);
	  // });
	};
	**/




	//FIX THESE METHODS:

	Loader.loadXML = function(url, onLoadData) {
	  Loader.n_loading++;

	  var req = new XMLHttpRequest();
	  var onLoadComplete = onLoadData;

	  if(Loader.REPORT_LOADING) c.log('loadXML, url:', url);

	  // branch for native XMLHttpRequest object
	  if(window.XMLHttpRequest && !(window.ActiveXObject)) {
	    try {
	      req = new XMLHttpRequest();
	    } catch(e) {
	      req = false;
	    }
	    // branch for IE/Windows ActiveX version
	  } else if(window.ActiveXObject) {
	    try {
	      req = new ActiveXObject("Msxml2.XMLHTTP");
	    } catch(e) {
	      try {
	        req = new ActiveXObject("Microsoft.XMLHTTP");
	      } catch(e) {
	        req = false;
	      }
	    }
	  }
	  if(req) {
	    req.onreadystatechange = processReqChange;
	    req.open("GET", url, true);
	    req.send("");
	  }

	  function processReqChange() {
	    Loader.n_loading--;
	    // only if req shows "loaded"
	    if(req.readyState == 4) {
	      // only if "OK"
	      if(req.status == 200 || req.status == 0) {
	        onLoadComplete(req.responseXML);

	      } else {
	        c.log("There was a problem retrieving the XML data:\n" +
	          req.statusText);
	      }
	    }
	  }
	};


	///////////////PHP

	Loader.sendContentToVariableToPhp = function(url, varName, value, onLoadData, callee, param) {
	  var data = varName + "=" + encodeURIComponent(value);
	  Loader.sendDataToPhp(url, data, onLoadData, callee, param);
	};

	Loader.sendContentsToVariablesToPhp = function(url, varNames, values, onLoadData, callee, param) {
	  var data = varNames[0] + "=" + encodeURIComponent(values[0]);
	  for(var i = 1; varNames[i] != null; i++) {
	    data += "&" + varNames[i] + "=" + encodeURIComponent(values[i]);
	  }
	  Loader.sendDataToPhp(url, data, onLoadData, callee, param);
	};

	Loader.sendDataToPhp = function(url, data, onLoadData, callee, param) {
	  var req = new XMLHttpRequest();

	  req.open("POST", url, true);
	  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  req.send(data);

	  var target = callee ? callee : arguments.callee;

	  var onLoadComplete = function() {
	    if(Loader.REPORT_LOADING) c.log('Loader.loadData | onLoadComplete, req.responseText:', req.responseText);
	    if(req.readyState == 4) {
	      Loader.n_loading--;

	      var e = new LoadEvent();
	      e.url = url;
	      e.param = param;

	      if(req.status == 200 || (req.status == 0 && req.responseText != null)) {
	        e.result = req.responseText;
	        onLoadData.call(target, e);
	      } else {
	        if(Loader.REPORT_LOADING) c.log("[!] There was a problem retrieving the data [" + req.status + "]:\n" + req.statusText);
	        e.errorType = req.status;
	        e.errorMessage = "[!] There was a problem retrieving the data [" + req.status + "]:" + req.statusText;
	        onLoadData.call(target, e);
	      }
	    }
	  };

	  req.onreadystatechange = onLoadComplete;
	};

	Node.prototype = new DataModel();
	Node.prototype.constructor = Node;

	/**
	 * @classdesc Represents a single node element in a Network. Can have both an id as well
	 * as a name.
	 *
	 * @description Create a new Node.
	 * @param {String} id ID of the Node
	 * @param {String} name string (label) name to be assigned to node
	 * @constructor
	 * @category networks
	 */
	function Node(id, name) {
	  this.id = id == null ? '' : id;
	  this.name = name != null ? name : '';
	  this.type = "Node";

	  this.nodeType;

	  this.x = 0;
	  this.y = 0;
	  this.z = 0;

	  this.nodeList = new NodeList();
	  this.relationList = new RelationList();

	  this.toNodeList = new NodeList();
	  this.toRelationList = new RelationList();

	  this.fromNodeList = new NodeList();
	  this.fromRelationList = new RelationList();

	  this.weight = 1;
	  this.descentWeight = 1;

	  //tree
	  this.level = 0;
	  this.parent = null;

	  //physics:
	  this.vx = 0;
	  this.vy = 0;
	  this.vz = 0;
	  this.ax = 0;
	  this.ay = 0;
	  this.az = 0;
	}


	/**
	 * Removes all Relations and connected Nodes from
	 * the current Node.
	 */
	Node.prototype.cleanRelations = function() {
	  this.nodeList = new NodeList();
	  this.relationList = new RelationList();

	  this.toNodeList = new NodeList();
	  this.toRelationList = new RelationList();

	  this.fromNodeList = new NodeList();
	  this.fromRelationList = new RelationList();
	};

	//TODO: complete with all properties
	Node.prototype.destroy = function() {
	  DataModel.prototype.destroy.call(this);
	  delete this.id;
	  delete this.name;
	  delete this.nodeType;
	  delete this.x;
	  delete this.y;
	  delete this.z;
	  delete this.nodeList;
	  delete this.relationList;
	  delete this.toNodeList;
	  delete this.toNodeList;
	  delete this.fromNodeList;
	  delete this.fromRelationList;
	  delete this.parent;
	  delete this.weight;
	  delete this.descentWeight;
	  delete this.level;
	  delete this.vx;
	  delete this.vy;
	  delete this.vz;
	  delete this.ax;
	  delete this.ay;
	  delete this.az;
	};

	/**
	 * Returns the number of Relations connected to this Node.
	 *
	 * @return {Number} Number of Relations (edges) connecting to this Node instance.
	 */
	Node.prototype.getDegree = function() {
	  return this.relationList.length;
	};

	//treeProperties:


	/**
	 * Returns the parent Node of this Node if it is part of a {@link Tree}.
	 *
	 * @return {Node} Parent Node of this Node.
	 */
	Node.prototype.getParent = function() {
	  return this.parent;
	};

	/**
	 * Returns the leaves under a node in a Tree,
	 *
	 * <strong>Warning:</strong> If this Node is part of a Network that is not a tree, this method could run an infinite loop.
	 * @return {NodeList} Leaf Nodes of this Node.
	 * tags:
	 */
	Node.prototype.getLeaves = function() {
	    var leaves = new NodeList();
	    var addLeaves = function(node) {
	      if(node.toNodeList.length === 0) {
	        leaves.addNode(node);
	        return;
	      }
	      node.toNodeList.forEach(addLeaves);
	    };
	    addLeaves(this);
	    return leaves;
	  };


	/**
	 * Uses an image as a visual representation to this Node.
	 *
	 * @param {String} urlImage The URL of the image to load.
	 */
	Node.prototype.loadImage = function(urlImage) {
	  Loader.loadImage(urlImage, function(e) {
	    this.image = e.result;
	  }, this);
	};


	/**
	 * Makes a copy of this Node.
	 *
	 * @return {Node} New Node that is a copy of this Node.
	 */
	Node.prototype.clone = function() {
	  var newNode = new Node(this.id, this.name);

	  newNode.x = this.x;
	  newNode.y = this.y;
	  newNode.z = this.z;

	  newNode.nodeType = this.nodeType;

	  newNode.weight = this.weight;
	  newNode.descentWeight = this.descentWeight;

	  return newNode;
	};

	exports.Node = Node;

	function TableEncodings() {}



	TableEncodings.ENTER = String.fromCharCode(13);
	TableEncodings.ENTER2 = String.fromCharCode(10);
	TableEncodings.ENTER3 = String.fromCharCode(8232);

	TableEncodings.SPACE = String.fromCharCode(32);
	TableEncodings.SPACE2 = String.fromCharCode(160);

	TableEncodings.TAB = "	";
	TableEncodings.TAB2 = String.fromCharCode(9);


	/**
	 * Decode a String in format CSV into a Table
	 * @param {String} csv CSV formatted text
	 *
	 * @param {Boolean} first_row_header first row is header (default: false)
	 * @param {String} separator separator character (default: ",")
	 * @param {Object} value_for_nulls Object to be placed instead of null values
	 * @return {Table} resulting Table
	 * tags:decoder
	 */
	TableEncodings.CSVtoTable = function(csvString, firstRowIsHeader, separator, valueForNulls) {
	  valueForNulls = valueForNulls == null ? '' : valueForNulls;
	  var i;
	  var _firstRowIsHeader = firstRowIsHeader == null ? false : firstRowIsHeader;

	  if(csvString == null) return null;
	  if(csvString == "") return new Table();

	  csvString = csvString.replace(/\$/g, "");

	  var blocks = csvString.split("\"");
	  for(i = 1; blocks[i] != null; i += 2) {
	    blocks[i] = blocks[i].replace(/\n/g, "*ENTER*");
	  }
	  csvString = blocks.join("\""); //TODO: create a general method for replacements inside "", apply it to chomas

	  var enterChar = TableEncodings.ENTER2;
	  var lines = csvString.split(enterChar);
	  if(lines.length == 1) {
	    enterChar = TableEncodings.ENTER;
	    lines = csvString.split(enterChar);
	    if(lines.length == 1) {
	      enterChar = TableEncodings.ENTER3;
	      lines = csvString.split(enterChar);
	    }
	  }

	  var table = new Table();
	  var comaCharacter = separator != undefined ? separator : ",";

	  if(csvString == null || csvString == "" || csvString == " " || lines.length == 0) return null;

	  var startIndex = 0;
	  if(_firstRowIsHeader) {
	    startIndex = 1;
	    var headerContent = lines[0].split(comaCharacter);
	  }

	  var element;
	  var cellContent;
	  var numberCandidate;
	  for(i = startIndex; i < lines.length; i++) {
	    if(lines[i].length < 2) continue;

	    var cellContents = NetworkEncodings.replaceChomasInLine(lines[i]).split(comaCharacter); //TODO: will be obsolete (see previous TODO)

	    for(j = 0; j < cellContents.length; j++) {
	      table[j] = table[j] == null ? new List() : table[j];
	      if(_firstRowIsHeader && i == 1) {
	        table[j].name = headerContent[j] == null ? "" : TableEncodings._removeQuotes(headerContent[j]);
	      }
	      var actualIndex = _firstRowIsHeader ? (i - 1) : i;

	      cellContent = cellContents[j].replace(/\*CHOMA\*/g, ",").replace(/\*ENTER\*/g, "\n");

	      cellContent = cellContent == '' ? valueForNulls : cellContent;

	      numberCandidate = Number(cellContent.replace(',', '.'));

	      element = (numberCandidate || (numberCandidate == 0 && cellContent != '')) ? numberCandidate : cellContent;

	      if(typeof element == 'string') element = TableEncodings._removeQuotes(element);

	      table[j][actualIndex] = element;
	    }
	  }

	  for(i = 0; table[i] != null; i++) {
	    table[i] = table[i].getImproved();
	  }

	  table = table.getImproved();

	  return table;
	};

	TableEncodings._removeQuotes = function(string) {
	  if(string.length == 0) return string;
	  if((string.charAt(0) == "\"" || string.charAt(0) == "'") && (string.charAt(string.length - 1) == "\"" || string.charAt(string.length - 1) == "'")) string = string.substr(1, string.length - 2);
	  return string;
	};


	/**
	 * Encode a Table into a String in format CSV
	 * @param {Table} Table to be enconded
	 *
	 * @param {String} separator character (default: ",")
	 * @param {Boolean} first row as List names (default: false)
	 * @return {String} resulting String in CSV format
	 * tags:encoder
	 */
	TableEncodings.TableToCSV = function(table, separator, namesAsHeaders) {
	  separator = separator || ",";
	  var i;
	  var j;
	  var list;
	  var type;
	  var lines = ListGenerators.createListWithSameElement(table[0].length, "");
	  var addSeparator;
	  for(i = 0; table[i] != null; i++) {
	    list = table[i];
	    type = list.type;
	    addSeparator = i != table.length - 1;
	    for(j = 0; list[j] != null; j++) {
	      switch(type) {
	        case 'NumberList':
	          lines[j] += list[j];
	          break;
	        default:
	          lines[j] += "\"" + list[j] + "\"";
	          break;
	      }
	      if(addSeparator) lines[j] += separator;
	    }
	  }

	  var headers = '';
	  if(namesAsHeaders) {
	    for(i = 0; table[i] != null; i++) {
	      list = table[i];
	      headers += "\"" + list.name + "\"";
	      if(i != table.length - 1) headers += separator;
	    }
	    headers += '\n';
	  }

	  return headers + lines.getConcatenated("\n");
	};

	/* global console */

	Table__Table.prototype = new List__default();
	Table__Table.prototype.constructor = Table__Table;

	/**
	 * @classdesc A Table provides a 2D array-like structure.
	 *
	 * @description Creates a new Table.
	 * @constructor
	 * @category basics
	 */
	function Table__Table() {
	  var args = [];
	  var i;
	  for(i = 0; i < arguments.length; i++) {
	    args[i] = new List__default(arguments[i]);
	  }

	  var array = List__default.apply(this, args);
	  array = Table__Table.fromArray(array);

	  return array;
	}
	var Table__default = Table__Table;

	Table__Table.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "Table";
	  //assign methods to array:
	  result.applyFunction = Table__Table.prototype.applyFunction;
	  result.getRow = Table__Table.prototype.getRow;
	  result.getRows = Table__Table.prototype.getRows;
	  result.getLengths = Table__Table.prototype.getLengths;
	  result.getListLength = Table__Table.prototype.getListLength;
	  result.sliceRows = Table__Table.prototype.sliceRows;
	  result.getSubListsByIndexes = Table__Table.prototype.getSubListsByIndexes;
	  result.getWithoutRow = Table__Table.prototype.getWithoutRow;
	  result.getWithoutRows = Table__Table.prototype.getWithoutRows;
	  result.getTransposed = Table__Table.prototype.getTransposed;
	  result.getListsSortedByList = Table__Table.prototype.getListsSortedByList;
	  result.sortListsByList = Table__Table.prototype.sortListsByList;
	  result.getReport = Table__Table.prototype.getReport;
	  result.clone = Table__Table.prototype.clone;
	  result.print = Table__Table.prototype.print;

	  //transformative
	  result.removeRow = Table__Table.prototype.removeRow;

	  //overiden
	  result.destroy = Table__Table.prototype.destroy;

	  result.isTable = true;

	  return result;
	};

	Table__Table.prototype.applyFunction = function(func) { //TODO: to be tested!
	  var i;
	  var newTable = new Table__Table();

	  newTable.name = this.name;

	  for(i = 0; this[i] != null; i++) {
	    newTable[i] = this[i].applyFunction(func);
	  }
	  return newTable.getImproved();
	};

	/**
	 * returns a lis with all the alements of a row
	 * @param  {Number} index
	 * @return {List}
	 * tags:filter
	 */
	Table__Table.prototype.getRow = function(index) {
	  var list = new List__default();
	  var i;
	  for(i = 0; i < this.length; i++) {
	    list[i] = this[i][index];
	  }
	  return list.getImproved();
	};

	/**
	 * returns the length of the list at given index (default 0)
	 *
	 * @param  {Number} index
	 * @return {Number}
	 * tags:
	 */
	Table__Table.prototype.getListLength = function(index) {
	  return this[index || 0].length;
	};



	/**
	 * overrides List.prototype.getLengths (see comments there)
	 */
	Table__Table.prototype.getLengths = function() {
	  var lengths = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    lengths[i] = this[i].length;
	  }
	  return lengths;
	};

	/**
	 * filter a table by selecting a section of rows, elements with last index included
	 * @param  {Number} startIndex index of first element in all lists of the table
	 *
	 * @param  {Number} endIndex index of last elements in all lists of the table
	 * @return {Table}
	 * tags:filter
	 */
	Table__Table.prototype.sliceRows = function(startIndex, endIndex) {
	  endIndex = endIndex == null ? (this[0].length - 1) : endIndex;

	  var i;
	  var newTable = new Table__Table();
	  var newList;

	  newTable.name = this.name;
	  for(i = 0; this[i] != null; i++) {
	    newList = this[i].getSubList(startIndex, endIndex);
	    newList.name = this[i].name;
	    newTable.push(newList);
	  }
	  return newTable.getImproved();
	};

	/**
	 * filters the lists of the table by indexes
	 * @param  {NumberList} indexes
	 * @return {Table}
	 * tags:filter
	 */
	Table__Table.prototype.getSubListsByIndexes = function(indexes) {
	  var newTable = new Table__Table();
	  this.forEach(function(list) {
	    newTable.push(list.getSubListByIndexes(indexes));
	  });
	  return newTable.getImproved();
	};

	//deprecated
	Table__Table.prototype.getRows = function(indexes) {
	  return Table__Table.prototype.getSubListsByIndexes(indexes);
	};

	Table__Table.prototype.getWithoutRow = function(rowIndex) {
	  var newTable = new Table__Table();
	  newTable.name = this.name;
	  for(var i = 0; this[i] != null; i++) {
	    newTable[i] = List__default.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex + 1))).getImproved();
	    newTable[i].name = this[i].name;
	  }
	  return newTable.getImproved();
	};

	Table__Table.prototype.getWithoutRows = function(rowsIndexes) {
	  var newTable = new Table__Table();
	  newTable.name = this.name;
	  for(var i = 0; this[i] != null; i++) {
	    newTable[i] = new List__default();
	    for(var j = 0; this[i][j] != null; j++) {
	      if(rowsIndexes.indexOf(j) == -1) newTable[i].push(this[i][j]);
	    }
	    newTable[i].name = this[i].name;
	  }
	  return newTable.getImproved();
	};


	/**
	 * sort table's lists by a list
	 * @param  {Object} listOrIndex kist used to sort, or index of list in the table
	 *
	 * @param  {Boolean} ascending (true by default)
	 * @return {Table} table (of the same type)
	 * tags:sort
	 */
	Table__Table.prototype.getListsSortedByList = function(listOrIndex, ascending) { //depracated: use sortListsByList
	  if(listOrIndex == null) return;
	  var newTable = ClassUtils__instantiateWithSameType(this);
	  var sortinglist = listOrIndex.isList ? listOrIndex.clone() : this[listOrIndex];

	  this.forEach(function(list) {
	    newTable.push(list.getSortedByList(sortinglist, ascending));
	  });

	  return newTable;
	};


	Table__Table.prototype.getTransposed = function(firstListAsHeaders) {

	  var tableToTranspose = firstListAsHeaders ? this.getSubList(1) : this;

	  var table = ClassUtils__instantiate(ClassUtils__typeOf(tableToTranspose));
	  if(tableToTranspose.length === 0) return table;
	  var i;
	  var j;
	  var list;
	  var rows = tableToTranspose[0].length;
	  for(i = 0; tableToTranspose[i] != null; i++) {
	    list = tableToTranspose[i];
	    for(j = 0; list[j] != null; j++) {
	      if(i === 0) table[j] = new List__default();
	      table[j][i] = tableToTranspose[i][j];
	    }
	  }
	  for(j = 0; tableToTranspose[0][j] != null; j++) {
	    table[j] = table[j].getImproved();
	  }

	  if(firstListAsHeaders) {
	    this[0].forEach(function(name, i) {
	      table[i].name = String(name);
	    });
	  }

	  return table;
	};


	Table__Table.prototype.getReport = function(level) {
	  var ident = "\n" + (level > 0 ? StringOperators__default.repeatString("  ", level) : "");
	  var lengths = this.getLengths();
	  var minLength = lengths.getMin();
	  var maxLength = lengths.getMax();
	  var averageLength = (minLength + maxLength) * 0.5;
	  var sameLengths = minLength == maxLength;


	  var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

	  if(this.length === 0) {
	    text += ident + "this table has no lists";
	    return text;
	  }

	  text += ident + "name: " + this.name;
	  text += ident + "type: " + this.type;
	  text += ident + "number of lists: " + this.length;

	  text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

	  if(sameLengths) {
	    text += ident + "lists length: " + this[0].length;
	  } else {
	    text += ident + "min length: " + minLength;
	    text += ident + "max length: " + maxLength;
	    text += ident + "average length: " + averageLength;
	    text += ident + "all lengths: " + lengths.join(", ");
	  }

	  var names = this.getNames();
	  var types = this.getTypes();

	  text += ident + "--";
	  names.forEach(function(name, i){
	    text += ident + name + " ["+TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"]";
	  });
	  text += ident + "--";

	  var sameTypes = types.allElementsEqual();
	  if(sameTypes) {
	    text += ident + "types of all lists: " + types[0];
	  } else {
	    text += ident + "types: " + types.join(", ");
	  }
	  text += ident + "names: " + names.join(", ");

	  if(this.length < 101) {
	    text += ident + ident + "--------lists reports---------";

	    var i;
	    for(i = 0; this[i] != null; i++) {
	      text += "\n" + ident + ("(" + (i) + "/0-" + (this.length - 1) + ")");
	      try{
	         text += this[i].getReport(1);
	      } catch(err){
	        text += ident + "[!] something wrong with list " + err;
	      }
	    }
	  }

	  ///add ideas to: analyze, visualize

	  return text;

	};

	Table__Table.prototype.getReportHtml = function() {}; //TODO

	Table__Table.prototype.getReportObject = function() {}; //TODO




	////transformative
	Table__Table.prototype.removeRow = function(index) {
	  for(var i = 0; this[i] != null; i++) {
	    this[i].splice(index, 1);
	  }
	};


	////

	Table__Table.prototype.clone = function() {
	  var clonedTable = ClassUtils__instantiateWithSameType(this);
	  clonedTable.name = this.name;
	  for(var i = 0; this[i] != null; i++) {
	    clonedTable.push(this[i].clone());
	  }
	  return clonedTable;
	};

	Table__Table.prototype.destroy = function() {
	  for(var i = 0; this[i] != null; i++) {
	    this[i].destroy();
	    delete this[i];
	  }
	};

	Table__Table.prototype.print = function() {
	  console.log("///////////// <" + this.name + "////////////////////////////////////////////////////");
	  console.log(TableEncodings.TableToCSV(this, null, true));
	  console.log("/////////////" + this.name + "> ////////////////////////////////////////////////////");
	};

	exports.Table = Table__default;

	PolygonList.prototype = new Table__default();
	PolygonList.prototype.constructor = PolygonList;

	/**
	 * @classdesc A {@link List} structure for storing {@link Polygon} instances.
	 *
	 * @description Creates a new PolygonList.
	 * @constructor
	 * @category geometry
	 */
	function PolygonList() {
	  var array = Table__default.apply(this, arguments);
	  array = PolygonList.fromArray(array);
	  return array;
	}


	PolygonList.fromArray = function(array) {
	  var result = Table__default.fromArray(array);
	  result.type = "PolygonList";
	  result.getFrame = PolygonList.prototype.getFrame;
	  result.add = PolygonList.prototype.add;
	  result.factor = PolygonList.prototype.factor;
	  result.clone = PolygonList.prototype.clone;
	  result.getString = PolygonList.prototype.getString;
	  return result;
	};

	PolygonList.prototype.getFrame = function() {
	  if(this.length == 0) return null;
	  var frameP = this[0].getFrame();
	  var rectangle = new Rectangle(frameP.x, frameP.y, frameP.getRight(), frameP.getBottom());
	  for(var i = 1; this[i] != null; i++) {
	    frameP = this[i].getFrame();
	    rectangle.x = Math.min(rectangle.x, frameP.x);
	    rectangle.y = Math.min(rectangle.y, frameP.y);
	    rectangle.width = Math.max(rectangle.width, frameP.getRight());
	    rectangle.height = Math.max(rectangle.height, frameP.getBottom());
	  }
	  rectangle.width -= rectangle.x;
	  rectangle.height -= rectangle.y;

	  return rectangle;
	};

	PolygonList.prototype.add = function(object) {
	  var type = typeOf(object);
	  var i;
	  switch(type) {
	    case 'Point':
	      var newPolygonList = new PolygonList();
	      for(i = 0; this[i] != null; i++) {
	        newPolygonList[i] = this[i].add(object);
	      }
	      newPolygonList.name = this.name;
	      return newPolygonList;
	      break;
	  }
	};

	PolygonList.prototype.factor = function(value) {
	  var newPolygonList = new PolygonList();
	  for(var i = 0; this[i] != null; i++) {
	    newPolygonList[i] = this[i].factor(value);
	  }
	  newPolygonList.name = this.name;
	  return newPolygonList;
	};

	PolygonList.prototype.clone = function() {
	  var newPolygonList = new PolygonList();
	  for(var i = 0; this[i] != null; i++) {
	    newPolygonList[i] = this[i].clone();
	  }
	  newPolygonList.name = this.name;
	  return newPolygonList;
	};

	// PolygonList.prototype.getString=function(pointSeparator,polygonSeparator){
	// pointSeparator = pointSeparator==null?',':pointSeparator;
	// polygonSeparator = polygonSeparator==null?'/':polygonSeparator;
	// var j;
	// var t='';
	// for(var i=0;this[i]!=null;i++){
	// t+=(i==0?'':polygonSeparator);
	// for(j=0; this[i][j]!=null; j++){
	// t+=(j==0?'':pointSeparator)+this[i][j].x+pointSeparator+this[i][j].y;
	// }
	// }
	// return t;
	// }

	exports.PolygonList = PolygonList;

	NumberTable__NumberTable.prototype = new Table__default();
	NumberTable__NumberTable.prototype.constructor = NumberTable__NumberTable;

	/**
	 * @classdesc {@link Table} to store numbers.
	 *
	 * @constructor
	 * @description Creates a new NumberTable.
	 * @category numbers
	 */
	function NumberTable__NumberTable() {
	  var args = [];
	  var newNumberList;
	  var array;

	  if(arguments.length > 0 && Number(arguments[0]) == arguments[0]) {
	    array = [];
	    var i;
	    for(i = 0; i < arguments[0]; i++) {
	      array.push(new NumberList__default());
	    }
	  } else {
	    for(i = 0; arguments[i] != null; i++) {
	      newNumberList = NumberList__default.fromArray(arguments[i]);
	      newNumberList.name = arguments[i].name;
	      arguments[i] = newNumberList;
	    }
	    array = Table__default.apply(this, arguments);
	  }
	  array = NumberTable__NumberTable.fromArray(array);
	  return array;
	}
	var NumberTable__default = NumberTable__NumberTable;

	NumberTable__NumberTable.fromArray = function(array) {
	  var result = Table__default.fromArray(array);
	  result.type = "NumberTable";

	  result.getNumberListsNormalized = NumberTable__NumberTable.prototype.getNumberListsNormalized;
	  result.getNormalizedToMax = NumberTable__NumberTable.prototype.getNormalizedToMax;
	  result.getNumberListsNormalizedToMax = NumberTable__NumberTable.prototype.getNumberListsNormalizedToMax;
	  result.getNumberListsNormalizedToSum = NumberTable__NumberTable.prototype.getNumberListsNormalizedToSum;
	  result.getSums = NumberTable__NumberTable.prototype.getSums;
	  result.getRowsSums = NumberTable__NumberTable.prototype.getRowsSums;
	  result.getAverages = NumberTable__NumberTable.prototype.getAverages;
	  result.getRowsAverages = NumberTable__NumberTable.prototype.getRowsAverages;
	  result.factor = NumberTable__NumberTable.prototype.factor;
	  result.add = NumberTable__NumberTable.prototype.add;
	  result.getMax = NumberTable__NumberTable.prototype.getMax;
	  result.getMinMaxInterval = NumberTable__NumberTable.prototype.getMinMaxInterval;

	  return result;
	};

	NumberTable__NumberTable.prototype.getNumberListsNormalized = function(factor) {
	  factor = factor == null ? 1 : factor;

	  var newTable = new NumberTable__NumberTable();
	  var i;
	  for(i = 0; this[i] != null; i++) {
	    numberList = this[i];
	    newTable[i] = numberList.getNormalized(factor);
	  }
	  newTable.name = this.name;
	  return newTable;
	};

	NumberTable__NumberTable.prototype.getNormalizedToMax = function(factor) {
	  factor = factor == null ? 1 : factor;

	  var newTable = new NumberTable__NumberTable();
	  var i;
	  var antimax = factor / this.getMax();
	  for(i = 0; this[i] != null; i++) {
	    newTable[i] = this[i].factor(antimax);
	  }
	  newTable.name = this.name;
	  return newTable;
	};

	NumberTable__NumberTable.prototype.getNumberListsNormalizedToMax = function(factorValue) {
	  var newTable = new NumberTable__NumberTable();
	  for(var i = 0; this[i] != null; i++) {
	    numberList = this[i];
	    newTable[i] = numberList.getNormalizedToMax(factorValue);
	  }
	  newTable.name = this.name;
	  return newTable;
	};

	NumberTable__NumberTable.prototype.getNumberListsNormalizedToSum = function() {
	  var newTable = new NumberTable__NumberTable();
	  for(var i = 0; this[i] != null; i++) {
	    numberList = this[i];
	    newTable[i] = numberList.getNormalizedToSum();
	  }
	  newTable.name = this.name;
	  return newTable;
	};


	NumberTable__NumberTable.prototype.getMax = function() {
	  if(this.length == 0) return null;

	  var max = this[0].getMax();
	  var i;

	  for(i = 1; this[i] != null; i++) {
	    max = Math.max(this[i].getMax(), max);
	  }

	  return max;
	};

	NumberTable__NumberTable.prototype.getMinMaxInterval = function() {
	  if(this.length == 0) return null;
	  var rangeInterval = (this[0]).getMinMaxInterval();
	  for(var i = 1; this[i] != null; i++) {
	    var newRange = (this[i]).getMinMaxInterval();
	    rangeInterval.x = Math.min(rangeInterval.x, newRange.x);
	    rangeInterval.y = Math.max(rangeInterval.y, newRange.y);
	  }
	  return rangeInterval;
	};

	/**
	 * returns a numberList with values from numberlists added
	 * @return {Numberlist}
	 * tags:
	 */
	NumberTable__NumberTable.prototype.getSums = function() {
	  var numberList = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    numberList[i] = this[i].getSum();
	  }
	  return numberList;
	};

	/**
	 * returns a numberList with all values fro rows added
	 * @return {NumberList}
	 * tags:
	 */
	NumberTable__NumberTable.prototype.getRowsSums = function() {
	  var sums = this[0].clone();
	  var numberList;
	  for(var i = 1; this[i] != null; i++) {
	    numberList = this[i];
	    for(var j = 0; numberList[j] != null; j++) {
	      sums[j] += numberList[j];
	    }
	  }
	  return sums;
	};

	NumberTable__NumberTable.prototype.getAverages = function() {
	  var numberList = new NumberList__default();
	  for(var i = 0; this[i] != null; i++) {
	    numberList[i] = this[i].getAverage();
	  }
	  return numberList;
	};

	NumberTable__NumberTable.prototype.getRowsAverages = function() {
	  var nLists = this.length;
	  var averages = this[0].clone().factor(1 / nLists);
	  var numberList;
	  var i;
	  var j;
	  for(i = 1; this[i] != null; i++) {
	    numberList = this[i];
	    for(j = 0; numberList[j] != null; j++) {
	      averages[j] += numberList[j] / nLists;
	    }
	  }
	  return averages;
	};

	NumberTable__NumberTable.prototype.factor = function(value) {
	  var newTable = new NumberTable__NumberTable();
	  var i;

	  switch(typeOf(value)) {
	    case 'number':
	      for(i = 0; this[i] != null; i++) {
	        numberList = this[i];
	        newTable[i] = numberList.factor(value);
	      }
	      break;
	    case 'NumberList':
	      for(i = 0; this[i] != null; i++) {
	        numberList = this[i];
	        newTable[i] = numberList.factor(value[i]);
	      }
	      break;

	  }

	  newTable.name = this.name;
	  return newTable;
	};

	NumberTable__NumberTable.prototype.add = function(value) {
	  var newTable = new NumberTable__NumberTable();

	  for(var i = 0; this[i] != null; i++) {
	    numberList = this[i];
	    newTable[i] = numberList.add(value);
	  }

	  newTable.name = this.name;
	  return newTable;
	};

	exports.NumberTable = NumberTable__default;

	/* global console */

	Axis.prototype = new DataModel();
	Axis.prototype.constructor = Axis;

	/**
	 * @classdesc Axis for 1D data.
	 *
	 * @constructor
	 * @description Creates a new Axis.
	 * @category numbers
	 */
	function Axis(departureInterval, arrivalInterval) {
	  //TODO why assign the incoming param, could this be moved to lines 20-21
	  departureInterval = departureInterval == null ? new Interval__default(0, 1) : departureInterval;
	  arrivalInterval = arrivalInterval == null ? new Interval__default(0, 1) : arrivalInterval;

	  DataModel.apply(this, arguments);
	  this.departureInterval = departureInterval;
	  this.arrivalInterval = arrivalInterval;

	  this.setDepartureInterval(departureInterval);
	  this.setArrivalInterval(arrivalInterval);

	  this.type = "Axis";
	}




	Axis.prototype.setDepartureInterval = function(departureInterval) {
	  this.departureInterval = departureInterval;
	  console.log('--> departureInterval', departureInterval);
	  this.departureAmplitude = departureInterval.getSignedAmplitude();

	};
	Axis.prototype.setArrivalInterval = function(arrivalInterval) {
	  this.arrivalInterval = arrivalInterval;
	  this.arrivalAmplitude = arrivalInterval.getSignedAmplitude();
	};

	Axis.prototype.project = function(x) {
	  return this.arrivalInterval.x + this.arrivalAmplitude * (x - this.departureInterval.x) / this.departureAmplitude;
	};


	/**
	 * to be called once interval values changed
	 */
	Axis.prototype.update = function() {
	  this.departureAmplitude = this.departureInterval.getSignedAmplitude();
	  this.arrivalAmplitude = this.arrivalInterval.getSignedAmplitude();
	};


	Axis.prototype.toString = function() {
	  return "Axis[" + this.departureInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
	};

	exports.Axis = Axis;

	Axis2D.prototype = new DataModel();
	Axis2D.prototype.constructor = Axis2D;

	/**
	 * @classdesc Axis for 2D data
	 *
	 * @constructor
	 * @description Creates a new 2d axis.
	 * @category numbers
	 */
	function Axis2D(departureFrame, arrivalFrame) {
	  arrivalFrame = arrivalFrame == null ? new Rectangle(0, 0, 1, 1) : arrivalFrame;
	  DataModel.apply(this, arguments);
	  this.departureFrame = departureFrame;
	  this.arrivalFrame = arrivalFrame;

	  this.pW;
	  this.pH;

	  this.setFrames(departureFrame, arrivalFrame);

	  this.type = "Axis2D";
	}


	Axis2D.prototype.setFrames = function(departureFrame, arrivalFrame) {
	  this.departureFrame = departureFrame;
	  this.arrivalFrame = arrivalFrame;
	  this._update();
	};

	Axis2D.prototype.setDepartureFrame = function(departureFrame) {
	  this.departureFrame = departureFrame;
	  this._update();
	};

	Axis2D.prototype.setArrivalFrame = function(arrivalFrame) {
	  this.arrivalFrame = arrivalFrame;
	  this._update();
	};


	Axis2D.prototype.project = function(point) {
	  return new Point__default((point.x - this.departureFrame.x) * this.pW + this.arrivalFrame.x, (point.y - this.departureFrame.y) * this.pH + this.arrivalFrame.y);
	};


	Axis2D.prototype.projectX = function(x) {
	  return(x - this.departureFrame.x) * this.pW + this.arrivalFrame.x;
	};

	Axis2D.prototype.projectY = function(y) {
	  return(y - this.departureFrame.y) * this.pH + this.arrivalFrame.y;
	};

	Axis2D.prototype.inverseProject = function(point) {
	  return new Point__default((point.x - this.arrivalFrame.x) / this.pW + this.departureFrame.x, (point.y - this.arrivalFrame.y) / this.pH + this.departureFrame.y);
	};


	Axis2D.prototype.inverseProjectX = function(x) {
	  return(x - this.arrivalFrame.x) / this.pW + this.departureFrame.x;
	};

	Axis2D.prototype.inverseProjectY = function(y) {
	  return(y - this.arrivalFrame.y) / this.pH + this.departureFrame.y;
	};




	Axis2D.prototype._update = function() {
	  this.pW = this.arrivalFrame.width / this.departureFrame.width;
	  this.pH = this.arrivalFrame.height / this.departureFrame.height;
	};


	Axis2D.prototype.toString = function() {
	  return "Axis2D[" + this.departureFrame.toString() + ", " + this.arrivalFrame.toString() + "]";
	};

	exports.Axis2D = Axis2D;

	Matrix.prototype = new DataModel();
	Matrix.prototype.constructor = Matrix;

	/**
	 * @classdesc Matrix implementation.
	 * Some credits to http://strd6.com/2010/06/introducing-matrix-js/
	 *
	 * @constructor
	 * @description Creates a new Matrix instance.
	 * @category numbers
	 */
	function Matrix(a, b, c, d, tx, ty) {
	  DataModel.apply(this, arguments);
	  this.name = "";
	  this.type = "Matrix";
	  this.a = a == null ? 1 : a;
	  this.b = b == null ? 0 : b;
	  this.c = c == null ? 0 : c;
	  this.d = d == null ? 1 : d;
	  this.tx = tx == null ? 0 : tx;
	  this.ty = ty == null ? 0 : ty;
	}


	/**
	 * Returns the result of applying the geometric transformation represented by the
	 * Matrix object to the specified point.
	 * @methodOf Matrix#
	 * @see #deltaTransformPoint
	 *
	 * @returns {Point} A new point with the transformation applied.
	 */
	Matrix.prototype.transformPoint = function(point) {
	  return new Point__default(
	    this.a * point.x + this.c * point.y + this.tx,
	    this.b * point.x + this.d * point.y + this.ty
	  );
	};

	// /**
	// * Applies Matrix to context transform
	// **/
	// Matrix.prototype.applyToContext=function(context){
	// context.transform(this.a, this.b, this.c, this.d, this.tx, this.ty);
	// }

	/**
	 * Returns the result of this matrix multiplied by another matrix
	 * combining the geometric effects of the two. In mathematical terms,
	 * concatenating two matrixes is the same as combining them using matrix multiplication.
	 * If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
	 * http://mathworld.wolfram.com/MatrixMultiplication.html
	 * @methodOf Matrix#
	 *
	 * @param {Matrix} matrix The matrix to multiply this matrix by.
	 * @returns {Matrix} The result of the matrix multiplication, a new matrix.
	 */
	Matrix.prototype.concat = function(matrix) {
	  return Matrix(
	    this.a * matrix.a + this.c * matrix.b,
	    this.b * matrix.a + this.d * matrix.b,
	    this.a * matrix.c + this.c * matrix.d,
	    this.b * matrix.c + this.d * matrix.d,
	    this.a * matrix.tx + this.c * matrix.ty + this.tx,
	    this.b * matrix.tx + this.d * matrix.ty + this.ty
	  );
	};

	/**
	 * Given a point in the pretransform coordinate space, returns the coordinates of
	 * that point after the transformation occurs. Unlike the standard transformation
	 * applied using the transformPoint() method, the deltaTransformPoint() method's
	 * transformation does not consider the translation parameters tx and ty.
	 * @see #transformPoint
	 *
	 * @return {Point} A new point transformed by this matrix ignoring tx and ty.
	 */
	Matrix.prototype.deltaTransformPoint = function(point) {
	  return Point__default(
	    this.a * point.x + this.c * point.y,
	    this.b * point.x + this.d * point.y
	  );
	};

	/**
	 * Returns the inverse of the matrix.
	 * http://mathworld.wolfram.com/MatrixInverse.html
	 *
	 * @returns {Matrix} A new matrix that is the inverse of this matrix.
	 */
	Matrix.prototype.getInverse = function() {
	    var determinant = this.a * this.d - this.b * this.c;
	    return new Matrix(
			this.d / determinant,
			-this.b / determinant,
			-this.c / determinant,
			this.a / determinant,
			(this.c * this.ty - this.d * this.tx) / determinant,
			(this.b * this.tx - this.a * this.ty) / determinant
	    );
	  };
	  /**
	   * Returns a new matrix that corresponds this matrix multiplied by a
	   * a rotation matrix.
	   * @see Matrix.rotation
	   *
	   * @param {Number} theta Amount to rotate in radians.
	   * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
	   * @returns {Matrix} A new matrix, rotated by the specified amount.
	   */
	Matrix.prototype.rotate = function(theta, aboutPoint) {
	  return this.concat(Matrix.rotation(theta, aboutPoint));
	};

	/**
	 * Returns a new matrix that corresponds this matrix multiplied by a
	 * a scaling matrix.
	 * @see Matrix.scale
	 *
	 * @param {Number} sx
	 * @param {Number} [sy]
	 * @param {Point} [aboutPoint] The point that remains fixed during the scaling
	 * @returns {Matrix}
	 */
	Matrix.prototype.scale = function(sx, sy, aboutPoint) {
	  return this.concat(Matrix.scale(sx, sy, aboutPoint));
	};


	/**
	 * @methodOf Matrix#
	 * @see Matrix.translation
	 *
	 * @param {Number} tx The translation along the x axis.
	 * @param {Number} ty The translation along the y axis.
	 * @returns {Matrix} A new matrix with the translation applied.
	 */
	Matrix.prototype.translate = function(tx, ty) {
	  return this.concat(Matrix.translation(tx, ty));
	};

	exports.Matrix = Matrix;

	DateAxis.prototype = new DataModel();
	DateAxis.prototype.constructor = DateAxis;

	/**
	 * @classdesc Date based {@link Axis}.
	 *
	 * @description Creates a new DateAxis.
	 * @constructor
	 * @category dates
	 */
	function DateAxis(departureDateInterval, arrivalInterval) {
	  arrivalInterval = arrivalInterval == null ? new Interval__default(0, 1) : arrivalInterval;
	  DataModel.apply(this, arguments);
	  this.departureDateInterval = departureDateInterval;
	  this.arrivalInterval = arrivalInterval;

	  this.time0;
	  this.time1;
	  this.dTime;
	  this.arrivalAmplitude;

	  this.setDepartureDateInterval(departureDateInterval);
	  this.setArrivalInterval(arrivalInterval);

	  this.type = "DateAxis";
	}




	DateAxis.prototype.setDepartureDateInterval = function(departureDateInterval) {
	  this.departureDateInterval = departureDateInterval;
	  this.time0 = this.departureDateInterval.date0.getTime();
	  this.time1 = this.departureDateInterval.date1.getTime();
	  this.dTime = this.time1 - this.time0;

	};
	DateAxis.prototype.setArrivalInterval = function(arrivalInterval) {
	  this.arrivalInterval = arrivalInterval;
	  this.arrivalAmplitude = arrivalInterval.getAmplitude();
	};

	DateAxis.prototype.project = function(date) {
	  return this.arrivalInterval.x + this.arrivalAmplitude * (date.getTime() - this.time0) / this.dTime;
	};


	/**
	 * to be called once intreval values changed
	 */
	DateAxis.prototype.update = function() {
	  this.time0 = this.departureDateInterval.date0.getTime();
	  this.time1 = this.departureDateInterval.date1.getTime();
	  this.dTime = this.time1 - this.time0;
	  this.arrivalAmplitude = this.arrivalInterval.getAmplitude();
	};


	DateAxis.prototype.toString = function() {
	  return "DateAxis[" + this.departureDateInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
	};

	exports.DateAxis = DateAxis;

	DateInterval.prototype = new DataModel();
	DateInterval.prototype.constructor = DateInterval;

	/**
	 * @classdesc Date Interval
	 *
	 * @description Creates a new DateInterval.
	 * @param {Date} Interval's minimum value.
	 * @param {Date} Interval's maximum value.
	 * @constructor
	 * @category dates
	 */
	function DateInterval(date0, date1) {
	  DataModel.apply(this, arguments);
	  this.date0 = date0;
	  this.date1 = date1;
	  this.type = "DateInterval";
	}


	DateInterval.prototype.toString = function() {
	  return "DateInterval[" + this.date0 + ", " + this.date1 + "]";
	};

	DateInterval.prototype.getMax = function() {
	  if(this.date1 > this.date0) return this.date1;
	  return this.date0;
	};

	DateInterval.prototype.getMin = function() {
	  if(this.date0 < this.date1) return this.date0;
	  return this.date1;
	};

	/**
	 * converts the dateInterval into an Interval (getting milliseconds time from each date)
	 * @return {Interval}
	 * tags:conversion
	 */
	DateInterval.prototype.getTimesInterval = function() {
	  return new Interval__default(this.date0.getTime(), this.date1.getTime());
	};

	/**
	 * factors the dateInterval (specially useful: factor by an interval, in which case a sub-dateInterval is selected)
	 * @param  {Object} object could be: interval
	 * @return {DateInterval}
	 * tags:
	 */
	DateInterval.prototype.getProduct = function(object) { //TODO: complete with more object types
	  if(object == null) return;

	  if(object.type == 'Interval') {
	    var time0 = this.date0.getTime();
	    var time1 = this.date1.getTime();
	    var amp = time1 - time0;

	    return new DateInterval(new Date(time0 + object.x * amp), new Date(time0 + object.y * amp));
	  }

	  return null;
	};

	exports.DateInterval = DateInterval;

	function CountryOperators() {}


	CountryOperators.getSimplifiedName = function(name) {
	  return name.replace(/[\.\- ,\']/g, "").toLowerCase();
	};

	CountryOperators.getSimplifiedNames = function(names) {
	  var simplifiedNames = new StringList__default();
	  var name;
	  for(var i = 0; names[i] != null; i++) {
	    name = this.getSimplifiedName(names[i]);
	    if(name != "") simplifiedNames.pushIfUnique(name);
	  }
	  return simplifiedNames;
	};

	exports.CountryOperators = CountryOperators;

	Country.prototype = new Node();
	Country.prototype.constructor = Country;

	/**
	 * @classdesc Represents an individual country for visualization and spatial
	 * reasoning.
	 *
	* @description Creates a new Country instance.
	 * @param {String} id Country id (ISO2)
	 * @param {String} name Country name
	 * @constructor
	 * @category geo
	 */
	function Country(id, name) {
	  Node.apply(this, [id, name]);
	  this.type = "Country";

	  this.id = id;
	  this.name = name;

	  this.shortName;

	  this.continentName;
	  this.isoCode;
	  this.alternativeNames;
	  this.wikipediaUrl;
	  this.flagImageUrl;
	  this.smallFlagImageUrl;
	  this.recognized = false;
	  this.geoCenter;

	  this.polygonList;
	  this.simplePolygonList;

	  this.longestPolygon;
	  this.longestSimplePolygon;

	  this._simplifiedNames;
	  this._simplifiedId;
	  this._simplifiedName;

	  this._frame;
	}


	Country.prototype.generatesSimplifiedNames = function() {
	  this._simplifiedNames = CountryOperators.getSimplifiedNames(this.alternativeNames);
	  this._simplifiedId = CountryOperators.getSimplifiedName(this.id);
	  this._simplifiedName = CountryOperators.getSimplifiedName(this.name);
	  this.shortName = this.name
	    .replace('Democratic Republic', 'D.R.')
	    .replace('United States', 'U.S.A')
	    .replace('United Arab', 'U.A.');
	};

	Country.prototype.nameMatches = function(name) {
	  if(this._simplifiedId == null) this.generatesSimplifiedNames();
	  name = CountryOperators.getSimplifiedName(name);
	  if(name == this._simplifiedId || name == this._simplifiedName) return true;
	  return this._simplifiedNames.indexOf(name) != -1;
	};

	Country.prototype.getFrame = function() {
	  if(this._frame == null) {
	    this._frame = this.simplePolygonList == null ? this.polygonList.getFrame() : this.simplePolygonList.getFrame();
	  }
	  return this._frame;
	};

	exports.Country = Country;

	Relation.prototype = new Node();
	Relation.prototype.constructor = Relation;

	/**
	 * Relation
	 * @classdesc Relations represent the edges that connect Nodes
	 * in a Network DataType.
	 *
	 * @description create a new Relation.
	 * @constructor
	 * @param {String} id ID of the Relation.
	 * @param {String} name Name of the Relation.
	 * @param {Node} node0 Source of the Relation.
	 * @param {Node} node1 Destination of the Relation.
	 * @param {Number} weight Edge weight associated with Relation.
	 * Defaults to 1.
	 * @param {String} content Other data to associate with this Relation.
	 * @category networks
	 */
	function Relation(id, name, node0, node1, weight, content) {
	  Node.apply(this, [id, name]);
	  this.type = "Relation";

	  this.node0 = node0;
	  this.node1 = node1;
	  this.weight = weight == null ? 1 : weight;
	  this.content = content == null ? "" : content;
	}


	Relation.prototype.destroy = function() {
	  Node.prototype.destroy.call(this);
	  delete this.node0;
	  delete this.node1;
	  delete this.content;
	};

	Relation.prototype.getOther = function(node) {
	  return node == this.node0 ? this.node1 : this.node0;
	};

	Relation.prototype.clone = function() {
	  var relation = new Relation(this.id, this.name, this.node0, this.node1);

	  relation.x = this.x;
	  relation.y = this.y;
	  relation.z = this.z;

	  relation.nodeType = this.nodeType;

	  relation.weight = this.weight;
	  relation.descentWeight = this.descentWeight;

	  return relation;
	};

	exports.Relation = Relation;

	Network.prototype = new DataModel();
	Network.prototype.constructor = Network;

	/**
	 * @classdesc Networks are a DataType to store network data.
	 *
	 * Networks have nodes stored in a NodeList,
	 * and relations (edges) stored in a RelationList.
	 * @description Create a new Network instance.
	 * @constructor
	 * @category networks
	 */
	function Network() {
	  this.type = "Network";

	  this.nodeList = new NodeList();
	  this.relationList = new RelationList();
	}


	/**
	 * Get Nodes of the Network as a NodeList
	 * @return {NodeList}
	 * tags:
	 */
	Network.prototype.getNodes = function() {
	  return this.nodeList;
	};

	/**
	 * Get Relations (edges) of the Network as
	 * a RelationList.
	 * @return {RelationList}
	 * tags:
	 */
	Network.prototype.getRelations = function() {
	  return this.relationList;
	};

	/**
	 * get nodes ids property
	 * @return {StringList}
	 * tags:
	 */
	Network.prototype.getNodesIds = function() {
	  return this.nodeList.getIds();
	};



	/*
	 * building methods
	 */

	/**
	 * Add a node to the network
	 * @param {Node} node A new node that will be added to the network.
	 */
	Network.prototype.addNode = function(node) {
	  this.nodeList.addNode(node);
	};

	/**
	 * Retrieve a node from the nodeList of the Network with the given name (label).
	 * @param {String} name The name of the node to retrieve from the Network.
	 * @return {Node} The node with the given name. Null if no node with that name
	 * can be found in the Network.
	 */
	Network.prototype.getNodeWithName = function(name) {
	  return this.nodeList.getNodeWithName(name);
	};

	/**
	 * Retrieve node from Network with the given id.
	 * @param {String} id ID of the node to retrieve
	 * @return {Node} The node with the given id. Null if a node with this id is not
	 * in the Network.
	 */
	Network.prototype.getNodeWithId = function(id) {
	  return this.nodeList.getNodeWithId(id);
	};

	/**
	 * Add a new Relation (edge) to the Network between two nodes.
	 * @param {Node} node0 The source of the relation.
	 * @param {Node} node1 The destination of the relation.
	 * @param {String} id The id of the relation.
	 * @param {Number} weight A numerical weight associated with the relation (edge).
	 * @param {String} content Information associated with the relation.
	 */
	Network.prototype.createRelation = function(node0, node1, id, weight, content) {
	  this.addRelation(new Relation(id, id, node0, node1, weight, content));
	};

	/**
	 * Add an existing Relation (edge) to the Network.
	 * @param {Relation} relation The relation to add to the network.
	 */
	Network.prototype.addRelation = function(relation) {
	  this.relationList.addNode(relation);
	  relation.node0.nodeList.addNode(relation.node1);
	  relation.node0.relationList.addNode(relation);
	  relation.node0.toNodeList.addNode(relation.node1);
	  relation.node0.toRelationList.addNode(relation);
	  relation.node1.nodeList.addNode(relation.node0);
	  relation.node1.relationList.addNode(relation);
	  relation.node1.fromNodeList.addNode(relation.node0);
	  relation.node1.fromRelationList.addNode(relation);
	};

	/**
	 * Create a new Relation between two nodes in the network
	 * @param {Node} node0 The source of the relation.
	 * @param {Node} node1 The destination of the relation.
	 * @param {String} id The id of the relation. If missing, an id will be generated
	 * based on the id's of node0 and node1.
	 * @param {Number} weight=1 A numerical weight associated with the relation (edge).
	 * @param {String} content Information associated with the relation.
	 * @return {Relation} The new relation added to the Network.
	 */
	Network.prototype.connect = function(node0, node1, id, weight, content) {
	  id = id || (node0.id + "_" + node1.id);
	  weight = weight || 1;
	  var relation = new Relation(id, id, node0, node1, weight);
	  this.addRelation(relation);
	  relation.content = content;
	  return relation;
	};



	/*
	 * removing methods
	 */

	/**
	 * Remove a node from the Network
	 * @param {Node} node The node to remove.
	 */
	Network.prototype.removeNode = function(node) {
	  this.removeNodeRelations(node);
	  this.nodeList.removeNode(node);
	};

	/**
	 * Remove all Relations connected to the node from the Network.
	 * @param {Node} node Node who's relations will be removed.
	 */
	Network.prototype.removeNodeRelations = function(node) {
	  for(var i = 0; node.relationList[i] != null; i++) {
	    this.removeRelation(node.relationList[i]);
	    i--;
	  }
	};

	/**
	 * Remove all Nodes from the Network.
	 */
	Network.prototype.removeNodes = function() {
	  this.nodeList.deleteNodes();
	  this.relationList.deleteNodes();
	};

	Network.prototype.removeRelation = function(relation) {
	  this.relationList.removeElement(relation);
	  relation.node0.nodeList.removeNode(relation.node1);
	  relation.node0.relationList.removeRelation(relation);
	  relation.node0.toNodeList.removeNode(relation.node1);
	  relation.node0.toRelationList.removeRelation(relation);
	  relation.node1.nodeList.removeNode(relation.node0);
	  relation.node1.relationList.removeRelation(relation);
	  relation.node1.fromNodeList.removeNode(relation.node0);
	  relation.node1.fromRelationList.removeRelation(relation);
	};

	/**
	 * Transformative method, removes nodes without a minimal number of connections
	 * @param  {Number} minDegree minimal degree
	 * @return {Number} number of nodes removed
	 * tags:transform
	 */
	Network.prototype.removeIsolatedNodes = function(minDegree) {
	  var i;
	  var nRemoved = 0;
	  minDegree = minDegree == null ? 1 : minDegree;

	  for(i = 0; this.nodeList[i] != null; i++) {
	    if(this.nodeList[i].getDegree() < minDegree) {
	      this.nodeList[i]._toRemove = true;
	    }
	  }

	  for(i = 0; this.nodeList[i] != null; i++) {
	    if(this.nodeList[i]._toRemove) {
	      this.removeNode(this.nodeList[i]);
	      nRemoved++;
	      i--;
	    }
	  }

	  return nRemoved;
	};



	Network.prototype.clone = function(nodePropertiesNames, relationPropertiesNames, idsSubfix, namesSubfix) {
	  var newNetwork = new Network();
	  var newNode, newRelation;
	  var i;

	  idsSubfix = idsSubfix == null ? '' : String(idsSubfix);
	  namesSubfix = namesSubfix == null ? '' : String(namesSubfix);

	  this.nodeList.forEach(function(node) {
	    newNode = new Node(idsSubfix + node.id, namesSubfix + node.name);
	    if(idsSubfix != '') newNode.basicId = node.id;
	    if(namesSubfix != '') newNode.basicName = node.name;
	    if(nodePropertiesNames) {
	      nodePropertiesNames.forEach(function(propName) {
	        if(node[propName] != null) newNode[propName] = node[propName];
	      });
	    }
	    newNetwork.addNode(newNode);
	  });

	  this.relationList.forEach(function(relation) {
	    newRelation = new Relation(idsSubfix + relation.id, namesSubfix + relation.name, newNetwork.nodeList.getNodeById(idsSubfix + relation.node0.id), newNetwork.nodeList.getNodeById(idsSubfix + relation.node1.id));
	    if(idsSubfix != '') newRelation.basicId = relation.id;
	    if(namesSubfix != '') newRelation.basicName = relation.name;
	    if(relationPropertiesNames) {
	      relationPropertiesNames.forEach(function(propName) {
	        if(relation[propName] != null) newRelation[propName] = relation[propName];
	      });
	    }
	    newNetwork.addRelation(newRelation);
	  });

	  return newNetwork;
	};


	Network.prototype.getReport = function() {
	  return "network contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
	};

	Network.prototype.destroy = function() {
	  delete this.type;
	  this.nodeList.destroy();
	  this.relationList.destroy();
	  delete this.nodeList;
	  delete this.relationList;
	};

	exports.Network = Network;

	Tree.prototype = new Network();
	Tree.prototype.constructor = Tree;

	/**
	 * @classdesc Trees are Networks that have a hierarchical structure.
	 *
	 * @description Create a new Tree.
	 * @constructor
	 * @category networks
	 */
	function Tree() {
	  Network.apply(this);
	  this.type = "Tree";

	  this.nLevels = 0;
	  this._createRelation = this.createRelation;
	  this.createRelation = this._newCreateRelation;
	}


	/**
	 * Adds a given Node to the tree, under the given parent Node.
	 *
	 * @param {Node} node
	 * @param {Node} parent
	 */
	Tree.prototype.addNodeToTree = function(node, parent) {
	  this.addNode(node);
	  if(parent == null) {
	    node.level = 0;
	    node.parent = null;
	  } else {
	    var relation = new Relation(parent.id + "_" + node.id, parent.id + "_" + node.id, parent, node);
	    this.addRelation(relation);
	    //this._createRelation(parent, node);
	    node.level = parent.level + 1;
	    node.parent = parent;
	  }
	  this.nLevels = Math.max(this.nLevels, node.level + 1);
	};

	/**
	 * @ignore
	 */
	Network.prototype._newCreateRelation = function(parent, node, id, weight) {
	  if(id == null) id = this.relationList.getNewId();
	  this._createRelation(parent, node, id, weight);
	  node.level = parent.level + 1;
	  node.parent = parent;
	  this.nLevels = Math.max(this.nLevels, node.level + 1);
	};

	/**
	 * Adds a new parent node to the Tree.
	 *
	 * @param {Node} node New Parent Node.
	 */
	Tree.prototype.addFather = function(node, children) {
	  //TODO: is children supposed to be child?
	  if(child.parent != null || this.nodeList.indexOf(child) == -1) return false;
	  this.addNode(node);
	  child.parent = node;
	  child.level = 1;
	  this.nLevels = Math.max(this.nLevels, 1);
	  this.createRelation(node, child);
	};

	/**
	 * Provides a {@link NodeList} of all the Nodes of the Tree at a given level.
	 *
	 * @param {Number} level Level (depth) of the Tree to extract Nodes at.
	 * @return {NodeList} All Nodes at the given level of the tree.
	 */
	Tree.prototype.getNodesByLevel = function(level) {
	  var newNodeList = new NodeList();
	  for(i = 0; this.nodeList[i] != null; i++) {
	    if(this.nodeList[i].level == level) newNodeList.addNode(this.nodeList[i]);
	  }
	  return newNodeList;
	};

	/**
	 * Returns the leaves (nodes without children) of a tree.
	 *
	 * @param {Node} node Optional parent Node to start the leaf search from.
	 * If no Node is provided, all leaf Nodes are returned.
	 * @return {NodeList} Leaves of the Tree or sub-tree.
	 * tags:
	 */
	Tree.prototype.getLeaves = function(node) {
	  var leaves = new NodeList();
	  if(node) {
	    if(node.toNodeList.length == 0) {
	      leaves.addNode(node);
	      return leaves;
	    }
	    var addLeaves = function(candidate) {
	      if(candidate.toNodeList.length == 0) {
	        leaves.addNode(candidate);
	      } else {
	        candidate.toNodeList.forEach(addLeaves);
	      }
	    };
	    node.toNodeList.forEach(addLeaves);
	  } else {
	    this.nodeList.forEach(function(candidate) {
	      if(candidate.toNodeList.length == 0) leaves.addNode(candidate);
	    });
	  }
	  return leaves;
	};

	/**
	 * assignDescentWeightsToNodes
	 *
	 * @return {undefined}
	 */
	Tree.prototype.assignDescentWeightsToNodes = function() {
	  this._assignDescentWeightsToNode(this.nodeList[0]);
	};

	/**
	 * @ignore
	 */
	Tree.prototype._assignDescentWeightsToNode = function(node) {
	  var i;
	  if(node.toNodeList.length == 0) {
	    node.descentWeight = 1;
	    return 1;
	  }
	  for(i = 0; node.toNodeList[i] != null; i++) {
	    node.descentWeight += this._assignDescentWeightsToNode(node.toNodeList[i]);
	  }
	  return node.descentWeight;
	};

	/**
	 * Returns a string indicating the size of the Tree.
	 *
	 * @return {String} Log message indicating Tree's size.
	 */
	Tree.prototype.getReport = function(relation) {
	  //TODO: remove relation input?
	  return "Tree contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
	};

	exports.Tree = Tree;

	//TODO: delete many functions that are deprectaed, replaced by SimpleGraphics.js functions

	//include(frameworksRoot+"operators/geometry/GeometryOperators.js");
	/**
	 * @classdesc Draw basic shapes
	 *
	 * @namespace
	 * @category geometry
	 */
	function Draw() {}


	Draw.drawSmoothPolygon = function(polygon, closed, amount) { //TODO: add tx, ty
	  amount = amount == null ? 30 : amount;
	  var controlPoints;

	  if(polygon.length < 2) return null;
	  if(polygon.length == 2) {
	    var a = Math.atan2(polygon[1].y - polygon[0].y, polygon[1].x - polygon[0].x) - 0.5 * Math.PI;
	    var cosa = amount * Math.cos(a);
	    var sina = amount * Math.sin(a);
	    context.moveTo(polygon[0].x, polygon[0].y);
	    context.bezierCurveTo(
	      polygon[0].x + cosa, polygon[0].y + sina,
	      polygon[1].x + cosa, polygon[1].y + sina,
	      polygon[1].x, polygon[1].y
	    );
	    context.bezierCurveTo(
	      polygon[1].x - cosa, polygon[1].y - sina,
	      polygon[0].x - cosa, polygon[0].y - sina,
	      polygon[0].x, polygon[0].y
	    );
	    return;
	  }
	  var i;
	  var nPoints = polygon.length;
	  var prevPoint = polygon[nPoints - 1];
	  var point = polygon[0];
	  var nextPoint = polygon[1];
	  controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
	  var prevCP = controlPoints[1];
	  var cP;
	  context.moveTo(point.x, point.y);
	  prevPoint = point;
	  var nSteps = nPoints + Number(closed);
	  for(i = 1; i < nSteps; i++) {
	    point = polygon[i % nPoints];
	    nextPoint = polygon[(i + 1) % nPoints];
	    controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
	    cP = controlPoints[0];
	    context.bezierCurveTo(prevCP.x, prevCP.y, cP.x, cP.y, point.x, point.y);
	    prevCP = controlPoints[1];
	    prevPoint = point;
	  }
	};

	/**
	 * modes:
	 * 0: adjust to rectangle
	 * 1: center and mask
	 * 2: center and eventual reduction (image smaller than rectangle)
	 * 3: adjust to rectangle preserving proportions (image bigger than rectangle)
	 * 4: fill repeated from corner
	 * 5: fill repeated from 0,0
	 */
	Draw.fillRectangleWithImage = function(rectangle, image, mode, backColor) {
	  if(backColor != null) {
	    context.fillStyle = backColor;
	    context.beginPath();
	    context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	    context.fill();
	  }

	  var sx;
	  var sy;
	  var dx;
	  var dy;
	  var dWidth;
	  var dHeight;

	  switch(mode) {

	    case 0:
	      context.drawImage(image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	      break;
	    case 1:
	      sx = Math.max(image.width - rectangle.width, 0) * 0.5;
	      sy = Math.max(image.height - rectangle.height, 0) * 0.5;
	      dx = rectangle.x + Math.max(rectangle.width - image.width, 0) * 0.5;
	      dy = rectangle.y + Math.max(rectangle.height - image.height, 0) * 0.5;
	      dWidth = Math.min(image.width, rectangle.width);
	      dHeight = Math.min(image.height, rectangle.height);
	      context.drawImage(image, sx, sy, dWidth, dHeight, dx, dy, dWidth, dHeight);
	      break;
	    case 2:
	      sx = Math.max(image.width - rectangle.width, 0);
	      sy = Math.max(image.height - rectangle.height, 0);
	      dWidth = Math.min(image.width, rectangle.width);
	      dHeight = Math.min(image.height, rectangle.height);
	      var propD = dWidth / dHeight;
	      var propB = image.width / image.height;
	      if(propD < propB) dHeight = dWidth / propB;
	      if(propD > propB) dWidth = dHeight / propB;
	      dx = rectangle.x + (rectangle.width - dWidth) * 0.5;
	      dy = rectangle.y + (rectangle.height - dHeight) * 0.5;
	      context.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight);
	      break;
	    case 3:
	      if(rectangle.width / rectangle.height < image.width / image.height) {
	        sh = image.height;
	        sw = sh * rectangle.width / rectangle.height;
	        sx = 0.5 * (image.width - sw);
	        sy = 0;

	      } else {
	        sw = image.width;
	        sh = sw * rectangle.height / rectangle.width;
	        sx = 0;
	        sy = 0.5 * (image.height - sh);

	      }
	      context.drawImage(image, sx, sy, sw, sh, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
	      break;
	    case 4:
	      break;
	    case 5:
	      break;
	  }
	};


	/**
	 * Draws an ellipse using the current state of the canvas.
	 * @param {CanvasRenderingContext2D} context
	 * @param {Number} x The center x coordinate
	 * @param {Number} y The center y coordinate
	 * @param {Number} rW The horizontal radius of the ellipse
	 * @param {Number} rH The vertical radius of the ellipse

	 */
	Draw.drawEllipse = function(x, y, rW, rH) {
	  var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
	    ox = rW * k, // control point offset horizontal
	    oy = rH * k, // control point offset vertical
	    xe = x + rW, // x-end
	    ye = y + rH; // y-end

	  context.moveTo(x - rW, y);
	  context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
	  context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
	  context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
	  context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
	  context.moveTo(x - rW, y);
	};

	/**
	 * Draws a polygon
	 * @param {CanvasRenderingContext2D} context
	 * @param {Polygon} Polygon to draw
	 * @param {Boolean} close polygon
	 * @param {Number} tx horizontal translation
	 * @param {Number} ty vertical translation
	 */
	Draw.drawPolygon = function(polygon, close, tx, ty) {
	  tx = tx || 0;
	  ty = ty || 0;
	  var i;
	  context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
	  for(i = 1; polygon[i] != null; i++) {
	    context.lineTo(tx + polygon[i].x, ty + polygon[i].y);
	  }
	  if(close) {
	    context.lineTo(tx + polygon[0].x, ty + polygon[0].y);
	  }
	};

	Draw.drawPolygonWithControlPoints = function(polygon, controlPoints, tx, ty) {
	  tx = tx || 0;
	  ty = ty || 0;
	  var i;
	  context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
	  for(i = 1; polygon[i] != null; i++) {
	    context.bezierCurveTo(tx + controlPoints[(i - 1) * 2].x, ty + controlPoints[(i - 1) * 2].y,
	      tx + controlPoints[i * 2 - 1].x, ty + controlPoints[i * 2 - 1].y,
	      tx + polygon[i].x, ty + polygon[i].y);
	  }
	};

	Draw.drawBezierPolygon = function(bezierPolygon, tx, ty) {
	  tx = tx || 0;
	  ty = ty || 0;
	  var bI;
	  var N = Math.floor((bezierPolygon.length - 1) / 3);
	  var i;
	  context.moveTo(tx + bezierPolygon[0].x, ty + bezierPolygon[0].y);
	  for(i = 0; i < N; i++) {
	    bI = i * 3 + 1;

	    context.bezierCurveTo(
	      tx + bezierPolygon[bI].x, ty + bezierPolygon[bI].y,
	      tx + bezierPolygon[bI + 1].x, ty + bezierPolygon[bI + 1].y,
	      tx + bezierPolygon[bI + 2].x, ty + bezierPolygon[bI + 2].y
	    );
	  }
	};

	Draw.drawBezierPolygonTransformed = function(bezierPolygon, transformationFunction) {
	  if(bezierPolygon == null ||  bezierPolygon.length == 0) return;

	  var bI;
	  var N = Math.floor((bezierPolygon.length - 1) / 3);
	  var i;
	  var p0 = transformationFunction(bezierPolygon[0]);
	  var p1;
	  var p2;

	  context.moveTo(p0.x, p0.y);
	  for(i = 0; i < N; i++) {
	    bI = i * 3 + 1;

	    p0 = transformationFunction(bezierPolygon[bI]);
	    p1 = transformationFunction(bezierPolygon[bI + 1]);
	    p2 = transformationFunction(bezierPolygon[bI + 2]);

	    context.bezierCurveTo(
	      p0.x, p0.y,
	      p1.x, p1.y,
	      p2.x, p2.y
	    );
	  }
	};

	Draw.drawPolygonTransformed = function(polygon, transformationFunction) {
	  var p = transformationFunction(polygon[0]);
	  context.moveTo(p.x, p.y);
	  for(i = 0; polygon[i] != null; i++) {
	    p = transformationFunction(polygon[i]);
	    context.lineTo(p.x, p.y);
	  }
	};


	Draw.drawSliderRectangle = function(x, y, width, height) {
	  context.arc(x + width * 0.5, y, width * 0.5, Math.PI, TwoPi);
	  context.lineTo(x + width, y);
	  context.arc(x + width * 0.5, y + height, width * 0.5, 0, Math.PI);
	  context.lineTo(x, y);
	  //context.fillRect(x, y, width, height);
	};



	/**
	 * Draws a rounded rectangle using the current state of the canvas.
	 * If you omit the last three params, it will draw a rectangle
	 * outline with a 5 pixel border radius
	 * @param {CanvasRenderingContext2D} context
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 * @param {Number} radius The corner radius. Defaults to 5;
	 */
	Draw.drawRoundRect = function(x, y, width, height, radius) {
	  radius = radius || 0;
	  var bottom = y + height;
	  context.moveTo(x + radius, y);
	  context.lineTo(x + width - radius, y);
	  context.quadraticCurveTo(x + width, y, x + width, y + radius);
	  context.lineTo(x + width, y + height - radius);
	  context.quadraticCurveTo(x + width, bottom, x + width - radius, bottom);
	  context.lineTo(x + radius, bottom);
	  context.quadraticCurveTo(x, bottom, x, bottom - radius);
	  context.lineTo(x, y + radius);
	  context.quadraticCurveTo(x, y, x + radius, y);
	};

	Draw.drawEquilateralTriangle = function(x, y, radius, angle) { //deprecated
	  angle = angle || 0;
	  context.moveTo(radius * Math.cos(angle) + x, radius * Math.sin(angle) + y);
	  context.lineTo(radius * Math.cos(angle + 2.0944) + x, radius * Math.sin(angle + 2.0944) + y);
	  context.lineTo(radius * Math.cos(angle + 4.1888) + x, radius * Math.sin(angle + 4.1888) + y);
	  context.lineTo(radius * Math.cos(angle) + x, radius * Math.sin(angle) + y);
	};

	Draw.drawArrowTriangle = function(p0, p1, base) {
	  var angle = p0.angleToPoint(p1);
	  var height = p0.distanceToPoint(p1);
	  Draw.drawTriangleFromBase(p0.x, p0.y, base, height, angle);
	};

	Draw.drawTriangleFromBase = function(x, y, base, height, angle) {
	  context.moveTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
	  context.lineTo(x + 0.5 * base * Math.cos(angle - Math.PI * 0.5), y + 0.5 * base * Math.sin(angle - Math.PI * 0.5));
	  context.lineTo(x + height * Math.cos(angle), y + height * Math.sin(angle));
	  context.lineTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
	};

	Draw.drawHorizontalFlowPiece = function(x0, x1, y0U, y0D, y1U, y1D, offX) {
	  context.moveTo(x0, y0U);
	  context.bezierCurveTo(x0 + offX, y0U, x1 - offX, y1U, x1, y1U);
	  context.lineTo(x1, y1D);
	  context.bezierCurveTo(x1 - offX, y1D, x0 + offX, y0D, x0, y0D);
	  context.lineTo(x0, y0U);
	};



	Draw.drawRectangles = function(rectangleList, x, y, colors, margin, bitmapDataList, bitmapDataDrawMode) {
	  margin = margin || 0;
	  var twoMargin = 2 * margin;
	  var i;
	  var rect;
	  if(colors != null) var nColors = colors.length;
	  var adjustedRect = new Rectangle();
	  for(i = 0; rectangleList[i] != null; i++) {
	    rect = rectangleList[i];
	    if(rect.height <= margin || rect.width <= margin) continue;
	    if(colors != null) context.fillStyle = colors[i % nColors];
	    context.fillRect(rect.x + x + margin, rect.y + y + margin, rect.width - twoMargin, rect.height - twoMargin);
	    if(bitmapDataList != null && bitmapDataList[i] != null) {
	      adjustedRect.x = rect.x + x + margin;
	      adjustedRect.y = rect.y + y + margin;
	      adjustedRect.width = rect.width - twoMargin;
	      adjustedRect.height = rect.height - twoMargin;
	      Draw.fillRectangleWithImage(context, adjustedRect, bitmapDataList[i], bitmapDataDrawMode);
	    }
	  }
	};

	Draw.drawQuadrilater = function(p0, p1, p2, p3, close) {
	  close = close == null ? true : close;
	  context.moveTo(p0.x, p0.y);
	  context.lineTo(p1.x, p1.y);
	  context.lineTo(p2.x, p2.y);
	  context.lineTo(p3.x, p3.y);
	  if(close) context.lineTo(p0.x, p0.y);
	};

	/**
	 * it assumes that both circles centers have same y coordinates
	 */
	Draw.drawLens = function(circle0, circle1) {
	  if(circle1.x < circle0.x) {
	    var _circle = circle1.clone();
	    circle1 = circle0.clone();
	    circle0 = _circle;
	  }
	  if(circle1.x + circle1.z <= circle0.x + circle0.z) {
	    context.arc(circle1.x, circle1.y, circle1.z, 0, TwoPi);
	    return;
	  } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
	    context.arc(circle0.x, circle0.y, circle0.z, 0, TwoPi);
	    return;
	  }

	  var angles = GeometryOperators.circlesLensAngles(circle0, circle1);

	  context.arc(circle0.x, circle0.y, circle0.z, angles[0], angles[1]);
	  context.arc(circle1.x, circle1.y, circle1.z, angles[2], angles[3]);
	};



	Draw.drawAndCapture = function(drawFunction, frame, target) {

	  var defaultContext = context;
	  context = hiddenContext;
	  context.canvas.setAttribute('width', frame.width);
	  context.canvas.setAttribute('height', frame.height);
	  context.clearRect(0, 0, frame.width, frame.height);

	  context.translate(-frame.x, -frame.y);

	  drawFunction.call(target);

	  var image = new Image();
	  image.src = context.canvas.toDataURL();

	  context = defaultContext;
	  return image;
	};

	Point3D.prototype = new Point__default();
	Point3D.prototype.constructor = Point3D;
	/**
	 * @classdesc Point3D represents a point in 3D space.
	 *
	 * @description Create a new 3D Point.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} z
	 * @constructor
	 * @category geometry
	 */
	function Point3D(x, y, z) {
	  Point__default.apply(this, arguments);
	  //this.name='';
	  this.type = "Point3D";
	  this.z = z;
	}


	Point3D.prototype.distanceToPoint3D = function(point3D) {
	  return Math.sqrt(Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2));
	};

	Point3D.prototype.distanceToPointSquared = function(point3D) {
	  return Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2);
	};
	Point3D.prototype.getNorm = function() {
	  return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	};

	Point3D.prototype.normalizeToValue = function(k) {
	  var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
	  return new Point3D(this.x * factor, this.y * factor, this.z * factor);
	};

	Point3D.prototype.cross = function(point3D) {
	  var _x = this.y * point3D.z - this.z * point3D.y;
	  var _y = this.z * point3D.x - this.x * point3D.z;
	  var _z = this.x * point3D.y - this.y * point3D.x;
	  return new Point3D(_x, _y, _z);
	};
	Point3D.prototype.dot = function(point3D) {
	  return this.x * point3D.x + this.y * point3D.y + this.z * point3D.z;
	};
	Point3D.prototype.add = function(point) {
	  return new Point3D(point.x + this.x, point.y + this.y, point.z + this.z);
	};
	Point3D.prototype.subtract = function(point) {
	  return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
	};
	Point3D.prototype.factor = function(k) {
	  return new Point3D(this.x * k, this.y * k, this.z * k);
	};
	Point3D.prototype.interpolate = function(point3D, t) {
	  return new Point3D((1 - t) * this.x + t * point3D.x, (1 - t) * this.y + t * point3D.y, (1 - t) * this.z + t * point3D.z);
	};
	Point3D.prototype.getAngles = function() {
	  var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	  var alfa = 0.5 * Math.PI - Math.atan2(this.z / radius, this.y / radius);
	  var beta = -Math.asin(this.x / radius);
	  if(alfa < -Math.PI) alfa += 2 * Math.PI;
	  if(alfa > Math.PI) alfa -= 2 * Math.PI;
	  if(beta < -Math.PI) beta += 2 * Math.PI;
	  if(beta > Math.PI) beta -= 2 * Math.PI;
	  return new Point3D(alfa, beta, 0);
	};
	Point3D.prototype.getInverseAngles = function() {
	  var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	  var alfa = -0.5 * Math.PI + Math.atan2(-this.z / radius, -this.y / radius);
	  var beta = Math.asin(-this.x / radius);
	  if(alfa < -Math.PI) alfa += 2 * Math.PI;
	  if(alfa > Math.PI) alfa -= 2 * Math.PI;
	  if(beta < -Math.PI) beta += 2 * Math.PI;
	  if(beta > Math.PI) beta -= 2 * Math.PI;
	  return new Point3D(alfa, beta, 0);
	};


	Point3D.prototype.clone = function() {
	  return new Point3D(this.x, this.y, this.z);
	};
	Point3D.prototype.toString = function() {
	  return "(x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")";
	};

	Point3D.prototype.destroy = function() {
	  delete this.type;
	  delete this.name;
	  delete this.x;
	  delete this.y;
	  delete this.z;
	};

	exports.Point3D = Point3D;

	/**
	 * @classdesc Provides a set of tools that work with {@link Point|Points}.
	 *
	 * @namespace
	 * @category geometry
	 */
	function PointOperators() {}




	PointOperators.angleBetweenVectors = function(point0, point1) {
	  return Math.atan2(point1.y, point1.x) - Math.atan2(point0.y, point0.x);
	};

	PointOperators.angleFromTwoPoints = function(point0, point1) {
	  return Math.atan2(point1.y - point0.y, point1.x - point0.x);
	};

	PointOperators.dot = function(point0, point1) {
	  return point0.x * point1.x + point0.y * point1.y;
	};

	PointOperators.twoPointsInterpolation = function(point0, point1, t) {
	  return new Point((1 - t) * point0.x + t * point1.x, (1 - t) * point0.y + t * point1.y);
	};

	exports.PointOperators = PointOperators;

	Polygon3D.prototype = new List__default();
	Polygon3D.prototype.constructor = Polygon3D;

	/**
	 * @classdesc Polygon3D brings the {@link Polygon} concept into three
	 * dimensions through the use of {@link Point3D}.
	 *
	 * @description Creates a new Polygon3D.
	 * @constructor
	 * @category geometry
	 */
	function Polygon3D() {
	  var array = List__default.apply(this, arguments);
	  array = Polygon3D.fromArray(array);
	  return array;
	}


	Polygon3D.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "Polygon3D";
	  //assign methods to array:
	  return result;
	};

	exports.Polygon3D = Polygon3D;

	function GeometryOperators__GeometryOperators() {}
	var GeometryOperators__default = GeometryOperators__GeometryOperators;


	/**
	 * from three Points calculates two control Points for the middle Point that will define a curve (using Bézier) that goes softly through the three points
	 * TODO: finish method by taking into account distances
	 */
	GeometryOperators__GeometryOperators.getSoftenControlPoints = function(point0, point1, point2, controlVectorSize) {
	  controlVectorSize = controlVectorSize || 10;
	  var angle = PointOperators.angleFromTwoPoints(point0, point2);
	  var controlPoint0 = new Point__default(point1.x - controlVectorSize * Math.cos(angle), point1.y - controlVectorSize * Math.sin(angle));
	  var controlPoint1 = new Point__default(point1.x + controlVectorSize * Math.cos(angle), point1.y + controlVectorSize * Math.sin(angle));
	  return [controlPoint0, controlPoint1];
	};

	GeometryOperators__GeometryOperators.bezierCurvePoints = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t) {
	  var s = 1 - t;
	  var ax = s * x0 + t * c0x;
	  var ay = s * y0 + t * c0y;

	  var bx = s * c0x + t * c1x;
	  var by = s * c0y + t * c1y;

	  var cx = s * c1x + t * x1;
	  var cy = s * c1y + t * y1;

	  var ex = s * ax + t * bx;
	  var ey = s * ay + t * by;

	  var fx = s * bx + t * cx;
	  var fy = s * by + t * cy;

	  return new Point__default(t * fx + s * ex, t * fy + s * ey);
	};



	GeometryOperators__GeometryOperators.trueBezierCurveHeightHorizontalControlPoints = function(x0, x1, y0, y1, c0x, c1x, x) {
	  var dx = x1 - x0;
	  var x = (x - x0) / dx;
	  var c0x = (c0x - x0) / dx;
	  var c1x = (c1x - x0) / dx;

	  if(GeometryOperators__GeometryOperators._bezierSimpleCurveTable == null) {
	    var i, p;

	    GeometryOperators__GeometryOperators._bezierSimpleCurveTable = new NumberList();

	    for(i = 1; i < 10000; i++) {
	      p = GeometryOperators__GeometryOperators.bezierCurvePoints(0, 0, c0x, 0, c1x, 1, 1, 1, i / 10000);
	      GeometryOperators__GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * p.x)] = p.y;
	    }

	    GeometryOperators__GeometryOperators._bezierSimpleCurveTable[0] = 0;
	    GeometryOperators__GeometryOperators._bezierSimpleCurveTable[1] = 1;
	  }

	  return GeometryOperators__GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * x)] * (y1 - y0) + y0;

	};


	/**
	 * This an approximation, it doesn't take into account actual values of c0x and c1x
	 */
	GeometryOperators__GeometryOperators.bezierCurveHeightHorizontalControlPoints = function(y0, c0x, c1x, y1, t) { //TODO:fix

	  var cosinus = Math.cos(Math.PI * (t - 1));
	  var sign = cosinus > 0 ? 1 : -1;

	  return(0.5 + 0.5 * (Math.pow(cosinus * sign, 0.6) * sign)) * (y1 - y0) + y0;
	};

	/**
	 * unefficient method (uses Newton strategy)
	 */
	GeometryOperators__GeometryOperators.distanceToBezierCurve = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, p, returnPoint) {
	  var minDT = 0.01;
	  var t0 = 0;
	  var t1 = 1;
	  var p0 = new Point__default(x0, y0);
	  var p0I = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, minDT);
	  var p1 = new Point__default(x1, y1);
	  var p1I = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, 1 - minDT);
	  var d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
	  var d0I = Math.pow(p0I.x - p.x, 2) + Math.pow(p0I.y - p.y, 2);
	  var d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);
	  var d1I = Math.pow(p1I.x - p.x, 2) + Math.pow(p1I.y - p.y, 2);

	  var i;

	  var pM;
	  var pMI;

	  for(i = 0; i < 10; i++) {
	    pM = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5);
	    pMI = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5 + minDT);

	    d0 = Math.pow(pM.x - p.x, 2) + Math.pow(pM.y - p.y, 2);
	    d0I = Math.pow(pMI.x - p.x, 2) + Math.pow(pMI.y - p.y, 2);

	    if(d0 < d0I) {
	      t1 = (t0 + t1) * 0.5;
	      p1 = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t1);
	      d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);
	    } else {
	      t0 = (t0 + t1) * 0.5;
	      p0 = GeometryOperators__GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t0);
	      d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
	    }
	  }

	  if(returnPoint) return p1;
	  return Math.sqrt(Math.min(d0, d1));
	};

	GeometryOperators__GeometryOperators.triangleContainsPoint = function(pT0, pT1, pT2, p) {
	  var a = (pT0.x - p.x) * (pT1.y - p.y) - (pT1.x - p.x) * (pT0.y - p.y);
	  var b = (pT1.x - p.x) * (pT2.y - p.y) - (pT2.x - p.x) * (pT1.y - p.y);
	  var c = (pT2.x - p.x) * (pT0.y - p.y) - (pT0.x - p.x) * (pT2.y - p.y);
	  return(a > 0 && b > 0 && c > 0) || (a >= 0 && b >= 0 && c >= 0);
	};

	GeometryOperators__GeometryOperators.triangleArea = function(triangle) {
	  return Math.abs(triangle.a.x * (triangle.b.y - triangle.c.y) + triangle.b.x * (triangle.c.y - triangle.a.y) + triangle.c.x * (triangle.a.y - triangle.b.y)) / 2;
	};


	/////////////lines (line is a Point with values m and b in y=mx+b)

	GeometryOperators__GeometryOperators.lineFromTwoPoints = function(point0, point1) {
	  if(point0.x == point1.x) return new Point__default(Infinity, point0.x);
	  var m = (point1.y - point0.y) / (point1.x - point0.x);
	  return new Point__default(m, point0.y - m * point0.x);
	};

	GeometryOperators__GeometryOperators.distancePointToLine = function(point, line) {
	  var m2;
	  var b2;
	  if(line.x == 0) {
	    m2 = Infinity;
	    b2 = point.x;
	  } else {
	    m2 = -1 / line.x;
	    b2 = point.y - m2 * point.x;
	  }
	  var interPoint = GeometryOperators__GeometryOperators.intersectionLines(line, new Point__default(m2, b2));
	  return Math.sqrt(Math.pow(point.x - interPoint.x, 2) + Math.pow(point.y - interPoint.y, 2));
	};

	GeometryOperators__GeometryOperators.distancePointToSegment = function(point, point0Segment, point1Segment) {
	  var m = point0Segment.x == point1Segment.x ? Infinity : (point1Segment.y - point0Segment.y) / (point1Segment.x - point0Segment.x);
	  var line = m == Infinity ? new Point__default(Infinity, point0Segment.x) : new Point__default(m, point0Segment.y - m * point0Segment.x);
	  var m2;
	  var b2;
	  if(line.x == 0) {
	    m2 = Infinity;
	    b2 = point.x;
	  } else {
	    m2 = -1 / line.x;
	    b2 = point.y - m2 * point.x;
	  }
	  var interPoint = GeometryOperators__GeometryOperators.intersectionLines(line, new Point__default(m2, b2));
	  if(interPoint.x >= Math.min(point0Segment.x, point1Segment.x) && interPoint.x <= Math.max(point0Segment.x, point1Segment.x)) return point.distanceToPoint(interPoint);
	  return Math.min(point.distanceToPoint(point0Segment), point.distanceToPoint(point1Segment));
	};

	GeometryOperators__GeometryOperators.intersectionLines = function(line0, line1) {
	  if(line0.x == line1.x) {
	    if(line0.y == line1.y) {
	      if(line0.x == Infinity) {
	        return new Point__default(line0.y, 0);
	      } else {
	        return new Point__default(0, line0.y);
	      }
	    }
	    return null;
	  }
	  if(line0.x == Infinity) {
	    return new Point__default(line0.y, line1.x * line0.y + line1.y);
	  } else if(line1.x == Infinity) {
	    return new Point__default(line1.y, line0.x * line1.y + line0.y);
	  }

	  var xx = (line1.y - line0.y) / (line0.x - line1.x);
	  return new Point__default(xx, line0.x * xx + line0.y);
	};


	GeometryOperators__GeometryOperators.VennCircles = function(area0, area1, areaIntersection, centerInLens, precision) {
	  var rA = Math.sqrt(area0 / Math.PI);
	  var rB = Math.sqrt(area1 / Math.PI);
	  var d = GeometryOperators__GeometryOperators.circleDistancesFromCommonArea(rA, rB, areaIntersection, precision);

	  var circle0;
	  var circle1;

	  if(centerInLens) {
	    var x0 = (d * d + Math.pow(rA, 2) - Math.pow(rB, 2)) / (2 * d);

	    circle0 = new Point3D(-x0, 0, rA);
	    circle1 = new Point3D(d - x0, 0, rB);

	  } else {
	    circle0 = new Point3D(-d * 0.5, 0, rA);
	    circle1 = new Point3D(d * 0.5, 0, rB);
	  }

	  if(areaIntersection == 0) {
	    circle0.x -= d * 0.1;
	    circle1.x += d * 0.1;
	  }

	  return new Polygon3D(circle0, circle1);
	};

	/**
	 * very lazy and ineficcient solution (Newton algorithm)
	 * @param r0
	 * @param r1
	 * @param areaComun
	 * @param precision
	 *
	 */
	GeometryOperators__GeometryOperators.circleDistancesFromCommonArea = function(r0, r1, commonArea, precision) {
	  precision = precision || 0.1;
	  var d0 = Math.max(r0, r1) - Math.min(r0, r1);
	  var d1 = r0 + r1;
	  var dM = (d0 + d1) * 0.5;

	  var attempts = 0;

	  var currentArea = GeometryOperators__GeometryOperators.circlesCommonArea(r0, r1, dM);

	  while(Math.abs(currentArea - commonArea) > precision && attempts < 200) {
	    if(currentArea > commonArea) {
	      d0 = dM;
	      dM = (d1 + dM) * 0.5;
	    } else {
	      d1 = dM;
	      dM = (dM + d0) * 0.5;
	    }
	    attempts++;
	    currentArea = GeometryOperators__GeometryOperators.circlesCommonArea(r0, r1, dM);
	  }
	  return dM;
	};

	GeometryOperators__GeometryOperators.circlesCommonArea = function(ra, rb, d) {
	  if(d >= (ra + rb)) return 0;
	  if(d + Math.min(ra, rb) <= Math.max(ra, rb)) {
	    return Math.PI * Math.pow(Math.min(ra, rb), 2);
	  }

	  var d2 = Math.pow(d, 2);
	  var ra2 = Math.pow(ra, 2);
	  var rb2 = Math.pow(rb, 2);

	  return ra2 * Math.acos((d2 + ra2 - rb2) / (2 * d * ra)) + rb2 * Math.acos((d2 + rb2 - ra2) / (2 * d * rb)) - 0.5 * Math.sqrt((-d + ra + rb) * (d + ra - rb) * (d - ra + rb) * (d + ra + rb));
	};

	/**
	 * This method return the angles required to draw the intersection shape (lens) of two circles
	 */
	GeometryOperators__GeometryOperators.circlesLensAngles = function(circle0, circle1) {
	  if(circle1.x < circle0.x) {
	    var _circle = circle1.clone();
	    circle1 = circle0.clone();
	    circle0 = _circle;
	  }
	  if(circle1.x + circle1.z <= circle0.x + circle0.z) {
	    return null;
	  } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
	    return null;
	  }

	  var d = circle1.x - circle0.x;
	  var x0 = (d * d + Math.pow(circle0.z, 2) - Math.pow(circle1.z, 2)) / (2 * d);
	  var alfa = Math.acos(x0 / circle0.z);
	  var h = circle0.z * Math.sin(alfa);
	  var beta = Math.asin(h / circle1.z);

	  if(circle0.x + x0 < circle1.x) {
	    return new NumberList(-alfa, alfa, Math.PI - beta, Math.PI + beta);
	  } else {
	    return new NumberList(-alfa, alfa, beta, -beta);
	  }
	};




	//////Delauney

	GeometryOperators__GeometryOperators.delauney = function(polygon) { /// ---> move to Polygon operators, chnge name to getDelauneyTriangulation
	  return _triangulate(polygon);
	};


	function Triangle(a, b, c) {
	  this.a = a;
	  this.b = b;
	  this.c = c;

	  var A = b.x - a.x,
	    B = b.y - a.y,
	    C = c.x - a.x,
	    D = c.y - a.y,
	    E = A * (a.x + b.x) + B * (a.y + b.y),
	    F = C * (a.x + c.x) + D * (a.y + c.y),
	    G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
	    minx, miny, dx, dy;

	  /* If the points of the triangle are collinear, then just find the
	   * extremes and use the midpoint as the center of the circumcircle. */
	  if(Math.abs(G) < 0.000001) {
	    minx = Math.min(a.x, b.x, c.x);
	    miny = Math.min(a.y, b.y, c.y);
	    dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
	    dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

	    this.x = minx + dx;
	    this.y = miny + dy;
	    this.r = dx * dx + dy * dy;
	  }

	  else {
	    this.x = (D * E - B * F) / G;
	    this.y = (A * F - C * E) / G;
	    dx = this.x - a.x;
	    dy = this.y - a.y;
	    this.r = dx * dx + dy * dy;
	  }
	}


	function byX(a, b) {
	  return b.x - a.x;
	}

	function dedup(edges) {
	  var j = edges.length,
	    a, b, i, m, n;

	  outer: while(j) {
	    b = edges[--j];
	    a = edges[--j];
	    i = j;
	    while(i) {
	      n = edges[--i];
	      m = edges[--i];
	      if((a === m && b === n) || (a === n && b === m)) {
	        edges.splice(j, 2);
	        edges.splice(i, 2);
	        j -= 2;
	        continue outer;
	      }
	    }
	  }
	}

	function _triangulate(vertices) {
	  /* Bail if there aren't enough vertices to form any triangles. */
	  if(vertices.length < 3)
	    return [];

	  /* Ensure the vertex array is in order of descending X coordinate
	   * (which is needed to ensure a subquadratic runtime), and then find
	   * the bounding box around the points. */
	  vertices.sort(byX);

	  var i = vertices.length - 1,
	    xmin = vertices[i].x,
	    xmax = vertices[0].x,
	    ymin = vertices[i].y,
	    ymax = ymin;

	  while(i--) {
	    if(vertices[i].y < ymin) ymin = vertices[i].y;
	    if(vertices[i].y > ymax) ymax = vertices[i].y;
	  }

	  /* Find a supertriangle, which is a triangle that surrounds all the
	   * vertices. This is used like something of a sentinel value to remove
	   * cases in the main algorithm, and is removed before we return any
	   * results.
	   *
	   * Once found, put it in the "open" list. (The "open" list is for
	   * triangles who may still need to be considered; the "closed" list is
	   * for triangles which do not.) */
	  var dx = xmax - xmin,
	    dy = ymax - ymin,
	    dmax = (dx > dy) ? dx : dy,
	    xmid = (xmax + xmin) * 0.5,
	    ymid = (ymax + ymin) * 0.5,
	    open = [
	      new Triangle(
	          {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
	          {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
	          {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
	        )
	    ],
	    closed = [],
	    edges = [],
	    j, a, b;

	  /* Incrementally add each vertex to the mesh. */
	  i = vertices.length;
	  while(i--) {
	    /* For each open triangle, check to see if the current point is
	     * inside it's circumcircle. If it is, remove the triangle and add
	     * it's edges to an edge list. */
	    edges.length = 0;
	    j = open.length;
	    while(j--) {
	      /* If this point is to the right of this triangle's circumcircle,
	       * then this triangle should never get checked again. Remove it
	       * from the open list, add it to the closed list, and skip. */
	      dx = vertices[i].x - open[j].x;
	      if(dx > 0 && dx * dx > open[j].r) {
	        closed.push(open[j]);
	        open.splice(j, 1);
	        continue;
	      }

	      /* If not, skip this triangle. */
	      dy = vertices[i].y - open[j].y;
	      if(dx * dx + dy * dy > open[j].r)
	        continue;

	      /* Remove the triangle and add it's edges to the edge list. */
	      edges.push(
	        open[j].a, open[j].b,
	        open[j].b, open[j].c,
	        open[j].c, open[j].a
	      );
	      open.splice(j, 1);
	    }

	    /* Remove any doubled edges. */
	    dedup(edges);

	    /* Add a new triangle for each edge. */
	    j = edges.length;
	    while(j) {
	      b = edges[--j];
	      a = edges[--j];
	      open.push(new Triangle(a, b, vertices[i]));
	    }
	  }

	  /* Copy any remaining open triangles to the closed list, and then
	   * remove any triangles that share a vertex with the supertriangle. */
	  Array.prototype.push.apply(closed, open);

	  i = closed.length;
	  while(i--)
	    if(closed[i].a.__sentinel ||
	      closed[i].b.__sentinel ||
	      closed[i].c.__sentinel)
	      closed.splice(i, 1);

	    /* Yay, we're done! */
	  return closed;
	}

	exports.GeometryOperators = GeometryOperators__default;

	function NumberListGenerators() {}


	/**
	 * Generate a NumberList with sorted Numbers
	 * @param {Number} nValues length of the NumberList
	 *
	 * @param {Number} start first value
	 * @param {Number} step increment value
	 * @return {NumberList} generated NumberList
	 * tags:generator
	 */
	NumberListGenerators.createSortedNumberList = function(nValues, start, step) {
	  start = start || 0;
	  step = step || 1;
	  if(step == 0) step = 1;
	  var i;
	  var numberList = new NumberList__default();
	  for(i = 0; i < nValues; i++) {
	    numberList.push(start + i * step);
	  }
	  return numberList;
	};

	// TODO: Should this function be here?
	NumberList__default.createNumberListFromInterval = function(nElements, interval) {
	  if(interval == null) interval = new Interval(0, 1);
	  var numberList = new NumberList__default();
	  var range = interval.getAmplitude();
	  var i;
	  for(i = 0; i < nElements; i++) {
	    numberList.push(Number(interval.getMin()) + Number(Math.random() * range));
	  }
	  return numberList;
	};

	/**
	 * create a list with random numbers
	 * @param  {Number} nValues
	 *
	 * @param  {Interval} interval range of the numberList
	 * @param  {Number} seed optional seed for seeded random numbers
	 * @return {NumberList}
	 * tags:random
	 */
	NumberListGenerators.createRandomNumberList = function(nValues, interval, seed, func) {
	  seed = seed == null ? -1 : seed;
	  interval = interval == null ? new Interval(0, 1) : interval;

	  var numberList = new NumberList__default();
	  var amplitude = interval.getAmplitude();

	  var random = seed == -1 ? Math.random : new NumberOperators._Alea("my", seed, "seeds");

	  for(var i = 0; i < nValues; i++) {
	    //seed = (seed*9301+49297) % 233280; //old method, close enough: http://moebio.com/research/randomseedalgorithms/
	    //numberList[i] = interval.x + (seed/233280.0)*amplitude; //old method

	    numberList[i] = func == null ? (random() * amplitude + interval.x) : func(random() * amplitude + interval.x);
	  }

	  return numberList;
	};

	function setCursor(name) {
	  name = name == null ? 'default' : name;
	  canvas.style.cursor = name;
	}


	/**
	 *Static class that:
	 * -includes all the data models (by including the class IncludeDataModels.js)
	 * -includes class utils (that contains methods such as instantiate)
	 * -contains the global variables (such as userAgent, canvas, nF, mX…), global
	 * -contains the listener methods
	 * -triggers de init, update and draw in Global class
	 * @namespace
	 * @category basics
	 */
	function Global(){}

	Global.userAgent="unknown";

	function init(){
	  //console.log("init must be overriden!");
	}

	function cycle(){
	  //console.log("cycle must be overriden!");
	}

	function resizeWindow(){
	  //console.log("resizeWindow must be overriden!");
	}

	function lastCycle(){
	  //override
	}

	var listenerArray  = [];
	var canvas;
	var removeDiv;
	var userAgent="none";
	var userAgentVersion;
	var canvasResizeable=true;


	//global useful vars
	var cW = 1; // canvas width
	var cH = 1; // canvas height
	var src_Global__cX = 1; // canvas center x
	var src_Global__cY = 1; // canvas center y
	var mX = 0; // cursor x
	var mY = 0; // cursor y
	var mP = new Point__default(0, 0); // cursor point
	var nF = 0; // number of current frame since first cycle

	var MOUSE_DOWN=false; //true on the frame of mousedown event
	var MOUSE_UP=false; //true on the frame of mouseup event
	var MOUSE_UP_FAST=false; //true on the frame of mouseup event
	var WHEEL_CHANGE=0; //differnt from 0 if mousewheel (or pad) moves / STATE
	var NF_DOWN; //number of frame of last mousedown event
	var NF_UP; //number of frame of last mouseup event
	var MOUSE_PRESSED; //true if mouse pressed / STATE
	var MOUSE_IN_DOCUMENT = true; //true if cursor is inside document / STATE
	var mX_DOWN; // cursor x position on last mousedown event
	var mY_DOWN; // cursor x position on last mousedown event
	var mX_UP; // cursor x position on last mousedown event
	var mY_UP; // cursor y position on last mousedown event
	var PREV_mX=0; // cursor x position previous frame
	var PREV_mY=0; // cursor y position previous frame
	var DX_MOUSE=0; //horizontal movement of cursor in last frame
	var DY_MOUSE=0; //vertical movement of cursor in last frame
	var MOUSE_MOVED = false; //boolean that indicates wether the mouse moved in the last frame / STATE
	var T_MOUSE_PRESSED = 0; //time in milliseconds of mouse being pressed, useful for sutained pressure detection

	//var deltaWheel = 0;
	var cursorStyle = 'auto';
	var backGroundColor = 'white';
	var backGroundColorRGB = [255,255,255];
	var cycleActive;

	//global constants
	var src_Global__context;
	var src_Global__TwoPi = 2*Math.PI;
	var HalfPi = 0.5*Math.PI;
	var radToGrad = 180/Math.PI;
	var gradToRad = Math.PI/180;
	var src_Global__c = console;
	src_Global__c.l = src_Global__c.log; //use c.l instead of console.log

	//private
	var _wheelActivated = false;
	var _keyboardActivated = false;

	var _prevMouseX = 0;
	var _prevMouseY = 0;
	var _setIntervalId;
	var _setTimeOutId;
	var _cycleOnMouseMovement = false;
	var _interactionCancelledFrame;
	var _tLastMouseDown;

	var _alphaRefresh=0;//if _alphaRefresh>0 instead of clearing the canvas each frame, a transparent rectangle will be drawn

	var END_CYCLE_DELAY = 3000; //time in milliseconds, from last mouse movement to the last cycle to be executed in case cycleOnMouseMovement has been activated

	Array.prototype.last = function(){
	  return this[this.length-1];
	};

	window.addEventListener('load', function(){

	  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
	    userAgent='IE';
	    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
	    if(userAgentVersion<9) return null;
	  } else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	    userAgent='FIREFOX';
	    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
	  } else if (navigator.userAgent.match(/Chrome/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	    userAgent='CHROME';
	    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
	  } else if (/Mozilla[\/\s](\d+\.\d+)/.test(navigator.userAgent) || navigator.userAgent.match(/Mozilla/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	    userAgent='MOZILLA';
	    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
	  } else if (navigator.userAgent.match(/Safari/) != null){ //test for MSIE x.x;
	    userAgent='Safari';
	    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
	  } else if(navigator.userAgent.match(/iPad/i) != null){
	    userAgent='IOS';
	  } else if(navigator.userAgent.match(/iPhone/i) != null){
	    userAgent='IOS';
	  }


	  Global.userAgent=userAgent;
	  Global._frameRate=30;

	  canvas = document.getElementById('main');

	  if(canvas!=null){
	    removeDiv = document.getElementById('removeDiv');
	    removeDiv.style.display = 'none';

	    src_Global__context = canvas.getContext('2d');

	    _adjustCanvas();

	    canvas.addEventListener("mousemove", _onMouse, false);
	    canvas.addEventListener("mousedown", _onMouse, false);
	    canvas.addEventListener("mouseup", _onMouse, false);
	    canvas.addEventListener("mouseenter", _onMouse, false);
	    canvas.addEventListener("mouseleave", _onMouse, false);


	    activateWheel();

	    window.addEventListener("resize", onResize, false);

	    startCycle();
	    init();
	  }

	  src_Global__c.l('Moebio Framework v2.259 | user agent: '+userAgent+' | user agent version: '+userAgentVersion+' | canvas detected: '+(canvas!=null));

	}, false);

	function _onMouse(e) {

	  switch(e.type){
	    case "mousemove":
	      PREV_mX=mX;
	      PREV_mY=mY;

	      if(e.clientX){
	        mX = e.clientX;
	            mY = e.clientY;
	      } else if(e.offsetX) {
	            mX = e.offsetX;
	            mY = e.offsetY;
	        } else if(e.layerX) {
	            mX = e.layerX;
	            mY = e.layerY;
	        }
	        mP.x = mX;
	        mP.y = mY;
	        MOUSE_IN_DOCUMENT = true;
	        break;
	    case "mousedown":
	      NF_DOWN = nF;
	      MOUSE_PRESSED = true;
	      T_MOUSE_PRESSED = 0;
	      _tLastMouseDown = new Date().getTime();
	      mX_DOWN = mX;
	      mY_DOWN = mY;
	      MOUSE_IN_DOCUMENT = true;
	      break;
	    case "mouseup":
	      NF_UP = nF;
	      MOUSE_PRESSED = false;
	      T_MOUSE_PRESSED = 0;
	      mX_UP = mX;
	      mY_UP = mY;
	      MOUSE_IN_DOCUMENT = true;
	      break;
	    case "mouseenter":
	      MOUSE_IN_DOCUMENT = true;
	      break;
	    case "mouseleave":
	      MOUSE_IN_DOCUMENT = false;
	      break;
	  }
	}


	function onResize(e){
	  _adjustCanvas();
	  resizeWindow();
	}

	function _adjustCanvas(){
	  if(canvasResizeable==false) return;

	  cW = getDocWidth();
	  cH = getDocHeight();

	  canvas.setAttribute('width', cW);
	    canvas.setAttribute('height', cH);

	  src_Global__cX = Math.floor(cW*0.5);
	  src_Global__cY = Math.floor(cH*0.5);
	}


	function clearContext(){
	  src_Global__context.clearRect(0, 0, cW, cH);
	}

	function cycleOnMouseMovement(value, time){
	  if(time!=null) END_CYCLE_DELAY = time;

	  if(value){
	    src_Global__context.canvas.addEventListener('mousemove', onMoveCycle, false);
	    addInteractionEventListener('mousewheel', onMoveCycle, this);
	    _cycleOnMouseMovement = true;
	    stopCycle();
	  } else {
	    src_Global__context.canvas.removeEventListener('mousemove', onMoveCycle, false);
	    removeInteractionEventListener('mousewheel', onMoveCycle, this);
	    _cycleOnMouseMovement = false;
	    startCycle();
	  }
	}

	function setFrameRate(fr){
	  fr = fr||30;
	  Global._frameRate = fr;

	  if(cycleActive) startCycle();
	}

	function enterFrame(){
	  if(_alphaRefresh==0){
	      src_Global__context.clearRect(0, 0, cW, cH);
	  } else {
	    src_Global__context.fillStyle = 'rgba('+backGroundColorRGB[0]+','+backGroundColorRGB[1]+','+backGroundColorRGB[2]+','+_alphaRefresh+')';
	    src_Global__context.fillRect(0, 0, cW, cH);
	  }

	    setCursor('default');

	    MOUSE_DOWN = NF_DOWN==nF;
	  MOUSE_UP = NF_UP==nF;
	  MOUSE_UP_FAST = MOUSE_UP && (nF-NF_DOWN)<9;

	  DX_MOUSE = mX-PREV_mX;
	  DY_MOUSE = mY-PREV_mY;
	  MOUSE_MOVED = DX_MOUSE!=0 || DY_MOUSE!=0;

	  if(MOUSE_PRESSED) T_MOUSE_PRESSED = new Date().getTime() - _tLastMouseDown;

	    cycle();

	    WHEEL_CHANGE = 0;

	    PREV_mX=mX;
	  PREV_mY=mY;

	    nF++;
	}

	function startCycle(){
	  clearTimeout(_setTimeOutId);
	  clearInterval(_setIntervalId);
	  _setIntervalId = setInterval(enterFrame, Global._frameRate);
	  cycleActive = true;
	}


	function stopCycle(){
	  clearInterval(_setIntervalId);
	  cycleActive = false;

	  lastCycle();
	}




	function onMoveCycle(e){
	  if(e.type=='mousemove' && _prevMouseX==mX && _prevMouseY==mY) return;
	  reStartCycle();
	}

	function reStartCycle(){
	  _prevMouseX=mX;
	  _prevMouseY=mY;

	  if(!cycleActive){
	    _setIntervalId = setInterval(enterFrame, Global._frameRate);
	    cycleActive = true;
	  }

	  clearTimeout(_setTimeOutId);
	  _setTimeOutId = setTimeout(stopCycle, END_CYCLE_DELAY);
	}

	//interaction events
	function addInteractionEventListener(eventType, onFunction, target){//TODO: listenerArray contains objects instead of arrays
	  listenerArray.push(new Array(eventType, onFunction, target));
	  switch(eventType){
	    case 'mousedown':
	    case 'mouseup':
	    case 'click':
	    case 'mousemove':
	      src_Global__context.canvas.addEventListener(eventType, onCanvasEvent, false);
	      break;
	    case 'mousewheel':
	      if(!_wheelActivated) activateWheel();
	      break;
	    case 'keydown':
	    case 'keyup':
	      if(!_keyboardActivated) activateKeyboard();
	      break;
	  }
	}

	function onCanvasEvent(e){
	  var i;
	  for(i=0; listenerArray[i]!=null; i++){
	    if(listenerArray[i][0]==e.type.replace('DOMMouseScroll', 'mousewheel')){
	      if(_interactionCancelledFrame==nF) return;
	      listenerArray[i][1].call(listenerArray[i][2], e);
	    }
	  }
	}

	function removeInteractionEventListener(eventType, onFunction, target){ //TODO: finish this (requires single element removing method solved first)
	  for(var i=0; listenerArray[i]!=null; i++){
	    if(listenerArray[i][0]==eventType && listenerArray[i][1]==onFunction && listenerArray[i][2]==target){
	      delete listenerArray[i];
	      listenerArray.splice(i, 1);
	      i--;
	    }
	  }
	}

	function cancelAllInteractions(){
	  src_Global__c.log("cancelAllInteractions, _interactionCancelledFrame:", nF);
	  _interactionCancelledFrame = nF;
	}

	function setBackgroundColor(color){
	  if(typeof color == "number"){
	    if(arguments.length>3){
	      color = 'rgba('+arguments[0]+','+arguments[1]+','+arguments[2]+','+arguments[3]+')';
	    } else {
	      color = 'rgb('+arguments[0]+','+arguments[1]+','+arguments[2]+')';
	    }
	  } else if(Array.isArray(color)){
	    color = ColorOperators.RGBtoHEX(color[0], color[1], color[2]);
	  }
	  backGroundColor = color;

	  backGroundColorRGB = ColorOperators.colorStringToRGB(backGroundColor);

	  var body = document.getElementById('index');
	  body.setAttribute('bgcolor', backGroundColor);
	}

	function setDivPosition(div, x, y){
	  div.setAttribute('style', 'position:absolute;left:'+String(x)+'px;top:'+String(y)+'px;');
	}


	/////////////////////////////////// keyboard and wheel

	function activateKeyboard(){
	  _keyboardActivated = true;
	  document.onkeydown = onKey;
	  document.onkeyup = onKey;
	}

	function onKey(e){
	  onCanvasEvent(e);
	}

	/*
	 * thanks http://www.adomas.org/javascript-mouse-wheel
	 */
	function activateWheel(){
	  _wheelActivated = true;

	  if (window.addEventListener){
	    window.addEventListener('DOMMouseScroll', _onWheel, false);
	    //window.addEventListener("mousewheel", _onWheel, false); // testing
	  }
	  window.onmousewheel = document.onmousewheel = _onWheel;

	}
	function _onWheel(e) {
	  //c.l('_onWheel, e:', e);

	    if (!e) e = window.event; //IE

	    if (e.wheelDelta){
	      WHEEL_CHANGE = e.wheelDelta/120;
	    } else if (e.detail) { /** Mozilla case. */
	        WHEEL_CHANGE = -e.detail/3;
	    }
	    e.value = WHEEL_CHANGE;
	    e.type = "mousewheel"; //why this doesn't work?

	  onCanvasEvent(e);
	}



	////structures local storage

	function setStructureLocalStorageWithSeed(object, seed, comments){
	  setStructureLocalStorage(object, MD5.hex_md5(seed), comments);
	};

	function setStructureLocalStorage(object, id, comments){
	  var type = typeOf(object);
	  var code;

	  switch(type){
	    case 'string':
	      code = object;
	      break;
	    case 'Network':
	      code = NetworkEncodings.encodeGDF(network);
	      break;
	    default:
	      type = 'object';
	      code = JSON.stringify(object);
	      break;
	  }

	  var storageObject = {
	    id:id,
	    type:type,
	    comments:comments,
	    date:new Date(),
	    code:code
	  };

	  var storageString = JSON.stringify(storageObject);

	  // c.l('storageObject', storageObject);
	  // c.l('id:['+id+']');
	  // c.l('code.length:', code.length);

	  localStorage.setItem(id, storageString);
	};

	function getStructureLocalStorageFromSeed(seed, returnStorageObject){
	  return getStructureLocalStorage(MD5.hex_md5(seed), returnStorageObject);
	};

	function getStructureLocalStorage(id, returnStorageObject){
	  returnStorageObject = returnStorageObject||false;

	  var item = localStorage.getItem(id);

	  if(item==null) return null;


	  try{
	    var storageObject = JSON.parse(item);
	  } catch(err){
	    return null;
	  }

	  if(storageObject.type==null && storageObject.code==null) return null;

	  var type = storageObject.type;
	  var code = storageObject.code;
	  var object;

	  switch(type){
	    case 'string':
	      object = code;
	      break;
	    case 'Network':
	      object = NetworkEncodings.decodeGDF(code);
	      break;
	    case 'object':
	      object = JSON.parse(code);
	      break;
	  }

	  if(returnStorageObject){
	    storageObject.object = object;
	    storageObject.size = storageObject.code.length;
	    storageObject.date = new Date(storageObject.date);

	    return storageObject;
	  }

	  return object;
	};

	function getDocWidth() {
	    var D = document;
	    return Math.max(
	        D.body.offsetWidth, D.documentElement.offsetWidth,
	        D.body.clientWidth, D.documentElement.clientWidth
	    );
	}

	function getDocHeight() {
	    var D = document;
	    return Math.max(
	        D.body.offsetHeight, D.documentElement.offsetHeight,
	        D.body.clientHeight, D.documentElement.clientHeight
	    );
	}

	function PolygonOperators() {}


	/**
	 * builds a Hull polygon from a set of points
	 * @param  {Polygon} polygon set of points
	 * @param  {Boolean} returnIndexes if true returns the indexes of external points, connected by the Hull polygon (false by default)
	 * @return {List} Hull polygn or list of indexes
	 * tags:geometry
	 */
	PolygonOperators.hull = function(polygon, returnIndexes) {
	  returnIndexes = returnIndexes == null ? false : returnIndexes;
	  var i;
	  var t;
	  var p = polygon;
	  var n = p.length;
	  var k = 0;
	  var h = new Polygon__default();
	  if(returnIndexes) var indexes = new NumberList__default();

	  p = PolygonOperators.sortOnXY(p);

	  if(returnIndexes) {
	    for(i = 0; i < n; i++) {
	      while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
	        k--;
	      h[k++] = p[i];
	      indexes[k - 1] = i;
	    }

	    for(i = n - 2, t = k + 1; i >= 0; i--) {
	      while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
	        k--;
	      h[k++] = p[i];
	      indexes[k - 1] = i;
	    }

	    return NumberList__default.fromArray(indexes.getSubList(new Interval__default(0, k - 2)));
	  }

	  for(i = 0; i < n; i++) {
	    while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
	      k--;
	    h[k++] = p[i];
	  }

	  for(i = n - 2, t = k + 1; i >= 0; i--) {
	    while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
	      k--;
	    h[k++] = p[i];
	  }

	  return Polygon__default.fromArray(h.getSubList(new Interval__default(0, k - 2)));
	};

	/**
	 * builds a dendrogram (tree) from a Polygon (currently using barycenter for distances)
	 * @param  {Polygon} polygon
	 * @return {Tree} dendrogram
	 * tags:geometry
	 */
	PolygonOperators.buildDendrogramFromPolygon = function(polygon) {
	  var tree = new Tree();
	  var point, i;
	  var node;
	  var tW;
	  var parent;
	  var leaves = new NodeList();

	  var node0, node1, nodeList = new Polygon__default();

	  polygon.forEach(function(point, i) {
	    node = new Node('point_' + i, 'point_' + i);
	    node.weight = 1;
	    node.barycenter = point;
	    node.point = point;
	    node.polygon = new Polygon__default(point);
	    tree.addNode(node);
	    nodeList.push(node);
	    leaves.push(node);
	  });

	  tree.nodeList = tree.nodeList.getReversed();

	  //c.l('-');

	  var buildNodeFromPair = function(node0, node1) {
	    var parent = new Node("(" + node0.id + "," + node1.id + ")", "(" + node0.id + "," + node1.id + ")");
	    parent.polygon = node0.polygon.concat(node1.polygon);
	    //c.l("node0.polygon.length, node1.polygon.length, parent.polygon.length", node0.polygon.length, node1.polygon.length, parent.polygon.length);
	    parent.weight = parent.polygon.length;
	    tW = node0.weight + node1.weight;
	    parent.barycenter = new Point__default((node0.weight * node0.barycenter.x + node1.weight * node1.barycenter.x) / tW, (node0.weight * node0.barycenter.y + node1.weight * node1.barycenter.y) / tW);
	    //c.l('parent.barycenter.x', parent.barycenter.x, parent.barycenter.y);
	    tree.addNode(parent);
	    tree._newCreateRelation(parent, node0);
	    tree._newCreateRelation(parent, node1);
	    return parent;
	  };

	  var closestPair;
	  while(nodeList.length > 1) {
	    closestPair = PolygonOperators._findClosestNodes(nodeList);
	    node0 = nodeList[closestPair[0]];
	    node1 = nodeList[closestPair[1]];
	    parent = buildNodeFromPair(node0, node1);
	    parent.distance = closestPair.distance;
	    console.log('distance:', parent.distance);
	    nodeList.splice(closestPair[0], 1);
	    nodeList.splice(closestPair[1] - 1, 1);
	    nodeList.push(parent);
	  }

	  tree.nodeList = tree.nodeList.getReversed();

	  var assignLevel = function(node, parentLevel) {
	    var son;
	    node.level = parentLevel + 1;
	    node.toNodeList.forEach(function(son) {
	      assignLevel(son, node.level);
	    });
	  };

	  assignLevel(tree.nodeList[0], -1);

	  tree.leaves = leaves;

	  return tree;

	};

	PolygonOperators._findClosestNodes = function(nodeList) {
	  var i, j;
	  var d2;
	  var d2Min = 9999999999;

	  for(i = 0; nodeList[i + 1] != null; i++) {
	    for(j = i + 1; nodeList[j] != null; j++) {
	      d2 = Math.pow(nodeList[i].barycenter.x - nodeList[j].barycenter.x, 2) + Math.pow(nodeList[i].barycenter.y - nodeList[j].barycenter.y, 2);
	      if(d2 < d2Min) {
	        d2Min = d2;
	        pair = [i, j];
	      }
	    }
	  }

	  pair.distance = d2Min;

	  return pair;
	};


	PolygonOperators.sortOnXY = function(polygon) {
	  return polygon.sort(function(p0, p1) {
	    if(p0.x < p1.x) return -1;
	    if(p0.x == p1.x && p0.y < p1.y) return -1;
	    return 1;
	  });
	};

	//TODO: move this to PointOperators
	PolygonOperators.crossProduct3Points = function(o, a, b) {
	  return(a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
	};

	PolygonOperators.expandFromBarycenter = function(polygon, factor) {
	  var newPolygon = new Polygon__default();
	  var barycenter = polygon.getBarycenter();

	  for(var i = 0; polygon[i] != null; i++) {
	    newPolygon[i] = polygon[i].expandFromPoint(barycenter, factor);
	  }

	  return newPolygon;
	};

	PolygonOperators.expandInAngles = function(polygon, amount) { //TODO: test if it works with convex polygons
	  var newPolygon = new Polygon__default();
	  var p0 = polygon[polygon.length - 1];
	  var p1 = polygon[0];
	  var p2 = polygon[1];

	  var a0;
	  var a1;
	  var sign;

	  var a = 0.5 * Math.atan2(p1.y - p2.y, p1.x - p2.x) + 0.5 * Math.atan2(p1.y - p0.y, p1.x - p0.x);
	  var globalSign = polygon.containsPoint(new Point__default(p1.x + Math.floor(amount) * Math.cos(a), p1.y + Math.floor(amount) * Math.sin(a))) ? -1 : 1;


	  for(var i = 0; polygon[i] != null; i++) {
	    p0 = polygon[(i - 1 + polygon.length) % polygon.length];
	    p1 = polygon[i];
	    p2 = polygon[(i + 1) % polygon.length];
	    a0 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
	    a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
	    sign = Math.abs(a1 - a0) < Math.PI ? -1 : 1;
	    a = 0.5 * a0 + 0.5 * a1;
	    //sign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
	    newPolygon[i] = new Point__default(p1.x + globalSign * sign * amount * Math.cos(a), p1.y + globalSign * sign * amount * Math.sin(a));
	  }

	  return newPolygon;
	};

	PolygonOperators.simplifyPolygon = function(polygon, margin) {
	  margin = margin == null || margin == 0 ? 1 : margin;
	  var newPolygon = polygon.clone();
	  var p0;
	  var p1;
	  var p2;
	  var line;
	  var i;
	  var nPoints = polygon.length;
	  for(i = 0; i < nPoints; i++) {
	    p0 = newPolygon[i];
	    p1 = newPolygon[(i + 1) % nPoints];
	    p2 = newPolygon[(i + 2) % nPoints];
	    line = GeometryOperators__default.lineFromTwoPoints(p0, p2);
	    if(GeometryOperators__default.distancePointToLine(p1, line) < margin) {
	      //newPolygon.splice((i+1)%nPoints, 1);
	      newPolygon = newPolygon.getWithoutElementAtIndex((i + 1) % nPoints);
	      i--;
	    }
	    nPoints = newPolygon.length;
	  }
	  return newPolygon;
	};


	/**
	 * used techinique: draws the bézier polygon and checks color
	 */
	PolygonOperators.bezierPolygonContainsPoint = function(polygon, point, border) {
	  var frame = polygon.getFrame();
	  clearContext();
	  src_Global__context.fillStyle = 'black';
	  src_Global__context.fillRect(0, 0, frame.width, frame.height);
	  if(border != null) {
	    src_Global__context.strokeStyle = 'black';
	    src_Global__context.lineWidth = border;
	  }
	  src_Global__context.fillStyle = 'white';
	  src_Global__context.beginPath();
	  Draw.drawBezierPolygon(src_Global__context, polygon, -frame.x, -frame.y);
	  src_Global__context.fill();
	  if(border != null) src_Global__context.stroke();
	  var data = src_Global__context.getImageData(point.x - frame.x, point.y - frame.y, 1, 1).data;
	  clearContext();
	  return data[0] > 0;
	};


	/**
	 * used techinique: draws the bézier polygon and checks color
	 * best center: the center of biggest circle within the polygon
	 * [!] very unefficient
	 */
	PolygonOperators.getBezierPolygonBestCenter = function(polygon, nAttempts) {
	  nAttempts = nAttempts == null ? 500 : nAttempts;

	  var frame = polygon.getFrame();
	  src_Global__context.fillStyle = 'black';
	  src_Global__context.fillRect(0, 0, frame.width, frame.height);
	  src_Global__context.fillStyle = 'white';
	  src_Global__context.beginPath();
	  Draw.drawBezierPolygon(src_Global__context, polygon, -frame.x, -frame.y);
	  src_Global__context.fill();

	  var center;
	  var testPoint;
	  var angle;
	  var r;
	  var rMax = 0;
	  var bestCenter;


	  for(var i = 0; i < nAttempts; i++) {
	    center = frame.getRandomPoint();
	    for(angle = 0; angle += 0.1; angle <= src_Global__TwoPi) {
	      r = angle;
	      var data = src_Global__context.getImageData(center.x + r * Math.cos(angle) - frame.x, center.y + r * Math.sin(angle) - frame.y, 1, 1).data;
	      if(data[0] == 0) {
	        if(r > rMax) {
	          rMax = r;
	          bestCenter = center;
	        }
	        break;
	      }
	    }
	  }

	  return bestCenter;
	};


	PolygonOperators.convexHull = function(polygon, deepness) {
	  var indexesHull = this.hull(polygon, true);
	  var pointsLeftIndexes = NumberListGenerators.createSortedNumberList(polygon.length);
	  pointsLeftIndexes = pointsLeftIndexes.getWithoutElementsAtIndexes(indexesHull);
	  var i;
	  var j;
	  var k;
	  var p0;
	  var p1;
	  var pC = new Point__default();
	  var p;
	  var d;
	  var dMin = deepness - 1;
	  var jMin;
	  var kMin;
	  var dP;
	  var nHull = indexesHull.length;

	  while(dMin < deepness) {
	    //c.log(dMin, deepness, nHull, pointsLeftIndexes.length);
	    dMin = 999999999;
	    for(j = 0; j < nHull; j++) {
	      p0 = polygon[indexesHull[j]];
	      p1 = polygon[indexesHull[(j + 1) % indexesHull.length]];
	      pC.x = (p0.x + p1.x) * 0.5;
	      pC.y = (p0.y + p1.y) * 0.5;
	      dP = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
	      for(k = 0; pointsLeftIndexes[k] != null; k++) {
	        p = polygon[pointsLeftIndexes[k]];
	        //d = Math.pow(p.x-pC.x, 2)+Math.pow(p.y-pC.y, 2);
	        d = (Math.sqrt(Math.pow(p.x - p0.x, 2) + Math.pow(p.y - p0.y, 2)) + Math.sqrt(Math.pow(p.x - p1.x, 2) + Math.pow(p.y - p1.y, 2))) / Math.pow(dP, 2);
	        if(d < dMin) {
	          dMin = d;
	          jMin = j;
	          kMin = k;
	        }
	      }
	    }

	    //c.log("  ", dMin);

	    for(j = nHull - 1; j > jMin; j--) {
	      indexesHull[j + 1] = indexesHull[j];
	    }
	    indexesHull[jMin + 1] = pointsLeftIndexes[kMin];

	    //pointsLeftIndexes.removeElement(pointsLeftIndexes[kMin]); //!!!! TODO: FIX THIS!
	    pointsLeftIndexes.splice(kMin, 1);

	    if(pointsLeftIndexes.length == 0) return indexesHull;

	    nHull++;
	  }
	  return indexesHull;
	};

	PolygonOperators.controlPointsFromPointsAnglesIntensities = function(polygon, angles, intensities) {
	  var controlPoints = new Polygon__default();
	  for(var i = 0; polygon[i] != null; i++) {
	    if(i > 0) controlPoints.push(new Point__default(polygon[i].x - intensities[i] * Math.cos(angles[i]), polygon[i].y - intensities[i] * Math.sin(angles[i])));
	    if(i < polygon.length - 1) controlPoints.push(new Point__default(polygon[i].x + intensities[i] * Math.cos(angles[i]), polygon[i].y + intensities[i] * Math.sin(angles[i])));
	  }
	  return controlPoints;
	};


	PolygonOperators.placePointsInsidePolygon = function(polygon, nPoints, mode) {
	  var points = new Polygon__default();
	  var frame = polygon.getFrame();
	  mode = mode || 0;
	  switch(mode) {
	    case 0: //random simple
	      var p;
	      while(points.length < nPoints) {
	        p = new Point__default(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
	        if(PolygonOperators.polygonContainsPoint(polygon, p)) points.push(p);
	      }
	      return points;
	      break;
	  }
	};

	PolygonOperators.placePointsInsideBezierPolygon = function(polygon, nPoints, mode, border) {
	  var points = new Polygon__default();
	  var frame = polygon.getFrame();
	  mode = mode || 0;
	  switch(mode) {
	    case 0: //random simple
	      var p;
	      var nAttempts = 0;
	      while(points.length < nPoints && nAttempts < 1000) {
	        p = new Point__default(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
	        nAttempts++;
	        if(PolygonOperators.bezierPolygonContainsPoint(polygon, p, border)) {
	          points.push(p);
	          nAttempts = 0;
	        }
	      }
	      return points;
	      break;
	  }
	};

	exports.PolygonOperators = PolygonOperators;

	CountryList.prototype = new NodeList();
	CountryList.prototype.constructor = CountryList;

	/**
	 * @classdesc A {@link List} structure for storing {@link Country|Countries}.
	 *
	 * @description Creates a new CountryList instance.
	 * @constructor
	 * @category geo
	 */
	function CountryList() {
	  var array = NodeList.apply(this, arguments);
	  //
	  array.name = "";
	  //assign methods to array:
	  array = CountryList.fromArray(array);
	  //
	  return array;
	}


	CountryList.fromArray = function(array) {
	  var result = NodeList.fromArray(array);
	  result.type = "CountryList";
	  //assign methods to array:
	  result.getCountryFromName = CountryList.prototype.getCountryFromName;
	  //transformative
	  result.removeAntarctica = CountryList.prototype.removeAntarctica;
	  result.removeTinyPolygonsFromCountries = CountryList.prototype.removeTinyPolygonsFromCountries;
	  result.removeTinyCountries = CountryList.prototype.removeTinyCountries;
	  result.simplifyAntarctica = CountryList.prototype.simplifyAntarctica;
	  result.assignValuesToCountriesFromTable = CountryList.prototype.assignValuesToCountriesFromTable;
	  result.simplifyPolygons = CountryList.prototype.simplifyPolygons;
	  return result;
	};

	/**
	 * each country has several names to try a match
	 * ISO id is allowed
	 */
	CountryList.prototype.getCountryFromName = function(countryName) {
	  for(var i = 0; this[i] != null; i++) {
	    if(this[i].nameMatches(countryName)) return this[i];
	  }
	  return null;
	};


	//transformative

	CountryList.prototype.removeAntarctica = function() {
	  this.removeNode(this.getNodeById('AQ'));
	};

	CountryList.prototype.removeTinyPolygonsFromCountries = function(minArea) {
	  minArea = 0.2 || minArea;
	  var country;
	  var j;

	  for(var i = 0; this[i] != null; i++) {
	    country = this[i];
	    for(j = 0; country.polygonList[j] != null; j++) {
	      if(country.polygonList[j].getFrame().getArea() < minArea) {
	        country.polygonList.splice(j, 1);
	        j--;
	      }
	    }

	  }
	};

	CountryList.prototype.removeTinyCountries = function(minArea) {
	  minArea = 0.5 || minArea;
	  var country;
	  var j;
	  var small;
	  for(var i = 0; this[i] != null; i++) {
	    country = this[i];

	    small = true;
	    for(j = 0; country.polygonList[j] != null; j++) {
	      if(country.polygonList[j].getFrame().getArea() > minArea) {
	        small = false;
	        break;
	      }
	    }

	    if(small) {
	      this.removeNode(this[i]);
	      i--;
	    }
	  }
	};

	CountryList.prototype.simplifyPolygons = function(margin) {
	  var country;
	  var j;
	  var maxPL, jMax;

	  for(var i = 0; this[i] != null; i++) {
	    country = this[i];
	    maxPL = 0;
	    for(j = 0; country.polygonList[j] != null; j++) {
	      country.polygonList[j] = PolygonOperators.simplifyPolygon(country.polygonList[j], margin);
	      if(country.polygonList[j].length < 3) {
	        country.polygonList.splice(j, 1);
	        j--;
	      } else {
	        if(country.polygonList[j].length > maxPL) {
	          maxPL = country.polygonList[j].length;
	          jMax = j;
	        }
	      }
	    }
	    country.longestPolygon.destroy();
	    country.longestPolygon = country.polygonList[jMax];
	  }
	};

	/**
	 * in 2D representations Antarctiva requires 2 extra points, placed on global geo grame corners
	 * this method removes them (suitable for 3D representations)
	 */
	CountryList.prototype.simplifyAntarctica = function() {
	  var polygonList = this.getNodeById('AQ').simplePolygonList;
	  if(polygonList != null) {
	    polygonList[0].splice(10, 1);
	    polygonList[0].splice(10, 1);
	  }
	  polygonList = this.getNodeById('AQ').polygonList;
	  if(polygonList != null) {
	    //TODO: remove last two points
	  }
	};

	CountryList.prototype.assignValuesToCountriesFromTable = function(table, valueToNull) {
	  var j;
	  var country;
	  for(var i = 0; table[0][i] != null; i++) {
	    country = this.getCountryFromName(table[0][i]);
	    if(country != null) {
	      for(j = 1; table[j] != null; j++) {
	        country[table[j].name] = table[j][i] == valueToNull ? null : table[j][i];
	      }
	    }
	  }
	};

	exports.CountryList = CountryList;

	Polygon3DList.prototype = new List__default();
	Polygon3DList.prototype.constructor = Polygon3DList;

	/**
	 * @classdesc A {@link List} structure for storing {@link Polygon3D} instances.
	 *
	 * @description Creates a new Polygon3DList.
	 * @constructor
	 * @category geometry
	 */
	function Polygon3DList() {
	  var array = List__default.apply(this, arguments);
	  array = Polygon3DList.fromArray(array);
	  return array;
	}


	Polygon3DList.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "Polygon3DList";
	  return result;
	};

	exports.Polygon3DList = Polygon3DList;

	Rectangle__Rectangle.prototype = new DataModel();
	Rectangle__Rectangle.prototype.constructor = Rectangle__Rectangle;

	/**
	 * @classdesc Rectangle shape
	 *
	 * @description Creates a new Rectangle.
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 * @constructor
	 * @category geometry
	 */
	function Rectangle__Rectangle(x, y, width, height) {
	  DataModel.apply(this);
	  this.name = "";
	  this.type = "Rectangle";
	  this.x = Number(x) || 0;
	  this.y = Number(y) || 0;
	  this.width = Number(width) || 0;
	  this.height = Number(height) || 0;
	}
	var Rectangle__default = Rectangle__Rectangle;

	Rectangle__Rectangle.prototype.getRight = function() {
	  return this.x + this.width;
	};

	Rectangle__Rectangle.prototype.getBottom = function() {
	  return this.y + this.height;
	};

	Rectangle__Rectangle.prototype.setRight = function(value) {
	  this.width = value - this.x;
	};

	Rectangle__Rectangle.prototype.setBottom = function(value) {
	  this.height = value - this.y;
	};



	Rectangle__Rectangle.prototype.getTopLeft = function() {
	  return new Point__default(this.x, this.y);
	};
	Rectangle__Rectangle.prototype.getTopRight = function() {
	  return new Point__default(this.x + this.width, this.y);
	};

	Rectangle__Rectangle.prototype.getBottomRight = function() {
	  return new Point__default(this.x + this.width, this.y + this.height);
	};
	Rectangle__Rectangle.prototype.getBottomLeft = function() {
	  return new Point__default(this.x, this.y + this.height);
	};
	Rectangle__Rectangle.prototype.getCenter = function() {
	  return new Point__default(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
	};
	Rectangle__Rectangle.prototype.getRandomPoint = function() {
	  return new Point__default(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
	};

	Rectangle__Rectangle.prototype.getIntersection = function(rectangle) {
	  if(rectangle.x + rectangle.width < this.x || rectangle.x > this.x + this.width || rectangle.y + rectangle.height < this.y || rectangle.y > this.y + this.height) return null;
	  var xR = Math.max(rectangle.x, this.x);
	  var yR = Math.max(rectangle.y, this.y);
	  return new Rectangle__Rectangle(xR, yR, Math.min(rectangle.x + rectangle.width, this.x + this.width) - xR, Math.min(rectangle.y + rectangle.height, this.y + this.height) - yR);
	};

	Rectangle__Rectangle.prototype.interpolate = function(rectangle, t) {
	  var mint = 1 - t;
	  return new Rectangle__Rectangle(mint * this.x + t * rectangle.x, mint * this.y + t * rectangle.y, mint * this.width + t * rectangle.width, mint * this.height + t * rectangle.height);
	};

	Rectangle__Rectangle.prototype.getRatio = function() {
	  return Math.max(this.width, this.height) / Math.min(this.width, this.height);
	};

	Rectangle__Rectangle.prototype.getArea = function() {
	  return this.width * this.height;
	};

	/**
	 * check if a point belong to the rectangle
	 * @param  {Point} point
	 * @return {Boolean}
	 * tags:geometry
	 */
	Rectangle__Rectangle.prototype.containsPoint = function(point) {
	  return(this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
	};


	Rectangle__Rectangle.prototype.pointIsOnBorder = function(point, margin) {
	  margin = margin == null ? 1 : margin;
	  if(point.x >= this.x - margin && point.x <= this.x + this.width + margin) {
	    if(point.y >= this.y - margin && point.y <= this.y + margin) return true;
	    if(point.y >= this.y + this.height - margin && point.y <= this.y + this.height + margin) return true;
	    if(point.y >= this.y - margin && point.y <= this.y + this.height + margin) {
	      if(point.x < this.x + margin || point.x > this.x + this.width - margin) return true;
	    }
	  }
	  return false;
	};




	Rectangle__Rectangle.prototype.getNormalRectangle = function() {
	  return new Rectangle__Rectangle(Math.min(this.x, this.x + this.width), Math.min(this.y, this.y + this.height), Math.abs(this.width), Math.abs(this.height));
	};

	/**
	 * return true if it interstects a rectangle
	 * @param  {Rectangle} rectangle
	 * @return {Boolean}
	 * tags:geometry
	 */
	Rectangle__Rectangle.prototype.intersectsRectangle = function(rectangle) {
	  return !(this.x + this.width < rectangle.x) && !(this.y + this.height < rectangle.y) && !(rectangle.x + rectangle.width < this.x) && !(rectangle.y + rectangle.height < this.y);


	  if(this.x + this.width < rectangle.x) return false;
	  if(this.y + this.height < rectangle.y) return false;
	  if(rectangle.x + rectangle.width < this.x) return false;
	  if(rectangle.y + rectangle.height < this.y) return false;
	  return true;



		return this.containsPoint(rectangle.getTopLeft()) || this.containsPoint(rectangle.getTopRight()) || this.containsPoint(rectangle.getBottomLeft()) || this.containsPoint(rectangle.getBottomRight())
		|| rectangle.containsPoint(this.getTopLeft()) || rectangle.containsPoint(this.getTopRight()) || rectangle.containsPoint(this.getBottomLeft()) || rectangle.containsPoint(this.getBottomRight());
	};

	Rectangle__Rectangle.prototype.expand = function(expantion, centerPoint) {
	  centerPoint = centerPoint || new Point__default(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
	  return new Rectangle__Rectangle((this.x - centerPoint.x) * expantion + centerPoint.x, (this.y - centerPoint.y) * expantion + centerPoint.y, this.width * expantion, this.height * expantion);
	};

	Rectangle__Rectangle.prototype.isEqual = function(rectangle) {
	  return this.x == rectangle.x && this.y == rectangle.y && this.width == rectangle.width && this.height == rectangle.height;
	};

	Rectangle__Rectangle.prototype.clone = function() {
	  return new Rectangle__Rectangle(this.x, this.y, this.width, this.height);
	};

	Rectangle__Rectangle.prototype.toString = function() {
	  return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
	};

	Rectangle__Rectangle.prototype.destroy = function() {
	  delete this.x;
	  delete this.y;
	  delete this.width;
	  delete this.height;
	};

	exports.Rectangle = Rectangle__default;

	RectangleList.prototype = new List__default();
	RectangleList.prototype.constructor = RectangleList;
	/**
	 * @classdesc A {@link List} structure for storing {@link Rectangle} instances.
	 *
	 * @description Creates a new RectangleList.
	 * @constructor
	 * @category geometry
	 */
	function RectangleList() {
	  var array = List__default.apply(this, arguments);
	  array = RectangleList.fromArray(array);
	  return array;
	}


	RectangleList.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "RectangleList";

	  result.getFrame = RectangleList.prototype.getFrame;
	  result.add = RectangleList.prototype.add;
	  result.factor = RectangleList.prototype.factor;
	  result.getAddedArea = RectangleList.prototype.getAddedArea;
	  result.getIntersectionArea = RectangleList.prototype.getIntersectionArea;

	  return result;
	};

	//TODO:finish RectangleList methods

	RectangleList.prototype.getFrame = function() {
	  if(this.length == 0) return null;
	  var frame = this[0];
	  frame.width = frame.getRight();
	  frame.height = frame.getBottom();
	  for(var i = 1; this[i] != null; i++) {
	    frame.x = Math.min(frame.x, this[i].x);
	    frame.y = Math.min(frame.y, this[i].y);

	    frame.width = Math.max(this[i].getRight(), frame.width);
	    frame.height = Math.max(this[i].getBottom(), frame.height);
	  }

	  frame.width -= frame.x;
	  frame.height -= frame.y;

	  return frame;
	};

	RectangleList.prototype.add = function() {

	};

	RectangleList.prototype.factor = function() {

	};

	RectangleList.prototype.getAddedArea = function() {};

	RectangleList.prototype.getIntersectionArea = function() {
	  var rect0;
	  var rect1;
	  var intersectionArea = 0;
	  var intersection;
	  for(var i = 0; this[i + 1] != null; i++) {
	    rect0 = this[i];
	    for(var j = i + 1; this[j] != null; j++) {
	      rect1 = this[j];
	      intersection = rect0.getIntersection(rect1);
	      intersectionArea += intersection == null ? 0 : intersection.getArea();
	    }
	  }

	  return intersectionArea;
	};

	exports.RectangleList = RectangleList;

	/**
	 * @classdesc Provides a set of tools that work with Colors.
	 *
	 * @namespace
	 * @category colors
	 */
	function ColorOperators__ColorOperators() {}
	var ColorOperators__default = ColorOperators__ColorOperators;
	// TODO: create Color struture to be used instead of arrays [255, 100,0] ?



	/**
	 * return a color between color0 and color1
	 * 0 -> color0
	 * 1 -> color1
	 * @param {String} color0
	 * @param {String} color1
	 * @param value between 0 and 1 (to obtain color between color0 and color1)
	 * @return {String} interpolated color
	 *
	 */
	ColorOperators__ColorOperators.interpolateColors = function(color0, color1, value) {
	  var resultArray = ColorOperators__ColorOperators.interpolateColorsRGB(ColorOperators__ColorOperators.colorStringToRGB(color0), ColorOperators__ColorOperators.colorStringToRGB(color1), value);
	  return ColorOperators__ColorOperators.RGBtoHEX(resultArray[0], resultArray[1], resultArray[2]);
	};

	/**
	 * return a color between color0 and color1
	 * 0 -> color0
	 * 1 -> color1
	 * @param {Array} color0 RGB
	 * @param {Array} color1 RGB
	 * @param value between 0 and 1 (to obtain values between color0 and color1)
	 * @return {Array} interpolated RGB color
	 *
	 */
	ColorOperators__ColorOperators.interpolateColorsRGB = function(color0, color1, value) {
	  var s = 1 - value;
	  return [Math.floor(s * color0[0] + value * color1[0]), Math.floor(s * color0[1] + value * color1[1]), Math.floor(s * color0[2] + value * color1[2])];
	};


	ColorOperators__ColorOperators.RGBtoHEX = function(red, green, blue) {
	  return "#" + ColorOperators__ColorOperators.toHex(red) + ColorOperators__ColorOperators.toHex(green) + ColorOperators__ColorOperators.toHex(blue);
	};

	ColorOperators__ColorOperators.RGBArrayToString = function(array) {
	  return 'rgb(' + array[0] + ',' + array[1] + ',' + array[2] + ')';
	};



	/**
	 * converts an hexadecimal color to RGB
	 * @param {String} an hexadecimal color string
	 * @return {Array} returns an RGB color Array
	 *
	 */
	ColorOperators__ColorOperators.HEXtoRGB = function(hexColor) {
	  return [parseInt(hexColor.substr(1, 2), 16), parseInt(hexColor.substr(3, 2), 16), parseInt(hexColor.substr(5, 2), 16)];
	};


	ColorOperators__ColorOperators.colorStringToHEX = function(color_string) {
	  var rgb = ColorOperators__ColorOperators.colorStringToRGB(color_string);
	  return ColorOperators__ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};


	ColorOperators__ColorOperators.numberToHex = function(number) {
	  var hex = number.toString(16);
	  while(hex.length < 2) hex = "0" + hex;
	  return hex;
	};


	ColorOperators__ColorOperators.uinttoRGB = function(color) {
	  var rgbColor = new Array(color >> 16, (color >> 8) - ((color >> 16) << 8), color - ((color >> 8) << 8));
	  return rgbColor;
	};
	ColorOperators__ColorOperators.uinttoHEX = function(color) {
	  var rgbColor = ColorOperators__ColorOperators.uinttoRGB(color);
	  var hexColor = ColorOperators__ColorOperators.RGBToHEX(rgbColor[0], rgbColor[1], rgbColor[2]);
	  return hexColor;
	};


	ColorOperators__ColorOperators.RGBtouint = function(red, green, blue) {
	  return Number(red) << 16 | Number(green) << 8 | Number(blue);
	};

	ColorOperators__ColorOperators.HEXtouint = function(hexColor) {
	  var colorArray = ColorOperators__ColorOperators.HEXtoRGB(hexColor);
	  var color = ColorOperators__ColorOperators.RGBtouint(colorArray[0], colorArray[1], colorArray[2]);
	  return color;
	};

	ColorOperators__ColorOperators.grayByLevel = function(level) {
	  level = Math.floor(level * 255);
	  return 'rgb(' + level + ',' + level + ',' + level + ')';
	};



	/**
	 * converts an hexadecimal color to HSV
	 * @param {String} an hexadecimal color string
	 * @return {Array} returns an HSV color Array
	 *
	 */
	ColorOperators__ColorOperators.HEXtoHSV = function(hexColor) {
	  var rgb = ColorOperators__ColorOperators.HEXtoRGB(hexColor);
	  return ColorOperators__ColorOperators.RGBtoHSV(rgb[0], rgb[1], rgb[2]);
	};


	ColorOperators__ColorOperators.HSVtoHEX = function(hue, saturation, value) {
	  var rgb = ColorOperators__ColorOperators.HSVtoRGB(hue, saturation, value);
	  return ColorOperators__ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorOperators__ColorOperators.HSLtoHEX = function(hue, saturation, light) {
	  var rgb = ColorOperators__ColorOperators.HSLtoRGB(hue, saturation, light);
	  return ColorOperators__ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};



	/**
	 * converts an RGB color to HSV
	 * @param {Array} a RGB color array
	 * @return {Array} returns a HSV color array
	 * H in [0,360], S in [0,1], V in [0,1]
	 */
	ColorOperators__ColorOperators.RGBtoHSV = function(r, g, b) {
	    var h;
	    var s;
	    var v;
	    var min = Math.min(Math.min(r, g), b);
	    var max = Math.max(Math.max(r, g), b);
	    v = max / 255;
	    var delta = max - min;
	    if(delta == 0) return new Array(0, 0, r / 255);
	    if(max != 0) {
	      s = delta / max;
	    } else {
	      s = 0;
	      h = -1;
	      return new Array(h, s, v);
	    }
	    if(r == max) {
	      h = (g - b) / delta;
	    } else if(g == max) {
	      h = 2 + (b - r) / delta;
	    } else {
	      h = 4 + (r - g) / delta;
	    }
	    h *= 60;
	    if(h < 0) h += 360;
	    return new Array(h, s, v);
	  };
	  /**
	   * converts an HSV color to RGB
	   * @param {Array} a HSV color array
	   * @return {Array} returns a RGB color array
	   *
	   */
	ColorOperators__ColorOperators.HSVtoRGB = function(hue, saturation, value) {
	  hue = hue ? hue : 0;
	  saturation = saturation ? saturation : 0;
	  value = value ? value : 0;
	  var r;
	  var g;
	  var b;
	  //
	  var i;
	  var f;
	  var p;
	  var q;
	  var t;
	  if(saturation == 0) {
	    r = g = b = value;
	    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	  }
	  hue /= 60;
	  i = Math.floor(hue);
	  f = hue - i;
	  p = value * (1 - saturation);
	  q = value * (1 - saturation * f);
	  t = value * (1 - saturation * (1 - f));
	  switch(i) {
	    case 0:
	      r = value;
	      g = t;
	      b = p;
	      break;
	    case 1:
	      r = q;
	      g = value;
	      b = p;
	      break;
	    case 2:
	      r = p;
	      g = value;
	      b = t;
	      break;
	    case 3:
	      r = p;
	      g = q;
	      b = value;
	      break;
	    case 4:
	      r = t;
	      g = p;
	      b = value;
	      break;
	    default:
	      r = value;
	      g = p;
	      b = q;
	      break;
	  }
	  return new Array(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
	};

	/**
	 * Converts an HSL color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
	 * Assumes hue is contained in the interval [0,360) and saturation and l are contained in the set [0, 1]
	 */
	ColorOperators__ColorOperators.HSLtoRGB = function(hue, saturation, light) {
	  var r, g, b;

	  if(saturation == 0) {
	    r = g = b = light; // achromatic
	  } else {
	    function hue2rgb(p, q, t) {
	      if(t < 0) t += 1;
	      if(t > 1) t -= 1;
	      if(t < 1 / 6) return p + (q - p) * 6 * t;
	      if(t < 1 / 2) return q;
	      if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	      return p;
	    }

	    var q = light < 0.5 ? light * (1 + saturation) : light + saturation - light * saturation;
	    var p = 2 * light - q;
	    r = hue2rgb(p, q, (hue / 360) + 1 / 3);
	    g = hue2rgb(p, q, hue / 360);
	    b = hue2rgb(p, q, (hue / 360) - 1 / 3);
	  }

	  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
	};


	ColorOperators__ColorOperators.invertColorRGB = function(r, g, b) {
	  return [255 - r, 255 - g, 255 - b];
	};

	ColorOperators__ColorOperators.addAlpha = function(color, alpha) {
	  //var rgb = color.substr(0,3)=='rgb'?ColorOperators.colorStringToRGB(color):ColorOperators.HEXtoRGB(color);
	  var rgb = ColorOperators__ColorOperators.colorStringToRGB(color);
	  if(rgb == null) return 'black';
	  return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
	};

	ColorOperators__ColorOperators.invertColor = function(color) {
	  var rgb = ColorOperators__ColorOperators.colorStringToRGB(color);
	  rgb = ColorOperators__ColorOperators.invertColorRGB(rgb[0], rgb[1], rgb[2]);
	  return ColorOperators__ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};



	ColorOperators__ColorOperators.toHex = function(number) {
	  var hex = number.toString(16);
	  while(hex.length < 2) hex = "0" + hex;
	  return hex;
	};


	ColorOperators__ColorOperators.getRandomColor = function() {
	  return 'rgb(' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ')';
	};


	/////// Universal matching



	/**
	 * This method was partially obtained (and simplified) from a Class by Stoyan Stefanov:
	 *
	 * A class to parse color values
	 * @author Stoyan Stefanov <sstoo@gmail.com>
	 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
	 * @license Use it if you like it
	 *
	 */
	ColorOperators__ColorOperators.colorStringToRGB = function(color_string) {
	  //c.log('color_string:['+color_string+']');
	  var ok = false;

	  // strip any leading #
	  if(color_string.charAt(0) == '#') { // remove # if any
	    color_string = color_string.substr(1, 6);
	    //c.log('-> color_string:['+color_string+']');
	  }

	  color_string = color_string.replace(/ /g, '');
	  color_string = color_string.toLowerCase();

	  // before getting into regexps, try simple matches
	  // and overwrite the input
	  var simple_colors = {
	    aliceblue: 'f0f8ff',
	    antiquewhite: 'faebd7',
	    aqua: '00ffff',
	    aquamarine: '7fffd4',
	    azure: 'f0ffff',
	    beige: 'f5f5dc',
	    bisque: 'ffe4c4',
	    black: '000000',
	    blanchedalmond: 'ffebcd',
	    blue: '0000ff',
	    blueviolet: '8a2be2',
	    brown: 'a52a2a',
	    burlywood: 'deb887',
	    cadetblue: '5f9ea0',
	    chartreuse: '7fff00',
	    chocolate: 'd2691e',
	    coral: 'ff7f50',
	    cornflowerblue: '6495ed',
	    cornsilk: 'fff8dc',
	    crimson: 'dc143c',
	    cyan: '00ffff',
	    darkblue: '00008b',
	    darkcyan: '008b8b',
	    darkgoldenrod: 'b8860b',
	    darkgray: 'a9a9a9',
	    darkgreen: '006400',
	    darkkhaki: 'bdb76b',
	    darkmagenta: '8b008b',
	    darkolivegreen: '556b2f',
	    darkorange: 'ff8c00',
	    darkorchid: '9932cc',
	    darkred: '8b0000',
	    darksalmon: 'e9967a',
	    darkseagreen: '8fbc8f',
	    darkslateblue: '483d8b',
	    darkslategray: '2f4f4f',
	    darkturquoise: '00ced1',
	    darkviolet: '9400d3',
	    deeppink: 'ff1493',
	    deepskyblue: '00bfff',
	    dimgray: '696969',
	    dodgerblue: '1e90ff',
	    feldspar: 'd19275',
	    firebrick: 'b22222',
	    floralwhite: 'fffaf0',
	    forestgreen: '228b22',
	    fuchsia: 'ff00ff',
	    gainsboro: 'dcdcdc',
	    ghostwhite: 'f8f8ff',
	    gold: 'ffd700',
	    goldenrod: 'daa520',
	    gray: '808080',
	    green: '008000',
	    greenyellow: 'adff2f',
	    honeydew: 'f0fff0',
	    hotpink: 'ff69b4',
	    indianred: 'cd5c5c',
	    indigo: '4b0082',
	    ivory: 'fffff0',
	    khaki: 'f0e68c',
	    lavender: 'e6e6fa',
	    lavenderblush: 'fff0f5',
	    lawngreen: '7cfc00',
	    lemonchiffon: 'fffacd',
	    lightblue: 'add8e6',
	    lightcoral: 'f08080',
	    lightcyan: 'e0ffff',
	    lightgoldenrodyellow: 'fafad2',
	    lightgrey: 'd3d3d3',
	    lightgreen: '90ee90',
	    lightpink: 'ffb6c1',
	    lightsalmon: 'ffa07a',
	    lightseagreen: '20b2aa',
	    lightskyblue: '87cefa',
	    lightslateblue: '8470ff',
	    lightslategray: '778899',
	    lightsteelblue: 'b0c4de',
	    lightyellow: 'ffffe0',
	    lime: '00ff00',
	    limegreen: '32cd32',
	    linen: 'faf0e6',
	    magenta: 'ff00ff',
	    maroon: '800000',
	    mediumaquamarine: '66cdaa',
	    mediumblue: '0000cd',
	    mediumorchid: 'ba55d3',
	    mediumpurple: '9370d8',
	    mediumseagreen: '3cb371',
	    mediumslateblue: '7b68ee',
	    mediumspringgreen: '00fa9a',
	    mediumturquoise: '48d1cc',
	    mediumvioletred: 'c71585',
	    midnightblue: '191970',
	    mintcream: 'f5fffa',
	    mistyrose: 'ffe4e1',
	    moccasin: 'ffe4b5',
	    navajowhite: 'ffdead',
	    navy: '000080',
	    oldlace: 'fdf5e6',
	    olive: '808000',
	    olivedrab: '6b8e23',
	    orange: 'ffa500',
	    orangered: 'ff4500',
	    orchid: 'da70d6',
	    palegoldenrod: 'eee8aa',
	    palegreen: '98fb98',
	    paleturquoise: 'afeeee',
	    palevioletred: 'd87093',
	    papayawhip: 'ffefd5',
	    peachpuff: 'ffdab9',
	    peru: 'cd853f',
	    pink: 'ffc0cb',
	    plum: 'dda0dd',
	    powderblue: 'b0e0e6',
	    purple: '800080',
	    red: 'ff0000',
	    rosybrown: 'bc8f8f',
	    royalblue: '4169e1',
	    saddlebrown: '8b4513',
	    salmon: 'fa8072',
	    sandybrown: 'f4a460',
	    seagreen: '2e8b57',
	    seashell: 'fff5ee',
	    sienna: 'a0522d',
	    silver: 'c0c0c0',
	    skyblue: '87ceeb',
	    slateblue: '6a5acd',
	    slategray: '708090',
	    snow: 'fffafa',
	    springgreen: '00ff7f',
	    steelblue: '4682b4',
	    tan: 'd2b48c',
	    teal: '008080',
	    thistle: 'd8bfd8',
	    tomato: 'ff6347',
	    turquoise: '40e0d0',
	    violet: 'ee82ee',
	    violetred: 'd02090',
	    wheat: 'f5deb3',
	    white: 'ffffff',
	    whitesmoke: 'f5f5f5',
	    yellow: 'ffff00',
	    yellowgreen: '9acd32'
	  };

	  if(simple_colors[color_string] != null) color_string = simple_colors[color_string];


	  // array of color definition objects
	  var color_defs = [
	  {
	    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
	    //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
	    process: function(bits) {
	      return [
	        parseInt(bits[1]),
	        parseInt(bits[2]),
	        parseInt(bits[3])
	      ];
	    }
	  },
	  {
	    re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),[\.0123456789]+\)$/,
	    //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)', 'rgba(200,100,120,0.3)'],
	    process: function(bits) {
	      return [
	        parseInt(bits[1]),
	        parseInt(bits[2]),
	        parseInt(bits[3])
	      ];
	    }
	  },
	  {
	    re: /^(\w{2})(\w{2})(\w{2})$/,
	    //example: ['#00ff00', '336699'],
	    process: function(bits) {
	      return [
	        parseInt(bits[1], 16),
	        parseInt(bits[2], 16),
	        parseInt(bits[3], 16)
	      ];
	    }
	  },
	  {
	    re: /^(\w{1})(\w{1})(\w{1})$/,
	    //example: ['#fb0', 'f0f'],
	    process: function(bits) {
	      return [
	        parseInt(bits[1] + bits[1], 16),
	        parseInt(bits[2] + bits[2], 16),
	        parseInt(bits[3] + bits[3], 16)
	      ];
	    }
	  }];

	  // search through the definitions to find a match
	  for(var i = 0; i < color_defs.length; i++) {
	    var re = color_defs[i].re;
	    var processor = color_defs[i].process;
	    var bits = re.exec(color_string);
	    if(bits) {
	      return processor(bits);
	    }

	  }

	  return null;
	};

	ColorList.prototype = new List__default();
	ColorList.prototype.constructor = ColorList;

	/**
	 * @classdesc A {@link List} for storing Colors.
	 *
	 * @description Creates a new ColorList.
	 * @constructor
	 * @category colors
	 */
	function ColorList() {
	  var args = [];
	  var i;
	  for(i = 0; i < arguments.length; i++) {
	    args[i] = arguments[i];
	  }
	  var array = List__default.apply(this, args);
	  array = ColorList.fromArray(array);

	  return array;
	}


	ColorList.fromArray = function(array) {
	  var result = List__default.fromArray(array);
	  result.type = "ColorList";
	  result.getRgbArrays = ColorList.prototype.getRgbArrays;
	  result.getInterpolated = ColorList.prototype.getInterpolated;
	  result.getInverted = ColorList.prototype.getInverted;
	  result.addAlpha = ColorList.prototype.addAlpha;
	  return result;
	};

	/**
	 * return an arrays of rgb arrays ([rr,gg,bb])
	 * @return {array}
	 * tags:
	 */
	ColorList.prototype.getRgbArrays = function() {
	  var rgbArrays = new List__default();

	  for(var i = 0; this[i] != null; i++) {
	    rgbArrays[i] = ColorOperators__default.colorStringToRGB(this[i]);
	  }

	  return rgbArrays;
	};

	/**
	 * interpolates colors with a given color and measure
	 * @param  {String} color to be interpolated with
	 * @param  {Number} value intenisty of interpolation [0,1]
	 * @return {ColorList}
	 * tags:
	 */
	ColorList.prototype.getInterpolated = function(color, value) {
	  var newColorList = new ColorList();

	  for(var i = 0; this[i] != null; i++) {
	    newColorList[i] = ColorOperators__default.interpolateColors(this[i], color, value);
	  }

	  newColorList.name = this.name;
	  return newColorList;
	};

	/**
	 * inverts all colors
	 * @return {ColorList}
	 * tags:
	 */
	ColorList.prototype.getInverted = function() {
	  var newColorList = new ColorList();

	  for(var i = 0; this[i] != null; i++) {
	    newColorList[i] = ColorOperators__default.invertColor(this[i]);
	  }

	  newColorList.name = this.name;
	  return newColorList;
	};

	/**
	 * adds alpha value to all colores
	 * @param {Number} alpha alpha value in [0,1]
	 * @return {ColorList}
	 * tags:
	 */
	ColorList.prototype.addAlpha = function(alpha) {
	  var newColorList = new ColorList();

	  for(var i = 0; this[i] != null; i++) {
	    newColorList[i] = ColorOperators__default.addAlpha(this[i], alpha);
	  }

	  newColorList.name = this.name;
	  return newColorList;
	};

	exports.ColorList = ColorList;

	/**
	 * @classdesc Default color scales.
	 *
	 * @namespace
	 * @category colors
	 */

	function ColorScales() {}

	// *
	//  * return a colorScale from its name
	//  * @param  {String} string name of ColorScale
	//  * @return {Function} ColorScale function
	//  * tags:conversion

	// ColorScales.getColorScaleByName = function(string){
	// 	return ColorScales[string];
	// }

	ColorScales.blackScale = function(value) {
	  return 'black';
	};

	ColorScales.grayscale = function(value) {
	  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 255, 255], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorScales.antiGrayscale = function(value) {
	  var rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [0, 0, 0], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorScales.antiTemperature = function(value) {
	  return ColorScales.temperature(1 - value);
	};

	ColorScales.temperature = function(value) { //todo:make it efficient
	  if(value < 0.2) {
	    var color = ColorOperators.interpolateColors('#000000', ColorOperators.HSVtoHEX(234, 1, 1), value * 5);
	  } else if(value > 0.85) {
	    color = ColorOperators.interpolateColors(ColorOperators.HSVtoHEX(0, 1, 1), '#FFFFFF', (value - 0.85) / 0.15);
	  } else {
	    color = ColorOperators.HSVtoHEX(Math.round((0.65 - (value - 0.2)) * 360), 1, 1);
	  }
	  return color;
	};

	ColorScales.sqrtTemperature = function(value) {
	  return ColorScales.temperature(Math.sqrt(value));
	};

	ColorScales.sqrt4Temperature = function(value) {
	  return ColorScales.temperature(Math.pow(value, 0.25));
	};

	ColorScales.quadraticTemperature = function(value) {
	  return ColorScales.temperature(Math.pow(value, 2));
	};

	ColorScales.cubicTemperature = function(value) {
	  return ColorScales.temperature(Math.pow(value, 3));
	};

	ColorScales.greenToRed = function(value) { //todo:make it efficient
	  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 50, 50], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};
	ColorScales.greenToBlue = function(value) { //todo:make it efficient
	  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [50, 50, 255], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorScales.grayToOrange = function(value) { //todo:make it efficient
	  var rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [255, 110, 0], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorScales.blueToRed = function(value) {
	  return 'rgb(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ')';
	};

	ColorScales.blueToRedAlpha = function(value) { //todo:make it efficient
	  return 'rgba(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ', 0.5)';
	};

	ColorScales.whiteToRed = function(value) {
	  var gg = Math.floor(255 - value * 255);
	  return 'rgb(255,' + gg + ',' + gg + ')';
	};

	ColorScales.redToBlue = function(value) {
	  var rgb = ColorOperators.interpolateColorsRGB([255, 0, 0], [0, 0, 255], value);
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};

	ColorScales.greenWhiteRed = function(value) {
	  if(value < 0.5) {
	    var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 255, 255], value * 2);
	  } else {
	    rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 50, 50], (value - 0.5) * 2);
	  }
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};


	ColorScales.solar = function(value) {
	  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], ColorOperators.interpolateColorsRGB([255, 0, 0], [255, 255, 0], value), Math.pow(value * 0.99 + 0.01, 0.2));
	  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
	};
	ColorScales.antiSolar = function(value) {
	  return ColorOperators.invertColor(ColorScales.solar(value));
	};

	ColorScale.prototype = new DataModel();
	ColorScale.prototype.constructor = ColorScale;

	/**
	 * @classdesc Color scale.
	 *
	 * @description Creates a new ColorScale.
	 * @param {Function} colorScaleFunction Function.
	 * @constructor
	 * @category colors
	 */
	function ColorScale(colorScaleFunction) {
	  DataModel.apply(this, arguments);
	  this.name = "";
	  this.type = "ColorScale";

	  this.colorScaleFunction = colorScaleFunction ? colorScaleFunction : ColorScales.blackScale;
	}


	ColorScale.prototype.getColor = function(value) {
	  return this.colorScaleFunction(value);
	};

	ColorScale.prototype.getColorList = function(nColors) {
	  var colorList = new ColorList();
	  var i;
	  for(i = 0; i < nColors; i++) {
	    colorList.push(this.getColor(i / (nColors - 1)));
	  }
	  return colorList;
	};

	exports.ColorScale = ColorScale;

	function Space2D(configuration) {
	  configuration = configuration == null ? {} : configuration;

	  this.center = configuration.center == null ? new Point__default(0, 0) : configuration.center;
	  this.scale = 1;

	  if(configuration.interactionActive) this.activeInteraction();

	  this.MIN_SCALE = configuration.minScale == null ? 0.05 : configuration.minScale;
	  this.MAX_SCALE = configuration.maxScale == null ? 20 : configuration.maxScale;

	  this.active = configuration.interactionActive;
	}


	Space2D.prototype.activeInteraction = function() {
	  if(this.active) return;
	  this.active = true;
	  addInteractionEventListener('mousedown', this.onMouse, this);
	  addInteractionEventListener('mouseup', this.onMouse, this);
	  addInteractionEventListener('mousewheel', this.wheel, this);
	};

	Space2D.prototype.deActivate = function() {
	  this.active = false;
	  this.dragging = false;
	  removeInteractionEventListener('mousedown', this.onMouse, this);
	  removeInteractionEventListener('mouseup', this.onMouse, this);
	  removeInteractionEventListener('mousemove', this.onMouse, this);
	  removeInteractionEventListener('mousewheel', this.wheel, this);
	};

	Space2D.prototype.stopDragging = function() {
	  removeInteractionEventListener('mousemove', this.onMouse, this);
	};

	Space2D.prototype.project = function(point) {
	  return new Point__default((point.x - this.center.x) * this.scale, (point.y + this.center.y) * this.scale);
	};

	Space2D.prototype.projectX = function(x) {
	  return(x - this.center.x) * this.scale;
	};

	Space2D.prototype.projectY = function(y) {
	  return(y - this.center.y) * this.scale;
	};


	Space2D.prototype.inverseProject = function(point) {
	  return new Point__default(point.x / this.scale + this.center.x, point.y / this.scale + this.center.y);
	};

	Space2D.prototype.inverseProjectX = function(x) {
	  return x / this.scale + this.center.x;
	};

	Space2D.prototype.inverseProjectY = function(y) {
	  return y / this.scale + this.center.y;
	};

	Space2D.prototype.move = function(vector, projected) {
	  this.center = this.center.subtract(projected ? vector.factor(1 / this.scale) : vector);
	};

	Space2D.prototype.factorScaleFromPoint = function(point, factor) {
	  var k = (1 - 1 / factor) / this.scale;
	  this.center.x = k * point.x + this.center.x;
	  this.center.y = k * point.y + this.center.y;

	  this.scale *= factor;
	};

	Space2D.prototype.fixX = function(xDeparture, xArrival) {
	  this.center.x = xDeparture - (xArrival / this.scale);
	};
	Space2D.prototype.fixY = function(yDeparture, yArrival) {
	  this.center.y = yDeparture - (yArrival / this.scale);
	};

	Space2D.prototype.fixHorizontalInterval = function(departureInterval, arrivalInterval) {
	  this.scale = arrivalInterval.getAmplitude() / departureInterval.getAmplitude();
	  this.fixX((departureInterval.x + departureInterval.y) * 0.5, cW * 0.5);
	};

	//////

	Space2D.prototype.onMouse = function(e) {
	  switch(e.type) {
	    case 'mousedown':
	      if(!this.active) return;
	      this.dragging = true;
	      this.prev_mX = mX;
	      this.prev_mY = mY;
	      addInteractionEventListener('mousemove', this.onMouse, this);
	      break;
	    case 'mouseup':
	      this.dragging = false;
	      removeInteractionEventListener('mousemove', this.onMouse, this);
	      break;
	    case 'mousemove':
	      if(!this.active) return;
	      this.center.x += (this.prev_mX - mX) / this.scale;
	      this.center.y += (this.prev_mY - mY) / this.scale;
	      this.prev_mX = mX;
	      this.prev_mY = mY;
	      break;
	  }
	};



	Space2D.prototype.wheel = function(e) {
	  if(!this.active) return;
	  if(this.scale <= this.MIN_SCALE && e.value > 0) {
	    this.scale = this.MIN_SCALE;
	    return;
	  }
	  if(this.scale >= this.MAX_SCALE && e.value < 0) {
	    this.scale = this.MAX_SCALE;
	    return;
	  }
	  this.factorScaleFromPoint(new Point__default(mX - 0, mY - 0), (1 - 0.02 * e.value));
	};

	exports.Space2D = Space2D;

	function DateListOperators() {}



	DateListOperators.buildTimeTreeFromDates = function(dates) {
	  if(dates == null) return;

	  var tree = new Tree();
	  var minYear;
	  var maxYear;

	  var minDate = dates[0];
	  var maxDate = dates[0];



	  dates.forEach(function(date) {
	    minDate = date < minDate ? date : minDate;
	    maxDate = date > maxDate ? date : maxDate;
	  });

	  minYear = minDate.getFullYear();
	  maxYear = minDate.getFullYear();

	  var superior = new Node("years", "years");
	  tree.addNodeToTree(superior);
	  superior.dates = dates.clone();

	  var y, m, d, h, mn, s, ms;
	  var yNode, mNode, dNode, hNode, mnNode, sNode, msNode;
	  var parent;

	  //var N=0;

	  for(y = minYear; y <= maxYear; y++) {
	    yNode = new Node(String(y), String(y));
	    tree.addNodeToTree(yNode, superior);
	  }

	  dates.forEach(function(date) {
	    y = DateListOperators._y(date);
	    yNode = superior.toNodeList[y - minYear];

	    if(yNode.dates == null) {
	      yNode.dates = new DateList();

	      for(m = 0; m < 12; m++) {
	        mNode = new Node(DateOperators__default.MONTH_NAMES[m] + "_" + y, DateOperators__default.MONTH_NAMES[m]);
	        tree.addNodeToTree(mNode, yNode);
	        nDaysOnMonth = DateOperators__default.getNDaysInMonth(y, m + 1);
	      }
	    }
	    yNode.dates.push(date);


	    m = DateListOperators._m(date);
	    mNode = yNode.toNodeList[m];
	    if(mNode.dates == null) {
	      mNode.dates = new DateList();
	      for(d = 0; d < nDaysOnMonth; d++) {
	        dNode = new Node((d + 1) + "_" + mNode.id, String(d + 1));
	        tree.addNodeToTree(dNode, mNode);
	      }
	    }
	    mNode.dates.push(date);

	    d = DateListOperators._d(date);
	    dNode = mNode.toNodeList[d];
	    if(dNode.dates == null) {
	      dNode.dates = new DateList();
	      for(h = 0; h < 24; h++) {
	        hNode = new Node(h + "_" + dNode.id, String(h) + ":00");
	        tree.addNodeToTree(hNode, dNode);
	      }
	    }
	    dNode.dates.push(date);

	    h = DateListOperators._h(date);
	    hNode = dNode.toNodeList[h];
	    if(hNode.dates == null) {
	      hNode.dates = new DateList();
	      for(mn = 0; mn < 60; mn++) {
	        mnNode = new Node(mn + "_" + hNode.id, String(mn));
	        tree.addNodeToTree(mnNode, hNode);
	      }
	    }
	    hNode.dates.push(date);

	    mn = DateListOperators._mn(date);
	    mnNode = hNode.toNodeList[mn];
	    if(mnNode.dates == null) {
	      mnNode.dates = new DateList();
	      //c.l(date);
	      // N++;
	      // for(s=0; s<60; s++){
	      // 	sNode = new Node(String(s), s+"_"+mnNode.id);
	      // 	tree.addNodeToTree(sNode, mnNode);
	      // }
	    }
	    mnNode.weight++;
	    mnNode.dates.push(date);

	    // s = DateListOperators._s(date);
	    // sNode = mnNode.toNodeList[s];
	    // if(sNode.dates==null){
	    // 	sNode.dates = new DateList();
	    // }
	    // sNode.dates.push(date);
	    // sNode.weight++;
	  });

	  tree.assignDescentWeightsToNodes();

	  //



	  // for(y=minYear; y<=maxYear; y++){
	  // 	yNode = new Node(String(y), String(y));
	  // 	tree.addNodeToTree(yNode, superior);

	  // 	for(m=0; m<12; m++){
	  // 		mNode = new Node(DateOperators.MONTH_NAMES[m], DateOperators.MONTH_NAMES[m]+"_"+y);
	  // 		tree.addNodeToTree(mNode, yNode);
	  // 		nDaysOnMonth = DateOperators.getNDaysInMonth(y, m+1);

	  // 		for(d=0; d<nDaysOnMonth; d++){
	  // 			dNode = new Node(String(d+1), (d+1)+"_"+mNode.id);
	  // 			tree.addNodeToTree(dNode, mNode);

	  // 			for(h=0; h<24; h++){
	  // 				hNode = new Node(String(h), h+"_"+dNode.id);
	  // 				tree.addNodeToTree(hNode, dNode);

	  // 				for(mn=0; mn<60; mn++){
	  // 					mnNode = new Node(String(mn), mn+"_"+hNode.id);
	  // 					tree.addNodeToTree(mnNode, hNode);

	  // 					for(s=0; s<60; s++){
	  // 						sNode = new Node(String(s), s+"_"+mnNode.id);
	  // 						tree.addNodeToTree(sNode, mnNode);
	  // 					}
	  // 				}
	  // 			}
	  // 		}
	  // 	}
	  // }

	  return tree;
	};

	DateListOperators._y = function(date) {
	  return date.getFullYear();
	};
	DateListOperators._m = function(date) {
	  return date.getMonth();
	};
	DateListOperators._d = function(date) {
	  return date.getDate() - 1;
	};
	DateListOperators._h = function(date) {
	  return date.getHours();
	};
	DateListOperators._mn = function(date) {
	  return date.getMinutes();
	};
	DateListOperators._s = function(date) {
	  return date.getSeconds();
	};
	DateListOperators._ms = function(date) {
	  return date.getMilliseconds();
	};

	function CountryListOperators() {}



	CountryListOperators.getCountryByName = function(countryList, name) {
	  var simplifiedName = CountryOperators.getSimplifiedName(name);

	  for(var i = 0; countryList[i] != null; i++) {
	    if(countryList[i].simplifiedNames.indexOf(simplifiedName) != -1) return countryList[i];
	  }

	  return null;
	};

	exports.CountryListOperators = CountryListOperators;

	function GeoOperators() {}


	GeoOperators.EARTH_RADIUS = 6371009;
	GeoOperators.EARTH_DIAMETER = GeoOperators.EARTH_RADIUS * 2;


	GeoOperators.geoCoordinateToDecimal = function(value) {
	  return Math.floor(value) + (value - Math.floor(value)) * 1.66667;
	};

	GeoOperators.geoDistance = function(point0, point1) {
	  var a = Math.pow(Math.sin((point1.y - point0.y) * 0.5 * gradToRad), 2) + Math.cos(point0.y * gradToRad) * Math.cos(point1.y * gradToRad) * Math.pow(Math.sin((point1.x - point0.x) * 0.5 * gradToRad), 2);
	  return GeoOperators.EARTH_DIAMETER * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	};
	GeoOperators.polygonLength = function(polygon) {
	  if(polygon.length < 2) return 0;

	  var length = GeoOperators.geoDistance(polygon[0], polygon[1]);
	  for(var i = 2; polygon[i] != null; i++) {
	    length += GeoOperators.geoDistance(polygon[i - 1], polygon[i]);
	  }
	  return length;
	};

	exports.GeoOperators = GeoOperators;

	function GeometryConvertions() {}


	//include(frameworksRoot+"operators/strings/StringOperators.js")

	// GeometryConvertions.StringToPolygonList=function(string, sep0, sep1, sep2){
	// sep0 = sep0 || ",";
	// sep1 = sep1 || " ";
	// sep2 = sep2 || "\n";
	//
	// var polygonList = new PolygonList();
	// var polygon;
	// var point;
	//
	// lines = StringOperators.splitString(string, sep2);
	//
	// var i;
	// var j;
	// for(i=0; lines[i]!=null; i++){
	// polygon = new Polygon();
	// var points = StringOperators.splitString(lines[i], sep1);
	// for(j=0; points[j]!=null; j++){
	// var sPoint = StringOperators.splitString(points[j], sep0);
	// point = new Point(Number(sPoint[0]), Number(sPoint[1]));
	// polygon.push(point);
	// }
	// polygonList.push(polygon);
	// }
	// return polygonList;
	// }

	GeometryConvertions.twoNumberListsToPolygon = function(numberList0, numberList1) { //TODO:change name to NumberTableToPolygon
	  var n = Math.min(numberList0.length, numberList1.length);
	  var polygon = new Polygon__default();
	  for(var i = 0; i < n; i++) {
	    polygon[i] = new Point__default(numberList0[i], numberList1[i]);
	  }
	  return polygon;
	};

	/**
	 * converts a Polygon into a NumberTable
	 * @param {Polygon} polygon
	 * @return {NumberTable}
	 * tags:conversion
	 */
	GeometryConvertions.PolygonToNumberTable = function(polygon) {
	  if(polygon == null) return null;

	  var numberTable = new NumberTable__default();
	  numberTable[0] = new NumberList__default();
	  numberTable[1] = new NumberList__default();

	  polygon.forEach(function(p) {
	    numberTable[0].push(p.x);
	    numberTable[1].push(p.y);
	  });

	  return numberTable;
	};

	exports.GeometryConvertions = GeometryConvertions;

	function PolygonGenerators() {}


	PolygonGenerators.createPolygon = function(nPoints, mode, frame) {
	  var polygon = new Polygon__default();

	  switch(mode) {
	    case 0: //random
	      for(var i = 0; i < nPoints; i++) {
	        polygon.push(new Point__default(frame.x + frame.width * Math.random(), frame.y + frame.height * Math.random()));
	      }
	      break;
	    case 1: //circle
	      break;
	  }

	  return polygon;
	};

	// PolygonGenerators.getCirclesDisposedInSpiral=function(weights, frame){ //TODO: this method belongs to another class (?)
	// 	var sortedCenters;
	// 	var centers = new Polygon();
	// 	var sortedRadius;
	// 	var radius = new NumberList();
	// 	var sortArray = weights.sortNumericIndexedDescending();
	// 	//trace("sortArray:", weights, sortArray);
	// 	var maxWeight = 0;
	// 	var nElements = weights.length;
	// 	var i;
	// 	var j;

	// 	if(nElements==1){
	// 		var table=new Table();
	// 		var pointList=new Polygon();
	// 		var point=new Point()
	// 		pointList.push(point);
	// 		table.push(pointList);
	// 		var list=new List();
	// 		list.push(1);
	// 		table.push(list);
	// 		return table;
	// 	}
	// 	maxWeight =weights.getMax();


	// 	if(maxWeight==0) return null;

	// 	var MIN_SPACE_BETWEEN_CIRCLES = 0.1;

	// 	sortedRadius = new NumberList(Math.sqrt(weights[sortArray[0]]/maxWeight), Math.sqrt(weights[sortArray[1]]/maxWeight));
	// 	sortedCenters = new Polygon(new Point(0,0), new Point(sortedRadius[0] + sortedRadius[1] + MIN_SPACE_BETWEEN_CIRCLES,0));
	// 	//trace("sortedCenters:", sortedCenters),
	// 	centers[sortArray[0]] = sortedCenters[0];
	// 	radius[sortArray[0]] = sortedRadius[0];

	// 	centers[sortArray[1]] = sortedCenters[1];
	// 	radius[sortArray[1]] = sortedRadius[1];
	// 	//trace(centers);
	// 	//trace(radius);
	// 	var r;
	// 	var rI;
	// 	var angle = 0;

	// 	var testPoint = new Point(0, 0);
	// 	var externR = sortedCenters[1].x + sortedRadius[1];

	// 	//var ACCUM_J:Number=0;

	// 	for(i=2; i<nElements; i++){
	// 		rI = Math.sqrt(weights[sortArray[i]]/maxWeight);
	// 		//trace(i, "rI", rI);
	// 		r = sortedRadius[0] + rI + MIN_SPACE_BETWEEN_CIRCLES;
	// 		angle = i;

	// 		for(j=0; j<100000; j++){
	// 			testPoint.x = r*Math.cos(angle);
	// 			testPoint.y = r*Math.sin(angle);

	// 			r+=0.01;
	// 			angle+=r*0.04;

	// 			if(Polygon.testCircleAtPoint(testPoint, rI+MIN_SPACE_BETWEEN_CIRCLES, sortedCenters, sortedRadius) || j==99999){
	// 				sortedCenters.push(new Point(testPoint.x, testPoint.y));
	// 				sortedRadius.push(rI);
	// 				centers[sortArray[i]] = sortedCenters[i];
	// 				radius[sortArray[i]] = sortedRadius[i];
	// 				externR = Math.max(externR, Math.sqrt(Math.pow(testPoint.x, 2)+Math.pow(testPoint.y, 2)) + rI);
	// 				break;
	// 			}
	// 		}
	// 		//ACCUM_J+=j

	// 	}
	// 	//trace("   packingCircles:ACCUM_J", ACCUM_J);
	// 	//trace("c:", centers);
	// 	//trace("r:", radius);
	// 	var mulVal=1/externR;
	// 	for(i=0; i<centers.length; i++){
	// 		centers[i].x*=mulVal;
	// 		centers[i].y*=mulVal;
	// 	}
	// 	for(i=0; i<radius.length; i++){
	// 		radius[i]*=mulVal;
	// 	}
	// 	//centers = centers.multiply();
	// 	//radius = radius.multiply(1/externR);
	// 	//trace("c2:", centers);
	// 	//trace("r2:", radius);

	// 	return new Array(centers, radius);
	// }

	exports.PolygonGenerators = PolygonGenerators;

	function PolygonListEncodings() {}


	/**
	 * converts a simple format for polygons into a PolygonList
	 * @param {String} string
	 *
	 * @param {String} separatorCoordinates "," by default
	 * @param {String} separatorPolygons "/" by default
	 * @return {PolygonList}
	 * tags:encoding
	 */
	PolygonListEncodings.StringToPolygonList = function(string, separatorCoordinates, separatorPolygons) {
	  separatorCoordinates = separatorCoordinates || ",";
	  separatorPolygons = separatorPolygons || "/";

	  var polygonList = new PolygonList();
	  var polygon;
	  var point;

	  var pols = StringOperators__default.splitString(string, separatorPolygons);

	  var j;
	  var numbers;
	  for(var i = 0; pols[i] != null; i++) {
	    polygon = new Polygon__default();
	    numbers = StringOperators__default.splitString(pols[i], separatorCoordinates);
	    for(j = 0; numbers[j] != null; j += 2) {
	      point = new Point__default(Number(numbers[j]), Number(numbers[j + 1]));
	      polygon.push(point);
	    }
	    polygonList.push(polygon);
	  }
	  return polygonList;
	};

	/**
	 * converts a polygonList into a simple text format
	 * @param {PolygonList} polygonList
	 *
	 * @param {String} separatorCoordinates "," by default
	 * @param {String} separatorPolygons "/" by default
	 * @return {String}
	 * tags:encoding
	 */
	PolygonListEncodings.PolygonListToString = function(polygonList, separatorCoordinates, separatorPolygons) {
	  separatorCoordinates = separatorCoordinates || ",";
	  separatorPolygons = separatorPolygons || "/";

	  var i;
	  var j;
	  var t = '';
	  for(i = 0; polygonList[i] != null; i++) {
	    t += (i == 0 ? '' : separatorPolygons);
	    for(j = 0; polygonList[i][j] != null; j++) {
	      t += (j == 0 ? '' : separatorCoordinates) + polygonList[i][j].x + separatorCoordinates + polygonList[i][j].y;
	    }
	  }
	  return t;
	};

	exports.PolygonListEncodings = PolygonListEncodings;

	function PolygonListOperators() {}


	PolygonListOperators.simplifyPolygons = function(polygonList, margin, removeEmptyPolygons) {
	  var newPolygonList = new PolygonList();
	  var newPolygon;
	  for(var i = 0; polygonList[i] != null; i++) {
	    newPolygon = PolygonOperators.simplifyPolygon(polygonList[i], margin);
	    if(newPolygon.length > 0 || !removeEmptyPolygons) {
	      newPolygonList.push(newPolygon);
	    }
	  }
	  return newPolygonList;
	};

	exports.PolygonListOperators = PolygonListOperators;

	function ListOperators__ListOperators() {}
	var ListOperators__default = ListOperators__ListOperators;


	/**
	 * gets an element in a specified position from a List
	 * @param  {List} list
	 *
	 * @param  {Number} index
	 * @return {Object}
	 * tags:
	 */
	ListOperators__ListOperators.getElement = function(list, index) {
	  if(list == null) return null;
	  index = index == null ? 0 : index % list.length;
	  return list[index];
	};

	/**
	 * multi-ouput operator that gives acces to individual elements
	 * @param  {List} list
	 *
	 * @param  {Number} fromIndex (default 0)
	 * @return {Object} first Object
	 * @return {Object} second Object
	 * @return {Object} third Object
	 * @return {Object} fourth Object
	 * @return {Object} fifth Object
	 * @return {Object} sisxth Object
	 * @return {Object} seventh Object
	 * @return {Object} eight Object
	 * @return {Object} ninth Object
	 * @return {Object} tenth Object
	 * tags:
	 */
	ListOperators__ListOperators.getFirstElements = function(list, fromIndex) {
	  if(list == null) return null;

	  fromIndex = fromIndex == null ? 0 : Number(fromIndex);

	  return [
	  {
	    type: "Object",
	    name: "first value",
	    description: "first value",
	    value: list[fromIndex + 0]
	  },
	  {
	    type: "Object",
	    name: "second value",
	    description: "second value",
	    value: list[fromIndex + 1]
	  },
	  {
	    type: "Object",
	    name: "third value",
	    description: "third value",
	    value: list[fromIndex + 2]
	  },
	  {
	    type: "Object",
	    name: "fourth value",
	    description: "fourth value",
	    value: list[fromIndex + 3]
	  },
	  {
	    type: "Object",
	    name: "fifth value",
	    description: "fifth value",
	    value: list[fromIndex + 4]
	  },
	  {
	    type: "Object",
	    name: "sixth value",
	    description: "sixth value",
	    value: list[fromIndex + 5]
	  },
	  {
	    type: "Object",
	    name: "seventh value",
	    description: "seventh value",
	    value: list[fromIndex + 6]
	  },
	  {
	    type: "Object",
	    name: "eight value",
	    description: "eight value",
	    value: list[fromIndex + 7]
	  },
	  {
	    type: "Object",
	    name: "ninth value",
	    description: "ninth value",
	    value: list[fromIndex + 8]
	  },
	  {
	    type: "Object",
	    name: "tenth value",
	    description: "tenth value",
	    value: list[fromIndex + 9]
	  }];
	};

	// *
	//  * filters a List, by a NumberList of indexes, or by an Interval
	//  * @param  {List} list to be filtered
	//  * @param  {Object} params NumberList or Interval
	//  * @return {List}

	// ListOperators.getSubList = function(list, params){
	// 	if(list==null || params==null) return null;
	// 	return list.getSubList.apply(list, params.isList?[params]:params);
	// }

	/**
	 * first position of element in list (-1 if element doesn't belong to the list)
	 * @param  {List} list
	 * @param  {Object} element
	 * @return {Number}
	 * tags:
	 */
	ListOperators__ListOperators.indexOf = function(list, element) {
	  return list.indexOf(element);
	};

	/**
	 * concats lists
	 * @param  {List} list0
	 * @param  {List} list1
	 *
	 * @param  {List} list2
	 * @param  {List} list3
	 * @param  {List} list4
	 * @return {List} list5
	 * tags:
	 */
	ListOperators__ListOperators.concat = function() {
	  if(arguments == null || arguments.length == 0 ||  arguments[0] == null) return null;
	  if(arguments.length == 1) return arguments[0];

	  var i;
	  var list = arguments[0].concat(arguments[1]);
	  for(i = 2; arguments[i]; i++) {
	    list = list.concat(arguments[i]);
	  }
	  return list.getImproved();
	};

	/**
	 * assembles a List
	 * @param  {Object} argument0
	 *
	 * @param  {Object} argument1
	 * @param  {Object} argument2
	 * @param  {Object} argument3
	 * @param  {Object} argument4
	 * @return {List}
	 * tags:
	 */
	ListOperators__ListOperators.assemble = function() {
	  return List.fromArray(Array.prototype.slice.call(arguments, 0)).getImproved();
	};


	/**
	 * returns a table with two Lists: words and occurrences
	 * @param {List} list
	 *
	 * @param {Boolean} sortListsByOccurrences optional, true by default, common words first
	 * @param {Boolean} consecutiveRepetitions optional false by default, if true only counts consecutive repetitions
	 * @param {Number} optional limit, limits the size of the lists
	 * @return {Table}
	 * tags:count,toimprove
	 */
	ListOperators__ListOperators.countElementsRepetitionOnList = function(list, sortListsByOccurrences, consecutiveRepetitions, limit) { //transform this, use dictionary instead of indexOf !!!!!!!
	  if(list == null) return;

	  sortListsByOccurrences = sortListsByOccurrences == null ? true : sortListsByOccurrences;
	  consecutiveRepetitions = consecutiveRepetitions || false;
	  limit = limit == null ? 0 : limit;

	  var obj;
	  var elementList = instantiate(typeOf(list));
	  var numberList = new NumberList();
	  var index;
	  var i;

	  if(consecutiveRepetitions) {
	    if(list.length == 0) return null;
	    var previousElement = list[0];
	    elementList.push(previousElement);
	    numberList.push(1);
	    for(i = 1; i < nElements; i++) {
	      obj = list[i];
	      if(obj == previousElement) {
	        numberList[numberList.length - 1] = numberList[numberList.length - 1] + 1;
	      } else {
	        elementList.push(obj);
	        numberList.push(1);
	        previousElement = obj;
	      }
	    }
	  } else {
	    for(i = 0; list[i] != null; i++) {
	      obj = list[i];
	      index = elementList.indexOf(obj);
	      if(index != -1) {
	        numberList[index]++;
	      } else {
	        elementList.push(obj);
	        numberList.push(1);
	      }
	    }
	  }

	  if(elementList.type == "NumberList") {
	    var table = new NumberTable();
	  } else {
	    var table = new Table();
	  }
	  table[0] = elementList;
	  table[1] = numberList;

	  if(sortListsByOccurrences) {
	    table = TableOperators.sortListsByNumberList(table, numberList);
	  }

	  if(limit != 0 && limit < elementList.length) {
	    table[0] = table[0].splice(0, limit);
	    table[1] = table[1].splice(0, limit);
	  }

	  return table;
	};


	/**
	 * reverses a list
	 * @param {List} list
	 * @return {List}
	 * tags:sorting
	 */
	ListOperators__ListOperators.reverse = function(list) {
	  return list.getReversed();
	};

	/**
	 * using a table with two columns as a dictionary (first list elements to be read, second list result elements), translates a list
	 * @param  {List} list to transalte
	 * @param  {Table} dictionary table with two lists
	 *
	 * @param {Object} nullElement element to place in case no translation is found
	 * @return {List}
	 * tags:
	 */
	ListOperators__ListOperators.translateWithDictionary = function(list, dictionary, nullElement) {
	  var newList = new List();
	  list.forEach(function(element, i) {
	    index = dictionary[0].indexOf(element);
	    if(nullElement != null) {
	      newList[i] = index == -1 ? nullElement : dictionary[1][index];
	    } else {
	      newList[i] = index == -1 ? list[i] : dictionary[1][index];
	    }
	  });
	  return newList.getImproved();
	};


	// ListOperators.getIndexesOfElements=function(list, elements){
	// 	var numberList = new NumberList();
	// 	var i;
	// 	for(i=0; elements[i]!=null; i++){
	// 		numberList[i] = list.indexOf(elements[i]);
	// 	}
	// 	return numberList;
	// }


	// ListOperators.countOccurrencesOnList=function(list){
	// 	var occurrences=new NumberList();
	// 	var nElements=list.length;
	// 	for(var i=0; list[i]!=null; i++){
	// 		occurrences.push(this.getIndexesOfElement(list,list[i]).length);
	// 	}
	// 	return occurrences;
	// }


	ListOperators__ListOperators.sortListByNumberList = function(list, numberList, descending) {
	  if(descending == null) descending = true;
	  if(numberList.length == 0) return list;
	  var newNumberList;

	  var pairs = [];
	  var newList = instantiate(typeOf(list));

	  for(i = 0; list[i] != null; i++) {
	    pairs.push([list[i], numberList[i]]);
	  }


	  if(descending) {
	    pairs.sort(function(a, b) {
	      if(a[1] < b[1]) return 1;
	      return -1;
	    });
	  } else {
	    pairs.sort(function(a, b) {
	      if(a[1] < b[1]) return -1;
	      return 1;
	    });
	  }

	  for(i = 0; pairs[i] != null; i++) {
	    newList.push(pairs[i][0]);
	  }
	  newList.name = list.name;
	  return newList;
	};


	ListOperators__ListOperators.sortListByIndexes = function(list, indexedArray) {
	  var newList = instantiate(typeOf(list));
	  newList.name = list.name;
	  var nElements = list.length;
	  var i;
	  for(i = 0; i < nElements; i++) {
	    newList.push(list[indexedArray[i]]);
	  }
	  return newList;
	};


	ListOperators__ListOperators.concatWithoutRepetitions = function() { //?
	  var i;
	  var newList = arguments[0].clone();
	  for(i = 1; i < arguments.length; i++) {
	    var addList = arguments[i];
	    var nElements = addList.length;
	    for(var i = 0; i < nElements; i++) {
	      if(newList.indexOf(addList[i]) == -1) newList.push(addList[i]);
	    }
	  }
	  return newList.getImproved();
	};


	ListOperators__ListOperators.slidingWindowOnList = function(list, subListsLength, step, finalizationMode) {
	  finalizationMode = finalizationMode || 0;
	  var table = new Table();
	  var newList;
	  var nElements = list.length;
	  var nList;
	  var nRow;
	  var i;
	  var j;

	  step = Math.max(1, step);

	  switch(finalizationMode) {
	    case 0: //all sub-Lists same length, doesn't cover the List
	      for(i = 0; i < nElements; i += step) {
	        if(i + subListsLength <= nElements) {
	          newList = new List();
	          for(j = 0; j < subListsLength; j++) {
	            newList.push(list[i + j]);
	          }
	          table.push(newList.getImproved());
	        }
	      }
	      break;
	    case 1: //last sub-List catches the last elements, with lesser length
	      for(i = 0; i < nElements; i += step) {
	        newList = new List();
	        for(j = 0; j < Math.min(subListsLength, nElements - i); j++) {
	          newList.push(list[i + j]);
	        }
	        table.push(newList.getImproved());
	      }
	      break;
	    case 2: //all lists same length, last sub-list migth contain elements from the beginning of the List
	      for(i = 0; i < nElements; i += step) {
	        newList = new List();
	        for(j = 0; j < subListsLength; j++) {
	          newList.push(list[(i + j) % nElements]);
	        }
	        table.push(newList.getImproved());
	      }
	      break;
	  }

	  return table.getImproved();
	};

	ListOperators__ListOperators.getNewListForObjectType = function(object) {
	  var newList = new List();
	  newList[0] = object;
	  return instantiateWithSameType(newList.getImproved());
	};

	ListOperators__ListOperators.listsIntersect = function(list0, list1) {
	  var list = list0.length < list1.length ? list0 : list1;
	  var otherList = list0 == list ? list1 : list0;
	  for(var i = 0; list[i] != null; i++) {
	    if(otherList.indexOf(list[i]) != -1) return true;
	  }
	  return false;
	};

	/**
	 * returns the list of common elements between two lists
	 * @param  {List} list0
	 * @param  {List} list1
	 * @return {List}
	 * tags:
	 */
	ListOperators__ListOperators.getCommonElements = function(list0, list1) {
	  var nums = list0.type == 'NumberList' && list1.type == 'NumberList';
	  var strs = list0.type == 'StringList' && list1.type == 'StringList';
	  var newList = nums ? new NumberList() : (strs ? new StringList() : new List());

	  var list = list0.length < list1.length ? list0 : list1;
	  var otherList = list0 == list ? list1 : list0;

	  for(var i = 0; list[i] != null; i++) {
	    if(otherList.indexOf(list[i]) != -1) newList.push(list[i]);
	  }
	  if(nums || strs) return newList;
	  return newList.getImproved();
	};




	/**
	 * creates a List that contains the union of two List (removing repetitions)
	 * @param  {List} list A
	 * @param  {List} list B
	 *
	 * @return {List} the union of both NumberLists
	 * tags:
	 */
	ListOperators__ListOperators.unionLists = function(x, y) {
	  // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
	  var result;
	  if(x.type != x.type || (x.type != "StringList" && x.type != "NumberList"))
	  {
	    // To-do: call generic method here (not yet implemented)
	    //c.l( "ListOperators.unionLists for type '" + x.type + "' or '" + y.type + "' not yet implemented" );
	    return x.concat(y).getWithoutRepetitions();
	    return null;
	  }
	  else
	  {
	    var obj = {};
	    for(var i = x.length - 1; i >= 0; --i)
	      obj[x[i]] = x[i];
	    for(var i = y.length - 1; i >= 0; --i)
	      obj[y[i]] = y[i];
	    result = x.type == "StringList" ? new StringList() : new NumberList();
	    for(var k in obj) {
	      if(obj.hasOwnProperty(k)) // <-- optional
	        result.push(obj[k]);
	    }
	  }
	  return result;
	};

	/**
	 * creates a List that contains the intersection of two List (elements present in BOTH lists)
	 * @param  {List} list A
	 * @param  {List} list B
	 *
	 * @return {List} the intersection of both NumberLists
	 * tags:
	 */
	ListOperators__ListOperators.intersectLists = function(a, b) {
	  // Borrowed from here: http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
	  var result;
	  if(a.type != b.type || (a.type != "StringList" && a.type != "NumberList"))
	  {
	    result = ListOperators__ListOperators.getCommonElements(a, b);
	  }
	  else
	  {
	    result = a.type == "StringList" ? new StringList() : new NumberList();
	    a = a.slice();
	    b = b.slice();
	    while(a.length > 0 && b.length > 0)
	    {
	      if(a[0] < b[0]) {
	        a.shift();
	      }
	      else if(a[0] > b[0]) {
	        b.shift();
	      }
	      else /* they're equal */
	      {
	        result.push(a.shift());
	        b.shift();
	      }
	    }
	  }
	  return result;
	};





	/**
	 * calculates de entropy of a list, properties _mostRepresentedValue and _biggestProbability are added to the list
	 * @param  {List} list with repeated elements (actegorical list)
	 *
	 * @param {Object} valueFollowing if a value is provided, the property _P_valueFollowing will be added to the list, with proportion of that value in the list
	 * @return {Number}
	 * tags:ds
	 */
	ListOperators__ListOperators.getListEntropy = function(list, valueFollowing) {
	  if(list == null) return;
	  if(list.length < 2) {
	    if(list.length == 1) {
	      list._mostRepresentedValue = list[0];
	      list._biggestProbability = 1;
	      list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
	    }
	    return 0;
	  }

	  var table = ListOperators__ListOperators.countElementsRepetitionOnList(list, true);
	  c.l('    getListEntropy | table[0]', table[0]);
	  c.l('    getListEntropy | table[1]', table[1]);
	  list._mostRepresentedValue = table[0][0];
	  var N = list.length;
	  list._biggestProbability = table[1][0] / N;
	  if(table[0].length == 1) {
	    list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
	    return 0;
	  }
	  var entropy = 0;

	  var norm = Math.log(table[0].length);
	  table[1].forEach(function(val) {
	    entropy -= (val / N) * Math.log(val / N) / norm;
	  });

	  if(valueFollowing != null) {
	    var index = table[0].indexOf(valueFollowing);
	    list._P_valueFollowing = index == -1 ? 0 : table[1][index] / N;
	  }

	  return entropy;
	};


	/**
	 * measures how much a feature decreases entropy when segmenting by its values a supervised variable
	 * @param  {List} feature
	 * @param  {List} supervised
	 * @return {Number}
	 * tags:ds
	 */

	// ListOperators.getInformationGain = function(feature, supervised){
	// 	if(feature==null || supervised==null || feature.length!=supervised.length) return null;

	// 	var ig = ListOperators.getListEntropy(supervised);
	// 	var childrenObject = {};
	// 	var childrenLists = [];
	// 	var N = feature.length;

	// 	feature.forEach(function(element, i){
	// 		if(childrenObject[element]==null){
	// 			childrenObject[element]=new List();
	// 			childrenLists.push(childrenObject[element]);
	// 		}
	// 		childrenObject[element].push(supervised[i]);
	// 	});

	// 	childrenLists.forEach(function(cl){
	// 		ig -= (cl.length/N)*ListOperators.getListEntropy(cl);
	// 	});

	// 	return ig;
	// }


	/**
	 * measures how much a feature decreases entropy when segmenting by its values a supervised variable
	 * @param  {List} feature
	 * @param  {List} supervised
	 * @return {Number}
	 * tags:ds
	 */
	ListOperators__ListOperators.getInformationGain = function(feature, supervised) {
	  if(feature == null || supervised == null || feature.length != supervised.length) return null;

	  var ig = ListOperators__ListOperators.getListEntropy(supervised);
	  var childrenObject = {};
	  var childrenLists = [];
	  var N = feature.length;

	  feature.forEach(function(element, i) {
	    if(childrenObject[element] == null) {
	      childrenObject[element] = new List();
	      childrenLists.push(childrenObject[element]);
	    }
	    childrenObject[element].push(supervised[i]);
	  });

	  childrenLists.forEach(function(cl) {
	    ig -= (cl.length / N) * ListOperators__ListOperators.getListEntropy(cl);
	  });

	  return ig;
	};

	ListOperators__ListOperators.getInformationGainAnalysis = function(feature, supervised) {
	  if(feature == null || supervised == null || feature.length != supervised.length) return null;

	  var ig = ListOperators__ListOperators.getListEntropy(supervised);
	  var childrenObject = {};
	  var childrenLists = [];
	  var N = feature.length;
	  var entropy;
	  var sets = new List();

	  feature.forEach(function(element, i) {
	    if(childrenObject[element] == null) {
	      childrenObject[element] = new List();
	      childrenLists.push(childrenObject[element]);
	    }
	    childrenObject[element].push(supervised[i]);
	  });

	  childrenLists.forEach(function(cl) {
	    entropy = ListOperators__ListOperators.getListEntropy(cl);
	    ig -= (cl.length / N) * entropy;

	    sets.push({
	      children: cl,
	      entropy: entropy,
	      infoGain: ig
	    });
	  });

	  return sets;
	};


	/**
	 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
	 * @param  {List} list of elements to group
	 * @param  {Boolean} whether the results are to be sorted or not
	 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
	 *
	 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
	 * @return {Table}
	 * tags:dani
	 */
	ListOperators__ListOperators.groupElements = function(list, sortedByValue, mode, fillBlanks) {
	  if(!list)
	    return;
	  var result = ListOperators__ListOperators._groupElements_Base(list, null, sortedByValue, mode, fillBlanks);
	  return result;
	};


	/**
	 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
	 * @param  {List} list of elements to group
	 * @param  {String} name of the property to be used for grouping
	 * @param  {Boolean} wether the results are to be sorted or not
	 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
	 *
	 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
	 * @return {Table}
	 * tags:dani
	 */
	ListOperators__ListOperators.groupElementsByPropertyValue = function(list, propertyName, sortedByValue, mode, fillBlanks) {
	  if(!list)
	    return;
	  var result = ListOperators__ListOperators._groupElements_Base(list, propertyName, sortedByValue, mode, fillBlanks);
	  return result;
	};



	ListOperators__ListOperators._groupElements_Base = function(list, propertyName, sortedByValue, mode, fillBlanks) {
	  var result;

	  if(!list)
	    return;
	  if(mode == undefined)
	    mode = 0;
	  var resultOb = {};
	  var resultTable = new Table();
	  var pValue, item, minValue, maxValue;
	  for(var i = 0; i < list.length; i++) {
	    item = list[i];
	    pValue = propertyName == undefined ? item : item[propertyName];
	    if(resultOb[pValue] == undefined) {
	      resultOb[pValue] = new List();
	      resultOb[pValue].name = pValue;
	      resultOb[pValue].valProperty = pValue;
	      resultTable.push(resultOb[pValue]);
	    }
	    if(mode == 0)
	      resultOb[pValue].push(item);
	    else if(mode == 1)
	      resultOb[pValue].push(i);
	    // Update boundaries
	    if(minValue == undefined || pValue < minValue) {
	      minValue = pValue;
	    }
	    if(maxValue == undefined || pValue > maxValue) {
	      maxValue = pValue;
	    }
	  }

	  // Fill the blanks
	  if(fillBlanks) {
	    var numBlanks = 0;
	    for(var i = minValue; i < maxValue; i++) {
	      if(resultOb[i] == undefined) {
	        resultOb[i] = new List();
	        resultOb[i].name = i;
	        resultOb[i].valProperty = i;
	        resultTable.push(resultOb[i]);
	        numBlanks++;
	      }
	    }
	    //c.l("numBlanks: ", numBlanks)
	  }

	  // To-do: looks like getSortedByProperty is removing the valProperty from the objects
	  if(sortedByValue)
	    resultTable = resultTable.getSortedByProperty("name"); // "valProperty"

	  return resultTable;

	};

	/**
	 * @classdesc Create default lists
	 *
	 * @namespace
	 * @category basics
	 */
	function ListGenerators__ListGenerators() {}
	var ListGenerators__default = ListGenerators__ListGenerators;


	/**
	 * Generates a List made of several copies of same element (returned List is improved)
	 * @param {Object} nValues length of the List
	 * @param {Object} element object to be placed in all positions
	 * @return {List} generated List
	 * tags:generator
	 */
	ListGenerators__ListGenerators.createListWithSameElement = function(nValues, element) {
	  switch(typeOf(element)) {
	    case 'number':
	      var list = new NumberList();
	      break;
	    case 'List':
	      var list = new Table();
	      break;
	    case 'NumberList':
	      var list = new NumberTable();
	      break;
	    case 'Rectangle':
	      var list = new RectamgleList();
	      break;
	    case 'string':
	      var list = new StringList();
	      break;
	    case 'boolean':
	      var list = new List(); //TODO:update once BooleanList exists
	      break;
	    default:
	      var list = new List();
	  }

	  for(var i = 0; i < nValues; i++) {
	    list[i] = element;
	  }
	  return list;
	};

	/**
	 * Generates a List built froma seed element and a function that will be applied iteratively
	 * @param {Object} nValues length of the List
	 * @param {Object} firstElement first element
	 * @param {Object} dynamicFunction sequence generator function, elementN+1 =  dynamicFunction(elementN)
	 * @return {List} generated List
	 */
	ListGenerators__ListGenerators.createIterationSequence = function(nValues, firstElement, dynamicFunction) {
	  var list = ListGenerators__ListGenerators.createListWithSameElement(1, firstElement);
	  for(var i = 1; i < nValues; i++) {
	    list[i] = dynamicFunction(list[i - 1]);
	  }
	  return list;
	};

	function RectangleOperators() {}



	/**
	 *
	 * 0: quadrification
	 * 1: vertical
	 * 2: horizontal
	 * 3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
	 * 4: europe quadrigram
	 * 5: vertical strips quadrification
	 * 6: horizontal strips quadrification
	 */
	RectangleOperators.packingRectangles = function(weights, packingMode, rectangle, param) {
	  //TODO: return RectangleList instead of List
	  if(rectangle == null) rectangle = new Rectangle__default(0, 0, 1, 1);
	  packingMode = packingMode ? packingMode : 0;
	  switch(packingMode) {
	    //0: quadrification
	    //1: vertical
	    //2: horizontal
	    //3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
	    //4: europe quadrigram
	    //5:vertical strips
	    case 0:
	      return RectangleOperators.squarify(rectangle, weights);
	    case 1:
	      var minMax = weights.getMinMaxInterval();
	      if(minMax.min < 0) {
	        weights = weights.add(-minMax.min);
	        minMax = new Interval__default(0, minMax.max - minMax.min);
	      }

	      var sum = weights.getSum();

	      var rectangleList = new List__default(); //RectangleList();
	      var dY = rectangle.y;
	      var h;
	      var vFactor = rectangle.height / sum;
	      var i;
	      for(i = 0; weights[i] != null; i++) {
	        h = vFactor * weights[i];
	        rectangleList.push(new Rectangle__default(rectangle.x, dY, rectangle.width, h));
	        dY += h;
	      }
	      return rectangleList;
	    case 2:
	      minMax = weights.getMinMaxInterval();
	      if(minMax.min < 0) {
	        weights = weights.add(-minMax.min);
	        minMax = new Interval__default(0, minMax.max - minMax.min);
	      }
	      sum = weights.getSum();

	      rectangleList = new List__default(); //RectangleList();
	      var dX = rectangle.x;
	      var w;
	      var hFactor = rectangle.width / sum;
	      for(i = 0; weights[i] != null; i++) {
	        w = hFactor * weights[i];
	        rectangleList.push(new Rectangle__default(dX, rectangle.y, w, rectangle.height));
	        dX += w;
	      }
	      return rectangleList;
	      //var newNumberList:NumberList = OperatorsNumberList.accumulationNumberList(OperatorsNumberList.normalizeNumberListToInterval(weights, new Interval(weights.min, 1)));
	    case 3:
	      if(weights.length < 6) {

	      } else if(weights.length == 6) {
	        var rAfrica = new Rectangle__default(0.44, 0.36, 0.16, 0.45);
	        var rAsia = new Rectangle__default(0.6, 0.15, 0.3, 0.3);
	        var rAustralasia = new Rectangle__default(0.72, 0.45, 0.28, 0.32);
	        var rEurope = new Rectangle__default(0.38, 0.04, 0.22, 0.32);

	        var pivotEuroafrasia = new Point(0.6, 0.36);
	        rAfrica = expandRectangle(rAfrica, Math.sqrt(weights[0]), pivotEuroafrasia);
	        rAsia = expandRectangle(rAsia, Math.sqrt(weights[1]), pivotEuroafrasia);
	        rEurope = expandRectangle(rEurope, Math.sqrt(weights[3]), pivotEuroafrasia);

	        rAustralasia.x = rAsia.x + rAsia.width * 0.5;
	        rAustralasia.y = rAsia.bottom;
	        var pivotAustralasia = new Point(rAustralasia.x + rAustralasia.width * 0.3, rAsia.bottom);
	        rAustralasia = expandRectangle(rAustralasia, Math.sqrt(weights[2]), pivotAustralasia);
	        rAustralasia.y += rAustralasia.height * 0.2;

	        var pivotAmericas = new Point(0.26, 0.36 + Math.max(rAfrica.height * 0.3, rEurope.height * 0.2));

	        var rNorthAmerica = new Rectangle__default(0.1, pivotAmericas.y - 0.4, 0.2, 0.4);
	        var rSouthAmerica = new Rectangle__default(0.22, pivotAmericas.y, 0.16, 0.5);

	        rNorthAmerica = expandRectangle(rNorthAmerica, Math.sqrt(weights[4]), pivotAmericas);
	        rSouthAmerica = expandRectangle(rSouthAmerica, Math.sqrt(weights[5]), pivotAmericas);

	        var separation = Math.max(rEurope.width, rAfrica.width, rSouthAmerica.right - pivotAmericas.x, rNorthAmerica.right - pivotAmericas.x) * 0.2;
	        var delta = Math.min(rEurope.x, rAfrica.x) - Math.max(rNorthAmerica.right, rSouthAmerica.right) - separation;

	        rSouthAmerica.x += delta;
	        rNorthAmerica.x += delta;

	        return new List__default(rAfrica, rAsia, rAustralasia, rEurope, rNorthAmerica, rSouthAmerica); //RectangleList

	      } else {

	      }
	    case 4:
	      return europeQuadrigram(weights);
	    case 5:
	      param = param || 0;
	      if(param == 0) {
	        var nLists = Math.round(Math.sqrt(weights.length));
	      } else {
	        nLists = Math.round(weights.length / param);
	      }
	      var nRows = Math.ceil(weights.length / nLists);

	      var nMissing = nLists * nRows - weights.length;

	      var average = weights.getAverage();
	      var weigthsCompleted = ListOperators__default.concat(weights, ListGenerators__default.createListWithSameElement(nMissing, average));
	      var table = ListOperators__default.slidingWindowOnList(weigthsCompleted, nRows, nRows, 0);
	      var sumList = table.getSums();
	      var rectangleColumns = this.packingRectangles(sumList, 2, rectangle);

	      rectangleList = List__default(); //new RectangleList();

	      for(i = 0; i < nLists; i++) {
	        rectangleList = ListOperators__default.concat(rectangleList, this.packingRectangles(table[i], 1, rectangleColumns[i]));
	      }

	      return rectangleList;
	    case 6: //horizontal strips
	  }
	  return null;
	};

	RectangleOperators.quadrification = RectangleOperators.squarify; //old name

	/**
	 * Squarified algorithm as described in (http://www.win.tue.nl/~vanwijk/stm.pdf)
	 * @param {Rectangle} bounds Rectangle
	 * @param {NumberList} list of weights
	 *
	 * @param {Boolean} weights are normalized
	 * @param {Boolean} weights are sorted
	 * @return {List} a list of Rectangles
	 * tags:
	 */
	RectangleOperators.squarify = function(frame, weights, isNormalizedWeights, isSortedWeights) { //, funcionEvaluacionnWeights:Function=null):Array{
	  if(weights == null) return;
	  if(weights.length == 0) return new RectangleList();
	  if(weights.length == 1) return new RectangleList(frame);
	  isNormalizedWeights = isNormalizedWeights ? isNormalizedWeights : false;
	  isSortedWeights = isSortedWeights ? isSortedWeights : false;
	  var newWeightList;

	  if(isNormalizedWeights) {
	    newWeightList = weights; // new NumberList(arregloPesos);
	  } else {
	    newWeightList = weights.getNormalizedToSum();
	  }

	  if(!isSortedWeights) {
	    var newPositions = newWeightList.getSortIndexes(); // ListOperators.sortListByNumberList();// newWeightList.sortNumericIndexedDescending();
	    newWeightList = ListOperators__default.sortListByNumberList(newWeightList, newWeightList);
	  }
	  //trace("RectangleOperators.squarified | ", newWeightList);
	  var area = frame.width * frame.height;
	  var rectangleList = new RectangleList();
	  var freeRectangle = frame.clone();
	  var subWeightList;
	  var subRectangleList = new List__default(); //RectangleList();//
	  var prevSubRectangleList;
	  var proportion;
	  var worstProportion;
	  var index = 0;
	  var subArea;
	  var freeSubRectangle = new Rectangle__default();
	  var nWeights = weights.length;
	  var lastRectangle;
	  var isColumn;
	  if(nWeights > 2) {
	    var i, j, k;
	    var sum;
	    for(i = index; i < nWeights; i++) {
	      proportion = Number.MAX_VALUE;
	      if(newWeightList[i] == 0) {
	        rectangleList.push(new Rectangle__default(freeSubRectangle.x, freeSubRectangle.y, 0, 0));
	      } else {
	        for(j = 1; j < nWeights; j++) {
	          subWeightList = newWeightList.slice(i, i + j); //NumberList.fromArray(newWeightList.slice(i, i+j));//
	          prevSubRectangleList = subRectangleList.slice(); //.clone();
	          sum = subWeightList.getSum();
	          subArea = sum * area;
	          freeSubRectangle.x = freeRectangle.x;
	          freeSubRectangle.y = freeRectangle.y;
	          if(freeRectangle.width > freeRectangle.height) { //column
	            freeSubRectangle.width = subArea / freeRectangle.height;
	            freeSubRectangle.height = freeRectangle.height;
	            column = true;
	          } else { //fila
	            freeSubRectangle.width = freeRectangle.width;
	            freeSubRectangle.height = subArea / freeRectangle.width;
	            column = false;
	          }
	          //subWeightList = subWeightList.getNormalizedToSum(1,sum);
	          // subWeightList.forEach(function(val, k){
	          // 	subWeightList[k]/=sum;
	          // });

	          subRectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, sum);
	          worstProportion = subRectangleList.highestRatio; // RectangleOperators._getHighestRatio(subRectangleList);//
	          if(proportion <= worstProportion) {
	            break;
	          } else {
	            proportion = worstProportion;
	          }
	        }

	        if(prevSubRectangleList.length == 0) {
	          rectangleList.push(new Rectangle__default(freeRectangle.x, freeRectangle.y, freeRectangle.width, freeRectangle.height)); //freeRectangle.clone());
	          if(rectangleList.length == nWeights) {
	            if(!isSortedWeights) {
	              var newRectangleList = new List__default(); //RectangleList();
	              for(i = 0; rectangleList[i] != null; i++) {
	                newRectangleList[newPositions[i]] = rectangleList[i];
	              }
	              return newRectangleList;
	            }
	            return rectangleList;
	          }
	          index++;
	        } else {
	          rectangleList = rectangleList.concat(prevSubRectangleList);
	          if(rectangleList.length == nWeights) {
	            if(!isSortedWeights) {
	              newRectangleList = new List__default();
	              for(i = 0; rectangleList[i] != null; i++) {
	                newRectangleList[newPositions[i]] = rectangleList[i];
	              }
	              return newRectangleList;
	            }
	            return rectangleList;
	          }
	          index += prevSubRectangleList.length;
	          lastRectangle = prevSubRectangleList[prevSubRectangleList.length - 1];
	          if(freeRectangle.width > freeRectangle.height) {
	            freeRectangle.x = (lastRectangle.width + lastRectangle.x);
	            freeRectangle.width -= lastRectangle.width;
	          } else {
	            freeRectangle.y = (lastRectangle.height + lastRectangle.y);
	            freeRectangle.height -= lastRectangle.height;
	          }
	        }
	        i = index - 1;
	      }
	    }
	  } else if(nWeights == 2) {
	    subWeightList = newWeightList.slice(); //.clone();
	    freeSubRectangle = frame.clone();
	    rectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, subWeightList.getSum());
	  } else {
	    rectangleList[0] = new Rectangle__default(frame.x, frame.y, frame.width, frame.height); //frame.clone();
	  }


	  if(!isSortedWeights) {
	    newRectangleList = new List__default(); //RectangleList();//
	    for(i = 0; rectangleList[i] != null; i++) {
	      newRectangleList[newPositions[i]] = rectangleList[i];
	    }
	    return newRectangleList;
	  }

	  return rectangleList;
	};

	/**
	 * partitionRectangle
	 * @param {Rectangle} bounds Rectangle
	 * @param {NumberList} normalizedWeight List
	 *
	 * @return {List} a list of Rectangles
	 */
	RectangleOperators.partitionRectangle = function(rectangle, normalizedWeightList, sum) {
	  var area = rectangle.width * rectangle.height;
	  var rectangleList = new List__default(); //RectangleList();
	  var freeRectangle = new Rectangle__default(rectangle.x, rectangle.y, rectangle.width, rectangle.height); //rectangle.clone();
	  //trace("??", freeRectangle);
	  var areai;
	  var i;
	  var rect;
	  var highestRatio = 1;
	  for(i = 0; i < normalizedWeightList.length; i++) {
	    areai = normalizedWeightList[i] * area / sum;
	    if(rectangle.width > rectangle.height) {
	      rect = new Rectangle__default(freeRectangle.x, freeRectangle.y, areai / freeRectangle.height, freeRectangle.height);
	      rectangleList.push(rect);
	      freeRectangle.x += areai / freeRectangle.height;
	      //rect.ratio = rect.width/rect.height;
	    } else {
	      rect = new Rectangle__default(freeRectangle.x, freeRectangle.y, freeRectangle.width, areai / freeRectangle.width);
	      rectangleList.push(rect);
	      freeRectangle.y += areai / freeRectangle.width;
	      //rect.ratio = rect.height/rect.width;
	    }
	    rect.ratio = Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height);
	    highestRatio = Math.max(highestRatio, rect.ratio);
	  }

	  rectangleList.highestRatio = highestRatio;

	  return rectangleList;
	};

	/**
	 * returns the highest ratio from a list of Rectangles
	 * @param {List} rectangleList a Rectangle List
	 *
	 * @return {Number} highestRatio
	 */
	RectangleOperators._getHighestRatio = function(rectangleList) {
	  var highestRatio = 1;
	  var rectangle;
	  var i;
	  for(i = 0; i < rectangleList.length; i++) {
	    rectangle = rectangleList[i];
	    highestRatio = Math.max(highestRatio, rectangle.getRatio());
	  }
	  return highestRatio;
	};

	exports.RectangleOperators = RectangleOperators;

	// jshint unused:false

	// This file re-exports everything that is in the public
	// interface of the framework.

	// dataStructures/

});
//# sourceMappingURL=/Users/yannick/Bocoup/Projects/moebio/moebio_framework/dist/moebio_framework_concat.js.map