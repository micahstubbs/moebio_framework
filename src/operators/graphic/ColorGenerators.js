/**
 * @classdesc Tools for generating colors.
 *
 * @namespace
 * @category colors
 */
function ColorGenerators() {}
export default ColorGenerators;


/**
 * Generates a random color and provides rgba() CSS string for that color.
 * Optionally can be provided an alpha value to set the opacity to.
 *
 * @param {Number} alpha Opacity value between 0 and 1. Defaults to 1.
 * @return {String} Random color in the form of a RGBA string.
 */
ColorGenerators.randomColor = function(alpha) {
  alpha = alpha == null ? 1 : alpha;
  return 'rgba(' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + alpha + ')';
};
