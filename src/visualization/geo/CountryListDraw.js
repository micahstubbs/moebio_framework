import Rectangle from "src/dataTypes/geometry/Rectangle";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import { TwoPi } from "src/Global";


function CountryListDraw() {}
export default CountryListDraw;


CountryListDraw.drawCountriesAsCircles = function(context, countryList, radiusList, frame, geoFrame, colors) {
  geoFrame = geoFrame == null ? new Rectangle(-180, -90, 360, 180) : geoFrame;
  colors = colors == null ? ColorListGenerators.createColorListWithSingleColor(countryList.length, 'rgba(100,100,100,0.6)') : colors;

  var dX = frame.width / geoFrame.width;
  var dY = frame.height / geoFrame.height;

  var country;

  for(var i = 0; countryList[i] != null; i++) {
    if(radiusList[i] < 0.5) continue;

    country = countryList[i];

    context.fillStyle = colors[i];
    context.beginPath();
    context.arc(frame.x + dX * (country.geoCenter.x - geoFrame.x), frame.getBottom() - dY * (country.geoCenter.y - geoFrame.y), radiusList[i], 0, TwoPi);
    context.fill();
  }
};

CountryListDraw.drawCountriesPolygons = function(context, countryList, frame, geoFrame, colors, lineWidth, lineColor) {
  geoFrame = geoFrame == null ? new Rectangle(-180, -90, 360, 180) : geoFrame;
  colors = colors == null ? ColorListGenerators.createColorListWithSingleColor(countryList.length, 'rgba(100,100,100,0.6)') : colors;

  var dX = frame.width / geoFrame.width;
  var dY = frame.height / geoFrame.height;

  var country;
  var polygonList;
  var polygon;

  if(lineWidth != null) context.lineWidth = lineWidth;
  if(lineColor != null) context.strokeStyle = lineColor;

  for(var i = 0; countryList[i] != null; i++) {
    country = countryList[i];

    polygonList = country.polygonList;

    context.fillStyle = colors[i];

    for(var j = 0; polygonList[j] != null; j++) {
      polygon = polygonList[j];
      context.beginPath();
      context.moveTo(frame.x + dX * (polygon[0].x - geoFrame.x), frame.getBottom() - dY * (polygon[0].y - geoFrame.y));
      for(var k = 1; polygon[k] != null; k++) {
        context.lineTo(frame.x + dX * (polygon[k].x - geoFrame.x), frame.getBottom() - dY * (polygon[k].y - geoFrame.y));
      }
      context.fill();
      if(lineWidth != null) context.stroke();
    }
  }
};