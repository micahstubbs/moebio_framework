/**
 * @classdesc Generate {@link ColorScale|ColorScales} with various properties.
 *
 * @namespace
 * @category colors
 */
function ColorScaleGenerators() {}
export default ColorScaleGenerators;


/**
 * creates a ColorScale function from colors and positions, a numberList with values in (0,1) (positions lenth must be colorList length minus 2)
 * @param  {ColorList} colorList
 * @param  {NumberList} positions
 * @return {ColorScale}
 * tags:generator
 */
ColorScaleGenerators.createColorScaleFromColors = function(colorList, positions) {
  if(colorList == null || positions == null || colorList.length <= 0 || positions.length <= 0 || colorList.length != (positions.length + 2)) return null;

  if(colorList.rgbs == null) {
    colorList.rgbs = colorList.getRgbArrays();
  }

  positions = positions.slice();
  positions.unshift(0);
  positions.push(1);

  var cS = function(t) {
    var i;
    var intert, antit;

    for(i = 0; positions[i + 1] != null; i++) {
      if(t < positions[i + 1]) {
        intert = (t - positions[i]) / (positions[i + 1] - positions[i]);
        antit = 1 - intert;
				return 'rgb(' +
					Math.floor( antit*colorList.rgbs[i][0] + intert*colorList.rgbs[i+1][0] ) + ',' +
					Math.floor( antit*colorList.rgbs[i][1] + intert*colorList.rgbs[i+1][1] ) + ',' +
					Math.floor( antit*colorList.rgbs[i][2] + intert*colorList.rgbs[i+1][2] ) + ')';
      }
    }
  };

  return cS;
};
