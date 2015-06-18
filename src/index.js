// jshint unused:false

// This file re-exports everything that is in the public
// interface of the framework.

// dataStructures/
import DataModel from "src/dataStructures/DataModel";
export { DataModel };

// dataStructures/lists
import List from "src/dataStructures/lists/List";
import Table from "src/dataStructures/lists/Table";
export { List, Table };

// dataStructures/numeric
import Axis from "src/dataStructures/numeric/Axis";
import Axis2D from "src/dataStructures/numeric/Axis2D";
import Interval from "src/dataStructures/numeric/Interval";
import Matrix from "src/dataStructures/numeric/Matrix";
import NumberList from "src/dataStructures/numeric/NumberList";
import NumberTable from "src/dataStructures/numeric/NumberTable";
export { Axis, Axis2D, Interval, Matrix, NumberList, NumberTable };

// dataStructures/dates
import DateAxis from "src/dataStructures/dates/DateAxis";
import DateInterval from "src/dataStructures/dates/DateInterval";
import DateList from "src/dataStructures/dates/DateList";
export { DateAxis, DateInterval, DateList };

// dataStructures/geo
import Country from "src/dataStructures/geo/Country";
import CountryList from "src/dataStructures/geo/CountryList";
export { Country, CountryList };

// dataStructures/geometry
import Point from "src/dataStructures/geometry/Point";
import Point3D from "src/dataStructures/geometry/Point3D";
import Polygon from "src/dataStructures/geometry/Polygon";
import Polygon3D from "src/dataStructures/geometry/Polygon3D";
import Polygon3DList from "src/dataStructures/geometry/Polygon3DList";
import PolygonList from "src/dataStructures/geometry/PolygonList";
import Rectangle from "src/dataStructures/geometry/Rectangle";
import RectangleList from "src/dataStructures/geometry/RectangleList";
export { Point, Point3D, Polygon, Polygon3D, Polygon3DList, PolygonList, Rectangle, RectangleList };

// dataStructures/graphic
import ColorList from "src/dataStructures/graphic/ColorList";
import ColorScale from "src/dataStructures/graphic/ColorScale";
export { ColorList, ColorScale };

// dataStructures/spaces
import Space2D from "src/dataStructures/spaces/Space2D";
export { Space2D };

// dataStructures/Strings
import StringList from "src/dataStructures/strings/StringList";
export { StringList };

// dataStructures/structures
import Node from "src/dataStructures/structures/elements/Node";
import Relation from "src/dataStructures/structures/elements/Relation";
import NodeList from "src/dataStructures/structures/lists/NodeList";
import RelationList from "src/dataStructures/structures/lists/RelationList";
import Network from "src/dataStructures/structures/networks/Network";
import Tree from "src/dataStructures/structures/networks/Tree";
export { Node, Relation, NodeList, RelationList, Network, Tree };

// operators/dates
import DateListOperators from "src/operators/dates/DateListOperators";
import DateOperators from "src/operators/dates/DateOperators";
export { DateOperators, DateOperators };

// operators/geo
import CountryListOperators from "src/operators/geo/CountryListOperators";
import CountryOperators from "src/operators/geo/CountryOperators";
import GeoOperators from "src/operators/geo/GeoOperators";
export { CountryListOperators, CountryOperators, GeoOperators };

// operators/geometry
import GeometryConvertions from "src/operators/geometry/GeometryConvertions";
import GeometryOperators from "src/operators/geometry/GeometryOperators";
import PointOperators from "src/operators/geometry/PointOperators";
import PolygonGenerators from "src/operators/geometry/PolygonGenerators";
import PolygonListEncodings from "src/operators/geometry/PolygonListEncodings";
import PolygonListOperators from "src/operators/geometry/PolygonListOperators";
import PolygonOperators from "src/operators/geometry/PolygonOperators";
import RectangleOperators from "src/operators/geometry/RectangleOperators";
export { GeometryConvertions, GeometryOperators, PointOperators, PolygonGenerators,
  PolygonOperators, PolygonListEncodings, PolygonListOperators, RectangleOperators };

