/**
 * ColorOperators
 * @constructor
 */
function ColorOperators() {};

ColorOperators.point3DToColor = function(point3D) {
  return ColorUtils.RGBtouint(point3D.x, point3D.y, point3D.z);
}
ColorOperators.colorToPoint3D = function(color) {
  return Point3D.fromArray(ColorUtils.uinttoRGB(color));
}