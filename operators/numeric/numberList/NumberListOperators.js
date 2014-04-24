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


