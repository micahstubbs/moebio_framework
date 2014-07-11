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
	var n = Math.min(list0.length, list1.length, (radii==null)?300000:radii.length, (texts==null)?300000:texts.length);
	var iOver;

	for(i=0; i<n; i++){
		x = subframe.x + list0[i]*subframe.width;
		y = subframe.bottom - list1[i]*subframe.height;
		
		if(radii==null){
			if(NumberTableDraw._drawCrossScatterPlot(x, y, colors==null?'rgb(150,150,150)':colors[i%nColors])) iOver = i;
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
NumberTableDraw._drawCrossScatterPlot = function(x, y, color){
	setStroke(color, 1);
	line(x,y-2,x,y+2);
	line(x-2,y,x+2,y);
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
				x = Math.floor(numberTable[0][i]-minx);
				y = Math.floor(numberTable[1][i]-miny);
			} else {
				x = Math.floor(polygon[i].x-minx);
				y = Math.floor(polygon[i].y-miny);
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

	//c.log(matrixColors.length, matrixColors[0].length, matrixColors[0][0]);

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


// *
//  * draws a Steamgraph
//  * @param  {Rectangle} frame
//  * @param  {NumberTable} numberTable
//  *
//  * @param {Boolean} normalized normalize each column, making the graph of constant height
//  * @param {Boolean} sorted sort flow polygons
//  * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons 
//  * @param {Boolean} bezier draws bezier (soft) curves
//  * @param  {ColorList} colorList colors of polygons
//  * @param  {Number} margin
//  * @return {NumberList} list of positions of elements on clicked coordinates
 
// NumberTableDraw.drawStreamgraphW = function(frame, numberTable, normalized, sorted, intervalsFactor, bez, colorList){
// 	if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return;

// 	//setup
// 	if(frame.memory==null || numberTable!=frame.memory.numberTable || normalized!=frame.memory.normalized || sorted!=frame.memory.sorted || intervalsFactor!=frame.memory.intervalsFactor || bez!=frame.memory.bez){
// 		c.log('Oo');
// 		frame.memory = {
// 			numberTable:numberTable,
// 			normalized:normalized,
// 			sorted:sorted,
// 			intervalsFactor:intervalsFactor,
// 			bez:bez,
// 			flowIntervals:IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(numberTable, normalized, sorted), intervalsFactor)
// 		}
// 	}
// 	if(frame.memory.colorList!=colorList || frame.memory.colorList==null){
// 		frame.memory.actualColorList = colorList==null?ColorListGenerators.createCategoricalColors(1, numberTable.length):colorList;
// 		frame.memory.colorList = colorList;
// 	}

// 	c.log('-numberTable, frame.memory.flowIntervals, frame.memory.actualColorList', numberTable, frame.memory.flowIntervals, frame.memory.actualColorList);

// 	IntervalTableDraw.drawIntervalsFlowTable(frame.memory.flowIntervals, frame, frame.memory.actualColorList, bez, 0.3);


// 	// if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return;

// 	// var change = frame.memory==null || frame.memory.numberTable==null;//!=numberTable || frame.memory.normalized!=normalized || frame.memory.sorted!=sorted || frame.memory.intervalsFactor!=intervalsFactor || frame.memory.bezier!=bezier || frame.memory.colorList!=colorList || frame.memory.width!=frame.width || frame.memory.height!=frame.height;

// 	// c.log('\n\nframe.memory==null, change', frame.memory==null, change);

// 	// if(frame.memory=!null) c.log('1. frame.memory.o', frame.memory.o);//, frame.memory.normalized!=normalized, frame.memory.sorted!=sorted, frame.memory.intervalsFactor!=intervalsFactor, frame.memory.bezier!=bezier, frame.memory.colorList!=colorList, frame.memory.width!=frame.width, frame.memory.height!=frame.height)
	
// 	// if(change){
// 	// 	c.log('->');
// 	// 	frame.bottom = frame.getBottom();
// 	// 	frame.memory = {};
// 	// 	frame.memory.numberTable = numberTable;
// 	// 	frame.memory.o = 0;
// 	// 	// frame.memory = {
// 	// 	// 	numberTable:numberTable,
// 	// 	// 	normalized:normalized,
// 	// 	// 	sorted:sorted,
// 	// 	// 	intervalsFactor:intervalsFactor,
// 	// 	// 	bezier:bezier,
// 	// 	// 	colorList:colorList,
// 	// 	// 	width:frame.width,
// 	// 	// 	height:frame.height,
// 	// 	// 	//capture:ImageDraw.captureVisualizationImage('NumberTableDraw.drawStreamgraphSimple', frame.width, frame.height, numberTable, normalized, sorted, intervalsFactor, bezier, colorList)
// 	// 	// }
// 	// 	c.log('2. frame.memory.o', frame.memory.o);
// 	// }

// 	// return null;

// 	// //c.log('frame.memory.capture', frame.memory.capture);
// 	// //if(frame.memory.capture) drawImage(frame.memory.capture, frame.x, frame.y, frame.width, frame.height);
// }


/**
 * draws a steamgraph
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
NumberTableDraw.drawStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, bezier, colorList, horizontalLabels, showValues, logFactor){
	if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return;

	bezier = bezier==null?true:bezier;

	//var self = NumberTableDraw.drawStreamgraph;

	intervalsFactor = intervalsFactor==null?1:intervalsFactor;

	//setup
	if(frame.memory==null || numberTable!=frame.memory.numberTable || normalized!=frame.memory.normalized || sorted!=frame.memory.sorted || intervalsFactor!=frame.memory.intervalsFactor || bezier!=frame.memory.bezier || frame.width!=frame.memory.width || frame.height!=frame.memory.height || logFactor!=frame.memory.logFactor){
		var nT2 = logFactor?numberTable.applyFunction(function(val){return Math.log(logFactor*val+1)}):numberTable;

		frame.memory = {
			numberTable:numberTable,
			normalized:normalized,
			sorted:sorted,
			intervalsFactor:intervalsFactor,
			bezier:bezier,
			flowIntervals:IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(nT2, normalized, sorted), intervalsFactor),
			fOpen:1,
			names:numberTable.getNames(),
			mXF:mX,
			width:frame.width,
			height:frame.height,
			logFactor:logFactor,
			image:null
		}
	}
	if(frame.memory.colorList!=colorList || frame.memory.colorList==null){
		frame.memory.actualColorList = colorList==null?ColorListGenerators.createCategoricalColors(1, numberTable.length):colorList;
		frame.memory.colorList = colorList;
	}

	var flowFrame = new Rectangle(0, 0, frame.width, horizontalLabels==null?frame.height:(frame.height-14));

	if(frame.memory.image==null){
		var newCanvas = document.createElement("canvas");
		newCanvas.width = frame.width;
		newCanvas.height = frame.height;
		var newContext = newCanvas.getContext("2d");
		newContext.clearRect(0,0,frame.width,frame.height);

		var mainContext = context;
		context = newContext;

		IntervalTableDraw.drawIntervalsFlowTable(frame.memory.flowIntervals, flowFrame, frame.memory.actualColorList, bezier, 0.3);

		context = mainContext;
		
		frame.memory.image = new Image();
		frame.memory.image.src = newCanvas.toDataURL();
	}

	if(frame.memory.image){
		
		frame.memory.fOpen = 0.8*frame.memory.fOpen + 0.2*(frame.containsPoint(mP)?0.8:1);
		frame.memory.mXF = 0.7*frame.memory.mXF + 0.3*mX;
		frame.memory.mXF = Math.min(Math.max(frame.memory.mXF, frame.x), frame.getRight());
		
		if(frame.memory.fOpen<0.999){
			context.save();
			context.translate(frame.x, frame.y);
			var cut = frame.memory.mXF-frame.x;
			var x0 = Math.floor(cut*frame.memory.fOpen);
			var x1 = Math.ceil(frame.width-(frame.width-cut)*frame.memory.fOpen);
			
			drawImage(frame.memory.image, 0,0,cut,flowFrame.height,0,0,x0,flowFrame.height);
			drawImage(frame.memory.image, cut,0,(frame.width-cut),flowFrame.height,x1,0,(frame.width-cut)*frame.memory.fOpen,flowFrame.height);

			NumberTableDraw._drawPartialFlow(flowFrame, frame.memory.flowIntervals, frame.memory.names, frame.memory.actualColorList, cut, x0, x1, 0.3, sorted, numberTable);

			if(horizontalLabels){
				var dx = frame.width/numberTable[0].length;
				var x;
				var y = frame.height-5;
				var iPosDec = (numberTable[0].length*mX/flowFrame.width) - 1;
				var iPos = Math.round(iPosDec);
				
				horizontalLabels.forEach(function(label, i){
					setText('black', i==iPos?14:10, null, 'center', 'middle');

					if(iPos==i){
						x = (x0 + x1)*0.5 - (x1-x0)*(iPosDec-iPos);
					} else {
						x = frame.x + i*dx;
						if(x<mX){
							x = x*frame.memory.fOpen;
						} else if(x>mX){
							x = x*frame.memory.fOpen + (x1-x0);
						}
					}
					fText(horizontalLabels[i], x, y);
				});
			}

			context.restore();
		} else {
			drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
		}
	}
}
NumberTableDraw._drawPartialFlow=function(frame, flowIntervals, labels, colors, x, x0, x1, OFF_X, sorted, numberTable){	
	var w = x1-x0;
	var wForText = numberTable==null?(x1-x0):(x1-x0)*0.85;

	var nDays = flowIntervals[0].length;

	var wDay = frame.width/(nDays-1);
	
	var iDay =  (x-frame.x)/wDay;// Math.min(Math.max((nDays-1)*(x-frame.x)/frame.width, 0), nDays-1);
	
	var iDay = Math.max(Math.min(iDay, nDays-1), 0);

	var i;
	var i0 = Math.floor(iDay);
	var i1 = Math.ceil(iDay);
	
	var t = iDay - i0;
	var s = 1-t;
	
	var xi;
	var yi;
	
	var interval0;
	var interval1;

	var y, h;
	
	var wt;
	var pt;
	
	var text;
	
	var offX = OFF_X*wDay;//*(frame.width-(x1-x0))/nDays; //not taken into account
	
	//var previOver = iOver;
	var iOver = -1;

	var X0, X1, xx;

	var ts0, ts1;

	for(i=0; flowIntervals[i]!=null; i++){
		
		setFill(colors[i]);
		interval0 = flowIntervals[i][i0];
		interval1 = flowIntervals[i][i1];

		X0 = Math.floor(iDay)*wDay;
		X1 = Math.floor(iDay+1)*wDay;

		xx = x;

		y = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.x, interval1.x, X0+offX, X1-offX, xx);
		h = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.y, interval1.y, X0+offX, X1-offX, xx)-y;

		y = y*frame.height + frame.y;
		h *= frame.height;
		
		if(h<1) continue;
		
		if(fRectM(x0,y, w, h)) iOver = i;
		
		if(h>=8 && w>40){
			setText('white', h, null, null, 'middle');
			
			text = labels[i];
			
			wt = getTextW(text);
			pt = wt/wForText;

			if(pt>1){
				setText('white', h/pt, null, null, 'middle');
			}
			
			context.fillText(text, x0, y + h*0.5);

			if(numberTable){
				wt = getTextW(text);

				ts0 = Math.min(h, h/pt);
				ts1 = Math.max(ts0*0.6, 8);

				setText('white', ts1, null, null, 'middle');
				fText(numberTable[i][i0], x0 + wt + w*0.03, y + (h+(ts0-ts1)*0.5)*0.5);
			}
			


		}
	}

	return iOver;
}



/**
 * draws a circular steamgraph Without labels
 * @param {Rectangle} frame
 * @param {NumberTable} numberTable
 *
 * @param {Boolean} normalized normalize each column, making the graph of constant height
 * @param {Boolean} sorted sort flow polygons
 * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons
 * @param {ColorList} colorList colors of polygons
 * @return {NumberList} list of positions of elements on clicked coordinates
 * tags:draw
 */
NumberTableDraw.drawCircularStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, colorList){
	if(numberTable==null || numberTable.length<2 || numberTable.type!="NumberTable") return;

	intervalsFactor = intervalsFactor==null?1:intervalsFactor;

	//setup
	if(frame.memory==null || numberTable!=frame.memory.numberTable || normalized!=frame.memory.normalized || sorted!=frame.memory.sorted || intervalsFactor!=frame.memory.intervalsFactor || frame.width!=frame.memory.width || frame.height!=frame.memory.height){
		frame.memory = {
			numberTable:numberTable,
			normalized:normalized,
			sorted:sorted,
			intervalsFactor:intervalsFactor,
			flowIntervals:IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(numberTable, normalized, sorted), intervalsFactor),
			fOpen:1,
			names:numberTable.getNames(),
			mXF:mX,
			width:frame.width,
			height:frame.height,
			radius:Math.min(frame.width, frame.height)*0.46,
			r0:Math.min(frame.width, frame.height)*0.05,
			angles:new NumberList(),
			zoom:1,
			angle0:0
		}

		var dA = TwoPi/numberTable[0].length;
		numberTable[0].forEach(function(val, i){
			frame.memory.angles[i] = i*dA;
		});
	}
	if(frame.memory.colorList!=colorList || frame.memory.colorList==null){
		frame.memory.actualColorList = colorList==null?ColorListGenerators.createCategoricalColors(1, numberTable.length):colorList;
		frame.memory.colorList = colorList;
	}

	if(MOUSE_DOWN && frame.containsPoint(mP)){
		frame.memory.downX = mX;
		frame.memory.downY = mY;
		frame.memory.pressed = true;
		frame.memory.zoomPressed = frame.memory.zoom;
		frame.memory.anglePressed = frame.memory.angle0;
	}
	if(MOUSE_UP) frame.memory.pressed = false;
	if(frame.memory.pressed){
		var center = frame.getCenter();
		var dx0 = frame.memory.downX-center.x;
		var dy0 = frame.memory.downY-center.y;
		var d0 = Math.sqrt(Math.pow(dx0, 2) + Math.pow(dy0, 2));
		var dx1 = mX-center.x;
		var dy1 = mY-center.y;
		var d1 = Math.sqrt(Math.pow(dx1, 2) + Math.pow(dy1, 2));
		frame.memory.zoom = frame.memory.zoomPressed*((d1+5)/(d0+5));
		var a0 = Math.atan2(dy0, dx0);
		var a1 = Math.atan2(dy1, dx1);
		frame.memory.angle0 = frame.memory.anglePressed + a1 - a0;
	}

	context.save();
	clipRectangle(frame.x, frame.y, frame.width, frame.height);

	IntervalTableDraw.drawCircularIntervalsFlowTable(frame.memory.flowIntervals, frame.getCenter(), frame.memory.radius*frame.memory.zoom, frame.memory.r0, frame.memory.actualColorList, frame.memory.names, true, frame.memory.angles, frame.memory.angle0);

	context.restore();
}




