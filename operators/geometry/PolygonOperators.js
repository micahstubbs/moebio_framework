/**
* PolygonOperators
* @constructor
*/
function PolygonOperators(){};

PolygonOperators.hull = function(polygon, returnIndexes) {
	returnIndexes = returnIndexes==null?false:returnIndexes;
	var i;
	var t;
	var p = polygon;
	var n = p.length;
	var k = 0;
	var h = new Polygon();
	if(returnIndexes) var indexes = new NumberList();
	
	p = this.sortOnXY(p);
	
	if(returnIndexes){
		for (i = 0; i<n; i++) {
			while (k >= 2 && this.crossProduct3Points(h[k-2], h[k-1], p[i]) <= 0)
				k--;
			h[k++] = p[i];
			indexes[k-1] = i;
		}
		
		for (i = n-2, t = k+1; i>=0; i--) {
			while (k >= t && this.crossProduct3Points(h[k-2], h[k-1], p[i]) <= 0)
				k--;
			h[k++] = p[i];
			indexes[k-1] = i;
		}
		
		return NumberList.fromArray(indexes.getSubList(new Interval(0, k-2)));
	} 
	
	for (i = 0; i<n; i++) {
		while (k >= 2 && this.crossProduct3Points(h[k-2], h[k-1], p[i]) <= 0)
			k--;
		h[k++] = p[i];
	}
	
	for (i = n-2, t = k+1; i>=0; i--) {
		while (k >= t && this.crossProduct3Points(h[k-2], h[k-1], p[i]) <= 0)
			k--;
		h[k++] = p[i];
	}
	
	return Polygon.fromArray(h.getSubList(new Interval(0, k-2)));
}

PolygonOperators.sortOnXY=function(polygon){
	return polygon.sort(function(p0, p1){
	    if(p0.x<p1.x) return -1;
	    if(p0.x==p1.x && p0.y<p1.y) return -1;
	    return 1;  
	});
}

