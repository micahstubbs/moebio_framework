/**
 * @classdesc StringUtils
 *
 * @namespace
 * @category strings
 */
function StringUtils() {}


StringUtils.stringtoXML = function(text) {
  if(window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.async = 'false';
    doc.loadXML(text);
  } else {
    var parser = new DOMParser();
    var doc = parser.parseFromString(text, 'text/xml');
  }
  return doc;
};
