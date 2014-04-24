StringList.prototype = new List();
StringList.prototype.constructor=StringList;
/**
* StringList
* @constructor
*/

function StringList () {
	var args=[];//TODO:why this?, ask M
	
	for(var i=0; i<arguments.length; i++){
		arguments[i]=String(arguments[i]);
	}
	var array=List.apply(this, arguments);
	array=StringList.fromArray(array);
   	//
   	return array;   	
}

StringList.fromArray=function(array, forceToString){
	forceToString = forceToString==null?true:forceToString;
	
	var result=List.fromArray(array);
	if(forceToString){
		for(var i=0; i<result.length; i++){
			result[i]=String(result[i]);
		}
	}
	result.type="StringList";
	
   	//assign methods to array:
   	result.toLowerCase=StringList.prototype.toLowerCase;
   	result.toUpperCase=StringList.prototype.toUpperCase;
   	result.append=StringList.prototype.append;
   	result.getSurrounded=StringList.prototype.getSurrounded;
   	result.replace=StringList.prototype.replace;
   	result.getConcatenated=StringList.prototype.getConcatenated;
   	result.toNumberList=StringList.prototype.toNumberList;
   	result.toDateList=StringList.prototype.toDateList;
   	
   	//override
	result.clone = StringList.prototype.clone;
   	
	return result;
}

StringList.prototype.append=function(sufix, after){
	after = after==null?true:after;
	var newStringList = new StringList();
	newStringList.name = this.name;
	var sufixIsStringList = typeOf(sufix)=="StringList";
	var i;
	if(after){
		for(i=0;this[i]!=null;i++){
			newStringList[i]=this[i]+(sufixIsStringList?sufix[i]:sufix);
		}
	} else {
		for(i=0;this[i]!=null;i++){
			newStringList[i]=(sufixIsStringList?sufix[i]:sufix)+this[i];
		}
	}
	return newStringList;
}

/**
 * prefix and sufix can be string or a StringList
 */
StringList.prototype.getSurrounded=function(prefix, sufix){
	var newStringList = new StringList();
	newStringList.name = this.name;
	var i;
	
	var prefixIsStringList = Array.isArray(prefix);
	var sufixIsStringList = Array.isArray(sufix);
	
	for(i=0;this[i]!=null;i++){
		newStringList[i]=(prefixIsStringList?prefix[i]:prefix)+this[i]+(sufixIsStringList?sufix[i]:sufix);
	}
	
	return newStringList;
}

/**
 * [!] works with regular expressions
 */
StringList.prototype.replace=function(regExp, string){
	var newStringList = new StringList();
	newStringList.name = this.name;
	
	for(var i=0;this[i]!=null;i++){
		newStringList[i]=this[i].replace(regExp, string);
	}
	
	return newStringList;
}

StringList.prototype.getConcatenated=function(separator){
	var i;
	var string="";
	for(i=0;this[i]!=null;i++){
		string+=this[i];
		if(i<this.length-1) string+=separator;
	}
	return string;
}


StringList.prototype.toLowerCase=function(){
	var newStringList = new StringList();
	newStringList.name = this.name;
	var i;
	for(i=0;this[i]!=null;i++){
		newStringList[i]=this[i].toLowerCase();
	}
	return newStringList;
}

StringList.prototype.toUpperCase=function(){
	var newStringList = new StringList();
	newStringList.name = this.name;
	var i;
	for(i=0;this[i]!=null;i++){
		newStringList[i]=this[i].toUpperCase();
	}
	return newStringList;
}

StringList.prototype.toNumberList=function(){
	var numbers = new NumberList();
	numbers.name = this.name;
	var i;
	for(i=0;this[i]!=null;i++){
		numbers[i]=Number(this[i]);
	}
	return numbers;
}


/**
 * format cases
 * 0: MM-DD-YYYY
 * 1: YYYY-MM-DD
 */
StringList.prototype.toDateList=function(formatCase, separator){
	var dateList = new DateList();
	var i;
	for(i=0;this[i]!=null;i++){
		dateList.push(DateOperators.stringToDate(this[i], formatCase, separator));
	}
	return dateList;
}


///////overriding

StringList.prototype.clone=function(){
	var newList = StringList.fromArray(this.slice(), false);
	newList.name = this.name;
	return newList;
}