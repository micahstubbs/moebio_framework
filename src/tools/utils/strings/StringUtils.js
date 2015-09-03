/**
 * @classdesc StringUtils
 *
 * @namespace
 * @category strings
 */
function StringUtils() {}
export default StringUtils;

/**
 * @todo write docs
 */
StringUtils.stringtoXML = function(text) {
  var doc;
  if(window.ActiveXObject) {
    doc = new window.ActiveXObject('Microsoft.XMLDOM');
    doc.async = 'false';
    doc.loadXML(text);
  } else {
    var parser = new DOMParser();
    doc = parser.parseFromString(text, 'text/xml');
  }
  return doc;
};
