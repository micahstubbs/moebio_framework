import Interval from "src/dataTypes/numeric/Interval";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import List from "src/dataTypes/lists/List";
import ListOperators from "src/operators/lists/ListOperators";
import RectangleList from "src/dataTypes/geometry/RectangleList";
import ListGenerators from "src/operators/lists/ListGenerators";
import Point from "src/dataTypes/geometry/Point";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";


/**
 * @classdesc Provides a set of tools that work with Rectangles
 *
 * @namespace
 * @category geometry
 */
function RectangleOperators() {}
export default RectangleOperators;

/**
 * finds the minimal rectangle containing two or more rectangles
 * @param {Rectangle} param0 first rectangle
 * @param {Rectangle} param1 second rectangle
 * @param {Rectangle} param2 third rectangle
 * @param {Rectangle} param3 fourth rectangle
 * @param {Rectangle} param4 fifth rectangle
 * @return {Rectangle}
 */
RectangleOperators.minRect = function(){
  if(arguments==null || arguments.length<1) return null;

  var i;
  var frame = arguments[0].clone();

  frame.width = frame.getRight();
  frame.height = frame.getBottom();
  for(i = 1; arguments[i] != null; i++) {
    frame.x = Math.min(frame.x, arguments[i].x);
    frame.y = Math.min(frame.y, arguments[i].y);

    frame.width = Math.max(arguments[i].getRight(), frame.width);
    frame.height = Math.max(arguments[i].getBottom(), frame.height);
  }

  frame.width -= frame.x;
  frame.height -= frame.y;

  return frame;
};

/**
 *
 * 0: quadrification
 * 1: vertical
 * 2: horizontal
 * 3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
 * 4: europe quadrigram
 * 5: vertical strips quadrification
 * 6: horizontal strips quadrification
 */
RectangleOperators.packingRectangles = function(weights, packingMode, rectangle, param) {
  //TODO: return RectangleList instead of List
  if(rectangle == null) rectangle = new Rectangle(0, 0, 1, 1);
  packingMode = packingMode ? packingMode : 0;
  switch(packingMode) {
    //0: quadrification
    //1: vertical
    //2: horizontal
    //3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
    //4: europe quadrigram
    //5:vertical strips
    case 0:
      return RectangleOperators.squarify(rectangle, weights);
    case 1:
      var minMax = weights.getMinMaxInterval();
      if(minMax.min < 0) {
        weights = weights.add(-minMax.min);
        minMax = new Interval(0, minMax.max - minMax.min);
      }

      var sum = weights.getSum();

      var rectangleList = new List(); //RectangleList();
      var dY = rectangle.y;
      var h;
      var vFactor = rectangle.height / sum;
      var i;
      for(i = 0; weights[i] != null; i++) {
        h = vFactor * weights[i];
        rectangleList.push(new Rectangle(rectangle.x, dY, rectangle.width, h));
        dY += h;
      }
      return rectangleList;
    case 2:
      minMax = weights.getMinMaxInterval();
      if(minMax.min < 0) {
        weights = weights.add(-minMax.min);
        minMax = new Interval(0, minMax.max - minMax.min);
      }
      sum = weights.getSum();

      rectangleList = new List(); //RectangleList();
      var dX = rectangle.x;
      var w;
      var hFactor = rectangle.width / sum;
      for(i = 0; weights[i] != null; i++) {
        w = hFactor * weights[i];
        rectangleList.push(new Rectangle(dX, rectangle.y, w, rectangle.height));
        dX += w;
      }
      return rectangleList;
      //var newNumberList:NumberList = OperatorsNumberList.accumulationNumberList(OperatorsNumberList.normalizeNumberListToInterval(weights, new Interval(weights.min, 1)));
    case 3:
      if(weights.length < 6) {

      } else if(weights.length == 6) {
        var rAfrica = new Rectangle(0.44, 0.36, 0.16, 0.45);
        var rAsia = new Rectangle(0.6, 0.15, 0.3, 0.3);
        var rAustralasia = new Rectangle(0.72, 0.45, 0.28, 0.32);
        var rEurope = new Rectangle(0.38, 0.04, 0.22, 0.32);

        var pivotEuroafrasia = new Point(0.6, 0.36);
        rAfrica = expandRectangle(rAfrica, Math.sqrt(weights[0]), pivotEuroafrasia);
        rAsia = expandRectangle(rAsia, Math.sqrt(weights[1]), pivotEuroafrasia);
        rEurope = expandRectangle(rEurope, Math.sqrt(weights[3]), pivotEuroafrasia);

        rAustralasia.x = rAsia.x + rAsia.width * 0.5;
        rAustralasia.y = rAsia.bottom;
        var pivotAustralasia = new Point(rAustralasia.x + rAustralasia.width * 0.3, rAsia.bottom);
        rAustralasia = expandRectangle(rAustralasia, Math.sqrt(weights[2]), pivotAustralasia);
        rAustralasia.y += rAustralasia.height * 0.2;

        var pivotAmericas = new Point(0.26, 0.36 + Math.max(rAfrica.height * 0.3, rEurope.height * 0.2));

        var rNorthAmerica = new Rectangle(0.1, pivotAmericas.y - 0.4, 0.2, 0.4);
        var rSouthAmerica = new Rectangle(0.22, pivotAmericas.y, 0.16, 0.5);

        rNorthAmerica = expandRectangle(rNorthAmerica, Math.sqrt(weights[4]), pivotAmericas);
        rSouthAmerica = expandRectangle(rSouthAmerica, Math.sqrt(weights[5]), pivotAmericas);

        var separation = Math.max(rEurope.width, rAfrica.width, rSouthAmerica.right - pivotAmericas.x, rNorthAmerica.right - pivotAmericas.x) * 0.2;
        var delta = Math.min(rEurope.x, rAfrica.x) - Math.max(rNorthAmerica.right, rSouthAmerica.right) - separation;

        rSouthAmerica.x += delta;
        rNorthAmerica.x += delta;

        return new List(rAfrica, rAsia, rAustralasia, rEurope, rNorthAmerica, rSouthAmerica); //RectangleList

      } else {

      }
    case 4:
      return europeQuadrigram(weights);
    case 5:
      param = param || 0;
      var nLists;
      if(param === 0) {
        nLists = Math.round(Math.sqrt(weights.length));
      } else {
        nLists = Math.round(weights.length / param);
      }
      var nRows = Math.ceil(weights.length / nLists);

      var nMissing = nLists * nRows - weights.length;

      var average = weights.getAverage();
      var weigthsCompleted = ListOperators.concat(weights, ListGenerators.createListWithSameElement(nMissing, average));
      var table = ListOperators.slidingWindowOnList(weigthsCompleted, nRows, nRows, 0);
      var sumList = table.getSums();
      var rectangleColumns = this.packingRectangles(sumList, 2, rectangle);

      rectangleList = List(); //new RectangleList();

      for(i = 0; i < nLists; i++) {
        rectangleList = ListOperators.concat(rectangleList, this.packingRectangles(table[i], 1, rectangleColumns[i]));
      }

      return rectangleList;
    case 6: //horizontal strips
  }
  return null;
};

