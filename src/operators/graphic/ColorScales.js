import ColorOperators from "src/operators/graphic/ColorOperators";

/**
 * @classdesc Default color scales.
 *
 * @namespace
 * @category colors
 */
function ColorScales() {}
export default ColorScales;

/**
 * @todo write docs
 */
ColorScales.blackScale = function() {
  return 'black';
};

/**
 * @todo write docs
 */
ColorScales.grayscale = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 255, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorScales.antiGrayscale = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [0, 0, 0], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorScales.antiTemperature = function(value) {
  return ColorScales.temperature(1 - value);
};

/**
 * @todo write docs
 */
ColorScales.temperature = function(value) { //todo:make it efficient
  var color = "#FFFFFF";
  if(value < 0.2) {
    color = ColorOperators.interpolateColors('#000000', ColorOperators.HSVtoHEX(234, 1, 1), value * 5);
  } else if(value > 0.85) {
    color = ColorOperators.interpolateColors(ColorOperators.HSVtoHEX(0, 1, 1), '#FFFFFF', (value - 0.85) / 0.15);
  } else {
    color = ColorOperators.HSVtoHEX(Math.round((0.65 - (value - 0.2)) * 360), 1, 1);
  }
  return color;
};

/**
 * @todo write docs
 */
ColorScales.sqrtTemperature = function(value) {
  return ColorScales.temperature(Math.sqrt(value));
};

/**
 * @todo write docs
 */
ColorScales.sqrt4Temperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 0.25));
};

/**
 * @todo write docs
 */
ColorScales.quadraticTemperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 2));
};

/**
 * @todo write docs
 */
ColorScales.cubicTemperature = function(value) {
  return ColorScales.temperature(Math.pow(value, 3));
};

/**
 * @todo write docs
 */
ColorScales.greenToRed = function(value) { //todo:make it efficient
  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 50, 50], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorScales.greenToBlue = function(value) { //todo:make it efficient
  var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [50, 50, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorScales.grayToOrange = function(value) {
  return 'rgb(' + Math.floor(100 + value*155) + ','+ Math.floor(100 + value*10) +',' + Math.floor(100 - value*100) + ')';
};

/**
 * @todo write docs
 */
ColorScales.sqrt4GrayToOrange = function(value){
  return ColorScales.grayToOrange(Math.pow(value, 0.25));
};

/**
 * @todo write docs
 */
ColorScales.blueToRed = function(value) {
  return 'rgb(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ')';
};

/**
 * @todo write docs
 */
ColorScales.blueToRedAlpha = function(value) { //todo:make it efficient
  return 'rgba(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ', 0.5)';
};

/**
 * @todo write docs
 */
ColorScales.whiteToRed = function(value) {
  var gg = Math.floor(255 - value * 255);
  return 'rgb(255,' + gg + ',' + gg + ')';
};

/**
 * @todo write docs
 */
ColorScales.redToBlue = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([255, 0, 0], [0, 0, 255], value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

//tricolor

/**
 * @todo write docs
 */
ColorScales.greenWhiteRed = function(value) { //TODO: make it + efficient
  var rgb = [0,0,0];
  if(value < 0.5) {
    rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 255, 255], value * 2);
  } else {
    rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 50, 50], (value - 0.5) * 2);
  }
  return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
};

/**
 * @todo write docs
 */
ColorScales.blueWhiteRed = function(value) {
  var rr = value < 0.5 ? Math.floor(510 * value) : 255;
  var gg = value < 0.5 ? Math.floor(510 * value) : Math.floor(510 * (1 - value));
  var bb = value < 0.5 ? 255 : Math.floor(510 * (1 - value));

  return 'rgb(' + rr + ',' + gg + ',' + bb + ')';
};

/**
 * @todo write docs
 */
ColorScales.grayBlackOrange = function(value){ //TODO: make it + efficient
  var rgb = [0,0,0];
  if(value < 0.5) {
    rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [0, 0, 0], value * 2);
  } else {
    rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 110, 0], (value - 0.5) * 2);
  }
  return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
};

/**
 * @todo write docs
 */
ColorScales.grayWhiteOrange = function(value){ //TODO: make it + efficient
  var rgb = [0,0,0];
  if(value < 0.5) {
    rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [255, 255, 255], value * 2);
  } else {
    rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 110, 0], (value - 0.5) * 2);
  }
  return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
};


/**
 * @todo write docs
 */
ColorScales.solar = function(value) {
  var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], ColorOperators.interpolateColorsRGB([255, 0, 0], [255, 255, 0], value), Math.pow(value * 0.99 + 0.01, 0.2));
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorScales.antiSolar = function(value) {
  return ColorOperators.invertColor(ColorScales.solar(value));
};
