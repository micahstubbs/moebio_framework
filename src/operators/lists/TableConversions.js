
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
