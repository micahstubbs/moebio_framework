function ColorsDraw(){};

/**
 * draws a color scale, with optional min and max associated values
 * @param  {Rectangle} frame
 * @param  {ColorScale} colorScale
 * 
 * @param  {Number} minValue value associated to min color
 * @param  {Number} maxValue value associated to max color
 * tags:draw
 */
ColorsDraw.drawColorScaleLegend = function(frame, colorScale, minValue, maxValue){
	var change = frame.memory==null || frame.width!=frame.memory.w ||  frame.height!=frame.memory.h ||  colorScale!=frame.memory.cS ||  minValue!=frame.memory.min ||  maxValue!=frame.memory.max

	if(change){
		frame.memory = {
			w:frame.width,
			h:frame.height,
			cS:colorScale,
			min:minValue,
			max:maxValue
		}

		///// capture image 1
		var newCanvas = document.createElement("canvas");
		newCanvas.width = frame.width;
		newCanvas.height = frame.height;
		var newContext = newCanvas.getContext("2d");
		newContext.clearRect(0,0,frame.width,frame.height);
		var mainContext = context;
		context = newContext;
		/////

		var x;

		if(frame.width>frame.height){

			for(x=0; x<frame.width; x+=2){
				setFill(colorScale(x/frame.width));
				fRect(x,0,2,frame.height);
			}

			setStroke('rgba(0,0,0,0.8)', 3);

			if(minValue!=null){
				setText('white', 12, null, 'left', 'middle');
				fsText(minValue, 2, frame.height*0.5);
			}

			if(maxValue!=null){
				setText('white', 12, null, 'right', 'middle');
				fsText(maxValue, frame.width-2, frame.height*0.5);
			}
		} else {

			//finis this, with color scale going uppwards, and texts for min max values

			for(x=0; x<frame.height; x+=2){
				setFill(colorScale(x/frame.height));
				fRect(0,x,frame.width, 2);
			}
		}

		


		//// capture image 2
		context = mainContext;
		frame.memory.image = new Image();
		frame.memory.image.src = newCanvas.toDataURL();
		////
	}


	if(frame.memory.image){
		drawImage(frame.memory.image, frame.x, frame.y)
	}

}