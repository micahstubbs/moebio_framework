import ColorList from "src/dataTypes/graphic/ColorList";
import ColorOperators from "src/operators/graphic/ColorOperators";
import Polygon3D from "src/dataTypes/geometry/Polygon3D";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/**
 * @classdesc Tools for working with Lists of colors.
 *
 * @namespace
 * @category colors
 */
function ColorListOperators() {}
export default ColorListOperators;

/**
 * receives n arguments and performs addition
 *
 * @todo finish docs
 */
ColorListOperators.colorListFromColorScale = function(colorScale, nColors) {
  return colorScale.getColorList.apply(colorScale, [nColors]);
};

/**
 * Creates a new ColorList from a given ColorScale, splitting the scale up into
 * nColors number of colors
 *
 * @param  {ColorScale} colorScaleFunction The ColorScale to split up.
 * @param  {Number} nColors The number of colors to add to the list.
 * @return {ColorList} new ColorList.
 */
ColorListOperators.colorListFromColorScaleFunction = function(colorScaleFunction, nColors) {
  var colorList = new ColorList();
  var i;
  for(i = 0; i < nColors; i++) {
    colorList[i] = colorScaleFunction(i / (nColors - 1));
  }
  return colorList;
};


/**
 * @todo write docs
 */
ColorListOperators.colorListFromColorScaleFunctionAndNumberList = function(colorScaleFunction, numberList, normalize) {
  normalize = normalize == null ? true : normalize;

  if(normalize) numberList = NumberListOperators.normalized(numberList);

  var colorList = new ColorList();
  var i;
  for(i = 0; numberList[i] != null; i++) {
    colorList[i] = colorScaleFunction(numberList[i]);
  }
  return colorList;
};


/**
 * @todo write docs
 */
ColorListOperators.polygon3DToColorList = function(polygon3D) {
  var nPoints = polygon3D.length;
  var colorList = new ColorList();
  var i;
  for(i = 0; i < nPoints; i++) {
    colorList.push(ColorOperators.point3DToColor(polygon3D[i]));
  }
  return colorList;
};


/**
 * @todo write docs
 */
ColorListOperators.colorListToPolygon3D = function(colorList) {
  var nColors = colorList.length;
  var polygon3D = new Polygon3D();
  var i;
  for(i = 0; i < nColors; i++) {
    polygon3D.push(ColorOperators.colorToPoint3D(colorList[i]));
  }
  return polygon3D;
};
