Interval.prototype = new Point();
Interval.prototype.constructor=Interval;

/**
* Interval
* @param {Number} Interval's x value
* @param {Number} Interval's y value
* @constructor
*/
function Interval (x, y) {
	DataModel.apply(this, arguments);
    this.x=Number(x);
    this.y=Number(y);
    this.type="Interval";
}

Interval.prototype.getMin=function(){
	return Math.min(x,y);
}

Interval.prototype.getMax=function(){
	return Math.max(x,y);
}

Interval.prototype.getAmplitude=function(){
	return Math.abs(this.x-this.y);
}

Interval.prototype.getSignedAmplitude=function(){
	return this.x-this.y;
}

Interval.prototype.getMiddle=function(){
	return (this.x+this.y)*0.5;
}

Interval.prototype.getSign=function(){
	if(this.x==this.y) return 0;
	return this.getAmplitude()/this.getSignedAmplitude();
}

Interval.prototype.getScaled=function(value){
	var midAmp = 0.5*(this.y-this.x);
	var middle = (this.x+this.y)*0.5;
	return new Interval(middle - midAmp*value, middle + midAmp*value);
}

Interval.prototype.getScaledFromProportion=function(value, proportion){
	var antiP = 1-proportion;
	var amp0 = proportion*(this.y-this.x);
	var amp1 = antiP*(this.y-this.x);
	var middle = antiP*this.x+proportion*this.y;
	return new Interval(middle - amp0*value, middle + amp1*value);
}

Interval.prototype.add=function(value){
	return new Interval(this.x+value, this.y+value);
}
		
Interval.prototype.invert=function(){
	var swap=this.x;
	this.x=this.y;
	this.y=swap;
}

/**
 * return a value in interval range
 * 0 -> min
 * 1 -> max
 * @param value between 0 and 1 (to obtain values between min and max)
 * @return 
 * 
 */
Interval.prototype.getInterpolatedValue=function(value){
	return value*Number(this.getSignedAmplitude()) + this.x;
}
		
Interval.prototype.getInverseInterpolatedValue=function(value){
	return (value-this.x)/this.getSignedAmplitude();
}
Interval.prototype.getInterpolatedValues=function(numberList){
	var newNumberList = new Array();
	var nElements=numberList.length;
	for(var i=0; i<nElements; i++){
		newNumberList.push(this.getInterpolatedValue(numberList[i]));
	}
	return newNumberList;
}
Interval.prototype.getInverseInterpolatedValues = function(numberList){
	var newNumberList = new Array();
	var nElements=numberList.length;
	for(var i=0; i<nElements; i++){
		newNumberList.push(this.getInverseInterpolatedValue(numberList[i]));
	}
	return newNumberList;
}

Interval.prototype.intersect = function(interval){
	return new Interval( Math.max(this.x, interval.x), Math.min(this.y, interval.y) );
}

/**
* create a new interval with the same proporties values 
* @return {Interval}
* 
*/
Interval.prototype.clone=function(){
	var newInterval = new Interval(this.x, this.y);
	newInterval.name = name;
	return newInterval;
}
		
/**
* indicate wether a number is included in the interval 
* @param value
* @return {Boolean}
* 
*/
Interval.prototype.contains=function(value){
	if(this.y>this.x) return value>=this.x && value<=this.y;
	return value>=this.y && value<=this.y;
}

/**
* indicate wether other interval contains the same values
* @param interval
* @return {Boolean}
* 
*/
Interval.prototype.isEquivalent=function(interval){
	return this.x==interval.x && this.y==interval.y;
}

/**
 * create a new interval with the same proporties values 
 * @return {String}
 * 
 */

Interval.prototype.toString=function(){
	return "Interval[x:"+this.x+"| y:"+this.y+"| amplitude:"+this.getAmplitude()+"]";
}

		
