import Point from 'src/dataStructures/geometry/Point';
import Polygon from 'src/dataStructures/geometry/Polygon';
import ColorOperators from "src/operators/graphic/ColorOperators";
import GeometryOperators from 'src/operators/geometry/GeometryOperators';
import Rectangle from 'src/dataStructures/geometry/Rectangle';
import { TwoPi, HalfPi } from "src/Global";

/**
 * A graphics object provides a surface for drawing and interaction
 * with drawn primitives.
 *
 * The constructor initializes basic configuration and
 * optionally starts the draw cycle.
 *
 * @param {Object} options valid properties described below
 * @param {String|DOMNode|undefined|false} options.container a string selector or reference
 *                                                           to a node where the canvas for this
 *                                                           graphics object will be placed.
 *                                                           If this is a falsy value, then the graphics object
 *                                                           will not be attached to the DOM and can be used as an
 *                                                           offscreen bugger.
 * @param {Object} options.dimensions object with width and height properties to specify
 *                                    the dimensions of the canvas. If this is not passed
 *                                    in, the canvas will grow to always fit the size of its
 *                                    container.
 * @param {Function} options.init custom user function to initialize drawing related
 *                                things. Called once after base initialization.
 * @param {Function} options.cycle custom user function to render each frame. This
 *                                 is called once per frame of the draw loop unless
 *                                 cycleInterval is set to 0.
 * @param {Function} options.onResize custom user function to run on resize of the canvas *
 * @param {Number} options.cycleInterval TODO describe this. If set to zero, the draw cycle will
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



  this.init = options.init || noOperation;
  this.cycle = options.cycle || noOperation;
  this.onResize = options.onResize || noOperation;
  this._cycleInterval = options.cycleInterval === undefined ? 30 : options.cycleInterval;

  this._initialize();
}
export default Graphics;
function noOperation() {}


/*****************************
 * Private lifecycle functions
 ****************************/

/*
 * @ignore
 *
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

  //Allow the canvas to be focusable to enable keydown and keyup
  this.canvas.setAttribute("tabindex", "10000");
  //Hide the focus styling
  var canvasStyle = "outline: none; -webkit-tap-highlight-color: rgba(255, 255, 255, 0);";
  this.canvas.setAttribute("style", canvasStyle);

  if(this.container) {
    // If this container is falsy, then the canvas is not attached to the DOM
    // and can be used as an offscreen buffer.
    this.container.appendChild(this.canvas);  
  }  
  this.context = this.canvas.getContext("2d");

  this._adjustCanvas(this.dimensions);

  // YY TODO allow user to bind to these events as well. Probably
  // through a generic event mechanism. c.f. global addInteractionEventListener
  var boundMouseOrKeyboard = this._onMouseOrKeyBoard.bind(this);
  this.canvas.addEventListener("mousemove", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("mousedown", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("mouseup", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("mouseenter", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("mouseleave", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("click", boundMouseOrKeyboard, false);

  this.canvas.addEventListener("DOMMouseScroll", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("mousewheel", boundMouseOrKeyboard, false);

  this.canvas.addEventListener("keydown", boundMouseOrKeyboard, false);
  this.canvas.addEventListener("keyup", boundMouseOrKeyboard, false);

  // Setup resize listeners
  var boundResize = this._onResize.bind(this);
  window.addEventListener("resize", resizeThrottler(boundResize, 66), false);

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
  if(this._cycleInterval > 0) {
    this._startCycle();
  }
};


/*
  Helper function for getting the mouse position
  see http://stackoverflow.com/a/19048340
 */
/**
 * @ignore
 * Helper function for getting the mouse position
 * see http://stackoverflow.com/a/19048340
 *
 * @param  {[type]} evt [description]
 */
Graphics.prototype._getRelativeMousePos = function(evt) {
  var rect = this.canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

/**
 * @ignore
 * This method is used to handle user interaction events (e.g. mouse events). *
 * Sets some internal state and then displatches to external event handlers.
 *
 * @param  {Event} e event object
 */
Graphics.prototype._onMouseOrKeyBoard = function(e) {
  switch(e.type){
    case "mousemove":
      var pos = this._getRelativeMousePos(e);
      this.PREV_mX = this.mX;
      this.PREV_mY= this.mY;

      this.mX = pos.x;
      this.mY = pos.y;

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


/*
 * Helper to throttle resize events for improved performance.
 * See https://developer.mozilla.org/en-US/docs/Web/Events/resize
 */
function resizeThrottler(actualResizeHandler, interval) {
  var resizeTimeout;
  return function(e){
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler(e);
       }, interval);
    }
  };
}

/**
 * @ignore
 * This method is used to handle resizes of the window, and then optionally
 * pass that on to the user defined onResize method if the container dimensions
 * have changed.
 *
 * @param  {[type]} e resize event
 */
Graphics.prototype._onResize = function(e) {
  // If the user has set the dimensions explicitly
  // we do not auto adjust the canvas.
  if(this.dimensions === undefined) {
    this._adjustCanvas();
  }

  if(this.onResize !== noOperation) {
    var newDim = this._containerDimensions();
    if(newDim.width !== this.cW || newDim.height !== this.cH) {
      // Forward the event to the user defined resize handler
      this.onResize(e);
    }
  }
};

/**
 * @ignore
 * Return the dimensions of the container that this graphics object
 * is associated with.
 *
 * @return {Object} object with width and height properties.
 */
Graphics.prototype._containerDimensions = function() {
  // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
  if(this.container) {
    return {
      width: this.container.scrollWidth,
      height: this.container.scrollHeight
    };
  } else {
    return {
      width: 0,
      height: 0
    };
  }
};

Graphics.prototype._adjustCanvas = function(dimensions) {
  if(dimensions !== undefined) {
    this.cW = dimensions.width;
    this.cH = dimensions.height;
  } else {
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements

    var dim = this._containerDimensions();
    this.cW = dim.width;
    this.cH = dim.height;
  }

  this.cX = Math.floor(this.cW * 0.5);
  this.cY = Math.floor(this.cH * 0.5);

  this.canvas.setAttribute('width', this.cW);
  this.canvas.setAttribute('height', this.cH);

};

/*
 * @ignore
 * Starts or restarts the draw cycle at the current cycleInterval
 */
Graphics.prototype._startCycle = function() {
  this.cycleActive = true;
  clearInterval(this._setIntervalId);
  this._setIntervalId = setInterval(this._onCycle.bind(this), this._cycleInterval);
};

