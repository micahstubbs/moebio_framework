/**
 * @classdesc Provides a set of tools that work with Colors.
 *
 * @namespace
 * @category colors
 */
function ColorOperators() {}
export default ColorOperators;
// TODO: create Color struture to be used instead of arrays [255, 100,0] ?

/**
 * return a color between color0 and color1
 * 0 -> color0
 * 1 -> color1
 * @param {String} color0
 * @param {String} color1
 * @param value between 0 and 1 (to obtain color between color0 and color1)
 * @return {String} interpolated color
 *
 */
ColorOperators.interpolateColors = function(color0, color1, value) {
  var resultArray = ColorOperators.interpolateColorsRGB(ColorOperators.colorStringToRGB(color0), ColorOperators.colorStringToRGB(color1), value);
  return ColorOperators.RGBtoHEX(resultArray[0], resultArray[1], resultArray[2]);
};


/**
 * return a color between color0 and color1
 * 0 -> color0
 * 1 -> color1
 * @param {Array} color0 RGB
 * @param {Array} color1 RGB
 * @param value between 0 and 1 (to obtain values between color0 and color1)
 * @return {Array} interpolated RGB color
 *
 */
ColorOperators.interpolateColorsRGB = function(color0, color1, value) {
  var s = 1 - value;
  return [Math.floor(s * color0[0] + value * color1[0]), Math.floor(s * color0[1] + value * color1[1]), Math.floor(s * color0[2] + value * color1[2])];
};

/**
 * converts an hexadecimal color to RGB
 * @param {String} an hexadecimal color string
 * @return {Array} returns an RGB color Array
 *
 */
ColorOperators.HEXtoRGB = function(hexColor) {
  return [parseInt(hexColor.substr(1, 2), 16), parseInt(hexColor.substr(3, 2), 16), parseInt(hexColor.substr(5, 2), 16)];
};


/**
 * Converts RGB values to a hexadecimal color string.
 * @param {Number} red R value.
 * @param {Number} green G value.
 * @param {Number} blue B value.
 * @return {String} hexadecimal representation of the colors.
 */
ColorOperators.RGBtoHEX = function(red, green, blue) {
  return "#" + ColorOperators.toHex(red) + ColorOperators.toHex(green) + ColorOperators.toHex(blue);
};

/**
 * @todo write docs
 */
ColorOperators.RGBArrayToString = function(array) {
  return 'rgb(' + array[0] + ',' + array[1] + ',' + array[2] + ')';
};

/**
 * @todo write docs
 */
ColorOperators.colorStringToHEX = function(color_string) {
  var rgb = ColorOperators.colorStringToRGB(color_string);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};


/**
 * @todo write docs
 */
ColorOperators.numberToHex = function(number) {
  var hex = number.toString(16);
  while(hex.length < 2) hex = "0" + hex;
  return hex;
};

/**
 * @todo write docs
 */
ColorOperators.uinttoRGB = function(color) {
  var rgbColor = new Array(color >> 16, (color >> 8) - ((color >> 16) << 8), color - ((color >> 8) << 8));
  return rgbColor;
};

/**
 * @todo write docs
 */
ColorOperators.uinttoHEX = function(color) {
  var rgbColor = ColorOperators.uinttoRGB(color);
  var hexColor = ColorOperators.RGBToHEX(rgbColor[0], rgbColor[1], rgbColor[2]);
  return hexColor;
};

/**
 * @todo write docs
 */
ColorOperators.RGBtouint = function(red, green, blue) {
  return Number(red) << 16 | Number(green) << 8 | Number(blue);
};

/**
 * @todo write docs
 */
ColorOperators.HEXtouint = function(hexColor) {
  var colorArray = ColorOperators.HEXtoRGB(hexColor);
  var color = ColorOperators.RGBtouint(colorArray[0], colorArray[1], colorArray[2]);
  return color;
};

/**
 * @todo write docs
 */
ColorOperators.grayByLevel = function(level) {
  level = Math.floor(level * 255);
  return 'rgb(' + level + ',' + level + ',' + level + ')';
};

