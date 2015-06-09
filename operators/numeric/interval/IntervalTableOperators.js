/**
 * @classdesc Provides a set of tools that work with {@link Table|Tables} of
 * Intervals.
 *
 * @namespace
 * @category numbers
 */
function IntervalTableOperators() {}


IntervalTableOperators.scaleIntervals = function(intervalTable, value) {
  var newIntervalTable = new Table();
  newIntervalTable.name = intervalTable.name;
  for(var i = 0; intervalTable[i] != null; i++) {
    newIntervalTable[i] = IntervalListOperators.scaleIntervals(intervalTable[i], value);
  }
  return newIntervalTable;
};
