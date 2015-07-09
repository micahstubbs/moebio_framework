import ColorList from "src/dataStructures/graphic/ColorList";
import ColorScales from "src/operators/graphic/ColorScales";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import ListOperators from "src/operators/lists/ListOperators";
import Table from "src/dataStructures/lists/Table";
import List from "src/dataStructures/lists/List";

ColorListGenerators._HARDCODED_CATEGORICAL_COLORS = new ColorList(
  "#dd4411", "#2200bb", "#1f77b4", "#ff660e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#dd8811",
  "#dd0011", "#221140", "#1f66a3", "#ff220e", "#2ba01c", "#442728", "#945600", "#8c453a", "#e37700"
);

/**
 * @classdesc Tools for generating {@link List|Lists} of colors.
 *
 * @namespace
 * @category colors
 */
function ColorListGenerators() {}
export default ColorListGenerators;

/**
 * create a simple list of categorical colors
 * @param  {Number} nColors
 *
 * @param  {Number} alpha 1 by default
 * @param {Boolean} invert invert colors
 * @return {ColorList}
 * tags:generator
 */
ColorListGenerators.createDefaultCategoricalColorList = function(nColors, alpha, invert) {
  alpha = alpha == null ? 1 : alpha;
  var colors = ColorListGenerators.createCategoricalColors(1, nColors).getInterpolated('black', 0.15);
  if(alpha < 1) colors = colors.addAlpha(alpha);

  if(invert) colors = colors.getInverted();

  return colors;
};


/**
 * create a colorList based on a colorScale and values from a numberList (that will be normalized)
 * @param  {NumberList} numberList
 * @param  {ColorScale} colorScale
 * 
 * @param  {Number} mode 0:normalize numberList
 * @return {ColorList}
 * tags:generator
 */
ColorListGenerators.createColorListFromNumberList = function(numberList, colorScale, mode) {
  if(numberList==null) return null;
  
  mode = mode == null ? 0 : mode;

  var colorList = new ColorList();
  var newNumberList;
  var i;

  switch(mode) {
    case 0: //0 to max
      newNumberList = numberList.getNormalizedToMax();
      break;
    case 1: //min to max
      break;
    case 2: //values between 0 and 1
      break;
  }

  for(i = 0; newNumberList[i] != null; i++) {
    colorList.push(colorScale(newNumberList[i]));
  }

  return colorList;
};


ColorListGenerators.createColorListWithSingleColor = function(nColors, color) {
  var colorList = new ColorList();
  for(var i = 0; i < nColors; i++) {
    colorList.push(color);
  }
  return colorList;
};


/**
 * Creates a ColorList of categorical colors
 * @param {Number} mode 0:simple picking from color scale function, 1:random (with seed), 2:hardcoded colors, 3:, 4:, 5:evolutionary algorithm, guarantees non consecutive similar colors
 * @param {Number} nColors
 *
 * @param {ColorScale} colorScaleFunction
 * @param {Number} alpha transparency
 * @param {String} interpolateColor color to interpolate
 * @param {Number} interpolateValue interpolation value [0, 1]
 * @return {ColorList} ColorList with categorical colors
 * tags:generator
 */
