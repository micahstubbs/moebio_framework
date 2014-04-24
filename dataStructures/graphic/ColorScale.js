ColorScale.prototype = new DataModel();
ColorScale.prototype.constructor=ColorScale;
/**
* Point
* @constructor
*/
//include(frameworksRoot+"operators/graphic/ColorOperators.js");

function ColorScale (colorScaleFunction) {
	DataModel.apply(this, arguments);
	this.name="";
	this.type="ColorScale";
	
	this.colorScaleFunction = colorScaleFunction?colorScaleFunction:ColorScales.blackScale;
}
ColorScale.prototype.getColor=function(value){
	return this.colorScaleFunction(value);
}
ColorScale.prototype.getColorList=function(nColors){
	var colorList = new ColorList();
	var i;
	for(i=0; i<nColors; i++){
		colorList.push(this.getColor(i/(nColors-1)));
	}
	return colorList;
}