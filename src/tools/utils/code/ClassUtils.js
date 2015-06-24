import DateOperators from "src/operators/dates/DateOperators";

/*
 * All these function are globally available since they are included in the Global class
 */
export var TYPES_SHORT_NAMES_DICTIONARY = {"Null":"Ø","Object":"{}","Function":"F","Boolean":"b","Number":"#","Interval":"##","Array":"[]","List":"L","Table":"T","BooleanList":"bL","NumberList":"#L","NumberTable":"#T","String":"s","StringList":"sL","StringTable":"sT","Date":"d","DateInterval":"dd","DateList":"dL","Point":".","Rectangle":"t","Polygon":".L","RectangleList":"tL","MultiPolygon":".T","Point3D":"3","Polygon3D":"3L","MultiPolygon3D":"3T","Color":"c","ColorScale":"cS","ColorList":"cL","Image":"i","ImageList":"iL","Node":"n","Relation":"r","NodeList":"nL","RelationList":"rL","Network":"Nt","Tree":"Tr"}

/*
 * types are:
 * number, string, boolean, date, Array, Object
 * and all data models classes names
 */

export function typeOf(object) {
  if(object==null) return null;

  var type = typeof object;
  if(type !== 'object') return type;

  if(object.type!=null) return object.type;

  if(Object.prototype.toString.call(object) == "[object Array]") return "Array";

  if(object.getDate != null) return 'date';

  return 'Object';





  // if(o === null) {
  //   return 'null';
  // } else if(o.getDate != null) {
  //   return 'date';
  // } else {
  //   if(o.getType == null) return 'Object';
  //   var objectType = o.getType();
  //   return objectType;
  // }
  // c.l("[!] ERROR: could not detect type for ", o);
}

// TODO remove?
function VOID() {}

export function instantiate(className, args) {
  switch(className) {
    case 'number':
    case 'string':
      return window[className](args);
    case 'date':
      if(!args || args.length == 0) return new Date();
      if(args.length == 1) {
        if(args[0].match(/\d*.-\d*.-\d*\D\d*.:\d*.:\d*/)) {
          var dateArray = args[0].split(" ");
          dateArray[0] = dateArray[0].split("-");
          if(dateArray[1]) dateArray[1] = dateArray[1].split(":");
          else dateArray[1] = new Array(0, 0, 0);
          return new Date(Date.UTC(dateArray[0][0], Number(dateArray[0][1]) - 1, dateArray[0][2], dateArray[1][0], dateArray[1][1], dateArray[1][2]));
        }
        //
        if(Number(args[0]) != "NaN") return new Date(Number(args[0]));
        else return new Date(args[0]);
      }
      return new Date(Date.UTC.apply(null, args));
      //
    case 'boolean':
      return window[className]((args == "false" || args == "0") ? false : true);
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
  dummyFunction = function() {}; // dummy function
  dummyFunction.prototype = cl.prototype; // reference same prototype
  o = new dummyFunction(); // instantiate dummy function to copy prototype properties
  cl.apply(o, args); // call class constructor, supplying new object as context

  return o;
}

export function getTextFromObject(value, type) {
  if(value == null) return "Null";
  if(value.isList) {
    if(value.length == 0) return "[]";
    var text = value.toString(); // value.length>6?value.slice(0, 5).forEach(function(v){return getTextFromObject(v, typeOf(v))}).join(','):value.toStringList().join(',').forEach(function(v, typeOf(v)){return getTextFromObject(v, type)});
    if(text.length > 160) {
      var i;
      var subtext;
      text = "[";
      for(i = 0; (value[i] != null && i < 6); i++) {
        subtext = getTextFromObject(value[i], typeOf(value[i]));
        if(subtext.length > 40) subtext = subtext.substr(0, 40) + (value[i].isList ? "…]" : "…");
        text += (i != 0 ? ", " : "") + subtext;
      }
      if(value.length > 6) text += ",…";
      text += "]";
    }
    return text;
  }

  switch(type) {
    case "date":
      return DateOperators.dateToString(value);
    case "DateInterval":
      return DateOperators.dateToString(value.date0) + " - " + DateOperators.dateToString(value.date1);
    case "string":
      return((value.length > 160) ? value.substr(0, 159) + "…" : value).replace(/\n/g, "↩");
    case "number":
      return String(value);
    default:
      return "{}"; //value.toString();
  }
}

export function instantiateWithSameType(object, args) {
  return instantiate(typeOf(object), args);
}

export function isArray(obj) {
  if(obj.constructor.toString().indexOf("Array") == -1)
    return false;
  else
    return true;
}

Date.prototype.getType = function() {
  return 'date';
};



export function evalJavaScriptFunction(functionText, args, scope){
	if(functionText==null) return;

	var res;

	var myFunction;

	var good = true;
	var message = '';

	var realCode;

	var lines = functionText.split('\n');

	for(var i=0; lines[i]!=null; i++){
		lines[i] = lines[i].trim();
		if(lines[i] === "" || lines[i].substr(1)=="/"){
			lines.splice(i,1);
			i--;
		}
	}

	var isFunction = lines[0].indexOf('function')!=-1;

	functionText = lines.join('\n');

	if(isFunction){
		if(scope){
			realCode = "scope.myFunction = " + functionText;
		} else {
			realCode = "myFunction = " + functionText;
		}
	} else {
		if(scope){
			realCode = "scope.myVar = " + functionText;
		} else {
			realCode = "myVar = " + functionText;
		}
	}

	try{
		if(isFunction){
			eval(realCode);
			if(scope){
				res = scope.myFunction.apply(scope, args);
			} else {
				res = myFunction.apply(this, args);
			}
		} else {
			eval(realCode);
			if(scope){
				res = scope.myVar;
			} else 	{
				res = myVar;
			}
		}
	} catch(err){
		good = false;
		message = err.message;
		res = null;
	}


  // var isFunction = functionText.split('\n')[0].indexOf('function') != -1;

  // if(isFunction) {
  //   realCode = "myFunction = " + functionText;
  // } else {
  //   realCode = "myVar = " + functionText;
  // }


  // try {
  //   if(isFunction) {
  //     eval(realCode);
  //     res = myFunction.apply(this, args);
  //   } else {
  //     eval(realCode);
  //     res = myVar;
  //   }
  // } catch(err) {
  //   good = false;
  //   message = err.message;
  //   res = null;
  // }

  //c.l('resultObject', resultObject);

  var resultObject = {
    result: res,
    success: good,
    errorMessage: message
  };

  return resultObject;
}

export function argumentsToArray(args) {
  return Array.prototype.slice.call(args, 0);
}

export function TimeLogger(name) {
  var scope = this;
  this.name = name;
  this.clocks = {};

  this.tic = function(clockName) {
    scope.clocks[clockName] = new Date().getTime();
    //c.l( "TimeLogger '"+clockName+"' has been started");
  };
  this.tac = function(clockName) {
    if(scope.clocks[clockName] == null) {
      scope.tic(clockName);
    } else {
      var now = new Date().getTime();
      var diff = now - scope.clocks[clockName];
      console.log("TimeLogger '" + clockName + "' took " + diff + " ms");
    }
  };
}
export var tl = new TimeLogger("Global Time Logger");
