/*
 * graphic and text methods globally accesible
 * that work with context
 */


//drawing

fRect = function(x, y, width, height){
	if(typeof x != 'number'){y = x.y; width=x.width; height = x.height; x = x.x};
	context.fillRect(x, y, width, height);
}

sRect = function(x, y, width, height){
	if(typeof x != 'number'){y = x.y; width=x.width; height = x.height; x = x.x};
	context.strokeRect(x, y, width, height);
}

fsRect = function(x, y, width, height){
	if(typeof x != 'number'){y = x.y; width=x.width; height = x.height; x = x.x};
	context.fillRect(x, y, width, height);
	context.strokeRect(x, y, width, height);
}

fCircle = function(x, y, r){
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.fill();
}

sCircle = function(x, y, r){
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.stroke();
}

fsCircle = function(x, y, r){
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.fill();
	context.stroke();
}

fEllipse = function(x, y, rW, rH){
	var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
	ox = rW * k,  // control point offset horizontal
    oy = rH * k,  // control point offset vertical
    xe = x + rW,      // x-end
    ye = y + rH;      // y-end
	context.beginPath();
   	context.moveTo(x - rW, y);
    context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    context.moveTo(x - rW, y);
    context.closePath();
  	context.fill();
}

sEllipse = function(x, y, rW, rH){
	var k = 0.5522848,
	ox = rW * k,
    oy = rH * k,
    xe = x + rW,
    ye = y + rH;
	context.beginPath();
   	context.moveTo(x - rW, y);
    context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    context.moveTo(x - rW, y);
    context.closePath();
  	context.stroke();
}

fsEllipse = function(x, y, rW, rH){
	var k = 0.5522848,
	ox = rW * k,
    oy = rH * k,
    xe = x + rW,
    ye = y + rH;
	context.beginPath();
   	context.moveTo(x - rW, y);
    context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    context.moveTo(x - rW, y);
    context.closePath();
  	context.fill();
	context.stroke();
}

line = function(x0, y0, x1, y1){
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.stroke();
}


bezier = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1){
	context.beginPath();
	context.moveTo(x0, y0);
	context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
	context.stroke();
}


_lines = function(){
	if(arguments==null) return;
	arguments = arguments[0];
	context.beginPath();
	context.moveTo(arguments[0], arguments[1]);
	for(var i=2; arguments[i+1]!=null; i+=2){
		context.lineTo(arguments[i], arguments[i+1]);
	}
}

_linesM = function(){
	if(arguments==null) return;
	arguments = arguments[0];
	var p = new Polygon();
	context.beginPath();
	context.moveTo(arguments[0], arguments[1]);
	p[0] = new Point(arguments[0], arguments[1]);
	for(var i=2; arguments[i+1]!=null; i+=2){
		context.lineTo(arguments[i], arguments[i+1]);
		p.push(new Point(arguments[i], arguments[i+1]));
	}
	return p.containsPoint(mP);
}


fLines = function(){
	_lines(arguments);
	context.fill();
}

sLines = function(){
	_lines(arguments);
	context.stroke();
}

fsLines = function(){
	_lines(arguments);
	context.fill();
	context.stroke();
}

fsLinesM = function(){
	var mouseOn = _linesM(arguments);
	context.fill();
	context.stroke();
	return mouseOn;
}

_polygon = function(polygon){
	context.beginPath();
	context.moveTo(polygon[0].x, polygon[0].y);
	for(var i=1; polygon[i]!=null; i++){
		context.lineTo(polygon[i].x, polygon[i].y);
	}
}

fPolygon = function(polygon){
	_polygon(polygon);
	context.fill();
}

sPolygon = function(polygon, closePath){
	_polygon(polygon);
	if(closePath) context.closePath();
	context.stroke();
}

fsPolygon = function(polygon, closePath){
	_polygon(polygon);
	if(closePath) context.closePath();
	context.fill();
	context.stroke();
}

fEqTriangle = function(x, y, angle, r){
	_eqTriangle(x, y, angle, r);
	context.fill();
}

sEqTriangle = function(x, y, angle, r){
	_eqTriangle(x, y, angle, r);
	context.stroke();
}

fsEqTriangle = function(x, y, angle, r){
	_eqTriangle(x, y, angle, r);
	context.fill();
	context.stroke();
}

