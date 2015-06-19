import {
  context,
  mX,
  mY,
  mP,
  TwoPi
} from "src/Global";

import {
  setCursor,
  line,
  setStroke,
  setFill,
  fText,
  setText,
  drawImage,
  restore,
  bezier,
  fCircleM,
  clipCircle,
  fRect,
  getTextW
} from "src/tools/graphic/SimpleGraphics";

import Rectangle from "src/dataStructures/geometry/Rectangle";
import ColorOperators from "src/operators/graphic/ColorOperators";
import Point from "src/dataStructures/geometry/Point";
import Polygon from "src/dataStructures/geometry/Polygon";

/**
 * @classdesc Functions for drawing {@link Network|Networks}.
 *
 * @namespace
 * @category networks
 */
function NetworkDraw() {}
export default NetworkDraw;

/**
 * @ignore
 */
NetworkDraw._drawNode = function(node, x, y, r) {
  var over = false;
  if(node.image) {
    clipCircle(x, y, r);
    drawImage(node.image, x - r, y - r * 1.3, r * 2, r * 3); //[!] this assumes a 3/2 proportioned image
    restore();
    over = Math.pow(x - mX, 2) + Math.pow(y - mY, 2) <= r * r;
  } else {
    setFill(node.color == null ? 'rgb(50,50,50)' : node.color);
    over = fCircleM(x, y, r);
  }
  if(over) setCursor('pointer');
  return over;
};


/**
 * Draws a radial (elliptical) Network
 *
 * @param  {Rectangle} frame A Rectangle indicating the width, height, and location of the drawing area.
 * @param  {Network} network The Network to draw.
 * @return {Node} If a Node in the Network is currently being moused over, it is returned.
 * If no Node is being interacted with, undefined is returned.
 * tags:draw
 */
NetworkDraw.drawRadialNetwork = function(frame, network) {
  var r = 1.1 * Math.min(frame.width, frame.height) / network.nodeList.length;
  var rw = frame.width * 0.5 - r;
  var rh = frame.height * 0.5 - r;
  var cxf = frame.x + frame.width * 0.5;
  var cyf = frame.y + frame.height * 0.5;
  var mx, my, d;
  var nodeOver;
  var dA = TwoPi / network.nodeList.length;

  var polygon = new Polygon();

  setFill('black');

  network.nodeList.forEach(function(node, i) {
    node._drawRadialNetwork_x = cxf + rw * Math.cos(i * dA);
    node._drawRadialNetwork_y = cyf + rh * Math.sin(i * dA);
  });

  network.relationList.forEach(function(relation) {
    setStroke('black', relation.weight * 0.25);
    mx = (relation.node0._drawRadialNetwork_x + relation.node1._drawRadialNetwork_x) * 0.5;
    my = (relation.node0._drawRadialNetwork_y + relation.node1._drawRadialNetwork_y) * 0.5;
    d = Math.sqrt(Math.pow(relation.node0._drawRadialNetwork_x - relation.node1._drawRadialNetwork_x, 2), Math.pow(relation.node0._drawRadialNetwork_y - relation.node1._drawRadialNetwork_y, 2)) + 1;
    mx = (1 - 0.5 * (d / rw)) * mx + 0.5 * (d / rw) * cxf;
    my = (1 - 0.5 * (d / rh)) * my + 0.5 * (d / rh) * cyf;
    bezier(relation.node0._drawRadialNetwork_x, relation.node0._drawRadialNetwork_y,
      mx, my,
      mx, my,
      relation.node1._drawRadialNetwork_x, relation.node1._drawRadialNetwork_y);
  });

  network.nodeList.forEach(function(node) {
    if(NetworkDraw._drawNode(node, node._drawRadialNetwork_x, node._drawRadialNetwork_y, r)) nodeOver = node;
  });

  return nodeOver;
};


/**
 * Draws a Network with nodes placed in coordinates provided by a polygon.
 *
 * @param  {Rectangle} frame
 * @param  {Network} network
 * @param {Polygon} polygon Nodes positions
 *
 * @param {Boolean} respectProportions If true, proportions will be equal for both axis
 * @param {Boolean} logScale uses a logarithmic scale in both axis, applies only if all values are >=0
 * @param {Boolean} drawGrid draws a grid
 * @param {Number} margin
 * @return {Node} If a Node in the Network is currently being moused over, it is returned.
 * If no Node is being interacted with, undefined is returned.
 * tags:draw
 */
