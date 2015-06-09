/**
 * @classdesc Tools for working with Lists of colors.
 *
 * @namespace
 * @category colors
 */
function ColorListOperators() {}
/**
 * receives n arguments and performs addition
 */
ColorListOperators.colorListFromColorScale = function(colorScale, nColors) {
  return colorScale.getColorList.apply(colorScale, [nColors]);
};

ColorListOperators.colorListFromColorScaleFunction = function(colorScaleFunction, nColors) {
  var colorList = new ColorList();
  var i;
  for(i = 0; i < nColors; i++) {
    colorList[i] = colorScaleFunction(i / (nColors - 1));
  }
  return colorList;
};


ColorListOperators.colorListFromColorScaleFunctionAndNumberList = function(colorScaleFunction, numberList, normalize) {
  normalize = normalize == null ? true : normalize;

  if(normalize) numberList = numberList.getNormalized();

  var colorList = new ColorList();
  var i;
  for(i = 0; numberList[i] != null; i++) {
    colorList[i] = colorScaleFunction(numberList[i]);
  }
  return colorList;
};



ColorListOperators.polygon3DToColorList = function(polygon3D) {
  var nPoints = polygon3D.length;
  var colorList = new ColorList();
  var i;
  for(i = 0; i < nPoints; i++) {
    colorList.push(ColorOperators.point3DToColor(polygon3D[i]));
  }
  return colorList;
};
ColorListOperators.colorListToPolygon3D = function(colorList) {
  var nColors = colorList.length;
  var polygon3D = new Polygon3D();
  var i;
  for(i = 0; i < nColors; i++) {
    polygon3D.push(ColorOperators.colorToPoint3D(colorList[i]));
  }
  return polygon3D;
};