ColorListGenerators.createCategoricalColors = function(mode, nColors, colorScaleFunction, alpha, interpolateColor, interpolateValue) {
  colorScaleFunction = colorScaleFunction == null ? ColorScales.temperature : colorScaleFunction;

  var i;
  var colorList = new ColorList();
  switch(mode) {
    case 0: //picking from ColorScale
      for(i = 0; i < nColors; i++) {
        colorList[i] = colorScaleFunction(i / (nColors - 1));
      }
      break;
    case 1: //seeded random numbers
      var values = NumberListGenerators.createRandomNumberList(nColors, null, 0);
      for(i = 0; i < nColors; i++) {
        colorList[i] = colorScaleFunction(values[i]);
      }
      break;
    case 2:
      for(i = 0; i < nColors; i++) {
        colorList[i] = ColorListGenerators._HARDCODED_CATEGORICAL_COLORS[i % ColorListGenerators._HARDCODED_CATEGORICAL_COLORS.length];
      }
      break;
    case 5:
      var randomNumbersSource = NumberListGenerators.createRandomNumberList(1001, null, 0);
      var positions = NumberListGenerators.createSortedNumberList(nColors);
      var randomNumbers = NumberListGenerators.createRandomNumberList(nColors, null, 0);
      var randomPositions = ListOperators.sortListByNumberList(positions, randomNumbers);

      var nGenerations = Math.floor(nColors * 2) + 100;
      var nChildren = Math.floor(nColors * 0.6) + 5;
      var bestEvaluation = ColorListGenerators._evaluationFunction(randomPositions);
      var child;
      var bestChildren = randomPositions;
      var j;
      var nr = 0;
      var evaluation;

      for(i = 0; i < nGenerations; i++) {
        for(j = 0; j < nChildren; j++) {
          child = ColorListGenerators._sortingVariation(randomPositions, randomNumbersSource[nr], randomNumbersSource[nr + 1]);
          nr = (nr + 2) % 1001;
          evaluation = ColorListGenerators._evaluationFunction(child);
          if(evaluation > bestEvaluation) {
            bestChildren = child;
            bestEvaluation = evaluation;
          }
        }
        randomPositions = bestChildren;
      }

      for(i = 0; i < nColors; i++) {
        colorList.push(colorScaleFunction((1 / nColors) + randomPositions[i] / (nColors + 1))); //TODO: make more efficient by pre-nuilding the colorList
      }
      break;
  }

  if(interpolateColor != null && interpolateValue != null) {
    colorList = colorList.getInterpolated(interpolateColor, interpolateValue);
  }

  if(alpha) {
    colorList = colorList.addAlpha(alpha);
  }

  return colorList;
};

ColorListGenerators._sortingVariation = function(numberList, rnd0, rnd1) { //private
  var newNumberList = numberList.clone();
  var pos0 = Math.floor(rnd0 * newNumberList.length);
  var pos1 = Math.floor(rnd1 * newNumberList.length);
  var cache = newNumberList[pos1];
  newNumberList[pos1] = newNumberList[pos0];
  newNumberList[pos0] = cache;
  return newNumberList;
};
ColorListGenerators._evaluationFunction = function(numberList) { //private
  var sum = 0;
  var i;
  for(i = 0; numberList[i + 1] != null; i++) {
    sum += Math.sqrt(Math.abs(numberList[i + 1] - numberList[i]));
  }
  return sum;
};


/**
 * Creates a ColorList of categorical colors based on an input List. All entries with the same value will get the same color.
 * @param {List} the list containing categorical data
 *
 * @param {ColorList} ColorList with categorical colors
 * @param {Number} alpha transparency
 * @param {String} color to mix
 * @param {Number} interpolation value (0-1) for color mix
 * @param {Boolean} invert invert colors
 * @return {ColorList} ColorList with categorical colors that match the given list
 * @return {List} elements list of elemnts that match colors (equivalent to getWithoutRepetions)
 * @return {ColorList} ColorList with different categorical colors
 * @return {Table} dictionary dictionary table with elemnts and matching colors
 * tags:generator
 */
ColorListGenerators.createCategoricalColorListForList = function(list, colorList, alpha, color, interpolate, invert)
{

  if(!list)
    return new ColorList();
  if(!alpha)
    alpha = 1;
  if(!color)
    color = "#fff";
  if(!interpolate)
    interpolate = 0;
  
  list = List.fromArray(list);
  var diffValues = list.getWithoutRepetitions();
  var diffColors;
  if(colorList) {
    diffColors = colorList.getInterpolated(color, interpolate);
  } else {
    diffColors = ColorListGenerators.createCategoricalColors(2, diffValues.length, null, alpha, color, interpolate);
    //diffColors = ColorListGenerators.createDefaultCategoricalColorList( diffValues.length, 1 ).getInterpolated( color, interpolate );
  }
  diffColors = diffColors.addAlpha(alpha);

  if(invert) diffColors = diffColors.getInverted();

  var colorDict = Table.fromArray([diffValues, diffColors]);
  var fullColorList = ListOperators.translateWithDictionary(list, colorDict, "NULL");

  fullColorList = ColorList.fromArray(fullColorList);

  return [
    {
      value: fullColorList,
      type: 'ColorList'
    }, {
      value: diffValues,
      type: diffValues.type
    }, {
      value: diffColors,
      type: 'ColorList'
    }, {
      value: new Table(diffValues, fullColorList),
      type: 'Table'
    }
  ];
};
