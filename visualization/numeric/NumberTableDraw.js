/**
* NumberTable_or_PolygonDraw
* @constructor
*/
function NumberTableDraw(){};

/**
 * draws a matrix, with cells colors associated to values from a ColorScale
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable
 * 
 * @param  {ColorScale} colorScale
 * @param  {Boolean} listColorsIndependent if true each numberList will be colored to fit the colorScale range
 * @param  {Number} margin
 * @return {Point}
 * tags:draw
 */
NumberTableDraw.drawNumberTable = function(frame, numberTable, colorScale, listColorsIndependent, margin){
	if(frame==null || numberTable==null || numberTable.type!="NumberTable" || numberTable.length<2) return; //todo:provisional, this is System's work
	
	colorScale = colorScale==null?ColorScales.blueToRed:colorScale;
	listColorsIndependent = listColorsIndependent||false;
	margin = margin==null?2:margin;

	var dX = frame.width/numberTable.length;
	var dY = frame.height/numberTable[0].length;
	
	var i;
	var j;
	var numberList;
	var x;
	
	var overCoordinates;
	
	var minMaxInterval;
	var amp;
	if(!listColorsIndependent){
		minMaxInterval = numberTable.getMinMaxInterval();
		amp = minMaxInterval.getAmplitude();
	}
	
	var mouseXOnColumn;
	
	for(i=0;numberTable[i]!=null;i++){
		numberList = numberTable[i];
		x = frame.x+i*dX;
		mouseXOnColumn = mX>x && mX<=x+dX;
		if(listColorsIndependent){
			minMaxInterval = numberList.getMinMaxInterval();
			amp = minMaxInterval.getAmplitude();
		}
		for(j=0;numberList[j]!=null;j++){
			context.fillStyle = colorScale((numberList[j]-minMaxInterval.x)/amp);
			context.fillRect(x, frame.y+j*dY,dX-margin,dY-margin);
			if(mouseXOnColumn && mY>frame.y+j*dY && mY<=frame.y+(j+1)*dY) overCoordinates=new Point(i,j);
		}
	}
	
	return overCoordinates;
}

/**
 * draws a ScatterPlot, if the provided NumberTable contains a third NumberList it also draws circles
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable with two lists
 * 
 * @param  {StringList} texts
 * @param  {ColorList} colors
 * @param  {Number} maxRadius
 * @param  {Boolean} loglog logarithmical scale for both axis
 * @param  {Number} margin in pixels
 * @return {Number} index of rollovered element
 * tags:draw
 */