/**
 * @ignore
 * Stops the draw cycle
 */
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
    var callback = this._listeners[eventName][i];
    callback.call(callback.__context, e);
  }
};

/*****************************
 * Public lifecycle functions
 ****************************/

/**
 * Returns the current interval between calls to the cycle function.
 * @return {Number} the current cycleInterval (in milliseconds)
 */
Graphics.prototype.getCycleInterval = function() {
  return this._cycleInterval;
};

/**
 * Sets the current interval between calls to the cycle function.
 *
 * @param {Number} cycleInterval the interval in milliseconds at which
 *                               the cycle function should be called.
 */
Graphics.prototype.setCycleInterval = function(cycleInterval) {
  this._cycleInterval = cycleInterval;
  if(this.cycleActive) { // YY this should be removed
    this._startCycle();
  }
};

/**
 * Starts the draw loop for this graphcis object.
 *
 * Note that the draw loop is typically automatically started on
 * creation of a graphics object.
 */
Graphics.prototype.start = function() {
  return this._startCycle();
};

/**
 * Stops the draw loop for this graphics object.
 */
Graphics.prototype.stop = function() {
  return this._stopCycle();
};

/**
 * Subscribe to an event that is emitted by the graphics object.
 *
 * The graphics object emits the following events.
 *
 * "mousemove"
 * "mousedown"
 * "mouseup"
 * "mouseenter
 * "mouseleave
 * "mousewheel
 * "click"
 * "keydown"
 * "keyup"
 *
 * @param  {String}   eventName one of the event types above
 * @param  {Function} callback  function to call when that event occurs
 *                              this function will be passed an event object
 */
Graphics.prototype.on = function(eventName, callback, context) {
  // allow clients to subscribe to events on the canvas.
  callback.__context = context;
  this._listeners[eventName].push(callback);
};

/**
 * Remove an event listener.
 * @param  {String}   eventName one of the event types that the graphics object
 *                              emits.
 * @param  {Function} callback  the function you want to remove. Note that this should
 *                              be a reference to a function that was previously added with
 *                              @see on
 */
Graphics.prototype.off = function(eventName, callback) {
  var index = this._listeners[eventName].indexOf(callback);
  if (index > -1) {
    this._listeners[eventName].splice(index, 1);
  }
};

/*****************************
 * Public drawing functions
 *****************************/

/**
 * Set the background color for the graphics object.
 *
 * On every cycle of the draw loop the canvas will be cleared to this color.
 * Note that if you do set a color, you need to also set the background alpha as well
 *
 * @see  setBackgroundAlpha
 *
 * @param {[type]} color [description]
 */
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

/**
 * Set the alpha (opacity) of the background color. Defaults to 0 (transparent).
 *
 * @param {Number} backgroundAlpha a number from 0-1
 */
Graphics.prototype.setBackgroundAlpha = function(backgroundAlpha){
  this._alphaRefresh = backgroundAlpha;
};



/**
 * Draws a filled in Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setFill('steelblue');
 * fRect(10, 10, 40, 40);
 *
 */
Graphics.prototype.fRect = function(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  this.context.fillRect(x, y, width, height);
};

/**
 * Draws a stroked Rectangle - showing just an outline.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setStroke('orange');
 * sRect(10, 10, 40, 40);
 *
 */
Graphics.prototype.sRect = function(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  this.context.strokeRect(x, y, width, height);
};

/**
 * Draws a filled and stroked Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * fsRect(10, 10, 40, 40);
 *
 */
Graphics.prototype.fsRect = function(x, y, width, height) {
  if(typeof x != 'number') {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  this.context.fillRect(x, y, width, height);
  this.context.strokeRect(x, y, width, height);
};

/**
 * Draws a filled in Arc.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of center of the Arc.
 * @param {Number} y Y position of center of the Arc.
 * @param {Number} r Radius of the Arc.
 * @param {Number} a0 first angle of the Arc.
 * @param {Number} a1 second angle of the Arc.
 * @example
 * setFill('steelblue');
 * fArc(40, 40, 20, 0.5, 0.8);
 *
 */
Graphics.prototype.fArc = function(x, y, r, a0, a1, counterclockwise) {
  this.context.beginPath();
  this.context.arc(x, y, r, a0, a1, counterclockwise);
  this.context.fill();
};

/**
 * Draws a stroked Arc.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Arc.
 * @param {Number} y Y position of center of the Arc.
 * @param {Number} r Radius of the Arc.
 * @param {Number} a0 first angle of the Arc.
 * @param {Number} a1 second angle of the Arc.
 * @example
 * setStroke('orange', 5);
 * sArc(40, 40, 20, 0.5, 0.8);
 *
 */
Graphics.prototype.sArc = function(x, y, r, a0, a1, counterclockwise) {
  this.context.beginPath();
  this.context.arc(x, y, r, a0, a1, counterclockwise);
  this.context.stroke();
};

/**
 * Draws a filled in Circle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setFill('steelblue');
 * fCircle(40, 40, 20);
 *
 */
Graphics.prototype.fCircle = function(x, y, r) {
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi);
  this.context.fill();
};

/**
 * Draws a stroked Circle.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setStroke('orange', 5);
 * sCircle(40, 40, 20);
 *
 */
Graphics.prototype.sCircle = function(x, y, r) {
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi);
  this.context.stroke();
};

/**
 * Draws a filled and stroked Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @example
 * setStroke('steelblue');
 * sCircle(40, 40, 20);
 *
 */
Graphics.prototype.fsCircle = function(x, y, r) {
  this.fCircle(x, y, r);
  this.context.stroke();
};

/**
 * Draws a filled in Ellipse.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setFill('steelblue');
 * fEllipse(40, 40, 20, 30);
 */
Graphics.prototype.fEllipse = function(x, y, rW, rH) {
  var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
    ox = rW * k, // control point offset horizontal
    oy = rH * k, // control point offset vertical
    xe = x + rW, // x-end
    ye = y + rH; // y-end
  this.context.beginPath();
  this.context.moveTo(x - rW, y);
  this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  this.context.moveTo(x - rW, y);
  this.context.closePath();
  this.context.fill();
};

/**
 * Draws a stroked Ellipse.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setStroke('orange');
 * sEllipse(40, 40, 20, 30);
 */
