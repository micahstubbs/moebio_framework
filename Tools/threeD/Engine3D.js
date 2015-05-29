Engine3D.prototype.constructor = Engine3D;

/**
 * Engine3D
 * @constructor
 */
function Engine3D(configuration) {
  configuration = configuration == null ? {} : configuration;
  this.lens = configuration.lens == null ? 300 : configuration.lens;

  this._freeRotation = false;

  this.setBasis(new Polygon3D(new Point3D(1, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)));

  this._cuttingPlane = 10;

  if(configuration.angles != null) this.setAngles(configuration.angles);
}

Engine3D.prototype.setBasis = function(point3D) {
  this._basis = point3D.clone();
  this._basisBase = point3D.clone();
  this._provisionalBase = point3D.clone();
};

Engine3D.prototype.setAngles = function(point3D) {
  this._angles = point3D.clone();
  this._freeRotation = false;
  this._basis = this.basis3DRotation(this._basisBase, this._angles);
};

Engine3D.prototype.applyRotation = function(planeVector) {
  if(!this._freeRotation) {
    this._freeRotation = true;
    this.updateAngles();
    this._provisionalBase[0] = this._basis[0].clone();
    this._provisionalBase[1] = this._basis[1].clone();
    this._provisionalBase[2] = this._basis[2].clone();
  }
  this._basis[0] = this.point3DRotation(this._provisionalBase[0], new Point3D(-planeVector.y, planeVector.x, 0));
  this._basis[1] = this.point3DRotation(this._provisionalBase[1], new Point3D(-planeVector.y, planeVector.x, 0));
  this._basis[2] = this.point3DRotation(this._provisionalBase[2], new Point3D(-planeVector.y, planeVector.x, 0));
  this._provisionalBase[0] = this._basis[0].clone();
  this._provisionalBase[1] = this._basis[1].clone();
  this._provisionalBase[2] = this._basis[2].clone();
};

Engine3D.prototype.projectPoint3D = function(point3D) {
  var prescale = this.lens / (this.lens + (this._basis[0].z * point3D.x + this._basis[1].z * point3D.y + this._basis[2].z * point3D.z));
  return new Point3D((this._basis[0].x * point3D.x + this._basis[1].x * point3D.y + this._basis[2].x * point3D.z) * prescale, (this._basis[0].y * point3D.x + this._basis[1].y * point3D.y + this._basis[2].y * point3D.z) * prescale, prescale);
};

Engine3D.prototype.projectCoordinates = function(x, y, z) {
  var prescale = this.lens / (this.lens + (this._basis[0].z * x + this._basis[1].z * y + this._basis[2].z * z));
  return new Point3D((this._basis[0].x * x + this._basis[1].x * y + this._basis[2].x * z) * prescale, (this._basis[0].y * x + this._basis[1].y * y + this._basis[2].y * z) * prescale, prescale);
};

Engine3D.prototype.projectPoint3DNode = function(node) {
  var prescale = this.lens / (this.lens + (this._basis[0].z * node.x + this._basis[1].z * node.y + this._basis[2].z * node.z));
  return new Point3D((this._basis[0].x * node.x + this._basis[1].x * node.y + this._basis[2].x * node.z) * prescale, (this._basis[0].y * node.x + this._basis[1].y * node.y + this._basis[2].y * node.z) * prescale, prescale);
};

Engine3D.prototype.scale = function(point3D) {
  return this.lens / (this.lens + (this._basis[0].z * point3D.x + this._basis[1].z * point3D.y + this._basis[2].z * point3D.z));
};


Engine3D.prototype.sortedIndexesByPointsScale = function(polygon3D) {
  var pairsArray = [];

  for(var i = 0; polygon3D[i] != null; i++) {
    pairsArray[i] = [polygon3D[i], i];
  }

  UTLITARY_GLOBAL_VAR = this._basis;
  pairsArray = pairsArray.sort(this._sortingCriteria, this._basis);
  UTLITARY_GLOBAL_VAR = null;

  var indexes = new NumberList();

  for(var i = 0; polygon3D[i] != null; i++) {
    indexes[i] = pairsArray[i][1];
  }

  return indexes;
};