// operators/graphic
// import ColorConvertions from "src/operators/graphic/ColorConvertions";
import ColorGenerators from "src/operators/graphic/ColorGenerators";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import ColorListOperators from "src/operators/graphic/ColorListOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorScaleGenerators from "src/operators/graphic/ColorScaleGenerators";
// export ColorConvertions TODO: Deal with ambiguity between this and ColorOperators
export { ColorGenerators, ColorListGenerators, ColorListOperators,
  ColorOperators, ColorScales, ColorScaleGenerators };

// operators/lists
import ListGenerators from "src/operators/lists/ListGenerators";
import ListOperators from "src/operators/lists/ListOperators";
import TableConversions from "src/operators/lists/TableConversions";
import TableEncodings from "src/operators/lists/TableEncodings";
import TableGenerators from "src/operators/lists/TableGenerators";
import TableOperators from "src/operators/lists/TableOperators";
export { ListGenerators, ListOperators, TableConversions, TableEncodings,
  TableGenerators, TableOperators };


// operators/numeric
import IntervalListOperators from "src/operators/numeric/interval/IntervalListOperators";
import IntervalTableOperators from "src/operators/numeric/interval/IntervalTableOperators";
import MatrixGenerators from "src/operators/numeric/MatrixGenerators";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import NumberTableConversions from "src/operators/numeric/numberTable/NumberTableConversions";
import NumberTableFlowOperators from "src/operators/numeric/numberTable/NumberTableFlowOperators";
import NumberTableOperators from "src/operators/numeric/numberTable/NumberTableOperators";
export { IntervalListOperators, IntervalTableOperators, MatrixGenerators, NumberListGenerators,
  NumberListOperators, NumberOperators, NumberTableConversions, NumberTableFlowOperators,
  NumberTableOperators };

// operators/objects
import ObjectOperators from "src/operators/objects/ObjectOperators";
import ObjectConversions from "src/operators/objects/ObjectConversions";
export { ObjectOperators, ObjectConversions };

// operators/strings
import StringConversions from "src/operators/strings/StringConversions";
import StringListOperators from "src/operators/strings/StringListOperators";
import StringOperators from "src/operators/strings/StringOperators";
export { StringConversions, StringListOperators, StringOperators };

// operators/structures
import NetworkConvertions from "src/operators/structures/NetworkConvertions";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import NetworkGenerators from "src/operators/structures/NetworkGenerators";
import NetworkOperators from "src/operators/structures/NetworkOperators";
import TreeConvertions from "src/operators/structures/TreeConvertions";
import TreeEncodings from "src/operators/structures/TreeEncodings";
export { NetworkConvertions, NetworkEncodings, NetworkGenerators, NetworkOperators,
  TreeConvertions, TreeEncodings };

// tools/graphic
import CanvasAndContext from "src/tools/graphic/CanvasAndContext";
import Draw from "src/tools/graphic/Draw";
import DrawSimpleVis from "src/tools/graphic/DrawSimpleVis";
import DrawTexts from "src/tools/graphic/DrawTexts";
import DrawTextsAdvanced from "src/tools/graphic/DrawTextsAdvanced";
export { CanvasAndContext, Draw, DrawSimpleVis, DrawTexts, DrawTextsAdvanced };

import {
  fRect, sRect, fsRect, fCircle, sCircle, fsCircle, fEllipse,
  sEllipse, fsEllipse, line, bezier, fLines, sLines, fsLines, fsLinesM,
  fPolygon, sPolygon, fsPolygon, fEqTriangle, sEqTriangle, fsEqTriangle,
  fRectM, sRectM, fsRectM, fCircleM, sCircleM, fsCircleM, lineM, bezierM,
  drawImage, fitImage, setFill, setStroke, setLW, clipCircle, clipRectangle,
  restore, fText, sText, fsText, fTextRotated, fTextM, fsTextM,
  fTextRotatedM, fTextW, setText, getTextW, getPixelData, getPixelColor,
  getPixelColorRGBA, captureCanvas, setCursor, getMilliseconds
} from "src/tools/graphic/SimpleGraphics";