_eqTriangle = function(x, y, angle, r){
	context.beginPath();
	angle = angle || 0;
	context.moveTo(r*Math.cos(angle)+x, r*Math.sin(angle)+y);
	context.lineTo(r*Math.cos(angle+2.0944)+x, r*Math.sin(angle+2.0944)+y);
	context.lineTo(r*Math.cos(angle+4.1888)+x, r*Math.sin(angle+4.1888)+y);
	context.lineTo(r*Math.cos(angle)+x, r*Math.sin(angle)+y);
}


//drawing and checking cursor

fRectM = function(x, y, width, height, margin){
	margin = margin==null?0:margin;
	context.fillRect(x, y, width, height);
	return mY>y-margin && mY<y+height+margin && mX>x-margin && mX<x+width+margin;
}

sRectM = function(x, y, width, height, margin){
	margin = margin==null?0:margin;
	context.strokeRect(x, y, width, height);
	return mY>y-margin && mY<y+height+margin && mX>x-margin && mX<x+width+margin;
}

fsRectM = function(x, y, width, height, margin){
	margin = margin==null?0:margin;
	context.fillRect(x, y, width, height);
	context.strokeRect(x, y, width, height);
	return mY>y-margin && mY<y+height+margin && mX>x-margin && mX<x+width+margin;
}

fCircleM = function(x, y, r, margin){
	margin = margin==null?0:margin;
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.fill();
	return Math.pow(x-mX,2)+Math.pow(y-mY,2)<Math.pow(r+margin, 2);
}
sCircleM = function(x, y, r, margin){
	margin = margin==null?0:margin;
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.stroke();
	return Math.pow(x-mX,2)+Math.pow(y-mY,2)<Math.pow(r+margin, 2);
}
fsCircleM = function(x, y, r, margin){
	margin = margin==null?0:margin;
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi);
	context.stroke();
	context.fill();
	return Math.pow(x-mX,2)+Math.pow(y-mY,2)<Math.pow(r+margin, 2);
}

lineM = function(x0, y0, x1, y1, d){
	d = d||4;
	context.beginPath();
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.stroke();
	return _distToSegmentSquared(x0, y0, x1, y1)<d*d;
}
_distToSegmentSquared = function(x0, y0, x1, y1) {
  var l2 = Math.pow(x0-x1, 2)+Math.pow(y0-y1, 2);
  if (l2 === 0) return Math.pow(x0-mX, 2)+Math.pow(y0-mY, 2);
  var t = ((mX - x0) * (x1 - x0) + (mY - y0) * (y1 - y0)) / l2;
  if (t <= 0) return Math.pow(x0-mX, 2)+Math.pow(y0-mY, 2);
  if (t >= 1) return Math.pow(x1-mX, 2)+Math.pow(y1-mY, 2);
  var px = x0 + t * (x1 - x0);
  var py = y0 + t * (y1 - y0);
  return Math.pow(px-mX, 2)+Math.pow(py-mY, 2);
}

//TODO:fEqTriangleM, fPolygonM

bezierM = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1, d){//TODO: fix this mess!
	d = d==null?2:d;
	context.beginPath();
	context.moveTo(x0, y0);
	context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
	context.stroke();
	return GeometryOperators.distanceToBezierCurve(x0, y0, cx0, cy0, cx1, cy1, x1, y1, mP, false)<d;
}



//images

/**
 * draw an image on context, parameters options (s for source, d for destination):
 *	drawImage(image, dx, dy)
 *	drawImage(image, dx, dy, dw, dh)
 *	drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
 */
drawImage = function(image){//TODO: improve efficiency
	switch(arguments.length){
		case 3:
			context.drawImage(image, arguments[1], arguments[2]);
			break;
		case 5:
			context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4]);
			break;
		case 9:
			context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
			break;
			
	}
}

// styles

setFill = function(style){
	if(typeof style == "number"){
		if(arguments.length>3){
			context.fillStyle = 'rgba('+arguments[0]+','+arguments[1]+','+arguments[2]+','+arguments[3]+')';
			return;
		}
		context.fillStyle = 'rgb('+arguments[0]+','+arguments[1]+','+arguments[2]+')';
		return;
	}
	context.fillStyle = style;
}

setStroke = function(style, lineWidth){
	if(typeof style == "number"){
		if(arguments.length>3){
			context.strokeStyle = 'rgba('+arguments[0]+','+arguments[1]+','+arguments[2]+','+arguments[3]+')';
			return;
		}
		context.strokeStyle = 'rgb('+arguments[0]+','+arguments[1]+','+arguments[2]+')';
		return;
	}
	context.strokeStyle = style;

	if(lineWidth) context.lineWidth = lineWidth;
}

