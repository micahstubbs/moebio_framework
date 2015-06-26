function ListOperators() {}


/**
 * gets an element in a specified position from a List
 * @param  {List} list
 * 
 * @param  {Number} index
 * @return {Object}
 * tags:
 */
ListOperators.getElement = function(list, index) {
  if(list == null) return null;
  index = index == null ? 0 : index % list.length;
  return list[index];
};

/**
 * multi-ouput operator that gives acces to individual elements
 * @param  {List} list
 * 
 * @param  {Number} fromIndex (default 0)
 * @return {Object} first Object
 * @return {Object} second Object
 * @return {Object} third Object
 * @return {Object} fourth Object
 * @return {Object} fifth Object
 * @return {Object} sisxth Object
 * @return {Object} seventh Object
 * @return {Object} eight Object
 * @return {Object} ninth Object
 * @return {Object} tenth Object
 * tags:
 */
ListOperators.getFirstElements = function(list, fromIndex) {
  if(list == null) return null;

  fromIndex = fromIndex == null ? 0 : Number(fromIndex);

  return [
  {
    type: "Object",
    name: "first value",
    description: "first value",
    value: list[fromIndex + 0]
  },
  {
    type: "Object",
    name: "second value",
    description: "second value",
    value: list[fromIndex + 1]
  },
  {
    type: "Object",
    name: "third value",
    description: "third value",
    value: list[fromIndex + 2]
  },
  {
    type: "Object",
    name: "fourth value",
    description: "fourth value",
    value: list[fromIndex + 3]
  },
  {
    type: "Object",
    name: "fifth value",
    description: "fifth value",
    value: list[fromIndex + 4]
  },
  {
    type: "Object",
    name: "sixth value",
    description: "sixth value",
    value: list[fromIndex + 5]
  },
  {
    type: "Object",
    name: "seventh value",
    description: "seventh value",
    value: list[fromIndex + 6]
  },
  {
    type: "Object",
    name: "eight value",
    description: "eight value",
    value: list[fromIndex + 7]
  },
  {
    type: "Object",
    name: "ninth value",
    description: "ninth value",
    value: list[fromIndex + 8]
  },
  {
    type: "Object",
    name: "tenth value",
    description: "tenth value",
    value: list[fromIndex + 9]
  }];
};


/**
 * first position of element in list (-1 if element doesn't belong to the list)
 * @param  {List} list
 * @param  {Object} element
 * @return {Number}
 * tags:
 */
ListOperators.indexOf = function(list, element) {
  return list.indexOf(element);
};

/**
 * concats lists
 * @param  {List} list0
 * @param  {List} list1
 * 
 * @param  {List} list2
 * @param  {List} list3
 * @param  {List} list4
 * @return {List} list5
 * tags:
 */
ListOperators.concat = function() {
  if(arguments == null || arguments.length == 0 ||  arguments[0] == null) return null;
  if(arguments.length == 1) return arguments[0];

  var i;
  var list = arguments[0].concat(arguments[1]);
  for(i = 2; arguments[i]; i++) {
    list = list.concat(arguments[i]);
  }
  return list.getImproved();
};

/**
 * assembles a List
 * @param  {Object} argument0
 * 
 * @param  {Object} argument1
 * @param  {Object} argument2
 * @param  {Object} argument3
 * @param  {Object} argument4
 * @return {List}
 * tags:
 */
ListOperators.assemble = function() {
  return List.fromArray(Array.prototype.slice.call(arguments, 0)).getImproved();
};



/**
 * returns a table with two Lists: words and occurrences
 * @param {List} list
 * 
 * @param {Boolean} sortListsByOccurrences optional, true by default, common words first
 * @param {Boolean} consecutiveRepetitions optional false by default, if true only counts consecutive repetitions
 * @param {Number} optional limit, limits the size of the lists
 * @return {Table}
 * tags:count,toimprove
 */
