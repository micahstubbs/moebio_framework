/**
 * @classdesc Provides a set of tools that work with JSON.
 *
 * @namespace
 * @category misc
 */
function JSONUtils() {}


JSONUtils.stringifyAndPrint = function(object) {
  var jsonString = JSON.stringify(object);
  c.log("__________________________________________________________________________________________________________________________________________________________");
  c.log(jsonString);
  c.log("__________________________________________________________________________________________________________________________________________________________");
};

/**
 * This function is not used in the framework.
 * It's used only for GIT / Jenkins tests
 */
JSONUtils.dummy2 = function() {
  return null;
};
