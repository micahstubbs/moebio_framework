function IntervalTableDraw(){};

IntervalTableDraw.MIN_CHARACTERS_SIZE = 1;

IntervalTableDraw.drawIntervalsFlowTable = function(intervalsFlowTable, frame, colors, bezier, offValue){//, returnHovered){ //TODO: implement rollover detection, using _isOnShape (below)
	frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
	colors = colors==null?ColorListGenerators.createCategoricalColors(0, intervalsFlowTable.length, ColorScales.temperature):colors;
	bezier = bezier||false;
	offValue = offValue==null?0.45:offValue;
	
	var nElements = intervalsFlowTable.length;
	var i;
	var j;
	
	var nCols = intervalsFlowTable[0].length;
	var dX = frame.width/(nCols-1);
	var dY = frame.height;
	
	var point;
	
	var intervalList;
	var lastIntervalList = intervalsFlowTable[nElements-1];
	var sY = 0;
	var mY = 0;
	var x = frame.x;
	var y = frame.y;
	
	var prevPoint;
	var prevYsup;
	var prevsY;
	var newYsup;
	
	var offX;
	
	//var nHovered = -1;
	
	for(i=0; intervalsFlowTable[i]!=null; i++){
		intervalList = intervalsFlowTable[i];
		
		context.fillStyle = colors[i];
		context.beginPath();
		
		sY = y;
		
		point = new Point(x, intervalList[0].y*dY+sY);
		context.moveTo(point.x, point.y);
		
		prevPoint = point;
		
		for(j=1;j<nCols;j++){
			sY = y;
			
			point = new Point(j*dX+x, intervalList[j].y*dY+sY);
			
			if(bezier){
				offX = (point.x-prevPoint.x)*offValue;
				context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
			} else {
				context.lineTo(point.x, point.y);
			}
			
			prevPoint = point;
		}
		
		point = new Point((nCols-1)*dX+x, intervalList[nCols-1].x*dY+sY);
		context.lineTo(point.x, point.y);
		prevPoint = point;

		for(j=nCols-2;j>=0;j--){
			sY = y;
			
			point = new Point(j*dX+x, intervalList[j].x*dY+sY);
			
			if(bezier){
				offX = (point.x-prevPoint.x)*offValue;
				context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
				
				// if(returnHovered && nHovered==-1 && IntervalTableDraw._isOnShape(prevPoint, point, intervalList[j-1].y*dY+sY, intervalList[j].y*dY+sY, offX, mX, mY)){
					// nHovered = i;
				// }
				
			} else {
				context.lineTo(point.x, point.y);
			}
			
			prevPoint = point;
		}
		
		point = new Point(x, intervalList[0].x*dY+sY);
		context.lineTo(point.x, point.y);
		
		context.fill();
		
	}
	
	//return nHovered;
}
IntervalTableDraw._isOnShape=function(prevPoint, point, prevYsup, newYsup, offX, testX, textY){
	var t = (testX-prevPoint.x)/(point.x-prevPoint.x);
	var u = 1-t;
					
	//Y INF
	this.p0.x = prevPoint.x+ t*offX;
	this.p0.y = prevPoint.y;
	this.p1.x = u*(prevPoint.x+offX) + t*(point.x-offX);
	this.p1.y = u*prevPoint.y + t*point.y;
	this.p2.x = point.x-u*offX;
	this.p2.y = point.y;
	
	this.P0.x = u*this.p0.x + t*this.p1.x;
	this.P0.y = u*this.p0.y + t*this.p1.y;
	
	this.P1.x = u*this.p1.x + t*this.p2.x;
	this.P1.y = u*this.p1.y + t*this.p2.y;
	
	var mYInf = u*this.P0.y + t*this.P1.y;
	
	//Y SUP
	this.p0.y = prevYsup;
	this.p1.y = u*prevYsup + t*newYsup;
	this.p2.y = newYsup;
	
	this.P0.y = u*this.p0.y + t*this.p1.y;
	this.P1.y = u*this.p1.y + t*this.p2.y;
	
	var mYSup = u*this.P0.y + t*this.P1.y;
	
	return textY > mYSup && textY < mYInf
}



