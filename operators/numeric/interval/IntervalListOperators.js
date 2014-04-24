/**
* IntervalListOperators
* @constructor
*/
function IntervalListOperators(){};


IntervalListOperators.scaleIntervals = function(intervalList, value) {
	var newIntervalList = new List();
	newIntervalList.name = intervalList.name;
	for(var i=0;intervalList[i]!=null;i++){
		newIntervalList[i] = intervalList[i].getScaled(value);
	}
	return newIntervalList;
}