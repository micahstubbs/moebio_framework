function TableConversions(){};

/**
 * Convert an object (or more typically an Array of objects) into a Table
 * @param {Object} object or array of objects 
 * 
 * @param {List} list of field names to include (by default will take all from first element in array of objects)
 * @return {Table} resulting Table
 * tags:decoder
 */
TableConversions.ObjectToTable = function(object, fields){
	// Formats:
	// 1: normal list of objects
	// 2: Object with single property, containing normal list of obejcts
	// 3: Object as CSV (each property represents a column)
	var format;	

	// If it's an array, then it's format 1
	if( Array.isArray(object) ){  
		format = 1;
		// If not field names supplied, get them from first element
		if( !fields )
		{
			fields = [];
			for( var p in object[0] ){
				fields.push( p );
			}
		}
	// Else (not array), it's an object
	}else{
		// Check how many properties the object has
		var properties = [];
		for( var p in object ){
			properties.push( p );
		}

		// If it has only one, and it's an array, it's foramt 2, so assume it's just a capsule
		// and extract the array as format 1
		if( properties.length == 1 && Array.isArray( object[properties[0]] ) )
		{
			format = 1;
			object = object[properties[0]];

			// If not field names supplied, get them from first element
			if( !fields )
			{
				fields = [];
				for( var p in object[0] ){
					fields.push( p );
				}
			}
		}else{
			// Finally, if the object has many properties, we assume it's a csv encoded as JSON 
			// ( each property of the object represents a column of the CSV )
			format = 3;

			// If not fields supplied, use all properties
			if( !fields )
				fields = properties;
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
	if( format == 1)
	{
		for (var i = 0; i < object.length; i++) {
			var row = object[i];
			for( var f=0; f<fields.length; f++ ){
				result[f].push( row[fields[f]]);
			}
		};
	}else{
		for( var f=0; f<fields.length; f++ ){
			var column = object[ fields[f] ];
			for (var i = 0; i < column.length; i++) {
				result[f].push( column[i] );
			}
		};
	}

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
TableConversions.TableToObject = function(table, fields ){
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