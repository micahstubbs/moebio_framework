/* global console */

import List from "src/dataStructures/lists/List";
import NumberList from "src/dataStructures/numeric/NumberList";
import TableEncodings from "src/operators/lists/TableEncodings";
import StringOperators from "src/operators/strings/StringOperators";
import {
  instantiate,
  instantiateWithSameType,
  TYPES_SHORT_NAMES_DICTIONARY,
  typeOf
  } from "src/tools/utils/code/ClassUtils";
//

Table.prototype = new List();
Table.prototype.constructor = Table;

/**
 * @classdesc A sub-class of {@link List}, Table provides a 2D array-like structure.
 *
 * Each column is stored as its own {@link List}, making it a List of Lists.
 * Cells in the table can be accessed using table[column][row].
 *
 * @description Creates a new Table.
 * Input arguments are treated as the inital column values
 * of the Table.
 * @constructor
 * @category basics
 */
function Table() {
  var args = [];
  var i;
  for(i = 0; i < arguments.length; i++) {
    args[i] = new List(arguments[i]);
  }

  var array = List.apply(this, args);
  array = Table.fromArray(array);

  return array;
}
export default Table;

/**
 * Creates a new Table from an array
 * @param {Number[]} array
 * @return {Table}
 */
Table.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Table";
  //assign methods to array:
  result.applyFunction = Table.prototype.applyFunction;
  result.getRow = Table.prototype.getRow;
  result.getRows = Table.prototype.getRows;
  result.getLengths = Table.prototype.getLengths;
  result.getListLength = Table.prototype.getListLength;
  result.sliceRows = Table.prototype.sliceRows;
  result.getSubListsByIndexes = Table.prototype.getSubListsByIndexes;
  result.getWithoutRow = Table.prototype.getWithoutRow;
  result.getWithoutRows = Table.prototype.getWithoutRows;
  result.getTableSimplified = Table.prototype.getTableSimplified;
  result.getSubTableByElementOnList = Table.prototype.getSubTableByElementOnList;
  result.getSubTableByElementsOnList = Table.prototype.getSubTableByElementsOnList;
  result.getTransposed = Table.prototype.getTransposed;
  result.getListsSortedByList = Table.prototype.getListsSortedByList;
  result.sortListsByList = Table.prototype.sortListsByList;
  result.getReport = Table.prototype.getReport;
  result.getReportHtml = Table.prototype.getReportHtml;
  result.clone = Table.prototype.clone;
  result.print = Table.prototype.print;

  //transformative
  result.removeRow = Table.prototype.removeRow;

  //overiden
  result.destroy = Table.prototype.destroy;

  result.isTable = true;

  return result;
};


/**
 * Executes a given function on all the columns
 * in the Table, returning a new Table with the
 * resulting values.
 * @param {Function} func Function to apply to each
 * column in the table. Columns are {@link List|Lists}.
 * @return {Table} Table of values from applying function.
 */
Table.prototype.applyFunction = function(func) {
  //TODO: to be tested!
  var i;
  var newTable = new Table();

  newTable.name = this.name;

  for(i = 0; this[i] != null; i++) {
    newTable[i] = this[i].applyFunction(func);
  }
  return newTable.getImproved();
};

/**
 * Returns a {@link List} with all the elements of a row.
 * @param  {Number} index Index of the row to get.
 * @return {List}
 * tags:filter
 */
Table.prototype.getRow = function(index) {
  var list = new List();
  var i;
  for(i = 0; i < this.length; i++) {
    list[i] = this[i][index];
  }
  return list.getImproved();
};

/**
 * Returns the length a column of the Table.
 * @param  {Number} index The Column to return its length.
 * Defaults to 0.
 * @return {Number} Length of column at given index.
 * tags:
 */
Table.prototype.getListLength = function(index) {
  return this[index || 0].length;
};

/**
 * Returns the lengths of all the columns of the Table.
 * @return {NumberList} Lengths of all columns in Table.
 */