Graphics.prototype.sEllipse = function(x, y, rW, rH) {
  var k = 0.5522848,
    ox = rW * k,
    oy = rH * k,
    xe = x + rW,
    ye = y + rH;
  this.context.beginPath();
  this.context.moveTo(x - rW, y);
  this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  this.context.moveTo(x - rW, y);
  this.context.closePath();
  this.context.stroke();
};

/**
 * Draws a filled and stroked Ellipse.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of center of the Ellipse.
 * @param {Number} y Y position of center of the Ellipse.
 * @param {Number} rW Radial width of the Ellipse.
 * @param {Number} rH Radial height of the Ellipse.
 * @example
 * setFill('steelblue');
 * setStroke('steelblue');
 * fsEllipse(40, 40, 20, 30);
 */
Graphics.prototype.fsEllipse = function(x, y, rW, rH) {
  this.fEllipse(x, y, rW, rH);
  this.context.stroke();
};


/**
 * @ignore
 * TODO add comments to this to explain what it does.
 */
Graphics.prototype._solidArc = function(x,y,a0,a1,r0,r1){
  this.context.beginPath();
  this.context.arc( x, y, r0, a0, a1 );
  this.context.lineTo( x + r1*Math.cos(a1), y + r1*Math.sin(a1) );
  this.context.arc( x, y, r1, a1, a0, true );
  this.context.lineTo( x + r0*Math.cos(a0), y + r0*Math.sin(a0) );
};

/**
 * [fSolidArc description]
 * @param  {[type]} x  [description]
 * @param  {[type]} y  [description]
 * @param  {[type]} a0 [description]
 * @param  {[type]} a1 [description]
 * @param  {[type]} r0 [description]
 * @param  {[type]} r1 [description]
 * @todo
 */
Graphics.prototype.fSolidArc = function(x,y,a0,a1,r0,r1){
  this._solidArc(x,y,a0,a1,r0,r1);
  this.context.fill();
};

/**
 * [sSolidArc description]
 * @param  {[type]} x  [description]
 * @param  {[type]} y  [description]
 * @param  {[type]} a0 [description]
 * @param  {[type]} a1 [description]
 * @param  {[type]} r0 [description]
 * @param  {[type]} r1 [description]
 * @todo
 */
Graphics.prototype.sSolidArc = function(x,y,a0,a1,r0,r1){
  this._solidArc(x,y,a0,a1,r0,r1);
  this.context.stroke();
};

/**
 * [fsSolidArc description]
 * @param  {[type]} x  [description]
 * @param  {[type]} y  [description]
 * @param  {[type]} a0 [description]
 * @param  {[type]} a1 [description]
 * @param  {[type]} r0 [description]
 * @param  {[type]} r1 [description]
 * @todo
 */
Graphics.prototype.fsSolidArc = function(x,y,a0,a1,r0,r1){
  this.fSolidArc(x,y,a0,a1,r0,r1);
  this.context.stroke();
};


/**
 * Draws a line from a start position to an end position
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @example
 * setStroke('black');
 * line(0, 0, 40, 40);
 */
Graphics.prototype.line = function(x0, y0, x1, y1) {
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.lineTo(x1, y1);
  this.context.stroke();
};

/**
 * Draws a bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingthis.context.D/bezierCurveTo|bezierCurveTo}
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} cx0 First curve control point x position.
 * @param {Number} cy0 First cure control point y position.
 * @param {Number} cx1 Second curve control point x position.
 * @param {Number} cy1 Second cure control point y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @example
 * setStroke('black');
 * bezier(10, 10, 10, 0, 40, 0, 40, 10);
 */
Graphics.prototype.bezier = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
  this.context.stroke();
};


/**
 * @ignore
 * TODO add comments to this to explain what it does.
 */
Graphics.prototype._lines = function() {
  if(arguments == null) return;

  var args = arguments[0];
  this.context.beginPath();
  this.context.moveTo(args[0], args[1]);
  for(var i = 2; args[i + 1] != null; i += 2) {
    this.context.lineTo(args[i], args[i + 1]);
  }
};

/**
 * @ignore
 * TODO add comments to this to explain what it does.
 */
Graphics.prototype._linesM = function() {
  if(arguments == null) {
    return;
  }

  var args = arguments[0];
  var p = new Polygon();
  this.context.beginPath();
  this.context.moveTo(args[0], args[1]);
  p[0] = new Point(args[0], args[1]);
  for(var i = 2; args[i + 1] != null; i += 2) {
    this.context.lineTo(args[i], args[i + 1]);
    p.push(new Point(args[i], args[i + 1]));
  }
  return p.containsPoint(this.mP);
};

/**
 * Draws a filled polygon using a series of
 * x/y positions.
 *
 * @param {...Number} positions x and y positions for the Polygon
 * @example
 * // This draws a filled triangle
 * // Inputs are pairs of x/y positions.
 * setFill('steelblue').
 * fLines(10, 10, 40, 10, 40, 40);
 *
 */
Graphics.prototype.fLines = function() {
  this._lines(arguments);
  this.context.fill();
};

/**
 * Draws a set of line segments using a series of
 * x/y positions as input.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @example
 * // This draws the outline of a triangle.
 * // Inputs are pairs of x/y positions.
 * setStroke('orange');
 * sLines(10, 10, 40, 10, 40, 40, 10, 10);
 *
 */
Graphics.prototype.sLines = function() {
  this._lines(arguments);
  this.context.stroke();
};

/**
 * Draws a filled set of line segments using a series of
 * x/y positions as input.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @example
 * // This draws a filled and outlined triangle.
 * // Inputs are pairs of x/y positions.
 * setFill('steelblue');
 * setStroke('orange');
 * fsLines(10, 10, 40, 10, 40, 40, 10, 10);
 *
 */
Graphics.prototype.fsLines = function() {
  this._lines(arguments);
  this.context.fill();
  this.context.stroke();
};

/**
 * Draws a mouse-enabled filled set of line segments using a series of
 * x/y positions as input. Returns true if moused over on current
 * cycle iteration.
 *
 * @param {...Number} positions x and y positions for the Lines
 * @returns {Boolean} if true, mouse is currently hovering over lines.
 * @example
 * // Turns Fill Red if moused over
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsLinesM(10, 10, 40, 10, 40, 40, 10, 10);
 * if(on) {
 *   setFill('red');
 *   fsLines(10, 10, 40, 10, 40, 40, 10, 10);
 * }
 *
 */
