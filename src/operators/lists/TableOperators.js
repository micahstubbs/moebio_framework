import NumberOperators from "src/operators/numeric/NumberOperators";
import { instantiateWithSameType, typeOf, instantiate } from "src/tools/utils/code/ClassUtils";
import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import NumberList from "src/dataStructures/numeric/NumberList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import ListOperators from "src/operators/lists/ListOperators";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import ListGenerators from "src/operators/lists/ListGenerators";
import ColorScales from "src/operators/graphic/ColorScales";
import Tree from "src/dataStructures/structures/networks/Tree";

import StringOperators from "src/operators/strings/StringOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import {
  TYPES_SHORT_NAMES_DICTIONARY,
  getColorFromDataModelType
} from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Table Operators
 *
 * @namespace
 * @category basics
 */
function TableOperators() {}
export default TableOperators;


/**
 * @todo finish docs
 */
TableOperators.getElementFromTable = function(table, i, j) {
  if(table[i] == null) return null;
  return table[i][j];
};

/**
 * @todo finish docs
 */
TableOperators.getSubTable = function(table, x, y, width, height) {
  if(table == null) return table;

  var nLists = table.length;
  if(nLists === 0) return null;
  var result = new Table();

  if(width <= 0) width = (nLists - x) + width;
  x = Math.min(x, nLists - 1);
  width = Math.min(width, nLists - x);

  var nRows = table[0].length;

  if(nRows === 0) return null;

  if(height <= 0) height = (nRows - y) + height;

  y = Math.min(y, nRows - 1);
  height = Math.min(height, nRows - y);

  var column;
  var newColumn;
  var i;
  var j;
  var element;
  for(i = x; i < x + width; i++) {
    column = table[i];
    newColumn = new List();
    newColumn.name = table[i].name;
    for(j = y; j < y + height; j++) {
      element = column[j];
      newColumn.push(element);
    }
    result.push(newColumn.getImproved());
  }
  return result.getImproved();
};

/**
 * filters lists on a table, keeping elements that are in the same of row of a certain element of a given list from the table
 * @param  {Table} table Table.
 * @param  {Number} nList index of list containing the element
 * @param  {Object} element used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
TableOperators.getSubTableByElementOnList = function(table, nList, element){
  if(nList==null || element==null) return;

  var i, j;

  if(nList<0) nList = table.length+nList;
  nList = nList%table.length;

  var newTable = instantiateWithSameType(table);
  newTable.name = table.name;

  table.forEach(function(list){
    var newList = new List();
    newList.name = list.name;
    newTable.push(newList);
  });

  var supervised = table[nList];

  for(i=0; supervised[i]!=null; i++){
    if(element==supervised[i]){
       for(j=0; newTable[j]!=null; j++){
          newTable[j].push(table[j][i]);
       }
    }
  }

  newTable.forEach(function(list, i){
    newTable[i] = list.getImproved();
  });

  return newTable.getImproved();
};

/**
 * filters lists on a table, keeping elements that are in the same of row of certain elements of a given list from the table
 * @param  {Table} table Table.
 * @param  {Number} nList index of list containing the element
 * @param  {List} elements used to filter the lists on the table
 * @return {Table}
 * tags:filter
 */
TableOperators.getSubTableByElementsOnList = function(table, nList, list){
  if(nList==null || list==null) return;

  var i, j;

  if(nList<0) nList = table.length+nList;
  nList = nList%table.length;

  var newTable = instantiateWithSameType(table);
  newTable.name = table.name;

  table.forEach(function(list){
    var newList = new List();
    newList.name = list.name;
    newTable.push(newList);
  });

  var supervised = table[nList];

  var listDictionary = ListOperators.getBooleanDictionaryForList(list);

  for(i=0; supervised[i]!=null; i++){
    if(listDictionary[supervised[i]]){
       for(j=0; newTable[j]!=null; j++){
          newTable[j].push(table[j][i]);
       }
    }
  }

  newTable.forEach(function(list, i){
    newTable[i] = list.getImproved();
  });

  return newTable.getImproved();
};

/**
 * transposes a table
 * @param  {Table} table to be transposed
 *
 * @param {Boolean} firstListAsHeaders removes first list of the table and uses it as names for the lists on the transposed table
 * @return {Table}
 * tags:matrixes
 */
TableOperators.transpose = function(table, firstListAsHeaders) {
  if(table == null) return null;
  return table.getTransposed(firstListAsHeaders);
};

/**
 * divides the instances of a table in two tables: the training table and the test table
 * @param  {Table} table
 * @param  {Number} proportion proportion of training instances/test instances, between 0 and 1
 *
 * @param  {Number} mode  0:random<br>1:random with seed<br>2:shuffle
 * @param {Number} seed seed for random numbers (mode 1)
 * @return {List} list containing the two tables
 * tags:ds
 */