NumberTableDraw.drawSimpleScatterPlot = function(frame, numberTable, texts, colors, maxRadius, loglog, margin){
	if(frame==null || numberTable==null || numberTable.type!="NumberTable") return; //todo:provisional, this is System's work

	if(numberTable.length<2) return;

	maxRadius = maxRadius||20;
	loglog = loglog||false;
	margin = margin||0;

	var subframe = new Rectangle(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	subframe.bottom = subframe.getBottom();

	var i;
	var x,y;
	var list0 = (loglog?numberTable[0].log(1):numberTable[0]).getNormalized();
	var list1 = (loglog?numberTable[1].log(1):numberTable[1]).getNormalized();
	var radii = numberTable.length<=2?null:numberTable[2].getNormalized().sqrt().factor(maxRadius);
	var nColors = (colors==null)?null:colors.length;
	var n = Math.min(list0.length, list1.length, (radii==null)?2000:radii.length, (texts==null)?2000:texts.length);
	var iOver;



	for(i=0; i<n; i++){
		x = subframe.x + list0[i]*subframe.width;
		y = subframe.bottom - list1[i]*subframe.height;

		if(radii==null){
			if(NumberTableDraw._drawCrossScatterPlot(x, y)) iOver = i;
		} else {
			setFill(colors==null?'rgb(150,150,150)':colors[i%nColors]);
			if(fCircleM(x, y, radii[i], radii[i]+1)) iOver = i;
		}
		if(texts!=null){
			setText('black', 10);
			fText(texts[i], x, y);
		}
	}

	if(margin>7 && list0.name!="" && list1.name!=""){
		setText('black', 10, null, 'right', 'middle');
		fText(list0.name, subframe.getRight()-2, subframe.bottom+margin*0.5);
		fTextRotated(list1.name, subframe.x - margin*0.5, subframe.y + 1, -HalfPi);
	}

	if(iOver!=null){
		setCursor('pointer');
		return iOver;
	} 

}
NumberTableDraw._drawCrossScatterPlot = function(x, y){
	setStroke('black', 1);
	line(x,y-5,x,y+5);
	line(x-5,y,x+5,y);
	return Math.pow(mX-x, 2)+Math.pow(mY-y, 2)<25;
}

/**
 * draws a slopegraph
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable with at least two numberLists
 * @param  {StringList} texts
 * @return {Object}
 * tags:draw
 */
NumberTableDraw.drawSlopeGraph = function(frame, numberTable, texts){
	if(frame==null || numberTable==null || numberTable.type!="NumberTable") return; //todo:provisional, this is System's work

	if(numberTable.length<2) return;

	var margin = 16;
	var subframe = new Rectangle(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	subframe.bottom = subframe.getBottom();

	var i;
	var y0, y1;
	var list0 = numberTable[0].getNormalized();
	var list1 = numberTable[1].getNormalized();
	var n = Math.min(list0.length, list1.length, texts==null?2000:texts.length);

	var x0 = subframe.x + (texts==null?10:0.25*subframe.width);
	var x1 = subframe.getRight() - (texts==null?10:0.25*subframe.width);

	setStroke('black', 1);

	for(i=0; i<n; i++){
		y0 = subframe.bottom - list0[i]*subframe.height;
		y1 = subframe.bottom - list1[i]*subframe.height;

		line(x0, y0, x1, y1);

		if(texts!=null && (subframe.bottom-y0)>=9){
			setText('black', 9, null, 'right', 'middle');
			fText(texts[i], x0-2, y0);
		}
		if(texts!=null && (subframe.bottom-y1)>=9){
			setText('black', 9, null, 'left', 'middle');
			fText(texts[i], x1+2, y1);
		}
	}
}


/**
 * based on a integers NumberTable draws a a matrix of rectangles with colors associated to number of elelments in overCoordinates
 * @param  {Rectangle} frame
 * @param  {Object} coordinates, it could be a polygon, or a numberTable with two lists
 * 
 * @param  {ColorScale} colorScale
 * @param  {Number} margin
 * @return {NumberList} list of positions of elements on clicked coordinates
 * tags:draw
 */
NumberTableDraw.drawDensityMatrix = function(frame, coordinates, colorScale, margin){
	if(coordinates==null || coordinates[0]==null) return;
	
	colorScale = colorScale==null?
								ColorScales.whiteToRed
								:
								typeof colorScale == 'string'?
									ColorScales[colorScale]
									:
									colorScale;
	margin = margin||0;

	var i, j;
	var x, y;
	var minx, miny;
	var matrixColors;


	//setup
	if(frame.memory==null || coordinates!=frame.memory.coordinates || colorScale!=frame.memory.colorScale){

		c.log('coordinates[0]',coordinates[0]);

		var isNumberTable = coordinates[0].x==null;

		if(isNumberTable){
			var numberTable = coordinates;
			if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return;
		} else {
			var polygon = coordinates;
		}
		
		var max=0;
		var nCols = 0;
		var nLists = 0;
		var matrix = new NumberTable();
		var n = isNumberTable?numberTable[0].length:polygon.length;

		matrixColors = new Table();

		if(isNumberTable){
			minx = numberTable[0].getMin();
			miny = numberTable[1].getMin();
		} else {
			minx = polygon[0].x;
			miny = polygon[0].y;
			for(i=1; i<n; i++){
				minx = Math.min(polygon[i].x, minx);
				miny = Math.min(polygon[i].y, miny);
			}
		}


		for(i=0; i<n; i++){
			if(isNumberTable){
				x = numberTable[0][i]-minx;
				y = numberTable[1][i]-miny;
			} else {
				x = polygon[i].x-minx;
				y = polygon[i].y-miny;
			}

			if(matrix[x]==null) matrix[x] = new NumberList();
			if(matrix[x][y]==null) matrix[x][y]=0;
			matrix[x][y]++;
			max = Math.max(max, matrix[x][y]);
			nCols = Math.max(nCols, x+1);
			nLists = Math.max(nLists, y+1);
		}

		for(i=0; i<nCols; i++){
			if(matrix[i]==null) matrix[i] = new NumberList();
			matrixColors[i] = new ColorList();
			for(j=0; j<nLists; j++){
				if(matrix[i][j]==null) matrix[i][j] = 0;
				matrixColors[i][j] = colorScale(matrix[i][j]/max);
			}
		}
		frame.memory = {
			matrixColors:matrixColors,
			coordinates:coordinates,
			colorScale:colorScale,
			selected:null
		}
	} else {
		matrixColors = frame.memory.matrixColors;
	}

	//draw
	var subframe = new Rectangle(frame.x+margin, frame.y+margin, frame.width-margin*2, frame.height-margin*2);
	subframe.bottom = subframe.getBottom();
	var dx = subframe.width/matrixColors.length;
	var dy = subframe.height/matrixColors[0].length;
	var prevSelected = frame.memory.selected;

	if(MOUSE_UP_FAST) frame.memory.selected = null;

	for(i=0; matrixColors[i]!=null; i++){
		for(j=0; matrixColors[0][j]!=null; j++){
			setFill(matrixColors[i][j]);
			if(fRectM(subframe.x + i*dx, subframe.bottom - (j+1)*dy, dx+0.5, dy+0.5) && MOUSE_UP_FAST){
				frame.memory.selected = [i, j];
			}
		}
	}


	//selection
	if(frame.memory.selected){
		setStroke('white', 5);
		sRect(subframe.x + frame.memory.selected[0]*dx-1, subframe.bottom - (frame.memory.selected[1]+1)*dy-1, dx+1, dy+1);
		setStroke('black', 1);
		sRect(subframe.x + frame.memory.selected[0]*dx-1, subframe.bottom - (frame.memory.selected[1]+1)*dy-1 , dx+1, dy+1);
	}
	
	if(prevSelected!=frame.memory.selected){
		if(frame.memory.selected==null){
			frame.memory.indexes = null;
		} else {
			minx = numberTable[0].getMin();
			miny = numberTable[1].getMin();

			x = frame.memory.selected[0]+minx;
			y = frame.memory.selected[1]+miny;

			frame.memory.indexes = new NumberList();
			
			for(i=0; numberTable[0][i]!=null; i++){
				if(numberTable[0][i]==x && numberTable[1][i]==y) frame.memory.indexes.push(i);
			}
		}

	}

	if(frame.memory.selected) return frame.memory.indexes;
}


/**
 * draws a Steamgraph
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable
 *
 * @param {Boolean} normalized normalize each column, making the graph of constant height
 * @param {Boolean} sorted sort flow polygons
 * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons 
 * @param {Boolean} bezier draws bezier (soft) curves
 * @param  {ColorList} colorList colors of polygons
 * @param  {Number} margin
 * @return {NumberList} list of positions of elements on clicked coordinates
 * tags:draw
 */
NumberTableDraw.drawStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, bezier, colorList){
	if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return; //todo:provisional, this is System's work

	//var self = NumberTableDraw.drawStreamgraph;

	intervalsFactor = intervalsFactor==null?1:intervalsFactor;

	//setup
	if(frame.memory==null || numberTable!=frame.memory.numberTable || normalized!=frame.memory.normalized || sorted!=frame.memory.sorted || intervalsFactor!=frame.memory.intervalsFactor || intervalsFactor!=frame.memory.intervalsFactor){
		frame.memory = {
			numberTable:numberTable,
			normalized:normalized,
			sorted:sorted,
			intervalsFactor:intervalsFactor,
			flowIntervals:IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(numberTable, normalized, sorted), intervalsFactor)
		}

		frame.secret = "hola!";
	}
	if(frame.memory.colorList!=colorList || frame.memory.colorList==null){
		frame.memory.actualColorList = colorList==null?ColorListGenerators.createCategoricalColors(1, numberTable.length):colorList;
		frame.memory.colorList = colorList;
	}

	IntervalTableDraw.drawIntervalsFlowTable(frame.memory.flowIntervals, frame, frame.memory.actualColorList, bezier, 0.3);
}
