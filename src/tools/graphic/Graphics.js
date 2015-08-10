import Point from 'src/dataStructures/geometry/Point';
import ColorOperators from "src/operators/graphic/ColorOperators";

/**
 * A graphics object provides a surface for drawing and interaction
 * with drawn primitives.
 *
 * The constructor initializes basic configuration and 
 * optionally starts the draw cycle.
 * 
 * @param {Object} options valid properties described below
 * @param {String|DOMNode} options.container a string selector or reference
 *                                           to a node where the canvas for this
 *                                           graphics object will be placed.
 * @param {Object} options.dimensions object with width and height properties to specify
 *                                    the dimensions of the canvas. If this is not passed
 *                                    in, the canvas will grow to always fit the size of its
 *                                    container.
 * @param {Function} options.init custom user function to initialize drawing related
 *                                things. Called once after base initialization.
 * @param {Function} options.cycle custom user function to render each frame. This
 *                                 is called once per frame of the draw loop unless
 *                                 frameRate is set to 0. 
 * @param {Function} options.onResize custom user function to run on resize of the canvas *                                    
 * @param {Number} options.frameRate TODO describe this. If set to zero, the draw cycle will
 *                                   not be started automatically. YY should this be called
 *                                   cycleInterval instead?
 */
function Graphics(options) {
  this.container = options.container;
  if(typeof this.container === 'string') {
    // Assume it is a selector and try and find the actual DOM node
    this.container = document.querySelector(this.container);
  }
  this.dimensions = options.dimensions;
  
  function noOperation() {}

  this.init = options.init || noOperation;
  this.cycle = options.cycle || noOperation;
  this.onResize = options.onResize || Graphics.onResize;
  this._frameRate = options.frameRate === undefined ? 30 : options.frameRate;

  this._initialize();
}
export default Graphics;


/*****************************
 * Private lifecycle functions
 ****************************/

/*
 * Initialize the graphics proper. Includes
 * things like actually creating the backing canvas and
 * setting up mousehandlers.
 */
Graphics.prototype._initialize = function() {
  this.cW = 1; // canvas width
  this.cH = 1; // canvas height
  this.cX = 1; // canvas center x
  this.cY = 1; // canvas center y
  this.mX = 0; // cursor x
  this.mY = 0; // cursor y
  this.mP = new Point(0, 0); // cursor point // YY why have this and mX and mY
  this.nF = 0; // number of current frame since first cycle
  this.MOUSE_DOWN=false; //true on the frame of mousedown event
  this.MOUSE_UP=false; //true on the frame of mouseup event
  this.MOUSE_UP_FAST=false; //true on the frame of mouseup event
  this.WHEEL_CHANGE=0; //differnt from 0 if mousewheel (or pad) moves / STATE
  this.NF_DOWN = undefined; //number of frame of last mousedown event
  this.NF_UP = undefined; //number of frame of last mouseup event
  this.MOUSE_PRESSED = undefined; //true if mouse pressed / STATE
  this.MOUSE_IN_DOCUMENT = true; //true if cursor is inside document / STATE
  this.mX_DOWN = undefined; // cursor x position on last mousedown event
  this.mY_DOWN = undefined; // cursor x position on last mousedown event
  this.mX_UP = undefined; // cursor x position on last mousedown event
  this.mY_UP = undefined; // cursor y position on last mousedown event
  this.PREV_mX=0; // cursor x position previous frame
  this.PREV_mY=0; // cursor y position previous frame
  this.DX_MOUSE=0; //horizontal movement of cursor in last frame
  this.DY_MOUSE=0; //vertical movement of cursor in last frame
  this.MOUSE_MOVED = false; //boolean that indicates wether the mouse moved in the last frame / STATE
  this.T_MOUSE_PRESSED = 0; //time in milliseconds of mouse being pressed, useful for sutained pressure detection

  this.cursorStyle = 'auto';
  this.backGroundColor = 'white'; // YY why keep this if we only use the rgb version
  this.backGroundColorRGB = [255,255,255];
  this.cycleActive = undefined; // YY why do we need to maintain this state?

  this._cycleOnMouseMovement = false;
  this._prevMouseX = 0;
  this._prevMouseY = 0;
  this._setIntervalId = undefined;
  this._setTimeOutId = undefined;
  this._interactionCancelledFrame = undefined;
  this._tLastMouseDown = undefined;
  this._alphaRefresh = 0; //if _alphaRefresh>0 instead of clearing the canvas each frame, a transparent rectangle will be drawn
  this.END_CYCLE_DELAY = 3000; //time in milliseconds, from last mouse movement to the last cycle to be executed in case cycleOnMouseMovement has been activated
      
  // Create the canvas and get it ready for drawing
  this.canvas = document.createElement("canvas");
  this.container.appendChild(this.canvas);
  this.context = this.canvas.getContext('2d');

  this._adjustCanvas(this.dimensions);

  // YY TODO allow user to bind to these events as well. Probably 
  // through a generic event mechanism. c.f. global addInteractionEventListener
  var boundMouse = this._onMouse.bind(this);
  this.canvas.addEventListener("mousemove", boundMouse, false);
  this.canvas.addEventListener("mousedown", boundMouse, false);
  this.canvas.addEventListener("mouseup", boundMouse, false);
  this.canvas.addEventListener("mouseenter", boundMouse, false);
  this.canvas.addEventListener("mouseleave", boundMouse, false);
  this.canvas.addEventListener("click", boundMouse, false);

  this.canvas.addEventListener("DOMMouseScroll", boundMouse, false);
  this.canvas.addEventListener("mousewheel", boundMouse, false);

  // Setup resize listeners
  var boundResize = this._onResize.bind(this);
  this.container.addEventListener("resize", boundResize, false);

  // Infrastructure for custom event handlers
  this._listeners = {
    "mousemove": [],
    "mousedown": [],
    "mouseup": [],
    "mouseenter": [],
    "mouseleave": [],
    "mousewheel": [],
    "click": [],
    "keydown": [],
    "keyup": []
  };

  // Call the user provided init function.
  this.init();

  // Start the draw loop
  if(this._frameRate > 0) {
    this._startCycle();  
  }
};


