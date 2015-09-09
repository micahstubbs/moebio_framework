import { version } from "src/Version";
import MD5 from "src/tools/utils/strings/MD5";
import NetworkEncodings from "src/operators/structures/NetworkEncodings";
import { typeOf } from "src/tools/utils/code/ClassUtils";

//data models info
export var dataModelsInfo = [
  {
    type:"Null",
    short:"Ø",
    category:"object",
    level:"0",
    write:"true",
    inherits:null,
    color:"#ffffff"
  },
  {
    type:"Object",
    short:"{}",
    category:"object",
    level:"0",
    write:"true",
    inherits:null,
    to:"String",
    color:"#C0BFBF"
  },
  {
    type:"Function",
    short:"F",
    category:"object",
    level:"0",
    inherits:null,
    color:"#C0BFBF"
  },  {
    type:"Boolean",
    short:"b",
    category:"boolean",
    level:"0",
    write:"true",
    inherits:null,
    to:"Number",
    color:"#4F60AB"
  },
  {
    type:"Number",
    short:"#",
    category:"number",
    level:"0",
    write:"true",
    inherits:null,
    to:"String",
    color:"#5DA1D8"
  },
  {
    type:"Interval",
    short:"##",
    category:"number",
    level:"0.5",
    write:"true",
    inherits:null,
    to:"Point",
    contains:"Number",
    color:"#386080"
  },
  {
    type:"Array",
    short:"[]",
    category:"object",
    level:"1",
    inherits:null,
    to:"List",
    contains:"Object,Null",
    color:"#80807F"
  },
  {
    type:"List",
    short:"L",
    category:"object",
    level:"1",
    inherits:"Array",
    contains:"Object",
    comments:"A List is an Array that doesn't contain nulls, and with enhanced functionalities",
    color:"#80807F"
  },
  {
    type:"Table",
    short:"T",
    category:"object",
    level:"2",
    inherits:"List",
    contains:"List",
    comments:"A Table is a List of Lists",
    color:"#80807F"
  },
  {
    type:"BooleanList",
    short:"bL",
    category:"boolean",
    level:"1",
    inherits:"List",
    to:"NumberList",
    contains:"Boolean",
    color:"#3A4780"
  },
  {
    type:"NumberList",
    short:"#L",
    category:"number",
    level:"1",
    write:"true",
    inherits:"List",
    to:"StringList",
    contains:"Number",
    color:"#386080"
  },
  {
    type:"NumberTable",
    short:"#T",
    category:"number",
    level:"2",
    write:"true",
    inherits:"Table",
    to:"Network",
    contains:"NumberList",
    color:"#386080"
  },
  {
    type:"String",
    short:"s",
    category:"string",
    level:"0",
    write:"true",
    inherits:null,
    color:"#8BC63F"
  },
  {
    type:"StringList",
    short:"sL",
    category:"string",
    level:"1",
    write:"true",
    inherits:"List",
    contains:"String",
    color:"#5A8039"
  },
  {
    type:"StringTable",
    short:"sT",
    category:"string",
    level:"2",
    inherits:"Table",
    contains:"StringList",
    color:"#5A8039"
  },
  {
    type:"Date",
    short:"d",
    category:"date",
    level:"0.5",
    write:"true",
    inherits:null,
    to:"Number,String",
    color:"#7AC8A3"
  },
  {
    type:"DateInterval",
    short:"dd",
    category:"date",
    level:"0.75",
    inherits:null,
    to:"Interval",
    contains:"Date",
    color:"#218052"
  },
  {
    type:"DateList",
    short:"dL",
    category:"date",
    level:"1.5",
    inherits:"List",
    to:"NumberList,StringList",
    contains:"Date",
    color:"#218052"
  },
  {
    type:"Point",
    short:".",
    category:"geometry",
    level:"0.5",
    write:"true",
    inherits:null,
    to:"Interval",
    contains:"Number",
    color:"#9D59A4"
  },
  {
    type:"Rectangle",
    short:"t",
    category:"geometry",
    level:"0.5",
    inherits:null,
    to:"Polygon",
    contains:"Number",
    color:"#9D59A4"
  },
  {
    type:"Polygon",
    short:".L",
    category:"geometry",
    level:"1.5",
    inherits:"List",
    to:"NumberTable",
    contains:"Point",
    comments:"A Polygon is a List of Points",
    color:"#76297F"
  },
  {
    type:"RectangleList",
    short:"tL",
    category:"geometry",
    level:"1.5",
    inherits:null,
    to:"MultiPolygon",
    contains:"Rectangle",
    color:"#76297F"
  },
  {
    type:"MultiPolygon",
    short:".T",
    category:"geometry",
    level:"2.5",
    inherits:"Table",
    contains:"Polygon",
    comments:"A MultiPolygon is a List of Polygons",
    color:"#76297F"
  },
  {
    type:"Point3D",
    short:"3",
    category:"geometry",
    level:"0.5",
    write:"true",
    inherits:"Point",
    to:"NumberList",
    contains:"Number",
    color:"#9D59A4"
  },
  {
    type:"Polygon3D",
    short:"3L",
    category:"geometry",
    level:"1.5",
    inherits:"List",
    to:"NumberTable",
    contains:"Point3D",
    color:"#76297F"
  },
  {
    type:"MultiPolygon3D",
    short:"3T",
    category:"geometry",
    level:"2.5",
    inherits:"Table",
    contains:"Polygon3D",
    color:"#76297F"
  },
  {
    type:"Color",
    short:"c",
    category:"color",
    level:"0",
    inherits:null,
    to:"String",
    comments:"a Color is just a string that can be interpreted as color",
    color:"#EE4488"
  },
  {
    type:"ColorScale",
    short:"cS",
    category:"color",
    level:"0",
    write:"true",
    inherits:"Function",
    color:"#802046"
  },
  {
    type:"ColorList",
    short:"cL",
    category:"color",
    level:"1",
    write:"true",
    inherits:"List",
    to:"StringList",
    contains:"Color",
    color:"#802046"
  },
  {
    type:"Image",
    short:"i",
    category:"graphic",
    level:"0",
    inherits:null,
    color:"#802046"
  },
  {
    type:"ImageList",
    short:"iL",
    category:"graphic",
    level:"1",
    inherits:"List",
    contains:"Image",
    color:"#802046"
  },
  {
    type:"Node",
    short:"n",
    category:"structure",
    level:"0",
    inherits:null,
    color:"#FAA542"
  },
  {
    type:"Relation",
    short:"r",
    category:"structure",
    level:"0.5",
    inherits:"Node",
    contains:"Node",
    color:"#FAA542"
  },
  {
    type:"NodeList",
    short:"nL",
    category:"structure",
    level:"1",
    inherits:"List",
    contains:"Node",
    color:"#805522"
  },
  {
    type:"RelationList",
    short:"rL",
    category:"structure",
    level:"1.5",
    inherits:"NodeList",
    contains:"Relation",
    color:"#805522"
  },
  {
    type:"Network",
    short:"Nt",
    category:"structure",
    level:"2",
    inherits:null,
    to:"Table",
    contains:"NodeList,RelationList",
    color:"#805522"
  },
  {
    type:"Tree",
    short:"Tr",
    category:"structure",
    level:"2",
    inherits:"Network",
    to:"Table",
    contains:"NodeList,RelationList",
    color:"#805522"
  }
];

