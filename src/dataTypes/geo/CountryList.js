import NodeList from 'src/dataTypes/structures/lists/NodeList';
import PolygonOperators from 'src/operators/geometry/PolygonOperators';

CountryList.prototype = new NodeList();
CountryList.prototype.constructor = CountryList;

/**
 * @classdesc A {@link List} structure for storing {@link Country|Countries}.
 *
 * Additional functions that work on CountryList can be found in:
 * <ul>
 *  <li>Operators:   {@link CountryListOperators}</li>
 * </ul>
 *
 * @description Creates a new CountryList instance.
 * @constructor
 * @category geo
 */
function CountryList() {
  var array = NodeList.apply(this, arguments);
  //
  array.name = "";
  //assign methods to array:
  array = CountryList.fromArray(array);
  //
  return array;
}
export default CountryList;

/**
* @todo write docs
*/
CountryList.fromArray = function(array) {
  var result = NodeList.fromArray(array);
  result.type = "CountryList";
  //assign methods to array:
  result.getCountryFromName = CountryList.prototype.getCountryFromName;
  //transformative
  result.removeAntarctica = CountryList.prototype.removeAntarctica;
  result.removeTinyPolygonsFromCountries = CountryList.prototype.removeTinyPolygonsFromCountries;
  result.removeTinyCountries = CountryList.prototype.removeTinyCountries;
  result.simplifyAntarctica = CountryList.prototype.simplifyAntarctica;
  result.assignValuesToCountriesFromTable = CountryList.prototype.assignValuesToCountriesFromTable;
  result.simplifyPolygons = CountryList.prototype.simplifyPolygons;
  return result;
};

/**
 * each country has several names to try a match
 * ISO id is allowed
 */
CountryList.prototype.getCountryFromName = function(countryName) {
  for(var i = 0; this[i] != null; i++) {
    if(this[i].nameMatches(countryName)) return this[i];
  }
  return null;
};


//transformative

/**
* @todo write docs
*/
CountryList.prototype.removeAntarctica = function() {
  this.removeNode(this.getNodeById('AQ'));
};

/**
* @todo write docs
*/
CountryList.prototype.removeTinyPolygonsFromCountries = function(minArea) {
  minArea = 0.2 || minArea;
  var country;
  var j;

  for(var i = 0; this[i] != null; i++) {
    country = this[i];
    for(j = 0; country.polygonList[j] != null; j++) {
      if(country.polygonList[j].getFrame().getArea() < minArea) {
        country.polygonList.splice(j, 1);
        j--;
      }
    }

  }
};

/**
* @todo write docs
*/
CountryList.prototype.removeTinyCountries = function(minArea) {
  minArea = 0.5 || minArea;
  var country;
  var j;
  var small;
  for(var i = 0; this[i] != null; i++) {
    country = this[i];

    small = true;
    for(j = 0; country.polygonList[j] != null; j++) {
      if(country.polygonList[j].getFrame().getArea() > minArea) {
        small = false;
        break;
      }
    }

    if(small) {
      this.removeNode(this[i]);
      i--;
    }
  }
};

/**
* @todo write docs
*/
CountryList.prototype.simplifyPolygons = function(margin) {
  var country;
  var j;
  var maxPL, jMax;

  for(var i = 0; this[i] != null; i++) {
    country = this[i];
    maxPL = 0;
    for(j = 0; country.polygonList[j] != null; j++) {
      country.polygonList[j] = PolygonOperators.simplifyPolygon(country.polygonList[j], margin);
      if(country.polygonList[j].length < 3) {
        country.polygonList.splice(j, 1);
        j--;
      } else {
        if(country.polygonList[j].length > maxPL) {
          maxPL = country.polygonList[j].length;
          jMax = j;
        }
      }
    }
    country.longestPolygon.destroy();
    country.longestPolygon = country.polygonList[jMax];
  }
};

/**
 * in 2D representations Antarctiva requires 2 extra points, placed on global geo grame corners
 * this method removes them (suitable for 3D representations)
 */
CountryList.prototype.simplifyAntarctica = function() {
  var polygonList = this.getNodeById('AQ').simplePolygonList;
  if(polygonList != null) {
    polygonList[0].splice(10, 1);
    polygonList[0].splice(10, 1);
  }
  polygonList = this.getNodeById('AQ').polygonList;
  if(polygonList != null) {
    //TODO: remove last two points
  }
};

/**
* @todo write docs
*/
CountryList.prototype.assignValuesToCountriesFromTable = function(table, valueToNull) {
  var j;
  var country;
  for(var i = 0; table[0][i] != null; i++) {
    country = this.getCountryFromName(table[0][i]);
    if(country != null) {
      for(j = 1; table[j] != null; j++) {
        country[table[j].name] = table[j][i] == valueToNull ? null : table[j][i];
      }
    }
  }
};
