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
  //console.log("resizeWindow must be overriden!");
}

lastCycle = function(){
	//override
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
var nF = 0; // number of current frame since first cycle

var MOUSE_DOWN=false; //true on the frame of mousedown event
var MOUSE_UP=false; //true on the frame of mouseup event
var MOUSE_UP_FAST=false; //true on the frame of mouseup event
var WHEEL_CHANGE=0; //differnt from 0 if mousewheel (or pad) moves / STATE
var NF_DOWN; //number of frame of last mousedown event
var NF_UP; //number of frame of last mouseup event
var MOUSE_PRESSED; //true if mouse pressed / STATE
var MOUSE_IN_DOCUMENT = true; //true if cursor is inside document / STATE
var mX_DOWN; // cursor x position on last mousedown event
var mY_DOWN; // cursor x position on last mousedown event
var mX_UP; // cursor x position on last mousedown event
var mY_UP; // cursor y position on last mousedown event
var PREV_mX=0; // cursor x position previous frame
var PREV_mY=0; // cursor y position previous frame
var DX_MOUSE=0; //horizontal movement of cursor in last frame
var DY_MOUSE=0; //vertical movement of cursor in last frame
var MOUSE_MOVED = false; //boolean that indicates wether the mouse moved in the last frame / STATE
var T_MOUSE_PRESSED = 0; //time in milliseconds of mouse being pressed, useful for sutained pressure detection

//var deltaWheel = 0;
var cursorStyle = 'auto';
var backGroundColor = 'white';
var cycleActive;

//global constants
var context;
var TwoPi = 2*Math.PI;
var HalfPi = 0.5*Math.PI;
var radToGrad = 180/Math.PI;
var gradToRad = Math.PI/180;
var c = console;
c.l = c.log; //use c.l instead of console.log

//private
var _wheelActivated = false;
var _keyboardActivated = false;

var _prevMouseX = 0;
var _prevMouseY = 0;
var _setIntervalId;
var _setTimeOutId;
var _cycleOnMouseMovement = false;
var _interactionCancelledFrame;
var _tLastMouseDown;

var END_CYCLE_DELAY = 3000; //time in milliseconds, from last mouse movement to the last cycle to be executed in case cycleOnMouseMovement has been activated

Array.prototype.last = function(){
	return this[this.length-1];
}

window.addEventListener('load', function(){

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
  	
  	
  	Global.userAgent=userAgent;
    Global._frameRate=30;
    
	canvas = document.getElementById('main');
	
	if(canvas!=null){
		removeDiv = document.getElementById('removeDiv');
		removeDiv.style.display = 'none';

		context = canvas.getContext('2d');
		
		_adjustCanvas();
		
		canvas.addEventListener("mousemove", _onMouse, false);
		canvas.addEventListener("mousedown", _onMouse, false);
		canvas.addEventListener("mouseup", _onMouse, false);
		canvas.addEventListener("mouseenter", _onMouse, false);
		canvas.addEventListener("mouseleave", _onMouse, false);
		activateWheel();

		window.addEventListener("resize", onResize, false);
		
		startCycle();
		init();
	}

	c.l('Moebio Framework v2.255 | user agent: '+userAgent+' | user agent version: '+userAgentVersion+' | canvas detected: '+(canvas!=null));
	
}, false);

function _onMouse(e) {
	switch(e.type){
		case "mousemove":
			PREV_mX=mX;
			PREV_mY=mY;

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
		  	MOUSE_IN_DOCUMENT = true;
		  	break;
		case "mousedown":
			NF_DOWN = nF;
			MOUSE_PRESSED = true;
			T_MOUSE_PRESSED = 0;
			_tLastMouseDown = new Date().getTime();
			mX_DOWN = mX;
			mY_DOWN = mY;
			MOUSE_IN_DOCUMENT = true;
			break;
		case "mouseup":
			NF_UP = nF;
			MOUSE_PRESSED = false;
			T_MOUSE_PRESSED = 0;
			mX_UP = mX;
			mY_UP = mY;
			MOUSE_IN_DOCUMENT = true;
			break;
		case "mouseenter":
			MOUSE_IN_DOCUMENT = true;
			break;
		case "mouseleave":
			MOUSE_IN_DOCUMENT = false;
			break;
	}
}

function onResize(e){
	_adjustCanvas();
	resizeWindow();
}

function _adjustCanvas(){
	if(canvasResizeable==false) return;

	cW = getDocWidth();
	cH = getDocHeight();
	
	canvas.setAttribute('width', cW);
    canvas.setAttribute('height', cH);
	
	cX = Math.floor(cW*0.5);
	cY = Math.floor(cH*0.5);
}


function clearContext(){
	context.clearRect(0, 0, cW, cH);
}

function cycleOnMouseMovement(value, time){
	if(time!=null) END_CYCLE_DELAY = time;

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

function setFrameRate(fr){
	fr = fr||30;
	Global._frameRate = fr;

	if(cycleActive) startCycle();
}
	
function enterFrame(){
   	context.clearRect(0, 0, cW, cH);
   	setCursor('default');

   	MOUSE_DOWN = NF_DOWN==nF;
	MOUSE_UP = NF_UP==nF;
	MOUSE_UP_FAST = MOUSE_UP && (nF-NF_DOWN)<9;

	DX_MOUSE = mX-PREV_mX;
	DY_MOUSE = mY-PREV_mY;
	MOUSE_MOVED = DX_MOUSE!=0 || DY_MOUSE!=0;

	if(MOUSE_PRESSED) T_MOUSE_PRESSED = new Date().getTime() - _tLastMouseDown;
	
  	cycle();

  	WHEEL_CHANGE = 0;

  	PREV_mX=mX;
	PREV_mY=mY;
  	
  	nF++;

}

function startCycle(){
	clearTimeout(_setTimeOutId);
	clearInterval(_setIntervalId);
	_setIntervalId = setInterval(enterFrame, Global._frameRate);
	cycleActive = true;
}


function stopCycle(){
	clearInterval(_setIntervalId);
	cycleActive = false;

	lastCycle();
}




function onMoveCycle(e){
	if(e.type=='mousemove' && _prevMouseX==mX && _prevMouseY==mY) return;
	reStartCycle();
}

function reStartCycle(){
	_prevMouseX=mX;
	_prevMouseY=mY;
	
	if(!cycleActive){
		_setIntervalId = setInterval(enterFrame, Global._frameRate);
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
		case 'keyup':
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
	document.onkeyup = onKey;
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
	//c.l('_onWheel, e:', e);

    if (!e) e = window.event; //IE
            
    if (e.wheelDelta){
    	WHEEL_CHANGE = e.wheelDelta/120;
    } else if (e.detail) { /** Mozilla case. */
        WHEEL_CHANGE = -e.detail/3;
    }
    e.value = WHEEL_CHANGE;
    e.type = "mousewheel"; //why this doesn't work?

	onCanvasEvent(e);
}



////structures local storage

setStructureLocalStorageWithSeed = function(object, seed, comments){
	setStructureLocalStorage(object, MD5.hex_md5(seed), comments);
}

setStructureLocalStorage = function(object, id, comments){
	var type = typeOf(object);
	var code;

	switch(type){
		case 'string':
			code = object;
			break;
		case 'Network':
			code = NetworkEncodings.encodeGDF(network);
			break;
		default:
			type = 'object';
			code = JSON.stringify(object);
			break;
	}

	var storageObject = {
		id:id,
		type:type,
		comments:comments,
		date:new Date(),
		code:code
	}

	var storageString = JSON.stringify(storageObject);

	// c.l('storageObject', storageObject);
	// c.l('id:['+id+']');
	// c.l('code.length:', code.length);

	localStorage.setItem(id, storageString);
}

getStructureLocalStorageFromSeed = function(seed, returnStorageObject){
	return getStructureLocalStorage(MD5.hex_md5(seed), returnStorageObject);
}

getStructureLocalStorage = function(id, returnStorageObject){
	returnStorageObject = returnStorageObject||false;

	var item = localStorage.getItem(id);

	if(item==null) return null;


	try{
		var storageObject = JSON.parse(item);
	} catch(err){
		return null;
	}

	if(storageObject.type==null && storageObject.code==null) return null;
	
	var type = storageObject.type;
	var code = storageObject.code;
	var object;

	switch(type){
		case 'string':
			object = code;
			break;
		case 'Network':
			object = NetworkEncodings.decodeGDF(code);
			break;
		case 'object':
			object = JSON.parse(code);
			break;
	}

	if(returnStorageObject){
		storageObject.object = object;
		storageObject.size = storageObject.code.length;
		storageObject.date = new Date(storageObject.date);
		
		return storageObject;
	}

	return object;
}

function getDocWidth() {
    var D = document;
    return Math.max(
        D.body.scrollWidth, D.documentElement.scrollWidth,
        D.body.offsetWidth, D.documentElement.offsetWidth,
        D.body.clientWidth, D.documentElement.clientWidth
    );
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}
