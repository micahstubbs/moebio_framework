import List from "src/dataTypes/lists/List";
import NumberList from "src/dataTypes/numeric/NumberList";
import { typeOf } from "src/tools/utils/code/ClassUtils";

StringList.prototype = new List();
StringList.prototype.constructor = StringList;

/**
 * @classdesc {@link List} for storing Strings.
 *
 * Additional functions that work on StringList can be found in:
 * <ul>
 *  <li>Operators:   {@link StringListOperators}</li>
 *  <li>Conversions: {@link StringListConversions}</li>
 * </ul>
 *
 * @constructor
 * @description Creates a new StringList
 *
 * @category strings
 */
function StringList() {
  var args = [];

  for(var i = 0; i < arguments.length; i++) {
    args[i] = String(arguments[i]);
  }
  var array = List.apply(this, args);
  array = StringList.fromArray(array);
  
  return array;
}
export default StringList;

/**
 * @todo write docs
 */
StringList.fromArray = function(array, forceToString) {
  forceToString = forceToString == null ? true : forceToString;

  var result = List.fromArray(array);
  if(forceToString) {
    for(var i = 0; i < result.length; i++) {
      result[i] = String(result[i]);
    }
  }
  result.type = "StringList";

  //assign methods to array:
  result.getLengths = StringList.prototype.getLengths;
  result.toLowerCase = StringList.prototype.toLowerCase;
  result.toUpperCase = StringList.prototype.toUpperCase;
  result.append = StringList.prototype.append;
  result.getSurrounded = StringList.prototype.getSurrounded;
  result.replace = StringList.prototype.replace;
  result.getConcatenated = StringList.prototype.getConcatenated;
  result.trim = StringList.prototype.trim;

  //override
  result.clone = StringList.prototype.clone;

  return result;
};

/**
 * overrides List.prototype.getLengths (see comments there)
 */
StringList.prototype.getLengths = function() {
  var lengths = new NumberList();

  this.forEach(function(string) {
    lengths.push(string.length);
  });

  return lengths;
};

/**
 * @todo write docs
 */
StringList.prototype.append = function(sufix, after) {
  after = after == null ? true : after;
  var newStringList = new StringList();
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
StringList.prototype.getSurrounded = function(prefix, sufix) {
  var newStringList = new StringList();
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
/**
 * @ignore
 */
StringList.prototype.replace = function(regExp, string) {
  if(regExp==null) return this;

  var newStringList = new StringList();
  var i;

  newStringList.name = this.name;

  for(i = 0; this[i] != null; i++){
    newStringList[i] = this[i].replace(regExp, string);
  }

  return newStringList;
};

/**
 * @todo write docs
 */
StringList.prototype.getConcatenated = function(separator) {
  var i;
  var string = "";
  for(i = 0; this[i] != null; i++) {
    string += this[i];
    if(i < this.length - 1) string += separator;
  }
  return string;
};

/**
 * @todo write docs
 */
StringList.prototype.toLowerCase = function() {
  var newStringList = new StringList();
  newStringList.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    newStringList[i] = this[i].toLowerCase();
  }
  return newStringList;
};

/**
 * @todo write docs
 */
StringList.prototype.toUpperCase = function() {
  var newStringList = new StringList();
  newStringList.name = this.name;
  var i;
  for(i = 0; this[i] != null; i++) {
    newStringList[i] = this[i].toUpperCase();
  }
  return newStringList;
};

/**
 * trims all the strings on the stringList
 * @return {StringList}
 * tags:
 */
StringList.prototype.trim = function() {
  var i;
  var newStringList = new StringList();
  for(i = 0; this[i] != null; i++) {
    newStringList[i] = this[i].trim();
  }
  newStringList.name = this.name;
  return newStringList;
};

///////overriding

/**
 * @todo write docs
 */
StringList.prototype.clone = function() {
  var newList = StringList.fromArray(this.slice(), false);
  newList.name = this.name;
  return newList;
};
