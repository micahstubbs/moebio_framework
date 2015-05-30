/*
 * 3D Cube
 * Demonstration of using the Moebio Framework Engine3D to create a transparent
 * cube. Also shows an example of using the DragDetection tool for dragging
 *
 */

var e3D; // 3D engine
var dragging; // drag detection tool
var rotationVector; // Point to store cube rotation
var cubeSides; // this will store the sides of the cube

/*
 * init
 * All Moebio Framework visualizations use init to setup variables.
 * These variables are used in the cycle function.
 */
init = function() {
  // create instance of the Engine3D
  // input is a configuration object.
  // lens defines the distance the camera is from the scene
  e3D = new Engine3D({
    lens:300
  });

  // Provide an initial viewing
  e3D.setAngles(new Point3D(0.2,-HalfPi*1.2, 0.05));

  // dragging on canvas is detected by the DragDetection tool.
  // It in turn calls draggingListener.
  dragging = new DragDetection({
    listenerFunction:draggingListener
  });

  dragging.factor = 0.01;

  // rotationVector stores the current rotation of the cube
  rotationVector = new Point(0,0);

  // create the sides of the cube and store in cubeSides
  buildCube();
};

/*
 * This function is called each time a drag event is registered by the
 * DragDetection tool.
 */
draggingListener = function(draggingVector) {
  rotationVector = draggingVector;
};

/*
 * The cycle function is called repeatedly to display the visualization.
 * Here we render the sides of the cube using the Engine3D.
 */
cycle = function() {
  var i, j;
  var polygon3D;
  var p;

  // style the mouse cursor style to use the move style
  setCursor('move');

  // modify the scene based on the current
  e3D.applyRotation(rotationVector);

  // make the drawing stroke black
  setStroke('black');

  // For each of the cube sides,
  // use the Engine3D to project the points of the side
  // while drawing inside the context.
  //
  // context is the context of the canvas used to draw
  // the visualization.
  for(i=0; cubeSides[i]!=null; i++){
    polygon3D = cubeSides[i];
    p = e3D.projectPoint3D(polygon3D[0]);
    context.beginPath();
    context.moveTo(p.x+cX, p.y+cY);
    for(j=1; polygon3D[j]!=null; j++){
      p = e3D.projectPoint3D(polygon3D[j]);
      context.lineTo(p.x+cX, p.y+cY);
    }
    context.stroke();
  }
};

/*
 * Build up a new Polygon3DList that stores the Polygon3D's
 * that make up the sides of the cube.
 */
buildCube = function() {
  var len = 100; // half side of the cube;

  // these points are the vertices of the cube
  var p0 = new Point3D(-len,-len,-len);
  var p1 = new Point3D(len,-len,-len);
  var p2 = new Point3D(len,len,-len);
  var p3 = new Point3D(-len,len,-len);
  var p4 = new Point3D(-len,-len,len);
  var p5 = new Point3D(len,-len,len);
  var p6 = new Point3D(len,len,len);
  var p7 = new Point3D(-len,len,len);

  // A Polygon3DList can hold Polygon3D instances
  cubeSides = new Polygon3DList();

  cubeSides[0] = new Polygon3D(p0, p1, p2, p3, p7, p6, p5, p4, p0);
  cubeSides[1] = new Polygon3D(p0, p3);
  cubeSides[2] = new Polygon3D(p7, p4);
  cubeSides[3] = new Polygon3D(p1, p5);
  cubeSides[4] = new Polygon3D(p2, p6);
};
