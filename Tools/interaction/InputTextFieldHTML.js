InputTextFieldHTML.prototype.constructor=InputTextFieldHTML;


function InputTextFieldHTML(configuration){
	this.id = configuration.id==null?0:configuration.id;
	
	this.target=configuration.target;
	
	this.x=configuration.x==null?0:configuration.x;
    this.y=configuration.y==null?0:configuration.y;
    this.width=configuration.width==null?200:configuration.width;
    this.height=configuration.height==null?20:configuration.height;
    this.fontSize = configuration.fontSize==null?16:configuration.fontSize;
    
    this.enterFunction=configuration.enterFunction;
    this.changeFunction=configuration.changeFunction;
    this.focusFunction=configuration.focusFunction;
    this.blurFunction=configuration.blurFunction;
    
    this.text = configuration.text;
    
    this.textarea = configuration.textarea==null?true:configuration.textarea;
    this.readOnly = configuration.readOnly==null?false:configuration.readOnly;
    this.border = configuration.border==null?true:configuration.border;
    this.password = configuration.password;
    
    this._prevX;
    this._prevY;
    this._prevWidth;
    this._prevHeight;
    this._prevText;
    
    this.zIndex = 30;
    
	this.enterFunctionTarget;
	this.changeFunctionTarget;
	this.focusFunctionTarget;
	this.blurFunctionTarget;
	
	this.textColor=configuration.textColor==null?'black':configuration.textColor;
	this.backgroundColor='#FFFFFF';
	
	this.main = document.getElementById('maindiv');
	this.div = document.createElement('div2');
	this.textarea?this.DOMtext = document.createElement("textarea"):this.DOMtext = document.createElement("input");
	this.password?this.DOMtext.setAttribute('type', 'password'):this.DOMtext.setAttribute('type', 'text');
	this.div.setAttribute('style', 'position:absolute;top:'+this.y+'px;left:'+this.x+'px;z-index:'+this.zIndex+';');


	if(!this.border) this.DOMtext.setAttribute('style', 'border:none');

	this.div.setAttribute('rows', '1');
	in.appendChild(this.div);
	this.div.appendChild(this.DOMtext);
	this.DOMtext.parent = this;
	this.added = true;

	this.DOMtext.readOnly = this.readOnly;

	this.DOMtext.onfocus = function(e){
		e.target = this.parent;
		this.parent._onFocus(this.parent);
	}
	this.DOMtext.onblur = function(e){
		e.target = this.parent;
		this.parent._onBlur(this.parent);
	}
	
	this.DOMtext.value= "";
	
	addInteractionEventListener("keydown", this.onKeyDown, this);
	this._eKeyDown;
	
	this.timer;

	this.focus = false;
	
	if(this.changeFunction!=null) this.setChangeFunction(this.changeFunction, this.target);
	if(this.enterFunction!=null) this.setEnterFunction(this.enterFunction, this.target);
	if(this.focusFunction!=null) this.setFocusFunction(this.focusFunction, this.target);
	if(this.blurFunction!=null) this.setBlurFunction(this.blurFunction, this.target);
	
	if(this.text!=null){
		this.setText(this.text);
	} else {
		this.draw();
	}
	
	this.DOMtext.addEventListener("mousemove", _onMouse, false);
	if(_cycleOnMouseMovement) this.DOMtext.addEventListener('mousemove', onMoveCycle, false);
}

InputTextFieldHTML.prototype.setBorder = function(value) {
	this.border = value;
	this.DOMtext.setAttribute('style',  'color: '+this.textColor+'; width:'+(this.width-7)+'px;height:'+(this.height-7)+'px; font-size:'+this.fontSize+'px; border:'+(value?'yes':'none'));
}

InputTextFieldHTML.prototype.draw = function() {
	if(this.x!=this._prevX || this.y!=this._prevY || this.width!=this._prevWidth || this.height!=this._prevHeight || this.text!=this._prevText){
 		this._prevX = this.x;
    	this._prevY = this.y;
    	this._prevWidth = this.width;
    	this._prevHeight = this.height;
    	this._prevText = this.text;
    	
		this.DOMtext.style="none";
		this.DOMtext.style.padding="0px";
		this.DOMtext.style.border="0px";
		this.DOMtext.style.borderColor = "#FFFFFF";
		this.DOMtext.style.background = "transparent";
		this.DOMtext.style.resize = "none";
		
		this.DOMtext.setAttribute('style',  'color: '+this.textColor+'; width:'+(this.width-7)+'px;height:'+(this.height-7)+'px; font-size:'+this.fontSize+'px');
		this.div.setAttribute('style', 'position:absolute;top:'+this.y+'px;left:'+this.x+'px;z-index:'+this.zIndex+';');
	}
}

