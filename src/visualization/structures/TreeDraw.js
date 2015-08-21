import Rectangle from "src/dataStructures/geometry/Rectangle";
import RectangleOperators from "src/operators/geometry/RectangleOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import List from "src/dataStructures/lists/List";
import NumberList from "src/dataStructures/numeric/NumberList";
import ColorList from "src/dataStructures/graphic/ColorList";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";

/**
 * @classdesc Functions for drawing {@link Tree|Trees}.
 *
 * @namespace
 * @category networks
 */
function TreeDraw() {}
export default TreeDraw;


/**
 * Simple tree visualization with levels in vertical rectangles.
 *
 * @param {Rectangle} frame
 * @param {Tree} tree The Tree to draw.
 *
 * @param {ColorList} levelColors
 * @param {Number} margin
 * tags:draw
 */
TreeDraw.drawRectanglesTree = function(frame, tree, levelColors, margin) {
  levelColors = levelColors == null ? ColorListGenerators.createCategoricalColors(1, tree.nLevels) : levelColors;
  margin = margin || 1;

  var dX = frame.width / tree.nLevels;
  TreeDraw._drawRectanglesTreeChildren(tree.nodeList[0], new Rectangle(frame.x, frame.y, dX, frame.height), levelColors, margin);
};

TreeDraw._drawRectanglesTreeChildren = function(node, frame, colors, margin, graphics) {
  graphics.context.fillStyle = colors[node.level];
  graphics.context.fillRect(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  var children = node.toNodeList;
  //console.log((node.level, node.name, children.length);
  if(children.length > 0) {
    var i;
    var dY = frame.height / (node.descentWeight - 1);
    var yy = frame.y;
    var h;
    for(i = 0; children[i] != null; i++) {
      h = dY * (children[i].descentWeight);
      TreeDraw._drawRectanglesTreeChildren(children[i], new Rectangle(frame.x + frame.width, yy, frame.width, h), colors, margin);
      yy += h;
    }
  }
};


/**
 * Creates a simple treemap visualization.
 *
 * @param {Rectangle} frame
 * @param {Tree} tree The Tree to draw.
 *
 * @param {ColorList} colorList
 * @param {NumberList} weights weights of leaves
 * @param {String} textColor if not provided will be calculated to contrast node color
 * @param {Node} externalSelectedNode node to force selection (by id)
 * @return {Node} selected node
 * tags:draw
 */
TreeDraw.drawTreemap = function(frame, tree, colorList, weights, textColor, externalSelectedNode, graphics) { 
  if(frame==null || tree==null) return;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  var change = frame.memory == null || frame.memory.tree != tree || frame.memory.width != frame.width || frame.memory.height != frame.height || frame.memory.weights != weights;

  if(externalSelectedNode != null) externalSelectedNode = tree.nodeList.getNodeById(externalSelectedNode.id);

  var changeSelection = (externalSelectedNode != null && (frame.memory == null || externalSelectedNode != frame.memory.nodeSelected));

  if(change) {
    var changeInTree = frame.memory != null && frame.memory.tree != null != tree;
    var changeInWeights = frame.memory != null && frame.memory.weights != weights;

    frame.memory = {
      tree: tree,
      width: frame.width,
      height: frame.height,
      weights: weights,
      nodeSelected: tree.nodeList[0],
      nFLastChange: graphics.nF,
      image: null
    };

    var leaves = (!changeInTree && frame.memory.leaves) ? frame.memory.leaves : tree.getLeaves();
    frame.memory.leaves = leaves;

    if(weights == null) {
      tree.nodeList.forEach(function(node) {
        node._treeMapWeight = node.descentWeight;
      });
    } else {
      leaves.forEach(function(node, i) {
        node._treeMapWeight = weights[i];
      });
      var assignTreemapWeight = function(node) {
        var i;
        if(node.toNodeList.length === 0) {
          return node._treeMapWeight;
        } else {
          node._treeMapWeight = 0;
          for(i = 0; node.toNodeList[i] != null; i++) {
            node._treeMapWeight += assignTreemapWeight(node.toNodeList[i]);
          }
        }
        return node._treeMapWeight;
      };
      assignTreemapWeight(tree.nodeList[0]);
    }

    tree.nodeList[0]._outRectangle = new Rectangle(0, 0, frame.width, frame.height);
    tree.nodeList[0]._inRectangle = TreeDraw._inRectFromOutRect(tree.nodeList[0]._outRectangle);
    TreeDraw._generateRectangles(tree.nodeList[0]);

    frame.memory.focusFrame = TreeDraw._expandRect(tree.nodeList[0]._outRectangle);
    //c.l('>>>>>>>>>>>>>>>>>>>>>>>> frame.memory.focusFrame', frame.memory.focusFrame);

    frame.memory.kx = frame.width / frame.memory.focusFrame.width;
    frame.memory.mx = -frame.memory.kx * frame.memory.focusFrame.x;
    frame.memory.ky = frame.height / frame.memory.focusFrame.height;
    frame.memory.my = -frame.memory.ky * frame.memory.focusFrame.y;

    graphics.setText('black', 12);
    tree.nodeList.forEach(function(node) {
      node._textWidth = graphics.getTextW(node.name);
    });
  }

  if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
    frame.memory.nFLastChange = graphics.nF;
    frame.memory.image = null;
    frame.memory.actualColorList = colorList == null ? ColorListGenerators.createCategoricalColors(0, tree.nLevels, ColorScales.grayToOrange, 0.1) : colorList;
    frame.memory.nodesColorList = new ColorList();
    if(textColor == null) frame.memory.textsColorList = new ColorList();

    if(frame.memory.actualColorList.length <= tree.nLevels) {
      tree.nodeList.forEach(function(node, i) {
        frame.memory.nodesColorList[i] = node._color = frame.memory.actualColorList[node.level % frame.memory.actualColorList.length];
      });
    } else if(frame.memory.actualColorList.length == frame.memory.leaves.length) {
      frame.memory.leaves.forEach(function(node, i) {
        node._color = frame.memory.actualColorList[i];
        node._rgb = ColorOperators.colorStringToRGB(node._color);
      });
      var assignColor = function(node) {
        var i;
        if(node.toNodeList.length === 0) return;

        node._rgb = [0, 0, 0];
        for(i = 0; node.toNodeList[i] != null; i++) {
          assignColor(node.toNodeList[i]);
          node._rgb[0] += node.toNodeList[i]._rgb[0];
          node._rgb[1] += node.toNodeList[i]._rgb[1];
          node._rgb[2] += node.toNodeList[i]._rgb[2];
        }
        node._rgb[0] = Math.floor(node._rgb[0] / node.toNodeList.length);
        node._rgb[1] = Math.floor(node._rgb[1] / node.toNodeList.length);
        node._rgb[2] = Math.floor(node._rgb[2] / node.toNodeList.length);
      };
      assignColor(tree.nodeList[0]);
      tree.nodeList.forEach(function(node, i) {
        if(node._rgb && node._rgbF == null) node._rgbF = [node._rgb[0], node._rgb[1], node._rgb[2]];
        frame.memory.nodesColorList[i] = 'rgb(' + node._rgb[0] + ',' + node._rgb[1] + ',' + node._rgb[2] + ')';
      });
    } else {
      tree.nodeList.forEach(function(node, i) {
        node._color = frame.memory.nodesColorList[i] = frame.memory.actualColorList[i % frame.memory.actualColorList.length];
      });
    }

    if(textColor == null) {
      var rgb;
      tree.nodeList.forEach(function(node, i) {
        rgb = node._color ? ColorOperators.colorStringToRGB(node._color) : [0, 0, 0];
        frame.memory.textsColorList[i] = (rgb[0] + rgb[1] + rgb[2] > 360) ? 'black' : 'white';
      });
    }

    frame.memory.colorList = colorList;
  }

  if(textColor == null) textColor = 'black';

  var kxF = frame.width / frame.memory.focusFrame.width;
  var mxF = -kxF * frame.memory.focusFrame.x;
  var kyF = frame.height / frame.memory.focusFrame.height;
  var myF = -kyF * frame.memory.focusFrame.y;

  var v = kxF > frame.memory.kx ? 0.05 : 0.1;
  var antiv = 1 - v;

  frame.memory.kx = antiv * frame.memory.kx + v * kxF;
  frame.memory.mx = antiv * frame.memory.mx + v * mxF;
  frame.memory.ky = antiv * frame.memory.ky + v * kyF;
  frame.memory.my = antiv * frame.memory.my + v * myF;
  var kx = frame.memory.kx;
  var mx = frame.memory.mx;
  var ky = frame.memory.ky;
  var my = frame.memory.my;

  var tx = function(x) {
    return kx * x + mx;
  };
  var ty = function(y) {
    return ky * y + my;
  };


  var x, y;
  var margTextX, margTextY;
  var textSize;
  var exceedes;
  var rect;
  var overNode = null;
  var overI;
  var mouseOnFrame = frame.containsPoint(graphics.mP);
  var moving = graphics.nF - frame.memory.nFLastChange < 50 || Math.pow(frame.memory.kx - kxF, 2) + Math.pow(frame.memory.ky - kyF, 2) + Math.pow(frame.memory.mx - mxF, 2) + Math.pow(frame.memory.my - myF, 2) > 0.01;
  var captureImage = !moving && frame.memory.image == null && !mouseOnFrame;
  var drawingImage = !moving && !mouseOnFrame && frame.memory.image != null &&  !captureImage && frame.memory.image.width > 0 && !changeSelection;

  if(drawingImage) {
    graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
  } else {
    if(captureImage) {
      // TODO refactor this to not reassign context
      // var newCanvas = document.createElement("canvas");
      // newCanvas.width = frame.width;
      // newCanvas.height = frame.height;
      // var newContext = newCanvas.getContext("2d");
      // newContext.clearRect(0, 0, frame.width, frame.height);
      // var mainContext = context;
      // context = newContext;
      // var prevFx = frame.x;
      // var prevFy = frame.y;
      // frame.x = 0;
      // frame.y = 0;
      // setFill('white');
      // fRect(0, 0, frame.width, frame.height);
      // setText('black', 12);
    } else {
      graphics.context.save();
      graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);
    }

    graphics.setStroke('black', 0.2);

    tree.nodeList.forEach(function(node, i) {

      rect = new Rectangle(tx(node._outRectangle.x), ty(node._outRectangle.y), node._outRectangle.width * kx, node._outRectangle.height * ky);

      if(rect.width > 5 && rect.height > 4 && rect.x < frame.width && rect.getRight() > 0 && rect.y < frame.height && rect.getBottom() > 0) {

        x = Math.round(frame.x + rect.x) + 0.5;
        y = Math.round(frame.y + rect.y) + 0.5;

        if(node._rgbF) {
          node._rgbF[0] = 0.95 * node._rgbF[0] + 0.05 * node._rgb[0];
          node._rgbF[1] = 0.95 * node._rgbF[1] + 0.05 * node._rgb[1];
          node._rgbF[2] = 0.95 * node._rgbF[2] + 0.05 * node._rgb[2];
          graphics.setFill('rgb(' + Math.floor(node._rgbF[0]) + ',' + Math.floor(node._rgbF[1]) + ',' + Math.floor(node._rgbF[2]) + ')');
        } else {
          graphics.setFill(frame.memory.nodesColorList[i]);
        }

        if(graphics.fsRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
          overNode = node;
          overI = i;
        }
        if(rect.width > 20) {
          margTextX = rect.width * TreeDraw.PROP_RECT_MARGIN * 0.8;
          margTextY = rect.height * TreeDraw.PROP_RECT_MARGIN * 0.15;
          textSize = rect.height * TreeDraw.PROP_RECT_LABEL - 2;
          if(textSize >= 5) {

            var propTextSpace = (rect.width - 2 * margTextX) / (node._textWidth * textSize / 12);
            exceedes = propTextSpace < 1; //(node._textWidth*textSize/12)>(rect.width-1.2*margTextX);

            if(exceedes) {
              //clipRectangle(x+margTextX, y+margTextY,rect.width-2*margTextX, textSize*2);
              graphics.setText(textColor ? textColor : frame.memory.textsColorList[i], textSize * propTextSpace);
            } else {
              graphics.setText(textColor ? textColor : frame.memory.textsColorList[i], textSize);
            }

            graphics.fText(node.name, x + margTextX, y + margTextY);
            //if(exceedes) context.restore();
          }
        }
      }
    });

    if(captureImage) {
      //c.l('captureImage');
      // TODO refactor this to not reassign context
      // context = mainContext;
      // frame.memory.image = new Image();
      // frame.memory.image.src = newCanvas.toDataURL();
      // frame.x = prevFx;
      // frame.y = prevFy;
      // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    }
  }

  if(mouseOnFrame) {
    if(overNode) {
      graphics.setCursor('pointer');

      rect = new Rectangle(tx(overNode._outRectangle.x), ty(overNode._outRectangle.y), overNode._outRectangle.width * kx, overNode._outRectangle.height * ky);
      x = Math.round(frame.x + rect.x) + 0.5;
      y = Math.round(frame.y + rect.y) + 0.5;
      graphics.setStroke(textColor ? textColor : frame.memory.textsColorList[overI], 2);
      graphics.sRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

      if(graphics.MOUSE_UP_FAST) {
        frame.memory.focusFrame = TreeDraw._expandRect(overNode._outRectangle);
        frame.memory.nodeSelected = overNode;

        frame.memory.image = null;
      }
    }
    if(graphics.MOUSE_DOWN) {
      frame.memory.prevMX = graphics.mX;
      frame.memory.prevMY = graphics.mY;
    }
    if(graphics.MOUSE_PRESSED) {
      var scale = 5 * frame.memory.focusFrame.width / frame.width;
      frame.memory.focusFrame.x -= (graphics.mX - frame.memory.prevMX) * scale;
      frame.memory.focusFrame.y -= (graphics.mY - frame.memory.prevMY) * scale;

      frame.memory.prevMX = graphics.mX;
      frame.memory.prevMY = graphics.mY;
    }
    if(graphics.WHEEL_CHANGE !== 0) {
      var center = frame.memory.focusFrame.getCenter();
      var zoom = 1 - 0.1 * graphics.WHEEL_CHANGE;
      frame.memory.focusFrame.x = center.x - frame.memory.focusFrame.width * 0.5 * zoom;
      frame.memory.focusFrame.y = center.y - frame.memory.focusFrame.height * 0.5 * zoom;
      frame.memory.focusFrame.width *= zoom;
      frame.memory.focusFrame.height *= zoom;
    }
    if(graphics.MOUSE_PRESSED || graphics.WHEEL_CHANGE !== 0) {
      frame.memory.image = null;
    }
  }

  if(changeSelection) {
    frame.memory.focusFrame = TreeDraw._expandRect(externalSelectedNode._outRectangle);
    frame.memory.nodeSelected = externalSelectedNode;
    frame.memory.image = null;
  }

  if(!captureImage && !drawingImage) graphics.context.restore();


  return frame.memory.nodeSelected;

};

