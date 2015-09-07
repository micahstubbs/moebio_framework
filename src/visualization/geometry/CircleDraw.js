import Polygon3D from "src/dataTypes/geometry/Polygon3D";
import Point3D from "src/dataTypes/geometry/Point3D";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

/**
 * @classdesc Functions for drawing circles.
 *
 * @namespace
 * @category drawing
 */
function CircleDraw() {}
export default CircleDraw;

CircleDraw.circlesCloud = function(weights, frame, margin) {
  if(weights == null ||  weights.length === 0) return null;

  margin = margin == null ? 0 : margin;

  var normWeights = NumberListOperators.normalizedToMax(weights).sqrt();
  var circlesPlaced = new Polygon3D();

  var a = 0;
  var r = 0;

  var px = 0;
  var py = 0;
  var center = frame.getCenter();
  var rMax = normWeights[0] * 100;
  var rCircle;
  var firstR;

  var prop = frame.width / frame.height;

  for(var i = 0; normWeights[i] != null; i++) {
    rCircle = normWeights[i] * 100;
    if(i === 0) {
      px = center.x;
      py = center.y;
      firstR = rCircle;
    } else {
      a = 0; //i*0.5;
      r = firstR + rCircle + margin + 0.1;
      while(CircleDraw._pointInCircles(circlesPlaced, px, py, rCircle, margin)) {
        r += 0.1;
        a += r * 0.005;

        px = center.x + prop * r * Math.cos(a);
        py = center.y + r * Math.sin(a);
      }
      rMax = Math.max(rMax, prop * r + normWeights[i] * 100);
    }

    circlesPlaced[i] = new Point3D(px, py, rCircle);
  }

  var circle;
  prop = 0.5 * frame.width / (rMax + 0.001);
  for(i = 0; circlesPlaced[i] != null; i++) {
    circle = circlesPlaced[i];
    circle.x = center.x + (circle.x - center.x) * prop;
    circle.y = center.y + (circle.y - center.y) * prop;
    circle.z *= prop;
  }

  return circlesPlaced;
};

CircleDraw._pointInCircles = function(circles, px, py, r, margin) {
  var circle;
  for(var i = 0; circles[i] != null; i++) {
    circle = circles[i];
    if(Math.pow(circle.x - px, 2) + Math.pow(circle.y - py, 2) < Math.pow(circle.z + r + margin, 2)) return true;
  }
  return false;
};