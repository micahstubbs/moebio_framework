import DataModel from "src/dataStructures/DataModel";
import ColorList from "src/dataStructures/graphic/ColorList";
import ColorScales from "src/operators/graphic/ColorScales";

ColorScale.prototype = new DataModel();
ColorScale.prototype.constructor = ColorScale;

/**
 * @classdesc Color scale.
 *
 * @description Creates a new ColorScale.
 * @param {Function} colorScaleFunction Function.
 * @constructor
 * @category colors
 */
function ColorScale(colorScaleFunction) {
  DataModel.apply(this, arguments);
  this.name = "";
  this.type = "ColorScale";

  this.colorScaleFunction = colorScaleFunction ? colorScaleFunction : ColorScales.blackScale;
}
export default ColorScale;

ColorScale.prototype.getColor = function(value) {
  return this.colorScaleFunction(value);
};

ColorScale.prototype.getColorList = function(nColors) {
  var colorList = new ColorList();
  var i;
  for(i = 0; i < nColors; i++) {
    colorList.push(this.getColor(i / (nColors - 1)));
  }
  return colorList;
};
