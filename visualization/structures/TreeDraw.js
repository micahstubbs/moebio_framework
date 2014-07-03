function TreeDraw(){};


/**
 * simple tree visualization with levels in vertical rectangles
 * @param  {Rectangle} frame
 * @param  {Tree} tree
 * 
 * @param  {ColorList} levelColors
 * @param  {Number} margin
 * tags:draw
 */
TreeDraw.drawRectanglesTree = function(frame, tree, levelColors, margin){
	levelColors = levelColors==null?ColorListGenerators.createCategoricalColors(1, tree.nLevels):levelColors;
	margin = margin||1;

	var dX = frame.width/tree.nLevels;
	TreeDraw._drawRectanglesTreeChildren(tree.nodeList[0], new Rectangle(frame.x,frame.y,dX,frame.height), levelColors, margin);
}
TreeDraw._drawRectanglesTreeChildren = function(node, frame, colors, margin){
	context.fillStyle = colors[node.level];
	context.fillRect(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	var children = node.toNodeList;
	//c.log(node.level, node.name, children.length);
	if(children.length>0){
		var i;
		var dY = frame.height/(node.descentWeight-1);
		var yy = frame.y;
		var h;
		for(i=0;children[i]!=null;i++){
			h = dY*(children[i].descentWeight);
			TreeDraw._drawRectanglesTreeChildren(children[i], new Rectangle(frame.x+frame.width,yy,frame.width, h), colors, margin);
			yy+=h;
		}
	}
}

/**
 * simple treemap visualization
 * @param  {Rectangle} frame
 * @param  {Tree} tree
 * 
 * @param  {ColorList} colors
 * tags:draw
 */
TreeDraw.drawTreemap = function(frame, tree, colors){
	var change = frame.memory==null || frame.memory.tree!=tree || frame.memory.colors!=colors || frame.memory.width!=frame.width || frame.memory.height!=frame.height;

	if(change){
		frame.memory = {
			tree:tree,
			colors:colors,
			width:frame.width,
			height:frame.height,
			kx:1,
			mx:0,
			ky:1,
			my:0
		}
		tree.nodeList[0]._outRectangle = new Rectangle(0,0,frame.width,frame.height);
		tree.nodeList[0]._inRectangle = TreeDraw._inRectFromOutRect(tree.nodeList[0]._outRectangle);
		TreeDraw._generateRectangles(tree.nodeList[0]);

		frame.memory.focusFrame = TreeDraw._expandRect(tree.nodeList[0]._outRectangle);

		setText('black', 12);
		tree.nodeList.forEach(function(node){
			node._textWidth = getTextW(node.name);
		});

	}


	var kxF = frame.width/frame.memory.focusFrame.width;
	var mxF = - kxF*frame.memory.focusFrame.x;
	var kyF = frame.height/frame.memory.focusFrame.height;
	var myF = - kyF*frame.memory.focusFrame.y;

	frame.memory.kx = 0.9*frame.memory.kx + 0.1*kxF;
	frame.memory.mx = 0.9*frame.memory.mx + 0.1*mxF;
	frame.memory.ky = 0.9*frame.memory.ky + 0.1*kyF;
	frame.memory.my = 0.9*frame.memory.my + 0.1*myF;

	var kx = frame.memory.kx;
	var mx = frame.memory.mx;
	var ky = frame.memory.ky;
	var my = frame.memory.my;

	var tx = function(x){return kx*x+mx};
	var ty = function(y){return ky*y+my};
	

	var x, y;
	var margTextX,margTextY;
	var textSize;
	var exceedes;
	var rect;
	var overNode = null;

	setStroke('black', 0.2);

	clipRectangle(frame.x, frame.y, frame.width, frame.height);

	tree.nodeList.forEach(function(node){

		rect = new Rectangle(tx(node._outRectangle.x), ty(node._outRectangle.y), node._outRectangle.width*kx, node._outRectangle.height*ky);

		if(rect.width>2 && rect.height>2 && rect.x<frame.getRight() && rect.getRight()>0 && rect.y<frame.getBottom() && rect.getBottom()>0){

			x = Math.round(frame.x + rect.x)+0.5;
			y = Math.round(frame.y + rect.y)+0.5;
			if(sRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) overNode = node;
			if(rect.width>20){
				margTextX = rect.width*TreeDraw.PROP_RECT_MARGIN*0.8;
				margTextY = rect.height*TreeDraw.PROP_RECT_MARGIN*0.15;
				textSize = rect.height*TreeDraw.PROP_RECT_LABEL-2;
				if(textSize>=5){
					setText('black', textSize);
					exceedes = (node._textWidth*textSize/12)>(rect.width-1.2*margTextX);
					if(exceedes) clipRectangle(x+margTextX, y+margTextY,rect.width-2*margTextX, textSize*2);
					fText(node.name, x+margTextX, y+margTextY);
					if(exceedes) context.restore();
				}
			}
		}
	});

	
	if(overNode){
		rect = new Rectangle(tx(overNode._outRectangle.x), ty(overNode._outRectangle.y), overNode._outRectangle.width*kx, overNode._outRectangle.height*ky);
		x = Math.round(frame.x + rect.x)+0.5;
		y = Math.round(frame.y + rect.y)+0.5;
		setStroke('black', 2);
		sRect(x, y, Math.floor(rect.width), Math.floor(rect.height))

		if(MOUSE_DOWN) frame.memory.focusFrame = TreeDraw._expandRect(overNode._outRectangle);
	}

	context.restore();
	
}
TreeDraw._generateRectangles = function(node){
	var weights = new NumberList();
	node.toNodeList.forEach(function(node){
		weights.push(node.descentWeight);
	});
	var rectangles = RectangleOperators.quadrification(node._inRectangle, weights, false, false);
	node.toNodeList.forEach(function(child, i){
		child._outRectangle = TreeDraw._reduceRect(rectangles[i]);
		child._inRectangle = TreeDraw._inRectFromOutRect(child._outRectangle);
		TreeDraw._generateRectangles(child);
	});
}
TreeDraw._reduceRect = function(rect){
	return new Rectangle(rect.x + rect.width*TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.y + rect.height*TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.width*(1-2*TreeDraw.PROP_RECT_REDUCTION_MARGIN), rect.height*(1-2*TreeDraw.PROP_RECT_REDUCTION_MARGIN) );
}
TreeDraw._expandRect = function(rect){
	return new Rectangle(rect.x - rect.width*TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.y - rect.height*TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.width*(1+2*TreeDraw.PROP_RECT_EXPANTION_MARGIN), rect.height*(1+2*TreeDraw.PROP_RECT_EXPANTION_MARGIN) );
}
TreeDraw._inRectFromOutRect = function(rect){
	return new Rectangle(rect.x + rect.width*TreeDraw.PROP_RECT_MARGIN, rect.y + rect.height*TreeDraw.PROP_RECT_LABEL, rect.width*(1-2*TreeDraw.PROP_RECT_MARGIN), rect.height*(1-TreeDraw.PROP_RECT_MARGIN-TreeDraw.PROP_RECT_LABEL) );
}
TreeDraw.PROP_RECT_MARGIN = 0.03;
TreeDraw.PROP_RECT_LABEL = 0.2;
TreeDraw.PROP_RECT_REDUCTION_MARGIN = 0.01;
TreeDraw.PROP_RECT_EXPANTION_MARGIN = 0.05;

//RectangleOperators.quadrification=function(rectangle, weightList, isNormalizedWeights, isSortedWeights)
//RectangleOperators.packingRectangles=function(weights, packingMode, rectangle, param)