Graphics.prototype.fsLinesM = function() {
  var mouseOn = this._linesM(arguments);
  this.context.fill();
  this.context.stroke();
  return mouseOn;
};

/**
 * @ignore
 */
Graphics.prototype._polygon = function(polygon) {
  this.context.beginPath();
  this.context.moveTo(polygon[0].x, polygon[0].y);
  for(var i = 1; polygon[i] != null; i++) {
    this.context.lineTo(polygon[i].x, polygon[i].y);
  }
};

/**
 * [fPolygon description]
 * @param  {[type]} polygon [description]
 * @return {[type]}         [description]
 * @todo
 */
Graphics.prototype.fPolygon = function(polygon) {
  this._polygon(polygon);
  this.context.fill();
};

/**
 * [sPolygon description]
 * @param  {[type]} polygon   [description]
 * @param  {[type]} closePath [description]
 * @return {[type]}           [description]
 * @todo
 */
Graphics.prototype.sPolygon = function(polygon, closePath) {
  this._polygon(polygon);
  if(closePath) {
    this.context.closePath();
  }
  this.context.stroke();
};

/**
 * [fsPolygon description]
 * @param  {[type]} polygon   [description]
 * @param  {[type]} closePath [description]
 * @return {[type]}           [description]
 * @todo
 */
Graphics.prototype.fsPolygon = function(polygon, closePath) {
  this._polygon(polygon);
  if(closePath) {
    this.context.closePath();
  }
  this.context.fill();
  this.context.stroke();
};

/**
 * [fEqTriangle description]
 * @param  {[type]} x     [description]
 * @param  {[type]} y     [description]
 * @param  {[type]} angle [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 * @todo
 */
Graphics.prototype.fEqTriangle = function(x, y, angle, r) {
  this._eqTriangle(x, y, angle, r);
  this.context.fill();
};

/**
 * Draws a stroked equilateral traiangle.
 * @param  {[type]} x     [description]
 * @param  {[type]} y     [description]
 * @param  {[type]} angle [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 * @todo
 */
Graphics.prototype.sEqTriangle = function(x, y, angle, r) {
  this._eqTriangle(x, y, angle, r);
  this.context.stroke();
};

/**
 * Draws a filled and stroked equilateral triangle.
 *
 * @param  {[type]} x     [description]
 * @param  {[type]} y     [description]
 * @param  {[type]} angle [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 * @todo
 */
Graphics.prototype.fsEqTriangle = function(x, y, angle, r) {
  this._eqTriangle(x, y, angle, r);
  this.context.fill();
  this.context.stroke();
};

/**
 * @ignore
 *
 * @param  {[type]} x     [description]
 * @param  {[type]} y     [description]
 * @param  {[type]} angle [description]
 * @param  {[type]} r     [description]
 * @return {[type]}       [description]
 *
 * TODO document this with non-javadoc comments to describe what this
 * does.
 */
Graphics.prototype._eqTriangle = function(x, y, angle, r) {
  this.context.beginPath();
  angle = angle || 0;
  this.context.moveTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
  this.context.lineTo(r * Math.cos(angle + 2.0944) + x, r * Math.sin(angle + 2.0944) + y);
  this.context.lineTo(r * Math.cos(angle + 4.1888) + x, r * Math.sin(angle + 4.1888) + y);
  this.context.lineTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
};

//drawing and checking cursor

/**
 * Draws a mouse-enabled filled in Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * var on = fRectM(10, 10, 40, 40);
 * if(on) {
 *   setFill('red');
 *   fRect(10, 10, 40, 40);
 * }
 */
Graphics.prototype.fRectM = function(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  this.context.fillRect(x, y, width, height);
  return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
};

/**
 * Draws a mouse-enabled stroked Rectangle.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setStroke('orange');
 * var on = sRectM(10, 10, 40, 40);
 * if(on) {
 *   setStroke('black');
 *   sRect(10, 10, 40, 40);
 * }
 */
Graphics.prototype.sRectM = function(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  this.context.strokeRect(x, y, width, height);
  return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
};

/**
 * Draws a mouse-enabled filled and stroked Rectangle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 *
 * @param {Number} x X position of upper-left corner of Rectangle.
 * @param {Number} y Y position of upper-left corner of Rectangle.
 * @param {Number} width Width of Rectangle in pixels.
 * @param {Number} height Height of Rectangle in pixels.
 * @param {Number} margin Parameter around rectangle to count towards mouse over.
 * @return {Boolean} Returns true if the mouse is over the rectangle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsRectM(10, 10, 40, 40);
 * if(on) {
 *   setFill('red');
 *   setStroke('black');
 *   sRect(10, 10, 40, 40);
 * }
 */
Graphics.prototype.fsRectM = function(x, y, width, height, margin) {
  margin = margin == null ? 0 : margin;
  this.context.fillRect(x, y, width, height);
  this.context.strokeRect(x, y, width, height);
  return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
};

/**
 * Draws a mouse-enabled filled in Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * var on = fCircleM(40, 40, 20);
 * if(on) {
 *  setFill('red');
 *  fCircle(40, 40, 20);
 * }
 *
 */
Graphics.prototype.fCircleM = function(x, y, r, margin) { //check if you can avoid repeat
  margin = margin == null ? 0 : margin;
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi);
  this.context.fill();
  return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled stroked Circle.
 * Stroke color is expected to be set using {@link setStroke}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setStroke('orange');
 * var on = sCircleM(40, 40, 20);
 * if(on) {
 *  setStroke('black');
 *  sCircle(40, 40, 20);
 * }
 *
 */
Graphics.prototype.sCircleM = function(x, y, r, margin) {
  margin = margin == null ? 0 : margin;
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi);
  this.context.stroke();
  return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled filled and stroked Circle.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 * Returns true if mouse is over circle on current iteration of cycle.
 *
 * @param {Number} x X position of center of the Circle.
 * @param {Number} y Y position of center of the Circle.
 * @param {Number} r Radius of the Circle.
 * @param {Number} margin Margin around Circle to consider part of mouse over.
 * @return {Boolean} Returns true if the mouse is over the circle on the current
 * iteration of the cycle function.
 * @example
 * setFill('steelblue');
 * setStroke('orange');
 * var on = fsCircleM(40, 40, 20);
 * if(on) {
 *  setFill('red');
 *  setStroke('black');
 *  fsCircle(40, 40, 20);
 * }
 *
 */
