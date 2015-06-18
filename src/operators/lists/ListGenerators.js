import NumberList from "src/dataStructures/numeric/NumberList";
import StringList from "src/dataStructures/strings/StringList";
import Table from "src/dataStructures/lists/Table";
import NumberTable from "src/dataStructures/numeric/NumberTable";
import List from "src/dataStructures/lists/List";
import RectangleList from "src/dataStructures/geometry/RectangleList";
import { typeOf } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc Create default lists
 *
 * @namespace
 * @category basics
 */
function ListGenerators() {}
export default ListGenerators;


/**
 * Generates a List made of several copies of same element (returned List is improved)
 * @param {Object} nValues length of the List
 * @param {Object} element object to be placed in all positions
 * @return {List} generated List
 * tags:generator
 */
ListGenerators.createListWithSameElement = function(nValues, element) {
  var list;
  switch(typeOf(element)) {
    case 'number':
      list = new NumberList();
      break;
    case 'List':
      list = new Table();
      break;
    case 'NumberList':
      list = new NumberTable();
      break;
    case 'Rectangle':
      list = new RectangleList();
      break;
    case 'string':
      list = new StringList();
      break;
    case 'boolean':
      list = new List(); //TODO:update once BooleanList exists
      break;
    default:
      list = new List();
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
