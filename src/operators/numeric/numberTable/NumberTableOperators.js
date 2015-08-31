import NumberList from "src/dataStructures/numeric/NumberList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import { instantiateWithSameType } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc NumberTable Operators
 *
 * @namespace
 * @category numbers
 */
function NumberTableOperators() {}
export default NumberTableOperators;

/**
 * a NumberTable as a matrix: has n lists, each with m values, being a mxn matrix
 * the following NumberTable:
 * [ [0, 4, 7], [3, 8, 1] ]
 * is notated:
 * | 0   4   7 |
 * | 3   8   1 |
 */



/**
 * normlizes each NumberList to min and max values (redundant with NumberTable.getNumberListsNormalized)
 * @param  {NumberTable} numberTable
 * @return {NumberTable}
 * tags:statistics,deprecated
 */
NumberTableOperators.normalizeLists = function(numberTable) {//TODO: redundant with NumberTable.getNumberListsNormalized
  return numberTable.getNumberListsNormalized();
};

/**
 * @todo finish docs
 */
NumberTableOperators.normalizeListsToMax = function(numberTable) {
  var newNumberTable = new NumberTable();
  newNumberTable.name = numberTable.name;
  var i;
  for(i = 0; numberTable[i] != null; i++) {
    newNumberTable[i] = numberTable[i].getNormalizedToMax();
  }
  return newNumberTable;
};

/**
 * smooth numberLists by calculating averages with neighbors
 * @param  {NumberTable} numberTable
 *
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {List} numberList of indexes, or list of numberTables 
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
 * return k means for k clusters of rows
 * @param  {NumberTable} numberTable
 *
 * @param  {Number} k number of means
 * @param  {Number} returnIndexesMode return mode:<br>0:return list of lists of indexes of rows (default)<br>1:return means<br>return list of sub-tables<br>return object with list indexes (of clustered rows), means and subtables
 * @return {Object} numberTable with numberLists of indexes, numberTable with means, list of numberTables of clustered rows, object with all the previous
 * tags:statistics
 */
NumberTableOperators.kMeans = function(numberTable, k, returnIndexesMode){
  if(numberTable == null || numberTable[0]==null || k == null || k <= 0 || numberTable.getLengths().getInterval().getAmplitude()!==0) return null;

  returnIndexesMode = returnIndexesMode==null?0:returnIndexesMode;

  var intervals = numberTable.getIntervals();

  var clusters;// = returnIndexesMode?new NumberList():new NumberTable();

  switch(returnIndexesMode){
    case 0://return list of lists of indexes of rows
      clusters = new NumberTable();
      break;
    case 1://return means
      clusters = new NumberTable();
      break;
    case 2://return list of sub-tables
      clusters = new List();
      break;
    case 3://return object with list of indexes of rows, means and list of sub-tables
      clusters = {indexes:new NumberTable(), means:new NumberTable(), subtables:new List()};
      break;
  }

  var i, j, l;
  var jK;
  var row;
  var d;
  var dMin;
  var n;
  var N = 1000;
  var means = new NumberTable();
  var length = numberTable.length;
  var nRows = numberTable[0].length;
  var rows = numberTable.getTransposed();
  var initdMin = 99999999;
  var nRowsMean;
  var meanRows;
  var newMean;

  for(j = 0; j < k; j++) {
    clusters[j] = new NumberList();
    means[j] = new NumberList();
    for(i = 0; i<length; i++){
      means[j].push(intervals[i].getRandom());
    }
  }

  for(n = 0; n < N; n++) {
    //iterations

    //for each row finds its closer mean
    for(i = 0; i<nRows; i++) {
      row = rows[i];
      dMin = initdMin;
      jK = 0;

      for(j = 0; j < k; j++) {
        d = row.distance(means[j]);
        if(d < dMin) {
          dMin = d;
          jK = j;
        }
      }

      //closer mean to row i is in index jK
      //row i assigned to cluster jK
      clusters[jK].push(i);
    }

    //for each mean it calculates its new values, based on its recently assigned rows
    for(j=0; j<k; j++){
      meanRows = clusters[j];
      nRowsMean = meanRows.length;
      means[j] = new NumberList();
      newMean = means[j];

      row = rows[meanRows[0]];
      for(l=0; l<length; l++){
        newMean[k] = row[l]/nRowsMean;
      }

      for(i=1; i<nRowsMean; i++){
        row = rows[meanRows[i]];
        for(l=0; l<length; l++){
            newMean[l] += row[l]/nRowsMean;
        }
      }
    }

  }

  switch(returnIndexesMode){
    case 0://return list of indexes of rows
      return clusters;
    case 1://return means
      return means;
    case 2://return list of sub-tables
      //TODO:build and return
      break;
    case 3://return object with list of indexes of rows, means and list of sub-tables
      return {indexes:clusters, means:means, subtables:null};
  }
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
    numberTable[0].forEach(function(val, i) {//TODO: make it more efficient by using for
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

    //console.log('vector:', vector[0], vector[1], 'colsest:', Math.floor(100000000 * table[1][0]), Math.floor(100000000 * table[1][1]), 'categories', propertyList[table[0][0]], propertyList[table[0][1]], 'result', combination / sumD);

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
  if(n===0 || m===0 || n!=numberTable1[0].length || m!=numberTable1.length) return;

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
