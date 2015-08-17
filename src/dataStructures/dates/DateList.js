import List from "src/dataStructures/lists/List";
import NumberList from "src/dataStructures/numeric/NumberList";
import StringList from "src/dataStructures/strings/StringList";
import DateOperators from "src/operators/dates/DateOperators";

DateList.prototype = new List();
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
  var array = List.apply(this, args);
  array = DateList.fromArray(array);
  //
  return array;
}
export default DateList;


/**
* @todo write docs
*/
DateList.fromArray = function(array, forceToDate) {
  forceToDate = forceToDate == null ? true : forceToDate;
  var result = List.fromArray(array);

  if(forceToDate) {
    for(var i = 0; i < result.length; i++) {
      result[i] = new Date(result[i]);
    }
  }

  result.type = "DateList";
  //assign methods to array:
  result.getTimes = DateList.prototype.getTimes;
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
  var numberList = new NumberList();
  for(i = 0; this[i] != null; i++) {
    numberList.push(this[i].getTime());
  }
  return numberList;
};



/**
* @todo write docs
*/
DateList.prototype.getMin = function() {
  if(this.length === 0) return null;
  var min = this[0];
  var i;
  for(i = 1; this[i] != null; i++) {
    min = min < this[i] ? min : this[i];
  }
  return min;
};

/**
* @todo write docs
*/
DateList.prototype.getMax = function() {
  if(this.length === 0) return null;
  var max = this[0];
  var i;
  for(i = 1; this[i] != null; i++) {
    max = max > this[i] ? max : this[i];
  }
  return max;
};