/**
 * converts an hexadecimal color to HSV
 * @param {String} an hexadecimal color string
 * @return {Array} returns an HSV color Array
 *
 */
ColorOperators.HEXtoHSV = function(hexColor) {
  var rgb = ColorOperators.HEXtoRGB(hexColor);
  return ColorOperators.RGBtoHSV(rgb[0], rgb[1], rgb[2]);
};


/**
 * @todo write docs
 */
ColorOperators.HSVtoHEX = function(hue, saturation, value) {
  var rgb = ColorOperators.HSVtoRGB(hue, saturation, value);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorOperators.HSLtoHEX = function(hue, saturation, light) {
  var rgb = ColorOperators.HSLtoRGB(hue, saturation, light);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * converts an RGB color to HSV
 * @param {Array} a RGB color array
 * @return {Array} returns a HSV color array
 * H in [0,360], S in [0,1], V in [0,1]
 */
ColorOperators.RGBtoHSV = function(r, g, b) {
    var h;
    var s;
    var v;
    var min = Math.min(Math.min(r, g), b);
    var max = Math.max(Math.max(r, g), b);
    v = max / 255;
    var delta = max - min;
    if(delta === 0) return new Array(0, 0, r / 255);
    if(max !== 0) {
      s = delta / max;
    } else {
      s = 0;
      h = -1;
      return new Array(h, s, v);
    }
    if(r == max) {
      h = (g - b) / delta;
    } else if(g == max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h *= 60;
    if(h < 0) h += 360;
    return new Array(h, s, v);
  };

/**
 * converts an HSV color to RGB
 * @param {Array} a HSV color array
 * @return {Array} returns a RGB color array
 */
ColorOperators.HSVtoRGB = function(hue, saturation, value) {
  hue = hue ? hue : 0;
  saturation = saturation ? saturation : 0;
  value = value ? value : 0;
  var r;
  var g;
  var b;
  //
  var i;
  var f;
  var p;
  var q;
  var t;
  if(saturation === 0) {
    r = g = b = value;
    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
  }
  hue /= 60;
  i = Math.floor(hue);
  f = hue - i;
  p = value * (1 - saturation);
  q = value * (1 - saturation * f);
  t = value * (1 - saturation * (1 - f));
  switch(i) {
    case 0:
      r = value;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = value;
      b = p;
      break;
    case 2:
      r = p;
      g = value;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = value;
      break;
    case 4:
      r = t;
      g = p;
      b = value;
      break;
    default:
      r = value;
      g = p;
      b = q;
      break;
  }
  return new Array(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes hue is contained in the interval [0,360) and saturation and l are contained in the set [0, 1]
 */
ColorOperators.HSLtoRGB = function(hue, saturation, light) {
  var r, g, b;

  function hue2rgb(p, q, t) {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1 / 6) return p + (q - p) * 6 * t;
    if(t < 1 / 2) return q;
    if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if(saturation === 0) {
    r = g = b = light; // achromatic
  } else {
    var q = light < 0.5 ? light * (1 + saturation) : light + saturation - light * saturation;
    var p = 2 * light - q;
    r = hue2rgb(p, q, (hue / 360) + 1 / 3);
    g = hue2rgb(p, q, hue / 360);
    b = hue2rgb(p, q, (hue / 360) - 1 / 3);
  }

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
};

/**
 * @todo write docs
 */
ColorOperators.invertColorRGB = function(r, g, b) {
  return [255 - r, 255 - g, 255 - b];
};

/**
 * @todo write docs
 */
ColorOperators.addAlpha = function(color, alpha) {
  //var rgb = color.substr(0,3)=='rgb'?ColorOperators.colorStringToRGB(color):ColorOperators.HEXtoRGB(color);
  var rgb = ColorOperators.colorStringToRGB(color);
  if(rgb == null) return 'black';
  return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
};

/**
 * @todo write docs
 */
ColorOperators.invertColor = function(color) {
  var rgb = ColorOperators.colorStringToRGB(color);
  rgb = ColorOperators.invertColorRGB(rgb[0], rgb[1], rgb[2]);
  return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
};

/**
 * @todo write docs
 */
ColorOperators.toHex = function(number) {
  var hex = number.toString(16);
  while(hex.length < 2) hex = "0" + hex;
  return hex;
};

/**
 * @todo write docs
 */
ColorOperators.getRandomColor = function() {
  return 'rgb(' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ')';
};


/////// Universal matching



/**
 * This method was partially obtained (and simplified) from a Class by Stoyan Stefanov: "A class to parse color values / @author Stoyan Stefanov <sstoo@gmail.com> / @link   http://www.phpied.com/rgb-color-parser-in-javascript/ / @license Use it if you like it"
 * @param {String} color_string color as a string (e.g. "red", "#0044ff", "rgb(130,20,100)")
 * @return {Array} rgb array
 * tags:
 */
ColorOperators.colorStringToRGB = function(color_string) {
  //c.log('color_string:['+color_string+']');

  // strip any leading #
  if(color_string.charAt(0) == '#') { // remove # if any
    color_string = color_string.substr(1, 6);
    //c.log('-> color_string:['+color_string+']');
  }

  color_string = color_string.replace(/ /g, '');
  color_string = color_string.toLowerCase();

  // before getting into regexps, try simple matches
  // and overwrite the input
  var simple_colors = {
    aliceblue: 'f0f8ff',
    antiquewhite: 'faebd7',
    aqua: '00ffff',
    aquamarine: '7fffd4',
    azure: 'f0ffff',
    beige: 'f5f5dc',
    bisque: 'ffe4c4',
    black: '000000',
    blanchedalmond: 'ffebcd',
    blue: '0000ff',
    blueviolet: '8a2be2',
    brown: 'a52a2a',
    burlywood: 'deb887',
    cadetblue: '5f9ea0',
    chartreuse: '7fff00',
    chocolate: 'd2691e',
    coral: 'ff7f50',
    cornflowerblue: '6495ed',
    cornsilk: 'fff8dc',
    crimson: 'dc143c',
    cyan: '00ffff',
    darkblue: '00008b',
    darkcyan: '008b8b',
    darkgoldenrod: 'b8860b',
    darkgray: 'a9a9a9',
    darkgreen: '006400',
    darkkhaki: 'bdb76b',
    darkmagenta: '8b008b',
    darkolivegreen: '556b2f',
    darkorange: 'ff8c00',
    darkorchid: '9932cc',
    darkred: '8b0000',
    darksalmon: 'e9967a',
    darkseagreen: '8fbc8f',
    darkslateblue: '483d8b',
    darkslategray: '2f4f4f',
    darkturquoise: '00ced1',
    darkviolet: '9400d3',
    deeppink: 'ff1493',
    deepskyblue: '00bfff',
    dimgray: '696969',
    dodgerblue: '1e90ff',
    feldspar: 'd19275',
    firebrick: 'b22222',
    floralwhite: 'fffaf0',
    forestgreen: '228b22',
    fuchsia: 'ff00ff',
    gainsboro: 'dcdcdc',
    ghostwhite: 'f8f8ff',
    gold: 'ffd700',
    goldenrod: 'daa520',
    gray: '808080',
    green: '008000',
    greenyellow: 'adff2f',
    honeydew: 'f0fff0',
    hotpink: 'ff69b4',
    indianred: 'cd5c5c',
    indigo: '4b0082',
    ivory: 'fffff0',
    khaki: 'f0e68c',
    lavender: 'e6e6fa',
    lavenderblush: 'fff0f5',
    lawngreen: '7cfc00',
    lemonchiffon: 'fffacd',
    lightblue: 'add8e6',
    lightcoral: 'f08080',
    lightcyan: 'e0ffff',
    lightgoldenrodyellow: 'fafad2',
    lightgrey: 'd3d3d3',
    lightgreen: '90ee90',
    lightpink: 'ffb6c1',
    lightsalmon: 'ffa07a',
    lightseagreen: '20b2aa',
    lightskyblue: '87cefa',
    lightslateblue: '8470ff',
    lightslategray: '778899',
    lightsteelblue: 'b0c4de',
    lightyellow: 'ffffe0',
    lime: '00ff00',
    limegreen: '32cd32',
    linen: 'faf0e6',
    magenta: 'ff00ff',
    maroon: '800000',
    mediumaquamarine: '66cdaa',
    mediumblue: '0000cd',
    mediumorchid: 'ba55d3',
    mediumpurple: '9370d8',
    mediumseagreen: '3cb371',
    mediumslateblue: '7b68ee',
    mediumspringgreen: '00fa9a',
    mediumturquoise: '48d1cc',
    mediumvioletred: 'c71585',
    midnightblue: '191970',
    mintcream: 'f5fffa',
    mistyrose: 'ffe4e1',
    moccasin: 'ffe4b5',
    navajowhite: 'ffdead',
    navy: '000080',
    oldlace: 'fdf5e6',
    olive: '808000',
    olivedrab: '6b8e23',
    orange: 'ffa500',
    orangered: 'ff4500',
    orchid: 'da70d6',
    palegoldenrod: 'eee8aa',
    palegreen: '98fb98',
    paleturquoise: 'afeeee',
    palevioletred: 'd87093',
    papayawhip: 'ffefd5',
    peachpuff: 'ffdab9',
    peru: 'cd853f',
    pink: 'ffc0cb',
    plum: 'dda0dd',
    powderblue: 'b0e0e6',
    purple: '800080',
    red: 'ff0000',
    rosybrown: 'bc8f8f',
    royalblue: '4169e1',
    saddlebrown: '8b4513',
    salmon: 'fa8072',
    sandybrown: 'f4a460',
    seagreen: '2e8b57',
    seashell: 'fff5ee',
    sienna: 'a0522d',
    silver: 'c0c0c0',
    skyblue: '87ceeb',
    slateblue: '6a5acd',
    slategray: '708090',
    snow: 'fffafa',
    springgreen: '00ff7f',
    steelblue: '4682b4',
    tan: 'd2b48c',
    teal: '008080',
    thistle: 'd8bfd8',
    tomato: 'ff6347',
    turquoise: '40e0d0',
    violet: 'ee82ee',
    violetred: 'd02090',
    wheat: 'f5deb3',
    white: 'ffffff',
    whitesmoke: 'f5f5f5',
    yellow: 'ffff00',
    yellowgreen: '9acd32'
  };

  if(simple_colors[color_string] != null) color_string = simple_colors[color_string];


  // array of color definition objects
  var color_defs = [
  {
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
    //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
    process: function(bits) {
      return [
        parseInt(bits[1]),
        parseInt(bits[2]),
        parseInt(bits[3])
      ];
    }
  },
  {
    re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),[\.0123456789]+\)$/,
    //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)', 'rgba(200,100,120,0.3)'],
    process: function(bits) {
      return [
        parseInt(bits[1]),
        parseInt(bits[2]),
        parseInt(bits[3])
      ];
    }
  },
  {
    re: /^(\w{2})(\w{2})(\w{2})$/,
    //example: ['#00ff00', '336699'],
    process: function(bits) {
      return [
        parseInt(bits[1], 16),
        parseInt(bits[2], 16),
        parseInt(bits[3], 16)
      ];
    }
  },
  {
    re: /^(\w{1})(\w{1})(\w{1})$/,
    //example: ['#fb0', 'f0f'],
    process: function(bits) {
      return [
        parseInt(bits[1] + bits[1], 16),
        parseInt(bits[2] + bits[2], 16),
        parseInt(bits[3] + bits[3], 16)
      ];
    }
  }];

  // search through the definitions to find a match
  for(var i = 0; i < color_defs.length; i++) {
    var re = color_defs[i].re;
    var processor = color_defs[i].process;
    var bits = re.exec(color_string);
    if(bits) {
      return processor(bits);
    }

  }

  return null;
};
