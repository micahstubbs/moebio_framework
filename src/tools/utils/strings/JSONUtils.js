/**
 *
 * @ignore
 *
 * @classdesc Provides a set of tools that work with JSON.
 *
 * @namespace
 * @category misc
 */
function JSONUtils() {}
export default JSONUtils;

JSONUtils.stringifyAndPrint = function(object) {
  var jsonString = JSON.stringify(object);
  console.log("__________________________________________________________________________________________________________________________________________________________");
  console.log(jsonString);
  console.log("__________________________________________________________________________________________________________________________________________________________");
};

/*
 * This function is not used in the framework.
 * It's used only for GIT / Jenkins tests
 */

 /**
  * @ignore
  */
JSONUtils.dummy2 = function() {
  return null;
};
