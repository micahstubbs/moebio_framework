import StringOperators from "src/operators/strings/StringOperators";
import DataModel from "src/dataStructures/DataModel";
import NumberList from "src/dataStructures/numeric/NumberList";
import StringList from "src/dataStructures/strings/StringList";
import DateList from "src/dataStructures/dates/DateList";
import NodeList from "src/dataStructures/structures/lists/NodeList";
import RelationList from "src/dataStructures/structures/lists/RelationList";
import Polygon from "src/dataStructures/geometry/Polygon";
import PolygonList from "src/dataStructures/geometry/PolygonList";
import Table from "src/dataStructures/lists/Table";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import Interval from "src/dataStructures/numeric/Interval";
import ListOperators from "src/operators/lists/ListOperators";
import { instantiateWithSameType, typeOf } from "src/tools/utils/code/ClassUtils";

List.prototype = new DataModel();
List.prototype.constructor = List;

 /**
  * @classdesc List is an Array with a type property.
  * Lists have a number of methods to assist with working with
  * them. There are also a number of
  *
  * @description Creates a new List.
  * @param {Number|String|Object} arguments Comma separated values to add to List
  * @constructor
  * @category basics
  */
function List() {
  DataModel.apply(this);
  var array = [];
  var i;
  for(i = 0; i < arguments.length; i++) {
    array.push(arguments[i]);
  }
  array = List.fromArray(array);
  //
  return array;
}
export default List;


/**
 * Creates a new List from a raw array of values
 *
 * @param {Number[]|String[]|Object[]} array Array of values.
 * @return {List} New List.
 */
List.fromArray = function(array) {
  //TODO: clear some of these method declarations
  array.type = "List";
  array.name = array.name || "";

  array.setType = List.prototype.setType;
  array.setArray = List.prototype.setArray;
  array._constructor = List;

  array.getImproved = List.prototype.getImproved;
  array.sameElements = List.prototype.sameElements;
  array.getLength = List.prototype.getLength;
  array.getTypeOfElements = List.prototype.getTypeOfElements; //TODO: redundant?
  array.getTypes = List.prototype.getTypes;
  array.getType = List.prototype.getType;
  array.getLengths = List.prototype.getLengths;
  array.getWithoutRepetitions = List.prototype.getWithoutRepetitions;
  array.getElementsRepetitionCount = List.prototype.getElementsRepetitionCount;
  array.allElementsEqual = List.prototype.allElementsEqual;
  array.countElement = List.prototype.countElement;
  array.countOccurrences = List.prototype.countOccurrences;
  array.getMostRepeatedElement = List.prototype.getMostRepeatedElement;
  array.getMin = List.prototype.getMin;
  array.getMax = List.prototype.getMax;
  array.indexesOf = List.prototype.indexesOf;
  array.indexOfElements = List.prototype.indexOfElements;
  array.indexOfByPropertyValue = List.prototype.indexOfByPropertyValue;
  array.getFirstElementByName = List.prototype.getFirstElementByName;
  array.getElementsByNames = List.prototype.getElementsByNames;
  array.getFirstElementByPropertyValue = List.prototype.getFirstElementByPropertyValue;
  array.add = List.prototype.add;
  array.multiply = List.prototype.multiply;
  array.getSubList = List.prototype.getSubList;
  array.getSubListByIndexes = List.prototype.getSubListByIndexes;
  array.getSubListByType = List.prototype.getSubListByType;
  array.getElementNumberOfOccurrences = List.prototype.getElementNumberOfOccurrences;
  array.getPropertyValues = List.prototype.getPropertyValues;
  array.getRandomElement = List.prototype.getRandomElement;
  array.getRandomElements = List.prototype.getRandomElements;
  array.containsElement = List.prototype.containsElement;
  array.indexOfElement = List.prototype.indexOfElement;
  //sorting:
  array.sortIndexed = List.prototype.sortIndexed;
  array.sortNumericIndexed = List.prototype.sortNumericIndexed;
  array.sortNumeric = List.prototype.sortNumeric;
  array.sortNumericIndexedDescending = List.prototype.sortNumericIndexedDescending;
  array.sortNumericDescending = List.prototype.sortNumericDescending;
  array.sortOnIndexes = List.prototype.sortOnIndexes;
  array.getReversed = List.prototype.getReversed;
  array.getSortedByProperty = List.prototype.getSortedByProperty;
  array.getSorted = List.prototype.getSorted;
  array.getSortedByList = List.prototype.getSortedByList;
  array.getSortedRandom = List.prototype.getSortedRandom;
  //filter:
  array.getFilteredByPropertyValue = List.prototype.getFilteredByPropertyValue;
  array.getFilteredByBooleanList = List.prototype.getFilteredByBooleanList;
  //conversion
  array.toNumberList = List.prototype.toNumberList;
  array.toStringList = List.prototype.toStringList;
  //
  array.clone = List.prototype.clone;
  array.toString = List.prototype.toString;
  array.getNames = List.prototype.getNames;
  array.applyFunction = List.prototype.applyFunction;
  array.getWithoutElementAtIndex = List.prototype.getWithoutElementAtIndex;
  array.getWithoutElement = List.prototype.getWithoutElement;
  array.getWithoutElements = List.prototype.getWithoutElements;
  array.getWithoutElementsAtIndexes = List.prototype.getWithoutElementsAtIndexes;
  array.getFilteredByFunction = List.prototype.getFilteredByFunction;
  array._concat = Array.prototype.concat;
  array.concat = List.prototype.concat;
  array.getReport = List.prototype.getReport;

  //transformations
  array.pushIfUnique = List.prototype.pushIfUnique;
  array.removeElement = List.prototype.removeElement;
  array.removeElementAtIndex = List.prototype.removeElementAtIndex;
  array.removeElementsAtIndexes = List.prototype.removeElementsAtIndexes;
  array.removeElements = List.prototype.removeElements;
  array.removeRepetitions = List.prototype.removeRepetitions;
  array.replace = List.prototype.replace;
  array.assignNames = List.prototype.assignNames;
  array._splice = Array.prototype.splice;
  array.splice = List.prototype.splice;

  array.isList = true;

  array.destroy = List.prototype.destroy;


  return array;
};

