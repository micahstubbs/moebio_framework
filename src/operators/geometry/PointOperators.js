import Point from "src/dataTypes/geometry/Point";

/**
 * @classdesc Provides a set of tools that work with {@link Point|Points}.
 *
 * @namespace
 * @category geometry
 */
function PointOperators() {}
export default PointOperators;


/**
 * @todo write docs
 */
PointOperators.angleBetweenVectors = function(point0, point1) {
  return Math.atan2(point1.y, point1.x) - Math.atan2(point0.y, point0.x);
};

/**
 * @todo write docs
 */
PointOperators.angleFromTwoPoints = function(point0, point1) {
  return Math.atan2(point1.y - point0.y, point1.x - point0.x);
};

/**
 * @todo write docs
 */
PointOperators.dot = function(point0, point1) {
  return point0.x * point1.x + point0.y * point1.y;
};

/**
 * @todo write docs
 */
PointOperators.twoPointsInterpolation = function(point0, point1, t) {
  return new Point((1 - t) * point0.x + t * point1.x, (1 - t) * point0.y + t * point1.y);
};
