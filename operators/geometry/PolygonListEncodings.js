
function PolygonListEncodings(){};

PolygonListEncodings.StringToPolygonList=function(string, separatorCoordinates, separatorPolygons){
	separatorCoordinates = separatorCoordinates || ",";
	separatorPolygons = separatorPolygons||"/";
	
	var polygonList = new PolygonList();
	var polygon;
	var point;
	
	pols = StringOperators.splitString(string, separatorPolygons);
	
	var j;
	var numbers;
	for(var i=0; pols[i]!=null; i++){
		polygon = new Polygon();
		numbers = StringOperators.splitString(pols[i], separatorCoordinates);
		for(j=0; numbers[j]!=null; j+=2){
			point = new Point(Number(numbers[j]), Number(numbers[j+1]));
			polygon.push(point);
		}
		polygonList.push(polygon);
	}
	return polygonList;
}


PolygonListEncodings.polygonListToString=function(polygonList, separatorCoordinates, separatorPolygons){
	separatorCoordinates = separatorCoordinates || ",";
	separatorPolygons = separatorPolygons||"/";
	
	var j;
	var t='';
	for(var i=0;this[i]!=null;i++){
		t+=(i==0?'':separatorPolygons);
		for(j=0; this[i][j]!=null; j++){
			t+=(j==0?'':separatorCoordinates)+this[i][j].x+separatorCoordinates+this[i][j].y;
		}
	}
	return t;
}