/**
 * Improves a List by its refining type.
 *
 * @return {List} Specific sub-class of List
 * based on the contents of the List.
 * tags:
 */
List.prototype.getImproved = function() {
  //TODO: still doesn't solve tha case of a list with several list of different types
  if(this.length === 0) {
    return this;
  }

  var typeOfElements = this.getTypeOfElements();

  var newList;
  switch(typeOfElements) {
    case "number":
<<<<<<< HEAD
      newList = NumberList.fromArray(this, false);
      break;
    case "string":
      newList = StringList.fromArray(this, false);
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
      newList = Table.fromArray(this, false);
      break;
    case "NumberList":
      newList = NumberTable.fromArray(this, false);
      break;
    case "Point":
      newList = Polygon.fromArray(this, false);
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
=======
      var newList = NumberList.fromArray(this, false);
    break;
    case "string":
      var newList = StringList.fromArray(this, false);
    break;
    case "Rectangle":
      return this;
    case "date":
      var newList = DateList.fromArray(this, false);
    break;
    case "List":
      case "DateList":
      case "IntervalList":
      case "StringList":
      case "Table":
      var newList = Table.fromArray(this, false);
    break;
    case "NumberList":
      var newList = NumberTable.fromArray(this, false);
    break;
    case "Point":
      var newList = Polygon.fromArray(this, false);
    break;
    case "Polygon":
      var newList = PolygonList.fromArray(this, false);
    break;
    case "Node":
      var newList = NodeList.fromArray(this, false);
    break;
    case "Relation":
      var newList = RelationList.fromArray(this, false);
    break;
>>>>>>> b96b5bdcc8579abc9467a6a2013971ae034e617f
  }

  if(newList === null ||  newList === "") {
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
    if(allLists) newList = Table.fromArray(this, false);
  }

  if(newList != null) {
    newList.name = this.name;
    return newList;
  }
  return this;
};

