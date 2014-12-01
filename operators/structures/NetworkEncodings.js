function NetworkEncodings(){};


//////////////GDF

/**
 * decodes a GDF string and builds a network
 * @param  {String} gdfCode
 * @return {Network}
 * tags:decoder
 */
NetworkEncodings.decodeGDF = function(gdfCode){
	if(gdfCode==null || gdfCode=="") return;

	var network = new Network();
	var lines = gdfCode.split("\n"); //TODO: split by ENTERS OUTSIDE QUOTEMARKS
	if(lines.length==0) return null;
	var line;
	var i;
	var j;
	var parts;
	
	var nodesPropertiesNames = lines[0].substr(8).split(",");
	
	var iEdges;
	
	for(i=1; lines[i]!=null; i++){
		line = lines[i];
		if(line.substr(0,8)=="edgedef>"){
			iEdges = i+1;
			break;
		}
		line = NetworkEncodings.replaceChomasInLine(line);
		parts = line.split(",");
		node = new Node(String(parts[0]),String(parts[1]));
		for(j=0;(nodesPropertiesNames[j]!=null && parts[j]!=null);j++){
			if(nodesPropertiesNames[j]=="weight"){
				node.weight = Number(parts[j]);
			} else if(nodesPropertiesNames[j]=="x"){
				node.x = Number(parts[j]);
			} else if(nodesPropertiesNames[j]=="y"){
				node.y = Number(parts[j]);
			} else {
				node[nodesPropertiesNames[j]] = parts[j].replace(/\*CHOMA\*/g, ",");
			}
		}
		network.addNode(node);
	}
	
	var relationsPropertiesNames = lines[iEdges-1].substr(8).split(",");
	
	for(i=iEdges; lines[i]!=null; i++){
		line = lines[i];
		line = NetworkEncodings.replaceChomasInLine(line);
		parts = line.split(",");
		if(parts.length>=2){
			node0 = network.nodeList.getNodeById(String(parts[0]));
			node1 = network.nodeList.getNodeById(String(parts[1]));
			if(node0==null || node1==null){
				c.log("NetworkEncodings.decodeGDF | [!] problems with nodes ids:", parts[0], parts[1], "at line", i);
			} else {
				id = node0.id+"_"+node1.id+"_"+Math.floor(Math.random()*999999);
				relation = new Relation(id, id, node0, node1);
				for(j=2;(relationsPropertiesNames[j]!=null && parts[j]!=null);j++){
					if(relationsPropertiesNames[j]=="weight"){
						relation.weight = Number(parts[j]);
					} else {
						relation[relationsPropertiesNames[j]] = parts[j].replace(/\*CHOMA\*/g, ",");
					}
				}
				network.addRelation(relation);
			}
		}
		
	}
	
	return network;
}

/**
 * encodes a network in formatt GDF, more info: https://gephi.org/users/supported-graph-formats/gml-format/
 * @param  {Network} network
 * 
 * @param  {StringList} nodesPropertiesNames names of nodes properties to be encoded
 * @param  {StringList} relationsPropertiesNames names of relations properties to be encoded
 * @return {String}
 * tags:encoder
 */
NetworkEncodings.encodeGDF = function(network, nodesPropertiesNames, relationsPropertiesNames){
	if(network==null) return;

	nodesPropertiesNames = nodesPropertiesNames==null?new StringList():nodesPropertiesNames;
	relationsPropertiesNames = relationsPropertiesNames==null?new StringList():relationsPropertiesNames;
	
	var code = "nodedef>id"+(nodesPropertiesNames.length>0?",":"")+nodesPropertiesNames.join(",");
	var i;
	var j;
	var node;
	for(i=0;network.nodeList[i]!=null;i++){
		node = network.nodeList[i];
		code+="\n"+node.id;
		for(j=0;nodesPropertiesNames[j]!=null;j++){
			
			if(typeof node[nodesPropertiesNames[j]] == 'string'){
				code+=",\""+node[nodesPropertiesNames[j]]+"\"";
			} else {
				code+=","+node[nodesPropertiesNames[j]];
			}
		}
	}
	
	code+="\nedgedef>id0,id1"+(relationsPropertiesNames.length>0?",":"")+relationsPropertiesNames.join(",");
	var relation;
	for(i=0;network.relationList[i]!=null;i++){
		relation = network.relationList[i];
		code+="\n"+relation.node0.id+","+relation.node1.id;
		for(j=0;relationsPropertiesNames[j]!=null;j++){
			
			if(typeof relation[relationsPropertiesNames[j]] == 'string'){
				code+=",\""+relation[relationsPropertiesNames[j]]+"\"";
			} else {
				code+=","+relation[relationsPropertiesNames[j]];
			}
		}
	}
	
	return code;
}


