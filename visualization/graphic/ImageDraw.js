function ImageDraw(){};


/**
 * draws an image
 * @param  {Rectangle} frame
 * @param  {Image} image to be drawn
 * @param  {Number} mode: 0: adjust to rectangle, 1: center and mask, 2: center and eventual reduction (image smaller than rectangle), 3: adjust to rectangle preserving proportions (image bigger than rectangle), 4: fill repeated from corner, 5: fill repeated from 0,0
 * tags:draw
 */
ImageDraw.drawImage = function(frame, image, mode){
	mode = mode||0;
	Draw.fillRectangleWithImage(frame, image, mode);
}