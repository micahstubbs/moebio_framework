function SVGdecode() {}

SVGdecode.pathToBezierPolygon = function(path) {
  var log = false;

  path = StringOperators.getFirstTextBetweenStrings(path, "M", "\"");
  if(log) c.log('1. path:' + path);
  path = path.replace(/\n|\t|\r/g, "");
  path = path.replace(/-/g, ",-");
  path = path.replace(/,,/g, ",");
  path = path.replace(/c,/g, "c");
  path = path.replace(/C,/g, "C");
  path = path.replace(/s,/g, "s");
  path = path.replace(/S,/g, "S");
  path = path.replace(/l,/g, "l");
  path = path.replace(/L,/g, "L");
  if(path.charAt(0) == "M") path = path.substr(1);
  if(path.charAt(0) == ",") path = path.substr(1);
  if(log) c.log('1b. path:' + path);
  if(path.substr(-1, 1) == "z") path = path.substr(0, path.length - 1);
  if(log) c.log('2. path:' + path);

  var regExpSpliters = /c|C|s|S|l|L|,/g;

  var spliters = path.match(regExpSpliters);

  if(log) c.log("spliters:", spliters);
  if(log) c.log("spliters.length:", spliters.length);

  var textPoints = path.split(regExpSpliters);

  if(log) c.log("textPoints:", textPoints);
  if(log) c.log("textPoints.length:", textPoints.length);

  var polygon = new Polygon();

  var absolute = true;
  var initial;
  var p0;
  var p;
  var previous;
  var prePrevious;
  var bI;
  var spliter = ',';

  var nP = 0;

  for(var i = 0; textPoints[i] != null; i += 2) {
    initial = (nP % 3 == 0);
    p = absolute ? new Point(Number(textPoints[i]), Number(textPoints[i + 1])) : new Point(Number(textPoints[i]) + p0.x, Number(textPoints[i + 1]) + p0.y);
    if(log) c.log(i, 'p, absolute, nP, initial, spliter >', p, absolute, nP, initial, spliter);
    if(initial) {
      p0 = p;
    }

    if(spliter == "s") {
      previous = polygon[polygon.length - 1];
      prePrevious = polygon[polygon.length - 2];
      if(log) c.log('s');
      if(log) c.log('previous:', previous);
      if(log) c.log('prePrevious:', prePrevious);
      if(log) c.log('new point:', previous.add(previous.subtract(prePrevious)));
      polygon.push(previous.add(previous.subtract(prePrevious)));
      nP++;
    } else if(spliter == "S") {

    } else if(spliter == "l") {
      previous = polygon[polygon.length - 1];
      polygon.push(previous);
      polygon.push(p);
      nP += 2;
    } else if(spliter == "L") {

    }

    polygon.push(p);

    spliter = spliters[i + 1];

    nP++;
    absolute = (spliter == "C" || spliter == "S" || spliter == "L") || (spliter == "," && absolute);
    //absolute = (spliter=="C") || (spliter=="," && absolute);
  }


  return polygon;

  /////////////////////




  var N = (textPoints.length - 2) / 6;

  for(var i = 0; i < N; i++) {
    bI = i * 6;
    if(absolute) {
      p0 = new Point(Number(textPoints[bI]), Number(textPoints[bI + 1]));
    } else {
      p0 = new Point(Number(textPoints[bI]) + p0.x, Number(textPoints[bI + 1]) + p0.y);
    }
    polygon.push(p0);

    absolute = spliters[bI + 1] == 'C';
    //c.log('>',spliters[bI+1]);

    if(absolute) {
      polygon.push(new Point(Number(textPoints[bI + 2]), Number(textPoints[bI + 3])));
      polygon.push(new Point(Number(textPoints[bI + 4]), Number(textPoints[bI + 5])));
    } else {
      polygon.push(new Point(Number(textPoints[bI + 2]) + p0.x, Number(textPoints[bI + 3]) + p0.y));
      polygon.push(new Point(Number(textPoints[bI + 4]) + p0.x, Number(textPoints[bI + 5]) + p0.y));
    }
  }

  bI = i * 6;

  //c.log('last absolute:', absolute);

  if(absolute) {
    polygon.push(new Point(Number(textPoints[bI]), Number(textPoints[bI + 1])));
  } else {
    polygon.push(new Point(Number(textPoints[bI]) + p0.x, Number(textPoints[bI + 1]) + p0.y));
  }

  //c.log(polygon);

  return polygon;
};