NetworkDraw.drawNetwork2D = function(frame, network, polygon, respectProportions, logScale, drawGrid, margin) {
  if(network == null || polygon == null || polygon.type != 'Polygon') return;

  respectProportions = respectProportions || false;
  logScale = logScale || false;
  drawGrid = drawGrid || false;
  margin = margin || 0;


  var r = 1.1 * Math.min(frame.width, frame.height) / network.nodeList.length;

  var nodeOver;
  var memory = frame.memory;
  var kx;
  var ky;
  var frameP;
  var frameMargin;
  var changeOnFrame = memory == null || !memory.frame.isEqual(frame);

  if(memory == null || memory.network != network || memory.nNodes != network.nodeList.length || memory.polygon != polygon || changeOnFrame || memory.respectProportions != respectProportions || memory.margin != margin || memory.logScale != logScale || memory.drawGrid != drawGrid) {

    if(memory == null) {
      frame.memory = {};
      memory = frame.memory;
    }
    memory.frame = frame.clone();
    memory.network = network;
    var differentSize = memory.polygon != null && memory.polygon.length != polygon.length;
    memory.polygon = polygon;
    memory.respectProportions = respectProportions;
    memory.logScale = logScale;
    memory.drawGrid = drawGrid;
    memory.margin = margin;
    memory.nNodes = network.nodeList.length;

    frame.bottom = frame.getBottom();
    frame.right = frame.getRight();
    memory.frameMargin = new Rectangle(frame.x + margin, frame.y + margin, frame.width - 2 * margin, frame.height - 2 * margin);
    frameMargin = memory.frameMargin;
    memory.frameMargin.right = memory.frameMargin.getRight();
    memory.frameMargin.bottom = memory.frameMargin.getBottom();
    memory.frameP = polygon.getFrame();
    frameP = memory.frameP;
    frameP.right = frameP.getRight();
    frameP.bottom = frameP.getBottom();


    if(respectProportions) kx = ky = Math.min(kx, ky);
    var project;
    memory.actualLogScale = logScale && frameP.x >= 0 && frameP.y >= 0;
    if(memory.actualLogScale) {
      kx = frameMargin.width / Math.log((frameP.right + 1) / (frameP.x + 1));
      ky = frameMargin.height / Math.log((frameP.bottom + 1) / (frameP.y + 1));
      project = function(p) {
        return new Point((Math.log(p.x + 1) - Math.log(frameP.x + 1)) * kx + frameMargin.x, frameMargin.bottom - (Math.log(p.y + 1) - Math.log(frameP.y + 1)) * ky);
      };
    } else {
      kx = frameMargin.width / frameP.width;
      ky = frameMargin.height / frameP.height;
      project = function(p) {
        return new Point((p.x - frameP.x) * kx + frameMargin.x, frameMargin.bottom - (p.y - frameP.y) * ky);
      };
    }
    memory.projectedPolygon = new Polygon();
    polygon.forEach(function(p, i) {
      memory.projectedPolygon[i] = project(p);
    });

    if(frameP.x <= 0 && frameP.getRight() >= 0) {
      memory.yAxis = (-frameP.x) * kx + frameMargin.x;
    }
    if(frameP.y <= 0 && frameP.getBottom() >= 0) {
      memory.xAxis = frameMargin.bottom - (-frameP.y) * ky;
    }

    if(frame.memory.projectPolygonConvergent == null || changeOnFrame || differentSize) frame.memory.projectPolygonConvergent = memory.projectedPolygon.clone();

  } else {
    frameP = memory.frameP;
    frameMargin = memory.frameMargin;
  }

  setStroke('rgb(50,50,50)', 2);

  if(memory.xAxis) line(frameMargin.x, memory.xAxis, memory.frameMargin.right, memory.xAxis);
  if(memory.yAxis) line(memory.yAxis, memory.frameMargin.y, memory.yAxis, memory.frameMargin.bottom);

  if(frame.containsPoint(mP)) {
    setStroke('rgb(50,50,50)', 0.5);
    line(frame.x + 2, mY + 0.5, frame.right - 4, mY + 0.5);
    line(mX + 0.5, frame.y + 2, mX + 0.5, frame.bottom - 4);
  }

  memory.projectPolygonConvergent.approach(memory.projectedPolygon, 0.1);

  network.nodeList.forEach(function(node, i) {
    node.x = memory.projectPolygonConvergent[i].x;
    node.y = memory.projectPolygonConvergent[i].y;
  });

  network.relationList.forEach(function(relation) {
    setStroke('black', relation.weight * 0.25);
    line(relation.node0.x, relation.node0.y, relation.node1.x, relation.node1.y);
  });

  network.nodeList.forEach(function(node) {
    if(NetworkDraw._drawNode(node, node.x, node.y, r)) {
      nodeOver = node;
    }
  });

  //values label

  if(frame.containsPoint(mP)) {
    if(nodeOver == null) {
      if(memory.actualLogScale) {
        NetworkDraw._drawNodeValues(
          Math.floor(10 * (Math.pow(Math.E, Math.log((frameP.right + 1) / (frameP.x + 1)) * (mX - frameMargin.x) / frameMargin.width) - 1)) / 10,
          Math.floor(10 * (Math.pow(Math.E, Math.log((frameP.bottom + 1) / (frameP.y + 1)) * (frameMargin.bottom - mY) / frameMargin.height) - 1)) / 10
        );
      } else {
        NetworkDraw._drawNodeValues(
          Math.floor(10 * (frameP.x + frameP.width * (mX - memory.frameMargin.x) / memory.frameMargin.width)) / 10,
          Math.floor(10 * (frameP.y + frameP.height * (memory.frameMargin.bottom - mY) / memory.frameMargin.height)) / 10
        );
      }
    } else {
      var index = network.nodeList.indexOf(nodeOver);
      NetworkDraw._drawNodeValues(polygon[index].x, polygon[index].y, nodeOver.name);
    }
  }


  return nodeOver;
};