/**
 * @ignore
 */
TreeDraw._generateRectangles = function(node) {

  var weights = new NumberList();
  node.toNodeList.forEach(function(node) {
    weights.push(node._treeMapWeight);
  });

  var rectangles = RectangleOperators.squarify(node._inRectangle, weights, false, false);

  node.toNodeList.forEach(function(child, i) {
    child._outRectangle = TreeDraw._reduceRect(rectangles[i]);
    child._inRectangle = TreeDraw._inRectFromOutRect(child._outRectangle);
    TreeDraw._generateRectangles(child);
  });
};

/**
 * @ignore
 */
TreeDraw._reduceRect = function(rect) {
  return new Rectangle(rect.x + rect.width * TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.y + rect.height * TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.width * (1 - 2 * TreeDraw.PROP_RECT_REDUCTION_MARGIN), rect.height * (1 - 2 * TreeDraw.PROP_RECT_REDUCTION_MARGIN));
};
TreeDraw._expandRect = function(rect) {
  return new Rectangle(rect.x - rect.width * TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.y - rect.height * TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.width * (1 + 2 * TreeDraw.PROP_RECT_EXPANTION_MARGIN), rect.height * (1 + 2 * TreeDraw.PROP_RECT_EXPANTION_MARGIN));
};
TreeDraw._inRectFromOutRect = function(rect) {
  return new Rectangle(rect.x + rect.width * TreeDraw.PROP_RECT_MARGIN, rect.y + rect.height * TreeDraw.PROP_RECT_LABEL, rect.width * (1 - 2 * TreeDraw.PROP_RECT_MARGIN), rect.height * (1 - TreeDraw.PROP_RECT_MARGIN - TreeDraw.PROP_RECT_LABEL));
};
TreeDraw.PROP_RECT_MARGIN = 0.03;
TreeDraw.PROP_RECT_LABEL = 0.2;
TreeDraw.PROP_RECT_REDUCTION_MARGIN = 0.01;
TreeDraw.PROP_RECT_EXPANTION_MARGIN = 0.05;