ListOperators.countElementsRepetitionOnList = function(list, sortListsByOccurrences, consecutiveRepetitions, limit) { //transform this, use dictionary instead of indexOf !!!!!!!
  if(list == null) return;

  sortListsByOccurrences = sortListsByOccurrences == null ? true : sortListsByOccurrences;
  consecutiveRepetitions = consecutiveRepetitions || false;
  limit = limit == null ? 0 : limit;

  var obj;
  var elementList = instantiate(typeOf(list));
  var numberList = new NumberList();
  var index;
  var i;

  if(consecutiveRepetitions) {
    if(list.length == 0) return null;
    var previousElement = list[0];
    elementList.push(previousElement);
    numberList.push(1);
    for(i = 1; i < nElements; i++) {
      obj = list[i];
      if(obj == previousElement) {
        numberList[numberList.length - 1] = numberList[numberList.length - 1] + 1;
      } else {
        elementList.push(obj);
        numberList.push(1);
        previousElement = obj;
      }
    }
  } else {
    for(i = 0; list[i] != null; i++) {
      obj = list[i];
      index = elementList.indexOf(obj);
      if(index != -1) {
        numberList[index]++;
      } else {
        elementList.push(obj);
        numberList.push(1);
      }
    }
  }

  if(elementList.type == "NumberList") {
    var table = new NumberTable();
  } else {
    var table = new Table();
  }
  table[0] = elementList;
  table[1] = numberList;

  if(sortListsByOccurrences) {
    table = TableOperators.sortListsByNumberList(table, numberList);
  }

  if(limit != 0 && limit < elementList.length) {
    table[0] = table[0].splice(0, limit);
    table[1] = table[1].splice(0, limit);
  }

  return table;
};


/**
 * reverses a list
 * @param {List} list
 * @return {List}
 * tags:sorting
 */
ListOperators.reverse = function(list) {
  return list.getReversed();
};

/**
 * using a table with two columns as a dictionary (first list elements to be read, second list result elements), translates a list
 * @param  {List} list to transalte
 * @param  {Table} dictionary table with two lists
 *
 * @param {Object} nullElement element to place in case no translation is found
 * @return {List}
 * tags:
 */
ListOperators.translateWithDictionary = function(list, dictionary, nullElement) {
  var newList = new List();
  list.forEach(function(element, i) {
    index = dictionary[0].indexOf(element);
    if(nullElement != null) {
      newList[i] = index == -1 ? nullElement : dictionary[1][index];
    } else {
      newList[i] = index == -1 ? list[i] : dictionary[1][index];
    }
  });
  return newList.getImproved();
};


// ListOperators.getIndexesOfElements=function(list, elements){
// 	var numberList = new NumberList();
// 	var i;
// 	for(i=0; elements[i]!=null; i++){
// 		numberList[i] = list.indexOf(elements[i]);
// 	}
// 	return numberList;
// }


// ListOperators.countOccurrencesOnList=function(list){
// 	var occurrences=new NumberList();
// 	var nElements=list.length;
// 	for(var i=0; list[i]!=null; i++){
// 		occurrences.push(this.getIndexesOfElement(list,list[i]).length);
// 	}
// 	return occurrences;
// }


ListOperators.sortListByNumberList = function(list, numberList, descending) {
  if(descending == null) descending = true;
  if(numberList.length == 0) return list;
  var newNumberList;

  var pairs = [];
  var newList = instantiate(typeOf(list));

  for(i = 0; list[i] != null; i++) {
    pairs.push([list[i], numberList[i]]);
  }


  if(descending) {
    pairs.sort(function(a, b) {
      if(a[1] < b[1]) return 1;
      return -1;
    });
  } else {
    pairs.sort(function(a, b) {
      if(a[1] < b[1]) return -1;
      return 1;
    });
  }

  for(i = 0; pairs[i] != null; i++) {
    newList.push(pairs[i][0]);
  }
  newList.name = list.name;
  return newList;
};


ListOperators.sortListByIndexes = function(list, indexedArray) {
  var newList = instantiate(typeOf(list));
  newList.name = list.name;
  var nElements = list.length;
  var i;
  for(i = 0; i < nElements; i++) {
    newList.push(list[indexedArray[i]]);
  }
  return newList;
};


ListOperators.concatWithoutRepetitions = function() { //?
  var i;
  var newList = arguments[0].clone();
  for(i = 1; i < arguments.length; i++) {
    var addList = arguments[i];
    var nElements = addList.length;
    for(var i = 0; i < nElements; i++) {
      if(newList.indexOf(addList[i]) == -1) newList.push(addList[i]);
    }
  }
  return newList.getImproved();
};

/**
 * builds a table: a list of sub-lists from the original list, each sub-list determined size subListsLength, and starting at certain indexes separated by step
 * @param  {List} list
 * @param  {Number} subListsLength length of each sub-list
 * @param  {Number} step slifing step
 * @param  {Number} finalizationMode<br>0:all sub-Lists same length, doesn't cover the List<br>1:last sub-List catches the last elements, with lesser length<br>2:all lists same length, last sub-list migth contain elements from the beginning of the List
 * @return {Table}
 * tags:
 */
