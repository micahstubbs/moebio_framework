import Tree from "src/dataTypes/structures/networks/Tree";
import Node from "src/dataTypes/structures/elements/Node";
import DateList from "src/dataTypes/dates/DateList";
import DateOperators from "src/operators/dates/DateOperators";

/**
 * @classdesc Provides a set of tools that work with DateLists.
 *
 * @namespace
 * @category dates
 */
function DateListOperators() {}
export default DateListOperators;


/**
 * @todo write docs
 */
DateListOperators.buildTimeTreeFromDates = function(dates) {
  if(dates == null) return;

  var tree = new Tree();
  var minYear;
  var maxYear;

  var minDate = dates[0];
  var maxDate = dates[0];



  dates.forEach(function(date) {
    minDate = date < minDate ? date : minDate;
    maxDate = date > maxDate ? date : maxDate;
  });

  minYear = minDate.getFullYear();
  maxYear = minDate.getFullYear();

  var superior = new Node("years", "years");
  tree.addNodeToTree(superior);
  superior.dates = dates.clone();

  var y, m, d, h, mn;
  var yNode, mNode, dNode, hNode, mnNode;
  var nDaysOnMonth;

  //var N=0;

  for(y = minYear; y <= maxYear; y++) {
    yNode = new Node(String(y), String(y));
    tree.addNodeToTree(yNode, superior);
  }

  dates.forEach(function(date) {
    y = DateListOperators._y(date);
    yNode = superior.toNodeList[y - minYear];

    if(yNode.dates == null) {
      yNode.dates = new DateList();

      for(m = 0; m < 12; m++) {
        mNode = new Node(DateOperators.MONTH_NAMES[m] + "_" + y, DateOperators.MONTH_NAMES[m]);
        tree.addNodeToTree(mNode, yNode);
        nDaysOnMonth = DateOperators.getNDaysInMonth(y, m + 1);
      }
    }
    yNode.dates.push(date);


    m = DateListOperators._m(date);
    mNode = yNode.toNodeList[m];
    if(mNode.dates == null) {
      mNode.dates = new DateList();
      for(d = 0; d < nDaysOnMonth; d++) {
        dNode = new Node((d + 1) + "_" + mNode.id, String(d + 1));
        tree.addNodeToTree(dNode, mNode);
      }
    }
    mNode.dates.push(date);

    d = DateListOperators._d(date);
    dNode = mNode.toNodeList[d];
    if(dNode.dates == null) {
      dNode.dates = new DateList();
      for(h = 0; h < 24; h++) {
        hNode = new Node(h + "_" + dNode.id, String(h) + ":00");
        tree.addNodeToTree(hNode, dNode);
      }
    }
    dNode.dates.push(date);

    h = DateListOperators._h(date);
    hNode = dNode.toNodeList[h];
    if(hNode.dates == null) {
      hNode.dates = new DateList();
      for(mn = 0; mn < 60; mn++) {
        mnNode = new Node(mn + "_" + hNode.id, String(mn));
        tree.addNodeToTree(mnNode, hNode);
      }
    }
    hNode.dates.push(date);

    mn = DateListOperators._mn(date);
    mnNode = hNode.toNodeList[mn];
    if(mnNode.dates == null) {
      mnNode.dates = new DateList();
      //c.l(date);
      // N++;
      // for(s=0; s<60; s++){
      // 	sNode = new Node(String(s), s+"_"+mnNode.id);
      // 	tree.addNodeToTree(sNode, mnNode);
      // }
    }
    mnNode.weight++;
    mnNode.dates.push(date);

    // s = DateListOperators._s(date);
    // sNode = mnNode.toNodeList[s];
    // if(sNode.dates==null){
    // 	sNode.dates = new DateList();
    // }
    // sNode.dates.push(date);
    // sNode.weight++;
  });

  tree.assignDescentWeightsToNodes();

  //



  // for(y=minYear; y<=maxYear; y++){
  // 	yNode = new Node(String(y), String(y));
  // 	tree.addNodeToTree(yNode, superior);

  // 	for(m=0; m<12; m++){
  // 		mNode = new Node(DateOperators.MONTH_NAMES[m], DateOperators.MONTH_NAMES[m]+"_"+y);
  // 		tree.addNodeToTree(mNode, yNode);
  // 		nDaysOnMonth = DateOperators.getNDaysInMonth(y, m+1);

  // 		for(d=0; d<nDaysOnMonth; d++){
  // 			dNode = new Node(String(d+1), (d+1)+"_"+mNode.id);
  // 			tree.addNodeToTree(dNode, mNode);

  // 			for(h=0; h<24; h++){
  // 				hNode = new Node(String(h), h+"_"+dNode.id);
  // 				tree.addNodeToTree(hNode, dNode);

  // 				for(mn=0; mn<60; mn++){
  // 					mnNode = new Node(String(mn), mn+"_"+hNode.id);
  // 					tree.addNodeToTree(mnNode, hNode);

  // 					for(s=0; s<60; s++){
  // 						sNode = new Node(String(s), s+"_"+mnNode.id);
  // 						tree.addNodeToTree(sNode, mnNode);
  // 					}
  // 				}
  // 			}
  // 		}
  // 	}
  // }

  return tree;
};

/**
 * @ignore
 */
DateListOperators._y = function(date) {
  return date.getFullYear();
};

/**
 * @ignore
 */
DateListOperators._m = function(date) {
  return date.getMonth();
};

/**
 * @ignore
 */
DateListOperators._d = function(date) {
  return date.getDate() - 1;
};

/**
 * @ignore
 */
DateListOperators._h = function(date) {
  return date.getHours();
};

/**
 * @ignore
 */
DateListOperators._mn = function(date) {
  return date.getMinutes();
};

/**
 * @ignore
 */
DateListOperators._s = function(date) {
  return date.getSeconds();
};

/**
 * @ignore
 */
DateListOperators._ms = function(date) {
  return date.getMilliseconds();
};
