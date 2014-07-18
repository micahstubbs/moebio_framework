function ListDraw(){};

/**
 * draws a list in a vertical stack
 * @param  {Rectangle} frame
 * @param  {List} list to be drawn
 * 
 * @param {Number} returnMode 0:return index, 1:return element
 * @param  {ColorList} colorList colors of elements
 * @param {Number} textSize
 * @param  {Number} mode 0:color in square if any
 * @return {Number} returns the index of the selected element
 * tags:draw
 */
ListDraw.drawList = function(frame, list, returnMode, colorList, textSize, mode){
	if(list==null || !list.length>0) return;

	textSize = textSize||14;
	returnMode = returnMode||0;
	if(frame.memory==null) frame.memory = {selected:0, y:0};

	var changeList = frame.memory.list!=list;

	if(changeList){
		frame.memory.list=list;
		frame.memory.selected = 0;
	}

	var i;
	var x = frame.x + 5;
	var xTexts = x + (colorList?15:0);
	var y;
	var dy = textSize+4;
	var n = list.length;
	var bottom = frame.getBottom();
	var mouseIn = frame.containsPoint(mP);
	var y0Follow = 0;
	var y0;

	var hList = list.length*dy;

	if(hList<=frame.height-20){
		y0 = frame.y + 10;
	} else {
		if(mouseIn){
			y0Follow = Math.min(10 - (hList - frame.height + 20)*((mY-(frame.y+10))/(frame.height-20)), 10);
		} else {
			y0Follow = 10 - (hList - frame.height + 20)*frame.memory.selected/list.length;
		}

		frame.memory.y = 0.95*frame.memory.y + 0.05*y0Follow;

		y0 = frame.y + frame.memory.y;
	}
	

	setText('black', textSize);

	for(i=0; list[i]!=null; i++){
		y = y0 + dy*i;

		if(y<frame.y) continue;
		if(y+12>bottom) break;

		if(colorList){
			setFill(colorList==null?'rgb(200, 200, 200)':colorList[i%n]);
			fRect(x, y + 4, 10, 10);
		}

		if(frame.memory.selected==i){
			setFill('black');
			fRect(frame.x+2, y, frame.width-4, dy);
			setFill('white');
		} else {
			if(mouseIn && mY>=y && mY<y+dy){
				setFill('rgb(220,220,220)');
				if(fRectM(frame.x+2, y, frame.width-4, dy)){
					setCursor('pointer');
				}
				if(MOUSE_DOWN) frame.memory.selected = i;
			}
			setFill('black');
		}
		
		fText(list[i].toString(), xTexts, y+2);
	}

	return returnMode==1?list[frame.memory.selected]:frame.memory.selected;
}