import StringList from "src/dataTypes/strings/StringList";

/**
 * @classdesc static Class with methods to render text in canvas
 * @namespace
 * @category drawing
 */
function DrawTexts() {}
export default DrawTexts;

DrawTexts.POINT_TO_PIXEL = 1.3333;
DrawTexts.PIXEL_TO_POINT = 0.75;

/**
 * @todo write docs
 */
DrawTexts.fillTextRectangle = function(text, x, y, width, height, lineHeight, returnHeight, ellipsis, graphics) {
  var textLines = DrawTexts.textWordWrapReturnLines(text, width, height, lineHeight, ellipsis, graphics);
  return DrawTexts.fillTextRectangleWithTextLines(textLines, x, y, height, lineHeight, returnHeight, graphics);
};

/**
 * @todo write docs
 */
DrawTexts.fillTextRectangleWithTextLines = function(textLines, x, y, height, lineHeight, returnHeight, graphics) {
  height = height === 0 || height == null ? 99999 : height;

  for(var i = 0; textLines[i] != null; i++) {
    graphics.context.fillText(textLines[i], x, y + i * lineHeight);
    if((i + 2) * lineHeight > height) break;
  }
  if(returnHeight) return textLines.length * lineHeight;
  return textLines.length;
};


/**
 * @todo write docs
 */
DrawTexts.textWordWrapReturnLines = function(text, fitWidth, fitHeight, lineHeight, ellipsis, graphics) {
  fitWidth = fitWidth || 100;
  fitHeight = fitHeight || 600;
  lineHeight = lineHeight || 16;

  var nLinesLimit = lineHeight === 0 ? -1 : Math.floor(fitHeight / lineHeight);
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
    if(sentences[i] === '') {
      lines.push('');
      currentLine++;
      continue;
    }
    words = sentences[i].split(' ');
    idx = 1;
    while(words.length > 0 && idx <= words.length) {
      str = words.slice(0, idx).join(' ');
      w = graphics.context.measureText(str).width;
      if(w > fitWidth) {
        if(idx == 1) idx = 2;
        sentence = words.slice(0, idx - 1).join(' ');
        if(sentence !== '') lines.push(sentence);
        if(lines.length == nLinesLimit) {
          if(ellipsis) {
            var lastLine = lines[lines.length - 1];
            if(graphics.context.measureText(lastLine + "…").width <= fitWidth) {
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
      if(sentence !== '') lines.push(sentence);
    }
    currentLine++;
  }

  lines.width = lines.length == 1 ? w : fitWidth;

  return lines;
};

/**
 * @todo write docs
 */
DrawTexts.getMaxTextWidth = function(texts, graphics) {
  var max = graphics.getTextW(texts[0]);
  for(var i = 1; texts[i] != null; i++) {
    max = Math.max(max, graphics.getTextW(texts[i]));
  }
  return max;
};


/**
 * @todo write docs
 */
DrawTexts.cropString = function(graphics, string, fitWidth) {
  if(string == null) return;
  fitWidth = fitWidth || 0;

  if(fitWidth <= 0 || graphics.context.measureText(string).width <= fitWidth) {
    return string;
  }
  var chars = string.split('');
  var idx = 1;
  while(chars.length > 0 && idx <= chars.length) {
    var str = chars.slice(0, idx).join('');
    var w = graphics.context.measureText(str).width;
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