Table.prototype.getLengths = function() {
  var lengths = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    lengths[i] = this[i].length;
  }
  return lengths;
};

/**
 * Filters a Table by selecting a section of rows, elements with last index included.
 * @param  {Number} startIndex Index of first element in all lists of the table.
 * @param  {Number} endIndex Index of last elements in all lists of the table.
 * @return {Table}
 * tags:filter
 */
Table.prototype.sliceRows = function(startIndex, endIndex) {
  endIndex = endIndex == null ? (this[0].length - 1) : endIndex;

  var i;
  var newTable = new Table();
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
 * Filters the lists of the table by indexes.
 * @param  {NumberList} indexes
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubListsByIndexes = function(indexes) {
  var newTable = new Table();
  this.forEach(function(list) {
    newTable.push(list.getSubListByIndexes(indexes));
  });
  return newTable.getImproved();
};


//deprecated
/**
 * @ignore
 */
Table.prototype.getRows = function(indexes) {
  return Table.prototype.getSubListsByIndexes(indexes);
};

/**
 * Returns a new Table with the row at the given index removed.
 * @param {Number} rowIndex Row to remove
 * @return {Table} New Table.
 * tags:filter
 */
Table.prototype.getWithoutRow = function(rowIndex) {
  var newTable = new Table();
  newTable.name = this.name;
  for(var i = 0; this[i] != null; i++) {
    newTable[i] = List.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex + 1))).getImproved();
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};

/**
 * Returns a new Table with the rows listed in the given numberList removed.
 * @param {NumberList} rowsIndexes numberList of row indexes to remove.
 * @return {Table}
 * tags:filter
 */
