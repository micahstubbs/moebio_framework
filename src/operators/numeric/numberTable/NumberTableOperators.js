import NumberList from "src/dataStructures/numeric/NumberList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import Relation from "src/dataStructures/structures/elements/Relation";
import Node from "src/dataStructures/structures/elements/Node";
import Network from "src/dataStructures/structures/networks/Network";
import { instantiateWithSameType } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc NumberTable Operators
 *
 * a NumberTable as a matrix: has n lists, each with m values, being a mxn matrix
 * the following NumberTable:
 * [ [0, 4, 7], [3, 8, 1] ]
 * is notated:
 * | 0   4   7 |
 * | 3   8   1 |
 *
 * @namespace
 * @category numbers
 */
function NumberTableOperators() {}
export default NumberTableOperators;

/**
 * normalizes the table to its maximal value
 *
 * @param {NumberTable} numbertable NumberTable.
 * @param  {Number} factor optional factor
 * @return {NumberTable}
 * tags:normalization
 */
NumberTableOperators.normalizeTableToMax = function(numbertable, factor) {
  factor = factor == null ? 1 : factor;

  var newTable = new NumberTable();
  var i;
  var antimax = factor / numbertable.getMax();
  for(i = 0; numbertable[i] != null; i++) {
    newTable[i] = numbertable[i].factor(antimax);
  }
  newTable.name = numbertable.name;
  return newTable;
};

/**
 * returns a table with having normalized all the numberLists
 *
 * @param {NumberTable} numbertable NumberTable.
 * @param  {factor} factor optional factor
 * @return {NumberTable}
 * tags:normalization
 */
NumberTableOperators.normalizeLists = function(numbertable, factor) {
  factor = factor == null ? 1 : factor;

  var newTable = new NumberTable();
  var i;
  for(i = 0; numbertable[i] != null; i++) {
    var numberlist = numbertable[i];
    newTable[i] = NumberListOperators.normalized(numberlist, factor);
  }
  newTable.name = numbertable.name;
  return newTable;
};

/**
 * @todo write docs
 * @param {NumberTable} numbertable NumberTable.
 */
NumberTableOperators.normalizeListsToMax = function(numbertable, factorValue) {
  var newTable = new NumberTable();
  for(var i = 0; numbertable[i] != null; i++) {
    var numberlist = numbertable[i];
    newTable[i] = NumberListOperators.normalizedToMax(numberlist, factorValue);
  }
  newTable.name = numbertable.name;
  return newTable;
};

/**
 * @todo write docs
 * @param {NumberTable} numbertable NumberTable.
 */
NumberTableOperators.normalizeListsToSum = function(numbertable) {
  var newTable = new NumberTable();
  for(var i = 0; numbertable[i] != null; i++) {
    var numberlist = numbertable[i];
    newTable[i] = NumberListOperators.normalizedToSum(numberlist);
  }
  newTable.name = numbertable.name;
  return newTable;
};

/**
 * smooth numberLists by calculating averages with neighbors
 * @param  {NumberTable} numberTable
 *
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {NumberTable}
 * tags:statistics
 */
NumberTableOperators.averageSmootherOnLists = function(numberTable, intensity, nIterations) {
  if(numberTable == null) return;

  intensity = intensity || 0.5;
  nIterations = nIterations || 1;

  var newNumberTable = new NumberTable();
  newNumberTable.name = numberTable.name;
  numberTable.forEach(function(nL, i) {
    newNumberTable[i] = NumberListOperators.averageSmoother(numberTable[i], intensity, nIterations);
  });
  return newNumberTable;
};

/**
 * builds a k-nearest neighbors function, that calculates a class membership or a regression, taking the vote or average of the k nearest instances, using Euclidean distance, and applies it to a list of points, see: http://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm
 * <br>[!] regression still not built
 * @param  {NumberTable} numberTable
 * @param  {List} propertyList categories or values
 *
 * @param  {Polygon} vectorList optional list of points to be tested, if provided classes or regressions are calculated, if not the function is returned
 * @param  {Number} k number of neighbors
 * @param  {Boolean} calculateClass if true propertyList is a list of categories for membership calculation, if false a numberList for regression
 * @param {Number} matrixN if provided, the result will be a numberTable with values in a grid in the numberTable ranges
 * @return {Object} kNN Function or a matrix (grid) of values if matrixN is provided, or classes or values from points if vectorList is provided
 * tags:ds
 */
