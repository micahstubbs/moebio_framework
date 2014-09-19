function StringOperators(){};

StringOperators.ENTER = String.fromCharCode(13);
StringOperators.ENTER2 =  String.fromCharCode(10);
StringOperators.ENTER3 = String.fromCharCode(8232);
		
StringOperators.SPACE =  String.fromCharCode(32);
StringOperators.SPACE2 = String.fromCharCode(160);
		
StringOperators.TAB = "	";
StringOperators.TAB2 =  String.fromCharCode(9);

StringOperators.LINK_REGEX = /(^|\s+)(https*\:\/\/\S+[^\.\s+])/;
StringOperators.MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
StringOperators.STOP_WORDS = StringList.fromArray("t,s,mt,rt,re,m,http,amp,a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your".split(","));

/**
 * splits a String by a character (entre by default)
 * @param  {String} string
 * 
 * @param  {String} character
 * @return {StringList}
 * tags:
 */
StringOperators.split = function(string, character){
	if(character==null) return StringOperators.splitByEnter(string);
	return StringList.fromArray(string.split(character));
}


/**
 * return a substring
 * @param  {String} string
 * 
 * @param  {Number} i0 init index
 * @param  {Number} length of ths substring (if null returns substring from i0 to the end)
 * @return {String}
 * tags:filter
 */
StringOperators.substr = function(string, i0, length){
	i0 = i0||0;
	return string.substr(i0, length);
}

/**
 * split a String by a separator (a String) and returns a StringList
 * @param  {String} string
 * 
 * @param  {String} separator
 * @return {StringList}
 * tags:
 */
StringOperators.splitString=function(string, separator){
	if(string==null) return null;
	if(separator==null) separator=",";
	if(typeof separator == "string") separator = separator.replace("\\n", "\n");
	if(string.indexOf(separator)==-1) return new StringList(string);
	return StringList.fromArray(string.split(separator));
}

/**
 * split a String by enter (using several codifications)
 * @param  {String} string
 * @return {StringList}
 * tags:
 */
StringOperators.splitByEnter=function(string){
	if(string==null) return null;
	var stringList = StringOperators.splitString(string, "\n");
	if(stringList.length>1) return stringList;
	var stringList = StringOperators.splitString(string, StringOperators.ENTER2);
	if(stringList.length>1) return stringList;
	var stringList = StringOperators.splitString(string, StringOperators.ENTER3);
	if(stringList.length>1) return stringList;
	return null;
}

/**
 * searches for two Strings within a String and returns the String in between
 * @param  {String} text
 * @param  {String} subString0
 * 
 * @param  {String} subString1 if null returns the text after subString0
 * @return {String}
 * tags:filter
 */
StringOperators.getFirstTextBetweenStrings=function(text, subString0, subString1){
	var i0 = text.indexOf(subString0);
	if(i0==-1) return null;
	if(subString1=="" || subString1==null) return text.substr(i0+subString0.length);
	var i1= text.indexOf(subString1, i0+subString0.length+1);
	if(i1==-1) return text.substring(i0+subString0.length);
	return text.substr(i0+subString0.length,i1 - (i0+subString0.length));
}

/**
 * searches all the Strings contained between two Strings in a String
 * @param  {String} text
 * @param  {String} subString0
 * @param  {String} subString1
 * @return {StringList}
 * tags:filter
 */
StringOperators.getAllTextsBetweenStrings=function(text, subString0, subString1){//TODO: improve using indexOf(string, START_INDEX)
	if(text.indexOf(subString0)==-1) return new StringList();
	var blocks = text.split(subString0);
	var nBlocks = blocks.length;
	var stringList = new StringList();
	var block;
	var index;
	var i;
	for(i=1; i<nBlocks; i++){
		block = blocks[i];
		if(subString1==subString0){
			stringList.push(block);
		} else {
			index = block.indexOf(subString1);
			if(index>=0){
				stringList.push(block.substr(0, index));
			}
		}
	}
	return stringList;
}

/**
 * associates a value to each text in a StringList, according to number of words containg in each StringList; one lists pushes to negative values, the other to positive. A classic use would be a primitive sentimental analisis using a list of positive adjectives and a list of negative ones
 * @param  {String} string to be analized
 * @param  {StringList} negativeStrings list of 'negative' words
 * @param  {StringList} positiveStrings list of 'positive' words
 * 
 * @param  {Boolean} normalizeBySize divide score by the string size
 * @return {Number}
 * tags:analysis
 */
