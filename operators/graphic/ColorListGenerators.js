//include(frameworksRoot+"operators/numeric/numberList/NumberListGenerators.js");

/**
* ColorListGenerators
* @constructor
* 
*/
function ColorListGenerators(){};


ColorListGenerators.createColorListFromNumberList=function(numberList, colorScaleFunction, mode){
	mode = mode==null?0:mode;
	
	var colorList = new ColorList();
	var newNumberList;
	
	switch(mode){
		case 0://0 to max
			newNumberList = numberList.getNormalizedToMax();
			break;
		case 1://min to max
			break;
		case 2://values between 0 and 1
			break;
	}
	
	for(var i=0; newNumberList[i]!=null; i++){
		colorList.push(colorScaleFunction(newNumberList[i]));
	}
	return colorList;
}


ColorListGenerators.createColorListWithSingleColor=function(nColors, color){
	var colorList = new ColorList();
	for(var i=0; i<nColors; i++){
		colorList.push(color);
	}
	return colorList;
}


/**
 * Creates a ColorList of categorical colors
 * @param {Number} mode 0:simple picking from color scale function, 1:random (with seed), 2:, 3:, 4:, 5:evolutionary algorithm, guarantees non consecutive similar colors
 * @param {Number} nColors
 * 
 * @param {Function} colorScaleFunction
 * @param {Number} alpha transparency
 * ®return {ColorList} ColorList with categorical colors
 * tags:
 */
ColorListGenerators.createCategoricalColors=function(mode, nColors, colorScaleFunction, alpha){
	colorScaleFunction = colorScaleFunction==null?ColorScales.temperature:colorScaleFunction;
	
	var i;
	var colorList = new ColorList();
	switch(mode){
		case 0: //picking from ColorScale
			for(i=0;i<nColors;i++){
				colorList[i] = colorScaleFunction(i/(nColors-1));
			}
			break;
		case 1: //seeded random numbers
			var values = NumberListGenerators.createRandomNumberList(nColors, null, 0)
			for(i=0;i<nColors;i++){
				colorList[i] = colorScaleFunction(values[i]);
			}
			break;
		case 5:
			var randomNumbersSource = NumberListGenerators.createRandomNumberList(1001, null, 0);
			var positions = NumberListGenerators.createSortedNumberList(nColors);
			var randomNumbers = NumberListGenerators.createRandomNumberList(nColors, null, 0);
			var randomPositions = ListOperators.sortListByNumberList(positions, randomNumbers);
	
			var nGenerations = Math.floor(nColors*2)+100;
			var nChildren = Math.floor(nColors*0.6)+5;
			var bestEvaluation = ColorListGenerators._evaluationFunction(randomPositions);
			var child;
			var bestChildren = randomPositions;
			var j;
			var nr=0;
			var evaluation;
			
			for(i=0;i<nGenerations;i++){
				for(j=0;j<nChildren;j++){
					child = ColorListGenerators._sortingVariation(randomPositions, randomNumbersSource[nr], randomNumbersSource[nr+1]);
					nr = (nr+2)%1001;
					evaluation = ColorListGenerators._evaluationFunction(child);
					if(evaluation>bestEvaluation){
						bestChildren = child;
						bestEvaluation = evaluation;
					}
				}
				randomPositions = bestChildren;
			}
			
			for(i=0; i<nColors; i++){
				colorList.push(colorScaleFunction((1/nColors) + randomPositions[i]/(nColors+1))); //TODO: make more efficient by pre-nuilding the colorList
			}
			break;
	}

	if(alpha){
		colorList.forEach(function(color, i){
			colorList[i] = ColorOperators.addAlpha(color, alpha);
		});
	}
	
	return colorList;
}

ColorListGenerators._sortingVariation=function(numberList, rnd0, rnd1){ //private
	var newNumberList = numberList.clone();
	var pos0 = Math.floor(rnd0*newNumberList.length);
	var pos1 = Math.floor(rnd1*newNumberList.length);
	var cache = newNumberList[pos1];
	newNumberList[pos1] = newNumberList[pos0];
	newNumberList[pos0] = cache;
	return newNumberList;
}
ColorListGenerators._evaluationFunction=function(numberList){ //private
	var sum=0;
	var i;
	for(i=0; numberList[i+1]!=null; i++){
		sum+=Math.sqrt(Math.abs(numberList[i+1]-numberList[i]));
	}
	return sum;
}