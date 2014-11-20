DateOperators.millisecondsToHours = 1/(1000*60*60);
DateOperators.millisecondsToDays = 1/(1000*60*60*24);
DateOperators.millisecondsToYears = 0.00000000003169;

DateOperators.MONTH_NAMES_SHORT = ['jan','feb','mar','apr','mai','jun','jul','aug','sep','oct','nov','dec'];
/**
* DateOperators
* @constructor
*/
function DateOperators(){};


/**
 * format cases
 * 0: MM-DD-YYYY
 * 1: YYYY-MM-DD
 * 2: MM-DD-YY
 * 3: YY-MM-DD
 */
DateOperators.stringToDate=function(string, formatCase, separator){
	separator = separator==null?"-":separator;
	formatCase = formatCase==null?0:formatCase;
	
	var y;
	
	var parts = string.split(separator);
	switch(formatCase){
		case 0://MM-DD-YYYY
			return new Date(Number(parts[2]), Number(parts[0])-1, Number(parts[1]));
			break;
		case 1://YYYY-MM-DD
			return new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
			break;
		case 2://MM-DD-YY
			y = Number(parts[2]);
			y = y>=0?y+2000:y+1900;
			return new Date(y, Number(parts[0])-1, Number(parts[1]));
			break;
		case 3://YY-MM-DD
			y = Number(parts[0]);
			y = y>=0?y+2000:y+1900;
			return new Date(y, Number(parts[1])-1, Number(parts[2]));
			break;
	}
}

/**
 * format cases
 * 0: MM-DD-YYYY
 * 1: YYYY-MM-DD
 */
DateOperators.dateToString=function(date, formatCase, separator){
	separator = separator==null?"-":separator;
	formatCase = formatCase==null?0:formatCase;
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	
	switch(formatCase){
		case 0://MM-DD-YYYY
			return month+separator+day+separator+year;
			break;
		case 1://YYYY-MM-DD
			return year+separator+month+separator+day;
			break;
	}
}

/**
 * generates current date Date
 * @return {Date}
 * tags:generate
 */
DateOperators.currentDate = function(){
	return new Date();
}

DateOperators.addDaysToDate=function(date, nDays){
	return new Date(date.getTime()+(nDays/DateOperators.millisecondsToDays));
}


DateOperators.parseDate=function(string){
	return new Date(Date.parse(string.replace(/\./g,"-")));
}

DateOperators.parseDates=function(stringList){
	var dateList = new DateList();
	var i;
	for(i=0;stringList[i]!=null;i++){
		dateList.push(this.parseDate(stringList[i]));
	}
	return dateList;
}

DateOperators.getHoursBetweenDates=function(date0, date1){
	return (date1.getTime() - date0.getTime())*DateOperators.millisecondsToHours;
}
DateOperators.getDaysBetweenDates=function(date0, date1){
	return (date1.getTime() - date0.getTime())*DateOperators.millisecondsToDays;
}
DateOperators.getYearsBetweenDates=function(date0, date1){
	return (date1.getTime() - date0.getTime())*DateOperators.millisecondsToYears;
}

DateOperators.nDayInYear=function(date){
	return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime())*DateOperators.millisecondsToDays);
}

DateOperators.getDateDaysAgo=function(nDays){
	return DateOperators.addDaysToDate(new Date(), -nDays);
}


/**
 * gets the week number within a year (weeks start on Sunday, first week may have less than 7 days if start in a day other than sunday
 * @param {Date} The date whose week you want to retrieve
 * @return {Number} The week number of the date in its year
 * tags:generate
 */
DateOperators.getWeekInYear=function(date){
	var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

