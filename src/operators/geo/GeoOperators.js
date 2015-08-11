import { gradToRad } from "src/Global";

/**
 * @classdesc Provides a set of tools for dealing with distances and geometric
 * conversions.
 *
 * @namespace
 * @category geo
 */
function GeoOperators() {}
export default GeoOperators;

GeoOperators.EARTH_RADIUS = 6371009;
GeoOperators.EARTH_DIAMETER = GeoOperators.EARTH_RADIUS * 2;


/**
 * @todo write docs
 */
GeoOperators.geoCoordinateToDecimal = function(value) {
  return Math.floor(value) + (value - Math.floor(value)) * 1.66667;
};

/**
 * @todo write docs
 */
GeoOperators.geoDistance = function(point0, point1) {
  var a = Math.pow(Math.sin((point1.y - point0.y) * 0.5 * gradToRad), 2) + Math.cos(point0.y * gradToRad) * Math.cos(point1.y * gradToRad) * Math.pow(Math.sin((point1.x - point0.x) * 0.5 * gradToRad), 2);
  return GeoOperators.EARTH_DIAMETER * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * @todo write docs
 */
GeoOperators.polygonLength = function(polygon) {
  if(polygon.length < 2) return 0;

  var length = GeoOperators.geoDistance(polygon[0], polygon[1]);
  for(var i = 2; polygon[i] != null; i++) {
    length += GeoOperators.geoDistance(polygon[i - 1], polygon[i]);
  }
  return length;
};
