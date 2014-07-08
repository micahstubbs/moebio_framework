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
		frame.memory = {
			numberList:numberList,
			minmax:numberList.getMinMaxInterval(),
			zero:null
		}
		if(frame.memory.minmax.x>0 && frame.memory.minmax.y>0){
			frame.memory.normalizedList = numberList.getNormalizedToMax()
		} else {
			frame.memory.normalizedList = numberList.getNormalized();
			frame.memory.zero = -frame.memory.minmax.x/frame.memory.minmax.getAmplitude();
		}
	}

	var i;
	var subframe = new Rectangle(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	subframe.bottom = subframe.getBottom();
	var dx = subframe.width/numberList.length;
	setFill('black');
	if(frame.memory.zero){
		for(i=0; numberList[i]!=null; i++){
			fRect(subframe.x + i*dx, subframe.bottom - subframe.height*frame.memory.zero, dx-1,  -subframe.height*(frame.memory.normalizedList[i]-frame.memory.zero));
		}
	} else {
		for(i=0; numberList[i]!=null; i++){
			fRect(subframe.x + i*dx, subframe.bottom, dx-1,  -subframe.height*frame.memory.normalizedList[i]);
		}
	}
}