Table.prototype.getWithoutRows = function(rowsIndexes) {
  var newTable = new Table();
  var i, j;

  newTable.name = this.name;
  for(i = 0; this[i] != null; i++) {
    newTable[i] = new List();
    for(j = 0; this[i][j] != null; j++){
      if(rowsIndexes.indexOf(j) == -1) newTable[i].push(this[i][j]);
    }
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};

/**
 * takes a table and simplifies its lists, numberLists will be simplified using quantiles values (using getNumbersSimplified) and other lists reducing the number of different elements (using getSimplified)
 * specially useful to build simpe decision trees using TableOperators.buildDecisionTree
 * @param  {Number} nCategories number of different elements on each list
 * 
 * @param {Object} othersElement to be placed instead of the less common elements ("other" by default)
 * @return {Table}
 * tags:
 */
Table.prototype.getTableSimplified = function(nCategories, othersElement) {
  if(nCategories===undefined) return null;

  var i;
  var newTable = new Table();
  newTable.name = this.name;

  for(i=0; this[i]!==undefined; i++){
    newTable.push(
      this[i].type==='NumberList'?
      this[i].getNumbersSimplified(2, nCategories)
      :
      this[i].getSimplified(nCategories, othersElement)
    );
  }

  return newTable;
};

/**
 * filters lists on a table, keeping elements that are in the same of row of a certain element of a given list from the table
 * @param  {Number} nList index of list containing the element
 * @param  {Object} element used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubTableByElementOnList = function(nList, element){
  if(nList==null || element==null) return;

  var i, j, value, list;

  if(nList<0) nList = this.length+nList;
  nList = nList%this.length;

  var newTable = instantiateWithSameType(this);
  newTable.name = this.name;

  this.forEach(function(list){
    var newList = new List();
    newList.name = list.name;
    newTable.push(newList);
  });

  var supervised = this[nList];

  for(i=0; supervised[i]!=null; i++){
    if(element==supervised[i]){
       for(j=0; newTable[j]!=null; j++){
          newTable[j].push(this[j][i]);
       }
    }
  }

  newTable.forEach(function(list, i){
    newTable[i] = list.getImproved();
  });

  return newTable.getImproved();
}

/**
 * filters lists on a table, keeping elements that are in the same of row of certain elements of a given list from the table
 * @param  {Number} nList index of list containing the element
 * @param  {List} elements used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubTableByElementsOnList = function(nList, list){
  if(nList==null || list==null) return;

  var i, j, value, list;

  if(nList<0) nList = this.length+nList;
  nList = nList%this.length;

  var newTable = instantiateWithSameType(this);
  newTable.name = this.name;

  this.forEach(function(list){
    var newList = new List();
    newList.name = list.name;
    newTable.push(newList);
  });

  var supervised = this[nList];

  var listDictionary = ListOperators.getBooleanDictionaryForList(list);

  for(i=0; supervised[i]!=null; i++){
    if(listDictionary[supervised[i]]){
       for(j=0; newTable[j]!=null; j++){
          newTable[j].push(this[j][i]);
       }
    }
  }

  newTable.forEach(function(list, i){
    newTable[i] = list.getImproved();
  });

  return newTable.getImproved();
}

/**
 * Sort Table's lists by a list
 * @param  {List|Number} listOrIndex List used to sort, or index of list in the table
 *
 * @param  {Boolean} ascending (true by default)
 * @return {Table} table (of the same type)
 * tags:sort
 */
Table.prototype.getListsSortedByList = function(listOrIndex, ascending) { //depracated: use sortListsByList
  if(listOrIndex == null) return;
  var newTable = instantiateWithSameType(this);
  var sortinglist = listOrIndex.isList ? listOrIndex.clone() : this[listOrIndex];

  this.forEach(function(list) {
    newTable.push(list.getSortedByList(sortinglist, ascending));
  });

  return newTable;
};

/**
 * Transposes Table.
 * @param firstListAsHeaders
 * @return {Table}
 */
Table.prototype.getTransposed = function(firstListAsHeaders) {

  var tableToTranspose = firstListAsHeaders ? this.getSubList(1) : this;

  var table = instantiate(typeOf(tableToTranspose));
  if(tableToTranspose.length === 0) return table;
  var i;
  var j;
  var list;

  for(i = 0; tableToTranspose[i] != null; i++) {
    list = tableToTranspose[i];
    for(j = 0; list[j] != null; j++) {
      if(i === 0) table[j] = new List();
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

/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
Table.prototype.getReport = function(level) {
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
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
    text += ident + i + ": " + name + " ["+TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"]";
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

  if(this.length == 2) {
    text += ident + ident + "--------lists comparisons---------";
    if(this[0].type=="NumberList" && this[1].type=="NumberList"){
      text += ident + "covariance:" + NumberListOperators.covariance(this[0], this[1]);
      text += ident + "Pearson product moment correlation: " + NumberListOperators.pearsonProductMomentCorrelation(this[0], this[1]);
    } else if(this[0].type!="NumberList" && this[1].type!="NumberList"){
      var nUnion = ListOperators.union(this[0], this[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(this[0], this[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(this[0]._freqTable[0].length == nUnion && this[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(this[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(this[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(this[0], this[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+ListOperators.getInformationGain(this[0], this[1]);
      text += ident + "information gain when segmenting second list by the first: "+ListOperators.getInformationGain(this[1], this[0]);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};


Table.prototype.getReportHtml = function(level) {
  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  var lengths = this.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = "<b>" +( level > 0 ? (ident + "<font style=\"font-size:16px\">table report</f>") : "<font style=\"font-size:18px\">table report</f>" ) + "</b>";

  if(this.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  if(this.name){
    text += ident + "name: <b>" + this.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + this.type + "</b>";
  text += ident + "number of lists: <b>" + this.length + "</b>";

  text += ident + "all lists have same length: <b>" + (sameLengths ? "true" : "false") + "</b>";

  if(sameLengths) {
    text += ident + "lists length: <b>" + this[0].length + "</b>";
  } else {
    text += ident + "min length: <b>" + minLength + "</b>";
    text += ident + "max length: <b>" + maxLength + "</b>";
    text += ident + "average length: <b>" + averageLength + "</b>";
    text += ident + "all lengths: <b>" + lengths.join(", ") + "</b>";
  }

  var names = this.getNames();
  var types = this.getTypes();

  text += "<hr>";
  names.forEach(function(name, i){
    text += ident + "<font style=\"font-size:10px\">" +i + ":</f><b>" + name + "</b> <font color=\""+getColorFromDataModelType(types[i])+ "\">" + TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"</f>";
  });
  text += "<hr>";

  var sameTypes = types.allElementsEqual();
  if(sameTypes) {
    text += ident + "types of all lists: " + "<b>" + types[0] + "</b>";
  } else {
    text += ident + "types: ";
    types.forEach(function(type, i){
      text += "<b><font color=\""+getColorFromDataModelType(type)+ "\">" + type+"</f></b>";
      if(i<types.length-1) text += ", ";
    });
  }
  text += "<br>" + ident + "names: <b>" + names.join("</b>, <b>") + "</b>";


  //list by list

  if(this.length < 501) {
    text += "<hr>";
    text +=  ident + "<font style=\"font-size:16px\"><b>lists reports</b></f>";

    var i;
    for(i = 0; this[i] != null; i++) {
      text += "<br>" + ident + i + ": " + (this[i].name?"<b>"+this[i].name+"</b>":"<i>no name</i>");
      try{
         text += this[i].getReportHtml(1);
      } catch(err){
        text += ident + "[!] something wrong with list <font style=\"font-size:10px\">:" + err + "</f>";
        c.l('getReportHtml err', err);
      }
    }
  }

  if(this.length == 2) {//TODO:finish
    text += "<hr>";
    text += ident + "<b>lists comparisons</b>";
    if(this[0].type=="NumberList" && this[1].type=="NumberList"){
      text += ident + "covariance:" + NumberOperators.numberToString(NumberListOperators.covariance(this[0], this[1]), 4);
      text += ident + "Pearson product moment correlation: " + NumberOperators.numberToString(NumberListOperators.pearsonProductMomentCorrelation(this[0], this[1]), 4);
    } else if(this[0].type!="NumberList" && this[1].type!="NumberList"){
      var nUnion = ListOperators.union(this[0], this[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(this[0], this[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(this[0]._freqTable[0].length == nUnion && this[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(this[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(this[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(this[0], this[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+NumberOperators.numberToString( ListOperators.getInformationGain(this[0], this[1]), 4);
      text += ident + "information gain when segmenting second list by the first: "+NumberOperators.numberToString( ListOperators.getInformationGain(this[1], this[0]), 4);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

Table.prototype.getReportObject = function() {}; //TODO

/**
 * removes a row from the table.
 * @param {Number} index The row to remove.
 * @return {undefined}
 */
Table.prototype.removeRow = function(index) {
  for(var i = 0; this[i] != null; i++) {
    this[i].splice(index, 1);
  }
};

/**
 * makes a copy of the Table.
 * @return {Table} Copy of table.
 */
Table.prototype.clone = function() {
  var clonedTable = instantiateWithSameType(this);
  clonedTable.name = this.name;
  for(var i = 0; this[i] != null; i++) {
    clonedTable.push(this[i].clone());
  }
  return clonedTable;
};

/**
 * Removes all contents of the Table.
 */
Table.prototype.destroy = function() {
  for(var i = 0; this[i] != null; i++) {
    this[i].destroy();
    delete this[i];
  }
};

/**
 * Prints contents of Table to console.log.
 */



Table.prototype.print = function() {
  console.log("///////////// <" + this.name + "////////////////////////////////////////////////////");
  console.log(TableEncodings.TableToCSV(this, null, true));
  console.log("/////////////" + this.name + "> ////////////////////////////////////////////////////");
};