IntervalTableDraw.drawCircularIntervalsFlowTable = function(intervalsFlowTable, center, radius, r0, colors, texts, returnHovered, angles, angle0){
	var nElements = intervalsFlowTable.length;
	var i;
	var j;
	
	colors = colors==null?ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements):colors;
	center = center==null?new Point(100,100):center;
	radius = radius==null?200:radius;
	r0 = r0==null?10:r0;
	angle0 = angle0==null?0:angle0;
	
	var nCols = intervalsFlowTable[0].length;
	var dA = TwoPi/nCols;
	var dR = (radius-r0);
	
	var point;
	
	var intervalList;
	var lastIntervalList = intervalsFlowTable[nElements-1];
	var interval;
	
	var r = r0;
	
	var prevPoint;
	var prevRsup;
	var prevsR;
	var newRsup;
	
	var breaks = false;
	
	var nR;
	var nR2;
	
	var offA = dA*0.3;
	var cosOffA = Math.cos(offA);
	
	var s;
	var amp;
	var rT;
	
	var xT;
	var yT;
	
	var nHovered = -1;
	
	var filteredTexts = new Array();
	var textsX = new Array();
	var textsY = new Array();
	var textsSizes = new Array();
	var textsAngles = new Array();
	
	for(i=0; i<nElements; i++){
		
		intervalList = intervalsFlowTable[i];
		
		context.fillStyle = colors[i%nElements];
		
		context.beginPath();
		
		point = new Point(angles==null?0:angles[0] + angle0, (1-intervalList[0].y)*dR+r0);
		context.moveTo(point.y*Math.cos(point.x)+center.x, point.y*Math.sin(point.x)+center.y);
		
		prevPoint = point;
		
		for(j=1;j<=nCols;j++){

			interval = intervalList[j%nCols];
			point = new Point(angles==null?j*dA:angles[j%nCols] + angle0, (1-interval.y)*dR+r0);
			
			nR = prevPoint.y/cosOffA;
			nR2 = point.y/cosOffA;
			
			context.bezierCurveTo(nR*Math.cos(prevPoint.x+offA)+center.x, nR*Math.sin(prevPoint.x+offA)+center.y,
								  nR2*Math.cos(point.x-offA)+center.x, nR2*Math.sin(point.x-offA)+center.y,
								  point.y*Math.cos(point.x)+center.x, point.y*Math.sin(point.x)+center.y);
			
			if(returnHovered && nHovered==-1 && this._isOnRadialShape(center, mP, prevPoint.x, point.x, dR*(1-intervalList[(j-1)%nCols].y)+r0, dR*(1-intervalList[(j-1)%nCols].x)+r0, dR*(1-intervalList[j%nCols].y)+r0, dR*(1-intervalList[j%nCols].x)+r0)){
				nHovered = i;
			}
			
			prevPoint = point;
			
			if(texts!=null){
				s = interval.getAmplitude();
				if(s*radius>20){
					rT = point.y + s*0.5*dR;
					
					textsSizes.push(Math.min(Math.sqrt(s*radius)*2.6, 24));
					textsAngles.push(point.x+Math.PI*0.5);
					
					textsX.push(rT*Math.cos(point.x)+center.x);
					textsY.push(rT*Math.sin(point.x)+center.y);
					
					filteredTexts.push(texts[i]);
				}
			}
			
		}
		
		point = new Point(angles==null?0:angles[0] + angle0, (1-intervalList[0].x)*dR+r0);
		context.lineTo(point.y*Math.cos(point.x)+center.x, point.y*Math.sin(point.x)+center.y);
		prevPoint = point;
		
		for(j=nCols-1;j>=0;j--){
			point = new Point(angles==null?j*dA:angles[j] + angle0, (1-intervalList[j].x)*dR+r0);
			
			nR = prevPoint.y/cosOffA;
			nR2 = point.y/cosOffA;
			
			context.bezierCurveTo(nR*Math.cos(prevPoint.x-offA)+center.x, nR*Math.sin(prevPoint.x-offA)+center.y,
								  nR2*Math.cos(point.x+offA)+center.x, nR2*Math.sin(point.x+offA)+center.y,
								  point.y*Math.cos(point.x)+center.x, point.y*Math.sin(point.x)+center.y);
			
			prevPoint = point;
		}
		
		point = new Point(angles==null?0:angles[0] + angle0, (1-intervalList[0].x)*dR+r0);
		context.lineTo(point.y*Math.cos(point.x)+center.x, point.y*Math.sin(point.x)+center.y);
		
		context.fill();
		
	}
	
	for(i=0;filteredTexts[i]!=null;i++){		
		setText('black', textsSizes[i], null, 'center', 'middle');
		fTextRotated(filteredTexts[i], textsX[i], textsY[i], textsAngles[i]);
	}
	
	return nHovered;
}

IntervalTableDraw._isOnRadialShape=function(center, testPoint, a0, a1, r0a, r0b, r1a, r1b){
	if(a1<a0) a1+=TwoPi;
	
	var ang = center.angleToPoint(testPoint);
	
	if(ang<0) ang+=TwoPi;
	if(ang>TwoPi) ang-=TwoPi;
	
	if(ang+TwoPi<a1) ang+=TwoPi;
	if(ang-TwoPi>a0) ang-=TwoPi;
	
	if(ang<a0 || ang>a1) return false;
	var dA = a1-a0;
	var t = (ang - a0)/dA;
	
	var pa = GeometryOperators.bezierCurvePoints(a0, r0a, a0+dA*0.5, r0a, a1-dA*0.5, r1a, a1, r1a, t);
	var pb = GeometryOperators.bezierCurvePoints(a0, r0b, a0+dA*0.25, r0b, a1-dA*0.25, r1b, a1, r1b, t);
	
	r = testPoint.subtract(center).getNorm();
	
	return r>pa.y && r<pb.y;
}



