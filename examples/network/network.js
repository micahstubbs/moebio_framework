window.onload = function() {
  /*
   * Network
   * Demonstration of using the Moebio Framework and its random network generator
   * to create a random network and display it on the canvas. Uses the
   *
   */
  var network;

  var N_NODES = 2000; // Number of nodes to put in visualization
  var P_RELATION = 0.0006; //probablity that any two nodes are connected

  new mo.Graphics({
    container: "#maindiv",
    /*
     * init
     * All Moebio Framework visualizations use init to setup variables.
     * These variables are used in the cycle function.
     */
    init: function(){
      // create a sample network using NetworkGenerators
      network = mo.NetworkGenerators.createRandomNetwork(N_NODES, P_RELATION, 1);

      this.forces = new mo.Forces({
        dEqSprings:30,
        dEqRepulsors:120,
        k:0.001,
        friction:0.9
      });

      // apply the forces to the network
      this.forces.forcesForNetwork(network, 400, new mo.Point(0, 0), 1, true);
    },

    /*
     * The cycle function is called repeatedly to display the visualization.
     * Here we render the network for each iteration.
     */
    cycle: function(){
      var i;
      var node;
      var relation;
      var isOverCircle;
      var iOver = null;

      // update the forces applied to this network
      this.forces.calculate();
      this.forces.applyForces();

      // set the drawing stroke to be black and thin
      this.setStroke('black', 0.2);


      // for each edge in the network, create a line connecting them
      for(i=0; network.relationList[i] != null; i++){
        relation = network.relationList[i];
        // cX, cY are the coordinates of the center of the canvas
        this.line(relation.node0.x + this.cX, relation.node0.y + this.cY,
             relation.node1.x + this.cX, relation.node1.y+ this.cY
            );
      }

      this.setFill('black');

      // for each node in the network, draw it
      for(i=0; network.nodeList[i] != null; i++){
        node = network.nodeList[i];

        // draws a node with radius = (2x number of node connections + 2) px, and detects wether the cursor is hovering
        isOverCircle = this.fCircleM(node.x + this.cX, node.y + this.cY, 2*node.nodeList.length+2);
        if(isOverCircle) {
          iOver = i;
        }
      }

      // for the circle that is being hovered over,
      // if it exists, make a outlined circle
      if(iOver != null){
        this.setStroke('black', 4);
        node = network.nodeList[iOver];
        this.sCircle(node.x + this.cX, node.y + this.cY, 2*node.nodeList.length + 10);
        this.setCursor('pointer');
      }
    }
  });

};