TableOperators.trainingTestPartition = function(table, proportion, mode, seed) {
  if(table == null || proportion == null) return;

  mode = mode || 0;
  seed = seed || 0;

  var n_mod = 0;

  var indexesTr = new NumberList();
  var indexesTe = new NumberList();

  var random = mode == 1 ? new NumberOperators._Alea("my", seed, "seeds") : Math.random;

  if(mode == 2) {
    n_mod = Math.floor(proportion / (1 - proportion) * 10);
  }

  table[0].forEach(function(id, i) {
    if(mode === 0 ||  mode === 1) {
      if(random() < proportion) {
        indexesTr.push(i);
      } else {
        indexesTe.push(i);
      }
    } else {
      if(i % n_mod !== 0) {
        indexesTr.push(i);
      } else {
        indexesTe.push(i);
      }
    }
  });

  return new List(table.getSubListsByIndexes(indexesTr), table.getSubListsByIndexes(indexesTe));
};

/**
 * tests a model
 * @param  {NumberTable} numberTable coordinates of points
 * @param  {List} classes list of values of classes
 * @param  {Function} model function that receives two numbers and returns a guessed class
 *
 * @param  {Number} metric 0:error
 * @return {Number} metric value
 * tags:ds
 */
TableOperators.testClassificationModel = function(numberTable, classes, model, metric) {
  if(numberTable == null || classes == null || model == null) return null;

  metric = metric || 0;

  var nErrors = 0;

  classes.forEach(function(clss, i) {
    if(model(numberTable[0][i], numberTable[1][i]) != clss) {
      nErrors++;
    }
  });

  return nErrors / classes.length;
};



/**
 * @todo finish docs
 */
TableOperators.getSubListsByIndexes = function(table, indexes) {
  var newTable = new Table();
  newTable.name = table.name;
  var list;
  var newList;
  for(var i = 0; table[i] != null; i++) {
    list = table[i];
    newList = instantiateWithSameType(list);
    for(var j = 0; indexes[j] != null; j++) {
      newList[j] = list[indexes[j]];
    }
    newTable[i] = newList.getImproved();
  }
  return newTable;
};

// old version replaced by above version Dec 1st, 2014
// - fixed bug where descending with 'false' value gets changed to 'true'
// - performance improvements for tables with lots of lists
// TableOperators.sortListsByNumberList=function(table, numberList, descending){
//  descending = descending || true;
/**
 * @todo finish docs
 */
TableOperators.sortListsByNumberList = function(table, numberList, descending) {
  if(descending == null) descending = true;

  var newTable = instantiate(typeOf(table));
  newTable.name = table.name;
  var nElements = table.length;
  var i;
  // only need to do the sort once, not for each column
  var indexList = numberList.clone();
  // save original index
  for(i = 0; i < indexList.length; i++) {
    indexList[i] = i;
  }
  indexList = ListOperators.sortListByNumberList(indexList, numberList, descending);
  // now clone and then move from original based on index
  for(i = 0; i < nElements; i++) {
    newTable[i] = table[i].clone();
    for(var j = 0; j < indexList.length; j++) {
      newTable[i][j] = table[i][indexList[j]];
    }
  }
  return newTable;
};


/**
 * aggregates lists from a table, using one of the list of the table as the aggregation list, and based on different modes for each list
 * @param  {Table} table containing the aggregation list and lists to be aggregated
 * @param  {Number} indexAggregationList index of the aggregation list on the table
 * @param  {NumberList} indexesListsToAggregate indexs of the lists to be aggregated; typically it also contains the index of the aggregation list at the beginning, to be aggregated using mode 0 (first element) thus resulting as the list of non repeated elements
 * @param  {NumberList} modes list of modes of aggregation, these are the options:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements<br>14:concat elements (string)<br>15:concat non-repeated elements
 *
 * @param {StringList} newListsNames optional names for generated lists
 * @return {Table} aggregated table
 * tags:
 */
TableOperators.aggregateTable = function(table, indexAggregationList, indexesListsToAggregate, modes, newListsNames){
  indexAggregationList = indexAggregationList||0;

  if(table==null || !table.length ||  table.length<indexAggregationList || indexesListsToAggregate==null || !indexesListsToAggregate.length || modes==null) return;

  var aggregatorList = table[indexAggregationList];
  var indexesTable = ListOperators.getIndexesTable(aggregatorList);
  var newTable = new Table();
  var newList;
  var toAggregateList;

  indexesListsToAggregate.forEach(function(index, i){
    toAggregateList = table[index];
    newList = ListOperators.aggregateList(aggregatorList, toAggregateList, i<modes.length?modes[i]:1, indexesTable)[1];
    if(newListsNames && i<newListsNames.length) newList.name = newListsNames[i];
    newTable.push(newList);
  });

  return newTable.getImproved();
};



