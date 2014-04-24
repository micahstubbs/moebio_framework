/**
* ConsoleTools
* some of the methods available here might be converted into genuine 'ASCII visualization'
* * @constructor
*/

function ConsoleTools(){}

ConsoleTools.NumberTableOnConsole=function(table){
	var message = "";
	var line;
	var number;
	var i;
	var j;
	c.log(table);
	for(j=0;j<table[0].length; j++){
		line = "|"; 
		for(i=0;table[i]!=null; i++){
			number = String(Math.floor(100*table[i][j])/100).replace(/0./, ".");
			while(number.length<3) number = " "+number;
			line+=number+"|";
		}
		message+=line+"\n";
	}
	c.log(message);
	return message;
}

