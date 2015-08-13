import NumberList from "src/dataStructures/numeric/NumberList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import { typeOf } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc NumberList Operators
 *
 * @namespace
 * @category numbers
 */
function NumberListOperators() {}
export default NumberListOperators;

/**
 * Returns true if values in the input NumberList are the same
 * as the values in the current list.
 *
 * @param numberList1 First NumberList to compare.
 * @param numberList2 Second NumberList to compare.
 * @return {Boolean} True if all values in both lists match.
 */
NumberListOperators.isEquivalent = function(numberList1, numberList2) {
  if(numberList1.length !== numberList2.length) {
    return false;
  }

  for(var i = 0; numberList1[i] != null; i++) {
    if(numberList1[i] != numberList2[i]) return false;
  }
  return true;
};

/**
 * Adds a value or values in a NumberList to the current list.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the sum of the original value and this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the sum of the original value and the
 * value at the same index in the input list.
 *
 * @param {NumberList} nl NumberList to add to.
 * @param {Number|NumberList} object Input value to add to the list.
 * @return {NumberList}
 */
NumberListOperators.add = function(nl, object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] + object;
      }
      break;
    case 'NumberList':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] + object[i % object.length];
      }
      break;
  }

  newNumberList.name = nl.name;
  return newNumberList;
};

/**
 * Subtracts a value or values in a NumberList from the current list.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the original value minus this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the original value minus the
 * value at the same index in the input list.
 *
 * @param {NumberList} nl NumberList to add to.
 * @param {Number|NumberList} object Input value to subract from the list.
 * @return {NumberList}
 */
NumberListOperators.subtract = function(nl, object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] - object;
      }
      break;
    case 'NumberList':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] - object[i % object.length];
      }
      break;
  }

  newNumberList.name = nl.name;
  return newNumberList;
};

/**
 * Returns a new NumberList with each value divided by a input value or values in a NumberList.
 *
 * If input is a Number, each value of the returned
 * NumberList will be the original value divided by this
 * input value.
 *
 * If the input is a NumberList, each value of the returned
 * NumberList will be the original value divided by the
 * value at the same index in the input list.
 *
 * @param {NumberList} nl NumberList to add to.
 * @param {Number|NumberList} object Input value to divide by the list.
 * @return {NumberList}
 */
NumberListOperators.divide = function(nl, object) {
  var i;
  var newNumberList = new NumberList();
  var type = typeOf(object);

  switch(type) {
    case 'number':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] / object;
      }
      break;
    case 'NumberList':
      for(i = 0; nl[i] != null; i++) {
        newNumberList[i] = nl[i] / object[i % object.length];
      }
      break;
  }

  newNumberList.name = nl.name;
  return newNumberList;
};

/**
 * Returns dot product between two numberLists
 *
 * @param  {NumberList1} numberList NumberList of the same length
 * as numberList2.
 * @param  {NumberList2} numberList NumberList of the same length
 * as numberList1.
 * @return {Number} Dot product between two lists.
 */
NumberListOperators.dotProduct = function(numberList1, numberList2) {
  var sum = 0;
  var i;
  var nElements = Math.min(numberList1.length, numberList2.length);
  for(i = 0; i < nElements; i++) {
    sum += numberList1[i] * numberList2[i];
  }
  return sum;
};

/**
 * Calculates Euclidean distance between two numberLists
 *
 * @param  {NumberList1} numberList NumberList of the same length
 * as numberList2.
 * @param  {NumberList2} numberList NumberList of the same length
 * as numberList1.
 * @return {Number} Summed Euclidean distance between all values.
 * tags:
 */
NumberListOperators.distance = function(numberList1, numberList2) {
  var sum = 0;
  var i;
  var nElements = Math.min(numberList1.length, numberList2.length);
  for(i = 0; i < nElements; i++) {
    sum += Math.pow(numberList1[i] - numberList2[i], 2);
  }
  return Math.sqrt(sum);
};

