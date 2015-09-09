import CountryOperators from 'src/operators/geo/CountryOperators';

/**
 * @classdesc Provides a set of tools that work with {@link countryList|CountryLists}.
 *
 * @namespace
 * @category geo
 */
function CountryListOperators() {}
export default CountryListOperators;


/**
 * @todo write docs
 */
CountryListOperators.getCountryByName = function(countryList, name) {
  var simplifiedName = CountryOperators.getSimplifiedName(name);

  for(var i = 0; countryList[i] != null; i++) {
    if(countryList[i].simplifiedNames.indexOf(simplifiedName) != -1) return countryList[i];
  }

  return null;
};
