/**
 *Static class that:
 * -includes all the data models (by including the class IncludeDataModels.js)
 * -includes class utils (that contains methods such as instantiate)
 * -contains the global variables (such as userAgent, canvas, nF, mX…), global 
 * -contains the listener methods
 * -triggers de init, update and draw in Global class
 * @constructor
 */
function Global(){}

Global.userAgent="unknown";

init=function(){
  //console.log("init must be overriden!");
}

cycle=function(){
  //console.log("cycle must be overriden!");
}

resizeWindow=function(){
  console.log("resizeWindow must be overriden!");
}

var listenerArray  = new Array();
var canvas;
var removeDiv;
var userAgent="none";
var userAgentVersion;
var canvasResizeable=true;


//global useful vars
var cW = 1; // canvas width
var cH = 1; // canvas height
var cX = 1; // canvas center x
var cY = 1; // canvas center y
var mX = 0; // cursor x
var mY = 0; // cursor y
var mP = new Point(0, 0); // cursor point
var nF = 0; // number of current frame

var MOUSE_DOWN=false; //true on the frame of mousedown event
var MOUSE_UP=false; //true on the frame of mouseup event
var MOUSE_UP_FAST=false; //true on the frame of mouseup event
var NF_DOWN; //number of frame of last mousedown event
var NF_UP; //number of frame of last mouseup event
var MOUSE_PRESSED; //true if mouse pressed
var mX_DOWN; // cursor x position on last mousedown event
var mY_DOWN; // cursor x position on last mousedown event
var mX_UP; // cursor x position on last mousedown event
var mY_UP; // cursor x position on last mousedown event

//
var deltaWheel = 0;
var cursorStyle = 'auto';
var backGroundColor = 'white';
var cycleActive;

//global constants
var context;
var hddenContext;
var TwoPi = 2*Math.PI;
var HalfPi = 0.5*Math.PI;
var radToGrad = 180/Math.PI;
var gradToRad = Math.PI/180;
var c = console; //use c.log instead of console.log

//private
var _wheelActivated = false;
var _keyboardActivated = false;

var _prevMouseX = 0;
var _prevMouseY = 0;
var _setIntervalId;
var _setTimeOutId;
var _cycleOnMouseMovement = false;
var _interactionCancelledFrame;
var END_CYCLE_DELAY = 3000;

window.addEventListener('load', function(){
	c.log('Moebio Framework v2.20');

 	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
    	userAgent='IE';
    	userAgentVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
    	if(userAgentVersion<9) return null;
	} else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
   		userAgent='FIREFOX';
    	userAgentVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
   	} else if (navigator.userAgent.match(/Chrome/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	 	userAgent='CHROME';
	    userAgentVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
	} else if (/Mozilla[\/\s](\d+\.\d+)/.test(navigator.userAgent) || navigator.userAgent.match(/Mozilla/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
	 	userAgent='MOZILLA';
	    userAgentVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
	} else if (navigator.userAgent.match(/Safari/) != null){ //test for MSIE x.x;
    	userAgent='Safari';
    	userAgentVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
  	} else if(navigator.userAgent.match(/iPad/i) != null){
    	userAgent='IOS';
  	} else if(navigator.userAgent.match(/iPhone/i) != null){
    	userAgent='IOS';
  	}
  	
  	c.log('[G] userAgent:', userAgent);
  	
  	Global.userAgent=userAgent;
    Global.frameRate=30;
    
	canvas = document.getElementById('main');
	
	if(canvas!=null){
		removeDiv = document.getElementById('removeDiv');
		removeDiv.style.display = 'none';
		cH=canvas.height;
		cW=canvas.width;
		context = canvas.getContext('2d');
		
		//hiddenContext = CanvasAndContext.createInvisibleContext();
		
		cW = context.canvas.width  = window.innerWidth;
		cH = context.canvas.height = window.innerHeight;
		
		cX = Math.floor(cW*0.5);
		cY = Math.floor(cH*0.5);
		
		canvas.addEventListener("mousemove", _onMouse, false);
		canvas.addEventListener("mousedown", _onMouse, false);
		canvas.addEventListener("mouseup", _onMouse, false);
		window.addEventListener("resize", onResize, false);
		
		startCycle();
		init();
	}
	
}, false);

function _onMouse(e) {
	switch(e.type){
		case "mousemove":
			if(e.clientX){
				mX = e.clientX;
		        mY = e.clientY;
			} else if(e.offsetX) {
		        mX = e.offsetX;
		        mY = e.offsetY;
		    } else if(e.layerX) {
		        mX = e.layerX;
		        mY = e.layerY;
		    }
		  	mP.x = mX;
		  	mP.y = mY;
		  	break;
		case "mousedown":
			NF_DOWN = nF;
			MOUSE_PRESSED = true;
			mX_DOWN = mX;
			mY_DOWN = mY;
			break;
		case "mouseup":
			NF_UP = nF;
			MOUSE_PRESSED = false;
			mX_UP = mX;
			mY_UP = mY;
			break;
	}
}