setLW = function(lineWidth){
	context.lineWidth = lineWidth;
}



//clipping

clipCircle = function(x, y, r){
	context.save();
	context.beginPath();
	context.arc(x, y, r, 0, TwoPi, false);
	context.closePath();
	context.clip();
}

clipRectangle = function(x, y, w, h){
	context.save();
	context.beginPath();
	context.moveTo(x,y);
	context.lineTo(x+w,y);
	context.lineTo(x+w,y+h);
	context.lineTo(x,y+h);
	context.clip();
}

restore = function(){
	context.restore();
}


// texts

fText = function(text, x, y){
	context.fillText(text, x, y);
}

sText = function(text, x, y){
	context.strokeText(text, x, y);
}

fsText = function(text, x, y){
	context.strokeText(text, x, y);
	context.fillText(text, x, y);
}

fTextRotated = function(text, x, y, angle){
	context.save();
	context.translate(x, y);
	context.rotate(angle);
	context.fillText(text, 0, 0);
  	context.restore();
}

fTextM = function(text, x, y, size){
	size = size || 12;
	context.fillText(text, x, y);
	return mY>y && mY<y+size && mX>x && mX<x+context.measureText(text).width;
}

fsTextM = function(text, x, y, size){
	size = size || 12;
	context.strokeText(text, x, y);
	context.fillText(text, x, y);
	return mY>y && mY<y+size && mX>x && mX<x+context.measureText(text).width;
}

fTextRotatedM = function(text, x, y, angle, size){
	size = size || 12;
	context.save();
	context.translate(x, y);
	context.rotate(angle);
	context.fillText(text, 0, 0);
  	context.restore();
  	
  	var dX = mX-x;
  	var dY = mY-y;
  	var d = Math.sqrt(dX*dX+dY*dY);
  	var a = Math.atan2(dY, dX)-angle;
  	var mXT = x + d*Math.cos(a);
  	var mYT = y + d*Math.sin(a);
  	
  	return mYT>y && mYT<y+size && mXT>x && mXT<x+context.measureText(text).width;
}
fTextW = function(text, x, y){
	context.fillText(text, x, y);
	return context.measureText(text).width;
}

/**
 * set several text canvas rendering properties
 * @param {Object} color optional font color
 * @param {Object} fontSize optional font size
 * @param {Object} fontName optional font name (default: LOADED_FONT)
 * @param {Object} align optional horizontal align ('left', 'center', 'right')
 * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
 * @param {Object} style optional font style ('bold', 'italic', 'underline')
 * @param {Object} ctx optional context
 */
setText = function(color, fontSize, fontName, align, baseline, style){
	color = color||'#000000';
	fontSize = String(fontSize)||'14';
	fontName = fontName||LOADED_FONT;
	align = align==null?'left':align;
	baseline = baseline==null?'top':baseline;
	style = style==null?'':style;
	
	if(style!='') style+=' ';
	
	context.fillStyle    = color;
  	context.font         = style+fontSize+'px '+fontName;
  	context.textAlign 	 = align;
  	context.textBaseline = baseline;
}

getTextW = function(text){
	return context.measureText(text).width;
}


// pixel data

getPixelData = function(x, y){
	return context.getImageData(x,y,1,1).data;
}

getPixelColor = function(x, y){
	var rgba =  context.getImageData(x,y,1,1).data;
	return 'rgba('+rgba[0]+','+rgba[1]+','+rgba[2]+','+rgba[3]+')';
}

getPixelColorRGBA = function(x, y){
	return context.getImageData(x,y,1,1).data;
}

captureCanvas = function(){
	var im = new Image();
	im.src = canvas.toDataURL();
	return im;
}


drawAndcapture = function(drawFunction, w, h, target){
	var defaultContext = context;
	
	context = hiddenContext;
	
	context.canvas.setAttribute('width', w);
    context.canvas.setAttribute('height', h);
    
	context.clearRect(0,0,w,h);
	
	target==null?drawFunction.call():drawFunction.call(target);
	
	var im = new Image();
	im.src = context.canvas.toDataURL();
	
	context = defaultContext;

	return im;
}


//cursor

setCursor = function(name){
	name = name==null?'default':name;
	canvas.style.cursor = name;
}

//time

getMilliseconds = function(){
	var date = new Date();
	_ms = date.getTime();
	delete date;
	return _ms;
}



