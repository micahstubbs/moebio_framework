import { typeOf } from "src/tools/utils/code/ClassUtils";
import Point from "src/dataStructures/geometry/Point";
import DateOperators from "src/operators/dates/DateOperators";
import Polygon from "src/dataStructures/geometry/Polygon";
import ColorScales from "src/operators/graphic/ColorScales";
import TableEncodings from "src/operators/lists/TableEncodings";
import DateList from "src/dataStructures/dates/DateList";
import NetworkConversions from "src/operators/structures/NetworkConversions";

/**
 * @classdesc  Object Conversions
 *
 * @namespace
 * @category basics
 */
function ObjectConversions() {}
export default ObjectConversions;

// *
//  * convert an object into a json string (JSON.stringify(object))
//  * @param  {Object} object to convert
//  * @return {String} string in format json
//  * tags:conversion
// ObjectConversions.objectToString = function(object){
// 	return JSON.stringify(object);
// }

/**
 * converts any Object into the desirde type, using the most obvious conversion (if exists)
 * @param  {Object} object
 * @param  {String} toType can be literal (ex: "string", "NumberList") or short (ex: "s", "#L")
 * @return {Object} Object of the specified type
 * tags:conversion
 */
ObjectConversions.conversor = function(object, toType) {
  if(object==null || toType==null) return;

  var i;
  var type = typeOf(object);
  var pairType = type + "_" + toType;
  var newList;

  console.log('ObjectConversions.conversor, pairType:', pairType);

  switch(pairType) {
    case 'Array_List':
      return ObjectConversions.ArrayToList(object);
    case 'NumberTable_Polygon':
      var polygon = new Polygon();
      var length2 = object.length > 1;
      for(i = 0; object[0][i] != null; i++) {
        polygon[i] = new Point(object[0][i], length2 ? object[1][i] : 0);
      }
      return polygon;
    case 'date_string':
      return DateOperators.dateToString(object);
    case 'string_date':
      return DateOperators.stringToDate(object);
    case 'date_number':
      return object.getTime();
    case 'number_date':
      return new Date(object);
    case 'List_StringList':
    case 'NumberList_StringList':
      return object.toStringList();
    case 'StringList_NumberList':
      return object.toNumberList();
    case 'Object_string':
      return JSON.stringify(object, null, "\t");
    case 'string_Object':
      return JSON.parse(object);
    case 'string_ColorScale':
      return ColorScales[object]; //todo: not working, fix
    case 'string_Table':
      return TableEncodings.CSVtoTable(object);
    case 'StringList_DateList': //TODO: solve cases of lists
      newList = new DateList();
      object.forEach(function(string) {
        newList.push(DateOperators.stringToDate(string));
      });
      newList.name = object.name;
      return newList;
    case 'DateList_NumberList': //TODO: solve cases of lists
      return object.getTimes();
    case 'Table_Network':
      return NetworkConversions.TableToNetwork(object, null, 0, false);

  }

  switch(toType) {
    case 'string':
      return object.toString();
    case 'number':
      return Number(object);
  }

  // var short = TYPES_SHORT_NAMES_DICTIONARY[toType];
  // if(short!=null && short!=toType){
  //   return ObjectConversions.conversor(object, short);
  // }

  return null;
};

/**
 * converts an array into an improved List
 * @param {Array} array
 * tags:conversion
 */
ObjectConversions.ArrayToList = function(array){
  return List.fromArray(object).getImproved();
};
