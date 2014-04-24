DateInterval.prototype = new DataModel();
DateInterval.prototype.constructor=DateInterval;

/**
* DateInterval
* @param {Date} Interval's minimum value
* * @param {Date} Interval's maximum value
* @constructor
*/
function DateInterval (date0, date1) {
	DataModel.apply(this, arguments);
    this.date0=date0;
    this.date1=date1;
    this.type="DateInterval";
}
DateInterval.prototype.toString=function(){
	return "DateInterval["+this.date0+", "+this.date1+"]";
}

DateInterval.prototype.getMax=function(){
	if(this.date1>this.date0) return this.date1;
	return this.date0;
}

DateInterval.prototype.getMin=function(){
	if(this.date0<this.date1) return this.date0;
	return this.date1;
}