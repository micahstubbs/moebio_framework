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
import DateListConversions from "src/operators/dates/DateListConversions";
import DateOperators from "src/operators/dates/DateOperators";
export { DateListOperators, DateListConversions, DateOperators };

// operators/geo
import CountryListOperators from "src/operators/geo/CountryListOperators";
import CountryOperators from "src/operators/geo/CountryOperators";
import GeoOperators from "src/operators/geo/GeoOperators";
export { CountryListOperators, CountryOperators, GeoOperators };

// operators/geometry
import GeometryConversions from "src/operators/geometry/GeometryConversions";
import GeometryOperators from "src/operators/geometry/GeometryOperators";
import PointOperators from "src/operators/geometry/PointOperators";
import PolygonGenerators from "src/operators/geometry/PolygonGenerators";
import PolygonListEncodings from "src/operators/geometry/PolygonListEncodings";
import PolygonListOperators from "src/operators/geometry/PolygonListOperators";
import PolygonOperators from "src/operators/geometry/PolygonOperators";
import RectangleOperators from "src/operators/geometry/RectangleOperators";
export { GeometryConversions, GeometryOperators, PointOperators, PolygonGenerators,
  PolygonOperators, PolygonListEncodings, PolygonListOperators, RectangleOperators };

// operators/graphic
// import ColorConversions from "src/operators/graphic/ColorConversions";
import ColorGenerators from "src/operators/graphic/ColorGenerators";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import ColorListOperators from "src/operators/graphic/ColorListOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorScaleGenerators from "src/operators/graphic/ColorScaleGenerators";
// export ColorConversions TODO: Deal with ambiguity between this and ColorOperators
export { ColorGenerators, ColorListGenerators, ColorListOperators,
  ColorOperators, ColorScales, ColorScaleGenerators };

// operators/lists
import ListGenerators from "src/operators/lists/ListGenerators";
import ListOperators from "src/operators/lists/ListOperators";
import ListConversions from "src/operators/lists/ListConversions";
import TableConversions from "src/operators/lists/TableConversions";
import TableEncodings from "src/operators/lists/TableEncodings";
import TableGenerators from "src/operators/lists/TableGenerators";
import TableOperators from "src/operators/lists/TableOperators";
export { ListGenerators, ListOperators, ListConversions, TableConversions, TableEncodings,
  TableGenerators, TableOperators };


// operators/numeric
import IntervalListOperators from "src/operators/numeric/interval/IntervalListOperators";
import IntervalTableOperators from "src/operators/numeric/interval/IntervalTableOperators";
import MatrixGenerators from "src/operators/numeric/MatrixGenerators";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import NumberListConversions from "src/operators/numeric/numberList/NumberListConversions";
import NumberOperators from "src/operators/numeric/NumberOperators";
import NumberTableConversions from "src/operators/numeric/numberTable/NumberTableConversions";
import NumberTableFlowOperators from "src/operators/numeric/numberTable/NumberTableFlowOperators";
import NumberTableOperators from "src/operators/numeric/numberTable/NumberTableOperators";
export { IntervalListOperators, NumberListConversions, IntervalTableOperators, MatrixGenerators, NumberListGenerators,
  NumberListOperators, NumberOperators, NumberTableConversions, NumberTableFlowOperators,
  NumberTableOperators };

// operators/objects
import ObjectOperators from "src/operators/objects/ObjectOperators";
import ObjectConversions from "src/operators/objects/ObjectConversions";
export { ObjectOperators, ObjectConversions };

// operators/strings
import StringConversions from "src/operators/strings/StringConversions";
import StringListOperators from "src/operators/strings/StringListOperators";
import StringListConversions from "src/operators/strings/StringListConversions";
import StringOperators from "src/operators/strings/StringOperators";
export { StringConversions, StringListOperators, StringListConversions, StringOperators };

