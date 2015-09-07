import ListGenerators from "src/operators/lists/ListGenerators";
import Table from "src/dataTypes/lists/Table";

/**
 * @classdesc Table Generators
 *
 * @namespace
 * @category basics
 */
function TableGenerators() {}
export default TableGenerators;

/**
 * @todo finish docs
 */
TableGenerators.createTableWithSameElement = function(nLists, nRows, element) {
  var table = new Table();
  for(var i = 0; i < nLists; i++) {
    table[i] = ListGenerators.createListWithSameElement(nRows, element);
  }
  return table.getImproved();
};