ListOperators.slidingWindowOnList = function(list, subListsLength, step, finalizationMode) {
  finalizationMode = finalizationMode || 0;
  var table = new Table();
  var newList;
  var nElements = list.length;
  var nList;
  var nRow;
  var i;
  var j;

  step = Math.max(1, step);

  switch(finalizationMode) {
    case 0: //all sub-Lists same length, doesn't cover the List
      for(i = 0; i < nElements; i += step) {
        if(i + subListsLength <= nElements) {
          newList = new List();
          for(j = 0; j < subListsLength; j++) {
            newList.push(list[i + j]);
          }
          table.push(newList.getImproved());
        }
      }
      break;
    case 1: //last sub-List catches the last elements, with lesser length
      for(i = 0; i < nElements; i += step) {
        newList = new List();
        for(j = 0; j < Math.min(subListsLength, nElements - i); j++) {
          newList.push(list[i + j]);
        }
        table.push(newList.getImproved());
      }
      break;
    case 2: //all lists same length, last sub-list migth contain elements from the beginning of the List
      for(i = 0; i < nElements; i += step) {
        newList = new List();
        for(j = 0; j < subListsLength; j++) {
          newList.push(list[(i + j) % nElements]);
        }
        table.push(newList.getImproved());
      }
      break;
  }

  return table.getImproved();
};

ListOperators.getNewListForObjectType = function(object) {
  var newList = new List();
  newList[0] = object;
  return instantiateWithSameType(newList.getImproved());
};

ListOperators.listsIntersect = function(list0, list1) {
  var list = list0.length < list1.length ? list0 : list1;
  var otherList = list0 == list ? list1 : list0;
  for(var i = 0; list[i] != null; i++) {
    if(otherList.indexOf(list[i]) != -1) return true;
  }
  return false;
};


/**
 * creates a List that contains the union of two List (removing repetitions)
 * @param  {List} list0 first list
 * @param  {List} list1 second list
 * 
 * @return {List} the union of both Lists
 * tags:
 */
ListOperators.union = function(list0, list1) {//TODO: this should be refactored, and placed in ListOperators
  if(list0==null || list1==null) return;

  var obj = {};
  var i, k;

  for(i = 0; list0[i]!=null; i++) obj[list0[i]] = list0[i];
  for(i = 0; list1[i]!=null; i++) obj[list1[i]] = list1[i];
  var union = new List();
  for(k in obj) {
    //if(obj.hasOwnProperty(k)) // <-- optional
    union.push(obj[k]);
  }
  return union;
};


/**
 * returns the list of common elements between two lists (deprecated, use union instead)
 * @param  {List} list0
 * @param  {List} list1
 * @return {List}
 * tags:deprecated
 */
ListOperators.getCommonElements = function(list0, list1) {
  var nums = list0.type == 'NumberList' && list1.type == 'NumberList';
  var strs = list0.type == 'StringList' && list1.type == 'StringList';
  var newList = nums ? new NumberList() : (strs ? new StringList() : new List());

  var list = list0.length < list1.length ? list0 : list1;
  var otherList = list0 == list ? list1 : list0;

  for(var i = 0; list[i] != null; i++) {
    if(otherList.indexOf(list[i]) != -1) newList.push(list[i]);
  }
  if(nums || strs) return newList;
  return newList.getImproved();
};




/**
 * creates a List that contains the union of two List (removing repetitions) (deprecated, use union instead)
 * @param  {List} list0
 * @param  {List} list A
 * @param  {List} list B
 * 
 * @return {List} the union of both NumberLists
 * tags:deprecated
 */
ListOperators.unionLists = function(x, y) {
  // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
  var result;
  if(x.type != x.type || (x.type != "StringList" && x.type != "NumberList"))
  {
    // To-do: call generic method here (not yet implemented)
    //c.l( "ListOperators.unionLists for type '" + x.type + "' or '" + y.type + "' not yet implemented" );
    return x.concat(y).getWithoutRepetitions();
    return null;
  }
  else
  {
    var obj = {};
    for(var i = x.length - 1; i >= 0; --i)
      obj[x[i]] = x[i];
    for(var i = y.length - 1; i >= 0; --i)
      obj[y[i]] = y[i];
    result = x.type == "StringList" ? new StringList() : new NumberList();
    for(var k in obj) {
      if(obj.hasOwnProperty(k)) // <-- optional
        result.push(obj[k]);
    }
  }
  return result;
};

