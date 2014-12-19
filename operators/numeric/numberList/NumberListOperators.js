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
 * calculates the covariance
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

/**
 * calculates k-means clusters of values in a numberList
 * @param  {NumberList} numberList
 * @param  {Number} k number of clusters
 *
 * @param {Boolean} returnIndexes return clusters of indexes rather than values (false by default)
 * @return {NumberTable} numberLists each being a cluster
 * tags:ds
 */
NumberListOperators.linearKMeans=function(numberList, k, returnIndexes){
	if(numberList==null || k==null || !k>0) return null;

	c.l('numberList:', numberList);

	var interval = numberList.getInterval();

	c.l('interval:', interval);

	var min = interval.x;
	var max = interval.y;
	//var means = new NumberList();
	var clusters = new NumberTable();
	var i, j;
	var jK;
	var x;
	var dX = (max-min)/k;
	var d;
	var dMin
	var n;
	var actualMean;
	var N = 1000;
	var means = new NumberList();
	var nextMeans = new NumberList();
	var nValuesInCluster = new NumberList();

	var initdMin = 1+max-min;

	for(i=0; i<k; i++){
		clusters[i] = new NumberList();
		//clusters[i].actualMean = min + (i+0.5)*dX;//means[i];
		nextMeans[i] = min + (i+0.5)*dX;
	}

	for(n=0; n<N; n++){

		//c.l('-------'+n);

		for(i=0; i<k; i++){
			//actualMean = means[i];//clusters[i].actualMean;
			//c.l(' ', i, nextMeans[i]);
			//clusters[i] = new NumberList();
			//clusters[i].mean = actualMean;
			//clusters[i].actualMean = 0;
			nValuesInCluster[i] = 0;
			means[i] = nextMeans[i];
			nextMeans[i] = 0;
		}
		
		for(i=0; numberList[i]!=null; i++){
			x = numberList[i];
			dMin = initdMin;
			jK = 0;
			
			for(j=0; j<k; j++){
				//d = Math.abs(x-clusters[j].mean);
				d = Math.abs(x-means[j]);
				//c.l('   d', d);
				if(d<dMin){
					dMin = d;
					jK = j;
				}
			}
			//c.l('    ', x,'-->',jK, 'with mean', clusters[jK].mean);
			if(n==N-1){
				//c.l('jK, clusters[jK]', jK, clusters[jK]);
				returnIndexes?clusters[jK].push(i):clusters[jK].push(x);
			}

			nValuesInCluster[jK]++;
			
			//clusters[jK].actualMean = ( (clusters[jK].length-1)*clusters[jK].actualMean + x )/clusters[jK].length;
			nextMeans[jK] = ( (nValuesInCluster[jK]-1)*nextMeans[jK] + x )/nValuesInCluster[jK];
		}
		//if(n%50==0) c.l(n+' --> ' + nValuesInCluster.join(',')+"|"+means.join(','));
	}

	return clusters;

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

	newNumberList.name = numberList.name;

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

/**
 * creates a NumberList that contains the union of two NumberList (removing repetitions)
 * @param  {NumberList} list A
 * @param  {NumberList} list B
 * 
 * @return {NumberList} the union of both NumberLists
 * tags:
 */
NumberListOperators.union = function (x, y) { 
  // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i)
     obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; -- i)
     obj[y[i]] = y[i];
  var res = new NumberList();
  for (var k in obj) {
    if (obj.hasOwnProperty(k))  // <-- optional
      res.push(obj[k]);
  }
  return res;
}

/**
 * creates a NumberList that contains the intersection of two NumberList (elements present in BOTH lists)
 * @param  {NumberList} list A
 * @param  {NumberList} list B
 * 
 * @return {NumberList} the intersection of both NumberLists
 * tags:
 */
NumberListOperators.intersection = function ( a, b ) {
  // Borrowed from here: http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
  var result = new NumberList();
  	 a = a.slice();
  	 b = b.slice();
  while( a.length > 0 && b.length > 0 )
  {  
     if      (a[0] < b[0] ){ a.shift(); }
     else if (a[0] > b[0] ){ b.shift(); }
     else /* they're equal */
     {
       result.push(a.shift());
       b.shift();
     }
  }

  return result;
}