// operators/structures
import NetworkConversions from "src/operators/structures/NetworkConversions";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import NetworkGenerators from "src/operators/structures/NetworkGenerators";
import NetworkOperators from "src/operators/structures/NetworkOperators";
import TreeConversions from "src/operators/structures/TreeConversions";
import TreeEncodings from "src/operators/structures/TreeEncodings";
export { NetworkConversions, NetworkEncodings, NetworkGenerators, NetworkOperators,
  TreeConversions, TreeEncodings };

// tools/graphic
import Draw from "src/tools/graphic/Draw";
import DrawSimpleVis from "src/tools/graphic/DrawSimpleVis";
import DrawTexts from "src/tools/graphic/DrawTexts";
import DrawTextsAdvanced from "src/tools/graphic/DrawTextsAdvanced";

export { Draw, DrawSimpleVis, DrawTexts, DrawTextsAdvanced };

import Graphics from "src/tools/graphic/Graphics";
export { Graphics };

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
import ConsoleTools from "src/tools/utils/strings/ConsoleTools";
import FastHtml from "src/tools/utils/strings/FastHtml";
import JSONUtils from "src/tools/utils/strings/JSONUtils";
import MD5 from "src/tools/utils/strings/MD5";
import StringUtils from "src/tools/utils/strings/StringUtils";
import Navigator from "src/tools/utils/system/Navigator";
export { ConsoleTools, FastHtml, JSONUtils, MD5, StringUtils, Navigator };

import { typeOf, instantiate, getShortNameFromDataModelType, getColorFromDataModelType, getLightColorFromDataModelType, getTextFromObject, instantiateWithSameType, isArray,
  evalJavaScriptFunction, argumentsToArray } from "src/tools/utils/code/ClassUtils";
export { typeOf, instantiate, getShortNameFromDataModelType, getColorFromDataModelType, getLightColorFromDataModelType, getTextFromObject, instantiateWithSameType, isArray,
  evalJavaScriptFunction, argumentsToArray };

// tools/physics
import Forces from "src/tools/physics/Forces";
export { Forces };

// tools/threeD
import Engine3D from "src/tools/threeD/Engine3D";
export { Engine3D };

// visualization/geo
import CountryListDraw from "src/visualization/geo/CountryListDraw";
export { CountryListDraw };

// visualization/geometry
import CirclesVisOperators from "src/visualization/geometry/CirclesVisOperators";
export { CirclesVisOperators };

// visualization/graphic
import ColorsDraw from "src/visualization/graphic/ColorsDraw";
export { ColorsDraw };

// visualization/lists
import ListDraw from "src/visualization/lists/ListDraw";
export { ListDraw };

// visualization/numeric
import IntervalTableDraw from "src/visualization/numeric/IntervalTableDraw";
import NumberTableDraw from "src/visualization/numeric/NumberTableDraw";
import NumberListDraw from "src/visualization/numeric/NumberListDraw";
export { IntervalTableDraw, NumberTableDraw, NumberListDraw};

// visualization/objects
import ObjectDraw from "src/visualization/objects/ObjectDraw";
import StringDraw from "src/visualization/strings/StringDraw";
export { ObjectDraw, StringDraw};

// visualization/strings
import StringListDraw from "src/visualization/strings/StringListDraw";
import StringListVisOperators from "src/visualization/strings/StringListVisOperators";
export { StringListDraw, StringListVisOperators};

// visualization/structures
import NetworkDraw from "src/visualization/structures/NetworkDraw";
import TreeDraw from "src/visualization/structures/TreeDraw";
export { NetworkDraw, TreeDraw };


// Global.js
// Functions
import { 
  setStructureLocalStorage,
  getStructureLocalStorageFromSeed,
  getStructureLocalStorage
} from "src/Global";
export {
  setStructureLocalStorage,
  getStructureLocalStorageFromSeed,
  getStructureLocalStorage
};
// Variables

import { dataModelsInfo, TwoPi, HalfPi, radToGrad, gradToRad } from "src/Global";
export { dataModelsInfo, TwoPi, HalfPi, radToGrad, gradToRad };
