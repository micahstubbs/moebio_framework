function ListOperators(){};


/**
 * gets an element in a specified position from a List
 * @param  {List} list
 * 
 * @param  {Number} index
 * @return {Object}
 * tags:
 */
ListOperators.getElement = function(list, index){
	if(list==null) return null;
	index = index==null?0:index%list.length;
	return list[index];
}

// *
//  * filters a List, by a NumberList of indexes, or by an Interval
//  * @param  {List} list to be filtered
//  * @param  {Object} params NumberList or Interval
//  * @return {List}
 
// ListOperators.getSubList = function(list, params){
// 	if(list==null || params==null) return null;
// 	return list.getSubList.apply(list, params.isList?[params]:params);
// }

/**
 * first position of element in list (-1 if element doesn't belong to the list)
 * @param  {List} list
 * @param  {Object} element
 * @return {Number}
 * tags:
 */
ListOperators.indexOf = function(list, element){
	return list.indexOf(element);
}

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
ListOperators.concat = function(){
	if(arguments == null || arguments.length==0 || arguments[0]==null) return null;
	if(arguments.length==1) return arguments[0];
	
	var i;
	var list = arguments[0].concat(arguments[1]);
	for(i=2; arguments[i]; i++){
		list = list.concat(arguments[i]);
	}
	return list.getImproved();
}

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
ListOperators.assemble = function(){
	return List.fromArray(Array.prototype.slice.call(arguments, 0)).getImproved();
}


/**
 * returns a table with two Lists: words and occurrences
 * @param {List} list
 * 
 * @param {Boolean} sortListsByOccurrences optional, true by default, common words first
 * @param {Boolean} consecutiveRepetitions optional false by default, if true only counts consecutive repetitions
 * @param {Number} optional limit, limits the size of the lists
 * @return {Table}
 * tags:count
 */
ListOperators.countElementsRepetitionOnList=function(list, sortListsByOccurrences, consecutiveRepetitions, limit){
	if(list==null) return;
	
	sortListsByOccurrences = sortListsByOccurrences==null?true:sortListsByOccurrences;
	consecutiveRepetitions = consecutiveRepetitions || false;
	limit = limit==null?0:limit;
	
	var obj;
	var elementList = instantiate(typeOf(list));
	var numberList = new NumberList();
	var index;
	var i;
	
	if(consecutiveRepetitions){
		if(list.length==0) return null;
		var previousElement = list[0];
		elementList.push(previousElement);
		numberList.push(1);
		for(i=1; i<nElements; i++){
			obj = list[i];
			if(obj==previousElement){
				numberList[numberList.length-1] = numberList[numberList.length-1]+1;
			} else {
				elementList.push(obj);
				numberList.push(1);
				previousElement = obj;
			}
		}
	} else {
		for(i=0; list[i]!=null; i++){
			obj = list[i];
			index = elementList.indexOf(obj);
			if(index!=-1){
				numberList[index]++;
			} else {
				elementList.push(obj);
				numberList.push(1);
			}
		}
	}
	
	if(elementList.type=="NumberList"){
		var table = new NumberTable();
	} else {
		var table = new Table();
	}
	table[0] = elementList;
	table[1] = numberList;
	
	if(sortListsByOccurrences){
		table = TableOperators.sortListsByNumberList(table, numberList);
	}
	
	if(limit!=0 && limit<elementList.length){
		table[0] = table[0].splice(0, limit);
		table[1] = table[1].splice(0, limit);
	}
	
	return table;
}


/**
 * reverses a list
 * @param {List} list
 * @return {List}
 * tags:sorting
 */
ListOperators.reverse = function(list){
	return list.getReversed();
}

/**
 * using a table with two columns as a dictionary (first list elements to be read, second list result elements), translates a list
 * @param  {List} list to transalte
 * @param  {Table} dictionary table with two lists
 *
 * @param {Object} nullElement element to place in case no translation is found
 * @return {List}
 * tags:
 */
ListOperators.translateWithDictionary = function(list, dictionary, nullElement){
	var newList = new List();
	list.forEach(function(element, i){
		index = dictionary[0].indexOf(element);
		newList[i] = index==-1?nullElement:dictionary[1][index];
	});
	return newList.getImproved();
}


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


ListOperators.sortListByNumberList=function(list, numberList, descending){
	if(descending==null) descending = true;
	if(numberList.length==0) return list;
	var newNumberList;
	
	var pairs = new Array();
	var newList = instantiate(typeOf(list));
	
	for(i=0; list[i]!=null; i++){
		pairs.push([list[i], numberList[i]]);
	}
	
	
	if(descending){
		pairs.sort(function(a,b){
			if(a[1]<b[1]) return 1;
			return -1;
		});
	} else {
		pairs.sort(function(a,b){
			if(a[1]<b[1]) return -1;
			return 1;
		});
	}
	
	for(i=0; pairs[i]!=null; i++){
		newList.push(pairs[i][0]);
	}
	newList.name = list.name;
	return newList;
}