Graphics.prototype._onMouse = function(e) {
  switch(e.type){
    case "mousemove":
      this.PREV_mX = this.mX;
      this.PREV_mY= this.mY;

      if(e.clientX) {
        this.mX = e.clientX;
        this.mY = e.clientY;
      } else if(e.offsetX) {
        this.mX = e.offsetX;
        this.mY = e.offsetY;
      } else if(e.layerX) {
        this.mX = e.layerX;
        this.mY = e.layerY;
      }
      
      this.mP.x = this.mX;
      this.mP.y = this.mY;
      this.MOUSE_IN_DOCUMENT = true;
      break;
    case "mousedown":
      this.NF_DOWN = this.nF;
      this.MOUSE_PRESSED = true;
      this.T_MOUSE_PRESSED = 0;
      this._tLastMouseDown = new Date().getTime();
      this.mX_DOWN = this.mX;
      this.mY_DOWN = this.mY;
      this.MOUSE_IN_DOCUMENT = true;
      break;
    case "mouseup":
      this.NF_UP = this.nF;
      this.MOUSE_PRESSED = false;
      this.T_MOUSE_PRESSED = 0;
      this.mX_UP = this.mX;
      this.mY_UP = this.mY;
      this.MOUSE_IN_DOCUMENT = true;
      break;
    case "mouseenter":
      this.MOUSE_IN_DOCUMENT = true;
      break;
    case "mouseleave":
      this.MOUSE_IN_DOCUMENT = false;
      break;
  }

  this._emit(e.type, e);
};

Graphics.prototype._onResize = function(e) {
  if(this.dimensions === undefined) {
    this._adjustCanvas();
  }
  // Forward the event to the user defined resize handler
  this.onResize(e);
 }; 


Graphics.prototype._adjustCanvas = function(dimensions) {
  if(dimensions !== undefined) {    
    this.cW = dimensions.width;
    this.cH = dimensions.height;
  } else {    
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    this.cW = this.container.offsetWidth;
    this.cH = this.container.offsetHeight;    
  }

  this.cX = Math.floor(this.cW * 0.5);
  this.cY = Math.floor(this.cH * 0.5);

  this.canvas.setAttribute('width', this.cW);
  this.canvas.setAttribute('height', this.cH);  
  
};

/*
 * Starts or restarts the draw cycle at the current framerate
 * 
 * @param  {[type]} frameRate [description]
 * @return {[type]}           [description]
 */
Graphics.prototype._startCycle = function() {
  this.cycleActive = true;
  // calculate the interval and then schedule a draw loop
  
  // YY i think this should use requestAnimationFrame
  // clearTimeout(this._setTimeOutId); // YY Not sure why this is needed yet
  clearInterval(this._setIntervalId);  
  this._setIntervalId = setInterval(this._onCycle.bind(this), this._frameRate);
};

