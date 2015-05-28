/*
 * 3D Cube
 * Demonstration of using the Moebio Framework Engine3D to create a transparent
 * cube. Also shows an example of using the DragDetection tool for dragging
 *
 */

var e3D; // 3D engine
var dragging; // drag detection tool
var rotationVector; // Point to store cube rotation
var polygon3DList; // this will store the sides of the cube

/*
 * init
 * All Moebio Framework visualizations use init to setup variables.
 * These variables are used in the cycle function.
 */
init = function(){
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

  rotationVector = new Point(0,0);

  buildCube();
};

/*
 *
 */
draggingListener=function(draggingVector){
  rotationVector = draggingVector;
};

/*
 * The cycle function is called repeatedly to display the visualization.
 * Here we render the sides of the cube using the Engine3D.
 */
cycle = function(){
  var i, j;
  var polygon3D;
  var p;

  // style the mouse cursor
  setCursor('move');

  e3D.applyRotation(rotationVector);

  setStroke('black');

  for(i=0; polygon3DList[i]!=null; i++){
    polygon3D = polygon3DList[i];
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


buildCube = function(){
  var l = 100; //half side of the cube;

  var p0 = new Point3D(-l,-l,-l);
  var p1 = new Point3D(l,-l,-l);
  var p2 = new Point3D(l,l,-l);
  var p3 = new Point3D(-l,l,-l);
  var p4 = new Point3D(-l,-l,l);
  var p5 = new Point3D(l,-l,l);
  var p6 = new Point3D(l,l,l);
  var p7 = new Point3D(-l,l,l);

  polygon3DList = new Polygon3DList();

  polygon3DList[0] = new Polygon3D(p0, p1, p2, p3, p7, p6, p5, p4, p0);
  polygon3DList[1] = new Polygon3D(p0, p3);
  polygon3DList[2] = new Polygon3D(p7, p4);
  polygon3DList[3] = new Polygon3D(p1, p5);
  polygon3DList[4] = new Polygon3D(p2, p6);
};
