import StringList from "src/dataTypes/strings/StringList";
import DateOperators from "src/operators/dates/DateOperators";

/**
 * @classdesc DateList Conversions
 *
 * @namespace
 * @category dates
 */
function DateListConversions() {}
export default DateListConversions;

/**
* Converts DateList to StringList
*
* @param {DateList} datelist The DateList to convert.
*/
DateListConversions.toStringList = function(datelist) {
  var stringList = new StringList();
  for(var i = 0; datelist[i] != null; i++) {
    stringList[i] = DateOperators.dateToString(datelist[i]);
  }
  return stringList;
};
