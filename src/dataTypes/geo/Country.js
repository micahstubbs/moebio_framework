import Node from 'src/dataTypes/structures/elements/Node';
import CountryOperators from 'src/operators/geo/CountryOperators';

Country.prototype = new Node();
Country.prototype.constructor = Country;

/**
 * @classdesc Represents an individual country for visualization and spatial
 * reasoning.
 *
* @description Creates a new Country instance.
 * @param {String} id Country id (ISO2)
 * @param {String} name Country name
 * @constructor
 * @category geo
 */
function Country(id, name) {
  Node.apply(this, [id, name]);
  this.type = "Country";

  this.id = id;
  this.name = name;

  this.shortName = undefined;

  this.continentName = undefined;
  this.isoCode = undefined;
  this.alternativeNames = undefined;
  this.wikipediaUrl = undefined;
  this.flagImageUrl = undefined;
  this.smallFlagImageUrl = undefined;
  this.recognized = false;
  this.geoCenter = undefined;

  this.polygonList = undefined;
  this.simplePolygonList = undefined;

  this.longestPolygon = undefined;
  this.longestSimplePolygon = undefined;

  this._simplifiedNames = undefined;
  this._simplifiedId = undefined;
  this._simplifiedName = undefined;

  this._frame = undefined;
}
export default Country;

/**
* @todo write docs
*/
Country.prototype.generatesSimplifiedNames = function() {
  this._simplifiedNames = CountryOperators.getSimplifiedNames(this.alternativeNames);
  this._simplifiedId = CountryOperators.getSimplifiedName(this.id);
  this._simplifiedName = CountryOperators.getSimplifiedName(this.name);
  this.shortName = this.name
    .replace('Democratic Republic', 'D.R.')
    .replace('United States', 'U.S.A')
    .replace('United Arab', 'U.A.');
};

/**
* @todo write docs
*/
Country.prototype.nameMatches = function(name) {
  if(this._simplifiedId == null) this.generatesSimplifiedNames();
  name = CountryOperators.getSimplifiedName(name);
  if(name == this._simplifiedId || name == this._simplifiedName) return true;
  return this._simplifiedNames.indexOf(name) != -1;
};

/**
* @todo write docs
*/
Country.prototype.getFrame = function() {
  if(this._frame == null) {
    this._frame = this.simplePolygonList == null ? this.polygonList.getFrame() : this.simplePolygonList.getFrame();
  }
  return this._frame;
};
