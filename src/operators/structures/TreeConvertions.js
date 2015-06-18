import Tree from "src/dataStructures/structures/networks/Tree";
import Node from "src/dataStructures/structures/elements/Node";

function TreeConvertions() {}
export default TreeConvertions;

/**
 * convert a table that describes a tree (higher hierarchies in first lists) into a Tree
 * @param {Table} table
 *
 * @param {String} fatherName name of father node
 * @param {Boolean} lastListIsWeights true if last list is a NumberList with weights for leaves
 * @return {Tree}
 * tags:convertion
 */
TreeConvertions.TableToTree = function(table, fatherName, lastListIsWeights) {
  if(table == null) return;

  fatherName = fatherName == null ? "father" : fatherName;

  var tree = new Tree();
  var node, parent;
  var id;
  var iCol;

  var father = new Node(fatherName, fatherName);
  tree.addNodeToTree(father, null);

  table.forEach(function(list, i) {
    table[i].forEach(function(element, j) {
      id = TreeConvertions.getId(table, i, j);
      node = tree.nodeList.getNodeById(id);
      if(node == null) {
        node = new Node(id, String(element));
        if(i == 0) {
          tree.addNodeToTree(node, father);
        } else {
          parent = tree.nodeList.getNodeById(TreeConvertions.getId(table, i - 1, j));
          tree.addNodeToTree(node, parent);
        }
      }
    });
  });

  tree.assignDescentWeightsToNodes();

  return tree;
};
TreeConvertions.getId = function(table, i, j) {
  var iCol = 1;
  var id = String(table[0][j]);
  while(iCol <= i) {
    id += "_" + String(table[iCol][j]);
    iCol++;
  }
  return id;
};