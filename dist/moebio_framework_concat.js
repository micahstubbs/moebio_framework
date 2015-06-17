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
        newList = NumberTable.fromArray(this, false);
        break;
      case "Point":
        newList = Polygon__default.fromArray(this, false);
        break;
      case "Polygon":
        newList = PolygonList.fromArray(this, false);
        break;
      case "Node":
        newList = NodeList__default.fromArray(this, false);
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
        return NodeList__default.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "DateList") {
        return DateList.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "Table") {
        return Table__default.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "NumberTable") {
        return NumberTable.fromArray(this._concat.apply(this, arguments), false);
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
        return NodeList__default.fromArray(this._splice.apply(this, arguments));
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
      arguments[i] = String(arguments[i]);
    }
    var array = List__default.apply(this, arguments);
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
    var sufixIsStringList = typeOf(sufix) == "StringList";
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

  NodeList__NodeList.prototype = new List__default();
  NodeList__NodeList.prototype.constructor = NodeList__NodeList;

  /**
   * @classdesc A sub-class of {@link List} for storing {@link Node|Nodes}.
   *
   * @description create a new NodeList.
   * @constructor
   * @category networks
   */
  function NodeList__NodeList() {
    //var array=List.apply(this, arguments);

    //if(arguments && arguments.length>0) {c.l('UEUEUEUE, arguments.length', arguments.length); var a; a.push(0)};

    var array = NodeList__NodeList.fromArray([]);

    if(arguments && arguments.length > 0) {
      var args = Array.prototype.slice.call(arguments);

      args.forEach(function(arg) {
        array.addNode(arg);
      });
    }

    return array;
  }

  var NodeList__default = NodeList__NodeList;

  /**
   * Creates NodeList from raw Array.
   *
   * @param {Node[] | String[]} array Array to convert to
   * @param {Boolean} forceToNode If true, and input array is an array of Strings,
   * convert strings to Node instances with the strings used as the Node's id and name.
   * @return {NodeList}
   */
  NodeList__NodeList.fromArray = function(array, forceToNode) {
    forceToNode = forceToNode == null ? false : forceToNode;

    var result = List__default.fromArray(array);

    if(forceToNode) {
      for(var i = 0; i < result.length; i++) {
        result[i] = typeOf(result[i]) == "Node" ? result[i] : (new Node(String(result[i]), String(result[i])));
      }
    }

    // TODO: Remove duplicate line?
    var result = List__default.fromArray(array);
    result.type = "NodeList";
    result.ids = {};
    // TODO: Fix
    Array(); //????

    //assign methods to array:
    result.deleteNodes = NodeList__NodeList.prototype.deleteNodes;
    result.addNode = NodeList__NodeList.prototype.addNode;
    result.addNodes = NodeList__NodeList.prototype.addNodes;
    result.removeNode = NodeList__NodeList.prototype.removeNode;
    result.removeNodeAtIndex = NodeList__NodeList.prototype.removeNodeAtIndex;
    result.getNodeByName = NodeList__NodeList.prototype.getNodeByName;
    result.getNodeById = NodeList__NodeList.prototype.getNodeById;
    result.getNodesByIds = NodeList__NodeList.prototype.getNodesByIds;
    result.getNewId = NodeList__NodeList.prototype.getNewId;
    result.normalizeWeights = NodeList__NodeList.prototype.normalizeWeights;
    result.getWeights = NodeList__NodeList.prototype.getWeights;
    result.getIds = NodeList__NodeList.prototype.getIds;
    result.getDegrees = NodeList__NodeList.prototype.getDegrees;
    result.getPolygon = NodeList__NodeList.prototype.getPolygon;

    result._push = Array.prototype.push;
    result.push = function(a) {
      c.l('with nodeList, use addNode instead of push');
      var k;
      k.push(a);
    };

    //overriden
    result.getWithoutRepetitions = NodeList__NodeList.prototype.getWithoutRepetitions;
    result.clone = NodeList__NodeList.prototype.clone;

    return result;
  };

  /**
   * Clears NodeList.
   *
   */
  NodeList__NodeList.prototype.removeNodes = function() {
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
  NodeList__NodeList.prototype.addNode = function(node) {
    this.ids[node.id] = node;
    this._push(node);
  };

  /**
   * Adds all Nodes from another NodeList to this NodeList.
   *
   * @param {NodeList} nodes Nodes to add.
   */
  NodeList__NodeList.prototype.addNodes = function(nodes) {
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
  NodeList__NodeList.prototype.removeNode = function(node) {
    this.ids[node.id] = null;
    this.removeElement(node);
  };

  /**
   * Removes a Node at a particular index of the NodeList
   *
   * @param {Number} index The index of the Node to remove.
   */
  NodeList__NodeList.prototype.removeNodeAtIndex = function(index) {
    this.ids[this[index].id] = null;
    this.splice(index, 1);
  };

  /**
   * Normalizes all weights associated with Nodes in NodeList
   * to a value between 0 and 1. Works under the assumption that weights are >= 0.
   */
  NodeList__NodeList.prototype.normalizeWeights = function() {
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
  NodeList__NodeList.prototype.getNodeByName = function(name) {
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
  NodeList__NodeList.prototype.getNodeById = function(id) {
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
  NodeList__NodeList.prototype.getNodesByIds = function(ids) {
    newNodelist = new NodeList__NodeList();
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
  NodeList__NodeList.prototype.getWeights = function() {
    var numberList = new NumberList();
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
  NodeList__NodeList.prototype.getIds = function() {
    var list = new StringList();
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
  NodeList__NodeList.prototype.getDegrees = function() {
    var numberList = new NumberList();
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
  NodeList__NodeList.prototype.getPolygon = function() {
    var polygon = new Polygon();
    for(var i = 0; this[i] != null; i++) {
      polygon[i] = new Point(this[i].x + cX, this[i].y + cY);
    }
    return polygon;
  };

  NodeList__NodeList.prototype.getNewId = function() {
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
  NodeList__NodeList.prototype.clone = function() {
    var newNodeList = new NodeList__NodeList();
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
  NodeList__NodeList.prototype.getWithoutRepetitions = function() {
    newList = new NodeList__NodeList();
    newList.name = this.name;
    for(i = 0; this[i] != null; i++) {
      if(newList.getNodeById(this[i].id) == null) newList.addNode(this[i]);
    }
    return newList;
  };

  RelationList.prototype = new NodeList__default();
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
    var array = NodeList__default.apply(this, arguments);
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
    var result = NodeList__default.fromArray(array);
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
    var relatedNodes = new NodeList__default();
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

  NumberTable.prototype = new Table__default();
  NumberTable.prototype.constructor = NumberTable;

  /**
   * @classdesc {@link Table} to store numbers.
   *
   * @constructor
   * @description Creates a new NumberTable.
   * @category numbers
   */
  function NumberTable() {
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
    array = NumberTable.fromArray(array);
    return array;
  }


  NumberTable.fromArray = function(array) {
    var result = Table__default.fromArray(array);
    result.type = "NumberTable";

    result.getNumberListsNormalized = NumberTable.prototype.getNumberListsNormalized;
    result.getNormalizedToMax = NumberTable.prototype.getNormalizedToMax;
    result.getNumberListsNormalizedToMax = NumberTable.prototype.getNumberListsNormalizedToMax;
    result.getNumberListsNormalizedToSum = NumberTable.prototype.getNumberListsNormalizedToSum;
    result.getSums = NumberTable.prototype.getSums;
    result.getRowsSums = NumberTable.prototype.getRowsSums;
    result.getAverages = NumberTable.prototype.getAverages;
    result.getRowsAverages = NumberTable.prototype.getRowsAverages;
    result.factor = NumberTable.prototype.factor;
    result.add = NumberTable.prototype.add;
    result.getMax = NumberTable.prototype.getMax;
    result.getMinMaxInterval = NumberTable.prototype.getMinMaxInterval;

    return result;
  };

  NumberTable.prototype.getNumberListsNormalized = function(factor) {
    factor = factor == null ? 1 : factor;

    var newTable = new NumberTable();
    var i;
    for(i = 0; this[i] != null; i++) {
      numberList = this[i];
      newTable[i] = numberList.getNormalized(factor);
    }
    newTable.name = this.name;
    return newTable;
  };

  NumberTable.prototype.getNormalizedToMax = function(factor) {
    factor = factor == null ? 1 : factor;

    var newTable = new NumberTable();
    var i;
    var antimax = factor / this.getMax();
    for(i = 0; this[i] != null; i++) {
      newTable[i] = this[i].factor(antimax);
    }
    newTable.name = this.name;
    return newTable;
  };

  NumberTable.prototype.getNumberListsNormalizedToMax = function(factorValue) {
    var newTable = new NumberTable();
    for(var i = 0; this[i] != null; i++) {
      numberList = this[i];
      newTable[i] = numberList.getNormalizedToMax(factorValue);
    }
    newTable.name = this.name;
    return newTable;
  };

  NumberTable.prototype.getNumberListsNormalizedToSum = function() {
    var newTable = new NumberTable();
    for(var i = 0; this[i] != null; i++) {
      numberList = this[i];
      newTable[i] = numberList.getNormalizedToSum();
    }
    newTable.name = this.name;
    return newTable;
  };


  NumberTable.prototype.getMax = function() {
    if(this.length == 0) return null;

    var max = this[0].getMax();
    var i;

    for(i = 1; this[i] != null; i++) {
      max = Math.max(this[i].getMax(), max);
    }

    return max;
  };

  NumberTable.prototype.getMinMaxInterval = function() {
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
  NumberTable.prototype.getSums = function() {
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
  NumberTable.prototype.getRowsSums = function() {
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

  NumberTable.prototype.getAverages = function() {
    var numberList = new NumberList__default();
    for(var i = 0; this[i] != null; i++) {
      numberList[i] = this[i].getAverage();
    }
    return numberList;
  };

  NumberTable.prototype.getRowsAverages = function() {
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

  NumberTable.prototype.factor = function(value) {
    var newTable = new NumberTable();
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

  NumberTable.prototype.add = function(value) {
    var newTable = new NumberTable();

    for(var i = 0; this[i] != null; i++) {
      numberList = this[i];
      newTable[i] = numberList.add(value);
    }

    newTable.name = this.name;
    return newTable;
  };

  exports.NumberTable = NumberTable;

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

  Node__Node.prototype = new DataModel();
  Node__Node.prototype.constructor = Node__Node;

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
  function Node__Node(id, name) {
    this.id = id == null ? '' : id;
    this.name = name != null ? name : '';
    this.type = "Node";

    this.nodeType;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.nodeList = new NodeList__default();
    this.relationList = new RelationList();

    this.toNodeList = new NodeList__default();
    this.toRelationList = new RelationList();

    this.fromNodeList = new NodeList__default();
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
  var Node__default = Node__Node;

  /**
   * Removes all Relations and connected Nodes from
   * the current Node.
   */
  Node__Node.prototype.cleanRelations = function() {
    this.nodeList = new NodeList__default();
    this.relationList = new RelationList();

    this.toNodeList = new NodeList__default();
    this.toRelationList = new RelationList();

    this.fromNodeList = new NodeList__default();
    this.fromRelationList = new RelationList();
  };

  //TODO: complete with all properties
  Node__Node.prototype.destroy = function() {
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
  Node__Node.prototype.getDegree = function() {
    return this.relationList.length;
  };

  //treeProperties:


  /**
   * Returns the parent Node of this Node if it is part of a {@link Tree}.
   *
   * @return {Node} Parent Node of this Node.
   */
  Node__Node.prototype.getParent = function() {
    return this.parent;
  };

  /**
   * Returns the leaves under a node in a Tree,
   *
   * <strong>Warning:</strong> If this Node is part of a Network that is not a tree, this method could run an infinite loop.
   * @return {NodeList} Leaf Nodes of this Node.
   * tags:
   */
  Node__Node.prototype.getLeaves = function() {
      var leaves = new NodeList__default();
      var addLeaves = function(node) {
        if(node.toNodeList.length == 0) {
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
  Node__Node.prototype.loadImage = function(urlImage) {
    Loader.loadImage(urlImage, function(e) {
      this.image = e.result;
    }, this);
  };


  /**
   * Makes a copy of this Node.
   *
   * @return {Node} New Node that is a copy of this Node.
   */
  Node__Node.prototype.clone = function() {
    var newNode = new Node__Node(this.id, this.name);

    newNode.x = this.x;
    newNode.y = this.y;
    newNode.z = this.z;

    newNode.nodeType = this.nodeType;

    newNode.weight = this.weight;
    newNode.descentWeight = this.descentWeight;

    return newNode;
  };

  /**
   * @classdesc Provides a set of tools that work with {@link Country|Countries}.
   *
   * @namespace
   * @category geo
   */
  function CountryOperators() {}


  CountryOperators.getSimplifiedName = function(name) {
    return name.replace(/[\.\- ,\']/g, "").toLowerCase();
  };
  CountryOperators.getSimplifiedNames = function(names) {
    var simplifiedNames = new StringList();
    var name;
    for(var i = 0; names[i] != null; i++) {
      name = this.getSimplifiedName(names[i]);
      if(name != "") simplifiedNames.pushIfUnique(name);
    }
    return simplifiedNames;
  };

  Country.prototype = new Node__default();
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
    Node__default.apply(this, [id, name]);
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

  /**
   * @classdesc Provides a set of tools that work with Polygons
   *
   * @namespace
   * @category geometry
   */
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
    var h = new Polygon();
    if(returnIndexes) var indexes = new NumberList();

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

      return NumberList.fromArray(indexes.getSubList(new Interval(0, k - 2)));
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

    return Polygon.fromArray(h.getSubList(new Interval(0, k - 2)));
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

    var node0, node1, nodeList = new Polygon();

    polygon.forEach(function(point, i) {
      node = new Node('point_' + i, 'point_' + i);
      node.weight = 1;
      node.barycenter = point;
      node.point = point;
      node.polygon = new Polygon(point);
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
      parent.barycenter = new Point((node0.weight * node0.barycenter.x + node1.weight * node1.barycenter.x) / tW, (node0.weight * node0.barycenter.y + node1.weight * node1.barycenter.y) / tW);
      //c.l('parent.barycenter.x', parent.barycenter.x, parent.barycenter.y);
      tree.addNode(parent);
      tree._newCreateRelation(parent, node0);
      tree._newCreateRelation(parent, node1);
      return parent;
    };

    while(nodeList.length > 1) {
      closestPair = PolygonOperators._findClosestNodes(nodeList);
      node0 = nodeList[closestPair[0]];
      node1 = nodeList[closestPair[1]];
      parent = buildNodeFromPair(node0, node1);
      parent.distance = closestPair.distance;
      c.l('distance:', parent.distance);
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
    var newPolygon = new Polygon();
    var barycenter = polygon.getBarycenter();

    for(var i = 0; polygon[i] != null; i++) {
      newPolygon[i] = polygon[i].expandFromPoint(barycenter, factor);
    }

    return newPolygon;
  };

  PolygonOperators.expandInAngles = function(polygon, amount) { //TODO: test if it works with convex polygons
    var newPolygon = new Polygon();
    var p0 = polygon[polygon.length - 1];
    var p1 = polygon[0];
    var p2 = polygon[1];

    var a0;
    var a1;
    var sign;

    var a = 0.5 * Math.atan2(p1.y - p2.y, p1.x - p2.x) + 0.5 * Math.atan2(p1.y - p0.y, p1.x - p0.x);
    var globalSign = polygon.containsPoint(new Point(p1.x + Math.floor(amount) * Math.cos(a), p1.y + Math.floor(amount) * Math.sin(a))) ? -1 : 1;


    for(var i = 0; polygon[i] != null; i++) {
      p0 = polygon[(i - 1 + polygon.length) % polygon.length];
      p1 = polygon[i];
      p2 = polygon[(i + 1) % polygon.length];
      a0 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
      a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      sign = Math.abs(a1 - a0) < Math.PI ? -1 : 1;
      a = 0.5 * a0 + 0.5 * a1;
      //sign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
      newPolygon[i] = new Point(p1.x + globalSign * sign * amount * Math.cos(a), p1.y + globalSign * sign * amount * Math.sin(a));
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
      line = GeometryOperators.lineFromTwoPoints(p0, p2);
      if(GeometryOperators.distancePointToLine(p1, line) < margin) {
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
    context.fillStyle = 'black';
    context.fillRect(0, 0, frame.width, frame.height);
    if(border != null) {
      context.strokeStyle = 'black';
      context.lineWidth = border;
    }
    context.fillStyle = 'white';
    context.beginPath();
    Draw.drawBezierPolygon(context, polygon, -frame.x, -frame.y);
    context.fill();
    if(border != null) context.stroke();
    var data = context.getImageData(point.x - frame.x, point.y - frame.y, 1, 1).data;
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
    context.fillStyle = 'black';
    context.fillRect(0, 0, frame.width, frame.height);
    context.fillStyle = 'white';
    context.beginPath();
    Draw.drawBezierPolygon(context, polygon, -frame.x, -frame.y);
    context.fill();

    var center;
    var testPoint;
    var angle;
    var r;
    var rMax = 0;
    var bestCenter;


    for(var i = 0; i < nAttempts; i++) {
      center = frame.getRandomPoint();
      for(angle = 0; angle += 0.1; angle <= TwoPi) {
        r = angle;
        var data = context.getImageData(center.x + r * Math.cos(angle) - frame.x, center.y + r * Math.sin(angle) - frame.y, 1, 1).data;
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
    var pC = new Point();
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
    var controlPoints = new Polygon();
    for(var i = 0; polygon[i] != null; i++) {
      if(i > 0) controlPoints.push(new Point(polygon[i].x - intensities[i] * Math.cos(angles[i]), polygon[i].y - intensities[i] * Math.sin(angles[i])));
      if(i < polygon.length - 1) controlPoints.push(new Point(polygon[i].x + intensities[i] * Math.cos(angles[i]), polygon[i].y + intensities[i] * Math.sin(angles[i])));
    }
    return controlPoints;
  };


  PolygonOperators.placePointsInsidePolygon = function(polygon, nPoints, mode) {
    var points = new Polygon();
    var frame = polygon.getFrame();
    mode = mode || 0;
    switch(mode) {
      case 0: //random simple
        var p;
        while(points.length < nPoints) {
          p = new Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
          if(PolygonOperators.polygonContainsPoint(polygon, p)) points.push(p);
        }
        return points;
        break;
    }
  };

  PolygonOperators.placePointsInsideBezierPolygon = function(polygon, nPoints, mode, border) {
    var points = new Polygon();
    var frame = polygon.getFrame();
    mode = mode || 0;
    switch(mode) {
      case 0: //random simple
        var p;
        var nAttempts = 0;
        while(points.length < nPoints && nAttempts < 1000) {
          p = new Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
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

  CountryList.prototype = new NodeList__default();
  CountryList.prototype.constructor = CountryList;

  /**
   * @classdesc A {@link List} structure for storing {@link Country|Countries}.
   *
   * @description Creates a new CountryList instance.
   * @constructor
   * @category geo
   */
  function CountryList() {
    var array = NodeList__default.apply(this, arguments);
    //
    array.name = "";
    //assign methods to array:
    array = CountryList.fromArray(array);
    //
    return array;
  }


  CountryList.fromArray = function(array) {
    var result = NodeList__default.fromArray(array);
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

  // jshint unused:false

  // This file re-exports everything that is in the public
  // interface of the framework.

  // dataStructures/

});