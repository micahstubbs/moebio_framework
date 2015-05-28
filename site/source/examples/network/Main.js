var network;

var N_NODES = 2000;
var P_RELATION = 0.0006; //probablity that any two nodes are connected

init=function(){
	network = NetworkGenerators.createRandomNetwork(N_NODES, P_RELATION, 1);
	
	this.forces = new Forces({
		dEqSprings:30,
		dEqRepulsors:120,
		k:0.001,
		friction:0.9
	});
	
	this.forces.forcesForNetwork(network, 400, new Point(0, 0), 1, true);
}


resizeWindow = function(){

}


cycle=function(){
	var i;
	var node;
	var relation;
	var isOverCircle;
	var iOver = null;
	
	this.forces.calculate();
	this.forces.applyForces();
	
	setStroke('black', 0.2);

	//cX, cY are the coordinates of the center of the window
	
	for(i=0; network.relationList[i]!=null; i++){
		relation = network.relationList[i];
		line(relation.node0.x+cX, relation.node0.y+cY,
			relation.node1.x+cX, relation.node1.y+cY
		);
	}
	
	setFill('black');
	
	for(i=0; network.nodeList[i]!=null; i++){
		node = network.nodeList[i];

		//draws a node with radius = (2x number of node connections + 2) px, and detects wether the cursor is hovering
		overCircle = fCircleM(node.x+cX, node.y+cY, 2*node.nodeList.length+2);
		if(overCircle) iOver = i;
	}

	if(iOver!=null){
		setStroke('black', 4);
		node = network.nodeList[iOver];
		sCircle(node.x+cX, node.y+cY, 2*node.nodeList.length + 10);
		setCursor('pointer');
	}
}