/**
 * Compares elements with another list.
 *
 * @param  {List} list List to compare.
 * @return {Boolean} true if all elements are identical.
 * tags:
 */
List.prototype.sameElements = function(list) {
  if(this.length != list.length) return false;

  var i;
  for(i = 0; this[i] != null; i++) {
    if(this[i] != list[i]) return false;
  }

  return true;
};

/**
 * Returns the number of elements of the list.
 *
 * @return {Number} Length of the list.
 * tags:
 */
List.prototype.getLength = function() {
  return this.length;
};

/**
 * In sub-classes, this function returns a NumberList of lengths.
 * Base function returns null.
 *
 * @return {null}
 * tags:
 */
List.prototype.getLengths = function() {
  //overriden by different extentions of List
  return null;
};

/**
 * Returns the type of values contained in the List.
 * Uses typeOf to determine type. If multiple types,
 * returns an empty string.
 *
 * @return {String} Type of element stored in the List.
 */
List.prototype.getTypeOfElements = function() {
  var typeOfElements = typeOf(this[0]);
  for(var i = 1; this[i] != null; i++) {
    if(typeOf(this[i]) != typeOfElements) return "";
  }
  return typeOfElements;
};

/**
 * Returns a {@link StringList} with elemnts types
 * for all elements in the List.
 *
 * @return {StringList} List of types for each element.
 * tags:
 */
List.prototype.getTypes = function() {
  var types = new StringList();
  for(var i = 0; this[i] != null; i++) {
    types[i] = typeOf(this[i]);
  }
  return types;
};


/**
 * Converts the List into a string.
 *
 * @return {String} String representation of the List.
 */
List.prototype.toString = function() {
  var i;
  var str = "[";
  for(var i = 0; i < this.length - 1; i++) {
    str += this[i] + ", ";
  }
  str += this[this.length - 1] + "]";
  return str;
};

/**
 * Returns a list of names (if any) of elements of the list.
 *
 * @return {StringList}
 * tags:
 */
List.prototype.getNames = function() {
  var stringList = new StringList();
  for(var i = 0; this[i] != null; i++) {
    stringList[i] = this[i].name;
  }
  return stringList;
};

/**
 * Reverses the list.
 *
 * @return {List} New List reveresed from original.
 * tags:sort
 */
List.prototype.getReversed = function() {
  var newList = instantiateWithSameType(this);
  for(var i = 0; this[i] != null; i++) {
    newList.unshift(this[i]);
  }
  return newList;
};

/**
 * Returns a sub-list, params could be: tw numbers, an interval or a NumberList.
 *
 * @param {Number|Interval} argument0 number, interval (in this it will
 * include elements with initial and end indexes) or numberList
 * @param {Number} argument1 second index
 * @return {List}
 * tags:filter
 */
List.prototype.getSubList = function() {
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
    newList = NumberList.fromArray(this.slice(interval.x, interval.y + 1), false);
    newList.name = this.name;
    return newList;
  } else if(this.type == "StringList") {
    newList = StringList.fromArray(this.slice(interval.x, interval.y + 1), false);
    newList.name = this.name;
    return newList;
  }

  if(this.type == 'List' || this.type == 'Table') {
    newList = new List();
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
 * Filters a list by picking elements of certain type.
 *
 * @param  {String} type The type to include in the new List.
 * @return {List} A List only containing values from the original
 * List of the input type.
 * tags:filter
 */
List.prototype.getSubListByType = function(type) {
  var newList = new List();
  newList.name = this.name;
  this.forEach(function(element) {
    if(typeOf(element) == type) newList.push(element);
  });
  return newList.getImproved();
};

/**
 * Returns all elements in indexes.
 *
 * @param {NumberList} indexes
 * @return {List}
 * tags:filter
 */
List.prototype.getSubListByIndexes = function() { //TODO: merge with getSubList
  if(this.length < 1) return this;
  var indexes;
  if(typeOf(arguments[0]) == 'number') {
    indexes = arguments;
  } else {
    indexes = arguments[0];
  }

  if(indexes == null) {
    return;
  }

  var newList;
  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiate(typeOf(this));
  }

  if(indexes.length === 0) {
    return newList;
  }
  newList.name = this.name;
  var nElements = this.length;
  var nPositions = indexes.length;
  var i;
  for(i = 0; i < nPositions; i++) {
    if(indexes[i] < nElements) {
      newList.push(this[(indexes[i] + this.length) % this.length]);
    }
  }

  if(this.type == 'List' || this.type == 'Table') {
    return newList.getImproved();
  }
  return newList;
};

