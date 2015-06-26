/* global console, Image */

import { onResize, context, canvas } from "src/tools/utils/code/ClassUtils";

function ImageGenerators() {}
export default ImageGenerators;

ImageGenerators.dashedPattern = function(colorBackground, colorLine, separationLines, widthLines) { //TODO: doesn't work because of two different issues
  separationLines = separationLines == null ? 2 : separationLines;
  widthLines = widthLines == null ? 1 : widthLines;

  onResize();

  canvas.setAttribute('width', 50);
  canvas.setAttribute('height', 50);
  context.clearRect(0, 0, 55, 55);

  //context.lineWidth = widthLines;
  context.fillStyle = colorBackground;
  //context.strokeStyle = colorLine;
  context.fillRect(0, 0, 55, 55);

  for(var y = 0; y < 110; y += separationLines) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(55, y - 55);
    context.stroke();
  }

  var im = new Image(51, 51);
  im.src = canvas.toDataURL('image/png');

  console.log('im', im);
  console.log('im.width', im.width);

  onResize();

  return im;
};