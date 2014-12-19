/**
 * All these function are globally available since they are included in the Global class
 * 
 */

/**
 * types are:
 * number, string, boolean, date
 * and all data models classes names
 */
function typeOf(o){
	var type = typeof o;
	
	if (type !== 'object') {
		return type;
	}
	
	if (o === null) {
		return 'null';
	} else if(o.getDate!=null){
		return 'date';
	} else {
		if(o.getType==null) return 'Object';
		var objectType=o.getType();
		return objectType;
	}
	c.log("[!] ERROR: could not detect type for ", o);
}

function VOID(){}

function instantiate(className, args) {
	switch(className){
		case 'number':
		case 'string':
			return window[className](args);
		case 'date':
			if(!args || args.length==0) return new Date();
			if(args.length==1){
				if(args[0].match(/\d*.-\d*.-\d*\D\d*.:\d*.:\d*/)){
					var dateArray=args[0].split(" ");
					dateArray[0]=dateArray[0].split("-");
					if(dateArray[1]) dateArray[1]=dateArray[1].split(":");
					else dateArray[1]=new Array(0, 0, 0);
					return new Date(Date.UTC(dateArray[0][0], Number(dateArray[0][1])-1, dateArray[0][2], dateArray[1][0], dateArray[1][1], dateArray[1][2]));
				}
				//
				if(Number(args[0])!="NaN") return new Date(Number(args[0]));
				else return new Date(args[0]);
			}
			return new Date(Date.UTC.apply(null, args));
			//
		case 'boolean':
			return window[className]((args=="false"||args=="0")?false:true);
		case 'List':
		case 'Table':
		case 'StringList':
		case 'NumberList':
		case 'NumberTable':
		case 'NodeList':
		case 'RelationList':
		case 'Polygon':
		case 'Polygon3D':
		case 'PolygonList':
		case 'DateList':
		case 'ColorList':
			return window[className].apply(window, args);
		case null:
		case undefined:
		case 'undefined':
			return null;
	}
	//generic instantiation of object:
    var o, dummyFunction, cl;
    cl = window[className]; // get reference to class constructor function
    dummyFunction = function(){}; // dummy function
    dummyFunction.prototype = cl.prototype; // reference same prototype
    o = new dummyFunction(); // instantiate dummy function to copy prototype properties
    cl.apply(o, args); // call class constructor, supplying new object as context
   
    return o;
}

getTextFromObject = function(value, type){
	if(value==null) return "Null";
	if(value.isList){
		if(value.length==0) return "[]";
		var text = value.toString();// value.length>6?value.slice(0, 5).forEach(function(v){return getTextFromObject(v, typeOf(v))}).join(','):value.toStringList().join(',').forEach(function(v, typeOf(v)){return getTextFromObject(v, type)});
		if(text.length>160){
			var i;
			var subtext;
			text = "[";
			for(i=0; (value[i]!=null && i<6); i++){
				subtext = getTextFromObject(value[i], typeOf(value[i]));
				if(subtext.length>40) subtext = subtext.substr(0,40)+(value[i].isList?"…]":"…");
				text+=(i!=0?", ":"")+subtext;
			}
			if(value.length>6) text+=",…";
			text+="]"
		}
		return text;
	}

	switch(type){
		case "date":
			return DateOperators.dateToString(value);
		case "DateInterval":
			return DateOperators.dateToString(value.date0)+" - "+DateOperators.dateToString(value.date1);
		case "string":
			return ((value.length>160)?value.substr(0, 159)+"…":value).replace(/\n/g, "↩");
		case "number":
			return String(value);
		default:
			return "{}";//value.toString();
	}
}

function instantiateWithSameType(object, args) {
	return instantiate(typeOf(object), args);
}

function isArray(obj) {
   if (obj.constructor.toString().indexOf("Array")==-1)
      return false;
   else
      return true;
}
Date.prototype.getType=function(){
	return 'Date';
}


evalJavaScriptFunction = function(functionText, args){
	//if(HOLD) return;

	var res;

	var myFunction;
	
	var good = true;
	var message = '';

	var realCode;

	var isFunction = functionText.split('\n')[0].indexOf('function')!=-1;

	if(isFunction){
		realCode = "myFunction = " + functionText;
	} else {
		realCode = "myVar = " + functionText;
	}

	try{
		if(isFunction){
			eval(realCode);
			res = myFunction.apply(this, args);
		} else {
			eval(realCode);
			res = myVar;
		}
	} catch(err){
		good = false;
		message = err.message;
		res = null;
	}

	var resultObject = {
		result:res,
		success:good,
		errorMessage:message
	};

	return resultObject;
}



function argumentsToArray(args){
	return Array.prototype.slice.call(args, 0);
}







function TimeLogger( name ){
	var scope = this;
	this.name = name;
	this.clocks = {};

	this.tic = function( clockName ){
		scope.clocks[clockName] = new Date().getTime();
		//c.l( "TimeLogger '"+clockName+"' has been started");
	}
	this.tac = function( clockName ){
		if( scope.clocks[clockName]==null ){
			scope.tic( clockName );
		}else{
			var now = new Date().getTime();
			var diff = now - scope.clocks[clockName];
			c.l( "TimeLogger '"+clockName+"' took " + diff + " ms");
		}
	}
}
var tl = new TimeLogger( "Global Time Logger" );