StringOperators.countWordsDichotomyAnalysis=function(string, negativeStrings, positiveStrings, normalizeBySize){
	var val = 0;
	negativeStrings.forEach(function(word){val-=StringOperators.countWordOccurrences(string, word)});
	positiveStrings.forEach(function(word){val+=StringOperators.countWordOccurrences(string, word)});
	if(normalizeBySize) val/=string.length;
	return val;
}


/**
 * creates a list of urls contained in the html in <a> tags
 * @param  {String} html to be analyzied
 *
 * @param {String} urlSource optional, if provided will be used to build complete urls
 * @param {Boolean} removeHash if true removes the hastag (anchor) content of the url
 * @return {StringList} list of urls
 * tags:html
 */
StringOperators.getLinksFromHtml=function(html, urlSource, removeHash){
	//var rawHTML = '<html><body><a href="foo">bar</a><a href="narf">zort</a></body></html>';

	var doc = document.createElement("html");
	doc.innerHTML = html;

	//return doc.links;//StringList.fromArray(doc.links);


	var i;
	var links = doc.getElementsByTagName("a");
	var originalUrl, url;
	var urls = new StringList();
	var index;
	var urlSourceParts;
	var parts,blocks;

	urlSource = urlSource==""?null:urlSource;
	removeHash = removeHash==null?false:removeHash;

	if(urlSource){
		urlSource = urlSource.trim();
		
		if(urlSource.substr(-5)==".html"){
			urlSourceParts = urlSource.split("/");
			urlSource = urlSourceParts.slice(0, urlSourceParts.length-1).join("/");
		}
		if(urlSource.indexOf(-1)=="/") urlSource = urlSource.substr(0, urlSource.length-1);
		urlSourceParts = urlSource.split("/");

		var root = urlSource.replace("//", "**").split("/")[0].replace("**", "//");
	}


	for(i=0; i<links.length; i++){
		originalUrl = url = links[i].getAttribute("href");
		if(url==null) continue;

		if(url.indexOf('=')!=-1) url = url.split('=')[0];

		//c.log(url);
		if(urlSource && url.indexOf('http://')==-1 && url.indexOf('https://')==-1 && url.indexOf('wwww.')==-1 && url.indexOf('file:')==-1 && url.indexOf('gopher:')==-1 && url.indexOf('//')!=0){
			if(url.substr(0,9)=="../../../"){
				url = urlSourceParts.slice(0, urlSourceParts.length-3).join("/")+"/"+url.substr(9);
			} else if(url.substr(0,6)=="../../"){
				url = urlSourceParts.slice(0, urlSourceParts.length-2).join("/")+"/"+url.substr(6);
			} else if(url.substr(0,3)=="../"){
				url = urlSourceParts.slice(0, urlSourceParts.length-1).join("/")+"/"+url.substr(3);
			} else if(url.charAt(0)=="/"){
				url = root+url;
			} else {
				url = urlSource+"/"+url;
			}
		}
		if(removeHash && url.indexOf("#")!=-1) url = url.split('#')[0];
		if(url.substr(-1)=="/") url = url.substr(0,url.length-1);

		index = url.indexOf('/../');
		while(index!=-1){
			blocks = url.split('/../');
			parts = blocks[0].replace("//", "**").split("/");
			url = parts.slice(0, parts.length-1).join("/").replace("**", "//")+("/"+blocks.slice(1).join("/../"));
			index = url.indexOf('/../');
		}

		if(url.indexOf('./')!=-1){
			parts = url.replace("//", "**").split("/");
			if(parts[0].substr(-1)=="."){
				parts[0] = parts[0].substr(0, parts[0].length-1);
				url = parts.join('/').replace("**", "//");
			}
		}

		url = url.trim();

		if(url.substr(-1)=="/") url = url.substr(0, url.length-1);

		if(url==urlSource) continue;
		//c.log(urlSource+' | '+originalUrl+' -> '+url);
	    urls.push(url);
	}

	urls = urls.getWithoutRepetitions();

	return urls;
}


/**
 * validates is string contains another string, as string or word (space or punctuation boundaries)
 * @param {String} text string to be validated
 * @param {String} string string or word to be searched
 * 
 * @param {Boolean} asWord if true a word will be searched (false by default)
 * @param {Boolean} caseSensitive (false by default)
 * @return {Boolean} returns true if string or word is contained
 */
StringOperators.textContainsString = function(text, string, asWord, caseSensitive){
	text = caseSensitive?string:text.toLowerCase();
	string = caseSensitive?string:string.toLowerCase();
	return asWord?
		text.match(new RegExp("\\b"+string+"\\b")).length>0
		:
		text.indexOf(string)!=-1;
}

