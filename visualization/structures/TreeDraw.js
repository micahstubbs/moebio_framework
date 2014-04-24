/**
* TreeDraw
* @constructor
*/
function TreeDraw(){};


//TODO: deploy returnHovered
TreeDraw.drawRectanglesTree = function(tree, frame, levelColors, margin, returnHovered){
	var dX = frame.width/tree.nLevels;
	this._drawRectanglesTreeChildren(tree.nodeList[0], new Rectangle(frame.x,frame.y,dX,frame.height), levelColors, margin);
}
TreeDraw._drawRectanglesTreeChildren = function(node, frame, colors, margin){
	context.fillStyle = colors[node.level];
	context.fillRect(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	var children = node.toNodeList;
	if(children.length>0){
		var i;
		var dY = frame.height/(node.descentWeight-1);
		var yy = frame.y;
		var h;
		for(i=0;children[i]!=null;i++){
			h = dY*(children[i].descentWeight);
			this._drawRectanglesTreeChildren(children[i], new Rectangle(frame.x+frame.width,yy,frame.width, h), colors, margin);
			yy+=h;
		}
	}
}


