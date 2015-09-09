import Polygon from "src/dataTypes/geometry/Polygon";
import Point from "src/dataTypes/geometry/Point";
import Network from "src/dataTypes/structures/networks/Network";
import Node from "src/dataTypes/structures/elements/Node";
import Relation from "src/dataTypes/structures/elements/Relation";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/**
 * @classdesc NumberTable Conversions
 *
 * @namespace
 * @category numbers
 */
function NumberTableConversions() {}
export default NumberTableConversions;

/**
 * converts a numberTable with at least two lists into a Polygon
 *
 * @param  {NumberTable} numberTable with at least two numberLists
 * @return {Polygon}
 * tags:conversion
 */
NumberTableConversions.numberTableToPolygon = function(numberTable) {
  if(numberTable.length < 2) return null;

  var i;
  var n = Math.min(numberTable[0].length, numberTable[1].length);
  var polygon = new Polygon();

  for(i = 0; i < n; i++) {
    polygon[i] = new Point(numberTable[0][i], numberTable[1][i]);
  }

  return polygon;
};




/**
 * Converts NumberTable to a {@link Network}.
 *
 * @param {NumberTable} numberTable to convert.
 * @param {Number} method Method to use. Currently only method 0 implemented
 * @param {Number} tolerance Defaults to 0.
 * @return {Network}
 */
NumberTableConversions.numberTableToNetwork = function(numberTable, method, tolerance) {
  tolerance = tolerance == null ? 0 : tolerance;

  var network = new Network();

  var list0;
  var list1;

  var i;
  var j;

  var node0;
  var node1;
  var relation;


  switch(method) {
    case 0: // standard deviation

      var sd;
      var w;

      for(i = 0; numberTable[i + 1] != null; i++) {
        list0 = numberTable[i];

        if(i === 0) {
          node0 = new Node(list0.name, list0.name);
          network.addNode(node0);
        } else {
          node0 = network.nodeList[i];
        }


        for(j = i + 1; numberTable[j] != null; j++) {
          list1 = numberTable[j];

          if(i === 0) {
            node1 = new Node(list1.name, list1.name);
            network.addNode(node1);
          } else {
            node1 = network.nodeList[j];
          }



          list1 = numberTable[j];
          sd = NumberListOperators.standardDeviationBetweenTwoNumberLists(list0, list1);

          w = 1 / (1 + sd);

          if(w >= tolerance) {
            relation = new Relation(i + "_" + j, node0.name + "_" + node1.name, node0, node1, w);
            network.addRelation(relation);
          }
        }
      }

      break;
    case 1:
      break;
    case 2:
      break;
  }

  return network;
};
