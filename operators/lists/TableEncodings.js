function TableEncodings(){};

TableEncodings.ENTER = String.fromCharCode(13);
TableEncodings.ENTER2 =  String.fromCharCode(10);
TableEncodings.ENTER3 = String.fromCharCode(8232);
		
TableEncodings.SPACE =  String.fromCharCode(32);
TableEncodings.SPACE2 = String.fromCharCode(160);
		
TableEncodings.TAB = "	";
TableEncodings.TAB2 =  String.fromCharCode(9);


/**
 * Decode a String in format CSV into a Table
 * @param {String} csv CSV formatted text
 * 
 * @param {Boolean} first_row_header first row is header (default: false)
 * @param {String} separator separator character (default: ",")
 * @param {Object} value_for_nulls Object to be placed instead of null values
 * @return {Table} resulting Table
 * tags:decoder
 */
TableEncodings.CSVtoTable=function(csvString, firstRowIsHeader, separator, valueForNulls){
	valueForNulls = valueForNulls==null?'':valueForNulls;
	var i;
	var _firstRowIsHeader=firstRowIsHeader==null?false:firstRowIsHeader;
	
	if(csvString==null) return null;
	if(csvString=="") return new Table();

	csvString = csvString.replace(/\$/g, "");
	
	var blocks = csvString.split("\"");
	for(i=1; blocks[i]!=null; i+=2){
		blocks[i] = blocks[i].replace(/\n/g, "*ENTER*");
	}
	csvString = blocks.join("\"");//TODO: create a general method for replacements inside "", apply it to chomas
	
	var enterChar = TableEncodings.ENTER2;
	var lines = csvString.split(enterChar);
	if(lines.length==1){
		enterChar = TableEncodings.ENTER;
		lines = csvString.split(enterChar);
		if(lines.length==1){
			enterChar = TableEncodings.ENTER3;
			lines = csvString.split(enterChar);
		}
	}
	
	var table = new Table();
	var comaCharacter=separator!=undefined?separator:",";
	
	if(csvString==null || csvString=="" || csvString==" " || lines.length==0) return null;
	
	var startIndex=0;
	if(_firstRowIsHeader){
		startIndex=1;
		var headerContent = lines[0].split(comaCharacter);
	}
	
	var element;
	var cellContent;
	var numberCandidate;
	for(i=startIndex; i<lines.length; i++){
		if(lines[i].length<2) continue;
		
		var cellContents = NetworkEncodings.replaceChomasInLine(lines[i]).split(comaCharacter);//TODO: will be obsolete (see previous TODO)
		
		for(j=0; j<cellContents.length; j++){
			table[j]=table[j]==null?new List():table[j];
			if(_firstRowIsHeader && i==1){
				table[j].name=headerContent[j]==null?"":TableEncodings._removeQuotes(headerContent[j]);
			}
			var actualIndex=_firstRowIsHeader?(i-1):i;
			
			cellContent = cellContents[j].replace(/\*CHOMA\*/g, ",").replace(/\*ENTER\*/g, "\n");
			
			cellContent = cellContent==''?valueForNulls:cellContent;

			numberCandidate = Number(cellContent.replace(',', '.'));
			
			element = (numberCandidate||(numberCandidate==0 && cellContent!=''))?numberCandidate:cellContent;
			
			if(typeof element =='string' ) element = TableEncodings._removeQuotes(element);
			
			table[j][actualIndex]=element;
		}
	}
	
	for(i=0;table[i]!=null;i++){
		table[i] = table[i].getImproved();
	}
	
	table = table.getImproved();
	
	return table;
}

TableEncodings._removeQuotes=function(string){
	if(string.length==0) return string;
	if((string.charAt(0)=="\"" || string.charAt(0)=="'") && (string.charAt(string.length-1)=="\"" || string.charAt(string.length-1)=="'")) string = string.substr(1,string.length-2);
	return string;
}


/**
 * Encode a Table into a String in format CSV
 * @param {Table} Table to be enconded
 * 
 * @param {String} separator character (default: ",")
 * @param {Boolean} first row as List names (default: false)
 * @return {String} resulting String in CSV format
 * tags:encoder
 */
TableEncodings.TableToCSV=function(table, separator, namesAsHeaders){
	separator=separator||",";
	var i;
	var j;
	var list;
	var type;
	var lines = ListGenerators.createListWithSameElement(table[0].length, "");
	var addSeparator;
	for(i=0;table[i]!=null;i++){
		list = table[i];
		type = list.type;
		addSeparator = i!=table.length-1;
		for(j=0;list[j]!=null;j++){
			switch(type){
				case 'NumberList':
					lines[j]+=list[j];
					break;
				default:
					lines[j]+="\""+list[j]+"\"";
					break;
			}
			if(addSeparator) lines[j]+=separator;
		}
	}
	
	var headers='';
	if(namesAsHeaders){
		for(i=0;table[i]!=null;i++){
			list = table[i];
			headers += "\""+list.name+"\"";
			if(i!=table.length-1) headers+=separator;
		}
		headers+='\n';
	}
	
	return headers+lines.getConcatenated("\n");
}



/**
 * Convert an object (or more typically an Array of objects) into a Table
 * @param {Object} object or array of objects 
 * 
 * @param {List} list of field names to include (by default will take all from first element in array of objects)
 * @return {Table} resulting Table
 * tags:decoder
 */
TableEncodings.ObjectToTable = function(object, fields){
	// Make sure we have an array to iterate
	if( !Array.isArray(object) )
		object = [object];
	// If no field names supplied, take them from first element
	if( !fields )
	{
		fields = [];
		for( var p in object[0] ){
			fields.push( p );
		}
	}
	// Create table and columns
	var result = new Table();
	for (var i = 0; i < fields.length; i++) {
		var fieldName = fields[i];
		var column = new List();
		result[i] = column;
		column.name = fieldName;
	};

	// Fill the table
	for (var i = 0; i < object.length; i++) {
		var row = object[i];
		for( var f=0; f<fields.length; f++ ){
			result[f].push( row[fields[f]]);
		}
	};

	// Improve columns
	for (var i = 0; i < result.length; i++) {
		result[i] = result[i].getImproved()
	}

	// Improve table
	result = result.getImproved();

	// Return best possible
	return result; 
}



/**
 * Convert a Table into an Object or Array of objects
 * @param {Object} table to be converted
 * 
 * @param {List} list of field names to include (by default will take all from table)
 * @return {Object} containing list of rows from input Table
 * tags:decoder
 */
 // To-Do: should return a List instead of Array?
TableEncodings.TableToObject = function(table, fields ){
	// If no field names supplied, take them from first element
	if( !fields )
	{
		fields = table.getNames()
	}
	var result = [];
	for (var i = 0; i < table[0].length; i++) {
		var row = {};
		for( var f=0; f<fields.length; f++ )
		{
			row[fields[f]] = table[f][i];
		}
		result.push(row);
	};
	return { array:result };
}
// Tests ObjectToTable / TableToObject
/*
var input = [ {name:"dani", age:36, other:"eee"}, {name:"alejandro", age:34}, {name:"anna", age:37} ];
var table = TableEncodings.ObjectToTable( input );
console.log( "ObjectToTable: ", table );
var obj = TableEncodings.TableToObject(table);
console.log( "ObjectToTable INVERSE: ", obj );
*/