//////////////GML

/**
 * decodes a GML file into a network
 * @param  {String} gmlCode
 * @return {Network}
 * tags:decoder
 */
NetworkEncodings.decodeGML = function(gmlCode){
	if(gmlCode==null) return null;
	
	gmlCode = gmlCode.substr(gmlCode.indexOf("[")+1);
	
	var network = new Network();
	
	var firstEdgeIndex = gmlCode.search(/\bedge\b/);
	
	var nodesPart = gmlCode.substr(0, firstEdgeIndex);
	var edgesPart = gmlCode.substr(firstEdgeIndex);
	
	var part = nodesPart;
	
	var blocks = StringOperators.getParenthesisContents(part, true);
	
	//c.log('blocks.length', blocks.length);
	
	var graphicsBlock;
	var lines;
	var lineParts;
	
	var indexG0;
	var indexG1;
	
	var node;
	
	for(var i=0; blocks[i]!=null; i++){
		blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\n");
		blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\r");
		
		indexG0 = blocks[i].indexOf('graphics');
		if(indexG0!=-1){
			indexG1 = blocks[i].indexOf(']');
			graphicsBlock = blocks[i].substring(indexG0, indexG1+1);
			blocks[i] = blocks[i].substr(0, indexG0)+blocks[i].substr(indexG1+1);
			
			graphicsBlock = StringOperators.getFirstParenthesisContent(graphicsBlock, true);
			blocks[i] = blocks[i]+graphicsBlock;
		}
		
		lines = blocks[i].split('\n');
		
		lines[0] = NetworkEncodings._cleanLineBeginning(lines[0]);
		
		lineParts = lines[0].split(" ");
		
		node = new Node(StringOperators.removeQuotes(lineParts[1]), StringOperators.removeQuotes(lineParts[1]));
		
		network.addNode(node);
		
		for(var j=1; lines[j]!=null; j++){
			lines[j] = NetworkEncodings._cleanLineBeginning(lines[j]);
			lines[j] = NetworkEncodings._replaceSpacesInLine(lines[j]);
			if(lines[j]!=""){
				lineParts = lines[j].split(" ");
				if(lineParts[0]=='label') lineParts[0] = 'name';
				node[lineParts[0]] = (lineParts[1].charAt(0)=="\"")?StringOperators.removeQuotes(lineParts[1]).replace(/\*SPACE\*/g, " "):Number(lineParts[1]);
			}
		}
		
		
		
	}
	
	part = edgesPart;
	blocks = StringOperators.getParenthesisContents(part, true);
	
	var id0;
	var id1;
	var node0;
	var node1;
	var relation;
	var nodes = network.nodeList;
	
	
	for(i=0; blocks[i]!=null; i++){
		blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\n");
		blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\r");
		
		lines = blocks[i].split('\n');
		
		id0=null;
		id1=null;
		relation=null;
		
		for(j=0; lines[j]!=null; j++){
			lines[j] = NetworkEncodings._cleanLineBeginning(lines[j]);
			if(lines[j]!=""){
				lineParts = lines[j].split(" ");
				if(lineParts[0]=='source') id0 = StringOperators.removeQuotes(lineParts[1]);
				if(lineParts[0]=='target') id1 = StringOperators.removeQuotes(lineParts[1]);
				
				if(relation==null){
					if(id0!=null && id1!=null){
						node0 = nodes.getNodeById(id0);
						node1 = nodes.getNodeById(id1);
						if(node0!=null && node1!=null){
							relation = new Relation(id0+" "+id1, '', node0, node1);
							network.addRelation(relation);
						}
					}
				} else {
					if(lineParts[0]=='value') lineParts[0]='weight';
					relation[lineParts[0]] = (lineParts[1].charAt(0)=="\"")?StringOperators.removeQuotes(lineParts[1]):Number(lineParts[1]);
				}
			}
			
		}
		
	}
	
	return network;
}
NetworkEncodings._cleanLineBeginning = function(string){
	string = StringOperators.removeInitialRepeatedCharacter(string, "\n");
	string = StringOperators.removeInitialRepeatedCharacter(string, "\r");
	string = StringOperators.removeInitialRepeatedCharacter(string, " ");
	string = StringOperators.removeInitialRepeatedCharacter(string, "	");
	return string;
}


