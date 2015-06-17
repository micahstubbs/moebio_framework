import List from "src/dataStructures/lists/List";
import ColorOperators from "src/operators/graphic/ColorOperators";

ColorList.prototype = new List();
ColorList.prototype.constructor = ColorList;

/**
 * @classdesc A {@link List} for storing Colors.
 *
 * @description Creates a new ColorList.
 * @constructor
 * @category colors
 */
function ColorList() {
  var args = [];
  var i;
  for(i = 0; i < arguments.length; i++) {
    args[i] = arguments[i];
  }
  var array = List.apply(this, args);
  array = ColorList.fromArray(array);

  return array;
}
export default ColorList;

ColorList.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "ColorList";
  result.getRgbArrays = ColorList.prototype.getRgbArrays;
  result.getInterpolated = ColorList.prototype.getInterpolated;
  result.getInverted = ColorList.prototype.getInverted;
  result.addAlpha = ColorList.prototype.addAlpha;
  return result;
};

/**
 * return an arrays of rgb arrays ([rr,gg,bb])
 * @return {array}
 * tags:
 */
ColorList.prototype.getRgbArrays = function() {
  var rgbArrays = new List();

  for(var i = 0; this[i] != null; i++) {
    rgbArrays[i] = ColorOperators.colorStringToRGB(this[i]);
  }

  return rgbArrays;
};

/**
 * interpolates colors with a given color and measure
 * @param  {String} color to be interpolated with
 * @param  {Number} value intenisty of interpolation [0,1]
 * @return {ColorList}
 * tags:
 */
ColorList.prototype.getInterpolated = function(color, value) {
  var newColorList = new ColorList();

  for(var i = 0; this[i] != null; i++) {
    newColorList[i] = ColorOperators.interpolateColors(this[i], color, value);
  }

  newColorList.name = this.name;
  return newColorList;
};

/**
 * inverts all colors
 * @return {ColorList}
 * tags:
 */
ColorList.prototype.getInverted = function() {
  var newColorList = new ColorList();

  for(var i = 0; this[i] != null; i++) {
    newColorList[i] = ColorOperators.invertColor(this[i]);
  }

  newColorList.name = this.name;
  return newColorList;
};

/**
 * adds alpha value to all colores
 * @param {Number} alpha alpha value in [0,1]
 * @return {ColorList}
 * tags:
 */
ColorList.prototype.addAlpha = function(alpha) {
  var newColorList = new ColorList();

  for(var i = 0; this[i] != null; i++) {
    newColorList[i] = ColorOperators.addAlpha(this[i], alpha);
  }

  newColorList.name = this.name;
  return newColorList;
};