NumberTableOperators.kNN = function(numberTable, propertyList, vectorList, k, calculateClass, matrixN) {
  if(numberTable == null ||  propertyList == null) return null;

  k = k || 1;
  calculateClass = calculateClass == null ? true : calculateClass;

  var i, j;

  var fKNN = function(vector) {
    var i, j;
    var d2;

    var table = new NumberTable();

    table[0] = new NumberList();
    table[1] = new NumberList();
    numberTable[0].forEach(function(val, i) {
      d2 = 0;
      numberTable.forEach(function(nList, j) {
        d2 += Math.pow(nList[i] - vector[j], 2);
      });
      if(table[1].length < k || table[1][k - 1] > d2) {
        var inserted = false;
        for(j = 0; table[1][j] < k; j++) {
          if(d2 < table[1][j]) {
            table[1].splice(j, 0, d2);
            table[0].splice(j, 0, i);
            inserted = true;
            break;
          }
        }
        if(!inserted && table[1].length < k) {
          table[1].push(d2);
          table[0].push(i);
        }
      }
    });



    //table = table.getListsSortedByList(table[1]);

    if(calculateClass) {
      var classTable = new Table();
      classTable[0] = new List();
      classTable[1] = new NumberList();
      for(i = 0; i < k; i++) {
        var clas = propertyList[table[0][i]];
        var index = classTable[0].indexOf(clas);
        if(index == -1) {
          classTable[0].push(clas);
          classTable[1].push(1);
        } else {
          classTable[1][index]++;
        }
      }
      var max = classTable[1][0];
      var iMax = 0;
      classTable[1].slice(1).forEach(function(val, i) {
        if(val > max) {
          max = val;
          iMax = i + 1;
        }
      });
      return classTable[0][iMax];
    }

    var val;
    var combination = 0;
    var sumD = 0;
    for(i = 0; i < k; i++) {
      val = propertyList[table[0][i]];
      combination += val / (table[1][i] + 0.000001);
      sumD += (1 / (table[1][i] + 0.000001));
    }

    console.log('vector:', vector[0], vector[1], 'colsest:', Math.floor(100000000 * table[1][0]), Math.floor(100000000 * table[1][1]), 'categories', propertyList[table[0][0]], propertyList[table[0][1]], 'result', combination / sumD);

    return combination / sumD;

    //regression
    //…
  };

  if(vectorList == null) {

    if(matrixN != null && matrixN > 0) {
      var propertiesNumbers = {};
      var n = 0;

      propertyList.forEach(function(val) {
        if(propertiesNumbers[val] == null) {
          propertiesNumbers[val] = n;
          n++;
        }
      });

      var p;
      var matx = new NumberTable();
      var ix = numberTable[0].getMinMaxInterval();
      var minx = ix.x;
      var kx = ix.getAmplitude() / matrixN;
      var iy = numberTable[1].getMinMaxInterval();
      var miny = iy.x;
      var ky = iy.getAmplitude() / matrixN;

      for(i = 0; i < matrixN; i++) {
        matx[i] = new NumberList();

        for(j = 0; j < matrixN; j++) {
          p = [
            minx + kx * i,
            miny + ky * j
          ];

          fKNN(p);

          matx[i][j] = calculateClass ? propertiesNumbers[fKNN(p)] : fKNN(p);
        }
      }
      //return matrix
      return matx;
    }

    //return Function
    return fKNN;
  }

  var results = instantiateWithSameType(propertyList);

  vectorList.forEach(function(vector) {
    results.push(fKNN(vector));
  });

  //return results
  return results;
};



//TODO: move to NumberTableConversions
/**
 * @todo finish docs
 */
NumberTableOperators.numberTableToNetwork = function(numberTable, method, tolerance) {
  tolerance = tolerance == null ? 0 : tolerance;

  var network = new Network();

  var list0;
  var list1;

  var i;
  var j;

  var node0;
  var node1;
  var relation;


  switch(method) {
    case 0: // standard deviation

      var sd;
      var w;

      for(i = 0; numberTable[i + 1] != null; i++) {
        list0 = numberTable[i];

        if(i === 0) {
          node0 = new Node(list0.name, list0.name);
          network.addNode(node0);
        } else {
          node0 = network.nodeList[i];
        }


        for(j = i + 1; numberTable[j] != null; j++) {
          list1 = numberTable[j];

          if(i === 0) {
            node1 = new Node(list1.name, list1.name);
            network.addNode(node1);
          } else {
            node1 = network.nodeList[j];
          }



          list1 = numberTable[j];
          sd = NumberListOperators.standardDeviationBetweenTwoNumberLists(list0, list1);

          w = 1 / (1 + sd);

          if(w >= tolerance) {
            relation = new Relation(i + "_" + j, node0.name + "_" + node1.name, node0, node1, w);
            network.addRelation(relation);
          }
        }
      }

      break;
    case 1:
      break;
    case 2:
      break;
  }

  return network;
};


/**
 * calculates the matrix product of two Numbertables
 * @param  {NumberTable} numberTable0 first numberTable
 * @param  {NumberTable} numberTable1 second numberTable
 * @return {NumberTable} result
 */
NumberTableOperators.product = function(numberTable0, numberTable1){
  if(numberTable0==null || numberTable1==null) return;
  var n = numberTable0.length;
  var m = numberTable0[0].length;
  if(n === 0 || m === 0 || n!=numberTable1[0].length || m!=numberTable1.length) return;

  var newTable = new NumberTable();
  var i, j, k;
  var val;

  for(i=0; i<n; i++){
    newTable[i] = new NumberList();
    for(j=0; j<n; j++){
      val = 0;
      for(k=0; k<m; k++){
        val+=numberTable0[i][k]*numberTable1[k][j];
      }
      newTable[i][j] = val;
    }
  }

  return newTable;
};



/**
 * calculates the covariance matrix
 * @param  {NumberTable} numberTable
 * @return {NumberTable}
 * tags:statistics
 */
NumberTableOperators.getCovarianceMatrix = function(numberTable){//TODO:build more efficient method
  if(numberTable==null) return;
  return NumberTableOperators.product(numberTable, numberTable.getTransposed()).factor(1/numberTable.length);
};
