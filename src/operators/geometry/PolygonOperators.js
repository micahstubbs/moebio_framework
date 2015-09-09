import Polygon from "src/dataTypes/geometry/Polygon";
import NumberList from "src/dataTypes/numeric/NumberList";
import Tree from "src/dataTypes/structures/networks/Tree";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import Node from "src/dataTypes/structures/elements/Node";
import Point from "src/dataTypes/geometry/Point";
import GeometryOperators from "src/operators/geometry/GeometryOperators";
import Interval from "src/dataTypes/numeric/Interval";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import { TwoPi } from "src/Global";

/**
 * @classdesc Provides a set of tools that work with Polygons
 *
 * @namespace
 * @category geometry
 */
function PolygonOperators() {}
export default PolygonOperators;

/**
 * builds a Hull polygon from a set of points
 * @param  {Polygon} polygon set of points
 * @param  {Boolean} returnIndexes if true returns the indexes of external points, connected by the Hull polygon (false by default)
 * @return {List} Hull polygn or list of indexes
 * tags:geometry
 */
PolygonOperators.hull = function(polygon, returnIndexes) {
  returnIndexes = returnIndexes == null ? false : returnIndexes;
  var i;
  var t;
  var p = polygon;
  var n = p.length;
  var k = 0;
  var h = new Polygon();
  var indexes;
  if(returnIndexes){
    indexes = new NumberList();
  }

  p = PolygonOperators.sortOnXY(p);

  if(returnIndexes) {
    for(i = 0; i < n; i++) {
      while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
        k--;
      h[k++] = p[i];
      indexes[k - 1] = i;
    }

    for(i = n - 2, t = k + 1; i >= 0; i--) {
      while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
        k--;
      h[k++] = p[i];
      indexes[k - 1] = i;
    }

    return NumberList.fromArray(indexes.getSubList(new Interval(0, k - 2)));
  }

  for(i = 0; i < n; i++) {
    while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
      k--;
    h[k++] = p[i];
  }

  for(i = n - 2, t = k + 1; i >= 0; i--) {
    while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
      k--;
    h[k++] = p[i];
  }

  return Polygon.fromArray(h.getSubList(new Interval(0, k - 2)));
};

/**
 * builds a dendrogram (tree) from a Polygon (currently using barycenter for distances)
 * @param  {Polygon} polygon
 * @return {Tree} dendrogram
 * tags:geometry
 */
PolygonOperators.buildDendrogramFromPolygon = function(polygon) {
  var tree = new Tree();
  var node;
  var tW;
  var parent;
  var leaves = new NodeList();

  var node0, node1, nodeList = new Polygon();

  polygon.forEach(function(point, i) {
    node = new Node('point_' + i, 'point_' + i);
    node.weight = 1;
    node.barycenter = point;
    node.point = point;
    node.polygon = new Polygon(point);
    tree.addNode(node);
    nodeList.push(node);
    leaves.push(node);
  });

  tree.nodeList = tree.nodeList.getReversed();

  //c.l('-');

  var buildNodeFromPair = function(node0, node1) {
    var parent = new Node("(" + node0.id + "," + node1.id + ")", "(" + node0.id + "," + node1.id + ")");
    parent.polygon = node0.polygon.concat(node1.polygon);
    //c.l("node0.polygon.length, node1.polygon.length, parent.polygon.length", node0.polygon.length, node1.polygon.length, parent.polygon.length);
    parent.weight = parent.polygon.length;
    tW = node0.weight + node1.weight;
    parent.barycenter = new Point((node0.weight * node0.barycenter.x + node1.weight * node1.barycenter.x) / tW, (node0.weight * node0.barycenter.y + node1.weight * node1.barycenter.y) / tW);
    //c.l('parent.barycenter.x', parent.barycenter.x, parent.barycenter.y);
    tree.addNode(parent);
    tree._newCreateRelation(parent, node0);
    tree._newCreateRelation(parent, node1);
    return parent;
  };

  var closestPair;
  while(nodeList.length > 1) {
    closestPair = PolygonOperators._findClosestNodes(nodeList);
    node0 = nodeList[closestPair[0]];
    node1 = nodeList[closestPair[1]];
    parent = buildNodeFromPair(node0, node1);
    parent.distance = closestPair.distance;
    console.log('distance:', parent.distance);
    nodeList.splice(closestPair[0], 1);
    nodeList.splice(closestPair[1] - 1, 1);
    nodeList.push(parent);
  }

  tree.nodeList = tree.nodeList.getReversed();

  var assignLevel = function(node, parentLevel) {
    node.level = parentLevel + 1;
    node.toNodeList.forEach(function(son) {
      assignLevel(son, node.level);
    });
  };

  assignLevel(tree.nodeList[0], -1);

  tree.leaves = leaves;

  return tree;

};

/**
 * @todo write docs
 */
