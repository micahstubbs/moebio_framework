/**
* IntervalTableOperators
* @constructor
*/
function IntervalTableOperators(){};


IntervalTableOperators.scaleIntervals = function(intervalTable, value) {
	var newIntervalTable = new Table();
	newIntervalTable.name = intervalTable.name;
	for(var i=0;intervalTable[i]!=null;i++){
		newIntervalTable[i] = IntervalListOperators.scaleIntervals(intervalTable[i], value);
	}
	return newIntervalTable;
}