/**
 * Squarified algorithm as described in (http://www.win.tue.nl/~vanwijk/stm.pdf)
 * @param {Rectangle} bounds Rectangle
 * @param {NumberList} list of weights
 *
 * @param {Boolean} weights are normalized
 * @param {Boolean} weights are sorted
 * @return {List} a list of Rectangles
 * tags:
 */
RectangleOperators.squarify = function(frame, weights, isNormalizedWeights, isSortedWeights) { //, funcionEvaluacionnWeights:Function=null):Array{
  if(weights == null) return;
  if(weights.length === 0) return new RectangleList();
  if(weights.length === 1) return new RectangleList(frame);

  isNormalizedWeights = isNormalizedWeights ? isNormalizedWeights : false;
  isSortedWeights = isSortedWeights ? isSortedWeights : false;
  var newWeightList;

  if(isNormalizedWeights) {
    newWeightList = weights; // new NumberList(arregloPesos);
  } else {
    newWeightList = NumberListOperators.normalizedToSum(weights);
  }

  var newPositions;
  if(!isSortedWeights) {
    newPositions = newWeightList.getSortIndexes(); // ListOperators.sortListByNumberList();// newWeightList.sortNumericIndexedDescending();
    newWeightList = ListOperators.sortListByNumberList(newWeightList, newWeightList);
  }

  var area = frame.width * frame.height;
  var rectangleList = new RectangleList();
  var freeRectangle = frame.clone();
  var subWeightList;
  var subRectangleList = new List(); //RectangleList();//
  var prevSubRectangleList;
  var proportion;
  var worstProportion;
  var index = 0;
  var subArea;
  var freeSubRectangle = new Rectangle();
  var nWeights = weights.length;
  var lastRectangle;
  var newRectangleList;
  var i, j;

  if(nWeights > 2) {
    var sum;
    for(i = index; i < nWeights; i++) {
      proportion = Number.MAX_VALUE;
      if(newWeightList[i] === 0) {
        rectangleList.push(new Rectangle(freeSubRectangle.x, freeSubRectangle.y, 0, 0));
      } else {
        for(j = 1; j < nWeights; j++) {
          subWeightList = newWeightList.slice(i, i + j); //NumberList.fromArray(newWeightList.slice(i, i+j));//
          prevSubRectangleList = subRectangleList.slice(); //.clone();
          sum = subWeightList.getSum();
          subArea = sum * area;
          freeSubRectangle.x = freeRectangle.x;
          freeSubRectangle.y = freeRectangle.y;
          if(freeRectangle.width > freeRectangle.height) { //column
            freeSubRectangle.width = subArea / freeRectangle.height;
            freeSubRectangle.height = freeRectangle.height;
          } else { //fila
            freeSubRectangle.width = freeRectangle.width;
            freeSubRectangle.height = subArea / freeRectangle.width;
          }

          subRectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, sum);
          worstProportion = subRectangleList.highestRatio; // RectangleOperators._getHighestRatio(subRectangleList);//
          if(proportion <= worstProportion) {
            break;
          } else {
            proportion = worstProportion;
          }
        }

        if(prevSubRectangleList.length === 0) {
          rectangleList.push(new Rectangle(freeRectangle.x, freeRectangle.y, freeRectangle.width, freeRectangle.height)); //freeRectangle.clone());
          if(rectangleList.length == nWeights) {
            if(!isSortedWeights) {
              newRectangleList = new List(); //RectangleList();
              for(i = 0; rectangleList[i] != null; i++) {
                newRectangleList[newPositions[i]] = rectangleList[i];
              }
              return newRectangleList;
            }
            return rectangleList;
          }
          index++;
        } else {
          rectangleList = rectangleList.concat(prevSubRectangleList);
          if(rectangleList.length == nWeights) {
            if(!isSortedWeights) {
              newRectangleList = new List();
              for(i = 0; rectangleList[i] != null; i++) {
                newRectangleList[newPositions[i]] = rectangleList[i];
              }
              return newRectangleList;
            }
            return rectangleList;
          }
          index += prevSubRectangleList.length;
          lastRectangle = prevSubRectangleList[prevSubRectangleList.length - 1];
          if(freeRectangle.width > freeRectangle.height) {
            freeRectangle.x = (lastRectangle.width + lastRectangle.x);
            freeRectangle.width -= lastRectangle.width;
          } else {
            freeRectangle.y = (lastRectangle.height + lastRectangle.y);
            freeRectangle.height -= lastRectangle.height;
          }
        }
        i = index - 1;
      }
    }
  } else if(nWeights == 2) {
    subWeightList = newWeightList.slice(); //.clone();
    freeSubRectangle = frame.clone();
    rectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, subWeightList.getSum());
  } else {
    rectangleList[0] = new Rectangle(frame.x, frame.y, frame.width, frame.height); //frame.clone();
  }


  if(!isSortedWeights) {
    newRectangleList = new List(); //RectangleList();//
    for(i = 0; rectangleList[i] != null; i++) {
      newRectangleList[newPositions[i]] = rectangleList[i];
    }
    return newRectangleList;
  }

  return rectangleList;
};