IntervalTableDraw.drawIntervalsWordsFlowTable = function(frame, intervalsFlowTable, texts, colors, typode){
	var nElements = intervalsFlowTable.length;
	
	var i;
	var j;
	
	colors = colors==null?ColorListGenerators.createCategoricalColors(0, intervalsFlowTable.length, ColorScales.temperature):colors;
	frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
	
	var nCols = intervalsFlowTable[0].length;
	var dX = frame.width/(nCols-1);
	var dY = frame.height;
	
	var point0;
	var point1;
	
	var nextPoint0;
	var nextPoint1;
	
	var point0Prev = new Point();
	var point1Prev = new Point();
	
	var center;
	var size;
	
	var intervalList;
	var lastIntervalList = intervalsFlowTable[nElements-1];
	var sY = 0;
	var x = frame.x;
	var y = frame.y;
	
	var offX;
	
	var text;
	
	if(!typode) context.strokeStyle = "rgba(255,255,255,0.4)";
	
	context.textBaseline = "top";
	context.textAlign = "left";
	
	var position;
	var xx;
	var t;
	var jumpX = dX;
	var valueLastInterval;
	var valueX;
	var valueY;
	var nChar;
	var selectedChar;
	var charWidth;
	var fontSize;
	
	var offX;
	
	var factX = (nCols-1)/frame.width;
	
	var xj0;
	var xj1;
	
	
	for(i=0; intervalsFlowTable[i]!=null; i++){
		intervalList = intervalsFlowTable[i];
		
		text = " "+texts[i];
		
		xx=0;
		nChar=0;
		
		position=0;
		j=0;
		t=0;
		
		sY = (1-lastIntervalList[0].y)*0.5*dY+y;
		point0 = new Point(x, intervalList[0].x*dY+sY);
		point1 = new Point(x, intervalList[0].y*dY+sY);
		
		do {
			nChar++;
			size = (point1.y-point0.y);
			fontSize = Math.floor(0.3*size+1);
			if(!typode) context.font         =  fontSize+'px '+LOADED_FONT;
			selectedChar = text.charAt(nChar%text.length);
			charWidth = typode?fontSize*widthsTypode[selectedChar]:context.measureText(selectedChar).width+2;
			jumpX = charWidth*0.9||1;
			
			xx+=jumpX;
			position = factX*xx;
			j = Math.floor(position);
			t = position - j;
			
			
			if(j+2>nCols) continue;
			
			xj0 = j/factX;
			xj1 = (j+1)/factX;
			
			offX = factX*0.45;
			
			valueLastInterval = IntervalTableDraw._bezierValue(xj0, xj1, lastIntervalList[j].y, lastIntervalList[j+1].y, t, offX);
			
			
			prevsY = sY;
			sY = (1-valueLastInterval)*0.5*dY+y;
			
			
			point0Prev.x = point0.x;
			point0Prev.y = point0.y;
			point1Prev.x = point1.x;
			point1Prev.y = point1.y;
			
			
			valueX = IntervalTableDraw._bezierValue(xj0, xj1, intervalList[j].x, intervalList[j+1].x, t, offX);
			valueY = IntervalTableDraw._bezierValue(xj0, xj1, intervalList[j].y, intervalList[j+1].y, t, offX);
			
			
			point0 = new Point(xx+x, valueX*dY+sY);
			point1 = new Point(xx+x, valueY*dY+sY);
			
			center = new Point(point0Prev.x+jumpX*0.5, (point0.y+point1.y+point0Prev.y+point1Prev.y)*0.25);
			
			typode?context.strokeStyle = colors[i]:context.fillStyle = colors[i];
			
			
			if(size>IntervalTableDraw.MIN_CHARACTERS_SIZE){
				if(typode){
					DrawTextsAdvanced.typodeOnQuadrilater(selectedChar, point0Prev, point0, point1, point1Prev);
				} else {
					context.save();
					context.globalAlpha = size/15;
					DrawTextsAdvanced.textOnQuadrilater(context, selectedChar, point0Prev, point0, point1, point1Prev, fontSize, 1);
					context.restore();
				}
				
			}
		} while(j+1<nCols);
	}
}
IntervalTableDraw._bezierValue = function(x0, x1, y0, y1, t, offX){
	var u = 1-t;
	var p0 = new Point(x0+ t*offX, y0);
	var p1 = new Point(u*(x0+offX) + t*(x1-offX), u*y0 + t*y1);
	var p2 = new Point(x1-u*offX, y1);
	
	var P0 = new Point(u*p0.x + t*p1.x, u*p0.y + t*p1.y);
	var P1 = new Point(u*p1.x + t*p2.x, u*p1.y + t*p2.y);
	
	return u*P0.y + t*P1.y;
}







