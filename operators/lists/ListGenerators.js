/**
 * static class with methods to generate different kinds of Lists
 * 
 * @constructor
 */
function ListGenerators() {}


/**
 * Generates a List made of several copies of same element (returned List is improved)
 * @param {Object} nValues length of the List
 * @param {Object} element object to be placed in all positions
 * @return {List} generated List
 * tags:generator
 */
ListGenerators.createListWithSameElement = function(nValues, element) {
  switch(typeOf(element)) {
    case 'number':
      var list = new NumberList();
      break;
    case 'List':
      var list = new Table();
      break;
    case 'NumberList':
      var list = new NumberTable();
      break;
    case 'Rectangle':
      var list = new RectamgleList();
      break;
    case 'string':
      var list = new StringList();
      break;
    case 'boolean':
      var list = new List(); //TODO:update once BooleanList exists
      break;
    default:
      var list = new List();
  }

  for(var i = 0; i < nValues; i++) {
    list[i] = element;
  }
  return list;
};

/**
 * Generates a List built froma seed element and a function that will be applied iteratively
 * @param {Object} nValues length of the List
 * @param {Object} firstElement first element
 * @param {Object} dynamicFunction sequence generator function, elementN+1 =  dynamicFunction(elementN)
 * @return {List} generated List
 */
ListGenerators.createIterationSequence = function(nValues, firstElement, dynamicFunction) {
  var list = ListGenerators.createListWithSameElement(1, firstElement);
  for(var i = 1; i < nValues; i++) {
    list[i] = dynamicFunction(list[i - 1]);
  }
  return list;
};