/**
 * getElementNumberOfOccurrences
 *
 * @param {Object} element
 * @return {Number}
 */
List.prototype.getElementNumberOfOccurrences = function(element) {
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


/**
 * Creates a copy of the List.
 *
 * @return {List}
 */
List.prototype.clone = function() {
  //TODO:check this! fromArray should suffice
  var clonedList = instantiateWithSameType(this);
  var i;

  for(i = 0; this[i] != null; i++) {
    clonedList.push(this[i]);
  }
  clonedList.name = this.name;
  return clonedList;
};

/**
 * Creates a new List without repeating elements.
 *
 * @return {List}
 * tags:filter
 */
List.prototype.getWithoutRepetitions = function() {
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
 * Returns the number of occurrences of an element in a list.
 *
 * @param  {Object} element The element to count
 * @return {Number}
 * tags:countt
 */
List.prototype.countElement = function(element) {
  n = 0;
  this.forEach(function(elementInList) {
    if(element == elementInList) {
      n++;
    }
  });
  return n;
};

/**
 * Returns a NumberList of same size as list with number of occurrences for each element.
 *
 * @return {numberList}
 * tags:count
 */
List.prototype.countOccurrences = function() { //TODO: more efficient
  var occurrences = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    occurrences[i] = this.indexesOf(this[i]).length;
  }
  return occurrences;
};

/**
 * Returns a table with a list of non repeated elements and a list with the numbers of occurrences for each one.
 *
 * @param  {Boolean} sortListsByOccurrences if true both lists in the table will be sorted by number of occurences (most frequent on top), true by default
 * @return {Table} Table containing a List of non-repeated elements and a NumberList of the frequency of each element.
 * tags:count
 */
List.prototype.getElementsRepetitionCount = function(sortListsByOccurrences) {
  sortListsByOccurrences = sortListsByOccurrences == null ? true : sortListsByOccurrences;

  var obj;
  var elementList = new List();
  var numberList = new NumberList();
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

  var table = new Table();
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

/**
 * Checks if all values in the list are equal to one another.
 *
 * @return {Boolean} Returns true if all values in the list are equal.
 */
List.prototype.allElementsEqual = function() {
  var i;
  if(this.length < 2) return true;

  first = this[0];

  for(i = 1; this[i] != null; i++) {
    if(this[i] != first) return false;
  }

  return true;
};


/**
 * Returns the value in the list that is repeated the most times.
 *
 * @return {Object} Most repeated value.
 */
List.prototype.getMostRepeatedElement = function() {
  //TODO: this method should be more efficient
  return ListOperators.countElementsRepetitionOnList(this, true)[0][0];
};

/**
 * Gets the minimum value.
 *
 * @return {Number} Minimum value in the List.
 * tags:
 */
List.prototype.getMin = function() {
  if(this.length === 0) return null;
  var min = this[0];
  var i;
  for(i = 1; i < this.length; i++) {
    min = Math.min(min, this[i]);
  }
  return min;
};

/**
 * Gets the maximum value.
 *
 * @return {Number} Max value in the List.
 * tags:
 */
List.prototype.getMax = function() {
  if(this.length === 0) return null;
  var max = this[0];
  var i;
  for(i = 1; i < this.length; i++) {
    max = Math.max(max, this[i]);
  }
  return max;
};

/**
 * Creates a new List with the given value added
 * to each element in the current List.
 *
 * @param {Number} value Number to be added to each
 * element in the List.
 * @return {List} New List with each element the result
 * of adding the given value to the original elements
 * in the List.
 */
List.prototype.add = function(value) {
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
 * Selects a random element from list.
 *
 * @return {Object}
 * tags:
 */
List.prototype.getRandomElement = function() {
  return this[Math.floor(this.length * Math.random())];
};

/**
 * Creates a List with randomly selected elements.
 *
 * @param  {Number} n number of elements
 * @param  {Boolean} avoidRepetitions
 * @return {List}
 * tags:filter
 */
List.prototype.getRandomElements = function(n, avoidRepetitions) {
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


/**
 * Returns true if the given element is in the List.
 *
 * @param {Object} element Element to look for in the List.
 * @return {Boolean} True if given element is in the List.
 */
List.prototype.containsElement = function(element) { //TODO: test if this is faster than indexOf
  var i;
  for(i = 0; this[i] != null; i++) {
    if(this[i] == element) return true;
  }
  return false;
};

/**
 * Returns the index position of the given element in the List.
 *
 * @param {Object} element Value to search for in the List.
 * @return {Number} Index of the given element in the List.
 * If element is not found, -1 is returned.
 */
List.prototype.indexOfElement = function(element) { //TODO: test if this is faster than indexOf
  var i;
  for(i = 0; this[i] != null; i++) {
    if(this[i] == element) return i;
  }
  return -1;
};

/**
 * Returns a List of values of a property of all elements.
 *
 * @param  {String} propertyName
 *
 * @param  {Object} valueIfNull in case the property doesn't exist in the element
 * @return {List}
 * tags:
 */
List.prototype.getPropertyValues = function(propertyName, valueIfNull) {
  var newList = new List();
  newList.name = propertyName;
  var val;
  for(var i = 0; this[i] != null; i++) {
    val = this[i][propertyName];
    newList[i] = (val == null ? valueIfNull : val);
  }
  return newList.getImproved();
};

List.prototype.sortIndexed = function() {
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
  var result = new NumberList();
  for(i = 0; i < index.length; i++) {
    result.push(index[i].index);
  }
  return result;
};

<<<<<<< HEAD
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

=======
>>>>>>> b96b5bdcc8579abc9467a6a2013971ae034e617f
List.prototype.sortOnIndexes = function(indexes) {
  var result = instantiateWithSameType(this);
  result.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    if(indexes[i] != -1) result.push(this[indexes[i]]);
  }
  return result;
};

List.prototype.getSortedByProperty = function(propertyName, ascending) {
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
 * Returns a sorted version of the List.
 *
 * @param  {Boolean} ascending sort (true by default)
 * @return {List}
 * tags:sort
 */
List.prototype.getSorted = function(ascending) {
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
 * Sorts the List by another List.
 *
 * @param  {List} list List used to sort (numberList, stringList, dateList…)
 *
 * @param  {Boolean} ascending (true by default)
 * @return {List} sorted list (of the same type)
 * tags:sort
 */
List.prototype.getSortedByList = function(list, ascending) {
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
 * Returns a copy of the list with random sorting.
 *
 * @return {List}
 * tags:sort
 */
List.prototype.getSortedRandom = function() {
  var newList = this.clone();
  newList.name = this.name;
  newList.sort(function() {
    return Math.random() < 0.5 ? 1 : -1;
  });
  return newList;
};

/**
 * Returns a NumberList with the indexes (positions) of an element.
 *
 * @param  {Object} element
 * @return {NumberList}
 * tags:
 */
List.prototype.indexesOf = function(element) {
  var index = this.indexOf(element);
  var numberList = new NumberList();
  while(index != -1) {
    numberList.push(index);
    index = this.indexOf(element, index + 1);
  }
  return numberList;
};

/**
 * Returns a NumberList with indexes (first position) of elements in a list.
 *
 * @param  {List} elements
 * @return {NumberList}
 * tags:
 */
List.prototype.indexOfElements = function(elements) {
  var numberList = new NumberList();
  for(var i = 0; elements[i] != null; i++) {
    numberList[i] = this.indexOf(elements[i]);
  }
  return numberList;
};

/**
 * Returns the first element (or index) of an element in the with a given name.
 *
 * @param  {String} name of element
 * @param  {Boolean} returnIndex if true returns the index of element (false by default)
 * @return {List}
 * tags: filter
 */
List.prototype.getFirstElementByName = function(name, returnIndex) {
  for(var i = 0; this[i] != null; i++) {
    if(this[i].name == name) return returnIndex ? i : this[i];
  }
  return returnIndex ? -1 : null;
};

/**
 * Returns the first element from each name ([!] to be tested).
 *
 * @param  {StringList} names of elements to be filtered
 * @param  {Boolean} returnIndexes if true returns the indexes of elements (false by default)
 * @return {List}
 * tags:filter
 */
List.prototype.getElementsByNames = function(names, returnIndex) {
  var list = returnIndex ? new NumberList() : new List();
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
 * Gets the first elemenet that has some property with a given value.
 *
 * @param  {String} propertyName name of property
 * @param  {Object} value value of property
 * @return {Object}
 * tags:
 */
List.prototype.getFirstElementByPropertyValue = function(propertyName, value) {
  for(var i = 0; this[i] != null; i++) {
    if(this[i][propertyName] == value) return this[i];
  }
  return null;
};

List.prototype.indexOfByPropertyValue = function(propertyName, value) {
  for(var i = 0; this[i] != null; i++) {
    if(this[i][propertyName] == value) return i;
  }
  return -1;
};



/**
 * Filters the list by booleans (also accepts numberList with 0s as false a any other number as true).
 *
 * @param  {List} booleanList booleanList or numberList
 * @return {List}
 * tags:filter
 */
List.prototype.getFilteredByBooleanList = function(booleanList) {
  var newList = new List();
  newList.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    if(booleanList[i]) newList.push(this[i]);
  }
  return newList.getImproved();
};

/**
 * Filters a list by its elements, and a type of comparison (equal by default).
 *
 * @param  {Object} value object (for equal or different comparison) or number or date
 * (for equal, different, greater, lesser).
 * @param  {String} comparison equal (default), different, greater, lesser.
 * @return {List} Filtered list
 * tags:filter
 */
List.prototype.getFilteredByValue = function(value, comparison) {
  comparison = comparison == null ? "equal" : comparison;

  var newList = new List();
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
 * Filters a list by the values of a property on its elements, and a type of comparison (equal by default).
 *
 * @param  {String} propertyName name of property
 * @param  {Object} propertyValue object (for equal or different comparison) or number or date (for equal, different, greater, lesser)
 * @param  {String} comparison equal (default), different, greater, lesser
 * @return {List} filtered list
 * tags:filter
 */
List.prototype.getFilteredByPropertyValue = function(propertyName, propertyValue, comparison) {
  comparison = comparison == null ? "equal" : comparison;

  var newList = new List();
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
 * Converts the List into a NumberList.
 *
 * @return {NumberList}
 * tags:conversion
 */
List.prototype.toNumberList = function() {
  var numberList = new NumberList();
  numberList.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    numberList[i] = Number(this[i]);
  }
  return numberList;
};

/**
 * Converts the List into a StringList.
 *
 * @return {StringList}
 * tags:conversion
 */
List.prototype.toStringList = function() {
  var i;
  var stringList = new StringList();
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

List.prototype.applyFunction = function(func) {
  //TODO: to be tested!
  var newList = new List();
  newList.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    newList[i] = func(this[i]);
  }
  return newList.getImproved();
};


//filtering

List.prototype.getWithoutElementsAtIndexes = function(indexes) { //[!] This DOESN'T transforms the List
  var i;
  var newList;
  if(this.type == 'List') {
    newList = new List();
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
 * Removes an element and returns a new list.
 *
 * @param  {Number} index of element to remove
 * @return {List}
 * tags:filter
 */
List.prototype.getWithoutElementAtIndex = function(index) {
  var newList;
  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
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

/**
 * Creates a new List without the given element present.
 * If multiple copies of the element exist, only exlcudes first copy.
 *
 * @param {Number|String|Object} element Element to exclude in the new List.
 * @return {List} New List missing the given element.
 */
List.prototype.getWithoutElement = function(element) {
  var index = this.indexOf(element);
  if(index == -1) return this;

  var newList;

  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
  }

  newList.name = this.name;

  var i;
  for(i = 0; this[i] != null; i++) {
    if(i != index) newList.push(this[i]);
  }

  if(this.type == 'List') return newList.getImproved();
  return newList;
};

List.prototype.getWithoutElements = function(list) {
  var newList;
  if(this.type == 'List') {
    newList = new List();
  } else {
    newList = instantiateWithSameType(this);
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


/**
 * Returns subset of List where true is returned from
 * given function that is executed on each element in the List.
 *
 * @param {Function} func Function to run on each element.
 * If the function returns true, the element is maintained in the
 * returned List.
 * @return {List} Filtered List.
 */
List.prototype.getFilteredByFunction = function(func) {
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

List.prototype.concat = function() {
  if(arguments[0] == null) return this;

  //c.l('concat | arguments[0].type, this.type', arguments[0].type, this.type);

  if(arguments[0].type == this.type) {
    if(this.type == "NumberList") {
      return NumberList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "StringList") {
      return StringList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "NodeList") { //[!] concat breaks the getNodeById in NodeList
      return NodeList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "DateList") {
      return DateList.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "Table") {
      return Table.fromArray(this._concat.apply(this, arguments), false);
    } else if(this.type == "NumberTable") {
      return NumberTable.fromArray(this._concat.apply(this, arguments), false);
    }
  }
  return List.fromArray(this._concat.apply(this, arguments)).getImproved();
};


List.prototype.getReport = function(level) { //TODO:complete
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

List.prototype.pushIfUnique = function(element) {
  if(this.indexOf(element) != -1) return; //TODO: implement equivalence
  this.push(element);
};

List.prototype.removeElements = function(elements) { //TODO: make it more efficient (avoiding the splice method)
  for(var i = 0; i < this.length; i++) {
    if(elements.indexOf(this[i]) > -1) {
      this.splice(i, 1);
      i--;
    }
  }
};

List.prototype.removeElement = function(element) {
  var index = this.indexOf(element);
  if(index != -1) this.splice(index, 1);
};

List.prototype.removeElementAtIndex = function(index) { //deprecated
  this.splice(index, 1);
};

List.prototype.removeElementsAtIndexes = function(indexes) {
  indexes = indexes.sort(function(a, b) {
    return a - b;
  });

  for(var i = 0; indexes[i] != null; i++) {
    this.splice(indexes[i] - i, 1);
  }
};

List.prototype.removeRepetitions = function() {
  for(var i = 0; this[i] != null; i++) {
    if(this.indexOf(this[i], i + 1) != -1) {
      this.splice(i, 1);
    }
  }
};

List.prototype.replace = function(elementToFind, elementToInsert) {
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
List.prototype.assignNames = function(names) {
  if(names == null) return this;
  var n = names.length;

  this.forEach(function(element, i) {
    element.name = names[i % n];
  });

  return this;
};

List.prototype.splice = function() { //TODO: replace
  switch(this.type) {
    case 'NumberList':
      return NumberList.fromArray(this._splice.apply(this, arguments));
    break;
    case 'StringList':
      return StringList.fromArray(this._splice.apply(this, arguments));
    break;
    case 'NodeList':
      return NodeList.fromArray(this._splice.apply(this, arguments));
    break;
    case 'DateList':
      return DateList.fromArray(this._splice.apply(this, arguments));
    break;
  }
  return List.fromArray(this._splice.apply(this, arguments)).getImproved();
};

List.prototype.destroy = function() {
  for(var i = 0; this[i] != null; i++) {
    delete this[i];
  }
};
