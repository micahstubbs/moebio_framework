/**
 * ColorGenerators 
 * @constructor
 */
function ColorGenerators() {}


ColorGenerators.randomColor = function(alpha) {
  alpha = alpha == null ? 1 : alpha;
  return 'rgba(' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + alpha + ')';
};