/**
 * print a string in console
 * @param  {String} string to be printed in console
 * @param  {Boolean} frame  if true (default) prints ///////////////// on top and bottom
 * tags:
 */
StringOperators.logInConsole = function(string, frame){
	frame = frame==null?true:frame;
	if(frame) c.log('///////////////////////////////////////////////////');
	c.log(string);
	if(frame) c.log('///////////////////////////////////////////////////');
}




//////


StringOperators.getParenthesisContents=function(text, brackets){
	var contents = new StringList();
	
	var subText=text; 
	
	var contentObject = StringOperators.getFirstParenthesisContentWithIndexes(text, brackets);
	
	var nAttempts = 0;
	while(contentObject.content!="" && contentObject.index1<subText.length-1 && nAttempts<text.length){
		contents.push(contentObject.content);
		subText = subText.substr(contentObject.index1+2);
		contentObject = StringOperators.getFirstParenthesisContentWithIndexes(subText, brackets);
		nAttempts++;
	}
	
	return contents;
}
StringOperators.getFirstParenthesisContent=function(text, brackets){
	return StringOperators.getFirstParenthesisContentWithIndexes(text, brackets).content;
}
StringOperators.getFirstParenthesisContentWithIndexes=function(text, brackets){
	var open  = brackets?"[":"(";
	var close = brackets?"]":")";
	
	var openRegEx  = brackets?/\[/g:/\(/g;
	var closeRegEx = brackets?/\]/g:/\)/g;
	
	var indexOpen = text.indexOf(open);
	
	if(indexOpen==-1) return {
		"content":"",
		"index0":0,
		"index1":0
	}
	
	var indexClose = text.indexOf(close);
	
	var part = text.substring(indexOpen+1, indexClose);
	
	var openMatch  = part.match(openRegEx);
	var closeMatch = part.match(closeRegEx);
	
	var nOpen = (openMatch==null?0:openMatch.length) - (closeMatch==null?0:closeMatch.length);
	var nAttempts = 0;
	
	
	while((nOpen>0 || indexClose==-1) && nAttempts<text.length){
		indexClose = text.indexOf(close, indexClose);
		part = text.substring(indexOpen+1, indexClose+1);
		indexClose++;
		openMatch  = part.match(openRegEx);
		closeMatch = part.match(closeRegEx);
		nOpen = (openMatch==null?0:openMatch.length) - (closeMatch==null?0:closeMatch.length);
		
		nAttempts++;
	}
	indexClose = text.indexOf(close, indexClose);

	return { 
		"content":indexClose==-1?text.substring(indexOpen+1):text.substring(indexOpen+1, indexClose),
		"index0":indexOpen+1,
		"index1":indexClose==-1?(text.length-1):(indexClose-1)
	};
}

StringOperators.placeString=function(string, stringToPlace, index){
	return string.substr(0,index)+stringToPlace+string.substr(index+stringToPlace.length);
}

StringOperators.insertString=function(string, stringToInsert, index){
	return string.substr(0,index)+stringToInsert+string.substr(index);
}

StringOperators.removeEnters=function(string){
	return string.replace(/(\StringOperators.ENTER|\StringOperators.ENTER2|\StringOperators.ENTER3)/gi, " ");
}

StringOperators.removeTabs=function(string){
	return string.replace(/(\StringOperators.TAB|\StringOperators.TAB2|\t)/gi, "");
}

