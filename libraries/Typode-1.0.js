typodeDrawTextPolygons = function(polygons, x, y, xS, yS, transformation){
	transformation = transformation==null?identity2D:transformation;
	var polygon;
	var point;
	
	for(var i=0; polygons[i]!=null; i++){
		polygon = polygons[i];
		
		if(polygon.length==0) continue;
		
		context.beginPath();
		
		point = transformation(polygon[0].x, polygon[0].y);
		
		context.moveTo(Math.floor(point[0]*xS+x)+0.5, Math.floor(point[1]*yS+y)+0.5);
		
		for(var j=1; polygon[j]!=null; j++){
			point = transformation(polygon[j].x, polygon[j].y);
			context.lineTo(Math.floor(point[0]*xS+x)+0.5, Math.floor(point[1]*yS+y)+0.5);
		}
		
		delete point[0];
		delete point[1];
		delete point;
		
		context.stroke();
	}
}

typodePolygonsFromText = function(text, maxWidthLine, scale, space, interLines, tx, ty, kern){
	maxWidthLine = maxWidthLine||0;
	scale = scale || 1;
	space = space||0.3;
	interLines = interLines || scale*2.5;
	tx = tx||0;
	ty = ty||0;
	kern = kern||0.2;
	
	var matrix;
	var ps = new PolygonList();
	var word = new PolygonList();
	var iWord=0;
	var polygon;
	var k;
	var alpha;
	
	var x0 = tx;
	var y0 = ty;
	
	var s = scale/2;
	
	var kernW = 1;
	var charW;
	
	var firstChar=false;
	
	ps.width = 0;
	
	for(var i=0; i<text.length; i++){
		k  = text.charAt(i);
		if(firstChar && k==" ") continue;
		
		if(k=="\n" && maxWidthLine!=0){
			y0 += interLines;
			x0 = tx;
			ps = ps.concat(word);
			word = new PolygonList();
			iWord = i;
			continue;
		}
		
		matrix = typodeObject[k];
		
		alpha = matrix!=null;
		
		if(matrix==null){
			var symbolPosition = typodeObject.symbols[0].indexOf(k);
			if(symbolPosition!=-1) matrix =  typodeObject[typodeObject.symbols[1][symbolPosition]];
		}
		
		if(matrix==null) matrix = [];
		
		charW = 0;
		for(h=0; matrix[h]!=null; h++){
			polygon = new Polygon();
			for(var j= 0; matrix[h][j]!=null; j++){
				polygon[j] = new Point(matrix[h][j][0]*s+x0+0.5, matrix[h][j][1]*s+y0+0.5);
			}
			word.push(polygon);
			if(kern) charW = Math.max(charW, polygon.getFrame().width/s);
		}
		
		if(k==" "){
			ps = ps.concat(word);
			word = new PolygonList();
			iWord = i;
		}
		
		kernW = kern?(k==" "?1:charW*0.5):1;
		
		if(!(x0==tx && k==" ")) x0+=(scale*(kernW+space));
		
		if(maxWidthLine>0 && x0>maxWidthLine+tx){
			y0 += interLines;
			ps.width = Math.max(x0, ps.width);
			x0 = tx;
			
			word = new PolygonList();
			i=iWord;
			firstChar=true;
		} else {
			firstChar=false;
		}
	}
	ps = ps.concat(word);
	ps.width = Math.max(x0, ps.width);
	
	return ps; 
}

/*
typodePolygonsFromText = function(text, maxWidthLine, scale, space, interLines, tx, ty, kern){
	var matrix;
	var ps = new PolygonList();
	var polygon;
	var k;
	var alpha;
	
	var x0 = tx;
	var y0 = ty;
	
	var s = scale/2;
	
	var kernW = 1;
	var charW;
	
	ps.width = 0;
	
	for(var i=0; i<text.length; i++){
		k  = text.charAt(i);
		
		if(k=="\n" && maxWidthLine!=0){
			y0 += interLines;
			x0 = tx;
			continue;
		}
		
		matrix = typodeObject[k];
		
		alpha = matrix!=null;
		
		if(matrix==null){
			var symbolPosition = typodeObject.symbols[0].indexOf(k);
			if(symbolPosition!=-1) matrix =  typodeObject[typodeObject.symbols[1][symbolPosition]];
		}
		
		if(matrix==null) matrix = [];
		
		charW = 0;
		for(h=0; matrix[h]!=null; h++){
			polygon = new Polygon();
			for(var j= 0; matrix[h][j]!=null; j++){
				polygon[j] = new Point(matrix[h][j][0]*s+x0, matrix[h][j][1]*s+y0);
			}
			ps.push(polygon);
			if(kern) charW = Math.max(charW, polygon.getFrame().width);
		}
		
		kernW = kern?(k==" "?1:charW):1;
		
		if(!(x0==tx && k==" ")) x0+=(scale*kernW+space);
		if(maxWidthLine>0 && x0+scale+space>maxWidthLine+tx && !alpha){
			y0 += interLines;
			ps.width = Math.max(x0, ps.width);
			x0 = tx;
		}
	}
	
	ps.width = Math.max(x0, ps.width);
	
	return ps; 
}
*/