/**
 * creates a List that contains the intersection of two List (elements present in BOTH lists)
 * @param  {List} list0 list A
 * @param  {List} list1 list B
 * 
 * @return {List} intersection of both NumberLists
 * tags:
 */
ListOperators.intersection = function(list0, list1) {
  if(list0==null || list1==null) return;

  var element;
  var dictionary = {};
  var dictionaryIntersected = {};
  var intersection = new List();

  list0.forEach(function(element){
    dictionary[element] = true;
  });
  list1.forEach(function(element){
    if(dictionary[element] && dictionaryIntersected[element]==null){
      dictionaryIntersected[element]=true;
      intersection.push(element);
    }
  });
  return intersection.getImproved();
};

/**
 * calculates Jaccard index |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number}
 * tags:
 */
ListOperators.jaccardIndex = function(list0, list1) {//TODO: see if this can be more efficient, maybe one idctionar for doing union and interstection at the same time
  return ListOperators.intersection(list0, list1).length/ListOperators.unionLists(list0, list1).length;
}

/**
 * calculates Jaccard distance 1 - |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number}
 * tags:
 */
ListOperators.jaccardDistance = function(list0, list1) {
  return 1 - ListOperators.jaccardIndex(list0, list1);
}

/**
 * builds a dictionary that matches an element of a List with all its indexes on the List (indexesDictionary[element] --> numberList of indexes of element on list)
 * @param  {List} list
 * @return {Object}
 * tags:
 */
ListOperators.getIndexesDictionary = function(list){
  var indexesDictionary = {};
  var i;

  list.forEach(function(element, i){
    if(indexesDictionary[element]==null) indexesDictionary[element]=new NumberList();
    indexesDictionary[element].push(i);
  });

  return indexesDictionary;
}

ListOperators.getIndexesTable = function(list){
  var indexesTable = new Table();
  indexesTable[0] = new List();
  indexesTable[1] = new NumberTable();
  var indexesDictionary = {};
  var i;

  list.forEach(function(element, i){
    indexOnTable = indexesDictionary[element]
    if(indexOnTable==null){
      indexesTable[0].push(element);
      indexesTable[1].push(new NumberList(i));
      indexesDictionary[element]=indexesTable[0].length-1;
    } else {
      indexesTable[1][indexOnTable].push(i)
    }
  });

  indexesTable[0] = indexesTable[0].getImproved();

  return indexesTable;
}

/**
 * aggregates values of a list using an aggregator list as reference
 * @param  {List} aggregatorList aggregator list that typically contains several repeated elements
 * @param  {List} toAggregateList list of elements that will be aggregated
 * 
 * @param  {Number} mode aggregation modes:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements
 * @param  {Table} indexesTable optional already calculated table of indexes of elements on the aggregator list (if didn't provided, the method calculates it)
 * @return {Table} contains a list with non repeated elements on the first list, and the aggregated elements on a second list
 * tags:
 */
