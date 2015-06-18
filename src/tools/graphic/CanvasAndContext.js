import { cW, cH } from 'src/Global';

function CanvasAndContext() {}
export default CanvasAndContext;

CanvasAndContext.createInvisibleContext = function(width, height) {
  width = width || cW;
  height = height || cH;

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = cW;
  tempCanvas.height = cH;
  return tempCanvas.getContext('2d');
};