ListOperators.sortListByIndexes=function(list, indexedArray){
	var newList = instantiate(typeOf(list));
	newList.name = list.name;
	var nElements = list.length;
	var i;
	for(i=0; i<nElements; i++){
		newList.push(list[indexedArray[i]]);
	}
	return newList;
}


ListOperators.concatWithoutRepetitions=function(){ //?
	var i;
	var newList=arguments[0].clone();
	for(i=1; i<arguments.length; i++){
		var addList=arguments[i];
		var nElements = addList.length;
		for(var i=0; i<nElements; i++){
			if(newList.indexOf(addList[i])==-1) newList.push(addList[i]);
		}
	}
	return newList.getImproved();
}


ListOperators.slidingWindowOnList=function(list, subListsLength, step, finalizationMode){
	finalizationMode = finalizationMode||0;
	var table = new Table();
	var newList;
	var nElements = list.length;
	var nList;
	var nRow;
	var i;
	var j;
	
	step = Math.max(1, step);
	
	switch(finalizationMode){
		case 0: //all sub-Lists same length, doesn't cover the List
			for(i=0; i<nElements; i+=step){
				if(i+subListsLength<=nElements){
					newList = new List();
					for(j=0; j<subListsLength; j++){
						newList.push(list[i+j]);
					}
					table.push(newList.getImproved());
				}
			}
			break;
		case 1://last sub-List catches the last elements, with lesser length
			for(i=0; i<nElements; i+=step){
				newList = new List();
				for(j=0; j<Math.min(subListsLength, nElements-i); j++){
					newList.push(list[i+j]);
				}
				table.push(newList.getImproved());
			}
			break;
		case 2://all lists same length, last sub-list migth contain elements from the beginning of the List
			for(i=0; i<nElements; i+=step){
				newList = new List();
				for(j=0; j<subListsLength; j++){
					newList.push(list[(i+j)%nElements]);
				}
				table.push(newList.getImproved());
			}
			break;
	}
		
	return table.getImproved();
}

ListOperators.getNewListForObjectType=function(object){
	var newList = new List();
	newList[0] = object;
	return instantiateWithSameType(newList.getImproved());
}

ListOperators.listsIntersect=function(list0, list1){
	var list = list0.length<list1.length?list0:list1;
	var otherList = list0==list?list1:list0;
	for(var i=0; list[i]!=null; i++){
		if(otherList.indexOf(list[i])!=-1) return true;
	}
	return false;
}

/**
 * returns the list of common elements between two lists
 * @param  {List} list0
 * @param  {List} list1
 * @return {List}
 * tags:
 */
ListOperators.getCommonElements=function(list0, list1){
	var nums = list0.type == 'NumberList' && list1.type == 'NumberList';
	var strs = list0.type == 'StringList' && list1.type == 'StringList';
	var newList = nums?new NumberList():(strs?new StringList():new List());
	
	var list = list0.length<list1.length?list0:list1;
	var otherList = list0==list?list1:list0;
	
	for(var i=0; list[i]!=null; i++){
		if(otherList.indexOf(list[i])!=-1) newList.push(list[i]);
	}
	if(nums || strs) return newList;
	return newList.getImproved();
}

/**
 * calculates de entropy of a list, properties _mostRepresentedValue and _biggestProbability are added to the list
 * @param  {List} list with repeated elements (actegorical list)
 *
 * @param {Object} valueFollowing if a value is provided, the property _P_valueFollowing will be added to the list, with proportion of that value in the list
 * @return {Number}
 * tags:ds
 */
ListOperators.getListEntropy = function(list, valueFollowing){
	if(list==null) return;
	if(list.length<2){
		if(list.length==1){
			list._mostRepresentedValue = list[0];
			list._biggestProbability = 1;
			list._P_valueFollowing = list[0]==valueFollowing?1:0;
		}
		return 0;
	}

	var table = ListOperators.countElementsRepetitionOnList(list, true);
	list._mostRepresentedValue = table[0][0];
	var N = list.length;
	list._biggestProbability = table[1][0]/N;
	if(table[0].length==1){
		list._P_valueFollowing = list[0]==valueFollowing?1:0;
		return 0;
	}
	var entropy = 0;
	
	var norm = Math.log(table[0].length);
	table[1].forEach(function(val){
		entropy -= (val/N)*Math.log(val/N)/norm;
	});
	
	if(valueFollowing){
		var index = table[0].indexOf(valueFollowing);
		list._P_valueFollowing = index==-1?0:table[1][index]/N;
	}

	return entropy;
}


