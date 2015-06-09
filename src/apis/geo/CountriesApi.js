CountriesApi.COUNTRIES_INFO_PATH = './resources/countriesInfo.csv';
CountriesApi.SIMPLE_POLYGONS_PATH = './resources/countriesSimplePolygons.csv';
CountriesApi.POLYGONS_PATH = './resources/countriesPolygons.csv';

CountriesApi.continentsNames = ['Asia', 'Africa', 'North America, Central America and The Caribbean', 'South America', '', 'Europe', 'Australasia'];

function CountriesApi() {
  this.callee;
  this.simple;
  this.complex;

  this._countryList;

  this.onComplete;

  this.simpleLoaded = false;
  this.complexLoaded = false;
}

/**
 * starts loading info
 * @param {Function} function that will be triggered once info is loaded, this function will be called passing the list of countries
 * @param {Boolean} simple to load simple polygons (13K)
 * @param {Boolean} complex to load more complex polygons (360K)
 * 
 */
CountriesApi.prototype.loadAndBuild = function(onComplete, callee, simple, complex) {
  this.callee = callee;
  this.simple = simple;
  this.complex = complex;
  this.onComplete = onComplete;
  Loader.loadData(CountriesApi.COUNTRIES_INFO_PATH, this.loadedInfo, this);
};


CountriesApi.prototype.loadedInfo = function(e) {
  c.log("CountriesApi.loadedInfo", e);

  var table = TableEncodings.CSVtoTable(e.result, false);

  c.log("table", table);

  table = table.getTransposed();


  this._countryList = new CountryList();

  //Name,continent_number,ISO_CODE-2,ISO_CODE-3,?,wikipedia_title,alternatine_name0;alternative_name1;…,center_long,center_lat
  //in wikipedia article title * means that the title is the name (with "_" replacing " ")

  var country;
  var list;
  for(var i = 0; table[i] != null; i++) {
    list = table[i];
    country = new Country(list[2], list[0]);
    country.isoCode = country.id;
    country.recognized = true;
    country.continentName = CountriesApi.continentsNames[list[1]];
    country.wikipediaUrl = "http://en.wikipedia.org/wiki/" + (list[5] == "*" ? country.name : list[5]);
    if(list[6] == 0) list[6] = "";
    country.alternativeNames = StringList.fromArray(list[6].split(";"));
    country.geoCenter = new Point(Number(list[7]), Number(list[8]));
    this._countryList.addNode(country);
  }


  if(this.simple) Loader.loadData(CountriesApi.SIMPLE_POLYGONS_PATH, this.loadedPolygons, this);
  if(this.complex) Loader.loadData(CountriesApi.POLYGONS_PATH, this.loadedPolygons, this);
  if(!this.simple && !this.complex) this.onComplete.call(this.callee, this._countryList);
};


CountriesApi.prototype.loadedPolygons = function(e) {
  c.log("CountriesApi.loadedPolygons", e);

  var simple = (e.url == CountriesApi.SIMPLE_POLYGONS_PATH);

  if(simple) {
    this.simpleLoaded = true;
  } else {
    this.complexLoaded = true;
  }

  var polygonsTable = TableEncodings.CSVtoTable(e.result, false);

  var id;
  for(var i = 0; polygonsTable[0][i] != null; i++) {
    id = polygonsTable[0][i].toUpperCase();
    country = this._countryList.getNodeById(id);
    if(simple) {
      country.simplePolygonList = this.buildPolygons(polygonsTable[1][i]);
      if(country.id == "AF") {
        c.log(polygonsTable[1][i]);
        c.log("AF polygon -->", country.simplePolygonList[0]);
      }
      country.longestSimplePolygon = country.simplePolygonList.longest;
    } else {
      country.polygonList = this.buildPolygons(polygonsTable[1][i]);
      country.longestPolygon = country.polygonList.longest;
    }
  }

  var complete = !((this.simple && !this.simpleLoaded) || (this.complex && !this.complexLoaded));

  if(complete) this.onComplete.call(this.callee, this._countryList);
};

CountriesApi.prototype.buildPolygons = function(polygonsText) {
  if(polygonsText == 0 || polygonsText == '') return new PolygonList();
  var polygonsTexts = polygonsText.split("*");
  var pairs;
  var pair;

  var polygonList = new PolygonList();
  polygonList.longest = new Polygon();
  var polygon;
  var refPoint;

  for(var i = 0; polygonsTexts[i] != null; i++) {
    pairs = polygonsTexts[i].split(" ");
    polygon = new Polygon();
    polygonList[i] = polygon;
    pair = pairs[0].split(",");
    refPoint = new Point(Number(pair[0]), Number(pair[1]));
    polygon[0] = refPoint;
    for(var j = 1; pairs[j] != null; j++) {
      pair = pairs[j].split(",");
      polygon[j] = new Point(Number(pair[0]) + refPoint.x, Number(pair[1]) + refPoint.y);
    }
    if(polygon.length > polygonList.longest.length) polygonList.longest = polygon;
  }

  return polygonList;
};