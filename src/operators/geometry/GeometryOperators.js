import Point from "src/dataTypes/geometry/Point";
import Point3D from "src/dataTypes/geometry/Point3D";
import PointOperators from "src/operators/geometry/PointOperators";
import Polygon3D from "src/dataTypes/geometry/Polygon3D";
import NumberList from "src/dataTypes/numeric/NumberList";

/**
 * @classdesc Provides a set of tools that work with Geometric data.
 *
 * @namespace
 * @category geometry
 */
function GeometryOperators() {}
export default GeometryOperators;


/**
 * from three Points calculates two control Points for the middle Point that will define a curve (using Bézier) that goes softly through the three points
 * TODO: finish method by taking into account distances
 */
GeometryOperators.getSoftenControlPoints = function(point0, point1, point2, controlVectorSize) {
  controlVectorSize = controlVectorSize || 10;
  var angle = PointOperators.angleFromTwoPoints(point0, point2);
  var controlPoint0 = new Point(point1.x - controlVectorSize * Math.cos(angle), point1.y - controlVectorSize * Math.sin(angle));
  var controlPoint1 = new Point(point1.x + controlVectorSize * Math.cos(angle), point1.y + controlVectorSize * Math.sin(angle));
  return [controlPoint0, controlPoint1];
};

/**
 * @todo write docs
 */
GeometryOperators.bezierCurvePoints = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t) {
  var s = 1 - t;
  var ax = s * x0 + t * c0x;
  var ay = s * y0 + t * c0y;

  var bx = s * c0x + t * c1x;
  var by = s * c0y + t * c1y;

  var cx = s * c1x + t * x1;
  var cy = s * c1y + t * y1;

  var ex = s * ax + t * bx;
  var ey = s * ay + t * by;

  var fx = s * bx + t * cx;
  var fy = s * by + t * cy;

  return new Point(t * fx + s * ex, t * fy + s * ey);
};



/**
 * @todo write docs
 */
GeometryOperators.trueBezierCurveHeightHorizontalControlPoints = function(x0, x1, y0, y1, c0x, c1x, x) {
  var dx = x1 - x0;
  x = (x - x0) / dx;
  c0x = (c0x - x0) / dx;
  c1x = (c1x - x0) / dx;

  if(GeometryOperators._bezierSimpleCurveTable == null) {
    var i, p;

    GeometryOperators._bezierSimpleCurveTable = new NumberList();

    for(i = 1; i < 10000; i++) {
      p = GeometryOperators.bezierCurvePoints(0, 0, c0x, 0, c1x, 1, 1, 1, i / 10000);
      GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * p.x)] = p.y;
    }

    GeometryOperators._bezierSimpleCurveTable[0] = 0;
    GeometryOperators._bezierSimpleCurveTable[1] = 1;
  }

  return GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * x)] * (y1 - y0) + y0;

};


/**
 * @todo write docs
 * This an approximation, it doesn't take into account actual values of c0x and c1x
 */
GeometryOperators.bezierCurveHeightHorizontalControlPoints = function(y0, c0x, c1x, y1, t) { //TODO:fix

  var cosinus = Math.cos(Math.PI * (t - 1));
  var sign = cosinus > 0 ? 1 : -1;

  return(0.5 + 0.5 * (Math.pow(cosinus * sign, 0.6) * sign)) * (y1 - y0) + y0;
};

/**
 * unefficient method (uses Newton strategy)
 */
GeometryOperators.distanceToBezierCurve = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, p, returnPoint) {
  var minDT = 0.01;
  var t0 = 0;
  var t1 = 1;
  var p0 = new Point(x0, y0);
  var p0I = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, minDT);
  var p1 = new Point(x1, y1);
  var d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
  var d0I = Math.pow(p0I.x - p.x, 2) + Math.pow(p0I.y - p.y, 2);
  var d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);

  var i;

  var pM;
  var pMI;

  for(i = 0; i < 10; i++) {
    pM = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5);
    pMI = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5 + minDT);

    d0 = Math.pow(pM.x - p.x, 2) + Math.pow(pM.y - p.y, 2);
    d0I = Math.pow(pMI.x - p.x, 2) + Math.pow(pMI.y - p.y, 2);

    if(d0 < d0I) {
      t1 = (t0 + t1) * 0.5;
      p1 = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t1);
      d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);
    } else {
      t0 = (t0 + t1) * 0.5;
      p0 = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t0);
      d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
    }
  }

  if(returnPoint) return p1;
  return Math.sqrt(Math.min(d0, d1));
};