/**
 * builds a pivot table
 * @param  {table} table
 * @param  {Number} indexFirstAggregationList index of first list
 * @param  {Number} indexSecondAggregationList index of second list
 * @param  {Number} indexListToAggregate index of list to be aggregated
 * @param  {Number} aggregationMode aggregation mode:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>------not yet deployed:<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes
 * @param {Object} nullValue value for null cases in non-numerical aggregation
 *
 * @param  {Number} resultMode result mode:<br>0:classic pivot, a table of aggregations with first aggregation list elements without repetitions in the first list, and second aggregation elements as headers of the aggregation lists<br>1:two lists for combinations of first aggregated list and second aggregated list, and a third list for aggregated values(default)
 * @return {Table}
 * tags:
 */
TableOperators.pivotTable = function(table, indexFirstAggregationList, indexSecondAggregationList, indexListToAggregate, aggregationMode, nullValue, resultMode){
  if(table==null || !table.length || indexFirstAggregationList==null || indexSecondAggregationList==null || indexListToAggregate==null || aggregationMode==null) return;

  resultMode = resultMode||0;
  nullValue = nullValue==null?"":nullValue;

  var element1;
  var coordinate, indexes;
  var listToAggregate = table[indexListToAggregate];

  var newTable = new Table();
  var sum;
  var i;

  if(resultMode==1){//two lists of elements and a list of aggregation value
    var indexesDictionary = {};
    var elementsDictionary = {};

    table[indexFirstAggregationList].forEach(function(element0, i){
      element1 = table[indexSecondAggregationList][i];
      coordinate = String(element0)+"∞"+String(element1);
      if(indexesDictionary[coordinate]==null){
        indexesDictionary[coordinate]=new NumberList();
        elementsDictionary[coordinate]=new List();
      }
      indexesDictionary[coordinate].push(i);
      elementsDictionary[coordinate].push(listToAggregate[i]);
    });

    newTable[0] = new List();
    newTable[1] = new List();
    switch(aggregationMode){
      case 0://first element
        newTable[2] = new List();
        break;
      case 1://count
      case 2://sum
      case 3://average
        newTable[2] = new NumberList();
        break;
    }


    for(coordinate in indexesDictionary) {
      indexes = indexesDictionary[coordinate];
      newTable[0].push(table[indexFirstAggregationList][indexes[0]]);
      newTable[1].push(table[indexSecondAggregationList][indexes[0]]);

      switch(aggregationMode){
        case 0://first element
          newTable[2].push(listToAggregate[indexes[0]]);
          break;
        case 1://count
          newTable[2].push(indexes.length);
          break;
        case 2://sum
        case 3://average
          sum = 0;
          indexes.forEach(function(index){
            sum+=listToAggregate[index];
          });
          if(aggregationMode==3) sum/=indexes.length;
          newTable[2].push(sum);
          break;
      }
    }

    newTable[0] = newTable[0].getImproved();
    newTable[1] = newTable[1].getImproved();

    switch(aggregationMode){
      case 0://first element
        newTable[2] = newTable[2].getImproved();
        break;
    }

    return newTable;
  }


  ////////////////////////resultMode==0, a table whose first list is the first aggregation list, and each i+i list is the aggregations with elements for the second aggregation list

  newTable[0] = new List();

  var elementsPositions0 = {};
  var elementsPositions1 = {};

  var x, y;
  var element;
  var newList;

  table[indexFirstAggregationList].forEach(function(element0, i){
    element1 = table[indexSecondAggregationList][i];
    element = listToAggregate[i];

    y = elementsPositions0[String(element0)];
    if(y==null){
      newTable[0].push(element0);
      y = newTable[0].length-1;
      elementsPositions0[String(element0)] = y;
    }

    x = elementsPositions1[String(element1)];
    if(x==null){
      switch(aggregationMode){
        case 0:
          newList = new List();
          break;
        case 1:
        case 2:
        case 3:
          newList = new NumberList();
          break;
      }
      newTable.push(newList);
      newList.name = String(element1);
      x = newTable.length-1;
      elementsPositions1[String(element1)] = x;
    }

    switch(aggregationMode){
      case 0://first element
        if(newTable[x][y]==null) newTable[x][y]=element;
        break;
      case 1://count
        if(newTable[x][y]==null) newTable[x][y]=0;
        newTable[x][y]++;
        break;
      case 2://sum
        if(newTable[x][y]==null) newTable[x][y]=0;
        newTable[x][y]+=element;
        break;
      case 3://average
        if(newTable[x][y]==null) newTable[x][y]=[0,0];
        newTable[x][y][0]+=element;
        newTable[x][y][1]++;
        break;
    }

  });

  switch(aggregationMode){
    case 0://first element
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new List();

        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null) newTable[i][j]=nullValue;
        });

        newTable[i] = newTable[i].getImproved();
      }
      break;
    case 1://count
    case 2://sum
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new NumberList();
        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null) newTable[i][j]=0;
        });
      }
      break;
    case 3://average
      for(i=1; i<newTable.length; i++){
        if(newTable[i]==null) newTable[i]=new NumberList();
        newTable[0].forEach(function(val, j){
          if(newTable[i][j]==null){
            newTable[i][j]=0;
          } else {
            newTable[i][j]=newTable[i][j][0]/newTable[i][j][1];
          }
        });
      }
      break;
  }

  return newTable;
};