/**
 * encodes a network in format GDF
 * @param  {Network} network
 * 
 * @param  {StringList} nodesPropertiesNames names of nodes' properties to encode
 * @param  {StringList} relationsPropertiesNames names or relations' properties to encode
 * @param {Boolean} idsAsInts GDF strong specification requires ids for nodes being int numbers
 * @return {String} GDF string
 * tags:encoder
 */
NetworkEncodings.encodeGML = function(network, nodesPropertiesNames, relationsPropertiesNames, idsAsInts){
	if(network==null) return;

	idsAsInts = idsAsInts==null?true:idsAsInts;
	
	nodesPropertiesNames = nodesPropertiesNames==null?new StringList():nodesPropertiesNames;
	relationsPropertiesNames = relationsPropertiesNames==null?new StringList():relationsPropertiesNames;
	
	var code = "graph\n[";
	var ident = "	";
	var i;
	var j;
	var node;
	var isString;
	var value;
	for(i=0;network.nodeList[i]!=null;i++){
		node = network.nodeList[i];
		code+="\n"+ident+"node\n"+ident+"[";
		ident="		";
		if(idsAsInts){
			code+="\n"+ident+"id "+i;
		} else {
			code+="\n"+ident+"id \""+node.id+"\"";
		}
		if(node.name!='') code+="\n"+ident+"label \""+node.name+"\"";
		for(j=0;nodesPropertiesNames[j]!=null;j++){
			value = node[nodesPropertiesNames[j]];
			if(value==null) continue;
			if(value.getMonth) value = DateOperators.dateToString(value);
			isString = (typeof value == 'string');
			if(isString) value = value.replace(/\n/g, "\\n").replace(/\"/g, "'");
			code+="\n"+ident+nodesPropertiesNames[j]+" "+(isString?"\""+value+"\"":value);
		}
		ident = "	";
		code+="\n"+ident+"]";
	}
	
	var relation;
	for(i=0;network.relationList[i]!=null;i++){
		relation = network.relationList[i];
		code+="\n"+ident+"edge\n"+ident+"[";
		ident="		";
		if(idsAsInts){
			code+="\n"+ident+"source "+network.nodeList.indexOf(relation.node0);
			code+="\n"+ident+"target "+network.nodeList.indexOf(relation.node1);
		} else {
			code+="\n"+ident+"source \""+relation.node0.id+"\"";
			code+="\n"+ident+"target \""+relation.node1.id+"\"";
		}
		for(j=0;relationsPropertiesNames[j]!=null;j++){
			value = relation[relationsPropertiesNames[j]];
			if(value==null) continue;
			if(value.getMonth) value = DateOperators.dateToString(value);
			isString = (typeof value == 'string');
			if(isString) value = value.replace(/\n/g, "\\n").replace(/\"|“|”/g, "'");
			code+="\n"+ident+relationsPropertiesNames[j]+" "+(isString?"\""+value+"\"":value);
		}
		ident = "	";
		code+="\n"+ident+"]";
	}
	
	code+="\n]";
	return code;
}


//////////////NoteWork

NetworkEncodings.nodeNameSeparators = ['|', ':',  ' is ', ' are ', ','];

/**
 * converts a text file under NoteWork format into a network
 * @param  {String} code
 * @return {Network}
 * tags:decoding
 */
NetworkEncodings.decodeNoteWork = function(code){
	if(code==null) return;
	if(code=="") return new Network();

	//c.l('\n\n*************////////// decodeNoteWork //////////*************');
	//code = "\n"+code;
	
	var i,j;
	var paragraph, line, simpleLine;
	var id,id2;
	var name;
	var index, index2, minIndex;
	var lines;
	var node, otherNode;
	var supNode = null;
	var relation;
	var prevLine;
	var sep;
	var colorLines = [];
	var colorSegments = [];
	var linesInfo = [];
	var simpleLine;
	var regex;
	var iEnd;
	
	var network = new Network();

	var paragraphs = new StringList();
	var left = code;


	index = left.search(/\n\n./g);

	while(index!=-1){
		
		paragraphs.push(left.substr(0, index));

		left = left.substr(index+2);

		index = left.search(/\n\n./g);
	}

	paragraphs.push(left);


	var nLineParagraph = 0;

	paragraphs.forEach(function(paragraph, i){

		if(paragraph.indexOf('\n')==-1){
			line = paragraph;
			lines = null;
		} else { 
			//lines = paragraph.split(/\n|\./g);
			lines = paragraph.split(/\n/g);
			line = lines[0];
		}


		if(line=='\n' || line=='' || line==' ' || line=='  '){//use regex here
			
		} else if(line.indexOf('//')==0){
			
			if(colorSegments[nLineParagraph]==null) colorSegments[nLineParagraph]=[];

			colorSegments[nLineParagraph].push({
				type:'comment',
				iStart:0,
				iEnd:line.length
			});

		} else if(line.indexOf(':')!=-1 && ColorOperators.colorStringToRGB(line.split(':')[1])!=null){// color in relations
			colorLines.push(line);

			if(colorSegments[nLineParagraph]==null) colorSegments[nLineParagraph]=[];

			colorSegments[nLineParagraph].push({
				type:'relation_color',
				iStart:0,
				iEnd:line.length
			});

			if(lines){
				lines.slice(1).forEach(function(line, i){

					index = line.indexOf(':');
					if(index!=-1 && ColorOperators.colorStringToRGB(line.split(':')[1])!=null){
						//c.l('  more colors!');

						colorLines.push(line);
						
						if(colorSegments[nLineParagraph+i]==null) colorSegments[nLineParagraph+i]=[];

						colorSegments[nLineParagraph+i].push({
								type:'relation_color',
								iStart:0,
								iEnd:line.length
						});

					}
				});
			}

		} else {//node
			minIndex = 99999999;

			index = line.indexOf(NetworkEncodings.nodeNameSeparators[0]);

			if(index!=-1){
				minIndex = index;
				sep = NetworkEncodings.nodeNameSeparators[0];
			}

			j=1;
			
			while(j<NetworkEncodings.nodeNameSeparators.length){
				index = line.indexOf(NetworkEncodings.nodeNameSeparators[j]);
				if(index!=-1){
					minIndex = Math.min(index, minIndex);
					sep = NetworkEncodings.nodeNameSeparators[j];
				}
				j++;
			}


			index = minIndex==99999999?-1:minIndex;

			name = index==-1?line:line.substr(0, index);
			name = name.trim();

			if(name!=""){
				id = NetworkEncodings._simplifyForNoteWork(name);

				node = network.nodeList.getNodeById(id);

				iEnd = index==-1?line.length:index
				
				if(node==null){

					node = new Node(id, name);
					node._nLine = nLineParagraph;
					network.addNode(node);
					node.content = index!=-1?line.substr(index+sep.length).trim():"";
					//c.l('create node, content:['+node.content+']');

					node._lines = lines?lines.slice(1):new StringList();
					////c.l('node._lines:['+node._lines+']');
					
					if(colorSegments[nLineParagraph]==null) colorSegments[nLineParagraph]=[];

					colorSegments[nLineParagraph].push({
						type:'node_name',
						iStart:0,
						iEnd:iEnd
					});

				} else {
					node._lines = lines?node._lines.concat(lines.slice(1)):new StringList();
					node.content += index!=-1?(" | " + line.substr(index+sep.length).trim()):"";
					
					if(colorSegments[nLineParagraph]==null) colorSegments[nLineParagraph]=[];

					colorSegments[nLineParagraph].push({
						type:'node_name_repeated',
						iStart:0,
						iEnd:iEnd
					});
				}
			} else {
				//c.l('? paragraph:['+paragraph+']');
			}
		}

		nLineParagraph+=(lines?lines.length:1)+1;
	});

	
	//find equalities (synonyms)

	var foundEquivalences = true;

	while(foundEquivalences){
		foundEquivalences = false;

		loop:for(i=0; network.nodeList[i]!=null; i++){
			node = network.nodeList[i];

			loop2:for(j=0; node._lines[j]!=null; j++){
				line = node._lines[j];

				if(line.indexOf('=')==0){

					id2 = NetworkEncodings._simplifyForNoteWork(line.substr(1));
					otherNode = network.nodeList.getNodeById(id2);
					
					if(otherNode && node!=otherNode){

						foundEquivalences = true;

						node._lines = otherNode._lines.concat(otherNode._lines);

						network.nodeList.removeNode(otherNode);
						network.nodeList.ids[otherNode.id] = node;

						break loop;
						break loop2;
					} else {
						network.nodeList.ids[id2] = otherNode;
					}
					
					if(!node._otherIds) node._otherIds = [];
					node._otherIds.push(id2);
				}
			}
		}
	}
	


	//build relations

	network.nodeList.forEach(function(node){

		nLineParagraph = node._nLine;

		node._lines.forEach(function(line, i){
			if(line.indexOf('=')==-1){
				simpleLine = line;//NetworkEncodings._simplifyForNoteWork(line);


				
				network.nodeList.forEach(function(otherNode){
					regex = NetworkEncodings._regexWordForNoteWork(otherNode.id);
					index = simpleLine.search(regex);

					if(index==-1 && otherNode._otherIds){
						for(j=0; otherNode._otherIds[j]!=null ; j++){
							regex = NetworkEncodings._regexWordForNoteWork(otherNode._otherIds[j]);
							index = simpleLine.search(regex);
							if(index!=-1) break;
						}
					}

					if(index!=-1){
						iEnd = index + simpleLine.substr(index).match(regex)[0].length

						// c.l('simpleLine:['+simpleLine+']');
						// c.l('simpleLine.substr(index).match(regex)[0]:['+simpleLine.substr(index).match(regex)[0]+']');

					    relation = network.relationList.getFirstRelationBetweenNodes(node, otherNode, true);

					    if(relation!=null){

					    	relation.content+=" | "+line;

					    	if(colorSegments[nLineParagraph + i + 1]==null) colorSegments[nLineParagraph + i + 1]=[];

					    	colorSegments[nLineParagraph + i + 1].push({
								type:'node_name_in_repeated_relation',
								iStart:index,
								iEnd:iEnd
							});

					    } else {
					    	relation = network.relationList.getFirstRelationBetweenNodes(otherNode, node, true);

					    	if(relation==null || relation.content!=line){

					    		id = line;
							    relation = new Relation(line, line, node, otherNode);
							    relation.content = line;//.substr(0,index);
							    network.addRelation(relation);

							    if(colorSegments[nLineParagraph + i + 1]==null) colorSegments[nLineParagraph + i + 1]=[];

								colorSegments[nLineParagraph + i + 1].push({
									type:'node_name_in_relation',
									iStart:index,
									iEnd:iEnd
								});

					    	}
					    }
					}
				});
			}
		});
	});


	//colors in relations
	//
	
	colorLines.forEach(function(line){
		index = line.indexOf(':');
		texts = line.substr(0,index).split(',');
	    texts.forEach(function(text){
	       color = line.substr(index+1);
	       //c.l('text:', text);
	       //c.l('color:', color);
	       network.relationList.forEach(function(relation){
	         if(relation.name.indexOf(text)!=-1) relation.color = color;
	       });
	    });
	});
	
	network.colorSegments = colorSegments;

	//c.l('decodeNoteWork --> network', network);
	c.l('_colorSegments', colorSegments);
	//c.l('*************////////// decodeNoteWork //////////*************\n\n');

	return network;
}
NetworkEncodings._simplifyForNoteWork = function(name){
	name = name.toLowerCase();
	if(name.substr(name.length-2)=='es'){
	  name = name.substr(0, name.length-1);
	} else if(name.charAt(name.length-1)=='s') name = name.substr(0, name.length-1);
	return name.trim();
}
NetworkEncodings._regexWordForNoteWork = function(word, global){
	global = global==null?true:global;
	try{
		return new RegExp("(\\b)("+word+"|"+word+"s|"+word+"es)(\\b)", global?"gi":"i");
	} catch(err){
		return null;
	}
}

/**
 * encodes a network into NoteWork notes
 * @param  {Network} network
 * 
 * @param  {String} nodeContentSeparator separator between node name and content
 * @param  {StringList} nodesPropertyNames properties to be encoded
 * @param  {StringList} relationsPropertyNames relations properties to be encoded
 * @return {String}
 * tags:encoding
 */
NetworkEncodings.encodeNoteWork = function(network, nodeContentSeparator, nodesPropertyNames, relationsPropertyNames){
	if(network==null) return;

	var node, relation, other;
	var propName;
	var code = "";
	var simpNodeName;
	var regex, lineRelation;

	var codedRelationsContents;

	nodeContentSeparator = nodeContentSeparator||', ';
	nodesPropertyNames = nodesPropertyNames||[];
	relationsPropertyNames = relationsPropertyNames||[];

	network.nodeList.forEach(function(node){
		code+=node.name;
		if(node.content && node.content!="") code+=nodeContentSeparator+node.content;
		code+="\n";

		nodesPropertyNames.forEach(function(propName){
			if(node[propName]!=null) code+= propName+":"+String(node[propName])+"\n";
		});

		codedRelationsContents = new StringList();

		node.toRelationList.forEach(function(relation){

			content = ( (relation.content==null || relation.content=="")  && relation.description)?relation.description:relation.content;

			if(content && content!=""){
				regex = NetworkEncodings._regexWordForNoteWork(relation.node1.name);
				lineRelation = content + ((regex!=null && content.search(regex)==-1)?(" "+relation.node1.name):"");
			} else {
				lineRelation = "connected with "+relation.node1.name;
			}

			if(codedRelationsContents.indexOf(lineRelation)==-1){
				code+=lineRelation;
				code+="\n";
				codedRelationsContents.push(lineRelation);
			}
			
		});

		code+="\n";

	});

	return code;
}






//////////////SYM

NetworkEncodings.decodeSYM = function(symCode){
	//c.log("/////// decodeSYM\n"+symCode+"\n/////////");
	var i;
	var j;
	
	var lines = StringOperators.splitByEnter(symCode);
	lines = lines==null?[]:lines;
	
	var objectPattern = /((?:NODE|RELATION)|GROUP)\s*([A-Za-z0-9_,\s]*)/;
	
	var network = new Network();
	var groups = new Table();
	var name;
	var id;
	var node;
	var node1;
	var relation;
	var group;
	var groupName;
	var parts;
	var propName;
	var propCont;
	
	var nodePropertiesNames = [];
	var relationPropertiesNames = [];
	var groupsPropertiesNames = [];
	
	for(i=0; lines[i]!=null; i++){
		var bits = objectPattern.exec(lines[i]);
		if(bits!=null){
			switch(bits[1]){
				case "NODE":
					id = bits[2];
					name = lines[i+1].substr(0,5)=="name:"?lines[i+1].substr(5).trim():"";
					name = name.replace(/\\n/g, '\n').replace(/\\'/g, "'");
					node = new Node(id, name);
					network.addNode(node);
					j = i+1;
					while(j<lines.length && lines[j].indexOf(":")!=-1){
						parts = lines[j].split(":");
						propName = parts[0];
						propCont = parts.slice(1).join(":");
						if(propName!="name"){
							propCont=propCont.trim();
							node[propName] = String(Number(propCont))==propCont?Number(propCont):propCont;
							if(typeof node[propName] == "string") node[propName] = node[propName].replace(/\\n/g, '\n').replace(/\\'/g, "'");
							if(nodePropertiesNames.indexOf(propName)==-1) nodePropertiesNames.push(propName);
						}
						j++;
					}
					if(node.color!=null){
						if(/.+,.+,.+/.test(node.color)) node.color = 'rgb('+node.color+')';
					}
					if(node.group!=null){
						group = groups.getFirstElementByPropertyValue("name", node.group);
						if(group == null){
							c.log("NODES new group:["+node.group+"]");
							group = new NodeList();
						 	group.name = node.group;
						 	group.name = group.name.replace(/\\n/g, '\n').replace(/\\'/g, "'");
						 	groups.push(group);
						}
					 	group.addNode(node);
					 	//node.group = group;
					}
					break;
				case "RELATION":
					var ids = bits[2].replace(/\s/g, "").split(",");
					//var ids = bits[2].split(",");
					node = network.nodeList.getNodeById(ids[0]);
					node1 = network.nodeList.getNodeById(ids[1]);
					if(node!=null && node1!=null){
						relation = new Relation(node.id+"_"+node1.id,node.id+"_"+node1.id, node, node1);
						network.addRelation(relation);
						j = i+1;
						while(j<lines.length && lines[j].indexOf(":")!=-1){
							parts = lines[j].split(":");
							propName = parts[0];
							propCont = parts.slice(1).join(":").trim();
							if(propName!="name"){
								propCont=propCont.trim();
								relation[propName] = String(Number(propCont))==propCont?Number(propCont):propCont;
								if(typeof relation[propName] == "string") relation[propName] = relation[propName].replace(/\\n/g, '\n').replace(/\\'/g, "'");
								if(relationPropertiesNames.indexOf(propName)==-1) relationPropertiesNames.push(propName);
							}
							j++;
						}
					}
					if(relation!=null && relation.color!=null){
						relation.color = 'rgb('+relation.color+')';
					}
					break;
				case "GROUP":
					groupName = lines[i].substr(5).trim();
					
					group = groups.getFirstElementByPropertyValue("name", groupName);
					if(group==null){
					 	group = new NodeList();
					 	group.name = groupName;
					 	groups.push(group);
					}
				 	j = i+1;
					while(j<lines.length && lines[j].indexOf(":")!=-1){
						parts = lines[j].split(":");
						if(parts[0]!="name"){
							parts[1]=parts[1].trim();
							group[parts[0]] = String(Number(parts[1]))==parts[1]?Number(parts[1]):parts[1];
							if(groupsPropertiesNames.indexOf(parts[0])==-1) groupsPropertiesNames.push(parts[0]);
						}
						j++;
					}
					
					if(/.+,.+,.+/.test(group.color)) group.color = 'rgb('+group.color+')';
					
					break;
			}
		}
	}
	
	for(i=0; groups[i]!=null; i++){
		group = groups[i];
		if(group.color==null) group.color = CATEGORICAL_COLORS[i%CATEGORICAL_COLORS.length];
		for(j=0; group[j]!=null; j++){
			node = group[j];
			if(node.color==null) node.color = group.color;
		}
	}
	
	network.groups = groups;
	
	
	
	network.nodePropertiesNames = nodePropertiesNames;
	network.relationPropertiesNames = relationPropertiesNames;
	network.groupsPropertiesNames = groupsPropertiesNames;
	
	return network;
}

NetworkEncodings.encodeSYM = function(network, groups, nodesPropertiesNames, relationsPropertiesNames, groupsPropertiesNames){
	nodesPropertiesNames = nodesPropertiesNames==null?new StringList():nodesPropertiesNames;
	relationsPropertiesNames = relationsPropertiesNames==null?new StringList():relationsPropertiesNames;
	
	var code = "";
	var i;
	var j;
	var node;
	var propertyName;
	for(i=0;network.nodeList[i]!=null;i++){
		node = network.nodeList[i];
		code+=(i==0?"":"\n\n")+"NODE "+node.id;
		if(node.name!="") code+="\nname:"+(node.name).replace(/\n/g, "\\n");
		for(j=0;nodesPropertiesNames[j]!=null;j++){
			propertyName = nodesPropertiesNames[j]
			if(node[propertyName]!=null) code+="\n"+propertyName+":"+_processProperty(propertyName, node[propertyName]);
		}
	}
	
	var relation;
	for(i=0;network.relationList[i]!=null;i++){
		relation = network.relationList[i];
		code+="\n\nRELATION "+relation.node0.id+", "+relation.node1.id;
		for(j=0;relationsPropertiesNames[j]!=null;j++){
			propertyName = relationsPropertiesNames[j]
			if(relation[propertyName]!=null) code+="\n"+propertyName+":"+_processProperty(propertyName, relation[propertyName]);
		}
	}
	
	if(groups==null) return code;
	
	var group;
	for(i=0; groups[i]!=null; i++){
		group = groups[i];
		code+="\n\nGROUP "+group.name;
		for(j=0;groupsPropertiesNames[j]!=null;j++){
			propertyName = groupsPropertiesNames[j];
			if(group[propertyName]!=null) code+="\n"+propertyName+":"+_processProperty(propertyName, group[propertyName]);
		}
	}
	
	//c.log("/////// encodeSYM\n"+code+"\n/////////");
	
	return code;
}

_processProperty = function(propName, propValue){//TODO: use this in other encoders
	switch(propName){
		case "color":
			if(propValue.substr(0,3)=="rgb"){
				var rgb = ColorOperators.colorStringToRGB(propValue);
				return rgb.join(',');
			}
			return propValue;
			break;
	}
	propValue = String(propValue).replace(/\n/g, "\\n");
	return propValue;
}





/////////////////

//Also used by CSVToTable
NetworkEncodings.replaceChomasInLine = function(line){
	var quoteBlocks = line.split("\"");
	if(quoteBlocks.length<2) return line;
	var insideQuote;
	var i;
	for(i=0;quoteBlocks[i]!=null;i++){
		insideQuote = i*0.5!=Math.floor(i*0.5);
		if(insideQuote){
			quoteBlocks[i] = quoteBlocks[i].replace(/,/g, "*CHOMA*");
		}
	}
	line = StringList.fromArray(quoteBlocks).getConcatenated("");
	return line;
}
NetworkEncodings._replaceSpacesInLine = function(line){
	var quoteBlocks = line.split("\"");
	if(quoteBlocks.length<2) return line;
	var insideQuote;
	var i;
	for(i=0;quoteBlocks[i]!=null;i++){
		insideQuote = i*0.5!=Math.floor(i*0.5);
		if(insideQuote){
			quoteBlocks[i] = quoteBlocks[i].replace(/ /g, "*SPACE*");
		}
	}
	line = StringList.fromArray(quoteBlocks).getConcatenated("\"");
	return line;
}

