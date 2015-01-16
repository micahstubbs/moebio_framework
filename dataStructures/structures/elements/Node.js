Node.prototype = new DataModel();
Node.prototype.constructor=Node;

/**
* Node 
* @param {String} id ID of the Node
* @param {String} name string (label) name to be assigned to node
* @constructor
*/
function Node (id, name) {
    this.id = id==null?'':id;
    this.name = name!=null?name:'';
    this.type="Node";
    
    this.nodeType;
    
    this.x=0;
    this.y=0;
    this.z=0;
    
    this.nodeList=new NodeList();
    this.relationList=new RelationList();
    
    this.toNodeList = new NodeList();
    this.toRelationList = new RelationList();
    
    this.fromNodeList = new NodeList();
    this.fromRelationList = new RelationList();
    
    this.weight = 1;
    this.descentWeight = 1;
    
    //tree
    this.level=0;
    this.parent=null;
    
    //physics:
    this.vx=0;
    this.vy=0;
    this.vz=0;
    this.ax=0;
    this.ay=0;
    this.az=0;
}

Node.prototype.cleanRelations=function(){
	this.nodeList=new NodeList();
    this.relationList=new RelationList();
    
    this.toNodeList = new NodeList();
    this.toRelationList = new RelationList();
    
    this.fromNodeList = new NodeList();
    this.fromRelationList = new RelationList();
}

//TODO: complete with all properties
Node.prototype.destroy=function(){
	DataModel.prototype.destroy.call(this);
	delete this.id;
    delete this.name;
    delete this.nodeType;
    delete this.x;
    delete this.y;
    delete this.z;
    delete this.nodeList;
    delete this.relationList;
    delete this.toNodeList;
    delete this.toNodeList;
    delete this.fromNodeList;
    delete this.fromRelationList;
    delete this.parent;
    delete this.weight;
    delete this.descentWeight;
    delete this.level;
    delete this.vx;
    delete this.vy;
    delete this.vz;
    delete this.ax;
    delete this.ay;
    delete this.az;
}


//treeProperties:
Node.prototype.getParent=function(){
	return this.parent;
}

/**
 * return the leaves under a node in a Tree, [!] if the network is not a tree this method could run infinite loops
 * @return {NodeList}
 * tags:
 */
Node.prototype.getLeaves=function(){
    var leaves = new NodeList();
    var addLeaves = function(node){
        if(node.toNodeList.length==0){
            leaves.addNode(node);
            return;
        }
        node.toNodeList.forEach(addLeaves);
    }
    addLeaves(this);
    return leaves;
}
//


// Node.prototype.toString=function(){
// 	return this.name+", "+this.id;
// }

Node.prototype.clone=function(){
	var newNode = new Node(this.id, this.name);
	
	newNode.x = this.x;
	newNode.y = this.y;
	newNode.z = this.z;
	
	newNode.nodeType = this.nodeType;
	
	newNode.weight = this.weight;
	newNode.descentWeight = this.descentWeight;
	
	return newNode; 
}