//global constants
export var TwoPi = 2*Math.PI;
export var HalfPi = 0.5*Math.PI;
export var radToGrad = 180/Math.PI;
export var gradToRad = Math.PI/180;

/**
 * @todo write docs
 */
Array.prototype.last = function(){
  return this[this.length-1];
};

window.addEventListener('load', function(){
  console.log('Moebio Framework v' + version);
}, false);


////structures local storage

/**
 * @todo write docs
 */
export function setStructureLocalStorageWithSeed(object, seed, comments){
  setStructureLocalStorage(object, MD5.hex_md5(seed), comments);
}

/**
 * Puts an object into HTML5 local storage. Note that when you 
 * store your object it will be wrapped in an object with the following 
 * structure. This structure can be retrieved later in addition to the base
 * object.
 *  {
 *    id: storage id
 *    type: type of object
 *    comments: user specified comments
 *    date: current time
 *    code: the serialized object
 *  }
 * 
 * @param {Object} object   the object to store
 * @param {String} id       the id to store it with
 * @param {String} comments extra comments to store along with the object.
 */
export function setStructureLocalStorage(object, id, comments){
  var type = typeOf(object);
  var code;

  switch(type){
    case 'string':
      code = object;
      break;
    case 'Network':
      code = NetworkEncodings.encodeGDF(object);
      break;
    default:
      type = 'object';
      code = JSON.stringify(object);
      break;
  }

  var storageObject = {
    id:id,
    type:type,
    comments:comments,
    date:new Date(),
    code:code
  };

  var storageString = JSON.stringify(storageObject);
  localStorage.setItem(id, storageString);
}

/**
 * @todo write docs
 */
export function getStructureLocalStorageFromSeed(seed, returnStorageObject){
  return getStructureLocalStorage(MD5.hex_md5(seed), returnStorageObject);
}

/**
 * Gets a item previously stored in localstorage. @see setStructureLocalStorage
 * You can choose either to retrieve the object that was stored of the wrapper
 * object created when it was stored.
 * 
 * @param  {String} id id of object to lookup
 * @param  {boolean} returnStorageObject return the wrapper object instead of the original value
 * @return {Object|null} returns the object (or wrapper) that was stored, or null if nothing is found with this id.
 */
export function getStructureLocalStorage(id, returnStorageObject){
  returnStorageObject = returnStorageObject||false;

  var item = localStorage.getItem(id);

  if(item==null) return null;

  var storageObject;
  try{
    storageObject = JSON.parse(item);
  } catch(err){
    return null;
  }

  if(storageObject.type==null && storageObject.code==null) return null;

  var type = storageObject.type;
  var code = storageObject.code;
  var object;

  switch(type){
    case 'string':
      object = code;
      break;
    case 'Network':
      object = NetworkEncodings.decodeGDF(code);
      break;
    case 'object':
      object = JSON.parse(code);
      break;
  }

  if(returnStorageObject){
    storageObject.object = object;
    storageObject.size = storageObject.code.length;
    storageObject.date = new Date(storageObject.date);

    return storageObject;
  }

  return object;
}

