import StringOperators from "src/operators/strings/StringOperators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import ListOperators from "src/operators/lists/ListOperators";
import {
  TYPES_SHORT_NAMES_DICTIONARY,
  getColorFromDataModelType
} from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Tools to convert Tables to other data types
 *
 * @namespace
 * @category basics
 */
function TableConversions() {}
export default TableConversions;

/**
 * Convert a Table into an Object or Array of objects
 * @param {Object} table to be converted
 *
 * @param {List} list of field names to include (by default will take all from table)
 * @return {Object} containing list of rows from input Table
 * tags:decoder,dani
 */
TableConversions.TableToObject = function(table, fields) { // To-Do: should return a List instead of Array?
    if(!table)
      return;

    // If no field names supplied, take them from first element
    if(!fields)
    {
      fields = table.getNames();
    }
    var result = [];
    for(var i = 0; i < table[0].length; i++) {
      var row = {};
      for(var f = 0; f < fields.length; f++)
      {
        row[fields[f]] = table[f][i];
      }
      result.push(row);
    }
    return {
      array: result
    };
  };


/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableConversions.toReport = function(table, level) {
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
  var lengths = table.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  text += ident + "name: " + table.name;
  text += ident + "type: " + table.type;
  text += ident + "number of lists: " + table.length;

  text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

  if(sameLengths) {
    text += ident + "lists length: " + table[0].length;
  } else {
    text += ident + "min length: " + minLength;
    text += ident + "max length: " + maxLength;
    text += ident + "average length: " + averageLength;
    text += ident + "all lengths: " + lengths.join(", ");
  }

  var names = table.getNames();
  var types = table.getTypes();

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

  if(table.length < 101) {
    text += ident + ident + "--------lists reports---------";

    var i;
    for(i = 0; table[i] != null; i++) {
      text += "\n" + ident + ("(" + (i) + "/0-" + (table.length - 1) + ")");
      try{
         text += table[i].getReport(1);
      } catch(err){
        text += ident + "[!] something wrong with list " + err;
      }
    }
  }

  if(table.length == 2) {
    text += ident + ident + "--------lists comparisons---------";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberListOperators.covariance(table[0], table[1]);
      text += ident + "Pearson product moment correlation: " + NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

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
      text += ident + "information gain when segmenting first list by the second: "+ListOperators.getInformationGain(table[0], table[1]);
      text += ident + "information gain when segmenting second list by the first: "+ListOperators.getInformationGain(table[1], table[0]);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableConversions.toReportHtml = function(table,level) {
  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  var lengths = table.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = "<b>" +( level > 0 ? (ident + "<font style=\"font-size:16px\">table report</f>") : "<font style=\"font-size:18px\">table report</f>" ) + "</b>";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  if(table.name){
    text += ident + "name: <b>" + table.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + table.type + "</b>";
  text += ident + "number of lists: <b>" + table.length + "</b>";

  text += ident + "all lists have same length: <b>" + (sameLengths ? "true" : "false") + "</b>";

  if(sameLengths) {
    text += ident + "lists length: <b>" + table[0].length + "</b>";
  } else {
    text += ident + "min length: <b>" + minLength + "</b>";
    text += ident + "max length: <b>" + maxLength + "</b>";
    text += ident + "average length: <b>" + averageLength + "</b>";
    text += ident + "all lengths: <b>" + lengths.join(", ") + "</b>";
  }

  var names = table.getNames();
  var types = table.getTypes();

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

  if(table.length < 501) {
    text += "<hr>";
    text +=  ident + "<font style=\"font-size:16px\"><b>lists reports</b></f>";

    var i;
    for(i = 0; table[i] != null; i++) {
      text += "<br>" + ident + i + ": " + (table[i].name?"<b>"+table[i].name+"</b>":"<i>no name</i>");
      try{
         text += table[i].getReportHtml(1);
      } catch(err){
        text += ident + "[!] something wrong with list <font style=\"font-size:10px\">:" + err + "</f>";
        console.log('getReportHtml err', err);
      }
    }
  }

  if(table.length == 2) {//TODO:finish
    text += "<hr>";
    text += ident + "<b>lists comparisons</b>";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberOperators.numberToString(NumberListOperators.covariance(table[0], table[1]), 4);
      text += ident + "Pearson product moment correlation: " + NumberOperators.numberToString(NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]), 4);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

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
      text += ident + "information gain when segmenting first list by the second: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[0], table[1]), 4);
      text += ident + "information gain when segmenting second list by the first: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[1], table[0]), 4);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

TableConversions.getReportObject = function() {}; //TODO
