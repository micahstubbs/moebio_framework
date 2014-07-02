function NumberListOperators(){};



/**
 * cosine similarity, used to compare two NumberLists regardless of norm (see: http://en.wikipedia.org/wiki/Cosine_similarity)
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.cosineSimilarity=function(numberList0, numberList1){
	var norms = numberList0.getNorm()*numberList1.getNorm();
	if(norms==0) return 0;
	return numberList0.dotProduct(numberList1)/norms;
}

/**
 * 
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.covariance=function(numberList0, numberList1){//TODO: improve efficiency
	var l = Math.min(numberList0.length, numberList1.length);
	var i;
	var av0 = numberList0.getAverage();
	var av1 = numberList1.getAverage();
	var s = 0;
	
	for(i=0; i<l; i++){
		s+= (numberList0[i] - av0)*(numberList1[i] - av1);
	}
	
	return s/l;
}


NumberListOperators.standardDeviationBetweenTwoNumberLists=function(numberList0, numberList1){
	var s = 0;
	var l = Math.min(numberList0.length, numberList1.length);
	
	for(var i=0; i<l; i++){
		s+= Math.pow(numberList0[i] - numberList1[i], 2);
	}
	
	return s/l;
}

/**
 * returns Pearson Product Moment Correlation, the most common correlation coefficient ( covariance/(standard_deviation0*standard_deviation1) )
 * @param  {NumberList} numberList0
 * @param  {NumberList} numberList1
 * @return {Number}
 * tags:statistics
 */
NumberListOperators.pearsonProductMomentCorrelation=function(numberList0, numberList1){//TODO:make more efficient
	return NumberListOperators.covariance(numberList0, numberList1)/(numberList0.getStandardDeviation()*numberList1.getStandardDeviation());
}


/**
 * smooth a numberList by calculating averages with neighbors
 * @param  {NumberList} numberList
 * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
 * @param  {Number} nIterations number of ieterations
 * @return {NumberList}
 * tags:statistics
 */
NumberListOperators.averageSmoother = function(numberList, intensity, nIterations){
	nIterations = nIterations==null?1:nIterations;
	intensity = intensity==null?0.1:intensity;

	intensity = Math.max(Math.min(intensity, 0.5), 0);
	var anti = 1 - 2*intensity;
	var n = numberList.length-1;

	var newNumberList = new NumberList();
	var i;

	newNumberList.name = numberList.name;
	
	for(i=0; i<nIterations; i++){
		if(i==0){
			numberList.forEach(function(val, i){
				newNumberList[i] = anti*val +  (i>0?(numberList[i-1]*intensity):0) + (i<n?(numberList[i+1]*intensity):0);
			});
		} else {
			newNumberList.forEach(function(val, i){
				newNumberList[i] = anti*val +  (i>0?(newNumberList[i-1]*intensity):0) + (i<n?(newNumberList[i+1]*intensity):0);
			});
		}
	}

	return newNumberList;
}


/**
 * accepted comparison operators: "<", "<=", ">", ">=", "==", "!="
 */
NumberListOperators.filterNumberListByNumber=function(numberList, value, comparisonOperator, returnIndexes){
	returnIndexes = returnIndexes || false;
	var newNumberList = new NumberList();
	var i;
	
	if(returnIndexes){
		switch(comparisonOperator){
			case "<":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]<value){
						newNumberList.push(i);
					}
				}
				break;
			case "<=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]<=value){
						newNumberList.push(i);
					}
				}
				break;
			case ">":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]>value){
						newNumberList.push(i);
					}
				}
				break;
			case ">=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]>=value){
						newNumberList.push(i);
					}
				}
				break;
			case "==":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]==value){
						newNumberList.push(i);
					}
				}
				break;
			case "!=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]!=value){
						newNumberList.push(i);
					}
				}
				break;
		}
		
	} else {
		switch(comparisonOperator){
			case "<":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]<value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
			case "<=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]<=value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
			case ">":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]>value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
			case ">=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]>=value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
			case "==":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]==value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
			case "!=":
				for(i=0;numberList[i]!=null;i++){
					if(numberList[i]!=value){
						newNumberList.push(numberList[i]);
					}
				}
				break;
		}
	}
	
	return newNumberList;
}