ListOperators.aggregateList = function(aggregatorList, toAggregateList, mode, indexesTable){
  if(aggregatorList==null || toAggregateList==null) return null;
  var table = new Table();

  if(indexesTable==null) indexesTable = ListOperators.getIndexesTable(aggregatorList);

  if(mode==11) return indexesTable;

  table[0] = indexesTable[0];

  if(mode==0 && aggregatorList==toAggregateList){
    table[1] = indexesTable[0];
    return table;
  } 
  
  mode = mode==null?0:mode;

  switch(mode){
    case 0://first element
      table[1] = new List();
      var list;
      indexesTable[1].forEach(function(indexes){
        table[1].push(toAggregateList[indexes[0]]);
      });
      table[1] = table[1].getImproved();
      return table;
    case 1://count
      table[1] = new NumberList();
      indexesTable[1].forEach(function(indexes){
        table[1].push(indexes.length);
      });
      return table;
    case 2://sum
    case 3://average
      var sum;
      table[1] = new NumberList();
      indexesTable[1].forEach(function(indexes){
        sum = 0;
        indexes.forEach(function(index){
          sum+=toAggregateList[index];
        });
        if(mode==3) sum/=indexes.length;
        table[1].push(sum);
      });
      return table;
    case 4://min
      var min;
      table[1] = new NumberList();
      indexesTable[1].forEach(function(indexes){
        min = 99999999999;
        indexes.forEach(function(index){
          min=Math.min(min, toAggregateList[index]);
        });
        table[1].push(min);
      });
      return table;
    case 5://max
      var max;
      table[1] = new NumberList();
      indexesTable[1].forEach(function(indexes){
        max = -99999999999;
        indexes.forEach(function(index){
          max=Math.max(max, toAggregateList[index]);
        });
        table[1].push(max);
      });
      return table;
    case 6://standard deviation
      var average;
      table = ListOperators.aggregateList(aggregatorList, toAggregateList, 3, indexesTable);
      indexesTable[1].forEach(function(indexes, i){
        sum = 0;
        average = table[1][i];
        indexes.forEach(function(index){
          sum += Math.pow(toAggregateList[index] - average, 2);
        });
        table[1][i] = Math.sqrt(sum/indexes.length);
      });
      return table;
    case 7://enlist
      table[1] = new Table();
      var list;
      indexesTable[1].forEach(function(indexes){
        list = new List();
        table[1].push(list)
        indexes.forEach(function(index){
          list.push(toAggregateList[index]);
        });
        list = list.getImproved();
      });
      return table.getImproved();
    case 8://last element
      table[1] = new List();
      var list;
      indexesTable[1].forEach(function(indexes){
        table[1].push(toAggregateList[indexes[indexes.length-1]]);
      });
      table[1] = table[1].getImproved();
      return table;
    case 9://most common
      table[1] = new List();
      var elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 5, indexesTable);
      elementsTable[1].forEach(function(elements){
        table[1].push(elements.getMostRepeatedElement());
      });
      table[1] = table[1].getImproved();
      return table;
    case 10://random
      table[1] = new List();
      var list;
      indexesTable[1].forEach(function(indexes){
        table[1].push( toAggregateList[indexes[ Math.floor(Math.random()*indexes.length) ]] );
      });
      table[1] = table[1].getImproved();
      return table;
    case 11://indexes (returned previosuly)
      break;
    case 12://count non repeated
      table[1] = new NumberList();
      var elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      elementsTable[1].forEach(function(elements){
        table[1].push(elements.getWithoutRepetitions().length);
      });
      return table;
    case 13://enlist non repeated
      table[1] = new List();
      var elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      elementsTable[1].forEach(function(elements){
        table[1].push(elements.getWithoutRepetitions());
      });
      table[1] = table[1].getImproved();
      return table;
  }

  return null;
}

/**
 * analyses wether two lists are categorical identical, one is subcategorical to the other, or there's no relation
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number} 0:no relation, 1:categorical identical, 2:list0 subcategorical to list1, 3:list1 subcategorical to list0
 * tags:
 */
ListOperators.subCategoricalAnalysis = function(list0, list1){
  if(list0==null || list1==null) return;

  var dictionary = {};
  var element, projection;
  var i;
  var list0SubCategorical = true;
  for(i=0; list0[i]!=null; i++){
    element = list0[i];
    projection = dictionary[element];
    if(projection==null){
      dictionary[element] = list1[i]
    } else if(projection!=list1[i]){
      list0SubCategorical = false;
      break;
    }
  };
  
  dictionary = {};
  var list1SubCategorical = true;
  for(i=0; list1[i]!=null; i++){
    element = list1[i];
    projection = dictionary[element];
    if(projection==null){
      dictionary[element] = list0[i]
    } else if(projection!=list0[i]){
      list1SubCategorical = false;
      break;
    }
  };

  if(list1SubCategorical && list0SubCategorical) return 1;
  if(list0SubCategorical) return 2;
  if(list1SubCategorical) return 3;
  return 0;
}

/**
 * calculates de entropy of a list, properties _mostRepresentedValue and _biggestProbability are added to the list
 * @param  {List} list with repeated elements (actegorical list)
 *
 * @param {Object} valueFollowing if a value is provided, the property _P_valueFollowing will be added to the list, with proportion of that value in the list
 * @return {Number}
 * tags:ds
 */
ListOperators.getListEntropy = function(list, valueFollowing) {
  if(list == null) return;
  if(list.length < 2) {
    if(list.length == 1) {
      list._mostRepresentedValue = list[0];
      list._biggestProbability = 1;
      list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
    }
    return 0;
  }

  var table = ListOperators.countElementsRepetitionOnList(list, true);
  list._mostRepresentedValue = table[0][0];
  var N = list.length;
  list._biggestProbability = table[1][0] / N;
  if(table[0].length == 1) {
    list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
    return 0;
  }
  var entropy = 0;

  var norm = Math.log(table[0].length);
  table[1].forEach(function(val) {
    entropy -= (val / N) * Math.log(val / N) / norm;
  });

  if(valueFollowing != null) {
    var index = table[0].indexOf(valueFollowing);
    list._P_valueFollowing = index == -1 ? 0 : table[1][index] / N;
  }

  return entropy;
};