/**
 * @todo write docs
 */
GeometryOperators.triangleContainsPoint = function(pT0, pT1, pT2, p) {
  var a = (pT0.x - p.x) * (pT1.y - p.y) - (pT1.x - p.x) * (pT0.y - p.y);
  var b = (pT1.x - p.x) * (pT2.y - p.y) - (pT2.x - p.x) * (pT1.y - p.y);
  var c = (pT2.x - p.x) * (pT0.y - p.y) - (pT0.x - p.x) * (pT2.y - p.y);
  return(a > 0 && b > 0 && c > 0) || (a >= 0 && b >= 0 && c >= 0);
};

/**
 * @todo write docs
 */
GeometryOperators.triangleArea = function(triangle) {
  return Math.abs(triangle.a.x * (triangle.b.y - triangle.c.y) + triangle.b.x * (triangle.c.y - triangle.a.y) + triangle.c.x * (triangle.a.y - triangle.b.y)) / 2;
};


/////////////lines (line is a Point with values m and b in y=mx+b)

/**
 * @todo write docs
 */
GeometryOperators.lineFromTwoPoints = function(point0, point1) {
  if(point0.x == point1.x) return new Point(Infinity, point0.x);
  var m = (point1.y - point0.y) / (point1.x - point0.x);
  return new Point(m, point0.y - m * point0.x);
};

/**
 * @todo write docs
 */
GeometryOperators.distancePointToLine = function(point, line) {
  var m2;
  var b2;
  if(line.x === 0) {
    m2 = Infinity;
    b2 = point.x;
  } else {
    m2 = -1 / line.x;
    b2 = point.y - m2 * point.x;
  }
  var interPoint = GeometryOperators.intersectionLines(line, new Point(m2, b2));
  return Math.sqrt(Math.pow(point.x - interPoint.x, 2) + Math.pow(point.y - interPoint.y, 2));
};

/**
 * @todo write docs
 */
GeometryOperators.distancePointToSegment = function(point, point0Segment, point1Segment) {
  var m = point0Segment.x == point1Segment.x ? Infinity : (point1Segment.y - point0Segment.y) / (point1Segment.x - point0Segment.x);
  var line = m == Infinity ? new Point(Infinity, point0Segment.x) : new Point(m, point0Segment.y - m * point0Segment.x);
  var m2;
  var b2;
  if(line.x === 0) {
    m2 = Infinity;
    b2 = point.x;
  } else {
    m2 = -1 / line.x;
    b2 = point.y - m2 * point.x;
  }
  var interPoint = GeometryOperators.intersectionLines(line, new Point(m2, b2));
  if(interPoint.x >= Math.min(point0Segment.x, point1Segment.x) && interPoint.x <= Math.max(point0Segment.x, point1Segment.x)) return point.distanceToPoint(interPoint);
  return Math.min(point.distanceToPoint(point0Segment), point.distanceToPoint(point1Segment));
};

/**
 * @todo write docs
 */
GeometryOperators.intersectionLines = function(line0, line1) {
  if(line0.x == line1.x) {
    if(line0.y == line1.y) {
      if(line0.x == Infinity) {
        return new Point(line0.y, 0);
      } else {
        return new Point(0, line0.y);
      }
    }
    return null;
  }
  if(line0.x == Infinity) {
    return new Point(line0.y, line1.x * line0.y + line1.y);
  } else if(line1.x == Infinity) {
    return new Point(line1.y, line0.x * line1.y + line0.y);
  }

  var xx = (line1.y - line0.y) / (line0.x - line1.x);
  return new Point(xx, line0.x * xx + line0.y);
};


/**
 * @todo write docs
 */
