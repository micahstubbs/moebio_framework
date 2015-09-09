import Table from "src/dataTypes/lists/Table";
import NumberList from "src/dataTypes/numeric/NumberList";
import List from "src/dataTypes/lists/List";
import { typeOf } from "src/tools/utils/code/ClassUtils";

NumberTable.prototype = new Table();
NumberTable.prototype.constructor = NumberTable;

/**
 * @classdesc {@link Table} to store numbers.
 *
 * @param [Number|[Number]] args If a single Number, indicates number of
 * columns to make for the NumberTable. Each column is created as an empty
 * NumberList. If an Array, or a set of Arrays, it will make a new NumberList
 * for each array present, populating it with the contents of the array.
 *
 * Additional functions that work on NumberTable can be found in:
 * <ul>
 *  <li>Operators:   {@link NumberTableOperators}</li>
 *  <li>Conversions: {@link NumberTableConversions}</li>
 * </ul>
 *
 * @constructor
 * @description Creates a new NumberTable.
 * @category numbers
 */
function NumberTable() {
  var args = [];
  var newNumberList;
  var array;
  var i;

  if(arguments.length > 0 && Number(arguments[0]) == arguments[0]) {
    array = [];
    for(i = 0; i < arguments[0]; i++) {
      array.push(new NumberList());
    }
  } else {
    for(i = 0; arguments[i] != null; i++) {
      newNumberList = NumberList.fromArray(arguments[i]);
      newNumberList.name = arguments[i].name;
      args[i] = newNumberList;
    }
    // TODO: this converts all our NumberLists into Lists
    array = Table.apply(this, args);
  }
  array = NumberTable.fromArray(array);
  return array;
}
export default NumberTable;

NumberTable.fromArray = function(array) {
  var result = Table.fromArray(array);
  result.type = "NumberTable";

  result.getSums = NumberTable.prototype.getSums;
  result.getRowsSums = NumberTable.prototype.getRowsSums;
  result.getAverages = NumberTable.prototype.getAverages;
  result.getRowsAverages = NumberTable.prototype.getRowsAverages;
  result.getIntervals = NumberTable.prototype.getIntervals;
  result.factor = NumberTable.prototype.factor;
  result.add = NumberTable.prototype.add;
  result.getMax = NumberTable.prototype.getMax;
  result.getMin = NumberTable.prototype.getMin;
  result.getMinMaxInterval = NumberTable.prototype.getMinMaxInterval;
  result.getCovarianceMatrix = NumberTable.prototype.getCovarianceMatrix;

  return result;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getMax = function() {
  if(this.length === 0) return null;

  var max = this[0].getMax();
  var i;

  for(i = 1; this[i] != null; i++) {
    max = Math.max(this[i].getMax(), max);
  }
  return max;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getMin = function() {
  if(this.length === 0) return null;

  var min = this[0].getMin();
  var i;

  for(i = 1; this[i] != null; i++) {
    min = Math.min(this[i].getMin(), min);
  }
  return min;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getMinMaxInterval = function() {
  if(this.length === 0) return null;
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
  var numberList = new NumberList();
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

/**
 * @todo write docs
 */
NumberTable.prototype.getAverages = function() {
  var numberList = new NumberList();
  for(var i = 0; this[i] != null; i++) {
    numberList[i] = this[i].getAverage();
  }
  return numberList;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getRowsAverages = function() {
  var l = this.length;
  var averages = this[0].clone().factor(1 / l);
  var numberList;
  var i, j;
  var length;
  for(i = 1; i<l; i++) {
    numberList = this[i];
    length = numberList.length;
    for(j = 0; j<length; j++) {
      averages[j] += numberList[j] / l;
    }
  }
  return averages;
};

/**
 * @todo write docs
 */
NumberTable.prototype.getIntervals = function() {
  var l = this.length;
  var numberList;
  var i;
  var intervalList = new List();//TODO: convert into IntervalList once available
  for(i = 0; i<l; i++) {
    numberList = this[i];
    intervalList.push(numberList.getInterval());
  }
  return intervalList;
};


/**
 * @todo write docs
 */
NumberTable.prototype.factor = function(value) {
  var newTable = new NumberTable();
  var i;
  var numberList;
  var l = this.length;

  switch(typeOf(value)) {
    case 'number':
      for(i = 0; i<l; i++) {
        numberList = this[i];
        newTable[i] = numberList.factor(value);
      }
      break;
    case 'NumberList':
      for(i = 0; i<l; i++) {
        numberList = this[i];
        newTable[i] = numberList.factor(value[i]);
      }
      break;

  }

  newTable.name = this.name;
  return newTable;
};

/**
 * @todo write docs
 */
NumberTable.prototype.add = function(value) {
  var newTable = new NumberTable();
  var numberList;
  var i;
  var l = this.length;

  for(i = 0; i<l; i++) {
    numberList = this[i];
    newTable[i] = numberList.add(value);
  }

  newTable.name = this.name;
  return newTable;
};
