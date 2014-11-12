/**
* RectangleOperators
* @constructor
*/
function RectangleOperators(){};


/**
 * 
 * 0: quadrification
 * 1: vertical
 * 2: horizontal
 * 3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
 * 4: europe quadrigram
 * 5: vertical strips quadrification
 * 6: horizontal strips quadrification
 */
RectangleOperators.packingRectangles=function(weights, packingMode, rectangle, param){
	//TODO: return RectangleList instead of List
	if(rectangle==null) rectangle = new Rectangle(0,0,1,1);
	packingMode=packingMode?packingMode:0;
	switch(packingMode){
		//0: quadrification
		//1: vertical
		//2: horizontal
		//3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
		//4: europe quadrigram
		//5:vertical strips
		case 0:
			return RectangleOperators.squarify(rectangle, weights);
		case 1:
			var minMax = weights.getMinMaxInterval();
			if(minMax.min<0){
				weights = weights.add(-minMax.min);
				minMax = new Interval(0, minMax.max-minMax.min);
			}
			 
			var sum = weights.getSum();
			
			var rectangleList = new List();//RectangleList();
			var dY=rectangle.y;
			var h;
			var vFactor = rectangle.height/sum;
			var i;
			for(i=0; weights[i]!=null; i++){
				h = vFactor*weights[i];
				rectangleList.push(new Rectangle(rectangle.x, dY, rectangle.width, h));
				dY+=h;
			}
			return rectangleList;
		case 2:
			minMax = weights.getMinMaxInterval();
			if(minMax.min<0){
				weights = weights.add(-minMax.min);
				minMax = new Interval(0, minMax.max-minMax.min);
			}
			sum = weights.getSum();
			
			rectangleList = new List();//RectangleList();
			var dX=rectangle.x;
			var w;
			var hFactor = rectangle.width/sum;
			for(i=0; weights[i]!=null; i++){
				w = hFactor*weights[i];
				rectangleList.push(new Rectangle(dX, rectangle.y, w, rectangle.height));
				dX+=w;
			}
			return rectangleList;
			//var newNumberList:NumberList = OperatorsNumberList.accumulationNumberList(OperatorsNumberList.normalizeNumberListToInterval(weights, new Interval(weights.min, 1)));
		case 3:
			if(weights.length<6){
				
			} else if(weights.length==6){
				var rAfrica = new Rectangle(0.44,0.36,0.16,0.45);
				var rAsia = new Rectangle(0.6,0.15,0.3,0.3);
				var rAustralasia = new Rectangle(0.72,0.45,0.28,0.32);
				var rEurope = new Rectangle(0.38,0.04,0.22,0.32);
				
				var pivotEuroafrasia = new Point(0.6,0.36);
				rAfrica = expandRectangle(rAfrica, Math.sqrt(weights[0]), pivotEuroafrasia);
				rAsia = expandRectangle(rAsia, Math.sqrt(weights[1]), pivotEuroafrasia);
				rEurope = expandRectangle(rEurope, Math.sqrt(weights[3]), pivotEuroafrasia);
				
				rAustralasia.x = rAsia.x + rAsia.width*0.5;
				rAustralasia.y = rAsia.bottom;
				var pivotAustralasia = new Point(rAustralasia.x + rAustralasia.width*0.3, rAsia.bottom);
				rAustralasia = expandRectangle(rAustralasia, Math.sqrt(weights[2]), pivotAustralasia);
				rAustralasia.y+=rAustralasia.height*0.2;
				
				var pivotAmericas = new Point(0.26,0.36 + Math.max(rAfrica.height*0.3, rEurope.height*0.2));
				
				var rNorthAmerica = new Rectangle(0.1, pivotAmericas.y-0.4,0.2,0.4);
				var rSouthAmerica = new Rectangle(0.22, pivotAmericas.y,0.16,0.5);
				
				rNorthAmerica = expandRectangle(rNorthAmerica, Math.sqrt(weights[4]), pivotAmericas);
				rSouthAmerica = expandRectangle(rSouthAmerica, Math.sqrt(weights[5]), pivotAmericas);
				
				var separation = Math.max(rEurope.width, rAfrica.width, rSouthAmerica.right-pivotAmericas.x, rNorthAmerica.right-pivotAmericas.x)*0.2;
				var delta = Math.min(rEurope.x, rAfrica.x) - Math.max(rNorthAmerica.right, rSouthAmerica.right)-separation;
				
				rSouthAmerica.x+=delta;
				rNorthAmerica.x+=delta;
				
				return new List(rAfrica, rAsia, rAustralasia, rEurope, rNorthAmerica, rSouthAmerica); //RectangleList
				
			} else {
				
			}
		case 4:
			return europeQuadrigram(weights);
		case 5:	
			param = param||0;
			if(param==0){
				var nLists = Math.round(Math.sqrt(weights.length));
			} else {
				nLists = Math.round(weights.length/param);
			}
			var nRows = Math.ceil(weights.length/nLists);
			
			var nMissing = nLists*nRows-weights.length;
			
			var average = weights.getAverage();
			var weigthsCompleted = ListOperators.concat(weights, ListGenerators.createListWithSameElement(nMissing, average));
			var table = ListOperators.slidingWindowOnList(weigthsCompleted, nRows, nRows, 0);
			var sumList = table.getSums();
			var rectangleColumns = this.packingRectangles(sumList, 2, rectangle);
			
			rectangleList = List();//new RectangleList();
			
			for(i=0; i<nLists; i++){
				rectangleList = ListOperators.concat(rectangleList, this.packingRectangles(table[i], 1, rectangleColumns[i]));
			}
			
			return rectangleList;
		case 6: //horizontal strips
	}
	return null;
}

