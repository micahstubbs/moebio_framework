DateList.prototype = new List();
DateList.prototype.constructor=DateList;
/**
* DateList
* @constructor
*/

function DateList() {
	var args=[];
	for(var i=0; i<arguments.length; i++){
		arguments[i]=Number(arguments[i]);
	}
	var array=List.apply(this, arguments);
	array=DateList.fromArray(array);
   	//
   	return array;
}

DateList.fromArray=function(array, forceToDate){
	forceToDate = forceToDate==null?true:forceToDate;
	var result=List.fromArray(array);
	
	if(forceToDate){
		for(var i=0; i<result.length; i++){
			result[i]=Date(result[i]);
		}
	}
	
	result.type="DateList";
   	//assign methods to array:
	result.getTimes=DateList.prototype.getTimes;
	result.toStringList=DateList.prototype.toStringList;
	result.getMin=DateList.prototype.getMin;
	result.getMax=DateList.prototype.getMax;
	return result;
}

DateList.prototype.getTimes=function(){
	var numberList = new NumberList();
	for(var i=0;this[i]!=null;i++){
		numberList.push(this[i].getTime());
	}
	return numberList;
}


DateList.prototype.toStringList=function(){
	var stringList = new StringList();
	for(var i=0;this[i]!=null;i++){
		stringList[i] = DateOperators.dateToString(this[i]);
	}
	return stringList;
}

DateList.prototype.getMin=function(){
	if(this.length==0) return null;
	var min=this[0];
	var i;
	for(i=1; this[i]!=null; i++){
		min=min<this[i]?min:this[i];
	}
	return min;
}

DateList.prototype.getMax=function(){
	if(this.length==0) return null;
	var max=this[0];
	var i;
	for(i=1; this[i]!=null; i++){
		max=max>this[i]?max:this[i];
	}
	return max;
}