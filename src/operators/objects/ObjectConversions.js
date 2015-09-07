import { typeOf } from "src/tools/utils/code/ClassUtils";
import Point from "src/dataTypes/geometry/Point";
import DateOperators from "src/operators/dates/DateOperators";
import Polygon from "src/dataTypes/geometry/Polygon";
import ColorScales from "src/operators/graphic/ColorScales";
import TableEncodings from "src/operators/lists/TableEncodings";
import DateList from "src/dataTypes/dates/DateList";
import NetworkConversions from "src/operators/structures/NetworkConversions";
import List from "src/dataTypes/lists/List";
import Table from "src/dataTypes/lists/Table";
import StringListConversions from "src/operators/strings/StringListConversions";
import NumberListConversions from "src/operators/numeric/numberList/NumberListConversions";

/**
 * @classdesc  Object Conversions
 *
 * @namespace
 * @category basics
 */
function ObjectConversions() {}
export default ObjectConversions;

/**
 * Convert an object (or more typically an Array of objects) into a Table
 * @param {Object} object or array of objects
 *
 * @param {List} list of field names to include (by default will take all from first element in array of objects)
 * @return {Table} resulting Table
 * tags:decoder,dani
 */
ObjectConversions.ObjectToTable = function(object, fields) {
  // Formats:
  // 1: normal list of objects
  // 2: Object with single property, containing normal list of obejcts
  // 3: Object as CSV (each property represents a column)
  var format;
  var p;

  // If it's an array, then it's format 1
  if(Array.isArray(object)) {
    format = 1;
    // If not field names supplied, get them from first element
    if(!fields)
    {
      fields = [];
      for(p in object[0]) {
        if (object[0].hasOwnProperty(p)) {
          fields.push(p);
        }
      }
    }
    // Else (not array), it's an object
  } else {
    // Check how many properties the object has
    var properties = [];
    for(p in object) {
      properties.push(p);
    }

    // If it has only one, and it's an array, it's foramt 2, so assume it's just a capsule
    // and extract the array as format 1
    if(properties.length == 1 && Array.isArray(object[properties[0]]))
    {
      format = 1;
      object = object[properties[0]];

      // If not field names supplied, get them from first element
      if(!fields)
      {
        fields = [];
        for(p in object[0]) {
          fields.push(p);
        }
      }
    } else {
      // Finally, if the object has many properties, we assume it's a csv encoded as JSON
      // ( each property of the object represents a column of the CSV )
      format = 3;

      // If not fields supplied, use all properties
      if(!fields)
        fields = properties;
    }
  }


  // Create table and columns
  var column, i, f;
  var result = new Table();
  for(i = 0; i < fields.length; i++) {
    var fieldName = fields[i];
    column = new List();
    result[i] = column;
    column.name = fieldName;
  }

  // Fill the table
  if(format == 1)
  {
    for(i = 0; i < object.length; i++) {
      var row = object[i];
      for(f = 0; f < fields.length; f++) {
        result[f].push(row[fields[f]]);
      }
    }
  } else {
    for(f = 0; f < fields.length; f++) {
      column = object[fields[f]];
      for(i = 0; i < column.length; i++) {
        result[f].push(column[i]);
      }
    }
  }

  // Improve columns
  for(i = 0; i < result.length; i++) {
    result[i] = result[i].getImproved();
  }

  //if(result.getLengths.getMax()==1) return result.getRow(0);

  // Improve table
  result = result.getImproved();

  // Return best possible
  return result;
};


/**
 * Convert an object (or more typically an Array of objects) into a Table
 * @param {Object} object or array of objects
 *
 * @param {List} list of field names to include (by default will take all from first element in array of objects)
 * @return {List} resulting list (probably a table)
 * tags:decoder
 */
ObjectConversions.ObjectToList = function(object, fields) {
  var result = ObjectConversions.ObjectToTable(object, fields);

  if(result.getLengths.getMax() == 1) return result.getRow(0);
};



/**
 * converts an object into a json string (JSON.stringify(object))
 * @param  {Object} object to convert
 * @return {String} string in format json. If there is an error, it returns an
 * error string.
 * tags:conversion
 */
ObjectConversions.objectToString = function(object){
  try {
    return JSON.stringify(object);
  } catch (e) {
    return JSON.stringify({"error":"cannot convert."});
  }
};

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
      return NumberListConversions.toStringList(object);
    case 'StringList_NumberList':
      return StringListConversions.toNumberList(object);
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
  return List.fromArray(array).getImproved();
};