/**
 * aggregates a table
 * @param  {Table} table to be aggregated, deprecated: a new more powerful method has been built
 * @param  {Number} nList list in the table used as basis to aggregation
 * @param  {Number} mode mode of aggregation, 0:picks first element 1:adds numbers, 2:averages
 * @return {Table} aggregated table
 * tags:deprecated
 */
TableOperators.aggregateTableOld = function(table, nList, mode) {
  nList = nList == null ? 0 : nList;
  if(table == null || table[0] == null || table[0][0] == null || table[nList] == null) return null;
  mode = mode == null ? 0 : mode;

  var newTable = new Table();
  var i, j;
  var index;
  var notRepeated;

  newTable.name = table.name;

  for(j = 0; table[j] != null; j++) {
    newTable[j] = new List();
    newTable[j].name = table[j].name;
  }

  switch(mode) {
    case 0: //leaves the first element of the aggregated subLists
      for(i = 0; table[0][i] != null; i++) {
        notRepeated = newTable[nList].indexOf(table[nList][i]) == -1;
        if(notRepeated) {
          for(j = 0; table[j] != null; j++) {
            newTable[j].push(table[j][i]);
          }
        }
      }
      break;
    case 1: //adds values in numberLists
      for(i = 0; table[0][i] != null; i++) {
        index = newTable[nList].indexOf(table[nList][i]);
        notRepeated = index == -1;
        if(notRepeated) {
          for(j = 0; table[j] != null; j++) {
            newTable[j].push(table[j][i]);
          }
        } else {
          for(j = 0; table[j] != null; j++) {
            if(j != nList && table[j].type == 'NumberList') {
              newTable[j][index] += table[j][i];
            }
          }
        }
      }
      break;
    case 2: //averages values in numberLists
      var nRepetitionsList = table[nList].getFrequenciesTable(false);
      newTable = TableOperators.aggregateTableOld(table, nList, 1);

      for(j = 0; newTable[j] != null; j++) {
        if(j != nList && newTable[j].type == 'NumberList') {
          newTable[j] = newTable[j].divide(nRepetitionsList[1]);
        }
      }

      newTable.push(nRepetitionsList[1]);
      break;
  }
  for(j = 0; newTable[j] != null; j++) {
    newTable[j] = newTable[j].getImproved();
  }
  return newTable.getImproved();
};

/**
 * counts pairs of elements in same positions in two lists (the result is the adjacent matrix of the network defined by pairs)
 * @param  {Table} table with at least two lists
 * @return {NumberTable}
 * tags:
 */
TableOperators.getCountPairsMatrix = function(table) {
  if(table == null || table.length < 2 || table[0] == null || table[0][0] == null) return null;

  var list0 = table[0].getWithoutRepetitions();
  var list1 = table[1].getWithoutRepetitions();

  var matrix = new NumberTable(list1.length);

  list1.forEach(function(element1, i) {
    matrix[i].name = String(element1);
    list0.forEach(function(element0, j) {
      matrix[i][j] = 0;
    });
  });

  table[0].forEach(function(element0, i) {
    var element1 = table[1][i];
    matrix[list1.indexOf(element1)][list0.indexOf(element0)]++;
  });

  return matrix;
};


/**
 * filter a table selecting rows that have an element on one of its lists
 * @param  {Table} table
 * @param  {Number} nList list that could contain the element in several positions
 * @param  {Object} element
 *
 * @param {Boolean} keepRowIfElementIsPresent if true (default value) the row is selected if the list contains the given element, if false the row is discarded
 * @return {Table}
 * tags:filter
 */
