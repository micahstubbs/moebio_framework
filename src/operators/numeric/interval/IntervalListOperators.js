import List from "src/dataTypes/lists/List";

/**
 * @classdesc Provides a set of tools that work with Interval Lists.
 *
 * @namespace
 * @category numbers
 */
function IntervalListOperators() {}
export default IntervalListOperators;


/**
 * @todo write docs
 */
IntervalListOperators.scaleIntervals = function(intervalList, value) {
  var newIntervalList = new List();
  newIntervalList.name = intervalList.name;
  for(var i = 0; intervalList[i] !== null; i++) {
    newIntervalList[i] = intervalList[i].getScaled(value);
  }
  return newIntervalList;
};
