import DateList from "src/dataTypes/dates/DateList";
import DateOperators from "src/operators/dates/DateOperators";
import NumberList from "src/dataTypes/numeric/NumberList";

/**
 * @classdesc  StringList Conversions
 *
 * @namespace
 * @category strings
 */
function StringListConversions() {}
export default StringListConversions;


/**
 * Converts StringLIst to numberList
 *
 * @param {StringList} stringlist StringList to convert
 */
StringListConversions.toNumberList = function(stringlist) {
  var numbers = new NumberList();
  numbers.name = stringlist.name;
  var i;
  for(i = 0; stringlist[i] != null; i++) {
    numbers[i] = Number(stringlist[i]);
  }
  return numbers;
};


/**
 * converts a stringList into a dateList
 *
 * @param {StringList} stringlist StringList to convert
 * @param  {String} formatCase format cases:<br>0: MM-DD-YYYY<br>1: YYYY-MM-DD<br>2: MM-DD-YY<br>3: YY-MM-DD<br>4: DD-MM-YY<br>5: DD-MM-YYYY
 * @param  {String} separator "-" by default
 * @return {DateList}
 * tags:
 */
StringListConversions.toDateList = function(stringList, formatCase, separator) {
  if(stringList==null) return;
  
  var dateList = new DateList();
  var i;
  var l = stringList.length;
  for(i = 0; i<l; i++) {
    dateList.push(DateOperators.stringToDate(stringList[i], formatCase, separator));
  }
  return dateList;
};
