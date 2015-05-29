function ColorScales() {}

// *
//  * return a colorScale from its name
//  * @param  {String} string name of ColorScale
//  * @return {Function} ColorScale function
//  * tags:conversion

// ColorScales.getColorScaleByName = function(string){
// 	return ColorScales[string];
// }

ColorScales.blackScale = function(value) {
  return 'black';
};

ColorScales.grayscale = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 255, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

ColorScales.antiGrayscale = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [0, 0, 0], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

ColorScales.antiTemperature = function(value) {
  return ColorScales.temperature(1 - value);
};

ColorScales.temperature = function(value) { //todo:make it efficient
  if(value < 0.2) {
    var color = ColorOperators.interpolateColors('#000000', ColorOperators.HSVtoHEX(234, 1, 1), value * 5);
  } else if(value > 0.85) {
    color = ColorOperators.interpolateColors(ColorOperators.HSVtoHEX(0, 1, 1), '#FFFFFF', (value - 0.85) / 0.15);
  } else {
    color = ColorOperators.HSVtoHEX(Math.round((0.65 - (value - 0.2)) * 360), 1, 1);
  }
  return color;
};

ColorScales.sqrtTemperature = function(value) {
  return ColorScales.temperature(Math.sqrt(value));
};

ColorScales.sqrt4Temperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 0.25));
};

ColorScales.quadraticTemperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 2));
};

ColorScales.cubicTemperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 3));
};

ColorScales.greenToRed = function(value) { //todo:make it efficient
  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 50, 50], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};
ColorScales.greenToBlue = function(value) { //todo:make it efficient
  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [50, 50, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

ColorScales.grayToOrange = function(value) { //todo:make it efficient
  var rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [255, 110, 0], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

ColorScales.blueToRed = function(value) {
  return 'rgb(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ')';
};

ColorScales.blueToRedAlpha = function(value) { //todo:make it efficient
  return 'rgba(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ', 0.5)';
};

ColorScales.whiteToRed = function(value) {
  var gg = Math.floor(255 - value * 255);
  return 'rgb(255,' + gg + ',' + gg + ')';
};

ColorScales.redToBlue = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([255, 0, 0], [0, 0, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

ColorScales.greenWhiteRed = function(value) {
  if(value < 0.5) {
    var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 255, 255], value * 2);
  } else {
    rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 50, 50], (value - 0.5) * 2);
  }
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};


ColorScales.solar = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], ColorOperators.interpolateColorsRGB([255, 0, 0], [255, 255, 0], value), Math.pow(value * 0.99 + 0.01, 0.2));
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};
ColorScales.antiSolar = function(value) {
  return ColorOperators.invertColor(ColorScales.solar(value));
};