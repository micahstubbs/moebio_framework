import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import ListGenerators from "src/operators/lists/ListGenerators";
import ListConversions from "src/operators/lists/ListConversions";

/**
 * @classdesc Table Encodings
 *
 * @namespace
 * @category basics
 */
function TableEncodings() {}
export default TableEncodings;

TableEncodings.ENTER = String.fromCharCode(13);
TableEncodings.ENTER2 = String.fromCharCode(10);
TableEncodings.ENTER3 = String.fromCharCode(8232);

TableEncodings.SPACE = String.fromCharCode(32);
TableEncodings.SPACE2 = String.fromCharCode(160);

TableEncodings.TAB = "	";
TableEncodings.TAB2 = String.fromCharCode(9);


/**
 * Decode a String in format CSV into a Table
 * @param {String} csv CSV formatted text
 *
 * @param {Boolean} first_row_header first row is header (default: false)
 * @param {String} separator separator character (default: ",")
 * @param {Object} value_for_nulls Object to be placed instead of null values
 * @param {Boolean} listsToStringList if true (default value), converts lists that are not StringLists, NumberLists… (probably because they contain strings and numbers) into StringLists
 * @return {Table} resulting Table
 * tags:decoder
 */
TableEncodings.CSVtoTable = function(csvString, firstRowIsHeader, separator, valueForNulls, listsToStringList) {
  if(csvString==null) return null;
  valueForNulls = valueForNulls == null ? "" : valueForNulls;
  listsToStringList = listsToStringList==null?true:listsToStringList;

  var i, j;
  var _firstRowIsHeader = firstRowIsHeader == null ? false : firstRowIsHeader;

  if(csvString == null) return null;
  if(csvString === "") return new Table();

  csvString = csvString.replace(/\$/g, "");

  var blocks = csvString.split("\"");
  for(i = 1; blocks[i] != null; i += 2) {
    blocks[i] = blocks[i].replace(/\n/g, "*ENTER*");
  }
  csvString = blocks.join("\""); //TODO: create a general method for replacements inside "", apply it to chomas

  var enterChar = TableEncodings.ENTER2;
  var lines = csvString.split(enterChar);
  if(lines.length == 1) {
    enterChar = TableEncodings.ENTER;
    lines = csvString.split(enterChar);
    if(lines.length == 1) {
      enterChar = TableEncodings.ENTER3;
      lines = csvString.split(enterChar);
    }
  }

  var table = new Table();
  var comaCharacter = separator != undefined ? separator : ",";

  if(csvString == null || csvString === "" || csvString == " " || lines.length === 0) return null;

  var startIndex = 0;
  var headerContent;
  if(_firstRowIsHeader) {
    startIndex = 1;
    headerContent = lines[0].split(comaCharacter);
  }

  var element;
  var cellContent;
  var numberCandidate;
  for(i = startIndex; i < lines.length; i++) {
    if(lines[i].length < 2) continue;

    var cellContents = NetworkEncodings.replaceChomasInLine(lines[i], separator).split(comaCharacter); //TODO: will be obsolete (see previous TODO)

    for(j = 0; j < cellContents.length; j++) {
      table[j] = table[j] == null ? new List() : table[j];
      if(_firstRowIsHeader && i == 1) {
        table[j].name = ( headerContent[j] == null ? "" : TableEncodings._removeQuotes(headerContent[j]) ).trim();
      }
      var actualIndex = _firstRowIsHeader ? (i - 1) : i;

      cellContent = cellContents[j].replace(/\*CHOMA\*/g, separator).replace(/\*ENTER\*/g, "\n");

      cellContent = cellContent === '' ? valueForNulls : cellContent;

      cellContent = String(cellContent);

      numberCandidate = Number(cellContent.replace(',', '.'));

      element = (numberCandidate || (numberCandidate == 0 && cellContent !== '')) ? numberCandidate : cellContent;

      if(typeof element == 'string') element = TableEncodings._removeQuotes(element);

      table[j][actualIndex] = element;
    }
  }

  for(i = 0; table[i] != null; i++) {
    table[i] = table[i].getImproved();
    if(listsToStringList && table[i].type=="List") table[i] = ListConversions.toStringList(table[i]);
  }

  table = table.getImproved();

  return table;
};

/**
 * @ignore
 */
TableEncodings._removeQuotes = function(string) {
  if(string.length === 0) return string;
  if((string.charAt(0) == "\"" || string.charAt(0) == "'") && (string.charAt(string.length - 1) == "\"" || string.charAt(string.length - 1) == "'")) string = string.substr(1, string.length - 2);
  return string;
};


/**
 * Encode a Table into a String in format CSV
 * @param {Table} Table to be enconded
 *
 * @param {String} separator character (default: ",")
 * @param {Boolean} first row as List names (default: false)
 * @return {String} resulting String in CSV format
 * tags:encoder
 */
TableEncodings.TableToCSV = function(table, separator, namesAsHeaders) {
  separator = separator || ",";
  var i;
  var j;
  var list;
  var type;
  var lines = ListGenerators.createListWithSameElement(table[0].length, "");
  var addSeparator;
  for(i = 0; table[i] != null; i++) {
    list = table[i];
    type = list.type;
    addSeparator = i != table.length - 1;
    for(j = 0; list[j] != null; j++) {
      switch(type) {
        case 'NumberList':
          lines[j] += list[j];
          break;
        default:
          lines[j] += "\"" + list[j] + "\"";
          break;
      }
      if(addSeparator) lines[j] += separator;
    }
  }

  var headers = '';
  if(namesAsHeaders) {
    for(i = 0; table[i] != null; i++) {
      list = table[i];
      headers += "\"" + list.name + "\"";
      if(i != table.length - 1) headers += separator;
    }
    headers += '\n';
  }

  return headers + lines.getConcatenated("\n");
};