PolygonOperators._findClosestNodes = function(nodeList) {
  var i, j;
  var d2;
  var d2Min = 9999999999;
  var pair;

  for(i = 0; nodeList[i + 1] != null; i++) {
    for(j = i + 1; nodeList[j] != null; j++) {
      d2 = Math.pow(nodeList[i].barycenter.x - nodeList[j].barycenter.x, 2) + Math.pow(nodeList[i].barycenter.y - nodeList[j].barycenter.y, 2);
      if(d2 < d2Min) {
        d2Min = d2;
        pair = [i, j];
      }
    }
  }

  pair.distance = d2Min;

  return pair;
};


/**
 * @todo write docs
 */
PolygonOperators.sortOnXY = function(polygon) {
  return polygon.sort(function(p0, p1) {
    if(p0.x < p1.x) return -1;
    if(p0.x == p1.x && p0.y < p1.y) return -1;
    return 1;
  });
};

//TODO: move this to PointOperators
/**
 * @todo write docs
 */
PolygonOperators.crossProduct3Points = function(o, a, b) {
  return(a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
};

/**
 * @todo write docs
 */
PolygonOperators.expandFromBarycenter = function(polygon, factor) {
  var newPolygon = new Polygon();
  var barycenter = polygon.getBarycenter();

  for(var i = 0; polygon[i] != null; i++) {
    newPolygon[i] = polygon[i].expandFromPoint(barycenter, factor);
  }

  return newPolygon;
};

/**
 * @todo write docs
 */
PolygonOperators.expandInAngles = function(polygon, amount) { //TODO: test if it works with convex polygons
  var newPolygon = new Polygon();
  var p0 = polygon[polygon.length - 1];
  var p1 = polygon[0];
  var p2 = polygon[1];

  var a0;
  var a1;
  var sign;

  var a = 0.5 * Math.atan2(p1.y - p2.y, p1.x - p2.x) + 0.5 * Math.atan2(p1.y - p0.y, p1.x - p0.x);
  var globalSign = polygon.containsPoint(new Point(p1.x + Math.floor(amount) * Math.cos(a), p1.y + Math.floor(amount) * Math.sin(a))) ? -1 : 1;


  for(var i = 0; polygon[i] != null; i++) {
    p0 = polygon[(i - 1 + polygon.length) % polygon.length];
    p1 = polygon[i];
    p2 = polygon[(i + 1) % polygon.length];
    a0 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    sign = Math.abs(a1 - a0) < Math.PI ? -1 : 1;
    a = 0.5 * a0 + 0.5 * a1;
    //sign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
    newPolygon[i] = new Point(p1.x + globalSign * sign * amount * Math.cos(a), p1.y + globalSign * sign * amount * Math.sin(a));
  }

  return newPolygon;
};

/**
 * @todo write docs
 */
PolygonOperators.simplifyPolygon = function(polygon, margin) {
  margin = margin == null || margin === 0 || margin === undefined ? 1 : margin;
  var newPolygon = polygon.clone();
  var p0;
  var p1;
  var p2;
  var line;
  var i;
  var nPoints = polygon.length;
  for(i = 0; i < nPoints; i++) {
    p0 = newPolygon[i];
    p1 = newPolygon[(i + 1) % nPoints];
    p2 = newPolygon[(i + 2) % nPoints];
    line = GeometryOperators.lineFromTwoPoints(p0, p2);
    if(GeometryOperators.distancePointToLine(p1, line) < margin) {
      //newPolygon.splice((i+1)%nPoints, 1);
      newPolygon = newPolygon.getWithoutElementAtIndex((i + 1) % nPoints);
      i--;
    }
    nPoints = newPolygon.length;
  }
  return newPolygon;
};


/*
 * used techinique: draws the bézier polygon and checks color
 */
/**
 * @todo write docs
 */
PolygonOperators.bezierPolygonContainsPoint = function(polygon, point, border, graphics) {
  var frame = polygon.getFrame();
  graphics.clearContext();
  graphics.context.fillStyle = 'black';
  graphics.context.fillRect(0, 0, frame.width, frame.height);
  if(border != null) {
    graphics.context.strokeStyle = 'black';
    graphics.context.lineWidth = border;
  }
  graphics.context.fillStyle = 'white';
  graphics.context.beginPath();
  graphics.drawBezierPolygon(polygon, -frame.x, -frame.y);
  graphics.context.fill();
  if(border != null) graphics.context.stroke();
  var data = graphics.context.getImageData(point.x - frame.x, point.y - frame.y, 1, 1).data;
  graphics.clearContext();
  return data[0] > 0;
};


/*
 * used techinique: draws the bézier polygon and checks color
 * best center: the center of biggest circle within the polygon
 * [!] very unefficient
 */
/**
 * @todo write docs
 */
PolygonOperators.getBezierPolygonBestCenter = function(polygon, nAttempts, graphics) {
  nAttempts = nAttempts == null ? 500 : nAttempts;

  var frame = polygon.getFrame();
  graphics.context.fillStyle = 'black';
  graphics.context.fillRect(0, 0, frame.width, frame.height);
  graphics.context.fillStyle = 'white';
  graphics.context.beginPath();
  graphics.drawBezierPolygon(polygon, -frame.x, -frame.y);
  graphics.context.fill();

  var center;
  var angle;
  var r;
  var rMax = 0;
  var bestCenter;


  for(var i = 0; i < nAttempts; i++) {
    center = frame.getRandomPoint();
    for(angle = 0; angle <= TwoPi; angle += 0.1) {
      r = angle;
      var data = graphics.context.getImageData(center.x + r * Math.cos(angle) - frame.x, center.y + r * Math.sin(angle) - frame.y, 1, 1).data;
      if(data[0] === 0) {
        if(r > rMax) {
          rMax = r;
          bestCenter = center;
        }
        break;
      }
    }
  }

  return bestCenter;
};


/**
 * @todo write docs
 */
PolygonOperators.convexHull = function(polygon, deepness) {
  var indexesHull = this.hull(polygon, true);
  var pointsLeftIndexes = NumberListGenerators.createSortedNumberList(polygon.length);
  pointsLeftIndexes = pointsLeftIndexes.getWithoutElementsAtIndexes(indexesHull);
  var j;
  var k;
  var p0;
  var p1;
  var pC = new Point();
  var p;
  var d;
  var dMin = deepness - 1;
  var jMin;
  var kMin;
  var dP;
  var nHull = indexesHull.length;

  while(dMin < deepness) {
    //c.log(dMin, deepness, nHull, pointsLeftIndexes.length);
    dMin = 999999999;
    for(j = 0; j < nHull; j++) {
      p0 = polygon[indexesHull[j]];
      p1 = polygon[indexesHull[(j + 1) % indexesHull.length]];
      pC.x = (p0.x + p1.x) * 0.5;
      pC.y = (p0.y + p1.y) * 0.5;
      dP = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
      for(k = 0; pointsLeftIndexes[k] != null; k++) {
        p = polygon[pointsLeftIndexes[k]];
        //d = Math.pow(p.x-pC.x, 2)+Math.pow(p.y-pC.y, 2);
        d = (Math.sqrt(Math.pow(p.x - p0.x, 2) + Math.pow(p.y - p0.y, 2)) + Math.sqrt(Math.pow(p.x - p1.x, 2) + Math.pow(p.y - p1.y, 2))) / Math.pow(dP, 2);
        if(d < dMin) {
          dMin = d;
          jMin = j;
          kMin = k;
        }
      }
    }

    //c.log("  ", dMin);

    for(j = nHull - 1; j > jMin; j--) {
      indexesHull[j + 1] = indexesHull[j];
    }
    indexesHull[jMin + 1] = pointsLeftIndexes[kMin];

    //pointsLeftIndexes.removeElement(pointsLeftIndexes[kMin]); //!!!! TODO: FIX THIS!
    pointsLeftIndexes.splice(kMin, 1);

    if(pointsLeftIndexes.length === 0) return indexesHull;

    nHull++;
  }
  return indexesHull;
};

/**
 * @todo write docs
 */
PolygonOperators.controlPointsFromPointsAnglesIntensities = function(polygon, angles, intensities) {
  var controlPoints = new Polygon();
  for(var i = 0; polygon[i] != null; i++) {
    if(i > 0) controlPoints.push(new Point(polygon[i].x - intensities[i] * Math.cos(angles[i]), polygon[i].y - intensities[i] * Math.sin(angles[i])));
    if(i < polygon.length - 1) controlPoints.push(new Point(polygon[i].x + intensities[i] * Math.cos(angles[i]), polygon[i].y + intensities[i] * Math.sin(angles[i])));
  }
  return controlPoints;
};


/**
 * @todo write docs
 */
PolygonOperators.placePointsInsidePolygon = function(polygon, nPoints, mode) {
  var points = new Polygon();
  var frame = polygon.getFrame();
  mode = mode || 0;
  switch(mode) {
    case 0: //random simple
      var p;
      while(points.length < nPoints) {
        p = new Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
        if(PolygonOperators.polygonContainsPoint(polygon, p)) points.push(p);
      }
      return points;      
  }
};

/**
 * @todo write docs
 */
PolygonOperators.placePointsInsideBezierPolygon = function(polygon, nPoints, mode, border) {
  var points = new Polygon();
  var frame = polygon.getFrame();
  mode = mode || 0;
  switch(mode) {
    case 0: //random simple
      var p;
      var nAttempts = 0;
      while(points.length < nPoints && nAttempts < 1000) {
        p = new Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
        nAttempts++;
        if(PolygonOperators.bezierPolygonContainsPoint(polygon, p, border)) {
          points.push(p);
          nAttempts = 0;
        }
      }
      return points;      
  }
};
