
var network;
var iOver;
var spanTree;
var iSelected = -1;

/*
 * init
 * Moebio Framework visualizations use init to setup variables.
 * These variables are used in the cycle function.
 */
init = function(){
  network = mo.NetworkGenerators.createRandomNetwork(1200, 0.001, 1);
  network.removeIsolatedNodes();

  this.forces = new mo.Forces({
    dEqSprings:60,
    dEqRepulsors:120,
    k:0.001,
    friction:0.85
  });

  this.forces.forcesForNetwork(network, 200, new mo.Point(0, 0), 1, true);

  network.nodeList.forEach(function(node, i){
    node.name = String(i);
    node.radius = 4+node.nodeList.length*2;
  });
};


/*
 * The cycle function is called repeatedly to display the visualization.
 * Here we render the network on each iteration of the render loop.
 */
cycle = function(){
  var i;
  var node;
  var relation;

  this.forces.calculate();
  this.forces.applyForces();

  if(iSelected!=-1){
    node = network.nodeList[iSelected];

    mo.setStroke(255,0,0,0.8);

    for(i=0; spanTree.relationList[i]!=null; i++){
      relation = spanTree.relationList[i];
      mo.setLW(0.1+10/(relation.node0.level+0.5)); //stroke weight inverse relation with node level
      mo.line(relation.node0.node.x+mo.cX, relation.node0.node.y+mo.cY,
           relation.node1.node.x+mo.cX, relation.node1.node.y+mo.cY
          );
    }
  }


  //relations
  mo.setStroke('rgba(0,0,0,0.3)', 1);

  for(i=0; network.relationList[i]!=null; i++){
    relation = network.relationList[i];
    mo.line(relation.node0.x+mo.cX, relation.node0.y+mo.cY,
         relation.node1.x+mo.cX, relation.node1.y+mo.cY
        );
  }

  //nodes

  iOver = -1;

  for(i=0; network.nodeList[i]!=null; i++){
    node = network.nodeList[i];
    mo.setFill(0,0,0,0.6);

    if(mo.fCircleM(node.x+mo.cX, node.y+mo.cY, node.radius, 12)) {
      iOver = i;
    }

    mo.setText('white', node.radius, null, 'center', 'middle');
    mo.fText(node.name, node.x+mo.cX, node.y+mo.cY);
  }

  var previSelected = iSelected;

  if(iOver!=-1){
    node = network.nodeList[iOver];

    mo.setStroke('black', 2);
    mo.sCircle(node.x+mo.cX, node.y+mo.cY, node.radius+3);

    mo.setCursor('pointer');
    if(mo.MOUSE_DOWN){
      iSelected = iOver;
      // relative distance of node to cursor, to be kept when dragging node
      node.__dXCursor = node.x - mo.mX;
      node.__dYCursor = node.y - mo.mY;
    }

  } else {
    if(mo.MOUSE_DOWN) {
      iSelected = -1;
    }
  }

  if(iSelected!=-1 && previSelected != iSelected){
    spanTree = mo.NetworkOperators.spanningTree(network, node);
  }

  if(mo.MOUSE_PRESSED && iSelected!=-1){
    mo.setCursor('move');
    node = network.nodeList[iSelected];
    node.x = mo.mX+node.__dXCursor;//node is dragged, and relative distance at the moment of clicking, remains
    node.y = mo.mY+node.__dYCursor;
  }

};