/**
 * @ignore
 */
NetworkDraw._drawNodeValues = function(vx, vy, name) {
  var text = (name == null ? '' : (name + ': ')) + vx + ", " + vy;
  setFill('rgba(50,50,50,0.8)');
  fRect(mX - 2, mY - 2, -getTextW(text) - 4, -14);
  setText('white', 12, null, 'right', 'bottom');
  fText(text, mX - 4, mY - 2);
};


//to be tested

/**
 * drawNetworkMatrix
 * @ignore
 */
NetworkDraw.drawNetworkMatrix = function(frame, network, colors, relationsColorScaleFunction, margin, directed, normalizedNodeWeights, returnHovered) {
  relationsColorScaleFunction = relationsColorScaleFunction == null ? ColorOperators.grayScale : relationsColorScaleFunction;
  margin = margin == null ? 2 : margin;
  directed = directed == null ? false : directed;

  var i;
  var nodeList = network.nodeList;
  var relationList = network.relationList;
  var relation;

  var useWeights = (normalizedNodeWeights != null);

  var dX = frame.width / (nodeList.length + 1);
  var dY = frame.height / (nodeList.length + 1);
  var w = dX - margin;
  var h = dY - margin;

  var ix;
  var iy;

  var xx = dX;
  var yy = dY;

  returnHovered = returnHovered && frame.pointIsInside(mousePoint);

  if(returnHovered) var hoverValues = new Point(-1, -1);


  if(useWeights) {
    dX = frame.width - dX;
    dY = frame.height - dY;
    var ww;
    var hh;
    var xNodes = [];
    var yNodes = [];
    var wNodes = [];
    var hNodes = [];
  }

  for(i = 0; nodeList[i] != null; i++) {
    context.fillStyle = colors[i];
    if(useWeights) {
      ww = dX * normalizedNodeWeights[i];
      hh = dY * normalizedNodeWeights[i];
      context.fillRect(frame.x + xx, frame.y, ww - margin, h);
      context.fillRect(frame.x, frame.y + yy, w, hh - margin);

      if(returnHovered) {
        if(mouseX > frame.x + xx && mouseX < frame.x + xx + ww) hoverValues.x = i;
        if(mouseY > frame.y + yy && mouseY < frame.y + yy + hh) hoverValues.y = i;
      }
      xNodes[nodeList[i].id] = xx;
      yNodes[nodeList[i].id] = yy;
      wNodes[nodeList[i].id] = ww;
      hNodes[nodeList[i].id] = hh;
      xx += ww;
      yy += hh;



    } else {
      context.fillRect(frame.x + (i + 1) * dX, frame.y, w, h);
      context.fillRect(frame.x, frame.y + (i + 1) * dY, w, h);
    }
  }

  for(i = 0; relationList[i] != null; i++) {
    relation = relationList[i];
    context.fillStyle = relationsColorScaleFunction(relation.weight);
    if(useWeights) {
      context.fillRect(frame.x + xNodes[relation.node0.id], frame.y + yNodes[relation.node1.id], wNodes[relation.node0.id] - margin, hNodes[relation.node1.id] - margin);
      if(!directed) context.fillRect(frame.x + yNodes[relation.node1.id], frame.y + xNodes[relation.node0.id], hNodes[relation.node1.id] - margin, wNodes[relation.node0.id] - margin);
    } else {
      ix = nodeList.indexOf(relation.node0) + 1;
      iy = nodeList.indexOf(relation.node1) + 1;
      context.fillRect(frame.x + ix * dX, frame.y + iy * dY, w, h);
      if(!directed && (ix != iy)) {
        context.fillRect(frame.x + iy * dX, frame.y + ix * dY, w, h);
      }
    }

  }
  return hoverValues;
};
