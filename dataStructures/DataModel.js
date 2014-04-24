DataModel.prototype = new Object();
DataModel.prototype.constructor=DataModel;

/**
* DataModel 
* @constructor
*/
function DataModel () {
	Object.apply(this);
	this.type="DataModel";
}
DataModel.prototype.destroy=function(){
	delete this.type;
	delete this.name;
}
DataModel.prototype.setType=function(type){
	this.type=type;
}

DataModel.prototype.getType=function(type){
	return this.type;
}
DataModel.prototype.toString=function(){
	
}