///////////////////////////decision tree



/**
 * Decision tree visualization, tree from {@link TableOperators}'s buildDecisionTree function.
 *
 * @param {Rectangle} frame
 * @param {Tree} tree
 *
 * @param {String} textColor
 * @return {Node} selected node
 * @return {Node} hovered node
 * tags:draw,ds
 */
TreeDraw.drawDecisionTree = function(frame, tree, textColor, graphics) {
  if(frame==null || tree==null) return;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  var change = frame.memory == null || frame.memory.tree != tree || frame.memory.width != frame.width || frame.memory.height != frame.height;

  textColor = textColor||'black';

  var gap = frame.height * 0.06;
  var hTree = tree.nLevels * (frame.height - gap) / (tree.nLevels + 1);
  var hLevel = hTree / tree.nLevels;
  var changeInResult = false;

  if(change) {
    var changeInTree = frame.memory != null && frame.memory.tree != null && frame.memory.tree != tree;

    frame.memory = {
      tree: tree,
      width: frame.width,
      height: frame.height,
      nodeSelected: tree.nodeList[0],
      nFLastChange: graphics.nF,
      leaves: null,
      image: null
    };

    if(changeInTree || frame.memory.leaves == null) {
      frame.memory.leaves = tree.getLeaves().getSortedByProperty('valueFollowingProbability', false);
    }



    tree.nodeList[0]._outRectangle = new Rectangle(0, 0, frame.width, hTree);
    tree.nodeList[0]._inRectangle = TreeDraw._inRectFromOutRectDecision(tree.nodeList[0]._outRectangle, hLevel);
    TreeDraw._generateRectanglesDecision(tree.nodeList[0], hLevel);

    frame.memory.focusFrame = new Rectangle(0, 0, frame.width, frame.height);
    frame.memory.kx = frame.width / frame.memory.focusFrame.width;
    frame.memory.mx = -frame.memory.kx * frame.memory.focusFrame.x;
    frame.memory.ky = frame.height / frame.memory.focusFrame.height;
    frame.memory.my = -frame.memory.ky * frame.memory.focusFrame.y;

    graphics.setText(textColor, 12);
    tree.nodeList.forEach(function(node) {
      node.label = node.toNodeList.length == 0 ? Math.round(node.valueFollowingProbability * 100) / 100 : node.bestFeatureName;
      node._textWidth = graphics.getTextW(node.label);
    });


  }

  if(frame.memory.followingWeights) {
    tree.nodeList.forEach(function(node) {
      node._treeMapWeight = node.descentWeight;
    });
  }

  var kxF = frame.width / frame.memory.focusFrame.width;
  var mxF = -kxF * frame.memory.focusFrame.x;

  var v = kxF > frame.memory.kx ? 0.05 : 0.1;
  var antiv = 1 - v;

  frame.memory.kx = antiv * frame.memory.kx + v * kxF;
  frame.memory.mx = antiv * frame.memory.mx + v * mxF;
  var kx = frame.memory.kx;
  var mx = frame.memory.mx;

  var tx = function(x) {
    return kx * x + mx;
  };

  var x, y;
  var margTextX, margTextY;
  var textSize;
  var exceedes;
  var rect;
  var overNode = null;
  var overI;
  var mouseOnFrame = frame.containsPoint(graphics.mP);
  var moving = graphics.nF - frame.memory.nFLastChange < 80 || Math.pow(frame.memory.kx - kxF, 2) + Math.pow(frame.memory.mx - mxF, 2) > 0.001;
  var captureImage = false;//provisional // !moving && frame.memory.image == null && !mouseOnFrame;
  var drawingImage = false;//provisional // !moving && !mouseOnFrame && frame.memory.image != null &&  !captureImage && frame.memory.image.width > 0;

  if(drawingImage) {
    graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
  } else {
    //c.l('drawing');
    if(captureImage) {
      // TODO refactor this to not reassign context
      // var newCanvas = document.createElement("canvas");
      // newCanvas.width = frame.width;
      // newCanvas.height = frame.height;
      // var newContext = newCanvas.getContext("2d");
      // newContext.clearRect(0, 0, frame.width, frame.height);
      // var mainContext = context;
      // context = newContext;
      // var prevFx = frame.x;
      // var prevFy = frame.y;
      // frame.x = 0;
      // frame.y = 0;
      // setFill('white');
      // fRect(0, 0, frame.width, frame.height);
      // setText('black', 12);
    } else {
      graphics.context.save();
      graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);
    }

    var yLeaves = frame.y + hTree + gap;

    graphics.setStroke('black', 0.2);

    tree.nodeList.forEach(function(node, i) {

      rect = new Rectangle(tx(node._outRectangle.x), node._outRectangle.y, node._outRectangle.width * kx, node._outRectangle.height);

      if(rect.x < frame.width && rect.getRight() > 0 && rect.y < frame.height && rect.getBottom() > 0) {

        x = Math.round(frame.x + rect.x) + 0.5;
        y = Math.round(frame.y + rect.y) + 0.5;

        if(node.pattern) {
          graphics.context.fillStyle = node.pattern;
          graphics.context.fillRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

          if(graphics.sRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
            overNode = node;
            overI = i;
          }

        } else {

          graphics.setFill(node._color);

          if(graphics.fsRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
            overNode = node;
            overI = i;
          }
        }

        var realWidth = Math.min(rect.getRight(), frame.width) - Math.max(rect.x, 0);

        if(realWidth > 16) {
          margTextX = rect.width * TreeDraw.PROP_RECT_MARGIN * 0.8;
          margTextY = rect.height * TreeDraw.PROP_RECT_MARGIN * 0.15;
          var tC = textColor ? textColor : frame.memory.textsColorList[i];
          textSize = 18;

          graphics.setText(tC, textSize);
          exceedes = true; //(node._textWidth*textSize/12)>(rect.width-1.2*margTextX);
          if(exceedes) {
            graphics.clipRectangle(x, y - 17, rect.width, rect.height);
          }

          //feature or P
          graphics.fText(node.label, Math.max(x, frame.x) + 8, y + 1);

          if(node.value) {
            textSize = 14;
            graphics.setText(tC, textSize);

            graphics.fText(node.value, Math.max(x, frame.x) + 8, y - 17);
          }

          //size
          if(realWidth - node._textWidth > 60) {
            textSize = 12;
            graphics.setText(tC, textSize, null, 'right');

            graphics.fText("s=" + node.weight, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 1);
            graphics.fText("e=" + Math.round(node.entropy * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 12);
            if(node.toNodeList.length > 0) {
              graphics.fText("P=" + Math.round(node.valueFollowingProbability * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 23);
            }
            graphics.fText("l=" + Math.round(node.lift * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 23 + (node.toNodeList.length > 0 ? 11 : 0));
          }

          if(exceedes) {
            graphics.context.restore();
          }
        }
      }
    });

    //leaves

    var x0 = frame.x;
    var w;
    var sx = frame.width / tree.nodeList[0].weight;
    var waitingForMark = true;
    var waitingForDoubleMark = true;
    var waitingForHalfMark = true;
    var waitingFor15Mark = true;
    var waitingFor067Mark = true;


    frame.memory.leaves.forEach(function(node) {
      graphics.setStroke('black', 0.2);

      w = sx * node.weight;

      if(node.pattern) {
        graphics.context.fillStyle = node.pattern;
        graphics.context.fillRect(x0, yLeaves, w, hLevel);

        if(graphics.sRectM(x0, yLeaves, w, hLevel)) {
          overNode = node;
          overI = tree.nodeList.indexOf(node);
        }

      } else {
        graphics.setFill(node._color);
        if(graphics.fsRectM(x0, yLeaves, w, hLevel)) {
          overNode = node;
          overI = tree.nodeList.indexOf(node);
        }
      }

      node._xLeaf = x0;
      node._wLeaf = w;

      graphics.setStroke('black', 1);

      if(waitingForMark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability) {
        waitingForMark = false;
        graphics.setFill('black');
        graphics.fLines(x0, yLeaves - 14, x0 + 4, yLeaves - 8, x0, yLeaves - 2, x0 - 4, yLeaves - 8);
      }
      if(waitingForDoubleMark && node.valueFollowingProbability <= tree.nodeList[0].valueFollowingProbability * 2) {
        waitingForDoubleMark = false;
        graphics.line(x0, yLeaves - 14, x0, yLeaves - 2);
      }
      if(waitingForHalfMark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability * 0.5) {
        waitingForHalfMark = false;
        graphics.line(x0, yLeaves - 14, x0, yLeaves - 2);
      }
      if(waitingFor15Mark && node.valueFollowingProbability <= tree.nodeList[0].valueFollowingProbability * 1.5) {
        waitingFor15Mark = false;
        graphics.line(x0, yLeaves - 8, x0, yLeaves - 2);
      }
      if(waitingFor067Mark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability * 0.66667) {
        waitingFor067Mark = false;
        graphics.line(x0, yLeaves - 8, x0, yLeaves - 2);
      }

      x0 += w;

    });

    if(captureImage) {
      // TODO refactor this to not reassign context
      // context = mainContext;
      // frame.memory.image = new Image();
      // frame.memory.image.src = newCanvas.toDataURL();
      // frame.x = prevFx;
      // frame.y = prevFy;
      // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    }
  }

  if(mouseOnFrame) {
    if(overNode) {
      graphics.setCursor('pointer');

      //rect = new Rectangle(tx(overNode._outRectangle.x), ty(overNode._outRectangle.y), overNode._outRectangle.width*kx, overNode._outRectangle.height*ky);
      rect = new Rectangle(tx(overNode._outRectangle.x), overNode._outRectangle.y, overNode._outRectangle.width * kx, overNode._outRectangle.height);
      x = Math.round(frame.x + rect.x) + 0.5;
      y = Math.round(frame.y + rect.y) + 0.5;

      graphics.setStroke(textColor ? textColor : frame.memory.textsColorList[overI], 2);

      if(overNode._wLeaf) {
        graphics.setFill('rgba(0,0,0,0.5)');
        graphics.context.beginPath();

        graphics.context.moveTo(x, yLeaves - gap);
        graphics.context.bezierCurveTo(x, yLeaves - 0.65 * gap, overNode._xLeaf, yLeaves - gap * 0.35, overNode._xLeaf, yLeaves);
        graphics.context.lineTo(overNode._xLeaf + overNode._wLeaf, yLeaves);
        graphics.context.bezierCurveTo(overNode._xLeaf + overNode._wLeaf, yLeaves - gap * 0.35, x + rect.width, yLeaves - 0.65 * gap, x + rect.width, yLeaves - gap);
        graphics.context.fill();

        graphics.sRect(overNode._xLeaf, yLeaves, overNode._wLeaf, hLevel);
      }

      graphics.sRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

      if(graphics.MOUSE_UP_FAST) {
        frame.memory.focusFrame = new Rectangle(overNode._outRectangle.x - overNode._outRectangle.width * 0.025, 0, overNode._outRectangle.width * 1.05, frame.height); // TreeDraw._expandRect(overNode._outRectangle);

        if(frame.memory.focusFrame.x < 0) {
          frame.memory.focusFrame.width += frame.memory.focusFrame.x;
          frame.memory.focusFrame.x = 0;
        }

        if(frame.memory.focusFrame.getRight() > frame.width) {
          frame.memory.focusFrame.width -= (frame.memory.focusFrame.getRight() - frame.width);
          frame.memory.focusFrame.x = frame.width - frame.memory.focusFrame.width;
        }


        frame.memory.nodeSelected = overNode;
        changeInResult = true;

        frame.memory.image = null;
      }
    }
    if(graphics.MOUSE_DOWN) {
      frame.memory.prevMX = graphics.mX;
    }
    if(graphics.MOUSE_PRESSED) {
      var scale = 5 * frame.memory.focusFrame.width / frame.width;
      frame.memory.focusFrame.x -= (graphics.mX - frame.memory.prevMX) * scale;
      frame.memory.prevMX = graphics.mX;
    }
    if(graphics.WHEEL_CHANGE != 0) {
      var center = frame.memory.focusFrame.getCenter();
      var zoom = 1 + 0.1 * graphics.WHEEL_CHANGE;
      frame.memory.focusFrame.x = center.x - frame.memory.focusFrame.width * 0.5 * zoom;
      frame.memory.focusFrame.width *= zoom;
    }
    if(graphics.MOUSE_PRESSED || graphics.WHEEL_CHANGE != 0) {

      frame.memory.image = null;

    }
  }

  if(!captureImage && !drawingImage) {
    graphics.context.restore();
  }


  if(frame.memory.overNode != overNode) {
    frame.memory.overNode = overNode;
    changeInResult = true;
  }

  if(changeInResult || frame.memory.result == null) {
    frame.memory.result = [
      {
        value: frame.memory.nodeSelected,
        type: 'Node'
      },
      {
        value: frame.memory.overNode,
        type: 'Node'
      }
    ];
  }

  return frame.memory.result;

};

/**
 * @ignore
 */
TreeDraw._generateRectanglesDecision = function(node, hLevel) {

  var weights = new NumberList();
  node.toNodeList.forEach(function(node) {
    weights.push(node.weight);
  });

  var rectangles = TreeDraw._horizontalRectanglesDecision(node._inRectangle, weights);

  node.toNodeList.forEach(function(child, i) {
    child._outRectangle = rectangles[i];
    child._inRectangle = TreeDraw._inRectFromOutRectDecision(child._outRectangle, hLevel);
    TreeDraw._generateRectanglesDecision(child, hLevel);
  });
};

/**
 * @ignore
 */
TreeDraw._inRectFromOutRectDecision = function(rect, hLevel) {
  return new Rectangle(rect.x, rect.y + hLevel, rect.width, rect.height - hLevel);
};

/**
 * @ignore
 */
TreeDraw._horizontalRectanglesDecision = function(rect, weights) {
  var rects = new List();
  var x0 = rect.x;
  var w;
  var newWeights = weights.getNormalizedToSum();

  newWeights.forEach(function(weight) {
    w = weight * rect.width;
    rects.push(new Rectangle(x0, rect.y, w, rect.height));
    x0 += w;
  });

  return rects;
};