Engine3D.prototype.sortListByPointsScale = function(list, polygon3D) {
  var pairsArray = [];

  for(var i = 0; list[i] != null; i++) {
    pairsArray[i] = [polygon3D[i], list[i]];
  }

  UTLITARY_GLOBAL_VAR = this._basis;
  pairsArray = pairsArray.sort(this._sortingCriteria, this._basis);
  UTLITARY_GLOBAL_VAR = null;

  var newList = instantiateWithSameType(list);
  newList.name = list;

  for(var i = 0; list[i] != null; i++) {
    newList[i] = pairsArray[i][1];
  }

  return newList;
};
Engine3D.prototype._sortingCriteria = function(array0, array1, basis) {
  var point3D0 = array0[0];
  var point3D1 = array1[0];
  return(UTLITARY_GLOBAL_VAR[0].z * point3D0.x + UTLITARY_GLOBAL_VAR[1].z * point3D0.y + UTLITARY_GLOBAL_VAR[2].z * point3D0.z < UTLITARY_GLOBAL_VAR[0].z * point3D1.x + UTLITARY_GLOBAL_VAR[1].z * point3D1.y + UTLITARY_GLOBAL_VAR[2].z * point3D1.z) ? 1 : -1;
};


//private methods

Engine3D.prototype.updateAngles = function() {
  this._angles = this.getEulerAngles();
};
Engine3D.prototype.getEulerAngles = function() {
  return new Point3D(Math.atan2(-this._basis[1].z, this._basis[2].z), Math.asin(this._basis[0].z), Math.atan2(-this._basis[0].y, this._basis[0].x));
};


//rotation


//these must be at Operators3D

Engine3D.prototype.basis3DRotation = function(basis, angles) {
  ca = Math.cos(angles.x);
  sa = Math.sin(angles.x);
  cb = Math.cos(angles.y);
  sb = Math.sin(angles.y);
  cg = Math.cos(angles.z);
  sg = Math.sin(angles.z);

  return new Polygon3D(new Point3D(basis[0].x * cg * cb + basis[0].y * (cg * sa * sb + sg * ca) + basis[0].z * (sg * sa - cg * ca * sb), -basis[0].x * sg * cb + basis[0].y * (cg * ca - sg * sa * sb) + basis[0].z * (sg * ca * sb + cg * sa), basis[0].x * sb - basis[0].y * sa * cb + basis[0].z * cb * ca), new Point3D(basis[1].x * cg * cb + basis[1].y * (cg * sa * sb + sg * ca) + basis[1].z * (sg * sa - cg * ca * sb), -basis[1].x * sg * cb + basis[1].y * (cg * ca - sg * sa * sb) + basis[1].z * (sg * ca * sb + cg * sa), basis[1].x * sb - basis[1].y * sa * cb + basis[1].z * cb * ca), new Point3D(basis[2].x * cg * cb + basis[2].y * (cg * sa * sb + sg * ca) + basis[2].z * (sg * sa - cg * ca * sb), -basis[2].x * sg * cb + basis[2].y * (cg * ca - sg * sa * sb) + basis[2].z * (sg * ca * sb + cg * sa), basis[2].x * sb - basis[2].y * sa * cb + basis[2].z * cb * ca));

};

Engine3D.prototype.point3DRotation = function(point, angles) {
  var ca = Math.cos(angles.x);
  var sa = Math.sin(angles.x);
  var cb = Math.cos(angles.y);
  var sb = Math.sin(angles.y);
  var cg = Math.cos(angles.z);
  var sg = Math.sin(angles.z);
  return new Point3D(
    point.x * cg * cb + point.y * (cg * sa * sb + sg * ca) + point.z * (sg * sa - cg * ca * sb), -point.x * sg * cb + point.y * (cg * ca - sg * sa * sb) + point.z * (sg * ca * sb + cg * sa),
    point.x * sb - point.y * sa * cb + point.z * cb * ca
  );
};