/**
 * cosine similarity, used to compare two NumberLists regardless of norm (see: http://en.wikipedia.org/wiki/Cosine_similarity)
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.cosineSimilarity = function(numberList0, numberList1) {
  var norms = numberList0.getNorm() * numberList1.getNorm();
  if(norms === 0) return 0;
  return numberList0.dotProduct(numberList1) / norms;
};

/**
 * calculates the covariance between two numberLists
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.covariance = function(numberList0, numberList1) {
  if(numberList0==null || numberList1==null) return;

  var l = Math.min(numberList0.length, numberList1.length);
  var i;
  var av0 = numberList0.getAverage();
  var av1 = numberList1.getAverage();
  var s = 0;

  for(i = 0; i<l; i++) {
    s += (numberList0[i] - av0)*(numberList1[i] - av1);
  }

  return s/l;
};

/**
 * generates a new numberList of desired size smaller than original, with elements claculated as averages of neighbors
 * @param  {NumberList} numberList
 * @param  {Number} newLength length of returned numberList
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.shorten = function(numberList, newLength) {
  if(numberList==null) return null;
  if(newLength==null || newLength>=numberList.length) return numberList;

  var windowSize = numberList.length/newLength;
  var newNumberList = new NumberList();
  var windowSizeInt = Math.floor(windowSize);
  var val;
  var i, j, j0;

  newNumberList.name = numberList.name;

  for(i=0; i<newLength; i++){
    j0 = Math.floor(i*windowSize);
    val = 0;
    for(j=0; j<windowSizeInt; j++){
      val += numberList[j0+j];
    }
    newNumberList[i] = val/windowSizeInt;
  }
  return newNumberList;
};

/**
 * calculates k-means clusters of values in a numberList
 * @param  {NumberList} numberList
 * @param  {Number} k number of clusters
 *
 * @param {Boolean} returnIndexes return clusters of indexes rather than values (false by default)
 * @return {NumberTable} numberLists each being a cluster
 * tags:ds
 */
NumberListOperators.linearKMeans = function(numberList, k, returnIndexes) {
  if(numberList == null || k == null || !k > 0) return null;

  var interval = numberList.getInterval();

  var min = interval.x;
  var max = interval.y;
  var clusters = new NumberTable();
  var i, j;
  var jK;
  var x;
  var dX = (max - min) / k;
  var d;
  var dMin;
  var n;
  var actualMean;
  var N = 1000;
  var means = new NumberList();
  var nextMeans = new NumberList();
  var nValuesInCluster = new NumberList();

  var initdMin = 1 + max - min;

  for(i = 0; i < k; i++) {
    clusters[i] = new NumberList();
    nextMeans[i] = min + (i + 0.5) * dX;
  }

  for(n = 0; n < N; n++) {

    for(i = 0; i < k; i++) {
      nValuesInCluster[i] = 0;
      means[i] = nextMeans[i];
      nextMeans[i] = 0;
    }

    for(i = 0; numberList[i] != null; i++) {
      x = numberList[i];
      dMin = initdMin;
      jK = 0;

      for(j = 0; j < k; j++) {
        d = Math.abs(x - means[j]);
        if(d < dMin) {
          dMin = d;
          jK = j;
        }
      }
      if(n == N - 1) {
        returnIndexes ? clusters[jK].push(i) : clusters[jK].push(x);
      }

      nValuesInCluster[jK]++;

      nextMeans[jK] = ((nValuesInCluster[jK] - 1) * nextMeans[jK] + x) / nValuesInCluster[jK];
    }
  }

  return clusters;
};

/**
 * @todo finish docs
 */
NumberListOperators.standardDeviationBetweenTwoNumberLists = function(numberList0, numberList1) {
  var s = 0;
  var l = Math.min(numberList0.length, numberList1.length);

  for(var i = 0; i < l; i++) {
    s += Math.pow(numberList0[i] - numberList1[i], 2);
  }

  return s/l;
};

/**
 * returns Pearson Product Moment Correlation, the most common correlation coefficient ( covariance/(standard_deviation0*standard_deviation1) )
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.pearsonProductMomentCorrelation = function(numberList0, numberList1) { //TODO:make more efficient
  return NumberListOperators.covariance(numberList0, numberList1) / (numberList0.getStandardDeviation() * numberList1.getStandardDeviation());
};


/**
 * smooth a numberList by calculating averages with neighbors
 * @param  {NumberList} numberList
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.averageSmoother = function(numberList, intensity, nIterations) {
  nIterations = nIterations == null ? 1 : nIterations;
  intensity = intensity == null ? 0.1 : intensity;

  intensity = Math.max(Math.min(intensity, 0.5), 0);
  var anti = 1 - 2 * intensity;
  var n = numberList.length - 1;

  var newNumberList = new NumberList();
  var i;

  newNumberList.name = numberList.name;

  for(i = 0; i < nIterations; i++) {
    if(i == 0) {
      numberList.forEach(function(val, i) {
        newNumberList[i] = anti * val + (i > 0 ? (numberList[i - 1] * intensity) : 0) + (i < n ? (numberList[i + 1] * intensity) : 0);
      });
    } else {
      newNumberList.forEach(function(val, i) {
        newNumberList[i] = anti * val + (i > 0 ? (newNumberList[i - 1] * intensity) : 0) + (i < n ? (newNumberList[i + 1] * intensity) : 0);
      });
    }
  }

  newNumberList.name = numberList.name;

  return newNumberList;
};


/**
 * accepted comparison operators: "<", "<=", ">", ">=", "==", "!="
 */
