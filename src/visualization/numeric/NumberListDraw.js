import Rectangle from "src/dataStructures/geometry/Rectangle";
import StringList from "src/dataStructures/strings/StringList";
import { mX, mY, MOUSE_DOWN } from "src/Global";


function NumberListDraw() {};
export default NumberListDraw;

/**
 * draws a simple graph
 * @param  {Rectangle} frame
 * @param  {NumberList} numberList
 *
 * @param {Number} margin
 * @param {Object} xValues horizontal values, could be a stringList, a numberList or an Interval
 * @return {Number} index of element clicked
 * tags:draw
 */
NumberListDraw.drawSimpleGraph = function(frame, numberList, margin, xValues) {
  if(numberList == null || numberList.getNormalized == null) return;

  margin = margin || 0;

  //setup
  if(frame.memory == null || numberList != frame.memory.numberList) {
    frame.memory = {
      numberList: numberList,
      minmax: numberList.getMinMaxInterval(),
      zero: null
    };
    if(frame.memory.minmax.x > 0 && frame.memory.minmax.y > 0) {
      frame.memory.normalizedList = numberList.getNormalizedToMax();
    } else {
      frame.memory.normalizedList = numberList.getNormalized();
      frame.memory.zero = -frame.memory.minmax.x / frame.memory.minmax.getAmplitude();
    }

    frame.memory.xTexts = new StringList();

    if(xValues != null && xValues.type == "Interval") {
      var kx = (xValues.getAmplitude() + 1) / numberList.length;
    }

    numberList.forEach(function(val, i) {
      frame.memory.xTexts[i] = (xValues == null) ? String(numberList[i]) : ((kx == null ? xValues[i] : (xValues.x + i * kx)) + ":" + numberList[i]);
    });
  }

  var i;
  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();
  var x;
  var dx = subframe.width / numberList.length;
  var overI = -1;

  var mouseOnFrame = subframe.containsPoint(mP);
  var normalColor = mouseOnFrame ? 'rgb(160,160,160)' : 'black';

  if(frame.memory.zero) {
    var zeroY = subframe.bottom - subframe.height * frame.memory.zero; //Math.max(subframe.bottom - subframe.height*frame.memory.zero, subframe.y);
    for(i = 0; numberList[i] != null; i++) {
      x = subframe.x + i * dx;
      if(mouseOnFrame && mX > x && mX < x + dx) {
        overI = i;
        setFill('black');
      } else {
        setFill(normalColor);
      }
      fRect(subframe.x + i * dx, zeroY, dx, -subframe.height * (frame.memory.normalizedList[i] - frame.memory.zero));
    }
  } else {
    for(i = 0; numberList[i] != null; i++) {
      x = subframe.x + i * dx;
      if(mouseOnFrame && mX > x && mX < x + dx) {
        overI = i;
        setFill('black');
      } else {
        setFill(normalColor);
      }
      fRect(x, subframe.bottom, dx, -subframe.height * frame.memory.normalizedList[i]);
    }
  }

  var clicked;

  if(overI != -1) {
    setText('white', 12);
    var text = frame.memory.xTexts[overI];
    var w = getTextW(text);
    setFill('rgb(100,100,100)');
    fLines(
      mX, mY,
      mX + 16, mY - 10,
      mX + w + 16, mY - 10,
      mX + w + 16, mY - 30,
      mX + 6, mY - 30,
      mX + 6, mY - 10
    );
    setFill('white');
    fText(text, mX + 10, mY - 26);
    if(MOUSE_DOWN) clicked = overI;
  }

  return clicked;
};