StringOperators.removePunctuation=function(string, replaceBy){
	replaceBy = replaceBy || "";
	return string.replace(/[:,.;?!\(\)\"\']/gi, replaceBy);
}

StringOperators.removeDoubleSpaces=function(string){
	var retString=string;
	var regExpr=RegExp(/  /);
	while(regExpr.test(retString)){
		retString=retString.replace(regExpr, " ");
	}
	return retString;
}

StringOperators.removeInitialRepeatedCharacter=function(string, character){
	while(string.charAt(0)==character) string = string.substr(1);
	return string;
}

StringOperators.removeHtmlTags=function(html){
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	return tmp.textContent||tmp.innerText;
}

StringOperators.removeLinks=function(text){
	text+=' ';
	var regexp = /http:\/\/[a-zA-Z0-9\/\.]+( |:|;|\r|\t|\n|\v)/g;
	return (text.replace(regexp, ' ')).substr(0, text.length-2);
}

StringOperators.removeQuotes=function(string){//TODO:improve
	if(string.charAt(0)=="\"") string = string.substr(1);
	if(string.charAt(string.length-1)=="\"") string = string.substr(0, string.length-1);
	return string;
}

// StringOperators.trim = function(string){
// 	return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
// }

/**
 * builds a stringList of words contained in the text
 * @param  {String} string text to be analyzed
 * 
 * @param  {Boolean} withoutRepetitions remove words repetitions
 * @param  {Boolean} stopWords remove stop words
 * @param  {Boolean} sortedByFrequency  sorted by frequency in text
 * @param  {Boolean} includeLinks include html links
 * @param  {Number} limit of words
 * @param  {Number} minSizeWords minimal number of characters of words
 * @return {StringList}
 * tags:
 */
StringOperators.getWords = function(string, withoutRepetitions, stopWords, sortedByFrequency, includeLinks, limit, minSizeWords){
	minSizeWords = minSizeWords||0;
	withoutRepetitions = withoutRepetitions==null?true:withoutRepetitions;
	sortedByFrequency = sortedByFrequency==null?true:sortedByFrequency;
	includeLinks = includeLinks==null?true:includeLinks;
	limit = limit==null?0:limit;
	
	if(includeLinks) var links = string.match(StringOperators.LINK_REGEX);
	string = string.toLowerCase().replace(StringOperators.LINK_REGEX, "");
	
	var list = string.match(/\w+/g);
	if(list==null) return new StringList();
	
	if(includeLinks && links!=null) list = list.concat(links);
	list = StringList.fromArray(list).replace(/ /g, "");
	
	if(stopWords!=null){
		//list.removeElements(stopWords);
		var i, j;
		for(i=0; list[i]!=null; i++){
			for(j=0; stopWords[j]!=null; j++){
				if((typeof stopWords[j]) == 'string'){
					if(stopWords[j]==list[i]){
						list.splice(i, 1);
						i--;
						break;
					}
				} else if(stopWords[j].test(list[i])){
					list.splice(i, 1);
					i--;
					break;
				}
			}
		}
	}
	
	if(minSizeWords>0){
		for(var i=0; list[i]!=null; i++){
			if(list[i].length<minSizeWords){
				list.removeElementAtIndex(i);
				i--;
			}
		}
	}
	
	if(sortedByFrequency){
		if(withoutRepetitions){
			list = ListOperators.countElementsRepetitionOnList(list, true)[0]
			if(limit!=0) list = list.substr(0, limit);

			return list;
		}
		
		var occurrences = ListOperators.countOccurrencesOnList(list);
		list = list.getSortedByList(occurrences);
		if(limit!=0) list = list.substr(0, limit);

		return list;
	}
	
	if(withoutRepetitions){
		list = list.getWithoutRepetitions();
	}
	
	if(limit!=0) list = list.splice(0, limit);
	return list;
}

/**
 * creates a table with frequent words and occurrences numbers
 * @param  {String} string text to be analyzed
 * @param  {StringList} stopWords
 * @param  {Bollean} includeLinks
 * @param  {Number} limit max size of rows
 * @param  {Number} minSizeWords
 * @return {Table} contains a list of words, and a numberList of occurrences
 */
StringOperators.getWordsOccurrencesTable = function(string, stopWords, includeLinks, limit, minSizeWords){
	if(string.length==0) return new Table(new StringList(), new NumberList());
	var words = StringOperators.getWords(string, false, stopWords, false, includeLinks, limit, minSizeWords);

	return ListOperators.countElementsRepetitionOnList(words, true, false, limit);
}

StringOperators.indexesOf = function(text, string){//TODO:test
	var index = text.indexOf(string);
	if(index==-1) return new NumberList();
	var indexes = new NumberList(index);
	index = text.indexOf(string, index+1);
	while(index!=-1){
		indexes.push(index);
		index = text.indexOf(string, index+1);
	}
	return indexes;
}



//counting / statistics

StringOperators.countOccurrences=function(text, string){ //seems to be th emost efficient: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
	var n=0;
	var index = text.indexOf(string);
	while(index!=-1){
		n++;
		index = text.indexOf(string, index+string.length);
	}
	return n;
}

StringOperators.countWordOccurrences = function(string, word){
	var regex = new RegExp("\\b"+word+"\\b");
	var match = string.match(regex);
	return match==null?0:match.length;
}

StringOperators.countStringsOccurrences=function(text, strings){
	var i;
	var numberList = new NumberList();
	for(i=0; strings[i]!=null; i++){
		numberList[i] = text.split(strings[i]).length-1;
	}
	return numberList;
}

//validation

StringOperators.validateEmail = function(text) { 
    return StringOperators.MAIL_REGEX.test(text);
}
StringOperators.validateUrl = function(text) { 
    return StringOperators.LINK_REGEX.test(text);
}
