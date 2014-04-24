function ListDraw(){};

/**
 * draws a list in a vertical stack
 * @param  {Rectangle} frame
 * @param  {List} list to be drawn
 * 
 * @param  {ColorList} colorList optional
 * @param  {Number} mode 0:color in square if any
 * @return {Number} returns the index of the selected element
 * tags:draw
 */
ListDraw.drawList = function(frame, list, colorList, mode){
	var i;
	var x = frame.x + 5;
	var y;
	var dy = 18;
	var n = list.length;
	var bottom = frame.getBottom();

	setText('black', 14);
	for(i=0; list[i]!=null; i++){
		y = frame.y + dy*i + 5;
		if(y>bottom) return;
		setFill(colorList==null?'rgb(200, 200, 200)':colorList[i%n]);
		fRect(x, y + 4, 10, 10);
		setFill('black');
		fText(list[i].toString(), x + 15, y + 2);
		
	}
}