InputTextFieldHTML.prototype.setText=function(text, activeChange){
	activeChange = activeChange==null?true:activeChange;
	this.text = text;
	this.DOMtext.value = text;
	
	//var timer = setTimeout(this.onKeyDownDelayed, 4, this);
	this.draw();
}

InputTextFieldHTML.prototype.getText=function(){
	return this.DOMtext.value;
}

InputTextFieldHTML.prototype.getSelectionStart=function(){
	return this.DOMtext.selectionStart;
}

InputTextFieldHTML.prototype.onKeyDown=function(e){
	this._eKeyDown = e;
	this._keyCode = e.keyCode;
	this.timer = setTimeout(this.onKeyDownDelayed, 4, this);
}

InputTextFieldHTML.prototype.onKeyDownDelayed=function(target){
	if(target._keyCode==13){
		if(target.enterFunction!=null){
			target.enterFunction.call(target.enterFunctionTarget, target.id);
		}
	}
	
	if(target.text!=target.DOMtext.value){
		
		target.text = target.DOMtext.value;
		var lastChar = target.text.charAt(target.text.length-1);
		
		if(target._keyCode!=13){
			if(target.changeFunction!=null) target.changeFunction.call(target.changeFunctionTarget, target.id);
		}
	}
	if(_cycleOnMouseMovement) reStartCycle();

	this.timer = null;
}

InputTextFieldHTML.prototype.forceFocus = function(){
	this.DOMtext.focus();
	this.focus = true;
}

InputTextFieldHTML.prototype.forceUnfocus = function(){
	c.log("[!] use InputTextFieldHTML.prototype.forceBlur instead"); a.push(0);
}

InputTextFieldHTML.prototype.forceBlur = function(){
	this.DOMtext.blur();
	this.focus = false;
}


InputTextFieldHTML.prototype.setEnterFunction=function(enterFunction, target){
	this.enterFunction = enterFunction;
	this.enterFunctionTarget = target;
}
InputTextFieldHTML.prototype.setChangeFunction=function(changeFunction, target){
	this.changeFunction = changeFunction;
	this.changeFunctionTarget = target;
}
InputTextFieldHTML.prototype.setFocusFunction=function(focusFunction, target){
	this.focusFunction = focusFunction;
	this.focusFunctionTarget = target;
}
InputTextFieldHTML.prototype.setBlurFunction=function(blurFunction, target){
	this.blurFunction = blurFunction;
	this.blurFunctionTarget = target;
}

InputTextFieldHTML.prototype.setSelection = function(start, end){
	start = start==null?0:start;
	end = end==null?this.DOMtext.value.length:end;
	this.DOMtext.selectionStart = start;
	this.DOMtext.selectionEnd = end;
}
InputTextFieldHTML.prototype.placeCursor = function(nChar){
	this.setSelection(nChar);
}

InputTextFieldHTML.prototype.setScrollPosition = function(y){
	if(y<=1) y = Math.floor(y*this.DOMtext.scrollHeight);
	this.DOMtext.scrollTop = y;
}
InputTextFieldHTML.prototype.getScrollPosition = function(){
	return this.DOMtext.scrollTop;
}
InputTextFieldHTML.prototype.getTextHeight = function(){
	return this.DOMtext.scrollHeight;
}


InputTextFieldHTML.prototype._onFocus = function(target){
	target.focus = true;
	if(target.focusFunction!=null) target.focusFunction.call(target.focusFunctionTarget, target.id);
}

InputTextFieldHTML.prototype._onBlur = function(target){
	target.focus = false;
	if(target.blurFunction!=null) target.blurFunction.call(target.blurFunctionTarget, target.id);
}

InputTextFieldHTML.prototype.remove=function(){
	if(this.added){
		this.div.removeChild(this.DOMtext);
		this.main.removeChild(this.div);
		this.added = false;
	}
}

InputTextFieldHTML.prototype.readd=function(){
	if(!this.added){
		this.main.appendChild(this.div);
		this.div.appendChild(this.DOMtext);
		this.added = true;
	}
}

InputTextFieldHTML.prototype.disappear=function(){
	c.log('[!] InputTextFieldHTML.prototype.disappear replaced by remove'); a.push(0);
	this.x = -10000;
	this.draw();
}