GeometryOperators.VennCircles = function(area0, area1, areaIntersection, centerInLens, precision) {
  var rA = Math.sqrt(area0 / Math.PI);
  var rB = Math.sqrt(area1 / Math.PI);
  var d = GeometryOperators.circleDistancesFromCommonArea(rA, rB, areaIntersection, precision);

  var circle0;
  var circle1;

  if(centerInLens) {
    var x0 = (d * d + Math.pow(rA, 2) - Math.pow(rB, 2)) / (2 * d);

    circle0 = new Point3D(-x0, 0, rA);
    circle1 = new Point3D(d - x0, 0, rB);

  } else {
    circle0 = new Point3D(-d * 0.5, 0, rA);
    circle1 = new Point3D(d * 0.5, 0, rB);
  }

  if(areaIntersection === 0) {
    circle0.x -= d * 0.1;
    circle1.x += d * 0.1;
  }

  return new Polygon3D(circle0, circle1);
};

/**
 * very lazy and ineficcient solution (Newton algorithm)
 * @param r0
 * @param r1
 * @param areaComun
 * @param precision
 *
 */
GeometryOperators.circleDistancesFromCommonArea = function(r0, r1, commonArea, precision) {
  precision = precision || 0.1;
  var d0 = Math.max(r0, r1) - Math.min(r0, r1);
  var d1 = r0 + r1;
  var dM = (d0 + d1) * 0.5;

  var attempts = 0;

  var currentArea = GeometryOperators.circlesCommonArea(r0, r1, dM);

  while(Math.abs(currentArea - commonArea) > precision && attempts < 200) {
    if(currentArea > commonArea) {
      d0 = dM;
      dM = (d1 + dM) * 0.5;
    } else {
      d1 = dM;
      dM = (dM + d0) * 0.5;
    }
    attempts++;
    currentArea = GeometryOperators.circlesCommonArea(r0, r1, dM);
  }
  return dM;
};

/**
 * @todo write docs
 */
GeometryOperators.circlesCommonArea = function(ra, rb, d) {
  if(d >= (ra + rb)) return 0;
  if(d + Math.min(ra, rb) <= Math.max(ra, rb)) {
    return Math.PI * Math.pow(Math.min(ra, rb), 2);
  }

  var d2 = Math.pow(d, 2);
  var ra2 = Math.pow(ra, 2);
  var rb2 = Math.pow(rb, 2);

  return ra2 * Math.acos((d2 + ra2 - rb2) / (2 * d * ra)) + rb2 * Math.acos((d2 + rb2 - ra2) / (2 * d * rb)) - 0.5 * Math.sqrt((-d + ra + rb) * (d + ra - rb) * (d - ra + rb) * (d + ra + rb));
};

/**
 * This method return the angles required to draw the intersection shape (lens) of two circles
 */
GeometryOperators.circlesLensAngles = function(circle0, circle1) {
  if(circle1.x < circle0.x) {
    var _circle = circle1.clone();
    circle1 = circle0.clone();
    circle0 = _circle;
  }
  if(circle1.x + circle1.z <= circle0.x + circle0.z) {
    return null;
  } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
    return null;
  }

  var d = circle1.x - circle0.x;
  var x0 = (d * d + Math.pow(circle0.z, 2) - Math.pow(circle1.z, 2)) / (2 * d);
  var alfa = Math.acos(x0 / circle0.z);
  var h = circle0.z * Math.sin(alfa);
  var beta = Math.asin(h / circle1.z);

  if(circle0.x + x0 < circle1.x) {
    return new NumberList(-alfa, alfa, Math.PI - beta, Math.PI + beta);
  } else {
    return new NumberList(-alfa, alfa, beta, -beta);
  }
};




//////Delauney

/**
 * @todo write docs
 */
GeometryOperators.delauney = function(polygon) { /// ---> move to Polygon operators, chnge name to getDelauneyTriangulation
  return _triangulate(polygon);
};


/**
 * @ignore
 */