Engine3D.prototype.line3D = function(point0, point1) {
  var polygon = new Polygon();

  var p0 = point0; //while there's no Transformation3D'
  var prescale0 = this.lens / (this.lens + (this._basis[0].z * p0.x + this._basis[1].z * p0.y + this._basis[2].z * p0.z));

  //
  var p1 = point1;
  var prescale1 = this.lens / (this.lens + (this._basis[0].z * p1.x + this._basis[1].z * p1.y + this._basis[2].z * p1.z));

  if(prescale0 > 0 || prescale1 > 0) {
    if(prescale0 > 0 && prescale1 > 0) {
      polygon.push(new Point((this._basis[0].x * p0.x + this._basis[1].x * p0.y + this._basis[2].x * p0.z) * prescale0, (this._basis[0].y * p0.x + this._basis[1].y * p0.y + this._basis[2].y * p0.z) * prescale0));
      polygon.push(new Point((this._basis[0].x * p1.x + this._basis[1].x * p1.y + this._basis[2].x * p1.z) * prescale1, (this._basis[0].y * p1.x + this._basis[1].y * p1.y + this._basis[2].y * p1.z) * prescale1));
      return polygon;
    } else {
      var p0B = new Point3D(this._basis[0].x * p0.x + this._basis[1].x * p0.y + this._basis[2].x * p0.z, this._basis[0].y * p0.x + this._basis[1].y * p0.y + this._basis[2].y * p0.z, this._basis[0].z * p0.x + this._basis[1].z * p0.y + this._basis[2].z * p0.z);
      var p1B = new Point3D(this._basis[0].x * p1.x + this._basis[1].x * p1.y + this._basis[2].x * p1.z, this._basis[0].y * p1.x + this._basis[1].y * p1.y + this._basis[2].y * p1.z, this._basis[0].z * p1.x + this._basis[1].z * p1.y + this._basis[2].z * p1.z);
      var t = (-this.lens + this._cuttingPlane - p0B.z) / (p1B.z - p0B.z);
      var pM = new Point3D(p0B.x + t * (p1B.x - p0B.x), p0B.y + t * (p1B.y - p0B.y), -this.lens + this._cuttingPlane);
      var prescaleM = this.lens / (this.lens + pM.z);
      if(prescale0 > 0) {
        polygon.push(new Point(p0B.x * prescale0, p0B.y * prescale0));
        polygon.push(new Point(pM.x * prescaleM, pM.y * prescaleM));
      } else {
        polygon.push(new Point(pM.x * prescaleM, pM.y * prescaleM));
        polygon.push(new Point(p1B.x * prescale1, p1B.y * prescale1));
      }
      return polygon;
    }
  }
  return null;
};

Engine3D.prototype.quadrilater = function(p0, p1, p2, p3) {
  var polygon3D = new Polygon3D();

  var l0 = this.line3D(p0, p1);
  var l1 = this.line3D(p1, p2);
  var l2 = this.line3D(p2, p3);
  var l3 = this.line3D(p3, p0);

  if(l0 != null) {
    if(l3 == null ||  (l0[0].x != l3[1].x && l0[0].y != l3[1].y)) polygon3D.push(l0[0]);
    polygon3D.push(l0[1]);
  }
  if(l1 != null) {
    if(l0 == null ||  (l1[0].x != l0[1].x && l1[0].y != l0[1].y)) polygon3D.push(l1[0]);
    polygon3D.push(l1[1]);
  }
  if(l2 != null) {
    if(l1 == null || (l2[0].x != l1[1].x && l2[0].y != l1[1].y)) polygon3D.push(l2[0]);
    polygon3D.push(l2[1]);
  }
  if(l3 != null) {
    if(l2 == null || (l3[0].x != l2[1].x && l3[0].y != l2[1].y)) polygon3D.push(l3[0]);
    polygon3D.push(l3[1]);
  }

  return polygon3D;
};