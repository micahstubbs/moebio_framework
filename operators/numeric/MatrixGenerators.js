/**
* MatrixGenerators
* @constructor
*/
function MatrixGenerators(){};


/**
   * Returns a transformation matrix from a triangle mapping
   *
   * @returns Matrix
   *
   **/
// TODO: resolve particular cases (right angles)
MatrixGenerators.createMatrixFromTrianglesMapping=function(v0, v1, v2, w0, w1, w2){
	if(v1.y != v0.y){
		var k = (v2.y-v0.y)/(v1.y-v0.y);

		var a = (w2.x-w0.x-(w1.x-w0.x)*k)/(v2.x-v0.x-(v1.x-v0.x)*k);
		var b = k*(w1.x-w0.x)/(v2.y-v0.y) - a*(v1.x-v0.x)/(v1.y-v0.y);

		var c = (w2.y-w0.y-(w1.y-w0.y)*k)/(v2.x-v0.x-(v1.x-v0.x)*k);
		var d = k*(w1.y-w0.y)/(v2.y-v0.y) - c*(v1.x-v0.x)/(v1.y-v0.y);
	} else {
		a = (w1.x-w0.x)/(v1.x-v0.x);
		b = (w2.x-w0.x)/(v2.y-v0.y) - a*(v2.x-v0.x)/(v2.y-v0.y);

		c = (w1.y-w0.y)/(v1.x-v0.x);
		d = (w2.y-w0.y)/(v2.y-v0.y) - c*(v2.x-v0.x)/(v2.y-v0.y);
	}

	return new Matrix(a, c, b, d, w0.x - a*v0.x - b*v0.y, w0.y - c*v0.x - d*v0.y);
}


//TODO: place this in the correct place
MatrixGenerators.applyTransformationOnCanvasFromPoints=function(context, v0, v1, v2, w0, w1, w2){
	if(v1.y != v0.y){
		var k = (v2.y-v0.y)/(v1.y-v0.y);

		var a = (w2.x-w0.x-(w1.x-w0.x)*k)/(v2.x-v0.x-(v1.x-v0.x)*k);
		var b = k*(w1.x-w0.x)/(v2.y-v0.y) - a*(v1.x-v0.x)/(v1.y-v0.y);

		var c = (w2.y-w0.y-(w1.y-w0.y)*k)/(v2.x-v0.x-(v1.x-v0.x)*k);
		var d = k*(w1.y-w0.y)/(v2.y-v0.y) - c*(v1.x-v0.x)/(v1.y-v0.y);
	} else {
		a = (w1.x-w0.x)/(v1.x-v0.x);
		b = (w2.x-w0.x)/(v2.y-v0.y) - a*(v2.x-v0.x)/(v2.y-v0.y);

		c = (w1.y-w0.y)/(v1.x-v0.x);
		d = (w2.y-w0.y)/(v2.y-v0.y) - c*(v2.x-v0.x)/(v2.y-v0.y);
	}
	context.transform(a, c, b, d, w0.x - a*v0.x - b*v0.y, w0.y - c*v0.x - d*v0.y);
}




  /**
   * Creates a matrix transformation that corresponds to the given rotation,
   * around (0,0) or the specified point.
   * @see Matrix#rotate
   *
   * @param {Number} theta Rotation in radians.
   * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
   * @returns {Matrix}
   */
MatrixGenerators.createRotationMatrix = function(theta, aboutPoint) {
    var rotationMatrix = Matrix(
      Math.cos(theta),
      Math.sin(theta),
      -Math.sin(theta),
      Math.cos(theta)
    );

    if(aboutPoint) {
      rotationMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          rotationMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return rotationMatrix;
};

  /**
   * Returns a matrix that corresponds to scaling by factors of sx, sy along
   * the x and y axis respectively.
   * If only one parameter is given the matrix is scaled uniformly along both axis.
   * If the optional aboutPoint parameter is given the scaling takes place
   * about the given point.
   * @see Matrix#scale
   *
   * @param {Number} sx The amount to scale by along the x axis or uniformly if no sy is given.
   * @param {Number} [sy] The amount to scale by along the y axis.
   * @param {Point} [aboutPoint] The point about which the scaling occurs. Defaults to (0,0).
   * @returns {Matrix} A matrix transformation representing scaling by sx and sy.
   */
MatrixGenerators.createScaleMatrix = function(sx, sy, aboutPoint) {
    sy = sy || sx;

    var scaleMatrix = Matrix(sx, 0, 0, sy);

    if(aboutPoint) {
      scaleMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          scaleMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return scaleMatrix;
  };


  /**
   * Returns a matrix that corresponds to a translation of tx, ty.
   * @see Matrix#translate
   *
   * @param {Number} tx The amount to translate in the x direction.
   * @param {Number} ty The amount to translate in the y direction.
   * @returns {Matrix} A matrix transformation representing a translation by tx and ty.
   */
MatrixGenerators.createTranslationMatrix = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
};
//
  // /**
   // * A constant representing the identity matrix.
   // * @name IDENTITY
   // * @fieldOf Matrix
   // */
// Matrix.IDENTITY = Matrix();
  // /**
   // * A constant representing the horizontal flip transformation matrix.
   // * @name HORIZONTAL_FLIP
   // * @fieldOf Matrix
   // */
// Matrix.HORIZONTAL_FLIP = Matrix(-1, 0, 0, 1);
  // /**
   // * A constant representing the vertical flip transformation matrix.
   // * @name VERTICAL_FLIP
   // * @fieldOf Matrix
   // */
// Matrix.VERTICAL_FLIP = Matrix(1, 0, 0, -1);
