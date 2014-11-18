Table.prototype = new List();
Table.prototype.constructor=Table;

/**
* Table 
* @constructor
*/
function Table(){
	var args=[];
	var i;
	for(i=0; i<arguments.length; i++){
		args[i]=new List(arguments[i]);
	}
	
	var array=List.apply(this, args);
	array=Table.fromArray(array);
	
   	return array;
}
Table.fromArray=function(array){
	var result=List.fromArray(array);
	result.type="Table";
   	//assign methods to array:
   	result.applyFunction=Table.prototype.applyFunction;
   	result.getRow=Table.prototype.getRow;
   	result.getRows=Table.prototype.getRows;
   	result.getLengths=Table.prototype.getLengths;
   	result.getListLength=Table.prototype.getListLength;
	result.sliceRows=Table.prototype.sliceRows;
	result.getSubListsByIndexes = Table.prototype.getSubListsByIndexes;
	result.getWithoutRow=Table.prototype.getWithoutRow;
	result.getWithoutRows=Table.prototype.getWithoutRows;
	result.getTransposed=Table.prototype.getTransposed;
	result.getListsSortedByList=Table.prototype.getListsSortedByList;
	result.sortListsByList=Table.prototype.sortListsByList;
	result.clone=Table.prototype.clone;
	result.print=Table.prototype.print;
	
	//transformative
	result.removeRow=Table.prototype.removeRow;
	
	//overiden
	result.destroy=Table.prototype.destroy;

	result.isTable = true;
	
	return result;
}

Table.prototype.applyFunction=function(func){ //TODO: to be tested!
	var i;
	var newTable = new Table();
	
	newTable.name = this.name;
	
	for(i=0; this[i]!=null; i++){
		newTable[i] = this[i].applyFunction(func);
	}
	return newTable.getImproved();
}

/**
 * returns a lis with all the alements of a row
 * @param  {Number} index
 * @return {List}
 * tags:filter
 */
Table.prototype.getRow=function(index){
	var list=new List();
	var i;
	for(i=0; i<this.length; i++){
		list[i]=this[i][index];
	}
	return list.getImproved();
}

/**
 * returns the length of the list at given index (default 0)
 * 
 * @param  {Number} index
 * @return {Number}
 * tags:
 */
Table.prototype.getListLength=function(index){
	return this[index||0].length;
}



/**
 * overrides List.prototype.getLengths (see comments there)
 */
Table.prototype.getLengths=function(){
	var lengths=new NumberList();
	for(var i=0; this[i]!=null; i++){
		lengths[i]=this[i].length;
	}
	return lengths;
}

/**
 * filter a table by selecting a section of rows, elements with last index included
 * @param  {Number} startIndex index of first element in all lists of the table
 * 
 * @param  {Number} endIndex index of last elements in all lists of the table
 * @return {Table}
 * tags:filter
 */
Table.prototype.sliceRows=function(startIndex, endIndex){
	endIndex = endIndex==null?(this[0].length-1):endIndex;
	
	var i;
	var newTable=new Table();
	var newList;
	
	newTable.name = this.name;
	for(i=0; this[i]!=null; i++){
		newList = this[i].getSubList(startIndex, endIndex);
		newList.name = this[i].name;
		newTable.push(newList);
	}
	return newTable.getImproved();
}

/**
 * filters the lists of the table by indexes
 * @param  {NumberList} indexes
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubListsByIndexes=function(indexes){
	var newTable = new Table();
	this.forEach(function(list){
		newTable.push(list.getSubListByIndexes(indexes));
	});
	return newTable.getImproved();
}

//deprecated
Table.prototype.getRows=function(rowsIndexes){
	return Table.prototype.getSubListsByIndexes(indexes);
	// var i;
	// var table = this;
	// var newTable = new Table();
	// newTable.name = this.name;

	// for(i=0; table[i]!=null; i++){
	// 	newTable[i]=new List();
	// 	rowsIndexes.forEach(function(index){
	// 		newTable[i].push(table[i][index]);
	// 	});
	// 	newTable[i] = newTable[i].getImproved();
	// 	newTable[i].name = table[i].name;
	// }

	// return newTable.getImproved();
}

Table.prototype.getWithoutRow=function(rowIndex){
	var newTable=new Table();
	newTable.name = this.name;
	for(var i=0; this[i]!=null; i++){
		newTable[i]=List.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex+1))).getImproved();
		newTable[i].name = this[i].name;
	}
	return newTable.getImproved();
}

Table.prototype.getWithoutRows=function(rowsIndexes){
	var newTable=new Table();
	newTable.name = this.name;
	for(var i=0; this[i]!=null; i++){
		newTable[i]=new List();
		for(j=0; this[i][j]!=null; j++){
			if(rowsIndexes.indexOf(j)==-1) newTable[i].push(this[i][j]);
		}
		//newTable[i] = newTable[i];//TODO:why this?
		newTable[i].name = this[i].name;
	}
	return newTable.getImproved();
}


/**
 * sort table's lists by a list
 * @param  {Object} listOrIndex used to sort (numberList, stringList, dateList…), or index of list in the table
 * 
 * @param  {Boolean} ascending (true by default)
 * @return {Table} table (of the same type)
 * tags:sort
 */
Table.prototype.getListsSortedByList=function(listOrIndex, ascending){
	if(listOrIndex==null) return;

	ascending = ascending==null?true:ascending;
	
	var newTable= instantiateWithSameType(this);
	//c.l('newTable', newTable);

	var i;
	var list = typeOf(listOrIndex)=='number'?this[listOrIndex]:listOrIndex;

	newTable.name = this.name;

	for(i=0; this[i]!=null; i++){
		newTable[i]=this[i].getSortedByList(list, ascending);
	}

	//c.l('newTable', newTable);

	return newTable;
}


Table.prototype.getTransposed=function(firstListAsHeaders){

	var tableToTranspose=firstListAsHeaders?this.getSubList(1):this;

	var table = instantiate(typeOf(tableToTranspose));
	if(tableToTranspose.length==0) return table;
	var i;
	var j;
	var list;
	var rows = tableToTranspose[0].length;
	for(i=0;tableToTranspose[i]!=null;i++){
		list = tableToTranspose[i];
		for(j=0;list[j]!=null;j++){
			if(i==0) table[j] = new List();
			table[j][i] = tableToTranspose[i][j];
		}
	}
	for(j=0;tableToTranspose[0][j]!=null;j++){
		table[j] = table[j].getImproved();
	}

	if(firstListAsHeaders){
		this[0].forEach(function(name, i){
			table[i].name = String(name);
		});
	}

	return table;
}



Table.prototype.sortListsByList=function(list){//TODO: finish
	switch(list.type){
		case 'NumberList':
			return TableOperators.sortListsByNumberList(this, list);
			break;
	}
	return null;
}

////transformative
Table.prototype.removeRow=function(index){
	for(var i=0;this[i]!=null;i++){
		this[i].splice(index,1);
	}
}


////

Table.prototype.clone = function(){
	var clonedTable=instantiateWithSameType(this);
	clonedTable.name = this.name;
  	for(var i=0; this[i]!=null; i++){
    	clonedTable.push(this[i].clone());
  	}
  	return clonedTable;
}

Table.prototype.destroy=function(){
	for(var i=0; this[i]!=null; i++){
		this[i].destroy();
		delete this[i];
	}
}

Table.prototype.print = function(){
	c.log("///////////// <"+this.name+"////////////////////////////////////////////////////");
	c.log(TableEncodings.TableToCSV(this, null, true));
	c.log("/////////////"+this.name+"> ////////////////////////////////////////////////////");
}