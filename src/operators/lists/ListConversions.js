import StringOperators from "src/operators/strings/StringOperators";
import ListOperators from "src/operators/lists/ListOperators";
import NumberList from "src/dataStructures/numeric/NumberList";
import ColorOperators from "src/operators/graphic/ColorOperators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import StringList from "src/dataStructures/strings/StringList";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/**
 * @classdesc List Operators
 *
 * @namespace
 * @category basics
 */
function ListConversions() {}
export default ListConversions;

/**
 * Converts the List into a NumberList.
 *
 * @param  {List} list
 * @return {NumberList}
 * tags:conversion
 */
ListConversions.toNumberList = function(list) {
  var numberList = new NumberList();
  numberList.name = list.name;
  var i;
  for(i = 0; list[i] != null; i++) {
    numberList[i] = Number(list[i]);
  }
  return numberList;
};

/**
 * Converts the List into a StringList.
 *
 * @param  {List} list
 * @return {StringList}
 * tags:conversion
 */
ListConversions.toStringList = function(list) {
  var i;
  var stringList = new StringList();
  stringList.name = list.name;
  for(i = 0; list[i] != null; i++) {
    if(typeof list[i] == 'number') {
      stringList[i] = String(list[i]);
    } else {
      stringList[i] = list[i].toString();
    }
  }
  return stringList;
};

/**
 * returns a string representing list
 *
 * @param  {List} list
 * @param  {Number} level
 *
 */
ListConversions.toReport = function(list, level) { //TODO:complete
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
  var text = level > 0 ? (ident + "////report of instance of List////") : "///////////report of instance of List//////////";

  var length = list.length;
  var i;

  text += ident + "name: " + list.name;
  text += ident + "type: " + list.type;

  if(length === 0) {
    text += ident + "single element: [" + list[0] + "]";
    return text;
  } else {
    text += ident + "length: " + length;
    text += ident + "first element: [" + list[0] + "]";
  }

  switch(list.type) {
    case "NumberList":
      var min = list.getMin();
      var max = list.getMax();
      list.min = min;
      list.max = max;
      var average = list.getAverage();//(min + max) * 0.5;
      list.average = average;
      text += ident + "min: " + min;
      text += ident + "max: " + max;
      text += ident + "average: " + average;
      if(length < 101) {
        text += ident + "numbers: " + list.join(", ");
      }
      break;
      case "StringList":
    case "List":
      var freqTable = list.getFrequenciesTable(true);
      list._freqTable = freqTable;
      text += ident + "number of different elements: " + freqTable[0].length;
      if(freqTable[0].length < 10) {
        text += ident + "elements frequency:";
      } else {
        text += ident + "some elements frequency:";
      }

      for(i = 0; freqTable[0][i] != null && i < 10; i++) {
        text += ident + "  [" + String(freqTable[0][i]) + "]: " + freqTable[1][i];
      }

      var joined;
      if(list.type == "List") {
        joined = list.join("], [");
      } else {
        joined = ListConversions.toStringList(list).join("], [");
      }

      if(joined.length < 2000) text += ident + "strings: [" + joined + "]";
      break;

  }

  ///add ideas to: analyze, visualize


  return text;
};


ListConversions.toReportHtml = function(list, level) { //TODO:complete
  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  var text =  level > 0 ? "" : "<b><font style=\"font-size:18px\">list report</f></b>";

  var length = list.length;
  var i;

  if(list.name){
    text += ident + "name: <b>" + list.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + list.type + "</b>";

  if(length === 0) {
    text += ident + "single element: [<b>" + list[0] + "</b>]";
    return text;
  } else {
    text += ident + "length: <b>" + length + "</b>";
    text += ident + "first element: [<b>" + list[0] + "</b>]";
  }

  switch(list.type) {
    case "NumberList":
      var min = 9999999;
      var max = -9999999;
      var average = 0;
      var shorten = new NumberList();
      var index = 0;
      var accumsum = 0;
      var maxAccumsum = -99999;
      var sizeAccum = Math.max(Math.floor(list.length/50), 1);

      list.forEach(function(val){
        min = Math.min(min, val);
        max = Math.max(max, val);
        average += val;
        accumsum += val;
        index++;
        if(index==sizeAccum){
          accumsum /= index;
          maxAccumsum = Math.max(maxAccumsum, accumsum);
          shorten.push(accumsum);
          accumsum=0;
          index=0;
        }
      });
      if(index !== 0){
          accumsum /=index;
          maxAccumsum = Math.max(maxAccumsum, accumsum);
          shorten.push(accumsum);
      }

      shorten = shorten.factor(1/maxAccumsum);

      average /= list.length;

      list.min = min;
      list.max = max;
      list.average = average;
      text += ident + "min: <b>" + min + "</b>";
      text += ident + "max: <b>" + max + "</b>";
      text += ident + "average: <b>" + average + "</b>";
      if(length < 101) {
        text += ident + "numbers: <b>" + list.join("</b>, <b>") + "</b>";
      }
      text += ident;
      for(i=0; shorten[i]!=null; i++){
        text += "<font style=\"font-size:7px\"><font color=\""+ColorOperators.colorStringToHEX(ColorScales.grayToOrange(shorten[i]))+"\">█</f></f>";
      }
      break;
    case "StringList":
    case "List":
      var freqTable = list.getFrequenciesTable(true);
      list._freqTable = freqTable;
      var catColors = ColorListGenerators.createCategoricalColors(2, freqTable[0].length);

      text += ident + "entropy: <b>" + NumberOperators.numberToString(ListOperators.getListEntropy(list, null, freqTable), 4) + "</b>";

      text += ident + "number of different elements: <b>" + freqTable[0].length + "</b>";
      if(freqTable[0].length < 10) {
        text += ident + "elements frequency:";
      } else {
        text += ident + "some elements frequency:";
      }

      for(i = 0; freqTable[0][i] != null && i < 10; i++) {
        text += ident + "  [<b>" + String(freqTable[0][i]) + "</b>]: <font style=\"font-size:10px\"><b><font color=\""+ColorOperators.colorStringToHEX(catColors[i])+"\">" + freqTable[1][i] + "</f></b></f>";
      }

      var joined;
      if(list.type == "List") {
        joined = list.join("], [");
      } else {
        joined = ListConversions.toStringList(list).join("], [");
      }

      if(joined.length < 2000) text += ident + "contents: [" + joined + "]";

      var weights = NumberListOperators.normalizedToSum(freqTable[1]);

      var bars = StringOperators.createsCategoricalColorsBlocksHtml(weights, 55, catColors);
      text += ident;
      text += "<font style=\"font-size:7px\">"+bars+"</f>";

      break;
  }


  ///add ideas to: analyze, visualize
  return text;
};