//TODO: move this to PointOperators
PolygonOperators.crossProduct3Points=function(o, a, b) {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

PolygonOperators.expandFromBarycenter = function(polygon, factor){
	var newPolygon = new Polygon();
	var barycenter = polygon.getBarycenter();
	
	for(var i=0; polygon[i]!=null; i++){
		newPolygon[i] = polygon[i].expandFromPoint(barycenter, factor);
	}
	
	return newPolygon;
}

PolygonOperators.expandInAngles = function(polygon, amount){//TODO: test if it works with convex polygons
	var newPolygon = new Polygon();
	var p0 = polygon[polygon.length-1];
	var p1 = polygon[0];
	var p2 = polygon[1];
	
	var a0;
	var a1;
	var sign;
	
	var a = 0.5*Math.atan2(p1.y-p2.y, p1.x-p2.x) + 0.5*Math.atan2(p1.y-p0.y, p1.x-p0.x);
	var globalSign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
	
	
	for(var i=0; polygon[i]!=null; i++){
		p0 = polygon[(i-1+polygon.length)%polygon.length];
		p1 = polygon[i];
		p2 = polygon[(i+1)%polygon.length];
		a0 = Math.atan2(p1.y-p2.y, p1.x-p2.x);
		a1 = Math.atan2(p1.y-p0.y, p1.x-p0.x);
		sign = Math.abs(a1-a0)<Math.PI?-1:1;
		a = 0.5*a0 + 0.5*a1;
		//sign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
		newPolygon[i] = new Point(p1.x + globalSign*sign*amount*Math.cos(a), p1.y + globalSign*sign*amount*Math.sin(a));
	}
	
	return newPolygon;
}

PolygonOperators.simplifyPolygon = function(polygon, margin){
	margin = margin==null || margin==0?1:margin;
	var newPolygon = polygon.clone();
	var p0;
	var p1;
	var p2;
	var line;
	var i;
	var nPoints=polygon.length;
	for(i=0; i<nPoints; i++){
		p0 = newPolygon[i];
		p1 = newPolygon[(i+1)%nPoints];
		p2 = newPolygon[(i+2)%nPoints];
		line = GeometryOperators.lineFromTwoPoints(p0, p2);
		if(GeometryOperators.distancePointToLine(p1, line)<margin){
			//newPolygon.splice((i+1)%nPoints, 1);
			newPolygon = newPolygon.getWithoutElementAtIndex((i+1)%nPoints);
			i--;
		}
		nPoints=newPolygon.length;
	}
	return newPolygon;
}


/**
 * used techinique: draws the bézier polygon and checks color
 */
PolygonOperators.bezierPolygonContainsPoint = function(polygon, point, border){
	var frame = polygon.getFrame();
	clearContext();
	context.fillStyle = 'black';
	context.fillRect(0,0,frame.width,frame.height);
	if(border!=null){
		context.strokeStyle = 'black';
		context.lineWidth = border;
	}
	context.fillStyle = 'white';
	context.beginPath();
	Draw.drawBezierPolygon(context, polygon, -frame.x, -frame.y);
	context.fill();
	if(border!=null) context.stroke();
	var data = context.getImageData(point.x-frame.x, point.y-frame.y, 1, 1).data;
	clearContext();
	return data[0]>0;
}


/**
 * used techinique: draws the bézier polygon and checks color
 * best center: the center of biggest circle within the polygon
 * [!] very unefficient
 */
PolygonOperators.getBezierPolygonBestCenter = function(polygon, nAttempts){
	nAttempts = nAttempts==null?500:nAttempts;
	
	var frame = polygon.getFrame();
	context.fillStyle = 'black';
	context.fillRect(0,0,frame.width,frame.height);
	context.fillStyle = 'white';
	context.beginPath();
	Draw.drawBezierPolygon(context, polygon, -frame.x, -frame.y);
	context.fill();
	
	var center;
	var testPoint;
	var angle;
	var r;
	var rMax=0;
	var bestCenter;
	
	
	for(var i=0; i<nAttempts; i++){
		center = frame.getRandomPoint();
		for(angle=0; angle+=0.1; angle<=TwoPi){
			r = angle;
			var data = context.getImageData(center.x+r*Math.cos(angle)-frame.x, center.y+r*Math.sin(angle)-frame.y, 1, 1).data;
			if(data[0]==0){
				if(r>rMax){
					rMax = r;
					bestCenter = center;
				}
				break;
			}
		}
	}
	
	return bestCenter;
}


PolygonOperators.convexHull = function(polygon, deepness) {
	var indexesHull = this.hull(polygon, true);
	var pointsLeftIndexes = NumberListGenerators.createSortedNumberList(polygon.length);
	pointsLeftIndexes = pointsLeftIndexes.getWithoutElementsAtIndexes(indexesHull);
	var i;
	var j;
	var k;
	var p0;
	var p1;
	var pC = new Point();
	var p;
	var d;
	var dMin = deepness-1;
	var jMin;
	var kMin;
	var dP;
	var nHull = indexesHull.length;
	
	while(dMin<deepness){
		//c.log(dMin, deepness, nHull, pointsLeftIndexes.length);
		dMin = 999999999;
		for(j=0;j<nHull;j++){
			p0 = polygon[indexesHull[j]];
			p1 = polygon[indexesHull[(j+1)%indexesHull.length]];
			pC.x = (p0.x+p1.x)*0.5;
			pC.y = (p0.y+p1.y)*0.5;
			dP = Math.sqrt(Math.pow(p1.x-p0.x, 2)+Math.pow(p1.y-p0.y, 2));
			for(k=0;pointsLeftIndexes[k]!=null;k++){
				p = polygon[pointsLeftIndexes[k]];
				//d = Math.pow(p.x-pC.x, 2)+Math.pow(p.y-pC.y, 2); 
				d = (Math.sqrt(Math.pow(p.x-p0.x, 2)+Math.pow(p.y-p0.y, 2)) + Math.sqrt(Math.pow(p.x-p1.x, 2)+Math.pow(p.y-p1.y, 2)))/Math.pow(dP, 2);
				if(d<dMin){
					dMin = d;
					jMin = j;
					kMin = k;
				}
			}
		}
		
		//c.log("  ", dMin);
		
		for(j=nHull-1;j>jMin;j--){
			indexesHull[j+1] = indexesHull[j];
		}
		indexesHull[jMin+1] = pointsLeftIndexes[kMin];
		
		//pointsLeftIndexes.removeElement(pointsLeftIndexes[kMin]); //!!!! TODO: FIX THIS!
		pointsLeftIndexes.splice(kMin, 1);
		
		if(pointsLeftIndexes.length==0) return indexesHull;
		
		nHull++;
	}
	return indexesHull;
}

PolygonOperators.controlPointsFromPointsAnglesIntensities = function(polygon, angles, intensities){
	var controlPoints = new Polygon();
	for(var i=0; polygon[i]!=null; i++){
		if(i>0) controlPoints.push(new Point(polygon[i].x - intensities[i]*Math.cos(angles[i]), polygon[i].y - intensities[i]*Math.sin(angles[i])));
		if(i<polygon.length-1) controlPoints.push(new Point(polygon[i].x + intensities[i]*Math.cos(angles[i]), polygon[i].y + intensities[i]*Math.sin(angles[i])));
	}
	return controlPoints;
}


PolygonOperators.placePointsInsidePolygon = function(polygon, nPoints, mode){
	var points = new Polygon();
	var frame = polygon.getFrame();
	mode = mode||0;
	switch(mode){
		case 0://random simple
			var p;
			while(points.length<nPoints){
				p = new Point(frame.x+Math.random()*frame.width, frame.y+Math.random()*frame.height);
				if(PolygonOperators.polygonContainsPoint(polygon, p)) points.push(p);
			}
			return points;
			break;
	}
}

PolygonOperators.placePointsInsideBezierPolygon = function(polygon, nPoints, mode, border){
	var points = new Polygon();
	var frame = polygon.getFrame();
	mode = mode||0;
	switch(mode){
		case 0://random simple
			var p;
			var nAttempts = 0;
			while(points.length<nPoints && nAttempts<1000){
				p = new Point(frame.x+Math.random()*frame.width, frame.y+Math.random()*frame.height);
				nAttempts++;
				if(PolygonOperators.bezierPolygonContainsPoint(polygon, p, border)){
					points.push(p);
					nAttempts=0;
				} 
			}
			return points;
			break;
	}
}