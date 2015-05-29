/**
 * static Class with methods to render text in canvas
 * @constructor
 */
function DrawTexts() {}

DrawTexts.POINT_TO_PIXEL = 1.3333;
DrawTexts.PIXEL_TO_POINT = 0.75;


// /**
//  * set several text canvas rendering properties
//  * to be deprecated, replaced by setText at SimpleGraphics
//  * @param {String} color optional font color
//  * @param {Number} fontSize optional font size
//  * @param {String} fontName optional font name (default: LOADED_FONT)
//  * @param {String} align optional horizontal align ('left', 'center', 'right')
//  * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
//  * @param {Object} style optional font style ('bold', 'italic', 'underline')
//  */
// DrawTexts.setContextTextProperties=function(color, fontSize, fontName, align, baseline, style){ //context should be changed before calling the function
// 	color = color||'#000000';
// 	fontSize = String(fontSize)||'14';
// 	fontName = fontName||LOADED_FONT;
// 	align = align==null?'left':align;
// 	baseline = baseline==null?'top':baseline;
// 	style = style==null?'':style;

// 	if(style!='') style+=' ';

// 	context.fillStyle    = color;
//   	context.font         = style+fontSize+'px '+fontName;
//   	context.textAlign 	 = align;
//   	context.textBaseline = baseline;
// }


DrawTexts.fillTextRectangle = function(text, x, y, width, height, lineHeight, returnHeight, ellipsis) {
  var textLines = DrawTexts.textWordWrapReturnLines(text, width, height, lineHeight, ellipsis);
  return DrawTexts.fillTextRectangleWithTextLines(textLines, x, y, height, lineHeight, returnHeight);
};

/**
 * fill a text rotated
 * @param {String} text
 * @param {Number} x
 * @param {Number} y
 * @param {Number} angle in radians
 */
DrawTexts.fillTextRotated = function(text, x, y, angle) { //TODO: remove (replaced by fTextRotated in SimpleGraphics)
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillText(text, 0, 0);
  context.restore();
};


DrawTexts.fillTextRectangleWithTextLines = function(textLines, x, y, height, lineHeight, returnHeight) {
  height = height == 0 || height == null ? 99999 : height;

  for(var i = 0; textLines[i] != null; i++) {
    context.fillText(textLines[i], x, y + i * lineHeight);
    if((i + 2) * lineHeight > height) break;
  }
  if(returnHeight) return textLines.length * lineHeight;
  return textLines.length;
};


DrawTexts.textWordWrapReturnLines = function(text, fitWidth, fitHeight, lineHeight, ellipsis) {
  fitWidth = fitWidth || 100;
  fitHeight = fitHeight || 600;
  lineHeight = lineHeight || 16;

  var nLinesLimit = lineHeight == 0 ? -1 : Math.floor(fitHeight / lineHeight);
  var lines = new StringList();

  if(fitWidth <= 0) {
    lines.push(text);
    return lines;
  }

  var sentences = text.split(/\\n|\n/);
  var i;
  var currentLine = 0;
  var words;
  var idx;
  var str;
  var w;
  var sentence;

  for(i = 0; i < sentences.length; i++) {
    if(sentences[i] == '') {
      lines.push('');
      currentLine++;
      continue;
    }
    words = sentences[i].split(' ');
    idx = 1;
    while(words.length > 0 && idx <= words.length) {
      str = words.slice(0, idx).join(' ');
      w = context.measureText(str).width;
      if(w > fitWidth) {
        if(idx == 1) idx = 2;
        sentence = words.slice(0, idx - 1).join(' ');
        if(sentence != '') lines.push(sentence);
        if(lines.length == nLinesLimit) {
          if(ellipsis) {
            var lastLine = lines[lines.length - 1];
            if(context.measureText(lastLine + "…").width <= fitWidth) {
              lines[lines.length - 1] += "…";
            } else {
              words = lastLine.split(" ");
              sentence = words.slice(0, words.length - 1).join(" ") + "…";
              lines.push(sentence);
            }
          }
          return lines;
        }
        currentLine++;
        words = words.splice(idx - 1);
        idx = 1;
      } else {
        idx++;
      }
    }
    if(idx > 0) {
      sentence = words.join(' ');
      if(sentence != '') lines.push(sentence);
    }
    currentLine++;
  }

  lines.width = lines.length == 1 ? w : fitWidth;

  return lines;
};
DrawTexts.getMaxTextWidth = function(texts) {
  var max = getTextW(texts[0]);
  for(var i = 1; texts[i] != null; i++) {
    max = Math.max(max, getTextW(texts[i]));
  }
  return max;
};


DrawTexts.cropString = function(ctx, string, fitWidth) {
  if(string == null) return;
  fitWidth = fitWidth || 0;

  if(fitWidth <= 0 || ctx.measureText(string).width <= fitWidth) {
    return string;
  }
  var chars = string.split('');
  var idx = 1;
  while(chars.length > 0 && idx <= chars.length) {
    var str = chars.slice(0, idx).join('');
    var w = ctx.measureText(str).width;
    if(w > fitWidth) {
      if(idx == 1) {
        idx = 2;
      }
      return chars.slice(0, idx - 1).join('');
    }
    else {
      idx++;
    }
  }
};