export {
  fRect, sRect, fsRect, fCircle, sCircle, fsCircle, fEllipse,
  sEllipse, fsEllipse, line, bezier, fLines, sLines, fsLines, fsLinesM,
  fPolygon, sPolygon, fsPolygon, fEqTriangle, sEqTriangle, fsEqTriangle,
  fRectM, sRectM, fsRectM, fCircleM, sCircleM, fsCircleM, lineM, bezierM,
  drawImage, fitImage, setFill, setStroke, setLW, clipCircle, clipRectangle,
  restore, fText, sText, fsText, fTextRotated, fTextM, fsTextM,
  fTextRotatedM, fTextW, setText, getTextW, getPixelData, getPixelColor,
  getPixelColorRGBA, captureCanvas, setCursor, getMilliseconds
};

// tools/interaction
import DragDetection from "src/tools/interaction/DragDetection";
import InputTextFieldHTML from "src/tools/interaction/InputTextFieldHTML";
import TextBox from "src/tools/interaction/TextBox";
import TextFieldHTML from "src/tools/interaction/TextFieldHTML";
export { DragDetection, InputTextFieldHTML, TextBox, TextFieldHTML };


// tools/loaders
import Loader from "src/tools/loaders/Loader";
import LoadEvent from "src/tools/loaders/LoadEvent";
import MultiLoader from "src/tools/loaders/MultiLoader";
export { Loader, LoadEvent, TextBox, MultiLoader };

// tools/utils
import Consoletools from "src/tools/utils/strings/Consoletools";
import FastHtml from "src/tools/utils/strings/FastHtml";
import JSONUtils from "src/tools/utils/strings/JSONUtils";
import MD5 from "src/tools/utils/strings/MD5";
import StringUtils from "src/tools/utils/strings/StringUtils";
import Navigator from "src/tools/utils/system/Navigator";
export { Consoletools, FastHtml, JSONUtils, MD5, StringUtils, Navigator };

import { typeOf, instantiate, getTextFromObject, instantiateWithSameType, isArray,
  evalJavaScriptFunction, argumentsToArray, TimeLogger } from "src/tools/utils/code/ClassUtils";
export { typeOf, instantiate, getTextFromObject, instantiateWithSameType, isArray,
  evalJavaScriptFunction, argumentsToArray, TimeLogger };

// tools/physics
import Forces from "src/tools/physics/Forces";
export { Forces };

// tools/threeD
import Engine3D from "src/tools/threeD/Engine3D";
export { Engine3D };

// import CountryListDraw from "src/visualization/geo/CountryListDraw";
// import CirclesVisOperators from "src/visualization/geometry/CirclesVisOperators";
// import ColorsDraw from "src/visualization/graphic/ColorsDraw";
// import ImageDraw from "src/visualization/graphic/ImageDraw";
// import ListDraw from "src/visualization/lists/ListDraw";
// import IntervalTableDraw from "src/visualization/numeric/IntervalTableDraw";
// import NumberTableDraw from "src/visualization/numeric/NumberTableDraw";
// import NumberListDraw from "src/visualization/numeric/NumberListDraw";
// import ObjectDraw from "src/visualization/objects/ObjectDraw";
// import StringDraw from "src/visualization/strings/StringDraw";
// import StringListDraw from "src/visualization/strings/StringListDraw";
// import StringListVisOperators from "src/visualization/strings/StringListVisOperators";
// import NetworkDraw from "src/visualization/structures/NetworkDraw";
// import TreeDraw from "src/visualization/structures/TreeDraw";

// // Globals

// import Global from "src/Global";



