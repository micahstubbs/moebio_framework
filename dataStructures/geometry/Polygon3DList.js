Polygon3DList.prototype = new List();
Polygon3DList.prototype.constructor=Polygon3DList;
/**
* Polygon3DList
* @constructor
*/
function Polygon3DList(){
	var array=List.apply(this, arguments);
	array=Polygon3DList.fromArray(array);
   	return array;
};
Polygon3DList.fromArray=function(array){
	var result=List.fromArray(array);
	result.type="Polygon3DList";
	return result;
}