function onResize(e){
	if(canvasResizeable==false) return;
	
	canvas.setAttribute('width', document.body.clientWidth);
    canvas.setAttribute('height', document.body.clientHeight);
	
	cW = context.canvas.width;
	cH = context.canvas.height;
	
	cX = Math.floor(cW*0.5);
	cY = Math.floor(cH*0.5);
	
	resizeWindow();
}

function clearContext(){
	context.clearRect(0, 0, cW, cH);
}

function cycleOnMouseMovement(value){
	if(value){
		context.canvas.addEventListener('mousemove', onMoveCycle, false);
		addInteractionEventListener('mousewheel', onMoveCycle, this);
		_cycleOnMouseMovement = true;
		stopCycle();
	} else {
		context.canvas.removeEventListener('mousemove', onMoveCycle, false);
		removeInteractionEventListener('mousewheel', onMoveCycle, this);
		_cycleOnMouseMovement = false;
		startCycle();
	}
}
	
function enterFrame(){
   	context.clearRect(0, 0, cW, cH);
   	setCursor('default');

   	MOUSE_DOWN = NF_DOWN==nF;
	MOUSE_UP = NF_UP==nF;
	MOUSE_UP_FAST = MOUSE_UP && (nF-NF_DOWN)<9;

  	cycle();
  	
  	nF++;
}

function startCycle(){
	clearTimeout(_setTimeOutId);
	clearInterval(_setIntervalId);
	_setIntervalId = setInterval(enterFrame, 30);
	cycleActive = true;
}


function stopCycle(){
	clearInterval(_setIntervalId);
	cycleActive = false;
}




function onMoveCycle(e){
	if(e.type=='mousemove' && _prevMouseX==mX && _prevMouseY==mY) return;
	reStartCycle();
}

function reStartCycle(){
	_prevMouseX=mX;
	_prevMouseY=mY;
	
	if(!cycleActive){
		_setIntervalId = setInterval(enterFrame, 30);
		cycleActive = true;
	}
	
	clearTimeout(_setTimeOutId);
	_setTimeOutId = setTimeout(stopCycle, END_CYCLE_DELAY);
}

//interaction events
function addInteractionEventListener(eventType, onFunction, target){//TODO: listenerArray contains objects instead of arrays
	listenerArray.push(new Array(eventType, onFunction, target));
	switch(eventType){
		case 'mousedown':
		case 'mouseup':
		case 'click':
		case 'mousemove':
			context.canvas.addEventListener(eventType, onCanvasEvent, false);
			break;
		case 'mousewheel':
			if(!_wheelActivated) activateWheel();
			break;
		case 'keydown':
			if(!_keyboardActivated) activateKeyboard();
			break;
	}
}

function onCanvasEvent(e){
	var i;
	for(i=0; listenerArray[i]!=null; i++){
		if(listenerArray[i][0]==e.type.replace('DOMMouseScroll', 'mousewheel')){
			if(_interactionCancelledFrame==nF) return;
			listenerArray[i][1].call(listenerArray[i][2], e);
		}
	}
}

function removeInteractionEventListener(eventType, onFunction, target){ //TODO: finish this (requires single element removing method solved first)
	for(var i=0; listenerArray[i]!=null; i++){
		if(listenerArray[i][0]==eventType && listenerArray[i][1]==onFunction && listenerArray[i][2]==target){
			delete listenerArray[i];
			listenerArray.splice(i, 1);
			i--;
		}
	}
}
function cancelAllInteractions(){
	c.log("cancelAllInteractions, _interactionCancelledFrame:", nF);
	_interactionCancelledFrame = nF;
}

function setBackgroundColor(color){
	if(typeof color == "number"){
		if(arguments.length>3){
			color = 'rgba('+arguments[0]+','+arguments[1]+','+arguments[2]+','+arguments[3]+')';
		} else {
			color = 'rgb('+arguments[0]+','+arguments[1]+','+arguments[2]+')';
		}
	} else if(Array.isArray(color)){
		color = ColorOperators.RGBtoHEX(color[0], color[1], color[2]);
	}
	backGroundColor = color;
	var body = document.getElementById('index');
	body.setAttribute('bgcolor', backGroundColor);
}

function setDivPosition(div, x, y){
	div.setAttribute('style', 'position:absolute;left:'+String(x)+'px;top:'+String(y)+'px;');
}


/////////////////////////////////// keyboard and wheel

function activateKeyboard(){
	_keyboardActivated = true;
	document.onkeydown = onKey;
}
function onKey(e){
	onCanvasEvent(e);
}

/**
 * thanks http://www.adomas.org/javascript-mouse-wheel
 */
function activateWheel(){
	_wheelActivated = true;
	
	if (window.addEventListener){
		window.addEventListener('DOMMouseScroll', _onWheel, false);
		//window.addEventListener("mousewheel", _onWheel, false); // testing
	}
	window.onmousewheel = document.onmousewheel = _onWheel;
	
}
function _onWheel(e) {
    if (!e) e = window.event; //IE
            
    if (e.wheelDelta){
    	deltaWheel = e.wheelDelta/120;
    } else if (e.detail) { /** Mozilla case. */
        deltaWheel = -e.detail/3;
    }
    e.value = deltaWheel;
    e.type = "mousewheel"; //why this doesn't work?
	onCanvasEvent(e);
}

