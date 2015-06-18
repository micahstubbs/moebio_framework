import ListGenerators from "src/operators/lists/ListGenerators";
import Table from "src/dataStructures/lists/Table";

function TableGenerators() {}
export default TableGenerators;

TableGenerators.createTableWithSameElement = function(nLists, nRows, element) {
  var table = new Table();
  for(var i = 0; i < nLists; i++) {
    table[i] = ListGenerators.createListWithSameElement(nRows, element);
  }
  return table.getImproved();
};