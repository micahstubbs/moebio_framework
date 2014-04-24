LoadDeliciousTagsFromWebsite.prototype.constructor=LoadDeliciousTagsFromWebsite;

/**
* LoadDeliciousTagsFromWebsite serach website delicious visits page (http://www.visualisingdata.com/ --> http://delicious.com/url/2788c3877af9f0716240d07dd91ed07f )
* and reads tags used by users
* the result is a Table with tags and numbers
* @constructor
*/
function LoadDeliciousTagsFromWebsite(warnFunction){
	this._warnFunction = warnFunction;
	this._multiLoader;
	
	this._url;
	
	this._urlList;
	this._modifiedUrlList;
	this._tablesList;
	this._tableMerged;
	this.normalizeEach;
	
	this.maxNumberOfTags;
	
	this.tagsToRemove = new StringList("imported");
}

LoadDeliciousTagsFromWebsite.prototype.search=function(url){
	var deliciousUrl = LoadDeliciousTagsFromWebsite.deliciousPageUrl(url);
	Loader.loadData(deliciousUrl, this.onComplete, this);
}

LoadDeliciousTagsFromWebsite.deliciousPageUrl=function(url){
	if(url.indexOf(".")==-1) return  "http://delicious.com/url/"+url;
	if(url.charAt(url.length-1)!="/") url = url+"/";
	this._url = this.adaptUrl(url);
	return "http://delicious.com/url/"+MD5.hex_md5(url);
}

LoadDeliciousTagsFromWebsite.adaptUrl=function(url){
	var newUrl = url;
	if(newUrl.substr(0,3)=="www") newUrl = "http://"+newUrl;
	//if(newUrl.substr(0,7)=="http://" && newUrl.substr(0,11)!="http://www.") newUrl = "http://www."+newUrl.substr(7);
	//if(newUrl.substr(0,8)=="https://" && newUrl.substr(0,12)!="https://www.") newUrl = "https://www."+newUrl.substr(8);
	if(newUrl.charAt(newUrl.length-1)!="/") newUrl = newUrl+"/";
	return newUrl;
}


LoadDeliciousTagsFromWebsite.prototype.onComplete=function(e){
	var tags = StringOperators.allTextsBetweenStrings(e.result, "class=\"tag \" title=\"", "\"");
	var table = ListOperators.countElementsRepetitionOnList(tags);
	
	this._warnFunction(table);
}

LoadDeliciousTagsFromWebsite.prototype.searchMultiple=function(urlList, normalizeEach, maxNumberOfTags){
	this._urlList = new StringList();
	this._modifiedUrlList = new StringList();
	
	this.normalizeEach = normalizeEach;
	
	this.maxNumberOfTags = maxNumberOfTags;
	
	var i;
	for(i=0;urlList[i]!=null;i++){
		this._urlList[i] = LoadDeliciousTagsFromWebsite.adaptUrl(urlList[i]);
		this._modifiedUrlList[i] = LoadDeliciousTagsFromWebsite.deliciousPageUrl(urlList[i]);//  "http://delicious.com/url/"+MD5.hex_md5(this._urlList[i]);
		//c.log(this._urlList[i]+" > "+this._modifiedUrlList[i]);
	}
	
	this._tablesList = new List();
	
	this._multiLoader = new MultiLoader();
	this._multiLoader.loadDatas(this._modifiedUrlList, this.onCompleteMulti, this);
}

LoadDeliciousTagsFromWebsite.prototype.onCompleteMulti=function(e){
	var last = e.result[e.result.length-1];
	var tags = StringOperators.allTextsBetweenStrings(last, "class=\"tag \" title=\"", "\"");
	if(tags==null) tags = new StringList();
	tags = tags.toLowerCase();
	tags.removeElements(this.tagsToRemove);
	var table = ListOperators.countElementsRepetitionOnList(tags);
	
	
	if(this._tableMerged==null){
		this._tableMerged = table.clone();
	} else {
		this._tableMerged = TableOperators.mergeDataTables(this._tableMerged, table);
	}
	
	c.log("•", this._tableMerged.length+"/"+(this._urlList.length+1))
	c.log("this._tableMerged[0].length", this._tableMerged[0].length);
	
	if(this._tableMerged.length==this._urlList.length+1){
		if(this.normalizeEach){
			var i;
			for(i=1;this._tableMerged[i]!=null;i++){
				this._tableMerged[i]=this._tableMerged[i].getNormalizedToMax();
			}
		}
		
		var numberTable = this._tableMerged.getSubList(new Interval(1, this._tableMerged.length-1));
		
		var rowsSums = numberTable.getRowsSums();
		c.log("rowsSums", rowsSums);
		this._tableMerged = this._tableMerged.sortListsByList(rowsSums);
		
		if(this.maxNumberOfTags!=null) this._tableMerged = this._tableMerged.sliceRows(0, this.maxNumberOfTags);
		
		this._warnFunction(this._tableMerged);
	}
}
