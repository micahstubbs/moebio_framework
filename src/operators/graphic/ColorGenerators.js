/**
 * @classdesc Tools for generating colors.
 *
 * @namespace
 * @category colors
 */
function ColorGenerators() {}
export default ColorGenerators;


ColorGenerators.randomColor = function(alpha) {
  alpha = alpha == null ? 1 : alpha;
  return 'rgba(' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + alpha + ')';
};