function Triangle(a, b, c) {
  this.a = a;
  this.b = b;
  this.c = c;

  var A = b.x - a.x,
    B = b.y - a.y,
    C = c.x - a.x,
    D = c.y - a.y,
    E = A * (a.x + b.x) + B * (a.y + b.y),
    F = C * (a.x + c.x) + D * (a.y + c.y),
    G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
    minx, miny, dx, dy;

  /* If the points of the triangle are collinear, then just find the
   * extremes and use the midpoint as the center of the circumcircle. */
  if(Math.abs(G) < 0.000001) {
    minx = Math.min(a.x, b.x, c.x);
    miny = Math.min(a.y, b.y, c.y);
    dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
    dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

    this.x = minx + dx;
    this.y = miny + dy;
    this.r = dx * dx + dy * dy;
  }

  else {
    this.x = (D * E - B * F) / G;
    this.y = (A * F - C * E) / G;
    dx = this.x - a.x;
    dy = this.y - a.y;
    this.r = dx * dx + dy * dy;
  }
}


/**
 * @ignore
 */
function byX(a, b) {
  return b.x - a.x;
}

/**
 * @ignore
 */
function dedup(edges) {
  var j = edges.length,
    a, b, i, m, n;

  outer: while(j) {
    b = edges[--j];
    a = edges[--j];
    i = j;
    while(i) {
      n = edges[--i];
      m = edges[--i];
      if((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2);
        edges.splice(i, 2);
        j -= 2;
        continue outer;
      }
    }
  }
}

/**
 * @ignore
 */
function _triangulate(vertices) {
  /* Bail if there aren't enough vertices to form any triangles. */
  if(vertices.length < 3)
    return [];

  /* Ensure the vertex array is in order of descending X coordinate
   * (which is needed to ensure a subquadratic runtime), and then find
   * the bounding box around the points. */
  vertices.sort(byX);

  var i = vertices.length - 1,
    xmin = vertices[i].x,
    xmax = vertices[0].x,
    ymin = vertices[i].y,
    ymax = ymin;

  while(i--) {
    if(vertices[i].y < ymin) ymin = vertices[i].y;
    if(vertices[i].y > ymax) ymax = vertices[i].y;
  }

  /* Find a supertriangle, which is a triangle that surrounds all the
   * vertices. This is used like something of a sentinel value to remove
   * cases in the main algorithm, and is removed before we return any
   * results.
   *
   * Once found, put it in the "open" list. (The "open" list is for
   * triangles who may still need to be considered; the "closed" list is
   * for triangles which do not.) */
  var dx = xmax - xmin,
    dy = ymax - ymin,
    dmax = (dx > dy) ? dx : dy,
    xmid = (xmax + xmin) * 0.5,
    ymid = (ymax + ymin) * 0.5,
    open = [
      new Triangle(
          {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
          {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
          {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
        )
    ],
    closed = [],
    edges = [],
    j, a, b;

  /* Incrementally add each vertex to the mesh. */
  i = vertices.length;
  while(i--) {
    /* For each open triangle, check to see if the current point is
     * inside it's circumcircle. If it is, remove the triangle and add
     * it's edges to an edge list. */
    edges.length = 0;
    j = open.length;
    while(j--) {
      /* If this point is to the right of this triangle's circumcircle,
       * then this triangle should never get checked again. Remove it
       * from the open list, add it to the closed list, and skip. */
      dx = vertices[i].x - open[j].x;
      if(dx > 0 && dx * dx > open[j].r) {
        closed.push(open[j]);
        open.splice(j, 1);
        continue;
      }

      /* If not, skip this triangle. */
      dy = vertices[i].y - open[j].y;
      if(dx * dx + dy * dy > open[j].r)
        continue;

      /* Remove the triangle and add it's edges to the edge list. */
      edges.push(
        open[j].a, open[j].b,
        open[j].b, open[j].c,
        open[j].c, open[j].a
      );
      open.splice(j, 1);
    }

    /* Remove any doubled edges. */
    dedup(edges);

    /* Add a new triangle for each edge. */
    j = edges.length;
    while(j) {
      b = edges[--j];
      a = edges[--j];
      open.push(new Triangle(a, b, vertices[i]));
    }
  }

  /* Copy any remaining open triangles to the closed list, and then
   * remove any triangles that share a vertex with the supertriangle. */
  Array.prototype.push.apply(closed, open);

  i = closed.length;
  while(i--)
    if(closed[i].a.__sentinel ||
      closed[i].b.__sentinel ||
      closed[i].c.__sentinel)
      closed.splice(i, 1);

    /* Yay, we're done! */
  return closed;
}
