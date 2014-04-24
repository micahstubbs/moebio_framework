Country.prototype = new Node();
Country.prototype.constructor=Country;

/**
* Country
* @param {String} country id (ISO2)
* @param {String} country name
* @constructor
*/
function Country(id, name){
	Node.apply(this, [id, name]);
	this.type="Country";
	
	this.id = id;
	this.name = name;
	
	this.shortName;
	
	this.continentName;
	this.isoCode;
	this.alternativeNames;
	this.wikipediaUrl;
	this.flagImageUrl;
	this.smallFlagImageUrl;
	this.recognized = false;
	this.geoCenter;
	
	this.polygonList;
	this.simplePolygonList;
	
	this.longestPolygon;
	this.longestSimplePolygon;
	
	this._simplifiedNames;
	this._simplifiedId;
	this._simplifiedName;
	
	this._frame;
}

Country.prototype.generatesSimplifiedNames = function(){
	this._simplifiedNames = CountryOperators.getSimplifiedNames(this.alternativeNames);
	this._simplifiedId = CountryOperators.getSimplifiedName(this.id);
	this._simplifiedName = CountryOperators.getSimplifiedName(this.name);
	this.shortName = this.name
		.replace('Democratic Republic', 'D.R.')
		.replace('United States', 'U.S.A')
		.replace('United Arab', 'U.A.');
}

Country.prototype.nameMatches = function(name){
	if(this._simplifiedId==null) this.generatesSimplifiedNames();
	name = CountryOperators.getSimplifiedName(name);
	if(name==this._simplifiedId || name==this._simplifiedName) return true;
	return this._simplifiedNames.indexOf(name)!=-1;
}

Country.prototype.getFrame = function(){
	if(this._frame==null){
		this._frame = this.simplePolygonList==null?this.polygonList.getFrame():this.simplePolygonList.getFrame();
	}
	return this._frame;
}
