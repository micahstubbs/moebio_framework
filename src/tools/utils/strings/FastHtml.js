import StringOperators from "src/operators/strings/StringOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";

/**
 * @classdesc Fast Html
 *
 * @namespace
 * @category basics
 */
function FastHtml() {}
export default FastHtml;

/**
 * @todo write docs
 */
FastHtml.expand = function(abreviatedHTML, scope, onEvent) {
  if(abreviatedHTML == null || abreviatedHTML == "") return "";

  var T = new Date().getTime();

  if(abreviatedHTML.split("<").length != abreviatedHTML.split(">").length) return abreviatedHTML;

  var newText = abreviatedHTML;
  if(newText.indexOf("<fs")!=-1){
    var bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<fs", ">"); //OperacionesString.textEntreSubStrings(newText, "<fs", ">");
      if(bit != null) newText = newText.replace("<fs" + bit + ">", "<font style=\"font-size:" + Number(bit) + "px\">");
      if(newText.indexOf(">") == -1) bit = null;
    }
  }

  bit = "";
  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<ff", ">");
    if(bit != null) newText = newText.replace("<ff" + bit + ">", "<font face=\"" + bit + "\">");
  }

  newText = newText.replace(/¬/, "<br/>");
  newText = newText.replace(/<fcBlack>/g, "<font color=\"#000000\">");
  newText = newText.replace(/<fcWhite>/g, "<font color=\"#FFFFFF\">");
  newText = newText.replace(/<fcRed>/g, "<font color=\"#FF0000\">");
  newText = newText.replace(/<fcGreen>/g, "<font color=\"#00FF00\">");
  newText = newText.replace(/<fcBlue>/g, "<font color=\"#0000FF\">");
  newText = newText.replace(/<fcOrange>/g, "<font color=\"#FFAA00\">");

  newText = newText.replace(/<fcCyan>/g, "<font color=\"#00FFFF\">");
  newText = newText.replace(/<fcYellow>/g, "<font color=\"#FFFF00\">");
  newText = newText.replace(/<fcMagenta>/g, "<font color=\"#FF00FF\">");

  bit = "";
  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<fcuint", ">");
    if(bit != null) newText = newText.replace("<fcuint" + bit + ">", "<font color=\"" + ColorOperators.uinttoHEX(bit) + "\">");
  }

  bit = "";
  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<frgb", ">");
    if(bit != null) {
      var rgb = bit.split(".");
      newText = newText.replace("<frgb" + bit + ">", "<font color=\"" + ColorOperators.RGBtoHEX(Number(rgb[0]), Number(rgb[1]), Number(rgb[2])) + "\">");
    }
  }

  if(newText.indexOf("<fc")!=-1){
    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<fc", ">");
      if(bit != null){
        //var newbit = bit[0];// == "#"?bit.substr(1):bit;
        newText = newText.replace("<fc" + bit + ">", "<font color=\"#" + bit + "\">");
      }
    }
  }

  bit = "";
  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<tl", ">");
    if(bit != null) newText = newText.replace("<tl" + bit + ">", "<textformat leftmargin=\"" + bit + "\">");
  }

  bit = "";
  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<tv", ">");
    if(bit != null) newText = newText.replace("<tv" + bit + ">", "<textformat leading=\"" + bit + "\">");
  }


  bit = "";
  var href;
  var text;
  var target;


  while(bit != null) {
    bit = StringOperators.getFirstTextBetweenStrings(newText, "<e", ">");
    if(bit != null) {
      href = bit.split("*")[0];
      text = bit.split("*")[1];
      if(bit.split("*").length > 2 && bit.split("*")[2] == "s") {
        target = "_self";
      } else {
        target = "_blank";
      }
      if(href.substr(0, 7) == "http://" ||  href.substr(0, 8) == "https://") {
        newText = newText.replace("<e" + bit + ">", "<u><a href='" + href + "' target='" + target + "'>" + text + "</a></u>");
      } else {
        newText = newText.replace("<e" + bit + ">", "<u><a href='javascript:FastHtml.clickLink(\"" + href + "\")' FastHtml.onclick='event.preventDefault(); clickLink(\"" + href + "\"); return false; '>" + text + "</a></u>");
      }
    }
  }


  newText = newText.replace(/<pl>/g, "<p align=\"left\">");
  newText = newText.replace(/<pc>/g, "<p align=\"center\">");
  newText = newText.replace(/<pr>/g, "<p align=\"right\">");
  newText = newText.replace(/<pj>/g, "<p align=\"justify\">");
  newText = newText.replace(/<\/f>/g, "</font>");
  newText = newText.replace(/<\/t>/g, "</textformat>");

  // c.log("/////////FastHtml convertion////////");
  // c.log(newText);
  // c.log("////////////////////////////////////");

  return newText;
};

/**
 * @todo write docs
 */
FastHtml.clickLink = function(param) {
  FastHtml.linkFunction.call(FastHtml.target, param);
};

/**
 * @todo write docs
 */
FastHtml.findAndPlaceLinks = function(text) {
  var newText = FastHtml._findAndPlaceLinksPrefix(text, "http");
  return FastHtml._findAndPlaceLinksPrefix(newText, "https");
};

/**
 * @ignore
 */
FastHtml._findAndPlaceLinksPrefix = function(text, prefix) {
  var regexp = prefix == 'http' ? /http:\/\//g : /https:\/\//g;
  var blocks = text.split(regexp);

  if(blocks.length > 1) {
    var blocks2 = [];
    var indexS;
    var url;

    blocks2[0] = blocks[0];

    for(var i = 1; blocks[i] != null; i++) {
      indexS = blocks[i].search(/ |:|;/);
      if(indexS > -1) {
        url = prefix + '://' + blocks[i].substr(0, indexS);
        blocks2[i] = '<e' + url + '*' + url + '>' + blocks[i].substr(indexS);
      } else {
        url = prefix + '://' + blocks[i].substr(0);
        blocks2[i] = '<e' + url + '*' + url + '>';
      }
    }
  }
  return(blocks.length == 0 || blocks.length == 1) ? text : blocks2.join('');
};

/**
 * @todo write docs
 */
FastHtml.findAndPlaceTwitterAdresses = function(text) {
  var blocks = text.split(/@/g);

  if(blocks.length > 1) {
    var blocks2 = [];
    var indexS;
    var url;
    var accountName;

    blocks2[0] = blocks[0];

    for(var i = 1; blocks[i] != null; i++) {
      indexS = blocks[i].search(/ |:|;/);
      if(indexS > -1) {
        accountName = blocks[i].substr(0, indexS);
        url = 'https://twitter.com/' + accountName;
        blocks2[i] = '<e' + url + '*@' + accountName + '>' + blocks[i].substr(indexS);
      } else {
        accountName = blocks[i].substr(0);
        url = 'https://twitter.com/' + accountName;
        blocks2[i] = '<e' + url + '*@' + accountName + '>';
      }
    }
  }

  return(blocks.length == 0 || blocks.length == 1) ? text : blocks2.join('');
};

/**
 * @todo write docs
 */
FastHtml.getColorTag = function(color) {
  color = ColorOperators.colorStringToHEX(color);
  return "<font color=\"" + color + "\">";
};