RectangleOperators.quadrification = RectangleOperators.squarify; //old name

/**
* Squarified algorithm as described in (http://www.win.tue.nl/~vanwijk/stm.pdf)
* @param {Rectangle} bounds Rectangle
* @param {NumberList} list of weights
* 
* @param {Boolean} weights are normalized
* @param {Boolean} weights are sorted
* @return {List} a list of Rectangles
* tags:
*/
RectangleOperators.squarify=function(frame, weights, isNormalizedWeights, isSortedWeights){//, funcionEvaluacionnWeights:Function=null):Array{
	if(weights.length==0) return new RectangleList();
	if(weights.length==1) return new RectangleList(frame);
	isNormalizedWeights=isNormalizedWeights?isNormalizedWeights:false;
	isSortedWeights=isSortedWeights?isSortedWeights:false;
	var newWeightList;

	if(isNormalizedWeights){
		newWeightList = weights;// new NumberList(arregloPesos);
	} else {
		newWeightList = weights.getNormalizedToSum();
	}
	
	if(!isSortedWeights){
		var newPositions = newWeightList.getSortIndexes();// ListOperators.sortListByNumberList();// newWeightList.sortNumericIndexedDescending();
		newWeightList = ListOperators.sortListByNumberList(newWeightList, newWeightList);
	}
	//trace("RectangleOperators.squarified | ", newWeightList);
	var area =  frame.width*frame.height;
	var rectangleList=new RectangleList();
	var freeRectangle = frame.clone();
	var subWeightList;
	var subRectangleList = new List();//RectangleList();//
	var prevSubRectangleList;
	var proportion;
	var worstProportion;
	var index=0;
	var subArea;
	var freeSubRectangle = new Rectangle();
	var nWeights = weights.length;
	var lastRectangle;
	var isColumn;
	if(nWeights>2){
		var i;
		var j;
		for(i=index; i<nWeights; i++){
			proportion = Number.MAX_VALUE;
			if(newWeightList[i]==0){
				rectangleList.push(new Rectangle(freeSubRectangle.x, freeSubRectangle.y, 0, 0));
			} else {
				for(j=1; j<nWeights; j++){ 
					subWeightList = NumberList.fromArray(newWeightList.slice(i, i+j));
					prevSubRectangleList = subRectangleList.clone();
					subArea = subWeightList.getSum()*area;
					freeSubRectangle.x = freeRectangle.x;
					freeSubRectangle.y = freeRectangle.y;
					if(freeRectangle.width>freeRectangle.height){ //column
						freeSubRectangle.width = subArea/freeRectangle.height;
						freeSubRectangle.height = freeRectangle.height;
						column = true;
					} else { //fila
						freeSubRectangle.width = freeRectangle.width;
						freeSubRectangle.height = subArea/freeRectangle.width;
						column = false;
					}
					subWeightList = subWeightList.getNormalizedToSum();
					subRectangleList = this.partitionRectangle(freeSubRectangle, subWeightList);
					worstProportion = this.getHighestRatio(subRectangleList);
					if(proportion<=worstProportion){
						break;
					} else {
						proportion = worstProportion;
					}
				}
				
				if(prevSubRectangleList.length==0){
					rectangleList.push(freeRectangle.clone());
					if(rectangleList.length==nWeights){
						if(!isSortedWeights){
							var newRectangleList = new List();//RectangleList();
							for(i=0; rectangleList[i]!=null; i++){
								newRectangleList[newPositions[i]] = rectangleList[i];
							}
							return newRectangleList;
						}
						return rectangleList;
					}
					index++;
				} else {
					rectangleList = List.fromArray(rectangleList.concat(prevSubRectangleList));//RectangleList
					if(rectangleList.length==nWeights){
						if(!isSortedWeights){
							newRectangleList = new List();//RectangleList
							for(i=0; rectangleList[i]!=null; i++){
								newRectangleList[newPositions[i]] = rectangleList[i];
							}
							return newRectangleList;
						}
						return rectangleList;
					}
					index+=prevSubRectangleList.length;
					lastRectangle = prevSubRectangleList[prevSubRectangleList.length-1];
					if(freeRectangle.width>freeRectangle.height){
						freeRectangle.x = (lastRectangle.width + lastRectangle.x);
						freeRectangle.width-=lastRectangle.width;
					} else {
						freeRectangle.y = (lastRectangle.height+lastRectangle.y);
						freeRectangle.height -= lastRectangle.height;
					}
				}
				i=index-1;
			}
		}
	} else if(nWeights==2){
		subWeightList = newWeightList.clone();
		freeSubRectangle = frame.clone();
		rectangleList = this.partitionRectangle(freeSubRectangle, subWeightList);
	} else {
		rectangleList[0] = frame.clone();
	}
	
	
	if(!isSortedWeights){
		newRectangleList = new List();//RectangleList();//
		for(i=0; rectangleList[i]!=null; i++){
			newRectangleList[newPositions[i]] = rectangleList[i];
		}
		return newRectangleList;
	}
	
	return rectangleList;
}

