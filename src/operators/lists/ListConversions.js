import NumberList from "src/dataTypes/numeric/NumberList";
import StringList from "src/dataTypes/strings/StringList";

/**
 * @classdesc List Operators
 *
 * @namespace
 * @category basics
 */
function ListConversions() {}
export default ListConversions;

/**
 * Converts the List into a NumberList.
 *
 * @param  {List} list
 * @return {NumberList}
 * tags:conversion
 */
ListConversions.toNumberList = function(list) {
  var numberList = new NumberList();
  numberList.name = list.name;
  var i;
  for(i = 0; list[i] != null; i++) {
    numberList[i] = Number(list[i]);
  }
  return numberList;
};

/**
 * Converts the List into a StringList.
 *
 * @param  {List} list
 * @return {StringList}
 * tags:conversion
 */
ListConversions.toStringList = function(list) {
  var i;
  var stringList = new StringList();
  stringList.name = list.name;
  for(i = 0; list[i] != null; i++) {
    if(typeof list[i] == 'number') {
      stringList[i] = String(list[i]);
    } else {
      stringList[i] = list[i].toString();
    }
  }
  return stringList;
};