/**
 * partitionRectangle
 * @param {Rectangle} bounds Rectangle
 * @param {NumberList} normalizedWeight List
 *
 * @return {List} a list of Rectangles
 */
RectangleOperators.partitionRectangle = function(rectangle, normalizedWeightList, sum) {
  var area = rectangle.width * rectangle.height;
  var rectangleList = new List(); //RectangleList();
  var freeRectangle = new Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height); //rectangle.clone();
  var areai;
  var i;
  var rect;
  var highestRatio = 1;
  for(i = 0; i < normalizedWeightList.length; i++) {
    areai = normalizedWeightList[i] * area / sum;
    if(rectangle.width > rectangle.height) {
      rect = new Rectangle(freeRectangle.x, freeRectangle.y, areai / freeRectangle.height, freeRectangle.height);
      rectangleList.push(rect);
      freeRectangle.x += areai / freeRectangle.height;
      //rect.ratio = rect.width/rect.height;
    } else {
      rect = new Rectangle(freeRectangle.x, freeRectangle.y, freeRectangle.width, areai / freeRectangle.width);
      rectangleList.push(rect);
      freeRectangle.y += areai / freeRectangle.width;
      //rect.ratio = rect.height/rect.width;
    }
    rect.ratio = Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height);
    highestRatio = Math.max(highestRatio, rect.ratio);
  }

  rectangleList.highestRatio = highestRatio;

  return rectangleList;
};

/**
 * returns the highest ratio from a list of Rectangles
 * @param {List} rectangleList a Rectangle List
 *
 * @return {Number} highestRatio
 */
RectangleOperators._getHighestRatio = function(rectangleList) {
  var highestRatio = 1;
  var rectangle;
  var i;
  for(i = 0; i < rectangleList.length; i++) {
    rectangle = rectangleList[i];
    highestRatio = Math.max(highestRatio, rectangle.getRatio());
  }
  return highestRatio;
};
