import Rectangle from "src/dataTypes/geometry/Rectangle";
import DrawTexts from "src/tools/graphic/DrawTexts";

/**
 * @classdesc Functions for drawing Strings
 *
 * @namespace
 * @category drawing
 */
function StringDraw() {}
export default StringDraw;

/**
 * draws a String (if the object is not a string it displays the json)
 * @param  {Rectangle} frame
 * @param  {Object} object normally a String (if not, a conversion will be made)
 *
 * @param  {Number} fontSize
 * @param  {String} fontStyle ex:'bold italic'
 * @param  {Number} margin
 * @return {Object}
 * tags:draw
 */
StringDraw.drawText = function(frame, object, fontSize, fontStyle, margin, graphics) {
  if(frame==null || object==null) return;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  margin = margin || 10;
  fontSize = fontSize || 12;

  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();

  var lineHeight = Math.floor(fontSize * 1.2);

  graphics.setText('black', fontSize, null, null, null, fontStyle);

  var significantChange = frame.memory == null || object != frame.memory.object || fontSize != frame.memory.fontSize || fontStyle != frame.memory.fontStyle || margin != frame.memory.margin || frame.width != frame.memory.width || frame.height != frame.memory.height;

  //setup
  if(significantChange) {
    var realString = object == null ?
						""
						:
      (typeof object == 'string') ?
							object
							:
      JSON.stringify(object, null, "\t");
    frame.memory = {
      textLines: DrawTexts.textWordWrapReturnLines(realString, subframe.width, subframe.height, lineHeight, true, graphics),
      object: object,
      fontSize: fontSize,
      fontStyle: fontStyle,
      margin: margin,
      width: frame.width,
      height: frame.height
    };
  }

  DrawTexts.fillTextRectangleWithTextLines(frame.memory.textLines, subframe.x, subframe.y, subframe.height, lineHeight, null, graphics);
};
