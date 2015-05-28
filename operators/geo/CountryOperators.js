/**
 * CountryOperators
 * @constructor
 */
function CountryOperators() {};

CountryOperators.getSimplifiedName = function(name) {
  return name.replace(/[\.\- ,\']/g, "").toLowerCase();
}
CountryOperators.getSimplifiedNames = function(names) {
  var simplifiedNames = new StringList();
  var name;
  for(var i = 0; names[i] != null; i++) {
    name = this.getSimplifiedName(names[i]);
    if(name != "") simplifiedNames.pushIfUnique(name);
  }
  return simplifiedNames;
}