/**
 * measures how much a feature decreases entropy when segmenting by its values a supervised variable
 * @param  {List} feature
 * @param  {List} supervised
 * @return {Number}
 * tags:ds
 */
ListOperators.getInformationGain = function(feature, supervised){
	if(feature==null || supervised==null || feature.length!=supervised.length) return null;

	var ig = ListOperators.getListEntropy(supervised);
	var childrenObject = {};
	var childrenLists = [];
	var N = feature.length;

	feature.forEach(function(element, i){
		if(childrenObject[element]==null){
			childrenObject[element]=new List();
			childrenLists.push(childrenObject[element]);
		}
		childrenObject[element].push(supervised[i]);
	});

	childrenLists.forEach(function(cl){
		ig -= (cl.length/N)*ListOperators.getListEntropy(cl);
	});

	return ig;
}


/**
 * measures how much a feature decreases entropy when segmenting by its values a supervised variable
 * @param  {List} feature
 * @param  {List} supervised
 * @return {Number}
 * tags:ds
 */
ListOperators.getInformationGain = function(feature, supervised){
	if(feature==null || supervised==null || feature.length!=supervised.length) return null;

	var ig = ListOperators.getListEntropy(supervised);
	var childrenObject = {};
	var childrenLists = [];
	var N = feature.length;
	
	feature.forEach(function(element, i){
		if(childrenObject[element]==null){
			childrenObject[element]=new List();
			childrenLists.push(childrenObject[element]);
		}
		childrenObject[element].push(supervised[i]);
	});

	childrenLists.forEach(function(cl){
		ig -= (cl.length/N)*ListOperators.getListEntropy(cl);
	});

	return ig;
}

ListOperators.getInformationGainAnalysis = function(feature, supervised){
	if(feature==null || supervised==null || feature.length!=supervised.length) return null;

	var ig = ListOperators.getListEntropy(supervised);
	var childrenObject = {};
	var childrenLists = [];
	var N = feature.length;
	var entropy;
	var sets = new List();
	
	feature.forEach(function(element, i){
		if(childrenObject[element]==null){
			childrenObject[element]=new List();
			childrenLists.push(childrenObject[element]);
		}
		childrenObject[element].push(supervised[i]);
	});

	childrenLists.forEach(function(cl){
		entropy = ListOperators.getListEntropy(cl)
		ig -= (cl.length/N)*entropy;

		sets.push({
			children:cl,
			entropy:entropy,
			infoGain:ig
		})
	});

	return sets;
}


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
ListOperators.groupElements = function(list, sortedByValue, mode, fillBlanks ) {
	if( !list )
		return;
	var result = ListOperators._groupElements_Base( list, null, sortedByValue, mode, fillBlanks );
	return result;
}


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
ListOperators.groupElementsByPropertyValue = function(list, propertyName, sortedByValue, mode, fillBlanks ) {
	if( !list )
		return;
	var result = ListOperators._groupElements_Base( list, propertyName, sortedByValue, mode, fillBlanks );
	return result;
}



ListOperators._groupElements_Base = function(list, propertyName, sortedByValue, mode, fillBlanks) {
	var result;

	if( !list )
		return;
	if( mode == undefined )
		mode = 0;
	var resultOb = {};
	var resultTable = new Table();
	var pValue, item, minValue, maxValue; 
	for (var i = 0; i < list.length; i++) {
		item = list[i];
		pValue = propertyName == undefined ? item : item[propertyName];
		if( resultOb[pValue] == undefined ){
			resultOb[pValue] = new List();
			resultOb[pValue].name = pValue;
			resultOb[pValue].valProperty = pValue;
			resultTable.push( resultOb[pValue] );
		}
		if( mode == 0)
			resultOb[pValue].push( item );
		else if( mode == 1)
			resultOb[pValue].push( i );		
		// Update boundaries
		if( minValue == undefined || pValue < minValue ){
			minValue = pValue;
		}
		if( maxValue == undefined || pValue > maxValue ){
			maxValue = pValue;
		}
	};

	// Fill the blanks
	if( fillBlanks ){
		var numBlanks = 0;
		for( var i=minValue; i<maxValue; i++ ){
			if( resultOb[i] == undefined ){
				resultOb[i] = new List();
				resultOb[i].name = i;
				resultOb[i].valProperty = i;
				resultTable.push( resultOb[i] );		
				numBlanks++;	
			}
		}
		//c.l("numBlanks: ", numBlanks)
	}

	// To-do: looks like getSortedByProperty is removing the valProperty from the objects
	if( sortedByValue )
		resultTable = resultTable.getSortedByProperty( "name" ); // "valProperty"

	return resultTable;

}





