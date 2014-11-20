NumberTable.prototype = new Table();
NumberTable.prototype.constructor=NumberTable;

/**
* NumberTable
* @constructor
*/
function NumberTable () {
	var args=[];
	var newNumberList;
	var array

	if(arguments.length>0 && Number(arguments[0])==arguments[0]){
		array = [];
		var i;
		for(i=0;i<arguments[0];i++){
			array.push(new NumberList());
		}
	} else {
		for(var i=0; arguments[i]!=null; i++){
			newNumberList = NumberList.fromArray(arguments[i]);
			newNumberList.name = arguments[i].name;
			arguments[i]=newNumberList;
		}
		array=Table.apply(this, arguments);
	}
	array=NumberTable.fromArray(array);
   	return array;
}

NumberTable.fromArray=function(array){
	var result=Table.fromArray(array);
	result.type="NumberTable";
	
	result.getNumberListsNormalized=NumberTable.prototype.getNumberListsNormalized;
	result.getNormalizedToMax=NumberTable.prototype.getNormalizedToMax;
	result.getNumberListsNormalizedToMax=NumberTable.prototype.getNumberListsNormalizedToMax;
	result.getNumberListsNormalizedToSum=NumberTable.prototype.getNumberListsNormalizedToSum;
	result.getSums=NumberTable.prototype.getSums;
	result.getRowsSums=NumberTable.prototype.getRowsSums;
	result.getAverages=NumberTable.prototype.getAverages;
	result.getRowsAverages=NumberTable.prototype.getRowsAverages;
	result.factor=NumberTable.prototype.factor;
	result.add=NumberTable.prototype.add;
	result.getMax=NumberTable.prototype.getMax;
	result.getMinMaxInterval=NumberTable.prototype.getMinMaxInterval;

	return result;
}

NumberTable.prototype.getNumberListsNormalized=function(factor){
	factor = factor==null?1:factor;
	
	var newTable =  new NumberTable();
	var i;
	for(i=0; this[i]!=null; i++){
		numberList = this[i];
		newTable[i] = numberList.getNormalized(factor);
	}
	newTable.name = this.name;
	return newTable;
}

NumberTable.prototype.getNormalizedToMax=function(factor){
	factor = factor==null?1:factor;
	
	var newTable =  new NumberTable();
	var i;
	var antimax = factor/this.getMax();
	for(i=0; this[i]!=null; i++){
		newTable[i] = this[i].factor(antimax);
	}
	newTable.name = this.name;
	return newTable;
}

NumberTable.prototype.getNumberListsNormalizedToMax=function(factorValue){
	var newTable =  new NumberTable();
	for(var i=0; this[i]!=null; i++){
		numberList = this[i];
		newTable[i] = numberList.getNormalizedToMax(factorValue);
	}
	newTable.name = this.name;
	return newTable;
}

NumberTable.prototype.getNumberListsNormalizedToSum=function(){
	var newTable =  new NumberTable();
	for(var i=0; this[i]!=null; i++){
		numberList = this[i];
		newTable[i] = numberList.getNormalizedToSum();
	}
	newTable.name = this.name;
	return newTable;
}


NumberTable.prototype.getMax=function(){
	if(this.length==0) return null;
	var max=(this[0]).getMax();
	for(var i=1; this[i]!=null; i++){
		max = Math.max(this[i].getMax(), max);
	}
	return max;
}

NumberTable.prototype.getMinMaxInterval=function(){
	if(this.length==0) return null;
	var rangeInterval=(this[0]).getMinMaxInterval();
	for(var i=1; this[i]!=null; i++){
		var newRange=(this[i]).getMinMaxInterval();
		rangeInterval.x=Math.min(rangeInterval.x, newRange.x);
		rangeInterval.y=Math.max(rangeInterval.y, newRange.y);
	}
	return rangeInterval;
}

/**
 * returns a numberList with values from numberlists added
 * @return {Numberlist}
 * tags:
 */
NumberTable.prototype.getSums=function(){
	var numberList = new NumberList();
	for(var i=0; this[i]!=null; i++){
		numberList[i]=this[i].getSum();
	}
	return numberList;
}

/**
 * returns a numberList with all values fro rows added
 * @return {NumberList}
 * tags:
 */
NumberTable.prototype.getRowsSums=function(){
	var sums = this[0].clone();
	var numberList;
	for(var i=1; this[i]!=null; i++){
		numberList = this[i];
		for(var j=0;numberList[j]!=null;j++){
			sums[j]+=numberList[j];
		}
	}
	return sums;
}

NumberTable.prototype.getAverages=function(){
	var numberList = new NumberList();
	for(var i=0; this[i]!=null; i++){
		numberList[i]=this[i].getAverage();
	}
	return numberList;
}

NumberTable.prototype.getRowsAverages=function(){
	var nLists = this.length;
	var averages = this[0].clone().factor(1/nLists);
	var numberList;
	var i;
	var j;
	for(i=1; this[i]!=null; i++){
		numberList = this[i];
		for(j=0;numberList[j]!=null;j++){
			averages[j]+=numberList[j]/nLists;
		}
	}
	return averages;
}

NumberTable.prototype.factor=function(value){
	var newTable =  new NumberTable();
	var i;
	
	switch(typeOf(value)){
		case 'number':
			for(i=0; this[i]!=null; i++){
				numberList = this[i];
				newTable[i] = numberList.factor(value);
			}
			break;
		case 'NumberList':
			for(i=0; this[i]!=null; i++){
				numberList = this[i];
				newTable[i] = numberList.factor(value[i]);
			}
			break;
		
	}
	
	newTable.name = this.name;
	return newTable;
}

NumberTable.prototype.add=function(value){
	var newTable =  new NumberTable();
	
	for(var i=0; this[i]!=null; i++){
		numberList = this[i];
		newTable[i] = numberList.add(value);
	}
	
	newTable.name = this.name;
	return newTable;
}