NumberListOperators.filterNumberListByNumber = function(numberList, value, comparisonOperator, returnIndexes) {
  returnIndexes = returnIndexes || false;
  var newNumberList = new NumberList();
  var i;

  if(returnIndexes) {
    switch(comparisonOperator) {
      case "<":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] < value) {
            newNumberList.push(i);
          }
        }
        break;
      case "<=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] <= value) {
            newNumberList.push(i);
          }
        }
        break;
      case ">":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] > value) {
            newNumberList.push(i);
          }
        }
        break;
      case ">=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] >= value) {
            newNumberList.push(i);
          }
        }
        break;
      case "==":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] == value) {
            newNumberList.push(i);
          }
        }
        break;
      case "!=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] != value) {
            newNumberList.push(i);
          }
        }
        break;
    }

  } else {
    switch(comparisonOperator) {
      case "<":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] < value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "<=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] <= value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case ">":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] > value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case ">=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] >= value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "==":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] == value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
      case "!=":
        for(i = 0; numberList[i] != null; i++) {
          if(numberList[i] != value) {
            newNumberList.push(numberList[i]);
          }
        }
        break;
    }
  }

  return newNumberList;
};

/**
 * creates a NumberList that contains the union of two NumberList (removing repetitions)
 *
 * @param  {NumberList} x list A
 * @param  {NumberList} y list B
 *
 * @return {NumberList} the union of both NumberLists
 * tags:
 */
NumberListOperators.union = function(x, y) {//TODO: this should be refactored, and placed in ListOperators
  // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
  var obj = {};
  for(var i = x.length - 1; i >= 0; --i)
    obj[x[i]] = x[i];
  for(var i = y.length - 1; i >= 0; --i)
    obj[y[i]] = y[i];
  var res = new NumberList();
  for(var k in obj) {
    if(obj.hasOwnProperty(k)) // <-- optional
      res.push(obj[k]);
  }
  return res;
};

/**
 * creates a NumberList that contains the intersection of two NumberList (elements present in BOTH lists)
 * @param  {NumberList} list A
 * @param  {NumberList} list B
 *
 * @return {NumberList} the intersection of both NumberLists
 * tags:deprecated
 */
NumberListOperators.intersection = function(a, b) {//TODO: refactor this method that should be at ListOperators
  // Borrowed from here: http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
  //console.log( "arguments: ", arguments );
  if(arguments.length > 2) {
    var sets = [];
    for(var i = 0; i < arguments.length; i++) {
      sets.push(arguments[i]);
    }
    sets.sort(function(a, b) {
      return a.length - b.length;
    });
    console.log("sets: ", sets);
    var resultsTrail = sets[0];
    for(var i = 1; i < sets.length; i++) {
      var newSet = sets[i];
      resultsTrail = NumberListOperators.intersection(resultsTrail, newSet);
    }
    return resultsTrail;
  }

  var result = new NumberList();
  a = a.slice();
  b = b.slice();
  while(a.length > 0 && b.length > 0)
  {
    if(a[0] < b[0]) {
      a.shift();
    }
    else if(a[0] > b[0]) {
      b.shift();
    }
    else /* they're equal */
    {
      result.push(a.shift());
      b.shift();
    }
  }

  return result;
};


/**
 * builds a rectangle that defines the boundaries of two numberLists interpreted as x and y coordinates
 * @param  {NumberList} numberListX
 * @param  {NumberList} numberListY
 * @return {Rectangle}
 */
NumberListOperators.frameFromTwoNumberLists = function(numberListX, numberListY){
  var intX = numberListX.getInterval();
  var intY = numberListY.getInterval();
  return new Rectangle(intX.x, intY.x, intX.getAmplitude(), intY.getAmplitude());
};
