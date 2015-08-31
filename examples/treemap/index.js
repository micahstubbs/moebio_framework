/*
  This example renders a treemap using the built in 
  TreeDraw function.
 */

/**
 * Create the actual tree.
 * @return {mo.Tree}
 */
function makeTree(){
  var tree = new mo.Tree();
  var parent = new mo.Node('root', 'root');
  var child1 = new mo.Node('c1', 'c1');
  var child2 = new mo.Node('c2', 'c2');

  tree.addNodeToTree(parent);
  tree.addNodeToTree(child1, parent);
  tree.addNodeToTree(child2, parent);

  return tree;
}


function displayTree() {
  var tree = makeTree();
  var state = {};

  // Since the methods are short, we will just define
  // our init and cycle functions inline.
  var g = new mo.Graphics({
    'container': '#container',
    'dimensions': {
      width: 600,
      height: 500
    },

    init: function() { 
      state.frame = new mo.Rectangle(20,20, 400, 400);
      state.colorList = new mo.ColorList('Azure', 'blue', 'green');
      state.weights = new mo.NumberList(2,6);
      state.textColor = "black";
    },

    cycle: function() {
      // Draw the treemap with the built in functionality
      // this will also provide selection and zoom pan interaction
      // for free.
      mo.TreeDraw.drawTreemap(
        state.frame,
        tree,
        state.colorList, 
        state.weights,
        state.textColor,
        null,
        this
      );
    }
  });

  g.setAlphaRefresh(1);
  g.setBackgroundColor("AntiqueWhite");
}

window.onload = function() {
  displayTree();
};