Graphics.prototype._stopCycle = function() {  
  clearInterval(this._setIntervalId);
  this.cycleActive = false;

  //this.lastCycle(); // YY would this be better as a callback
};

/*
 * This function is called on every cycle of the draw loop.
 * It is responsible for clearing the background and then calling
 * the user defined cycle function.
 * 
 */
Graphics.prototype._onCycle = function() {    
  // YY i don't think this interacts well with my expectations
  // of setting the background color. it basically needs to be greater than 0
  // if the bg color is not white and that isn't super obvious.
  if(this._alphaRefresh === 0){
    this.context.clearRect(0, 0, this.cW, this.cH);
  } else {
    this.context.fillStyle = 
      'rgba(' + this.backGroundColorRGB[0] +
      ',' + this.backGroundColorRGB[1] +
      ',' + this.backGroundColorRGB[2] + 
      ',' + this._alphaRefresh+')';
    
    this.context.fillRect(0, 0, this.cW, this.cH);
  }

  // setCursor('default'); // YY why is this needed/done?

  this.MOUSE_DOWN = this.NF_DOWN == this.nF;
  this.MOUSE_UP = this.NF_UP == this.nF;
  this.MOUSE_UP_FAST = this.MOUSE_UP && (this.nF- this.NF_DOWN) < 9;

  this.DX_MOUSE = this.mX - this.PREV_mX;
  this.DY_MOUSE = this.mY - this.PREV_mY;
  this.MOUSE_MOVED = this.DX_MOUSE !== 0 || this.DY_MOUSE !== 0;

  if(this.MOUSE_PRESSED) {
    this.T_MOUSE_PRESSED = new Date().getTime() - this._tLastMouseDown;
  } 

  // Call the user provided cycle function.
  this.cycle();

  this.WHEEL_CHANGE = 0;
  this.PREV_mX = this.mX;
  this.PREV_mY = this.mY;
  this.nF++;
};

/*
 * Emit events to registered listeners.
 *
 * This function also does any normalization/customization 
 * to the standard DOM events that the graphics object provides.
 */
Graphics.prototype._emit = function(eventName, e) {
  switch(eventName) {
    case 'mousewheel':
    case 'DOMMouseScroll':
      if (!e) {
        e = window.event; //IE // YY is this still a thing
      }
      if (e.wheelDelta) {
        // YY do we actually want to keep this here or is the 
        // main goal to send this information to the listener.
        this.WHEEL_CHANGE = e.wheelDelta/120;
      } else if (e.detail) { /** Mozilla case. */
        this.WHEEL_CHANGE = -e.detail/3;
      }
      e.value = this.WHEEL_CHANGE;
    break;
  }

  // Actually dispatch the event after any special handling
  var listenersLength = this._listeners[eventName].length;
  for(var i = 0; i < listenersLength; i++) {
    this._listeners[eventName][i].call(undefined, e);
  }
};

/*****************************
 * Public lifecycle functions
 ****************************/

Graphics.prototype.getFrameRate = function() {
  return this._frameRate;
};

Graphics.prototype.setFrameRate = function(frameRate) {
  this._frameRate = frameRate;
  if(this.cycleActive) { // YY this should be removed
    this._startCycle();
  }
};

Graphics.prototype.start = function() {
  return this._startCycle();
};

Graphics.prototype.stop = function() {
  return this._stopCycle();
};

Graphics.prototype.on = function(eventName, callback) {
  // allow clients to subscribe to events on the canvas.
  this._listeners[eventName].push(callback);
};

Graphics.prototype.off = function(eventName, callback) {
  // TODO
};

/*****************************
 * Public drawing functions
 *****************************/

Graphics.prototype.setBackgroundColor = function(color) {
  if(typeof color === "number") {
    if(arguments.length > 3) {
      color = 'rgba('+ arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3]+')';
    } else {
      color = 'rgb('+ arguments[0] + ',' + arguments[1] + ',' + arguments[2]+')';
    }
  } else if(Array.isArray(color)) {
    color = ColorOperators.RGBtoHEX(color[0], color[1], color[2]);
  }
  this.backGroundColor = color;
  this.backGroundColorRGB = ColorOperators.colorStringToRGB(this.backGroundColor);
};

Graphics.prototype.setAlphaRefresh = function(alphaRefresh){
  this._alphaRefresh = alphaRefresh;
};
