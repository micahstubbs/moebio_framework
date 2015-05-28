function TableGenerators() {};

TableGenerators.createTableWithSameElement = function(nLists, nRows, element) {
  var table = new Table();
  for(var i = 0; i < nLists; i++) {
    table[i] = ListGenerators.createListWithSameElement(nRows, element);
  }
  return table.getImproved();
}