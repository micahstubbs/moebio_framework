ColorList.prototype = new List();
ColorList.prototype.constructor=ColorList;
/**
* ColorList
* @constructor
*/

function ColorList () {
	var args=[];
	var i;
	for(i=0; i<arguments.length; i++){
		arguments[i]=arguments[i];
	}
	var array=List.apply(this, arguments);
	array=ColorList.fromArray(array);
   	//
   	return array;
}

ColorList.fromArray=function(array){
	var result=List.fromArray(array);
	result.type="ColorList";
	result.getRgbArrays=ColorList.prototype.getRgbArrays;
	result.getInterpolated=ColorList.prototype.getInterpolated;
	result.getInverted=ColorList.prototype.getInverted;
	result.addAlpha=ColorList.prototype.addAlpha;
	return result;
}

ColorList.prototype.getRgbArrays=function(){
	var rgbArrays = new List();
	
	for(var i=0; this[i]!=null; i++){
		rgbArrays[i] = ColorOperators.colorStringToRGB(this[i]);
	}
	
	return rgbArrays;
}

ColorList.prototype.getInterpolated=function(color, value){
	var newColorList = new ColorList();
	
	for(var i=0; this[i]!=null; i++){
		newColorList[i] = ColorOperators.interpolateColors(this[i], color, value);
	}
	
	newColorList.name = this.name;
	return newColorList;
}

ColorList.prototype.getInverted=function(){
	var newColorList = new ColorList();
	
	for(var i=0; this[i]!=null; i++){
		newColorList[i] = ColorOperators.invertColor(this[i]);
	}
	
	newColorList.name = this.name;
	return newColorList;
}

ColorList.prototype.addAlpha=function(alpha){
	var newColorList = new ColorList();
	
	for(var i=0; this[i]!=null; i++){
		newColorList[i] = ColorOperators.addAlpha(this[i], alpha);
	}
	
	newColorList.name = this.name;
	return newColorList;
}