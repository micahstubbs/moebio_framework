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
	//c.log('o', o);
	
	var type = typeof o;

	//c.log('      o:'+o+'. typeof o:['+typeof o+']');
	
	// c.log('type', type);
	// c.log("type !== 'object'", type !== 'object');
	// c.log("type !== 'Object'", type !== 'Object');
	
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
// Object.prototype.isOfType=function(name){
	// if(this.constructor.toString().indexOf("Array")!=-1){
		// return !(this._constructor!=null && this._constructor.toString().indexOf(name) == -1);
	// }
	// return !(this.constructor.toString().indexOf(name) == -1);
// }

//////// uniqueGlobalFunc, executeUniqueGlobalFunc, what are their purpose?

var uniqueGlobalFunc=new Array();
function getUniqueGlobalFunc(func, scope){
	uniqueGlobalFunc.push([func, scope]);
	return uniqueGlobalFunc.length-1;
}
function executeUniqueGlobalFunc(index, value){
	if(index==undefined) return;
	uniqueGlobalFunc[index][0].call(uniqueGlobalFunc[index][1], value);
}

/////////