import Tree from "src/dataTypes/structures/networks/Tree";
import Node from "src/dataTypes/structures/elements/Node";
import StringOperators from "src/operators/strings/StringOperators";

/**
 * @classdesc Tools to Encode Trees
 *
 * @namespace
 * @category networks
 */
function TreeEncodings() {}
export default TreeEncodings;

//include(frameworksRoot+"operators/strings/StringOperators.js");

/**
 * @todo write docs
 */
TreeEncodings.decodeIdentedTree = function(indexedTree, superiorNodeName, identationCharacter) {
  superiorNodeName = superiorNodeName == null ? "" : superiorNodeName;
  identationCharacter = identationCharacter == null ? "\t" : identationCharacter;

  var tree = new Tree();

  var lines = StringOperators.splitByEnter(indexedTree);
  var nLines = lines.length;

  if(nLines === 0 ||  (nLines == 1 && (lines[0] == null || lines[0] === ""))) return null;

  var i;
  var j;

  var line;
  var lineLength;
  var name;
  var level;

  var node;
  var parent;
  var superiorNode;

  if(superiorNodeName !== "" && superiorNodeName != null) {
    superiorNode = new Node(superiorNodeName, superiorNodeName);
    tree.addNodeToTree(superiorNode, null);
  }

  for(i = 0; i < nLines; i++) {
    line = lines[i];
    lineLength = line.length;
    //c.log('line:'+line);
    for(j = 0; j < lineLength; j++) {
      if(line.charAt(j) != identationCharacter) {
        name = line.substr(j);
        break;
      }
    }

    node = new Node(line, name);
    //c.log("+ ", name);
    if(j === 0) {
      if(superiorNode != null) {
        tree.addNodeToTree(node, superiorNode);
      } else {
        tree.addNodeToTree(node, null);
      }
    } else {
      level = j + 1 - Number(superiorNode == null);
      if(tree.getNodesByLevel(level - 1) != null && tree.getNodesByLevel(level - 1).length > 0) {
        parent = tree.getNodesByLevel(level - 1)[tree.getNodesByLevel(level - 1).length - 1];
      } else {
        parent = null;
      }
      //c.log("   ", node.name, "---------->>", parent.name);
      tree.addNodeToTree(node, parent);
    }
  }

  tree.assignDescentWeightsToNodes();

  return tree;
};
