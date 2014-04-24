function StringConversions(){};


/**
 * converts a string in json format into an Object (JSON.parse(string))
 * @param  {String} string in format json
 * @return {Object}
 * tags:convertion
 */
StringConversions.stringToObject = function(string){
	return JSON.parse(string);
}