TableOperators.filterTableByElementInList = function(table, nList, element, keepRowIfElementIsPresent) {
  if(table == null ||  table.length <= 0 || nList == null) return;
  if(element == null) return table;


  var newTable = new Table();
  var i, j;

  newTable.name = table.name;

  for(j = 0; table[j] != null; j++) {
    newTable[j] = new List();
    newTable[j].name = table[j].name;
  }

  if(keepRowIfElementIsPresent){
    for(i = 0; table[0][i] != null; i++) {
      if(table[nList][i] == element) {
        for(j = 0; table[j] != null; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  } else {
    for(i = 0; table[0][i] != null; i++) {
      if(table[nList][i] != element) {
        for(j = 0; table[j] != null; j++) {
          newTable[j].push(table[j][i]);
        }
      }
    }
  }

  for(j = 0; newTable[j] != null; j++) {
    newTable[j] = newTable[j].getImproved();
  }

  return newTable;
};

/**
 * @todo finish docs
 */
TableOperators.mergeDataTablesInList = function(tableList) {
  if(tableList.length < 2) return tableList;

  var merged = tableList[0];

  for(var i = 1; tableList[i] != null; i++) {
    merged = TableOperators.mergeDataTables(merged, tableList[i]);
  }

  return merged;
};

/**
 * creates a new table with an updated first List of elements and an added new numberList with the new values
 */
TableOperators.mergeDataTables = function(table0, table1) {
  if(table1[0].length === 0) {
    var merged = table0.clone();
    merged.push(ListGenerators.createListWithSameElement(table0[0].length, 0));
    return merged;
  }

  var table = new Table();
  var list = ListOperators.concatWithoutRepetitions(table0[0], table1[0]);

  var nElements = list.length;

  var nNumbers0 = table0.length - 1;
  var nNumbers1 = table1.length - 1;

  var numberTable0 = new NumberTable();
  var numberTable1 = new NumberTable();

  var index;

  var i, j;

  for(i = 0; i < nElements; i++) {
    index = table0[0].indexOf(list[i]);
    if(index > -1) {
      for(j = 0; j < nNumbers0; j++) {
        if(i === 0) {
          numberTable0[j] = new NumberList();
          numberTable0[j].name = table0[j + 1].name;
        }
        numberTable0[j][i] = table0[j + 1][index];
      }
    } else {
      for(j = 0; j < nNumbers0; j++) {
        if(i === 0) {
          numberTable0[j] = new NumberList();
          numberTable0[j].name = table0[j + 1].name;
        }
        numberTable0[j][i] = 0;
      }
    }

    index = table1[0].indexOf(list[i]);
    if(index > -1) {
      for(j = 0; j < nNumbers1; j++) {
        if(i === 0) {
          numberTable1[j] = new NumberList();
          numberTable1[j].name = table1[j + 1].name;
        }
        numberTable1[j][i] = table1[j + 1][index];
      }
    } else {
      for(j = 0; j < nNumbers1; j++) {
        if(i === 0) {
          numberTable1[j] = new NumberList();
          numberTable1[j].name = table1[j + 1].name;
        }
        numberTable1[j][i] = 0;
      }
    }
  }

  table[0] = list;

  for(i = 0; numberTable0[i] != null; i++) {
    table.push(numberTable0[i]);
  }
  for(i = 0; numberTable1[i] != null; i++) {
    table.push(numberTable1[i]);
  }
  return table;
};

/**
 * From two DataTables creates a new DataTable with combined elements in the first List, and added values in the second
 * @param {Object} table0
 * @param {Object} table1
 * @return {Table}
 */
TableOperators.fusionDataTables = function(table0, table1) {
  var table = table0.clone();
  var index;
  var element;
  for(var i = 0; table1[0][i] != null; i++) {
    element = table1[0][i];
    index = table[0].indexOf(element);
    if(index == -1) {
      table[0].push(element);
      table[1].push(table1[1][i]);
    } else {
      table[1][index] += table1[1][i];
    }
  }
  return table;
};

/**
 * @todo finish docs
 */
TableOperators.completeTable = function(table, nRows, value) {
  value = value == null ? 0 : value;

  var newTable = new Table();
  newTable.name = table.name;

  var list;
  var newList;
  var j;

  for(var i = 0; i < table.length; i++) {
    list = table[i];
    newList = list == null ? ListOperators.getNewListForObjectType(value) : instantiateWithSameType(list);
    newList.name = list == null ? '' : list.name;
    for(j = 0; j < nRows; j++) {
      newList[j] = (list == null || list[j] == null) ? value : list[j];
    }
    newTable[i] = newList;
  }
  return newTable;
};

/**
 * filters a Table keeping the NumberLists
 * @param  {Table} table to filter<
 * @return {NumberTable}
 * tags:filter
 */
TableOperators.getNumberTableFromTable = function(table) {
  if(table == null ||  table.length <= 0) {
    return null;
  }

  var i;
  var newTable = new NumberTable();
  newTable.name = table.name;
  for(i = 0; table[i] != null; i++) {
    if(table[i].type == "NumberList") newTable.push(table[i]);
  }
  return newTable;
};

/**
 * calculates de information gain of all variables in a table and a supervised variable
 * @param  {Table} variablesTable
 * @param  {List} supervised
 * @return {NumberList}
 * tags:ds
 */
TableOperators.getVariablesInformationGain = function(variablesTable, supervised) {
  if(variablesTable == null) return null;

  var igs = new NumberList();
  variablesTable.forEach(function(feature) {
    igs.push(ListOperators.getInformationGain(feature, supervised));
  });
  return igs;
};

/**
 * @todo finish docs
 */
TableOperators.splitTableByCategoricList = function(table, list) {
  if(table == null || list == null) return null;

  var childrenTable;
  var tablesList = new List();
  var childrenObject = {};

  list.forEach(function(element, i) {
    childrenTable = childrenObject[element];
    if(childrenTable == null) {
      childrenTable = new Table();
      childrenObject[element] = childrenTable;
      tablesList.push(childrenTable);
      table.forEach(function(list, j) {
        childrenTable[j] = new List();
        childrenTable[j].name = list.name;
      });
      childrenTable._element = element;
    }
    table.forEach(function(list, j) {
      childrenTable[j].push(table[j][i]);
    });
  });

  return tablesList;
};

/**
 * builds a decision tree based on a table made of categorical lists, a list (the values of a supervised variable), and a value from the supervised variable. The result is a tree that contains on its leaves different populations obtained by iterative filterings by category values, and that contain extremes probabilities for having or not the valu ein the supervised variable.
 * [!] this method only works with categorical lists (in case you have lists with numbers, find a way to simplify by ranges or powers)
 * @param  {Table} variablesTable predictors table
 * @param  {Object} supervised variable: list, or index (number) in the table (in which case the list will be removed from the predictors table)
 * @param {Object} supervisedValue main value in supervised list (associated with blue)
 *
 * @param {Number} min_entropy minimum value of entropy on nodes (0.2 default)
 * @param {Number} min_size_node minimum population size associated with node (10 default)
 * @param {Number} min_info_gain minimum information gain by splitting by best feature (0.002 default)
 * @param {Boolean} generatePattern generates a pattern of points picturing proprtion of followed class in node
 * @param {ColorScale} colorScale to assign color associated to probability (default: blueToRed)
 * @return {Tree} tree with aditional information on its nodes, including: probablity, color, entropy, weight, lift
 * tags:ds
 */
TableOperators.buildDecisionTree = function(variablesTable, supervised, supervisedValue, min_entropy, min_size_node, min_info_gain, generatePattern, colorScale){
  if(variablesTable == null ||  supervised == null || supervisedValue == null) return;

  if(colorScale==null) colorScale = ColorScales.blueWhiteRed;

  if(typeOf(supervised)=='number'){
    var newTable = variablesTable.getWithoutElementAtIndex(supervised);
    supervised = variablesTable[supervised];
    variablesTable = newTable;
  }

  min_entropy = min_entropy == null ? 0.2 : min_entropy;
  min_size_node = min_size_node || 10;
  min_info_gain = min_info_gain || 0.002;

  var indexes = NumberListGenerators.createSortedNumberList(supervised.length);
  var tree = new Tree();

  TableOperators._buildDecisionTreeNode(tree, variablesTable, supervised, 0, min_entropy, min_size_node, min_info_gain, null, null, supervisedValue, indexes, generatePattern, colorScale);

  return tree;
};


/**
 * @ignore
 */
TableOperators._buildDecisionTreeNode = function(tree, variablesTable, supervised, level, min_entropy, min_size_node, min_info_gain, parent, value, supervisedValue, indexes, generatePattern, colorScale) {
  //if(level < 4) c.l('\nlevel', level);
  var entropy = ListOperators.getListEntropy(supervised, supervisedValue);

  //if(level < 4) c.l('entropy, min_entropy', entropy, min_entropy);
  var maxIg = 0;
  var iBestFeature = 0;
  var informationGains = 0;

  if(entropy >= min_entropy) {
    informationGains = TableOperators.getVariablesInformationGain(variablesTable, supervised);
    informationGains.forEach(function(ig, i){
      if(ig > maxIg) {
        maxIg = ig;
        iBestFeature = i;
      }
    });
  }

  var subDivide = entropy >= min_entropy && maxIg > min_info_gain && supervised.length >= min_size_node;

  var id = tree.nodeList.getNewId();
  var name = (value == null ? '' : value + ':') + (subDivide ? variablesTable[iBestFeature].name : 'P=' + supervised._biggestProbability + '(' + supervised._mostRepresentedValue + ')');
  var node = new Node(id, name);

  tree.addNodeToTree(node, parent);

  if(parent == null) {
    tree.informationGainTable = new Table();
    tree.informationGainTable[0] = variablesTable.getNames();
    if(informationGains) {
      tree.informationGainTable[1] = informationGains.clone();
      tree.informationGainTable = tree.informationGainTable.getListsSortedByList(informationGains, false);
    }
  }

  node.entropy = entropy;
  node.weight = supervised.length;
  node.supervised = supervised;
  node.indexes = indexes;
  node.value = value;
  node.mostRepresentedValue = supervised._mostRepresentedValue;
  node.biggestProbability = supervised._biggestProbability;
  node.valueFollowingProbability = supervised._P_valueFollowing;
  node.lift = node.valueFollowingProbability / tree.nodeList[0].valueFollowingProbability; //Math.log(node.valueFollowingProbability/tree.nodeList[0].valueFollowingProbability)/Math.log(2);


  // if(level < 4) {
  //   c.l('supervised.countElement(supervisedValue)', supervised.countElement(supervisedValue));
  //   c.l('value', value);
  //   c.l('name', name);
  //   c.l('supervised.name', supervised.name);
  //   c.l('supervised.length', supervised.length);
  //   c.l('supervisedValue', supervisedValue);
  //   c.l('supervised._biggestProbability, supervised._P_valueFollowing', supervised._biggestProbability, supervised._P_valueFollowing);
  //   c.l('node.valueFollowingProbability (=supervised._P_valueFollowing):', node.valueFollowingProbability);
  //   c.l('tree.nodeList[0].valueFollowingProbability', tree.nodeList[0].valueFollowingProbability);
  //   c.l('node.biggestProbability (=_biggestProbability):', node.biggestProbability);
  //   c.l('node.mostRepresentedValue:', node.mostRepresentedValue);
  //   c.l('node.mostRepresentedValue==supervisedValue', node.mostRepresentedValue == supervisedValue);
  // }

  node._color = colorScale(node.valueFollowingProbability); //TableOperators._decisionTreeColorScale(1 - node.valueFollowingProbability, colorScale);

  if(generatePattern) {
    var newCanvas = document.createElement("canvas");
    newCanvas.width = 150;
    newCanvas.height = 100;
    var newContext = newCanvas.getContext("2d");
    newContext.clearRect(0, 0, 150, 100);

    TableOperators._decisionTreeGenerateColorsMixture(newContext, 150, 100, ['blue', 'red'],
			node.mostRepresentedValue==supervisedValue?
				[Math.floor(node.biggestProbability*node.weight), Math.floor((1-node.biggestProbability)*node.weight)]
				:
				[Math.floor((1-node.biggestProbability)*node.weight), Math.floor(node.biggestProbability*node.weight)]
    );

    var img = new Image();
    img.src = newCanvas.toDataURL();
    node.pattern = newContext.createPattern(img, "repeat");
  }


  if(!subDivide){
    return node;
  }

  node.bestFeatureName = variablesTable[iBestFeature].name;
  node.bestFeatureName = node.bestFeatureName === "" ? "list "+ iBestFeature:node.bestFeatureName;
  node.iBestFeature = iBestFeature;
  node.informationGain = maxIg;

  var expanded = variablesTable.concat([supervised, indexes]);

  var tables = TableOperators.splitTableByCategoricList(expanded, variablesTable[iBestFeature]);
  var childTable;
  var childSupervised;
  var childIndexes;

  tables.forEach(function(expandedChild) {
    childTable = expandedChild.getSubList(0, expandedChild.length - 3);
    childSupervised = expandedChild[expandedChild.length - 2];
    childIndexes = expandedChild[expandedChild.length - 1];
    TableOperators._buildDecisionTreeNode(tree, childTable, childSupervised, level + 1, min_entropy, min_size_node, min_info_gain, node, expandedChild._element, supervisedValue, childIndexes, generatePattern, colorScale);
  });

  node.toNodeList = node.toNodeList.getSortedByProperty('valueFollowingProbability', false);

  return node;
};

// TableOperators._decisionTreeColorScale = function(value, colorScale) {
//   if(colorScale) return colorScale(value);
//   return ColorScales.blueWhiteRed

//   // var rr = value < 0.5 ? Math.floor(510 * value) : 255;
//   // var gg = value < 0.5 ? Math.floor(510 * value) : Math.floor(510 * (1 - value));
//   // var bb = value < 0.5 ? 255 : Math.floor(510 * (1 - value));

//   // return 'rgb(' + rr + ',' + gg + ',' + bb + ')';
// };

/**
 * @ignore
 */
TableOperators._decisionTreeGenerateColorsMixture = function(ctxt, width, height, colors, weights){
  var x, y, i; //, rgb;
  var allColors = ListGenerators.createListWithSameElement(weights[0], colors[0]);

  for(i = 1; colors[i] != null; i++) {
    allColors = allColors.concat(ListGenerators.createListWithSameElement(weights[i], colors[i]));
  }

  for(x = 0; x < width; x++) {
    for(y = 0; y < height; y++) {
      i = (x + y * width) * 4;
      ctxt.fillStyle = allColors.getRandomElement();
      ctxt.fillRect(x, y, 1, 1);
    }
  }
};


/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableOperators.getReport = function(table, level) {
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
  var lengths = table.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  text += ident + "name: " + table.name;
  text += ident + "type: " + table.type;
  text += ident + "number of lists: " + table.length;

  text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

  if(sameLengths) {
    text += ident + "lists length: " + table[0].length;
  } else {
    text += ident + "min length: " + minLength;
    text += ident + "max length: " + maxLength;
    text += ident + "average length: " + averageLength;
    text += ident + "all lengths: " + lengths.join(", ");
  }

  var names = table.getNames();
  var types = table.getTypes();

  text += ident + "--";
  names.forEach(function(name, i){
    text += ident + i + ": " + name + " ["+TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"]";
  });
  text += ident + "--";

  var sameTypes = types.allElementsEqual();
  if(sameTypes) {
    text += ident + "types of all lists: " + types[0];
  } else {
    text += ident + "types: " + types.join(", ");
  }
  text += ident + "names: " + names.join(", ");

  if(table.length < 101) {
    text += ident + ident + "--------lists reports---------";

    var i;
    for(i = 0; table[i] != null; i++) {
      text += "\n" + ident + ("(" + (i) + "/0-" + (table.length - 1) + ")");
      try{
         text += ListOperators.getReport(table[i], 1);
      } catch(err){
        text += ident + "[!] something wrong with list " + err;
      }
    }
  }

  if(table.length == 2) {
    text += ident + ident + "--------lists comparisons---------";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberListOperators.covariance(table[0], table[1]);
      text += ident + "Pearson product moment correlation: " + NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+ListOperators.getInformationGain(table[0], table[1]);
      text += ident + "information gain when segmenting second list by the first: "+ListOperators.getInformationGain(table[1], table[0]);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

/**
 * Generates a string containing details about the current state
 * of the Table. Useful for outputing to the console for debugging.
 * @param {Table} table Table to generate report on.
 * @param {Number} level If greater then zero, will indent to that number of spaces.
 * @return {String} Description String.
 */
TableOperators.getReportHtml = function(table,level) {
  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  var lengths = table.getLengths();
  var minLength = lengths.getMin();
  var maxLength = lengths.getMax();
  var averageLength = (minLength + maxLength) * 0.5;
  var sameLengths = minLength == maxLength;

  var text = "<b>" +( level > 0 ? (ident + "<font style=\"font-size:16px\">table report</f>") : "<font style=\"font-size:18px\">table report</f>" ) + "</b>";

  if(table.length === 0) {
    text += ident + "this table has no lists";
    return text;
  }

  if(table.name){
    text += ident + "name: <b>" + table.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + table.type + "</b>";
  text += ident + "number of lists: <b>" + table.length + "</b>";

  text += ident + "all lists have same length: <b>" + (sameLengths ? "true" : "false") + "</b>";

  if(sameLengths) {
    text += ident + "lists length: <b>" + table[0].length + "</b>";
  } else {
    text += ident + "min length: <b>" + minLength + "</b>";
    text += ident + "max length: <b>" + maxLength + "</b>";
    text += ident + "average length: <b>" + averageLength + "</b>";
    text += ident + "all lengths: <b>" + lengths.join(", ") + "</b>";
  }

  var names = table.getNames();
  var types = table.getTypes();

  text += "<hr>";
  names.forEach(function(name, i){
    text += ident + "<font style=\"font-size:10px\">" +i + ":</f><b>" + name + "</b> <font color=\""+getColorFromDataModelType(types[i])+ "\">" + TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"</f>";
  });
  text += "<hr>";

  var sameTypes = types.allElementsEqual();
  if(sameTypes) {
    text += ident + "types of all lists: " + "<b>" + types[0] + "</b>";
  } else {
    text += ident + "types: ";
    types.forEach(function(type, i){
      text += "<b><font color=\""+getColorFromDataModelType(type)+ "\">" + type+"</f></b>";
      if(i<types.length-1) text += ", ";
    });
  }
  text += "<br>" + ident + "names: <b>" + names.join("</b>, <b>") + "</b>";


  //list by list

  if(table.length < 501) {
    text += "<hr>";
    text +=  ident + "<font style=\"font-size:16px\"><b>lists reports</b></f>";

    var i;
    for(i = 0; table[i] != null; i++) {
      text += "<br>" + ident + i + ": " + (table[i].name?"<b>"+table[i].name+"</b>":"<i>no name</i>");
      try{
         text += ListOperators.getReportHtml(table[i], 1);
      } catch(err){
        text += ident + "[!] something wrong with list <font style=\"font-size:10px\">:" + err + "</f>";
        console.log('getReportHtml err', err);
      }
    }
  }

  if(table.length == 2) {//TODO:finish
    text += "<hr>";
    text += ident + "<b>lists comparisons</b>";
    if(table[0].type=="NumberList" && table[1].type=="NumberList"){
      text += ident + "covariance:" + NumberOperators.numberToString(NumberListOperators.covariance(table[0], table[1]), 4);
      text += ident + "Pearson product moment correlation: " + NumberOperators.numberToString(NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]), 4);
    } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
      var nUnion = ListOperators.union(table[0], table[1]).length;
      text += ident + "union size: " + nUnion;
      var intersected = ListOperators.intersection(table[0], table[1]);
      var nIntersection = intersected.length;
      text += ident + "intersection size: " + nIntersection;

      if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
        text += ident + "[!] both lists contain the same non repeated elements";
      } else {
        if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
        if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
      }
      text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
    }
    //check for 1-1 matches, number of pairs, categorical, sub-categorical
    var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

    switch(subCategoryCase){
      case 0:
        text += ident + "no categorical relation found between lists";
        break;
      case 1:
        text += ident + "[!] both lists are categorical identical";
        break;
      case 2:
        text += ident + "[!] first list is subcategorical to second list";
        break;
      case 3:
        text += ident + "[!] second list is subcategorical to first list";
        break;
    }

    if(subCategoryCase!=1){
      text += ident + "information gain when segmenting first list by the second: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[0], table[1]), 4);
      text += ident + "information gain when segmenting second list by the first: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[1], table[0]), 4);
    }
  }

  ///add ideas to: analyze, visualize

  return text;
};

TableOperators.getReportObject = function() {}; //TODO
