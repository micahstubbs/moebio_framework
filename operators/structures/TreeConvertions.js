function TreeConvertions(){};

/**
 * convert a table that describes a tree (higher hierarchies in first lists) into a Tree
 * @param {Table} table
 * @return {Tree}
 * tags:convertion
 */
TreeConvertions.TableToTree = function(table){
	if(table==null) return;
	
	var tree = new Tree();
	var node, parent;
	var id;

	table.forEach(function(list, i){
		table[i].forEach(function(element, j){
			id = String(element)+"_"+i;
			node = tree.nodeList.getNodeById(id);
			if(node==null){
				node = new Node(id, String(element));
				if(i==0){
					tree.addNodeToTree(node, null);
				} else {
					parent = tree.nodeList.getNodeById(String(table[i-1][j])+"_"+(i-1));
					tree.addNodeToTree(node, parent);
				}
			}
		});
	});
	

	c.log('tree', tree);

	return tree;
}