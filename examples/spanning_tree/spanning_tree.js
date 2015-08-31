window.onload = function() {
  var network;
  var iOver;
  var spanTree;
  var iSelected = -1;

  new mo.Graphics({
    container: "#maindiv",
    /*
     * init
     * All Moebio Framework visualizations use init to setup variables.
     * These variables are used in the cycle function.
     */
    init:  function(){
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
    },

    /*
     * The cycle function is called repeatedly to display the visualization.
     * Here we render the network for each iteration.
     */
    cycle: function(){
      var i;
      var node;
      var relation;

      this.forces.calculate();
      this.forces.applyForces();

      if(iSelected!=-1){
        node = network.nodeList[iSelected];

        this.setStroke(255,0,0,0.8);

        for(i=0; spanTree.relationList[i]!=null; i++){
          relation = spanTree.relationList[i];
          this.setLW(0.1+10/(relation.node0.level+0.5)); //stroke weight inverse relation with node level
          this.line(relation.node0.node.x+this.cX, relation.node0.node.y+this.cY,
               relation.node1.node.x+this.cX, relation.node1.node.y+this.cY
              );
        }
      }


      //relations
      this.setStroke('rgba(0,0,0,0.3)', 1);

      for(i=0; network.relationList[i]!=null; i++){
        relation = network.relationList[i];
        this.line(relation.node0.x+this.cX, relation.node0.y+this.cY,
             relation.node1.x+this.cX, relation.node1.y+this.cY
            );
      }

      //nodes

      iOver = -1;

      for(i=0; network.nodeList[i]!=null; i++){
        node = network.nodeList[i];
        this.setFill(0,0,0,0.6);

        if(this.fCircleM(node.x+this.cX, node.y+this.cY, node.radius, 12)) {
          iOver = i;
        }

        this.setText('white', node.radius, null, 'center', 'middle');
        this.fText(node.name, node.x+this.cX, node.y+this.cY);
      }

      var previSelected = iSelected;

      if(iOver!=-1){
        node = network.nodeList[iOver];

        this.setStroke('black', 2);
        this.sCircle(node.x+this.cX, node.y+this.cY, node.radius+3);

        this.setCursor('pointer');
        if(this.MOUSE_DOWN){
          iSelected = iOver;
          // relative distance of node to cursor, to be kept when dragging node
          node.__dXCursor = node.x - this.mX;
          node.__dYCursor = node.y - this.mY;
        }

      } else {
        if(this.MOUSE_DOWN) {
          iSelected = -1;
        }
      }

      if(iSelected!=-1 && previSelected != iSelected){
        spanTree = mo.NetworkOperators.spanningTree(network, node);
      }

      if(this.MOUSE_PRESSED && iSelected!=-1){
        this.setCursor('this.e');
        node = network.nodeList[iSelected];
        node.x = this.mX+node.__dXCursor;//node is dragged, and relative distance at the this.ent of clicking, remains
        node.y = this.mY+node.__dYCursor;
      }

    }
  });

};