Graphics.prototype.fsCircleM = function(x, y, r, margin) {
  margin = margin == null ? 0 : margin;
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi);
  this.context.stroke();
  this.context.fill();
  return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
};

/**
 * Draws a mouse-enabled line from a start position to an end position.
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @param {Number} d Distance away from line to count towards mouse interaction.
 * @return {Boolean} Returns true if the mouse is over the line on the current
 * iteration of the cycle function.
 * @example
 * setStroke('black');
 * var on = lineM(0, 0, 40, 40);
 * if(on) {
 *  setStroke('red');
 *  line(0, 0, 40, 40);
 * }
 */
Graphics.prototype.lineM = function(x0, y0, x1, y1, d) {
  d = d || 4;
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.lineTo(x1, y1);
  this.context.stroke();
  return this._distToSegmentSquared(x0, y0, x1, y1) < d * d;
};


/**
 * @ignore
 *
 * TODO document this with non-javadoc comments to describe what this
 * does.
 */
Graphics.prototype._distToSegmentSquared = function(x0, y0, x1, y1) {
  var l2 = Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2);
  if(l2 === 0) return Math.pow(x0 - this.mX, 2) + Math.pow(y0 - this.mY, 2);
  var t = ((this.mX - x0) * (x1 - x0) + (this.mY - y0) * (y1 - y0)) / l2;
  if(t <= 0) return Math.pow(x0 - this.mX, 2) + Math.pow(y0 - this.mY, 2);
  if(t >= 1) return Math.pow(x1 - this.mX, 2) + Math.pow(y1 - this.mY, 2);
  var px = x0 + t * (x1 - x0);
  var py = y0 + t * (y1 - y0);
  return Math.pow(px - this.mX, 2) + Math.pow(py - this.mY, 2);
};

//TODO:fEqTriangleM, fPolygonM


/**
 * Draws a mouse-enabled bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingthis.context.D/bezierCurveTo|bezierCurveTo}.
 *
 *
 * @param {Number} x0 Starting x position.
 * @param {Number} y0 Starting y position.
 * @param {Number} cx0 First curve control point x position.
 * @param {Number} cy0 First cure control point y position.
 * @param {Number} cx1 Second curve control point x position.
 * @param {Number} cy1 Second cure control point y position.
 * @param {Number} x1 Ending x position.
 * @param {Number} y1 Ending y position.
 * @param {Number} d Distance away from line to count towards mouse interaction.
 * @return {Boolean} Returns true if the mouse is over the line on the current
 * iteration of the cycle function.
 * @example
 * setStroke('black');
 * var on = bezierM(10, 10, 10, 0, 40, 0, 40, 10);
 * if(on) {
 *  setStroke('red');
 *  bezierM(10, 10, 10, 0, 40, 0, 40, 10);
 * }
 */
Graphics.prototype.bezierM = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1, d) { //TODO: fix this mess!
  d = d == null ? 2 : d;
  this.context.beginPath();
  this.context.moveTo(x0, y0);
  this.context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
  this.context.stroke();
  if(this.mX < Math.min(x0, x1, cx0, cx1) - d || this.mX > Math.max(x0, x1, cx0, cx1) + d || this.mY < Math.min(y0, y1, cy0, cy1) - d || this.mY > Math.max(y0, y1, cy0, cy1) + d) return false;
  return GeometryOperators.distanceToBezierCurve(x0, y0, cx0, cy0, cx1, cy1, x1, y1, this.mP, false) < d;
};


//images

/**
 *  Draw an image on this.context. parameters options (s for source, d for destination):
 *
 *  drawImage(image, dx, dy)
 *  drawImage(image, dx, dy, dw, dh)
 *  drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
 *  @param {Image} image
 *
 *  @todo document parameters
 */
Graphics.prototype.drawImage = function(image) { //TODO: improve efficiency
  if(image == null) return;

  switch(arguments.length) {
    case 3:
      this.context.drawImage(image, arguments[1], arguments[2]);
      break;
    case 5:
      this.context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4]);
      break;
    case 9:
      this.context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
      break;

  }
};

/**
 * fits an image into a rectangle without chagning its proportions (thus probably loosing top-bottom or left-right margins)
 * @param  {Image} image
 * @param  {Rectangle} rectangle frame of the image
 */
