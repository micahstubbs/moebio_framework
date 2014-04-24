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

/**
 * filters a List, by a NumberList of indexes, or by an Interval
 * @param  {List} list to be filtered
 * @param  {Object} params NumberList or Interval
 * @return {List}
 * tags:filter
 */
ListOperators.getSubList = function(list, params){
	if(list==null || params==null) return null;
	return list.getSubList.apply(list, params.isList?[params]:params);
}

/**
 * concats lists
 * @param  {List}
 * @param  {List}
 * 
 * @param  {List}
 * @param  {List}
 * @param  {List}
 * @return {List}
 * tags:
 */
ListOperators.concat = function(){
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
 * @param  {Object}
 * @param  {Object}
 * 
 * @param  {Object}
 * @param  {Object}
 * @param  {Object}
 * @return {List}
 * tags:
 */
ListOperators.assemble = function(){
	return List.fromArray(arguments).getImproved();
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
	
	sortListsByOccurrences = sortListsByOccurrences || true;
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
			index = elementList.indexOf(obj); //TODO: implement equivalence and indexOfElement operator
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

// ListOperators.concat=function(){
// 	var i;
// 	var j;
// 	var addList;
// 	var newList=arguments[0].clone();
// 	var sameType = true;
// 	for(i=1; i<arguments.length; i++){
// 		addList=arguments[i];
// 		if(arguments[i].type != arguments[i-1].type) sameType = false;
// 		for(j=0; addList[j]!=null; j++){
// 			newList.push(addList[j]);
// 		}
// 	}
// 	if(sameType) return newList;
// 	return List.fromArray(newList);
// }

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