/**
 * measures how much a feature decreases entropy when segmenting by its values by a supervised variable
 * @param  {List} feature
 * @param  {List} supervised
 * @return {Number}
 * tags:ds
 */
ListOperators.getInformationGain = function(feature, supervised) {
  if(feature == null || supervised == null || feature.length != supervised.length) return null;

  var ig = ListOperators.getListEntropy(supervised);
  var childrenObject = {};
  var childrenLists = [];
  var N = feature.length;

  feature.forEach(function(element, i) {
    if(childrenObject[element] == null) {
      childrenObject[element] = new List();
      childrenLists.push(childrenObject[element]);
    }
    childrenObject[element].push(supervised[i]);
  });

  childrenLists.forEach(function(cl) {
    ig -= (cl.length / N) * ListOperators.getListEntropy(cl);
  });

  return ig;
};

ListOperators.getInformationGainAnalysis = function(feature, supervised) {
  if(feature == null || supervised == null || feature.length != supervised.length) return null;

  var ig = ListOperators.getListEntropy(supervised);
  var childrenObject = {};
  var childrenLists = [];
  var N = feature.length;
  var entropy;
  var sets = new List();

  feature.forEach(function(element, i) {
    if(childrenObject[element] == null) {
      childrenObject[element] = new List();
      childrenLists.push(childrenObject[element]);
    }
    childrenObject[element].push(supervised[i]);
  });

  childrenLists.forEach(function(cl) {
    entropy = ListOperators.getListEntropy(cl);
    ig -= (cl.length / N) * entropy;

    sets.push({
      children: cl,
      entropy: entropy,
      infoGain: ig
    });
  });

  return sets;
};


/**
 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
 * @param  {List} list of elements to group
 * @param  {Boolean} whether the results are to be sorted or not
 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
 *
 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
 * @return {Table}
 * tags:dani
 */
ListOperators.groupElements = function(list, sortedByValue, mode, fillBlanks) {
  if(!list)
    return;
  var result = ListOperators._groupElements_Base(list, null, sortedByValue, mode, fillBlanks);
  return result;
};


/**
 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
 * @param  {List} list of elements to group
 * @param  {String} name of the property to be used for grouping
 * @param  {Boolean} wether the results are to be sorted or not
 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
 *
 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
 * @return {Table}
 * tags:dani
 */
ListOperators.groupElementsByPropertyValue = function(list, propertyName, sortedByValue, mode, fillBlanks) {
  if(!list)
    return;
  var result = ListOperators._groupElements_Base(list, propertyName, sortedByValue, mode, fillBlanks);
  return result;
};



ListOperators._groupElements_Base = function(list, propertyName, sortedByValue, mode, fillBlanks) {
  var result;

  if(!list)
    return;
  if(mode == undefined)
    mode = 0;
  var resultOb = {};
  var resultTable = new Table();
  var pValue, item, minValue, maxValue;
  for(var i = 0; i < list.length; i++) {
    item = list[i];
    pValue = propertyName == undefined ? item : item[propertyName];
    if(resultOb[pValue] == undefined) {
      resultOb[pValue] = new List();
      resultOb[pValue].name = pValue;
      resultOb[pValue].valProperty = pValue;
      resultTable.push(resultOb[pValue]);
    }
    if(mode == 0)
      resultOb[pValue].push(item);
    else if(mode == 1)
      resultOb[pValue].push(i);
    // Update boundaries
    if(minValue == undefined || pValue < minValue) {
      minValue = pValue;
    }
    if(maxValue == undefined || pValue > maxValue) {
      maxValue = pValue;
    }
  }

  // Fill the blanks
  if(fillBlanks) {
    var numBlanks = 0;
    for(var i = minValue; i < maxValue; i++) {
      if(resultOb[i] == undefined) {
        resultOb[i] = new List();
        resultOb[i].name = i;
        resultOb[i].valProperty = i;
        resultTable.push(resultOb[i]);
        numBlanks++;
      }
    }
    //c.l("numBlanks: ", numBlanks)
  }

  // To-do: looks like getSortedByProperty is removing the valProperty from the objects
  if(sortedByValue)
    resultTable = resultTable.getSortedByProperty("name"); // "valProperty"

  return resultTable;

};