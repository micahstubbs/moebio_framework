RemarkableWordsApi.EN_WORDS_FREQUENCY_PATH = './resources/english_10Kwords_freq.csv';
RemarkableWordsApi.ES_WORDS_FREQUENCY_PATH = './resources/english_10Kwords_freq.csv'; //TODO:build spanish table

function RemarkableWordsApi(configuration) {
	this.onComplete = configuration.warnFunction;
	this.target = configuration.target;
	
	this.esFrequencyTable;
	this.enFrequencyTable;
	
	this.text=configuration.text==null?'':configuration.text;
	this.language='en';
	this.removeWords;
	this.removeTwitterAccounts;
	
	this.table;
	this.minR;
	this.maxR;
}

RemarkableWordsApi.prototype.startLoading=function(language){
	switch(this.language){
		case 'es':
			if(this.esFrequencyTable==null){
				Loader.loadData(RemarkableWordsApi.ES_WORDS_FREQUENCY_PATH, this.onLoadWords, this);
			}
		default:
			if(this.enFrequencyTable==null){
				Loader.loadData(RemarkableWordsApi.EN_WORDS_FREQUENCY_PATH, this.onLoadWords, this);
			}
	}
}
RemarkableWordsApi.prototype.calculate=function(text, language, removeWords, removeTwitterAccounts){
	this.text = text;
	this.language = language==null?'en':language;
	this.removeWords = removeWords;
	this.removeTwitterAccounts = removeTwitterAccounts;
	if((this.language=='es' && this.esFrequencyTable==null) || (this.language=='en' && this.enFrequencyTable==null)) return null;
	return this.executeCalculus(true);
}

RemarkableWordsApi.prototype.returnWordsFrequencies=function(texts, language){
	var values = new NumberList();
	var index;
	var table = language=='es'?this.esFrequencyTable:this.enFrequencyTable;
	
	for(var i=0; texts[i]!=null; i++){
		index = table[0].indexOf(texts[i]);
		values[i] = index==-1?30:table[1][index];
	}
	
	return values;
}


RemarkableWordsApi.prototype.loadAndCalculate=function(text, language){
	this.text = text;
	this.language = language==null?'en':language;
	
	switch(this.language){
		case 'es':
			if(this.esFrequencyTable==null){
				Loader.loadData(RemarkableWordsApi.ES_WORDS_FREQUENCY_PATH, this.onLoadWords, this);
			} else {
				this.executeCalculus();
			}
		default:
			if(this.enFrequencyTable==null){
				Loader.loadData(RemarkableWordsApi.EN_WORDS_FREQUENCY_PATH, this.onLoadWords, this);
			} else {
				this.executeCalculus();
			}
	}
}

RemarkableWordsApi.prototype.onLoadWords=function(e){
	
	switch(this.language){
		case 'es':
			this.esFrequencyTable = TableEncodings.CSVtoTable(e.result, false);
			break;
		default:
			this.enFrequencyTable = TableEncodings.CSVtoTable(e.result, false);
			break;
	}
	
	c.log('this.enFrequencyTable', this.enFrequencyTable);
	
	this.executeCalculus();
	//if(this.onComplete!=null) this.onComplete.call(this.target);
}

RemarkableWordsApi.prototype.executeCalculus=function(returnImmediately){
	returnImmediately = returnImmediately==null?false:returnImmediately;
	
	var modifiedText = this.text.replace(/  /g, " ").toLowerCase();
	//var wordsList = StringList.fromArray(modifiedText.split(/[ .,;:!?()\/\-–'"…\[\]\n\t*]/g));
	
	var wordsList = (modifiedText==null || modifiedText.length==0)?new StringList():StringList.fromArray(modifiedText.match(/\w+/g));
	
	var i;
	wordsList.removeElement('');
	wordsList.removeElement('&amp');
	if(this.removeWords!=null){
		for(i=0;this.removeWords[i]!=null;i++){
			wordsList.removeElement(this.removeWords[i].toLowerCase());
		}
	}
	
	if(this.removeTwitterAccounts){
		for(i=0; wordsList[i]!=null; i++){
			if(wordsList[i].substr(0,1)=="@"){
				wordsList.splice(i, 1);
				i--;
			}
		}
	}
	
	nWords = wordsList.length;
	var countTable = ListOperators.countElementsRepetitionOnList(wordsList, true);
	var freqTable;
	
	var N_TOTAL;
	
	switch(this.language){
		case 'es':
			freqTable = this.esFrequencyTable;
			N_TOTAL = 10000000;
			break;
		default:
			freqTable = this.enFrequencyTable;
			N_TOTAL = 10000000;
			break;
	}
	
	this.table = new Table();
	this.table[0] = countTable[0];
	this.table[1] = countTable[1];
	var freqList = new NumberList();
	this.table[2] = freqList;
	var rList = new NumberList();
	this.table[3] = rList;
	
	var word;
	var indexF;
	var r;
	
	this.minR = 999999999;
	this.maxR = 0;
	
	
	
	for(i=0;countTable[0][i]!=null;i++){
		word = countTable[0][i];
		indexF = freqTable[0].indexOf(word);
		freqList[i] = indexF!=-1?freqTable[1][indexF]:30;
		rList[i] = (countTable[1][i]/nWords)/(freqList[i]/N_TOTAL);
		this.minR = Math.min(rList[i], this.minR);
		this.maxR = Math.max(rList[i], this.maxR);
	}
	
	
	this.table = TableOperators.sortListsByNumberList(this.table, rList);
	
	this.table[0].name = 'words';
	this.table[1].name = 'frequency text';
	this.table[2].name = 'frequency corpus';
	this.table[3].name = 'remarkability';
	
	if(returnImmediately){
		return this.table;
	} else {
		if(this.onComplete!=null) this.onComplete.call(this.target, this.table);
	}
}


RemarkableWordsApi.prototype.getFreqInCorpus=function(word){
	var index = this.table[0].indexOf(word);
	return index==-1?30:this.table[2][index];
}

RemarkableWordsApi.prototype.getFreqInText=function(word){
	var index = this.table[0].indexOf(word);
	return index==-1?0:this.table[1][index];
}

RemarkableWordsApi.prototype.getRemarkability=function(word){
	var index = this.table[0].indexOf(word);
	return index==-1?this.minR:this.table[3][index];
}

RemarkableWordsApi.prototype.destroy = function(){
	delete this.esFrequencyTable;
	delete this.enFrequencyTable;
	delete this.table;
}
