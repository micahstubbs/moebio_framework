WikipediaArticlesApi.prototype.constructor=WikipediaArticlesApi;

WikipediaArticlesApi.types = new Object();
WikipediaArticlesApi.types.NORMAL = "normal";
WikipediaArticlesApi.types.LINK_HERE = "link here";
WikipediaArticlesApi.types.LIST = "list";

function WikipediaArticlesApi(configuration){
	this._warnFunction = configuration.warnFunction;
	this.target = configuration.target;
	this.language = configuration.language==null?'en':configuration.language;
	
	this.nLoaded = 0;
	this.nToLoad = 0;
	this.listArticles;
}

WikipediaArticlesApi.prototype.loadArticle=function(title){
	this.title = title;
	c.log("[w] load article:"+this.title+" | url:"+"http://"+this.language+".wikipedia.org/w/index.php?action=render&title="+title);
	Loader.loadData("http://"+this.language+".wikipedia.org/w/index.php?action=render&title="+title, this.onComplete, this);
}

WikipediaArticlesApi.prototype.loadArticlesThatLinkToArticle=function(title, nMax){
	this.title = 'links to '+title;
	nMax = nMax==null?500:nMax;
	c.log("[w] load article containing articles that link to:"+this.title);
	Loader.loadData("http://"+this.language+".wikipedia.org/w/index.php?action=render&title=Special:WhatLinksHere/"+title+"&limit="+nMax, this.onComplete, this);
}


WikipediaArticlesApi.prototype.onComplete=function(e){
	c.log('article loaded');
	var article = this.buildArticle(this.title, e.url, e.result);
	this._warnFunction.call(this.target, article);
}



//articles

WikipediaArticlesApi.prototype.loadArticles=function(titles){
	this.titles = titles;
	this.listArticles = new List();
	this.nLoaded = 0;
	this.nToLoad = titles.length;
	this.loadNextArticle();
}

WikipediaArticlesApi.prototype.loadNextArticle=function(){
	this.title = this.titles[this.nLoaded];
	c.log("[w] loading "+this.nLoaded+"/"+this.nToLoad, 'next: '+this.title);
	Loader.loadData("http://"+this.language+".wikipedia.org/w/index.php?action=render&title="+this.title, this.onCompleteFromMany, this);
}

WikipediaArticlesApi.prototype.onCompleteFromMany=function(e){
	this.listArticles.push(this.buildArticle(this.title, e.url, e.result));
	
	this.nLoaded++;
	
	if(this.titles[this.nLoaded]==null){
		this._warnFunction.call(this.target, this.listArticles);
	} else {
		this.loadNextArticle();
	}
}


//

WikipediaArticlesApi.prototype.buildArticle=function(title, url, text){
	var article = new Object();
	
	article.title = title;
	article.cleanTitle = WikipediaArticlesOperators.cleanTitle(title);
	article.url = url;
	article.text = text;
	article.plainText = StringOperators.removeHtmlTags(text);
	article.length = text.length;
	
	article.type = url.indexOf("WhatLinksHere")!=-1?
						WikipediaArticlesApi.types.LINK_HERE:url.indexOf("List_of")!=-1?
							WikipediaArticlesApi.types.LIST:WikipediaArticlesApi.types.NORMAL;
	
	var table = WikipediaArticlesApi.buildTable(text);
	
	if(article.type==WikipediaArticlesApi.types.LINK_HERE){
		article.linksTo = article.title.substr("links to ".length);
		for(var i=0; table[0][i]!=null; i++){
			if(table[0][i]==article.linksTo || table[0][i]=="Main_Page"){
				table[0].splice(i, 1);
				i--;
			}
		}
	}
	
	article.textLinks = table[0];
	article.seeAlsoLinks = table[1];
	article.externalLinks = table[2];
	article.internalLinks = article.textLinks.concat(article.seeAlsoLinks);
	
	return article;
}


WikipediaArticlesApi.buildTable=function(article){
	var table = WikipediaArticlesOperators.getLinksTableFromArticle(article);
	
	for(var i=0; table[0][i]!=null; i++){
		if(table[0][i].indexOf(":")!=-1){
			table[0].splice(i, 1);
			i--;
		}
	}
	for(i=0; table[1][i]!=null; i++){
		if(table[1][i].indexOf(":")!=-1){
			table[1].splice(i, 1);
			i--;
		}
	}
	for(i=0; table[2][i]!=null; i++){
		if(table[2][i].indexOf(":")!=-1){
			table[2].splice(i, 1);
			i--;
		}
	}

	return table;
}