Graphics.prototype.fitImage = function(image, rectangle) {
  if(image == null ||  rectangle == null) return;

  var propIm = image.width / image.height;
  var propRc = rectangle.width / rectangle.height;
  var compProp = propIm / propRc;

  if(propIm > propRc) {
    this.context.drawImage(image, 0.5 * (image.width - image.width / compProp), 0, image.width / compProp, image.height, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  } else {
    this.context.drawImage(image, 0, 0.5 * (image.height - image.height * compProp), image.width, image.height * compProp, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
};

// styles

/**
 * [setFill description]
 * @param {[type]} style [description]
 *
 * @todo
 */
Graphics.prototype.setFill = function(style) {
  if(typeof style == "number") {
    if(arguments.length > 3) {
      this.context.fillStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
      return;
    }
    this.context.fillStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
    return;
  }
  this.context.fillStyle = style;
};

/**
 * Set stroke to draw with in canvas
 *
 * @param {(String|Number)} style If string, then hex value or web color.
 *                                If Number, then a set of RGB or RGBA integers
 * @param {Number} lineWidth Optional width of line to use. Only valid if style parameter is a string.
 *
 * @example
 * setStroke('steelblue'); // sets stroke to blue.
 * setStroke(0,0,0,0.4); // sets stroke to black with partial opacity.
 * setStroke('black', 0.2); // provides lineWidth to stroke
 */
Graphics.prototype.setStroke = function(style, lineWidth) {
  if(typeof style == "number") {
    if(arguments.length > 3) {
      this.context.strokeStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
      return;
    }
    this.context.strokeStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
    return;
  }
  this.context.strokeStyle = style;
  //TODO: will lineWidth still work if RGB or RGBA is used?
  if(lineWidth) this.context.lineWidth = lineWidth;
};

/**
 * Set the current lineWidth for strokes.
 *
 * @param {Number} lineWidth [description]\
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth|lineWidth}
 */
Graphics.prototype.setLW = function(lineWidth) {
  this.context.lineWidth = lineWidth;
};

//
// Clipping
//

/**
 * Creates a clipping circle with the given dimensions
 *
 * @param  {[type]} x x coordinate of the circle's center
 * @param  {[type]} y y coordinate of the circle's center
 * @param  {[type]} r radius of circle
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
 */
Graphics.prototype.clipCircle = function(x, y, r) {
  this.context.save();
  this.context.beginPath();
  this.context.arc(x, y, r, 0, TwoPi, false);
  this.context.closePath();
  this.context.clip();
};

/**
 * Creates a clipping rectangle with the given dimensions
 *
 * @param  {Number} x x coordinate of top left corner
 * @param  {Number} y y coordinate of top left corner
 * @param  {Number} w width of rect
 * @param  {Number} h height of rect
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
 */
Graphics.prototype.clipRectangle = function(x, y, w, h) {
  this.context.save();
  this.context.beginPath();
  this.context.moveTo(x, y);
  this.context.lineTo(x + w, y);
  this.context.lineTo(x + w, y + h);
  this.context.lineTo(x, y + h);
  this.context.clip();
};

/**
 * Saves the entire state of the canvas by pushing the current state onto a stack.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save|Save}
 */
Graphics.prototype.save = function() {
  this.context.save();
};

/**
 * Turns the path currently being built into the current clipping path.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
 */
Graphics.prototype.clip = function() {
  this.context.clip();
};

/**
 * Restores the most recently saved canvas state by popping the top entry
 * in the drawing state stack. If there is no saved state,
 * this method does nothing.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore|Restore}
 */
Graphics.prototype.restore = function() {
  this.context.restore();
};

//
// Text
//

/**
 * Draws filled in text.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * fText("hello", 10, 10);
 *
 */
Graphics.prototype.fText = function(text, x, y) {
  this.context.fillText(text, x, y);
};

/**
 * Draws stroked text.
 * Stroke color is expected to be set using {@link setStroke}.
 * Additionally, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange');
 * sText("hello", 10, 10);
 *
 */
Graphics.prototype.sText = function(text, x, y) {
  this.context.strokeText(text, x, y);
};

/**
 * Draws stroked and filled in text.
 * Stroke color is expected to be set using {@link setStroke}.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange');
 * fsText("hello", 10, 10);
 *
 */
Graphics.prototype.fsText = function(text, x, y) {
  this.context.strokeText(text, x, y);
  this.context.fillText(text, x, y);
};

/**
 * Draws filled in text and returns its width.
 *
 * @param  {String} text
 * @param  {Number} x x coordinate of text
 * @param  {Number} y x coordinate of text
 * @return {Number} the width of the rendered text in pixels
 */
Graphics.prototype.fTextW = function(text, x, y) {
  this.context.fillText(text, x, y);
  return this.context.measureText(text).width;
};

/**
 * Draws filled in text, rotated by some angle.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} angle The angle in radians to rotate the text
 * @example
 * setText('black', 30, 'Ariel');
 * fTextRotated("hello", 40, 40, (20 * Math.PI / 180));
 *
 */
Graphics.prototype.fTextRotated = function(text, x, y, angle) {
  this.context.save();
  this.context.translate(x, y);
  this.context.rotate(angle);
  this.context.fillText(text, 0, 0);
  this.context.restore();
};

/**
 * Draws filled in text in an arc.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position of control point, to start the text if not centered.
 * @param {Number} y Y position of control point, to start the text if not centered.
 * @param {Number} xCenter X position of center of arc.
 * @param {Number} yCenter Y position of center of arc.
 * @param {Boolean} centered if false (default) text starts on control point, if true the control point is the center of the text
 * @example
 * setText('black', 30, 'Ariel');
 * fTextArc("Wheels on the Bus Go Round and Round", 500, 300, 200, 200, true);
 *
 */
Graphics.prototype.fTextArc = function(text, x, y, xCenter, yCenter, centered){
  if(text == null || text === "") {
    return;
  }

  var i;
  var r = Math.sqrt(Math.pow(x - xCenter, 2)+Math.pow(y - yCenter, 2));
  var a = Math.atan2(y - yCenter, x - xCenter);
  if(centered) {
    a -= this.getTextW(text)*0.5/r;
  }
  var xl, yl;
  var letters = text.split('');
  for(i=0; letters[i]!=null; i++){
    xl = xCenter + r*Math.cos(a);
    yl = yCenter + r*Math.sin(a);
    this.fTextRotated(letters[i], xl, yl, a + HalfPi);
    a += this.getTextW(letters[i])/r;
  }
};

/**
 * Draws a mouse-enabled filled in text.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * var on = fTextM("hello", 10, 10, 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   fText("hello", 10, 10);
 * }
 *
 */
Graphics.prototype.fTextM = function(text, x, y, size) {
  size = size || 12;
  this.context.fillText(text, x, y);
  return this.mY > y && this.mY < y + size && this.mX > x && this.mX < x + this.context.measureText(text).width;
};

/**
 * Draws a mouse-enabled filled and stroked text.
 * Fill color is expected to be set using {@link setFill}.
 * Stroke color is expected to be set using {@link setStroke}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * setStroke('orange')
 * var on = fsTextM("hello", 10, 10, 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   setStroke('black')
 *   fsText("hello", 10, 10);
 * }
 *
 */
Graphics.prototype.fsTextM = function(text, x, y, size) {
  size = size || 12;
  this.context.strokeText(text, x, y);
  this.context.fillText(text, x, y);
  return this.mY > y && this.mY < y + size && this.mX > x && this.mX < x + this.context.measureText(text).width;
};

/**
 * Draws a mouse-enabled filled text rotated by some angle.
 * Fill color is expected to be set using {@link setFill}.
 * Alternatively, setText can be used to set a number of
 * text rendering properties.
 *
 * @param {String} text Text to draw.
 * @param {Number} x X position to start the text.
 * @param {Number} y Y position to start the text.
 * @param {Number} angle The angle in radians to rotate the text
 * @param {Number} size Size of the text being drawn.
 * @return {Boolean} Returns true if the mouse is over the text on the current
 * iteration of the cycle function.
 * @example
 * setText('black', 30, 'Ariel');
 * var on = fTextRotatedM("hello", 10, 10, (20 * Math.PI / 180), 30);
 * if(on) {
 *   setText('red', 30, 'Ariel');
 *   setStroke('black')
 *   fsText("hello", 10, 10);
 * }
 *
 */
Graphics.prototype.fTextRotatedM = function(text, x, y, angle, size) {
  size = size || 12;
  this.context.save();
  this.context.translate(x, y);
  this.context.rotate(angle);
  this.context.fillText(text, 0, 0);
  this.context.restore();

  var dX = this.mX - x;
  var dY = this.mY - y;
  var d = Math.sqrt(dX * dX + dY * dY);
  var a = Math.atan2(dY, dX) - angle;
  var mXT = x + d * Math.cos(a);
  var mYT = y + d * Math.sin(a);

  return mYT > y && mYT < y + size && mXT > x && mXT < x + this.context.measureText(text).width;
};

/**
 * Sets several text canvas rendering properties
 *
 * @param {Object} color optional font color
 * @param {Object} fontSize optional font size
 * @param {Object} fontName optional font name (default: LOADED_FONT)
 * @param {Object} align optional horizontal align ('left', 'center', 'right')
 * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
 * @param {Object} style optional font style ('bold', 'italic', 'underline')
 */
Graphics.prototype.setText = function(color, fontSize, fontName, align, baseline, style) {
  color = color || '#000000';
  fontSize = String(fontSize) || '14';
  fontName = fontName;
  align = align == null ? 'left' : align;
  baseline = baseline == null ? 'top' : baseline;
  style = style == null ? '' : style;

  if(style !== '') {
    style += ' ';
  }

  this.context.fillStyle = color;
  this.context.font = style + fontSize + 'px ' + fontName;
  this.context.textAlign = align;
  this.context.textBaseline = baseline;
};

/**
 * Returns the width in pixels of the text passed in given the current
 * state of the graphics canvas.
 *
 * @param  {String} text
 * @return {Number} width in pixels of the text if it were rendered.
 *
 * TODO it would be great to have a method that returned the whole
 * TextMetrics object
 */
Graphics.prototype.getTextW = function(text) {
  return this.context.measureText(text).width;
};

//
// Pixel data
//

/**
 * Return the RGBA color of the pixel at a given x,y coordinate on
 * the graphics object canvas as a string.
 *
 * @param  {Number} x x coordinate of pixel
 * @param  {Number} y y coordinate of pixel
 * @return {String} an rgba(r,g,b,a) string representation of the color
 */
Graphics.prototype.getPixelColor = function(x, y) {
  var rgba = this.context.getImageData(x, y, 1, 1).data;
  return 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
};

/**
 * Return the RGBA color of the pixel at a given x,y coordinate on
 * the graphics object canvas as an array of integers.
 *
 * @param  {Number} x x coordinate of pixel
 * @param  {Number} y y coordinate of pixel
 * @return {Uint8ClampedArray} Uint8ClampedArray  representing a one-dimensional
 *                                                array containing the data in the
 *                                                RGBA order, with integer values
 *                                                between 0 and 255
 */
Graphics.prototype.getPixelColorRGBA = function(x, y) {
  return this.context.getImageData(x, y, 1, 1).data;
};

//
// Capture
//

/**
 * Cpatures the current state of this graphics objects' canvas
 * to an image
 *
 * @return {Image} HTML5 Image object of current state of the canvas.
 */
Graphics.prototype.captureCanvas = function() {
  var im = new Image();
  im.src = this.canvas.toDataURL();
  return im;
};

//
// Cursor
//

/**
 * Change mouse cursor to given style. See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor|MDN Cursor Page} for all style options.
 * @param {String} name The name of the cursor style.
 */
Graphics.prototype.setCursor = function(name) {
  name = name == null ? 'default' : name;
  this.canvas.style.cursor = name;
};

/**
 * @todo write docs
 */
Graphics.prototype.getFrame = function(){
  return new Rectangle(0, 0, this.cW, this.cH);
};

//
// Advanced graphics (rely on Axis2D projection object)
//

/**
 * @ignore
 * @todo
 */
Graphics.prototype._linesInFrame = function(axis2D, numberListX, numberListY){
  var l = Math.min(numberListX.length, numberListY.length);
  var i;

  this.context.beginPath();
  this.context.moveTo(axis2D.projectX(numberListX[0]), axis2D.projectY(numberListY[0]));

  for(i=1; i<l; i++){
    this.context.lineTo(axis2D.projectX(numberListX[i]), axis2D.projectY(numberListY[i]));
  }
};


/**
 * @todo write docs
 */
Graphics.prototype.sLinesInFrame = function(axis2D, numberListX, numberListY){
  this._linesInFrame(axis2D, numberListX, numberListY);
  this.context.stroke();
};

/**
 * @todo write docs
 */
Graphics.prototype.fLinesInFrame = function(axis2D, numberListX, numberListY){
  this._linesInFrame(axis2D, numberListX, numberListY);
  this.context.fill();
};

/**
 * @todo write docs
 */
Graphics.prototype.fsLinesInFrame = function(axis2D, numberListX, numberListY){
  this._linesInFrame(axis2D, numberListX, numberListY);
  this.context.fill();
  this.context.stroke();
};


/**
 * @todo write docs
 */
Graphics.prototype.drawGridX = function(axis2D, dX, yLabel, stepsLabel){
  var x0;
  var n;
  var i;
  var x, top, bottom;

  x0 = Math.floor(axis2D.departureFrame.x/dX)*dX;
  n = Math.min( Math.ceil(axis2D.departureFrame.width/dX), 1000 );
  top = Math.min(axis2D.arrivalFrame.y, axis2D.arrivalFrame.y+axis2D.arrivalFrame.height);
  bottom = Math.max(axis2D.arrivalFrame.y, axis2D.arrivalFrame.y+axis2D.arrivalFrame.height);
  stepsLabel = stepsLabel==null?1:stepsLabel;
  for(i=0; i<n; i++){
    x = Math.floor(axis2D.projectX(x0 + i*dX))+0.5;
    this.line(x, top, x, bottom);
    if(yLabel!=null && i%stepsLabel===0) {
      this.fText(String(x0 + i*dX), x, bottom+yLabel);
    }
  }
};

/**
 * @todo write docs
 */
Graphics.prototype.drawGridY = function(axis2D, dY, xLabel, stepsLabel){
  var y0;
  var n;
  var i;
  var y, left, right;

  y0 = Math.floor(axis2D.departureFrame.y/dY)*dY;
  n = Math.min( Math.ceil(axis2D.departureFrame.height/dY), 1000 );
  left = Math.min(axis2D.arrivalFrame.x, axis2D.arrivalFrame.x+axis2D.arrivalFrame.width);
  right = Math.max(axis2D.arrivalFrame.x, axis2D.arrivalFrame.x+axis2D.arrivalFrame.width);
  stepsLabel = stepsLabel==null?1:stepsLabel;
  for(i=0; i<n; i++){
    y = Math.floor(axis2D.projectY(y0 + i*dY))+0.5;
    this.line(left, y, right, y);
    if(xLabel!=null && i%stepsLabel===0) {
      this.fText(String(y0 + i*dY), left+xLabel, y);
    }
  }
};

//
// Ported from Draw.js TODO - organize these appropriately.
//


/**
 * @todo write docs
 */
Graphics.prototype.drawSmoothPolygon = function(polygon, closed, amount) { //TODO: add tx, ty
  amount = amount == null ? 30 : amount;
  var controlPoints;

  if(polygon.length < 2) return null;
  if(polygon.length == 2) {
    var a = Math.atan2(polygon[1].y - polygon[0].y, polygon[1].x - polygon[0].x) - 0.5 * Math.PI;
    var cosa = amount * Math.cos(a);
    var sina = amount * Math.sin(a);
    this.context.moveTo(polygon[0].x, polygon[0].y);
    this.context.bezierCurveTo(
      polygon[0].x + cosa, polygon[0].y + sina,
      polygon[1].x + cosa, polygon[1].y + sina,
      polygon[1].x, polygon[1].y
    );
    this.context.bezierCurveTo(
      polygon[1].x - cosa, polygon[1].y - sina,
      polygon[0].x - cosa, polygon[0].y - sina,
      polygon[0].x, polygon[0].y
    );
    return;
  }
  var i;
  var nPoints = polygon.length;
  var prevPoint = polygon[nPoints - 1];
  var point = polygon[0];
  var nextPoint = polygon[1];
  controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
  var prevCP = controlPoints[1];
  var cP;
  this.context.moveTo(point.x, point.y);
  prevPoint = point;
  var nSteps = nPoints + Number(closed);
  for(i = 1; i < nSteps; i++) {
    point = polygon[i % nPoints];
    nextPoint = polygon[(i + 1) % nPoints];
    controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
    cP = controlPoints[0];
    this.context.bezierCurveTo(prevCP.x, prevCP.y, cP.x, cP.y, point.x, point.y);
    prevCP = controlPoints[1];
    prevPoint = point;
  }
};




/**
 * Draws an ellipse using the current state of the canvas.
 * @param {CanvasRenderingContext2D} context
 * @param {Number} x The center x coordinate
 * @param {Number} y The center y coordinate
 * @param {Number} rW The horizontal radius of the ellipse
 * @param {Number} rH The vertical radius of the ellipse
 */
Graphics.prototype.drawEllipse = function(x, y, rW, rH) {
  var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
    ox = rW * k, // control point offset horizontal
    oy = rH * k, // control point offset vertical
    xe = x + rW, // x-end
    ye = y + rH; // y-end

  this.context.moveTo(x - rW, y);
  this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
  this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
  this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
  this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
  this.context.moveTo(x - rW, y);
};

/**
 * Draws a polygon
 * @param {CanvasRenderingContext2D} context
 * @param {Polygon} Polygon to draw
 * @param {Boolean} close polygon
 * @param {Number} tx horizontal translation
 * @param {Number} ty vertical translation
 */
Graphics.prototype.drawPolygon = function(polygon, close, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var i;
  this.context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
  for(i = 1; polygon[i] != null; i++) {
    this.context.lineTo(tx + polygon[i].x, ty + polygon[i].y);
  }
  if(close) {
    this.context.lineTo(tx + polygon[0].x, ty + polygon[0].y);
  }
};

/**
 * @todo write docs
 */
Graphics.prototype.drawPolygonWithControlPoints = function(polygon, controlPoints, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var i;
  this.context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
  for(i = 1; polygon[i] != null; i++) {
    this.context.bezierCurveTo(tx + controlPoints[(i - 1) * 2].x, ty + controlPoints[(i - 1) * 2].y,
      tx + controlPoints[i * 2 - 1].x, ty + controlPoints[i * 2 - 1].y,
      tx + polygon[i].x, ty + polygon[i].y);
  }
};

/**
 * @todo write docs
 */
Graphics.prototype.drawBezierPolygon = function(bezierPolygon, tx, ty) {
  tx = tx || 0;
  ty = ty || 0;
  var bI;
  var N = Math.floor((bezierPolygon.length - 1) / 3);
  var i;
  this.context.moveTo(tx + bezierPolygon[0].x, ty + bezierPolygon[0].y);
  for(i = 0; i < N; i++) {
    bI = i * 3 + 1;

    this.context.bezierCurveTo(
      tx + bezierPolygon[bI].x, ty + bezierPolygon[bI].y,
      tx + bezierPolygon[bI + 1].x, ty + bezierPolygon[bI + 1].y,
      tx + bezierPolygon[bI + 2].x, ty + bezierPolygon[bI + 2].y
    );
  }
};

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} context
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 */
Graphics.prototype.drawRoundRect = function(x, y, width, height, radius) {
  radius = radius || 0;
  var bottom = y + height;
  this.context.moveTo(x + radius, y);
  this.context.lineTo(x + width - radius, y);
  this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.context.lineTo(x + width, y + height - radius);
  this.context.quadraticCurveTo(x + width, bottom, x + width - radius, bottom);
  this.context.lineTo(x + radius, bottom);
  this.context.quadraticCurveTo(x, bottom, x, bottom - radius);
  this.context.lineTo(x, y + radius);
  this.context.quadraticCurveTo(x, y, x + radius, y);
};

/**
 * @todo write docs
 */
Graphics.prototype.drawTriangleFromBase = function(x, y, base, height, angle) {
  this.context.moveTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
  this.context.lineTo(x + 0.5 * base * Math.cos(angle - Math.PI * 0.5), y + 0.5 * base * Math.sin(angle - Math.PI * 0.5));
  this.context.lineTo(x + height * Math.cos(angle), y + height * Math.sin(angle));
  this.context.lineTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
};


/**
 * @todo write docs
 */
Graphics.prototype.drawQuadrilater = function(p0, p1, p2, p3, close) {
  close = close == null ? true : close;
  this.context.moveTo(p0.x, p0.y);
  this.context.lineTo(p1.x, p1.y);
  this.context.lineTo(p2.x, p2.y);
  this.context.lineTo(p3.x, p3.y);
  if(close) this.context.lineTo(p0.x, p0.y);
};


