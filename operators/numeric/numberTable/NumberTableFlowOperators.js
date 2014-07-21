function NumberTableFlowOperators(){};

NumberTableFlowOperators.getFlowTable=function(numberTable, normalized, include0s){
	normalized = normalized || false;
	var nElements = numberTable.length;
	var nRows = numberTable[0].length;
	var numberList;
	var minList = new NumberList();
	var maxList = new NumberList();
	var sums = new NumberList();
	var minInRow;
	var maxInRow;
	var sumInRow;
	var MAX = -9999999;
	var MIN = 9999999;
	var MAXSUMS = -9999999;
	var i, j;
	for(i=0; i<nRows; i++){
		minInRow = 9999999; //TODO: what's the max Number?
		maxInRow = -9999999;
		sumInRow = 0;
		for(j=0; j<nElements; j++){
			numberList = numberTable[j];
			if(numberList.length!=nRows) return;
			
			maxInRow = Math.max(maxInRow, numberList[i]);
			minInRow = Math.min(minInRow, numberList[i]);
			sumInRow += numberList[i];
		}
		minList.push(minInRow);
		maxList.push(maxInRow);
		sums.push(sumInRow);
		MIN = Math.min(MIN, minInRow);
		MAX = Math.max(MAX, maxInRow);
		MAXSUMS = Math.max(MAXSUMS, sumInRow);
	}

	var dMINMAX = MAXSUMS-MIN;
	var flowTable = new NumberTable();
	var flowNumberList;
	var minToNormalize;
	var maxToNormalize;
	
	var include0Add = include0s?1:0;
	

	if(normalized && include0s){
		var max;

		flowTable = new NumberTable(numberTable.length+1);

		numberTable[0].forEach(function(){
			flowTable[0].push(0);
		});

		numberTable.forEach(function(list, iList){
			list.forEach(function(val, j){
				sum = sums[j];
				flowTable[iList+1][j] = val/(sum==0?0.00001:sum) + flowTable[iList][j];
			});
		});
		
		return flowTable;
	}

	flowTable = new NumberTable();

	if(!normalized){
		minToNormalize = MIN;
		maxToNormalize = dMINMAX;
	} else {
		minToNormalize = Math.max(MIN, 0);
	}
	for(i=0; i<nElements; i++){
		flowNumberList = new NumberList();
		flowTable.push(flowNumberList);
	}
	if(include0s) flowTable.push(new NumberList());

	for(i=0; i<nRows; i++){
		numberList = numberTable[0];
		if(normalized){
			maxToNormalize = sums[i]-minToNormalize;
		}
		if(include0s){
			flowTable[0][i]=0;
		}
		if(maxToNormalize==0) maxToNormalize=0.00001;
		flowTable[include0Add][i]=(numberList[i]-minToNormalize)/maxToNormalize;
		for(j=1; j<nElements; j++){
			numberList = numberTable[j];
			flowTable[j+include0Add][i] = ((numberList[i]-minToNormalize)/maxToNormalize) + flowTable[j-1+include0Add][i];
		}
	}
	return flowTable;
}

NumberTableFlowOperators.getFlowTableIntervals=function(numberTable, normalized, sorted, stacked){
	var table = NumberTableFlowOperators.getFlowTable(numberTable, normalized, true);

	var intervalTable = new Table();
	var i, j;
	
	var nElements = table.length;
	var nRows = table[0].length;
	
	var intervalList;
	
	var maxCols = new NumberList();
	
	for(i=1; i<nElements; i++){
		numberList = table[i];
		intervalList = new List();
		intervalTable[i-1] = intervalList;
		for(j=0;j<nRows;j++){
			intervalList.push(new Interval(table[i-1][j], table[i][j]));
			if(i==nElements-1) maxCols[j] = table[i][j];
		}
		
	}
	
	if(sorted){
		var amplitudes;
		var interval;
		var yy;
		for(j=0; j<nRows; j++){
			amplitudes = new NumberList();
			intervalList = intervalTable[i];
			for(i=0;i<nElements-1;i++){
				amplitudes.push(intervalTable[i][j].getAmplitude());
			}
			var indexes = amplitudes.getSortIndexes();
			
			yy = (normalized || stacked)?0:(1-maxCols[j])*0.5;
			
			for(i=0;i<nElements-1;i++){
				interval = intervalTable[indexes[i]][j];
				interval.y = yy + interval.getAmplitude();
				interval.x = yy;
				yy = interval.y;
			}
		}
	} else if(!normalized){
		for(j=0; j<nRows; j++){
			for(i=0;i<nElements-1;i++){
				interval = intervalTable[i][j];
				if(stacked){
					intervalTable[i][j].x = 1 - intervalTable[i][j].x;
					intervalTable[i][j].y = 1 - intervalTable[i][j].y;
				} else {
					intervalTable[i][j] = interval.add((1-maxCols[j])*0.5);
				}
				
			}
		}
	}
	
	return intervalTable;
}


