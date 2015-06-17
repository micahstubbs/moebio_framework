Matrix.prototype = new DataModel();
Matrix.prototype.constructor = Matrix;


//all Matrix objects and methods should be ported to NumberTable (same at MatrixGenerators.json)

/**
 * @classdesc Matrix implementation.
 * Some credits to http://strd6.com/2010/06/introducing-matrix-js/
 *
 * @constructor
 * @description Creates a new Matrix instance.
 * @category numbers
 */
function Matrix(a, b, c, d, tx, ty) {
  DataModel.apply(this, arguments);
  this.name = "";
  this.type = "Matrix";
  this.a = a == null ? 1 : a;
  this.b = b == null ? 0 : b;
  this.c = c == null ? 0 : c;
  this.d = d == null ? 1 : d;
  this.tx = tx == null ? 0 : tx;
  this.ty = ty == null ? 0 : ty;
}


/**
 * Returns the result of applying the geometric transformation represented by the
 * Matrix object to the specified point.
 * @methodOf Matrix#
 * @see #deltaTransformPoint
 *
 * @returns {Point} A new point with the transformation applied.
 */
Matrix.prototype.transformPoint = function(point) {
  return new Point(
    this.a * point.x + this.c * point.y + this.tx,
    this.b * point.x + this.d * point.y + this.ty
  );
};

// /**
// * Applies Matrix to context transform
// **/
// Matrix.prototype.applyToContext=function(context){
// context.transform(this.a, this.b, this.c, this.d, this.tx, this.ty);
// }

/**
 * Returns the result of this matrix multiplied by another matrix
 * combining the geometric effects of the two. In mathematical terms,
 * concatenating two matrixes is the same as combining them using matrix multiplication.
 * If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
 * http://mathworld.wolfram.com/MatrixMultiplication.html
 * @methodOf Matrix#
 *
 * @param {Matrix} matrix The matrix to multiply this matrix by.
 * @returns {Matrix} The result of the matrix multiplication, a new matrix.
 */
Matrix.prototype.concat = function(matrix) {
  return Matrix(
    this.a * matrix.a + this.c * matrix.b,
    this.b * matrix.a + this.d * matrix.b,
    this.a * matrix.c + this.c * matrix.d,
    this.b * matrix.c + this.d * matrix.d,
    this.a * matrix.tx + this.c * matrix.ty + this.tx,
    this.b * matrix.tx + this.d * matrix.ty + this.ty
  );
};

/**
 * Given a point in the pretransform coordinate space, returns the coordinates of
 * that point after the transformation occurs. Unlike the standard transformation
 * applied using the transformPoint() method, the deltaTransformPoint() method's
 * transformation does not consider the translation parameters tx and ty.
 * @see #transformPoint
 *
 * @return {Point} A new point transformed by this matrix ignoring tx and ty.
 */
Matrix.prototype.deltaTransformPoint = function(point) {
  return Point(
    this.a * point.x + this.c * point.y,
    this.b * point.x + this.d * point.y
  );
};

/**
 * Returns the inverse of the matrix.
 * http://mathworld.wolfram.com/MatrixInverse.html
 *
 * @returns {Matrix} A new matrix that is the inverse of this matrix.
 */
Matrix.prototype.getInverse = function() {
    var determinant = this.a * this.d - this.b * this.c;
    return new Matrix(
		this.d / determinant,
		-this.b / determinant,
		-this.c / determinant,
		this.a / determinant,
		(this.c * this.ty - this.d * this.tx) / determinant,
		(this.b * this.tx - this.a * this.ty) / determinant
    );
  };
  /**
   * Returns a new matrix that corresponds this matrix multiplied by a
   * a rotation matrix.
   * @see Matrix.rotation
   *
   * @param {Number} theta Amount to rotate in radians.
   * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
   * @returns {Matrix} A new matrix, rotated by the specified amount.
   */
Matrix.prototype.rotate = function(theta, aboutPoint) {
  return this.concat(Matrix.rotation(theta, aboutPoint));
};

/**
 * Returns a new matrix that corresponds this matrix multiplied by a
 * a scaling matrix.
 * @see Matrix.scale
 *
 * @param {Number} sx
 * @param {Number} [sy]
 * @param {Point} [aboutPoint] The point that remains fixed during the scaling
 * @returns {Matrix}
 */
Matrix.prototype.scale = function(sx, sy, aboutPoint) {
  return this.concat(Matrix.scale(sx, sy, aboutPoint));
};


/**
 * @methodOf Matrix#
 * @see Matrix.translation
 *
 * @param {Number} tx The translation along the x axis.
 * @param {Number} ty The translation along the y axis.
 * @returns {Matrix} A new matrix with the translation applied.
 */
Matrix.prototype.translate = function(tx, ty) {
  return this.concat(Matrix.translation(tx, ty));
};