identity2D = function(x, y){
	return [x, y];
}

var typodeObject = {
	"0":[[[0,0],[2,0],[2,3],[0,3],[0,0],[2,3]]],
	"1":[[[0,2],[2,0],[2,3]]],
	"2":[[[0,0],[2,0],[2,1],[0,3],[2,3]]],
	"3":[[[0,0],[2,0],[0,1],[2,1],[2,3],[0,3]]],
	"4":[[[0,0],[0,2],[2,2],[2,0]],[[2,2],[2,3]]],
	"5":[[[2,0],[0,0],[0,1],[2,1],[2,3],[0,3]]],
	"6":[[[2,0],[0,0],[0,3],[2,3],[2,1],[0,1]]],
	"7":[[[0,0],[2,0],[0,3]],[[0,1],[2,1]]],
	"8":[[[0,0],[2,0],[2,3],[0,3],[0,0]],[[0,1],[2,1]]],
	"9":[[[2,1],[0,1],[0,0],[2,0],[2,1],[0,3]]],
	
	"A":[ [[0,3],[0,0],[2,0],[2,1],[0,1]], [[2,1],[2,3]] ],
	"B":[ [[0,1],[2,1],[2,3],[0,3],[0,0],[1,0],[1,1]] ],
	"C":[ [[2,0],[0,0],[0,3],[2,3]] ],
	"D":[ [[0,0],[1,0],[2,1],[2,3], [0,3],[0,0]] ],
	"E":[ [[2,0],[0,0],[0,3],[2,3]], [[0,1],[2,1]] ],
	"F":[ [[2,0],[0,0],[0,3]], [[0,1],[2,1]] ],
	"G":[ [[2,0],[0,0],[0,3],[2,3],[2,2],[1,2]] ],
	"H":[ [[0,3],[0,0]], [[2,3],[2,0]], [[0,1],[2,1]] ],
	"I":[ [[0,3],[0,0]] ],
	"J":[ [[0,0],[2,0],[2,3],[0,3],[0,2]] ],
	"K":[ [[0,3],[0,0]], [[0,1],[2,0]], [[0.6, 0.6],[2, 3]] ],
	"L":[ [[2,3],[0,3],[0,0]] ],
	"M":[ [[0,3],[0,0],[1,1],[2,0],[2,3]] ],
	"N":[ [[0,3],[0,0],[2,3],[2,0]] ],
	"Ñ":[ [[0,3],[0,0],[2,3],[2,0],[1,1],[1,0]] ],
	"O":[ [[0,0],[2,0],[2,3],[0,3],[0,0]] ],
	"P":[ [[0,3],[0,0],[2,0],[2,2],[0,2]] ],
	"Q":[ [[2,3],[0,3],[0,0],[2,0],[2,3],[1,2]] ],
	"R":[ [[0,3],[0,0],[2,0],[2,2],[0,2]], [[1,2],[2,3]] ],
	"S":[ [[2,0],[0,0],[0,1],[2,1],[2,3],[0,3]] ],
	"T":[ [[0,0],[2,0]], [[1,0],[1,3]] ],
	"U":[ [[0,0],[0,3],[2,3],[2,0]] ],
	"V":[ [[0,0],[1,3],[2,0]] ],
	"W":[ [[0,0],[0,3],[1,2],[2,3],[2,0]] ],
	"X":[ [[0,0],[2,3]], [[0,3],[2,0]] ],
	"Y":[ [[0,3],[2,0]], [[0,0],[1.1,1.1]] ],
	"Z":[ [[0,0],[2,0],[0,3],[2,3]] ],
	
	"a":[ [[0,1],[2,1],[2,3],[0,3],[0,2],[2,2]] ],
	"b":[ [[0,0],[0,3],[2,3],[2,1],[0,1]] ],
	"c":[ [[2,1],[0,1],[0,3],[2,3]] ],
	"d":[ [[2,0],[2,3],[0,3],[0,1],[2,1]] ],
	"e":[ [[2,3],[0,3],[0,1],[2,1],[2,2],[0,2]] ],
	"f":[ [[1,3],[1,0],[2,0]], [[0,2],[2,2]] ],
	"g":[ [[2,3],[0,3],[0,1.5],[2,1.5],[2,4],[0,4]] ],
	"h":[ [[0,0],[0,3]], [[0,1],[2,1],[2,3]] ],
	"i":[ [[0,3],[0,1]] ],
	"j":[ [[0,4],[1,4],[1,1]] ],
	"k":[ [[0,3],[0,0]], [[0,2],[2,1]], [[0.8, 1.6],[2, 3]] ],
	"l":[ [[1,3],[0,3],[0,0]] ],
	"m":[ [[0,3],[0,1],[1,2],[2,1],[2,3]] ],
	"n":[ [[0,3],[0,1],[2,3],[2,1]] ],
	"ñ":[ [[0,3],[0,1],[2,3],[2,1],[1,1]] ],
	"o":[ [[0,1],[2,1],[2,3],[0,3],[0,1]] ],
	"p":[ [[0,4],[0,1],[2,1],[2,3],[0,3]] ],
	"q":[ [[2,4],[2,1],[0,1],[0,3],[2,3]] ],
	"r":[ [[0,3],[0,1],[1,1]] ],
	"s":[ [[2,1],[0,1],[0,2],[2,2],[2,3],[0,3]] ],
	"t":[ [[2,3],[1,3],[1,0]], [[0,1],[2,1]] ],
	"u":[ [[0,1],[0,3],[2,3],[2,1]] ],
	"v":[ [[0,1],[1,3],[2,1]] ],
	"w":[ [[0,1],[0,3],[1,2],[2,3],[2,1]] ],
	"x":[ [[0,1],[2,3]], [[0,3],[2,1]] ],
	"y":[ [[0,3],[2,1]], [[0,1],[1,2]] ],
	"z":[ [[0,1],[2,1],[0,3],[2,3]] ],
	
	"á":[ [[0,1],[2,1],[2,3],[0,3],[0,2],[2,2]], [[1,0.4],[2,0]] ],
	"é":[ [[2,3],[0,3],[0,1],[2,1],[2,2],[0,2]], [[1,0.4],[2,0]] ],
	"í":[ [[0,3],[0,1]], [[0,0.4],[1,0]] ],
	"ó":[ [[0,1],[2,1],[2,3],[0,3],[0,1]], [[1,0.4],[2,0]] ],
	"ú":[ [[0,1],[0,3],[2,3],[2,1]], [[1,0.4],[2,0]] ],
	"ü":[ [[0,1],[0,3],[2,3],[2,1]], [[0,0],[0,0.4]], [[2,0],[2,0.4]] ],
	"ç":[ [[2,1],[0,1],[0,3],[2,3]], [[1,3],[1,3.4],[1.6, 3.4],[1.6, 4],[1, 4]] ],
	"Ç":[ [[2,0],[0,0],[0,3],[2,3]], [[1,3],[1,3.4],[1.6, 3.4],[1.6, 4],[1, 4]] ],
	
	"symbols":[
		["|", "@", "=", "%", "<", ">", ":", ",", ";", ".", "[", "]", "(", ")", "+", "-", "*", "?", "!", "\"", "'", "/", "\\", "$", " "],
		["bar", "at", "equal", "percentage", "lower", "greater", "colon", "comma", "semicolon", "period", "openbracket", "closebracket", "openparenthesis", "closeparenthesis", "plus", "minus", "asterisk", "question", "exclamation", "quote", "singlequote", "slash", "backslash", "money", "space"]
	],
	
	"bar":[ [[0,-0.5],[0,3.5]] ],
	"at":[ [[0,3],[0,1],[2,1],[2,3],[1,3],[1,2],[2,2]] ],
	"equal":[ [[0,2],[2,2]], [[0,3],[2,3]] ],
	"percentage":[ [[0,3],[2,0]], [[0,0.5], [0,1]], [[2,2.5], [2,2]] ],
	"lower":[ [[2,0],[0,1.5],[2,3]] ],
	"greater":[ [[0,0],[2,1.5],[0,3]] ],
	"colon":[ [[0,1.4],[0,1.6]], [[0,2.4],[0,2.6]] ],
	"comma":[ [[0,2.4],[-0.2,3]] ],
	"semicolon":[ [[0,1.4],[0,1.6]], [[0,2.4],[-0.2,3]] ],
	"period":[ [[0,2.8],[0,3]] ],
	"openbracket":[ [[0.4,3],[0,3],[0,0],[0.4,0]] ],
	"closebracket":[ [[0.6,3],[1,3],[1,0],[0.6,0]] ],
	"openparenthesis":[ [[0.6,3],[0,1.5],[0.6,0]] ],
	"closeparenthesis":[ [[0,3],[0.6,1.5],[0,0]] ],
	"plus":[ [[0,2],[2,2]], [[1,1],[1,3]] ],
	"minus":[ [[0,2],[2,2]] ],
	"asterisk":[ [[0,2],[2,2]], [[1,1],[1,3]], [[0.4,1.4],[1.6,2.6]], [[1.6,1.4],[0.4,2.6]] ],
	"question":[ [[1,3],[1,2.4]], [[1,2],[1,1.4],[2,1.4],[2,0],[0,0],[0,1]] ],
	"exclamation":[ [[0,3],[0,2.4]], [[0,2],[0,0]] ],
	"quote":[ [[0,0],[0,1]], [[0.8,0],[0.8,1]] ],
	"singlequote":[ [[0,0],[0,1]] ],
	"slash":[ [[0,3],[2,0]] ],
	"backslash":[ [[0,0],[2,3]]],
	"money":[ [[2,0],[0,0],[0,1],[2,1],[2,3],[0,3]], [[1,-0.5],[1,3.5]] ],
	"space":[]
};
