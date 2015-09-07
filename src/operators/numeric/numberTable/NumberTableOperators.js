import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
import NumberList from "src/dataStructures/numeric/NumberList";
import ColorList from "src/dataStructures/graphic/ColorList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import ListOperators from "src/operators/lists/ListOperators";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
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
  var numberlist
  var l = numbertable.length;
  var i;
  for(i = 0; i<l; i++) {
    numberlist = numbertable[i];
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
  var numberlist;
  var l = numbertable.length;
  var i;
  for(i = 0; i<l; i++) {
    numberlist = numbertable[i];
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
 * return k means for k clusters of rows (waiting to be tested)
 * @param  {NumberTable} numberTable
 * @param  {Number} k number of means
 *
 * @param  {Number} returnIndexesMode return mode:<br>0:return list of lists of indexes of rows (default)<br>1:return a list of number of mean, k different values, one per row<br>2:return a list of categorical colors, k different colors, one per row<br>3:return means<br>4:return list of sub-tables<br>5:return object with all the previous
 * @param  {Number} number of iterations (1000 by default)
 * @return {Object} result (list, numberList, colorList, numberTable or object)
 * tags:statistics,nontested
 */
NumberTableOperators.kMeans = function(numberTable, k, returnIndexesMode, N){
  if(numberTable == null || numberTable[0]==null || k == null || k <= 0 || numberTable.getLengths().getInterval().getAmplitude()!==0) return null;

  returnIndexesMode = returnIndexesMode==null?0:returnIndexesMode;
  N = (N==null || !(N>0))?1000:N;

  var clusters = new NumberTable();// = returnIndexesMode?new NumberList():new NumberTable();

  var i, j, l;
  var jK;
  var row;
  var d;
  var dMin;
  var n;
  var means = new NumberTable();
  var length = numberTable.length;
  var nRows = numberTable[0].length;
  var rows = numberTable.getTransposed();
  var initdMin = 99999999;
  var nRowsMean;
  var meanRowsIndexes;
  var newMean;

  if(k>=rows.length) return rows;

  var equalToPreviousMean = function(row, meansSoFar){
    var kSoFar = meansSoFar.length;
    for(i=0; i<kSoFar; i++){
      if( ListOperators.containSameElements(row, meansSoFar[i]) ) return true;
    }
    return false;
  };


  //initial means (Forgy method, picking random rows)

  for(j = 0; j < k; j++) {
    row = rows.getRandomElement();

    while(equalToPreviousMean(row, means)){
      row = rows.getRandomElement();
    }

    means[j] = row.clone();

    //console.log('initial mean', means[j].join(', '));
  }



  for(n = 0; n < N; n++) {
    //iterations

    //clean clusters
    for(j = 0; j < k; j++) {
      clusters[j] = new NumberList();
    }

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

      //console.log('i, jK', i, jK);

      //closer mean to row i is in index jK
      //row i assigned to cluster jK
      clusters[jK].push(i);
    }

    //console.log('clusters.getLengths()', clusters.getLengths());

    //for each mean it calculates its new values, based on its recently assigned rows
    for(j=0; j<k; j++){
      meanRowsIndexes = clusters[j];
      nRowsMean = meanRowsIndexes.length;
      means[j] = new NumberList();

      newMean = means[j];

      row = rows[meanRowsIndexes[0]];
      //console.log(j, meanRowsIndexes[0], row);

      //each new mean is the average of its rows values
      for(l=0; l<length; l++){
        newMean[l] = row[l]/nRowsMean;
      }
      for(i=1; i<nRowsMean; i++){
        row = rows[meanRowsIndexes[i]];
        for(l=0; l<length; l++){
            newMean[l] += row[l]/nRowsMean;
        }
      }

    }

  }

  // console.log('clusters.getLengths()', clusters.getLengths());
  // console.log('clusters', clusters);

  //prepare results

  var meanNumber;
  var cluster;
  var sizeCluster;


  if(returnIndexesMode==1 || returnIndexesMode==5){
    meanNumber = new NumberList();
    for(i=0; i<k; i++){
      cluster = clusters[i];
      sizeCluster = cluster.length;
      for(j=0; j<sizeCluster; j++){
        meanNumber[cluster[j]] = i;
      }
    }
  }


  var colors;

  if(returnIndexesMode==2 || returnIndexesMode==5){
    colors = new ColorList();
    var catColors = ColorListGenerators.createDefaultCategoricalColorList(k);
    for(i=0; i<k; i++){
      cluster = clusters[i];
      sizeCluster = cluster.length;
      for(j=0; j<sizeCluster; j++){
        colors[cluster[j]] = catColors[i];
      }
    }
  }

  var subTables = new List();

  if(returnIndexesMode==4 || returnIndexesMode==5){
    for(i=0; i<k; i++){
      subTables[i] = new NumberTable();
      subTables[i].name = 'subtable_'+i;
      cluster = clusters[i];
      sizeCluster = cluster.length;
      for(j=0; j<sizeCluster; j++){
        subTables[i].push(rows[cluster[j]]);
      }
      subTables[i] = subTables[i].getTransposed();
    }
  }

  switch(returnIndexesMode){
    case 0://return list of indexes of rows
      return clusters;
    case 1://return a list of number of mean, k different values, one per row
      return meanNumber;
    case 2://return a list of categorical colors, k different colors, one per row
      return colors;
    case 3://return means
      return means;
    case 4://return list of sub-tables
      return subTables;
    case 5://return object with all the previous
      return {indexes:clusters, means:means, meanNumber:meanNumber, colors:colors, subtables:subTables};
  }

  return null;
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
