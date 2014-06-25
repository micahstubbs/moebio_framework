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
	result.sliceRows=Table.prototype.sliceRows;
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
 * return a Table with certain rows indicated in a list of indexes
 * @param  {NumberList} rowsIndexes indexes of rows
 * @return {Table}
 * tags:filter
 */
Table.prototype.getRows=function(rowsIndexes){
	var i;
	var table = this;
	var newTable = new Table();
	newTable.name = this.name;

	for(i=0; table[i]!=null; i++){
		newTable[i]=new List();
		rowsIndexes.forEach(function(index){
			newTable[i].push(table[i][index]);
		});
		newTable[i] = newTable[i].getImproved();
		newTable[i].name = table[i].name;
	}

	return newTable.getImproved();
}

Table.prototype.getLengths=function(){
	var lengths=new NumberList();
	for(var i=0; this[i]!=null; i++){
		lengths[i]=this[i].length;
	}
	return lengths;
}

Table.prototype.sliceRows=function(startIndex, endIndex){
	var newTable=new Table();
	newTable.name = this.name;
	for(var i=0; this[i]!=null; i++){
		newTable.push(this[i].getSubList(startIndex, endIndex));
	}
	return newTable.getImproved();
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



Table.prototype.getListsSortedByList=function(list, ascendant){
	var newTable= instantiateWithSameType(this);
	newTable.name = this.name;
	for(var i=0; this[i]!=null; i++){
		newTable[i]=this[i].getSortedByList(list, ascendant);
	}
	return newTable;
}

Table.prototype.getTransposed=function(){
	var table = instantiate(typeOf(this));
	if(this.length==0) return table;
	var i;
	var j;
	var list;
	var rows = this[0].length;
	for(i=0;this[i]!=null;i++){
		list = this[i];
		for(j=0;list[j]!=null;j++){
			if(i==0) table[j] = new List();
			table[j][i] = this[i][j];
		}
	}
	for(j=0;this[0][j]!=null;j++){
		table[j] = table[j].getImproved();
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