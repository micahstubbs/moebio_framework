NumberListDraw = function(){};

/**
 * draws a simple graph
 * @param  {Rectangle} frame
 * @param  {NumberList} numberList
 *
 * @param {Number} margin
 * tags:draw
 */
NumberListDraw.drawSimpleGraph = function(frame, numberList, margin){
	if(numberList==null || numberList.getNormalized==null) return;

	margin = margin||0;

	//setup
	if(frame.memory==null || numberList!=frame.memory.numberList){
		frame.memory = {};
		frame.memory.numberList = numberList;
		frame.memory.normalizedList = numberList.getNormalized();
	}

	var i;
	var subframe = new Rectangle(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	subframe.bottom = subframe.getBottom();
	var dx = subframe.width/numberList.length;
	setFill('black');
	for(i=0; numberList[i]!=null; i++){
		fRect(subframe.x + i*dx, subframe.bottom, dx-1,  -subframe.height*frame.memory.normalizedList[i]);
	}
}