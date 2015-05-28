function ListDraw() {};

/**
 * draws a list in a vertical stack
 * @param  {Rectangle} frame
 * @param  {List} list to be drawn
 *
 * @param {Number} returnMode:<br>-1:no selection<br>0:return index<br>1:return element<br>2:indexes<br>3:elements
 * @param  {ColorList} colorList colors of elements
 * @param {Number} textSize
 * @param  {Number} mode 0:color in square if any
 * @param {Object} [varname] index or list of indexes of externally selected
 * @return {Object} returns the index of the selected element, the element, a list of indexes or a list of elements
 * tags:draw
 */
ListDraw.drawList = function(frame, list, returnMode, colorList, textSize, mode, selectedInit) {
  if(list == null || !list.length > 0) return;

  textSize = textSize || 14;
  returnMode = returnMode == null ? 0 : returnMode;

  if(frame.memory == null) frame.memory = { selected: 0, y: 0, multiSelected: new List() };

  var changeList = frame.memory.list != list;
  var changeExternallySelected = (changeList && selectedInit != null) || frame.memory.selectedInit != selectedInit;

  if(changeExternallySelected) {
    if(returnMode == 3) {
      frame.memory.multiSelected = new List();
      selectedInit.forEach(function(index) {
        frame.memory.multiSelected.push(list[index]);
      });
    } else if(returnMode == 2) {
      frame.memory.multiSelected = List.fromArray(selectedInit).getImproved();
    } else {
      frame.memory.selected = selectedInit;
    }

    frame.memory.selectedInit = selectedInit;
  }

  if(changeList) {
    frame.memory.list = list;
  }

  var i;
  var x = frame.x + 5;
  var xTexts = x + (colorList ? 15 : 0);
  var y;
  var dy = textSize + 4;
  var n = list.length;
  var bottom = frame.getBottom();
  var mouseIn = frame.containsPoint(mP);
  var y0Follow = 0;
  var y0;
  var isSelected;
  var multi = returnMode == 2 || returnMode == 3;
  var index, onMulti;

  var hList = list.length * dy;

  if(hList <= frame.height - 20) {
    y0 = frame.y + 10;
  } else {
    if(mouseIn) {
      y0Follow = Math.min(10 - (hList - frame.height + 20) * ((mY - (frame.y + 10)) / (frame.height - 20)), 10);
    } else {
      y0Follow = 10 - (hList - frame.height + 20) * frame.memory.selected / list.length;
    }

    frame.memory.y = 0.95 * frame.memory.y + 0.05 * y0Follow;

    y0 = frame.y + frame.memory.y;
  }


  setText('black', textSize);

  for(i = 0; list[i] != null; i++) {
    y = y0 + dy * i;

    if(y < frame.y) continue;
    if(y + 12 > bottom) break;



    if(returnMode != -1) {

      index = frame.memory.multiSelected.indexOf(i);
      onMulti = multi && index != -1;

      isSelected = multi ? onMulti : frame.memory.selected == i;

      if(isSelected) {
        setFill('black');
        fRect(frame.x + 2, y, frame.width - 4, dy);
        setFill('white');
      } else {
        setFill('black');
      }
      fText(list[i].toString(), xTexts, y + 2);

      if(mouseIn && mY >= y && mY < y + dy) {
        setFill('rgba(150,150,150,0.3)');
        if(fRectM(frame.x + 2, y, frame.width - 4, dy)) {
          setCursor('pointer');
        }
        if(MOUSE_DOWN) {
          if(multi) {

            if(onMulti) {
              frame.memory.multiSelected = frame.memory.multiSelected.getWithoutElementAtIndex(index);
            } else {
              frame.memory.multiSelected = frame.memory.multiSelected.clone();
              frame.memory.multiSelected.push(returnMode == 2 ? i : list[i]);
              frame.memory.multiSelected = frame.memory.multiSelected.getImproved();
            }

          } else {
            frame.memory.selected = i;
          }
        }
      }
    } else {
      setFill('black');
    }

    if(colorList) {
      setFill(colorList == null ? 'rgb(200, 200, 200)' : colorList[i % n]);
      fRect(x, y + 4, 10, 10);
    }

  }

  return returnMode == 1 ? list[frame.memory.selected] : (multi ? frame.memory.multiSelected : frame.memory.selected);
}