/**
* partitionRectangle 
* @param {Rectangle} bounds Rectangle
* @param {NumberList} normalizedWeight List
* 
* @return {List} a list of Rectangles
*/
RectangleOperators.partitionRectangle=function(rectangle, normalizedWeightList){
	var area =  rectangle.width*rectangle.height;
	var rectangleList=new List();//RectangleList();
	var freeRectangle = rectangle.clone();
	//trace("??", freeRectangle);
	var areai;
	var i;
	for(i=0; i<normalizedWeightList.length; i++){
		areai = normalizedWeightList[i]*area;
		if(rectangle.width>rectangle.height){
			rectangleList.push(new Rectangle(freeRectangle.x, freeRectangle.y, areai/freeRectangle.height, freeRectangle.height));
			freeRectangle.x+=areai/freeRectangle.height;
		} else {
			rectangleList.push(new Rectangle(freeRectangle.x, freeRectangle.y, freeRectangle.width, areai/freeRectangle.width));
			freeRectangle.y+=areai/freeRectangle.width;
		}
	}
	//trace("            rectangulo, listaRectangulos:", rectangulo, listaRectangulos);
	return rectangleList;
}

//TODO: should be in RectangleListOperators:
/**
* returns the highest ratio from a list of Rectangles
* @param {List} rectangleList a Rectangle List
* 
* @return {Number} highestRatio
*/
RectangleOperators.getHighestRatio=function(rectangleList){
	var highestRatio = 1;
	var rectangle;
	var i;
	for(i=0; i<rectangleList.length; i++){
		rectangle = rectangleList[i];
		highestRatio = Math.max(highestRatio, rectangle.getRatio() );
	}
	return highestRatio;
}
