function TreeConvertions(){};

/**
 * convert a table that describes a tree (higher hierarchies in first lists) into a Tree
 * @param {Table} table
 *
 * @param {String} fatherName name of father node
 * @param {Boolean} lastListIsWeights true if last list is a NumberList with weights for leaves
 * @return {Tree}
 * tags:convertion
 */
TreeConvertions.TableToTree = function(table, fatherName, lastListIsWeights){
	if(table==null) return;

	fatherName = fatherName==null?"father":fatherName;

	var tree = new Tree();
	var node, parent;
	var id;

	var father = new Node(fatherName, fatherName);
	tree.addNodeToTree(father, null);

	table.forEach(function(list, i){
		table[i].forEach(function(element, j){
			id = String(element)+"_"+i;
			node = tree.nodeList.getNodeById(id);
			if(node==null){
				node = new Node(id, String(element));
				if(i==0){
					tree.addNodeToTree(node, father);
				} else {
					parent = tree.nodeList.getNodeById(String(table[i-1][j])+"_"+(i-1));
					tree.addNodeToTree(node, parent);
				}
			}
		});
	});
	
	tree.assignDescentWeightsToNodes();

	c.log('tree', tree);

	return tree;
}