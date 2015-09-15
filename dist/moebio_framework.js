(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('mo', ['exports'], factory) :
  factory((global.mo = {}));
}(this, function (exports) { 'use strict';

  DataModel.prototype = {};
  DataModel.prototype.constructor = DataModel;

  /**
   * @classdesc Basic DataType from which other types are derived.
   *
   * @description Creates a new DataModel.
   * @constructor
   * @category basics
   */
  function DataModel() {
  	// TODO. What is the intent in this line. I don't think its needed.
    Object.apply(this);
    this.type = "DataModel";
  }
  /**
   * @todo write docs
   */
  DataModel.prototype.destroy = function() {
  	// TODO. Why is this being done? It is in a few
  	// places in the codebase. Also this.name isn't
  	// defined here.
    delete this.type;
    delete this.name;
  };

  /**
   * @todo write docs
   */
  DataModel.prototype.setType = function(type) {
    this.type = type;
  };

  /**
   * @todo write docs
   */
  DataModel.prototype.getType = function() {
    return this.type;
  };

  /**
   * @todo write docs
   */
  DataModel.prototype.toString = function() {

  };

  LoadEvent.prototype = {};
  LoadEvent.prototype.constructor = LoadEvent;

  /**
   * LoadEvent
   * @constructor
   * @category misc
   */
  function LoadEvent() {
    Object.apply(this);
    this.result = null;
    this.errorType = 0;
    this.errorMessage = "";
    this.url = '';
  }

  function Loader() {}
  Loader.proxy = ""; //TODO:install proxy created by Mig at moebio.com
  Loader.cacheActive = false; //TODO: fix!
  Loader.associativeByUrls = {};
  Loader.REPORT_LOADING = false;
  Loader.n_loading = 0;
  Loader.LOCAL_STORAGE_ENABLED = false;

  Loader.PHPurl = "http://intuitionanalytics.com/tests/proxy.php?url=";


  /**
   * loads string data from server. The defined Loader.proxy will be used.
   * @param {String} url the URL of the file to be loaded
   * @param {Function} onLoadData a function that will be called when complete. The function must receive a LoadEvent
   * @param {callee} the Object containing the onLoadData function to be called
   * @para, {Object} optional parameter that will be stored in the LoadEvent instance
   */
  Loader.loadData = function(url, onLoadData, callee, param, send_object_json, withCredentials) {
    if(Loader.REPORT_LOADING) console.log('load data:', url);
    Loader.n_loading++;

    if(Loader.LOCAL_STORAGE_ENABLED) {
      // TODO track down LocalStorage. localStorage is a thing though (lowercase l);
      var result = localStorage.getItem(url);
      if(result) {
        var e = new LoadEvent();
        e.url = url;
        e.param = param;
        e.result = result;

        onLoadData.call(target, e);
      }
    }



    if(Loader.REPORT_LOADING) console.log("Loader.loadData | url:", url);

    var useProxy = String(url).substr(0, 4) == "http";

    var req = new XMLHttpRequest();

    var target = callee ? callee : arguments.callee;
    var onLoadComplete = function() {
      if(Loader.REPORT_LOADING) console.log('Loader.loadData | onLoadComplete'); //, req.responseText:', req.responseText);
      if(req.readyState == 4) {
        Loader.n_loading--;

        var e = new LoadEvent();
        e.url = url;
        e.param = param;
        //if (req.status == 200) { //MIG
        if(req.status == 200 || (req.status === 0 && req.responseText !== null)) {
          e.result = req.responseText;
          onLoadData.call(target, e);
        } else {
          if(Loader.REPORT_LOADING) console.log("[!] There was a problem retrieving the data [" + req.status + "]:\n" + req.statusText);
          e.errorType = req.status;
          e.errorMessage = "[!] There was a problem retrieving the data [" + req.status + "]:" + req.statusText;
          onLoadData.call(target, e);
        }
      }
    };

    // branch for native XMLHttpRequest object
    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
      try {
        req = new XMLHttpRequest();
      } catch(e1) {
        req = false;
      }
      // branch for IE/Windows ActiveX version
    } else if(window.ActiveXObject) {
      try {
        req = new window.ActiveXObject("Msxml2.XMLHTTP.6.0");
      } catch(e2) {
        try {
          req = new window.ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch(e3) {
          try {
            req = new window.ActiveXObject("Msxml2.XMLHTTP");
          } catch(e4) {
            try {
              req = new window.ActiveXObject("Microsoft.XMLHTTP");
            } catch(e5) {
              req = false;
            }
          }
        }
      }
    }
    if(req) {
      if(withCredentials === true ){
          req.withCredentials = true;
      }
      req.onreadystatechange = onLoadComplete; //processReqChange;
      if(useProxy) {
        req.open("GET", Loader.proxy + url, true);
      } else {
        req.open("GET", url, true);
      }

      send_object_json = send_object_json || "";
      req.send(send_object_json);
    }
  };


  Loader.loadImage = function(url, onComplete, callee, param) {
    Loader.n_loading++;

    if(Loader.REPORT_LOADING) console.log("Loader.loadImage | url:", url);

    var target = callee ? callee : arguments.callee;
    var img = document.createElement('img');

    if(this.cacheActive) {
      if(this.associativeByUrls[url] != null) {
        Loader.n_loading--;
        //console.log('=====>>>>+==>>>+====>>=====>>>+==>> in cache:', url);
        var e = new LoadEvent();
        e.result = this.associativeByUrls[url];
        e.url = url;
        e.param = param;
        onComplete.call(target, e);
      } else {
        var cache = true;
        var associative = this.associativeByUrls;
      }
    }

    img.onload = function() {
      Loader.n_loading--;
      var e = new LoadEvent();
      e.result = img;
      e.url = url;
      e.param = param;
      if(cache) associative[url] = img;
      onComplete.call(target, e);
    };

    img.onerror = function() {
      Loader.n_loading--;
      var e = new LoadEvent();
      e.result = null;
      e.errorType = 1; //TODO: set an error type!
      e.errorMessage = "There was a problem retrieving the image [" + img.src + "]:";
      e.url = url;
      e.param = param;
      onComplete.call(target, e);
    };

    img.src = Loader.proxy + url;
  };



  // Loader.loadJSON = function(url, onLoadComplete) {
  //   Loader.n_loading++;

  //   Loader.loadData(url, function(data) {
  //     Loader.n_loading--;
  //     onLoadComplete.call(arguments.callee, jQuery.parseJSON(data));
  //   });
  // };


  /**
  Loader.callIndex = 0;
  Loader.loadJSONP = function(url, onLoadComplete, callee) {
    Loader.n_loading++;

    Loader.callIndex = Loader.callIndex + 1;
    var index = Loader.callIndex;

    var newUrl = url + "&callback=JSONcallback" + index;
    //var newUrl=url+"?callback=JSONcallback"+index; //   <----  WFP suggestion

    var target = callee ? callee : arguments.callee;

    //console.log('Loader.loadJSONP, newUrl:', newUrl);

    $.ajax({
      url: newUrl,
      type: 'GET',
      data: {},
      dataType: 'jsonp',
      contentType: "application/json",
      jsonp: 'jsonp',
      jsonpCallback: 'JSONcallback' + index,
      success: function(data) {
        Loader.n_loading--;
        var e = new LoadEvent();
        e.result = data;
        onLoadComplete.call(target, e);
      },
      error: function(data) {
        Loader.n_loading--;
        console.log("Loader.loadJSONP | error, data:", data);

        var e = new LoadEvent();
        e.errorType = 1;
        onLoadComplete.call(target, e);
      }
    }); //.error(function(e){
    // console.log('---> (((error))) B');
    //
    // var e=new LoadEvent();
    // e.errorType=1;
    // onLoadComplete.call(target, e);
    // });
  };
  **/




  //FIX THESE METHODS:

  Loader.loadXML = function(url, onLoadData) {
    Loader.n_loading++;

    var req = new XMLHttpRequest();
    var onLoadComplete = onLoadData;

    if(Loader.REPORT_LOADING) console.log('loadXML, url:', url);

    // branch for native XMLHttpRequest object
    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
      try {
        req = new XMLHttpRequest();
      } catch(e) {
        req = false;
      }
      // branch for IE/Windows ActiveX version
    } else if(window.ActiveXObject) {
      try {
        req = new window.ActiveXObject("Msxml2.XMLHTTP");
      } catch(e) {
        try {
          req = new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch(e2) {
          req = false;
        }
      }
    }
    if(req) {
      req.onreadystatechange = processReqChange;
      req.open("GET", url, true);
      req.send("");
    }

    function processReqChange() {
      Loader.n_loading--;
      // only if req shows "loaded"
      if(req.readyState == 4) {
        // only if "OK"
        if(req.status == 200 || req.status === 0) {
          onLoadComplete(req.responseXML);

        } else {
          console.log("There was a problem retrieving the XML data:\n" +
            req.statusText);
        }
      }
    }
  };


  ///////////////PHP

  Loader.sendContentToVariableToPhp = function(url, varName, value, onLoadData, callee, param) {
    var data = varName + "=" + encodeURIComponent(value);
    Loader.sendDataToPhp(url, data, onLoadData, callee, param);
  };

  Loader.sendContentsToVariablesToPhp = function(url, varNames, values, onLoadData, callee, param) {
    var data = varNames[0] + "=" + encodeURIComponent(values[0]);
    for(var i = 1; varNames[i] != null; i++) {
      data += "&" + varNames[i] + "=" + encodeURIComponent(values[i]);
    }
    Loader.sendDataToPhp(url, data, onLoadData, callee, param);
  };

  Loader.sendDataToPhp = function(url, data, onLoadData, callee, param) {
    var req = new XMLHttpRequest();

    req.open("POST", url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(data);

    var target = callee ? callee : arguments.callee;

    var onLoadComplete = function() {
      if(Loader.REPORT_LOADING) console.log('Loader.loadData | onLoadComplete, req.responseText:', req.responseText);
      if(req.readyState == 4) {
        Loader.n_loading--;

        var e = new LoadEvent();
        e.url = url;
        e.param = param;

        if(req.status == 200 || (req.status === 0 && req.responseText != null)) {
          e.result = req.responseText;
          onLoadData.call(target, e);
        } else {
          if(Loader.REPORT_LOADING) console.log("[!] There was a problem retrieving the data [" + req.status + "]:\n" + req.statusText);
          e.errorType = req.status;
          e.errorMessage = "[!] There was a problem retrieving the data [" + req.status + "]:" + req.statusText;
          onLoadData.call(target, e);
        }
      }
    };

    req.onreadystatechange = onLoadComplete;
  };

  _Node.prototype = new DataModel();
  _Node.prototype.constructor = _Node;

  /**
   * @classdesc Represents a single node element in a Network. Can have both an id as well
   * as a name.
   *
   * @description Create a new Node.
   * @param {String} id ID of the Node
   * @param {String} name string (label) name to be assigned to node
   * @constructor
   * @category networks
   */
  function _Node(id, name) {
    this.id = id == null ? '' : id;
    this.name = name != null ? name : '';
    this.type = "Node";

    this.nodeType = null;

    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.nodeList = new NodeList();
    this.relationList = new RelationList();

    this.toNodeList = new NodeList();
    this.toRelationList = new RelationList();

    this.fromNodeList = new NodeList();
    this.fromRelationList = new RelationList();

    this.weight = 1;
    this.descentWeight = 1;

    //tree
    this.level = 0;
    this.parent = null;

    //physics:
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.ax = 0;
    this.ay = 0;
    this.az = 0;
  }
  /**
   * Removes all Relations and connected Nodes from
   * the current Node.
   */
  _Node.prototype.cleanRelations = function() {
    this.nodeList = new NodeList();
    this.relationList = new RelationList();

    this.toNodeList = new NodeList();
    this.toRelationList = new RelationList();

    this.fromNodeList = new NodeList();
    this.fromRelationList = new RelationList();
  };

  //TODO: complete with all properties
  _Node.prototype.destroy = function() {
    DataModel.prototype.destroy.call(this);
    delete this.id;
    delete this.name;
    delete this.nodeType;
    delete this.x;
    delete this.y;
    delete this.z;
    delete this.nodeList;
    delete this.relationList;
    delete this.toNodeList;
    delete this.toNodeList;
    delete this.fromNodeList;
    delete this.fromRelationList;
    delete this.parent;
    delete this.weight;
    delete this.descentWeight;
    delete this.level;
    delete this.vx;
    delete this.vy;
    delete this.vz;
    delete this.ax;
    delete this.ay;
    delete this.az;
  };

  /**
   * Returns the number of Relations connected to this Node.
   *
   * @return {Number} Number of Relations (edges) connecting to this Node instance.
   */
  _Node.prototype.getDegree = function() {
    return this.relationList.length;
  };

  //treeProperties:


  /**
   * Returns the parent Node of this Node if it is part of a {@link Tree}.
   *
   * @return {Node} Parent Node of this Node.
   */
  _Node.prototype.getParent = function() {
    return this.parent;
  };

  /**
   * Returns the leaves under a node in a Tree,
   *
   * <strong>Warning:</strong> If this Node is part of a Network that is not a tree, this method could run an infinite loop.
   * @return {NodeList} Leaf Nodes of this Node.
   * tags:
   */
  _Node.prototype.getLeaves = function() {
      var leaves = new NodeList();
      var addLeaves = function(node) {
        if(node.toNodeList.length === 0) {
          leaves.addNode(node);
          return;
        }
        node.toNodeList.forEach(addLeaves);
      };
      addLeaves(this);
      return leaves;
    };


  /**
   * Uses an image as a visual representation to this Node.
   *
   * @param {String} urlImage The URL of the image to load.
   */
  _Node.prototype.loadImage = function(urlImage) {
    Loader.loadImage(urlImage, function(e) {
      this.image = e.result;
    }, this);
  };


  /**
   * Makes a copy of this Node.
   *
   * @return {Node} New Node that is a copy of this Node.
   */
  _Node.prototype.clone = function() {
    var newNode = new _Node(this.id, this.name);

    newNode.x = this.x;
    newNode.y = this.y;
    newNode.z = this.z;

    newNode.nodeType = this.nodeType;

    newNode.weight = this.weight;
    newNode.descentWeight = this.descentWeight;

    return newNode;
  };

  /**
   * @classdesc Provides a set of tools that work with Colors.
   *
   * @namespace
   * @category colors
   */
  function ColorOperators() {}
  // TODO: create Color struture to be used instead of arrays [255, 100,0] ?

  /**
   * return a color between color0 and color1
   * 0 -> color0
   * 1 -> color1
   * @param {String} color0
   * @param {String} color1
   * @param value between 0 and 1 (to obtain color between color0 and color1)
   * @return {String} interpolated color
   *
   */
  ColorOperators.interpolateColors = function(color0, color1, value) {
    var resultArray = ColorOperators.interpolateColorsRGB(ColorOperators.colorStringToRGB(color0), ColorOperators.colorStringToRGB(color1), value);
    return ColorOperators.RGBtoHEX(resultArray[0], resultArray[1], resultArray[2]);
  };


  /**
   * return a color between color0 and color1
   * 0 -> color0
   * 1 -> color1
   * @param {Array} color0 RGB
   * @param {Array} color1 RGB
   * @param value between 0 and 1 (to obtain values between color0 and color1)
   * @return {Array} interpolated RGB color
   *
   */
  ColorOperators.interpolateColorsRGB = function(color0, color1, value) {
    var s = 1 - value;
    return [Math.floor(s * color0[0] + value * color1[0]), Math.floor(s * color0[1] + value * color1[1]), Math.floor(s * color0[2] + value * color1[2])];
  };

  /**
   * converts an hexadecimal color to RGB
   * @param {String} an hexadecimal color string
   * @return {Array} returns an RGB color Array
   *
   */
  ColorOperators.HEXtoRGB = function(hexColor) {
    return [parseInt(hexColor.substr(1, 2), 16), parseInt(hexColor.substr(3, 2), 16), parseInt(hexColor.substr(5, 2), 16)];
  };


  /**
   * Converts RGB values to a hexadecimal color string.
   * @param {Number} red R value.
   * @param {Number} green G value.
   * @param {Number} blue B value.
   * @return {String} hexadecimal representation of the colors.
   */
  ColorOperators.RGBtoHEX = function(red, green, blue) {
    return "#" + ColorOperators.toHex(red) + ColorOperators.toHex(green) + ColorOperators.toHex(blue);
  };

  /**
   * @todo write docs
   */
  ColorOperators.RGBArrayToString = function(array) {
    return 'rgb(' + array[0] + ',' + array[1] + ',' + array[2] + ')';
  };

  /**
   * @todo write docs
   */
  ColorOperators.colorStringToHEX = function(color_string) {
    var rgb = ColorOperators.colorStringToRGB(color_string);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };


  /**
   * @todo write docs
   */
  ColorOperators.numberToHex = function(number) {
    var hex = number.toString(16);
    while(hex.length < 2) hex = "0" + hex;
    return hex;
  };

  /**
   * @todo write docs
   */
  ColorOperators.uinttoRGB = function(color) {
    var rgbColor = new Array(color >> 16, (color >> 8) - ((color >> 16) << 8), color - ((color >> 8) << 8));
    return rgbColor;
  };

  /**
   * @todo write docs
   */
  ColorOperators.uinttoHEX = function(color) {
    var rgbColor = ColorOperators.uinttoRGB(color);
    var hexColor = ColorOperators.RGBToHEX(rgbColor[0], rgbColor[1], rgbColor[2]);
    return hexColor;
  };

  /**
   * @todo write docs
   */
  ColorOperators.RGBtouint = function(red, green, blue) {
    return Number(red) << 16 | Number(green) << 8 | Number(blue);
  };

  /**
   * @todo write docs
   */
  ColorOperators.HEXtouint = function(hexColor) {
    var colorArray = ColorOperators.HEXtoRGB(hexColor);
    var color = ColorOperators.RGBtouint(colorArray[0], colorArray[1], colorArray[2]);
    return color;
  };

  /**
   * @todo write docs
   */
  ColorOperators.grayByLevel = function(level) {
    level = Math.floor(level * 255);
    return 'rgb(' + level + ',' + level + ',' + level + ')';
  };

  /**
   * converts an hexadecimal color to HSV
   * @param {String} an hexadecimal color string
   * @return {Array} returns an HSV color Array
   *
   */
  ColorOperators.HEXtoHSV = function(hexColor) {
    var rgb = ColorOperators.HEXtoRGB(hexColor);
    return ColorOperators.RGBtoHSV(rgb[0], rgb[1], rgb[2]);
  };


  /**
   * @todo write docs
   */
  ColorOperators.HSVtoHEX = function(hue, saturation, value) {
    var rgb = ColorOperators.HSVtoRGB(hue, saturation, value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorOperators.HSLtoHEX = function(hue, saturation, light) {
    var rgb = ColorOperators.HSLtoRGB(hue, saturation, light);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * converts an RGB color to HSV
   * @param {Array} a RGB color array
   * @return {Array} returns a HSV color array
   * H in [0,360], S in [0,1], V in [0,1]
   */
  ColorOperators.RGBtoHSV = function(r, g, b) {
      var h;
      var s;
      var v;
      var min = Math.min(Math.min(r, g), b);
      var max = Math.max(Math.max(r, g), b);
      v = max / 255;
      var delta = max - min;
      if(delta === 0) return new Array(0, 0, r / 255);
      if(max !== 0) {
        s = delta / max;
      } else {
        s = 0;
        h = -1;
        return new Array(h, s, v);
      }
      if(r == max) {
        h = (g - b) / delta;
      } else if(g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h *= 60;
      if(h < 0) h += 360;
      return new Array(h, s, v);
    };

  /**
   * converts an HSV color to RGB
   * @param {Array} a HSV color array
   * @return {Array} returns a RGB color array
   */
  ColorOperators.HSVtoRGB = function(hue, saturation, value) {
    hue = hue ? hue : 0;
    saturation = saturation ? saturation : 0;
    value = value ? value : 0;
    var r;
    var g;
    var b;
    //
    var i;
    var f;
    var p;
    var q;
    var t;
    if(saturation === 0) {
      r = g = b = value;
      return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
    }
    hue /= 60;
    i = Math.floor(hue);
    f = hue - i;
    p = value * (1 - saturation);
    q = value * (1 - saturation * f);
    t = value * (1 - saturation * (1 - f));
    switch(i) {
      case 0:
        r = value;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = value;
        b = p;
        break;
      case 2:
        r = p;
        g = value;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = value;
        break;
      case 4:
        r = t;
        g = p;
        b = value;
        break;
      default:
        r = value;
        g = p;
        b = q;
        break;
    }
    return new Array(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
  };

  /**
   * Converts an HSL color value to RGB. Conversion formula
   * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
   * Assumes hue is contained in the interval [0,360) and saturation and l are contained in the set [0, 1]
   */
  ColorOperators.HSLtoRGB = function(hue, saturation, light) {
    var r, g, b;

    function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1 / 6) return p + (q - p) * 6 * t;
      if(t < 1 / 2) return q;
      if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if(saturation === 0) {
      r = g = b = light; // achromatic
    } else {
      var q = light < 0.5 ? light * (1 + saturation) : light + saturation - light * saturation;
      var p = 2 * light - q;
      r = hue2rgb(p, q, (hue / 360) + 1 / 3);
      g = hue2rgb(p, q, hue / 360);
      b = hue2rgb(p, q, (hue / 360) - 1 / 3);
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
  };

  /**
   * @todo write docs
   */
  ColorOperators.invertColorRGB = function(r, g, b) {
    return [255 - r, 255 - g, 255 - b];
  };

  /**
   * @todo write docs
   */
  ColorOperators.addAlpha = function(color, alpha) {
    //var rgb = color.substr(0,3)=='rgb'?ColorOperators.colorStringToRGB(color):ColorOperators.HEXtoRGB(color);
    var rgb = ColorOperators.colorStringToRGB(color);
    if(rgb == null) return 'black';
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha + ')';
  };

  /**
   * @todo write docs
   */
  ColorOperators.invertColor = function(color) {
    var rgb = ColorOperators.colorStringToRGB(color);
    rgb = ColorOperators.invertColorRGB(rgb[0], rgb[1], rgb[2]);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorOperators.toHex = function(number) {
    var hex = number.toString(16);
    while(hex.length < 2) hex = "0" + hex;
    return hex;
  };

  /**
   * @todo write docs
   */
  ColorOperators.getRandomColor = function() {
    return 'rgb(' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ',' + String(Math.floor(Math.random() * 256)) + ')';
  };


  /////// Universal matching



  /**
   * This method was partially obtained (and simplified) from a Class by Stoyan Stefanov: "A class to parse color values / @author Stoyan Stefanov <sstoo@gmail.com> / @link   http://www.phpied.com/rgb-color-parser-in-javascript/ / @license Use it if you like it"
   * @param {String} color_string color as a string (e.g. "red", "#0044ff", "rgb(130,20,100)")
   * @return {Array} rgb array
   * tags:
   */
  ColorOperators.colorStringToRGB = function(color_string) {
    //c.log('color_string:['+color_string+']');

    // strip any leading #
    if(color_string.charAt(0) == '#') { // remove # if any
      color_string = color_string.substr(1, 6);
      //c.log('-> color_string:['+color_string+']');
    }

    color_string = color_string.replace(/ /g, '');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
      aliceblue: 'f0f8ff',
      antiquewhite: 'faebd7',
      aqua: '00ffff',
      aquamarine: '7fffd4',
      azure: 'f0ffff',
      beige: 'f5f5dc',
      bisque: 'ffe4c4',
      black: '000000',
      blanchedalmond: 'ffebcd',
      blue: '0000ff',
      blueviolet: '8a2be2',
      brown: 'a52a2a',
      burlywood: 'deb887',
      cadetblue: '5f9ea0',
      chartreuse: '7fff00',
      chocolate: 'd2691e',
      coral: 'ff7f50',
      cornflowerblue: '6495ed',
      cornsilk: 'fff8dc',
      crimson: 'dc143c',
      cyan: '00ffff',
      darkblue: '00008b',
      darkcyan: '008b8b',
      darkgoldenrod: 'b8860b',
      darkgray: 'a9a9a9',
      darkgreen: '006400',
      darkkhaki: 'bdb76b',
      darkmagenta: '8b008b',
      darkolivegreen: '556b2f',
      darkorange: 'ff8c00',
      darkorchid: '9932cc',
      darkred: '8b0000',
      darksalmon: 'e9967a',
      darkseagreen: '8fbc8f',
      darkslateblue: '483d8b',
      darkslategray: '2f4f4f',
      darkturquoise: '00ced1',
      darkviolet: '9400d3',
      deeppink: 'ff1493',
      deepskyblue: '00bfff',
      dimgray: '696969',
      dodgerblue: '1e90ff',
      feldspar: 'd19275',
      firebrick: 'b22222',
      floralwhite: 'fffaf0',
      forestgreen: '228b22',
      fuchsia: 'ff00ff',
      gainsboro: 'dcdcdc',
      ghostwhite: 'f8f8ff',
      gold: 'ffd700',
      goldenrod: 'daa520',
      gray: '808080',
      green: '008000',
      greenyellow: 'adff2f',
      honeydew: 'f0fff0',
      hotpink: 'ff69b4',
      indianred: 'cd5c5c',
      indigo: '4b0082',
      ivory: 'fffff0',
      khaki: 'f0e68c',
      lavender: 'e6e6fa',
      lavenderblush: 'fff0f5',
      lawngreen: '7cfc00',
      lemonchiffon: 'fffacd',
      lightblue: 'add8e6',
      lightcoral: 'f08080',
      lightcyan: 'e0ffff',
      lightgoldenrodyellow: 'fafad2',
      lightgrey: 'd3d3d3',
      lightgreen: '90ee90',
      lightpink: 'ffb6c1',
      lightsalmon: 'ffa07a',
      lightseagreen: '20b2aa',
      lightskyblue: '87cefa',
      lightslateblue: '8470ff',
      lightslategray: '778899',
      lightsteelblue: 'b0c4de',
      lightyellow: 'ffffe0',
      lime: '00ff00',
      limegreen: '32cd32',
      linen: 'faf0e6',
      magenta: 'ff00ff',
      maroon: '800000',
      mediumaquamarine: '66cdaa',
      mediumblue: '0000cd',
      mediumorchid: 'ba55d3',
      mediumpurple: '9370d8',
      mediumseagreen: '3cb371',
      mediumslateblue: '7b68ee',
      mediumspringgreen: '00fa9a',
      mediumturquoise: '48d1cc',
      mediumvioletred: 'c71585',
      midnightblue: '191970',
      mintcream: 'f5fffa',
      mistyrose: 'ffe4e1',
      moccasin: 'ffe4b5',
      navajowhite: 'ffdead',
      navy: '000080',
      oldlace: 'fdf5e6',
      olive: '808000',
      olivedrab: '6b8e23',
      orange: 'ffa500',
      orangered: 'ff4500',
      orchid: 'da70d6',
      palegoldenrod: 'eee8aa',
      palegreen: '98fb98',
      paleturquoise: 'afeeee',
      palevioletred: 'd87093',
      papayawhip: 'ffefd5',
      peachpuff: 'ffdab9',
      peru: 'cd853f',
      pink: 'ffc0cb',
      plum: 'dda0dd',
      powderblue: 'b0e0e6',
      purple: '800080',
      red: 'ff0000',
      rosybrown: 'bc8f8f',
      royalblue: '4169e1',
      saddlebrown: '8b4513',
      salmon: 'fa8072',
      sandybrown: 'f4a460',
      seagreen: '2e8b57',
      seashell: 'fff5ee',
      sienna: 'a0522d',
      silver: 'c0c0c0',
      skyblue: '87ceeb',
      slateblue: '6a5acd',
      slategray: '708090',
      snow: 'fffafa',
      springgreen: '00ff7f',
      steelblue: '4682b4',
      tan: 'd2b48c',
      teal: '008080',
      thistle: 'd8bfd8',
      tomato: 'ff6347',
      turquoise: '40e0d0',
      violet: 'ee82ee',
      violetred: 'd02090',
      wheat: 'f5deb3',
      white: 'ffffff',
      whitesmoke: 'f5f5f5',
      yellow: 'ffff00',
      yellowgreen: '9acd32'
    };

    if(simple_colors[color_string] != null) color_string = simple_colors[color_string];


    // array of color definition objects
    var color_defs = [
    {
      re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
      process: function(bits) {
        return [
          parseInt(bits[1]),
          parseInt(bits[2]),
          parseInt(bits[3])
        ];
      }
    },
    {
      re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),[\.0123456789]+\)$/,
      //example: ['rgb(123, 234, 45)', 'rgb(255,234,245)', 'rgba(200,100,120,0.3)'],
      process: function(bits) {
        return [
          parseInt(bits[1]),
          parseInt(bits[2]),
          parseInt(bits[3])
        ];
      }
    },
    {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      //example: ['#00ff00', '336699'],
      process: function(bits) {
        return [
          parseInt(bits[1], 16),
          parseInt(bits[2], 16),
          parseInt(bits[3], 16)
        ];
      }
    },
    {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      //example: ['#fb0', 'f0f'],
      process: function(bits) {
        return [
          parseInt(bits[1] + bits[1], 16),
          parseInt(bits[2] + bits[2], 16),
          parseInt(bits[3] + bits[3], 16)
        ];
      }
    }];

    // search through the definitions to find a match
    for(var i = 0; i < color_defs.length; i++) {
      var re = color_defs[i].re;
      var processor = color_defs[i].process;
      var bits = re.exec(color_string);
      if(bits) {
        return processor(bits);
      }

    }

    return null;
  };

  List.prototype = new DataModel();
  List.prototype.constructor = List;


   /**
    * @classdesc List is an Array with a type property.
    * Lists have a number of methods to assist with working with
    * them. There are also a number of helper functions in associated namespaces.
    *
    * Additional functions that work on List can be found in:
    * <ul>
    *  <li>Operators:   {@link ListOperators}</li>
    *  <li>Conversions: {@link ListConversions}</li>
    *  <li>Generators: {@link ListGenerators}</li>
    * </ul>
    *
    * @description Creates a new List.
    * @param {Number|String|Object} arguments Comma separated values to add to List
    * @constructor
    * @category basics
    */
  function List() {
    DataModel.apply(this);
    var array = [];
    var i;
    var nArguments = arguments.length;
    for(i = 0; i < nArguments; i++) {
      array.push(arguments[i]);
    }
    array = List.fromArray(array);
    //
    return array;
  }
  /**
   * Creates a new List from a raw array of values
   *
   * @param {Number[]|String[]|Object[]} array Array of values.
   * @return {List} New List.
   */
  List.fromArray = function(array) {
    //TODO: clear some of these method declarations
    array.type = "List";
    array.name = array.name || "";

    array.setType = List.prototype.setType;
    array.setArray = List.prototype.setArray;
    array._constructor = List;

    array.getImproved = List.prototype.getImproved;
    array.isEquivalent = List.prototype.isEquivalent;
    array.getLength = List.prototype.getLength;
    array.getTypeOfElements = List.prototype.getTypeOfElements; //TODO: redundant?
    array.getTypes = List.prototype.getTypes;
    array.getType = List.prototype.getType;
    array.getLengths = List.prototype.getLengths;
    array.getWithoutRepetitions = List.prototype.getWithoutRepetitions;
    array.getSimplified = List.prototype.getSimplified;
    array.getFrequenciesTable = List.prototype.getFrequenciesTable;
    array.allElementsEqual = List.prototype.allElementsEqual;
    array.countElement = List.prototype.countElement;
    array.countOccurrences = List.prototype.countOccurrences;
    array.getMostRepeatedElement = List.prototype.getMostRepeatedElement;
    array.getMin = List.prototype.getMin;
    array.getMax = List.prototype.getMax;
    array.indexesOf = List.prototype.indexesOf;
    array.indexOfElements = List.prototype.indexOfElements;
    array.indexOfByPropertyValue = List.prototype.indexOfByPropertyValue;
    array.getFirstElementByName = List.prototype.getFirstElementByName;
    array.getElementsByNames = List.prototype.getElementsByNames;
    array.getFirstElementByPropertyValue = List.prototype.getFirstElementByPropertyValue;
    array.add = List.prototype.add;
    array.multiply = List.prototype.multiply;
    array.getSubList = List.prototype.getSubList;
    array.getSubListByIndexes = List.prototype.getSubListByIndexes;
    array.getSubListByType = List.prototype.getSubListByType;
    array.getElementNumberOfOccurrences = List.prototype.getElementNumberOfOccurrences;
    array.getPropertyValues = List.prototype.getPropertyValues;
    array.getRandomElement = List.prototype.getRandomElement;
    array.getRandomElements = List.prototype.getRandomElements;
    array.containsElement = List.prototype.containsElement;
    array.indexOfElement = List.prototype.indexOfElement;
    //sorting:
    array.sortIndexed = List.prototype.sortIndexed;
    array.sortNumericIndexed = List.prototype.sortNumericIndexed;
    array.sortNumeric = List.prototype.sortNumeric;
    array.sortNumericIndexedDescending = List.prototype.sortNumericIndexedDescending;
    array.sortNumericDescending = List.prototype.sortNumericDescending;
    array.sortOnIndexes = List.prototype.sortOnIndexes;
    array.getReversed = List.prototype.getReversed;
    array.getSortedByProperty = List.prototype.getSortedByProperty;
    array.getSorted = List.prototype.getSorted;
    array.getSortedByList = List.prototype.getSortedByList;
    array.getSortedRandom = List.prototype.getSortedRandom;
    //filter:
    array.getFilteredByPropertyValue = List.prototype.getFilteredByPropertyValue;
    array.getFilteredByBooleanList = List.prototype.getFilteredByBooleanList;

    array.clone = List.prototype.clone;
    array.toString = List.prototype.toString;
    array.getNames = List.prototype.getNames;
    array.applyFunction = List.prototype.applyFunction;
    array.getWithoutElementAtIndex = List.prototype.getWithoutElementAtIndex;
    array.getWithoutElement = List.prototype.getWithoutElement;
    array.getWithoutElements = List.prototype.getWithoutElements;
    array.getWithoutElementsAtIndexes = List.prototype.getWithoutElementsAtIndexes;
    array.getFilteredByFunction = List.prototype.getFilteredByFunction;
    array._concat = Array.prototype.concat;
    array.concat = List.prototype.concat;

    //transformations
    array.pushIfUnique = List.prototype.pushIfUnique;
    array.removeElement = List.prototype.removeElement;
    array.removeElementAtIndex = List.prototype.removeElementAtIndex;
    array.removeElementsAtIndexes = List.prototype.removeElementsAtIndexes;
    array.removeElements = List.prototype.removeElements;
    array.removeRepetitions = List.prototype.removeRepetitions;
    array.replace = List.prototype.replace;
    array.assignNames = List.prototype.assignNames;
    array._splice = Array.prototype.splice;
    array.splice = List.prototype.splice;

    array.isList = true;

    array.destroy = List.prototype.destroy;

    return array;
  };

  /**
   * improves a list by its refining type (if the List contains numbers it will return a NumberList)
   * @return {List} Specific sub-class of List, based on the contents of the List.
   * tags:
   */
  List.prototype.getImproved = function() {
    //TODO: still doesn't solve tha case of a list with several list of different types
    if(this.length === 0) {
      return this;
    }

    var typeOfElements = this.getTypeOfElements();

    var newList;
    switch(typeOfElements) {
      case "number":
        newList = NumberList.fromArray(this, false);
        break;
      case "string":
        newList = StringList.fromArray(this, false);
        break;
      case "Rectangle":
        return this;
      case "date":
        newList = DateList.fromArray(this, false);
        break;
      case "List":
      case "DateList":
      case "IntervalList":
      case "StringList":
      case "Table":
        newList = Table.fromArray(this, false);
        break;
      case "NumberList":
        newList = NumberTable.fromArray(this, false);
        break;
      case "Point":
        newList = _Polygon.fromArray(this, false);
        break;
      case "Polygon":
        newList = PolygonList.fromArray(this, false);
        break;
      case "Node":
        newList = NodeList.fromArray(this, false);
        break;
      case "Relation":
        newList = RelationList.fromArray(this, false);
        break;
    }

    var l = this.length;
    if(newList === null ||  newList === "") {
      //c.l('getImproved | all elelemnts no same type')

      var allLists = true;
      var i;
      for(i = 0; i<l; i++) {
        //c.l('isList?', i, this[i].isList);
        if(!(this[i].isList)) {
          allLists = false;
          break;
        }
      }
      //c.l('--> allLists');
      if(allLists) newList = Table.fromArray(this, false);
    }

    if(newList != null) {
      newList.name = this.name;
      return newList;
    }
    return this;
  };

  /**
   * Compares elements with another list.
   * @param  {List} list List to compare.
   * @return {Boolean} true if all elements are identical.
   * tags:
   */
  List.prototype.isEquivalent = function(list) {
    if(this.length != list.length) return false;

    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      if(this[i] != list[i]) return false;
    }

    return true;
  };

  /**
   * Returns the number of elements of the list.
   * @return {Number} Length of the list.
   * tags:
   */
  List.prototype.getLength = function() {
    return this.length;
  };

  /**
   * In sub-classes, this function returns a NumberList of lengths.
   * Base function returns null.
   * @return {null}
   * tags:
   */
  List.prototype.getLengths = function() {
    //overriden by different extentions of List
    return null;
  };

  /**
   * returns the type of values contained in the List.
   * Uses typeOf to determine type. If multiple types,
   * returns an empty string.
   * @return {String} Type of element stored in the List.
   */
  List.prototype.getTypeOfElements = function() {
    var typeOfElements = typeOf(this[0]);
    var l = this.length;
    for(var i = 1; i<l; i++) {
      if(typeOf(this[i]) != typeOfElements) return "";
    }
    return typeOfElements;
  };

  /**
   * returns a {@link StringList} with elemnts types
   * for all elements in the List.
   * @return {StringList} List of types for each element.
   * tags:
   */
  List.prototype.getTypes = function() {
    var types = new StringList();
    var l = this.length;
    for(var i = 0; i<l; i++) {
      types[i] = typeOf(this[i]);
    }
    return types;
  };


  /**
   * converts the List into a string.
   * @return {String} String representation of the List.
   */
  List.prototype.toString = function() {
    var str = "[";
    for(var i = 0; i < this.length - 1; i++) {
      str += this[i] + ", ";
    }
    str += this[this.length - 1] + "]";
    return str;
  };

  /**
   * returns a list of names (if any) of elements of the list
   * @return {StringList}
   * tags:
   */
  List.prototype.getNames = function() {
    var stringList = new StringList();
    var l = this.length;
    for(var i = 0; i<l; i++) {
      stringList[i] = this[i].name;
    }
    return stringList;
  };

  /**
   * reverses the list
   * @return {List} New List reveresed from original.
   * tags:sort
   */
  List.prototype.getReversed = function() {
    var newList = instantiateWithSameType(this);
    var l = this.length;
    for(var i = 0; i<l; i++) {
      newList.unshift(this[i]);
    }
    return newList;
  };

  /**
   * returns a sub-list, params could be: tw numbers, an interval or a NumberList.
   * @param {Number|Interval} argument0 number, interval (in this it will
   * include elements with initial and end indexes) or numberList
   * @param {Number} argument1 second index
   * @return {List}
   * tags:filter
   */
  List.prototype.getSubList = function() {
    var interval;
    var i;

    if(arguments[0].isList) {
      return this.getSubListByIndexes(arguments[0]);
    } else if(arguments.length > 2) {
      return this.getSubListByIndexes(arguments);
    } else if(typeOf(arguments[0]) == 'number') {
      if(typeOf(arguments[1]) != null && typeOf(arguments[1]) == 'number') {
        interval = new Interval(arguments[0], arguments[1]);
      } else {
        interval = new Interval(arguments[0], this.length - 1);
      }
    } else {
      interval = arguments[0];
    }

    var newInterval = new Interval(Math.max(Math.min(Math.floor(interval.x), this.length), 0), Math.max(Math.min(Math.floor(interval.y), this.length - 1), 0));
    var newList;

    if(this.type == "NumberList") {
      newList = NumberList.fromArray(this.slice(interval.x, interval.y + 1), false);
      newList.name = this.name;
      return newList;
    } else if(this.type == "StringList") {
      newList = StringList.fromArray(this.slice(interval.x, interval.y + 1), false);
      newList.name = this.name;
      return newList;
    }

    var type = this.type;

    if(type == 'List' || type == 'Table') {
      newList = new List();
    } else {
      newList = instantiate(type);
    }

    if(type=='NodeList'){
      for(i = newInterval.x; i <= newInterval.y; i++) {
        newList.addNode(this[i]);
      }
    } else {
      for(i = newInterval.x; i <= newInterval.y; i++) {
        newList.push(this[i]);
      }
    }

    newList.name = this.name;
    if(type == 'List' || type == 'Table') return newList.getImproved();
    return newList;
  };

  /**
   * filters a list by picking elements of certain type.
   * @param  {String} type The type to include in the new List.
   * @return {List} A List only containing values from the original
   * List of the input type.
   * tags:filter
   */
  List.prototype.getSubListByType = function(type) {
    var newList = new List();
    newList.name = this.name;
    this.forEach(function(element) {
      if(typeOf(element) == type) newList.push(element);
    });
    return newList.getImproved();
  };

  /**
   * returns all elements in indexes.
   * @param {NumberList} indexes
   * @return {List}
   * tags:filter
   */
  List.prototype.getSubListByIndexes = function() { //TODO: merge with getSubList
    if(this.length < 1) return this;
    var indexes;
    if(typeOf(arguments[0]) == 'number') {
      indexes = arguments;
    } else {
      indexes = arguments[0];
    }

    if(indexes == null) {
      return;
    }

    var newList;
    var type = this.type;
    if(type == 'List') {
      newList = new List();
    } else {
      newList = instantiate(typeOf(this));
    }

    if(indexes.length === 0) {
      return newList;
    }
    newList.name = this.name;
    var nElements = this.length;
    var nPositions = indexes.length;
    var i;

    if(type=="NodeList"){
      for(i = 0; i < nPositions; i++) {
        if(indexes[i] < nElements) {
          newList.addNode(this[(indexes[i] + this.length) % this.length]);
        }
      }
    } else {
      for(i = 0; i < nPositions; i++) {
        if(indexes[i] < nElements) {
          newList.push(this[(indexes[i] + this.length) % this.length]);
        }
      }
    }

    if(type == 'List' || type == 'Table') {
      return newList.getImproved();
    }
    return newList;
  };

  /**
   * getElementNumberOfOccurrences
   * @param {Object} element
   * @return {Number}
   */
  List.prototype.getElementNumberOfOccurrences = function(element) {
    var nOccurrences = 0;
    var from = 0;
    var index = this.indexOf(element, from);
    while(index > -1) {
      nOccurrences++;
      from = index + 1;
      index = this.indexOf(element, from);
    }
    return nOccurrences;
  };


  /**
   * creates a copy of the List
   * @return {List}
   */
  List.prototype.clone = function() {
    //TODO:check this! fromArray should suffice
    var clonedList = instantiateWithSameType(this);
    var i;
    var l = this.length;

    for(i = 0; i<l; i++) {
      clonedList.push(this[i]);
    }
    clonedList.name = this.name;
    return clonedList;
  };

  /**
   * creates a new List without repeating elements.
   * @return {List}
   * tags:filter
   */
  List.prototype.getWithoutRepetitions = function() {
    var i;
    var dictionary;

    var newList = instantiateWithSameType(this);
    var l = this.length;

    newList.name = this.name;

    //if(this.type == 'NumberList' || this.type == 'StringList') {//TODO:check other cases
    dictionary = {};
    for(i = 0; i<l; i++) {
      if(!dictionary[this[i]]) {
        newList.push(this[i]);
        dictionary[this[i]] = true;
      }
    }
    // } else {
    //   for(i = 0; this[i] != null; i++) {
    //     if(newList.indexOf(this[i]) == -1) newList.push(this[i]);
    //   }
    // }

    return newList;
  };


  /**
   * simplifies a categorical list, by keeping the nCategories-1 most common values, and replacing the others with an "other" element
   * @param  {Number} nCategories number of diferent elemenets in the resulting list
   *
   * @param  {Object} othersElement to be placed instead of the less common elements ("other" by default)
   * @return {List} simplified list
   * tags:
   */
  List.prototype.getSimplified = function(nCategories, othersElement) {
    if(!nCategories) return;

    var freqTable = this.getFrequenciesTable();
    var frequencyIndexesDictionary = ListOperators.getSingleIndexDictionaryForList(freqTable[0]);
    var i;
    var l = this.length;

    if(othersElement==null) othersElement = "other";

    var newList = this.type=="StringList"?new StringList():new List();
    newList.name = this.name;

    for(i=0; i<l; i++){
      newList.push(frequencyIndexesDictionary[this[i]]<nCategories-1?this[i]:othersElement);
    }
    // this.forEach(function(element){
    //   newList.push(freqTable._indexesDictionary[element]<nCategories-1?element:othersElement);
    // });
    
    return newList;
  };


  /**
   * returns the number of occurrences of an element in a list.
   * @param  {Object} element The element to count
   * @return {Number}
   * tags:countt
   */
  List.prototype.countElement = function(element) {
    var n = 0;
    //this.forEach(function(elementInList) {
    var l = this.length;

    for(var i = 0; i<l; i++) {
      if(element == this[i]) n++;
    }

    return n;
  };

  /**
   * returns a NumberList of same size as list with number of occurrences for each element.
   * @return {numberList}
   * tags:count
   */
  List.prototype.countOccurrences = function() { //TODO: more efficient
    var occurrences = new NumberList();
    var l = this.length;
    for(var i = 0; i<l; i++) {
      occurrences[i] = this.indexesOf(this[i]).length;
    }
    return occurrences;
  };


  /**
   * returns a table with a list of non repeated elements and a list with the numbers of occurrences for each one.
   *
   * @param  {Boolean} sortListsByOccurrences if true both lists in the table will be sorted by number of occurences (most frequent on top), true by default
   * @param {Boolean} addWeightsNormalizedToSum adds a 3rd list with weights normalized to sum (convenient to proportion visualizations)
   * @param {Boolean} addCategoricalColors adds a list of categorical colors
   * @return {Table} Table containing a List of non-repeated elements and a NumberList of the frequency of each element.
   * tags:count
   * previous_name:getElementsRepetitionCount
   */
  List.prototype.getFrequenciesTable = function(sortListsByOccurrences, addWeightsNormalizedToSum, addCategoricalColors) {
    sortListsByOccurrences = sortListsByOccurrences == null?true:sortListsByOccurrences;

    var table = new Table();
    var elementList = new List();
    var numberList = new NumberList();
    var i;
    var index;

    table[0] = elementList;
    table[1] = numberList;

    //if(this.type == 'NumberList' || this.type == 'StringList') {//TODO:check other cases
    table._indexesDictionary = {};

    var l = this.length;

    for(i=0; i<l; i++){
      index = table._indexesDictionary[this[i]];
      if(index==null){
        index = elementList.length;
        elementList[index] = this[i];
        numberList[index] = 0;
        table._indexesDictionary[this[i]]= index;
      }
      numberList[index]++;
    }



    // } else {
    //   for(i = 0; this[i]!=null; i++) {
    //     element = this[i];
    //     index = elementList.indexOf(element);
    //     if(index != -1) {
    //       numberList[index]++;
    //     } else {
    //       elementList.push(element);
    //       numberList.push(1);
    //     }
    //   }
    // }

    if(sortListsByOccurrences){
      table[0] = elementList.getSortedByList(numberList, false);
      table[1] = numberList.getSorted(false);

    }

    if(addWeightsNormalizedToSum) table[2] = NumberListOperators.normalizedToSum(table[1]);
    if(addCategoricalColors){
      var colors = new ColorList();
      l = table[0].length;
      for(i = 0; i<l; i++) {
        colors[i] = ColorListGenerators._HARDCODED_CATEGORICAL_COLORS[i%ColorListGenerators._HARDCODED_CATEGORICAL_COLORS.length];
      }
      table.push(colors);
    }

    return table;
  };

  /**
   * checks if all values in the list are equal to one another
   * @return {Boolean} Returns true if all values in the list are equal.
   */
  List.prototype.allElementsEqual = function() {
    var i;
    if(this.length < 2) return true;

    var first = this[0];
    var l = this.length;

    for(i = 1; i<l; i++) {
      if(this[i] != first) return false;
    }

    return true;
  };


  /**
   * Returns the value in the list that is repeated the most times.
   *
   * @return {Object} Most repeated value.
   */
  List.prototype.getMostRepeatedElement = function() {
    //TODO: this method should be more efficient
    return this.getFrequenciesTable(true)[0][0];// ListOperators.countElementsRepetitionOnList(this, true)[0][0];
  };

  /**
   * returns the minimum value
   * @return {Number} minimum value in the list
   * tags:
   */
  List.prototype.getMin = function() {
    if(this.length === 0) return null;
    var min = this[0];
    var i;
    var l = this.length;
    for(i = 1; i < l; i++) {
      min = Math.min(min, this[i]);
    }
    return min;
  };

  /**
   * returns the maximum value
   * @return {Number} maximum value in the list
   * tags:
   */
  List.prototype.getMax = function() {
    if(this.length === 0) return null;
    var max = this[0];
    var i;
    var l = this.length;
    for(i = 1; i < l; i++) {
      max = Math.max(max, this[i]);
    }
    return max;
  };

  /**
   * Creates a new List with the given value added
   * to each element in the current List.
   *
   * @param {Number} value Number to be added to each
   * element in the List.
   * @return {List} New List with each element the result
   * of adding the given value to the original elements
   * in the List.
   */
  List.prototype.add = function(value) {
    if(value.constructor == Number) {
      var i;
      var l = this.length;
      var array = instantiateWithSameType(this);
      for(i = 0; i < l; i++) {
        array.push(this[i] + value);
      }
      return array;
    }
  };

  /**
   * Selects a random element from list.
   *
   * @return {Object}
   * tags:
   */
  List.prototype.getRandomElement = function() {
    return this[Math.floor(this.length * Math.random())];
  };

  /**
   * creates a List with randomly selected elements.
   * @param  {Number} n number of elements
   * @param  {Boolean} avoidRepetitions
   * @return {List}
   * tags:filter
   */
  List.prototype.getRandomElements = function(n, avoidRepetitions) {
    avoidRepetitions = avoidRepetitions == null ? true : avoidRepetitions;
    n = Math.min(n, this.length);
    var newList = instantiateWithSameType(this);
    var element;

    while(newList.length < n) {
      element = this[Math.floor(this.length * Math.random())];
      if(!avoidRepetitions || newList.indexOf(element) == -1) newList.push(element);
    }
    return newList;
  };


  /**
   * returns true if the given element is in the List.
   * @param {Object} element Element to look for in the List.
   * @return {Boolean} True if given element is in the List.
   */
  List.prototype.containsElement = function(element) { //TODO: test if this is faster than indexOf
    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      if(this[i] == element) return true;
    }
    return false;
  };

  /**
   * returns the index position of the given element in the List.
   * @param {Object} element Value to search for in the List.
   * @return {Number} Index of the given element in the List.
   * If element is not found, -1 is returned.
   */
  List.prototype.indexOfElement = function(element) { //TODO: test if this is faster than indexOf
    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      if(this[i] == element) return i;
    }
    return -1;
  };

  /**
   * Returns a List of values of a property of all elements.
   *
   * @param  {String} propertyName
   *
   * @param  {Object} valueIfNull in case the property doesn't exist in the element
   * @return {List}
   * tags:
   */
  List.prototype.getPropertyValues = function(propertyName, valueIfNull) {
    var newList = new List();
    newList.name = propertyName;
    var val;
    var l = this.length;
    for(var i = 0; i<l; i++) {
      val = this[i][propertyName];
      newList[i] = (val == null ? valueIfNull : val);
    }
    return newList.getImproved();
  };

  List.prototype.sortIndexed = function() {
    var index = [];
    var i;
    var l = this.length;
    for(i = 0; i < l; i++) {
      index.push({
        index: i,
        value: this[i]
      });
    }
    var comparator = function(a, b) {
      var array_a = a.value;
      var array_b = b.value;

      return array_a < array_b ? -1 : array_a > array_b ? 1 : 0;
    };
    index = index.sort(comparator);
    var result = new NumberList();
    for(i = 0; i < index.length; i++) {
      result.push(index[i].index);
    }
    return result;
  };

  List.prototype.sortOnIndexes = function(indexes) {
    var result = instantiateWithSameType(this);
    result.name = this.name;
    var i;
    for(i = 0; this[i] != null; i++) {
      if(indexes[i] != -1) result.push(this[indexes[i]]);
    }
    return result;
  };

  List.prototype.getSortedByProperty = function(propertyName, ascending) {
    ascending = ascending == null ? true : ascending;

    var comparator;
    if(ascending) {
      comparator = function(a, b) {
        return a[propertyName] > b[propertyName] ? 1 : -1;
      };
    } else {
      comparator = function(a, b) {
        return b[propertyName] > a[propertyName] ? 1 : -1;
      };
    }
    return this.clone().sort(comparator);
  };

  /**
   * Returns a sorted version of the List.
   *
   * @param  {Boolean} ascending sort (true by default)
   * @return {List}
   * tags:sort
   */
  List.prototype.getSorted = function(ascending) {
    return this.getSortedByList(this, ascending);
  };

  /**
   * Sorts the List by another List.
   *
   * @param  {List} list List used to sort (numberList, stringList, dateList…)
   *
   * @param  {Boolean} ascending (true by default)
   * @return {List} sorted list (of the same type)
   * tags:sort
   */
  List.prototype.getSortedByList = function(list, ascending) {
    ascending = ascending == null ? true : ascending;

    var pairsArray = [];
    var i;
    var l = this.length;

    for(i = 0; i<l; i++) {
      pairsArray[i] = [this[i], list[i]];
    }

    var comparator;
    if(ascending) {
      comparator = function(a, b) {
        return a[1] < b[1] ? -1 : 1;
      };
    } else {
      comparator = function(a, b) {
        return a[1] < b[1] ? 1 : -1;
      };
    }

    pairsArray = pairsArray.sort(comparator);

    var newList = instantiateWithSameType(this);
    newList.name = this.name;

    for(i = 0; i<l; i++) {
      newList[i] = pairsArray[i][0];
    }

    return newList;
  };


  /**
   * Returns a copy of the list with random sorting.
   *
   * @return {List}
   * tags:sort
   */
  List.prototype.getSortedRandom = function() {
    var newList = this.clone();
    newList.name = this.name;
    newList.sort(function() {
      return Math.random() < 0.5 ? 1 : -1;
    });
    return newList;
  };

  /**
   * Returns a NumberList with the indexes (positions) of an element.
   *
   * @param  {Object} element
   * @return {NumberList}
   * tags:
   */
  List.prototype.indexesOf = function(element) {
    var index = this.indexOf(element);
    var numberList = new NumberList();
    while(index != -1) {
      numberList.push(index);
      index = this.indexOf(element, index + 1);
    }
    return numberList;
  };

  /**
   * Returns a NumberList with indexes (first position) of elements in a list.
   *
   * @param  {List} elements
   * @return {NumberList}
   * tags:
   */
  List.prototype.indexOfElements = function(elements) {
    var numberList = new NumberList();
    var l = elements.length;
    for(var i = 0; i<l; i++) {
      numberList[i] = this.indexOf(elements[i]);
    }
    return numberList;
  };

  /**
   * Returns the first element (or index) of an element in the with a given name.
   *
   * @param  {String} name of element
   * @param  {Boolean} returnIndex if true returns the index of element (false by default)
   * @return {List}
   * tags: filter
   */
  List.prototype.getFirstElementByName = function(name, returnIndex) {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      if(this[i].name == name) return returnIndex ? i : this[i];
    }
    return returnIndex ? -1 : null;
  };

  /**
   * Returns the first element from each name ([!] to be tested).
   *
   * @param  {StringList} names of elements to be filtered
   * @param  {Boolean} returnIndexes if true returns the indexes of elements (false by default)
   * @return {List}
   * tags:filter
   */
  List.prototype.getElementsByNames = function(names, returnIndex) {
    var list = returnIndex ? new NumberList() : new List();
    var i;
    var l = this.length;

    names.forEach(function(name) {
      for(i = 0; i<l; i++) {
        if(this[i].name == name) {
          list.push(returnIndex ? i : this[i]);
          break;
        }
      }
      list.push(returnIndex ? -1 : null);
    });

    return returnIndex ? list : list.getImproved();
  };


  /**
   * Gets the first elemenet that has some property with a given value.
   *
   * @param  {String} propertyName name of property
   * @param  {Object} value value of property
   * @return {Object}
   * tags:
   */
  List.prototype.getFirstElementByPropertyValue = function(propertyName, value) {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      if(this[i][propertyName] == value) return this[i];
    }
    return null;
  };

  List.prototype.indexOfByPropertyValue = function(propertyName, value) {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      if(this[i][propertyName] == value) return i;
    }
    return -1;
  };



  /**
   * Filters the list by booleans (also accepts numberList with 0s as false a any other number as true).
   *
   * @param  {List} booleanList booleanList or numberList
   * @return {List}
   * tags:filter
   */
  List.prototype.getFilteredByBooleanList = function(booleanList) {
    var newList = new List();
    newList.name = this.name;
    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      if(booleanList[i]) newList.push(this[i]);
    }
    return newList.getImproved();
  };

  /**
   * Filters a list by its elements, and a type of comparison (equal by default).
   *
   * @param  {String} propertyName property to check.
   * @param  {Object} propertyValue object (for equal or different comparison) or number or date
   * (for equal, different, greater, lesser).
   * @param  {String} comparison equal (default), different, greater, lesser.
   * @return {List} Filtered list
   * tags:filter
   */
  List.prototype.getFilteredByValue = function(propertyName, propertyValue, comparison) {
    comparison = comparison == null ? "equal" : comparison;

    var newList = new List();
    newList.name = "filtered_" + this.name;
    var i;
    switch(comparison) {
      case "equal":
        for(i = 0; this[i] != null; i++) {
        if(this[i][propertyName] == propertyValue) newList.push(this[i]);
      }
      break;
      case "different":
        for(i = 0; this[i] != null; i++) {
        if(this[i][propertyName] != propertyValue) newList.push(this[i]);
      }
      break;
      case "greater":
        for(i = 0; this[i] != null; i++) {
        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
      }
      break;
      case "lower":
        for(i = 0; this[i] != null; i++) {
        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
      }
      break;
    }

    return newList.getImproved();
  };

  /**
   * Filters a list by the values of a property on its elements, and a type of comparison (equal by default).
   *
   * @param  {String} propertyName name of property
   * @param  {Object} propertyValue object (for equal or different comparison) or number or date (for equal, different, greater, lesser)
   * @param  {String} comparison equal (default), different, greater, lesser
   * @return {List} filtered list
   * tags:filter
   */
  List.prototype.getFilteredByPropertyValue = function(propertyName, propertyValue, comparison) {
    comparison = comparison == null ? "equal" : comparison;

    var newList = new List();
    newList.name = "filtered_" + this.name;
    var i;
    var l = this.length;
    switch(comparison) {
      case "equal":
        for(i = 0; i<l; i++) {
        if(this[i][propertyName] == propertyValue) newList.push(this[i]);
      }
      break;
      case "different":
        for(i = 0; i<l; i++) {
        if(this[i][propertyName] != propertyValue) newList.push(this[i]);
      }
      break;
      case "greater":
        for(i = 0; i<l; i++) {
        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
      }
      break;
      case "lower":
        for(i = 0; i<l; i++) {
        if(this[i][propertyName] > propertyValue) newList.push(this[i]);
      }
      break;
    }

    return newList.getImproved();
  };

  List.prototype.applyFunction = function(func) {
    //TODO: to be tested!
    var newList = new List();
    newList.name = this.name;
    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      newList[i] = func(this[i]);
    }
    return newList.getImproved();
  };


  //filtering

  List.prototype.getWithoutElementsAtIndexes = function(indexes) {
    var i;
    var newList;
    var l = this.length;
    if(this.type == 'List') {
      newList = new List();
    } else {
      newList = instantiate(typeOf(this));
    }
    for(i = 0; i < l; i++) {
      if(indexes.indexOf(i) == -1) {
        newList.push(this[i]);
      }
    }
    if(this.type == 'List') return newList.getImproved();
    return newList;
  };

  /**
   * Removes an element and returns a new list.
   *
   * @param  {Number} index of element to remove
   * @return {List}
   * tags:filter
   */
  List.prototype.getWithoutElementAtIndex = function(index) {
    var newList;
    var l = this.length;
    if(this.type == 'List') {
      newList = new List();
    } else {
      newList = instantiateWithSameType(this);
    }
    for(var i = 0; i<l; i++) {
      if(i != index) {
        newList.push(this[i]);
      }
    }
    newList.name = this.name;
    if(this.type == 'List') return newList.getImproved();
    return newList;
  };

  /**
   * Creates a new List without the given element present.
   * If multiple copies of the element exist, only exlcudes first copy.
   *
   * @param {Number|String|Object} element Element to exclude in the new List.
   * @return {List} New List missing the given element.
   */
  List.prototype.getWithoutElement = function(element) {
    var index = this.indexOf(element);
    if(index == -1) return this;

    var newList;

    if(this.type == 'List') {
      newList = new List();
    } else {
      newList = instantiateWithSameType(this);
    }

    newList.name = this.name;

    var i;
    var l = this.length;
    for(i = 0; i<l; i++) {
      if(i != index) newList.push(this[i]);
    }

    if(this.type == 'List') return newList.getImproved();
    return newList;
  };

  List.prototype.getWithoutElements = function(list) {//TODO: more efficiency with dictionary
    var newList;
    var l = this.length;
    if(this.type == 'List') {
      newList = new List();
    } else {
      newList = instantiateWithSameType(this);
    }

    for(var i = 0; i<l; i++) {
      if(list.indexOf(this[i]) == -1) {
        newList.push(this[i]);
      }
    }
    newList.name = this.name;
    if(this.type == 'List') return newList.getImproved();
    return newList;
  };


  /**
   * Returns subset of List where true is returned from
   * given function that is executed on each element in the List.
   *
   * @param {Function} func Function to run on each element.
   * If the function returns true, the element is maintained in the
   * returned List.
   * @return {List} Filtered List.
   */
  List.prototype.getFilteredByFunction = function(func) {
    var newList = instantiateWithSameType(this);
    var l = this.length;
    for(var i = 0; i<l; i++) {
      if(func(this[i])) {
        newList.push(this[i]);
      }
    }
    newList.name = this.name;
    if(this.type == 'List') return newList.getImproved();
    return newList;
  };



  List.prototype.concat = function() {
    if(arguments[0] == null) return this;

    // c.l('concat | arguments[0].type, this.type', arguments[0].type, this.type);

    if(arguments[0].type == this.type) {//var type = … / switch/case
      if(this.type == "NumberList") {
        return NumberList.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "StringList") {
        return StringList.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "DateList") {
        return DateList.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "Table") {
        return Table.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "NumberTable") {
        return NumberTable.fromArray(this._concat.apply(this, arguments), false);
      } else if(this.type == "NodeList"){
        var newList = this.clone();
        var args = arguments[0];
        var i;
        var l = args.length;
        for(i=0; i<l; i++){
          // c.l('   +_+_+_+args[i]',args[i]);
          newList.addNode(args[i]);
        }
        return newList;
      }
    }
    return List.fromArray(this._concat.apply(this, arguments)).getImproved();
  };



  ////transformations

  List.prototype.pushIfUnique = function(element) {
    if(this.indexOf(element) != -1) return; //TODO: implement equivalence
    this.push(element);
  };

  List.prototype.removeElements = function(elements) { //TODO: make it more efficient (avoiding the splice method)
    var i;
    var dictionary = {};
    var l = this.length;
    var nElements = elements.length;

    for(i=0; i<nElements; i++){
      dictionary[elements[i]] = true;
    }

    for(i = 0; i<l; i++) {
      //if(elements.indexOf(this[i]) > -1) {
      if(dictionary[this[i]]) {
        this.splice(i, 1);
        i--;
      }
    }
  };

  List.prototype.removeElement = function(element) {
    var index = this.indexOf(element);
    if(index != -1) this.splice(index, 1);
  };

  List.prototype.removeElementAtIndex = function(index) { //deprecated
    this.splice(index, 1);
  };

  List.prototype.removeElementsAtIndexes = function(indexes) {
    indexes = indexes.sort(function(a, b) {
      return a - b;
    });

    for(var i = 0; indexes[i] != null; i++) {
      this.splice(indexes[i] - i, 1);
    }
  };

  List.prototype.removeRepetitions = function() {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      if(this.indexOf(this[i], i + 1) != -1) {
        this.splice(i, 1);
      }
    }
  };

  List.prototype.replace = function(elementToFind, elementToInsert) {
    var l = this.length;
    for(var i = 0; i < l; i++) {
      if(this[i] == elementToFind) this[i] = elementToInsert;
    }
  };

  /**
   * assign value to property name on all elements
   * @param  {StringList} names
   * @return {List}
   * tags:transform
   */
  List.prototype.assignNames = function(names) {
    if(names == null) return this;
    var n = names.length;
    var l = this.length;
    var i;

    //this.forEach(function(element, i) {
    for(i=0; i<l; i++){
      this[i].name = names[i % n];
    }

    return this;
  };


  List.prototype.splice = function() { //TODO: replace
    switch(this.type) {
      case 'NumberList':
        return NumberList.fromArray(this._splice.apply(this, arguments));
      case 'StringList':
        return StringList.fromArray(this._splice.apply(this, arguments));
      case 'NodeList':
        return NodeList.fromArray(this._splice.apply(this, arguments));
      case 'DateList':
        return DateList.fromArray(this._splice.apply(this, arguments));
    }
    return List.fromArray(this._splice.apply(this, arguments)).getImproved();
  };

  List.prototype.destroy = function() {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      delete this[i];
    }
  };

  ColorList.prototype = new List();
  ColorList.prototype.constructor = ColorList;

  /**
   * @classdesc A {@link List} for storing Colors.
   *
   * Additional functions that work on ColorList can be found in:
   * <ul>
   *  <li>Operators:   {@link ColorListOperators}</li>
   *  <li>Generators: {@link ColorListGenerators}</li>
   * </ul>
   *
   * @description Creates a new ColorList.
   * @constructor
   * @category colors
   */
  function ColorList() {
    var args = [];
    var i;
    var lArgs = arguments.length;
    for(i = 0; i < lArgs; i++) {
      args[i] = arguments[i];
    }
    var array = List.apply(this, args);
    array = ColorList.fromArray(array);

    return array;
  }
  /**
   * Creates a new ColorList from a raw array of values
   *
   * @param {String[]} array Array of hex or other color values
   * @return {ColorList} New ColorList.
   */
  ColorList.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "ColorList";
    result.getRgbArrays = ColorList.prototype.getRgbArrays;
    result.getInterpolated = ColorList.prototype.getInterpolated;
    result.getInverted = ColorList.prototype.getInverted;
    result.addAlpha = ColorList.prototype.addAlpha;
    return result;
  };

  /**
   * returns an arrays of rgb values, each stored in an array ([rr,gg,bb])
   * @return {array} Array of array of RGB values.
   * tags:
   */
  ColorList.prototype.getRgbArrays = function() {
    var rgbArrays = new List();
    var l = this.length;

    for(var i = 0; i<l; i++) {
      rgbArrays[i] = ColorOperators.colorStringToRGB(this[i]);
    }

    return rgbArrays;
  };

  /**
   * interpolates colors with a given color and measure
   *
   * @param  {String} color to be interpolated with
   * @param  {Number} value intenisty of interpolation [0,1]
   * @return {ColorList}
   * tags:
   */
  ColorList.prototype.getInterpolated = function(color, value) {
    var newColorList = new ColorList();
    var l = this.length;

    for(var i = 0; i<l; i++) {
      newColorList[i] = ColorOperators.interpolateColors(this[i], color, value);
    }

    newColorList.name = this.name;
    return newColorList;
  };

  /**
   * inverts all colors
   * @return {ColorList}
   * tags:
   */
  ColorList.prototype.getInverted = function() {
    var newColorList = new ColorList();
    var l = this.length;

    for(var i = 0; i<l; i++) {
      newColorList[i] = ColorOperators.invertColor(this[i]);
    }

    newColorList.name = this.name;
    return newColorList;
  };

  /**
   * adds alpha value to all colores
   * @param {Number} alpha alpha value in [0,1]
   * @return {ColorList}
   * tags:
   */
  ColorList.prototype.addAlpha = function(alpha) {
    var newColorList = new ColorList();
    var l = this.length;

    for(var i = 0; i<l; i++) {
      newColorList[i] = ColorOperators.addAlpha(this[i], alpha);
    }

    newColorList.name = this.name;
    return newColorList;
  };

  _Point.prototype = new DataModel();
  _Point.prototype.constructor = _Point;

  /**
   * @classdesc Represents a 2D point in space.
   *
   * @description Creates a new Point
   * @param {Number} x
   * @param {Number} y
   * @constructor
   * @category geometry
   */
  function _Point(x, y) {
    DataModel.apply(this, arguments);
    this.type = "Point";
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
  }
  /**
  * Returns the {@link https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm|Euclidean norm} of the Point.
  */
  _Point.prototype.getNorm = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  /**
  * Returns a Number between -π and π representing the angle theta of the Point.
  * Uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2|atan2}.
  * @return {Number} Angle of Point.
  */
  _Point.prototype.getAngle = function() {
    return Math.atan2(this.y, this.x);
  };

  /**
  * Returns a new Point scaled by the input factor k. If k is a Number, the x and y
  * are scaled by that number. If k is a Point, then the x and y of the two points
  * are multiplied.
  * @param {Number|Point} k Factor to scale by.
  * @return {Point} New scaled Point.
  */
  _Point.prototype.factor = function(k) {
    if(k >= 0 || k < 0) return new _Point(this.x * k, this.y * k);
    if(k.type != null && k.type == 'Point') return new _Point(this.x * k.x, this.y * k.y);
  };

  /**
  * Normalize x and y values of the point by the Point's Euclidean Norm.
  * @return {Point} Normalized Point.
  */
  _Point.prototype.normalize = function() {
    var norm = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new _Point(this.x / norm, this.y / norm);
  };

  /**
  * Normalize x and y values of the point by the Point's Euclidean Norm and then
  * scale them by the input factor k.
  * @param {Number} k Factor to scale by.
  * @return {Point} Normalized Point.
  */
  _Point.prototype.normalizeToValue = function(k) {
    var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return new _Point(this.x * factor, this.y * factor);
  };

  /**
  * Subtracts given Point from this Point.
  * @param {Point} point The point to subtract
  * @return {Point} New subtracted Point.
  */
  _Point.prototype.subtract = function(point) {
    return new _Point(this.x - point.x, this.y - point.y);
  };

  /**
  * Adds given Point to this Point.
  * @param {Point} point The point to add
  * @return {Point} New added Point.
  */
  _Point.prototype.add = function(point) {
    return new _Point(point.x + this.x, point.y + this.y);
  };

  /**
  * Adds x and y values to this Point
  * @param {Number} x X value to add
  * @param {Number} y Y value to add
  * @return {Point} New Point with added values.
  */
  _Point.prototype.addCoordinates = function(x, y) {
    return new _Point(x + this.x, y + this.y);
  };

  /**
  * Provides the Euclidean distance between this Point and another Point.
  * @param {Point} point The point to provide distance to.
  * @return {Number} Distance between two points.
  */
  _Point.prototype.distanceToPoint = function(point) {
    return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
  };

  /**
  * Provides a Euclidean-like distance without square-rooting the result
  * between this Point and another Point.
  * @param {Point} point The point to provide distance to.
  * @return {Number} Distance squared between two points.
  */
  _Point.prototype.distanceToPointSquared = function(point) {
    return Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2);
  };

  /**
  * Returns a Number between -π and π representing the angle theta between this Point
  * and another Point
  * Uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2|atan2}.
  * @param {Point} point The point to provide angle from.
  * @return {Number} Angle of Point.
  */
  _Point.prototype.angleToPoint = function(point) {
    return Math.atan2(point.y - this.y, point.x - this.x);
  };

  /**
  * Creates a new Point who's x and y values are added to by the factor multiplied
  *  by the difference between the current Point and the provided Point.
  * @param {Point} point Point to find difference between current point of
  * @return {Point} Expanded Point.
  */
  _Point.prototype.expandFromPoint = function(point, factor) {
    return new _Point(point.x + factor * (this.x - point.x), point.y + factor * (this.y - point.y));
  };

  /**
  * Creates a new Point who's x and y values are multiplied by the difference
  * between the current Point and the provided Point. The factor value is added
  * to both x and y of this new Point.
  * @param {Point} point Point to find difference between current point of
  * @return {Point} Expanded Point.
  */
  _Point.prototype.interpolate = function(point, t) {
    return new _Point((1 - t) * this.x + t * point.x, (1 - t) * this.y + t * point.y);
  };

  /**
  * Crosses the x and y values.
  * Returns the value of this Point's x multiplied by the provided Point's y value,
  * subtracted by the provided Point's y value multiplied by this Point's x value.
  * @param {Point} point Point to cross
  * @return {Number} Crossed value.
  */
  _Point.prototype.cross = function(point) {
    return this.x * point.y - this.y * point.x;
  };

  /**
  * Calculates the dot product between two points.
  * @param {Point} point Point to compute dot product with
  * @return {Number} Dot Product
  */
  _Point.prototype.dot = function(point) {
    return this.x * point.x + this.y * point.y;
  };

  /**
  * Rotates a Point around a given center
  * @param {Number} angle Amount to rotate by
  * @param {Number} center to rotate around. If not provided, rotate around 0,0
  * @return {Point} New Point the result of this Point rotated by angle around center.
  */
  _Point.prototype.getRotated = function(angle, center) {
    center = center == null ? new _Point() : center;

    return new _Point(Math.cos(angle) * (this.x - center.x) - Math.sin(angle) * (this.y - center.y) + center.x, Math.sin(angle) * (this.x - center.x) + Math.cos(angle) * (this.y - center.y) + center.y);
  };

  /**
  * Copies this Point.
  * @return {Point} Copy of this point
  */
  _Point.prototype.clone = function() {
    return new _Point(this.x, this.y);
  };

  /**
  * Provides a string representation of the Point.
  * @return {String} string output
  */
  _Point.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ")";
  };

  /**
  * Deletes Point.
  */
  _Point.prototype.destroy = function() {
    delete this.type;
    delete this.name;
    delete this.x;
    delete this.y;
  };

  Interval.prototype = new _Point();
  Interval.prototype.constructor = Interval;

  /**
   * @classdesc Provide reasoning around numeric intervals.
   * Intervals have a start and end value.
   *
   * @constructor
   * @param {Number} x Interval's start value.
   * @param {Number} y Interval's end value.
   * @description Creates a new Interval.
   * @category numbers
   */
  function Interval(x, y) {
    DataModel.apply(this, arguments);
    this.x = Number(x);
    this.y = Number(y);
    this.type = "Interval";
  }
  /**
   * Finds the minimum value of the Interval.
   *
   * @return {Number} the minimum value in the interval
   */
  Interval.prototype.getMin = function() {
    return Math.min(this.x, this.y);
  };

  /**
   * Finds the maximum value of the Interval.
   *
   * @return {Number} the max value in the interval
   */
  Interval.prototype.getMax = function() {
    return Math.max(this.x, this.y);
  };

  /**
   * Finds the range between the min and max of the Interval.
   *
   * @return {Number} the absolute difference between the starting and ending values.
   */
  Interval.prototype.getAmplitude = function() {
    return Math.abs(this.y - this.x);
  };

  /**
   * Finds the range between the min and max of the Interval.
   * If the starting value of the Interval is less then the ending value,
   * this will return a negative value.
   *
   * @return {Number} the difference between the starting and ending values.
   */
  Interval.prototype.getSignedAmplitude = function() {
    return this.y - this.x;
  };

  /**
   * Returns the middle value between the min and max of the Interval.
   *
   * @return {Number} the difference between the starting and ending values.
  */
  Interval.prototype.getMiddle = function() {
    return (this.x + this.y)*0.5;
  };

  /**
   * Returns a random value within the min and max of the Interval.
   *
   * @return {Number} A random value.
  */
  Interval.prototype.getRandom = function() {
    return this.x + (this.y - this.x)*Math.random();
  };

  /**
   * Returns 1 if end value is greater then start value, and -1 if that is reversed.
   * If min and max values are equal, returns 0.
   *
   * @return {Number} The sign of the Interval.
  */
  Interval.prototype.getSign = function() {
    if(this.x == this.y) return 0;
    return Math.abs(this.y - this.x)/(this.y - this.x);
  };

  /**
   * Returns a new Interval with its start and stop values scaled by the input value.
   *
   * @param {Number} value Value to scale Interval by.
   * @return {Interval} The scaled Interval.
   */
  Interval.prototype.getScaled = function(value) {
    var midAmp = 0.5 * (this.y - this.x);
    var middle = (this.x + this.y) * 0.5;
    return new Interval(middle - midAmp * value, middle + midAmp * value);
  };

  /**
   * Returns a new Interval with its start and stop values scaled by the input value,
   * but first pulling out a given proportion of the Interval to Scale.
   *
   * @param {Number} value Value to scale Interval by.
   * @param {Number} proportion of Interval to keep in scaling.
   * @return {Interval} The scaled Interval.
  */
  Interval.prototype.getScaledFromProportion = function(value, proportion) {
    var antiP = 1 - proportion;
    var amp0 = proportion * (this.y - this.x);
    var amp1 = antiP * (this.y - this.x);
    var middle = antiP * this.x + proportion * this.y;
    return new Interval(middle - amp0 * value, middle + amp1 * value);
  };

  /**
  * Adds provided value to the start and stop values of the Interval.
  * Returns the new Interval
  * @param {Number} Number to add to each side of the Interval.
  * @return {Interval} New added Interval.
  */
  Interval.prototype.add = function(value) {
    return new Interval(this.x + value, this.y + value);
  };

  /**
  * Swap start and stop values of this Interval.
  */
  Interval.prototype.invert = function() {
    var swap = this.x;
    this.x = this.y;
    this.y = swap;
  };

  /**
   * Returns a value in interval range
   * 0 -> min
   * 1 -> max
   * @param value between 0 and 1 (to obtain values between min and max)
   *
   */
  Interval.prototype.getInterpolatedValue = function(value) {
    //TODO: should this be unsigned amplitude?
    return value * Number(this.getSignedAmplitude()) + this.x;
  };

  /**
  * Returns a value between 0 and 1 representing the normalized input value in the Interval.
  * @param {Number} value Number to inverse interpolate.
  * @return {Number} Inverse interpolation of input for this Interval.
  */
  Interval.prototype.getInverseInterpolatedValue = function(value) {
    return(value - this.x) / this.getSignedAmplitude();
  };

  /**
  * Interpolates each value in a given NumberList and provides a new NumberList
  * containing the interpolated values.
  *
  * @param {NumberList}  numberList NumberList to interpolate.
  * @return {NumberList} NumberList of interpolated values.
  */
  Interval.prototype.getInterpolatedValues = function(numberList) {
    var newNumberList = [];
    var nElements = numberList.length;
    for(var i = 0; i < nElements; i++) {
      newNumberList.push(this.getInterpolatedValue(numberList[i]));
    }
    return newNumberList;
  };

  /**
  * Inverse Interpolate each value in a given NumberList and provides a new NumberList
  * containing these values.
  *
  * @param {NumberList}  numberList NumberList to inverse interpolate.
  * @return {NumberList} NumberList of inverse interpolated values.
  */
  Interval.prototype.getInverseInterpolatedValues = function(numberList) {
    var newNumberList = [];
    var nElements = numberList.length;
    for(var i = 0; i < nElements; i++) {
      newNumberList.push(this.getInverseInterpolatedValue(numberList[i]));
    }
    return newNumberList;
  };

  /**
  * @todo write docs
  */
  Interval.prototype.intersect = function(interval) {
    return new Interval(Math.max(this.x, interval.x), Math.min(this.y, interval.y));
  };

  /**
   * Create a new interval with the same proporties values
   *
   * @return {Interval} Copied Interval.
   */
  Interval.prototype.clone = function() {
    var newInterval = new Interval(this.x, this.y);
    newInterval.name = name;
    return newInterval;
  };

  /**
   * Indicates if a number is included in the Interval.
   *
   * @param value Number to test.
   * @return {Boolean} True if the value is inside the Interval.
   */
  Interval.prototype.contains = function(value) {
    if(this.y > this.x) return value >= this.x && value <= this.y;
    return value >= this.y && value <= this.y;
  };

  /**
   * Indicates if provided interval contains the same values.
   *
   * @param interval Interval to compare with.
   * @return {Boolean} true if the are the same.
   */
  Interval.prototype.isEquivalent = function(interval) {
    return this.x == interval.x && this.y == interval.y;
  };

  /**
   * Provides a String representation of the Interval.
   *
   * @return {String} String representation.
   *
   */
  Interval.prototype.toString = function() {
    return "Interval[x:" + this.x + "| y:" + this.y + "| amplitude:" + this.getAmplitude() + "]";
  };

  NumberList.prototype = new List();
  NumberList.prototype.constructor = NumberList;

  /**
   * @classdesc List structure for Numbers. Provides basic data type for
   * storing and working with numbers in a List.
   *
   * Additional functions that work on NumberList can be found in:
   * <ul>
   *  <li>Operators:   {@link NumberListOperators}</li>
   *  <li>Conversions: {@link NumberListConversions}</li>
   *  <li>Generators: {@link NumberListGenerators}</li>
   * </ul>
   *
   * @constructor
   * @description Creates a new NumberList.
   * @category numbers
   */
  function NumberList() {
    var args = [];

    for(var i = 0; i < arguments.length; i++) {
      args[i] = Number(arguments[i]);
    }
    var array = List.apply(this, args);
    array = NumberList.fromArray(array);
    return array;
  }
  /**
   * Creates a new NumberList from a raw array of numbers.
   *
   * @param {Number[]} array The array of numbers to create the list from.
   * @param {Boolean} forceToNumber If true, explicitly converts values in array to Numbers.
   * @return {NumberList} New NumberList containing values in array
   */
  NumberList.fromArray = function(array, forceToNumber) {
    forceToNumber = forceToNumber == null ? true : forceToNumber;

    var result = List.fromArray(array);
    var l = result.length;

    if(forceToNumber) {
      for(var i = 0; i < l; i++) {
        result[i] = Number(result[i]);
      }
    }

    result.type = "NumberList";

    //assign methods to array:
    result.unit = NumberList.prototype.unit;
    result.tenPower = NumberList.prototype.tenPower;
    result.getMin = NumberList.prototype.getMin;
    result.getMax = NumberList.prototype.getMax;
    result.getAmplitude = NumberList.prototype.getAmplitude;
    result.getMinMaxInterval = NumberList.prototype.getMinMaxInterval;
    result.getSum = NumberList.prototype.getSum;
    result.getProduct = NumberList.prototype.getProduct;
    result.getInterval = NumberList.prototype.getInterval;
    result.getNumbersSimplified = NumberList.prototype.getNumbersSimplified;

    //statistics
    result.getAverage = NumberList.prototype.getAverage;
    result.getNorm = NumberList.prototype.getNorm;
    result.getStandardDeviation = NumberList.prototype.getStandardDeviation;
    result.getVariance = NumberList.prototype.getVariance;
    result.getMedian = NumberList.prototype.getMedian;
    result.getQuantiles = NumberList.prototype.getQuantiles;

    //sorting
    result.getSorted = NumberList.prototype.getSorted;
    result.getSortIndexes = NumberList.prototype.getSortIndexes;

    //math
    result.factor = NumberList.prototype.factor;
    result.add = NumberList.prototype.add;
    result.subtract = NumberList.prototype.subtract;
    result.divide = NumberList.prototype.divide;
    result.sqrt = NumberList.prototype.sqrt;
    result.pow = NumberList.prototype.pow;
    result.log = NumberList.prototype.log;
    result.floor = NumberList.prototype.floor;
    result.isEquivalent = NumberList.prototype.isEquivalent;

    //transform
    result.approach = NumberList.prototype.approach;

    //override
    result.clone = NumberList.prototype.clone;
    result._slice = Array.prototype.slice;
    result.slice = NumberList.prototype.slice;

    return result;
  };

  NumberList.prototype.unit = "";
  NumberList.prototype.tenPower = 0;

  /**
   * Returns minimum value in the List. Null if the NumberList is empty.
   *
   * @return {Number} The min value.
   */
  NumberList.prototype.getMin = function() {
    //TODO:store result and retrieve while the NumberList doesn't change;
    if(this.length === 0) return null;
    var i;
    var min = this[0];
    for(i = 1; i < this.length; i++) {
      min = Math.min(min, this[i]);
    }
    return min;
  };

  /**
   * Returns maximum value in the List. Null if the NumberList is empty.
   *
   * @return {Number} The max value.
   */
  NumberList.prototype.getMax = function() {
    //TODO:store result and retrieve while the NumberList doesn't change;
    if(this.length === 0) return null;
    var i;
    var max = this[0];
    var l = this.length;
    for(i = 1; i < l; i++) {
      max = Math.max(max, this[i]);
    }
    return max;
  };

  /**
   * Finds the range of the values in the NumberList.
   *
   * @return {Number} The difference between the minimum and maximum value in the List.
   */
  NumberList.prototype.getAmplitude = function() {
    if(this.length === 0) return 0;
    var min = this[0];
    var max = this[0];
    var l = this.length;
    for(var i = 1; i<l; i++) {
      min = Math.min(min, this[i]);
      max = Math.max(max, this[i]);
    }
    return max - min;
  };

  /**
   * Provides the min and max values as an {@link Interval}.
   *
   * @return {Interval} Interval containing the min and max values of the List.
   */
  NumberList.prototype.getMinMaxInterval = function() { //deprecated?
    return new Interval(this.getMin(), this.getMax());
  };

  /**
   * Returns the total sum of values in the NumberList.
   *
   * @return {Number} Sum of all values in the List.
   * tags:
   */
  NumberList.prototype.getSum = function() {
    if(this.length === 0) return 0;
    var i;
    var sum = this[0];
    var l = this.length;
    for(i = 1; i < l; i++) {
      sum += this[i];
    }
    return sum;
  };

  /**
   * Returns the product of values in the NumberList.
   *
   * @return {Number} The product of all values in the NumberList.
   * tags:
   */
  NumberList.prototype.getProduct = function() {
    if(this.length === 0) return null;
    var i;
    var product = this[0];
    var l = this.length;
    for(i = 1; i < l; i++) {
      product *= this[i];
    }
    return product;
  };

  /**
   * Builds an Interval with min and max value from the NumberList
   *
   * @return {Interval} with starting value as the min of the NumberList
   * and ending value as the max.
   * tags:
   */
  NumberList.prototype.getInterval = function() {
    if(this.length === 0) return null;
    var max = this[0];
    var min = this[0];
    var l = this.length;
    for(var i = 1; i<l; i++) {
      max = Math.max(max, this[i]);
      min = Math.min(min, this[i]);
    }
    var interval = new Interval(min, max);
    return interval;
  };




  /**
   * simplifies the numberList either by replacing numbers by its order of magnitude, or by quantiles
   *
   * @param  {Number} method simplification method:<br>0:factors of numbers of magnitude<br>1:number of quantile<br>2:rounded by quantile<br>3:order of magnitude<br>4:rounded by order of magnitude<br>5:sigificant digits (num.toPrecision)
   * @param  {Number} param different meaning according to choosen method:<br>0:number of significant digits<br>1:number of quantiles<br>2:number of quantiles<br>3:no need of param<br>4:no need of param<br>5:number of significant digits
   * @return {NumberList} simplified list
   * tags:
   */
  NumberList.prototype.getNumbersSimplified = function(method, param) {
    var newList;
    var i, j;
    var l = this.length;

    method = method||0;
    param = param||0;

    newList = new NumberList();
    newList.name = this.name;

    switch(method){
      case 0:
        var power = Math.pow(10, param);
        this.forEach(function(val){
          newList.push(Math.floor(val/power)*power);
        });
        break;
      case 1:
      case 2:
        param = Math.min( param||10, Math.floor(this.length/2) );
        var quantiles = this.getQuantiles(param);
        var val;
        var nQuantiles = quantiles.length;
        for(i=0; i<l; i++){
          val = this[i];
          if(val<quantiles[0]){
            method==1?newList.push(0):newList.push(quantiles._min);
          } else {
            for(j=0; j<nQuantiles; j++){
              if( val>=quantiles[j] && (j+1==quantiles.length || val<quantiles[j+1]) ){
                method==1?newList.push(j+1):newList.push(quantiles[j]);
                break;
              }
            }
          }
        }
        if(method==1) newList.name = this.name + " (n quantile)";
        break;
      case 3:
        newList.name = this.name + " (order of magnitude)";
        for(i=0; i<l; i++){
          newList.push(Math.floor( Math.log(this[i])/Math.log(10) ));
        }
        // this.forEach(function(val){
        //   newList.push(Math.floor( Math.log(val)/Math.log(10) ));
        // });
        break;
      case 4:
        newList.name = this.name + " (rounded by order of magnitude)";
        for(i=0; i<l; i++){
          newList.push( Math.pow ( 10, Math.floor( Math.log(this[i])/Math.log(10) ) ) );
        }
        // this.forEach(function(val){
        //   newList.push( Math.pow ( 10, Math.floor( Math.log(val)/Math.log(10) ) ) );
        // });
        break;
      case 5:
        param = param||1;
        newList.name = this.name + " (significant digits)";
        for(i=0; i<l; i++){
          newList.push( Number(this[i].toPrecision(param)) );
        }
        break;
    }

    return newList;
  };


  /**
   * Builds an {@link Polygon} from the NumberList,
   * using each consecutive pair of values in the numberList as
   * x and y positions.
   *
   * @return {Polygon} Polygon representing the values
   * in the NumberList as x/y coordinates.
   */
  NumberList.prototype.toPolygon = function() {
    if(this.length === 0) return null;
    var polygon = new Polygon();
    for(var i = 0; this[i + 1] != null; i += 2) {
      polygon.push(new Point(this[i], this[i + 1]));
    }
    return polygon;
  };


  /////////statistics

  /**
   * Calculates mean of the NumberList.
   *
   * @return {Number} Mean of all values in the List.
   * tags:statistics
   */
  NumberList.prototype.getAverage = function() {
    return this.getSum()/this.length;
  };

  /**
   * Calculates the geometric mean of the NumberList.
   *
   * @return {Number}
   * tags:statistics
   */
  NumberList.prototype.getGeometricMean = function() {
    var s = 0;
    //this.forEach(function(val) {
    var l = this.length;
    for(var i = 0; i<l; i++) {
      s += Math.log(this[i]);
    }
    return Math.pow(Math.E, s / this.length);
  };

  /**
   * Calculates the norm of the NumberList (treated as a vector).
   *
   * @return {Number}
   * tags:statistics
   */
  NumberList.prototype.getNorm = function() {
    var sq = 0;
    var l = this.length;
    for(var i = 0; i<l; i++) {
      sq += Math.pow(this[i], 2);
    }
    return Math.sqrt(sq);
  };

  /**
   * Calculates the variance of the NumberList.
   *
   * @return {Number}
   * tags:statistics
   */
  NumberList.prototype.getVariance = function() {
    var sd = 0;
    var average = this.getAverage();
    var l = this.length;
    for(var i = 0; i<l; i++) {
      sd += Math.pow(this[i] - average, 2);
    }
    return sd / this.length;
  };

  /**
   * Calculates the standard deviation.
   *
   * @return {Number}
   * tags:statistics
   */
  NumberList.prototype.getStandardDeviation = function() {
    return Math.sqrt(this.getVariance());
  };

  /**
   * Calculates the median of the numberList
   *
   * @return {Number}
   * tags:statistics
   */
  NumberList.prototype.getMedian = function() {
    var sorted = this.getSorted(true);
    var prop = (this.length - 1) / 2;
    var entProp = Math.floor(prop);
    var onIndex = prop == entProp;
    return onIndex ? sorted[prop] : (0.5 * sorted[entProp] + 0.5 * sorted[entProp + 1]);
  };

  /**
   * Builds a partition of n quantiles from the numberList.
   *
   * @param {Number} nQuantiles number of quantiles (the size of the resulting list is nQuantiles-1)
   * @return {NumberList} A number list of the quantiles.
   * tags:statistics
   */
  NumberList.prototype.getQuantiles = function(nQuantiles) {//TODO: defines different options for return
    var sorted = this.getSorted(true);
    var prop = this.length / nQuantiles;
    var entProp = Math.floor(prop);
    var onIndex = prop == entProp;
    var quantiles = new NumberList();

    for(var i = 0; i < nQuantiles - 1; i++) {
      quantiles[i] = onIndex ? sorted[(i + 1) * prop] : (0.5 * sorted[(i + 1) * entProp] + 0.5 * sorted[(i + 1) * entProp + 1]);
    }

    quantiles._sorted = sorted;
    quantiles._min = sorted[0];
    quantiles._max = sorted[sorted.length-1];

    return quantiles;
  };

  /////////sorting

  /**
   * Returns a new NumberList sorted in either ascending or descending order.
   *
   * @param {Boolean} ascending True if values should be sorted in ascending order.
   * If false, values will be sorted in descending order.
   * @return {NumberList} new sorted NumberList.
   */
  NumberList.prototype.getSorted = function(ascending) {
    ascending = ascending == null ? true : ascending;

    if(ascending) {
      return NumberList.fromArray(this.slice().sort(function(a, b) {
        return a - b;
      }), false);
    }
    return NumberList.fromArray(this.slice().sort(function(a, b) {
      return b - a;
    }), false);
  };

  /**
   * Returns a new NumberList containing the indicies of the values of
   * the original NumberList in sorted order.
   *
   * @param {Boolean} descending If true, values are sorted in descending order.
   * @return {NumberList} NumberList containing the indices of the original NumberList
   * such that accessing the values of the original list at those indices would produce
   * a sorted list.
   * @example
   * var nl = NumberList.fromArray([1,3,2]);
   * var indices = nl.getSortIndexes();
   * indices[0]; // produces 1 as nl[1] == 3.
   */
  NumberList.prototype.getSortIndexes = function(descending) {
    if(descending == null) descending = true;

    var pairs = [];
    var newList = new NumberList();
    var l = this.length;

    if(this.length === 0) return newList;

    for(var i = 0; i<l; i++) {
      pairs.push([i, this[i]]);
    }

    if(descending) {
      pairs.sort(function(a, b) {
        if(a[1] < b[1]) return 1;
        return -1;
      });
    } else {
      pairs.sort(function(a, b) {
        if(a[1] < b[1]) return -1;
        return 1;
      });
    }

    for(i = 0; pairs[i] != null; i++) {
      newList.push(pairs[i][0]);
    }
    newList.name = this.name;
    return newList;
  };

  /**
   * Returns a new NumberList with the values of
   * the original list multiplied by the input value
   *
   * @param {Number} value The value to multiply each
   * value in the list by.
   * @return {NumberList} New NumberList with values multiplied.
   */
  NumberList.prototype.factor = function(value) {
    var i;
    var newNumberList = new NumberList();
    var l = this.length;
    for(i = 0; i < l; i++) {
      newNumberList.push(this[i] * value);
    }
    newNumberList.name = this.name;
    return newNumberList;
  };

  /**
   * Adds a value or values in a NumberList to the current list.
   *
   * If input is a Number, each value of the returned
   * NumberList will be the sum of the original value and this
   * input value.
   *
   * If the input is a NumberList, each value of the returned
   * NumberList will be the sum of the original value and the
   * value at the same index in the input list.
   *
   * @param {Number|NumberList} object Input value to add to the list.
   * @return {NumberList}
   */
  NumberList.prototype.add = function(object) {
    var i;
    var newNumberList = new NumberList();
    var type = typeOf(object);
    var l = this.length;

    switch(type) {
      case 'number':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] + object;
        }
        break;
      case 'NumberList':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] + object[i % object.length];
        }
        break;
    }

    newNumberList.name = this.name;
    return newNumberList;
  };

  /**
   * Subtracts a value or values in a NumberList from the current list.
   *
   * If input is a Number, each value of the returned
   * NumberList will be the original value minus this
   * input value.
   *
   * If the input is a NumberList, each value of the returned
   * NumberList will be the original value minus the
   * value at the same index in the input list.
   *
   * @param {Number|NumberList} object Input value to subract from the list.
   * @return {NumberList}
   */
  NumberList.prototype.subtract = function(object) {
    var i;
    var newNumberList = new NumberList();
    var type = typeOf(object);
    var l = this.length;

    switch(type) {
      case 'number':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] - object;
        }
        break;
      case 'NumberList':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] - object[i % object.length];
        }
        break;
    }

    newNumberList.name = this.name;
    return newNumberList;
  };

  /**
   * Returns a new NumberList with each value divided by a input value or values in a NumberList.
   *
   * If input is a Number, each value of the returned
   * NumberList will be the original value divided by this
   * input value.
   *
   * If the input is a NumberList, each value of the returned
   * NumberList will be the original value divided by the
   * value at the same index in the input list.
   *
   * @param {Number|NumberList} object Input value to divide by the list.
   * @return {NumberList}
   */
  NumberList.prototype.divide = function(object) {
    var i;
    var newNumberList = new NumberList();
    var type = typeOf(object);
    var l = this.length;

    switch(type) {
      case 'number':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] / object;
        }
        break;
      case 'NumberList':
        for(i = 0; i<l; i++) {
          newNumberList[i] = this[i] / object[i % object.length];
        }
        break;
    }

    newNumberList.name = this.name;
    return newNumberList;
  };


  /**
   * Returns a new NumberList containing the square root of
   * the values of the current NumberList.
   *
   * @return {NumberList} NumberList with square rooted values.
   */
  NumberList.prototype.sqrt = function() {
    var i;
    var newNumberList = new NumberList();
    var l = this.length;

    for(i = 0; i < l; i++) {
      newNumberList.push(Math.sqrt(this[i]));
    }
    newNumberList.name = this.name;
    return newNumberList;
  };

  /**
   * Returns a new NumberList containing values raised to the power
   * of the input value.
   *
   * @param {Number} power Power to raise each value by.
   * @return {NumberList} New NumberList.
   */
  NumberList.prototype.pow = function(power) {
    var i;
    var newNumberList = new NumberList();
    var l = this.length;
    for(i = 0; i < l; i++) {
      newNumberList.push(Math.pow(this[i], power));
    }
    newNumberList.name = this.name;
    return newNumberList;
  };

  /**
   * Returns a transformed version of the list with
   * each value in the new list the log of the value
   * in the current list, with an optional constant
   * added to it.
   *
   * @param {Number} add Optional value to add to the log transformed values.
   * Defaults to 0.
   * @return {NumberList}
   */
  NumberList.prototype.log = function(add) {
    add = add || 0;

    var i;
    var newNumberList = new NumberList();
    var l = this.length;
    for(i = 0; i<l; i++) {
      newNumberList[i] = Math.log(this[i] + add);
    }
    newNumberList.name = this.name;

    return newNumberList;
  };

  /**
   * Returns a new NumberList containing the floor values (removing decimals) of
   * the values of the current NumberList.
   *
   * @return {NumberList} NumberList with integer values.
   */
  NumberList.prototype.floor = function() {
    var i;
    var newNumberList = new NumberList();
    var l = this.length;
    for(i = 0; i < l; i++) {
      newNumberList.push(Math.floor(this[i]));
    }
    newNumberList.name = this.name;

    return newNumberList;
  };

  /**
   * @todo write docs
   */
  NumberList.prototype.approach = function(destinty, speed) {
    speed = speed || 0.5;

    var i;
    var antispeed = 1 - speed;

    for(i = 0; this[i] != null; i++) {
      this[i] = antispeed * this[i] + speed * destinty[i];
    }
  };

  /**
   * Returns true if values in the input NumberList are the same
   * as the values in the current list.
   *
   * @param numberList2 Second NumberList to compare.
   * @return {Boolean} True if all values in both lists match.
   */
  NumberList.prototype.isEquivalent = function(numberList) {
    var l = this.length;
    if(numberList.length != l) {
      return false;
    }
    for(var i = 0; i<l; i++) {
      if(this[i] != numberList[i]) return false;
    }
    return true;
  };

  //transform

  NumberList.prototype.approach = function(destinty, speed) {
    speed = speed || 0.5;

    var i;
    var antispeed = 1 - speed;
    var l = this.length;

    for(i = 0; i<l; i++) {
      this[i] = antispeed * this[i] + speed * destinty[i];
    }
    return true;
  };

  ///////overriding

  /**
   * @todo write docs
   */
  NumberList.prototype.clone = function() {
    var newList = NumberList.fromArray(this._slice(), false);
    newList.name = this.name;
    return newList;
  };

  /**
   * @todo write docs
   */
  NumberList.prototype.slice = function() {
    return NumberList.fromArray(this._slice.apply(this, arguments), false);
  };

  DateList.prototype = new List();
  DateList.prototype.constructor = DateList;

  /**
   * @classdesc A {@link List} for storing Dates.
   *
   * Additional functions that work on DateList can be found in:
   * <ul>
   *  <li>Operators:   {@link DateListOperators}</li>
   *  <li>Conversions: {@link DateListConversions}</li>
   * </ul>
   *
   * @description Creates a new DateList.
   * @constructor
   * @category dates
   */
  function DateList() {
    var args = [];
    for(var i = 0; i < arguments.length; i++) {
      args[i] = Number(arguments[i]);
    }
    var array = List.apply(this, args);
    array = DateList.fromArray(array);
    //
    return array;
  }
  /**
  * @todo write docs
  */
  DateList.fromArray = function(array, forceToDate) {
    forceToDate = forceToDate == null ? true : forceToDate;
    var result = List.fromArray(array);

    if(forceToDate) {
      for(var i = 0; i < result.length; i++) {
        result[i] = new Date(result[i]);
      }
    }

    result.type = "DateList";
    //assign methods to array:
    result.getTimes = DateList.prototype.getTimes;
    result.getMin = DateList.prototype.getMin;
    result.getMax = DateList.prototype.getMax;
    return result;
  };

  /**
   * get a numberList of time (milliseconds) values
   * @return {NumberList}
   * tags:conversor
   */
  DateList.prototype.getTimes = function() {
    var i;
    var numberList = new NumberList();
    for(i = 0; this[i] != null; i++) {
      numberList.push(this[i].getTime());
    }
    return numberList;
  };



  /**
  * @todo write docs
  */
  DateList.prototype.getMin = function() {
    if(this.length === 0) return null;
    var min = this[0];
    var i;
    for(i = 1; this[i] != null; i++) {
      min = min < this[i] ? min : this[i];
    }
    return min;
  };

  /**
  * @todo write docs
  */
  DateList.prototype.getMax = function() {
    if(this.length === 0) return null;
    var max = this[0];
    var i;
    for(i = 1; this[i] != null; i++) {
      max = max > this[i] ? max : this[i];
    }
    return max;
  };

  Polygon3D.prototype = new List();
  Polygon3D.prototype.constructor = Polygon3D;

  /**
   * @classdesc Polygon3D brings the {@link Polygon} concept into three
   * dimensions through the use of {@link Point3D}.
   *
   * @description Creates a new Polygon3D.
   * @constructor
   * @category geometry
   */
  function Polygon3D() {
    var array = List.apply(this, arguments);
    array = Polygon3D.fromArray(array);
    return array;
  }
  /**
   * @todo write docs
   */
  Polygon3D.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "Polygon3D";
    //assign methods to array:
    return result;
  };

  Rectangle.prototype = new DataModel();
  Rectangle.prototype.constructor = Rectangle;

  /**
   * @classdesc Rectangle shape with x, y, width, and height.
   *
   * @description Creates a new Rectangle.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} width
   * @param {Number} height
   * @constructor
   * @category geometry
   */
  function Rectangle(x, y, width, height) {
    DataModel.apply(this);
    this.name = "";
    this.type = "Rectangle";
    this.x = Number(x) || 0;
    this.y = Number(y) || 0;
    this.width = Number(width) || 0;
    this.height = Number(height) || 0;
  }
  /**
   * Gets the position of the top right corner of the Rectangle.
   * @return {Number} Top-right corner.
   */
  Rectangle.prototype.getRight = function() {
    return this.x + this.width;
  };

  /**
   * Gets the position of the bottom left corner of the Rectangle.
   * @return {Number} Bottom-left corner.
   */
  Rectangle.prototype.getBottom = function() {
    return this.y + this.height;
  };

  /**
   * Sets the position of the top right corner of the Rectangle by reducing the
   * width of the Rectangle to set it to the input value.
   * @param {Number} New value of Top-right corner.
   */
  Rectangle.prototype.setRight = function(value) {
    this.width = value - this.x;
  };

  /**
   * Sets the position of the bottom left corner of the Rectangle by reducing the
   * height of the Rectangle to set it to the input value.
   * @param {Number} New value of bottom-left corner.
   */
  Rectangle.prototype.setBottom = function(value) {
    this.height = value - this.y;
  };

  /**
   * Gets the position of the top left corner of the Rectangle as a {@link Point}.
   * @return {Point} Top-Left corner.
   */
  Rectangle.prototype.getTopLeft = function() {
    return new _Point(this.x, this.y);
  };

  /**
   * Gets the position of the top right corner of the Rectangle as a {@link Point}.
   * @return {Point} Top-Right corner.
   */
  Rectangle.prototype.getTopRight = function() {
    return new _Point(this.x + this.width, this.y);
  };

  /**
   * Gets the position of the bottom right corner of the Rectangle as a {@link Point}.
   * @return {Point} Bottom-Right corner.
   */
  Rectangle.prototype.getBottomRight = function() {
    return new _Point(this.x + this.width, this.y + this.height);
  };

  /**
   * Gets the position of the bottom left corner of the Rectangle as a {@link Point}.
   * @return {Point} Bottom-Left corner.
   */
  Rectangle.prototype.getBottomLeft = function() {
    return new _Point(this.x, this.y + this.height);
  };

  /**
   * Gets the position of the middle of the Rectangle as a {@link Point}.
   * @return {Point} Center of Rectangle
   */
  Rectangle.prototype.getCenter = function() {
    return new _Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
  };

  /**
   * Returns a random {@link Point} constrained to be within the bounds of the Rectangle.
   * @return {Point} Random Point in Rectangle.
   */
  Rectangle.prototype.getRandomPoint = function() {
    return new _Point(this.x + Math.random() * this.width, this.y + Math.random() * this.height);
  };

  /**
   * Returns a Rectangle that is the overlap of this Rectangle and the input Rectangle.
   * @param {Rectangle} rectangle Rectangle to overlap on this Rectangle.
   * @return {Rectangle} Overlaping area of the two as a Rectangle.
   */
  Rectangle.prototype.getIntersection = function(rectangle) {
    if(rectangle.x + rectangle.width < this.x || rectangle.x > this.x + this.width || rectangle.y + rectangle.height < this.y || rectangle.y > this.y + this.height) return null;
    var xR = Math.max(rectangle.x, this.x);
    var yR = Math.max(rectangle.y, this.y);
    return new Rectangle(xR, yR, Math.min(rectangle.x + rectangle.width, this.x + this.width) - xR, Math.min(rectangle.y + rectangle.height, this.y + this.height) - yR);
  };

  /**
   * Returns a new Rectangle that is the interpolation between the current Rectangle
   * and the given Rectangle at some time t. The input t is a value between 0 and 1.
   * @param {Rectangle} rectangle Rectangle to interpolate to.
   * @return {Rectangle} Overlaping area of the two as a Rectangle.
   */
  Rectangle.prototype.interpolate = function(rectangle, t) {
    var mint = 1 - t;
    return new Rectangle(mint * this.x + t * rectangle.x, mint * this.y + t * rectangle.y, mint * this.width + t * rectangle.width, mint * this.height + t * rectangle.height);
  };

  /**
   * Returns the width / height ratio.
   * @return {Number} ratio of the Rectangle.
   */
  Rectangle.prototype.getRatio = function() {
    return Math.max(this.width, this.height) / Math.min(this.width, this.height);
  };

  /**
   * Returns the width * height area of the Rectangle
   * @return {Number} area of the Rectangle.
   */
  Rectangle.prototype.getArea = function() {
    return this.width * this.height;
  };

  /**
   * Checks if a Point is within the bounds of this Rectangle.
   * @param  {Point} point Point to check.
   * @return {Boolean} true if Point is in Rectangle.
   * tags:geometry
   */
  Rectangle.prototype.containsPoint = function(point) {
    return(this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
  };


  /**
   * Checks if a Point is on the border of the Rectangle within some margin.
   * @param  {Point} point Point to check.
   * @param  {Number} margin Area around border to include in the 'border' of the Rectangle.
   * @return {Boolean} true if Point is on the border.
   * tags:geometry
   */
  Rectangle.prototype.pointIsOnBorder = function(point, margin) {
    margin = margin == null ? 1 : margin;
    if(point.x >= this.x - margin && point.x <= this.x + this.width + margin) {
      if(point.y >= this.y - margin && point.y <= this.y + margin) return true;
      if(point.y >= this.y + this.height - margin && point.y <= this.y + this.height + margin) return true;
      if(point.y >= this.y - margin && point.y <= this.y + this.height + margin) {
        if(point.x < this.x + margin || point.x > this.x + this.width - margin) return true;
      }
    }
    return false;
  };

  /**
   * Creates a new Rectangle from this Rectangle which has no negative values for
   * width and height.
   * @return {Rectangle} new Normalized Rectangle.
   */
  Rectangle.prototype.getNormalRectangle = function() {
    return new Rectangle(Math.min(this.x, this.x + this.width), Math.min(this.y, this.y + this.height), Math.abs(this.width), Math.abs(this.height));
  };

  /**
   * Returns true if provided Rectangle overlaps this Rectangle.
   * @param  {Rectangle} rectangle Rectangle to check.
   * @return {Boolean} true if the two Rectangles overlap.
   * tags:geometry
   */
  Rectangle.prototype.intersectsRectangle = function(rectangle) {
    return (this.x + this.width >= rectangle.x) && (this.y + this.height >= rectangle.y) && (rectangle.x + rectangle.width >= this.x) && (rectangle.y + rectangle.height >= this.y);
  };

  /**
   * Expands Rectangle by multiplying dimensions by the given expansion around a
   * given center point. If no center point is provided, the new Rectangle is
   * expanded around the center of the current Rectangle.
   * @param {Number} expansion Factor to expand by.
   * @param {Point} centerPoint Center point of the expansion. Center of Rectangle by default.
   * @return {Rectangle} Expanded Rectangle.
   */
  Rectangle.prototype.expand = function(expansion, centerPoint) {
    centerPoint = centerPoint || new _Point(this.x + 0.5 * this.width, this.y + 0.5 * this.height);
    return new Rectangle((this.x - centerPoint.x) * expansion + centerPoint.x, (this.y - centerPoint.y) * expansion + centerPoint.y, this.width * expansion, this.height * expansion);
  };

  /**
   * Returns true if this Rectangle is equal to the provided Rectangle.
   * @param  {Rectangle} rectangle Rectangle to compare.
   * @return {Boolean} true if two Rectangles are equal.
   */
  Rectangle.prototype.isEqual = function(rectangle) {
    return this.x == rectangle.x && this.y == rectangle.y && this.width == rectangle.width && this.height == rectangle.height;
  };

  /**
   * Returns copy of this Rectangle.
   * @return {Rectangle} Copy of this Rectangle.
   */
  Rectangle.prototype.clone = function() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  };

  /**
  * Provides a string representation of the Rectangle.
  * @return {String} string output.
  */
  Rectangle.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ", w=" + this.width + ", h=" + this.height + ")";
  };

  /**
   * Deletes Rectangle.
   */
  Rectangle.prototype.destroy = function() {
    delete this.x;
    delete this.y;
    delete this.width;
    delete this.height;
  };

  _Polygon.prototype = new List();
  _Polygon.prototype.constructor = _Polygon;

  /**
   * @classdesc A Polygon is a shape created from a list of {@link Point|Points}.
   *
   * @description Creates a new Polygon.
   * @constructor
   * @category geometry
   */
  function _Polygon() {
    var array = List.apply(this, arguments);
    array = _Polygon.fromArray(array);
    return array;
  }
  /**
  * @todo write docs
  */
  _Polygon.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "Polygon";

    result.getFrame = _Polygon.prototype.getFrame;
    result.getBarycenter = _Polygon.prototype.getBarycenter;
    result.add = _Polygon.prototype.add;
    result.factor = _Polygon.prototype.factor;
    result.getRotated = _Polygon.prototype.getRotated;
    result.getClosestPoint = _Polygon.prototype.getClosestPoint;
    result.toNumberList = _Polygon.prototype.toNumberList;
    result.containsPoint = _Polygon.prototype.containsPoint;
    //transform
    result.approach = _Polygon.prototype.approach;
    //override
    result.clone = _Polygon.prototype.clone;

    return result;
  };


  /**
  * @todo write docs
  */
  _Polygon.prototype.getFrame = function() {
    if(this.length === 0) return null;
    var rectangle = new Rectangle(this[0].x, this[0].y, this[0].x, this[0].y);
    var p;
    for(var i = 1; this[i] != null; i++) {
      p = this[i];
      rectangle.x = Math.min(rectangle.x, p.x);
      rectangle.y = Math.min(rectangle.y, p.y);
      rectangle.width = Math.max(rectangle.width, p.x);
      rectangle.height = Math.max(rectangle.height, p.y);
    }

    rectangle.width -= rectangle.x;
    rectangle.height -= rectangle.y;

    return rectangle;
  };

  /**
  * @todo write docs
  */
  _Polygon.prototype.getBarycenter = function(countLastPoint) {
    var i;
    countLastPoint = countLastPoint == null ? true : countLastPoint;
    var cLPN = 1 - Number(countLastPoint);
    if(this.length === 0) return null;
    var barycenter = new _Point(this[0].x, this[0].y);
    for(i = 1; this[i + cLPN] != null; i++) {
      barycenter.x += this[i].x;
      barycenter.y += this[i].y;
    }
    barycenter.x /= this.length;
    barycenter.y /= this.length;
    return barycenter;
  };

  /**
  * @todo write docs
  */
  _Polygon.prototype.add = function(object) {
    var type = typeOf(object);
    var i;
    switch(type) {
      case 'Point':
        var newPolygon = new _Polygon();
        for(i = 0; this[i] != null; i++) {
          newPolygon[i] = this[i].add(object);
        }
        newPolygon.name = this.name;
        return newPolygon;
    }
  };

  /**
   * scales the polygon by a number or a Point
   * @param  {Object} value number or point
   * @return {Polygon}
   * tags:
   */
  _Polygon.prototype.factor = function(value) {
    var i;
    var newPolygon = new _Polygon();
    newPolygon.name = this.name;

    if(value >= 0 || value < 0) {
      for(i = 0; this[i] != null; i++) {
        newPolygon[i] = new _Point(this[i].x * value, this[i].y * value);
      }

      return newPolygon;
    } else if(value.type != null && value.type == 'Point') {
      for(i = 0; this[i] != null; i++) {
        newPolygon[i] = new _Point(this[i].x * value.x, this[i].y * value.y);
      }

      return newPolygon;
    }

    return null;
  };


  /**
  * @todo write docs
  */
  _Polygon.prototype.getRotated = function(angle, center) {
    center = center == null ? new _Point() : center;

    var newPolygon = new _Polygon();
    for(var i = 0; this[i] != null; i++) {
      newPolygon[i] = new _Point(Math.cos(angle) * (this[i].x - center.x) - Math.sin(angle) * (this[i].y - center.y) + center.x, Math.sin(angle) * (this[i].x - center.x) + Math.cos(angle) * (this[i].y - center.y) + center.y);
    }
    newPolygon.name = this.name;
    return newPolygon;
  };

  /**
   * @todo write docs
   */
  _Polygon.prototype.getClosestPoint = function(point) {
    var closest = this[0];
    var d2Min = Math.pow(point.x - closest.x, 2) + Math.pow(point.y - closest.y, 2);
    var d2;

    for(var i = 1; this[i] != null; i++) {
      d2 = Math.pow(point.x - this[i].x, 2) + Math.pow(point.y - this[i].y, 2);
      if(d2 < d2Min) {
        d2Min = d2;
        closest = this[i];
      }
    }
    return closest;
  };

  /**
   * @todo write docs
   */
  _Polygon.prototype.toNumberList = function() {
    var numberList = new NumberList();
    var i;
    for(i = 0; this[i] != null; i++) {
      numberList[i * 2] = this[i].x;
      numberList[i * 2 + 1] = this[i].y;
    }
    return numberList;
  };

  /**
  * @todo write docs
  * Thanks http://jsfromhell.com/math/is-point-in-poly AND http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  */
  _Polygon.prototype.containsPoint = function(point) {
    var i;
    var j;
    var l;
    var c;
    for(c = false, i = -1, l = this.length, j = l - 1; ++i < l; j = i)
          ((this[i].y <= point.y && point.y < this[j].y) || (this[j].y <= point.y && point.y < this[i].y)) &&
          (point.x < (this[j].x - this[i].x) * (point.y - this[i].y) / (this[j].y - this[i].y) + this[i].x) &&
          (c = !c);
    return c;
  };

  //transform

  /**
   * @todo write docs
   */
  _Polygon.prototype.approach = function(destiny, speed) {
    speed = speed || 0.5;
    var antispeed = 1 - speed;

    this.forEach(function(point, i) {
      point.x = antispeed * point.x + speed * destiny[i].x;
      point.y = antispeed * point.y + speed * destiny[i].y;
    });
  };


  /**
   * @todo write docs
   */
  _Polygon.prototype.clone = function() {
    var newPolygon = new _Polygon();
    for(var i = 0; this[i] != null; i++) {
      newPolygon[i] = this[i].clone();
    }
    newPolygon.name = this.name;
    return newPolygon;
  };

  //

  Table.prototype = new List();
  Table.prototype.constructor = Table;

  /**
   * @classdesc A sub-class of {@link List}, Table provides a 2D array-like structure.
   *
   * Each column is stored as its own {@link List}, making it a List of Lists.
   * Cells in the table can be accessed using table[column][row].
   *
   * Additional functions that work on Table can be found in:
   * <ul>
   *  <li>Operators:   {@link TableOperators}</li>
   *  <li>Conversions: {@link TableConversions}</li>
   *  <li>Generators: {@link TableGenerators}</li>
   *  <li>Encodings: {@link TableEncodings}</li>
   * </ul>
   *
   * @description Creates a new Table.
   * Input arguments are treated as the inital column values
   * of the Table.
   * @constructor
   * @category basics
   */
  function Table() {
    var args = [];
    var i;
    var nArgs = arguments.length;

    for(i = 0; i < nArgs; i++) {
      args[i] = new List(arguments[i]);
    }

    var array = List.apply(this, args);
    array = Table.fromArray(array);

    return array;
  }
  /**
   * Creates a new Table from an array
   * @param {Number[]} array
   * @return {Table}
   */
  Table.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "Table";
    //assign methods to array:
    result.applyFunction = Table.prototype.applyFunction;
    result.getRow = Table.prototype.getRow;
    result.getRows = Table.prototype.getRows;
    result.getLengths = Table.prototype.getLengths;
    result.getListLength = Table.prototype.getListLength;
    result.sliceRows = Table.prototype.sliceRows;
    result.getSubListsByIndexes = Table.prototype.getSubListsByIndexes;
    result.getWithoutRow = Table.prototype.getWithoutRow;
    result.getWithoutRows = Table.prototype.getWithoutRows;
    result.getTransposed = Table.prototype.getTransposed;
    result.getListsSortedByList = Table.prototype.getListsSortedByList;
    result.sortListsByList = Table.prototype.sortListsByList;
    result.clone = Table.prototype.clone;
    result.print = Table.prototype.print;

    //transformative
    result.removeRow = Table.prototype.removeRow;

    //overiden
    result.destroy = Table.prototype.destroy;

    result.isTable = true;

    return result;
  };


  /**
   * Executes a given function on all the columns
   * in the Table, returning a new Table with the
   * resulting values.
   * @param {Function} func Function to apply to each
   * column in the table. Columns are {@link List|Lists}.
   * @return {Table} Table of values from applying function.
   */
  Table.prototype.applyFunction = function(func) {
    //TODO: to be tested!
    var i;
    var newTable = new Table();

    newTable.name = this.name;

    for(i = 0; this[i] != null; i++) {
      newTable[i] = this[i].applyFunction(func);
    }
    return newTable.getImproved();
  };

  /**
   * Returns a {@link List} with all the elements of a row.
   * @param  {Number} index Index of the row to get.
   * @return {List}
   * tags:filter
   */
  Table.prototype.getRow = function(index) {
    var list = new List();
    var i;
    var l = this.length;

    for(i = 0; i < l; i++) {
      list[i] = this[i][index];
    }
    return list.getImproved();
  };

  /**
   * Returns the length a column of the Table.
   * @param  {Number} index The Column to return its length.
   * Defaults to 0.
   * @return {Number} Length of column at given index.
   * tags:
   */
  Table.prototype.getListLength = function(index) {
    return this[index || 0].length;
  };

  /**
   * Returns the lengths of all the columns of the Table.
   * @return {NumberList} Lengths of all columns in Table.
   */
  Table.prototype.getLengths = function() {
    var lengths = new NumberList();
    var l = this.length;

    for(var i = 0; i<l; i++) {
      lengths[i] = this[i].length;
    }
    return lengths;
  };

  /**
   * Filters a Table by selecting a section of rows, elements with last index included.
   * @param  {Number} startIndex Index of first element in all lists of the table.
   * @param  {Number} endIndex Index of last elements in all lists of the table.
   * @return {Table}
   * tags:filter
   */
  Table.prototype.sliceRows = function(startIndex, endIndex) {
    endIndex = endIndex == null ? (this[0].length - 1) : endIndex;

    var i;
    var newTable = new Table();
    var newList;
    var l = this.length;

    newTable.name = this.name;
    for(i = 0; i<l; i++) {
      newList = this[i].getSubList(startIndex, endIndex);
      newList.name = this[i].name;
      newTable.push(newList);
    }
    return newTable.getImproved();
  };

  /**
   * Filters the lists of the table by indexes.
   * @param  {NumberList} indexes
   * @return {Table}
   * tags:filter
   */
  Table.prototype.getSubListsByIndexes = function(indexes) {
    var newTable = new Table();
    var i;
    var l = this.length;

    for(i=0; i<l; i++){
      newTable.push(this[i].getSubListByIndexes(indexes));
    }
    // this.forEach(function(list) {
    //   newTable.push(list.getSubListByIndexes(indexes));
    // });
    return newTable.getImproved();
  };


  //deprecated
  /**
   * @ignore
   */
  Table.prototype.getRows = function(indexes) {
    return Table.prototype.getSubListsByIndexes(indexes);
  };

  /**
   * Returns a new Table with the row at the given index removed.
   * @param {Number} rowIndex Row to remove
   * @return {Table} New Table.
   * tags:filter
   */
  Table.prototype.getWithoutRow = function(rowIndex) {
    var newTable = new Table();
    var l = this.length;
    newTable.name = this.name;
    for(var i = 0; i<l; i++) {
      newTable[i] = List.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex + 1))).getImproved();
      newTable[i].name = this[i].name;
    }
    return newTable.getImproved();
  };

  /**
   * Returns a new Table with the rows listed in the given numberList removed.
   * @param {NumberList} rowsIndexes numberList of row indexes to remove.
   * @return {Table}
   * tags:filter
   */
  Table.prototype.getWithoutRows = function(rowsIndexes) {// @todo improve efficiency by building dictionary and not using indexOf
    var newTable = new Table();
    var l = this.length;
    var nElements;
    newTable.name = this.name;
    for(var i = 0; i<l; i++) {
      newTable[i] = new List();
      nElements = this[i].length;
      for(var j = 0; j<nElements; j++) {
        if(rowsIndexes.indexOf(j) == -1) newTable[i].push(this[i][j]);
      }
      newTable[i].name = this[i].name;
    }
    return newTable.getImproved();
  };


  /**
   * Sort Table's lists by a list
   * @param  {List|Number} listOrIndex List used to sort, or index of list in the table
   *
   * @param  {Boolean} ascending (true by default)
   * @return {Table} table (of the same type)
   * tags:sort
   */
  Table.prototype.getListsSortedByList = function(listOrIndex, ascending) { //depracated: use sortListsByList
    if(listOrIndex == null) return;
    var newTable = instantiateWithSameType(this);
    var sortinglist = listOrIndex.isList ? listOrIndex.clone() : this[listOrIndex];

    this.forEach(function(list) {
      newTable.push(list.getSortedByList(sortinglist, ascending));
    });

    return newTable;
  };

  /**
   * Transposes Table.
   * @param firstListAsHeaders
   * @return {Table}
   */
  Table.prototype.getTransposed = function(firstListAsHeaders) {

    var tableToTranspose = firstListAsHeaders ? this.getSubList(1) : this;
    var l = tableToTranspose.length;
    var nElements;

    var table = instantiate(typeOf(tableToTranspose));
    if(tableToTranspose.length === 0) return table;
    var i;
    var j;
    var list;

    for(i = 0; i<l; i++) {
      list = tableToTranspose[i];
      nElements = list.length;
      for(j = 0; j<nElements; j++) {
        if(i === 0) table[j] = new List();
        table[j][i] = tableToTranspose[i][j];
      }
    }

    nElements = tableToTranspose[0].length;
    for(j = 0; j<nElements; j++) {
      table[j] = table[j].getImproved();
    }

    if(firstListAsHeaders) {
      nElements = this[0].length;
      for(j = 0; j<nElements; j++) {
        table[j].name = String(this[0][j]);
      }
      // this[0].forEach(function(name, i) {
      //   table[i].name = String(name);
      // });
    }

    return table;
  };


  /**
   * removes a row from the table.
   * @param {Number} index The row to remove.
   * @return {undefined}
   */
  Table.prototype.removeRow = function(index) {
    for(var i = 0; this[i] != null; i++) {
      this[i].splice(index, 1);
    }
  };

  /**
   * makes a copy of the Table.
   * @return {Table} Copy of table.
   */
  Table.prototype.clone = function() {
    var l = this.length;
    var clonedTable = instantiateWithSameType(this);
    clonedTable.name = this.name;
    for(var i = 0; i<l; i++) {
      clonedTable.push(this[i].clone());
    }
    return clonedTable;
  };

  /**
   * Removes all contents of the Table.
   */
  Table.prototype.destroy = function() {
    for(var i = 0; this[i] != null; i++) {
      this[i].destroy();
      delete this[i];
    }
  };

  /**
   * Prints contents of Table to console.log.
   */

  Table.prototype.print = function() {
    console.log("///////////// <" + this.name + "////////////////////////////////////////////////////");
    console.log(TableEncodings.TableToCSV(this, null, true));
    console.log("/////////////" + this.name + "> ////////////////////////////////////////////////////");
  };

  NumberTable.prototype = new Table();
  NumberTable.prototype.constructor = NumberTable;

  /**
   * @classdesc {@link Table} to store numbers.
   *
   * @param [Number|[Number]] args If a single Number, indicates number of
   * columns to make for the NumberTable. Each column is created as an empty
   * NumberList. If an Array, or a set of Arrays, it will make a new NumberList
   * for each array present, populating it with the contents of the array.
   *
   * Additional functions that work on NumberTable can be found in:
   * <ul>
   *  <li>Operators:   {@link NumberTableOperators}</li>
   *  <li>Conversions: {@link NumberTableConversions}</li>
   * </ul>
   *
   * @constructor
   * @description Creates a new NumberTable.
   * @category numbers
   */
  function NumberTable() {
    var args = [];
    var newNumberList;
    var array;
    var i;

    if(arguments.length > 0 && Number(arguments[0]) == arguments[0]) {
      array = [];
      for(i = 0; i < arguments[0]; i++) {
        array.push(new NumberList());
      }
    } else {
      for(i = 0; arguments[i] != null; i++) {
        newNumberList = NumberList.fromArray(arguments[i]);
        newNumberList.name = arguments[i].name;
        args[i] = newNumberList;
      }
      // TODO: this converts all our NumberLists into Lists
      array = Table.apply(this, args);
    }
    array = NumberTable.fromArray(array);
    return array;
  }
  NumberTable.fromArray = function(array) {
    var result = Table.fromArray(array);
    result.type = "NumberTable";

    result.getSums = NumberTable.prototype.getSums;
    result.getRowsSums = NumberTable.prototype.getRowsSums;
    result.getAverages = NumberTable.prototype.getAverages;
    result.getRowsAverages = NumberTable.prototype.getRowsAverages;
    result.getIntervals = NumberTable.prototype.getIntervals;
    result.factor = NumberTable.prototype.factor;
    result.add = NumberTable.prototype.add;
    result.getMax = NumberTable.prototype.getMax;
    result.getMin = NumberTable.prototype.getMin;
    result.getMinMaxInterval = NumberTable.prototype.getMinMaxInterval;
    result.getCovarianceMatrix = NumberTable.prototype.getCovarianceMatrix;

    return result;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getMax = function() {
    if(this.length === 0) return null;

    var max = this[0].getMax();
    var i;

    for(i = 1; this[i] != null; i++) {
      max = Math.max(this[i].getMax(), max);
    }
    return max;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getMin = function() {
    if(this.length === 0) return null;

    var min = this[0].getMin();
    var i;

    for(i = 1; this[i] != null; i++) {
      min = Math.min(this[i].getMin(), min);
    }
    return min;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getMinMaxInterval = function() {
    if(this.length === 0) return null;
    var rangeInterval = (this[0]).getMinMaxInterval();
    for(var i = 1; this[i] != null; i++) {
      var newRange = (this[i]).getMinMaxInterval();
      rangeInterval.x = Math.min(rangeInterval.x, newRange.x);
      rangeInterval.y = Math.max(rangeInterval.y, newRange.y);
    }
    return rangeInterval;
  };

  /**
   * returns a numberList with values from numberlists added
   * @return {Numberlist}
   * tags:
   */
  NumberTable.prototype.getSums = function() {
    var numberList = new NumberList();
    for(var i = 0; this[i] != null; i++) {
      numberList[i] = this[i].getSum();
    }
    return numberList;
  };

  /**
   * returns a numberList with all values fro rows added
   * @return {NumberList}
   * tags:
   */
  NumberTable.prototype.getRowsSums = function() {
    var sums = this[0].clone();
    var numberList;
    for(var i = 1; this[i] != null; i++) {
      numberList = this[i];
      for(var j = 0; numberList[j] != null; j++) {
        sums[j] += numberList[j];
      }
    }
    return sums;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getAverages = function() {
    var numberList = new NumberList();
    for(var i = 0; this[i] != null; i++) {
      numberList[i] = this[i].getAverage();
    }
    return numberList;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getRowsAverages = function() {
    var l = this.length;
    var averages = this[0].clone().factor(1 / l);
    var numberList;
    var i, j;
    var length;
    for(i = 1; i<l; i++) {
      numberList = this[i];
      length = numberList.length;
      for(j = 0; j<length; j++) {
        averages[j] += numberList[j] / l;
      }
    }
    return averages;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.getIntervals = function() {
    var l = this.length;
    var numberList;
    var i;
    var intervalList = new List();//TODO: convert into IntervalList once available
    for(i = 0; i<l; i++) {
      numberList = this[i];
      intervalList.push(numberList.getInterval());
    }
    return intervalList;
  };


  /**
   * @todo write docs
   */
  NumberTable.prototype.factor = function(value) {
    var newTable = new NumberTable();
    var i;
    var numberList;
    var l = this.length;

    switch(typeOf(value)) {
      case 'number':
        for(i = 0; i<l; i++) {
          numberList = this[i];
          newTable[i] = numberList.factor(value);
        }
        break;
      case 'NumberList':
        for(i = 0; i<l; i++) {
          numberList = this[i];
          newTable[i] = numberList.factor(value[i]);
        }
        break;

    }

    newTable.name = this.name;
    return newTable;
  };

  /**
   * @todo write docs
   */
  NumberTable.prototype.add = function(value) {
    var newTable = new NumberTable();
    var numberList;
    var i;
    var l = this.length;

    for(i = 0; i<l; i++) {
      numberList = this[i];
      newTable[i] = numberList.add(value);
    }

    newTable.name = this.name;
    return newTable;
  };

  StringList.prototype = new List();
  StringList.prototype.constructor = StringList;

  /**
   * @classdesc {@link List} for storing Strings.
   *
   * Additional functions that work on StringList can be found in:
   * <ul>
   *  <li>Operators:   {@link StringListOperators}</li>
   *  <li>Conversions: {@link StringListConversions}</li>
   * </ul>
   *
   * @constructor
   * @description Creates a new StringList
   *
   * @category strings
   */
  function StringList() {
    var args = [];

    for(var i = 0; i < arguments.length; i++) {
      args[i] = String(arguments[i]);
    }
    var array = List.apply(this, args);
    array = StringList.fromArray(array);
    
    return array;
  }
  /**
   * @todo write docs
   */
  StringList.fromArray = function(array, forceToString) {
    forceToString = forceToString == null ? true : forceToString;

    var result = List.fromArray(array);
    if(forceToString) {
      for(var i = 0; i < result.length; i++) {
        result[i] = String(result[i]);
      }
    }
    result.type = "StringList";

    //assign methods to array:
    result.getLengths = StringList.prototype.getLengths;
    result.toLowerCase = StringList.prototype.toLowerCase;
    result.toUpperCase = StringList.prototype.toUpperCase;
    result.append = StringList.prototype.append;
    result.getSurrounded = StringList.prototype.getSurrounded;
    result.replace = StringList.prototype.replace;
    result.getConcatenated = StringList.prototype.getConcatenated;
    result.trim = StringList.prototype.trim;

    //override
    result.clone = StringList.prototype.clone;

    return result;
  };

  /**
   * overrides List.prototype.getLengths (see comments there)
   */
  StringList.prototype.getLengths = function() {
    var lengths = new NumberList();

    this.forEach(function(string) {
      lengths.push(string.length);
    });

    return lengths;
  };

  /**
   * @todo write docs
   */
  StringList.prototype.append = function(sufix, after) {
    after = after == null ? true : after;
    var newStringList = new StringList();
    newStringList.name = this.name;
    var sufixIsStringList = typeOf(sufix) == "StringList";
    var i;
    if(after) {
      for(i = 0; this[i] != null; i++) {
        newStringList[i] = this[i] + (sufixIsStringList ? sufix[i] : sufix);
      }
    } else {
      for(i = 0; this[i] != null; i++) {
        newStringList[i] = (sufixIsStringList ? sufix[i] : sufix) + this[i];
      }
    }
    return newStringList;
  };

  /**
   * prefix and sufix can be string or a StringList
   */
  StringList.prototype.getSurrounded = function(prefix, sufix) {
    var newStringList = new StringList();
    newStringList.name = this.name;
    var i;

    var prefixIsStringList = Array.isArray(prefix);
    var sufixIsStringList = Array.isArray(sufix);

    for(i = 0; this[i] != null; i++) {
      newStringList[i] = (prefixIsStringList ? prefix[i] : prefix) + this[i] + (sufixIsStringList ? sufix[i] : sufix);
    }

    return newStringList;
  };


  //deprectaed, replaced by replaceInStrings
  /**
   * @ignore
   */
  StringList.prototype.replace = function(regExp, string) {
    if(regExp==null) return this;

    var newStringList = new StringList();
    var i;

    newStringList.name = this.name;

    for(i = 0; this[i] != null; i++){
      newStringList[i] = this[i].replace(regExp, string);
    }

    return newStringList;
  };

  /**
   * @todo write docs
   */
  StringList.prototype.getConcatenated = function(separator) {
    var i;
    var string = "";
    for(i = 0; this[i] != null; i++) {
      string += this[i];
      if(i < this.length - 1) string += separator;
    }
    return string;
  };

  /**
   * @todo write docs
   */
  StringList.prototype.toLowerCase = function() {
    var newStringList = new StringList();
    newStringList.name = this.name;
    var i;
    for(i = 0; this[i] != null; i++) {
      newStringList[i] = this[i].toLowerCase();
    }
    return newStringList;
  };

  /**
   * @todo write docs
   */
  StringList.prototype.toUpperCase = function() {
    var newStringList = new StringList();
    newStringList.name = this.name;
    var i;
    for(i = 0; this[i] != null; i++) {
      newStringList[i] = this[i].toUpperCase();
    }
    return newStringList;
  };

  /**
   * trims all the strings on the stringList
   * @return {StringList}
   * tags:
   */
  StringList.prototype.trim = function() {
    var i;
    var newStringList = new StringList();
    for(i = 0; this[i] != null; i++) {
      newStringList[i] = this[i].trim();
    }
    newStringList.name = this.name;
    return newStringList;
  };

  ///////overriding

  /**
   * @todo write docs
   */
  StringList.prototype.clone = function() {
    var newList = StringList.fromArray(this.slice(), false);
    newList.name = this.name;
    return newList;
  };

  /*
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */

  /*
   * Configurable variables. You may need to tweak these to be compatible with
   * the server-side, but the defaults work in most cases.
   */
  //var hexcase = 0;   /* hex output format. 0 - lowercase; 1 - uppercase        */
  //var b64pad  = "";  /* base-64 pad character. "=" for strict RFC compliance   */


  function MD5(){}
  /*
   * These are the functions you'll usually want to call
   * They take string arguments and return either hex or base-64 encoded strings
   */
  MD5.hex_md5 = function(s)    { return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s))); };
  MD5.b64_md5 = function(s)    { return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s))); };
  MD5.any_md5 = function(s, e) { return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e); };
  MD5.hex_hmac_md5 = function(k, d)
    { return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
  MD5.b64_hmac_md5 = function(k, d)
    { return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d))); };
  MD5.any_hmac_md5 = function(k, d, e)
    { return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e); };

  /*
   * Perform a simple self-test to see if the VM is working
   */
  MD5.md5_vm_test = function()
  {
    return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
  };

  /*
   * Calculate the MD5 of a raw string
   */
  MD5.rstr_md5 = function(s)
  {
    return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
  };

  /*
   * Calculate the HMAC-MD5, of a key and some data (raw strings)
   */
  MD5.rstr_hmac_md5 = function(key, data)
  {
    var bkey = this.rstr2binl(key);
    if(bkey.length > 16) bkey = this.binl_md5(bkey, key.length * 8);

    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++)
    {
      ipad[i] = bkey[i] ^ 0x36363636;
      opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
    return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
  };

  /*
   * Convert a raw string to a hex string
   */
  MD5.rstr2hex = function(input)
  {
  	var hexcase = 0;
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++)
    {
      x = input.charCodeAt(i);
      output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt( x        & 0x0F);
    }
    return output;
  };

  /*
   * Convert a raw string to a base-64 string
   */
  MD5.rstr2b64 = function(input)
  {
  	var b64pad  = "";
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3)
    {
      var triplet = (input.charCodeAt(i) << 16)
                  | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
                  | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
      for(var j = 0; j < 4; j++)
      {
        if(i * 8 + j * 6 > input.length * 8) output += b64pad;
        else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
      }
    }
    return output;
  };

  /*
   * Convert a raw string to an arbitrary string encoding
   */
  MD5.rstr2any = function(input, encoding)
  {
    var divisor = encoding.length;
    var i, j, q, x, quotient;

    /* Convert to an array of 16-bit big-endian values, forming the dividend */
    var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++)
    {
      dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
    }

    /*
     * Repeatedly perform a long division. The binary array forms the dividend,
     * the length of the encoding is the divisor. Once computed, the quotient
     * forms the dividend for the next step. All remainders are stored for later
     * use.
     */
    var full_length = Math.ceil(input.length * 8 /
                                      (Math.log(encoding.length) / Math.log(2)));
    var remainders = Array(full_length);
    for(j = 0; j < full_length; j++)
    {
      quotient = Array();
      x = 0;
      for(i = 0; i < dividend.length; i++)
      {
        x = (x << 16) + dividend[i];
        q = Math.floor(x / divisor);
        x -= q * divisor;
        if(quotient.length > 0 || q > 0)
          quotient[quotient.length] = q;
      }
      remainders[j] = x;
      dividend = quotient;
    }

    /* Convert the remainders to the output string */
    var output = "";
    for(i = remainders.length - 1; i >= 0; i--)
      output += encoding.charAt(remainders[i]);

    return output;
  };

  /*
   * Encode a string as utf-8.
   * For efficiency, this assumes the input is valid utf-16.
   */
  MD5.str2rstr_utf8 = function(input)
  {
    var output = "";
    var i = -1;
    var x, y;

    while(++i < input.length)
    {
      /* Decode utf-16 surrogate pairs */
      x = input.charCodeAt(i);
      y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
      if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF)
      {
        x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
        i++;
      }

      /* Encode output as utf-8 */
      if(x <= 0x7F)
        output += String.fromCharCode(x);
      else if(x <= 0x7FF)
        output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0xFFFF)
        output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
      else if(x <= 0x1FFFFF)
        output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                                      0x80 | ((x >>> 12) & 0x3F),
                                      0x80 | ((x >>> 6 ) & 0x3F),
                                      0x80 | ( x         & 0x3F));
    }
    return output;
  };

  /*
   * Encode a string as utf-16
   */
  MD5.str2rstr_utf16le = function(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode( input.charCodeAt(i)        & 0xFF,
                                    (input.charCodeAt(i) >>> 8) & 0xFF);
    return output;
  };

  MD5.str2rstr_utf16be = function(input)
  {
    var output = "";
    for(var i = 0; i < input.length; i++)
      output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                                     input.charCodeAt(i)        & 0xFF);
    return output;
  };

  /*
   * Convert a raw string to an array of little-endian words
   * Characters >255 have their high-byte silently ignored.
   */
  MD5.rstr2binl = function(input)
  {
    var i;
    var output = Array(input.length >> 2);
    for(i = 0; i < output.length; i++)
      output[i] = 0;
    for(i = 0; i < input.length * 8; i += 8)
      output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
    return output;
  };

  /*
   * Convert an array of little-endian words to a string
   */
  MD5.binl2rstr = function(input)
  {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)
      output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
    return output;
  };

  /*
   * Calculate the MD5 of an array of little-endian words, and a bit length.
   */
  MD5.binl_md5 = function(x, len)
  {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a =  1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d =  271733878;

    for(var i = 0; i < x.length; i += 16)
    {
      var olda = a;
      var oldb = b;
      var oldc = c;
      var oldd = d;

      a = this.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
      d = this.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
      c = this.md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
      b = this.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
      a = this.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
      d = this.md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
      c = this.md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
      b = this.md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
      a = this.md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
      d = this.md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
      c = this.md5_ff(c, d, a, b, x[i+10], 17, -42063);
      b = this.md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
      a = this.md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
      d = this.md5_ff(d, a, b, c, x[i+13], 12, -40341101);
      c = this.md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
      b = this.md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

      a = this.md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
      d = this.md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
      c = this.md5_gg(c, d, a, b, x[i+11], 14,  643717713);
      b = this.md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
      a = this.md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
      d = this.md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
      c = this.md5_gg(c, d, a, b, x[i+15], 14, -660478335);
      b = this.md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
      a = this.md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
      d = this.md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
      c = this.md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
      b = this.md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
      a = this.md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
      d = this.md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
      c = this.md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
      b = this.md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

      a = this.md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
      d = this.md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
      c = this.md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
      b = this.md5_hh(b, c, d, a, x[i+14], 23, -35309556);
      a = this.md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
      d = this.md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
      c = this.md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
      b = this.md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
      a = this.md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
      d = this.md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
      c = this.md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
      b = this.md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
      a = this.md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
      d = this.md5_hh(d, a, b, c, x[i+12], 11, -421815835);
      c = this.md5_hh(c, d, a, b, x[i+15], 16,  530742520);
      b = this.md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

      a = this.md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
      d = this.md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
      c = this.md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
      b = this.md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
      a = this.md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
      d = this.md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
      c = this.md5_ii(c, d, a, b, x[i+10], 15, -1051523);
      b = this.md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
      a = this.md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
      d = this.md5_ii(d, a, b, c, x[i+15], 10, -30611744);
      c = this.md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
      b = this.md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
      a = this.md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
      d = this.md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
      c = this.md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
      b = this.md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
    }
    return Array(a, b, c, d);
  };

  /*
   * These functions implement the four basic operations the algorithm uses.
   */
  MD5.md5_cmn = function(q, a, b, x, s, t)
  {
    return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s),b);
  };
  MD5.md5_ff = function(a, b, c, d, x, s, t)
  {
    return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
  };
  MD5.md5_gg = function(a, b, c, d, x, s, t)
  {
    return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
  };
  MD5.md5_hh = function(a, b, c, d, x, s, t)
  {
    return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
  };
  MD5.md5_ii = function(a, b, c, d, x, s, t)
  {
    return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
  };

  /*
   * Add integers, wrapping at 2^32. This uses 16-bit operations internally
   * to work around bugs in some JS interpreters.
   */
  MD5.safe_add = function(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  };

  /*
   * Bitwise rotate a 32-bit number to the left.
   */
  MD5.bit_rol = function(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  };

  Relation.prototype = Object.create(_Node.prototype);
  Relation.prototype.constructor = Relation;

  /**
   * Relation
   * @classdesc Relations represent the edges that connect Nodes
   * in a Network DataType.
   *
   * @description create a new Relation.
   * @constructor
   * @param {String} id ID of the Relation.
   * @param {String} name Name of the Relation.
   * @param {Node} node0 Source of the Relation.
   * @param {Node} node1 Destination of the Relation.
   * @param {Number} weight Edge weight associated with Relation.
   * Defaults to 1.
   * @param {String} content Other data to associate with this Relation.
   * @category networks
   */
  function Relation(id, name, node0, node1, weight, content) {
    _Node.call(this, id, name);
    this.type = "Relation";

    this.node0 = node0;
    this.node1 = node1;
    this.weight = weight == null ? 1 : weight;
    this.content = content == null ? "" : content;
  }
  /**
   * @todo write docs
   */
  Relation.prototype.destroy = function() {
    _Node.prototype.destroy.call(this);
    delete this.node0;
    delete this.node1;
    delete this.content;
  };

  /**
   * given a node returns the other node of a relation
   * @param  {Node} node
   * @return {Node}
   * tags:
   */
  Relation.prototype.getOther = function(node) {
    return node == this.node0 ? this.node1 : this.node0;
  };

  /**
   * @todo write docs
   */
  Relation.prototype.clone = function() {
    var relation = new Relation(this.id, this.name, this.node0, this.node1);

    relation.x = this.x;
    relation.y = this.y;
    relation.z = this.z;

    relation.nodeType = this.nodeType;

    relation.weight = this.weight;
    relation.descentWeight = this.descentWeight;

    return relation;
  };

  RectangleList.prototype = new List();
  RectangleList.prototype.constructor = RectangleList;
  /**
   * @classdesc A {@link List} structure for storing {@link Rectangle} instances.
   *
   * @description Creates a new RectangleList.
   * @constructor
   * @category geometry
   */
  function RectangleList() {
    var array = List.apply(this, arguments);
    array = RectangleList.fromArray(array);
    return array;
  }
  /**
   * @todo write docs
   */
  RectangleList.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "RectangleList";

    result.getFrame = RectangleList.prototype.getFrame;
    result.add = RectangleList.prototype.add;
    result.factor = RectangleList.prototype.factor;
    result.getAddedArea = RectangleList.prototype.getAddedArea;
    result.getIntersectionArea = RectangleList.prototype.getIntersectionArea;

    return result;
  };


  /**
   * @todo write docs
   */
  RectangleList.prototype.getFrame = function() {//TODO: use RectangleOperators.minRect
    if(this.length === 0) return null;

    var frame = this[0].clone();
    frame.width = frame.getRight();
    frame.height = frame.getBottom();
    for(var i = 1; this[i] != null; i++) {
      frame.x = Math.min(frame.x, this[i].x);
      frame.y = Math.min(frame.y, this[i].y);

      frame.width = Math.max(this[i].getRight(), frame.width);
      frame.height = Math.max(this[i].getBottom(), frame.height);
    }

    frame.width -= frame.x;
    frame.height -= frame.y;

    return frame;
  };

  // TODO:finish RectangleList methods

  /**
   * @ignore
   */
  RectangleList.prototype.add = function() {

  };

  /**
   * @ignore
   */
  RectangleList.prototype.factor = function() {

  };


  /**
   * @ignore
   */
  RectangleList.prototype.getAddedArea = function() {};

  /**
   * @todo write docs
   */
  RectangleList.prototype.getIntersectionArea = function() {
    var rect0;
    var rect1;
    var intersectionArea = 0;
    var intersection;
    for(var i = 0; this[i + 1] != null; i++) {
      rect0 = this[i];
      for(var j = i + 1; this[j] != null; j++) {
        rect1 = this[j];
        intersection = rect0.getIntersection(rect1);
        intersectionArea += intersection == null ? 0 : intersection.getArea();
      }
    }

    return intersectionArea;
  };

  /**
   * @classdesc Create default lists
   *
   * @namespace
   * @category basics
   */
  function ListGenerators() {}
  /**
   * Generates a List made of several copies of same element (returned List is improved)
   * @param {Object} nValues length of the List
   * @param {Object} element object to be placed in all positions
   * @return {List} generated List
   * tags:generator
   */
  ListGenerators.createListWithSameElement = function(nValues, element) {
    var list;
    switch(typeOf(element)) {
      case 'number':
        list = new NumberList();
        break;
      case 'List':
        list = new Table();
        break;
      case 'NumberList':
        list = new NumberTable();
        break;
      case 'Rectangle':
        list = new RectangleList();
        break;
      case 'string':
        list = new StringList();
        break;
      case 'boolean':
        list = new List(); //TODO:update once BooleanList exists
        break;
      default:
        list = new List();
    }

    for(var i = 0; i < nValues; i++) {
      list[i] = element;
    }
    return list;
  };

  /**
   * Generates a List built froma seed element and a function that will be applied iteratively
   * @param {Object} nValues length of the List
   * @param {Object} firstElement first element
   * @param {Object} dynamicFunction sequence generator function, elementN+1 =  dynamicFunction(elementN)
   * @return {List} generated List
   */
  ListGenerators.createIterationSequence = function(nValues, firstElement, dynamicFunction) {
    var list = ListGenerators.createListWithSameElement(1, firstElement);
    for(var i = 1; i < nValues; i++) {
      list[i] = dynamicFunction(list[i - 1]);
    }
    return list;
  };

  /**
   * @classdesc NumberList Operators
   *
   * @namespace
   * @category numbers
   */
  function NumberListOperators() {}
  /**
   * Returns dot product between two numberLists
   *
   * @param  {NumberList1} numberList NumberList of the same length
   * as numberList2.
   * @param  {NumberList2} numberList NumberList of the same length
   * as numberList1.
   * @return {Number} Dot product between two lists.
   */
  NumberListOperators.dotProduct = function(numberList1, numberList2) {
    var sum = 0;
    var i;
    var nElements = Math.min(numberList1.length, numberList2.length);
    for(i = 0; i < nElements; i++) {
      sum += numberList1[i] * numberList2[i];
    }
    return sum;
  };

  /**
   * Returns linear regression between two numberLists in another numberList with items
   * slope, intercept, r squared, n OR in a Point representing the line
   *
   * @param  {NumberList} numberListX of the same length as numberListY.
   * @param  {NumberList} numberListY of the same length as numberListX.
   * @param  {Number} returnType <br>0:NumberList with items slope, intercept, r squared, n.<br>1: Point with slope,intercept
   * @return {Object} result depending on returnType
   * tags:statistics
   */
  NumberListOperators.linearRegression = function(numberListX, numberListY, returnType) {
    returnType = returnType == null || returnType > 1 ? 0:returnType;
    var numberListR = new NumberList();
    if(numberListX == null || numberListY == null ||
       numberListX.length != numberListY.length || numberListX.length === 0)
      return returnType===0?numberListR:new _Point();
    var sumx=0,sumy=0,sumx2=0,sumxy=0,sumy2=0;

    var n = numberListX.length;
    for(var i = 0; i < n; i++) {
      sumx += numberListX[i];
      sumy += numberListY[i];
      sumx2 += numberListX[i]*numberListX[i];
      sumxy += numberListX[i]*numberListY[i];
      sumy2 += numberListY[i]*numberListY[i];
    }
    var slope = (n * sumxy - sumx * sumy) / (n * sumx2 - sumx * sumx);
    var intercept = (sumy / n) - (slope * sumx) / n;
    if(returnType==1)
      return new _Point(slope,intercept);
    var r2 = Math.pow((n*sumxy - sumx*sumy)/Math.sqrt((n*sumx2-sumx*sumx)*(n*sumy2-sumy*sumy)),2);
    numberListR.push(slope);
    numberListR.push(intercept);
    numberListR.push(r2);
    numberListR.push(n);
    return numberListR;
  };

  /**
   * Calculates Euclidean distance between two numberLists
   *
   * @param  {NumberList1} numberList NumberList of the same length
   * as numberList2.
   * @param  {NumberList2} numberList NumberList of the same length
   * as numberList1.
   * @return {Number} Summed Euclidean distance between all values.
   * tags:
   */
  NumberListOperators.distance = function(numberList1, numberList2) {
    var sum = 0;
    var i;
    var nElements = Math.min(numberList1.length, numberList2.length);
    for(i = 0; i < nElements; i++) {
      sum += Math.pow(numberList1[i] - numberList2[i], 2);
    }
    return Math.sqrt(sum);
  };

  /**
   * cosine similarity, used to compare two NumberLists regardless of norm (see: http://en.wikipedia.org/wiki/Cosine_similarity)
   * @param  {NumberList} numberList0
   * @param  {NumberList} numberList1
   * @return {Number}
   * tags:statistics
   */
  NumberListOperators.cosineSimilarity = function(numberList0, numberList1) {
    var norms = numberList0.getNorm() * numberList1.getNorm();
    if(norms === 0) return 0;
    return numberList0.dotProduct(numberList1) / norms;
  };

  /**
   * calculates the covariance between two numberLists
   * @param  {NumberList} numberList0
   * @param  {NumberList} numberList1
   * @return {Number}
   * tags:statistics
   */
  NumberListOperators.covariance = function(numberList0, numberList1) {
    if(numberList0==null || numberList1==null) return;

    var l = Math.min(numberList0.length, numberList1.length);
    var i;
    var av0 = numberList0.getAverage();
    var av1 = numberList1.getAverage();
    var s = 0;

    for(i = 0; i<l; i++) {
      s += (numberList0[i] - av0)*(numberList1[i] - av1);
    }

    return s/l;
  };

  /**
   * Returns a NumberList normalized to the sum.
   *
   * @param  {NumberList} numberlist NumberList to Normalize.
   * @param {Number} factor Optional multiplier to modify the normalized values by.
   * Defaults to 1.
   * @param {Number} sum Optional sum to normalize to.
   * If not provided, sum will be calculated automatically.
   * @return {NumberList} New NumberList of values normalized to the sum.
   * tags:
   */
  NumberListOperators.normalizedToSum = function(numberlist, factor, sum) {
    factor = factor == null ? 1 : factor;
    var newNumberList = new NumberList();
    newNumberList.name = numberlist.name;
    if(numberlist.length === 0) return newNumberList;
    var i;
    sum = sum == null ? numberlist.getSum() : sum;
    if(sum === 0) return numberlist.clone();

    for(i = 0; i < numberlist.length; i++) {
      newNumberList.push(factor * numberlist[i] / sum);
    }
    return newNumberList;
  };

  /**
   * Returns a NumberList normalized to min-max interval.
   *
   * @param  {NumberList} numberlist NumberList to Normalize.
   * @param {Number} factor Optional multiplier to modify the normalized values by.
   * Defaults to 1.
   * @return {NumberList}
   * tags:
   */
  NumberListOperators.normalized = function(numberlist, factor) {
    factor = factor == null ? 1 : factor;

    if(numberlist.length === 0) return null;

    var i;
    var interval = numberlist.getMinMaxInterval();
    var a = interval.getAmplitude();
    var newNumberList = new NumberList();
    for(i = 0; i < numberlist.length; i++) {
      newNumberList.push(factor * ((numberlist[i] - interval.x) / a));
    }
    newNumberList.name = numberlist.name;
    return newNumberList;
  };

  /**
   * Returns a NumberList normalized to Max.
   *
   * @param  {NumberList} numberlist NumberList to Normalize.
   * @param {Number} factor Optional multiplier to modify the normalized values by. Defaults to 1.
   * @return {NumberList}
   * tags:
   */
  NumberListOperators.normalizedToMax = function(numberlist, factor) {
    factor = factor == null ? 1 : factor;

    if(numberlist.length === 0) return null;

    var max = numberlist.getMax();
    if(max === 0) {
      max = numberlist.getMin();
      if(max === 0) return ListGenerators.createListWithSameElement(numberlist.length, 0);
    }
    var newNumberList = new NumberList();
    for(var i = 0; numberlist[i] != null; i++) {
      newNumberList.push(factor * (numberlist[i] / max));
    }
    newNumberList.name = numberlist.name;
    return newNumberList;
  };


  /**
   * generates a new numberList of desired size smaller than original, with elements claculated as averages of neighbors
   * @param  {NumberList} numberList
   * @param  {Number} newLength length of returned numberList
   * @return {NumberList}
   * tags:statistics
   */
  NumberListOperators.shorten = function(numberList, newLength) {
    if(numberList==null) return null;
    if(newLength==null || newLength>=numberList.length) return numberList;

    var windowSize = numberList.length/newLength;
    var newNumberList = new NumberList();
    var windowSizeInt = Math.floor(windowSize);
    var val;
    var i, j, j0;

    newNumberList.name = numberList.name;

    for(i=0; i<newLength; i++){
      j0 = Math.floor(i*windowSize);
      val = 0;
      for(j=0; j<windowSizeInt; j++){
        val += numberList[j0+j];
      }
      newNumberList[i] = val/windowSizeInt;
    }
    return newNumberList;
  };

  /**
   * simplifies a numer list, by keeping the nCategories-1 most common values, and replacing the others with an "other" element
   * this method reduces the number of different values contained in the list, converting it into a categorical list
   * @param  {NumberList} numberList NumberList to shorten
   * @param  {Number} method simplification method:<b>0:significant digits<br>1:quantiles (value will be min value in percentile)<br>2:orders of magnitude
   *
   * @param  {Number} param different meaning according to choosen method:<br>0:number of significant digits<br>1:number of quantiles<br>2:no need of param
   * @return {NumberList} simplified list
   * tags:
   */
  NumberListOperators.simplify = function(numberlist, method, param) {
    method = method||0;
    param = param||0;

    var newList = new NumberList();
    newList.name = numberlist.name;


    switch(method){
      case 0:
        var power = Math.pow(10, param);
        numberlist.forEach(function(val){
          newList.push(Math.floor(val/power)*power);
        });
        break;
      case 1:
        //deploy quantiles first (optional return of n percentile, min value, interval, numberTable with indexes, numberTable with values)
        break;
    }

    return newList;
  };

  /**
   * calculates k-means clusters of values in a numberList
   * @param  {NumberList} numberList
   * @param  {Number} k number of clusters
   *
   * @param {Boolean} returnIndexes return clusters of indexes rather than values (false by default)
   * @return {NumberTable} numberLists each being a cluster
   * tags:ds
   */
  NumberListOperators.linearKMeans = function(numberList, k, returnIndexes) {
    if(numberList == null || k == null || (k <= 0)) {
      return null;
    }

    var interval = numberList.getInterval();

    var min = interval.x;
    var max = interval.y;
    var clusters = new NumberTable();
    var i, j;
    var jK;
    var x;
    var dX = (max - min) / k;
    var d;
    var dMin;
    var n;
    var N = 1000;
    var means = new NumberList();
    var nextMeans = new NumberList();
    var nValuesInCluster = new NumberList();
    var length = numberList.length;

    var initdMin = 1 + max - min;

    for(i = 0; i < k; i++) {
      clusters[i] = new NumberList();
      nextMeans[i] = min + (i + 0.5) * dX;
    }

    for(n = 0; n < N; n++) {

      for(i = 0; i < k; i++) {
        nValuesInCluster[i] = 0;
        means[i] = nextMeans[i];
        nextMeans[i] = 0;
      }

      for(i = 0; i<length; i++) {
        x = numberList[i];
        dMin = initdMin;
        jK = 0;

        for(j = 0; j < k; j++) {
          d = Math.abs(x - means[j]);
          if(d < dMin) {
            dMin = d;
            jK = j;
          }
        }
        if(n == N - 1) {
          if(returnIndexes) {
            clusters[jK].push(i);
          } else {
            clusters[jK].push(x);
          }
        }

        nValuesInCluster[jK]++;

        nextMeans[jK] = ((nValuesInCluster[jK] - 1) * nextMeans[jK] + x) / nValuesInCluster[jK];
      }
    }

    return clusters;
  };

  /**
   * @todo finish docs
   */
  NumberListOperators.standardDeviationBetweenTwoNumberLists = function(numberList0, numberList1) {
    var s = 0;
    var l = Math.min(numberList0.length, numberList1.length);

    for(var i = 0; i < l; i++) {
      s += Math.pow(numberList0[i] - numberList1[i], 2);
    }

    return s/l;
  };

  /**
   * returns Pearson Product Moment Correlation, the most common correlation coefficient ( covariance/(standard_deviation0*standard_deviation1) )
   * @param  {NumberList} numberList0
   * @param  {NumberList} numberList1
   * @return {Number}
   * tags:statistics
   */
  NumberListOperators.pearsonProductMomentCorrelation = function(numberList0, numberList1) { //TODO:make more efficient
    return NumberListOperators.covariance(numberList0, numberList1) / (numberList0.getStandardDeviation() * numberList1.getStandardDeviation());
  };


  /**
   * smooth a numberList by calculating averages with neighbors
   * @param  {NumberList} numberList
   * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
   * @param  {Number} nIterations number of ieterations
   * @return {NumberList}
   * tags:statistics
   */
  NumberListOperators.averageSmoother = function(numberList, intensity, nIterations) {
    nIterations = nIterations == null ? 1 : nIterations;
    intensity = intensity == null ? 0.1 : intensity;

    intensity = Math.max(Math.min(intensity, 0.5), 0);
    var anti = 1 - 2 * intensity;
    var n = numberList.length - 1;

    var newNumberList = numberList.clone();
    var i;

    var smoothFirst = function(val, i, list){
      list[i] = anti * val + (i > 0 ? (numberList[i - 1] * intensity) : 0) + (i < n ? (numberList[i + 1] * intensity) : 0);
    };

    var smooth = function(val, i, list){
      list[i] = anti * val + (i > 0 ? (list[i - 1] * intensity) : 0) + (i < n ? (list[i + 1] * intensity) : 0);
    };

    for(i = 0; i < nIterations; i++) {
      if(i === 0) {
        newNumberList.forEach(smoothFirst);
      } else {
        newNumberList.forEach(smooth);
      }
    }

    newNumberList.name = numberList.name;

    return newNumberList;
  };

  /**
   * accepted comparison operators: "<", "<=", ">", ">=", "==", "!="
   */
  NumberListOperators.filterNumberListByNumber = function(numberList, value, comparisonOperator, returnIndexes) {
    returnIndexes = returnIndexes || false;
    var newNumberList = new NumberList();
    var i;

    if(returnIndexes) {
      switch(comparisonOperator) {
        case "<":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] < value) {
              newNumberList.push(i);
            }
          }
          break;
        case "<=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] <= value) {
              newNumberList.push(i);
            }
          }
          break;
        case ">":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] > value) {
              newNumberList.push(i);
            }
          }
          break;
        case ">=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] >= value) {
              newNumberList.push(i);
            }
          }
          break;
        case "==":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] == value) {
              newNumberList.push(i);
            }
          }
          break;
        case "!=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] != value) {
              newNumberList.push(i);
            }
          }
          break;
      }

    } else {
      switch(comparisonOperator) {
        case "<":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] < value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
        case "<=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] <= value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
        case ">":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] > value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
        case ">=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] >= value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
        case "==":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] == value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
        case "!=":
          for(i = 0; numberList[i] != null; i++) {
            if(numberList[i] != value) {
              newNumberList.push(numberList[i]);
            }
          }
          break;
      }
    }

    return newNumberList;
  };

  /**
   * creates a NumberList that contains the union of two NumberList (removing repetitions)
   *
   * @param  {NumberList} x list A
   * @param  {NumberList} y list B
   *
   * @return {NumberList} the union of both NumberLists
   * tags:
   */
  NumberListOperators.union = function(x, y) {//TODO: should be refactored, and placed in ListOperators
    // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
    var i;
    var obj = {};
    for(i = x.length - 1; i >= 0; --i)
      obj[x[i]] = x[i];
    for(i = y.length - 1; i >= 0; --i)
      obj[y[i]] = y[i];
    var res = new NumberList();
    for(var k in obj) {
      if(obj.hasOwnProperty(k)) // <-- optional
        res.push(obj[k]);
    }
    return res;
  };

  /**
   * creates a NumberList that contains the intersection of two NumberList (elements present in BOTH lists)
   * @param  {NumberList} list A
   * @param  {NumberList} list B
   *
   * @return {NumberList} the intersection of both NumberLists
   * tags:deprecated
   */
  NumberListOperators.intersection = function(a, b) {//TODO: refactor method that should be at ListOperators
    // Borrowed from here: http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
    //console.log( "arguments: ", arguments );
    var i;
    if(arguments.length > 2) {
      var sets = [];
      for(i = 0; i < arguments.length; i++) {
        sets.push(arguments[i]);
      }
      sets.sort(function(a, b) {
        return a.length - b.length;
      });
      console.log("sets: ", sets);
      var resultsTrail = sets[0];
      for(i = 1; i < sets.length; i++) {
        var newSet = sets[i];
        resultsTrail = NumberListOperators.intersection(resultsTrail, newSet);
      }
      return resultsTrail;
    }

    var result = new NumberList();
    a = a.slice();
    b = b.slice();
    while(a.length > 0 && b.length > 0)
    {
      if(a[0] < b[0]) {
        a.shift();
      }
      else if(a[0] > b[0]) {
        b.shift();
      }
      else /* they're equal */
      {
        result.push(a.shift());
        b.shift();
      }
    }

    return result;
  };


  /**
   * builds a rectangle that defines the boundaries of two numberLists interpreted as x and y coordinates
   * @param  {NumberList} numberListX
   * @param  {NumberList} numberListY
   * @return {Rectangle}
   */
  NumberListOperators.frameFromTwoNumberLists = function(numberListX, numberListY){
    if(numberListX==null || numberListY==null) return;
    var intX = numberListX.getInterval();
    var intY = numberListY.getInterval();
    return new Rectangle(intX.x, intY.x, intX.getAmplitude(), intY.getAmplitude());
  };

  /**
   * @classdesc Default color scales.
   *
   * @namespace
   * @category colors
   */
  function ColorScales() {}
  /**
   * @todo write docs
   */
  ColorScales.blackScale = function() {
    return 'black';
  };

  /**
   * @todo write docs
   */
  ColorScales.grayscale = function(value) {
    var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 255, 255], value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorScales.antiGrayscale = function(value) {
    var rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [0, 0, 0], value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorScales.antiTemperature = function(value) {
    return ColorScales.temperature(1 - value);
  };

  /**
   * @todo write docs
   */
  ColorScales.temperature = function(value) { //todo:make it efficient
    var color = "#FFFFFF";
    if(value < 0.2) {
      color = ColorOperators.interpolateColors('#000000', ColorOperators.HSVtoHEX(234, 1, 1), value * 5);
    } else if(value > 0.85) {
      color = ColorOperators.interpolateColors(ColorOperators.HSVtoHEX(0, 1, 1), '#FFFFFF', (value - 0.85) / 0.15);
    } else {
      color = ColorOperators.HSVtoHEX(Math.round((0.65 - (value - 0.2)) * 360), 1, 1);
    }
    return color;
  };

  /**
   * @todo write docs
   */
  ColorScales.sqrtTemperature = function(value) {
    return ColorScales.temperature(Math.sqrt(value));
  };

  /**
   * @todo write docs
   */
  ColorScales.sqrt4Temperature = function(value) {
    return ColorScales.temperature(Math.pow(value, 0.25));
  };

  /**
   * @todo write docs
   */
  ColorScales.quadraticTemperature = function(value) {
    return ColorScales.temperature(Math.pow(value, 2));
  };

  /**
   * @todo write docs
   */
  ColorScales.cubicTemperature = function(value) {
    return ColorScales.temperature(Math.pow(value, 3));
  };

  /**
   * @todo write docs
   */
  ColorScales.greenToRed = function(value) { //todo:make it efficient
    var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 50, 50], value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorScales.greenToBlue = function(value) { //todo:make it efficient
    var rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [50, 50, 255], value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorScales.grayToOrange = function(value) {
    return 'rgb(' + Math.floor(100 + value*155) + ','+ Math.floor(100 + value*10) +',' + Math.floor(100 - value*100) + ')';
  };

  /**
   * @todo write docs
   */
  ColorScales.sqrt4GrayToOrange = function(value){
    return ColorScales.grayToOrange(Math.pow(value, 0.25));
  };

  /**
   * @todo write docs
   */
  ColorScales.blueToRed = function(value) {
    return 'rgb(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ')';
  };

  /**
   * @todo write docs
   */
  ColorScales.blueToRedAlpha = function(value) { //todo:make it efficient
    return 'rgba(' + Math.floor(value * 255) + ',0,' + Math.floor((1 - value) * 255) + ', 0.5)';
  };

  /**
   * @todo write docs
   */
  ColorScales.whiteToRed = function(value) {
    var gg = Math.floor(255 - value * 255);
    return 'rgb(255,' + gg + ',' + gg + ')';
  };

  /**
   * @todo write docs
   */
  ColorScales.redToBlue = function(value) {
    var rgb = ColorOperators.interpolateColorsRGB([255, 0, 0], [0, 0, 255], value);
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  //tricolor

  /**
   * @todo write docs
   */
  ColorScales.greenWhiteRed = function(value) { //TODO: make it + efficient
    var rgb = [0,0,0];
    if(value < 0.5) {
      rgb = ColorOperators.interpolateColorsRGB([50, 255, 50], [255, 255, 255], value * 2);
    } else {
      rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 50, 50], (value - 0.5) * 2);
    }
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
  };

  /**
   * @todo write docs
   */
  ColorScales.blueWhiteRed = function(value) {
    var rr = value < 0.5 ? Math.floor(510 * value) : 255;
    var gg = value < 0.5 ? Math.floor(510 * value) : Math.floor(510 * (1 - value));
    var bb = value < 0.5 ? 255 : Math.floor(510 * (1 - value));

    return 'rgb(' + rr + ',' + gg + ',' + bb + ')';
  };

  /**
   * @todo write docs
   */
  ColorScales.grayBlackOrange = function(value){ //TODO: make it + efficient
    var rgb = [0,0,0];
    if(value < 0.5) {
      rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [0, 0, 0], value * 2);
    } else {
      rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], [255, 110, 0], (value - 0.5) * 2);
    }
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
  };

  /**
   * @todo write docs
   */
  ColorScales.grayWhiteOrange = function(value){ //TODO: make it + efficient
    var rgb = [0,0,0];
    if(value < 0.5) {
      rgb = ColorOperators.interpolateColorsRGB([100, 100, 100], [255, 255, 255], value * 2);
    } else {
      rgb = ColorOperators.interpolateColorsRGB([255, 255, 255], [255, 110, 0], (value - 0.5) * 2);
    }
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
  };


  /**
   * @todo write docs
   */
  ColorScales.solar = function(value) {
    var rgb = ColorOperators.interpolateColorsRGB([0, 0, 0], ColorOperators.interpolateColorsRGB([255, 0, 0], [255, 255, 0], value), Math.pow(value * 0.99 + 0.01, 0.2));
    return ColorOperators.RGBtoHEX(rgb[0], rgb[1], rgb[2]);
  };

  /**
   * @todo write docs
   */
  ColorScales.antiSolar = function(value) {
    return ColorOperators.invertColor(ColorScales.solar(value));
  };

  /**
   * @classdesc List Operators
   *
   * @namespace
   * @category basics
   */
  function ListConversions() {}
  /**
   * Converts the List into a NumberList.
   *
   * @param  {List} list
   * @return {NumberList}
   * tags:conversion
   */
  ListConversions.toNumberList = function(list) {
    var numberList = new NumberList();
    numberList.name = list.name;
    var i;
    for(i = 0; list[i] != null; i++) {
      numberList[i] = Number(list[i]);
    }
    return numberList;
  };

  /**
   * Converts the List into a StringList.
   *
   * @param  {List} list
   * @return {StringList}
   * tags:conversion
   */
  ListConversions.toStringList = function(list) {
    var i;
    var stringList = new StringList();
    stringList.name = list.name;
    for(i = 0; list[i] != null; i++) {
      if(typeof list[i] == 'number') {
        stringList[i] = String(list[i]);
      } else {
        stringList[i] = list[i].toString();
      }
    }
    return stringList;
  };

  /**
   * @classdesc Provides a set of tools that work with Numbers.
   *
   * @namespace
   * @category numbers
   */
  function NumberOperators() {}
  /**
   * converts number into a string
   *
   * @param {Number} value The number to convert
   * @param {Number} nDecimals Number of decimals to include. Defaults to 0.
   */
  NumberOperators.numberToString = function(value, nDecimals ) {
    var string = value.toFixed(nDecimals);
    while(string.charAt(string.length - 1) == '0') {
      string = string.substring(0, string.length - 1);
    }
    if(string.charAt(string.length - 1) == '.') string = string.substring(0, string.length - 1);
    return string;
  };

  /**
   * decent method to create pseudo random numbers
   * @param {Object} seed
   */
  NumberOperators.getRandomWithSeed = function(seed) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / (233280.0);
  };

  /**
   * @todo write docs
   */
  NumberOperators.numberFromBinaryPositions = function(binaryPositions) {
    var i;
    var n = 0;
    for(i = 0; binaryPositions[i] != null; i++) {
      n += Math.pow(2, binaryPositions[i]);
    }
    return n;
  };

  /**
   * @todo write docs
   */
  NumberOperators.numberFromBinaryValues = function(binaryValues) {
    var n = 0;
    var l = binaryValues.length;
    for(var i = 0; i < l; i++) {
      n += binaryValues[i] == 1 ? Math.pow(2, (l - (i + 1))) : 0;
    }
    return n;
  };

  /**
   * @todo write docs
   */
  NumberOperators.powersOfTwoDecomposition = function(number, length) {

    var powers = new NumberList();

    var constructingNumber = 0;
    var biggestPower;

    while(constructingNumber < number) {
      biggestPower = Math.floor(Math.log(number) / Math.LN2);
      powers[biggestPower] = 1;
      number -= Math.pow(2, biggestPower);
    }

    length = Math.max(powers.length, length == null ? 0 : length);

    for(var i = 0; i < length; i++) {
      powers[i] = powers[i] == 1 ? 1 : 0;
    }

    return powers;
  };

  /**
   * @todo write docs
   */
  NumberOperators.positionsFromBinaryValues = function(binaryValues) {
    var i;
    var positions = new NumberList();
    for(i = 0; binaryValues[i] != null; i++) {
      if(binaryValues[i] == 1) positions.push(i);
    }
    return positions;
  };

  //////////Random Generator with Seed, From http://baagoe.org/en/w/index.php/Better_random_numbers_for_javascript

  /**
   * @ignore
   */
  NumberOperators._Alea = function() {
    return(function(args) {
      // Johannes Baagøe <baagoe@baagoe.com>, 2010
      var s0 = 0;
      var s1 = 0;
      var s2 = 0;
      var c = 1;

      if(args.length === 0) {
        args = [+new Date()];
      }
      var mash = NumberOperators._Mash();
      s0 = mash(' ');
      s1 = mash(' ');
      s2 = mash(' ');

      for(var i = 0; i < args.length; i++) {
        s0 -= mash(args[i]);
        if(s0 < 0) {
          s0 += 1;
        }
        s1 -= mash(args[i]);
        if(s1 < 0) {
          s1 += 1;
        }
        s2 -= mash(args[i]);
        if(s2 < 0) {
          s2 += 1;
        }
      }
      mash = null;

      var random = function() {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        // https://github.com/nquinlan/better-random-numbers-for-javascript-mirror/blob/master/support/js/Alea.js#L38
        return s2 = t - (c = t | 0);
      };
      random.uint32 = function() {
        return random() * 0x100000000; // 2^32
      };
      random.fract53 = function() {
        return random() +
          (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
      };
      random.version = 'Alea 0.9';
      random.args = args;
      return random;

    }(Array.prototype.slice.call(arguments)));
  };

  /**
   * @ignore
   */
  NumberOperators._Mash = function() {
    var n = 0xefc8249d;

    var mash = function(data) {
      data = data.toString();
      for(var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return(n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

    mash.version = 'Mash 0.9';
    return mash;
  };

  /**
   * @classdesc List Operators
   *
   * @namespace
   * @category basics
   */
  function ListOperators() {}
  /**
   * gets an element in a specified position from a List
   * @param  {List} list
   *
   * @param  {Number} index
   * @return {Object}
   * tags:
   */
  ListOperators.getElement = function(list, index) {
    if(list == null) return null;
    index = index == null ? 0 : index % list.length;
    return list[index];
  };

  /**
   * multi-ouput operator that gives acces to individual elements
   * @param  {List} list
   *
   * @param  {Number} fromIndex (default 0)
   * @return {Object} first Object
   * @return {Object} second Object
   * @return {Object} third Object
   * @return {Object} fourth Object
   * @return {Object} fifth Object
   * @return {Object} sisxth Object
   * @return {Object} seventh Object
   * @return {Object} eight Object
   * @return {Object} ninth Object
   * @return {Object} tenth Object
   * tags:
   */
  ListOperators.getFirstElements = function(list, fromIndex) {
    if(list == null) return null;

    fromIndex = fromIndex == null ? 0 : Number(fromIndex);

    return [
    {
      type: "Object",
      name: "first value",
      description: "first value",
      value: list[fromIndex + 0]
    },
    {
      type: "Object",
      name: "second value",
      description: "second value",
      value: list[fromIndex + 1]
    },
    {
      type: "Object",
      name: "third value",
      description: "third value",
      value: list[fromIndex + 2]
    },
    {
      type: "Object",
      name: "fourth value",
      description: "fourth value",
      value: list[fromIndex + 3]
    },
    {
      type: "Object",
      name: "fifth value",
      description: "fifth value",
      value: list[fromIndex + 4]
    },
    {
      type: "Object",
      name: "sixth value",
      description: "sixth value",
      value: list[fromIndex + 5]
    },
    {
      type: "Object",
      name: "seventh value",
      description: "seventh value",
      value: list[fromIndex + 6]
    },
    {
      type: "Object",
      name: "eight value",
      description: "eight value",
      value: list[fromIndex + 7]
    },
    {
      type: "Object",
      name: "ninth value",
      description: "ninth value",
      value: list[fromIndex + 8]
    },
    {
      type: "Object",
      name: "tenth value",
      description: "tenth value",
      value: list[fromIndex + 9]
    }];
  };


  /**
  * check if two lists contain same elements
  * @param {List} list0 first list
  * @param {List} list1 second list
  * @return {Boolean}
  * tags:
  */
  ListOperators.containSameElements = function(list0, list1) {
    if(list0==null || list1==null) return null;

    var l = list0.length;
    var i;

    if(l!=list1.length) return;

    for(i=0; i<l; i++){
      if(list0[i]!=list1[i]) return false;
    }

    return true;
  };


  /**
   * first position of element in list (-1 if element doesn't belong to the list)
   * @param  {List} list
   * @param  {Object} element
   * @return {Number}
   * tags:
   */
  ListOperators.indexOf = function(list, element) {
    return list.indexOf(element);
  };

  /**
   * concats lists
   * @param  {List} list0
   * @param  {List} list1
   *
   * @param  {List} list2
   * @param  {List} list3
   * @param  {List} list4
   * @return {List} list5
   * tags:
   */
  ListOperators.concat = function() {
    if(arguments == null || arguments.length === 0 ||  arguments[0] == null) return null;
    if(arguments.length == 1) return arguments[0];

    var i;
    var list = arguments[0].concat(arguments[1]);
    for(i = 2; arguments[i]; i++) {
      list = list.concat(arguments[i]);
    }
    return list.getImproved();
  };

  /**
   * assembles a List
   * @param  {Object} argument0
   *
   * @param  {Object} argument1
   * @param  {Object} argument2
   * @param  {Object} argument3
   * @param  {Object} argument4
   * @return {List}
   * tags:
   */
  ListOperators.assemble = function() {
    return List.fromArray(Array.prototype.slice.call(arguments, 0)).getImproved();
  };



  /**
   * returns a table with two Lists: words and occurrences
   * @param {List} list
   *
   * @param {Boolean} sortListsByOccurrences optional, true by default, common words first
   * @param {Boolean} consecutiveRepetitions optional false by default, if true only counts consecutive repetitions
   * @param {Number} optional limit, limits the size of the lists
   * @return {Table}
   * tags:count,toimprove,deprecated
   */
  // ListOperators.countElementsRepetitionOnList = function(list, sortListsByOccurrences, consecutiveRepetitions, limit) { //transform this, use dictionary instead of indexOf !!!!!!!
  //   if(list == null) return;

  //   sortListsByOccurrences = sortListsByOccurrences == null ? true : sortListsByOccurrences;
  //   consecutiveRepetitions = consecutiveRepetitions || false;
  //   limit = limit == null ? 0 : limit;

  //   var obj;
  //   var elementList = instantiate(typeOf(list));
  //   var numberList = new NumberList();
  //   var index;
  //   var i;

  //   if(consecutiveRepetitions) {
  //     if(list.length == 0) return null;
  //     var previousElement = list[0];
  //     elementList.push(previousElement);
  //     numberList.push(1);
  //     for(i = 1; i < nElements; i++) {
  //       obj = list[i];
  //       if(obj == previousElement) {
  //         numberList[numberList.length - 1] = numberList[numberList.length - 1] + 1;
  //       } else {
  //         elementList.push(obj);
  //         numberList.push(1);
  //         previousElement = obj;
  //       }
  //     }
  //   } else {
  //     for(i = 0; list[i] != null; i++){
  //       obj = list[i];
  //       index = elementList.indexOf(obj);
  //       if(index != -1) {
  //         numberList[index]++;
  //       } else {
  //         elementList.push(obj);
  //         numberList.push(1);
  //       }
  //     }
  //   }

  //   if(elementList.type == "NumberList") {
  //     var table = new NumberTable();
  //   } else {
  //     var table = new Table();
  //   }
  //   table[0] = elementList;
  //   table[1] = numberList;

  //   if(sortListsByOccurrences) {
  //     table = TableOperators.sortListsByNumberList(table, numberList);
  //   }

  //   if(limit != 0 && limit < elementList.length) {
  //     table[0] = table[0].splice(0, limit);
  //     table[1] = table[1].splice(0, limit);
  //   }

  //   return table;
  // };


  /**
   * reverses a list
   * @param {List} list
   * @return {List}
   * tags:sorting
   */
  ListOperators.reverse = function(list) {
    return list.getReversed();
  };

  /**
   * @todo write docs
   */
  ListOperators.getBooleanDictionaryForList = function(list){
    if(list==null) return;

    var dictionary = {};
    list.forEach(function(element){
      dictionary[element] = true;
    });

    return dictionary;
  };

  /**
   * builds a dictionar object (relational array) for a dictionar (table with two lists)
   * @param  {Table} dictionary table with two lists, typically without repetitions, elements of the second list being the 'translation' of the correspdonent on the first
   * @return {Object} relational array
   * tags:
   */
  ListOperators.buildDictionaryObjectForDictionary = function(dictionary){
    if(dictionary==null || dictionary.length<2) return;

    var dictionaryObject = {};

    dictionary[0].forEach(function(element, i){
      dictionaryObject[element] = dictionary[1][i];
    });

    return dictionaryObject;
  };


  /**
   * using a table with two columns as a dictionary (first list elements to be read, second list result elements), translates a list
   * @param  {List} list to transalte
   * @param  {Table} dictionary table with two lists
   *
   * @param {Object} nullElement element to place in case no translation is found
   * @return {List}
   * tags:
   */
  ListOperators.translateWithDictionary = function(list, dictionary, nullElement) {
    if(list==null || dictionary==null || dictionary.length<2) return;

    var dictionaryObject = ListOperators.buildDictionaryObjectForDictionary(dictionary);

    var newList = ListOperators.translateWithDictionaryObject(list, dictionaryObject, nullElement);

    newList.dictionaryObject = dictionaryObject;

    return newList;
  };

  /**
   * creates a new list that is a translation of a list using a dictionar object (a relation array)
   * @param  {List} list
   * @param  {Object} dictionaryObject
   *
   * @param  {Object} nullElement
   * @return {List}
   * tags:
   */
  ListOperators.translateWithDictionaryObject = function(list, dictionaryObject, nullElement) {
    if(list==null || dictionaryObject==null) return;

    var newList = new List();
    var i;
    var nElements = list.length;

    for(i=0; i<nElements; i++){
      newList[i] = dictionaryObject[list[i]];
    }
    // list.forEach(function(element, i) {
    //   newList[i] = dictionaryObject[element];
    // });

    if(nullElement!=null){
      var l = list.length;
      for(i=0; i<l; i++){
        if(newList[i]==null) newList[i]=nullElement;
      }
    }
    newList.name = list.name;
    return newList.getImproved();
  };


  // ListOperators.getIndexesOfElements=function(list, elements){
  // 	var numberList = new NumberList();
  // 	var i;
  // 	for(i=0; elements[i]!=null; i++){
  // 		numberList[i] = list.indexOf(elements[i]);
  // 	}
  // 	return numberList;
  // }


  // ListOperators.countOccurrencesOnList=function(list){
  // 	var occurrences=new NumberList();
  // 	var nElements=list.length;
  // 	for(var i=0; list[i]!=null; i++){
  // 		occurrences.push(this.getIndexesOfElement(list,list[i]).length);
  // 	}
  // 	return occurrences;
  // }


  /**
   * @todo write docs
   */
  ListOperators.sortListByNumberList = function(list, numberList, descending) {
    if(descending == null) descending = true;
    if(numberList.length === 0) return list;

    var pairs = [];
    var newList = instantiate(typeOf(list));
    var i;

    for(i = 0; list[i] != null; i++) {
      pairs.push([list[i], numberList[i]]);
    }


    if(descending) {
      pairs.sort(function(a, b) {
        if(a[1] < b[1]) return 1;
        return -1;
      });
    } else {
      pairs.sort(function(a, b) {
        if(a[1] < b[1]) return -1;
        return 1;
      });
    }

    for(i = 0; pairs[i] != null; i++) {
      newList.push(pairs[i][0]);
    }
    newList.name = list.name;
    return newList;
  };


  /**
   * @todo write docs
   */
  ListOperators.sortListByIndexes = function(list, indexedArray) {
    var newList = instantiate(typeOf(list));
    newList.name = list.name;
    var nElements = list.length;
    var i;
    for(i = 0; i < nElements; i++) {
      newList.push(list[indexedArray[i]]);
    }
    return newList;
  };


  /**
   * @todo write docs
   */
  ListOperators.concatWithoutRepetitions = function() {
    var i;
    var newList = arguments[0].clone();
    for(i = 1; i < arguments.length; i++) {
      var addList = arguments[i];
      var nElements = addList.length;
      for(i = 0; i < nElements; i++) { // TODO Is the redefing of i intentional?
        if(newList.indexOf(addList[i]) == -1) newList.push(addList[i]);
      }
    }
    return newList.getImproved();
  };

  /**
   * builds a table: a list of sub-lists from the original list, each sub-list determined size subListsLength, and starting at certain indexes separated by step
   * @param  {List} list
   * @param  {Number} subListsLength length of each sub-list
   * @param  {Number} step slifing step
   * @param  {Number} finalizationMode<br>0:all sub-Lists same length, doesn't cover the List<br>1:last sub-List catches the last elements, with lesser length<br>2:all lists same length, last sub-list migth contain elements from the beginning of the List
   * @return {Table}
   * tags:
   */
  ListOperators.slidingWindowOnList = function(list, subListsLength, step, finalizationMode) {
    finalizationMode = finalizationMode || 0;
    var table = new Table();
    var newList;
    var nElements = list.length;
    var i;
    var j;

    step = Math.max(1, step);

    switch(finalizationMode) {
      case 0: //all sub-Lists same length, doesn't cover the List
        for(i = 0; i < nElements; i += step) {
          if(i + subListsLength <= nElements) {
            newList = new List();
            for(j = 0; j < subListsLength; j++) {
              newList.push(list[i + j]);
            }
            table.push(newList.getImproved());
          }
        }
        break;
      case 1: //last sub-List catches the last elements, with lesser length
        for(i = 0; i < nElements; i += step) {
          newList = new List();
          for(j = 0; j < Math.min(subListsLength, nElements - i); j++) {
            newList.push(list[i + j]);
          }
          table.push(newList.getImproved());
        }
        break;
      case 2: //all lists same length, last sub-list migth contain elements from the beginning of the List
        for(i = 0; i < nElements; i += step) {
          newList = new List();
          for(j = 0; j < subListsLength; j++) {
            newList.push(list[(i + j) % nElements]);
          }
          table.push(newList.getImproved());
        }
        break;
    }

    return table.getImproved();
  };

  /**
   * @todo write docs
   */
  ListOperators.getNewListForObjectType = function(object) {
    var newList = new List();
    newList[0] = object;
    return instantiateWithSameType(newList.getImproved());
  };


  /*
  deprectaed, use intersection instead
   */
  // ListOperators.listsIntersect = function(list0, list1) {
  //   var list = list0.length < list1.length ? list0 : list1;
  //   var otherList = list0 == list ? list1 : list0;
  //   for(var i = 0; list[i] != null; i++) {
  //     if(otherList.indexOf(list[i]) != -1) return true;
  //   }
  //   return false;
  // };


  /**
   * creates a List that contains the union of two List (removing repetitions)
   * @param  {List} list0 first list
   * @param  {List} list1 second list
   *
   * @return {List} the union of both Lists
   * tags:
   */
  ListOperators.union = function(list0, list1) {//TODO: this should be refactored, and placed in ListOperators
    if(list0==null || list1==null) return;

    var obj = {};
    var i, k;

    for(i = 0; list0[i]!=null; i++) obj[list0[i]] = list0[i];
    for(i = 0; list1[i]!=null; i++) obj[list1[i]] = list1[i];
    var union = new List();
    for(k in obj) {
      //if(obj.hasOwnProperty(k)) // <-- optional
      union.push(obj[k]);
    }
    return union;
  };


  /**
   * returns the list of common elements between two lists (deprecated, use union instead)
   * @param  {List} list0
   * @param  {List} list1
   * @return {List}
   * tags:deprecated
   */
  ListOperators.getCommonElements = function(list0, list1) {
    var nums = list0.type == 'NumberList' && list1.type == 'NumberList';
    var strs = list0.type == 'StringList' && list1.type == 'StringList';
    var newList = nums ? new NumberList() : (strs ? new StringList() : new List());

    var list = list0.length < list1.length ? list0 : list1;
    var otherList = list0 == list ? list1 : list0;

    for(var i = 0; list[i] != null; i++) {
      if(otherList.indexOf(list[i]) != -1) newList.push(list[i]);
    }
    if(nums || strs) return newList;
    return newList.getImproved();
  };




  /**
   * creates a List that contains the union of two List (removing repetitions) (deprecated, use union instead)
   * @param  {List} list0
   * @param  {List} list A
   * @param  {List} list B
   *
   * @return {List} the union of both NumberLists
   * tags:deprecated
   */
  ListOperators.unionLists = function(x, y) {
    // Borrowed from here: http://stackoverflow.com/questions/3629817/getting-a-union-of-two-arrays-in-javascript
    var result;
    if(x.type != x.type || (x.type != "StringList" && x.type != "NumberList")) {
      // To-do: call generic method here (not yet implemented)
      //console.log( "ListOperators.unionLists for type '" + x.type + "' or '" + y.type + "' not yet implemented" );
      return x.concat(y).getWithoutRepetitions();
    }
    else {
      var obj = {};
      var i;
      for(i = x.length - 1; i >= 0; --i){
        obj[x[i]] = x[i];
      }
      for(i = y.length - 1; i >= 0; --i){
        obj[y[i]] = y[i];
      }
      result = x.type == "StringList" ? new StringList() : new NumberList();
      for(var k in obj) {
        if(obj.hasOwnProperty(k)) // <-- optional
          result.push(obj[k]);
      }
    }
    return result;
  };

  /**
   * creates a List that contains the intersection of two List (elements present in BOTH lists)
   *
   * @param  {List} list0 list A
   * @param  {List} list1 list B
   *
   * @return {List} intersection of both NumberLists
   *
   * tags:
   */
  ListOperators.intersection = function(list0, list1) {
    if(list0==null || list1==null) return;

    var intersection;

    if(list0.type=="NodeList" && list1.type=="NodeList"){
      intersection = new NodeList();

      list0.forEach(function(node){
        if(list1.getNodeById(node.id)){
          intersection.addNode(node);
        }
      });

      return intersection;
    }

    var dictionary = {};
    var dictionaryIntersected = {};
    intersection = new List();

    list0.forEach(function(element){
      dictionary[element] = true;
    });
    list1.forEach(function(element){
      if(dictionary[element] && dictionaryIntersected[element]==null){
        dictionaryIntersected[element]=true;
        intersection.push(element);
      }
    });
    return intersection.getImproved();
  };

  /**
   * calculates Jaccard index |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
   * @param  {List} list0
   * @param  {List} list1
   * @return {Number}
   * tags:
   */
  ListOperators.jaccardIndex = function(list0, list1) {//TODO: see if this can be more efficient, maybe one idctionar for doing union and interstection at the same time
    return ListOperators.intersection(list0, list1).length/ListOperators.unionLists(list0, list1).length;
  };

  /**
   * calculates Jaccard distance 1 - |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
   * @param  {List} list0
   * @param  {List} list1
   * @return {Number}
   * tags:
   */
  ListOperators.jaccardDistance = function(list0, list1) {
    return 1 - ListOperators.jaccardIndex(list0, list1);
  };



  /**
   * builds a dictionary that matches an element of a List with its index on the List (indexesDictionary[element] --> index)
   * it assumes there's no repetitions on the list (if that's not tha case the last index of the element will be delivered)
   * @param  {List} list
   * @return {Object}
   * tags:dictionary
   */
  ListOperators.getSingleIndexDictionaryForList = function(list){
    if(list==null) return;

    var i;
    var l = list.length;

    var dictionary = {};
    for(i=0; i<l; i++){
      dictionary[list[i]] = i;
    }

    return dictionary;
  };

  /**
   * builds a dictionary that matches an element of a List with all its indexes on the List (indexesDictionary[element] --> numberList of indexes of element on list)
   * if the list has no repeated elements, and a single is required per element, use ListOperators.getSingleIndexDictionaryForList
   * @param  {List} list
   * @return {Object}
   * tags:dictionary
   */
  ListOperators.getIndexesDictionary = function(list){
    var indexesDictionary = {};

    list.forEach(function(element, i){
      if(indexesDictionary[element]==null) indexesDictionary[element]=new NumberList();
      indexesDictionary[element].push(i);
    });

    return indexesDictionary;
  };

  /**
   * @todo write docs
   */
  ListOperators.getIndexesTable = function(list){
    var indexesTable = new Table();
    indexesTable[0] = new List();
    indexesTable[1] = new NumberTable();
    var indexesDictionary = {};
    var indexOnTable;

    list.forEach(function(element, i){
      indexOnTable = indexesDictionary[element];
      if(indexOnTable==null){
        indexesTable[0].push(element);
        indexesTable[1].push(new NumberList(i));
        indexesDictionary[element]=indexesTable[0].length-1;
      } else {
        indexesTable[1][indexOnTable].push(i);
      }
    });

    indexesTable[0] = indexesTable[0].getImproved();

    return indexesTable;
  };

  /**
   * aggregates values of a list using an aggregator list as reference
   *
   * @param  {List} aggregatorList aggregator list that typically contains several repeated elements
   * @param  {List} toAggregateList list of elements that will be aggregated
   * @param  {Number} mode aggregation modes:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements<br>14:concat elements (string)<br>15:concat non-repeated elements
   * @param  {Table} indexesTable optional already calculated table of indexes of elements on the aggregator list (if didn't provided, the method calculates it)
   * @return {Table} contains a list with non repeated elements on the first list, and the aggregated elements on a second list
   * tags:
   */
  ListOperators.aggregateList = function(aggregatorList, toAggregateList, mode, indexesTable){
    if(aggregatorList==null || toAggregateList==null) return null;
    var table = new Table();

    if(indexesTable==null) indexesTable = ListOperators.getIndexesTable(aggregatorList);

    if(mode==11) return indexesTable;

    table[0] = indexesTable[0];

    if(mode===0 && aggregatorList==toAggregateList){
      table[1] = indexesTable[0];
      return table;
    }

    mode = mode==null?0:mode;

    var list;
    var elementsTable;

    switch(mode){
      case 0://first element
        table[1] = new List();
        indexesTable[1].forEach(function(indexes){
          table[1].push(toAggregateList[indexes[0]]);
        });
        table[1] = table[1].getImproved();
        return table;
      case 1://count
        table[1] = new NumberList();
        indexesTable[1].forEach(function(indexes){
          table[1].push(indexes.length);
        });
        return table;
      case 2://sum
      case 3://average
        var sum;
        table[1] = new NumberList();
        indexesTable[1].forEach(function(indexes){
          sum = 0;
          indexes.forEach(function(index){
            sum+=toAggregateList[index];
          });
          if(mode==3) sum/=indexes.length;
          table[1].push(sum);
        });
        return table;
      case 4://min
        var min;
        table[1] = new NumberList();
        indexesTable[1].forEach(function(indexes){
          min = 99999999999;
          indexes.forEach(function(index){
            min=Math.min(min, toAggregateList[index]);
          });
          table[1].push(min);
        });
        return table;
      case 5://max
        var max;
        table[1] = new NumberList();
        indexesTable[1].forEach(function(indexes){
          max = -99999999999;
          indexes.forEach(function(index){
            max=Math.max(max, toAggregateList[index]);
          });
          table[1].push(max);
        });
        return table;
      case 6://standard deviation
        var average;
        table = ListOperators.aggregateList(aggregatorList, toAggregateList, 3, indexesTable);
        indexesTable[1].forEach(function(indexes, i){
          sum = 0;
          average = table[1][i];
          indexes.forEach(function(index){
            sum += Math.pow(toAggregateList[index] - average, 2);
          });
          table[1][i] = Math.sqrt(sum/indexes.length);
        });
        return table;
      case 7://enlist
        table[1] = new Table();
        indexesTable[1].forEach(function(indexes){
          list = new List();
          table[1].push(list);
          indexes.forEach(function(index){
            list.push(toAggregateList[index]);
          });
          list = list.getImproved();
        });
        return table.getImproved();
      case 8://last element
        table[1] = new List();
        indexesTable[1].forEach(function(indexes){
          table[1].push(toAggregateList[indexes[indexes.length-1]]);
        });
        table[1] = table[1].getImproved();
        return table;
      case 9://most common
        table[1] = new List();
        elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
        elementsTable[1].forEach(function(elements){
          table[1].push(elements.getMostRepeatedElement());
        });
        table[1] = table[1].getImproved();
        return table;
      case 10://random
        table[1] = new List();
        indexesTable[1].forEach(function(indexes){
          table[1].push( toAggregateList[indexes[ Math.floor(Math.random()*indexes.length) ]] );
        });
        table[1] = table[1].getImproved();
        return table;
      case 11://indexes (returned previosuly)
        break;
      case 12://count non repeated
        table[1] = new NumberList();
        elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
        elementsTable[1].forEach(function(elements){
          table[1].push(elements.getWithoutRepetitions().length);
        });
        return table;
      case 13://enlist non repeated
        table[1] = new List();
        elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
        elementsTable[1].forEach(function(elements){
          table[1].push(elements.getWithoutRepetitions());
        });
        table[1] = table[1].getImproved();
        return table;
      case 14://concat string
        table[1] = new StringList();
        elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
        elementsTable[1].forEach(function(elements){
          table[1].push( elements.join(', ') );
        });
        return table;
      case 15://concat string non repeated
        table[1] = new StringList();
        elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
        elementsTable[1].forEach(function(elements){
          table[1].push( elements.getWithoutRepetitions().join(', ') );
        });
        return table;
    }

    return null;
  };

  /**
   * Analyses wether two lists are categorical identical, one is subcategorical to the other, or there's no relation
   * @param  {List} list0
   * @param  {List} list1
   * @return {Number} 0:no relation, 1:categorical identical, 2:list0 subcategorical to list1, 3:list1 subcategorical to list0
   * tags:
   */
  ListOperators.subCategoricalAnalysis = function(list0, list1){
    if(list0==null || list1==null) return;

    var dictionary = {};
    var element, projection;
    var i;
    var list0SubCategorical = true;
    for(i=0; list0[i]!=null; i++){
      element = list0[i];
      projection = dictionary[element];
      if(projection==null){
        dictionary[element] = list1[i];
      } else if(projection!=list1[i]){
        list0SubCategorical = false;
        break;
      }
    }

    dictionary = {};
    var list1SubCategorical = true;
    for(i=0; list1[i]!=null; i++){
      element = list1[i];
      projection = dictionary[element];
      if(projection==null){
        dictionary[element] = list0[i];
      } else if(projection!=list0[i]){
        list1SubCategorical = false;
        break;
      }
    }

    if(list1SubCategorical && list0SubCategorical) return 1;
    if(list0SubCategorical) return 2;
    if(list1SubCategorical) return 3;
    return 0;
  };

  /**
   * calculates de entropy of a list, properties _mostRepresentedValue and _biggestProbability are added to the list
   * @param  {List} list with repeated elements (actegorical list)
   *
   * @param {Object} valueFollowing if a value is provided, the property _P_valueFollowing will be added to the list, with proportion of that value in the list
   * @param {Table} freqTable for saving time, in case the frequency table with sorted elements has been already calculated (with list.getFrequenciesTable(true))
   * @return {Number}
   * tags:statistics
   */
  ListOperators.getListEntropy = function(list, valueFollowing, freqTable) {
    if(list == null) return;

    if(list.length < 2) {
      if(list.length == 1) {
        list._mostRepresentedValue = list[0];
        list._biggestProbability = 1;
        if(valueFollowing != null) list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
      } else {
        if(valueFollowing != null) list._P_valueFollowing = 0;
      }
      return 0;
    }

    if(freqTable==null) freqTable = list.getFrequenciesTable(true);// ListOperators.countElementsRepetitionOnList(list, true);

    list._mostRepresentedValue = freqTable[0][0];
    var N = list.length;
    list._biggestProbability = freqTable[1][0] / N;
    if(freqTable[0].length == 1) {
      list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
      return 0;
    }
    var entropy = 0;

    var norm = Math.log(freqTable[0].length);
    freqTable[1].forEach(function(val) {
      entropy -= (val / N) * Math.log(val / N) / norm;
    });

    if(valueFollowing != null) {
      var index = freqTable[0].indexOf(valueFollowing);
      list._P_valueFollowing = index == -1 ? 0 : freqTable[1][index] / N;
    }
    return entropy;
  };


  /**
   * measures how much a feature decreases entropy when segmenting by its values by a supervised variable
   * @param  {List} feature
   * @param  {List} supervised
   * @return {Number}
   * tags:ds
   */
  ListOperators.getInformationGain = function(feature, supervised) {
    if(feature == null || supervised == null || feature.length != supervised.length) return null;

    var ig = ListOperators.getListEntropy(supervised);
    var childrenObject = {};
    var childrenLists = [];
    var N = feature.length;

    feature.forEach(function(element, i) {
      if(childrenObject[element] == null) {
        childrenObject[element] = new List();
        childrenLists.push(childrenObject[element]);
      }
      childrenObject[element].push(supervised[i]);
    });

    childrenLists.forEach(function(cl) {
      ig -= (cl.length / N) * ListOperators.getListEntropy(cl);
    });

    return ig;
  };

  /**
   * @todo write docs
   */
  ListOperators.getInformationGainAnalysis = function(feature, supervised) {
    if(feature == null || supervised == null || feature.length != supervised.length) return null;

    var ig = ListOperators.getListEntropy(supervised);
    var childrenObject = {};
    var childrenLists = [];
    var N = feature.length;
    var entropy;
    var sets = new List();

    feature.forEach(function(element, i) {
      if(childrenObject[element] == null) {
        childrenObject[element] = new List();
        childrenLists.push(childrenObject[element]);
      }
      childrenObject[element].push(supervised[i]);
    });

    childrenLists.forEach(function(cl) {
      entropy = ListOperators.getListEntropy(cl);
      ig -= (cl.length / N) * entropy;

      sets.push({
        children: cl,
        entropy: entropy,
        infoGain: ig
      });
    });

    return sets;
  };


  /**
   * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
   * @param  {List} list of elements to group
   * @param  {Boolean} whether the results are to be sorted or not
   * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
   *
   * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
   * @return {Table}
   * tags:dani
   */
  ListOperators.groupElements = function(list, sortedByValue, mode, fillBlanks) {
    if(!list)
      return;
    var result = ListOperators._groupElements_Base(list, null, sortedByValue, mode, fillBlanks);
    return result;
  };


  /**
   * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
   * @param  {List} list of elements to group
   * @param  {String} name of the property to be used for grouping
   * @param  {Boolean} wether the results are to be sorted or not
   * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
   *
   * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
   * @return {Table}
   * tags:dani
   */
  ListOperators.groupElementsByPropertyValue = function(list, propertyName, sortedByValue, mode, fillBlanks) {
    if(!list)
      return;
    var result = ListOperators._groupElements_Base(list, propertyName, sortedByValue, mode, fillBlanks);
    return result;
  };



  /**
   * @ignore
   */
  ListOperators._groupElements_Base = function(list, propertyName, sortedByValue, mode, fillBlanks) {
    if(!list)
      return;
    if(mode == undefined){
      mode = 0;
    }
    var resultOb = {};
    var resultTable = new Table();
    var pValue, item, minValue, maxValue, i;
    for(i = 0; i < list.length; i++) {
      item = list[i];
      pValue = propertyName == undefined ? item : item[propertyName];
      if(resultOb[pValue] === undefined) {
        resultOb[pValue] = new List();
        resultOb[pValue].name = pValue;
        resultOb[pValue].valProperty = pValue;
        resultTable.push(resultOb[pValue]);
      }
      if(mode === 0)
        resultOb[pValue].push(item);
      else if(mode == 1)
        resultOb[pValue].push(i);
      // Update boundaries
      if(minValue === undefined || pValue < minValue) {
        minValue = pValue;
      }
      if(maxValue === undefined || pValue > maxValue) {
        maxValue = pValue;
      }
    }

    // Fill the blanks
    if(fillBlanks) {
      var numBlanks = 0;
      for(i = minValue; i < maxValue; i++) {
        if(resultOb[i] === undefined) {
          resultOb[i] = new List();
          resultOb[i].name = i;
          resultOb[i].valProperty = i;
          resultTable.push(resultOb[i]);
          numBlanks++;
        }
      }
      //console.log("numBlanks: ", numBlanks)
    }

    // To-do: looks like getSortedByProperty is removing the valProperty from the objects
    if(sortedByValue)
      resultTable = resultTable.getSortedByProperty("name"); // "valProperty"

    return resultTable;

  };

  /**
   * returns a string representing list
   *
   * @param  {List} list
   * @param  {Number} level
   *
   */
  ListOperators.getReport = function(list, level) { //TODO:complete
    var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
    var text = level > 0 ? (ident + "////report of instance of List////") : "///////////report of instance of List//////////";

    var length = list.length;
    var i;

    text += ident + "name: " + list.name;
    text += ident + "type: " + list.type;

    if(length === 0) {
      text += ident + "single element: [" + list[0] + "]";
      return text;
    } else {
      text += ident + "length: " + length;
      text += ident + "first element: [" + list[0] + "]";
    }

    switch(list.type) {
      case "NumberList":
        var min = list.getMin();
        var max = list.getMax();
        list.min = min;
        list.max = max;
        var average = list.getAverage();//(min + max) * 0.5;
        list.average = average;
        text += ident + "min: " + min;
        text += ident + "max: " + max;
        text += ident + "average: " + average;
        if(length < 101) {
          text += ident + "numbers: " + list.join(", ");
        }
        break;
      case "StringList":
      case "List":
      case "ColorList":
        var freqTable = list.getFrequenciesTable(true);
        list._freqTable = freqTable;
        text += ident + "number of different elements: " + freqTable[0].length;
        if(freqTable[0].length < 10) {
          text += ident + "elements frequency:";
        } else {
          text += ident + "some elements frequency:";
        }

        for(i = 0; freqTable[0][i] != null && i < 10; i++) {
          text += ident + "  [" + String(freqTable[0][i]) + "]: " + freqTable[1][i];
        }

        var joined;
        if(list.type == "List") {
          joined = list.join("], [");
        } else {
          joined = ListConversions.toStringList(list).join("], [");
        }

        if(joined.length < 2000) text += ident + "strings: [" + joined + "]";
        break;

    }

    ///add ideas to: analyze, visualize


    return text;
  };


  ListOperators.getReportHtml = function(list, level) { //TODO:complete
    var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
    var text =  level > 0 ? "" : "<b><font style=\"font-size:18px\">list report</f></b>";

    var length = list.length;
    var i;

    if(list.name){
      text += ident + "name: <b>" + list.name + "</b>";
    } else {
      text += ident + "<i>no name</i>";
    }
    text += ident + "type: <b>" + list.type + "</b>";

    if(length === 0) {
      text += ident + "single element: [<b>" + list[0] + "</b>]";
      return text;
    } else {
      text += ident + "length: <b>" + length + "</b>";
      text += ident + "first element: [<b>" + list[0] + "</b>]";
    }

    switch(list.type) {
      case "NumberList":
        var min = 9999999;
        var max = -9999999;
        var average = 0;
        var shorten = new NumberList();
        var index = 0;
        var accumsum = 0;
        var maxAccumsum = -99999;
        var sizeAccum = Math.max(Math.floor(list.length/50), 1);

        list.forEach(function(val){
          min = Math.min(min, val);
          max = Math.max(max, val);
          average += val;
          accumsum += val;
          index++;
          if(index==sizeAccum){
            accumsum /= index;
            maxAccumsum = Math.max(maxAccumsum, accumsum);
            shorten.push(accumsum);
            accumsum=0;
            index=0;
          }
        });
        if(index !== 0){
            accumsum /=index;
            maxAccumsum = Math.max(maxAccumsum, accumsum);
            shorten.push(accumsum);
        }

        shorten = shorten.factor(1/maxAccumsum);

        average /= list.length;

        list.min = min;
        list.max = max;
        list.average = average;
        text += ident + "min: <b>" + min + "</b>";
        text += ident + "max: <b>" + max + "</b>";
        text += ident + "average: <b>" + average + "</b>";
        if(length < 101) {
          text += ident + "numbers: <b>" + list.join("</b>, <b>") + "</b>";
        }
        text += ident;
        for(i=0; shorten[i]!=null; i++){
          text += "<font style=\"font-size:7px\"><font color=\""+ColorOperators.colorStringToHEX(ColorScales.grayToOrange(shorten[i]))+"\">█</f></f>";
        }
        break;
      case "StringList":
      case "List":
      case "ColorList":
        var freqTable = list.getFrequenciesTable(true);
        list._freqTable = freqTable;
        var catColors = ColorListGenerators.createCategoricalColors(2, freqTable[0].length);

        text += ident + "entropy: <b>" + NumberOperators.numberToString(ListOperators.getListEntropy(list, null, freqTable), 4) + "</b>";

        text += ident + "number of different elements: <b>" + freqTable[0].length + "</b>";
        if(freqTable[0].length < 10) {
          text += ident + "elements frequency:";
        } else {
          text += ident + "some elements frequency:";
        }

        for(i = 0; freqTable[0][i] != null && i < 10; i++) {
          text += ident + "  [<b>" + String(freqTable[0][i]) + "</b>]: <font style=\"font-size:10px\"><b><font color=\""+ColorOperators.colorStringToHEX(catColors[i])+"\">" + freqTable[1][i] + "</f></b></f>";
        }

        var joined;
        if(list.type == "List") {
          joined = list.join("], [");
        } else {
          joined = ListConversions.toStringList(list).join("], [");
        }

        if(joined.length < 2000) text += ident + "contents: [" + joined + "]";

        var weights = NumberListOperators.normalizedToSum(freqTable[1]);

        var bars = StringOperators.createsCategoricalColorsBlocksHtml(weights, 55, catColors);
        text += ident;
        text += "<font style=\"font-size:7px\">"+bars+"</f>";

        break;
    }


    ///add ideas to: analyze, visualize
    return text;
  };

  /**
   * @classdesc NumberList Generators
   *
   * @namespace
   * @category numbers
   */
  function NumberListGenerators() {}
  /**
   * Generate a NumberList with sorted Numbers
   * @param {Number} nValues length of the NumberList
   *
   * @param {Number} start first value
   * @param {Number} step increment value
   * @return {NumberList} generated NumberList
   * tags:generator
   */
  NumberListGenerators.createSortedNumberList = function(nValues, start, step) {
    start = start || 0;
    step = step || 1;
    if(step === 0) step = 1;
    var i;
    var numberList = new NumberList();
    for(i = 0; i < nValues; i++) {
      numberList.push(start + i * step);
    }
    return numberList;
  };

  // TODO: Should this function be here?
  /**
   * @todo finish docs
   */
  NumberList.createNumberListFromInterval = function(nElements, interval) {
    if(interval == null) interval = new Interval(0, 1);
    var numberList = new NumberList();
    var range = interval.getAmplitude();
    var i;
    for(i = 0; i < nElements; i++) {
      numberList.push(Number(interval.getMin()) + Number(Math.random() * range));
    }
    return numberList;
  };

  /**
   * creates a list with random numbers
   *
   * @param  {Number} nValues
   *
   * @param  {Interval} interval range of the numberList
   * @param  {Number} seed optional seed for seeded random numbers
   * @return {NumberList}
   * tags:random
   */
  NumberListGenerators.createRandomNumberList = function(nValues, interval, seed, func) {
    seed = seed == null ? -1 : seed;
    interval = interval == null ? new Interval(0, 1) : interval;

    var numberList = new NumberList();
    var amplitude = interval.getAmplitude();

    var random = seed == -1 ? Math.random : new NumberOperators._Alea("my", seed, "seeds");

    for(var i = 0; i < nValues; i++) {
      //seed = (seed*9301+49297) % 233280; //old method, close enough: http://moebio.com/research/randomseedalgorithms/
      //numberList[i] = interval.x + (seed/233280.0)*amplitude; //old method

      numberList[i] = func == null ? (random() * amplitude + interval.x) : func(random() * amplitude + interval.x);
    }

    return numberList;
  };

  ColorListGenerators._HARDCODED_CATEGORICAL_COLORS = new ColorList(
    "#dd4411", "#2200bb", "#1f77b4", "#ff660e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf", "#dd8811",
    "#dd0011", "#221140", "#1f66a3", "#ff220e", "#2ba01c", "#442728", "#945600", "#8c453a", "#e37700"
  );

  /**
   * @classdesc Tools for generating {@link List|Lists} of colors.
   *
   * @namespace
   * @category colors
   */
  function ColorListGenerators() {}
  /**
   * create a simple list of categorical colors
   * @param  {Number} nColors
   *
   * @param  {Number} alpha 1 by default
   * @param {Boolean} invert invert colors
   * @return {ColorList}
   * tags:generator
   */
  ColorListGenerators.createDefaultCategoricalColorList = function(nColors, alpha, invert) {
    alpha = alpha == null ? 1 : alpha;
    var colors = ColorListGenerators.createCategoricalColors(1, nColors).getInterpolated('black', 0.15);
    if(alpha < 1) colors = colors.addAlpha(alpha);

    if(invert) colors = colors.getInverted();

    return colors;
  };


  /**
   * create a colorList based on a colorScale and values from a numberList (that will be normalized)
   * @param  {NumberList} numberList
   *
   * @param  {ColorScale} colorScale
   * @param  {Number} mode 0:normalize numberList
   * @return {ColorList}
   * tags:generator
   */
  ColorListGenerators.createColorListFromNumberList = function(numberList, colorScale, mode) {
    if(numberList==null) return null;

    mode = mode == null ? 0 : mode;
    colorScale = colorScale==null?ColorScales.grayToOrange:colorScale;

    var colorList = new ColorList();
    var newNumberList;
    var i;

    switch(mode) {
      case 0: //0 to max
        newNumberList = NumberListOperators.normalizedToMax(numberList);
        break;
      case 1: //min to max
        break;
      case 2: //values between 0 and 1
        break;
    }

    for(i = 0; newNumberList[i] != null; i++) {
      colorList.push(colorScale(newNumberList[i]));
    }

    return colorList;
  };


  /**
   * Creates a new ColorList that contains the provided color. Size of the List
   * is controlled by the nColors input.
   *
   * @param {Number} nColors Length of the list.
   * @param {Color} color Color to fill list with.
   */
  ColorListGenerators.createColorListWithSingleColor = function(nColors, color) {
    var colorList = new ColorList();
    for(var i = 0; i < nColors; i++) {
      colorList.push(color);
    }
    return colorList;
  };


  /**
   * Creates a ColorList of categorical colors
   * @param {Number} mode 0:simple picking from color scale function, 1:random (with seed), 2:hardcoded colors, 3:, 4:, 5:evolutionary algorithm, guarantees non consecutive similar colors
   * @param {Number} nColors
   *
   * @param {ColorScale} colorScaleFunction
   * @param {Number} alpha transparency
   * @param {String} interpolateColor color to interpolate
   * @param {Number} interpolateValue interpolation value [0, 1]
   * @param {ColorList} colorList colorList to be used in mode 2 (if not colorList is provided it will use default categorical colors)
   * @return {ColorList} ColorList with categorical colors
   * tags:generator
   */
  ColorListGenerators.createCategoricalColors = function(mode, nColors, colorScaleFunction, alpha, interpolateColor, interpolateValue, colorList) {
    colorScaleFunction = colorScaleFunction == null ? ColorScales.temperature : colorScaleFunction;

    var i;
    var newColorList = new ColorList();
    switch(mode) {
      case 0: //picking from ColorScale
        for(i = 0; i < nColors; i++) {
          newColorList[i] = colorScaleFunction(i / (nColors - 1));
        }
        break;
      case 1: //seeded random numbers
        var values = NumberListGenerators.createRandomNumberList(nColors, null, 0);
        for(i = 0; i < nColors; i++) {
          newColorList[i] = colorScaleFunction(values[i]);
        }
        break;
      case 2:
        colorList = colorList==null?ColorListGenerators._HARDCODED_CATEGORICAL_COLORS:colorList;
        for(i = 0; i < nColors; i++) {
          newColorList[i] = colorList[i%colorList.length];
        }
        break;
      case 5:
        var randomNumbersSource = NumberListGenerators.createRandomNumberList(1001, null, 0);
        var positions = NumberListGenerators.createSortedNumberList(nColors);
        var randomNumbers = NumberListGenerators.createRandomNumberList(nColors, null, 0);
        var randomPositions = ListOperators.sortListByNumberList(positions, randomNumbers);

        var nGenerations = Math.floor(nColors * 2) + 100;
        var nChildren = Math.floor(nColors * 0.6) + 5;
        var bestEvaluation = ColorListGenerators._evaluationFunction(randomPositions);
        var child;
        var bestChildren = randomPositions;
        var j;
        var nr = 0;
        var evaluation;

        for(i = 0; i < nGenerations; i++) {
          for(j = 0; j < nChildren; j++) {
            child = ColorListGenerators._sortingVariation(randomPositions, randomNumbersSource[nr], randomNumbersSource[nr + 1]);
            nr = (nr + 2) % 1001;
            evaluation = ColorListGenerators._evaluationFunction(child);
            if(evaluation > bestEvaluation) {
              bestChildren = child;
              bestEvaluation = evaluation;
            }
          }
          randomPositions = bestChildren;
        }

        for(i = 0; i < nColors; i++) {
          newColorList.push(colorScaleFunction((1 / nColors) + randomPositions[i] / (nColors + 1))); //TODO: make more efficient by pre-nuilding the colorList
        }
        break;
    }

    if(interpolateColor != null && interpolateValue != null) {
      newColorList = newColorList.getInterpolated(interpolateColor, interpolateValue);
    }

    if(alpha) {
      newColorList = newColorList.addAlpha(alpha);
    }

    return newColorList;
  };

  /**
   * @ignore
   */
  ColorListGenerators._sortingVariation = function(numberList, rnd0, rnd1) { //private
    var newNumberList = numberList.clone();
    var pos0 = Math.floor(rnd0 * newNumberList.length);
    var pos1 = Math.floor(rnd1 * newNumberList.length);
    var cache = newNumberList[pos1];
    newNumberList[pos1] = newNumberList[pos0];
    newNumberList[pos0] = cache;
    return newNumberList;
  };

  /**
   * @ignore
   */
  ColorListGenerators._evaluationFunction = function(numberList) { //private
    var sum = 0;
    var i;
    for(i = 0; numberList[i + 1] != null; i++) {
      sum += Math.sqrt(Math.abs(numberList[i + 1] - numberList[i]));
    }
    return sum;
  };

  /**
   * Creates an object dictionary that matches elements from a list (that could contan repeated elements) with categorical colors
   * @param {List} the list containing categorical data
   *
   * @param {ColorList} ColorList with categorical colors
   * @param {Number} alpha transparency
   * @param {String} color to mix
   * @param {Number} interpolation value (0-1) for color mix
   * @param {Boolean} invert invert colors
   * @return {Object} object dictionar that delivers a color for each element on original list
   * tags:generator
   */
  ColorListGenerators.createCategoricalColorListDictionaryObject = function(list, colorList, alpha, color, interpolate, invert){
    if(list==null) return;

    var diffValues = list.getWithoutRepetitions();
    var diffColors = ColorListGenerators.createCategoricalColors(2, diffValues.length, null, alpha, color, interpolate, colorList);
    if(invert) diffColors = diffColors.getInverted();

    var dictionaryObject = {};

    diffValues.forEach(function(element, i){
      dictionaryObject[element] = diffColors[i];
    });

    return dictionaryObject;

  };

  /**
   * Creates a ColorList of categorical colors based on an input List. All entries with the same value will get the same color.
   * @param {List} the list containing categorical data
   *
   * @param {ColorList} ColorList with categorical colors
   * @param {Number} alpha transparency
   * @param {String} color to mix
   * @param {Number} interpolation value (0-1) for color mix
   * @param {Boolean} invert invert colors
   * @return {ColorList} ColorList with categorical colors that match the given list
   * @return {List} elements list of elemnts that match colors (equivalent to getWithoutRepetions)
   * @return {ColorList} ColorList with different categorical colors
   * @return {Table} dictionary dictionary table with elemnts and matching colors
   * @return {Object} citionaryObject (relational array, from objects to colors)
   * tags:generator
   */
  ColorListGenerators.createCategoricalColorListForList = function(list, colorList, alpha, color, interpolate, invert)
  {

    if(!list)
      return new ColorList();
    if(!alpha)
      alpha = 1;
    if(!color)
      color = "#fff";
    if(!interpolate)
      interpolate = 0;

    list = List.fromArray(list);
    var diffValues = list.getWithoutRepetitions();
    var diffColors;
    if(colorList && interpolate !== 0) {
      diffColors = colorList.getInterpolated(color, interpolate);
    } else {
      diffColors = ColorListGenerators.createCategoricalColors(2, diffValues.length, null, alpha, color, interpolate, colorList);
    }
    if(alpha<1) diffColors = diffColors.addAlpha(alpha);

    if(invert) diffColors = diffColors.getInverted();

    var colorDictTable = Table.fromArray([diffValues, diffColors]);
    var dictionaryObject = ListOperators.buildDictionaryObjectForDictionary(colorDictTable);

    var fullColorList = ListOperators.translateWithDictionary(list, colorDictTable, 'black');

    fullColorList = ColorList.fromArray(fullColorList);
    
    return [
      {
        value: fullColorList,
        type: 'ColorList'
      }, {
        value: diffValues,
        type: diffValues.type
      }, {
        value: diffColors,
        type: 'ColorList'
      }, {
        value: new Table(diffValues, fullColorList),
        type: 'Table'
      }, {
        value: dictionaryObject,
        type: 'Object'
      }
    ];
  };

  /**
   * @classdesc  String Operators
   *
   * @namespace
   * @category strings
   */
  function StringOperators() {}
  StringOperators.ENTER = String.fromCharCode(13);
  StringOperators.ENTER2 = String.fromCharCode(10);
  StringOperators.ENTER3 = String.fromCharCode(8232);

  StringOperators.SPACE = String.fromCharCode(32);
  StringOperators.SPACE2 = String.fromCharCode(160);

  StringOperators.TAB = "	";
  StringOperators.TAB2 = String.fromCharCode(9);

  StringOperators.LINK_REGEX = /(^|\s+)(https*\:\/\/\S+[^\.\s+])/;
  StringOperators.MAIL_REGEX = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  StringOperators.STOP_WORDS = StringList.fromArray("t,s,mt,rt,re,m,http,amp,a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your".split(","));



  /**
   * creates an html string that depicts a proprtions bar with colors for categories
   * @param  {NumberList} normalizedWeights normalized weights
   *
   * @param  {Number} nChars width in characters
   * @param  {ColorList} colors list of categorical colors
   * @param  {String} character character or characters to be used as primitive
   * @return {String} html depciting colored segments forming a bar in a single line
   */
  StringOperators.createsCategoricalColorsBlocksHtml = function(normalizedWeights, nChars, colors, character){
    if(normalizedWeights==null) return "";

    var bars="";

    nChars = nChars==null?20:nChars;
    colors = colors==null?ColorListGenerators.createDefaultCategoricalColorList(normalizedWeights.length):colors;
    character = character==null?"█":character;

    normalizedWeights.forEach(function(w, j){
      w = Math.floor(w*nChars) +  ( (w*nChars - Math.floor(w*nChars))>Math.random()?1:0 );
      bars += "<font color=\""+ColorOperators.colorStringToHEX(colors[j])+"\">";
      for(var i=0; i<w; i++){
        bars += character;
      }
      bars += "</f>";
    });

    return bars;
  };

  /**
   * splits a String by a character (entre by default)
   * @param  {String} string
   *
   * @param  {String} character
   * @return {StringList}
   * tags:
   */
  StringOperators.split = function(string, character) {
    if(character == null) return StringOperators.splitByEnter(string);
    return StringList.fromArray(string.split(character));
  };


  /**
   * split a String by enter (using several codifications)
   * @param  {String} string
   * @return {StringList}
   * tags:
   */
  StringOperators.splitByEnter = function(string) {
    if(string == null) {
      return null;
    }
    var stringList = StringOperators.splitString(string, "\n");
    if(stringList.length > 1)
    {
     return stringList;
    }
    stringList = StringOperators.splitString(string, StringOperators.ENTER2);
    if(stringList.length > 1) {
      return stringList;
    }
    stringList = StringOperators.splitString(string, StringOperators.ENTER3);
    if(stringList.length > 1) {
      return stringList;
    }
    return new StringList(string);
  };


  /**
   * replaces in a string ocurrences of a sub-string by another string (base in replace JavaScript method)
   * @param  {String} string to be modified
   * @param  {String} subString sub-string to be replaced
   * @param  {String} replacement string to be placed instead
   * @return {String}
   * tags:
   */
  StringOperators.replaceSubString = function(string, subString, replacement) {
    if(string == null || subString == null || replacement == null) return null;
    return string.replace(new RegExp(subString, "g"), replacement);
  };

  /**
   * replaces in a string ocurrences of sub-strings by a string
   * @param  {String} string to be modified
   * @param  {StringList} subStrings sub-strings to be replaced
   * @param  {String} replacement string to be placed instead
   * @return {String}
   * tags:
   */
  StringOperators.replaceSubStringsByString = function(string, subStrings, replacement) {
    if(subStrings == null) return;

    subStrings.forEach(function(subString) {
      string = StringOperators.replaceSubString(string, subString, replacement);
    });

    return string;
  };

  /**
   * replaces in a string ocurrences of sub-strings by strings (1-1)
   * @param  {String} string to be modified
   * @param  {StringList} subStrings sub-strings to be replaced
   * @param  {StringList} replacements strings to be placed instead
   * @return {String}
   * tags:
   */
  StringOperators.replaceSubStringsByStrings = function(string, subStrings, replacements) {
    if(subStrings == null || replacements == null) return;

    var nElements = Math.min(subStrings.length, replacements.length);
    var i;

    for(i = 0; i < nElements; i++) {
      string = StringOperators.replaceSubString(string, subStrings[i], replacements[i]);
    }

    return string;
  };

  /**
   * builds a stringList of words contained in the text
   * @param  {String} string text to be analyzed
   *
   * @param  {Boolean} withoutRepetitions remove words repetitions
   * @param  {Boolean} stopWords remove stop words
   * @param  {Boolean} sortedByFrequency  sorted by frequency in text
   * @param  {Boolean} includeLinks include html links
   * @param  {Number} limit of words
   * @param  {Number} minSizeWords minimal number of characters of words
   * @return {StringList}
   * tags:
   */
  StringOperators.getWords = function(string, withoutRepetitions, stopWords, sortedByFrequency, includeLinks, limit, minSizeWords) {
    if(string == null) return null;

    var links;

    minSizeWords = minSizeWords || 0;
    withoutRepetitions = withoutRepetitions == null ? true : withoutRepetitions;
    sortedByFrequency = sortedByFrequency == null ? true : sortedByFrequency;
    includeLinks = includeLinks == null ? true : includeLinks;
    limit = limit == null ? 0 : limit;

    var i, j;

    if(includeLinks) {
      links = string.match(StringOperators.LINK_REGEX);
    }
    string = string.toLowerCase().replace(StringOperators.LINK_REGEX, "");

    var list = string.match(/\w+/g);
    if(list == null) return new StringList();

    if(includeLinks && links != null) list = list.concat(links);
    list = StringList.fromArray(list).replace(/ /g, "");

    if(stopWords != null) { //TODO:check before if all stopwrds are strings
      //list.removeElements(stopWords);

      for(i = 0; list[i] != null; i++) {
        for(j = 0; stopWords[j] != null; j++) {
          if((typeof stopWords[j]) == 'string') {
            if(stopWords[j] == list[i]) {
              list.splice(i, 1);
              i--;
              break;
            }
          } else if(stopWords[j].test(list[i])) {
            list.splice(i, 1);
            i--;
            break;
          }
        }
      }

    }

    if(minSizeWords > 0) {
      for(i = 0; list[i] != null; i++) {
        if(list[i].length < minSizeWords) {
          list.splice(i, 1);
          i--;
        }
      }
    }

    if(sortedByFrequency) {
      if(withoutRepetitions) {
        list = list.getFrequenciesTable(true)[0];// //ListOperators.countElementsRepetitionOnList(list, true)[0];
        if(limit !== 0) list = list.substr(0, limit);

        return list;
      }

      var occurrences = ListOperators.countOccurrencesOnList(list);
      list = list.getSortedByList(occurrences);
      if(limit !== 0) list = list.substr(0, limit);

      return list;
    }

    if(withoutRepetitions) {
      list = list.getWithoutRepetitions();
    }

    if(limit !== 0) list = list.splice(0, limit);
    return list;
  };



  /**
   * return a substring
   * @param  {String} string
   *
   * @param  {Number} i0 init index
   * @param  {Number} length of ths substring (if null returns substring from i0 to the end)
   * @return {String}
   * tags:filter
   */
  StringOperators.substr = function(string, i0, length) {
    i0 = i0 || 0;
    return string.substr(i0, length);
  };

  /**
   * split a String by a separator (a String) and returns a StringList
   * @param  {String} string
   *
   * @param  {String} separator
   * @return {StringList}
   * tags:
   */
  StringOperators.splitString = function(string, separator) {
    if(string == null) return null;
    if(separator == null) separator = ",";
    if(typeof separator == "string") separator = separator.replace("\\n", "\n");
    if(string.indexOf(separator) == -1) return new StringList(string);
    return StringList.fromArray(string.split(separator));
  };

  /**
   * searches for two Strings within a String and returns the String in between
   * @param  {String} text
   * @param  {String} subString0
   *
   * @param  {String} subString1 if null returns the text after subString0
   * @return {String}
   * tags:filter
   */
  StringOperators.getFirstTextBetweenStrings = function(text, subString0, subString1) {
    var i0 = text.indexOf(subString0);
    if(i0 == -1) return null;
    if(subString1 === "" || subString1 == null) return text.substr(i0 + subString0.length);
    var i1 = text.indexOf(subString1, i0 + subString0.length + 1);
    if(i1 == -1) return text.substring(i0 + subString0.length);
    return text.substr(i0 + subString0.length, i1 - (i0 + subString0.length));
  };

  /**
   * searches all the Strings contained between two Strings in a String
   * @param  {String} text
   * @param  {String} subString0
   * @param  {String} subString1
   * @return {StringList}
   * tags:filter
   */
  StringOperators.getAllTextsBetweenStrings = function(text, subString0, subString1) { //TODO: improve using indexOf(string, START_INDEX)
    if(text.indexOf(subString0) == -1) return new StringList();
    var blocks = text.split(subString0);
    var nBlocks = blocks.length;
    var stringList = new StringList();
    var block;
    var index;
    var i;
    for(i = 1; i < nBlocks; i++) {
      block = blocks[i];
      if(subString1 == subString0) {
        stringList.push(block);
      } else {
        index = block.indexOf(subString1);
        if(index >= 0) {
          stringList.push(block.substr(0, index));
        }
      }
    }
    return stringList;
  };

  /**
   * associates a value to each text in a StringList, according to number of words containg in each StringList; one lists pushes to negative values, the other to positive. A classic use would be a primitive sentimental analisis using a list of positive adjectives and a list of negative ones
   * @param  {String} string to be analized
   * @param  {StringList} negativeStrings list of 'negative' words
   * @param  {StringList} positiveStrings list of 'positive' words
   *
   * @param  {Boolean} normalizeBySize divide score by the string size
   * @return {Number}
   * tags:analysis
   */
  StringOperators.countWordsDichotomyAnalysis = function(string, negativeStrings, positiveStrings, normalizeBySize) {
    var val = 0;
    negativeStrings.forEach(function(word) {
      val -= StringOperators.countWordOccurrences(string, word);
    });
    positiveStrings.forEach(function(word) {
      val += StringOperators.countWordOccurrences(string, word);
    });
    if(normalizeBySize) val /= string.length;
    return val;
  };


  /**
   * creates a list of urls contained in the html in <a> tags
   * @param  {String} html to be analyzied
   *
   * @param {String} urlSource optional, if provided will be used to build complete urls
   * @param {Boolean} removeHash if true removes the hastag (anchor) content of the url
   * @return {StringList} list of urls
   * tags:html
   */
  StringOperators.getLinksFromHtml = function(html, urlSource, removeHash) {
    var doc = document.createElement("html");
    doc.innerHTML = html;

    var i;
    var links = doc.getElementsByTagName("a");
    var originalUrl, url;
    var urls = new StringList();
    var index;
    var urlSourceParts;
    var parts, blocks;
    var root;

    urlSource = urlSource === "" ? null : urlSource;
    removeHash = removeHash == null ? false : removeHash;

    if(urlSource) {
      urlSource = urlSource.trim();

      if(urlSource.substr(-5) == ".html") {
        urlSourceParts = urlSource.split("/");
        urlSource = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/");
      }
      if(urlSource.indexOf(-1) == "/") urlSource = urlSource.substr(0, urlSource.length - 1);
      urlSourceParts = urlSource.split("/");

      root = urlSource.replace("//", "**").split("/")[0].replace("**", "//");
    }


    for(i = 0; i < links.length; i++) {
      originalUrl = url = links[i].getAttribute("href");
      if(url == null) continue;

      if(url.indexOf('=') != -1) url = url.split('=')[0];

      //console.log(url);
      if(urlSource && url.indexOf('http://') == -1 && url.indexOf('https://') == -1 && url.indexOf('wwww.') == -1 && url.indexOf('file:') == -1 && url.indexOf('gopher:') == -1 && url.indexOf('//') !== 0) {
        if(url.substr(0, 9) == "../../../") {
          url = urlSourceParts.slice(0, urlSourceParts.length - 3).join("/") + "/" + url.substr(9);
        } else if(url.substr(0, 6) == "../../") {
          url = urlSourceParts.slice(0, urlSourceParts.length - 2).join("/") + "/" + url.substr(6);
        } else if(url.substr(0, 3) == "../") {
          url = urlSourceParts.slice(0, urlSourceParts.length - 1).join("/") + "/" + url.substr(3);
        } else if(url.charAt(0) == "/") {
          url = root + url;
        } else {
          url = urlSource + "/" + url;
        }
      }
      if(removeHash && url.indexOf("#") != -1) url = url.split('#')[0];
      if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

      index = url.indexOf('/../');
      while(index != -1) {
        blocks = url.split('/../');
        parts = blocks[0].replace("//", "**").split("/");
        url = parts.slice(0, parts.length - 1).join("/").replace("**", "//") + ("/" + blocks.slice(1).join("/../"));
        index = url.indexOf('/../');
      }

      if(url.indexOf('./') != -1) {
        parts = url.replace("//", "**").split("/");
        if(parts[0].substr(-1) == ".") {
          parts[0] = parts[0].substr(0, parts[0].length - 1);
          url = parts.join('/').replace("**", "//");
        }
      }

      url = url.trim();

      if(url.substr(-1) == "/") url = url.substr(0, url.length - 1);

      if(url == urlSource) continue;
      //console.log(urlSource+' | '+originalUrl+' -> '+url);
      urls.push(url);
    }

    urls = urls.getWithoutRepetitions();

    return urls;
  };


  /**
   * validates is string contains another string, as string or word (space or punctuation boundaries)
   * @param {String} text string to be validated
   * @param {String} string string or word to be searched
   *
   * @param {Boolean} asWord if true a word will be searched (false by default)
   * @param {Boolean} caseSensitive (false by default)
   * @return {Boolean} returns true if string or word is contained
   */
  StringOperators.textContainsString = function(text, string, asWord, caseSensitive) {
    text = caseSensitive ? string : text.toLowerCase();
    string = caseSensitive ? string : string.toLowerCase();
    return asWord ?
      text.match(new RegExp("\\b" + string + "\\b")).length > 0 :
      text.indexOf(string) != -1;
  };

  /**
   * print a string in console
   * @param  {String} string to be printed in console
   * @param  {Boolean} frame  if true (default) prints ///////////////// on top and bottom
   * tags:
   */
  StringOperators.logInConsole = function(string, frame) {
    frame = frame == null ? true : frame;
    if(frame) console.log('///////////////////////////////////////////////////');
    console.log(string);
    if(frame) console.log('///////////////////////////////////////////////////');
  };




  //////


  /**
   * @todo finish docs
   */
  StringOperators.getParenthesisContents = function(text, brackets) {
    var contents = new StringList();

    var subText = text;

    var contentObject = StringOperators.getFirstParenthesisContentWithIndexes(text, brackets);

    var nAttempts = 0;
    while(contentObject.content !== "" && contentObject.index1 < subText.length - 1 && nAttempts < text.length) {
      contents.push(contentObject.content);
      subText = subText.substr(contentObject.index1 + 2);
      contentObject = StringOperators.getFirstParenthesisContentWithIndexes(subText, brackets);
      nAttempts++;
    }

    return contents;
  };

  /**
   * @todo finish docs
   */
  StringOperators.getFirstParenthesisContent = function(text, brackets) {
    return StringOperators.getFirstParenthesisContentWithIndexes(text, brackets).content;
  };

  /**
   * @todo finish docs
   */
  StringOperators.getFirstParenthesisContentWithIndexes = function(text, brackets) {
    var open = brackets ? "[" : "(";
    var close = brackets ? "]" : ")";

    var openRegEx = brackets ? /\[/g : /\(/g;
    var closeRegEx = brackets ? /\]/g : /\)/g;

    var indexOpen = text.indexOf(open);

    if(indexOpen == -1) return {
      "content": "",
      "index0": 0,
      "index1": 0
    };

    var indexClose = text.indexOf(close);

    var part = text.substring(indexOpen + 1, indexClose);

    var openMatch = part.match(openRegEx);
    var closeMatch = part.match(closeRegEx);

    var nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);
    var nAttempts = 0;


    while((nOpen > 0 || indexClose == -1) && nAttempts < text.length) {
      indexClose = text.indexOf(close, indexClose);
      part = text.substring(indexOpen + 1, indexClose + 1);
      indexClose++;
      openMatch = part.match(openRegEx);
      closeMatch = part.match(closeRegEx);
      nOpen = (openMatch == null ? 0 : openMatch.length) - (closeMatch == null ? 0 : closeMatch.length);

      nAttempts++;
    }
    indexClose = text.indexOf(close, indexClose);

    return {
      "content": indexClose == -1 ? text.substring(indexOpen + 1) : text.substring(indexOpen + 1, indexClose),
      "index0": indexOpen + 1,
      "index1": indexClose == -1 ? (text.length - 1) : (indexClose - 1)
    };
  };

  /**
   * @todo finish docs
   */
  StringOperators.placeString = function(string, stringToPlace, index) {
    return string.substr(0, index) + stringToPlace + string.substr(index + stringToPlace.length);
  };

  /**
   * @todo finish docs
   */
  StringOperators.insertString = function(string, stringToInsert, index) {
    return string.substr(0, index) + stringToInsert + string.substr(index);
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeEnters = function(string) {
    return string.replace(/(\StringOperators.ENTER|\StringOperators.ENTER2|\StringOperators.ENTER3)/gi, " ");
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeTabs = function(string) {
    return string.replace(/(\StringOperators.TAB|\StringOperators.TAB2|\t)/gi, "");
  };

  /**
   * @todo finish docs
   */
  StringOperators.removePunctuation = function(string, replaceBy) {
    replaceBy = replaceBy || "";
    return string.replace(/[:,.;?!\(\)\"\']/gi, replaceBy);
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeDoubleSpaces = function(string) {
    var retString = string;
    var regExpr = RegExp(/  /);
    while(regExpr.test(retString)) {
      retString = retString.replace(regExpr, " ");
    }
    return retString;
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeInitialRepeatedCharacter = function(string, character) {
    while(string.charAt(0) == character) string = string.substr(1);
    return string;
  };


  /**
   * takes plain text from html
   * @param  {String} html
   * @return {String}
   * tags:
   */
  StringOperators.removeHtmlTags = function(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeLinks = function(text) {
    text += ' ';
    var regexp = /https*:\/\/[a-zA-Z0-9\/\.]+( |:|;|\r|\t|\n|\v)/g;
    return(text.replace(regexp, ' ')).substr(0, text.length - 2);
  };

  /**
   * @todo finish docs
   */
  StringOperators.removeQuotes = function(string) { //TODO:improve
    if(string.charAt(0) == "\"") string = string.substr(1);
    if(string.charAt(string.length - 1) == "\"") string = string.substr(0, string.length - 1);
    return string;
  };

  // StringOperators.trim = function(string){
  // 	return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  // }



  StringOperators.removeAccentsAndDiacritics = function(string) {
    var r = string.replace(new RegExp(/[àáâãäå]/g), "a");
    r = r.replace(new RegExp(/æ/g), "ae");
    r = r.replace(new RegExp(/ç/g), "c");
    r = r.replace(new RegExp(/[èéêë]/g), "e");
    r = r.replace(new RegExp(/[ìíîï]/g), "i");
    r = r.replace(new RegExp(/ñ/g), "n");
    r = r.replace(new RegExp(/[òóôõö]/g), "o");
    r = r.replace(new RegExp(/œ/g), "oe");
    r = r.replace(new RegExp(/[ùúûü]/g), "u");
    r = r.replace(new RegExp(/[ýÿ]/g), "y");

    r = r.replace(new RegExp(/[ÀÁÂÄÃ]/g), "A");
    r = r.replace(new RegExp(/Æ/g), "AE");
    r = r.replace(new RegExp(/Ç/g), "c");
    r = r.replace(new RegExp(/[ÈÉÊË]/g), "E");
    r = r.replace(new RegExp(/[ÌÍÎÏ]/g), "I");
    r = r.replace(new RegExp(/Ñ/g), "N");
    r = r.replace(new RegExp(/[ÒÓÔÖÕ]/g), "O");
    r = r.replace(new RegExp(/Œ/g), "OE");
    r = r.replace(new RegExp(/[ÙÚÛÜ]/g), "U");
    r = r.replace(new RegExp(/[Ÿ]/g), "Y");

    return r;
  };

  /**
   * creates a table with frequent words and occurrences numbers
   * @param  {String} string text to be analyzed
   *
   * @param  {StringList} stopWords
   * @param  {Boolean} includeLinks
   * @param  {Number} limit max size of rows
   * @param  {Number} minSizeWords
   * @return {Table} contains a list of words, and a numberList of occurrences
   * tags:words
   */
  StringOperators.getWordsOccurrencesTable = function(string, stopWords, includeLinks, limit, minSizeWords) {
    if(string == null) return;
    if(string.length === 0) return new Table(new StringList(), new NumberList());
    var words = StringOperators.getWords(string, false, stopWords, false, includeLinks, limit, minSizeWords);
    var table;
    if(limit != null)
      table = words.getFrequenciesTable(true).sliceRows(0, limit-1);
    else
      table = words.getFrequenciesTable(true);
    return table;// ListOperators.countElementsRepetitionOnList(words, true, false, limit);
  };

  /**
   * @todo finish docs
   */
  StringOperators.indexesOf = function(text, string) { //TODO:test
    var index = text.indexOf(string);
    if(index == -1) return new NumberList();
    var indexes = new NumberList(index);
    index = text.indexOf(string, index + 1);
    while(index != -1) {
      indexes.push(index);
      index = text.indexOf(string, index + 1);
    }
    return indexes;
  };

  /**
   * returns a string repeated a number of times
   * @param  {String} text to be repeated
   * @param  {Number} n number of repetitions
   * @return {String}
   * tags:
   */
  StringOperators.repeatString = function(text, n) {
    var i;
    var newText = "";
    for(i = 0; i < n; i++) {
      newText += text;
    }
    return newText;
  };




  //counting / statistics

  /**
   * @todo finish docs
   */
  StringOperators.countOccurrences = function(text, string) { //seems to be th emost efficient: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
    var n = 0;
    var index = text.indexOf(string);
    while(index != -1) {
      n++;
      index = text.indexOf(string, index + string.length);
    }
    return n;
  };

  /**
   * @todo finish docs
   */
  StringOperators.countWordOccurrences = function(string, word) {
    var regex = new RegExp("\\b" + word + "\\b");
    var match = string.match(regex);
    return match == null ? 0 : match.length;
  };

  /**
   * @todo finish docs
   */
  StringOperators.countStringsOccurrences = function(text, strings) {
    var i;
    var numberList = new NumberList();
    for(i = 0; strings[i] != null; i++) {
      numberList[i] = text.split(strings[i]).length - 1;
    }
    return numberList;
  };

  //validation

  /**
   * @todo finish docs
   */
  StringOperators.validateEmail = function(text) {
    return StringOperators.MAIL_REGEX.test(text);
  };

  /**
   * @todo finish docs
   */
  StringOperators.validateUrl = function(text) {
    return StringOperators.LINK_REGEX.test(text);
  };

  Network.prototype = new DataModel();
  Network.prototype.constructor = Network;

  /**
   * @classdesc Networks are a DataType to store network data.
   *
   * Networks have nodes stored in a NodeList,
   * and relations (edges) stored in a RelationList.
   * @description Create a new Network instance.
   * @constructor
   * @category networks
   */
  function Network() {
    this.type = "Network";

    this.nodeList = new NodeList();
    this.relationList = new RelationList();
  }
  /**
   * Get Nodes of the Network as a NodeList
   * @return {NodeList}
   * tags:
   */
  Network.prototype.getNodes = function() {
    return this.nodeList;
  };

  /**
   * Get Relations (edges) of the Network as
   * a RelationList.
   * @return {RelationList}
   * tags:
   */
  Network.prototype.getRelations = function() {
    return this.relationList;
  };

  /**
   * get nodes ids property
   * @return {StringList}
   * tags:
   */
  Network.prototype.getNodesIds = function() {
    return this.nodeList.getIds();
  };



  /*
   * building methods
   */

  /**
   * Add a node to the network
   * @param {Node} node A new node that will be added to the network.
   */
  Network.prototype.addNode = function(node) {
    this.nodeList.addNode(node);
  };

  /**
   * Retrieve a node from the nodeList of the Network with the given name (label).
   * @param {String} name The name of the node to retrieve from the Network.
   * @return {Node} The node with the given name. Null if no node with that name
   * can be found in the Network.
   */
  Network.prototype.getNodeWithName = function(name) {
    return this.nodeList.getNodeWithName(name);
  };

  /**
   * Retrieve node from Network with the given id.
   * @param {String} id ID of the node to retrieve
   * @return {Node} The node with the given id. Null if a node with this id is not
   * in the Network.
   */
  Network.prototype.getNodeWithId = function(id) {
    return this.nodeList.getNodeWithId(id);
  };

  /**
   * Add a new Relation (edge) to the Network between two nodes.
   * @param {Node} node0 The source of the relation.
   * @param {Node} node1 The destination of the relation.
   * @param {String} id The id of the relation.
   * @param {Number} weight A numerical weight associated with the relation (edge).
   *
   * @param {String} content Information associated with the relation.
   */
  Network.prototype.createRelation = function(node0, node1, id, weight, content) {
    this.addRelation(new Relation(id, id, node0, node1, weight, content));
  };

  /**
   * Add an existing Relation (edge) to the Network.
   * @param {Relation} relation The relation to add to the network.
   */
  Network.prototype.addRelation = function(relation) {
    this.relationList.addNode(relation);
    relation.node0.nodeList.addNode(relation.node1);
    relation.node0.relationList.addNode(relation);
    relation.node0.toNodeList.addNode(relation.node1);
    relation.node0.toRelationList.addNode(relation);
    relation.node1.nodeList.addNode(relation.node0);
    relation.node1.relationList.addNode(relation);
    relation.node1.fromNodeList.addNode(relation.node0);
    relation.node1.fromRelationList.addNode(relation);
  };

  /**
   * Create a new Relation between two nodes in the network
   * @param {Node} node0 The source of the relation.
   * @param {Node} node1 The destination of the relation.
   * @param {String} id The id of the relation. If missing, an id will be generated
   * based on the id's of node0 and node1.
   * @param {Number} weight=1 A numerical weight associated with the relation (edge).
   * @param {String} content Information associated with the relation.
   * @return {Relation} The new relation added to the Network.
   */
  Network.prototype.connect = function(node0, node1, id, weight, content) {
    id = id || (node0.id + "_" + node1.id);
    weight = weight || 1;
    var relation = new Relation(id, id, node0, node1, weight);
    this.addRelation(relation);
    relation.content = content;
    return relation;
  };



  /*
   * removing methods
   */

  /**
   * Remove a node from the Network
   * @param {Node} node The node to remove.
   */
  Network.prototype.removeNode = function(node) {
    this.removeNodeRelations(node);
    this.nodeList.removeNode(node);
  };

  /**
   * Remove all Relations connected to the node from the Network.
   * @param {Node} node Node who's relations will be removed.
   */
  Network.prototype.removeNodeRelations = function(node) {
    for(var i = 0; node.relationList[i] != null; i++) {
      this.removeRelation(node.relationList[i]);
      i--;
    }
  };

  /**
   * Remove all Nodes from the Network.
   */
  Network.prototype.removeNodes = function() {
    this.nodeList.deleteNodes();
    this.relationList.deleteNodes();
  };

  Network.prototype.removeRelation = function(relation) {
    this.relationList.removeElement(relation);
    relation.node0.nodeList.removeNode(relation.node1);
    relation.node0.relationList.removeRelation(relation);
    relation.node0.toNodeList.removeNode(relation.node1);
    relation.node0.toRelationList.removeRelation(relation);
    relation.node1.nodeList.removeNode(relation.node0);
    relation.node1.relationList.removeRelation(relation);
    relation.node1.fromNodeList.removeNode(relation.node0);
    relation.node1.fromRelationList.removeRelation(relation);
  };

  /**
   * Transformative method, removes nodes without a minimal number of connections
   * @param  {Number} minDegree minimal degree
   * @return {Number} number of nodes removed
   * tags:transform
   */
  Network.prototype.removeIsolatedNodes = function(minDegree) {
    var i;
    var nRemoved = 0;
    minDegree = minDegree == null ? 1 : minDegree;

    for(i = 0; this.nodeList[i] != null; i++) {
      if(this.nodeList[i].getDegree() < minDegree) {
        this.nodeList[i]._toRemove = true;
      }
    }

    for(i = 0; this.nodeList[i] != null; i++) {
      if(this.nodeList[i]._toRemove) {
        this.removeNode(this.nodeList[i]);
        nRemoved++;
        i--;
      }
    }

    return nRemoved;
  };


  /**
   * generates a light clone of the network, with the same nodeList and relationList as the original
   * @return {Network}
   */
  Network.prototype.lightClone = function(){
    var newNetwork = new Network();
    newNetwork.nodeList = this.nodeList;
    newNetwork.relationList = this.relationList;
    return newNetwork;
  };


  /**
   * Clones the network
   *
   * @param  {StringList} nodePropertiesNames list of preoperties names to be copied from old nodes into new nodes
   * @param  {StringList} relationPropertiesNames
   *
   * @param  {String} idsSubfix optional sufix to be added to ids
   * @param  {String} namesSubfix optional sufix to be added to names
   * @return {Networked} network with exact structure than original
   * tags:
   */
  Network.prototype.clone = function(nodePropertiesNames, relationPropertiesNames, idsSubfix, namesSubfix) {
    var newNetwork = new Network();
    var newNode, newRelation;

    idsSubfix = idsSubfix == null ? '' : String(idsSubfix);
    namesSubfix = namesSubfix == null ? '' : String(namesSubfix);

    this.nodeList.forEach(function(node) {
      newNode = new _Node(idsSubfix + node.id, namesSubfix + node.name);
      if(idsSubfix !== '') newNode.basicId = node.id;
      if(namesSubfix !== '') newNode.basicName = node.name;
      if(nodePropertiesNames) {
        nodePropertiesNames.forEach(function(propName) {
          if(node[propName] != null) newNode[propName] = node[propName];
        });
      }
      newNetwork.addNode(newNode);
    });

    this.relationList.forEach(function(relation) {
      newRelation = new Relation(idsSubfix + relation.id, namesSubfix + relation.name, newNetwork.nodeList.getNodeById(idsSubfix + relation.node0.id), newNetwork.nodeList.getNodeById(idsSubfix + relation.node1.id));
      if(idsSubfix !== '') newRelation.basicId = relation.id;
      if(namesSubfix !== '') newRelation.basicName = relation.name;
      if(relationPropertiesNames) {
        relationPropertiesNames.forEach(function(propName) {
          if(relation[propName] != null) newRelation[propName] = relation[propName];
        });
      }
      newNetwork.addRelation(newRelation);
    });

    return newNetwork;
  };

  /**
   * @todo write docs
   */
  Network.prototype.destroy = function() {
    delete this.type;
    this.nodeList.destroy();
    this.relationList.destroy();
    delete this.nodeList;
    delete this.relationList;
  };

  /**
   * @classdesc Provides a set of tools that work with Dates.
   *
   * @namespace
   * @category dates
   */
  function DateOperators() {}
  DateOperators.millisecondsToHours = 1 / (1000 * 60 * 60);
  DateOperators.millisecondsToDays = 1 / (1000 * 60 * 60 * 24);
  DateOperators.millisecondsToWeeks = 1 / (1000 * 60 * 60 * 24 * 7);
  DateOperators.millisecondsToYears = 0.00000000003169;

  DateOperators.MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  DateOperators.MONTH_NAMES_SHORT = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  DateOperators.MONTH_NDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  DateOperators.WEEK_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  /**
   * parses a Date
   * @param  {String} string date in string format
   * @param  {String} formatCase <br>0: MM-DD-YYYY<br>1: YYYY-MM-DD<br>2: MM-DD-YY<br>3: YY-MM-DD<br>4: DD-MM-YY<br>5: DD-MM-YYYY
   * @param  {String} separator
   * @return {Date}
   * tags:decoder
   */
  DateOperators.stringToDate = function(string, formatCase, separator) {
    separator = separator == null ? "-" : separator;
    formatCase = formatCase == null ? 1 : formatCase;

    if(formatCase == 1) {
      if(separator != "-") string = string.replace(new RegExp(string, "g"), "-");
      return new Date(string);
    }

    var y;
    var parts = string.split(separator);
    switch(formatCase) {
      case 0: //MM-DD-YYYY
        return new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
      case 1: //YYYY-MM-DD
        return new Date(string); //Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
      case 2: //MM-DD-YY
        y = Number(parts[2]);
        y = y >= 0 ? y + 2000 : y + 1900;
        return new Date(y, Number(parts[0]) - 1, Number(parts[1]));
      case 3: //YY-MM-DD
        y = Number(parts[0]);
        y = y >= 0 ? y + 2000 : y + 1900;
        return new Date(y, Number(parts[1]) - 1, Number(parts[2]));
      case 4: //DD-MM-YY
        y = Number(parts[2]);
        y = y >= 0 ? y + 2000 : y + 1900;
        return new Date(y, Number(parts[1]) - 1, Number(parts[0]));
      case 5: //DD-MM-YYYY
        y = Number(parts[2]);
        return new Date(y, Number(parts[1]) - 1, Number(parts[0]));
    }
  };

  /**
   * format cases
   * 0: MM-DD-YYYY
   * 1: YYYY-MM-DD
   */
  DateOperators.dateToString = function(date, formatCase, separator) {
    separator = separator == null ? "-" : separator;
    formatCase = formatCase == null ? 0 : formatCase;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    switch(formatCase) {
      case 0: //MM-DD-YYYY
        return month + separator + day + separator + year;
      case 1: //YYYY-MM-DD
        return year + separator + month + separator + day;
    }
  };

  /**
   * generates current date Date
   * @return {Date}
   * tags:generate
   */
  DateOperators.currentDate = function() {
    return new Date();
  };

  /**
   * @todo write docs
   */
  DateOperators.addDaysToDate = function(date, nDays) {
    return new Date(date.getTime() + (nDays / DateOperators.millisecondsToDays));
  };

  /**
   * @todo write docs
   */
  DateOperators.addMillisecondsToDate = function(date, nMilliseconds) {
    return new Date(date.getTime() + nMilliseconds);
  };


  /**
   * @todo write docs
   */
  DateOperators.parseDate = function(string) {
    return new Date(Date.parse(string.replace(/\./g, "-")));
  };

  /**
   * @todo write docs
   */
  DateOperators.parseDates = function(stringList) {
    var dateList = new DateList();
    var i;
    for(i = 0; stringList[i] != null; i++) {
      dateList.push(this.parseDate(stringList[i]));
    }
    return dateList;
  };

  /**
   * @todo write docs
   */
  DateOperators.getHoursBetweenDates = function(date0, date1) {
    return(date1.getTime() - date0.getTime()) * DateOperators.millisecondsToHours;
  };

  /**
   * @todo write docs
   */
  DateOperators.getDaysBetweenDates = function(date0, date1) {
    return(date1.getTime() - date0.getTime()) * DateOperators.millisecondsToDays;
  };

  /**
   * @todo write docs
   */
  DateOperators.getWeeksBetweenDates = function(date0, date1) {
    return(date1.getTime() - date0.getTime()) * DateOperators.millisecondsToWeeks;
  };

  /**
   * @todo write docs
   */
  DateOperators.getYearsBetweenDates = function(date0, date1) {
    return(date1.getTime() - date0.getTime()) * DateOperators.millisecondsToYears;
  };

  /**
   * @todo write docs
   */
  DateOperators.nDayInYear = function(date) {
    return Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) * DateOperators.millisecondsToDays);
  };

  /**
   * @todo write docs
   */
  DateOperators.getDateDaysAgo = function(nDays) {
    return DateOperators.addDaysToDate(new Date(), -nDays);
  };


  /**
   * gets the week number within a year (weeks start on Sunday, first week may have less than 7 days if start in a day other than sunday
   * @param {Date} The date whose week you want to retrieve
   * @return {Number} The week number of the date in its year
   * tags:generate
   */
  DateOperators.getWeekInYear = function(date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  /**
   * @todo write docs
   */
  DateOperators.getNDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();
  };

  /**
   * @classdesc Serializes and deserializes {@link Network|Networks} using into
   * a number of text based formats.
   *
   * @namespace
   * @category networks
   */
  function NetworkEncodings() {}
  //////////////NoteWork

  NetworkEncodings.nodeNameSeparators = ['|', ':', ' is ', ' are ', '.', ','];

  /**
   * Converts a String in NoteWork format into a network
   *
   * @param  {String} code
   * @return {Network}
   * tags:decoding
   */
  NetworkEncodings.decodeNoteWork = function(code) {
    if(code == null) return;
    if(code === "") return new Network();

    console.log('\n\n*************////////// decodeNoteWork //////////*************');
    //code = "\n"+code;

    var i, j;
    var line, simpleLine;
    var id, id2;
    var name;
    var index, minIndex;
    var lines;
    var node, otherNode;
    var relation;
    var sep;
    var colorLinesRelations = []; //for relations
    var colorLinesGroups = [];
    var colorSegments = [];
    var regex;
    var iEnd;
    var propertyName;
    var propertyValue;
    var network = new Network();
    var paragraphs = new StringList();
    var content;

    network.nodesPropertiesNames = new StringList();
    network.relationsPropertiesNames = new StringList();

    lines = code.split(/\n/g);
    lines.forEach(function(line, i) {
      lines[i] = line.trim();
    });

    code = lines.join('\n');


    var nLineParagraph = 0;
    while(code.charAt(0) == '\n') {
      code = code.substr(1);
      nLineParagraph++;
    }


    var left = code;

    index = left.search(/\n\n./g);

    while(index != -1) {
      paragraphs.push(left.substr(0, index));
      left = left.substr(index + 2);
      index = left.search(/\n\n./g);
    }

    paragraphs.push(left);

    var firstLine;


    paragraphs.forEach(function(paragraph) {

      if(paragraph.indexOf('\n') == -1) {
        line = paragraph;
        lines = null;
      } else {
        lines = paragraph.split(/\n/g);
        line = lines[0];
      }

      firstLine = line;

      //console.log('firstLine: ['+firstLine+']');

      if(line == '\n' || line === '' || line == ' ' || line == '  ') { //use regex here

      } else if(line.indexOf('//') === 0) {

        if(colorSegments[nLineParagraph] == null) colorSegments[nLineParagraph] = [];

        colorSegments[nLineParagraph].push({
          type: 'comment',
          iStart: 0,
          iEnd: line.length
        });

      } else if(line == "relations colors:" || line == "groups colors:" || line == "categories colors:") { //line.indexOf(':')!=-1 && ColorOperators.colorStringToRGB(line.split(':')[1])!=null){ // color in relations or groups
        // colorLinesRelations.push(line);

        // if(colorSegments[nLineParagraph]==null) colorSegments[nLineParagraph]=[];

        // colorSegments[nLineParagraph].push({
        // 	type:'relation_color',
        // 	iStart:0,
        // 	iEnd:line.length
        // });

        if(lines) {
          lines.slice(1).forEach(function(line, i) {

            index = line.indexOf(':');
            if(firstLine == "relations colors:" && index != -1 && ColorOperators.colorStringToRGB(line.split(':')[1]) != null) {
              //console.log('  more colors!');

              colorLinesRelations.push(line);

              if(colorSegments[nLineParagraph + i] == null) colorSegments[nLineParagraph + i] = [];

              colorSegments[nLineParagraph + i].push({
                type: 'relation_color',
                iStart: 0,
                iEnd: line.length
              });

            }

            if((firstLine == "groups colors:" || firstLine == "categories colors:") && index != -1 && ColorOperators.colorStringToRGB(line.split(':')[1]) != null) {
              //console.log(line)
              //console.log('  color to group!');

              colorLinesGroups.push(line);

              if(colorSegments[nLineParagraph + i] == null) colorSegments[nLineParagraph + i] = [];

              colorSegments[nLineParagraph + i].push({
                type: 'relation_color',
                iStart: 0,
                iEnd: line.length
              });

            }
          });
        }

      } else { //node

        minIndex = 99999999;

        index = line.indexOf(NetworkEncodings.nodeNameSeparators[0]);

        if(index != -1) {
          minIndex = index;
          sep = NetworkEncodings.nodeNameSeparators[0];
        }

        j = 1;

        while(j < NetworkEncodings.nodeNameSeparators.length) {
          index = line.indexOf(NetworkEncodings.nodeNameSeparators[j]);
          if(index != -1) {
            minIndex = Math.min(index, minIndex);
            sep = NetworkEncodings.nodeNameSeparators[j];
          }
          j++;
        }


        index = minIndex == 99999999 ? -1 : minIndex;

        name = index == -1 ? line : line.substr(0, index);
        name = name.trim();

        if(name !== "") {
          id = NetworkEncodings._simplifyForNoteWork(name);

          node = network.nodeList.getNodeById(id);

          iEnd = index == -1 ? line.length : index;

          if(node == null) {

            node = new _Node(id, name);
            node._nLine = nLineParagraph;
            network.addNode(node);
            node.content = index != -1 ? line.substr(index + sep.length).trim() : "";

            node._lines = lines ? lines.slice(1) : new StringList();

            node.position = network.nodeList.length - 1;

            if(colorSegments[nLineParagraph] == null) colorSegments[nLineParagraph] = [];

            colorSegments[nLineParagraph].push({
              type: 'node_name',
              iStart: 0,
              iEnd: iEnd
            });

          } else {
            if(lines != null) node._lines = node._lines.concat(lines.slice(1));

            node.content += index != -1 ? (" | " + line.substr(index + sep.length).trim()) : "";

            if(colorSegments[nLineParagraph] == null) colorSegments[nLineParagraph] = [];

            colorSegments[nLineParagraph].push({
              type: 'node_name_repeated',
              iStart: 0,
              iEnd: iEnd
            });
          }
        } else {

        }
      }

      nLineParagraph += (lines ? lines.length : 1) + 1;
    });


    //find equalities (synonyms)

    var foundEquivalences = true;

    while(foundEquivalences) {
      foundEquivalences = false;

      loop: for(i = 0; network.nodeList[i] != null; i++) {
        node = network.nodeList[i];

        loop2: for(j = 0; node._lines[j] != null; j++) {
          line = node._lines[j];

          if(line.indexOf('=') === 0) {

            id2 = NetworkEncodings._simplifyForNoteWork(line.substr(1));
            otherNode = network.nodeList.getNodeById(id2);

            if(otherNode && node != otherNode) {

              foundEquivalences = true;

              node._lines = otherNode._lines.concat(otherNode._lines);

              network.nodeList.removeNode(otherNode);
              network.nodeList.ids[otherNode.id] = node;

              break loop;
            } else {
              network.nodeList.ids[id2] = otherNode;
            }

            if(!node._otherIds) node._otherIds = [];
            node._otherIds.push(id2);
          }
        }
      }
    }


    //build relations and nodes properties

    network.nodeList.forEach(function(node) {

      nLineParagraph = node._nLine;

      //console.log('node.nLineWeight', node.nLineWeight);

      node._lines.forEach(function(line, i) {

        if(line.indexOf('=') != -1) {

        } else if(line.indexOf(':') > 0) {

          simpleLine = line.trim();

          propertyName = StringOperators.removeAccentsAndDiacritics(simpleLine.split(':')[0]).replace(/\s/g, "_");

          propertyValue = line.split(':')[1].trim();
          if(propertyValue == String(Number(propertyValue))) propertyValue = Number(propertyValue);

          if(propertyValue != null) {
            node[propertyName] = propertyValue;
            if(network.nodesPropertiesNames.indexOf(propertyName) == -1) network.nodesPropertiesNames.push(propertyName);
          }

        } else {
          simpleLine = line;

          network.nodeList.forEach(function(otherNode) {
            regex = NetworkEncodings._regexWordForNoteWork(otherNode.id);
            index = simpleLine.search(regex);

            if(index == -1 && otherNode._otherIds) {
              for(j = 0; otherNode._otherIds[j] != null; j++) {
                regex = NetworkEncodings._regexWordForNoteWork(otherNode._otherIds[j]);
                index = simpleLine.search(regex);
                if(index != -1) break;
              }
            }

            if(index != -1) {
              iEnd = index + simpleLine.substr(index).match(regex)[0].length;

              relation = network.relationList.getFirstRelationBetweenNodes(node, otherNode, true);


              if(relation != null) {

                content = relation.node0.name + " " + line;

                relation.content += " | " + content;

                if(colorSegments[nLineParagraph + i + 1] == null) colorSegments[nLineParagraph + i + 1] = [];

                colorSegments[nLineParagraph + i + 1].push({
                  type: 'node_name_in_repeated_relation',
                  iStart: index,
                  iEnd: iEnd
                });

              } else {
                relation = network.relationList.getFirstRelationBetweenNodes(otherNode, node, true);

                if(relation == null || relation.content != content) {

                  var relationName = line;

                  regex = NetworkEncodings._regexWordForNoteWork(node.id);
                  index = relationName.search(regex);

                  if(index != -1) {
                    relationName = relationName.substr(index);
                    relationName = relationName.replace(regex, "").trim();
                  }

                  //console.log(node.id, "*", line, "*", index, "*", line.substr(index));

                  //line = line.replace(regex, "").trim();

                  regex = NetworkEncodings._regexWordForNoteWork(otherNode.id);
                  index = relationName.search(regex);
                  relationName = "… " + relationName.substr(0, index).trim() + " …";

                  id = line;
                  relation = new Relation(line, relationName, node, otherNode);

                  content = relation.node0.name + " " + line;

                  relation.content = content; //.substr(0,index);
                  network.addRelation(relation);

                  if(colorSegments[nLineParagraph + i + 1] == null) colorSegments[nLineParagraph + i + 1] = [];

                  colorSegments[nLineParagraph + i + 1].push({
                    type: 'node_name_in_relation',
                    iStart: index,
                    iEnd: iEnd
                  });

                }
              }
            }
          });
        }
      });

      node.positionWeight = Math.pow(network.nodeList.length - node.position - 1 / network.nodeList.length, 2);
      node.combinedWeight = node.positionWeight + node.nodeList.length * 0.1;

    });


    //colors in relations and groups

    colorLinesRelations.forEach(function(line) {
      index = line.indexOf(':');
      var texts = line.substr(0, index).split(',');
      texts.forEach(function(text) {
        var color = line.substr(index + 1);
        network.relationList.forEach(function(relation) {
          if(relation.name.indexOf(text) != -1) relation.color = color;
        });
      });
    });

    colorLinesGroups.forEach(function(line) {
      index = line.indexOf(':');
      var texts = line.substr(0, index).split(',');
      texts.forEach(function(text) {
        var color = line.substr(index + 1);
        network.nodeList.forEach(function(node) {
          if(node.group == text) node.color = color;
          if(node.category == text) node.color = color;
        });
      });
    });

    network.colorSegments = colorSegments;

    return network;
  };

  /**
   * @ignore
   */
  NetworkEncodings._simplifyForNoteWork = function(name) {
    name = name.toLowerCase();
    if(name.substr(name.length - 2) == 'es') {
      name = name.substr(0, name.length - 1);
    } else if(name.charAt(name.length - 1) == 's') name = name.substr(0, name.length - 1);
    return name.trim();
  };

  /**
   * _regexWordForNoteWork
   *
   * @ignore
   */
  NetworkEncodings._regexWordForNoteWork = function(word, global) {
    global = global == null ? true : global;
    try {
      return new RegExp("(\\b)(" + word + "|" + word + "s|" + word + "es)(\\b)", global ? "gi" : "i");
    } catch(err) {
      return null;
    }
  };

  /**
   * Encodes a network into NoteWork notes.
   *
   * @param  {Network} network Network to encode.
   * @param  {String} nodeContentSeparator Separator between node name and content. Uses comma if not defined.
   * @param  {StringList} nodesPropertyNames Node properties to be encoded.
   * If not defined, no Node properties are encoded.
   * @param  {StringList} relationsPropertyNames Relations properties to be encoded.
   * If not defined, no Relation properties are encoded.
   * @return {String} NoteWork based representation of Network.
   * tags:encoding
   */
  NetworkEncodings.encodeNoteWork = function(network, nodeContentSeparator, nodesPropertyNames, relationsPropertyNames) {
    if(network == null) return;

    var code = "";
    var regex, lineRelation;

    var codedRelationsContents;

    nodeContentSeparator = nodeContentSeparator || ', ';
    nodesPropertyNames = nodesPropertyNames || [];
    relationsPropertyNames = relationsPropertyNames || [];

    network.nodeList.forEach(function(node) {
      code += node.name;
      if(node.content && node.content !== "") code += nodeContentSeparator + node.content;
      code += "\n";

      nodesPropertyNames.forEach(function(propName) {
        if(node[propName] != null) code += propName + ":" + String(node[propName]) + "\n";
      });

      codedRelationsContents = new StringList();

      node.toRelationList.forEach(function(relation) {

        var content = ((relation.content == null ||  relation.content === "") && relation.description) ? relation.description : relation.content;

        if(content && content !== "") {
          regex = NetworkEncodings._regexWordForNoteWork(relation.node1.name);
          lineRelation = content + ((regex != null && content.search(regex) == -1) ? (" " + relation.node1.name) : "");
        } else {
          lineRelation = "connected with " + relation.node1.name;
        }

        if(codedRelationsContents.indexOf(lineRelation) == -1) {
          code += lineRelation;
          code += "\n";
          codedRelationsContents.push(lineRelation);
        }

      });

      code += "\n";

    });

    return code;
  };





  //////////////GDF

  /**
   * Creates Network from a GDF string representation.
   *
   * @param  {String} gdfCode GDF serialized Network representation.
   * @return {Network}
   * tags:decoder
   */
  NetworkEncodings.decodeGDF = function(gdfCode) {
    if(gdfCode == null || gdfCode === "") return;

    var network = new Network();
    var lines = gdfCode.split("\n"); //TODO: split by ENTERS OUTSIDE QUOTEMARKS
    if(lines.length === 0) return null;
    var line;
    var i;
    var j;
    var parts;

    var nodesPropertiesNames = lines[0].substr(8).split(",");

    var iEdges;

    for(i = 1; lines[i] != null; i++) {
      line = lines[i];
      if(line.substr(0, 8) == "edgedef>") {
        iEdges = i + 1;
        break;
      }
      line = NetworkEncodings.replaceChomasInLine(line);
      parts = line.split(",");
      var node = new _Node(String(parts[0]), String(parts[1]));
      for(j = 0; (nodesPropertiesNames[j] != null && parts[j] != null); j++) {
        if(nodesPropertiesNames[j] == "weight") {
          node.weight = Number(parts[j]);
        } else if(nodesPropertiesNames[j] == "x") {
          node.x = Number(parts[j]);
        } else if(nodesPropertiesNames[j] == "y") {
          node.y = Number(parts[j]);
        } else {
          node[nodesPropertiesNames[j]] = parts[j].replace(/\*CHOMA\*/g, ",");
        }
      }
      network.addNode(node);
    }

    var relationsPropertiesNames = lines[iEdges - 1].substr(8).split(",");

    for(i = iEdges; lines[i] != null; i++) {
      line = lines[i];
      line = NetworkEncodings.replaceChomasInLine(line);
      parts = line.split(",");
      if(parts.length >= 2) {
        var node0 = network.nodeList.getNodeById(String(parts[0]));
        var node1 = network.nodeList.getNodeById(String(parts[1]));
        if(node0 == null || node1 == null) {
          console.log("NetworkEncodings.decodeGDF | [!] problems with nodes ids:", parts[0], parts[1], "at line", i);
        } else {
          var id = node0.id + "_" + node1.id + "_" + Math.floor(Math.random() * 999999);
          var relation = new Relation(id, id, node0, node1);
          for(j = 2; (relationsPropertiesNames[j] != null && parts[j] != null); j++) {
            if(relationsPropertiesNames[j] == "weight") {
              relation.weight = Number(parts[j]);
            } else {
              relation[relationsPropertiesNames[j]] = parts[j].replace(/\*CHOMA\*/g, ",");
            }
          }
          network.addRelation(relation);
        }
      }

    }

    return network;
  };

  /**
   * Encodes a network in GDF Format, more info on GDF
   * format can be found from
   * {@link https://gephi.org/users/supported-graph-formats/gml-format/|Gephi}.
   *
   * @param  {Network} network Network to encode.
   * @param  {StringList} nodesPropertiesNames Names of nodes properties to be encoded.
   * @param  {StringList} relationsPropertiesNames Names of relations properties to be encoded
   * @return {String} GDF encoding of Network.
   * tags:encoder
   */
  NetworkEncodings.encodeGDF = function(network, nodesPropertiesNames, relationsPropertiesNames) {
    if(network == null) return;

    nodesPropertiesNames = nodesPropertiesNames == null ? new StringList() : nodesPropertiesNames;
    relationsPropertiesNames = relationsPropertiesNames == null ? new StringList() : relationsPropertiesNames;

    var code = "nodedef>id" + (nodesPropertiesNames.length > 0 ? "," : "") + nodesPropertiesNames.join(",");
    var i;
    var j;
    var node;
    for(i = 0; network.nodeList[i] != null; i++) {
      node = network.nodeList[i];
      code += "\n" + node.id;
      for(j = 0; nodesPropertiesNames[j] != null; j++) {

        if(typeof node[nodesPropertiesNames[j]] == 'string') {
          code += ",\"" + node[nodesPropertiesNames[j]] + "\"";
        } else {
          code += "," + node[nodesPropertiesNames[j]];
        }
      }
    }

    code += "\nedgedef>id0,id1" + (relationsPropertiesNames.length > 0 ? "," : "") + relationsPropertiesNames.join(",");
    var relation;
    for(i = 0; network.relationList[i] != null; i++) {
      relation = network.relationList[i];
      code += "\n" + relation.node0.id + "," + relation.node1.id;
      for(j = 0; relationsPropertiesNames[j] != null; j++) {

        if(typeof relation[relationsPropertiesNames[j]] == 'string') {
          code += ",\"" + relation[relationsPropertiesNames[j]] + "\"";
        } else {
          code += "," + relation[relationsPropertiesNames[j]];
        }
      }
    }

    return code;
  };


  //////////////GML

  /**
   * Decodes a GML file into a new Network.
   *
   * @param  {String} gmlCode GML based representation of Network.
   * @return {Network}
   * tags:decoder
   */
  NetworkEncodings.decodeGML = function(gmlCode) {
    if(gmlCode == null) return null;

    gmlCode = gmlCode.substr(gmlCode.indexOf("[") + 1);

    var network = new Network();

    var firstEdgeIndex = gmlCode.search(/\bedge\b/);

    var nodesPart = gmlCode.substr(0, firstEdgeIndex);
    var edgesPart = gmlCode.substr(firstEdgeIndex);

    var part = nodesPart;

    var blocks = StringOperators.getParenthesisContents(part, true);

    //console.log('blocks.length', blocks.length);

    var graphicsBlock;
    var lines;
    var lineParts;

    var indexG0;
    var indexG1;

    var node;
    var i, j;

    for(i = 0; blocks[i] != null; i++) {
      blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\n");
      blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\r");

      indexG0 = blocks[i].indexOf('graphics');
      if(indexG0 != -1) {
        indexG1 = blocks[i].indexOf(']');
        graphicsBlock = blocks[i].substring(indexG0, indexG1 + 1);
        blocks[i] = blocks[i].substr(0, indexG0) + blocks[i].substr(indexG1 + 1);

        graphicsBlock = StringOperators.getFirstParenthesisContent(graphicsBlock, true);
        blocks[i] = blocks[i] + graphicsBlock;
      }

      lines = blocks[i].split('\n');

      lines[0] = NetworkEncodings._cleanLineBeginning(lines[0]);

      lineParts = lines[0].split(" ");

      node = new _Node(StringOperators.removeQuotes(lineParts[1]), StringOperators.removeQuotes(lineParts[1]));

      network.addNode(node);

      for(j = 1; lines[j] != null; j++) {
        lines[j] = NetworkEncodings._cleanLineBeginning(lines[j]);
        lines[j] = NetworkEncodings._replaceSpacesInLine(lines[j]);
        if(lines[j] !== "") {
          lineParts = lines[j].split(" ");
          if(lineParts[0] == 'label') lineParts[0] = 'name';
          node[lineParts[0]] = (lineParts[1].charAt(0) == "\"") ? StringOperators.removeQuotes(lineParts[1]).replace(/\*SPACE\*/g, " ") : Number(lineParts[1]);
        }
      }
    }

    part = edgesPart;
    blocks = StringOperators.getParenthesisContents(part, true);

    var id0;
    var id1;
    var node0;
    var node1;
    var relation;
    var nodes = network.nodeList;


    for(i = 0; blocks[i] != null; i++) {
      blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\n");
      blocks[i] = StringOperators.removeInitialRepeatedCharacter(blocks[i], "\r");

      lines = blocks[i].split('\n');

      id0 = null;
      id1 = null;
      relation = null;

      for(j = 0; lines[j] != null; j++) {
        lines[j] = NetworkEncodings._cleanLineBeginning(lines[j]);
        if(lines[j] !== "") {
          lineParts = lines[j].split(" ");
          if(lineParts[0] == 'source') id0 = StringOperators.removeQuotes(lineParts[1]);
          if(lineParts[0] == 'target') id1 = StringOperators.removeQuotes(lineParts[1]);

          if(relation == null) {
            if(id0 != null && id1 != null) {
              node0 = nodes.getNodeById(id0);
              node1 = nodes.getNodeById(id1);
              if(node0 != null && node1 != null) {
                relation = new Relation(id0 + " " + id1, '', node0, node1);
                network.addRelation(relation);
              }
            }
          } else {
            if(lineParts[0] == 'value') lineParts[0] = 'weight';
            relation[lineParts[0]] = (lineParts[1].charAt(0) == "\"") ? StringOperators.removeQuotes(lineParts[1]) : Number(lineParts[1]);
          }
        }

      }

    }

    return network;
  };

  /**
   * _cleanLineBeginning
   *
   * @ignore
   */
  NetworkEncodings._cleanLineBeginning = function(string) {
    string = StringOperators.removeInitialRepeatedCharacter(string, "\n");
    string = StringOperators.removeInitialRepeatedCharacter(string, "\r");
    string = StringOperators.removeInitialRepeatedCharacter(string, " ");
    string = StringOperators.removeInitialRepeatedCharacter(string, "	");
    return string;
  };


  /**
   * Encodes a network into GDF format.
   *
   * @param  {Network} network The Network to encode.
   *
   * @param  {StringList} nodesPropertiesNames Names of Node properties to encode.
   * @param  {StringList} relationsPropertiesNames Names of Relation properties to encode.
   * @param {Boolean} idsAsInts If true, then the index of the Node is used as an ID.
   * GDF strong specification requires ids for nodes being int numbers.
   * @return {String} GDF string.
   * tags:encoder
   */
  NetworkEncodings.encodeGML = function(network, nodesPropertiesNames, relationsPropertiesNames, idsAsInts) {
    if(network == null) return;

    idsAsInts = idsAsInts == null ? true : idsAsInts;

    nodesPropertiesNames = nodesPropertiesNames == null ? new StringList() : nodesPropertiesNames;
    relationsPropertiesNames = relationsPropertiesNames == null ? new StringList() : relationsPropertiesNames;

    var code = "graph\n[";
    var ident = "	";
    var i;
    var j;
    var node;
    var isString;
    var value;
    for(i = 0; network.nodeList[i] != null; i++) {
      node = network.nodeList[i];
      code += "\n" + ident + "node\n" + ident + "[";
      ident = "		";
      if(idsAsInts) {
        code += "\n" + ident + "id " + i;
      } else {
        code += "\n" + ident + "id \"" + node.id + "\"";
      }
      if(node.name !== '') code += "\n" + ident + "label \"" + node.name + "\"";
      for(j = 0; nodesPropertiesNames[j] != null; j++) {
        value = node[nodesPropertiesNames[j]];
        if(value == null) continue;
        if(value.getMonth) value = DateOperators.dateToString(value);
        isString = (typeof value == 'string');
        if(isString) value = value.replace(/\n/g, "\\n").replace(/\"/g, "'");
        code += "\n" + ident + nodesPropertiesNames[j] + " " + (isString ? "\"" + value + "\"" : value);
      }
      ident = "	";
      code += "\n" + ident + "]";
    }

    var relation;
    for(i = 0; network.relationList[i] != null; i++) {
      relation = network.relationList[i];
      code += "\n" + ident + "edge\n" + ident + "[";
      ident = "		";
      if(idsAsInts) {
        code += "\n" + ident + "source " + network.nodeList.indexOf(relation.node0);
        code += "\n" + ident + "target " + network.nodeList.indexOf(relation.node1);
      } else {
        code += "\n" + ident + "source \"" + relation.node0.id + "\"";
        code += "\n" + ident + "target \"" + relation.node1.id + "\"";
      }
      for(j = 0; relationsPropertiesNames[j] != null; j++) {
        value = relation[relationsPropertiesNames[j]];
        if(value == null) continue;
        if(value.getMonth) value = DateOperators.dateToString(value);
        isString = (typeof value == 'string');
        if(isString) value = value.replace(/\n/g, "\\n").replace(/\"|“|”/g, "'");
        code += "\n" + ident + relationsPropertiesNames[j] + " " + (isString ? "\"" + value + "\"" : value);
      }
      ident = "	";
      code += "\n" + ident + "]";
    }

    code += "\n]";
    return code;
  };





  //////////////SYM

  /**
   * decodeSYM
   *
   * @param symCode
   * @return {Network}
   */
  NetworkEncodings.decodeSYM = function(symCode) {
    //console.log("/////// decodeSYM\n"+symCode+"\n/////////");
    var i;
    var j;

    var lines = StringOperators.splitByEnter(symCode);
    lines = lines == null ? [] : lines;

    var objectPattern = /((?:NODE|RELATION)|GROUP)\s*([A-Za-z0-9_,\s]*)/;

    var network = new Network();
    var groups = new Table();
    var name;
    var id;
    var node;
    var node1;
    var relation;
    var group;
    var groupName;
    var parts;
    var propName;
    var propCont;

    var nodePropertiesNames = [];
    var relationPropertiesNames = [];
    var groupsPropertiesNames = [];

    for(i = 0; lines[i] != null; i++) {
      var bits = objectPattern.exec(lines[i]);
      if(bits != null) {
        switch(bits[1]) {
          case "NODE":
            id = bits[2];
            name = lines[i + 1].substr(0, 5) == "name:" ? lines[i + 1].substr(5).trim() : "";
            name = name.replace(/\\n/g, '\n').replace(/\\'/g, "'");
            node = new _Node(id, name);
            network.addNode(node);
            j = i + 1;
            while(j < lines.length && lines[j].indexOf(":") != -1) {
              parts = lines[j].split(":");
              propName = parts[0];
              propCont = parts.slice(1).join(":");
              if(propName != "name") {
                propCont = propCont.trim();
                node[propName] = String(Number(propCont)) == propCont ? Number(propCont) : propCont;
                if(typeof node[propName] == "string") node[propName] = node[propName].replace(/\\n/g, '\n').replace(/\\'/g, "'");
                if(nodePropertiesNames.indexOf(propName) == -1) nodePropertiesNames.push(propName);
              }
              j++;
            }
            if(node.color != null) {
              if(/.+,.+,.+/.test(node.color)) node.color = 'rgb(' + node.color + ')';
            }
            if(node.group != null) {
              group = groups.getFirstElementByPropertyValue("name", node.group);
              if(group == null) {
                console.log("NODES new group:[" + node.group + "]");
                group = new NodeList();
                group.name = node.group;
                group.name = group.name.replace(/\\n/g, '\n').replace(/\\'/g, "'");
                groups.push(group);
              }
              group.addNode(node);
              //node.group = group;
            }
            break;
          case "RELATION":
            var ids = bits[2].replace(/\s/g, "").split(",");
            //var ids = bits[2].split(",");
            node = network.nodeList.getNodeById(ids[0]);
            node1 = network.nodeList.getNodeById(ids[1]);
            if(node != null && node1 != null) {
              relation = new Relation(node.id + "_" + node1.id, node.id + "_" + node1.id, node, node1);
              network.addRelation(relation);
              j = i + 1;
              while(j < lines.length && lines[j].indexOf(":") != -1) {
                parts = lines[j].split(":");
                propName = parts[0];
                propCont = parts.slice(1).join(":").trim();
                if(propName != "name") {
                  propCont = propCont.trim();
                  relation[propName] = String(Number(propCont)) == propCont ? Number(propCont) : propCont;
                  if(typeof relation[propName] == "string") relation[propName] = relation[propName].replace(/\\n/g, '\n').replace(/\\'/g, "'");
                  if(relationPropertiesNames.indexOf(propName) == -1) relationPropertiesNames.push(propName);
                }
                j++;
              }
            }
            if(relation != null && relation.color != null) {
              relation.color = 'rgb(' + relation.color + ')';
            }
            break;
          case "GROUP":
            groupName = lines[i].substr(5).trim();

            group = groups.getFirstElementByPropertyValue("name", groupName);
            if(group == null) {
              group = new NodeList();
              group.name = groupName;
              groups.push(group);
            }
            j = i + 1;
            while(j < lines.length && lines[j].indexOf(":") != -1) {
              parts = lines[j].split(":");
              if(parts[0] != "name") {
                parts[1] = parts[1].trim();
                group[parts[0]] = String(Number(parts[1])) == parts[1] ? Number(parts[1]) : parts[1];
                if(groupsPropertiesNames.indexOf(parts[0]) == -1) groupsPropertiesNames.push(parts[0]);
              }
              j++;
            }

            if(/.+,.+,.+/.test(group.color)) group.color = 'rgb(' + group.color + ')';

            break;
        }
      }
    }

    for(i = 0; groups[i] != null; i++) {
      group = groups[i];
      if(group.color == null) group.color = ColorListGenerators._HARDCODED_CATEGORICAL_COLORS[i % ColorListGenerators._HARDCODED_CATEGORICAL_COLORS.length];
      for(j = 0; group[j] != null; j++) {
        node = group[j];
        if(node.color == null) node.color = group.color;
      }
    }

    network.groups = groups;



    network.nodePropertiesNames = nodePropertiesNames;
    network.relationPropertiesNames = relationPropertiesNames;
    network.groupsPropertiesNames = groupsPropertiesNames;

    return network;
  };

  /**
   * encodeSYM
   *
   * @param network
   * @param groups
   * @param nodesPropertiesNames
   * @param relationsPropertiesNames
   * @param groupsPropertiesNames
   * @return {String}
   */
  NetworkEncodings.encodeSYM = function(network, groups, nodesPropertiesNames, relationsPropertiesNames, groupsPropertiesNames) {
    nodesPropertiesNames = nodesPropertiesNames == null ? new StringList() : nodesPropertiesNames;
    relationsPropertiesNames = relationsPropertiesNames == null ? new StringList() : relationsPropertiesNames;

    var code = "";
    var i;
    var j;
    var node;
    var propertyName;
    for(i = 0; network.nodeList[i] != null; i++) {
      node = network.nodeList[i];
      code += (i === 0 ? "" : "\n\n") + "NODE " + node.id;
      if(node.name !== "") code += "\nname:" + (node.name).replace(/\n/g, "\\n");
      for(j = 0; nodesPropertiesNames[j] != null; j++) {
        propertyName = nodesPropertiesNames[j];
        if(node[propertyName] != null) code += "\n" + propertyName + ":" + _processProperty(propertyName, node[propertyName]);
      }
    }

    var relation;
    for(i = 0; network.relationList[i] != null; i++) {
      relation = network.relationList[i];
      code += "\n\nRELATION " + relation.node0.id + ", " + relation.node1.id;
      for(j = 0; relationsPropertiesNames[j] != null; j++) {
        propertyName = relationsPropertiesNames[j];
        if(relation[propertyName] != null) code += "\n" + propertyName + ":" + _processProperty(propertyName, relation[propertyName]);
      }
    }

    if(groups == null) return code;

    var group;
    for(i = 0; groups[i] != null; i++) {
      group = groups[i];
      code += "\n\nGROUP " + group.name;
      for(j = 0; groupsPropertiesNames[j] != null; j++) {
        propertyName = groupsPropertiesNames[j];
        if(group[propertyName] != null) code += "\n" + propertyName + ":" + _processProperty(propertyName, group[propertyName]);
      }
    }

    //console.log("/////// encodeSYM\n"+code+"\n/////////");

    return code;
  };

  function _processProperty(propName, propValue) { //TODO: use this in other encoders
    switch(propName) {
      case "color":
        if(propValue.substr(0, 3) == "rgb") {
          var rgb = ColorOperators.colorStringToRGB(propValue);
          return rgb.join(',');
        }
        return propValue;
    }
    propValue = String(propValue).replace(/\n/g, "\\n");
    return propValue;
  }





  /////////////////

  //Also used by CSVToTable

  /**
   * replaceChomasInLine
   *
   * @ignore
   */
  NetworkEncodings.replaceChomasInLine = function(line, separator) {
    var quoteBlocks = line.split("\"");
    if(quoteBlocks.length < 2) return line;
    var insideQuote;
    var i;
    var re;
    separator = separator==null?",":separator;

    switch(separator){
      case ",":
        re = /,/g;
        break;
      case ";":
        re = /;/g;
        break;
    }

    for(i = 0; quoteBlocks[i] != null; i++) {
      insideQuote = i * 0.5 != Math.floor(i * 0.5);
      if(insideQuote) {
        quoteBlocks[i] = quoteBlocks[i].replace(re, "*CHOMA*");
      }
    }
    line = StringList.fromArray(quoteBlocks).getConcatenated("");
    return line;
  };

  /**
   * _replaceSpacesInLine
   *
   * @ignore
   */
  NetworkEncodings._replaceSpacesInLine = function(line) {
    var quoteBlocks = line.split("\"");
    if(quoteBlocks.length < 2) return line;
    var insideQuote;
    var i;
    for(i = 0; quoteBlocks[i] != null; i++) {
      insideQuote = i * 0.5 != Math.floor(i * 0.5);
      if(insideQuote) {
        quoteBlocks[i] = quoteBlocks[i].replace(/ /g, "*SPACE*");
      }
    }
    line = StringList.fromArray(quoteBlocks).getConcatenated("\"");
    return line;
  };

  //data models info
  var dataModelsInfo = [
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
  var TwoPi = 2*Math.PI;
  var HalfPi = 0.5*Math.PI;
  var radToGrad = 180/Math.PI;
  var gradToRad = Math.PI/180;

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
  function setStructureLocalStorage(object, id, comments){
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
  function getStructureLocalStorageFromSeed(seed, returnStorageObject){
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
  function getStructureLocalStorage(id, returnStorageObject){
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

  NodeList.prototype = new List();
  NodeList.prototype.constructor = NodeList;

  /**
   * @classdesc A sub-class of {@link List} for storing {@link Node|Nodes}.
   *
   * @description create a new NodeList.
   * @constructor
   * @category networks
   */
  function NodeList() {
    //var array=List.apply(this, arguments);

    //if(arguments && arguments.length>0) {c.l('UEUEUEUE, arguments.length', arguments.length); var a; a.push(0)};

    var array = NodeList.fromArray([]);

    if(arguments && arguments.length > 0) {
      var args = Array.prototype.slice.call(arguments);

      args.forEach(function(arg) {
        array.addNode(arg);
      });
    }

    return array;
  }
  /**
   * Creates NodeList from raw Array.
   *
   * @param {Node[] | String[]} array Array to convert to
   * @param {Boolean} forceToNode If true, and input array is an array of Strings,
   * convert strings to Node instances with the strings used as the Node's id and name.
   * @return {NodeList}
   */
  NodeList.fromArray = function(array, forceToNode) {
    forceToNode = forceToNode == null ? false : forceToNode;

    var result = List.fromArray(array);


    if(forceToNode) {
      var lengthResult = result.length;

      for(var i = 0; i < lengthResult; i++) {
        result[i] = typeOf(result[i]) == "Node" ? result[i] : (new _Node(String(result[i]), String(result[i])));
      }
    }
    
    result.type = "NodeList";
    result.ids = {};
    // TODO: Fix
    Array(); //????

    //assign methods to array:
    result.deleteNodes = NodeList.prototype.deleteNodes;
    result.addNode = NodeList.prototype.addNode;
    result.addNodes = NodeList.prototype.addNodes;
    result.removeNode = NodeList.prototype.removeNode;
    result.removeNodeAtIndex = NodeList.prototype.removeNodeAtIndex;
    result.getNodeByName = NodeList.prototype.getNodeByName;
    result.getNodeById = NodeList.prototype.getNodeById;
    result.getNodesByIds = NodeList.prototype.getNodesByIds;
    result.getNewId = NodeList.prototype.getNewId;
    result.normalizeWeights = NodeList.prototype.normalizeWeights;
    result.getWeights = NodeList.prototype.getWeights;
    result.getIds = NodeList.prototype.getIds;
    result.getDegrees = NodeList.prototype.getDegrees;
    result.getPolygon = NodeList.prototype.getPolygon;

    result._push = Array.prototype.push;
    result.push = function(a) {
      console.log('with nodeList, use addNode instead of push');
      var k;
      k.push(a);
    };

    //overriden
    result.getWithoutRepetitions = NodeList.prototype.getWithoutRepetitions;
    result.removeElements = NodeList.prototype.removeElements;
    result.clone = NodeList.prototype.clone;

    return result;
  };

  /**
   * Clears NodeList.
   *
   */
  NodeList.prototype.removeNodes = function() {
    var l = this.length;
    var i;
    for(i = 0; i < l; i++) {
      this.ids[this[i].id] = null;
      this.removeElement(this[i]);
    }
  };

  /**
   * Adds given Node to NodeList.
   *
   * @param {Node} node Node to add
   */
  NodeList.prototype.addNode = function(node) {
    this.ids[node.id] = node;
    this._push(node);
  };

  /**
   * Adds all Nodes from another NodeList to this NodeList.
   *
   * @param {NodeList} nodes Nodes to add.
   */
  NodeList.prototype.addNodes = function(nodes) {
    var i;
    for(i = 0; nodes[i] != null; i++) {
      this.addNode(nodes[i]);
    }
  };

  /**
   * Removes a given node from the list.
   *
   * @param {Node} node Node to remove.
   */
  NodeList.prototype.removeNode = function(node) {
    this.ids[node.id] = null;
    this.removeElement(node);
  };

  /**
   * Removes a Node at a particular index of the NodeList
   *
   * @param {Number} index The index of the Node to remove.
   */
  NodeList.prototype.removeNodeAtIndex = function(index) {
    this.ids[this[index].id] = null;
    this.splice(index, 1);
  };

  /**
   * Normalizes all weights associated with Nodes in NodeList
   * to a value between 0 and 1. Works under the assumption that weights are >= 0.
   */
  NodeList.prototype.normalizeWeights = function() {
    var i;
    var max = -9999999;
    for(i = 0; this[i] != null; i++) {
      max = Math.max(this[i].weight, max);
    }
    for(i = 0; this[i] != null; i++) {
      this[i].weight /= max;
    }
  };


  /**
   * Returns Node with given name if present in the NodeList.
   * Very inefficient method. Use {@link .getNodeById} when possible
   *
   * @return {Node} Node with name matching input name. Null if no such Node.
   */
  NodeList.prototype.getNodeByName = function(name) {
    var i;
    var l = this.length;
    for(i = 0; i < l; i++) {
      if(this[i].name == name) {
        return this[i];
      }
    }
    return null;
  };

  /**
   * Returns Node in NodeList with given Id.
   *
   * @param  {String} id Id of Node to return.
   * @return {Node}
   * tags:search
   */
  NodeList.prototype.getNodeById = function(id) {
    return this.ids[id];
  };

  /**
   * Returns a new NodeList with all nodes in this
   * NodeList with Id's found in the given {@link NumberList}
   * of ids.
   *
   * @param {NumberList} ids Ids of Nodes to extract.
   * @return {NodeList}
   */
  NodeList.prototype.getNodesByIds = function(ids) {
    var newNodelist = new NodeList();
    var node;
    var nIds = ids.length;
    for(var i = 0; i<nIds; i++) {
      node = this.ids[ids[i]];
      if(node != null) newNodelist.addNode(node);
    }
    return newNodelist;
  };

  /**
   * Returns a {@link NumberList} of the weights associated
   * with each Node in the NodeList.
   *
   * @return {NumberList}
   * tags:
   */
  NodeList.prototype.getWeights = function() {
    var numberList = new NumberList();
    var i;
    for(i = 0; this[i] != null; i++) {
      numberList[i] = this[i].weight;
    }
    return numberList;
  };

  /**
   * Returns a {@link StringList} of all the Ids
   * of the Nodes in the NodeList.
   *
   * @return {StringList}
   * tags:
   */
  NodeList.prototype.getIds = function() {
    var list = new StringList();
    var l = this.length;
    for(var i = 0; i<l; i++) {
      list[i] = this[i].id;
    }
    return list;
  };

  /**
   * Returns a {@link NumberList} with a count of directly
   * connected Relations a Node has for each Node.
   *
   *
   * @return {NumberList} List containing the number
   * of Relations each Node has.
   */
  NodeList.prototype.getDegrees = function() {
    var numberList = new NumberList();
    for(var i = 0; this[i] != null; i++) {
      numberList[i] = this[i].nodeList.length;
    }
    return numberList;
  };


  /**
   * Returns a {@link Polygon} constructed from all Nodes in
   * the NodeList by using the
   * <strong>x</strong> and <strong>y</strong> attributes of
   * the Nodes.
   *
   * @return {Polygon}
   */
  NodeList.prototype.getPolygon = function(graphics) {
    var polygon = new _Polygon();
    for(var i = 0; this[i] != null; i++) {
      polygon[i] = new _Point(this[i].x + graphics.cX, this[i].y + graphics.cY);
    }
    return polygon;
  };

  NodeList.prototype.getNewId = function() {
    var n = this.length + 1;
    for(var i = 0; i < n; i++) {
      if(this.getNodeById(String(i)) == null) return String(i);
    }
  };

  /**
   * Returns a copy of this NodeList.
   *
   * @return {NodeList}
   */
  NodeList.prototype.clone = function() {
    var newNodeList = new NodeList();
    var l = this.length;
    var i;
    //this.forEach(function(node) {
    for(i=0; i<l; i++){
      newNodeList.addNode(this[i]);
    }
    newNodeList.name = this.name;
    return newNodeList;
  };


  //methods overriden

  /**
   * getWithoutRepetitions
   *
   * @return {undefined}
   * @ignore
   */
  NodeList.prototype.getWithoutRepetitions = function() {
    var newList = new NodeList();
    var i;
    newList.name = this.name;
    for(i = 0; this[i]!=null; i++) {
      if(newList.getNodeById(this[i].id) == null) newList.addNode(this[i]);
    }
    return newList;
  };

  /**
   * removeElements
   *
   * @return {undefined}
   * @ignore
   */
  NodeList.prototype.removeElements = function(nodeList) {
    var i;
    for(i = 0; this[i]!=null; i++) {
      //if(elements.indexOf(this[i]) > -1) {
      // c.l('                          this[i].id:', this[i].id);
      // c.l('                          nodeList.getNodeById(this[i].id):', nodeList.getNodeById(this[i].id));
      if( nodeList.getNodeById(this[i].id) != null ){
        this.ids[this[i].id] = null;
        this.splice(i, 1);
        //this.removeNode(this[i]);
        i--;
        // c.l('                            X, i, this.length', i, this.length);
      }
    }
  };

  RelationList.prototype = new NodeList();
  RelationList.prototype.constructor = RelationList;
  /**
   * RelationList
   * @constructor
   */

  /**
   * @classdesc A sub-class of {@link List} for storing {@link Relations|Relation}.
   *
   * @description create a new RelationList.
   * @constructor
   * @category networks
   */
  function RelationList() {
    var array = NodeList.apply(this, arguments);
    array.name = "";
    //assign methods to array:
    array = RelationList.fromArray(array);
    //
    return array;
  }
  /**
   * Convert raw array of Relations into a RelationList.
   *
   * @param {Relation[]} array Array to convert to a RelationList.
   * @return {RelationList}
   */
  RelationList.fromArray = function(array) {
    var result = NodeList.fromArray(array);
    result.type = "RelationList";
    //assign methods to array:
    result.addRelation = RelationList.prototype.addRelation;
    result.addRelationIfNew = RelationList.prototype.addRelationIfNew;
    result.removeRelation = RelationList.prototype.removeRelation;
    result.getRelationsWithNode = RelationList.prototype.getRelationsWithNode;
    result.getFirstRelationBetweenNodes = RelationList.prototype.getFirstRelationBetweenNodes;
    result.getFirstRelationByIds = RelationList.prototype.getFirstRelationByIds;
    result.getAllRelationsBetweenNodes = RelationList.prototype.getAllRelationsBetweenNodes;
    result.getRelatedNodesToNode = RelationList.prototype.getRelatedNodesToNode;
    result.nodesAreConnected = RelationList.prototype.nodesAreConnected;

    return result;
  };

  /**
   * Add new Relation to the list.
   *
   * @param {Relation} relation Relation to add.
   */
  //TODO:remove?
  RelationList.prototype.addRelation = function(relation) {
    this.addNode(relation);
  };

  /**
   * Removes Relation from the list.
   *
   * @param {Relation} relation Relation to remove.
   */
  RelationList.prototype.removeRelation = function(relation) {
      this.removeNode(relation);
  };

  /**
   * Returns all relations that are directly connected to the given Node.
   *
   * @param {Node} node Node to search
   * @return {Relation[]} Containing Relations that contain node.
   */
  RelationList.prototype.getRelationsWithNode = function(node) {
    var i;
    var filteredRelations = [];
    for(i = 0; this[i] != null; i++) {
      var relation = this[i];
      if(relation.node0 == node || relation.node1 == node) {
        filteredRelations.push(relation);
      }
    }

    // TODO: convert to RelationList?
    return filteredRelations;
  };

  /**
   * Returns all Nodes related to a given Node.
   *
   * @param {Node} node
   * @return a RelationList with relations that contain node
   */
  RelationList.prototype.getRelatedNodesToNode = function(node) {
    var i;
    var relatedNodes = new NodeList();
    for(i = 0; i < this.length; i++) {
      var relation = this[i];
      if(relation.node0.id == node.id) {
        relatedNodes.push(relation.node1);
      }
      if(relation.node1.id == node.id) {
        relatedNodes.push(relation.node0);
      }
    }
    return relatedNodes;
  };



  /**
   * Returns all Relations between two Nodes.
   *
   * @param {Node} node0 Source Node.
   * @param {Node} node1 Destination Node.
   * @param {Boolean} directed Consider Relation directional in nature (default: false).
   * @return {Relation[]} With Relations that contain node0 and node1.
   * tags:
   */
  RelationList.prototype.getAllRelationsBetweenNodes = function(node0, node1, directed) {
    //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
    var i;
    directed = directed == null ? false : directed;
    var filteredRelations = [];
    for(i = 0; this[i] != null; i++) {
      var relation = this[i];
      if((relation.node0 == node0 && relation.node1 == node1) || (!directed && relation.node0 == node1 && relation.node1 == node0)) {
        filteredRelations.push(relation);
      }
    }
    // TODO: convert to RelationList ?
    return filteredRelations;
  };


  /**
   * Checks if two nodes are related, returns a boolean
   *
   * @param  {Node} node0
   * @param  {Node} node1
   * @param  {Boolean} directed true if relation must be directed
   * @return {Boolean}
   * tags:
   */
  RelationList.prototype.nodesAreConnected = function(node0, node1, directed) {
    if(node0.toNodeList.getNodeById(node1.id) != null) return true;
    return !directed && node1.toNodeList.getNodeById(node0.id) != null;
  };


  /**
   * Returns the first Relation between two Nodes.
   *
   * @param {Node} node0 Source Node.
   * @param {Node} node1 Destination Node.
   * @param {Boolean} directed consider relation direction (default: false).
   * @return {Relation[]} With Relations that contain node0 and node1.
   * tags:
   */
  RelationList.prototype.getFirstRelationBetweenNodes = function(node0, node1, directed) { //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected) //TODO: make it work with ids
    directed = directed == null ? false : directed;

    for(var i = 0; this[i] != null; i++) {
      if((this[i].node0.id == node0.id && this[i].node1.id == node1.id) || (!directed && this[i].node1.id == node0.id && this[i].node0.id == node1.id)) return this[i];
    }
    return null;
  };


  /**
   * Returns first relations between two Nodes.
   *
   * @param {String} id0 Id of the source Node.
   * @param {String} id1 Id of the destination Node.
   * @param {Boolean} directed Consider relation directional (default: false).
   * @return {Relation[]} With Relations that contain node0 and node1 (with node0.id = id0 and node1.id = id1).
   */
  RelationList.prototype.getFirstRelationByIds = function(id0, id1, directed) {
    //TODO: to be improved (check node1 on node0.relationList) (see: nodesAreConnected)
    //TODO: make it work with ids
    var i;
    var _directed = directed || false;
    var relation;
    for(i = 0; this[i] != null; i++) {
      relation = this[i];
      if(relation.node0.id == id0 && relation.node1.id == id1) {
        return relation;
      }
    }
    if(_directed) return null;
    //c.log("<->");
    for(i = 0; this[i] != null; i++) {
      relation = this[i];
      if(relation.node0.id == id1 && relation.node1.id == id0) {
        //c.log("<--- ", relation.node0.name, relation.node1.name);
        // TODO: convert to RelationList ?
        return relation;
      }
    }
    return null;
  };

  // Provides a lookup table for instantiate classes.
  // This is used in the instantiate function to simplify the logic
  // around the creation of these classes.
  var typeDict = {
    List: List,
    Table: Table,
    StringList: StringList,
    NumberList: NumberList,
    NumberTable: NumberTable,
    NodeList: NodeList,
    RelationList: RelationList,
    Polygon: _Polygon,
    Polygon3D: Polygon3D,
    DateList: DateList,
    ColorList: ColorList
  };


  /*
   * All these function are globally available since they are included in the Global class
   */
  var TYPES_SHORT_NAMES_DICTIONARY = {"Null":"Ø","Object":"{}","Function":"F","Boolean":"b","Number":"#","Interval":"##","Array":"[]","List":"L","Table":"T","BooleanList":"bL","NumberList":"#L","NumberTable":"#T","String":"s","StringList":"sL","StringTable":"sT","Date":"d","DateInterval":"dd","DateList":"dL","Point":".","Rectangle":"t","Polygon":".L","RectangleList":"tL","MultiPolygon":".T","Point3D":"3","Polygon3D":"3L","MultiPolygon3D":"3T","Color":"c","ColorScale":"cS","ColorList":"cL","Image":"i","ImageList":"iL","Node":"n","Relation":"r","NodeList":"nL","RelationList":"rL","Network":"Nt","Tree":"Tr"};
  var _shortFromTypeDictionary;
  var _colorFromTypeDictionary;
  var _lightColorFromTypeDictionary;

  /*
   * types are:
   * number, string, boolean, date, Array, Object
   * and all data models classes names
   */

  function typeOf(object) {
    if(object==null) return null;

    var type = typeof object;
    if(type !== 'object') return type;

    if(object.type!=null) return object.type;

    if(Object.prototype.toString.call(object) == "[object Array]") return "Array";

    if(object.getDate != null) return 'date';

    return 'Object';
  }

  function instantiate(className, args) {
    switch(className) {
      case 'number':
      case 'string':
        // TODO: I don't think this works.
        return window[className](args);
      case 'date':
        if(!args || args.length === 0) return new Date();
        if(args.length == 1) {
          if(args[0].match(/\d*.-\d*.-\d*\D\d*.:\d*.:\d*/)) {
            var dateArray = args[0].split(" ");
            dateArray[0] = dateArray[0].split("-");
            if(dateArray[1]) dateArray[1] = dateArray[1].split(":");
            else dateArray[1] = new Array(0, 0, 0);
            return new Date(Date.UTC(dateArray[0][0], Number(dateArray[0][1]) - 1, dateArray[0][2], dateArray[1][0], dateArray[1][1], dateArray[1][2]));
          }
          //
          if(Number(args[0]) != "NaN") return new Date(Number(args[0]));
          else return new Date(args[0]);
        }
        return new Date(Date.UTC.apply(null, args));
      case 'boolean':
        // TODO: I don't think this works.
        return window[className]((args == "false" || args == "0") ? false : true);
      case 'List':
      case 'Table':
      case 'StringList':
      case 'NumberList':
      case 'NumberTable':
      case 'NodeList':
      case 'RelationList':
      case 'Polygon':
      case 'Polygon3D':
      case 'PolygonList':
      case 'DateList':
      case 'ColorList':
        return typeDict[className].apply(new typeDict[className](), args);
      case null:
      case undefined:
      case 'undefined':
        return null;
    }
    //generic instantiation of object:
    var o, dummyFunction, cl;
    cl = window[className]; // get reference to class constructor function
    dummyFunction = function() {}; // dummy function
    dummyFunction.prototype = cl.prototype; // reference same prototype
    o = new dummyFunction(); // instantiate dummy function to copy prototype properties
    cl.apply(o, args); // call class constructor, supplying new object as context

    return o;
  }

  function _createDataModelsInfoDictionaries(){
    var i;
    var type;

    _shortFromTypeDictionary = {};
    _colorFromTypeDictionary = {};
    _lightColorFromTypeDictionary = {};

    for(i=0; dataModelsInfo[i]!=null; i++){
      type = dataModelsInfo[i].type;
      _shortFromTypeDictionary[type] = dataModelsInfo[i].short;
      _colorFromTypeDictionary[type] = ColorOperators.interpolateColors(dataModelsInfo[i].color, 'black', 0.2);
      _lightColorFromTypeDictionary[type] = ColorOperators.interpolateColors(dataModelsInfo[i].color, 'white', 0.35);
      type = type.toLowerCase();
      _shortFromTypeDictionary[type] = dataModelsInfo[i].short;
      _colorFromTypeDictionary[type] = ColorOperators.interpolateColors(dataModelsInfo[i].color, 'black', 0.2);
      _lightColorFromTypeDictionary[type] = ColorOperators.interpolateColors(dataModelsInfo[i].color, 'white', 0.35);
    }
  }

  function getShortNameFromDataModelType(type){
    if(_shortFromTypeDictionary==null) _createDataModelsInfoDictionaries();
    return _shortFromTypeDictionary[type];
  }

  function getColorFromDataModelType(type){
    if(_shortFromTypeDictionary==null) _createDataModelsInfoDictionaries();
    return _colorFromTypeDictionary[type];
  }

  function getLightColorFromDataModelType(type){
    if(_shortFromTypeDictionary==null) _createDataModelsInfoDictionaries();
    return _lightColorFromTypeDictionary[type];
  }

  function getTextFromObject(value, type){
    if(value == null) return "Null";
    if(value.isList) {
      if(value.length === 0) return "[]";
      var text = value.toString(); 
      if(text.length > 160) {
        var i;
        var subtext;
        text = "[";
        for(i = 0; (value[i] != null && i < 6); i++) {
          subtext = getTextFromObject(value[i], typeOf(value[i]));
          if(subtext.length > 40) subtext = subtext.substr(0, 40) + (value[i].isList ? "…]" : "…");
          text += (i !== 0 ? ", " : "") + subtext;
        }
        if(value.length > 6) text += ",…";
        text += "]";
      }
      return text;
    }

    switch(type) {
      case "date":
        return DateOperators.dateToString(value);
      case "DateInterval":
        return DateOperators.dateToString(value.date0) + " - " + DateOperators.dateToString(value.date1);
      case "string":
        return((value.length > 160) ? value.substr(0, 159) + "…" : value).replace(/\n/g, "↩");
      case "number":
        return String(value);
      default:
        return "{}"; //value.toString();
    }
  }

  function instantiateWithSameType(object, args) {
    return instantiate(typeOf(object), args);
  }

  function isArray(obj) {
    if(obj.constructor.toString().indexOf("Array") == -1)
      return false;
    else
      return true;
  }

  function evalJavaScriptFunction(functionText, args, scope){
  	if(functionText==null) return;

  	var res;

  	var myFunction;

  	var good = true;
  	var message = '';
    var error;

  	var realCode;

  	var lines = functionText.split('\n');

  	for(var i=0; lines[i]!=null; i++){
  		lines[i] = lines[i].trim();
  		if(lines[i] === "" || lines[i].substr(1)=="/"){
  			lines.splice(i,1);
  			i--;
  		}
  	}

  	var isFunction = lines[0].indexOf('function')!=-1;

  	functionText = lines.join('\n');

  	if(isFunction){
  		if(scope){
  			realCode = "scope.myFunction = " + functionText;
  		} else {
  			realCode = "myFunction = " + functionText;
  		}
  	} else {
  		if(scope){
  			realCode = "scope.myVar = " + functionText;
  		} else {
  			realCode = "myVar = " + functionText;
  		}
  	}

  	try{
  		if(isFunction){
  			eval(realCode);
  			if(scope){
  				res = scope.myFunction.apply(scope, args);
  			} else {
  				res = myFunction.apply(this, args);
  			}
  		} else {
  			eval(realCode);
  			if(scope){
  				res = scope.myVar;
  			} else 	{
  				res = myVar;
  			}
  		}
  	} catch(err){
  		good = false;
  		message = err.message;
  		res = null;
      error = err;
  	}

    var resultObject = {
      result: res,
      success: good,
      errorMessage: message,
      error: error
    };

    return resultObject;
  }

  function argumentsToArray(args) {
    return Array.prototype.slice.call(args, 0);
  }

  // export function TimeLogger(name) {
  //   var scope = this;
  //   this.name = name;
  //   this.clocks = {};

  //   this.tic = function(clockName) {
  //     scope.clocks[clockName] = new Date().getTime();
  //     //c.l( "TimeLogger '"+clockName+"' has been started");
  //   };
  //   this.tac = function(clockName) {
  //     if(scope.clocks[clockName] == null) {
  //       scope.tic(clockName);
  //     } else {
  //       var now = new Date().getTime();
  //       var diff = now - scope.clocks[clockName];
  //       console.log("TimeLogger '" + clockName + "' took " + diff + " ms");
  //     }
  //   };
  // }
  // export var tl = new TimeLogger("Global Time Logger");

  PolygonList.prototype = new Table();
  PolygonList.prototype.constructor = PolygonList;

  /**
   * @classdesc A {@link List} structure for storing {@link Polygon} instances.
   *
   * Additional functions that work on NumberTable can be found in:
   * <ul>
   *  <li>Operators:   {@link PolygonListOperators}</li>
   *  <li>Encodings: {@link PolygonListEncodings}</li>
   * </ul>
   *
   *
   * @description Creates a new PolygonList.
   * @constructor
   * @category geometry
   */
  function PolygonList() {
    var array = Table.apply(this, arguments);
    array = PolygonList.fromArray(array);
    return array;
  }
  /**
   * @todo write docs
   */
  PolygonList.fromArray = function(array) {
    var result = Table.fromArray(array);
    result.type = "PolygonList";
    result.getFrame = PolygonList.prototype.getFrame;
    result.add = PolygonList.prototype.add;
    result.factor = PolygonList.prototype.factor;
    result.clone = PolygonList.prototype.clone;
    result.getString = PolygonList.prototype.getString;
    return result;
  };

  /**
   * @todo write docs
   */
  PolygonList.prototype.getFrame = function() {
    if(this.length === 0) return null;
    var frameP = this[0].getFrame();
    var rectangle = new Rectangle(frameP.x, frameP.y, frameP.getRight(), frameP.getBottom());
    for(var i = 1; this[i] != null; i++) {
      frameP = this[i].getFrame();
      rectangle.x = Math.min(rectangle.x, frameP.x);
      rectangle.y = Math.min(rectangle.y, frameP.y);
      rectangle.width = Math.max(rectangle.width, frameP.getRight());
      rectangle.height = Math.max(rectangle.height, frameP.getBottom());
    }
    rectangle.width -= rectangle.x;
    rectangle.height -= rectangle.y;

    return rectangle;
  };

  /**
   * @todo write docs
   */
  PolygonList.prototype.add = function(object) {
    var type = typeOf(object);
    var i;
    switch(type) {
      case 'Point':
        var newPolygonList = new PolygonList();
        for(i = 0; this[i] != null; i++) {
          newPolygonList[i] = this[i].add(object);
        }
        newPolygonList.name = this.name;
        return newPolygonList;
    }
  };

  /**
   * @todo write docs
   */
  PolygonList.prototype.factor = function(value) {
    var newPolygonList = new PolygonList();
    for(var i = 0; this[i] != null; i++) {
      newPolygonList[i] = this[i].factor(value);
    }
    newPolygonList.name = this.name;
    return newPolygonList;
  };

  /**
   * @todo write docs
   */
  PolygonList.prototype.clone = function() {
    var newPolygonList = new PolygonList();
    for(var i = 0; this[i] != null; i++) {
      newPolygonList[i] = this[i].clone();
    }
    newPolygonList.name = this.name;
    return newPolygonList;
  };

  // PolygonList.prototype.getString=function(pointSeparator,polygonSeparator){
  // pointSeparator = pointSeparator==null?',':pointSeparator;
  // polygonSeparator = polygonSeparator==null?'/':polygonSeparator;
  // var j;
  // var t='';
  // for(var i=0;this[i]!=null;i++){
  // t+=(i==0?'':polygonSeparator);
  // for(j=0; this[i][j]!=null; j++){
  // t+=(j==0?'':pointSeparator)+this[i][j].x+pointSeparator+this[i][j].y;
  // }
  // }
  // return t;
  // }

  /**
   * @classdesc Table Encodings
   *
   * @namespace
   * @category basics
   */
  function TableEncodings() {}
  TableEncodings.ENTER = String.fromCharCode(13);
  TableEncodings.ENTER2 = String.fromCharCode(10);
  TableEncodings.ENTER3 = String.fromCharCode(8232);

  TableEncodings.SPACE = String.fromCharCode(32);
  TableEncodings.SPACE2 = String.fromCharCode(160);

  TableEncodings.TAB = "	";
  TableEncodings.TAB2 = String.fromCharCode(9);


  /**
   * Decode a String in format CSV into a Table
   * @param {String} csv CSV formatted text
   *
   * @param {Boolean} first_row_header first row is header (default: false)
   * @param {String} separator separator character (default: ",")
   * @param {Object} value_for_nulls Object to be placed instead of null values
   * @param {Boolean} listsToStringList if true (default value), converts lists that are not StringLists, NumberLists… (probably because they contain strings and numbers) into StringLists
   * @return {Table} resulting Table
   * tags:decoder
   */
  TableEncodings.CSVtoTable = function(csvString, firstRowIsHeader, separator, valueForNulls, listsToStringList) {
    if(csvString==null) return null;
    valueForNulls = valueForNulls == null ? "" : valueForNulls;
    listsToStringList = listsToStringList==null?true:listsToStringList;

    var i, j;
    var _firstRowIsHeader = firstRowIsHeader == null ? false : firstRowIsHeader;

    if(csvString == null) return null;
    if(csvString === "") return new Table();

    csvString = csvString.replace(/\$/g, "");

    var blocks = csvString.split("\"");
    for(i = 1; blocks[i] != null; i += 2) {
      blocks[i] = blocks[i].replace(/\n/g, "*ENTER*");
    }
    csvString = blocks.join("\""); //TODO: create a general method for replacements inside "", apply it to chomas

    var enterChar = TableEncodings.ENTER2;
    var lines = csvString.split(enterChar);
    if(lines.length == 1) {
      enterChar = TableEncodings.ENTER;
      lines = csvString.split(enterChar);
      if(lines.length == 1) {
        enterChar = TableEncodings.ENTER3;
        lines = csvString.split(enterChar);
      }
    }

    var table = new Table();
    var comaCharacter = separator != undefined ? separator : ",";

    if(csvString == null || csvString === "" || csvString == " " || lines.length === 0) return null;

    var startIndex = 0;
    var headerContent;
    if(_firstRowIsHeader) {
      startIndex = 1;
      headerContent = lines[0].split(comaCharacter);
    }

    var element;
    var cellContent;
    var numberCandidate;
    for(i = startIndex; i < lines.length; i++) {
      if(lines[i].length < 2) continue;

      var cellContents = NetworkEncodings.replaceChomasInLine(lines[i], separator).split(comaCharacter); //TODO: will be obsolete (see previous TODO)

      for(j = 0; j < cellContents.length; j++) {
        table[j] = table[j] == null ? new List() : table[j];
        if(_firstRowIsHeader && i == 1) {
          table[j].name = ( headerContent[j] == null ? "" : TableEncodings._removeQuotes(headerContent[j]) ).trim();
        }
        var actualIndex = _firstRowIsHeader ? (i - 1) : i;

        cellContent = cellContents[j].replace(/\*CHOMA\*/g, separator).replace(/\*ENTER\*/g, "\n");

        cellContent = cellContent === '' ? valueForNulls : cellContent;

        cellContent = String(cellContent);

        numberCandidate = Number(cellContent.replace(',', '.'));

        element = (numberCandidate || (numberCandidate == 0 && cellContent !== '')) ? numberCandidate : cellContent;

        if(typeof element == 'string') element = TableEncodings._removeQuotes(element);

        table[j][actualIndex] = element;
      }
    }

    for(i = 0; table[i] != null; i++) {
      table[i] = table[i].getImproved();
      if(listsToStringList && table[i].type=="List") table[i] = ListConversions.toStringList(table[i]);
    }

    table = table.getImproved();

    return table;
  };

  /**
   * @ignore
   */
  TableEncodings._removeQuotes = function(string) {
    if(string.length === 0) return string;
    if((string.charAt(0) == "\"" || string.charAt(0) == "'") && (string.charAt(string.length - 1) == "\"" || string.charAt(string.length - 1) == "'")) string = string.substr(1, string.length - 2);
    return string;
  };


  /**
   * Encode a Table into a String in format CSV
   * @param {Table} Table to be enconded
   *
   * @param {String} separator character (default: ",")
   * @param {Boolean} first row as List names (default: false)
   * @return {String} resulting String in CSV format
   * tags:encoder
   */
  TableEncodings.TableToCSV = function(table, separator, namesAsHeaders) {
    separator = separator || ",";
    var i;
    var j;
    var list;
    var type;
    var lines = ListGenerators.createListWithSameElement(table[0].length, "");
    var addSeparator;
    for(i = 0; table[i] != null; i++) {
      list = table[i];
      type = list.type;
      addSeparator = i != table.length - 1;
      for(j = 0; list[j] != null; j++) {
        switch(type) {
          case 'NumberList':
            lines[j] += list[j];
            break;
          default:
            lines[j] += "\"" + list[j] + "\"";
            break;
        }
        if(addSeparator) lines[j] += separator;
      }
    }

    var headers = '';
    if(namesAsHeaders) {
      for(i = 0; table[i] != null; i++) {
        list = table[i];
        headers += "\"" + list.name + "\"";
        if(i != table.length - 1) headers += separator;
      }
      headers += '\n';
    }

    return headers + lines.getConcatenated("\n");
  };

  Matrix.prototype = new DataModel();
  Matrix.prototype.constructor = Matrix;


  //all Matrix objects and methods should be ported to NumberTable (same at MatrixGenerators.json)

  /**
   * @classdesc Matrix implementation.
   * Some credits to http://strd6.com/2010/06/introducing-matrix-js/
   *
   * @constructor
   * @description Creates a new Matrix instance.
   * @category numbers
   */
  function Matrix(a, b, c, d, tx, ty) {
    DataModel.apply(this, arguments);
    this.name = "";
    this.type = "Matrix";
    this.a = a == null ? 1 : a;
    this.b = b == null ? 0 : b;
    this.c = c == null ? 0 : c;
    this.d = d == null ? 1 : d;
    this.tx = tx == null ? 0 : tx;
    this.ty = ty == null ? 0 : ty;
  }
  /**
   * Returns the result of applying the geometric transformation represented by the
   * Matrix object to the specified point.
   * @methodOf Matrix#
   * @see #deltaTransformPoint
   *
   * @returns {Point} A new point with the transformation applied.
   */
  Matrix.prototype.transformPoint = function(point) {
    return new _Point(
      this.a * point.x + this.c * point.y + this.tx,
      this.b * point.x + this.d * point.y + this.ty
    );
  };


  /**
   * Returns the result of this matrix multiplied by another matrix
   * combining the geometric effects of the two. In mathematical terms,
   * concatenating two matrixes is the same as combining them using matrix multiplication.
   * If this matrix is A and the matrix passed in is B, the resulting matrix is A x B
   * http://mathworld.wolfram.com/MatrixMultiplication.html
   * @methodOf Matrix#
   *
   * @param {Matrix} matrix The matrix to multiply this matrix by.
   * @returns {Matrix} The result of the matrix multiplication, a new matrix.
   */
  Matrix.prototype.concat = function(matrix) {
    return Matrix(
      this.a * matrix.a + this.c * matrix.b,
      this.b * matrix.a + this.d * matrix.b,
      this.a * matrix.c + this.c * matrix.d,
      this.b * matrix.c + this.d * matrix.d,
      this.a * matrix.tx + this.c * matrix.ty + this.tx,
      this.b * matrix.tx + this.d * matrix.ty + this.ty
    );
  };

  /**
   * Given a point in the pretransform coordinate space, returns the coordinates of
   * that point after the transformation occurs. Unlike the standard transformation
   * applied using the transformPoint() method, the deltaTransformPoint() method's
   * transformation does not consider the translation parameters tx and ty.
   * @see #transformPoint
   *
   * @return {Point} A new point transformed by this matrix ignoring tx and ty.
   */
  Matrix.prototype.deltaTransformPoint = function(point) {
    return _Point(
      this.a * point.x + this.c * point.y,
      this.b * point.x + this.d * point.y
    );
  };

  /**
   * Returns the inverse of the matrix.
   * http://mathworld.wolfram.com/MatrixInverse.html
   *
   * @returns {Matrix} A new matrix that is the inverse of this matrix.
   */
  Matrix.prototype.getInverse = function() {
      var determinant = this.a * this.d - this.b * this.c;
      return new Matrix(
  		this.d / determinant,
  		-this.b / determinant,
  		-this.c / determinant,
  		this.a / determinant,
  		(this.c * this.ty - this.d * this.tx) / determinant,
  		(this.b * this.tx - this.a * this.ty) / determinant
      );
    };
    /**
     * Returns a new matrix that corresponds this matrix multiplied by a
     * a rotation matrix.
     * @see Matrix.rotation
     *
     * @param {Number} theta Amount to rotate in radians.
     * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
     * @returns {Matrix} A new matrix, rotated by the specified amount.
     */
  Matrix.prototype.rotate = function(theta, aboutPoint) {
    return this.concat(Matrix.rotation(theta, aboutPoint));
  };

  /**
   * Returns a new matrix that corresponds this matrix multiplied by a
   * a scaling matrix.
   * @see Matrix.scale
   *
   * @param {Number} sx
   * @param {Number} [sy]
   * @param {Point} [aboutPoint] The point that remains fixed during the scaling
   * @returns {Matrix}
   */
  Matrix.prototype.scale = function(sx, sy, aboutPoint) {
    return this.concat(Matrix.scale(sx, sy, aboutPoint));
  };


  /**
   * @methodOf Matrix#
   * @see Matrix.translation
   *
   * @param {Number} tx The translation along the x axis.
   * @param {Number} ty The translation along the y axis.
   * @returns {Matrix} A new matrix with the translation applied.
   */
  Matrix.prototype.translate = function(tx, ty) {
    return this.concat(Matrix.translation(tx, ty));
  };

  Axis2D.prototype = new DataModel();
  Axis2D.prototype.constructor = Axis2D;

  /**
   * @classdesc Axis for 2D data
   *
   * @constructor
   * @description Creates a new 2d axis.
   * @param  {Rectangle} departureFrame The Departure Frame
   * @param  {Rectangle} arrivalFrame   The Arrival Frame
   * @category numbers
   */
  function Axis2D(departureFrame, arrivalFrame) {
    arrivalFrame = arrivalFrame == null ? new Rectangle(0, 0, 1, 1) : arrivalFrame;
    DataModel.apply(this, arguments);
    this.departureFrame = departureFrame;
    this.arrivalFrame = arrivalFrame;

    this.pW = undefined;
    this.pH = undefined;

    this.setFrames(departureFrame, arrivalFrame);

    this.type = "Axis2D";
  }
  /**
   * Setup frames
   * @param  {Rectangle} departureFrame The Departure Frame
   * @param  {Rectangle} arrivalFrame   The Arrival Frame
   */
  Axis2D.prototype.setFrames = function(departureFrame, arrivalFrame) {
    this.departureFrame = departureFrame;
    this.arrivalFrame = arrivalFrame;
    this._update();
  };

  /**
   * Set departure frame
   * @param  {Object} departureFrame New Departure Frame.
   */
  Axis2D.prototype.setDepartureFrame = function(departureFrame) {
    this.departureFrame = departureFrame;
    this._update();
  };

  /**
   * Set arrival frame
   * @param  {Rectangle} arrivalFrame New arrival Frame.
   */
  Axis2D.prototype.setArrivalFrame = function(arrivalFrame) {
    this.arrivalFrame = arrivalFrame;
    this._update();
  };


  /**
   * Projects a given point from the arrival frame to the departure frame.
   * @param  {Point} point Point to project.
   * @return {Point} projected Point.
   */
  Axis2D.prototype.project = function(point) {
    return new _Point((point.x - this.departureFrame.x) * this.pW + this.arrivalFrame.x, (point.y - this.departureFrame.y) * this.pH + this.arrivalFrame.y);
  };


  /**
   * Projects a given X value from the arrival frame to the departure frame.
   * @param  {Number} x X value to project.
   * @return {Number} new X value.
   */
  Axis2D.prototype.projectX = function(x) {
    return(x - this.departureFrame.x) * this.pW + this.arrivalFrame.x;
  };

  /**
   * Projects a given y value from the arrival frame to the departure frame.
   * @param  {Number} y Y value to project.
   * @return {Number} new Y value.
   */
  Axis2D.prototype.projectY = function(y) {
    return(y - this.departureFrame.y) * this.pH + this.arrivalFrame.y;
  };

  /**
   * Projects a given Point from the departure frame to the arrival frame.
   * @param  {Point} point Point to project in the departure frame.
   * @return {Point} reverse projected Point in the arrival frame.
   */
  Axis2D.prototype.inverseProject = function(point) {
    return new _Point((point.x - this.arrivalFrame.x) / this.pW + this.departureFrame.x, (point.y - this.arrivalFrame.y) / this.pH + this.departureFrame.y);
  };


  /**
   * Projects a given X value from the departure frame to the arrival frame.
   * @param  {Number} x X value to project.
   * @return {Number} new X value.
   */
  Axis2D.prototype.inverseProjectX = function(x) {
    return(x - this.arrivalFrame.x) / this.pW + this.departureFrame.x;
  };

  /**
   * Projects a given Y value from the departure frame to the arrival frame.
   * @param  {Number} y Y value to project.
   * @return {Number} new Y value.
   */
  Axis2D.prototype.inverseProjectY = function(y) {
    return(y - this.arrivalFrame.y) / this.pH + this.departureFrame.y;
  };


  /**
  * @ignore
  */
  Axis2D.prototype._update = function() {
    this.pW = this.arrivalFrame.width / this.departureFrame.width;
    this.pH = this.arrivalFrame.height / this.departureFrame.height;
  };


  /**
   * Convert Axis to string
   * @return {String} String representation of axis.
   */
  Axis2D.prototype.toString = function() {
    return "Axis2D[" + this.departureFrame.toString() + ", " + this.arrivalFrame.toString() + "]";
  };

  Axis.prototype = new DataModel();
  Axis.prototype.constructor = Axis;


  //this object is deprecated

  /**
   * @ignore
   *
   * @classdesc Axis for 1D data.
   *
   * @constructor
   * @description Creates a new Axis.
   * @category numbers
   */
  function Axis(departureInterval, arrivalInterval) {
    //TODO why assign the incoming param, could this be moved to lines 20-21
    departureInterval = departureInterval == null ? new Interval(0, 1) : departureInterval;
    arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;

    DataModel.apply(this, arguments);
    this.departureInterval = departureInterval;
    this.arrivalInterval = arrivalInterval;

    this.setDepartureInterval(departureInterval);
    this.setArrivalInterval(arrivalInterval);

    this.type = "Axis";
  }
  /**
   * @todo write docs
   */
  Axis.prototype.setDepartureInterval = function(departureInterval) {
    this.departureInterval = departureInterval;
    console.log('--> departureInterval', departureInterval);
    this.departureAmplitude = departureInterval.getSignedAmplitude();

  };

  /**
   * @todo write docs
   */
  Axis.prototype.setArrivalInterval = function(arrivalInterval) {
    this.arrivalInterval = arrivalInterval;
    this.arrivalAmplitude = arrivalInterval.getSignedAmplitude();
  };

  /**
   * @todo write docs
   */
  Axis.prototype.project = function(x) {
    return this.arrivalInterval.x + this.arrivalAmplitude * (x - this.departureInterval.x) / this.departureAmplitude;
  };

  /*
   * to be called once interval values changed
   */
  /**
   * @todo write docs
   */
  Axis.prototype.update = function() {
    this.departureAmplitude = this.departureInterval.getSignedAmplitude();
    this.arrivalAmplitude = this.arrivalInterval.getSignedAmplitude();
  };

  /**
   * @todo write docs
   */
  Axis.prototype.toString = function() {
    return "Axis[" + this.departureInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
  };

  DateInterval.prototype = new DataModel();
  DateInterval.prototype.constructor = DateInterval;

  /**
   * @classdesc Date Interval
   *
   * @description Creates a new DateInterval.
   * @param {Date} Interval's minimum value.
   * @param {Date} Interval's maximum value.
   * @constructor
   * @category dates
   */
  function DateInterval(date0, date1) {
    DataModel.apply(this, arguments);
    this.date0 = date0;
    this.date1 = date1;
    this.type = "DateInterval";
  }
  /**
  * @todo write docs
  */
  DateInterval.prototype.toString = function() {
    return "DateInterval[" + this.date0 + ", " + this.date1 + "]";
  };

  /**
  * @todo write docs
  */
  DateInterval.prototype.getMax = function() {
    if(this.date1 > this.date0) return this.date1;
    return this.date0;
  };

  /**
  * @todo write docs
  */
  DateInterval.prototype.getMin = function() {
    if(this.date0 < this.date1) return this.date0;
    return this.date1;
  };

  /**
   * converts the dateInterval into an Interval (getting milliseconds time from each date)
   * @return {Interval}
   * tags:conversion
   */
  DateInterval.prototype.getTimesInterval = function() {
    return new Interval(this.date0.getTime(), this.date1.getTime());
  };

  /**
   * factors the dateInterval (specially useful: factor by an interval, in which case a sub-dateInterval is selected)
   * @param  {Object} object could be: interval
   * @return {DateInterval}
   * tags:
   */
  DateInterval.prototype.getProduct = function(object) { //TODO: complete with more object types
    if(object == null) return;

    if(object.type == 'Interval') {
      var time0 = this.date0.getTime();
      var time1 = this.date1.getTime();
      var amp = time1 - time0;

      return new DateInterval(new Date(time0 + object.x * amp), new Date(time0 + object.y * amp));
    }

    return null;
  };

  DateAxis.prototype = new DataModel();
  DateAxis.prototype.constructor = DateAxis;

  /**
   * @classdesc Date based {@link Axis}.
   *
   * @description Creates a new DateAxis.
   * @constructor
   * @category dates
   */
  function DateAxis(departureDateInterval, arrivalInterval) {
    arrivalInterval = arrivalInterval == null ? new Interval(0, 1) : arrivalInterval;
    DataModel.apply(this, arguments);
    this.departureDateInterval = departureDateInterval;
    this.arrivalInterval = arrivalInterval;

    this.time0 = undefined;
    this.time1 = undefined;
    this.dTime = undefined;
    this.arrivalAmplitude = undefined;

    this.setDepartureDateInterval(departureDateInterval);
    this.setArrivalInterval(arrivalInterval);

    this.type = "DateAxis";
  }
  /**
  * @todo write docs
  */
  DateAxis.prototype.setDepartureDateInterval = function(departureDateInterval) {
    this.departureDateInterval = departureDateInterval;
    this.time0 = this.departureDateInterval.date0.getTime();
    this.time1 = this.departureDateInterval.date1.getTime();
    this.dTime = this.time1 - this.time0;

  };

  /**
  * @todo write docs
  */
  DateAxis.prototype.setArrivalInterval = function(arrivalInterval) {
    this.arrivalInterval = arrivalInterval;
    this.arrivalAmplitude = arrivalInterval.getAmplitude();
  };

  /**
  * @todo write docs
  */
  DateAxis.prototype.project = function(date) {
    return this.arrivalInterval.x + this.arrivalAmplitude * (date.getTime() - this.time0) / this.dTime;
  };


  /**
  * to be called once intreval values changed
  * @todo write docs
  */
  DateAxis.prototype.update = function() {
    this.time0 = this.departureDateInterval.date0.getTime();
    this.time1 = this.departureDateInterval.date1.getTime();
    this.dTime = this.time1 - this.time0;
    this.arrivalAmplitude = this.arrivalInterval.getAmplitude();
  };


  /**
  * @todo write docs
  */
  DateAxis.prototype.toString = function() {
    return "DateAxis[" + this.departureDateInterval.toString() + ", " + this.arrivalInterval.toString() + "]";
  };

  Tree.prototype = new Network();
  Tree.prototype.constructor = Tree;

  /**
   * @classdesc Trees are Networks that have a hierarchical structure.
   *
   * @description Create a new Tree.
   * @constructor
   * @category networks
   */
  function Tree() {
    Network.apply(this);
    this.type = "Tree";

    this.nLevels = 0;
    this._createRelation = this.createRelation;
    this.createRelation = this._newCreateRelation;
  }
  /**
   * Adds a given Node to the tree, under the given parent Node.
   *
   * @param {Node} node
   * @param {Node} parent
   */
  Tree.prototype.addNodeToTree = function(node, parent) {
    this.addNode(node);
    if(parent == null) {
      node.level = 0;
      node.parent = null;
    } else {
      var relation = new Relation(parent.id + "_" + node.id, parent.id + "_" + node.id, parent, node);
      this.addRelation(relation);
      node.level = parent.level + 1;
      node.parent = parent;
    }
    this.nLevels = Math.max(this.nLevels, node.level + 1);
  };

  /**
   * @ignore
   */
  Network.prototype._newCreateRelation = function(parent, node, id, weight) {
    if(id == null) id = this.relationList.getNewId();
    this._createRelation(parent, node, id, weight);
    node.level = parent.level + 1;
    node.parent = parent;
    this.nLevels = Math.max(this.nLevels, node.level + 1);
  };

  /**
   * Adds a new parent node to the Tree.
   *
   * @param {Node} node New Parent Node.
   * @param {Node} child Node that will become the child.
   */
  Tree.prototype.addFather = function(node, child) {
    //TODO: is children supposed to be child?
    if(child.parent != null || this.nodeList.indexOf(child) == -1) return false;
    this.addNode(node);
    child.parent = node;
    child.level = 1;
    this.nLevels = Math.max(this.nLevels, 1);
    this.createRelation(node, child);
  };

  /**
   * Provides a {@link NodeList} of all the Nodes of the Tree at a given level.
   *
   * @param {Number} level Level (depth) of the Tree to extract Nodes at.
   * @return {NodeList} All Nodes at the given level of the tree.
   */
  Tree.prototype.getNodesByLevel = function(level) {
    var newNodeList = new NodeList();
    for(var i = 0; this.nodeList[i] != null; i++) {
      if(this.nodeList[i].level == level) newNodeList.addNode(this.nodeList[i]);
    }
    return newNodeList;
  };

  /**
   * Returns the leaves (nodes without children) of a tree.
   *
   * @param {Node} node Optional parent Node to start the leaf search from.
   * If no Node is provided, all leaf Nodes are returned.
   * @return {NodeList} Leaves of the Tree or sub-tree.
   * tags:
   */
  Tree.prototype.getLeaves = function(node) {
    var leaves = new NodeList();
    if(node) {
      if(node.toNodeList.length === 0) {
        leaves.addNode(node);
        return leaves;
      }
      var addLeaves = function(candidate) {
        if(candidate.toNodeList.length === 0) {
          leaves.addNode(candidate);
        } else {
          candidate.toNodeList.forEach(addLeaves);
        }
      };
      node.toNodeList.forEach(addLeaves);
    } else {
      this.nodeList.forEach(function(candidate) {
        if(candidate.toNodeList.length === 0) leaves.addNode(candidate);
      });
    }
    return leaves;
  };

  /**
   * assignDescentWeightsToNodes
   *
   * @return {undefined}
   */
  Tree.prototype.assignDescentWeightsToNodes = function() {
    this._assignDescentWeightsToNode(this.nodeList[0]);
  };

  /**
   * @ignore
   */
  Tree.prototype._assignDescentWeightsToNode = function(node) {
    var i;
    if(node.toNodeList.length === 0) {
      node.descentWeight = 1;
      return 1;
    }
    for(i = 0; node.toNodeList[i] != null; i++) {
      node.descentWeight += this._assignDescentWeightsToNode(node.toNodeList[i]);
    }
    return node.descentWeight;
  };

  /**
   * Returns a string indicating the size of the Tree.
   *
   * @return {String} Log message indicating Tree's size.
   */
  Tree.prototype.getReport = function() {// @todo to be placed in TreeOperators
    //TODO: remove relation input?
    return "Tree contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
  };

  /**
   * @classdesc Provides a set of tools that work with {@link Point|Points}.
   *
   * @namespace
   * @category geometry
   */
  function PointOperators() {}
  /**
   * @todo write docs
   */
  PointOperators.angleBetweenVectors = function(point0, point1) {
    return Math.atan2(point1.y, point1.x) - Math.atan2(point0.y, point0.x);
  };

  /**
   * @todo write docs
   */
  PointOperators.angleFromTwoPoints = function(point0, point1) {
    return Math.atan2(point1.y - point0.y, point1.x - point0.x);
  };

  /**
   * @todo write docs
   */
  PointOperators.dot = function(point0, point1) {
    return point0.x * point1.x + point0.y * point1.y;
  };

  /**
   * @todo write docs
   */
  PointOperators.twoPointsInterpolation = function(point0, point1, t) {
    return new _Point((1 - t) * point0.x + t * point1.x, (1 - t) * point0.y + t * point1.y);
  };

  Point3D.prototype = new _Point();
  Point3D.prototype.constructor = Point3D;
  /**
   * @classdesc Point3D represents a point in 3D space.
   *
   * @description Create a new 3D Point.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} z
   * @constructor
   * @category geometry
   */
  function Point3D(x, y, z) {
    _Point.apply(this, arguments);
    //this.name='';
    this.type = "Point3D";
    this.z = z;
  }
  /**
  * @todo write docs
  */
  Point3D.prototype.distanceToPoint3D = function(point3D) {
    return Math.sqrt(Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2));
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.distanceToPointSquared = function(point3D) {
    return Math.pow(Math.abs(this.x - point3D.x), 2) + Math.pow(Math.abs(this.y - point3D.y), 2) + Math.pow(Math.abs(this.z - point3D.z), 2);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.getNorm = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.normalizeToValue = function(k) {
    var factor = k / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    return new Point3D(this.x * factor, this.y * factor, this.z * factor);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.cross = function(point3D) {
    var _x = this.y * point3D.z - this.z * point3D.y;
    var _y = this.z * point3D.x - this.x * point3D.z;
    var _z = this.x * point3D.y - this.y * point3D.x;
    return new Point3D(_x, _y, _z);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.dot = function(point3D) {
    return this.x * point3D.x + this.y * point3D.y + this.z * point3D.z;
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.add = function(point) {
    return new Point3D(point.x + this.x, point.y + this.y, point.z + this.z);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.subtract = function(point) {
    return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.factor = function(k) {
    return new Point3D(this.x * k, this.y * k, this.z * k);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.interpolate = function(point3D, t) {
    return new Point3D((1 - t) * this.x + t * point3D.x, (1 - t) * this.y + t * point3D.y, (1 - t) * this.z + t * point3D.z);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.getAngles = function() {
    var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    var alfa = 0.5 * Math.PI - Math.atan2(this.z / radius, this.y / radius);
    var beta = -Math.asin(this.x / radius);
    if(alfa < -Math.PI) alfa += 2 * Math.PI;
    if(alfa > Math.PI) alfa -= 2 * Math.PI;
    if(beta < -Math.PI) beta += 2 * Math.PI;
    if(beta > Math.PI) beta -= 2 * Math.PI;
    return new Point3D(alfa, beta, 0);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.getInverseAngles = function() {
    var radius = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    var alfa = -0.5 * Math.PI + Math.atan2(-this.z / radius, -this.y / radius);
    var beta = Math.asin(-this.x / radius);
    if(alfa < -Math.PI) alfa += 2 * Math.PI;
    if(alfa > Math.PI) alfa -= 2 * Math.PI;
    if(beta < -Math.PI) beta += 2 * Math.PI;
    if(beta > Math.PI) beta -= 2 * Math.PI;
    return new Point3D(alfa, beta, 0);
  };


  /**
  * @todo write docs
  */
  Point3D.prototype.clone = function() {
    return new Point3D(this.x, this.y, this.z);
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ", z=" + this.z + ")";
  };

  /**
  * @todo write docs
  */
  Point3D.prototype.destroy = function() {
    delete this.type;
    delete this.name;
    delete this.x;
    delete this.y;
    delete this.z;
  };

  /**
   * @classdesc Provides a set of tools that work with Geometric data.
   *
   * @namespace
   * @category geometry
   */
  function GeometryOperators() {}
  /**
   * from three Points calculates two control Points for the middle Point that will define a curve (using Bézier) that goes softly through the three points
   * TODO: finish method by taking into account distances
   */
  GeometryOperators.getSoftenControlPoints = function(point0, point1, point2, controlVectorSize) {
    controlVectorSize = controlVectorSize || 10;
    var angle = PointOperators.angleFromTwoPoints(point0, point2);
    var controlPoint0 = new _Point(point1.x - controlVectorSize * Math.cos(angle), point1.y - controlVectorSize * Math.sin(angle));
    var controlPoint1 = new _Point(point1.x + controlVectorSize * Math.cos(angle), point1.y + controlVectorSize * Math.sin(angle));
    return [controlPoint0, controlPoint1];
  };

  /**
   * @todo write docs
   */
  GeometryOperators.bezierCurvePoints = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t) {
    var s = 1 - t;
    var ax = s * x0 + t * c0x;
    var ay = s * y0 + t * c0y;

    var bx = s * c0x + t * c1x;
    var by = s * c0y + t * c1y;

    var cx = s * c1x + t * x1;
    var cy = s * c1y + t * y1;

    var ex = s * ax + t * bx;
    var ey = s * ay + t * by;

    var fx = s * bx + t * cx;
    var fy = s * by + t * cy;

    return new _Point(t * fx + s * ex, t * fy + s * ey);
  };



  /**
   * @todo write docs
   */
  GeometryOperators.trueBezierCurveHeightHorizontalControlPoints = function(x0, x1, y0, y1, c0x, c1x, x) {
    var dx = x1 - x0;
    x = (x - x0) / dx;
    c0x = (c0x - x0) / dx;
    c1x = (c1x - x0) / dx;

    if(GeometryOperators._bezierSimpleCurveTable == null) {
      var i, p;

      GeometryOperators._bezierSimpleCurveTable = new NumberList();

      for(i = 1; i < 10000; i++) {
        p = GeometryOperators.bezierCurvePoints(0, 0, c0x, 0, c1x, 1, 1, 1, i / 10000);
        GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * p.x)] = p.y;
      }

      GeometryOperators._bezierSimpleCurveTable[0] = 0;
      GeometryOperators._bezierSimpleCurveTable[1] = 1;
    }

    return GeometryOperators._bezierSimpleCurveTable[Math.floor(1000 * x)] * (y1 - y0) + y0;

  };


  /**
   * @todo write docs
   * This an approximation, it doesn't take into account actual values of c0x and c1x
   */
  GeometryOperators.bezierCurveHeightHorizontalControlPoints = function(y0, c0x, c1x, y1, t) { //TODO:fix

    var cosinus = Math.cos(Math.PI * (t - 1));
    var sign = cosinus > 0 ? 1 : -1;

    return(0.5 + 0.5 * (Math.pow(cosinus * sign, 0.6) * sign)) * (y1 - y0) + y0;
  };

  /**
   * unefficient method (uses Newton strategy)
   */
  GeometryOperators.distanceToBezierCurve = function(x0, y0, c0x, c0y, c1x, c1y, x1, y1, p, returnPoint) {
    var minDT = 0.01;
    var t0 = 0;
    var t1 = 1;
    var p0 = new _Point(x0, y0);
    var p0I = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, minDT);
    var p1 = new _Point(x1, y1);
    var d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
    var d0I = Math.pow(p0I.x - p.x, 2) + Math.pow(p0I.y - p.y, 2);
    var d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);

    var i;

    var pM;
    var pMI;

    for(i = 0; i < 10; i++) {
      pM = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5);
      pMI = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, (t0 + t1) * 0.5 + minDT);

      d0 = Math.pow(pM.x - p.x, 2) + Math.pow(pM.y - p.y, 2);
      d0I = Math.pow(pMI.x - p.x, 2) + Math.pow(pMI.y - p.y, 2);

      if(d0 < d0I) {
        t1 = (t0 + t1) * 0.5;
        p1 = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t1);
        d1 = Math.pow(p1.x - p.x, 2) + Math.pow(p1.y - p.y, 2);
      } else {
        t0 = (t0 + t1) * 0.5;
        p0 = GeometryOperators.bezierCurvePoints(x0, y0, c0x, c0y, c1x, c1y, x1, y1, t0);
        d0 = Math.pow(p0.x - p.x, 2) + Math.pow(p0.y - p.y, 2);
      }
    }

    if(returnPoint) return p1;
    return Math.sqrt(Math.min(d0, d1));
  };

  /**
   * @todo write docs
   */
  GeometryOperators.triangleContainsPoint = function(pT0, pT1, pT2, p) {
    var a = (pT0.x - p.x) * (pT1.y - p.y) - (pT1.x - p.x) * (pT0.y - p.y);
    var b = (pT1.x - p.x) * (pT2.y - p.y) - (pT2.x - p.x) * (pT1.y - p.y);
    var c = (pT2.x - p.x) * (pT0.y - p.y) - (pT0.x - p.x) * (pT2.y - p.y);
    return(a > 0 && b > 0 && c > 0) || (a >= 0 && b >= 0 && c >= 0);
  };

  /**
   * @todo write docs
   */
  GeometryOperators.triangleArea = function(triangle) {
    return Math.abs(triangle.a.x * (triangle.b.y - triangle.c.y) + triangle.b.x * (triangle.c.y - triangle.a.y) + triangle.c.x * (triangle.a.y - triangle.b.y)) / 2;
  };


  /////////////lines (line is a Point with values m and b in y=mx+b)

  /**
   * @todo write docs
   */
  GeometryOperators.lineFromTwoPoints = function(point0, point1) {
    if(point0.x == point1.x) return new _Point(Infinity, point0.x);
    var m = (point1.y - point0.y) / (point1.x - point0.x);
    return new _Point(m, point0.y - m * point0.x);
  };

  /**
   * @todo write docs
   */
  GeometryOperators.distancePointToLine = function(point, line) {
    var m2;
    var b2;
    if(line.x === 0) {
      m2 = Infinity;
      b2 = point.x;
    } else {
      m2 = -1 / line.x;
      b2 = point.y - m2 * point.x;
    }
    var interPoint = GeometryOperators.intersectionLines(line, new _Point(m2, b2));
    return Math.sqrt(Math.pow(point.x - interPoint.x, 2) + Math.pow(point.y - interPoint.y, 2));
  };

  /**
   * @todo write docs
   */
  GeometryOperators.distancePointToSegment = function(point, point0Segment, point1Segment) {
    var m = point0Segment.x == point1Segment.x ? Infinity : (point1Segment.y - point0Segment.y) / (point1Segment.x - point0Segment.x);
    var line = m == Infinity ? new _Point(Infinity, point0Segment.x) : new _Point(m, point0Segment.y - m * point0Segment.x);
    var m2;
    var b2;
    if(line.x === 0) {
      m2 = Infinity;
      b2 = point.x;
    } else {
      m2 = -1 / line.x;
      b2 = point.y - m2 * point.x;
    }
    var interPoint = GeometryOperators.intersectionLines(line, new _Point(m2, b2));
    if(interPoint.x >= Math.min(point0Segment.x, point1Segment.x) && interPoint.x <= Math.max(point0Segment.x, point1Segment.x)) return point.distanceToPoint(interPoint);
    return Math.min(point.distanceToPoint(point0Segment), point.distanceToPoint(point1Segment));
  };

  /**
   * @todo write docs
   */
  GeometryOperators.intersectionLines = function(line0, line1) {
    if(line0.x == line1.x) {
      if(line0.y == line1.y) {
        if(line0.x == Infinity) {
          return new _Point(line0.y, 0);
        } else {
          return new _Point(0, line0.y);
        }
      }
      return null;
    }
    if(line0.x == Infinity) {
      return new _Point(line0.y, line1.x * line0.y + line1.y);
    } else if(line1.x == Infinity) {
      return new _Point(line1.y, line0.x * line1.y + line0.y);
    }

    var xx = (line1.y - line0.y) / (line0.x - line1.x);
    return new _Point(xx, line0.x * xx + line0.y);
  };


  /**
   * @todo write docs
   */
  GeometryOperators.VennCircles = function(area0, area1, areaIntersection, centerInLens, precision) {
    var rA = Math.sqrt(area0 / Math.PI);
    var rB = Math.sqrt(area1 / Math.PI);
    var d = GeometryOperators.circleDistancesFromCommonArea(rA, rB, areaIntersection, precision);

    var circle0;
    var circle1;

    if(centerInLens) {
      var x0 = (d * d + Math.pow(rA, 2) - Math.pow(rB, 2)) / (2 * d);

      circle0 = new Point3D(-x0, 0, rA);
      circle1 = new Point3D(d - x0, 0, rB);

    } else {
      circle0 = new Point3D(-d * 0.5, 0, rA);
      circle1 = new Point3D(d * 0.5, 0, rB);
    }

    if(areaIntersection === 0) {
      circle0.x -= d * 0.1;
      circle1.x += d * 0.1;
    }

    return new Polygon3D(circle0, circle1);
  };

  /**
   * very lazy and ineficcient solution (Newton algorithm)
   * @param r0
   * @param r1
   * @param areaComun
   * @param precision
   *
   */
  GeometryOperators.circleDistancesFromCommonArea = function(r0, r1, commonArea, precision) {
    precision = precision || 0.1;
    var d0 = Math.max(r0, r1) - Math.min(r0, r1);
    var d1 = r0 + r1;
    var dM = (d0 + d1) * 0.5;

    var attempts = 0;

    var currentArea = GeometryOperators.circlesCommonArea(r0, r1, dM);

    while(Math.abs(currentArea - commonArea) > precision && attempts < 200) {
      if(currentArea > commonArea) {
        d0 = dM;
        dM = (d1 + dM) * 0.5;
      } else {
        d1 = dM;
        dM = (dM + d0) * 0.5;
      }
      attempts++;
      currentArea = GeometryOperators.circlesCommonArea(r0, r1, dM);
    }
    return dM;
  };

  /**
   * @todo write docs
   */
  GeometryOperators.circlesCommonArea = function(ra, rb, d) {
    if(d >= (ra + rb)) return 0;
    if(d + Math.min(ra, rb) <= Math.max(ra, rb)) {
      return Math.PI * Math.pow(Math.min(ra, rb), 2);
    }

    var d2 = Math.pow(d, 2);
    var ra2 = Math.pow(ra, 2);
    var rb2 = Math.pow(rb, 2);

    return ra2 * Math.acos((d2 + ra2 - rb2) / (2 * d * ra)) + rb2 * Math.acos((d2 + rb2 - ra2) / (2 * d * rb)) - 0.5 * Math.sqrt((-d + ra + rb) * (d + ra - rb) * (d - ra + rb) * (d + ra + rb));
  };

  /**
   * This method return the angles required to draw the intersection shape (lens) of two circles
   */
  GeometryOperators.circlesLensAngles = function(circle0, circle1) {
    if(circle1.x < circle0.x) {
      var _circle = circle1.clone();
      circle1 = circle0.clone();
      circle0 = _circle;
    }
    if(circle1.x + circle1.z <= circle0.x + circle0.z) {
      return null;
    } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
      return null;
    }

    var d = circle1.x - circle0.x;
    var x0 = (d * d + Math.pow(circle0.z, 2) - Math.pow(circle1.z, 2)) / (2 * d);
    var alfa = Math.acos(x0 / circle0.z);
    var h = circle0.z * Math.sin(alfa);
    var beta = Math.asin(h / circle1.z);

    if(circle0.x + x0 < circle1.x) {
      return new NumberList(-alfa, alfa, Math.PI - beta, Math.PI + beta);
    } else {
      return new NumberList(-alfa, alfa, beta, -beta);
    }
  };




  //////Delauney

  /**
   * @todo write docs
   */
  GeometryOperators.delauney = function(polygon) { /// ---> move to Polygon operators, chnge name to getDelauneyTriangulation
    return _triangulate(polygon);
  };


  /**
   * @ignore
   */
  function Triangle(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;

    var A = b.x - a.x,
      B = b.y - a.y,
      C = c.x - a.x,
      D = c.y - a.y,
      E = A * (a.x + b.x) + B * (a.y + b.y),
      F = C * (a.x + c.x) + D * (a.y + c.y),
      G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
      minx, miny, dx, dy;

    /* If the points of the triangle are collinear, then just find the
     * extremes and use the midpoint as the center of the circumcircle. */
    if(Math.abs(G) < 0.000001) {
      minx = Math.min(a.x, b.x, c.x);
      miny = Math.min(a.y, b.y, c.y);
      dx = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
      dy = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

      this.x = minx + dx;
      this.y = miny + dy;
      this.r = dx * dx + dy * dy;
    }

    else {
      this.x = (D * E - B * F) / G;
      this.y = (A * F - C * E) / G;
      dx = this.x - a.x;
      dy = this.y - a.y;
      this.r = dx * dx + dy * dy;
    }
  }


  /**
   * @ignore
   */
  function byX(a, b) {
    return b.x - a.x;
  }

  /**
   * @ignore
   */
  function dedup(edges) {
    var j = edges.length,
      a, b, i, m, n;

    outer: while(j) {
      b = edges[--j];
      a = edges[--j];
      i = j;
      while(i) {
        n = edges[--i];
        m = edges[--i];
        if((a === m && b === n) || (a === n && b === m)) {
          edges.splice(j, 2);
          edges.splice(i, 2);
          j -= 2;
          continue outer;
        }
      }
    }
  }

  /**
   * @ignore
   */
  function _triangulate(vertices) {
    /* Bail if there aren't enough vertices to form any triangles. */
    if(vertices.length < 3)
      return [];

    /* Ensure the vertex array is in order of descending X coordinate
     * (which is needed to ensure a subquadratic runtime), and then find
     * the bounding box around the points. */
    vertices.sort(byX);

    var i = vertices.length - 1,
      xmin = vertices[i].x,
      xmax = vertices[0].x,
      ymin = vertices[i].y,
      ymax = ymin;

    while(i--) {
      if(vertices[i].y < ymin) ymin = vertices[i].y;
      if(vertices[i].y > ymax) ymax = vertices[i].y;
    }

    /* Find a supertriangle, which is a triangle that surrounds all the
     * vertices. This is used like something of a sentinel value to remove
     * cases in the main algorithm, and is removed before we return any
     * results.
     *
     * Once found, put it in the "open" list. (The "open" list is for
     * triangles who may still need to be considered; the "closed" list is
     * for triangles which do not.) */
    var dx = xmax - xmin,
      dy = ymax - ymin,
      dmax = (dx > dy) ? dx : dy,
      xmid = (xmax + xmin) * 0.5,
      ymid = (ymax + ymin) * 0.5,
      open = [
        new Triangle(
            {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
            {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
            {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
          )
      ],
      closed = [],
      edges = [],
      j, a, b;

    /* Incrementally add each vertex to the mesh. */
    i = vertices.length;
    while(i--) {
      /* For each open triangle, check to see if the current point is
       * inside it's circumcircle. If it is, remove the triangle and add
       * it's edges to an edge list. */
      edges.length = 0;
      j = open.length;
      while(j--) {
        /* If this point is to the right of this triangle's circumcircle,
         * then this triangle should never get checked again. Remove it
         * from the open list, add it to the closed list, and skip. */
        dx = vertices[i].x - open[j].x;
        if(dx > 0 && dx * dx > open[j].r) {
          closed.push(open[j]);
          open.splice(j, 1);
          continue;
        }

        /* If not, skip this triangle. */
        dy = vertices[i].y - open[j].y;
        if(dx * dx + dy * dy > open[j].r)
          continue;

        /* Remove the triangle and add it's edges to the edge list. */
        edges.push(
          open[j].a, open[j].b,
          open[j].b, open[j].c,
          open[j].c, open[j].a
        );
        open.splice(j, 1);
      }

      /* Remove any doubled edges. */
      dedup(edges);

      /* Add a new triangle for each edge. */
      j = edges.length;
      while(j) {
        b = edges[--j];
        a = edges[--j];
        open.push(new Triangle(a, b, vertices[i]));
      }
    }

    /* Copy any remaining open triangles to the closed list, and then
     * remove any triangles that share a vertex with the supertriangle. */
    Array.prototype.push.apply(closed, open);

    i = closed.length;
    while(i--)
      if(closed[i].a.__sentinel ||
        closed[i].b.__sentinel ||
        closed[i].c.__sentinel)
        closed.splice(i, 1);

      /* Yay, we're done! */
    return closed;
  }

  /**
   * @classdesc Provides a set of tools that work with Polygons
   *
   * @namespace
   * @category geometry
   */
  function PolygonOperators() {}
  /**
   * builds a Hull polygon from a set of points
   * @param  {Polygon} polygon set of points
   * @param  {Boolean} returnIndexes if true returns the indexes of external points, connected by the Hull polygon (false by default)
   * @return {List} Hull polygn or list of indexes
   * tags:geometry
   */
  PolygonOperators.hull = function(polygon, returnIndexes) {
    returnIndexes = returnIndexes == null ? false : returnIndexes;
    var i;
    var t;
    var p = polygon;
    var n = p.length;
    var k = 0;
    var h = new _Polygon();
    var indexes;
    if(returnIndexes){
      indexes = new NumberList();
    }

    p = PolygonOperators.sortOnXY(p);

    if(returnIndexes) {
      for(i = 0; i < n; i++) {
        while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
          k--;
        h[k++] = p[i];
        indexes[k - 1] = i;
      }

      for(i = n - 2, t = k + 1; i >= 0; i--) {
        while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
          k--;
        h[k++] = p[i];
        indexes[k - 1] = i;
      }

      return NumberList.fromArray(indexes.getSubList(new Interval(0, k - 2)));
    }

    for(i = 0; i < n; i++) {
      while(k >= 2 && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
        k--;
      h[k++] = p[i];
    }

    for(i = n - 2, t = k + 1; i >= 0; i--) {
      while(k >= t && PolygonOperators.crossProduct3Points(h[k - 2], h[k - 1], p[i]) <= 0)
        k--;
      h[k++] = p[i];
    }

    return _Polygon.fromArray(h.getSubList(new Interval(0, k - 2)));
  };

  /**
   * builds a dendrogram (tree) from a Polygon (currently using barycenter for distances)
   * @param  {Polygon} polygon
   * @return {Tree} dendrogram
   * tags:geometry
   */
  PolygonOperators.buildDendrogramFromPolygon = function(polygon) {
    var tree = new Tree();
    var node;
    var tW;
    var parent;
    var leaves = new NodeList();

    var node0, node1, nodeList = new _Polygon();

    polygon.forEach(function(point, i) {
      node = new _Node('point_' + i, 'point_' + i);
      node.weight = 1;
      node.barycenter = point;
      node.point = point;
      node.polygon = new _Polygon(point);
      tree.addNode(node);
      nodeList.push(node);
      leaves.push(node);
    });

    tree.nodeList = tree.nodeList.getReversed();

    //c.l('-');

    var buildNodeFromPair = function(node0, node1) {
      var parent = new _Node("(" + node0.id + "," + node1.id + ")", "(" + node0.id + "," + node1.id + ")");
      parent.polygon = node0.polygon.concat(node1.polygon);
      //c.l("node0.polygon.length, node1.polygon.length, parent.polygon.length", node0.polygon.length, node1.polygon.length, parent.polygon.length);
      parent.weight = parent.polygon.length;
      tW = node0.weight + node1.weight;
      parent.barycenter = new _Point((node0.weight * node0.barycenter.x + node1.weight * node1.barycenter.x) / tW, (node0.weight * node0.barycenter.y + node1.weight * node1.barycenter.y) / tW);
      //c.l('parent.barycenter.x', parent.barycenter.x, parent.barycenter.y);
      tree.addNode(parent);
      tree._newCreateRelation(parent, node0);
      tree._newCreateRelation(parent, node1);
      return parent;
    };

    var closestPair;
    while(nodeList.length > 1) {
      closestPair = PolygonOperators._findClosestNodes(nodeList);
      node0 = nodeList[closestPair[0]];
      node1 = nodeList[closestPair[1]];
      parent = buildNodeFromPair(node0, node1);
      parent.distance = closestPair.distance;
      console.log('distance:', parent.distance);
      nodeList.splice(closestPair[0], 1);
      nodeList.splice(closestPair[1] - 1, 1);
      nodeList.push(parent);
    }

    tree.nodeList = tree.nodeList.getReversed();

    var assignLevel = function(node, parentLevel) {
      node.level = parentLevel + 1;
      node.toNodeList.forEach(function(son) {
        assignLevel(son, node.level);
      });
    };

    assignLevel(tree.nodeList[0], -1);

    tree.leaves = leaves;

    return tree;

  };

  /**
   * @todo write docs
   */
  PolygonOperators._findClosestNodes = function(nodeList) {
    var i, j;
    var d2;
    var d2Min = 9999999999;
    var pair;

    for(i = 0; nodeList[i + 1] != null; i++) {
      for(j = i + 1; nodeList[j] != null; j++) {
        d2 = Math.pow(nodeList[i].barycenter.x - nodeList[j].barycenter.x, 2) + Math.pow(nodeList[i].barycenter.y - nodeList[j].barycenter.y, 2);
        if(d2 < d2Min) {
          d2Min = d2;
          pair = [i, j];
        }
      }
    }

    pair.distance = d2Min;

    return pair;
  };


  /**
   * @todo write docs
   */
  PolygonOperators.sortOnXY = function(polygon) {
    return polygon.sort(function(p0, p1) {
      if(p0.x < p1.x) return -1;
      if(p0.x == p1.x && p0.y < p1.y) return -1;
      return 1;
    });
  };

  //TODO: move this to PointOperators
  /**
   * @todo write docs
   */
  PolygonOperators.crossProduct3Points = function(o, a, b) {
    return(a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  };

  /**
   * @todo write docs
   */
  PolygonOperators.expandFromBarycenter = function(polygon, factor) {
    var newPolygon = new _Polygon();
    var barycenter = polygon.getBarycenter();

    for(var i = 0; polygon[i] != null; i++) {
      newPolygon[i] = polygon[i].expandFromPoint(barycenter, factor);
    }

    return newPolygon;
  };

  /**
   * @todo write docs
   */
  PolygonOperators.expandInAngles = function(polygon, amount) { //TODO: test if it works with convex polygons
    var newPolygon = new _Polygon();
    var p0 = polygon[polygon.length - 1];
    var p1 = polygon[0];
    var p2 = polygon[1];

    var a0;
    var a1;
    var sign;

    var a = 0.5 * Math.atan2(p1.y - p2.y, p1.x - p2.x) + 0.5 * Math.atan2(p1.y - p0.y, p1.x - p0.x);
    var globalSign = polygon.containsPoint(new _Point(p1.x + Math.floor(amount) * Math.cos(a), p1.y + Math.floor(amount) * Math.sin(a))) ? -1 : 1;


    for(var i = 0; polygon[i] != null; i++) {
      p0 = polygon[(i - 1 + polygon.length) % polygon.length];
      p1 = polygon[i];
      p2 = polygon[(i + 1) % polygon.length];
      a0 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
      a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
      sign = Math.abs(a1 - a0) < Math.PI ? -1 : 1;
      a = 0.5 * a0 + 0.5 * a1;
      //sign = polygon.containsPoint(new Point(p1.x + Math.floor(amount)*Math.cos(a), p1.y + Math.floor(amount)*Math.sin(a)))?-1:1;
      newPolygon[i] = new _Point(p1.x + globalSign * sign * amount * Math.cos(a), p1.y + globalSign * sign * amount * Math.sin(a));
    }

    return newPolygon;
  };

  /**
   * @todo write docs
   */
  PolygonOperators.simplifyPolygon = function(polygon, margin) {
    margin = margin == null || margin === 0 || margin === undefined ? 1 : margin;
    var newPolygon = polygon.clone();
    var p0;
    var p1;
    var p2;
    var line;
    var i;
    var nPoints = polygon.length;
    for(i = 0; i < nPoints; i++) {
      p0 = newPolygon[i];
      p1 = newPolygon[(i + 1) % nPoints];
      p2 = newPolygon[(i + 2) % nPoints];
      line = GeometryOperators.lineFromTwoPoints(p0, p2);
      if(GeometryOperators.distancePointToLine(p1, line) < margin) {
        //newPolygon.splice((i+1)%nPoints, 1);
        newPolygon = newPolygon.getWithoutElementAtIndex((i + 1) % nPoints);
        i--;
      }
      nPoints = newPolygon.length;
    }
    return newPolygon;
  };


  /*
   * used techinique: draws the bézier polygon and checks color
   */
  /**
   * @todo write docs
   */
  PolygonOperators.bezierPolygonContainsPoint = function(polygon, point, border, graphics) {
    var frame = polygon.getFrame();
    graphics.clearContext();
    graphics.context.fillStyle = 'black';
    graphics.context.fillRect(0, 0, frame.width, frame.height);
    if(border != null) {
      graphics.context.strokeStyle = 'black';
      graphics.context.lineWidth = border;
    }
    graphics.context.fillStyle = 'white';
    graphics.context.beginPath();
    graphics.drawBezierPolygon(polygon, -frame.x, -frame.y);
    graphics.context.fill();
    if(border != null) graphics.context.stroke();
    var data = graphics.context.getImageData(point.x - frame.x, point.y - frame.y, 1, 1).data;
    graphics.clearContext();
    return data[0] > 0;
  };


  /*
   * used techinique: draws the bézier polygon and checks color
   * best center: the center of biggest circle within the polygon
   * [!] very unefficient
   */
  /**
   * @todo write docs
   */
  PolygonOperators.getBezierPolygonBestCenter = function(polygon, nAttempts, graphics) {
    nAttempts = nAttempts == null ? 500 : nAttempts;

    var frame = polygon.getFrame();
    graphics.context.fillStyle = 'black';
    graphics.context.fillRect(0, 0, frame.width, frame.height);
    graphics.context.fillStyle = 'white';
    graphics.context.beginPath();
    graphics.drawBezierPolygon(polygon, -frame.x, -frame.y);
    graphics.context.fill();

    var center;
    var angle;
    var r;
    var rMax = 0;
    var bestCenter;


    for(var i = 0; i < nAttempts; i++) {
      center = frame.getRandomPoint();
      for(angle = 0; angle <= TwoPi; angle += 0.1) {
        r = angle;
        var data = graphics.context.getImageData(center.x + r * Math.cos(angle) - frame.x, center.y + r * Math.sin(angle) - frame.y, 1, 1).data;
        if(data[0] === 0) {
          if(r > rMax) {
            rMax = r;
            bestCenter = center;
          }
          break;
        }
      }
    }

    return bestCenter;
  };


  /**
   * @todo write docs
   */
  PolygonOperators.convexHull = function(polygon, deepness) {
    var indexesHull = this.hull(polygon, true);
    var pointsLeftIndexes = NumberListGenerators.createSortedNumberList(polygon.length);
    pointsLeftIndexes = pointsLeftIndexes.getWithoutElementsAtIndexes(indexesHull);
    var j;
    var k;
    var p0;
    var p1;
    var pC = new _Point();
    var p;
    var d;
    var dMin = deepness - 1;
    var jMin;
    var kMin;
    var dP;
    var nHull = indexesHull.length;

    while(dMin < deepness) {
      //c.log(dMin, deepness, nHull, pointsLeftIndexes.length);
      dMin = 999999999;
      for(j = 0; j < nHull; j++) {
        p0 = polygon[indexesHull[j]];
        p1 = polygon[indexesHull[(j + 1) % indexesHull.length]];
        pC.x = (p0.x + p1.x) * 0.5;
        pC.y = (p0.y + p1.y) * 0.5;
        dP = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
        for(k = 0; pointsLeftIndexes[k] != null; k++) {
          p = polygon[pointsLeftIndexes[k]];
          //d = Math.pow(p.x-pC.x, 2)+Math.pow(p.y-pC.y, 2);
          d = (Math.sqrt(Math.pow(p.x - p0.x, 2) + Math.pow(p.y - p0.y, 2)) + Math.sqrt(Math.pow(p.x - p1.x, 2) + Math.pow(p.y - p1.y, 2))) / Math.pow(dP, 2);
          if(d < dMin) {
            dMin = d;
            jMin = j;
            kMin = k;
          }
        }
      }

      //c.log("  ", dMin);

      for(j = nHull - 1; j > jMin; j--) {
        indexesHull[j + 1] = indexesHull[j];
      }
      indexesHull[jMin + 1] = pointsLeftIndexes[kMin];

      //pointsLeftIndexes.removeElement(pointsLeftIndexes[kMin]); //!!!! TODO: FIX THIS!
      pointsLeftIndexes.splice(kMin, 1);

      if(pointsLeftIndexes.length === 0) return indexesHull;

      nHull++;
    }
    return indexesHull;
  };

  /**
   * @todo write docs
   */
  PolygonOperators.controlPointsFromPointsAnglesIntensities = function(polygon, angles, intensities) {
    var controlPoints = new _Polygon();
    for(var i = 0; polygon[i] != null; i++) {
      if(i > 0) controlPoints.push(new _Point(polygon[i].x - intensities[i] * Math.cos(angles[i]), polygon[i].y - intensities[i] * Math.sin(angles[i])));
      if(i < polygon.length - 1) controlPoints.push(new _Point(polygon[i].x + intensities[i] * Math.cos(angles[i]), polygon[i].y + intensities[i] * Math.sin(angles[i])));
    }
    return controlPoints;
  };


  /**
   * @todo write docs
   */
  PolygonOperators.placePointsInsidePolygon = function(polygon, nPoints, mode) {
    var points = new _Polygon();
    var frame = polygon.getFrame();
    mode = mode || 0;
    switch(mode) {
      case 0: //random simple
        var p;
        while(points.length < nPoints) {
          p = new _Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
          if(PolygonOperators.polygonContainsPoint(polygon, p)) points.push(p);
        }
        return points;      
    }
  };

  /**
   * @todo write docs
   */
  PolygonOperators.placePointsInsideBezierPolygon = function(polygon, nPoints, mode, border) {
    var points = new _Polygon();
    var frame = polygon.getFrame();
    mode = mode || 0;
    switch(mode) {
      case 0: //random simple
        var p;
        var nAttempts = 0;
        while(points.length < nPoints && nAttempts < 1000) {
          p = new _Point(frame.x + Math.random() * frame.width, frame.y + Math.random() * frame.height);
          nAttempts++;
          if(PolygonOperators.bezierPolygonContainsPoint(polygon, p, border)) {
            points.push(p);
            nAttempts = 0;
          }
        }
        return points;      
    }
  };

  CountryList.prototype = new NodeList();
  CountryList.prototype.constructor = CountryList;

  /**
   * @classdesc A {@link List} structure for storing {@link Country|Countries}.
   *
   * Additional functions that work on CountryList can be found in:
   * <ul>
   *  <li>Operators:   {@link CountryListOperators}</li>
   * </ul>
   *
   * @description Creates a new CountryList instance.
   * @constructor
   * @category geo
   */
  function CountryList() {
    var array = NodeList.apply(this, arguments);
    //
    array.name = "";
    //assign methods to array:
    array = CountryList.fromArray(array);
    //
    return array;
  }
  /**
  * @todo write docs
  */
  CountryList.fromArray = function(array) {
    var result = NodeList.fromArray(array);
    result.type = "CountryList";
    //assign methods to array:
    result.getCountryFromName = CountryList.prototype.getCountryFromName;
    //transformative
    result.removeAntarctica = CountryList.prototype.removeAntarctica;
    result.removeTinyPolygonsFromCountries = CountryList.prototype.removeTinyPolygonsFromCountries;
    result.removeTinyCountries = CountryList.prototype.removeTinyCountries;
    result.simplifyAntarctica = CountryList.prototype.simplifyAntarctica;
    result.assignValuesToCountriesFromTable = CountryList.prototype.assignValuesToCountriesFromTable;
    result.simplifyPolygons = CountryList.prototype.simplifyPolygons;
    return result;
  };

  /**
   * each country has several names to try a match
   * ISO id is allowed
   */
  CountryList.prototype.getCountryFromName = function(countryName) {
    for(var i = 0; this[i] != null; i++) {
      if(this[i].nameMatches(countryName)) return this[i];
    }
    return null;
  };


  //transformative

  /**
  * @todo write docs
  */
  CountryList.prototype.removeAntarctica = function() {
    this.removeNode(this.getNodeById('AQ'));
  };

  /**
  * @todo write docs
  */
  CountryList.prototype.removeTinyPolygonsFromCountries = function(minArea) {
    minArea = 0.2 || minArea;
    var country;
    var j;

    for(var i = 0; this[i] != null; i++) {
      country = this[i];
      for(j = 0; country.polygonList[j] != null; j++) {
        if(country.polygonList[j].getFrame().getArea() < minArea) {
          country.polygonList.splice(j, 1);
          j--;
        }
      }

    }
  };

  /**
  * @todo write docs
  */
  CountryList.prototype.removeTinyCountries = function(minArea) {
    minArea = 0.5 || minArea;
    var country;
    var j;
    var small;
    for(var i = 0; this[i] != null; i++) {
      country = this[i];

      small = true;
      for(j = 0; country.polygonList[j] != null; j++) {
        if(country.polygonList[j].getFrame().getArea() > minArea) {
          small = false;
          break;
        }
      }

      if(small) {
        this.removeNode(this[i]);
        i--;
      }
    }
  };

  /**
  * @todo write docs
  */
  CountryList.prototype.simplifyPolygons = function(margin) {
    var country;
    var j;
    var maxPL, jMax;

    for(var i = 0; this[i] != null; i++) {
      country = this[i];
      maxPL = 0;
      for(j = 0; country.polygonList[j] != null; j++) {
        country.polygonList[j] = PolygonOperators.simplifyPolygon(country.polygonList[j], margin);
        if(country.polygonList[j].length < 3) {
          country.polygonList.splice(j, 1);
          j--;
        } else {
          if(country.polygonList[j].length > maxPL) {
            maxPL = country.polygonList[j].length;
            jMax = j;
          }
        }
      }
      country.longestPolygon.destroy();
      country.longestPolygon = country.polygonList[jMax];
    }
  };

  /**
   * in 2D representations Antarctiva requires 2 extra points, placed on global geo grame corners
   * this method removes them (suitable for 3D representations)
   */
  CountryList.prototype.simplifyAntarctica = function() {
    var polygonList = this.getNodeById('AQ').simplePolygonList;
    if(polygonList != null) {
      polygonList[0].splice(10, 1);
      polygonList[0].splice(10, 1);
    }
    polygonList = this.getNodeById('AQ').polygonList;
    if(polygonList != null) {
      //TODO: remove last two points
    }
  };

  /**
  * @todo write docs
  */
  CountryList.prototype.assignValuesToCountriesFromTable = function(table, valueToNull) {
    var j;
    var country;
    for(var i = 0; table[0][i] != null; i++) {
      country = this.getCountryFromName(table[0][i]);
      if(country != null) {
        for(j = 1; table[j] != null; j++) {
          country[table[j].name] = table[j][i] == valueToNull ? null : table[j][i];
        }
      }
    }
  };

  /**
   * @classdesc Provides a set of tools that work with {@link Country|Countries}.
   *
   * @namespace
   * @category geo
   */
  function CountryOperators() {}
  /**
   * @todo write docs
   */
  CountryOperators.getSimplifiedName = function(name) {
    return name.replace(/[\.\- ,\']/g, "").toLowerCase();
  };

  /**
   * @todo write docs
   */
  CountryOperators.getSimplifiedNames = function(names) {
    var simplifiedNames = new StringList();
    var name;
    for(var i = 0; names[i] != null; i++) {
      name = this.getSimplifiedName(names[i]);
      if(name !== "") simplifiedNames.pushIfUnique(name);
    }
    return simplifiedNames;
  };

  Country.prototype = new _Node();
  Country.prototype.constructor = Country;

  /**
   * @classdesc Represents an individual country for visualization and spatial
   * reasoning.
   *
  * @description Creates a new Country instance.
   * @param {String} id Country id (ISO2)
   * @param {String} name Country name
   * @constructor
   * @category geo
   */
  function Country(id, name) {
    _Node.apply(this, [id, name]);
    this.type = "Country";

    this.id = id;
    this.name = name;

    this.shortName = undefined;

    this.continentName = undefined;
    this.isoCode = undefined;
    this.alternativeNames = undefined;
    this.wikipediaUrl = undefined;
    this.flagImageUrl = undefined;
    this.smallFlagImageUrl = undefined;
    this.recognized = false;
    this.geoCenter = undefined;

    this.polygonList = undefined;
    this.simplePolygonList = undefined;

    this.longestPolygon = undefined;
    this.longestSimplePolygon = undefined;

    this._simplifiedNames = undefined;
    this._simplifiedId = undefined;
    this._simplifiedName = undefined;

    this._frame = undefined;
  }
  /**
  * @todo write docs
  */
  Country.prototype.generatesSimplifiedNames = function() {
    this._simplifiedNames = CountryOperators.getSimplifiedNames(this.alternativeNames);
    this._simplifiedId = CountryOperators.getSimplifiedName(this.id);
    this._simplifiedName = CountryOperators.getSimplifiedName(this.name);
    this.shortName = this.name
      .replace('Democratic Republic', 'D.R.')
      .replace('United States', 'U.S.A')
      .replace('United Arab', 'U.A.');
  };

  /**
  * @todo write docs
  */
  Country.prototype.nameMatches = function(name) {
    if(this._simplifiedId == null) this.generatesSimplifiedNames();
    name = CountryOperators.getSimplifiedName(name);
    if(name == this._simplifiedId || name == this._simplifiedName) return true;
    return this._simplifiedNames.indexOf(name) != -1;
  };

  /**
  * @todo write docs
  */
  Country.prototype.getFrame = function() {
    if(this._frame == null) {
      this._frame = this.simplePolygonList == null ? this.polygonList.getFrame() : this.simplePolygonList.getFrame();
    }
    return this._frame;
  };

  Polygon3DList.prototype = new List();
  Polygon3DList.prototype.constructor = Polygon3DList;

  /**
   * @classdesc A {@link List} structure for storing {@link Polygon3D} instances.
   *
   * @description Creates a new Polygon3DList.
   * @constructor
   * @category geometry
   */
  function Polygon3DList() {
    var array = List.apply(this, arguments);
    array = Polygon3DList.fromArray(array);
    return array;
  }
  Polygon3DList.fromArray = function(array) {
    var result = List.fromArray(array);
    result.type = "Polygon3DList";
    return result;
  };

  ColorScale.prototype = new DataModel();
  ColorScale.prototype.constructor = ColorScale;

  /**
   * @classdesc Color scale.
   *
   * @description Creates a new ColorScale.
   * @param {Function} colorScaleFunction Function.
   * @constructor
   * @category colors
   */
  function ColorScale(colorScaleFunction) {
    DataModel.apply(this, arguments);
    this.name = "";
    this.type = "ColorScale";

    this.colorScaleFunction = colorScaleFunction ? colorScaleFunction : ColorScales.blackScale;
  }
  /**
  * @todo write docs
  */
  ColorScale.prototype.getColor = function(value) {
    return this.colorScaleFunction(value);
  };

  /**
  * @todo write docs
  */
  ColorScale.prototype.getColorList = function(nColors) {
    var colorList = new ColorList();
    var i;
    for(i = 0; i < nColors; i++) {
      colorList.push(this.getColor(i / (nColors - 1)));
    }
    return colorList;
  };

  /**
   * @classdesc 2D Interactions
   *
   * @todo Finish docs
   *
   * @description 2d interactions.
   * @constructor
   * @category geometry
   */
  function Space2D(configuration, graphics) {
    configuration = configuration == null ? {} : configuration;
    this.graphics = graphics;

    this.center = configuration.center == null ? new _Point(0, 0) : configuration.center;
    this.scale = 1;

    if(configuration.interactionActive) this.activeInteraction();

    this.MIN_SCALE = configuration.minScale == null ? 0.05 : configuration.minScale;
    this.MAX_SCALE = configuration.maxScale == null ? 20 : configuration.maxScale;

    this.active = configuration.interactionActive;
  }
  /**
   * @todo write docs
   */
  Space2D.prototype.activeInteraction = function() {
    if(this.active) return;
    this.active = true;
    this.graphics.on('mousedown', this.onMouse, this);
    this.graphics.on('mouseup', this.onMouse, this);
    this.graphics.on('mousewheel', this.wheel, this);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.deActivate = function() {
    this.active = false;
    this.dragging = false;
    this.graphics.off('mousedown', this.onMouse, this);
    this.graphics.off('mouseup', this.onMouse, this);
    this.graphics.off('mousemove', this.onMouse, this);
    this.graphics.off('mousewheel', this.wheel, this);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.stopDragging = function() {
    this.graphics.off('mousemove', this.onMouse, this);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.project = function(point) {
    return new _Point((point.x - this.center.x) * this.scale, (point.y + this.center.y) * this.scale);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.projectX = function(x) {
    return(x - this.center.x) * this.scale;
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.projectY = function(y) {
    return(y - this.center.y) * this.scale;
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.inverseProject = function(point) {
    return new _Point(point.x / this.scale + this.center.x, point.y / this.scale + this.center.y);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.inverseProjectX = function(x) {
    return x / this.scale + this.center.x;
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.inverseProjectY = function(y) {
    return y / this.scale + this.center.y;
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.move = function(vector, projected) {
    this.center = this.center.subtract(projected ? vector.factor(1 / this.scale) : vector);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.factorScaleFromPoint = function(point, factor) {
    var k = (1 - 1 / factor) / this.scale;
    this.center.x = k * point.x + this.center.x;
    this.center.y = k * point.y + this.center.y;

    this.scale *= factor;
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.fixX = function(xDeparture, xArrival) {
    this.center.x = xDeparture - (xArrival / this.scale);
  };
  /**
   * @todo write docs
   */
  Space2D.prototype.fixY = function(yDeparture, yArrival) {
    this.center.y = yDeparture - (yArrival / this.scale);
  };

  /**
   * @todo write docs
   */
  Space2D.prototype.fixHorizontalInterval = function(departureInterval, arrivalInterval) {
    this.scale = arrivalInterval.getAmplitude() / departureInterval.getAmplitude();
    this.fixX((departureInterval.x + departureInterval.y) * 0.5, this.graphics.cW * 0.5);
  };

  //////

  /**
   * @todo write docs
   */
  Space2D.prototype.onMouse = function(e) {
    switch(e.type) {
      case 'mousedown':
        if(!this.active) return;
        this.dragging = true;
        this.prev_mX = this.graphics.mX;
        this.prev_mY = this.graphics.mY;
        this.graphics.on('mousemove', this.onMouse, this);
        break;
      case 'mouseup':
        this.dragging = false;
        this.graphics.on('mousemove', this.onMouse, this);
        break;
      case 'mousemove':
        if(!this.active) return;
        this.center.x += (this.prev_mX - this.graphics.mX) / this.scale;
        this.center.y += (this.prev_mY - this.graphics.mY) / this.scale;
        this.prev_mX = this.graphics.mX;
        this.prev_mY = this.graphics.mY;
        break;
    }
  };



  /**
   * @todo write docs
   */
  Space2D.prototype.wheel = function(e) {
    if(!this.active) return;
    if(this.scale <= this.MIN_SCALE && e.value > 0) {
      this.scale = this.MIN_SCALE;
      return;
    }
    if(this.scale >= this.MAX_SCALE && e.value < 0) {
      this.scale = this.MAX_SCALE;
      return;
    }
    this.factorScaleFromPoint(new _Point(this.graphics.mX - 0, this.graphics.mY - 0), (1 - 0.02 * e.value));
  };

  /**
   * @classdesc DateList Conversions
   *
   * @namespace
   * @category dates
   */
  function DateListConversions() {}
  /**
  * Converts DateList to StringList
  *
  * @param {DateList} datelist The DateList to convert.
  */
  DateListConversions.toStringList = function(datelist) {
    var stringList = new StringList();
    for(var i = 0; datelist[i] != null; i++) {
      stringList[i] = DateOperators.dateToString(datelist[i]);
    }
    return stringList;
  };

  /**
   * @classdesc Provides a set of tools that work with DateLists.
   *
   * @namespace
   * @category dates
   */
  function DateListOperators() {}
  /**
   * @todo write docs
   */
  DateListOperators.buildTimeTreeFromDates = function(dates) {
    if(dates == null) return;

    var tree = new Tree();
    var minYear;
    var maxYear;

    var minDate = dates[0];
    var maxDate = dates[0];



    dates.forEach(function(date) {
      minDate = date < minDate ? date : minDate;
      maxDate = date > maxDate ? date : maxDate;
    });

    minYear = minDate.getFullYear();
    maxYear = minDate.getFullYear();

    var superior = new _Node("years", "years");
    tree.addNodeToTree(superior);
    superior.dates = dates.clone();

    var y, m, d, h, mn;
    var yNode, mNode, dNode, hNode, mnNode;
    var nDaysOnMonth;

    //var N=0;

    for(y = minYear; y <= maxYear; y++) {
      yNode = new _Node(String(y), String(y));
      tree.addNodeToTree(yNode, superior);
    }

    dates.forEach(function(date) {
      y = DateListOperators._y(date);
      yNode = superior.toNodeList[y - minYear];

      if(yNode.dates == null) {
        yNode.dates = new DateList();

        for(m = 0; m < 12; m++) {
          mNode = new _Node(DateOperators.MONTH_NAMES[m] + "_" + y, DateOperators.MONTH_NAMES[m]);
          tree.addNodeToTree(mNode, yNode);
          nDaysOnMonth = DateOperators.getNDaysInMonth(y, m + 1);
        }
      }
      yNode.dates.push(date);


      m = DateListOperators._m(date);
      mNode = yNode.toNodeList[m];
      if(mNode.dates == null) {
        mNode.dates = new DateList();
        for(d = 0; d < nDaysOnMonth; d++) {
          dNode = new _Node((d + 1) + "_" + mNode.id, String(d + 1));
          tree.addNodeToTree(dNode, mNode);
        }
      }
      mNode.dates.push(date);

      d = DateListOperators._d(date);
      dNode = mNode.toNodeList[d];
      if(dNode.dates == null) {
        dNode.dates = new DateList();
        for(h = 0; h < 24; h++) {
          hNode = new _Node(h + "_" + dNode.id, String(h) + ":00");
          tree.addNodeToTree(hNode, dNode);
        }
      }
      dNode.dates.push(date);

      h = DateListOperators._h(date);
      hNode = dNode.toNodeList[h];
      if(hNode.dates == null) {
        hNode.dates = new DateList();
        for(mn = 0; mn < 60; mn++) {
          mnNode = new _Node(mn + "_" + hNode.id, String(mn));
          tree.addNodeToTree(mnNode, hNode);
        }
      }
      hNode.dates.push(date);

      mn = DateListOperators._mn(date);
      mnNode = hNode.toNodeList[mn];
      if(mnNode.dates == null) {
        mnNode.dates = new DateList();
        //c.l(date);
        // N++;
        // for(s=0; s<60; s++){
        // 	sNode = new Node(String(s), s+"_"+mnNode.id);
        // 	tree.addNodeToTree(sNode, mnNode);
        // }
      }
      mnNode.weight++;
      mnNode.dates.push(date);

      // s = DateListOperators._s(date);
      // sNode = mnNode.toNodeList[s];
      // if(sNode.dates==null){
      // 	sNode.dates = new DateList();
      // }
      // sNode.dates.push(date);
      // sNode.weight++;
    });

    tree.assignDescentWeightsToNodes();

    //



    // for(y=minYear; y<=maxYear; y++){
    // 	yNode = new Node(String(y), String(y));
    // 	tree.addNodeToTree(yNode, superior);

    // 	for(m=0; m<12; m++){
    // 		mNode = new Node(DateOperators.MONTH_NAMES[m], DateOperators.MONTH_NAMES[m]+"_"+y);
    // 		tree.addNodeToTree(mNode, yNode);
    // 		nDaysOnMonth = DateOperators.getNDaysInMonth(y, m+1);

    // 		for(d=0; d<nDaysOnMonth; d++){
    // 			dNode = new Node(String(d+1), (d+1)+"_"+mNode.id);
    // 			tree.addNodeToTree(dNode, mNode);

    // 			for(h=0; h<24; h++){
    // 				hNode = new Node(String(h), h+"_"+dNode.id);
    // 				tree.addNodeToTree(hNode, dNode);

    // 				for(mn=0; mn<60; mn++){
    // 					mnNode = new Node(String(mn), mn+"_"+hNode.id);
    // 					tree.addNodeToTree(mnNode, hNode);

    // 					for(s=0; s<60; s++){
    // 						sNode = new Node(String(s), s+"_"+mnNode.id);
    // 						tree.addNodeToTree(sNode, mnNode);
    // 					}
    // 				}
    // 			}
    // 		}
    // 	}
    // }

    return tree;
  };

  /**
   * @ignore
   */
  DateListOperators._y = function(date) {
    return date.getFullYear();
  };

  /**
   * @ignore
   */
  DateListOperators._m = function(date) {
    return date.getMonth();
  };

  /**
   * @ignore
   */
  DateListOperators._d = function(date) {
    return date.getDate() - 1;
  };

  /**
   * @ignore
   */
  DateListOperators._h = function(date) {
    return date.getHours();
  };

  /**
   * @ignore
   */
  DateListOperators._mn = function(date) {
    return date.getMinutes();
  };

  /**
   * @ignore
   */
  DateListOperators._s = function(date) {
    return date.getSeconds();
  };

  /**
   * @ignore
   */
  DateListOperators._ms = function(date) {
    return date.getMilliseconds();
  };

  /**
   * @classdesc Provides a set of tools for dealing with distances and geometric
   * conversions.
   *
   * @namespace
   * @category geo
   */
  function GeoOperators() {}
  GeoOperators.EARTH_RADIUS = 6371009;
  GeoOperators.EARTH_DIAMETER = GeoOperators.EARTH_RADIUS * 2;


  /**
   * @todo write docs
   */
  GeoOperators.geoCoordinateToDecimal = function(value) {
    return Math.floor(value) + (value - Math.floor(value)) * 1.66667;
  };

  /**
   * @todo write docs
   */
  GeoOperators.geoDistance = function(point0, point1) {
    var a = Math.pow(Math.sin((point1.y - point0.y) * 0.5 * gradToRad), 2) + Math.cos(point0.y * gradToRad) * Math.cos(point1.y * gradToRad) * Math.pow(Math.sin((point1.x - point0.x) * 0.5 * gradToRad), 2);
    return GeoOperators.EARTH_DIAMETER * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  /**
   * @todo write docs
   */
  GeoOperators.polygonLength = function(polygon) {
    if(polygon.length < 2) return 0;

    var length = GeoOperators.geoDistance(polygon[0], polygon[1]);
    for(var i = 2; polygon[i] != null; i++) {
      length += GeoOperators.geoDistance(polygon[i - 1], polygon[i]);
    }
    return length;
  };

  /**
   * @classdesc Provides a set of tools that work with {@link countryList|CountryLists}.
   *
   * @namespace
   * @category geo
   */
  function CountryListOperators() {}
  /**
   * @todo write docs
   */
  CountryListOperators.getCountryByName = function(countryList, name) {
    var simplifiedName = CountryOperators.getSimplifiedName(name);

    for(var i = 0; countryList[i] != null; i++) {
      if(countryList[i].simplifiedNames.indexOf(simplifiedName) != -1) return countryList[i];
    }

    return null;
  };

  /**
   * @classdesc Provides a set of tools that work with Rectangles
   *
   * @namespace
   * @category geometry
   */
  function RectangleOperators() {}
  /**
   * finds the minimal rectangle containing two or more rectangles
   * @param {Rectangle} param0 first rectangle
   * @param {Rectangle} param1 second rectangle
   * @param {Rectangle} param2 third rectangle
   * @param {Rectangle} param3 fourth rectangle
   * @param {Rectangle} param4 fifth rectangle
   * @return {Rectangle}
   */
  RectangleOperators.minRect = function(){
    if(arguments==null || arguments.length<1) return null;

    var i;
    var frame = arguments[0].clone();

    frame.width = frame.getRight();
    frame.height = frame.getBottom();
    for(i = 1; arguments[i] != null; i++) {
      frame.x = Math.min(frame.x, arguments[i].x);
      frame.y = Math.min(frame.y, arguments[i].y);

      frame.width = Math.max(arguments[i].getRight(), frame.width);
      frame.height = Math.max(arguments[i].getBottom(), frame.height);
    }

    frame.width -= frame.x;
    frame.height -= frame.y;

    return frame;
  };

  /**
   *
   * 0: quadrification
   * 1: vertical
   * 2: horizontal
   * 3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
   * 4: europe quadrigram
   * 5: vertical strips quadrification
   * 6: horizontal strips quadrification
   */
  RectangleOperators.packingRectangles = function(weights, packingMode, rectangle, param) {
    //TODO: return RectangleList instead of List
    if(rectangle == null) rectangle = new Rectangle(0, 0, 1, 1);
    packingMode = packingMode ? packingMode : 0;
    switch(packingMode) {
      //0: quadrification
      //1: vertical
      //2: horizontal
      //3: continental quadrigram (Africa, Asia, Australasia, Europe, North America, South America)
      //4: europe quadrigram
      //5:vertical strips
      case 0:
        return RectangleOperators.squarify(rectangle, weights);
      case 1:
        var minMax = weights.getMinMaxInterval();
        if(minMax.min < 0) {
          weights = weights.add(-minMax.min);
          minMax = new Interval(0, minMax.max - minMax.min);
        }

        var sum = weights.getSum();

        var rectangleList = new List(); //RectangleList();
        var dY = rectangle.y;
        var h;
        var vFactor = rectangle.height / sum;
        var i;
        for(i = 0; weights[i] != null; i++) {
          h = vFactor * weights[i];
          rectangleList.push(new Rectangle(rectangle.x, dY, rectangle.width, h));
          dY += h;
        }
        return rectangleList;
      case 2:
        minMax = weights.getMinMaxInterval();
        if(minMax.min < 0) {
          weights = weights.add(-minMax.min);
          minMax = new Interval(0, minMax.max - minMax.min);
        }
        sum = weights.getSum();

        rectangleList = new List(); //RectangleList();
        var dX = rectangle.x;
        var w;
        var hFactor = rectangle.width / sum;
        for(i = 0; weights[i] != null; i++) {
          w = hFactor * weights[i];
          rectangleList.push(new Rectangle(dX, rectangle.y, w, rectangle.height));
          dX += w;
        }
        return rectangleList;
        //var newNumberList:NumberList = OperatorsNumberList.accumulationNumberList(OperatorsNumberList.normalizeNumberListToInterval(weights, new Interval(weights.min, 1)));
      case 3:
        if(weights.length < 6) {

        } else if(weights.length == 6) {
          var rAfrica = new Rectangle(0.44, 0.36, 0.16, 0.45);
          var rAsia = new Rectangle(0.6, 0.15, 0.3, 0.3);
          var rAustralasia = new Rectangle(0.72, 0.45, 0.28, 0.32);
          var rEurope = new Rectangle(0.38, 0.04, 0.22, 0.32);

          var pivotEuroafrasia = new _Point(0.6, 0.36);
          rAfrica = expandRectangle(rAfrica, Math.sqrt(weights[0]), pivotEuroafrasia);
          rAsia = expandRectangle(rAsia, Math.sqrt(weights[1]), pivotEuroafrasia);
          rEurope = expandRectangle(rEurope, Math.sqrt(weights[3]), pivotEuroafrasia);

          rAustralasia.x = rAsia.x + rAsia.width * 0.5;
          rAustralasia.y = rAsia.bottom;
          var pivotAustralasia = new _Point(rAustralasia.x + rAustralasia.width * 0.3, rAsia.bottom);
          rAustralasia = expandRectangle(rAustralasia, Math.sqrt(weights[2]), pivotAustralasia);
          rAustralasia.y += rAustralasia.height * 0.2;

          var pivotAmericas = new _Point(0.26, 0.36 + Math.max(rAfrica.height * 0.3, rEurope.height * 0.2));

          var rNorthAmerica = new Rectangle(0.1, pivotAmericas.y - 0.4, 0.2, 0.4);
          var rSouthAmerica = new Rectangle(0.22, pivotAmericas.y, 0.16, 0.5);

          rNorthAmerica = expandRectangle(rNorthAmerica, Math.sqrt(weights[4]), pivotAmericas);
          rSouthAmerica = expandRectangle(rSouthAmerica, Math.sqrt(weights[5]), pivotAmericas);

          var separation = Math.max(rEurope.width, rAfrica.width, rSouthAmerica.right - pivotAmericas.x, rNorthAmerica.right - pivotAmericas.x) * 0.2;
          var delta = Math.min(rEurope.x, rAfrica.x) - Math.max(rNorthAmerica.right, rSouthAmerica.right) - separation;

          rSouthAmerica.x += delta;
          rNorthAmerica.x += delta;

          return new List(rAfrica, rAsia, rAustralasia, rEurope, rNorthAmerica, rSouthAmerica); //RectangleList

        } else {

        }
      case 4:
        return europeQuadrigram(weights);
      case 5:
        param = param || 0;
        var nLists;
        if(param === 0) {
          nLists = Math.round(Math.sqrt(weights.length));
        } else {
          nLists = Math.round(weights.length / param);
        }
        var nRows = Math.ceil(weights.length / nLists);

        var nMissing = nLists * nRows - weights.length;

        var average = weights.getAverage();
        var weigthsCompleted = ListOperators.concat(weights, ListGenerators.createListWithSameElement(nMissing, average));
        var table = ListOperators.slidingWindowOnList(weigthsCompleted, nRows, nRows, 0);
        var sumList = table.getSums();
        var rectangleColumns = this.packingRectangles(sumList, 2, rectangle);

        rectangleList = List(); //new RectangleList();

        for(i = 0; i < nLists; i++) {
          rectangleList = ListOperators.concat(rectangleList, this.packingRectangles(table[i], 1, rectangleColumns[i]));
        }

        return rectangleList;
      case 6: //horizontal strips
    }
    return null;
  };

  /**
   * Squarified algorithm as described in (http://www.win.tue.nl/~vanwijk/stm.pdf)
   * @param {Rectangle} bounds Rectangle
   * @param {NumberList} list of weights
   *
   * @param {Boolean} weights are normalized
   * @param {Boolean} weights are sorted
   * @return {List} a list of Rectangles
   * tags:
   */
  RectangleOperators.squarify = function(frame, weights, isNormalizedWeights, isSortedWeights) { //, funcionEvaluacionnWeights:Function=null):Array{
    if(weights == null) return;
    if(weights.length === 0) return new RectangleList();
    if(weights.length === 1) return new RectangleList(frame);

    isNormalizedWeights = isNormalizedWeights ? isNormalizedWeights : false;
    isSortedWeights = isSortedWeights ? isSortedWeights : false;
    var newWeightList;

    if(isNormalizedWeights) {
      newWeightList = weights; // new NumberList(arregloPesos);
    } else {
      newWeightList = NumberListOperators.normalizedToSum(weights);
    }

    var newPositions;
    if(!isSortedWeights) {
      newPositions = newWeightList.getSortIndexes(); // ListOperators.sortListByNumberList();// newWeightList.sortNumericIndexedDescending();
      newWeightList = ListOperators.sortListByNumberList(newWeightList, newWeightList);
    }

    var area = frame.width * frame.height;
    var rectangleList = new RectangleList();
    var freeRectangle = frame.clone();
    var subWeightList;
    var subRectangleList = new List(); //RectangleList();//
    var prevSubRectangleList;
    var proportion;
    var worstProportion;
    var index = 0;
    var subArea;
    var freeSubRectangle = new Rectangle();
    var nWeights = weights.length;
    var lastRectangle;
    var newRectangleList;
    var i, j;

    if(nWeights > 2) {
      var sum;
      for(i = index; i < nWeights; i++) {
        proportion = Number.MAX_VALUE;
        if(newWeightList[i] === 0) {
          rectangleList.push(new Rectangle(freeSubRectangle.x, freeSubRectangle.y, 0, 0));
        } else {
          for(j = 1; j < nWeights; j++) {
            subWeightList = newWeightList.slice(i, i + j); //NumberList.fromArray(newWeightList.slice(i, i+j));//
            prevSubRectangleList = subRectangleList.slice(); //.clone();
            sum = subWeightList.getSum();
            subArea = sum * area;
            freeSubRectangle.x = freeRectangle.x;
            freeSubRectangle.y = freeRectangle.y;
            if(freeRectangle.width > freeRectangle.height) { //column
              freeSubRectangle.width = subArea / freeRectangle.height;
              freeSubRectangle.height = freeRectangle.height;
            } else { //fila
              freeSubRectangle.width = freeRectangle.width;
              freeSubRectangle.height = subArea / freeRectangle.width;
            }

            subRectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, sum);
            worstProportion = subRectangleList.highestRatio; // RectangleOperators._getHighestRatio(subRectangleList);//
            if(proportion <= worstProportion) {
              break;
            } else {
              proportion = worstProportion;
            }
          }

          if(prevSubRectangleList.length === 0) {
            rectangleList.push(new Rectangle(freeRectangle.x, freeRectangle.y, freeRectangle.width, freeRectangle.height)); //freeRectangle.clone());
            if(rectangleList.length == nWeights) {
              if(!isSortedWeights) {
                newRectangleList = new List(); //RectangleList();
                for(i = 0; rectangleList[i] != null; i++) {
                  newRectangleList[newPositions[i]] = rectangleList[i];
                }
                return newRectangleList;
              }
              return rectangleList;
            }
            index++;
          } else {
            rectangleList = rectangleList.concat(prevSubRectangleList);
            if(rectangleList.length == nWeights) {
              if(!isSortedWeights) {
                newRectangleList = new List();
                for(i = 0; rectangleList[i] != null; i++) {
                  newRectangleList[newPositions[i]] = rectangleList[i];
                }
                return newRectangleList;
              }
              return rectangleList;
            }
            index += prevSubRectangleList.length;
            lastRectangle = prevSubRectangleList[prevSubRectangleList.length - 1];
            if(freeRectangle.width > freeRectangle.height) {
              freeRectangle.x = (lastRectangle.width + lastRectangle.x);
              freeRectangle.width -= lastRectangle.width;
            } else {
              freeRectangle.y = (lastRectangle.height + lastRectangle.y);
              freeRectangle.height -= lastRectangle.height;
            }
          }
          i = index - 1;
        }
      }
    } else if(nWeights == 2) {
      subWeightList = newWeightList.slice(); //.clone();
      freeSubRectangle = frame.clone();
      rectangleList = RectangleOperators.partitionRectangle(freeSubRectangle, subWeightList, subWeightList.getSum());
    } else {
      rectangleList[0] = new Rectangle(frame.x, frame.y, frame.width, frame.height); //frame.clone();
    }


    if(!isSortedWeights) {
      newRectangleList = new List(); //RectangleList();//
      for(i = 0; rectangleList[i] != null; i++) {
        newRectangleList[newPositions[i]] = rectangleList[i];
      }
      return newRectangleList;
    }

    return rectangleList;
  };

  /**
   * partitionRectangle
   * @param {Rectangle} bounds Rectangle
   * @param {NumberList} normalizedWeight List
   *
   * @return {List} a list of Rectangles
   */
  RectangleOperators.partitionRectangle = function(rectangle, normalizedWeightList, sum) {
    var area = rectangle.width * rectangle.height;
    var rectangleList = new List(); //RectangleList();
    var freeRectangle = new Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height); //rectangle.clone();
    var areai;
    var i;
    var rect;
    var highestRatio = 1;
    for(i = 0; i < normalizedWeightList.length; i++) {
      areai = normalizedWeightList[i] * area / sum;
      if(rectangle.width > rectangle.height) {
        rect = new Rectangle(freeRectangle.x, freeRectangle.y, areai / freeRectangle.height, freeRectangle.height);
        rectangleList.push(rect);
        freeRectangle.x += areai / freeRectangle.height;
        //rect.ratio = rect.width/rect.height;
      } else {
        rect = new Rectangle(freeRectangle.x, freeRectangle.y, freeRectangle.width, areai / freeRectangle.width);
        rectangleList.push(rect);
        freeRectangle.y += areai / freeRectangle.width;
        //rect.ratio = rect.height/rect.width;
      }
      rect.ratio = Math.max(rect.width, rect.height) / Math.min(rect.width, rect.height);
      highestRatio = Math.max(highestRatio, rect.ratio);
    }

    rectangleList.highestRatio = highestRatio;

    return rectangleList;
  };

  /**
   * returns the highest ratio from a list of Rectangles
   * @param {List} rectangleList a Rectangle List
   *
   * @return {Number} highestRatio
   */
  RectangleOperators._getHighestRatio = function(rectangleList) {
    var highestRatio = 1;
    var rectangle;
    var i;
    for(i = 0; i < rectangleList.length; i++) {
      rectangle = rectangleList[i];
      highestRatio = Math.max(highestRatio, rectangle.getRatio());
    }
    return highestRatio;
  };

  /**
   * @classdesc Tools to manipulate {@link PolygonList|Polygon Lists}.
   *
   * @namespace
   * @category geometry
   */
  function PolygonListOperators() {}
  /**
   * @todo write docs
   */
  PolygonListOperators.simplifyPolygons = function(polygonList, margin, removeEmptyPolygons) {
    var newPolygonList = new PolygonList();
    var newPolygon;
    for(var i = 0; polygonList[i] != null; i++) {
      newPolygon = PolygonOperators.simplifyPolygon(polygonList[i], margin);
      if(newPolygon.length > 0 || !removeEmptyPolygons) {
        newPolygonList.push(newPolygon);
      }
    }
    return newPolygonList;
  };

  /**
   * @classdesc Encode and Decode {@link Polygon} as a String.
   *
   * @namespace
   * @category geometry
   */
  function PolygonListEncodings() {}
  /**
   * converts a simple format for polygons into a PolygonList
   * @param {String} string
   *
   * @param {String} separatorCoordinates "," by default
   * @param {String} separatorPolygons "/" by default
   * @return {PolygonList}
   * tags:encoding
   */
  PolygonListEncodings.StringToPolygonList = function(string, separatorCoordinates, separatorPolygons) {
    separatorCoordinates = separatorCoordinates || ",";
    separatorPolygons = separatorPolygons || "/";

    var polygonList = new PolygonList();
    var polygon;
    var point;

    var pols = StringOperators.splitString(string, separatorPolygons);

    var j;
    var numbers;
    for(var i = 0; pols[i] != null; i++) {
      polygon = new _Polygon();
      numbers = StringOperators.splitString(pols[i], separatorCoordinates);
      for(j = 0; numbers[j] != null; j += 2) {
        point = new _Point(Number(numbers[j]), Number(numbers[j + 1]));
        polygon.push(point);
      }
      polygonList.push(polygon);
    }
    return polygonList;
  };

  /**
   * converts a polygonList into a simple text format
   * @param {PolygonList} polygonList
   *
   * @param {String} separatorCoordinates "," by default
   * @param {String} separatorPolygons "/" by default
   * @return {String}
   * tags:encoding
   */
  PolygonListEncodings.PolygonListToString = function(polygonList, separatorCoordinates, separatorPolygons) {
    separatorCoordinates = separatorCoordinates || ",";
    separatorPolygons = separatorPolygons || "/";

    var i;
    var j;
    var t = '';
    for(i = 0; polygonList[i] != null; i++) {
      t += (i === 0 ? '' : separatorPolygons);
      for(j = 0; polygonList[i][j] != null; j++) {
        t += (j === 0 ? '' : separatorCoordinates) + polygonList[i][j].x + separatorCoordinates + polygonList[i][j].y;
      }
    }
    return t;
  };

  /**
   * @classdesc Functions to create Polygons from a set of points
   *
   * @namespace
   * @category geometry
   */
  function PolygonGenerators() {}
  /**
   * @todo write docs
   */
  PolygonGenerators.createPolygon = function(nPoints, mode, frame) {
    var polygon = new _Polygon();

    switch(mode) {
      case 0: //random
        for(var i = 0; i < nPoints; i++) {
          polygon.push(new _Point(frame.x + frame.width * Math.random(), frame.y + frame.height * Math.random()));
        }
        break;
      case 1: //circle
        break;
    }

    return polygon;
  };

  // PolygonGenerators.getCirclesDisposedInSpiral=function(weights, frame){ //TODO: this method belongs to another class (?)
  // 	var sortedCenters;
  // 	var centers = new Polygon();
  // 	var sortedRadius;
  // 	var radius = new NumberList();
  // 	var sortArray = weights.sortNumericIndexedDescending();
  // 	//trace("sortArray:", weights, sortArray);
  // 	var maxWeight = 0;
  // 	var nElements = weights.length;
  // 	var i;
  // 	var j;

  // 	if(nElements==1){
  // 		var table=new Table();
  // 		var pointList=new Polygon();
  // 		var point=new Point()
  // 		pointList.push(point);
  // 		table.push(pointList);
  // 		var list=new List();
  // 		list.push(1);
  // 		table.push(list);
  // 		return table;
  // 	}
  // 	maxWeight =weights.getMax();


  // 	if(maxWeight==0) return null;

  // 	var MIN_SPACE_BETWEEN_CIRCLES = 0.1;

  // 	sortedRadius = new NumberList(Math.sqrt(weights[sortArray[0]]/maxWeight), Math.sqrt(weights[sortArray[1]]/maxWeight));
  // 	sortedCenters = new Polygon(new Point(0,0), new Point(sortedRadius[0] + sortedRadius[1] + MIN_SPACE_BETWEEN_CIRCLES,0));
  // 	//trace("sortedCenters:", sortedCenters),
  // 	centers[sortArray[0]] = sortedCenters[0];
  // 	radius[sortArray[0]] = sortedRadius[0];

  // 	centers[sortArray[1]] = sortedCenters[1];
  // 	radius[sortArray[1]] = sortedRadius[1];
  // 	//trace(centers);
  // 	//trace(radius);
  // 	var r;
  // 	var rI;
  // 	var angle = 0;

  // 	var testPoint = new Point(0, 0);
  // 	var externR = sortedCenters[1].x + sortedRadius[1];

  // 	//var ACCUM_J:Number=0;

  // 	for(i=2; i<nElements; i++){
  // 		rI = Math.sqrt(weights[sortArray[i]]/maxWeight);
  // 		//trace(i, "rI", rI);
  // 		r = sortedRadius[0] + rI + MIN_SPACE_BETWEEN_CIRCLES;
  // 		angle = i;

  // 		for(j=0; j<100000; j++){
  // 			testPoint.x = r*Math.cos(angle);
  // 			testPoint.y = r*Math.sin(angle);

  // 			r+=0.01;
  // 			angle+=r*0.04;

  // 			if(Polygon.testCircleAtPoint(testPoint, rI+MIN_SPACE_BETWEEN_CIRCLES, sortedCenters, sortedRadius) || j==99999){
  // 				sortedCenters.push(new Point(testPoint.x, testPoint.y));
  // 				sortedRadius.push(rI);
  // 				centers[sortArray[i]] = sortedCenters[i];
  // 				radius[sortArray[i]] = sortedRadius[i];
  // 				externR = Math.max(externR, Math.sqrt(Math.pow(testPoint.x, 2)+Math.pow(testPoint.y, 2)) + rI);
  // 				break;
  // 			}
  // 		}
  // 		//ACCUM_J+=j

  // 	}
  // 	//trace("   packingCircles:ACCUM_J", ACCUM_J);
  // 	//trace("c:", centers);
  // 	//trace("r:", radius);
  // 	var mulVal=1/externR;
  // 	for(i=0; i<centers.length; i++){
  // 		centers[i].x*=mulVal;
  // 		centers[i].y*=mulVal;
  // 	}
  // 	for(i=0; i<radius.length; i++){
  // 		radius[i]*=mulVal;
  // 	}
  // 	//centers = centers.multiply();
  // 	//radius = radius.multiply(1/externR);
  // 	//trace("c2:", centers);
  // 	//trace("r2:", radius);

  // 	return new Array(centers, radius);
  // }

  /**
   * @classdesc Tools to convert geometric data types.
   *
   * @namespace
   * @category geometry
   */
  function GeometryConversions() {}
  /**
   * @todo write docs
   */
  GeometryConversions.twoNumberListsToPolygon = function(numberList0, numberList1) { //TODO:change name to NumberTableToPolygon
    var n = Math.min(numberList0.length, numberList1.length);
    var polygon = new _Polygon();
    for(var i = 0; i < n; i++) {
      polygon[i] = new _Point(numberList0[i], numberList1[i]);
    }
    return polygon;
  };

  /**
   * converts a Polygon into a NumberTable
   * @param {Polygon} polygon
   * @return {NumberTable}
   * tags:conversion
   */
  GeometryConversions.PolygonToNumberTable = function(polygon) {
    if(polygon == null) return null;

    var numberTable = new NumberTable();
    numberTable[0] = new NumberList();
    numberTable[1] = new NumberList();

    polygon.forEach(function(p) {
      numberTable[0].push(p.x);
      numberTable[1].push(p.y);
    });

    return numberTable;
  };

  /**
   * @classdesc Generate {@link ColorScale|ColorScales} with various properties.
   *
   * @namespace
   * @category colors
   */
  function ColorScaleGenerators() {}
  /**
   * creates a ColorScale function from colors and positions, a numberList with values in (0,1) (positions lenth must be colorList length minus 2)
   * @param  {ColorList} colorList
   * @param  {NumberList} positions
   * @return {ColorScale}
   * tags:generator
   */
  ColorScaleGenerators.createColorScaleFromColors = function(colorList, positions) {
    if(colorList == null || positions == null || colorList.length <= 0 || positions.length <= 0 || colorList.length != (positions.length + 2)) return null;

    if(colorList.rgbs == null) {
      colorList.rgbs = colorList.getRgbArrays();
    }

    positions = positions.slice();
    positions.unshift(0);
    positions.push(1);

    var cS = function(t) {
      var i;
      var intert, antit;

      for(i = 0; positions[i + 1] != null; i++) {
        if(t < positions[i + 1]) {
          intert = (t - positions[i]) / (positions[i + 1] - positions[i]);
          antit = 1 - intert;
  				return 'rgb(' +
  					Math.floor( antit*colorList.rgbs[i][0] + intert*colorList.rgbs[i+1][0] ) + ',' +
  					Math.floor( antit*colorList.rgbs[i][1] + intert*colorList.rgbs[i+1][1] ) + ',' +
  					Math.floor( antit*colorList.rgbs[i][2] + intert*colorList.rgbs[i+1][2] ) + ')';
        }
      }
    };

    return cS;
  };

  /**
   * @classdesc Tools for working with Lists of colors.
   *
   * @namespace
   * @category colors
   */
  function ColorListOperators() {}
  /**
   * receives n arguments and performs addition
   *
   * @todo finish docs
   */
  ColorListOperators.colorListFromColorScale = function(colorScale, nColors) {
    return colorScale.getColorList.apply(colorScale, [nColors]);
  };

  /**
   * Creates a new ColorList from a given ColorScale, splitting the scale up into
   * nColors number of colors
   *
   * @param  {ColorScale} colorScaleFunction The ColorScale to split up.
   * @param  {Number} nColors The number of colors to add to the list.
   * @return {ColorList} new ColorList.
   */
  ColorListOperators.colorListFromColorScaleFunction = function(colorScaleFunction, nColors) {
    var colorList = new ColorList();
    var i;
    for(i = 0; i < nColors; i++) {
      colorList[i] = colorScaleFunction(i / (nColors - 1));
    }
    return colorList;
  };


  /**
   * @todo write docs
   */
  ColorListOperators.colorListFromColorScaleFunctionAndNumberList = function(colorScaleFunction, numberList, normalize) {
    normalize = normalize == null ? true : normalize;

    if(normalize) numberList = NumberListOperators.normalized(numberList);

    var colorList = new ColorList();
    var i;
    for(i = 0; numberList[i] != null; i++) {
      colorList[i] = colorScaleFunction(numberList[i]);
    }
    return colorList;
  };


  /**
   * @todo write docs
   */
  ColorListOperators.polygon3DToColorList = function(polygon3D) {
    var nPoints = polygon3D.length;
    var colorList = new ColorList();
    var i;
    for(i = 0; i < nPoints; i++) {
      colorList.push(ColorOperators.point3DToColor(polygon3D[i]));
    }
    return colorList;
  };


  /**
   * @todo write docs
   */
  ColorListOperators.colorListToPolygon3D = function(colorList) {
    var nColors = colorList.length;
    var polygon3D = new Polygon3D();
    var i;
    for(i = 0; i < nColors; i++) {
      polygon3D.push(ColorOperators.colorToPoint3D(colorList[i]));
    }
    return polygon3D;
  };

  /**
   * @classdesc Tools for generating colors.
   *
   * @namespace
   * @category colors
   */
  function ColorGenerators() {}
  /**
   * Generates a random color and provides rgba() CSS string for that color.
   * Optionally can be provided an alpha value to set the opacity to.
   *
   * @param {Number} alpha Opacity value between 0 and 1. Defaults to 1.
   * @return {String} Random color in the form of a RGBA string.
   */
  ColorGenerators.randomColor = function(alpha) {
    alpha = alpha == null ? 1 : alpha;
    return 'rgba(' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + Math.floor(256 * Math.random()) + ',' + alpha + ')';
  };

  /**
   * @classdesc Table Operators
   *
   * @namespace
   * @category basics
   */
  function TableOperators() {}
  /**
   * @todo finish docs
   */
  TableOperators.getElementFromTable = function(table, i, j) {
    if(table[i] == null) return null;
    return table[i][j];
  };

  /**
   * @todo finish docs
   */
  TableOperators.getSubTable = function(table, x, y, width, height) {
    if(table == null) return table;

    var nLists = table.length;
    if(nLists === 0) return null;
    var result = new Table();

    if(width <= 0) width = (nLists - x) + width;
    x = Math.min(x, nLists - 1);
    width = Math.min(width, nLists - x);

    var nRows = table[0].length;

    if(nRows === 0) return null;

    if(height <= 0) height = (nRows - y) + height;

    y = Math.min(y, nRows - 1);
    height = Math.min(height, nRows - y);

    var column;
    var newColumn;
    var i;
    var j;
    var element;
    for(i = x; i < x + width; i++) {
      column = table[i];
      newColumn = new List();
      newColumn.name = table[i].name;
      for(j = y; j < y + height; j++) {
        element = column[j];
        newColumn.push(element);
      }
      result.push(newColumn.getImproved());
    }
    return result.getImproved();
  };

  /**
   * filters lists on a table, keeping elements that are in the same of row of a certain element of a given list from the table
   * @param  {Table} table Table.
   * @param  {Number} nList index of list containing the element
   * @param  {Object} element used to filter the lists on the table
   * @return {Table}
   * tags:filter
   */
  TableOperators.getSubTableByElementOnList = function(table, nList, element){
    if(nList==null || element==null) return;

    var i, j;
    var nLists = table.length;

    if(nList<0) nList = nLists+nList;
    nList = nList%nLists;

    var newTable = instantiateWithSameType(table);
    newTable.name = table.name;

    for(i=0; i<nLists; i++){
      var newList = new List();
      newList.name = table[i].name;
      newTable.push(newList);
    }
    // table.forEach(function(list){
    //   var newList = new List();
    //   newList.name = list.name;
    //   newTable.push(newList);
    // });

    var supervised = table[nList];
    var nSupervised = supervised.length;
    var nElements;

    for(i=0; i<nSupervised; i++){
      if(element==supervised[i]){
        nElements = newTable.length;
         for(j=0; j<nElements; j++){
            newTable[j].push(table[j][i]);
         }
      }
    }

    nLists = newTable.length;

    for(i=0; i<nLists; i++){
      newTable[i] = newTable[i].getImproved();
    }
    // newTable.forEach(function(list, i){
    //   newTable[i] = list.getImproved();
    // });

    return newTable.getImproved();
  };

  /**
   * filters lists on a table, keeping elements that are in the same of row of certain elements of a given list from the table
   * @param  {Table} table Table.
   * @param  {Number} nList index of list containing the element
   * @param  {List} elements used to filter the lists on the table
   * @return {Table}
   * tags:filter
   */
  TableOperators.getSubTableByElementsOnList = function(table, nList, list){
    if(nList==null || list==null) return;

    var i, j;

    if(nList<0) nList = table.length+nList;
    nList = nList%table.length;

    var newTable = instantiateWithSameType(table);
    newTable.name = table.name;

    table.forEach(function(list){
      var newList = new List();
      newList.name = list.name;
      newTable.push(newList);
    });

    var supervised = table[nList];

    var listDictionary = ListOperators.getBooleanDictionaryForList(list);

    for(i=0; supervised[i]!=null; i++){
      if(listDictionary[supervised[i]]){
         for(j=0; newTable[j]!=null; j++){
            newTable[j].push(table[j][i]);
         }
      }
    }

    newTable.forEach(function(list, i){
      newTable[i] = list.getImproved();
    });

    return newTable.getImproved();
  };

  /**
   * transposes a table
   * @param  {Table} table to be transposed
   *
   * @param {Boolean} firstListAsHeaders removes first list of the table and uses it as names for the lists on the transposed table
   * @return {Table}
   * tags:matrixes
   */
  TableOperators.transpose = function(table, firstListAsHeaders) {
    if(table == null) return null;
    return table.getTransposed(firstListAsHeaders);
  };

  /**
   * divides the instances of a table in two tables: the training table and the test table
   * @param  {Table} table
   * @param  {Number} proportion proportion of training instances/test instances, between 0 and 1
   *
   * @param  {Number} mode  0:random<br>1:random with seed<br>2:shuffle
   * @param {Number} seed seed for random numbers (mode 1)
   * @return {List} list containing the two tables
   * tags:ds
   */
  TableOperators.trainingTestPartition = function(table, proportion, mode, seed) {
    if(table == null || proportion == null) return;

    mode = mode || 0;
    seed = seed || 0;

    var n_mod = 0;

    var indexesTr = new NumberList();
    var indexesTe = new NumberList();

    var random = mode == 1 ? new NumberOperators._Alea("my", seed, "seeds") : Math.random;

    if(mode == 2) {
      n_mod = Math.floor(proportion / (1 - proportion) * 10);
    }

    table[0].forEach(function(id, i) {
      if(mode === 0 ||  mode === 1) {
        if(random() < proportion) {
          indexesTr.push(i);
        } else {
          indexesTe.push(i);
        }
      } else {
        if(i % n_mod !== 0) {
          indexesTr.push(i);
        } else {
          indexesTe.push(i);
        }
      }
    });

    return new List(table.getSubListsByIndexes(indexesTr), table.getSubListsByIndexes(indexesTe));
  };

  /**
   * tests a model
   * @param  {NumberTable} numberTable coordinates of points
   * @param  {List} classes list of values of classes
   * @param  {Function} model function that receives two numbers and returns a guessed class
   *
   * @param  {Number} metric 0:error
   * @return {Number} metric value
   * tags:ds
   */
  TableOperators.testClassificationModel = function(numberTable, classes, model, metric) {
    if(numberTable == null || classes == null || model == null) return null;

    metric = metric || 0;

    var nErrors = 0;

    classes.forEach(function(clss, i) {
      if(model(numberTable[0][i], numberTable[1][i]) != clss) {
        nErrors++;
      }
    });

    return nErrors / classes.length;
  };



  /**
   * @todo finish docs
   */
  TableOperators.getSubListsByIndexes = function(table, indexes) {
    var newTable = new Table();
    newTable.name = table.name;
    var list;
    var newList;
    for(var i = 0; table[i] != null; i++) {
      list = table[i];
      newList = instantiateWithSameType(list);
      for(var j = 0; indexes[j] != null; j++) {
        newList[j] = list[indexes[j]];
      }
      newTable[i] = newList.getImproved();
    }
    return newTable;
  };

  // old version replaced by above version Dec 1st, 2014
  // - fixed bug where descending with 'false' value gets changed to 'true'
  // - performance improvements for tables with lots of lists
  // TableOperators.sortListsByNumberList=function(table, numberList, descending){
  //  descending = descending || true;
  /**
   * @todo finish docs
   */
  TableOperators.sortListsByNumberList = function(table, numberList, descending) {
    if(descending == null) descending = true;

    var newTable = instantiate(typeOf(table));
    newTable.name = table.name;
    var nElements = table.length;
    var i;
    // only need to do the sort once, not for each column
    var indexList = numberList.clone();
    // save original index
    for(i = 0; i < indexList.length; i++) {
      indexList[i] = i;
    }
    indexList = ListOperators.sortListByNumberList(indexList, numberList, descending);
    // now clone and then move from original based on index
    for(i = 0; i < nElements; i++) {
      newTable[i] = table[i].clone();
      for(var j = 0; j < indexList.length; j++) {
        newTable[i][j] = table[i][indexList[j]];
      }
    }
    return newTable;
  };


  /**
   * aggregates lists from a table, using one of the list of the table as the aggregation list, and based on different modes for each list
   * @param  {Table} table containing the aggregation list and lists to be aggregated
   * @param  {Number} indexAggregationList index of the aggregation list on the table
   * @param  {NumberList} indexesListsToAggregate indexs of the lists to be aggregated; typically it also contains the index of the aggregation list at the beginning, to be aggregated using mode 0 (first element) thus resulting as the list of non repeated elements
   * @param  {NumberList} modes list of modes of aggregation, these are the options:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements<br>14:concat elements (string)<br>15:concat non-repeated elements
   *
   * @param {StringList} newListsNames optional names for generated lists
   * @return {Table} aggregated table
   * tags:
   */
  TableOperators.aggregateTable = function(table, indexAggregationList, indexesListsToAggregate, modes, newListsNames){
    indexAggregationList = indexAggregationList||0;

    if(table==null || !table.length ||  table.length<indexAggregationList || indexesListsToAggregate==null || !indexesListsToAggregate.length || modes==null) return;

    var aggregatorList = table[indexAggregationList];
    var indexesTable = ListOperators.getIndexesTable(aggregatorList);
    var newTable = new Table();
    var newList;
    var toAggregateList;

    indexesListsToAggregate.forEach(function(index, i){
      toAggregateList = table[index];
      newList = ListOperators.aggregateList(aggregatorList, toAggregateList, i<modes.length?modes[i]:1, indexesTable)[1];
      if(newListsNames && i<newListsNames.length) newList.name = newListsNames[i];
      newTable.push(newList);
    });

    return newTable.getImproved();
  };



  /**
   * builds a pivot table
   * @param  {table} table
   * @param  {Number} indexFirstAggregationList index of first list
   * @param  {Number} indexSecondAggregationList index of second list
   * @param  {Number} indexListToAggregate index of list to be aggregated
   * @param  {Number} aggregationMode aggregation mode:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>------not yet deployed:<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes
   * @param {Object} nullValue value for null cases in non-numerical aggregation
   *
   * @param  {Number} resultMode result mode:<br>0:classic pivot, a table of aggregations with first aggregation list elements without repetitions in the first list, and second aggregation elements as headers of the aggregation lists<br>1:two lists for combinations of first aggregated list and second aggregated list, and a third list for aggregated values(default)
   * @return {Table}
   * tags:
   */
  TableOperators.pivotTable = function(table, indexFirstAggregationList, indexSecondAggregationList, indexListToAggregate, aggregationMode, nullValue, resultMode){
    if(table==null || !table.length || indexFirstAggregationList==null || indexSecondAggregationList==null || indexListToAggregate==null || aggregationMode==null) return;

    resultMode = resultMode||0;
    nullValue = nullValue==null?"":nullValue;

    var element1;
    var coordinate, indexes;
    var listToAggregate = table[indexListToAggregate];

    var newTable = new Table();
    var sum;
    var i;

    if(resultMode==1){//two lists of elements and a list of aggregation value
      var indexesDictionary = {};
      var elementsDictionary = {};

      table[indexFirstAggregationList].forEach(function(element0, i){
        element1 = table[indexSecondAggregationList][i];
        coordinate = String(element0)+"∞"+String(element1);
        if(indexesDictionary[coordinate]==null){
          indexesDictionary[coordinate]=new NumberList();
          elementsDictionary[coordinate]=new List();
        }
        indexesDictionary[coordinate].push(i);
        elementsDictionary[coordinate].push(listToAggregate[i]);
      });

      newTable[0] = new List();
      newTable[1] = new List();
      switch(aggregationMode){
        case 0://first element
          newTable[2] = new List();
          break;
        case 1://count
        case 2://sum
        case 3://average
          newTable[2] = new NumberList();
          break;
      }


      for(coordinate in indexesDictionary) {
        indexes = indexesDictionary[coordinate];
        newTable[0].push(table[indexFirstAggregationList][indexes[0]]);
        newTable[1].push(table[indexSecondAggregationList][indexes[0]]);

        switch(aggregationMode){
          case 0://first element
            newTable[2].push(listToAggregate[indexes[0]]);
            break;
          case 1://count
            newTable[2].push(indexes.length);
            break;
          case 2://sum
          case 3://average
            sum = 0;
            indexes.forEach(function(index){
              sum+=listToAggregate[index];
            });
            if(aggregationMode==3) sum/=indexes.length;
            newTable[2].push(sum);
            break;
        }
      }

      newTable[0] = newTable[0].getImproved();
      newTable[1] = newTable[1].getImproved();

      switch(aggregationMode){
        case 0://first element
          newTable[2] = newTable[2].getImproved();
          break;
      }

      return newTable;
    }


    ////////////////////////resultMode==0, a table whose first list is the first aggregation list, and each i+i list is the aggregations with elements for the second aggregation list

    newTable[0] = new List();

    var elementsPositions0 = {};
    var elementsPositions1 = {};

    var x, y;
    var element;
    var newList;

    table[indexFirstAggregationList].forEach(function(element0, i){
      element1 = table[indexSecondAggregationList][i];
      element = listToAggregate[i];

      y = elementsPositions0[String(element0)];
      if(y==null){
        newTable[0].push(element0);
        y = newTable[0].length-1;
        elementsPositions0[String(element0)] = y;
      }

      x = elementsPositions1[String(element1)];
      if(x==null){
        switch(aggregationMode){
          case 0:
            newList = new List();
            break;
          case 1:
          case 2:
          case 3:
            newList = new NumberList();
            break;
        }
        newTable.push(newList);
        newList.name = String(element1);
        x = newTable.length-1;
        elementsPositions1[String(element1)] = x;
      }

      switch(aggregationMode){
        case 0://first element
          if(newTable[x][y]==null) newTable[x][y]=element;
          break;
        case 1://count
          if(newTable[x][y]==null) newTable[x][y]=0;
          newTable[x][y]++;
          break;
        case 2://sum
          if(newTable[x][y]==null) newTable[x][y]=0;
          newTable[x][y]+=element;
          break;
        case 3://average
          if(newTable[x][y]==null) newTable[x][y]=[0,0];
          newTable[x][y][0]+=element;
          newTable[x][y][1]++;
          break;
      }

    });

    switch(aggregationMode){
      case 0://first element
        for(i=1; i<newTable.length; i++){
          if(newTable[i]==null) newTable[i]=new List();

          newTable[0].forEach(function(val, j){
            if(newTable[i][j]==null) newTable[i][j]=nullValue;
          });

          newTable[i] = newTable[i].getImproved();
        }
        break;
      case 1://count
      case 2://sum
        for(i=1; i<newTable.length; i++){
          if(newTable[i]==null) newTable[i]=new NumberList();
          newTable[0].forEach(function(val, j){
            if(newTable[i][j]==null) newTable[i][j]=0;
          });
        }
        break;
      case 3://average
        for(i=1; i<newTable.length; i++){
          if(newTable[i]==null) newTable[i]=new NumberList();
          newTable[0].forEach(function(val, j){
            if(newTable[i][j]==null){
              newTable[i][j]=0;
            } else {
              newTable[i][j]=newTable[i][j][0]/newTable[i][j][1];
            }
          });
        }
        break;
    }

    return newTable;
  };



  /**
   * aggregates a table
   * @param  {Table} table to be aggregated, deprecated: a new more powerful method has been built
   * @param  {Number} nList list in the table used as basis to aggregation
   * @param  {Number} mode mode of aggregation, 0:picks first element 1:adds numbers, 2:averages
   * @return {Table} aggregated table
   * tags:deprecated
   */
  TableOperators.aggregateTableOld = function(table, nList, mode) {
    nList = nList == null ? 0 : nList;
    if(table == null || table[0] == null || table[0][0] == null || table[nList] == null) return null;
    mode = mode == null ? 0 : mode;

    var newTable = new Table();
    var i, j;
    var index;
    var notRepeated;

    newTable.name = table.name;

    for(j = 0; table[j] != null; j++) {
      newTable[j] = new List();
      newTable[j].name = table[j].name;
    }

    switch(mode) {
      case 0: //leaves the first element of the aggregated subLists
        for(i = 0; table[0][i] != null; i++) {
          notRepeated = newTable[nList].indexOf(table[nList][i]) == -1;
          if(notRepeated) {
            for(j = 0; table[j] != null; j++) {
              newTable[j].push(table[j][i]);
            }
          }
        }
        break;
      case 1: //adds values in numberLists
        for(i = 0; table[0][i] != null; i++) {
          index = newTable[nList].indexOf(table[nList][i]);
          notRepeated = index == -1;
          if(notRepeated) {
            for(j = 0; table[j] != null; j++) {
              newTable[j].push(table[j][i]);
            }
          } else {
            for(j = 0; table[j] != null; j++) {
              if(j != nList && table[j].type == 'NumberList') {
                newTable[j][index] += table[j][i];
              }
            }
          }
        }
        break;
      case 2: //averages values in numberLists
        var nRepetitionsList = table[nList].getFrequenciesTable(false);
        newTable = TableOperators.aggregateTableOld(table, nList, 1);

        for(j = 0; newTable[j] != null; j++) {
          if(j != nList && newTable[j].type == 'NumberList') {
            newTable[j] = newTable[j].divide(nRepetitionsList[1]);
          }
        }

        newTable.push(nRepetitionsList[1]);
        break;
    }
    for(j = 0; newTable[j] != null; j++) {
      newTable[j] = newTable[j].getImproved();
    }
    return newTable.getImproved();
  };

  /**
   * counts pairs of elements in same positions in two lists (the result is the adjacent matrix of the network defined by pairs)
   * @param  {Table} table with at least two lists
   * @return {NumberTable}
   * tags:
   */
  TableOperators.getCountPairsMatrix = function(table) {
    if(table == null || table.length < 2 || table[0] == null || table[0][0] == null) return null;

    var list0 = table[0].getWithoutRepetitions();
    var list1 = table[1].getWithoutRepetitions();

    var matrix = new NumberTable(list1.length);

    list1.forEach(function(element1, i) {
      matrix[i].name = String(element1);
      list0.forEach(function(element0, j) {
        matrix[i][j] = 0;
      });
    });

    table[0].forEach(function(element0, i) {
      var element1 = table[1][i];
      matrix[list1.indexOf(element1)][list0.indexOf(element0)]++;
    });

    return matrix;
  };


  /**
   * filter a table selecting rows that have an element on one of its lists
   * @param  {Table} table
   * @param  {Number} nList list that could contain the element in several positions
   * @param  {Object} element
   *
   * @param {Boolean} keepRowIfElementIsPresent if true (default value) the row is selected if the list contains the given element, if false the row is discarded
   * @return {Table}
   * tags:filter
   */
  TableOperators.filterTableByElementInList = function(table, nList, element, keepRowIfElementIsPresent) {
    if(table == null ||  table.length <= 0 || nList == null) return;
    if(element == null) return table;


    var newTable = new Table();
    var i, j;

    newTable.name = table.name;

    for(j = 0; table[j] != null; j++) {
      newTable[j] = new List();
      newTable[j].name = table[j].name;
    }

    if(keepRowIfElementIsPresent){
      for(i = 0; table[0][i] != null; i++) {
        if(table[nList][i] == element) {
          for(j = 0; table[j] != null; j++) {
            newTable[j].push(table[j][i]);
          }
        }
      }
    } else {
      for(i = 0; table[0][i] != null; i++) {
        if(table[nList][i] != element) {
          for(j = 0; table[j] != null; j++) {
            newTable[j].push(table[j][i]);
          }
        }
      }
    }

    for(j = 0; newTable[j] != null; j++) {
      newTable[j] = newTable[j].getImproved();
    }

    return newTable;
  };

  /**
   * @todo finish docs
   */
  TableOperators.mergeDataTablesInList = function(tableList) {
    if(tableList.length < 2) return tableList;

    var merged = tableList[0];

    for(var i = 1; tableList[i] != null; i++) {
      merged = TableOperators.mergeDataTables(merged, tableList[i]);
    }

    return merged;
  };

  /**
   * creates a new table with an updated first List of elements and an added new numberList with the new values
   */
  TableOperators.mergeDataTables = function(table0, table1) {
    if(table1[0].length === 0) {
      var merged = table0.clone();
      merged.push(ListGenerators.createListWithSameElement(table0[0].length, 0));
      return merged;
    }

    var table = new Table();
    var list = ListOperators.concatWithoutRepetitions(table0[0], table1[0]);

    var nElements = list.length;

    var nNumbers0 = table0.length - 1;
    var nNumbers1 = table1.length - 1;

    var numberTable0 = new NumberTable();
    var numberTable1 = new NumberTable();

    var index;

    var i, j;

    for(i = 0; i < nElements; i++) {
      index = table0[0].indexOf(list[i]);
      if(index > -1) {
        for(j = 0; j < nNumbers0; j++) {
          if(i === 0) {
            numberTable0[j] = new NumberList();
            numberTable0[j].name = table0[j + 1].name;
          }
          numberTable0[j][i] = table0[j + 1][index];
        }
      } else {
        for(j = 0; j < nNumbers0; j++) {
          if(i === 0) {
            numberTable0[j] = new NumberList();
            numberTable0[j].name = table0[j + 1].name;
          }
          numberTable0[j][i] = 0;
        }
      }

      index = table1[0].indexOf(list[i]);
      if(index > -1) {
        for(j = 0; j < nNumbers1; j++) {
          if(i === 0) {
            numberTable1[j] = new NumberList();
            numberTable1[j].name = table1[j + 1].name;
          }
          numberTable1[j][i] = table1[j + 1][index];
        }
      } else {
        for(j = 0; j < nNumbers1; j++) {
          if(i === 0) {
            numberTable1[j] = new NumberList();
            numberTable1[j].name = table1[j + 1].name;
          }
          numberTable1[j][i] = 0;
        }
      }
    }

    table[0] = list;

    for(i = 0; numberTable0[i] != null; i++) {
      table.push(numberTable0[i]);
    }
    for(i = 0; numberTable1[i] != null; i++) {
      table.push(numberTable1[i]);
    }
    return table;
  };

  /**
   * From two DataTables creates a new DataTable with combined elements in the first List, and added values in the second
   * @param {Object} table0
   * @param {Object} table1
   * @return {Table}
   */
  TableOperators.fusionDataTables = function(table0, table1) {
    var table = table0.clone();
    var index;
    var element;
    for(var i = 0; table1[0][i] != null; i++) {
      element = table1[0][i];
      index = table[0].indexOf(element);
      if(index == -1) {
        table[0].push(element);
        table[1].push(table1[1][i]);
      } else {
        table[1][index] += table1[1][i];
      }
    }
    return table;
  };

  /**
   * @todo finish docs
   */
  TableOperators.completeTable = function(table, nRows, value) {
    value = value == null ? 0 : value;

    var newTable = new Table();
    newTable.name = table.name;

    var list;
    var newList;
    var j;

    for(var i = 0; i < table.length; i++) {
      list = table[i];
      newList = list == null ? ListOperators.getNewListForObjectType(value) : instantiateWithSameType(list);
      newList.name = list == null ? '' : list.name;
      for(j = 0; j < nRows; j++) {
        newList[j] = (list == null || list[j] == null) ? value : list[j];
      }
      newTable[i] = newList;
    }
    return newTable;
  };

  /**
   * filters a Table keeping the NumberLists
   * @param  {Table} table to filter<
   * @return {NumberTable}
   * tags:filter
   */
  TableOperators.getNumberTableFromTable = function(table) {
    if(table == null ||  table.length <= 0) {
      return null;
    }

    var i;
    var newTable = new NumberTable();
    newTable.name = table.name;
    for(i = 0; table[i] != null; i++) {
      if(table[i].type == "NumberList") newTable.push(table[i]);
    }
    return newTable;
  };

  /**
   * calculates de information gain of all variables in a table and a supervised variable
   * @param  {Table} variablesTable
   * @param  {List} supervised
   * @return {NumberList}
   * tags:ds
   */
  TableOperators.getVariablesInformationGain = function(variablesTable, supervised) {
    if(variablesTable == null) return null;

    var igs = new NumberList();
    variablesTable.forEach(function(feature) {
      igs.push(ListOperators.getInformationGain(feature, supervised));
    });
    return igs;
  };

  /**
   * @todo finish docs
   */
  TableOperators.splitTableByCategoricList = function(table, list) {
    if(table == null || list == null) return null;

    var childrenTable;
    var tablesList = new List();
    var childrenObject = {};

    list.forEach(function(element, i) {
      childrenTable = childrenObject[element];
      if(childrenTable == null) {
        childrenTable = new Table();
        childrenObject[element] = childrenTable;
        tablesList.push(childrenTable);
        table.forEach(function(list, j) {
          childrenTable[j] = new List();
          childrenTable[j].name = list.name;
        });
        childrenTable._element = element;
      }
      table.forEach(function(list, j) {
        childrenTable[j].push(table[j][i]);
      });
    });

    return tablesList;
  };

  /**
   * builds a decision tree based on a table made of categorical lists, a list (the values of a supervised variable), and a value from the supervised variable. The result is a tree that contains on its leaves different populations obtained by iterative filterings by category values, and that contain extremes probabilities for having or not the valu ein the supervised variable.
   * [!] this method only works with categorical lists (in case you have lists with numbers, find a way to simplify by ranges or powers)
   * @param  {Table} variablesTable predictors table
   * @param  {Object} supervised variable: list, or index (number) in the table (in which case the list will be removed from the predictors table)
   * @param {Object} supervisedValue main value in supervised list (associated with blue)
   *
   * @param {Number} min_entropy minimum value of entropy on nodes (0.2 default)
   * @param {Number} min_size_node minimum population size associated with node (10 default)
   * @param {Number} min_info_gain minimum information gain by splitting by best feature (0.002 default)
   * @param {Boolean} generatePattern generates a pattern of points picturing proprtion of followed class in node
   * @param {ColorScale} colorScale to assign color associated to probability (default: blueToRed)
   * @return {Tree} tree with aditional information on its nodes, including: probablity, color, entropy, weight, lift
   * tags:ds
   */
  TableOperators.buildDecisionTree = function(variablesTable, supervised, supervisedValue, min_entropy, min_size_node, min_info_gain, generatePattern, colorScale){
    if(variablesTable == null ||  supervised == null || supervisedValue == null) return;

    if(colorScale==null) colorScale = ColorScales.blueWhiteRed;

    if(typeOf(supervised)=='number'){
      var newTable = variablesTable.getWithoutElementAtIndex(supervised);
      supervised = variablesTable[supervised];
      variablesTable = newTable;
    }

    min_entropy = min_entropy == null ? 0.2 : min_entropy;
    min_size_node = min_size_node || 10;
    min_info_gain = min_info_gain || 0.002;

    var indexes = NumberListGenerators.createSortedNumberList(supervised.length);
    var tree = new Tree();

    TableOperators._buildDecisionTreeNode(tree, variablesTable, supervised, 0, min_entropy, min_size_node, min_info_gain, null, null, supervisedValue, indexes, generatePattern, colorScale);

    return tree;
  };


  /**
   * @ignore
   */
  TableOperators._buildDecisionTreeNode = function(tree, variablesTable, supervised, level, min_entropy, min_size_node, min_info_gain, parent, value, supervisedValue, indexes, generatePattern, colorScale) {
    //if(level < 4) c.l('\nlevel', level);
    var entropy = ListOperators.getListEntropy(supervised, supervisedValue);

    //if(level < 4) c.l('entropy, min_entropy', entropy, min_entropy);
    var maxIg = 0;
    var iBestFeature = 0;
    var informationGains = 0;

    if(entropy >= min_entropy) {
      informationGains = TableOperators.getVariablesInformationGain(variablesTable, supervised);
      informationGains.forEach(function(ig, i){
        if(ig > maxIg) {
          maxIg = ig;
          iBestFeature = i;
        }
      });
    }

    var subDivide = entropy >= min_entropy && maxIg > min_info_gain && supervised.length >= min_size_node;

    var id = tree.nodeList.getNewId();
    var name = (value == null ? '' : value + ':') + (subDivide ? variablesTable[iBestFeature].name : 'P=' + supervised._biggestProbability + '(' + supervised._mostRepresentedValue + ')');
    var node = new Node(id, name);

    tree.addNodeToTree(node, parent);

    if(parent == null) {
      tree.informationGainTable = new Table();
      tree.informationGainTable[0] = variablesTable.getNames();
      if(informationGains) {
        tree.informationGainTable[1] = informationGains.clone();
        tree.informationGainTable = tree.informationGainTable.getListsSortedByList(informationGains, false);
      }
    }

    node.entropy = entropy;
    node.weight = supervised.length;
    node.supervised = supervised;
    node.indexes = indexes;
    node.value = value;
    node.mostRepresentedValue = supervised._mostRepresentedValue;
    node.biggestProbability = supervised._biggestProbability;
    node.valueFollowingProbability = supervised._P_valueFollowing;
    node.lift = node.valueFollowingProbability / tree.nodeList[0].valueFollowingProbability; //Math.log(node.valueFollowingProbability/tree.nodeList[0].valueFollowingProbability)/Math.log(2);


    // if(level < 4) {
    //   c.l('supervised.countElement(supervisedValue)', supervised.countElement(supervisedValue));
    //   c.l('value', value);
    //   c.l('name', name);
    //   c.l('supervised.name', supervised.name);
    //   c.l('supervised.length', supervised.length);
    //   c.l('supervisedValue', supervisedValue);
    //   c.l('supervised._biggestProbability, supervised._P_valueFollowing', supervised._biggestProbability, supervised._P_valueFollowing);
    //   c.l('node.valueFollowingProbability (=supervised._P_valueFollowing):', node.valueFollowingProbability);
    //   c.l('tree.nodeList[0].valueFollowingProbability', tree.nodeList[0].valueFollowingProbability);
    //   c.l('node.biggestProbability (=_biggestProbability):', node.biggestProbability);
    //   c.l('node.mostRepresentedValue:', node.mostRepresentedValue);
    //   c.l('node.mostRepresentedValue==supervisedValue', node.mostRepresentedValue == supervisedValue);
    // }

    node._color = colorScale(node.valueFollowingProbability); //TableOperators._decisionTreeColorScale(1 - node.valueFollowingProbability, colorScale);

    if(generatePattern) {
      var newCanvas = document.createElement("canvas");
      newCanvas.width = 150;
      newCanvas.height = 100;
      var newContext = newCanvas.getContext("2d");
      newContext.clearRect(0, 0, 150, 100);

      TableOperators._decisionTreeGenerateColorsMixture(newContext, 150, 100, ['blue', 'red'],
  			node.mostRepresentedValue==supervisedValue?
  				[Math.floor(node.biggestProbability*node.weight), Math.floor((1-node.biggestProbability)*node.weight)]
  				:
  				[Math.floor((1-node.biggestProbability)*node.weight), Math.floor(node.biggestProbability*node.weight)]
      );

      var img = new Image();
      img.src = newCanvas.toDataURL();
      node.pattern = newContext.createPattern(img, "repeat");
    }


    if(!subDivide){
      return node;
    }

    node.bestFeatureName = variablesTable[iBestFeature].name;
    node.bestFeatureName = node.bestFeatureName === "" ? "list "+ iBestFeature:node.bestFeatureName;
    node.iBestFeature = iBestFeature;
    node.informationGain = maxIg;

    var expanded = variablesTable.concat([supervised, indexes]);

    var tables = TableOperators.splitTableByCategoricList(expanded, variablesTable[iBestFeature]);
    var childTable;
    var childSupervised;
    var childIndexes;

    tables.forEach(function(expandedChild) {
      childTable = expandedChild.getSubList(0, expandedChild.length - 3);
      childSupervised = expandedChild[expandedChild.length - 2];
      childIndexes = expandedChild[expandedChild.length - 1];
      TableOperators._buildDecisionTreeNode(tree, childTable, childSupervised, level + 1, min_entropy, min_size_node, min_info_gain, node, expandedChild._element, supervisedValue, childIndexes, generatePattern, colorScale);
    });

    node.toNodeList = node.toNodeList.getSortedByProperty('valueFollowingProbability', false);

    return node;
  };

  // TableOperators._decisionTreeColorScale = function(value, colorScale) {
  //   if(colorScale) return colorScale(value);
  //   return ColorScales.blueWhiteRed

  //   // var rr = value < 0.5 ? Math.floor(510 * value) : 255;
  //   // var gg = value < 0.5 ? Math.floor(510 * value) : Math.floor(510 * (1 - value));
  //   // var bb = value < 0.5 ? 255 : Math.floor(510 * (1 - value));

  //   // return 'rgb(' + rr + ',' + gg + ',' + bb + ')';
  // };

  /**
   * @ignore
   */
  TableOperators._decisionTreeGenerateColorsMixture = function(ctxt, width, height, colors, weights){
    var x, y, i; //, rgb;
    var allColors = ListGenerators.createListWithSameElement(weights[0], colors[0]);

    for(i = 1; colors[i] != null; i++) {
      allColors = allColors.concat(ListGenerators.createListWithSameElement(weights[i], colors[i]));
    }

    for(x = 0; x < width; x++) {
      for(y = 0; y < height; y++) {
        i = (x + y * width) * 4;
        ctxt.fillStyle = allColors.getRandomElement();
        ctxt.fillRect(x, y, 1, 1);
      }
    }
  };


  /**
   * Generates a string containing details about the current state
   * of the Table. Useful for outputing to the console for debugging.
   * @param {Table} table Table to generate report on.
   * @param {Number} level If greater then zero, will indent to that number of spaces.
   * @return {String} Description String.
   */
  TableOperators.getReport = function(table, level) {
    var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
    var lengths = table.getLengths();
    var minLength = lengths.getMin();
    var maxLength = lengths.getMax();
    var averageLength = (minLength + maxLength) * 0.5;
    var sameLengths = minLength == maxLength;

    var text = level > 0 ? (ident + "////report of instance of Table////") : "///////////report of instance of Table//////////";

    if(table.length === 0) {
      text += ident + "this table has no lists";
      return text;
    }

    text += ident + "name: " + table.name;
    text += ident + "type: " + table.type;
    text += ident + "number of lists: " + table.length;

    text += ident + "all lists have same length: " + (sameLengths ? "true" : "false");

    if(sameLengths) {
      text += ident + "lists length: " + table[0].length;
    } else {
      text += ident + "min length: " + minLength;
      text += ident + "max length: " + maxLength;
      text += ident + "average length: " + averageLength;
      text += ident + "all lengths: " + lengths.join(", ");
    }

    var names = table.getNames();
    var types = table.getTypes();

    text += ident + "--";
    names.forEach(function(name, i){
      text += ident + i + ": " + name + " ["+TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"]";
    });
    text += ident + "--";

    var sameTypes = types.allElementsEqual();
    if(sameTypes) {
      text += ident + "types of all lists: " + types[0];
    } else {
      text += ident + "types: " + types.join(", ");
    }
    text += ident + "names: " + names.join(", ");

    if(table.length < 101) {
      text += ident + ident + "--------lists reports---------";

      var i;
      for(i = 0; table[i] != null; i++) {
        text += "\n" + ident + ("(" + (i) + "/0-" + (table.length - 1) + ")");
        try{
           text += ListOperators.getReport(table[i], 1);
        } catch(err){
          text += ident + "[!] something wrong with list " + err;
        }
      }
    }

    if(table.length == 2) {
      text += ident + ident + "--------lists comparisons---------";
      if(table[0].type=="NumberList" && table[1].type=="NumberList"){
        text += ident + "covariance:" + NumberListOperators.covariance(table[0], table[1]);
        text += ident + "Pearson product moment correlation: " + NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]);
      } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
        var nUnion = ListOperators.union(table[0], table[1]).length;
        text += ident + "union size: " + nUnion;
        var intersected = ListOperators.intersection(table[0], table[1]);
        var nIntersection = intersected.length;
        text += ident + "intersection size: " + nIntersection;

        if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
          text += ident + "[!] both lists contain the same non repeated elements";
        } else {
          if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
          if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
        }
        text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
      }
      //check for 1-1 matches, number of pairs, categorical, sub-categorical
      var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

      switch(subCategoryCase){
        case 0:
          text += ident + "no categorical relation found between lists";
          break;
        case 1:
          text += ident + "[!] both lists are categorical identical";
          break;
        case 2:
          text += ident + "[!] first list is subcategorical to second list";
          break;
        case 3:
          text += ident + "[!] second list is subcategorical to first list";
          break;
      }

      if(subCategoryCase!=1){
        text += ident + "information gain when segmenting first list by the second: "+ListOperators.getInformationGain(table[0], table[1]);
        text += ident + "information gain when segmenting second list by the first: "+ListOperators.getInformationGain(table[1], table[0]);
      }
    }

    ///add ideas to: analyze, visualize

    return text;
  };

  /**
   * Generates a string containing details about the current state
   * of the Table. Useful for outputing to the console for debugging.
   * @param {Table} table Table to generate report on.
   * @param {Number} level If greater then zero, will indent to that number of spaces.
   * @return {String} Description String.
   */
  TableOperators.getReportHtml = function(table,level) {
    var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
    var lengths = table.getLengths();
    var minLength = lengths.getMin();
    var maxLength = lengths.getMax();
    var averageLength = (minLength + maxLength) * 0.5;
    var sameLengths = minLength == maxLength;

    var text = "<b>" +( level > 0 ? (ident + "<font style=\"font-size:16px\">table report</f>") : "<font style=\"font-size:18px\">table report</f>" ) + "</b>";

    if(table.length === 0) {
      text += ident + "this table has no lists";
      return text;
    }

    if(table.name){
      text += ident + "name: <b>" + table.name + "</b>";
    } else {
      text += ident + "<i>no name</i>";
    }
    text += ident + "type: <b>" + table.type + "</b>";
    text += ident + "number of lists: <b>" + table.length + "</b>";

    text += ident + "all lists have same length: <b>" + (sameLengths ? "true" : "false") + "</b>";

    if(sameLengths) {
      text += ident + "lists length: <b>" + table[0].length + "</b>";
    } else {
      text += ident + "min length: <b>" + minLength + "</b>";
      text += ident + "max length: <b>" + maxLength + "</b>";
      text += ident + "average length: <b>" + averageLength + "</b>";
      text += ident + "all lengths: <b>" + lengths.join(", ") + "</b>";
    }

    var names = table.getNames();
    var types = table.getTypes();

    text += "<hr>";
    names.forEach(function(name, i){
      text += ident + "<font style=\"font-size:10px\">" +i + ":</f><b>" + name + "</b> <font color=\""+getColorFromDataModelType(types[i])+ "\">" + TYPES_SHORT_NAMES_DICTIONARY[types[i]]+"</f>";
    });
    text += "<hr>";

    var sameTypes = types.allElementsEqual();
    if(sameTypes) {
      text += ident + "types of all lists: " + "<b>" + types[0] + "</b>";
    } else {
      text += ident + "types: ";
      types.forEach(function(type, i){
        text += "<b><font color=\""+getColorFromDataModelType(type)+ "\">" + type+"</f></b>";
        if(i<types.length-1) text += ", ";
      });
    }
    text += "<br>" + ident + "names: <b>" + names.join("</b>, <b>") + "</b>";


    //list by list

    if(table.length < 501) {
      text += "<hr>";
      text +=  ident + "<font style=\"font-size:16px\"><b>lists reports</b></f>";

      var i;
      for(i = 0; table[i] != null; i++) {
        text += "<br>" + ident + i + ": " + (table[i].name?"<b>"+table[i].name+"</b>":"<i>no name</i>");
        try{
           text += ListOperators.getReportHtml(table[i], 1);
        } catch(err){
          text += ident + "[!] something wrong with list <font style=\"font-size:10px\">:" + err + "</f>";
          console.log('getReportHtml err', err);
        }
      }
    }

    if(table.length == 2) {//TODO:finish
      text += "<hr>";
      text += ident + "<b>lists comparisons</b>";
      if(table[0].type=="NumberList" && table[1].type=="NumberList"){
        text += ident + "covariance:" + NumberOperators.numberToString(NumberListOperators.covariance(table[0], table[1]), 4);
        text += ident + "Pearson product moment correlation: " + NumberOperators.numberToString(NumberListOperators.pearsonProductMomentCorrelation(table[0], table[1]), 4);
      } else if(table[0].type!="NumberList" && table[1].type!="NumberList"){
        var nUnion = ListOperators.union(table[0], table[1]).length;
        text += ident + "union size: " + nUnion;
        var intersected = ListOperators.intersection(table[0], table[1]);
        var nIntersection = intersected.length;
        text += ident + "intersection size: " + nIntersection;

        if(table[0]._freqTable[0].length == nUnion && table[1]._freqTable[0].length == nUnion){
          text += ident + "[!] both lists contain the same non repeated elements";
        } else {
          if(table[0]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in first list also occur on second list";
          if(table[1]._freqTable[0].length == nIntersection) text += ident + "[!] all elements in second list also occur on first list";
        }
        text += ident + "Jaccard distance: " + (1 - (nIntersection/nUnion));
      }
      //check for 1-1 matches, number of pairs, categorical, sub-categorical
      var subCategoryCase = ListOperators.subCategoricalAnalysis(table[0], table[1]);

      switch(subCategoryCase){
        case 0:
          text += ident + "no categorical relation found between lists";
          break;
        case 1:
          text += ident + "[!] both lists are categorical identical";
          break;
        case 2:
          text += ident + "[!] first list is subcategorical to second list";
          break;
        case 3:
          text += ident + "[!] second list is subcategorical to first list";
          break;
      }

      if(subCategoryCase!=1){
        text += ident + "information gain when segmenting first list by the second: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[0], table[1]), 4);
        text += ident + "information gain when segmenting second list by the first: "+NumberOperators.numberToString( ListOperators.getInformationGain(table[1], table[0]), 4);
      }
    }

    ///add ideas to: analyze, visualize

    return text;
  };

  TableOperators.getReportObject = function() {}; //TODO

  /**
   * @classdesc Table Generators
   *
   * @namespace
   * @category basics
   */
  function TableGenerators() {}
  /**
   * @todo finish docs
   */
  TableGenerators.createTableWithSameElement = function(nLists, nRows, element) {
    var table = new Table();
    for(var i = 0; i < nLists; i++) {
      table[i] = ListGenerators.createListWithSameElement(nRows, element);
    }
    return table.getImproved();
  };

  /**
   * @classdesc Tools to convert Tables to other data types
   *
   * @namespace
   * @category basics
   */
  function TableConversions() {}
  /**
   * Convert a Table into an Object or Array of objects
   * @param {Object} table to be converted
   *
   * @param {List} list of field names to include (by default will take all from table)
   * @return {Object} containing list of rows from input Table
   * tags:decoder,dani
   */
  TableConversions.TableToObject = function(table, fields) { // To-Do: should return a List instead of Array?
      if(!table)
        return;

      // If no field names supplied, take them from first element
      if(!fields)
      {
        fields = table.getNames();
      }
      var result = [];
      for(var i = 0; i < table[0].length; i++) {
        var row = {};
        for(var f = 0; f < fields.length; f++)
        {
          row[fields[f]] = table[f][i];
        }
        result.push(row);
      }
      return {
        array: result
      };
    };

  /**
   * @classdesc NumberTable Operators
   *
   * a NumberTable as a matrix: has n lists, each with m values, being a mxn matrix
   * the following NumberTable:
   * [ [0, 4, 7], [3, 8, 1] ]
   * is notated:
   * | 0   4   7 |
   * | 3   8   1 |
   *
   * @namespace
   * @category numbers
   */
  function NumberTableOperators() {}
  /**
   * normalizes the table to its maximal value
   *
   * @param {NumberTable} numbertable NumberTable.
   * @param  {Number} factor optional factor
   * @return {NumberTable}
   * tags:normalization
   */
  NumberTableOperators.normalizeTableToMax = function(numbertable, factor) {
    factor = factor == null ? 1 : factor;

    var newTable = new NumberTable();
    var i;
    var antimax = factor / numbertable.getMax();
    for(i = 0; numbertable[i] != null; i++) {
      newTable[i] = numbertable[i].factor(antimax);
    }
    newTable.name = numbertable.name;
    return newTable;
  };

  /**
   * returns a table with having normalized all the numberLists
   *
   * @param {NumberTable} numbertable NumberTable.
   * @param  {factor} factor optional factor
   * @return {NumberTable}
   * tags:normalization
   */
  NumberTableOperators.normalizeLists = function(numbertable, factor) {
    factor = factor == null ? 1 : factor;

    var newTable = new NumberTable();
    var i;
    for(i = 0; numbertable[i] != null; i++) {
      var numberlist = numbertable[i];
      newTable[i] = NumberListOperators.normalized(numberlist, factor);
    }
    newTable.name = numbertable.name;
    return newTable;
  };

  /**
   * @todo write docs
   * @param {NumberTable} numbertable NumberTable.
   */
  NumberTableOperators.normalizeListsToMax = function(numbertable, factorValue) {
    var newTable = new NumberTable();
    var numberlist;
    var l = numbertable.length;
    var i;
    for(i = 0; i<l; i++) {
      numberlist = numbertable[i];
      newTable[i] = NumberListOperators.normalizedToMax(numberlist, factorValue);
    }
    newTable.name = numbertable.name;
    return newTable;
  };

  /**
   * @todo write docs
   * @param {NumberTable} numbertable NumberTable.
   */
  NumberTableOperators.normalizeListsToSum = function(numbertable) {
    var newTable = new NumberTable();
    var numberlist;
    var l = numbertable.length;
    var i;
    for(i = 0; i<l; i++) {
      numberlist = numbertable[i];
      newTable[i] = NumberListOperators.normalizedToSum(numberlist);
    }
    newTable.name = numbertable.name;
    return newTable;
  };

  /**
   * smooth numberLists by calculating averages with neighbors
   * @param  {NumberTable} numberTable
   *
   * @param  {Number} intensity weight for neighbors in average (0<=intensity<=0.5)
   * @param  {Number} nIterations number of ieterations
   * @return {List} numberList of indexes, or list of numberTables
   * tags:statistics
   */
  NumberTableOperators.averageSmootherOnLists = function(numberTable, intensity, nIterations) {
    if(numberTable == null) return;

    intensity = intensity || 0.5;
    nIterations = nIterations || 1;

    var newNumberTable = new NumberTable();
    newNumberTable.name = numberTable.name;
    numberTable.forEach(function(nL, i) {
      newNumberTable[i] = NumberListOperators.averageSmoother(numberTable[i], intensity, nIterations);
    });
    return newNumberTable;
  };


  /**
   * return k means for k clusters of rows (waiting to be tested)
   * @param  {NumberTable} numberTable
   * @param  {Number} k number of means
   *
   * @param  {Number} returnIndexesMode return mode:<br>0:return list of lists of indexes of rows (default)<br>1:return a list of number of mean, k different values, one per row<br>2:return a list of categorical colors, k different colors, one per row<br>3:return means<br>4:return list of sub-tables<br>5:return object with all the previous
   * @param  {Number} number of iterations (1000 by default)
   * @return {Object} result (list, numberList, colorList, numberTable or object)
   * tags:statistics,nontested
   */
  NumberTableOperators.kMeans = function(numberTable, k, returnIndexesMode, N){
    if(numberTable == null || numberTable[0]==null || k == null || k <= 0 || numberTable.getLengths().getInterval().getAmplitude()!==0) return null;

    returnIndexesMode = returnIndexesMode==null?0:returnIndexesMode;
    N = (N==null || (N<=0))?1000:N;

    var clusters = new NumberTable();// = returnIndexesMode?new NumberList():new NumberTable();

    var i, j, l;
    var jK;
    var row;
    var d;
    var dMin;
    var n;
    var means = new NumberTable();
    var length = numberTable.length;
    var nRows = numberTable[0].length;
    var rows = numberTable.getTransposed();
    var initdMin = 99999999;
    var nRowsMean;
    var meanRowsIndexes;
    var newMean;

    if(k>=rows.length) return rows;

    var equalToPreviousMean = function(row, meansSoFar){
      var kSoFar = meansSoFar.length;
      for(i=0; i<kSoFar; i++){
        if( ListOperators.containSameElements(row, meansSoFar[i]) ) return true;
      }
      return false;
    };


    //initial means (Forgy method, picking random rows)

    for(j = 0; j < k; j++) {
      row = rows.getRandomElement();

      while(equalToPreviousMean(row, means)){
        row = rows.getRandomElement();
      }

      means[j] = row.clone();

      //console.log('initial mean', means[j].join(', '));
    }



    for(n = 0; n < N; n++) {
      //iterations

      //clean clusters
      for(j = 0; j < k; j++) {
        clusters[j] = new NumberList();
      }

      //for each row finds its closer mean
      for(i = 0; i<nRows; i++) {
        row = rows[i];
        dMin = initdMin;
        jK = 0;

        for(j = 0; j < k; j++) {
          d = NumberListOperators.distance(row, means[j]);
          if(d < dMin) {
            dMin = d;
            jK = j;
          }
        }

        //console.log('i, jK', i, jK);

        //closer mean to row i is in index jK
        //row i assigned to cluster jK
        clusters[jK].push(i);
      }

      //console.log('clusters.getLengths()', clusters.getLengths());

      //for each mean it calculates its new values, based on its recently assigned rows
      for(j=0; j<k; j++){
        meanRowsIndexes = clusters[j];
        nRowsMean = meanRowsIndexes.length;
        means[j] = new NumberList();

        newMean = means[j];

        row = rows[meanRowsIndexes[0]];
        //console.log(j, meanRowsIndexes[0], row);

        //each new mean is the average of its rows values
        for(l=0; l<length; l++){
          newMean[l] = row[l]/nRowsMean;
        }
        for(i=1; i<nRowsMean; i++){
          row = rows[meanRowsIndexes[i]];
          for(l=0; l<length; l++){
              newMean[l] += row[l]/nRowsMean;
          }
        }

      }

    }

    // console.log('clusters.getLengths()', clusters.getLengths());
    // console.log('clusters', clusters);

    //prepare results

    var meanNumber;
    var cluster;
    var sizeCluster;


    if(returnIndexesMode==1 || returnIndexesMode==5){
      meanNumber = new NumberList();
      for(i=0; i<k; i++){
        cluster = clusters[i];
        sizeCluster = cluster.length;
        for(j=0; j<sizeCluster; j++){
          meanNumber[cluster[j]] = i;
        }
      }
    }


    var colors;

    if(returnIndexesMode==2 || returnIndexesMode==5){
      colors = new ColorList();
      var catColors = ColorListGenerators.createDefaultCategoricalColorList(k);
      for(i=0; i<k; i++){
        cluster = clusters[i];
        sizeCluster = cluster.length;
        for(j=0; j<sizeCluster; j++){
          colors[cluster[j]] = catColors[i];
        }
      }
    }

    var subTables = new List();

    if(returnIndexesMode==4 || returnIndexesMode==5){
      for(i=0; i<k; i++){
        subTables[i] = new NumberTable();
        subTables[i].name = 'subtable_'+i;
        cluster = clusters[i];
        sizeCluster = cluster.length;
        for(j=0; j<sizeCluster; j++){
          subTables[i].push(rows[cluster[j]]);
        }
        subTables[i] = subTables[i].getTransposed();
      }
    }

    switch(returnIndexesMode){
      case 0://return list of indexes of rows
        return clusters;
      case 1://return a list of number of mean, k different values, one per row
        return meanNumber;
      case 2://return a list of categorical colors, k different colors, one per row
        return colors;
      case 3://return means
        return means;
      case 4://return list of sub-tables
        return subTables;
      case 5://return object with all the previous
        return {indexes:clusters, means:means, meanNumber:meanNumber, colors:colors, subtables:subTables};
    }

    return null;
  };

  /**
   * builds a k-nearest neighbors function, that calculates a class membership or a regression, taking the vote or average of the k nearest instances, using Euclidean distance, and applies it to a list of points, see: http://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm
   * <br>[!] regression still not built
   * @param  {NumberTable} numberTable
   * @param  {List} propertyList categories or values
   *
   * @param  {Polygon} vectorList optional list of points to be tested, if provided classes or regressions are calculated, if not the function is returned
   * @param  {Number} k number of neighbors
   * @param  {Boolean} calculateClass if true propertyList is a list of categories for membership calculation, if false a numberList for regression
   * @param {Number} matrixN if provided, the result will be a numberTable with values in a grid in the numberTable ranges
   * @return {Object} kNN Function or a matrix (grid) of values if matrixN is provided, or classes or values from points if vectorList is provided
   * tags:ds
   */
  NumberTableOperators.kNN = function(numberTable, propertyList, vectorList, k, calculateClass, matrixN) {
    if(numberTable == null ||  propertyList == null) return null;

    k = k || 1;
    calculateClass = calculateClass == null ? true : calculateClass;

    var i, j;

    var fKNN = function(vector) {
      var i, j;
      var d2;

      var table = new NumberTable();

      table[0] = new NumberList();
      table[1] = new NumberList();
      numberTable[0].forEach(function(val, i) {//TODO: make it more efficient by using for
        d2 = 0;
        numberTable.forEach(function(nList, j) {
          d2 += Math.pow(nList[i] - vector[j], 2);
        });
        if(table[1].length < k || table[1][k - 1] > d2) {
          var inserted = false;
          for(j = 0; table[1][j] < k; j++) {
            if(d2 < table[1][j]) {
              table[1].splice(j, 0, d2);
              table[0].splice(j, 0, i);
              inserted = true;
              break;
            }
          }
          if(!inserted && table[1].length < k) {
            table[1].push(d2);
            table[0].push(i);
          }
        }
      });

      if(calculateClass) {
        var classTable = new Table();
        classTable[0] = new List();
        classTable[1] = new NumberList();
        for(i = 0; i < k; i++) {
          var clas = propertyList[table[0][i]];
          var index = classTable[0].indexOf(clas);
          if(index == -1) {
            classTable[0].push(clas);
            classTable[1].push(1);
          } else {
            classTable[1][index]++;
          }
        }
        var max = classTable[1][0];
        var iMax = 0;
        classTable[1].slice(1).forEach(function(val, i) {
          if(val > max) {
            max = val;
            iMax = i + 1;
          }
        });
        return classTable[0][iMax];
      }

      var val;
      var combination = 0;
      var sumD = 0;
      for(i = 0; i < k; i++) {
        val = propertyList[table[0][i]];
        combination += val / (table[1][i] + 0.000001);
        sumD += (1 / (table[1][i] + 0.000001));
      }

      //console.log('vector:', vector[0], vector[1], 'colsest:', Math.floor(100000000 * table[1][0]), Math.floor(100000000 * table[1][1]), 'categories', propertyList[table[0][0]], propertyList[table[0][1]], 'result', combination / sumD);

      return combination / sumD;

      //regression
      //…
    };

    if(vectorList == null) {

      if(matrixN != null && matrixN > 0) {
        var propertiesNumbers = {};
        var n = 0;

        propertyList.forEach(function(val) {
          if(propertiesNumbers[val] == null) {
            propertiesNumbers[val] = n;
            n++;
          }
        });

        var p;
        var matx = new NumberTable();
        var ix = numberTable[0].getMinMaxInterval();
        var minx = ix.x;
        var kx = ix.getAmplitude() / matrixN;
        var iy = numberTable[1].getMinMaxInterval();
        var miny = iy.x;
        var ky = iy.getAmplitude() / matrixN;

        for(i = 0; i < matrixN; i++) {
          matx[i] = new NumberList();

          for(j = 0; j < matrixN; j++) {
            p = [
              minx + kx * i,
              miny + ky * j
            ];

            fKNN(p);

            matx[i][j] = calculateClass ? propertiesNumbers[fKNN(p)] : fKNN(p);
          }
        }
        //return matrix
        return matx;
      }

      //return Function
      return fKNN;
    }

    var results = instantiateWithSameType(propertyList);

    vectorList.forEach(function(vector) {
      results.push(fKNN(vector));
    });

    //return results
    return results;
  };


  /**
   * calculates the matrix product of two Numbertables
   * @param  {NumberTable} numberTable0 first numberTable
   * @param  {NumberTable} numberTable1 second numberTable
   * @return {NumberTable} result
   */
  NumberTableOperators.product = function(numberTable0, numberTable1){
    if(numberTable0==null || numberTable1==null) return;
    var n = numberTable0.length;
    var m = numberTable0[0].length;

    if(n === 0 || m === 0 || n!=numberTable1[0].length || m!=numberTable1.length) return;


    var newTable = new NumberTable();
    var i, j, k;
    var val;

    for(i=0; i<n; i++){
      newTable[i] = new NumberList();
      for(j=0; j<n; j++){
        val = 0;
        for(k=0; k<m; k++){
          val+=numberTable0[i][k]*numberTable1[k][j];
        }
        newTable[i][j] = val;
      }
    }

    return newTable;
  };



  /**
   * calculates the covariance matrix
   * @param  {NumberTable} numberTable
   * @return {NumberTable}
   * tags:statistics
   */
  NumberTableOperators.getCovarianceMatrix = function(numberTable){//TODO:build more efficient method
    if(numberTable==null) return;
    return NumberTableOperators.product(numberTable, numberTable.getTransposed()).factor(1/numberTable.length);
  };

  /**
   * @classdesc NumberTable Flow Operators
   *
   * @namespace
   * @category numbers
   */
  function NumberTableFlowOperators() {}
  NumberTableFlowOperators.getFlowTable = function(numberTable, normalized, include0s) {
    if(numberTable == null) return;

    normalized = normalized || false;
    var nElements = numberTable.length;
    var nRows = numberTable[0].length;
    var numberList;
    var minList = new NumberList();
    var maxList = new NumberList();
    var sums = new NumberList();
    var minInRow;
    var maxInRow;
    var sumInRow;
    var MAX = -9999999;
    var MIN = 9999999;
    var MAXSUMS = -9999999;
    var i, j;
    for(i = 0; i < nRows; i++) {
      minInRow = 9999999; //TODO: what's the max Number?
      maxInRow = -9999999;
      sumInRow = 0;
      for(j = 0; j < nElements; j++) {
        numberList = numberTable[j];
        if(numberList.length != nRows) return;

        maxInRow = Math.max(maxInRow, numberList[i]);
        minInRow = Math.min(minInRow, numberList[i]);
        sumInRow += numberList[i];
      }
      minList.push(minInRow);
      maxList.push(maxInRow);
      sums.push(sumInRow);
      MIN = Math.min(MIN, minInRow);
      MAX = Math.max(MAX, maxInRow);
      MAXSUMS = Math.max(MAXSUMS, sumInRow);
    }

    var dMINMAX = MAXSUMS - MIN;
    var flowTable = new NumberTable();
    var flowNumberList;
    var minToNormalize;
    var maxToNormalize;

    var include0Add = include0s ? 1 : 0;


    if(normalized && include0s) {
      flowTable = new NumberTable(numberTable.length + 1);

      numberTable[0].forEach(function() {
        flowTable[0].push(0);
      });

      numberTable.forEach(function(list, iList) {
        list.forEach(function(val, j) {
          var sum = sums[j];
          flowTable[iList + 1][j] = val / (sum === 0 ? 0.00001 : sum) + flowTable[iList][j];
        });
      });

      return flowTable;
    }

    flowTable = new NumberTable();

    if(!normalized) {
      minToNormalize = MIN;
      maxToNormalize = dMINMAX;
    } else {
      minToNormalize = Math.max(MIN, 0);
    }
    for(i = 0; i < nElements; i++) {
      flowNumberList = new NumberList();
      flowTable.push(flowNumberList);
    }
    if(include0s) flowTable.push(new NumberList());

    for(i = 0; i < nRows; i++) {
      numberList = numberTable[0];
      if(normalized) {
        maxToNormalize = sums[i] - minToNormalize;
      }
      if(include0s) {
        flowTable[0][i] = 0;
      }
      if(maxToNormalize === 0) maxToNormalize = 0.00001;
      flowTable[include0Add][i] = (numberList[i] - minToNormalize) / maxToNormalize;
      for(j = 1; j < nElements; j++) {
        numberList = numberTable[j];
        flowTable[j + include0Add][i] = ((numberList[i] - minToNormalize) / maxToNormalize) + flowTable[j - 1 + include0Add][i];
      }
    }
    return flowTable;
  };

  /**
   * @todo finish docs
   */
  NumberTableFlowOperators.getFlowTableIntervals = function(numberTable, normalized, sorted, stacked) {
    if(numberTable == null) return null;

    var table = NumberTableFlowOperators.getFlowTable(numberTable, normalized, true);

    var intervalTable = new Table();
    var i, j;

    var nElements = table.length;
    var nRows = table[0].length;

    var intervalList;

    var maxCols = new NumberList();

    var numberList;
    for(i = 1; i < nElements; i++) {
      numberList = table[i];
      intervalList = new List();
      intervalTable[i - 1] = intervalList;
      for(j = 0; j < nRows; j++) {
        intervalList.push(new Interval(table[i - 1][j], table[i][j]));
        if(i == nElements - 1) maxCols[j] = table[i][j];
      }

    }

    var interval;
    if(sorted) {
      var amplitudes;
      var yy;
      for(j = 0; j < nRows; j++) {
        amplitudes = new NumberList();
        intervalList = intervalTable[i];
        for(i = 0; i < nElements - 1; i++) {
          amplitudes.push(intervalTable[i][j].getAmplitude());
        }
        var indexes = amplitudes.getSortIndexes();

        yy = (normalized || stacked) ? 0 : (1 - maxCols[j]) * 0.5;

        for(i = 0; i < nElements - 1; i++) {
          interval = intervalTable[indexes[i]][j];
          interval.y = yy + interval.getAmplitude();
          interval.x = yy;
          yy = interval.y;
        }
      }
    } else if(!normalized) {
      for(j = 0; j < nRows; j++) {
        for(i = 0; i < nElements - 1; i++) {
          interval = intervalTable[i][j];
          if(stacked) {
            intervalTable[i][j].x = 1 - intervalTable[i][j].x;
            intervalTable[i][j].y = 1 - intervalTable[i][j].y;
          } else {
            intervalTable[i][j] = interval.add((1 - maxCols[j]) * 0.5);
          }

        }
      }
    }

    return intervalTable;
  };

  /**
   * @classdesc NumberTable Conversions
   *
   * @namespace
   * @category numbers
   */
  function NumberTableConversions() {}
  /**
   * converts a numberTable with at least two lists into a Polygon
   *
   * @param  {NumberTable} numberTable with at least two numberLists
   * @return {Polygon}
   * tags:conversion
   */
  NumberTableConversions.numberTableToPolygon = function(numberTable) {
    if(numberTable.length < 2) return null;

    var i;
    var n = Math.min(numberTable[0].length, numberTable[1].length);
    var polygon = new _Polygon();

    for(i = 0; i < n; i++) {
      polygon[i] = new _Point(numberTable[0][i], numberTable[1][i]);
    }

    return polygon;
  };




  /**
   * Converts NumberTable to a {@link Network}.
   *
   * @param {NumberTable} numberTable to convert.
   * @param {Number} method Method to use. Currently only method 0 implemented
   * @param {Number} tolerance Defaults to 0.
   * @return {Network}
   */
  NumberTableConversions.numberTableToNetwork = function(numberTable, method, tolerance) {
    tolerance = tolerance == null ? 0 : tolerance;

    var network = new Network();

    var list0;
    var list1;

    var i;
    var j;

    var node0;
    var node1;
    var relation;


    switch(method) {
      case 0: // standard deviation

        var sd;
        var w;

        for(i = 0; numberTable[i + 1] != null; i++) {
          list0 = numberTable[i];

          if(i === 0) {
            node0 = new _Node(list0.name, list0.name);
            network.addNode(node0);
          } else {
            node0 = network.nodeList[i];
          }


          for(j = i + 1; numberTable[j] != null; j++) {
            list1 = numberTable[j];

            if(i === 0) {
              node1 = new _Node(list1.name, list1.name);
              network.addNode(node1);
            } else {
              node1 = network.nodeList[j];
            }



            list1 = numberTable[j];
            sd = NumberListOperators.standardDeviationBetweenTwoNumberLists(list0, list1);

            w = 1 / (1 + sd);

            if(w >= tolerance) {
              relation = new Relation(i + "_" + j, node0.name + "_" + node1.name, node0, node1, w);
              network.addRelation(relation);
            }
          }
        }

        break;
      case 1:
        break;
      case 2:
        break;
    }

    return network;
  };

  /**
   * @classdesc Create default Matrix instances.
   *
   * @namespace
   * @category numbers
   */
  function MatrixGenerators() {}
  //all Matrix objects and methods should be ported to NumberTable (same at Matrix.json)


  /**
   * Returns a transformation matrix from a triangle mapping
   *
   * @returns Matrix
   *
   **/
  // TODO: resolve particular cases (right angles)
  MatrixGenerators.createMatrixFromTrianglesMapping = function(v0, v1, v2, w0, w1, w2) {
    var a, b, c, d;

    if(v1.y != v0.y) {
      var k = (v2.y - v0.y) / (v1.y - v0.y);

      a = (w2.x - w0.x - (w1.x - w0.x) * k) / (v2.x - v0.x - (v1.x - v0.x) * k);
      b = k * (w1.x - w0.x) / (v2.y - v0.y) - a * (v1.x - v0.x) / (v1.y - v0.y);

      c = (w2.y - w0.y - (w1.y - w0.y) * k) / (v2.x - v0.x - (v1.x - v0.x) * k);
      d = k * (w1.y - w0.y) / (v2.y - v0.y) - c * (v1.x - v0.x) / (v1.y - v0.y);
    } else {
      a = (w1.x - w0.x) / (v1.x - v0.x);
      b = (w2.x - w0.x) / (v2.y - v0.y) - a * (v2.x - v0.x) / (v2.y - v0.y);

      c = (w1.y - w0.y) / (v1.x - v0.x);
      d = (w2.y - w0.y) / (v2.y - v0.y) - c * (v2.x - v0.x) / (v2.y - v0.y);
    }

    return new Matrix(a, c, b, d, w0.x - a * v0.x - b * v0.y, w0.y - c * v0.x - d * v0.y);
  };


  //TODO: place this in the correct place
  /**
   * @todo write docs
   */
  MatrixGenerators.applyTransformationOnCanvasFromPoints = function(context, v0, v1, v2, w0, w1, w2) {
    var a, b, c, d;

    if(v1.y != v0.y) {
      var k = (v2.y - v0.y) / (v1.y - v0.y);

      a = (w2.x - w0.x - (w1.x - w0.x) * k) / (v2.x - v0.x - (v1.x - v0.x) * k);
      b = k * (w1.x - w0.x) / (v2.y - v0.y) - a * (v1.x - v0.x) / (v1.y - v0.y);

      c = (w2.y - w0.y - (w1.y - w0.y) * k) / (v2.x - v0.x - (v1.x - v0.x) * k);
      d = k * (w1.y - w0.y) / (v2.y - v0.y) - c * (v1.x - v0.x) / (v1.y - v0.y);
    } else {
      a = (w1.x - w0.x) / (v1.x - v0.x);
      b = (w2.x - w0.x) / (v2.y - v0.y) - a * (v2.x - v0.x) / (v2.y - v0.y);

      c = (w1.y - w0.y) / (v1.x - v0.x);
      d = (w2.y - w0.y) / (v2.y - v0.y) - c * (v2.x - v0.x) / (v2.y - v0.y);
    }
    context.transform(a, c, b, d, w0.x - a * v0.x - b * v0.y, w0.y - c * v0.x - d * v0.y);
  };




  /**
   * Creates a matrix transformation that corresponds to the given rotation,
   * around (0,0) or the specified point.
   * @see Matrix#rotate
   *
   * @param {Number} theta Rotation in radians.
   * @param {Point} [aboutPoint] The point about which this rotation occurs. Defaults to (0,0).
   * @returns {Matrix}
   */
  MatrixGenerators.createRotationMatrix = function(theta, aboutPoint) {
    var rotationMatrix = Matrix(
      Math.cos(theta),
      Math.sin(theta),
      -Math.sin(theta),
      Math.cos(theta)
    );

    if(aboutPoint) {
      rotationMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          rotationMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return rotationMatrix;
  };

  /**
   * Returns a matrix that corresponds to scaling by factors of sx, sy along
   * the x and y axis respectively.
   * If only one parameter is given the matrix is scaled uniformly along both axis.
   * If the optional aboutPoint parameter is given the scaling takes place
   * about the given point.
   * @see Matrix#scale
   *
   * @param {Number} sx The amount to scale by along the x axis or uniformly if no sy is given.
   * @param {Number} [sy] The amount to scale by along the y axis.
   * @param {Point} [aboutPoint] The point about which the scaling occurs. Defaults to (0,0).
   * @returns {Matrix} A matrix transformation representing scaling by sx and sy.
   */
  MatrixGenerators.createScaleMatrix = function(sx, sy, aboutPoint) {
    sy = sy || sx;

    var scaleMatrix = Matrix(sx, 0, 0, sy);

    if(aboutPoint) {
      scaleMatrix =
        Matrix.translation(aboutPoint.x, aboutPoint.y).concat(
          scaleMatrix
        ).concat(
          Matrix.translation(-aboutPoint.x, -aboutPoint.y)
        );
    }

    return scaleMatrix;
  };


  /**
   * Returns a matrix that corresponds to a translation of tx, ty.
   * @see Matrix#translate
   *
   * @param {Number} tx The amount to translate in the x direction.
   * @param {Number} ty The amount to translate in the y direction.
   * @returns {Matrix} A matrix transformation representing a translation by tx and ty.
   */
  MatrixGenerators.createTranslationMatrix = function(tx, ty) {
    return Matrix(1, 0, 0, 1, tx, ty);
  };
  //
  // /**
  // * A constant representing the identity matrix.
  // * @name IDENTITY
  // * @fieldOf Matrix
  // */
  // Matrix.IDENTITY = Matrix();
  // /**
  // * A constant representing the horizontal flip transformation matrix.
  // * @name HORIZONTAL_FLIP
  // * @fieldOf Matrix
  // */
  // Matrix.HORIZONTAL_FLIP = Matrix(-1, 0, 0, 1);
  // /**
  // * A constant representing the vertical flip transformation matrix.
  // * @name VERTICAL_FLIP
  // * @fieldOf Matrix
  // */
  // Matrix.VERTICAL_FLIP = Matrix(1, 0, 0, -1);

  /**
   * @classdesc Provides a set of tools that work with Interval Lists.
   *
   * @namespace
   * @category numbers
   */
  function IntervalListOperators() {}
  /**
   * @todo write docs
   */
  IntervalListOperators.scaleIntervals = function(intervalList, value) {
    var newIntervalList = new List();
    newIntervalList.name = intervalList.name;
    for(var i = 0; intervalList[i] !== null; i++) {
      newIntervalList[i] = intervalList[i].getScaled(value);
    }
    return newIntervalList;
  };

  /**
   * @classdesc Provides a set of tools that work with {@link Table|Tables} of
   * Intervals.
   *
   * @namespace
   * @category numbers
   */
  function IntervalTableOperators() {}
  /**
   * @todo write docs
   */
  IntervalTableOperators.scaleIntervals = function(intervalTable, value) {
    var newIntervalTable = new Table();
    newIntervalTable.name = intervalTable.name;
    for(var i = 0; intervalTable[i] !== null; i++) {
      newIntervalTable[i] = IntervalListOperators.scaleIntervals(intervalTable[i], value);
    }
    return newIntervalTable;
  };

  /**
   * @classdesc NumberList Conversions
   *
   * @namespace
   * @category numbers
   */
  function NumberListConversions() {}
  /**
   * Builds an {@link Polygon} from the NumberList,
   * using each consecutive pair of values in the numberList as
   * x and y positions.
   *
   * @param {NumberList} numberlist The NumberList to convert to a Polygon.
   * @return {Polygon} Polygon representing the values
   * in the NumberList as x/y coordinates.
   */
  NumberListConversions.toPolygon = function(numberlist) {
    if(numberlist.length === 0) return null;
    var polygon = new _Polygon();
    for(var i = 0; numberlist[i + 1] != null; i += 2) {
      polygon.push(new _Point(numberlist[i], numberlist[i + 1]));
    }
    return polygon;
  };

  /**
   * Returns a new {@link StringList} with all values converted to strings
   *
   * @param {NumberList} numberlist The NumberList to convert.
   * @return {StringList} New list.
   */
  NumberListConversions.toStringList = function(numberlist) {
    var i;
    var stringList = new StringList();
    for(i = 0; numberlist[i] != null; i++) {
      stringList[i] = String(numberlist[i]);
    }
    stringList.name = numberlist.name;
    return stringList;
  };

  /**
   * @classdesc Includes functions to convert Networks into other DataTypes.
   *
   * @namespace
   * @category networks
   */
  function NetworkConversions() {}
  /**
   * Builds a Network based on a two columns Table, creating relations on co-occurrences.
   * @param {Table} table table with at least two columns (commonly strings)
   *
   * @param {NumberList} numberList Weights of relations.
   * @param {Number} threshold Minimum weight or number of co-occurrences to create a relation.
   * @param {Boolean} allowMultipleRelations (false by default)
   * @param {Number} minRelationsInNode Remove nodes with number of relations below threshold.
   * @param {StringList} stringList Contents of relations.
   * @return {Network}
   * tags:conversion
   */
  NetworkConversions.TableToNetwork = function(table, numberList, threshold, allowMultipleRelations, minRelationsInNode, stringList) {
    if(table == null || !table.isTable || table[0] == null || table[1] == null) return;

    //trace("••••••• createNetworkFromPairsTable", table);
    if(allowMultipleRelations == null) allowMultipleRelations = false;
    if(table.length < 2) return null;
    var network = new Network();
    var nElements;

    if(numberList == null) {
      nElements = Math.min(table[0].length, table[1].length);
    } else {
      nElements = Math.min(table[0].length, table[1].length, numberList.length);
    }

    //trace("nElements", nElements);

    if(numberList == null && table.length > 2 && typeOf(table[2]) == "NumberList" && table[2].length >= nElements) numberList = table[2];


    if(typeOf(table[0]) == NodeList && typeOf(table[1]) == NodeList) {
      //....    different methodology here
    }

    var node0;
    var node1;
    var name0;
    var name1;
    var relation;
    var i;
    for(i = 0; i < nElements; i++) {
      name0 = "" + table[0][i];
      name1 = "" + table[1][i];
      //trace("______________ i, name0, name1:", i, name0, name1);
      node0 = network.nodeList.getNodeById(name0);
      if(node0 == null) {
        node0 = new _Node(name0, name0);
        network.addNode(node0);
      } else {
        node0.weight++;
      }
      node1 = network.nodeList.getNodeById(name1);
      if(node1 == null) {
        node1 = new _Node(name1, name1);
        network.addNode(node1);
      } else {
        node1.weight++;
      }
      if(numberList == null) {
        relation = network.relationList.getFirstRelationByIds(node0.id, node1.id, false);
        if(relation == null ||  allowMultipleRelations) {
          relation = new Relation(name0 + "_" + name1 + network.relationList.length, name0 + "_" + name1, node0, node1, 1);
          network.addRelation(relation);
        } else {
          relation.weight++;
        }
      } else if(numberList[i] > threshold) {
        relation = new Relation(name0 + "_" + name1, name0 + "_" + name1, node0, node1, numberList[i]);
        network.addRelation(relation);
      }

      if(stringList) relation.content = stringList[i];
    }

    if(minRelationsInNode) {
      for(i = 0; network.nodeList[i] != null; i++) {
        if(network.nodeList[i].relationList.length < minRelationsInNode) {
          network.removeNode(network.nodeList[i]);
          i--;
        }
      }
    }

    return network;
  };

  /**
   * @classdesc  StringList Conversions
   *
   * @namespace
   * @category strings
   */
  function StringListConversions() {}
  /**
   * Converts StringLIst to numberList
   *
   * @param {StringList} stringlist StringList to convert
   */
  StringListConversions.toNumberList = function(stringlist) {
    var numbers = new NumberList();
    numbers.name = stringlist.name;
    var i;
    for(i = 0; stringlist[i] != null; i++) {
      numbers[i] = Number(stringlist[i]);
    }
    return numbers;
  };


  /**
   * converts a stringList into a dateList
   *
   * @param {StringList} stringlist StringList to convert
   * @param  {String} formatCase format cases:<br>0: MM-DD-YYYY<br>1: YYYY-MM-DD<br>2: MM-DD-YY<br>3: YY-MM-DD<br>4: DD-MM-YY<br>5: DD-MM-YYYY
   * @param  {String} separator "-" by default
   * @return {DateList}
   * tags:
   */
  StringListConversions.toDateList = function(stringList, formatCase, separator) {
    if(stringList==null) return;
    
    var dateList = new DateList();
    var i;
    var l = stringList.length;
    for(i = 0; i<l; i++) {
      dateList.push(DateOperators.stringToDate(stringList[i], formatCase, separator));
    }
    return dateList;
  };

  /**
   * @classdesc  Object Conversions
   *
   * @namespace
   * @category basics
   */
  function ObjectConversions() {}
  /**
   * Convert an object (or more typically an Array of objects) into a Table
   * @param {Object} object or array of objects
   *
   * @param {List} list of field names to include (by default will take all from first element in array of objects)
   * @return {Table} resulting Table
   * tags:decoder,dani
   */
  ObjectConversions.ObjectToTable = function(object, fields) {
    // Formats:
    // 1: normal list of objects
    // 2: Object with single property, containing normal list of obejcts
    // 3: Object as CSV (each property represents a column)
    var format;
    var p;

    // If it's an array, then it's format 1
    if(Array.isArray(object)) {
      format = 1;
      // If not field names supplied, get them from first element
      if(!fields)
      {
        fields = [];
        for(p in object[0]) {
          if (object[0].hasOwnProperty(p)) {
            fields.push(p);
          }
        }
      }
      // Else (not array), it's an object
    } else {
      // Check how many properties the object has
      var properties = [];
      for(p in object) {
        properties.push(p);
      }

      // If it has only one, and it's an array, it's foramt 2, so assume it's just a capsule
      // and extract the array as format 1
      if(properties.length == 1 && Array.isArray(object[properties[0]]))
      {
        format = 1;
        object = object[properties[0]];

        // If not field names supplied, get them from first element
        if(!fields)
        {
          fields = [];
          for(p in object[0]) {
            fields.push(p);
          }
        }
      } else {
        // Finally, if the object has many properties, we assume it's a csv encoded as JSON
        // ( each property of the object represents a column of the CSV )
        format = 3;

        // If not fields supplied, use all properties
        if(!fields)
          fields = properties;
      }
    }


    // Create table and columns
    var column, i, f;
    var result = new Table();
    for(i = 0; i < fields.length; i++) {
      var fieldName = fields[i];
      column = new List();
      result[i] = column;
      column.name = fieldName;
    }

    // Fill the table
    if(format == 1)
    {
      for(i = 0; i < object.length; i++) {
        var row = object[i];
        for(f = 0; f < fields.length; f++) {
          result[f].push(row[fields[f]]);
        }
      }
    } else {
      for(f = 0; f < fields.length; f++) {
        column = object[fields[f]];
        for(i = 0; i < column.length; i++) {
          result[f].push(column[i]);
        }
      }
    }

    // Improve columns
    for(i = 0; i < result.length; i++) {
      result[i] = result[i].getImproved();
    }

    //if(result.getLengths.getMax()==1) return result.getRow(0);

    // Improve table
    result = result.getImproved();

    // Return best possible
    return result;
  };


  /**
   * Convert an object (or more typically an Array of objects) into a Table
   * @param {Object} object or array of objects
   *
   * @param {List} list of field names to include (by default will take all from first element in array of objects)
   * @return {List} resulting list (probably a table)
   * tags:decoder
   */
  ObjectConversions.ObjectToList = function(object, fields) {
    var result = ObjectConversions.ObjectToTable(object, fields);

    if(result.getLengths.getMax() == 1) return result.getRow(0);
  };



  /**
   * converts an object into a json string (JSON.stringify(object))
   * @param  {Object} object to convert
   * @return {String} string in format json. If there is an error, it returns an
   * error string.
   * tags:conversion
   */
  ObjectConversions.objectToString = function(object){
    try {
      return JSON.stringify(object);
    } catch (e) {
      return JSON.stringify({"error":"cannot convert."});
    }
  };

  /**
   * converts any Object into the desirde type, using the most obvious conversion (if exists)
   * @param  {Object} object
   * @param  {String} toType can be literal (ex: "string", "NumberList") or short (ex: "s", "#L")
   * @return {Object} Object of the specified type
   * tags:conversion
   */
  ObjectConversions.conversor = function(object, toType) {
    if(object==null || toType==null) return;

    var i;
    var type = typeOf(object);
    var pairType = type + "_" + toType;
    var newList;

    console.log('ObjectConversions.conversor, pairType:', pairType);

    switch(pairType) {
      case 'Array_List':
        return ObjectConversions.ArrayToList(object);
      case 'NumberTable_Polygon':
        var polygon = new _Polygon();
        var length2 = object.length > 1;
        for(i = 0; object[0][i] != null; i++) {
          polygon[i] = new _Point(object[0][i], length2 ? object[1][i] : 0);
        }
        return polygon;
      case 'date_string':
        return DateOperators.dateToString(object);
      case 'string_date':
        return DateOperators.stringToDate(object);
      case 'date_number':
        return object.getTime();
      case 'number_date':
        return new Date(object);
      case 'List_StringList':
      case 'NumberList_StringList':
        return NumberListConversions.toStringList(object);
      case 'StringList_NumberList':
        return StringListConversions.toNumberList(object);
      case 'Object_string':
        return JSON.stringify(object, null, "\t");
      case 'string_Object':
        return JSON.parse(object);
      case 'string_ColorScale':
        return ColorScales[object]; //todo: not working, fix
      case 'string_Table':
        return TableEncodings.CSVtoTable(object);
      case 'StringList_DateList': //TODO: solve cases of lists
        newList = new DateList();
        object.forEach(function(string) {
          newList.push(DateOperators.stringToDate(string));
        });
        newList.name = object.name;
        return newList;
      case 'DateList_NumberList': //TODO: solve cases of lists
        return object.getTimes();
      case 'Table_Network':
        return NetworkConversions.TableToNetwork(object, null, 0, false);

    }

    switch(toType) {
      case 'string':
        return object.toString();
      case 'number':
        return Number(object);
    }

    // var short = TYPES_SHORT_NAMES_DICTIONARY[toType];
    // if(short!=null && short!=toType){
    //   return ObjectConversions.conversor(object, short);
    // }

    return null;
  };

  /**
   * converts an array into an improved List
   * @param {Array} array
   * tags:conversion
   */
  ObjectConversions.ArrayToList = function(array){
    return List.fromArray(array).getImproved();
  };

  /**
   * @classdesc  Object Operators
   *
   * @namespace
   * @category basics
   */
  function ObjectOperators() {}
  /**
   * identity function
   * @param  {Object} object
   * @return {Object}
   * tags:special
   */
  ObjectOperators.identity = function(object) {
    return object;
  };


  /**
   * builds a string report of the object, with detailed information about its structure and contents
   * @param  {Object} object
   * @return {String}
   * tags:special
   */
  ObjectOperators.getReport = function(object) {
    if(object == null) return null;

    if(object.getReport) return object.getReport();

    var type = typeOf(object);

    switch(type){
      case 'Table':
        return TableOperators.getReport(object);
      case 'List':
        return ListOperators.getReport(object);
    }

    if(object.isTable) return TableOperators.getReport(object);
    if(object.isList) return ListOperators.getReport(object);


    var text = "///////////report of instance of Object//////////";
    if(object.name) text += "name: "+object.name;

    var string = ObjectConversions.objectToString(object);

    if(string.length < 2000) {
      text += "\n" + string;
      return text;
    }

    var propertyNames = new StringList();
    for(var propName in object) {
      propertyNames.push(propName);
    }

    if(propertyNames.length < 100) {
      text += "\nproperties: " + propertyNames.join(", ");
    } else {
      text += "\nfirst 100 properties: " + propertyNames.slice(0, 100).join(", ");
    }

    return text;
  };




  /**
   * builds an html report of the object, with detailed information about its structure and contents
   * @param  {Object} object
   * @return {String}
   * tags:special
   */
  ObjectOperators.getReportHtml = function(object) {
    if(object == null) return null;

    if(object.getReportHtml) return object.getReportHtml();

    var type = typeOf(object);

    switch(type){
      case 'Table':
        return TableOperators.getReportHtml(object);
      case 'List':
        return ListOperators.getReportHtml(object);
    }

    if(object.isTable) return TableOperators.getReportHtml(object);
    if(object.isList) return ListOperators.getReportHtml(object);

    var text = "<fs18>report of instance of Object</f>";

    text += ObjectOperators.getReportHtml(object);
    //if(object.name) text += "name: "+object.name;

    return text;
  };



  /**
   * uses a boolean to decide which of two objects it returns
   * @param  {Boolean} boolean
   * @param  {Object} object0 returned if boolean is true
   * @param  {Object} object1 returned if boolean is false
   * @return {Object}
   * tags:
   */
  ObjectOperators.booleanGate = function(boolean, object0, object1) {
    return boolean ? object0 : object1;
  };

  /**
   * return a property value from its name
   * @param  {Object} object
   * @param  {String} property_value
   * @return {Object}
   * tags:
   */
  ObjectOperators.getPropertyValue = function(object, property_name) {
    if(object == null) return;

    return object == null ? null : object[property_name];
  };

  /**
   * return true if property value exists in object
   * @param  {Object} object
   * @param  {String} property_value
   * @return {Boolean}
   * tags:
   */
  ObjectOperators.isPropertyValue = function(object, property_value) {
    if(object == null) return false;
    for (var property in object) {
      if(object[property] === property_value)
        return true;
    }
    return false;
  };

  /**
   * return a a stringList of property names
   * @param  {Object} object
   * @return {StringList}
   * tags:
   */
  ObjectOperators.getPropertiesNames = function(object) {
    if(object == null) return;

    return StringList.fromArray(Object.getOwnPropertyNames(object));
  };

  /**
   * return a table with a stringList of property names and a list of respective values
   * @param  {Object} object
   * @return {Table}
   * tags:
   */
  ObjectOperators.getPropertiesNamesAndValues = function(object) {
    if(object == null) return;

    var table = new Table();

    table[0] = ObjectOperators.getPropertiesNames(object);
    table[1] = new List();

    table[0].forEach(function(value, i) {
      table[1][i] = object[value];
    });

    table[1] = table[1].getImproved();

    return table;
  };


  /**
   * interpolates two different objects of the same type<br>currently working with numbers, intervals and numberLists
   * @param  {Object} object0
   * @param  {Object} object1
   *
   * @param  {Number} value
   * @param {Number} minDistance if objects are close enough, it delivers the orginal object
   * @return {Object}
   * tags:
   */
  ObjectOperators.interpolateObjects = function(object0, object1, value, minDistance) {
    var type = typeOf(object0);
    var i;
    if(type != typeOf(object1)) return object0;

    value = value == null ? 0.5 : value;
    var antivalue = 1 - value;

    switch(type) {
      case 'number':
        if(minDistance && Math.abs(object0 - object1) <= minDistance) return object0;
        return antivalue * object0 + value * object1;
      case 'Interval':
        if(minDistance && (Math.abs(object0.x - object1.x) + Math.abs(object0.y - object1.y)) <= minDistance) return object0;
        return new Interval(antivalue * object0.x + value * object1.x, antivalue * object0.y + value * object1.y);
      case 'NumberList':
        if(minDistance && Math.abs(object0.subtract(object1).getSum()) <= minDistance) return object0;
        var minL = Math.min(object0.length, object1.length);
        var newNumberList = new NumberList();
        for(i = 0; i < minL; i++) {
          newNumberList[i] = antivalue * object0[i] + value * object1[i];
        }
        return newNumberList;
    }
    return null;
  };


  // ObjectOperators.fusionObjects = function(object, objectToFusion){

  // }

  /**
   * replaces an object by another if it matches the obectToReplace
   * @param  {Object} object to be replaced if equals to obectToReplace
   * @param  {Object} obectToReplace object to check
   * @param  {Object} objectToPlace to be delivered instead of given object (in case the object matches obectToReplace)
   * @return {Object} original object or replaced object
   * tags:
   */
  ObjectOperators.replaceObject = function(object, obectToReplace, objectToPlace) {
    return object == obectToReplace ? objectToPlace : object;
  };


  /**
   * create an improved list from an Array
   * @param  {Array} array
   * @return {List}
   * tags:conversion
   */
  ObjectOperators.toList = function(array) {
    return List.fromArray(array).getImproved();
  };


  /////universal operators



  //////unibersal algebra


  /**
   * adds two or more objects, addition is performed according to the different types
   * @param {Object} object0
   *
   * @param {Object} object1
   * @param {Object} object2
   * @param {Object} object3
   * @param {Object} object4
   * @param {Object} object5
   * @return {Object}
   * tags:math
   */
  ObjectOperators.addition = function() {
    //console.log("addition__________________________________arguments:", arguments);
    var result;
    var i;
    if(arguments.length < 2) {
      if(arguments.length == 1 && arguments[0] != null && arguments[0].isList) {
        result = arguments[0][0];
        for(i = 1; arguments[0][i] != null; i++) {
          result = ObjectOperators.addition(result, arguments[0][i]);
        }
        return result;
      }
      return null;
    }

    if(arguments.length == 2) {
      if(arguments[0] != null && arguments[0].isList && arguments[1] != null && arguments[1].isList) {
        return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.addition);
      } else if(arguments[0] != null && arguments[0].isList) {
        //console.log('list versus object');
        return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.addition);
      } else if(arguments[1] != null && arguments[1].isList) {
        //console.log('object versus list');
        return ObjectOperators._applyBinaryOperatorOnObjectWithList(arguments[0], arguments[1], ObjectOperators.addition);
      }

      var a0 = arguments[0];
      var a1 = arguments[1];
      var a0Type = typeOf(a0);
      var a1Type = typeOf(a1);
      //console.log('ObjectOperators.addition, a0Type, a1Type:['+a0Type, a1Type+']');
      var reversed = false;

      if(a1Type < a0Type && a1Type != "string" && a0Type != "string") {
        a0 = arguments[1];
        a1 = arguments[0];
        a0Type = typeOf(a0);
        a1Type = typeOf(a1);
        reversed = true;
      }

      var pairType = a0Type + "_" + a1Type;
      //console.log('ObjectOperators.addition, pairType:['+pairType+']');
      //
      switch(pairType) {
        case 'boolean_boolean':
          return a0 && a1;
        case 'date_string':
          return reversed ? a1 + DateOperators.dateToString(a0) : DateOperators.dateToString(a0) + a1;
        case 'number_string':
        case 'string_string':
        case 'string_number':
        case 'boolean_number':
        case 'number_number':
          return a0 + a1;
        case 'Point_Point':
          return new _Point(a0.x + a1.x, a0.y + a1.y);
        case 'Point3D_Point3D':
          return new Point3D(a0.x + a1.x, a0.y + a1.y, a0.z + a1.z);
        case 'number_Point':
          return new _Point(a0.x + a1, a0.y + a1);
        case 'number_Point3D':
          return new Point3D(a0.x + a1, a0.y + a1, a0.z + a1);
        case 'Interval_number':
          return new Interval(a0.x + a1, a0.y + a1);
        case 'Interval_Point':
          return new _Point(a0.getMin() + a1.x, a0.getMax() + a1.y);
        case 'Interval_Interval':
          return new _Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
        case 'Point_Rectangle':
          return new Rectangle(a0.x + a1.x, a0.y + a1.y, a1.width, a1.height);
        case 'Interval_Rectangle':
          return new Rectangle(a0.getMin() + a1.x, a0.getMax() + a1.y, a1.width, a1.height);
        case 'Rectangle_Rectangle':
          return new Rectangle(a0.x + a1.x, a0.y + a1.y, a0.width + a1.width, a0.height + a1.height);
        case 'date_number':
          return new Date(a0.getTime() + (a1 / DateOperators.millisecondsToDays));
        case 'date_date':
          return new Date(Number(a0.getTime() + a1.getTime())); //?
        case 'date_DateInterval':
          return new DateInterval(ObjectOperators.addition(a0, a1.date0), ObjectOperators.addition(a0, a1.date1));
        case 'DateInterval_number':
          return new DateInterval(ObjectOperators.addition(a0.date0, a1), ObjectOperators.addition(a0.date1, a1));
        case 'DateInterval_Interval':
          return new DateInterval(ObjectOperators.addition(a0.date0, a1.min), ObjectOperators.addition(a0.date1, a1.max));
        case 'DateInterval_DateInterval':
          return new DateInterval(ObjectOperators.addition(a0.date0, a1.date0), ObjectOperators.addition(a0.date1, a1.date1));
        case 'string_StringList':
          return a1.append(a0, false);
        case 'StringList_string':
          return a1.append(a0, true);
        default:
          console.log("[!] addition didn't manage to resolve:", pairType, a0 + a1);
          return null;

      }
      return a0 + a1;

    }

    result = arguments[0];
    for(i = 1; i < arguments.length; i++) {
      //console.log(i, 'result:', result);
      result = ObjectOperators.addition(result, arguments[i]);
    }
    return result;
  };


  /**
   * multiplies two or more objects, multiplication is performed according to the different types
   * @param {Object} object0
   *
   * @param {Object} object1
   * @param {Object} object2
   * @param {Object} object3
   * @param {Object} object4
   * @param {Object} object5
   * @return {Object}
   * tags:math
   */
  ObjectOperators.multiplication = function() {
    //console.log("multiplication__________________________________arguments:", arguments);
    var result;
    var i;
    if(arguments.length < 2) {
      if(arguments.length == 1 && arguments[0].isList) {
        result = arguments[0][0];
        for(i = 1; arguments[0][i] != null; i++) {
          result = ObjectOperators.multiplication(result, arguments[0][i]);
        }
        return result;
      }
      return null;
    }

    var a0 = arguments[0];
    var a1 = arguments[1];
    var a0Type = typeOf(a0);
    var a1Type = typeOf(a1);
    var pairType = a0Type + "_" + a1Type;

    //c.log('pairType:['+pairType+']');

    if(arguments.length == 2) {
      if(arguments[0] == null) return null;

      if(pairType=='NumberTable_NumberTable') return NumberTableOperators.product(a0, a1);

      if(arguments[0].isList && arguments[1].isList) {
        return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.multiplication);
      } else if(arguments[0].isList) {
        //console.log('list versus object');
        return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.multiplication);
      } else if(arguments[1].isList) {
        return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[1], arguments[0], ObjectOperators.multiplication);
      }

      if(a1Type < a0Type){
        a0 = arguments[1];
        a1 = arguments[0];
        a0Type = typeOf(a0);
        a1Type = typeOf(a1);
      }

      pairType = a0Type + "_" + a1Type;
      //console.log('pairType:['+pairType+']');

      //
      switch(pairType) {
        case 'number_number':
        case 'boolean_boolean':
        case 'boolean_number':
        case 'Date_string':
        case 'number_string':
        case 'string_string':
          return a0 * a1; //todo: what to do with strings?
        case 'Point_Point':
          return new _Point(a0.x * a1.x, a0.y * a1.y);
        case 'Point3D_Point3D':
          return new Point3D(a0.x * a1.x, a0.y * a1.y, a0.z * a1.z);
        case 'number_Point':
          return new _Point(a0.x * a1, a0.y * a1);
        case 'number_Point3D':
          return new Point3D(a0.x * a1, a0.y * a1, a0.z * a1);
        case 'Interval_number':
          return new Interval(a0.getMin() * a1, a0.getMax() * a1);
        case 'Interval_Point':
          return new _Point(a0.getMin() * a1.x, a0.getMax() * a1.y);
        case 'Interval_Interval':
          return new _Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
        case 'Point_Rectangle':
          return new Rectangle(a0.x * a1.x, a0.y * a1.y, a1.width, a1.height); //todo: no
        case 'Interval_Rectangle':
          return new Rectangle(a0.getMin() * a1.x, a0.getMax() * a1.y, a1.width, a1.height); //todo: no
        case 'Rectangle_Rectangle':
          return new Rectangle(a0.x * a1.x, a0.y * a1.y, a0.width * a1.width, a0.height * a1.height);
        case 'date_number':
          return new Date(a0.getTime() * (a1 / DateOperators.millisecondsToDays));
        case 'date_date':
          return new Date(Number(a0.getTime() + a1.getTime())); //todo: ???
        case 'date_DateInterval':
          return new DateInterval(ObjectOperators.multiplication(a0, a1.date0), ObjectOperators.multiplication(a0, a1.date1)); //todo: ???
        case 'DateInterval_number':
          return new DateInterval(ObjectOperators.multiplication(a0.date0, a1), ObjectOperators.multiplication(a0.date1, a1)); //todo: ???
        case 'DateInterval_Interval':
          return new DateInterval(ObjectOperators.multiplication(a0.date0, a1.min), ObjectOperators.multiplication(a0.date1, a1.max)); //todo: ???
        case 'DateInterval_DateInterval':
          return new DateInterval(ObjectOperators.multiplication(a0.date0, a1.date0), ObjectOperators.multiplication(a0.date1, a1.date1)); //todo: ???
        default:
          console.log("[!] multiplication didn't manage to resolve:", pairType, a0 * a1);
          return null;

      }
      return a0 * a1;
    }

    result = arguments[0];
    for(i = 1; i < arguments.length; i++) {
      //console.log(i, 'result:', result);
      result = ObjectOperators.multiplication(result, arguments[i]);
    }
    return result;
  };

  /**
   * divides two or more objects, division is performed according to the different types
   * @param {Object} object0
   *
   * @param {Object} object1
   * @param {Object} object2
   * @param {Object} object3
   * @param {Object} object4
   * @param {Object} object5
   * @return {Object}
   * tags:math
   */
  ObjectOperators.division = function() {    
    var result;
    var i;
    if(arguments.length < 2) {
      if(arguments.length == 1 && arguments[0] && arguments[0].isList) {
        result = arguments[0][0];
        for(i = 1; arguments[0][i] != null; i++) {
          result = ObjectOperators.division(result, arguments[0][i]);
        }
        return result;
      }
      return null;
    }
    if(arguments.length == 2) {
      if(arguments[0] != null && arguments[0].isList && arguments[1] != null && arguments[1].isList) {
        return ObjectOperators._applyBinaryOperatorOnLists(arguments[0], arguments[1], ObjectOperators.division);
      } else if(arguments[0] != null && arguments[0].isList) {
        //console.log('list versus object');
        return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[0], arguments[1], ObjectOperators.division);
      } else if(arguments[1] != null && arguments[1].isList) {
        return ObjectOperators._applyBinaryOperatorOnListWithObject(arguments[1], arguments[0], ObjectOperators.division);
      }

      var a0 = arguments[0];
      var a1 = arguments[1];
      var a0Type = typeOf(a0);
      var a1Type = typeOf(a1);

      if(a1Type < a0Type) {
        a0 = arguments[1];
        a1 = arguments[0];
        a0Type = typeOf(a0);
        a1Type = typeOf(a1);
      }

      var pairType = a0Type + "_" + a1Type;
      //console.log('pairType:['+pairType+']');
      //
      switch(pairType) {
        case 'number_number':
        case 'boolean_boolean':
        case 'boolean_number':
        case 'Date_string':
        case 'number_string':
        case 'string_string':
          return a0 / a1; //todo: what to do with strings?
        case 'Point_Point':
          return new _Point(a0.x / a1.x, a0.y / a1.y);
        case 'Point3D_Point3D':
          return new Point3D(a0.x / a1.x, a0.y / a1.y, a0.z / a1.z);
        case 'number_Point':
          return new _Point(a0.x / a1, a0.y / a1);
        case 'number_Point3D':
          return new Point3D(a0.x / a1, a0.y / a1, a0.z / a1);
        case 'Interval_number':
          return new Interval(a0.getMin() / a1, a0.getMax() / a1);
        case 'Interval_Point':
          return new _Point(a0.getMin() / a1.x, a0.getMax() / a1.y);
        case 'Interval_Interval':
          return new _Point(a0.getMin() + a1.getMin(), a0.getMax() + a1.getMax());
        case 'Point_Rectangle':
          return new Rectangle(a0.x / a1.x, a0.y / a1.y, a1.width, a1.height); //todo: no
        case 'Interval_Rectangle':
          return new Rectangle(a0.getMin() / a1.x, a0.getMax() / a1.y, a1.width, a1.height); //todo: no
        case 'Rectangle_Rectangle':
          return new Rectangle(a0.x / a1.x, a0.y / a1.y, a0.width / a1.width, a0.height / a1.height);
        case 'date_number':
          return new Date(a0.getTime() / (a1 / DateOperators.millisecondsToDays));
        case 'date_date':
          return new Date(Number(a0.getTime() + a1.getTime())); //todo: ???
        case 'date_DateInterval':
          return new DateInterval(ObjectOperators.division(a0, a1.date0), ObjectOperators.division(a0, a1.date1)); //todo: ???
        case 'DateInterval_number':
          return new DateInterval(ObjectOperators.division(a0.date0, a1), ObjectOperators.division(a0.date1, a1)); //todo: ???
        case 'DateInterval_Interval':
          return new DateInterval(ObjectOperators.division(a0.date0, a1.min), ObjectOperators.division(a0.date1, a1.max)); //todo: ???
        case 'DateInterval_DateInterval':
          return new DateInterval(ObjectOperators.division(a0.date0, a1.date0), ObjectOperators.division(a0.date1, a1.date1)); //todo: ???
        default:
          console.log("[!] division didn't manage to resolve:", pairType, a0 / a1);
          return null;

      }
      return a0 / a1;
    }

    result = arguments[0];
    for(i = 1; i < arguments.length; i++) {
      //console.log(i, 'result:', result);
      result = ObjectOperators.division(result, arguments[i]);
    }
    return result;
  };





  //removed, added an approach method in NumberList and Polygon

  /**
   * modifies and object, making it closer to another (convergent asymptotic vector aka destiny) object, objects need to be vectors
   * @param  {Object} objectToModify object that will be modified
   * @param  {Object} objectDestiny  object guide (convergent asymptotic vector)
   * @param  {Number} speed speed of convergence
   */
  // ObjectOperators.approach = function(objectToModify, objectDestiny, speed){
  // 	var type = typeOf(objectToModify);
  // 	if(type!=typeOf(objectDestiny)) return null;
  // 	speed = speed||0.5;
  // 	var antispeed = 1-speed;

  // 	switch(type){
  // 		case "NumberList":
  // 			objectToModify.forEach(function(n, i){objectToModify[i] = antispeed*objectToModify[i] + speed*objectDestiny[i];});
  // 			break;
  // 	}
  // }





  ObjectOperators._applyBinaryOperatorOnLists = function(list0, list1, operator) {
    var n = Math.min(list0.length, list1.length);
    var i;
    var resultList = new List();
    for(i = 0; i < n; i++) {
      resultList.push(ObjectOperators._applyBinaryOperator(list0[i], list1[i], operator));
    }
    return resultList.getImproved();
  };
  ObjectOperators._applyBinaryOperatorOnListWithObject = function(list, object, operator) {
    var i;
    var resultList = new List();
    for(i = 0; i < list.length; i++) {
      resultList.push(ObjectOperators._applyBinaryOperator(list[i], object, operator));
    }
    return resultList.getImproved();
  };
  ObjectOperators._applyBinaryOperatorOnObjectWithList = function(object, list, operator) {
    var i;
    var resultList = new List();
    for(i = 0; i < list.length; i++) {
      resultList.push(ObjectOperators._applyBinaryOperator(object, list[i], operator));
    }
    return resultList.getImproved();
  };
  ObjectOperators._applyBinaryOperator = function(object0, object1, operator) {
    return operator(object0, object1);
  };

  /**
   * @classdesc  StringList Operators
   *
   * @namespace
   * @category strings
   */
  function StringListOperators() {}
  /**
   * receives n arguments and performs addition
   */
  StringListOperators.concatStrings = function(stringList, joinString) { //deprecated
    if(joinString == null) joinString = "";
    return StringList.fromArray(stringList.join(joinString));
  };

  /**
   * join strings with a character
   * @param  {StringList} StringList strings to be joined
   *
   * @param  {String} join character
   * @param  {String} prefix
   * @param  {String} sufix
   * @return {String}
   * tags:
   */
  StringListOperators.join = function(stringList, character, prefix, sufix) {
    if(stringList == null) return;

    character = character == null ? "" : character;
    prefix = prefix == null ? "" : prefix;
    sufix = sufix == null ? "" : sufix;
    return prefix + stringList.join(character) + sufix;
  };


  /**
   * filters a StringList by a string
   * @param  {StringList} stringList    to be filtered
   * @param  {String} string        filter criteria (string or word that will be search in each string of the stringList)
   *
   * @param  {Boolean} asWord        if true a word (string surrounded by separators such as space or punctuation) will be used as criteria, false by default
   * @param  {Boolean} returnIndexes if true a numberList with indexes will be returned, instead of a stringList
   * @return {List}               stringList or numberlist with filtered strings or indexes
   * tags:filter
   */
  StringListOperators.filterStringListByString = function(stringList, string, asWord, returnIndexes) {
    var i;
    var newList = returnIndexes ? new NumberList() : new StringList();
    var regex;

    if(asWord) {
      regex = new RegExp("\\b" + string + "\\b");
    }

    for(i = 0; stringList[i] != null; i++) {
      if(asWord) {
        if(stringList[i].match(regex).length > 0) {
          newList.push(returnIndexes ? i : stringList[i]);
        }
      } else {
        if(stringList[i].indexOf(string) != -1) {
          newList.push(returnIndexes ? i : stringList[i]);
        }
      }
    }
    return newList;
  };

  /**
   * replaces in each string, a sub-string by a string
   *
   * @param  {StringList} stringList  StringList to work on.
   * @param  {String} subString sub-string to be replaced in each string
   * @param  {String} replacement string to be placed instead
   * @return {StringList}
   * tags:
   */
  StringListOperators.replaceSubStringsInStrings = function(stringlist, subString, replacement) {
    var newStringList = new StringList();
    newStringList.name = stringlist.name;

    for(var i = 0; stringlist[i] != null; i++) {
      newStringList[i] = StringOperators.replaceSubString(stringlist[i], subString, replacement);
    }

    return newStringList;
  };



  // var regex = new RegExp("\\b"+word+"\\b");
  // var match = string.match(regex);
  // return match==null?0:match.length;

  /*
   * a classic function, but now it works with patterns!
   */
  /**
   * @todo finish docs
   */
  StringListOperators.countStringsOccurrencesOnTexts = function(strings, texts) {
    var occurrencesTable = new NumberTable();

    var i;
    var j;
    var pattern;
    var numberList;
    var splitArray;

    for(i = 0; strings[i] != null; i++) {
      pattern = strings[i];
      numberList = new NumberList();
      numberList.name = pattern;
      for(j = 0; texts[j] != null; j++) {
        splitArray = texts[j].split(pattern);
        numberList[j] = splitArray.length - 1;
      }
      occurrencesTable[i] = numberList;
    }
    return occurrencesTable;
  };

  /**
   * builds a table with a list of occurrent words and numberLists for occurrences in each string
   * @param  {StringList} strings
   *
   * @param  {StringList} stopWords words to be excluded from the list
   * @param  {Boolean} includeLinks
   * @param  {Number} wordsLimitPerString number of words extracted per string
   * @param  {Number} totalWordsLimit final number of words
   * @param  {Boolean} normalize normalize lists to sum
   * @param {Boolean} stressUniqueness divide number of occurrences in string by total number of occurrences (words that appear in one or only few texts become more weighed)
   * @param {Boolean} sortByTotalWeight sort all columns by total weights of words
   * @param  {Number} minSizeWords
   * @return {Table}
   * tags:count
   */
  StringListOperators.getWordsOccurrencesMatrix = function(strings, stopWords, includeLinks, wordsLimitPerString, totalWordsLimit, normalize, stressUniqueness, sortByTotalWeight, minSizeWords) {
    var i;

    wordsLimitPerString = wordsLimitPerString || 500;
    totalWordsLimit = totalWordsLimit || 1000;
    normalize = normalize == null ? true : normalize;
    stressUniqueness = stressUniqueness || false;
    sortByTotalWeight = (sortByTotalWeight || true);
    minSizeWords = minSizeWords == null ? 3 : minSizeWords;

    var matrix = StringOperators.getWordsOccurrencesTable(strings[0], stopWords, includeLinks, wordsLimitPerString, minSizeWords);

    var table;
    for(i = 1; strings[i] != null; i++) {
      table = StringOperators.getWordsOccurrencesTable(strings[i], stopWords, includeLinks, wordsLimitPerString, minSizeWords);
      matrix = TableOperators.mergeDataTables(matrix, table);
    }


    if(matrix[0].length > totalWordsLimit) sortByTotalWeight = true;

    if(stressUniqueness || sortByTotalWeight) {
      var totalList = new NumberList();
      totalList = matrix[1].clone();
      matrix.forEach(function(occurrences, i) {
        if(i < 2) return;
        occurrences.forEach(function(value, j) {
          totalList[j] += value;
        });
      });

      if(stressUniqueness) {
        matrix.forEach(function(occurrences, i) {
          if(i === 0) return;
          occurrences.forEach(function(value, j) {
            occurrences[j] = value / totalList[j];
          });
        });
      }

      if(sortByTotalWeight) {
        matrix = matrix.getListsSortedByList(totalList, false);
      }
    }

    if(normalize) {
      matrix.forEach(function(occurrences, i) {
        if(i === 0) return;
        matrix[i] = NumberListOperators.normalizedToSum(matrix[i]);
      });
    }


    if(totalWordsLimit > 0) matrix = matrix.sliceRows(0, totalWordsLimit - 1);

    return matrix;
  };

  //good approach for few large texts, to be tested
  /**
   * @todo finish docs
   */
  StringListOperators.createTextsNetwork = function(texts, stopWords, stressUniqueness, relationThreshold) {
    var i, j;
    var network = new Network();

    var matrix = StringListOperators.getWordsOccurrencesMatrix(texts, stopWords, false, 600, 800, false, true, false, 3);

    texts.forEach(function(text, i) {
      var node = new _Node("_" + i, "_" + i);
      node.content = text;
      node.wordsWeights = matrix[i + 1];
      network.addNode(node);
    });

    for(i = 0; network.nodeList[i + 1] != null; i++) {
      var node = network.nodeList[i];
      for(j = i + 1; network.nodeList[j] != null; j++) {
        var node1 = network.nodeList[j];

        var weight = NumberListOperators.cosineSimilarity(node.wordsWeights, node1.wordsWeights);

        if(i === 0 && j == 1) {
          console.log(node.wordsWeights.length, node1.wordsWeights.length, weight);
          console.log(node.wordsWeights.type, node.wordsWeights);
          console.log(node1.wordsWeights.type, node1.wordsWeights);
          console.log(node.wordsWeights.getNorm() * node1.wordsWeights.getNorm());
        }

        if(weight > relationThreshold) {
          var relation = new Relation(node.id + "_" + node1.id, node.id + "_" + node1.id, node, node1, weight);
          network.addRelation(relation);
        }
      }
    }

    return network;
  };


  /**
   * builds a network out of a list of short strings, adds a property wordsTable to each node (with words and weights)
   * @param  {StringList} texts
   *
   * @param  {StringList} stopWords
   * @param  {Number} relationThreshold threshold to create a relation
   * @param {Number} mode <br>0:pseudoentropy, by finding key words with low entropy (words occurring in a single text or in all texts have maximum entropy, occuring in 0.25 texts minimum entropy (max weight))<br>1:originality<br>2:skewed entropy<br>3:originality except isolation
   * @param {Boolean} applyIntensity takes into account occurrences of word into each text
   * @param {Table} [varname] if a words frquency table is provided, les frequent words are weighed
   * @return {Network}
   * tags:generator
   */
  StringListOperators.createShortTextsNetwork = function(texts, stopWords, relationThreshold, mode, applyIntensity, wordsFrequencyTable) {
    if(texts == null ||  texts.length == null || texts.length === 0) return;

    var _time = new Date().getTime();

    var network = new Network();
    var joined = texts.join(' *** ').toLowerCase();
    var textsLowerCase = joined.split(' *** ');
    var n_texts = texts.length;
    var i, j;
    var word;
    var nWords;
    var n_words;
    var weights;
    var weight;
    var maxWeight = 0;

    relationThreshold = relationThreshold || 0.2;
    mode = mode || 0;

    if(wordsFrequencyTable) {
      wordsFrequencyTable[0] = wordsFrequencyTable[0].toLowerCase();
      var maxFreq = wordsFrequencyTable[1][0];
      var index;
    }

    var weightFunction;
    switch(mode) {
      case 0: //pseudo-entropy
        weightFunction = function(nOtherTexts) {
          return 1 - Math.pow(2 * nOtherTexts / (n_texts - 1) - 1, 2);
        };
        break;
      case 1: //originality
        weightFunction = function(nOtherTexts) {
          return 1 / (nOtherTexts + 1);
        };
        break;
      case 2: //skewed entropy (favoring very few external occurrences)
        weightFunction = function(nOtherTexts) {
          return 1 - Math.pow(2 * Math.pow(nOtherTexts / (n_texts - 1), 0.2) - 1, 2);
        };
        break;
      default: //originality except isolation
        weightFunction = function(nOtherTexts) {
          if(nOtherTexts === 0) return 0;
          return 1 / nOtherTexts;
        };
        break;
    }

    console.log('A ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);
    _time = new Date().getTime();

    texts.forEach(function(text, i) {
      var node = new _Node("_" + i, "_" + i);
      network.addNode(node);
      node.content = text;
      var words = StringOperators.getWords(text, true, stopWords, false, false, 0, 3);

      n_words = words.length;
      weights = new NumberList();
      //words.forEach(function(word, j){
      for(j = 0; words[j] != null; j++) {
        word = words[j];
        var nOtherTexts = 0;
        textsLowerCase.forEach(function(text, k) {
          if(i == k) return;
          nOtherTexts += Number(text.indexOf(word) != -1); //is this the fastest way?
        });

        if(nOtherTexts === 0) {
          words.splice(j, 1);
          j--;
          continue;
        }

        weights[j] = weightFunction(nOtherTexts); //1-Math.pow(2*Math.pow(nOtherTexts/(n_texts-1), 0.25)-1, 2);

        if(applyIntensity) weights[j] *= (1 - 1 / (StringOperators.countOccurrences(textsLowerCase[i], word) + 1));

        if(wordsFrequencyTable) {
          index = wordsFrequencyTable[0].indexOf(word);
          //console.log(' •>•>•>•>•>•>•>•>•>•>•>•>•>•>•>•>•> ', word, weights[j], index==-1?1:(1 - Math.pow(wordsFrequencyTable[1][index]/maxFreq, 0.2)) )
          weights[j] *= (index == -1 ? 1 : (1 - Math.pow(wordsFrequencyTable[1][index] / maxFreq, 0.2)));
        }

        maxWeight = Math.max(maxWeight, weights[j]);
      }

      nWords = Math.floor(Math.log(n_words + 1) * 3);

      words = words.getSortedByList(weights, false).slice(0, nWords);

      words.position = {};
      words.forEach(function(word, j) {
        words.position[word] = j;
      });

      weights = weights.getSorted(false).slice(0, nWords);
      node.wordsTable = new Table();
      node.wordsTable[0] = words;
      node.wordsTable[1] = weights;
    });


    console.log('B ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);
    _time = new Date().getTime();

    for(i = 0; network.nodeList[i + 1] != null; i++) {
      var node = network.nodeList[i];
      for(j = i + 1; network.nodeList[j] != null; j++) {
        var node1 = network.nodeList[j];
        weight = 0;
        node.wordsTable[0].forEach(function(word, i) {
          //index = node1.wordsTable[0].indexOf(word);//TODO:this could be improved (as seen in forums, indexOf might be unneficient for arrays
          index = node1.wordsTable[0].position[word];
          if(index != null) weight += node.wordsTable[1][i] * node1.wordsTable[1][index];
        });
        weight = Math.sqrt((weight / maxWeight) / Math.max(node.wordsTable[0].length, node1.wordsTable[0].length));
        if(weight > relationThreshold) {
          var relation = new Relation(node.id + "_" + node1.id, node.id + "_" + node1.id, node, node1, weight);
          network.addRelation(relation);
        }
      }
    }

    console.log('C ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);

    return network;
  };

  /**
   * @classdesc  String Conversions
   *
   * @namespace
   * @category strings
   */
  function StringConversions() {}
  /**
   * converts a string in json format into an Object (JSON.parse(string))
   * @param  {String} string in format json
   * @return {Object}
   * tags:conversion
   */
  StringConversions.stringToObject = function(string) {
    try {
      return JSON.parse(string);
    } catch(err) {
      return null;
    }
  };

  /**
   * @classdesc Tools to Encode Trees
   *
   * @namespace
   * @category networks
   */
  function TreeEncodings() {}
  //include(frameworksRoot+"operators/strings/StringOperators.js");

  /**
   * @todo write docs
   */
  TreeEncodings.decodeIdentedTree = function(indexedTree, superiorNodeName, identationCharacter) {
    superiorNodeName = superiorNodeName == null ? "" : superiorNodeName;
    identationCharacter = identationCharacter == null ? "\t" : identationCharacter;

    var tree = new Tree();

    var lines = StringOperators.splitByEnter(indexedTree);
    var nLines = lines.length;

    if(nLines === 0 ||  (nLines == 1 && (lines[0] == null || lines[0] === ""))) return null;

    var i;
    var j;

    var line;
    var lineLength;
    var name;
    var level;

    var node;
    var parent;
    var superiorNode;

    if(superiorNodeName !== "" && superiorNodeName != null) {
      superiorNode = new _Node(superiorNodeName, superiorNodeName);
      tree.addNodeToTree(superiorNode, null);
    }

    for(i = 0; i < nLines; i++) {
      line = lines[i];
      lineLength = line.length;
      //c.log('line:'+line);
      for(j = 0; j < lineLength; j++) {
        if(line.charAt(j) != identationCharacter) {
          name = line.substr(j);
          break;
        }
      }

      node = new _Node(line, name);
      //c.log("+ ", name);
      if(j === 0) {
        if(superiorNode != null) {
          tree.addNodeToTree(node, superiorNode);
        } else {
          tree.addNodeToTree(node, null);
        }
      } else {
        level = j + 1 - Number(superiorNode == null);
        if(tree.getNodesByLevel(level - 1) != null && tree.getNodesByLevel(level - 1).length > 0) {
          parent = tree.getNodesByLevel(level - 1)[tree.getNodesByLevel(level - 1).length - 1];
        } else {
          parent = null;
        }
        //c.log("   ", node.name, "---------->>", parent.name);
        tree.addNodeToTree(node, parent);
      }
    }

    tree.assignDescentWeightsToNodes();

    return tree;
  };

  /**
   * @classdesc Tools to convert Trees to other data types
   *
   * @namespace
   * @category networks
   */
  function TreeConversions() {}
  /**
   * convert a table that describes a tree (higher hierarchies in first lists) into a Tree
   * @param {Table} table
   *
   * @param {String} fatherName name of father node
   * @return {Tree}
   * tags:convertion
   */
  TreeConversions.TableToTree = function(table, fatherName)  {
    if(table == null) return;

    fatherName = fatherName == null ? "father" : fatherName;

    var tree = new Tree();
    var node, parent;
    var id;

    var father = new _Node(fatherName, fatherName);
    tree.addNodeToTree(father, null);

    table.forEach(function(list, i) {
      table[i].forEach(function(element, j) {
        id = TreeConversions.getId(table, i, j);
        node = tree.nodeList.getNodeById(id);
        if(node == null) {
          node = new _Node(id, String(element));
          if(i === 0) {
            tree.addNodeToTree(node, father);
          } else {
            parent = tree.nodeList.getNodeById(TreeConversions.getId(table, i - 1, j));
            tree.addNodeToTree(node, parent);
          }
        }
      });
    });

    tree.assignDescentWeightsToNodes();

    return tree;
  };

  /**
   * @todo write docs
   */
  TreeConversions.getId = function(table, i, j) {
    var iCol = 1;
    var id = String(table[0][j]);
    while(iCol <= i) {
      id += "_" + String(table[iCol][j]);
      iCol++;
    }
    return id;
  };

  /**
   * @classdesc Provides a set of tools that work with Networks.
   *
   * @namespace
   * @category networks
   */
  function NetworkOperators() {}
  /**
   * Filters Network in-place to remove Nodes with less then minDegree connections.
   *
   * @param {Network} network Network to filter
   * @param {Number} minDegree The minimum number of Relations a
   * Node must have to remain in the Network.
   * @return {null}
   */
  NetworkOperators.filterNodesByMinDegree = function(network, minDegree) {
    var i;
    for(i = 0; network.nodeList[i] != null; i++) {
      if(network.nodeList[i].nodeList.length < minDegree) {
        network.removeNode(network.nodeList[i]);
        i--;
      }
    }
    return null;
  };


  /**
   *
   * @param {Network} network Network to work on.
   * @param {Node} node0 Source Node.
   * @param {Node} node1 Destination Node
   * @return {Number}
   */
  NetworkOperators.degreeBetweenNodes = function(network, node0, node1) {
    if(network == null || node0 == null || node1 == null) return null;

    if(node0 == node1) return 0;
    var nodes = node0.nodeList;
    var d = 1;
    var newNodes;
    var i;
    var nNodes;

    //while(nodes.indexOf(node1)==-1){//TODO: check if getNodeById is faster
    while(nodes.getNodeById(node1.id) == null) {
      newNodes = nodes.clone();
      nNodes = nodes.length;
      for(i = 0; i<nNodes; i++) {
        newNodes = ListOperators.concat(newNodes, nodes[i].nodeList); //TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
      }
      newNodes = newNodes.getWithoutRepetitions();
      if(nodes.length == newNodes.length) return -1;
      nodes = newNodes;
      d++;
    }

    return d;
  };

  /**
   * return a nodeList with all the nodes connected to two given nodes in a network
   * @param  {Network} network
   * @param  {Node} node0
   * @param  {Node} node1
   * @return {NodeList}
   * tags:
   */
  NetworkOperators.getNodesBetweenTwoNodes = function(network, node0, node1){
    var nodeList = new NodeList();
    var nNodes = network.nodeList.length;
    var i;
    var node;
    //network.nodeList.forEach(function(node){
    for(i=0; i<nNodes; i++){
      node = network.nodeList[i];
      if(node.id!=node0.id && node.id!=node1.id && node0.nodeList.getNodeById(node.id)!=null && node1.nodeList.getNodeById(node.id)!=null) nodeList.addNode(node);
    }
    return nodeList;
  };

  /**
   * Returns a NodeList with the Nodes in the Network that are part of the
   * first shortest path found between the two input nodes.
   *
   * @param {Network} network Network to work on.
   * @param {Node} node0 Source Node.
   * @param {Node} node1 Destination Node.
   * @param {Boolean} includeExtremes If true, include node0 and node1 in the returned list.
   * @return {NodeList} Nodes in the shortest path between node0 and node1.
   */
  NetworkOperators.shortestPath = function(network, node0, node1, includeExtremes) {
    if(network == null || node0 == null || node1 == null) return null;

    var tree = NetworkOperators.spanningTree(network, node0, node1);
    var path = new NodeList();
    if(includeExtremes) path.addNode(node1);
    var node = tree.nodeList.getNodeById(node1.id);

    if(node == null) return null;

    // console.log('---'); return;
    //


    while(node.parent.id != node0.id) {
      path.addNode(node.parent.node);
      node = node.parent;
      if(node == null) return null;
      //console.log('    >', node0.id, node1.id, node.id,  node.parent==null?'no parent!':node.parent.id);
    }

    // console.log('shortestPath, path', path);
    if(includeExtremes) path.addNode(node0);
    return path.getReversed();
  };


  /**
   * Finds all shortest paths between two nodes.
   *
   * @param  {Network} network Network to work on.
   * @param  {Node} node0 Source Node.
   * @param  {Node} node1 Destination Node.
   *
   * @param  {NodeList} shortPath In case a shortPath has been calculated previously
   * @param {Tree} spanningTree previously calculated spanning tree centered on node0
   * @return {Table} List of paths (NodeLists)
   */
  NetworkOperators.shortestPaths = function(network, node0, node1, shortPath, spanningTree) {
    if(network == null || node0 == null || node1 == null) return null;

    var i;
    var allPaths = new Table();


    if(node0.nodeList.getNodeById(node1.id)!=null){
      allPaths.push(new NodeList(node0, node1));
      return allPaths;
    }

    //c.clear();

    if(spanningTree==null) spanningTree = NetworkOperators.spanningTree(network, node0, node1);

    //console.log('[•--•] node0.id, node1.id', node0.id, node1.id);
    // console.log('[•--•] shortestPaths | spanningTree.nodeList.length, spanningTree.nLevels', spanningTree.nodeList.length, spanningTree.nLevels);

    // for(var i=0; i<spanningTree.nLevels; i++){
    //   // console.log('  [•--•] level:'+i, spanningTree.getNodesByLevel(i).getIds().join(','));
    // }

    //first we seek for the nodes in paths

    var n = spanningTree.nLevels;
    //console.log('[•--•] spanningTree.nLevels:', n);

    // console.log('[•--•] spanningTree.getNodesByLevel(spanningTree.nLevels-1).getNodeById(node1.id)', spanningTree.getNodesByLevel(spanningTree.nLevels-1).getNodeById(node1.id) );

    var level1 = new NodeList(node1);
    var extended_from_1 = NetworkOperators.adjacentNodeList(network, level1, false);
    var level0 = ListOperators.intersection(extended_from_1, spanningTree.getNodesByLevel(n-2));//spanningTree.getNodesByLevel(n-2);

    // console.log('[•--•] node1.nodeList', node1.nodeList.getIds().join(','));
    // console.log('[•--•] level1', level1.getIds().join(','));
    // console.log('[•--•] level on tree:', spanningTree.getNodesByLevel(n-2).getIds().join(','));
    // console.log('[•--•] extended_from_1', extended_from_1.getIds().join(','));
    // console.log('[•--•] ----> level0', level0.getIds().join(','));

    var relationsTable = new Table();
    var relationsBetween;

    relationsTable.push(NetworkOperators.getRelationsBetweenNodeLists(network, level0, level1, false));

    // console.log('  [•--•] relationsTable[last]', relationsTable[relationsTable.length-1].getIds().join(','));

    while(n>2){
      n--;
      level1 = level0;

      //interection of level1 xpanded and level n-2 in tree

      level0 = ListOperators.intersection(NetworkOperators.adjacentNodeList(network, level1, false), spanningTree.getNodesByLevel(n-2));
      // console.log('\n  [•--•] n:', n);
      // console.log('  [•--•] level1', level1.getIds().join(','));
      // console.log('  [•--•] level0', level0.getIds().join(','));

      relationsBetween = NetworkOperators.getRelationsBetweenNodeLists(network, level0, level1, false);
      //console.log('  [•--•] relationsBetween.length', relationsBetween.length);

      relationsTable.push(relationsBetween);
      // console.log('  [•--•] relationsTable[last]', relationsTable[relationsTable.length-1].getIds().join(','));
    }

    relationsTable = relationsTable.getReversed();

    //console.log('\n  [•--•] relationsTable', relationsTable );

    // console.log('[•--•] relationsTable.getLengths()', relationsTable.getLengths() );

    //console.log('[•--•] STOP for now'); return;

    //console.log('\n\n[•--•] /////////--- build paths ----///////');

    for(i=0; relationsTable[0][i]!=null; i++){
      allPaths.push( new NodeList(node0, relationsTable[0][i].getOther(node0)) );
    }

    var newPaths;

    var _findNewPaths = function(path, relations){
      var newPaths = new Table();
      var finalNode = path[path.length-1];
      var newPath;

      // console.log('   finalNode.id:',finalNode.id);

      relations.forEach(function(relation){
        // console.log('         test relation:', relation.id);
        if(finalNode.relationList.getNodeById(relation.id)){
          newPath = path.clone();
          newPath.addNode(relation.getOther(finalNode));
          // console.log('                newPath:',newPath.getIds().join(','));
          newPaths.push(newPath);
        }
      });

      return newPaths;
    };

    var toAdd;
    var nPaths;
    var path;

    // console.log('[•--•] allPaths', allPaths);
    // console.log('[•--•] allPaths[0]', allPaths[0]);

    while(allPaths[0].length<spanningTree.nLevels){
      //console.log('\nallPaths[0].length', allPaths[0].length);

      newPaths = new Table();
      nPaths = allPaths.length;
      //allPaths.forEach(function(path){
      for(i=0; i<nPaths; i++){
        path = allPaths[i];
        // console.log('        path:',path.getIds().join(','));
        toAdd = _findNewPaths(path, relationsTable[path.length-1]);
        // console.log('          added '+toAdd.length+' paths');
        newPaths = newPaths.concat(toAdd);
      }
      allPaths = newPaths;
      // console.log('  [•--•] allPaths[0].length', allPaths[0].length);
    }


    //console.log('allPaths.length:',allPaths.length);
    // console.log('allPaths!!!!:',allPaths);

    // allPaths.forEach(function(path, i){
    //   console.log('[•--•] path '+i+': '+path.getIds().join(','));
    // });

    return allPaths;




    // if(shortPath == null) shortPath = NetworkOperators.shortestPath(network, node0, node1, true);

    // var lengthShortestPaths = shortPath.length;


    // var firstPath = new NodeList();
    // var i;

    // firstPath.addNode(node0);
    // allPaths.push(firstPath);


    // var all = NetworkOperators._extendPaths(allPaths, node1, lengthShortestPaths);

    // for(i = 0; all[i] != null; i++) {
    //   if(all[i][all[i].length - 1] != node1) {
    //     all.splice(i, 1);
    //     i--;
    //   }
    // }

    // return all;
  };

  /**
   * finds all relations between two nodeLists
   * @param  {Network} network
   * @param  {NodeList} nodeList0
   * @param  {NodeList} nodeList1
   * @param  {Boolean} directed if true (default value), it finds relations pointing to first nodeList to second
   * @return {RelationList}
   * tags:
   */
  NetworkOperators.getRelationsBetweenNodeLists = function(network, nodeList0, nodeList1, directed){
    if(nodeList0==null || nodeList1==null) return null;

    if(directed==null) directed=true;

    var relations = new RelationList();
    var nRelations = network.relationList.length;
    var relation;
    var i;

    //network.relationList.forEach(function(relation){
    for(i=0; i<nRelations; i++){
      relation = network.relationList[i];
      if(
        (nodeList0.getNodeById(relation.node0.id)!=null && nodeList1.getNodeById(relation.node1.id)!=null) ||
        (!directed && nodeList0.getNodeById(relation.node1.id)!=null && nodeList1.getNodeById(relation.node0.id)!=null)
      ){
        relations.addRelation(relation);
      }
    }

    return relations;
  };


  /**
   * @ignore
   */
  NetworkOperators._extendPaths = function(allPaths, nodeDestiny, maxLength) {

    if(allPaths[0].length >= maxLength) return allPaths;

    var i, j;
    var next;
    var node;

    var newPaths = new Table();
    var path, newPath;
    var nPaths = allPaths.length;
    var nNext;

    for(i = 0; i<nPaths; i++) {
      path = allPaths[i];
      node = path[path.length - 1];
      next = node.nodeList.getWithoutRepetitions();
      nNext = next.length;

      for(j = 0; j<nNext; j++) {
        if(path.getNodeById(next[j].id) == null) {
          newPath = path.clone();
          newPath.addNode(next[j]);
          newPaths.push(newPath);
        }
      }

    }

    allPaths = newPaths;

    return NetworkOperators._extendPaths(allPaths, nodeDestiny, maxLength);

  };

  /**
   * Finds all loops in the network
   *
   * @param  {Network} network
   * @param {Number} minSize minimum size of loops
   * @return {Table} list of nodeLists
   * tags:analytics
   */
  NetworkOperators.loops = function(network, minSize) {
    if(network == null) return null;

    var i, j, k, loops;

    var allLoops = new Table();

    for(i = 0; network.nodeList[i] != null; i++) {
      loops = NetworkOperators._getLoopsOnNode(network.nodeList[i]);

      for(k = 0; allLoops[k] != null; k++) {
        for(j = 0; loops[j] != null; j++) {
          if(NetworkOperators._sameLoop(loops[j], allLoops[k])) {
            loops.splice(j, 1);
            j--;
          }
        }
      }
      allLoops = allLoops.concat(loops);
    }

    if(minSize) allLoops = allLoops.getFilteredByPropertyValue("length", minSize, "greater");

    allLoops.sort(function(a0, a1) {
      return a0.length > a1.length ? -1 : 1;
    });

    allLoops.forEach(function(loop) {
      console.log(loop.getIds().join('-'));
    });

    return allLoops;
  };

  NetworkOperators._sameLoop = function(loop0, loop1) {
    if(loop0.length != loop1.length) return false;
    if(loop1.getNodeById(loop0[0].id) == null) return false;

    var i1 = loop1.indexOf(loop0[0]);
    var l = loop0.length;
    for(var i = 1; loop0[i] != null; i++) {
      if(loop0[i] != loop1[(i + i1) % l]) return false;
    }
    return true;
  };

  /**
   * @ignore
   */
  NetworkOperators._getLoopsOnNode = function(central) {
    if(central.toNodeList.length === 0 || central.fromNodeList.length === 0) return [];

    var columns = new Table();
    var nl = new NodeList();
    var n, i, j;
    var node;

    nl.addNode(central);
    columns.push(nl);

    NetworkOperators._loopsColumns(central.toNodeList, 1, columns, 1);

    //purge
    for(n = 1; columns[n]; n++) {
      for(i = 1; columns[i] != null; i++) {
        for(j = 0; columns[i][j] != null; j++) {
          node = columns[i][j];
          delete node.onColumn;
          if(node.toNodeList.length === 0) {
            columns[i].removeNodeAtIndex(j);
            j--;
          }
        }
      }
    }

    /////////////////////
    //build loops
    var loops = new Table();
    var loop;
    for(i = 1; columns[i] != null; i++) {
      for(j = 0; columns[i][j] != null; j++) {
        node = columns[i][j];
        //if(node.toNodeList.indexOf(central)!=-1){
        if(node.toNodeList.getNodeById(central.id) != null) {
          loop = new NodeList(node);
          loops.push(loop);
          NetworkOperators._pathsToCentral(columns, i, loop, loops);
        }
      }
    }

    loops.sort(function(a0, a1) {
      return a0.length > a1.length ? -1 : 1;
    });

    return loops;
  };

  /**
   * @ignore
   */
  NetworkOperators._pathsToCentral = function(columns, iColumn, path, paths) {
    if(path.finished) return;

    if(iColumn === 0) {
      path.finished = true;
      return;
    }

    var i;
    var node = path[0];
    var prevNode;
    var prevPath;
    var newPath;
    var first = true;

    var nodesToCheck = columns[iColumn - 1].clone();
    nodesToCheck.addNodes(columns[iColumn]);

    var lPrevColumn = columns[iColumn - 1].length;

    for(i = 0; nodesToCheck[i] != null; i++) {
      prevNode = nodesToCheck[i];
      //if(node==prevNode || path.indexOf(prevNode)!=-1 || (prevPath!=null && prevPath.indexOf(prevNode)!=-1)) continue;
      if(node == prevNode || path.getNodeById(prevNode.id) != null || (prevPath != null && prevPath.getNodeById(prevNode.id) != null)) continue;

      //if(prevNode.toNodeList.indexOf(node)!=-1){

      if(prevNode.toNodeList.getNodeById(node.id) != null) {
        if(first) {
          prevPath = path.clone();

          path.unshift(prevNode);
          path.ids[prevNode.id] = prevNode;

          NetworkOperators._pathsToCentral(columns, i < lPrevColumn ? (iColumn - 1) : iColumn, path, paths);
          first = false;
        } else {
          newPath = prevPath.clone();

          paths.push(newPath);

          newPath.unshift(prevNode);
          newPath.ids[prevNode.id] = prevNode;

          NetworkOperators._pathsToCentral(columns, i < lPrevColumn ? (iColumn - 1) : iColumn, newPath, paths);
        }
      }
    }
  };

  /**
   * @ignore
   */
  NetworkOperators._loopsColumns = function(nodeList, iColumn, columns) {
    if(columns[iColumn] == null) columns[iColumn] = new NodeList();
    var node;
    var newNodeList = new NodeList();
    for(var i = 0; nodeList[i] != null; i++) {
      node = nodeList[i];
      if(!node.onColumn) {
        node.onColumn = true;
        columns[iColumn].addNode(node);
        newNodeList.addNodes(node.toNodeList);
      }
    }
    newNodeList = newNodeList.getWithoutRepetitions();
    for(i = 0; newNodeList[i] != null; i++) {
      if(newNodeList[i].onColumn) {
        newNodeList.removeNodeAtIndex(i);
        //newNodeList.ids[newNodeList[i].id] = null;
        //newNodeList.splice(i, 1);
        i--;
      }
    }
    if(newNodeList.length > 0) NetworkOperators._loopsColumns(newNodeList, iColumn + 1, columns);
  };




  /**
   * Builds a spanning tree of a Node in a Network (not very efficient)
   * @param  {Network} network
   *
   * @param  {Node} node0 Parent of the tree (first node on network.nodeList by default)
   * @param  {Node} nodeLimit Optional node in the network to prune the tree
   * @return {Tree}
   * tags:
   */
  NetworkOperators.spanningTree = function(network, node0, nodeLimit) { //TODO: this method is horribly inneficient // add: level limt
    if(network==null) return;

    node0 = node0==null?network.nodeList[0]:node0;

    var tree = new Tree();
    var parent = new _Node(node0.id, node0.name);
    parent.node = node0;
    tree.addNodeToTree(parent);

    //console.log('spanningTree | network, node0.id, nodeLimit.id', network, node0.id, nodeLimit==null?'nodeLimit=null':nodeLimit.id);

    var nodes = node0.nodeList;
    var newNodes;
    var newNode;
    var nodeInPrevNodes;
    var i;
    var id;

    var limitReached = false;

    for(i = 0; nodes[i] != null; i++) {
      newNode = new _Node(nodes[i].id, nodes[i].name);
      if(newNode.id == parent.id) continue;
      newNode.node = nodes[i];
      tree.addNodeToTree(newNode, parent);
      //console.log('  spanningTree | add:', newNode.id)
      //console.log('                               spanningTree add node: newNode.id, nodeLimit.id', newNode.id, nodeLimit.id);
      if(nodeLimit != null && newNode.id == nodeLimit.id){
        limitReached = true;
        //console.log('       spanningTree | limitReached!');
      }
    }
    //console.log('spanningTree |  limitReached A',  limitReached);

    if(limitReached) return tree;

    var accumulated = nodes.clone();
    accumulated.addNode(node0);

    var N = 0;

    while(true) {
      newNodes = new NodeList(); //nodes.clone();
      for(i = 0; nodes[i] != null; i++) {
        newNodes.addNodes(nodes[i].nodeList); //TODO: check if obsolete concat + check if a concatIfNew could be useful, specially if overriden in NodeList, with getNodeById
      }
      //console.log('N '+N);
      newNodes = newNodes.getWithoutRepetitions();
      // console.log('      newNodes.getIds()', newNodes.getIds().join(','));
      // console.log('      accumulated.getIds()', accumulated.getIds().join(','));
      newNodes.removeElements(accumulated);
      // console.log('      newNodes.removeElements(accumulated) | newNodes.getIds()', newNodes.getIds().join(','));
      //console.log('newNodes.length (if 0 return tree)', newNodes.length)
      if(newNodes.length === 0) return tree;

      for(i = 0; newNodes[i] != null; i++) {
        newNode = new _Node(newNodes[i].id, newNodes[i].name);
        // console.log('                   ++'+newNodes[i].id);
        newNode.node = newNodes[i];
        for(var j = 0; newNodes[i].nodeList[j] != null; j++) {
          id = newNodes[i].nodeList[j].id;
          nodeInPrevNodes = nodes.getNodeById(id);
          if(nodeInPrevNodes != null && newNode.id != id) {
            tree.addNodeToTree(newNode, tree.nodeList.getNodeById(id));
            break;
          }
        }
        if(nodeLimit != null && newNode.id == nodeLimit.id){
          limitReached = true;
        }
      }

      //console.log('spanningTree |  limitReached B (if true return tree)',  limitReached);
      if(limitReached) limitReached = true;

      if(limitReached) return tree;

      nodes = newNodes;
      // console.log('     --concat');
      accumulated = accumulated.concat(newNodes);

      N++;
      if(N>network.nodeList){
        //console.log('/////////////////STOP');
        return null;
      }
    }

    //console.log('return spanningTree:', tree);
    return tree;
  };

  /**
   * find nodes in next degree to a list of nodes (adjacent nodes)
   * @param  {Network} network
   * @param  {NodeList} nodeList
   * @param  {Boolean} returnConcat if true (false bu default) return nodeList and adjacent, if false only adjacent
   * @param {Boolean} directional (false by default) adjacent nodes are only the ones pointed by direct relations from nodes in the nodeList
   * @return {NodeList}
   * tags:
   */
  NetworkOperators.adjacentNodeList = function(network, nodeList, returnConcat, directional){
    if(network==null || nodeList==null) return null;

    var newNodeList = returnConcat?nodeList.clone():new NodeList();
    var i, j;
    var node0, node1;

    if(directional){
      for(i=0; nodeList[i]!=null; i++){
        for(j=0; nodeList[i].toNodeList[j]!=null; j++){
          node1 = nodeList[i].toNodeList[j].id;
          if(nodeList.getNodeById(node1)==null && newNodeList.getNodeById(node1)==null) newNodeList.addNode(node1);
        }
      }

      return newNodeList;
    }

    for(i=0; nodeList[i]!=null; i++){
      for(j=0; nodeList[i].relationList[j]!=null; j++){
        node0 = nodeList[i].relationList[j].node0;
        node1 = nodeList[i].relationList[j].node1;
        if(nodeList.getNodeById(node0.id)==null && newNodeList.getNodeById(node0.id)==null ) newNodeList.addNode(node0);
        if(nodeList.getNodeById(node1.id)==null && newNodeList.getNodeById(node1.id)==null ) newNodeList.addNode(node1);
      }
    }

    return newNodeList;

  };

  NetworkOperators.degreesPartition = function(network, node) {
    //TODO:optionally add a NodeList of not connected Nodes
    var list0 = new NodeList(node);
    var nodes = node.nodeList;
    var nextLevel = nodes;
    var nextNodes;
    var externalLayer;
    var i;
    var j;
    var nodesTable = new Table(list0);
    var added = nextLevel.length > 0;

    if(added) nodesTable.push(nextLevel);

    var listAccumulated = nextLevel.clone();
    listAccumulated.push(node);

    while(added) {
      externalLayer = new NodeList();
      for(i = 0; nextLevel[i] != null; i++) {
        nextNodes = nextLevel[i].nodeList;
        for(j = 0; nextNodes[j] != null; j++) {
          if(listAccumulated.indexOf(nextNodes[j]) == -1) { //fix this
            externalLayer.push(nextNodes[j]);
            listAccumulated.push(nextNodes[j]);
          }
        }
      }
      added = externalLayer.length > 0;
      if(added) {
        nextLevel = externalLayer;
        nodesTable.push(nextLevel);
      }
    }

    return nodesTable;
  };

  NetworkOperators.degreesFromNodeToNodes = function(network, node, nodeList) {
    //TODO: probably very unefficient
    var table = NetworkOperators.degreesPartition(network, node);
    var degrees = new NumberList();
    degrees.max = 0;
    var j;
    for(var i = 0; nodeList[i] != null; i++) {
      if(nodeList[i] == node) {
        degrees[i] = 0;
      } else {
        for(j = 1; table[j] != null; j++) {
          if(table[j].indexOf(nodeList[i]) != -1) { //use getNodeById
            degrees[i] = j;
            degrees.max = Math.max(degrees.max, j);
            break;
          }
        }
      }
      if(degrees[i] == null) degrees[i] = -1;
    }
    return degrees;
  };

  /**
   * Builds a dendrogram from a Network.
   *
   * @param  {Network} network
   * @return {Tree}
   * tags:analysis
   */
  NetworkOperators.buildDendrogram = function(network) {
    if(network == null) return null;

    var tree = new Tree();
    var nodeList = new NodeList();

    var closest;
    var node0;
    var node1;
    var newNode;
    var id;
    var i;
    var nNodes = network.nodeList.length;

    var pRelationPair = 2 * network.relationList.length / (nNodes * (nNodes - 1));

    for(i = 0; network.nodeList[i] != null; i++) {
      newNode = new _Node("[" + network.nodeList[i].id + "]", "[" + network.nodeList[i].id + "]");
      newNode.nodes = new NodeList(network.nodeList[i]);
      tree.addNode(newNode);
      nodeList[i] = newNode;
    }


    while(nodeList.length > 1) {
      closest = NetworkOperators._getClosestPair(nodeList, true, pRelationPair);

      node0 = nodeList[closest[0]];
      node1 = nodeList[closest[1]];

      id = "[" + node0.id + "-" + node1.id + "]";

      newNode = new _Node(id, id);
      newNode.weight = closest.strength;

      tree.addNode(newNode);
      tree.createRelation(newNode, node0, id + "-" + node0.id);
      tree.createRelation(newNode, node1, id + "-" + node1.id);

      newNode.node = new _Node(id, id);
      newNode.nodes = node0.nodes.concat(node1.nodes);

      for(i = 0; node0.nodeList[i] != null; i++) {
        newNode.node.nodeList.addNode(node0.nodeList[i]);
        newNode.node.relationList.addRelation(node0.relationList[i]);
      }
      for(i = 0; node1.nodeList[i] != null; i++) {
        newNode.node.nodeList.addNode(node1.nodeList[i]);
        newNode.node.relationList.addRelation(node1.relationList[i]);
      }

      nodeList.removeElement(node0);
      nodeList.removeElement(node1);
      nodeList.addNode(newNode);
    }


    //recalculate levels for nodes here
    for(i = 0; tree.nodeList[i] != null; i++) {
      node0 = tree.nodeList[i];
      if(node0.nodes.length > 1) {
        node0.level = Math.max(node0.nodeList[0].level, node0.nodeList[1].level) + 1;
      }
    }

    return tree;
  };

  /**
   * @ignore
   */
  NetworkOperators._getClosestPair = function(nodeList, returnIndexes, pRelationPair) {
    var indexes;
    var nodes;

    if(nodeList.length == 2) {
      var index = nodeList[0].nodeList.indexOf(nodeList[1]);
      //var index = nodeList[0].nodeList.indexOfElement(nodeList[1]);
      if(returnIndexes) {
        indexes = [0, 1];
        indexes.strength = index == -1 ? 0 : nodeList[0].relationList[index].weight;
        return indexes;
      }
      nodes = new NodeList(nodeList[0], nodeList[1]);
      nodes.strength = index == -1 ? 0 : nodeList[0].relationList[index].weight;
      return nodes;
    }

    var i;
    var j;

    var nodeList0;

    var strength;
    var maxStrength = -1;

    for(i = 0; nodeList[i + 1] != null; i++) {
      nodeList0 = nodeList[i].nodes;
      for(j = i + 1; nodeList[j] != null; j++) {
        strength = NetworkOperators._strengthBetweenSets(nodeList0, nodeList[j].nodes, pRelationPair);
        //console.logog('        i,j,strength, nodeList0.length, nodeList[j].nodes.length', i, j, strength, nodeList0.length, nodeList[j].nodes.length);
        if(strength > maxStrength) {
          indexes = [i, j];
          maxStrength = strength;
          //console.logog('    ---> i, j, new maxStrength', i, j, maxStrength);
        }
      }
    }
    indexes.strength = maxStrength;
    if(returnIndexes) return indexes;
    nodes = new NodeList(nodeList[indexes[0]], nodeList[indexes[1]]);
    nodes.strength = maxStrength;
    return nodes;

  };

  /**
   * @ignore
   */
  NetworkOperators._strengthBetweenSets = function(nodeList0, nodeList1, pRelationPair) {
    var strength = 0;
    var i, j;
    var node0;

    for(i = 0; nodeList0[i] != null; i++) {
      node0 = nodeList0[i];
      for(j = 0; node0.nodeList[j] != null; j++) {
        if(nodeList1.indexOf(node0.nodeList[j]) != -1) {
        //if(nodeList1.getNodeById(node0.nodeList[j].id) != null) { // <----- seemed to be slower!
          strength += node0.relationList[j].weight;
        }
      }
    }

    return strength / (nodeList0.length * nodeList1.length * pRelationPair);
  };



  /**
   * Builds a Table of clusters, based on an dendrogram Tree (if not provided it will be calculated), and a weight bias
   * @param  {Network} network
   *
   * @param  {Tree} dendrogramTree Dendrogram Tree, if precalculated, changes in weight bias will perform faster
   * @param  {Number} minWeight Weight bias, criteria to group clusters (0.5 default)
   * @return {Table} List of NodeLists
   * tags:analysis
   */
  NetworkOperators.buildNetworkClusters = function(network, dendrogramTree, minWeight) {
    if(network == null) return;

    if(dendrogramTree == null) dendrogramTree = NetworkOperators.buildDendrogram(network);
    minWeight = minWeight || 0.5;

    var clusters = new Table();

    NetworkOperators._iterativeBuildClusters(dendrogramTree.nodeList[dendrogramTree.nodeList.length - 1], clusters, minWeight);

    return clusters;
  };

  /**
   * @ignore
   */
  NetworkOperators._iterativeBuildClusters = function(node, clusters, minWeight) {
    if(node.nodeList.length == 1) {
      clusters.push(new NodeList(node.node));
      return;
    }

    if(node.nodeList[0].nodes.length == 1 || node.nodeList[0].weight > minWeight) {
      clusters.push(node.nodeList[0].nodes);
    } else {
      NetworkOperators._iterativeBuildClusters(node.nodeList[0], clusters, minWeight);
    }

    if(node.nodeList[1].nodes.length == 1 || node.nodeList[1].weight > minWeight) {
      clusters.push(node.nodeList[1].nodes);
    } else {
      NetworkOperators._iterativeBuildClusters(node.nodeList[1], clusters, minWeight);
    }
  };




  /**
   * Adds PageRank as <strong>fromPageRank</strong> and <strong>toPageRank</strong> properties See {@link http://en.wikipedia.org/wiki/Page_rank|Page Rank} for more details. fromPageRank or toPageRank will be added as propertie to Nodes.
   * I use two different pageranks, since a Network whose relations measure influence would require a pagerank to measure nodes influence into the system.
   *
   * @param {Network} network
   * @param {Boolean} From=true Optional, default:true, to set if the PageRank uses the in-relations or out-relations
   * @param {Boolean} useRelationsWeigh=false Optional, default:false, set to true if relations weight will affect the metric balance, particularly interesting if some weights are negative
   * tags:analytics,transformative
   */
  NetworkOperators.addPageRankToNodes = function(network, from, useRelationsWeight) {
    //TODO:deploy useRelationsWeight
    from = from == null ? true : from;

    var n;
    var i;
    var j;
    var d = 0.85; //dumping factor;
    var N = network.nodeList.length;
    var base = (1 - d) / N;
    var propName = from ? "fromPageRank" : "toPageRank";
    var node;
    var otherNode;
    var nodeList;

    network.minFromPageRank = network.minToPageRank = 99999999;
    network.maxFromPageRank = network.maxToPageRank = -99999999;


    for(i = 0; network.nodeList[i] != null; i++) {
      node = network.nodeList[i];
      node[propName] = 1 / N;
    }

    for(n = 0; n < 300; n++) {
      for(i = 0; network.nodeList[i] != null; i++) {
        node = network.nodeList[i];

        nodeList = from ? node.fromNodeList : node.toNodeList;
        node[propName] = base;

        for(j = 0; nodeList[j] != null; j++) {
          otherNode = nodeList[j];
          node[propName] += d * otherNode[propName] / (from ? otherNode.toNodeList.length : otherNode.fromNodeList.length);
        }

        if(n == 299) {
          if(from) {
            network.minFromPageRank = Math.min(network.minFromPageRank, node[propName]);
            network.maxFromPageRank = Math.max(network.maxFromPageRank, node[propName]);
          } else {
            network.minToPageRank = Math.min(network.minToPageRank, node[propName]);
            network.maxToPageRank = Math.max(network.maxToPageRank, node[propName]);
          }
        }
      }
    }
  };


  /**
   * Builds a fusioned Network from a list of network codes, with nodes with same names coming from different source networks (called hubs) connected
   * @param  {List} noteworksList
   *
   * @param  {Number} hubsDistanceFactor distance between repeated nodes (hubs)
   * @param  {Number} hubsForceWeight strength factor for the relation when using a forces engine
   * @return {Network}
   */
  NetworkOperators.fusionNoteworks = function(noteworksList, hubsDistanceFactor, hubsForceWeight) {
    var networks = new List();

    noteworksList.forEach(function(map, i) {
      var subfix = "map_" + i + "_";
      var net = NetworkEncodings.decodeNoteWork(map);
      net = net.clone(net.nodesPropertiesNames, net.relationsPropertiesNames, subfix);
      net.id = "map_" + i;
      networks.push(net);
    });

    return NetworkOperators.fusionNetworks(networks, hubsDistanceFactor, hubsForceWeight);
  };


  /**
   * Builds a fusioned Network, with nodes with same names coming from different source networks (called hubs) connected
   * @param  {List} networks list of networks
   *
   * @param  {Number} hubsDistanceFactor distance between repeated nodes (hubs)
   * @param  {Number} hubsForceWeight strength factor for the relation when using a forces engine
   * @return {Network} fusioned Network
   */
  NetworkOperators.fusionNetworks = function(networks, hubsDistanceFactor, hubsForceWeight) {
    hubsDistanceFactor = hubsDistanceFactor == null ? 1 : hubsDistanceFactor;
    hubsForceWeight = hubsForceWeight == null ? 1 : hubsForceWeight;

    var fusionNet = new Network();
    var newNode;
    var newRelation;
    var i, j;
    var mapsCluster = new Table();

    var colors = ColorListGenerators.createDefaultCategoricalColorList(networks.length).getInterpolated('black', 0.17).getInterpolated('white', 0.55);

    networks.forEach(function(net, i) {
      mapsCluster[i] = new NodeList();

      net.nodeList.forEach(function(node) {

        newNode = fusionNet.nodeList.getNodeById(node.id);

        if(newNode == null) {
          newNode = new _Node(node.id, node.name);
          newNode.basicId = node.basicId;
          newNode.mapId = "map_" + i;
          newNode.mapsIds = [newNode.mapId];
          newNode.color = colors[i];
          newNode.nMaps = 1;
          newNode.weight = node.weight;
          fusionNet.addNode(newNode);
          mapsCluster[i].addNode(newNode);
        } else {
          newNode.nMaps += 1;
          newNode.mapsIds.push("map_" + i);
          newNode.color = 'rgb(200,200,200)';
        }
      });

    });



    networks.forEach(function(net) {
      net.relationList.forEach(function(relation) {
        newRelation = new Relation(relation.id, relation.name, fusionNet.nodeList.getNodeById(relation.node0.id), fusionNet.nodeList.getNodeById(relation.node1.id));
        newRelation.color = relation.color;
        newRelation.content = relation.content;
        newRelation.description = relation.description;
        newRelation.weight = relation.weight;
        fusionNet.addRelation(newRelation);
      });
    });

    var node0;

    for(i = 0; fusionNet.nodeList[i] != null; i++) {
      node0 = fusionNet.nodeList[i];
      for(j = i + 1; fusionNet.nodeList[j] != null; j++) {
        if(node0.name == fusionNet.nodeList[j].name) {
          //newRelation = new Relation(node0.id+'_'+fusionNet.nodeList[j].id, node0.id+'_'+fusionNet.nodeList[j].id, node0, fusionNet.nodeList[j]);
          newRelation = new Relation(node0.id + '_' + fusionNet.nodeList[j].id, "same variable", node0, fusionNet.nodeList[j]);
          newRelation.color = 'black';
          newRelation.distanceFactor = hubsDistanceFactor;
          newRelation.forceWeight = hubsForceWeight;
          fusionNet.addRelation(newRelation);

          newRelation = new Relation(fusionNet.nodeList[j].id + '_' + node0.id, "same variable", fusionNet.nodeList[j], node0);
          newRelation.color = 'black';
          newRelation.distanceFactor = hubsDistanceFactor;
          newRelation.forceWeight = hubsForceWeight;
          fusionNet.addRelation(newRelation);

          newRelation.node0.nMaps += 1;
          newRelation.node1.nMaps += 1;
        }
      }
    }

    for(i = 0; fusionNet.nodeList[i] != null; i++) {
      fusionNet.nodeList[i].hubWeight = Math.sqrt(fusionNet.nodeList[i].nMaps - 1);
    }

    fusionNet.mapsCluster = mapsCluster;

    return fusionNet;
  };

  /*
   *
   * from https://github.com/upphiminn/jLouvain
   */
  NetworkOperators._jLouvain = function() {
    //Constants
    var __PASS_MAX = -1;
    var __MIN    = 0.0000001;

    //Local vars
    var original_graph_nodes;
    var original_graph_edges;
    var original_graph = {};
    var partition_init;

    //Helpers
    function make_set(array){
      var set = {};
      array.forEach(function(d){
        set[d] = true;
      });
      return Object.keys(set);
    }

    function obj_values(obj){
       var vals = [];
       for( var key in obj ) {
           if ( obj.hasOwnProperty(key) ) {
               vals.push(obj[key]);
           }
       }
       return vals;
    }

    function get_degree_for_node(graph, node){
      var neighbours = graph._assoc_mat[node] ? Object.keys(graph._assoc_mat[node]) : [];
      var weight = 0;
      neighbours.forEach(function(neighbour){
        var value = graph._assoc_mat[node][neighbour] || 1;
        if(node == neighbour)
          value *= 2;
        weight += value;
      });
      return weight;
    }

    function get_neighbours_of_node(graph, node){
      if(typeof graph._assoc_mat[node] == 'undefined')
        return [];

      var neighbours = Object.keys(graph._assoc_mat[node]);
      return neighbours;
    }


    function get_edge_weight(graph, node1, node2){
      return graph._assoc_mat[node1] ? graph._assoc_mat[node1][node2] : undefined;
    }

    function get_graph_size(graph){
      var size = 0;
      graph.edges.forEach(function(edge){
        size += edge.weight;
      });
      return size;
    }

    function add_edge_to_graph(graph, edge){
      update_assoc_mat(graph, edge);

      var edge_index = graph.edges.map(function(d){
        return d.source+'_'+d.target;
      }).indexOf(edge.source+'_'+edge.target);

      if(edge_index != -1)
        graph.edges[edge_index].weight = edge.weight;
      else
        graph.edges.push(edge);
    }

    function make_assoc_mat(edge_list){
      var mat = {};
      edge_list.forEach(function(edge){
        mat[edge.source] = mat[edge.source] || {};
        mat[edge.source][edge.target] = edge.weight;
        mat[edge.target] = mat[edge.target] || {};
        mat[edge.target][edge.source] = edge.weight;
      });

      return mat;
    }

    function update_assoc_mat(graph, edge){
      graph._assoc_mat[edge.source] = graph._assoc_mat[edge.source] || {};
      graph._assoc_mat[edge.source][edge.target] = edge.weight;
      graph._assoc_mat[edge.target] = graph._assoc_mat[edge.target] || {};
      graph._assoc_mat[edge.target][edge.source] = edge.weight;
    }

    function clone(obj){
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor();

        for(var key in obj)
            temp[key] = clone(obj[key]);
        return temp;
    }

    //Core-Algorithm Related
    function init_status(graph, status, part){
      status.nodes_to_com = {};
      status.total_weight = 0;
      status.internals = {};
      status.degrees = {};
      status.gdegrees = {};
      status.loops = {};
      status.total_weight = get_graph_size(graph);

      if(typeof part == 'undefined'){
        graph.nodes.forEach(function(node,i){
          status.nodes_to_com[node] = i;
          var deg = get_degree_for_node(graph, node);
          if (deg < 0)
            throw 'Bad graph type, use positive weights!';
          status.degrees[i] = deg;
          status.gdegrees[node] = deg;
          status.loops[node] = get_edge_weight(graph, node, node) || 0;
          status.internals[i] = status.loops[node];
        });
      }else{
        graph.nodes.forEach(function(node){
          var com = part[node];
          status.nodes_to_com[node] = com;
          var deg = get_degree_for_node(graph, node);
          status.degrees[com] = (status.degrees[com] || 0) + deg;
          status.gdegrees[node] = deg;
          var inc = 0.0;

          var neighbours  = get_neighbours_of_node(graph, node);
          neighbours.forEach(function(neighbour){
            var weight = graph._assoc_mat[node][neighbour];
            if (weight <= 0){
              throw "Bad graph type, use positive weights";
            }

            if(part[neighbour] == com){
              if (neighbour == node){
                inc += weight;
              }else{
                inc += weight/2.0;
              }
            }
          });
          status.internals[com] = (status.internals[com] || 0) + inc;
        });
      }
    }

    function __modularity(status){
      var links = status.total_weight;
      var result = 0.0;
      var communities = make_set(obj_values(status.nodes_to_com));

      communities.forEach(function(com){
        var in_degree = status.internals[com] || 0 ;
        var degree = status.degrees[com] || 0 ;
        if(links > 0){
          result = result + in_degree / links - Math.pow((degree / (2.0*links)), 2);
        }
      });
      return result;
    }

    function __neighcom(node, graph, status){
      // compute the communities in the neighb. of the node, with the graph given by
      // node_to_com

      var weights = {};
      var neighboorhood = get_neighbours_of_node(graph, node);//make iterable;

      neighboorhood.forEach(function(neighbour){
        if(neighbour != node){
          var weight = graph._assoc_mat[node][neighbour] || 1;
          var neighbourcom = status.nodes_to_com[neighbour];
          weights[neighbourcom] = (weights[neighbourcom] || 0) + weight;
        }
      });

      return weights;
    }

    function __insert(node, com, weight, status){
      //insert node into com and modify status
      status.nodes_to_com[node] = +com;
      status.degrees[com] = (status.degrees[com] || 0) + (status.gdegrees[node]||0);
      status.internals[com] = (status.internals[com] || 0) + weight + (status.loops[node]||0);
    }

    function __remove(node, com, weight, status){
      //remove node from com and modify status
      status.degrees[com] = ((status.degrees[com] || 0) - (status.gdegrees[node] || 0));
      status.internals[com] = ((status.internals[com] || 0) - weight -(status.loops[node] ||0));
      status.nodes_to_com[node] = -1;
    }

    function __renumber(dict){
      var count = 0;
      var ret = clone(dict); //deep copy :)
      var new_values = {};
      var dict_keys = Object.keys(dict);
      dict_keys.forEach(function(key){
        var value = dict[key];
        var new_value =  typeof new_values[value] =='undefined' ? -1 : new_values[value];
        if(new_value == -1){
          new_values[value] = count;
          new_value = count;
          count = count + 1;
        }
        ret[key] = new_value;
      });
      return ret;
    }

    function __one_level(graph, status){
      //Compute one level of the Communities Dendogram.
      var modif = true,
        nb_pass_done = 0,
        cur_mod = __modularity(status),
        new_mod = cur_mod;

      while (modif && nb_pass_done != __PASS_MAX){
        cur_mod = new_mod;
        modif = false;
        nb_pass_done += 1;

        graph.nodes.forEach(function(node){
          var com_node = status.nodes_to_com[node];
          var degc_totw = (status.gdegrees[node] || 0) / (status.total_weight * 2.0);
          var neigh_communities = __neighcom(node, graph, status);
          __remove(node, com_node, (neigh_communities[com_node] || 0.0), status);
          var best_com = com_node;
          var best_increase = 0;
          var neigh_communities_entries = Object.keys(neigh_communities);//make iterable;

          neigh_communities_entries.forEach(function(com){
            var incr = neigh_communities[com] - (status.degrees[com] || 0.0) * degc_totw;
            if (incr > best_increase){
              best_increase = incr;
              best_com = com;
            }
          });

          __insert(node, best_com, neigh_communities[best_com] || 0, status);

          if(best_com != com_node)
            modif = true;
        });
        new_mod = __modularity(status);
        if(new_mod - cur_mod < __MIN)
          break;
      }
    }

    function induced_graph(partition, graph){
      var ret = {nodes:[], edges:[], _assoc_mat: {}};
      var w_prec, weight;
      //add nodes from partition values
      var partition_values = obj_values(partition);
      ret.nodes = ret.nodes.concat(make_set(partition_values)); //make set
      graph.edges.forEach(function(edge){
        weight = edge.weight || 1;
        var com1 = partition[edge.source];
        var com2 = partition[edge.target];
        w_prec = (get_edge_weight(ret, com1, com2) || 0);
        var new_weight = (w_prec + weight);
        add_edge_to_graph(ret, {'source': com1, 'target': com2, 'weight': new_weight});
      });
      return ret;
    }

    function partition_at_level(dendogram, level){
      var partition = clone(dendogram[0]);
      for(var i = 1; i < level + 1; i++ )
        Object.keys(partition).forEach(function(key){
          var node = key;
          var com  = partition[key];
          partition[node] = dendogram[i][com];
        });
      return partition;
    }


    function generate_dendogram(graph, part_init){

      if(graph.edges.length === 0){
        var part = {};
        graph.nodes.forEach(function(node){
          part[node] = node;
        });
        return part;
      }
      var status = {};

      init_status(original_graph, status, part_init);
      var mod = __modularity(status);
      var status_list = [];
      __one_level(original_graph, status);
      var new_mod = __modularity(status);
      var partition = __renumber(status.nodes_to_com);
      status_list.push(partition);
      mod = new_mod;
      var current_graph = induced_graph(partition, original_graph);
      init_status(current_graph, status);

      while (true){
        __one_level(current_graph, status);
        new_mod = __modularity(status);
        if(new_mod - mod < __MIN)
          break;

        partition = __renumber(status.nodes_to_com);
        status_list.push(partition);

        mod = new_mod;
        current_graph = induced_graph(partition, current_graph);
        init_status(current_graph, status);
      }

      return status_list;
    }

    var core = function(){
      var dendogram = generate_dendogram(original_graph, partition_init);
      return partition_at_level(dendogram, dendogram.length - 1);
    };

    core.nodes = function(nds){
      if(arguments.length > 0){
        original_graph_nodes = nds;
      }
      return core;
    };

    core.edges = function(edgs){
      if(typeof original_graph_nodes == 'undefined')
        throw 'Please provide the graph nodes first!';

      if(arguments.length > 0){
        original_graph_edges = edgs;
        var assoc_mat = make_assoc_mat(edgs);
        original_graph = { 'nodes': original_graph_nodes,
                     'edges': original_graph_edges,
                     '_assoc_mat': assoc_mat };
      }
      return core;

    };

    core.partition_init = function(prttn){
      if(arguments.length > 0){
        partition_init = prttn;
      }
      return core;
    };

    return core;
  };

  /**
   * Builds a Table of clusters based on Louvain community detection.
   * @param {Network} network
   * @return {Table} List of NodeLists
   * tags:analysis
   */
  NetworkOperators.buildNetworkClustersLouvain = function(network) {
    if(network==null) return network;

    var node_data = [];
    var i;
    for(i=0; i < network.nodeList.length; i++){
      // force nodes to be stringlike since they get used as properties in result
      node_data.push('n'+network.nodeList[i].id);
    }
    var edge_data = [];
    for(i=0; i < network.relationList.length; i++){
      var obj = {source: 'n'+network.relationList[i].node0.id,
                 target: 'n'+network.relationList[i].node1.id,
                 weight:network.relationList[i].weight};
      edge_data.push(obj);
    }

    // Object with ids of nodes as properties and community number assigned as value.
    var community = NetworkOperators._jLouvain().nodes(node_data).edges(edge_data);
    var result  = community();
    var clusters = new Table();

    if(result)
      for(i=0; i < network.nodeList.length; i++){
        var j = result['n'+network.nodeList[i].id];
        if(clusters[j] == undefined)
          clusters[j]= new NodeList();
        clusters[j].addNode(network.nodeList[i]);
      }
    else{
      // no results mean no communities, make them all unique
      for(i=0; i < network.nodeList.length; i++){
        clusters.push(new NodeList(network.nodeList[i]));
      }
    }
    return clusters;
  };


  /**
   * @todo write docs
   */
  NetworkOperators.getReport = function() {
    return "network contains " + this.nodeList.length + " nodes and " + this.relationList.length + " relations";
  };

  /**
   * @classdesc NetworkGenerators provides a set of tools to generate Network
   * instances from a variety of sources.
   * @namespace
   * @category networks
   */
  function NetworkGenerators() {}
  /**
   * Build a random network based on the provided options
   * @param {Number} nNodes number of nodes
   * @param {Number} pRelation probability of a relation being created between 2 nodes
   *
   * @param {Number} mode 0:simple random 1:clusterized
   * @param {Boolean} randomRelationsWeights adds a random weigth to relations
   * @param {Number} seed random seed for stable random generation
   * @return {Network}
   * @example
   * // generate a sparsely connected network with 2000 Nodes
   * network = NetworkGenerators.createRandomNetwork(2000, 0.0006, 1);
   * tags:generator
   */
  NetworkGenerators.createRandomNetwork = function(nNodes, pRelation, mode, randomRelationsWeights, seed) {
    if(nNodes == null || pRelation == null) return null;

    var funcRandom;

    if(seed!=null){
      funcRandom = function(){
        seed++;
       return NumberOperators.getRandomWithSeed(seed);
     };
    } else {
      funcRandom = Math.random;
    }

    mode = mode == null ? 0 : mode;

    var i, j;
    var network = new Network();
    var node;

    for(i = 0; i < nNodes; i++) {
      network.addNode(new _Node("n" + i, "n" + i));
    }

    switch(mode) {
      case 0:
        for(i = 0; i < nNodes - 1; i++) {
          node = network.nodeList[i];
          for(j = i + 1; j < nNodes; j++) {
            if(funcRandom() < pRelation) network.addRelation(new Relation(i + "_" + j, i + "_" + j, node, network.nodeList[j], randomRelationsWeights ? funcRandom() : 1));
          }
        }
        return network;
      case 1:
        var nPairs = nNodes * (nNodes - 1) * 0.5;
        var pending;
        var maxDegree = 0;
        var otherNode;
        var id;
        for(i = 0; i < nPairs; i++) {
          if(funcRandom() < pRelation) {
            pending = true;
            while(pending) {
              node = network.nodeList[Math.floor(network.nodeList.length * funcRandom())];
              if(funcRandom() < (node.nodeList.length + 1) / (maxDegree + 1)) {
                while(pending) {
                  otherNode = network.nodeList[Math.floor(network.nodeList.length * funcRandom())];
                  id = node.id + "_" + otherNode.id;
                  if(network.relationList.getNodeById(id) != null || network.relationList.getNodeById(otherNode.id + "_" + node.id) != null) continue;
                  if(funcRandom() < (otherNode.nodeList.length + 1) / (maxDegree + 1)) {
                    network.addRelation(new Relation(id, id, node, otherNode, randomRelationsWeights ? funcRandom() : 1));
                    pending = false;
                  }
                }
              }
            }
          }
        }
        return network;
    }

  };

  /**
   * @param strings
   * @param texts
   * @param {Number} weightsForRelationsMethod
   * <ul>
   * <li><strong>0</strong>: dotProduct (more efficient)</li>
   * <li><strong>1</strong>: {@link http://en.wikipedia.org/wiki/Cosine_similarity|cosinus similarity}</li>
   *
   */
  NetworkGenerators.createTextsCoOccurrencesNetwork = function(strings, texts, weightsForRelationsMethod, minimum) {
    var occurrencesTable = StringListOperators.countStringsOccurrencesOnTexts(strings, texts, weightsForRelationsMethod, minimum);
    return NetworkGenerators.createNetworkFromOccurrencesTable(occurrencesTable);
  };

  /**
   * @todo write docs
   */
  NetworkGenerators.createNetworkFromOccurrencesTable = function(occurrencesTable, weightsForRelationsMethod, minimum) {
    weightsForRelationsMethod = weightsForRelationsMethod == null ? 0 : weightsForRelationsMethod;
    minimum = minimum == null ? 0 : minimum;

    var network = new Network();
    var i;
    var j;
    var string0;
    var string1;
    var weight;
    var node0;
    var node1;
    var norm0;
    var norm1;
    for(i = 0; occurrencesTable[i] != null; i++) {
      string0 = occurrencesTable[i].name;
      if(i === 0) {
        node0 = new _Node(string0, string0);
        network.addNode(node0);
      } else {
        node0 = network.nodeList[i];
      }
      norm0 = occurrencesTable[i].getSum();
      node0.weight = norm0;
      for(j = i + 1; occurrencesTable[j] != null; j++) {
        string1 = occurrencesTable[j].name;
        if(i === 0) {
          node1 = new _Node(string1, string1);
          network.addNode(node1);
        } else {
          node1 = network.nodeList[j];
        }
        norm1 = occurrencesTable[j].getSum();
        node1.weight = norm1;

        switch(weightsForRelationsMethod) {
          case 0:
            weight = occurrencesTable[i].dotProduct(occurrencesTable[j]);
            break;
          case 1:
            weight = NumberListOperators.cosinus(occurrencesTable[i], occurrencesTable[j]);
            break;
        }

        if(weight > minimum) {
          network.createRelation(node0, node1, string0 + "_" + string1, weight);
        }
      }
    }

    return network;
  };

  /**
   * Creates a network using a list and measuring the relation weight with a given method
   * a Relation is created between two nodes if and only if the returned weight is > 0
   * @param {List} list List of objects that define the nodes
   * @param {Function} weightFunction method used to eval each pair of nodes
   * @param {StringList} names optional, names of Nodes
   * @return {Network} a network with number of nodes equal to the length of the List
   */
  NetworkGenerators.createNetworkFromListAndFunction = function(list, weightFunction, names) {
    var i;
    var j;
    var w;
    var node;
    var network = new Network();

    for(i = 0; list[i + 1] != null; i++) {
      if(i === 0) {
        network.addNode(new _Node("n_0", names == null ? "n_0" : names[i]));
      }
      node = network.nodeList[i];
      for(j = i + 1; list[j] != null; j++) {
        if(i === 0) {
          network.addNode(new _Node("n_" + j, names == null ? "n_" + j : names[j]));
        }
        w = weightFunction(list[i], list[j]);
        if(w > 0) {
          network.addRelation(new Relation(i + "_" + j, i + "_" + j, node, network.nodeList[j], w));
        }
      }
    }

    return network;
  };


  /**
   * Builds a network from a text, using previously detected words or noun phrases, and with relations built from co-occurrences in sentences
   * relations contain as description the part of the sentence that ends with the second node name (thus being compatible with NoteWork)
   * @param  {String} text
   * @param  {StringList} nounPhrases words, n-grams or noun phrases
   *
   * @param {String} splitCharacters split blocks by characters defined as string regexp expression (defualt:"\.|\n"), blocks determine relations
   * @return {Network}
   * tags:
   */
  NetworkGenerators.createNetworkFromTextAndWords = function(text, nounPhrases, splitCharacters) {
    if(text == null || nounPhrases == null) return null;

    splitCharacters = splitCharacters == null ? "\\.|\\n" : splitCharacters;

    var network = new Network();

    nounPhrases = nounPhrases.getWithoutElements(new StringList("", " ", "\n"));

    nounPhrases.forEach(function(np) {
      np = NetworkEncodings._simplifyForNoteWork(np);
      if(np) nounPhrases.push(np);
    });

    nounPhrases = nounPhrases.getWithoutRepetitions();

    var sentences = text.split(new RegExp(splitCharacters, "g"));

    var node, relation;
    var index;
    var node0;
    var regex;
    var id;

    var mat;

    var nodesInSentence;
    var maxWeight, maxNode;

    nounPhrases.forEach(function(np) {
      node = new _Node(np, np);
      network.addNode(node);
      mat = text.match(NetworkEncodings._regexWordForNoteWork(np));
      node.weight = mat == null ? 1 : mat.length;
    });

    sentences.forEach(function(sentence) {
      sentence = sentence.trim();
      nodesInSentence = new NodeList();
      maxWeight = 0;
      nounPhrases.forEach(function(np) {
        node0 = network.nodeList.getNodeById(np);
        regex = NetworkEncodings._regexWordForNoteWork(np);
        index = sentence.search(regex);

        if(index != -1) {
          maxNode = node0.weight > maxWeight ? node0 : maxNode;
          maxWeight = Math.max(node0.weight, maxWeight);
          if(node0 != maxNode) nodesInSentence.push(node0);
          // nounPhrases.forEach(function(np1){
          // 	regex = NetworkEncodings._regexWordForNoteWork(np1);
          // 	index2 = sentence.search(regex);
          // 	if(index2!=-1){
          // 		node1 = network.nodeList.getNodeById(np1);

          // 		relation = network.relationList.getFirstRelationBetweenNodes(node0, node1, false);

          // 		if(relation==null){
          // 			if(index<index2){
          // 				id = node0.id+"_"+node1.id+"|"+sentence;
          // 				relation = new Relation(id, id, node0, node1);
          // 			} else {
          // 				id = node1.id+"_"+node0.id+"|"+sentence;
          // 				relation = new Relation(id, id, node1, node0);
          // 			}
          // 			relation.content = sentence;//.substr(0, index3+1).trim();
          // 			relation.paragraphs = new StringList(relation.content);
          // 			network.addRelation(relation);
          // 		} else {
          // 			relation.paragraphs.push(sentence);
          // 		}
          // 	}
          // });
        }
      });


      nodesInSentence.forEach(function(node0) {
        id = maxNode.id + "_" + node0.id + "|" + sentence;
        relation = new Relation(id, id, maxNode, node0);
        relation.content = sentence;
        network.addRelation(relation);
      });


    });

    //nested NPs (example: "health", "health consequences")
    network.nodeList.forEach(function(node0) {
      regex = NetworkEncodings._regexWordForNoteWork(node0.id);
      network.nodeList.forEach(function(node1) {
        if(node0 != node1 && node1.id.search(regex) != -1) {
          id = node1.id + "_" + node0.id + "|contains " + node0.id;
          relation = new Relation(id, id, node1, node0);
          relation.content = "contains " + node0.id;
          network.addRelation(relation);
        }
      });
    });

    return network;
  };

  /**
   * @classdesc Draw Texts Advanced
   *
   * @namespace
   * @category drawing
   */
  function DrawTextsAdvanced() {}
  /**
   * @ignore
   */
  // DrawTextsAdvanced.characterOnQuadrilater = function(context, character, p0, p1, p2, p3, fontType) {

  // };


  /**
   * @todo finish docs
   * works only with n=1
   */
  DrawTextsAdvanced.textOnQuadrilater = function(text, p0, p1, p2, p3, fontSize, n, graphics) { //TODO:fix, finish
    n = n == null ? 0 : n;

    if(n == 1) {
      var p01 = new _Point((p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5);
      var p03 = new _Point((p0.x + p3.x) * 0.5, (p0.y + p3.y) * 0.5);
      var p23 = new _Point((p2.x + p3.x) * 0.5, (p2.y + p3.y) * 0.5);
      var p12 = new _Point((p1.x + p2.x) * 0.5, (p1.y + p2.y) * 0.5);
      var pc = new _Point((p01.x + p23.x) * 0.5, (p01.y + p23.y) * 0.5);
      DrawTextsAdvanced.textOnQuadrilater(text, p0, p01, pc, p03, fontSize, 2);
      DrawTextsAdvanced.textOnQuadrilater(text, p01, p1, p12, pc, fontSize, 3);
      DrawTextsAdvanced.textOnQuadrilater(text, pc, p12, p2, p23, fontSize, 4);
      DrawTextsAdvanced.textOnQuadrilater(text, p03, pc, p23, p3, fontSize, 5);
      return;
    }
    var measure = graphics.context.measureText(text);
    var w = measure.width;
    var h = fontSize; // 64;//*96/72; //TODO: fix this

    var v0, v1, v2;
    switch(n) {
      case 0:
        v0 = new _Point(0, 0);
        v1 = new _Point(w, 0);
        v2 = new _Point(0.000001, h + 0.000001);
        break;
      case 2:
        v0 = new _Point(0, 0);
        v1 = new _Point(w * 0.5, 0);
        v2 = new _Point(0.000001, h * 0.5 + 0.000001);
        break;
      case 3:
        v0 = new _Point(w * 0.5, 0);
        v1 = new _Point(w, 0);
        v2 = new _Point(w * 0.5 + 0.000001, h * 0.5 + 0.000001);
        break;
      case 4:
        v0 = new _Point(w * 0.5, h * 0.5);
        v1 = new _Point(w, h * 0.5);
        v2 = new _Point(w * 0.5 + 0.000001, h + 0.000001);
        break;
      case 5:
        v0 = new _Point(0, h * 0.5);
        v1 = new _Point(w * 0.5, h * 0.5);
        v2 = new _Point(0.000001, h + 0.000001);
        break;
    }


    graphics.context.save();
    DrawTextsAdvanced.applyTransformationOnCanvasFromPoints(v0, v1, v2, p0, p1, p3);

    graphics.context.beginPath();
    graphics.context.moveTo(v0.x - 2, v0.y - 2);
    graphics.context.lineTo(v1.x + 8, v1.y - 2);
    graphics.context.lineTo(v2.x - 2, v2.y + 8);
    graphics.context.clip();

    graphics.context.fillText(text, 0, 0);

    graphics.context.restore();


    v0.x = v1.x + 0.0001;
    v0.y = v2.y + 0.0001;

    graphics.context.save();

    DrawTextsAdvanced.applyTransformationOnCanvasFromPoints(v0, v1, v2, p2, p1, p3);

    graphics.context.beginPath();
    graphics.context.moveTo(v0.x + 4, v0.y + 2);
    graphics.context.lineTo(v1.x + 4, v1.y - 2);
    graphics.context.lineTo(v2.x - 2, v2.y + 2);
    graphics.context.clip();

    graphics.context.fillText(text, 0, 0);

    graphics.context.restore();
  };

  /**
   * @todo finish docs
   */
  DrawTextsAdvanced.applyTransformationOnCanvasFromPoints = function(v0, v1, v2, w0, w1, w2, graphics) { //TODO:find the correct place for this
    var M = MatrixGenerators.createMatrixFromTrianglesMapping(v0, v1, v2, w0, w1, w2);
    graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);
  };

  /**
   * @todo finish docs
   */
  DrawTextsAdvanced.mapRectangleIntoQuadrilater = function(image, xI, yI, wI, hI, v0, v1, v2, v3, graphics) { //TODO:find the correct place for this
    graphics.context.save();

    var M = MatrixGenerators.createMatrixFromTrianglesMapping(new _Point(0, 0), new _Point(100, 0), new _Point(100, 100), v0, v1, v2);
    graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);

    graphics.context.beginPath();
    graphics.context.moveTo(0, 0);
    graphics.context.lineTo(100, 0);
    graphics.context.lineTo(100, 100);
    graphics.context.lineTo(0, 0);
    graphics.context.clip();

    graphics.context.drawImage(image,
      xI, yI, wI, hI,
      0, 0, 100, 100);


    graphics.context.restore();

    //

    graphics.context.save();

    M = MatrixGenerators.createMatrixFromTrianglesMapping(new _Point(0, 0), new _Point(0, 2), new _Point(2, 2), v0, v3, v2);
    graphics.context.transform(M.a, M.b, M.c, M.d, M.tx, M.ty);

    graphics.context.beginPath();
    graphics.context.moveTo(0, 0);
    graphics.context.lineTo(0, 2);
    graphics.context.lineTo(2, 2);
    graphics.context.lineTo(0, 0);
    graphics.context.clip();

    graphics.context.drawImage(image,
      xI, yI, wI, hI,
      0, 0, 2, 2);


    graphics.context.restore();
  };

  /**
   * @todo finish docs
   */
  DrawTextsAdvanced.getClippedTrianglesData = function(image, xI, yI, wI, hI, graphics) {
    var object = {};

    graphics.context.clearRect(0, 0, wI, hI);
    graphics.context.save();

    graphics.context.beginPath();
    graphics.context.moveTo(0, 0);
    graphics.context.lineTo(wI, 0);
    graphics.context.lineTo(wI, hI);
    graphics.context.lineTo(0, 0);
    graphics.context.clip();

    graphics.context.drawImage(image,
      xI, yI, wI, hI,
      0, 0, wI, hI);

    object.dataTriangle0 = graphics.context.getImageData(0, 0, wI, hI);

    graphics.context.restore();

    //
    graphics.context.clearRect(0, 0, wI, hI);
    graphics.context.save();

    graphics.context.beginPath();
    graphics.context.moveTo(0, 0);
    graphics.context.lineTo(0, hI);
    graphics.context.lineTo(wI, hI);
    graphics.context.lineTo(0, 0);
    graphics.context.clip();

    graphics.context.drawImage(image,
      xI, yI, wI, hI,
      0, 0, wI, hI);

    object.dataTriangle1 = graphics.context.getImageData(0, 0, wI, hI);

    graphics.context.restore();

    return object;
  };


  /**
   * @todo finish docs
   */
  DrawTextsAdvanced.typodeOnQuadrilater = function(text, p0, p1, p2, p3, graphics) { //TODO:fix, finish
    var dX = p1.x - p0.x;
    var h0 = p3.y - p0.y;
    var h1 = p2.y - p1.y;

    graphics.context.lineWidth = 0.01 + (h0 + h1) / 100;
    if(dX < 1.8) return;

    var polygonList = typodeObject[text];
    //c.log(text, polygonList.length);
    var polygon;
    var j;
    var t;
    var mint;

    for(var i = 0; polygonList[i] != null; i++) {
      polygon = polygonList[i];
      graphics.context.beginPath();
      t = polygon[0].x;
      mint = 1 - t;
      graphics.context.moveTo(Math.floor(t * dX + p0.x) + 0.5, Math.floor(polygon[0].y * (mint * h0 + t * h1) + mint * p0.y + t * p1.y) + 0.5);
      for(j = 1; polygon[j] != null; j++) {
        t = polygon[j].x;
        mint = 1 - t;
        graphics.context.lineTo(Math.floor(t * dX + p0.x) + 0.5, Math.floor(polygon[j].y * (mint * h0 + t * h1) + mint * p0.y + t * p1.y) + 0.5);
      }
      graphics.context.stroke();
    }

  };

  /**
   * @classdesc static Class with methods to render text in canvas
   * @namespace
   * @category drawing
   */
  function DrawTexts() {}
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

  /*
   * DrawSimpleVis
   *
   * This class contains methods that draw simple visualizations such as lines, barChart…
   * It's main aim is to allow a first glance on a structure
   * The challenge is to create at least one method for each structure
   *
   * in the future a 'detect element hovered' might be deployed
   *
   * Once this class becomes big and complex enough, a new 'big folder' will be created ('visGraphication'?) with the conventional structure: dates, geometry, graphic, lists, numeric, strings, structures…
   * and with classes named NumberTableGraph… os similar
   *
   *
   * //////// [!] METHODS ARE BEING REMOVED FROM HERE TO BE PLACE ON THEIR CORRECT CLASSES
   * @constructor
   */

  function DrawSimpleVis() {}
  DrawSimpleVis.drawSimpleBarChart = function(context, numberList, frame, colors) { //TODO: complete cases (numberLists with negative (and positive) values)
    colors = colors == null ? ColorListOperators.colorListFromColorScale(new ColorScale()) : colors;
    frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;

    var dX = frame.width / numberList.length;

    var bottom = frame.getBottom();
    var normalizedNumberList = NumberListOperators.normalizedToMax(numberList, frame.height);

    var i;
    for(i = 0; numberList[i] != null; i++) {
      context.fillStyle = colors[i];
      context.fillRect(frame.x + i * dX, bottom - normalizedNumberList[i], dX - 1, normalizedNumberList[i]);
    }
  };



  DrawSimpleVis.drawIntervalsFlowTable = function(context, intervalsFlowTable, frame, colors, bezier) {
    console.log("[!] MOVED TO IntervalTableDraw.js");
    // var nElements = intervalsFlowTable.length;
    // var i;
    // var j;
    //
    // colors = colors==null?ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements):colors;
    // frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
    // bezier = bezier||false;
    //
    // var nCols = intervalsFlowTable[0].length;
    // var dX = frame.width/(nCols-1);
    // var dY = frame.height;
    //
    // var point;
    //
    // var intervalList;
    // var lastIntervalList = intervalsFlowTable[nElements-1];
    // var sY = 0;
    // var mY = 0;
    // var x = frame.x;
    // var y = frame.y;
    //
    // var prevPoint;
    // var prevYsup;
    // var prevsY;
    // var newYsup;
    //
    // var offX;// = dX*0.45;
    //
    // for(i=0; intervalsFlowTable[i]!=null; i++){
    // intervalList = intervalsFlowTable[i];
    //
    // context.fillStyle = colors[i];
    // context.beginPath();
    //
    // //---->
    // sY = (1-lastIntervalList[0].y)*0.5*dY+i*mY+y;
    //
    // point = new Point(x, intervalList[0].y*dY+sY);
    // context.moveTo(point.x, point.y);
    //
    // prevPoint = point;
    //
    // for(j=1;j<nCols;j++){
    // sY = (1-lastIntervalList[j].y)*0.5*dY+i*mY+y;
    //
    // point = new Point(j*dX+x, intervalList[j].y*dY+sY);
    //
    // if(bezier){
    // offX = (point.x-prevPoint.x)*0.45;
    // context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
    // } else {
    // context.lineTo(point.x, point.y);
    // }
    //
    // prevPoint = point;
    // }
    //
    // //<-----
    // point = new Point((nCols-1)*dX+x, intervalList[nCols-1].x*dY+sY);
    // context.lineTo(point.x, point.y);
    // prevPoint = point;
    //
    // for(j=nCols-2;j>=0;j--){
    // sY = (1-lastIntervalList[j].y)*0.5*dY+i*mY+y;
    //
    // point = new Point(j*dX+x, intervalList[j].x*dY+sY);
    //
    //
    // if(bezier){
    // offX = (point.x-prevPoint.x)*0.45;
    // context.bezierCurveTo(prevPoint.x+offX, prevPoint.y, point.x-offX, point.y, point.x, point.y);
    // } else {
    // context.lineTo(point.x, point.y);
    // }
    //
    // prevPoint = point;
    // }
    //
    // point = new Point(x, intervalList[0].x*dY+sY);
    // context.lineTo(point.x, point.y);
    //
    // context.fill();
    //
    // }
  };



  DrawSimpleVis.drawIntervalsWordsFlowTable = function(context, intervalsFlowTable, frame, texts, colors) {
    console.log("[!] MOVED TO IntervalTableDraw.js");
    // var nElements = intervalsFlowTable.length;
    //
    // var i;
    // var j;
    //
    // colors = colors==null?ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements):colors;
    // frame = frame==null?new Rectangle(10, 10, 400, 300):frame;
    //
    // var nCols = intervalsFlowTable[0].length;
    // var dX = frame.width/(nCols-1);
    // var dY = frame.height;
    //
    // var point0;
    // var point1;
    //
    // var nextPoint0;
    // var nextPoint1;
    //
    // var point0Prev = new Point();
    // var point1Prev = new Point();
    //
    // var center;
    // var size;
    //
    // var intervalList;
    // var lastIntervalList = intervalsFlowTable[nElements-1];
    // var sY = 0;
    // var x = frame.x;
    // var y = frame.y;
    //
    // var offX;
    //
    // var text;
    //
    // context.strokeStyle = "rgba(255,255,255,0.4)";
    //
    // context.textBaseline = "top";
    // context.textAlign = "left";
    //
    // var position;
    // var xx;
    // var t;
    // var jumpX = dX;
    // //var lastT=0;
    // var valueLastInterval;
    // var valueX;
    // var valueY;
    // var nChar;
    // var selectedChar;
    // var charWidth;
    // var fontSize;
    //
    // var offX;
    //
    // var factX = (nCols-1)/frame.width;
    //
    // var xj0;
    // var xj1;
    //
    //
    // for(i=0; intervalsFlowTable[i]!=null; i++){
    // intervalList = intervalsFlowTable[i];
    //
    // text = " "+texts[i];
    //
    // xx=0;
    // nChar=0;
    //
    // position=0;
    // j=0;
    // t=0;
    //
    // //console.log("-");
    //
    // sY = (1-lastIntervalList[0].y)*0.5*dY+y;
    // point0 = new Point(x, intervalList[0].x*dY+sY);
    // point1 = new Point(x, intervalList[0].y*dY+sY);
    //
    // do {
    // nChar++;
    // size = (point1.y-point0.y);
    // fontSize = Math.floor(0.3*size+1);
    // context.font         =  fontSize+'px Arial';
    // selectedChar = text.charAt(nChar%text.length);
    // charWidth = context.measureText(selectedChar).width+2;
    // jumpX = charWidth*0.9;
    //
    // xx+=jumpX;
    // position = factX*xx;
    // j = Math.floor(position);
    // t = position - j;
    //
    //
    // if(j+2>nCols) continue;
    //
    // //valueLastInterval = (1-t)*lastIntervalList[j].y + t*lastIntervalList[j+1].y;
    //
    // xj0 = j/factX;
    // xj1 = (j+1)/factX;
    //
    // offX = factX*0.45;
    // valueLastInterval = DrawSimpleVis._bezierValue(xj0, xj1, lastIntervalList[j].y, lastIntervalList[j+1].y, t, offX);
    //
    //
    // prevsY = sY;
    // sY = (1-valueLastInterval)*0.5*dY+y;
    //
    //
    // point0Prev.x = point0.x;
    // point0Prev.y = point0.y;
    // point1Prev.x = point1.x;
    // point1Prev.y = point1.y;
    //
    //
    // //valueX = (1-t)*intervalList[j].x + t*intervalList[j+1].x;
    // //valueY = (1-t)*intervalList[j].y + t*intervalList[j+1].y;
    //
    // valueX = DrawSimpleVis._bezierValue(xj0, xj1, intervalList[j].x, intervalList[j+1].x, t, offX);
    // valueY = DrawSimpleVis._bezierValue(xj0, xj1, intervalList[j].y, intervalList[j+1].y, t, offX);
    //
    //
    // point0 = new Point(xx+x, valueX*dY+sY);
    // point1 = new Point(xx+x, valueY*dY+sY);
    //
    //
    // center = new Point(point0Prev.x+jumpX*0.5, (point0.y+point1.y+point0Prev.y+point1Prev.y)*0.25);
    //
    // //console.log(jumpX);
    //
    // context.fillStyle = colors[i];
    // //context.beginPath();
    //
    // //boundaries
    // // context.beginPath();
    // // context.moveTo(point0Prev.x, point0Prev.y);
    // // context.lineTo(point0.x, point0.y);
    // // context.lineTo(point1.x, point1.y); //move/line to draw or not vertical
    // // context.lineTo(point1Prev.x, point1Prev.y);
    // // context.stroke();
    //
    //
    // if(size>1){
    // //context.fillText(selectedChar,center.x, center.y);
    // context.save();
    // context.globalAlpha = size/20;
    // DrawTextsAdvanced.textOnQuadrilater(selectedChar, point0Prev, point0, point1, point1Prev, fontSize, 1);
    // context.restore();
    // }
    // } while(j+1<nCols);
    // }
  };

  // DrawSimpleVis._bezierValue = function(x0, x1, y0, y1, t, offX){
  // //return y0*(1-t)+y1*t;
  // var u = 1-t;
  // var p0 = new Point(x0+ t*offX, y0);
  // var p1 = new Point(u*(x0+offX) + t*(x1-offX), u*y0 + t*y1);
  // var p2 = new Point(x1-u*offX, y1);
  //
  // var P0 = new Point(u*p0.x + t*p1.x, u*p0.y + t*p1.y);
  // var P1 = new Point(u*p1.x + t*p2.x, u*p1.y + t*p2.y);
  //
  // return u*P0.y + t*P1.y;
  // }


  DrawSimpleVis.drawStackBarsFlowTable = function(context, intervalsFlowTable, frame, colors) { //TODO: +efficiency
    var nElements = intervalsFlowTable.length;

    var i;
    var j;

    colors = colors == null ? ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements) : colors;
    frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;

    var nCols = intervalsFlowTable[0].length;
    var dX = frame.width / (nCols - 1);
    var dY = frame.height;

    var point0;
    var point1;
    var point2;
    var point3;

    var intervalList;
    var lastIntervalList = intervalsFlowTable[nElements - 1];
    var sY = 0;
    var mY = 0;
    var x = frame.x;
    var y = frame.y;

    context.strokeStyle = "white";

    for(i = 0; intervalsFlowTable[i] != null; i++) {
      intervalList = intervalsFlowTable[i];

      //---->
      sY = (1 - lastIntervalList[0].y) * 0.5 * dY + i * mY + y;

      for(j = 1; j < nCols; j++) {
        sY = (1 - lastIntervalList[j].y) * 0.5 * dY + i * mY + y;

        point0 = new _Point(j * dX + x, intervalList[j].x * dY + sY);
        point1 = new _Point((j + 1) * dX + x, intervalList[j].x * dY + sY);
        point2 = new _Point((j + 1) * dX + x, intervalList[j].y * dY + sY);
        point3 = new _Point(j * dX + x, intervalList[j].y * dY + sY);

        context.fillStyle = colors[i];
        context.beginPath();
        context.moveTo(point0.x, point0.y);
        context.lineTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.lineTo(point3.x, point3.y);
        context.lineTo(point0.x, point0.y);
        context.fill();
      }
      context.fill();
    }
  };

  // DrawSimpleVis.drawNetworMatrix = function(network, frame, colors, relationsColorScaleFunction, margin, directed){
  // relationsColorScaleFunction = relationsColorScaleFunction==null?ColorOperators.grayScale:relationsColorScaleFunction;
  // margin = margin==null?2:margin;
  // directed = directed==null?false:directed;
  //
  // var i;
  // var nodeList = network.nodeList;
  // var relationList = network.relationList;
  // var relation;
  //
  // var dX = frame.width/(nodeList.length+1);
  // var dY = frame.height/(nodeList.length+1);
  // var w=dX-margin;
  // var h=dY-margin;
  //
  // var ix;
  // var iy;
  //
  // for(i=0;nodeList[i]!=null;i++){
  // context.fillStyle = colors[i];
  // context.fillRect(frame.x+(i+1)*dX, frame.y, w, h);
  // context.fillRect(frame.x, frame.y+(i+1)*dY, w, h);
  // }
  //
  // for(i=0;relationList[i]!=null;i++){
  // relation = relationList[i];
  // context.fillStyle = relationsColorScaleFunction(relation.weight);
  // ix = nodeList.indexOf(relation.node0)+1;
  // iy = nodeList.indexOf(relation.node1)+1;
  // context.fillRect(frame.x+ix*dX, frame.y+iy*dY, w, h);
  // if(!directed && (ix!=iy)){
  // context.fillRect(frame.x+iy*dX, frame.y+ix*dY, w, h);
  // }
  // }
  // }

  //TODO: delete many functions that are deprectaed, replaced by SimpleGraphics.js functions

  //include(frameworksRoot+"operators/geometry/GeometryOperators.js");
  /**
   * @classdesc Draw basic shapes
   *
   * @namespace
   * @category drawing
   */
  function Draw() {}
  /**
   * modes:
   * 0: adjust to rectangle
   * 1: center and mask
   * 2: center and eventual reduction (image smaller than rectangle)
   * 3: adjust to rectangle preserving proportions (image bigger than rectangle)
   * 4: fill repeated from corner
   * 5: fill repeated from 0,0
   */
  Draw.fillRectangleWithImage = function(rectangle, image, mode, backColor, graphics) {
    if(backColor != null) {
      graphics.context.fillStyle = backColor;
      graphics.context.beginPath();
      graphics.context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      graphics.context.fill();
    }

    var sx;
    var sy;
    var dx;
    var dy;
    var dWidth;
    var dHeight;

    switch(mode) {

      case 0:
        graphics.context.drawImage(image, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        break;
      case 1:
        sx = Math.max(image.width - rectangle.width, 0) * 0.5;
        sy = Math.max(image.height - rectangle.height, 0) * 0.5;
        dx = rectangle.x + Math.max(rectangle.width - image.width, 0) * 0.5;
        dy = rectangle.y + Math.max(rectangle.height - image.height, 0) * 0.5;
        dWidth = Math.min(image.width, rectangle.width);
        dHeight = Math.min(image.height, rectangle.height);
        graphics.context.drawImage(image, sx, sy, dWidth, dHeight, dx, dy, dWidth, dHeight);
        break;
      case 2:
        sx = Math.max(image.width - rectangle.width, 0);
        sy = Math.max(image.height - rectangle.height, 0);
        dWidth = Math.min(image.width, rectangle.width);
        dHeight = Math.min(image.height, rectangle.height);
        var propD = dWidth / dHeight;
        var propB = image.width / image.height;
        if(propD < propB) dHeight = dWidth / propB;
        if(propD > propB) dWidth = dHeight / propB;
        dx = rectangle.x + (rectangle.width - dWidth) * 0.5;
        dy = rectangle.y + (rectangle.height - dHeight) * 0.5;
        graphics.context.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight);
        break;
      case 3:
        var sh, sw;
        if(rectangle.width / rectangle.height < image.width / image.height) {
          sh = image.height;
          sw = sh * rectangle.width / rectangle.height;
          sx = 0.5 * (image.width - sw);
          sy = 0;

        } else {
          sw = image.width;
          sh = sw * rectangle.height / rectangle.width;
          sx = 0;
          sy = 0.5 * (image.height - sh);

        }
        graphics.context.drawImage(image, sx, sy, sw, sh, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        break;
      case 4:
        break;
      case 5:
        break;
    }
  };

  /**
   * @todo write docs
   */
  Draw.drawBezierPolygonTransformed = function(bezierPolygon, transformationFunction, graphics) {
    if(bezierPolygon == null ||  bezierPolygon.length === 0) return;

    var bI;
    var N = Math.floor((bezierPolygon.length - 1) / 3);
    var i;
    var p0 = transformationFunction(bezierPolygon[0]);
    var p1;
    var p2;

    graphics.context.moveTo(p0.x, p0.y);
    for(i = 0; i < N; i++) {
      bI = i * 3 + 1;

      p0 = transformationFunction(bezierPolygon[bI]);
      p1 = transformationFunction(bezierPolygon[bI + 1]);
      p2 = transformationFunction(bezierPolygon[bI + 2]);

      graphics.context.bezierCurveTo(
        p0.x, p0.y,
        p1.x, p1.y,
        p2.x, p2.y
      );
    }
  };

  /**
   * @todo write docs
   */
  Draw.prototype.drawPolygonTransformed = function(polygon, transformationFunction, graphics) {
    var p = transformationFunction(polygon[0]);
    graphics.context.moveTo(p.x, p.y);
    for(var i = 0; polygon[i] != null; i++) {
      p = transformationFunction(polygon[i]);
      graphics.context.lineTo(p.x, p.y);
    }
  };


  /**
   * @todo write docs
   */
  Draw.prototype.drawSliderRectangle = function(x, y, width, height, graphics) {
    graphics.context.arc(x + width * 0.5, y, width * 0.5, Math.PI, TwoPi);
    graphics.context.lineTo(x + width, y);
    graphics.context.arc(x + width * 0.5, y + height, width * 0.5, 0, Math.PI);
    graphics.context.lineTo(x, y);
    //context.fillRect(x, y, width, height);
  };

  /**
   * @todo write docs
   */
  Draw.drawRectangles = function(rectangleList, x, y, colors, margin, bitmapDataList, bitmapDataDrawMode, graphics) {
    margin = margin || 0;
    var twoMargin = 2 * margin;
    var i;
    var rect;
    var nColors;
    if(colors != null) {
      nColors = colors.length;
    }
    var adjustedRect = new Rectangle();
    for(i = 0; rectangleList[i] != null; i++) {
      rect = rectangleList[i];
      if(rect.height <= margin || rect.width <= margin) continue;
      if(colors != null) graphics.context.fillStyle = colors[i % nColors];
      graphics.context.fillRect(rect.x + x + margin, rect.y + y + margin, rect.width - twoMargin, rect.height - twoMargin);
      if(bitmapDataList != null && bitmapDataList[i] != null) {
        adjustedRect.x = rect.x + x + margin;
        adjustedRect.y = rect.y + y + margin;
        adjustedRect.width = rect.width - twoMargin;
        adjustedRect.height = rect.height - twoMargin;
        this.fillRectangleWithImage(graphics.context, adjustedRect, bitmapDataList[i], bitmapDataDrawMode);
      }
    }
  };

  /**
   * @todo write docs
   */
  Draw.drawHorizontalFlowPiece = function(x0, x1, y0U, y0D, y1U, y1D, offX, graphics) {
    graphics.context.moveTo(x0, y0U);
    graphics.context.bezierCurveTo(x0 + offX, y0U, x1 - offX, y1U, x1, y1U);
    graphics.context.lineTo(x1, y1D);
    graphics.context.bezierCurveTo(x1 - offX, y1D, x0 + offX, y0D, x0, y0D);
    graphics.context.lineTo(x0, y0U);
  };


  /**
   * @todo write docs
   * it assumes that both circles centers have same y coordinates
   */
  Draw.drawLens = function(circle0, circle1, graphics) {
    if(circle1.x < circle0.x) {
      var _circle = circle1.clone();
      circle1 = circle0.clone();
      circle0 = _circle;
    }
    if(circle1.x + circle1.z <= circle0.x + circle0.z) {
      graphics.context.arc(circle1.x, circle1.y, circle1.z, 0, TwoPi);
      return;
    } else if(circle0.x - circle0.z >= circle1.x - circle1.z) {
      graphics.context.arc(circle0.x, circle0.y, circle0.z, 0, TwoPi);
      return;
    }

    var angles = GeometryOperators.circlesLensAngles(circle0, circle1);

    graphics.context.arc(circle0.x, circle0.y, circle0.z, angles[0], angles[1]);
    graphics.context.arc(circle1.x, circle1.y, circle1.z, angles[2], angles[3]);
  };

  /**
   * @todo write docs
   */
  Draw.drawArrowTriangle = function(p0, p1, base, graphics) {
    var angle = p0.angleToPoint(p1);
    var height = p0.distanceToPoint(p1);
    graphics.drawTriangleFromBase(p0.x, p0.y, base, height, angle);
  };

  /**
   * @classdesc A graphics object provides a surface for drawing and interaction
   * with drawn primitives.
   *
   * @description Creates a new graphcis object and initializes basic configuration
   * and optionally starts the draw cycle.
   *
   * @param {Object} options valid properties described below
   * @param {String|DOMNode|undefined|false} options.container a string selector or reference
   *                                                           to a node where the canvas for this
   *                                                           graphics object will be placed.
   *                                                           If this is a falsy value, then the graphics object
   *                                                           will not be attached to the DOM and can be used as an
   *                                                           offscreen bugger.
   * @param {Object} options.dimensions object with width and height properties to specify
   *                                    the dimensions of the canvas. If this is not passed
   *                                    in, the canvas will grow to always fit the size of its
   *                                    container.
   * @param {Function} options.init custom user function to initialize drawing related
   *                                things. Called once after base initialization.
   * @param {Function} options.cycle custom user function to render each frame. This
   *                                 is called once per frame of the draw loop unless
   *                                 cycleInterval is set to 0.
   * @param {Function} options.onResize custom user function to run on resize of the canvas *
   * @param {Number} options.cycleInterval how often in muilliseconds to run the cycle function
   *                                       if set to zero the cycle function will only run once.
   * @param {Boolean} noLoop if this is true only run the cycle function once,
   * @param {Boolean} noStart if this is true the cycle function will not be automatically started.
   *
   * @constructor
   * @category drawing
   */
  function Graphics(options) {
    this.container = options.container;
    if(typeof this.container === 'string') {
      // Assume it is a selector and try and find the actual DOM node
      this.container = document.querySelector(this.container);
    }
    this.dimensions = options.dimensions;



    this.init = options.init || noOperation;
    this.cycle = options.cycle || noOperation;
    this.onResize = options.onResize || noOperation;
    this._cycleInterval = options.cycleInterval === undefined ? 30 : options.cycleInterval;
    if(options.noLoop) {
      this._cycleInterval = 0;
    }

    this._initialize(!options.noStart);
  }
  function noOperation() {}


  /*****************************
   * Private lifecycle functions
   ****************************/

  /*
   * Initialize the graphics proper. Includes
   * things like actually creating the backing canvas and
   * setting up mousehandlers.
   * @ignore
   */
  Graphics.prototype._initialize = function(autoStart) {
    this.cW = 1; // canvas width
    this.cH = 1; // canvas height
    this.cX = 1; // canvas center x
    this.cY = 1; // canvas center y
    this.mX = 0; // cursor x
    this.mY = 0; // cursor y
    this.mP = new _Point(0, 0); // cursor point // YY why have this and mX and mY
    this.nF = 0; // number of current frame since first cycle
    this.MOUSE_DOWN=false; //true on the frame of mousedown event
    this.MOUSE_UP=false; //true on the frame of mouseup event
    this.MOUSE_UP_FAST=false; //true on the frame of mouseup event
    this.WHEEL_CHANGE=0; //differnt from 0 if mousewheel (or pad) moves / STATE
    this.NF_DOWN = undefined; //number of frame of last mousedown event
    this.NF_UP = undefined; //number of frame of last mouseup event
    this.MOUSE_PRESSED = undefined; //true if mouse pressed / STATE
    this.MOUSE_IN_DOCUMENT = true; //true if cursor is inside document / STATE
    this.mX_DOWN = undefined; // cursor x position on last mousedown event
    this.mY_DOWN = undefined; // cursor x position on last mousedown event
    this.mX_UP = undefined; // cursor x position on last mousedown event
    this.mY_UP = undefined; // cursor y position on last mousedown event
    this.PREV_mX=0; // cursor x position previous frame
    this.PREV_mY=0; // cursor y position previous frame
    this.DX_MOUSE=0; //horizontal movement of cursor in last frame
    this.DY_MOUSE=0; //vertical movement of cursor in last frame
    this.MOUSE_MOVED = false; //boolean that indicates wether the mouse moved in the last frame / STATE
    this.T_MOUSE_PRESSED = 0; //time in milliseconds of mouse being pressed, useful for sutained pressure detection

    this.cursorStyle = 'auto';
    this.backGroundColor = 'white'; // YY why keep this if we only use the rgb version
    this.backGroundColorRGB = [255,255,255];
    this.cycleActive = undefined; // YY why do we need to maintain this state?

    // this._cycleOnMouseMovement = false;
    this._prevMouseX = 0;
    this._prevMouseY = 0;
    this._setIntervalId = undefined;
    this._setTimeOutId = undefined;
    this._interactionCancelledFrame = undefined;
    this._tLastMouseDown = undefined;
    this._alphaRefresh = 0; //if _alphaRefresh>0 instead of clearing the canvas each frame, a transparent rectangle will be drawn
    this.END_CYCLE_DELAY = 3000; //time in milliseconds, from last mouse movement to the last cycle to be executed in case cycleOnMouseMovement has been activated

    this.fontColor = "#000000";
    this.fontSize = "14";
    this.fontName = "Arial";
    this.fontAlign = 'left';
    this.fontBaseline = "top";
    this.fontStyle = "";

    // Create the canvas and get it ready for drawing
    this.canvas = document.createElement("canvas");

    //Allow the canvas to be focusable to enable keydown and keyup
    this.canvas.setAttribute("tabindex", "10000");
    //Hide the focus styling
    var canvasStyle = "outline: none; -webkit-tap-highlight-color: rgba(255, 255, 255, 0);";
    this.canvas.setAttribute("style", canvasStyle);

    if(this.container) {
      // If this container is falsy, then the canvas is not attached to the DOM
      // and can be used as an offscreen buffer.
      this.container.appendChild(this.canvas);
    }
    this.context = this.canvas.getContext("2d");

    this._adjustCanvas(this.dimensions);

    // YY TODO allow user to bind to these events as well. Probably
    // through a generic event mechanism. c.f. global addInteractionEventListener
    var boundMouseOrKeyboard = this._onMouseOrKeyBoard.bind(this);
    this.canvas.addEventListener("mousemove", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("mousedown", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("mouseup", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("mouseenter", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("mouseleave", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("click", boundMouseOrKeyboard, false);

    this.canvas.addEventListener("DOMMouseScroll", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("mousewheel", boundMouseOrKeyboard, false);

    this.canvas.addEventListener("keydown", boundMouseOrKeyboard, false);
    this.canvas.addEventListener("keyup", boundMouseOrKeyboard, false);

    // Setup resize listeners
    var boundResize = this._onResize.bind(this);
    window.addEventListener("resize", resizeThrottler(boundResize, 66), false);

    // Infrastructure for custom event handlers
    this._listeners = {
      "mousemove": [],
      "mousedown": [],
      "mouseup": [],
      "mouseenter": [],
      "mouseleave": [],
      "mousewheel": [],
      "click": [],
      "keydown": [],
      "keyup": []
    };

    // Call the user provided init function.
    this.init();

    // Start the draw loop
    if(autoStart) {
      this._startCycle();
    }

  };


  /*
    Helper function for getting the mouse position
    see http://stackoverflow.com/a/19048340
   */
  /**
   * Helper function for getting the mouse position
   * see http://stackoverflow.com/a/19048340
   *
   * @param  {Event} evt
   * @ignore
   */
  Graphics.prototype._getRelativeMousePos = function(evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  /**
   * This method is used to handle user interaction events (e.g. mouse events). *
   * Sets some internal state and then displatches to external event handlers.
   *
   * @param  {Event} e event object
   * @ignore
   */
  Graphics.prototype._onMouseOrKeyBoard = function(e) {
    switch(e.type){
      case "mousemove":
        var pos = this._getRelativeMousePos(e);
        this.PREV_mX = this.mX;
        this.PREV_mY= this.mY;

        this.mX = pos.x;
        this.mY = pos.y;

        this.mP.x = this.mX;
        this.mP.y = this.mY;

        this.MOUSE_IN_DOCUMENT = true;
        break;
      case "mousedown":
        this.NF_DOWN = this.nF;
        this.MOUSE_PRESSED = true;
        this.T_MOUSE_PRESSED = 0;
        this._tLastMouseDown = new Date().getTime();
        this.mX_DOWN = this.mX;
        this.mY_DOWN = this.mY;
        this.MOUSE_IN_DOCUMENT = true;
        break;
      case "mouseup":
        this.NF_UP = this.nF;
        this.MOUSE_PRESSED = false;
        this.T_MOUSE_PRESSED = 0;
        this.mX_UP = this.mX;
        this.mY_UP = this.mY;
        this.MOUSE_IN_DOCUMENT = true;
        break;
      case "mouseenter":
        this.MOUSE_IN_DOCUMENT = true;
        break;
      case "mouseleave":
        this.MOUSE_IN_DOCUMENT = false;
        break;
    }

    this._emit(e.type, e);
  };


  /*
   * Helper to throttle resize events for improved performance.
   * See https://developer.mozilla.org/en-US/docs/Web/Events/resize
   */
  function resizeThrottler(actualResizeHandler, interval) {
    var resizeTimeout;
    return function(e){
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function() {
          resizeTimeout = null;
          actualResizeHandler(e);
         }, interval);
      }
    };
  }

  /**
   * This method is used to handle resizes of the window, and then optionally
   * pass that on to the user defined onResize method if the container dimensions
   * have changed.
   *
   * @param  {Event} e resize event
   * @ignore
   */
  Graphics.prototype._onResize = function(e) {
    var currentW = this.cW;
    var currentH = this.cH;
    // If the user has set the dimensions explicitly
    // we do not auto adjust the canvas.
    if(this.dimensions === undefined) {
      this._adjustCanvas();
    }

    if(this.onResize !== noOperation) {
      var newDim = this._containerDimensions();
      if(newDim.width !== currentW || newDim.height !== currentH) {
        // Forward the event to the user defined resize handler
        this.onResize(e);
      }
    }
  };

  /**
   * Return the dimensions of the container that this graphics object
   * is associated with.
   *
   * @return {Object} object with width and height properties.
   * @ignore
   */
  Graphics.prototype._containerDimensions = function() {
    // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements
    if(this.container) {
      return {
        width: this.container.clientWidth,
        height: this.container.clientHeight
      };
    } else {
      return {
        width: 0,
        height: 0
      };
    }
  };

  Graphics.prototype._adjustCanvas = function(dimensions) {
    if(dimensions !== undefined) {
      this.cW = dimensions.width;
      this.cH = dimensions.height;
    } else {
      // https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements

      var dim = this._containerDimensions();
      this.cW = dim.width;
      this.cH = dim.height;
    }

    this.cX = Math.floor(this.cW * 0.5);
    this.cY = Math.floor(this.cH * 0.5);

    this.canvas.setAttribute('width', this.cW);
    this.canvas.setAttribute('height', this.cH);

  };

  /*
   * Starts or restarts the draw cycle at the current cycleInterval
   * @ignore
   */
  Graphics.prototype._startCycle = function() {
    this.cycleActive = true;
    if(this._cycleInterval === 0) {
      // Call the cycle only once function
      setTimeout(this._onCycle.bind(this), 10);
    } else {
      clearInterval(this._setIntervalId);
      this._setIntervalId = setInterval(this._onCycle.bind(this), this._cycleInterval);
    }
  };

  /**
   * Stops the draw cycle
   * @ignore
   */
  Graphics.prototype._stopCycle = function(callback) {
    clearInterval(this._setIntervalId);
    this.cycleActive = false;
    this._setIntervalId = undefined;

    if(callback) {
      callback();
    }
  };

  /**
   * Run the cycle function for a certain amount of time and then stop it.
   *
   * Can be called multiple times to delay the stop time to being time milliseconds
   * after the last call to this function.
   * @param  {Number} time time in milliseconds to run the cycle function before stopping ot.
   */
  Graphics.prototype.cycleFor = function(time) {
    if(this._setIntervalId) {
      // If there was already a running cycle then just delay the
      // stop function to stop after time. This effectively debounces
      // the _startCycle call.
      clearTimeout(this._setTimeOutId);
      this._stopAfter(time);
    } else {
      this._startCycle();
      this._stopAfter(time);
    }
  };

  Graphics.prototype._stopAfter = function(time, callback) {
    var self = this;
    this._setTimeOutId = setTimeout(function(){
      self._stopCycle();
      if(callback){
        callback();
      }
    }, time);
  };


  /*
   * This function is called on every cycle of the draw loop.
   * It is responsible for clearing the background and then calling
   * the user defined cycle function.
   *
   */
  Graphics.prototype._onCycle = function() {
    // YY i don't think this interacts well with my expectations
    // of setting the background color. it basically needs to be greater than 0
    // if the bg color is not white and that isn't super obvious.
    // SS I think I fixed it
    if(this._alphaRefresh === 0){
      if(this.backGroundColorRGB!=null){
        this.context.fillStyle =
        'rgb(' + this.backGroundColorRGB[0] +
        ',' + this.backGroundColorRGB[1] +
        ',' + this.backGroundColorRGB[2] +
        ')';
        this.context.fillRect(0, 0, this.cW, this.cH);
      } else {
        this.context.clearRect(0, 0, this.cW, this.cH);
      }
    } else {
      this.context.fillStyle =
        'rgba(' + this.backGroundColorRGB[0] +
        ',' + this.backGroundColorRGB[1] +
        ',' + this.backGroundColorRGB[2] +
        ',' + this._alphaRefresh+')';
      this.context.fillRect(0, 0, this.cW, this.cH);
    }

    this.setCursor('default');

    this.MOUSE_DOWN = this.NF_DOWN == this.nF;
    this.MOUSE_UP = this.NF_UP == this.nF;
    this.MOUSE_UP_FAST = this.MOUSE_UP && (this.nF- this.NF_DOWN) < 9;

    this.DX_MOUSE = this.mX - this.PREV_mX;
    this.DY_MOUSE = this.mY - this.PREV_mY;
    this.MOUSE_MOVED = this.DX_MOUSE !== 0 || this.DY_MOUSE !== 0;

    if(this.MOUSE_PRESSED) {
      this.T_MOUSE_PRESSED = new Date().getTime() - this._tLastMouseDown;
    }

    // Call the user provided cycle function.
    this.cycle();

    this.WHEEL_CHANGE = 0;
    this.PREV_mX = this.mX;
    this.PREV_mY = this.mY;
    this.nF++;
  };

  /*
   * Emit events to registered listeners.
   *
   * This function also does any normalization/customization
   * to the standard DOM events that the graphics object provides.
   */
  Graphics.prototype._emit = function(eventName, e) {
    switch(eventName) {
      case 'mousewheel':
      case 'DOMMouseScroll':
        eventName = 'mousewheel';
        if (!e) {
          e = window.event;
        }
        if (e.wheelDelta) {
          this.WHEEL_CHANGE = e.wheelDelta/120;
        } else if (e.detail) { /** Mozilla case. */
          this.WHEEL_CHANGE = -e.detail/3;
        }
        e.value = this.WHEEL_CHANGE;
      break;
    }

    // Actually dispatch the event after any special handling
    var listenersLength = this._listeners[eventName].length;
    for(var i = 0; i < listenersLength; i++) {
      var callback = this._listeners[eventName][i];
      callback.call(callback.__context, e);
    }
  };

  /*****************************
   * Public lifecycle functions
   ****************************/

  /**
   * Returns the current interval between calls to the cycle function.
   * @return {Number} the current cycleInterval (in milliseconds)
   */
  Graphics.prototype.getCycleInterval = function() {
    return this._cycleInterval;
  };

  /**
   * Sets the current interval between calls to the cycle function.
   *
   * @param {Number} cycleInterval the interval in milliseconds at which
   *                               the cycle function should be called.
   */
  Graphics.prototype.setCycleInterval = function(cycleInterval) {
    this._cycleInterval = cycleInterval;
    if(this.cycleActive) { // YY this should be removed
      this._startCycle();
    }
  };

  /**
   * Starts the draw loop for this graphcis object.
   *
   * Note that the draw loop is typically automatically started on
   * creation of a graphics object.
   */
  Graphics.prototype.start = function() {
    return this._startCycle();
  };

  /**
   * Stops the draw loop for this graphics object.
   */
  Graphics.prototype.stop = function() {
    return this._stopCycle();
  };

  /**
   * Set the cycle function to only run mouse movement and have
   * it run for a given amount of time after the mouse movement
   * has ended. If a cycle function is currently running it will
   * continue to run until time has elapsed. If you want it to stop
   * immediately @see stop.
   *
   *
   * @param  {Number} time time in milliseconds after which the cycle function will
   *                       continue to run
   */
  Graphics.prototype.cycleOnMouseMovement = function(time) {
    var self = this;

    if(this.cycleOnMouseMovementListener){
      this.canvas.removeEventListener('mousemove', this.cycleOnMouseMovementListener, false);
      this.canvas.removeEventListener('mousewheel', this.cycleOnMouseMovementListener, false);
      this.canvas.removeEventListener('mousemove', this.cycleOnMouseMovementListener, false);
    }

    this.cycleOnMouseMovementListener = function(){
      self.cycleFor(time);
    };

    this.canvas.addEventListener('mousemove', this.cycleOnMouseMovementListener, false);
    this.canvas.addEventListener('mousewheel', this.cycleOnMouseMovementListener, false);
    this.canvas.addEventListener('mousemove', this.cycleOnMouseMovementListener, false);

    self.cycleFor(time);
  };

  /**
   * Subscribe to an event that is emitted by the graphics object.
   *
   * The graphics object emits the following events.
   *
   * "mousemove"
   * "mousedown"
   * "mouseup"
   * "mouseenter
   * "mouseleave
   * "mousewheel
   * "click"
   * "keydown"
   * "keyup"
   *
   * @param  {String}   eventName one of the event types above
   * @param  {Function} callback  function to call when that event occurs
   *                              this function will be passed an event object
   */
  Graphics.prototype.on = function(eventName, callback, context) {
    // allow clients to subscribe to events on the canvas.
    callback.__context = context;
    this._listeners[eventName].push(callback);
  };

  /**
   * Remove an event listener.
   * @param  {String}   eventName one of the event types that the graphics object
   *                              emits.
   * @param  {Function} callback  the function you want to remove. Note that this should
   *                              be a reference to a function that was previously added with
   *                              @see on
   */
  Graphics.prototype.off = function(eventName, callback) {
    var index = this._listeners[eventName].indexOf(callback);
    if (index > -1) {
      this._listeners[eventName].splice(index, 1);
    }
  };

  /*****************************
   * Public drawing functions
   *****************************/

  /**
   * Set the background color for the graphics object.
   *
   * On every cycle of the draw loop the canvas will be cleared to this color.
   * Note that if you do set a color, you need to also set the background alpha as well
   *
   * @see  setBackgroundAlpha
   *
   * @param {String|Array|Number} color A string, array or individual numbers representing the rgb color.
   */
  Graphics.prototype.setBackgroundColor = function(color) {
    if(typeof color === "number") {
      if(arguments.length > 3) {
        color = 'rgba('+ arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3]+')';
      } else {
        color = 'rgb('+ arguments[0] + ',' + arguments[1] + ',' + arguments[2]+')';
      }
    } else if(Array.isArray(color)) {
      color = ColorOperators.RGBtoHEX(color[0], color[1], color[2]);
    }
    this.backGroundColor = color;
    this.backGroundColorRGB = ColorOperators.colorStringToRGB(this.backGroundColor);
  };

  /**
   * Set the alpha (opacity) of the background color. Defaults to 0 (transparent).
   *
   * @param {Number} backgroundAlpha a number from 0-1
   */
  Graphics.prototype.setBackgroundAlpha = function(backgroundAlpha){//TODO: this is not alpha background, is alpha refresh…
    this._alphaRefresh = backgroundAlpha;
  };



  /**
   * Draws a filled in Rectangle.
   * Fill color is expected to be set using {@link setFill}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @example
   * setFill('steelblue');
   * fRect(10, 10, 40, 40);
   *
   */
  Graphics.prototype.fRect = function(x, y, width, height) {
    if(typeof x != 'number') {
      y = x.y;
      width = x.width;
      height = x.height;
      x = x.x;
    }
    this.context.fillRect(x, y, width, height);
  };

  /**
   * Draws a stroked Rectangle - showing just an outline.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @example
   * setStroke('orange');
   * sRect(10, 10, 40, 40);
   *
   */
  Graphics.prototype.sRect = function(x, y, width, height) {
    if(typeof x != 'number') {
      y = x.y;
      width = x.width;
      height = x.height;
      x = x.x;
    }
    this.context.strokeRect(x, y, width, height);
  };

  /**
   * Draws a filled and stroked Rectangle.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @example
   * setFill('steelblue');
   * setStroke('orange');
   * fsRect(10, 10, 40, 40);
   *
   */
  Graphics.prototype.fsRect = function(x, y, width, height) {
    if(typeof x != 'number') {
      y = x.y;
      width = x.width;
      height = x.height;
      x = x.x;
    }
    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
  };

  /**
   * Draws a filled in Arc.
   * Fill color is expected to be set using {@link setFill}.
   *
   * @param {Number} x X position of center of the Arc.
   * @param {Number} y Y position of center of the Arc.
   * @param {Number} r Radius of the Arc.
   * @param {Number} a0 first angle of the Arc.
   * @param {Number} a1 second angle of the Arc.
   * @example
   * setFill('steelblue');
   * fArc(40, 40, 20, 0.5, 0.8);
   *
   */
  Graphics.prototype.fArc = function(x, y, r, a0, a1, counterclockwise) {
    this.context.beginPath();
    this.context.arc(x, y, r, a0, a1, counterclockwise);
    this.context.fill();
  };

  /**
   * Draws a stroked Arc.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of center of the Arc.
   * @param {Number} y Y position of center of the Arc.
   * @param {Number} r Radius of the Arc.
   * @param {Number} a0 first angle of the Arc.
   * @param {Number} a1 second angle of the Arc.
   * @example
   * setStroke('orange', 5);
   * sArc(40, 40, 20, 0.5, 0.8);
   *
   */
  Graphics.prototype.sArc = function(x, y, r, a0, a1, counterclockwise) {
    this.context.beginPath();
    this.context.arc(x, y, r, a0, a1, counterclockwise);
    this.context.stroke();
  };

  /**
   * Draws a filled in Circle.
   * Fill color is expected to be set using {@link setFill}.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @example
   * setFill('steelblue');
   * fCircle(40, 40, 20);
   *
   */
  Graphics.prototype.fCircle = function(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi);
    this.context.fill();
  };

  /**
   * Draws a stroked Circle.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @example
   * setStroke('orange', 5);
   * sCircle(40, 40, 20);
   *
   */
  Graphics.prototype.sCircle = function(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi);
    this.context.stroke();
  };

  /**
   * Draws a filled and stroked Circle.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @example
   * setStroke('steelblue');
   * sCircle(40, 40, 20);
   *
   */
  Graphics.prototype.fsCircle = function(x, y, r) {
    this.fCircle(x, y, r);
    this.context.stroke();
  };

  /**
   * Draws a filled in Ellipse.
   * Fill color is expected to be set using {@link setFill}.
   *
   * @param {Number} x X position of center of the Ellipse.
   * @param {Number} y Y position of center of the Ellipse.
   * @param {Number} rW Radial width of the Ellipse.
   * @param {Number} rH Radial height of the Ellipse.
   * @example
   * setFill('steelblue');
   * fEllipse(40, 40, 20, 30);
   */
  Graphics.prototype.fEllipse = function(x, y, rW, rH) {
    var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
      ox = rW * k, // control point offset horizontal
      oy = rH * k, // control point offset vertical
      xe = x + rW, // x-end
      ye = y + rH; // y-end
    this.context.beginPath();
    this.context.moveTo(x - rW, y);
    this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    this.context.moveTo(x - rW, y);
    this.context.closePath();
    this.context.fill();
  };

  /**
   * Draws a stroked Ellipse.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of center of the Ellipse.
   * @param {Number} y Y position of center of the Ellipse.
   * @param {Number} rW Radial width of the Ellipse.
   * @param {Number} rH Radial height of the Ellipse.
   * @example
   * setStroke('orange');
   * sEllipse(40, 40, 20, 30);
   */
  Graphics.prototype.sEllipse = function(x, y, rW, rH) {
    var k = 0.5522848,
      ox = rW * k,
      oy = rH * k,
      xe = x + rW,
      ye = y + rH;
    this.context.beginPath();
    this.context.moveTo(x - rW, y);
    this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    this.context.moveTo(x - rW, y);
    this.context.closePath();
    this.context.stroke();
  };

  /**
   * Draws a filled and stroked Ellipse.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of center of the Ellipse.
   * @param {Number} y Y position of center of the Ellipse.
   * @param {Number} rW Radial width of the Ellipse.
   * @param {Number} rH Radial height of the Ellipse.
   * @example
   * setFill('steelblue');
   * setStroke('steelblue');
   * fsEllipse(40, 40, 20, 30);
   */
  Graphics.prototype.fsEllipse = function(x, y, rW, rH) {
    this.fEllipse(x, y, rW, rH);
    this.context.stroke();
  };


  /**
   * TODO add comments to this to explain what it does.
   * @ignore
   */
  Graphics.prototype._solidArc = function(x,y,a0,a1,r0,r1){
    this.context.beginPath();
    this.context.arc( x, y, r0, a0, a1 );
    this.context.lineTo( x + r1*Math.cos(a1), y + r1*Math.sin(a1) );
    this.context.arc( x, y, r1, a1, a0, true );
    this.context.lineTo( x + r0*Math.cos(a0), y + r0*Math.sin(a0) );
  };

  /**
   * [fSolidArc description]
   * @todo document fSolidArc
   */
  Graphics.prototype.fSolidArc = function(x,y,a0,a1,r0,r1){
    this._solidArc(x,y,a0,a1,r0,r1);
    this.context.fill();
  };

  /**
   * [sSolidArc description]
   * @todo document sSolidArc
   */
  Graphics.prototype.sSolidArc = function(x,y,a0,a1,r0,r1){
    this._solidArc(x,y,a0,a1,r0,r1);
    this.context.stroke();
  };

  /**
   * [fsSolidArc description]
   * @todo document fsSolidArc
   */
  Graphics.prototype.fsSolidArc = function(x,y,a0,a1,r0,r1){
    this.fSolidArc(x,y,a0,a1,r0,r1);
    this.context.stroke();
  };


  /**
   * Draws a line from a start position to an end position
   *
   * @param {Number} x0 Starting x position.
   * @param {Number} y0 Starting y position.
   * @param {Number} x1 Ending x position.
   * @param {Number} y1 Ending y position.
   * @example
   * setStroke('black');
   * line(0, 0, 40, 40);
   */
  Graphics.prototype.line = function(x0, y0, x1, y1) {
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.stroke();
  };

  /**
   * Draws a bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingthis.context.D/bezierCurveTo|bezierCurveTo}
   *
   * @param {Number} x0 Starting x position.
   * @param {Number} y0 Starting y position.
   * @param {Number} cx0 First curve control point x position.
   * @param {Number} cy0 First cure control point y position.
   * @param {Number} cx1 Second curve control point x position.
   * @param {Number} cy1 Second cure control point y position.
   * @param {Number} x1 Ending x position.
   * @param {Number} y1 Ending y position.
   * @example
   * setStroke('black');
   * bezier(10, 10, 10, 0, 40, 0, 40, 10);
   */
  Graphics.prototype.bezier = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1) {
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
    this.context.stroke();
  };


  /**
   * @todo add comments to this to explain what it does.
   * @ignore
   */
  Graphics.prototype._lines = function() {
    if(arguments == null) return;

    var args = arguments[0];
    this.context.beginPath();
    this.context.moveTo(args[0], args[1]);
    for(var i = 2; args[i + 1] != null; i += 2) {
      this.context.lineTo(args[i], args[i + 1]);
    }
  };

  /**
   * TODO add comments to this to explain what it does.
   * @ignore
   */
  Graphics.prototype._linesM = function() {
    if(arguments == null) {
      return;
    }

    var args = arguments[0];
    var p = new _Polygon();
    this.context.beginPath();
    this.context.moveTo(args[0], args[1]);
    p[0] = new _Point(args[0], args[1]);
    for(var i = 2; args[i + 1] != null; i += 2) {
      this.context.lineTo(args[i], args[i + 1]);
      p.push(new _Point(args[i], args[i + 1]));
    }
    return p.containsPoint(this.mP);
  };

  /**
   * Draws a filled polygon using a series of
   * x/y positions.
   *
   * @param {...Number} positions x and y positions for the Polygon
   * @example
   * // This draws a filled triangle
   * // Inputs are pairs of x/y positions.
   * setFill('steelblue').
   * fLines(10, 10, 40, 10, 40, 40);
   *
   */
  Graphics.prototype.fLines = function() {
    this._lines(arguments);
    this.context.fill();
  };

  /**
   * Draws a set of line segments using a series of
   * x/y positions as input.
   *
   * @param {...Number} positions x and y positions for the Lines
   * @example
   * // This draws the outline of a triangle.
   * // Inputs are pairs of x/y positions.
   * setStroke('orange');
   * sLines(10, 10, 40, 10, 40, 40, 10, 10);
   *
   */
  Graphics.prototype.sLines = function() {
    this._lines(arguments);
    this.context.stroke();
  };

  /**
   * Draws a filled set of line segments using a series of
   * x/y positions as input.
   *
   * @param {...Number} positions x and y positions for the Lines
   * @example
   * // This draws a filled and outlined triangle.
   * // Inputs are pairs of x/y positions.
   * setFill('steelblue');
   * setStroke('orange');
   * fsLines(10, 10, 40, 10, 40, 40, 10, 10);
   *
   */
  Graphics.prototype.fsLines = function() {
    this._lines(arguments);
    this.context.fill();
    this.context.stroke();
  };

  /**
   * Draws a mouse-enabled filled set of line segments using a series of
   * x/y positions as input. Returns true if moused over on current
   * cycle iteration.
   *
   * @param {...Number} positions x and y positions for the Lines
   * @returns {Boolean} if true, mouse is currently hovering over lines.
   * @example
   * // Turns Fill Red if moused over
   * setFill('steelblue');
   * setStroke('orange');
   * var on = fsLinesM(10, 10, 40, 10, 40, 40, 10, 10);
   * if(on) {
   *   setFill('red');
   *   fsLines(10, 10, 40, 10, 40, 40, 10, 10);
   * }
   *
   */
  Graphics.prototype.fsLinesM = function() {
    var mouseOn = this._linesM(arguments);
    this.context.fill();
    this.context.stroke();
    return mouseOn;
  };

  /**
   * @ignore
   */
  Graphics.prototype._polygon = function(polygon) {
    this.context.beginPath();
    this.context.moveTo(polygon[0].x, polygon[0].y);
    for(var i = 1; polygon[i] != null; i++) {
      this.context.lineTo(polygon[i].x, polygon[i].y);
    }
  };

  /**
   * Renders a filled polygon.
   *
   * @param  {Polygon} polygon the polygon to render
   */
  Graphics.prototype.fPolygon = function(polygon) {
    this._polygon(polygon);
    this.context.fill();
  };

  /**
   * Render a stroked polygon
   * @param  {Polygon} polygon
   * @param  {Boolean} closePath
   */
  Graphics.prototype.sPolygon = function(polygon, closePath) {
    this._polygon(polygon);
    if(closePath) {
      this.context.closePath();
    }
    this.context.stroke();
  };

  /**
   * Render a filled and stroked polygon
   * @param  {Polygon} polygon
   * @param  {Boolean} closePath
   */
  Graphics.prototype.fsPolygon = function(polygon, closePath) {
    this._polygon(polygon);
    if(closePath) {
      this.context.closePath();
    }
    this.context.fill();
    this.context.stroke();
  };

  /**
   * [fEqTriangle description]
   * @todo document fEqTriangle
   */
  Graphics.prototype.fEqTriangle = function(x, y, angle, r) {
    this._eqTriangle(x, y, angle, r);
    this.context.fill();
  };

  /**
   * Draws a stroked equilateral traiangle.
   * @todo document sEqTriangle
   */
  Graphics.prototype.sEqTriangle = function(x, y, angle, r) {
    this._eqTriangle(x, y, angle, r);
    this.context.stroke();
  };

  /**
   * Draws a filled and stroked equilateral triangle.
   * @todo document fsEqTriangle
   */
  Graphics.prototype.fsEqTriangle = function(x, y, angle, r) {
    this._eqTriangle(x, y, angle, r);
    this.context.fill();
    this.context.stroke();
  };

  /**
   * @param  {Number} x     [description]
   * @param  {Number} y     [description]
   * @param  {Number} angle [description]
   * @param  {Number} r     [description]
   * @return {Number}       [description]
   *
   * TODO document this
   * @ignore
   */
  Graphics.prototype._eqTriangle = function(x, y, angle, r) {
    this.context.beginPath();
    angle = angle || 0;
    this.context.moveTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
    this.context.lineTo(r * Math.cos(angle + 2.0944) + x, r * Math.sin(angle + 2.0944) + y);
    this.context.lineTo(r * Math.cos(angle + 4.1888) + x, r * Math.sin(angle + 4.1888) + y);
    this.context.lineTo(r * Math.cos(angle) + x, r * Math.sin(angle) + y);
  };

  //drawing and checking cursor

  /**
   * Draws a mouse-enabled filled in Rectangle.
   * Fill color is expected to be set using {@link setFill}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @param {Number} margin Parameter around rectangle to count towards mouse over.
   * @return {Boolean} Returns true if the mouse is over the rectangle on the current
   * iteration of the cycle function.
   * @example
   * setFill('steelblue');
   * var on = fRectM(10, 10, 40, 40);
   * if(on) {
   *   setFill('red');
   *   fRect(10, 10, 40, 40);
   * }
   */
  Graphics.prototype.fRectM = function(x, y, width, height, margin) {
    margin = margin == null ? 0 : margin;
    this.context.fillRect(x, y, width, height);
    return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
  };

  /**
   * Draws a mouse-enabled stroked Rectangle.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @param {Number} margin Parameter around rectangle to count towards mouse over.
   * @return {Boolean} Returns true if the mouse is over the rectangle on the current
   * iteration of the cycle function.
   * @example
   * setStroke('orange');
   * var on = sRectM(10, 10, 40, 40);
   * if(on) {
   *   setStroke('black');
   *   sRect(10, 10, 40, 40);
   * }
   */
  Graphics.prototype.sRectM = function(x, y, width, height, margin) {
    margin = margin == null ? 0 : margin;
    this.context.strokeRect(x, y, width, height);
    return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
  };

  /**
   * Draws a mouse-enabled filled and stroked Rectangle.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   *
   * @param {Number} x X position of upper-left corner of Rectangle.
   * @param {Number} y Y position of upper-left corner of Rectangle.
   * @param {Number} width Width of Rectangle in pixels.
   * @param {Number} height Height of Rectangle in pixels.
   * @param {Number} margin Parameter around rectangle to count towards mouse over.
   * @return {Boolean} Returns true if the mouse is over the rectangle on the current
   * iteration of the cycle function.
   * @example
   * setFill('steelblue');
   * setStroke('orange');
   * var on = fsRectM(10, 10, 40, 40);
   * if(on) {
   *   setFill('red');
   *   setStroke('black');
   *   sRect(10, 10, 40, 40);
   * }
   */
  Graphics.prototype.fsRectM = function(x, y, width, height, margin) {
    margin = margin == null ? 0 : margin;
    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
    return this.mY > y - margin && this.mY < y + height + margin && this.mX > x - margin && this.mX < x + width + margin;
  };

  /**
   * Draws a mouse-enabled filled in Circle.
   * Fill color is expected to be set using {@link setFill}.
   * Returns true if mouse is over circle on current iteration of cycle.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @param {Number} margin Margin around Circle to consider part of mouse over.
   * @return {Boolean} Returns true if the mouse is over the circle on the current
   * iteration of the cycle function.
   * @example
   * setFill('steelblue');
   * var on = fCircleM(40, 40, 20);
   * if(on) {
   *  setFill('red');
   *  fCircle(40, 40, 20);
   * }
   *
   */
  Graphics.prototype.fCircleM = function(x, y, r, margin) { //check if you can avoid repeat
    margin = margin == null ? 0 : margin;
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi);
    this.context.fill();
    return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
  };

  /**
   * Draws a mouse-enabled stroked Circle.
   * Stroke color is expected to be set using {@link setStroke}.
   * Returns true if mouse is over circle on current iteration of cycle.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @param {Number} margin Margin around Circle to consider part of mouse over.
   * @return {Boolean} Returns true if the mouse is over the circle on the current
   * iteration of the cycle function.
   * @example
   * setStroke('orange');
   * var on = sCircleM(40, 40, 20);
   * if(on) {
   *  setStroke('black');
   *  sCircle(40, 40, 20);
   * }
   *
   */
  Graphics.prototype.sCircleM = function(x, y, r, margin) {
    margin = margin == null ? 0 : margin;
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi);
    this.context.stroke();
    return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
  };

  /**
   * Draws a mouse-enabled filled and stroked Circle.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   * Returns true if mouse is over circle on current iteration of cycle.
   *
   * @param {Number} x X position of center of the Circle.
   * @param {Number} y Y position of center of the Circle.
   * @param {Number} r Radius of the Circle.
   * @param {Number} margin Margin around Circle to consider part of mouse over.
   * @return {Boolean} Returns true if the mouse is over the circle on the current
   * iteration of the cycle function.
   * @example
   * setFill('steelblue');
   * setStroke('orange');
   * var on = fsCircleM(40, 40, 20);
   * if(on) {
   *  setFill('red');
   *  setStroke('black');
   *  fsCircle(40, 40, 20);
   * }
   *
   */
  Graphics.prototype.fsCircleM = function(x, y, r, margin) {
    margin = margin == null ? 0 : margin;
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi);
    this.context.stroke();
    this.context.fill();
    return Math.pow(x - this.mX, 2) + Math.pow(y - this.mY, 2) < Math.pow(r + margin, 2);
  };

  /**
   * Draws a mouse-enabled line from a start position to an end position.
   *
   * @param {Number} x0 Starting x position.
   * @param {Number} y0 Starting y position.
   * @param {Number} x1 Ending x position.
   * @param {Number} y1 Ending y position.
   * @param {Number} d Distance away from line to count towards mouse interaction.
   * @return {Boolean} Returns true if the mouse is over the line on the current
   * iteration of the cycle function.
   * @example
   * setStroke('black');
   * var on = lineM(0, 0, 40, 40);
   * if(on) {
   *  setStroke('red');
   *  line(0, 0, 40, 40);
   * }
   */
  Graphics.prototype.lineM = function(x0, y0, x1, y1, d) {
    d = d || 4;
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.lineTo(x1, y1);
    this.context.stroke();
    return this._distToSegmentSquared(x0, y0, x1, y1) < d * d;
  };


  /**
   *
   * TODO document this.
   * @ignore
   */
  Graphics.prototype._distToSegmentSquared = function(x0, y0, x1, y1) {
    var l2 = Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2);
    if(l2 === 0) return Math.pow(x0 - this.mX, 2) + Math.pow(y0 - this.mY, 2);
    var t = ((this.mX - x0) * (x1 - x0) + (this.mY - y0) * (y1 - y0)) / l2;
    if(t <= 0) return Math.pow(x0 - this.mX, 2) + Math.pow(y0 - this.mY, 2);
    if(t >= 1) return Math.pow(x1 - this.mX, 2) + Math.pow(y1 - this.mY, 2);
    var px = x0 + t * (x1 - x0);
    var py = y0 + t * (y1 - y0);
    return Math.pow(px - this.mX, 2) + Math.pow(py - this.mY, 2);
  };

  //TODO:fEqTriangleM, fPolygonM


  /**
   * Draws a mouse-enabled bezier curve using {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingthis.context.D/bezierCurveTo|bezierCurveTo}.
   *
   *
   * @param {Number} x0 Starting x position.
   * @param {Number} y0 Starting y position.
   * @param {Number} cx0 First curve control point x position.
   * @param {Number} cy0 First cure control point y position.
   * @param {Number} cx1 Second curve control point x position.
   * @param {Number} cy1 Second cure control point y position.
   * @param {Number} x1 Ending x position.
   * @param {Number} y1 Ending y position.
   * @param {Number} d Distance away from line to count towards mouse interaction.
   * @return {Boolean} Returns true if the mouse is over the line on the current
   * iteration of the cycle function.
   * @example
   * setStroke('black');
   * var on = bezierM(10, 10, 10, 0, 40, 0, 40, 10);
   * if(on) {
   *  setStroke('red');
   *  bezierM(10, 10, 10, 0, 40, 0, 40, 10);
   * }
   */
  Graphics.prototype.bezierM = function(x0, y0, cx0, cy0, cx1, cy1, x1, y1, d) { //TODO: fix this mess!
    d = d == null ? 2 : d;
    this.context.beginPath();
    this.context.moveTo(x0, y0);
    this.context.bezierCurveTo(cx0, cy0, cx1, cy1, x1, y1);
    this.context.stroke();
    if(this.mX < Math.min(x0, x1, cx0, cx1) - d || this.mX > Math.max(x0, x1, cx0, cx1) + d || this.mY < Math.min(y0, y1, cy0, cy1) - d || this.mY > Math.max(y0, y1, cy0, cy1) + d) return false;
    return GeometryOperators.distanceToBezierCurve(x0, y0, cx0, cy0, cx1, cy1, x1, y1, this.mP, false) < d;
  };


  //images

  /**
   *  Draw an image on this.context. parameters options (s for source, d for destination):
   *
   *  drawImage(image, dx, dy)
   *  drawImage(image, dx, dy, dw, dh)
   *  drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
   *  @param {Image} image
   *
   *  @todo document parameters
   */
  Graphics.prototype.drawImage = function(image) { //TODO: improve efficiency
    if(image == null) return;

    switch(arguments.length) {
      case 3:
        this.context.drawImage(image, arguments[1], arguments[2]);
        break;
      case 5:
        this.context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4]);
        break;
      case 9:
        this.context.drawImage(image, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
        break;

    }
  };

  /**
   * fits an image into a rectangle without chagning its proportions (thus probably loosing top-bottom or left-right margins)
   * @param  {Image} image
   * @param  {Rectangle} rectangle frame of the image
   */
  Graphics.prototype.fitImage = function(image, rectangle) {
    if(image == null ||  rectangle == null) return;

    var propIm = image.width / image.height;
    var propRc = rectangle.width / rectangle.height;
    var compProp = propIm / propRc;

    if(propIm > propRc) {
      this.context.drawImage(image, 0.5 * (image.width - image.width / compProp), 0, image.width / compProp, image.height, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    } else {
      this.context.drawImage(image, 0, 0.5 * (image.height - image.height * compProp), image.width, image.height * compProp, rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    }
  };

  // styles

  /**
   * Sets the current fill color for the graphics object.
   *
   * Callers can pass in either an rgba() color string, or a set of up to four numbers
   * representing the rgb or rgba color.
   *
   * @param {String|Numbers} style
   */
  Graphics.prototype.setFill = function(style) {
    if(typeof style == "number") {
      if(arguments.length > 3) {
        this.context.fillStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
        return;
      }
      this.context.fillStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
      return;
    }
    this.context.fillStyle = style;
  };

  /**
   * Set stroke to draw with in canvas
   *
   * @param {(String|Number)} style If string, then hex value or web color.
   *                                If Number, then a set of RGB or RGBA integers
   * @param {Number} lineWidth Optional width of line to use. Only valid if style parameter is a string.
   *
   * @example
   * setStroke('steelblue'); // sets stroke to blue.
   * setStroke(0,0,0,0.4); // sets stroke to black with partial opacity.
   * setStroke('black', 0.2); // provides lineWidth to stroke
   */
  Graphics.prototype.setStroke = function(style, lineWidth) {
    if(typeof style == "number") {
      if(arguments.length > 3) {
        this.context.strokeStyle = 'rgba(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ',' + arguments[3] + ')';
        return;
      }
      this.context.strokeStyle = 'rgb(' + arguments[0] + ',' + arguments[1] + ',' + arguments[2] + ')';
      return;
    }
    this.context.strokeStyle = style;
    //TODO: will lineWidth still work if RGB or RGBA is used?
    if(lineWidth) this.context.lineWidth = lineWidth;
  };

  /**
   * Set the current lineWidth for strokes.
   *
   * @param {Number} lineWidth [description]\
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth|lineWidth}
   */
  Graphics.prototype.setLW = function(lineWidth) {
    this.context.lineWidth = lineWidth;
  };

  //
  // Clipping
  //

  /**
   * Creates a clipping circle with the given dimensions
   *
   * @param  {Number} x x coordinate of the circle's center
   * @param  {Number} y y coordinate of the circle's center
   * @param  {Number} r radius of circle
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
   */
  Graphics.prototype.clipCircle = function(x, y, r) {
    this.context.save();
    this.context.beginPath();
    this.context.arc(x, y, r, 0, TwoPi, false);
    this.context.closePath();
    this.context.clip();
  };

  /**
   * Creates a clipping rectangle with the given dimensions
   *
   * @param  {Number} x x coordinate of top left corner
   * @param  {Number} y y coordinate of top left corner
   * @param  {Number} w width of rect
   * @param  {Number} h height of rect
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
   */
  Graphics.prototype.clipRectangle = function(x, y, w, h) {
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x + w, y);
    this.context.lineTo(x + w, y + h);
    this.context.lineTo(x, y + h);
    this.context.clip();
  };

  /**
   * Saves the entire state of the canvas by pushing the current state onto a stack.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save|Save}
   */
  Graphics.prototype.save = function() {
    this.context.save();
  };

  /**
   * Turns the path currently being built into the current clipping path.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip|Clip}
   */
  Graphics.prototype.clip = function() {
    this.context.clip();
  };

  /**
   * Restores the most recently saved canvas state by popping the top entry
   * in the drawing state stack. If there is no saved state,
   * this method does nothing.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore|Restore}
   */
  Graphics.prototype.restore = function() {
    this.context.restore();
  };

  //
  // Text
  //

  /**
   * Draws filled in text.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @example
   * setText('black', 30, 'Arial');
   * fText("hello", 10, 10);
   *
   */
  Graphics.prototype.fText = function(text, x, y) {
    this.context.fillText(text, x, y);
  };

  /**
   * Draws stroked text.
   * Stroke color is expected to be set using {@link setStroke}.
   * Additionally, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @example
   * setText('black', 30, 'Arial');
   * setStroke('orange');
   * sText("hello", 10, 10);
   *
   */
  Graphics.prototype.sText = function(text, x, y) {
    this.context.strokeText(text, x, y);
  };

  /**
   * Draws stroked and filled in text.
   * Stroke color is expected to be set using {@link setStroke}.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @example
   * setText('black', 30, 'Arial');
   * setStroke('orange');
   * fsText("hello", 10, 10);
   *
   */
  Graphics.prototype.fsText = function(text, x, y) {
    this.context.strokeText(text, x, y);
    this.context.fillText(text, x, y);
  };

  /**
   * Draws filled in text and returns its width.
   *
   * @param  {String} text
   * @param  {Number} x x coordinate of text
   * @param  {Number} y x coordinate of text
   * @return {Number} the width of the rendered text in pixels
   */
  Graphics.prototype.fTextW = function(text, x, y) {
    this.context.fillText(text, x, y);
    return this.context.measureText(text).width;
  };

  /**
   * Draws filled in text, rotated by some angle.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @param {Number} angle The angle in radians to rotate the text
   * @example
   * setText('black', 30, 'Arial');
   * fTextRotated("hello", 40, 40, (20 * Math.PI / 180));
   *
   */
  Graphics.prototype.fTextRotated = function(text, x, y, angle) {
    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.fillText(text, 0, 0);
    this.context.restore();
  };

  /**
   * Draws filled in text in an arc.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position of control point, to start the text if not centered.
   * @param {Number} y Y position of control point, to start the text if not centered.
   * @param {Number} xCenter X position of center of arc.
   * @param {Number} yCenter Y position of center of arc.
   * @param {Boolean} centered if false (default) text starts on control point, if true the control point is the center of the text
   * @example
   * setText('black', 30, 'Arial');
   * fTextArc("Wheels on the Bus Go Round and Round", 500, 300, 200, 200, true);
   *
   */
  Graphics.prototype.fTextArc = function(text, x, y, xCenter, yCenter, centered){
    if(text == null || text === "") {
      return;
    }

    var i;
    var r = Math.sqrt(Math.pow(x - xCenter, 2)+Math.pow(y - yCenter, 2));
    var a = Math.atan2(y - yCenter, x - xCenter);
    if(centered) {
      a -= this.getTextW(text)*0.5/r;
    }
    var xl, yl;
    var letters = text.split('');
    for(i=0; letters[i]!=null; i++){
      xl = xCenter + r*Math.cos(a);
      yl = yCenter + r*Math.sin(a);
      this.fTextRotated(letters[i], xl, yl, a + HalfPi);
      a += this.getTextW(letters[i])/r;
    }
  };

  /**
   * Draws a mouse-enabled filled in text.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @param {Number} size Size of the text being drawn.
   * @return {Boolean} Returns true if the mouse is over the text on the current
   * iteration of the cycle function.
   * @example
   * setText('black', 30, 'Arial');
   * var on = fTextM("hello", 10, 10, 30);
   * if(on) {
   *   setText('red', 30, 'Arial');
   *   fText("hello", 10, 10);
   * }
   *
   */
  Graphics.prototype.fTextM = function(text, x, y, size) {
    size = size || this.fontSize;
    this.context.fillText(text, x, y);
    return this.mY > y && this.mY < y + size && this.mX > x && this.mX < x + this.context.measureText(text).width;
  };

  /**
   * Draws a mouse-enabled filled and stroked text.
   * Fill color is expected to be set using {@link setFill}.
   * Stroke color is expected to be set using {@link setStroke}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @param {Number} size Size of the text being drawn.
   * @return {Boolean} Returns true if the mouse is over the text on the current
   * iteration of the cycle function.
   * @example
   * setText('black', 30, 'Arial');
   * setStroke('orange')
   * var on = fsTextM("hello", 10, 10, 30);
   * if(on) {
   *   setText('red', 30, 'Arial');
   *   setStroke('black')
   *   fsText("hello", 10, 10);
   * }
   *
   */
  Graphics.prototype.fsTextM = function(text, x, y, size) {
    size = size || this.fontSize;
    this.context.strokeText(text, x, y);
    this.context.fillText(text, x, y);
    return this.mY > y && this.mY < y + size && this.mX > x && this.mX < x + this.context.measureText(text).width;
  };

  /**
   * Draws a mouse-enabled filled text rotated by some angle.
   * Fill color is expected to be set using {@link setFill}.
   * Alternatively, setText can be used to set a number of
   * text rendering properties.
   *
   * @param {String} text Text to draw.
   * @param {Number} x X position to start the text.
   * @param {Number} y Y position to start the text.
   * @param {Number} angle The angle in radians to rotate the text
   * @param {Number} size Size of the text being drawn.
   * @return {Boolean} Returns true if the mouse is over the text on the current
   * iteration of the cycle function.
   * @example
   * setText('black', 30, 'Arial');
   * var on = fTextRotatedM("hello", 10, 10, (20 * Math.PI / 180), 30);
   * if(on) {
   *   setText('red', 30, 'Arial');
   *   setStroke('black')
   *   fsText("hello", 10, 10);
   * }
   *
   */
  Graphics.prototype.fTextRotatedM = function(text, x, y, angle, size) {
    size = size || 12;
    this.context.save();
    this.context.translate(x, y);
    this.context.rotate(angle);
    this.context.fillText(text, 0, 0);
    this.context.restore();

    var dX = this.mX - x;
    var dY = this.mY - y;
    var d = Math.sqrt(dX * dX + dY * dY);
    var a = Math.atan2(dY, dX) - angle;
    var mXT = x + d * Math.cos(a);
    var mYT = y + d * Math.sin(a);

    return mYT > y && mYT < y + size && mXT > x && mXT < x + this.context.measureText(text).width;
  };

  /**
   * Helper function, returns first param if it is not null or undefined
   * esle returns second param.
   * @param  {Object} value
   * @param  {Object} fallback
   * @return {Object}
   * @ignore
   */
  function ifDef(value, fallback) {
    if(value !== undefined && value !== null) {
      return value;
    } else {
      return fallback;
    }
  }

  /**
   * Sets default values for several text rendering properties.
   * Values that are undefined or null are not changed. Will also
   * call setText and set the current text properties to that.
   *
   * @see  setText
   *
   * @param {Object} color optional font color
   * @param {Object} fontSize optional font size
   * @param {Object} fontName optional font name (default: LOADED_FONT)
   * @param {Object} align optional horizontal align ('left', 'center', 'right')
   * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
   * @param {Object} style optional font style ('bold', 'italic', 'underline')
   */
  Graphics.prototype.setTextDefaults = function(color, fontSize, fontName, align, baseline, style) {
    this.fontColor = ifDef(color, this.fontColor);
    this.fontSize = ifDef(String(fontSize), this.fontSize);
    this.fontName = ifDef(fontName, this.fontName);
    this.fontAlign = ifDef(align, this.fontAlign);
    this.fontBaseline = ifDef(baseline, this.fontBaseline);
    this.fontStyle = ifDef(style, this.fontStyle);

    this.setText();
  };

  /**
   * Sets several text canvas rendering properties. If a value
   * is null or undefined, use the currently set default value.
   *
   * @see  setTextDefaults
   *
   * @param {Object} color optional font color
   * @param {Object} fSize optional font size
   * @param {Object} fName optional font name (default: LOADED_FONT)
   * @param {Object} align optional horizontal align ('left', 'center', 'right')
   * @param {Object} baseline optional vertical alignment ('bottom', 'middle', 'top')
   * @param {Object} style optional font style ('bold', 'italic', 'underline')
   */
  Graphics.prototype.setText = function(color, fSize, fName, align, baseline, style) {
    var fontColor = ifDef(color, this.fontColor);
    var fontSize = ifDef(String(fSize), this.fontSize);
    var fontName = ifDef(fName, this.fontName);
    var fontAlign = ifDef(align, this.fontAlign);
    var fontBaseline = ifDef(baseline, this.fontBaseline);
    var fontStyle = ifDef(style, this.fontStyle);

    if(fontStyle !== '') {
      fontStyle += ' ';
    }

    this.context.fillStyle = fontColor;
    this.context.font = fontStyle + fontSize + 'px ' + fontName;
    this.context.textAlign = fontAlign;
    this.context.textBaseline = fontBaseline;
  };

  /**
   * Get the current font family
   * @return {String} the current font family
   */
  Graphics.prototype.getFontFamily = function() {
    return this.fontName;
  };

  /**
   * Sets the current font family
   */
  Graphics.prototype.setFontFamily = function(fontName) {
    this.setText(undefined, undefined, fontName);
  };




  /**
   * Returns the width in pixels of the text passed in given the current
   * state of the graphics canvas.
   *
   * @param  {String} text
   * @return {Number} width in pixels of the text if it were rendered.
   *
   * TODO it would be great to have a method that returned the whole
   * TextMetrics object
   */
  Graphics.prototype.getTextW = function(text) {
    return this.context.measureText(text).width;
  };

  //
  // Pixel data
  //

  /**
   * Return the RGBA color of the pixel at a given x,y coordinate on
   * the graphics object canvas as a string.
   *
   * @param  {Number} x x coordinate of pixel
   * @param  {Number} y y coordinate of pixel
   * @return {String} an rgba(r,g,b,a) string representation of the color
   */
  Graphics.prototype.getPixelColor = function(x, y) {
    var rgba = this.context.getImageData(x, y, 1, 1).data;
    return 'rgba(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ',' + rgba[3] + ')';
  };

  /**
   * Return the RGBA color of the pixel at a given x,y coordinate on
   * the graphics object canvas as an array of integers.
   *
   * @param  {Number} x x coordinate of pixel
   * @param  {Number} y y coordinate of pixel
   * @return {Uint8ClampedArray} Uint8ClampedArray  representing a one-dimensional
   *                                                array containing the data in the
   *                                                RGBA order, with integer values
   *                                                between 0 and 255
   */
  Graphics.prototype.getPixelColorRGBA = function(x, y) {
    return this.context.getImageData(x, y, 1, 1).data;
  };

  //
  // Capture
  //

  /**
   * Cpatures the current state of this graphics objects' canvas
   * to an image
   *
   * @return {Image} HTML5 Image object of current state of the canvas.
   */
  Graphics.prototype.captureCanvas = function() {
    var im = new Image();
    im.src = this.canvas.toDataURL();
    return im;
  };

  //
  // Cursor
  //

  /**
   * Change mouse cursor to given style. See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor|MDN Cursor Page} for all style options.
   * @param {String} name The name of the cursor style.
   */
  Graphics.prototype.setCursor = function(name) {
    name = name == null ? 'default' : name;
    this.canvas.style.cursor = name;
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.getFrame = function(){
    return new Rectangle(0, 0, this.cW, this.cH);
  };

  //
  // Advanced graphics (rely on Axis2D projection object)
  //

  /**
   * @todo document this
   * @ignore
   */
  Graphics.prototype._linesInFrame = function(axis2D, numberListX, numberListY){
    var l = Math.min(numberListX.length, numberListY.length);
    var i;

    this.context.beginPath();
    this.context.moveTo(axis2D.projectX(numberListX[0]), axis2D.projectY(numberListY[0]));

    for(i=1; i<l; i++){
      this.context.lineTo(axis2D.projectX(numberListX[i]), axis2D.projectY(numberListY[i]));
    }
  };


  /**
   * @todo write docs
   */
  Graphics.prototype.sLinesInFrame = function(axis2D, numberListX, numberListY){
    this._linesInFrame(axis2D, numberListX, numberListY);
    this.context.stroke();
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.fLinesInFrame = function(axis2D, numberListX, numberListY){
    this._linesInFrame(axis2D, numberListX, numberListY);
    this.context.fill();
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.fsLinesInFrame = function(axis2D, numberListX, numberListY){
    this._linesInFrame(axis2D, numberListX, numberListY);
    this.context.fill();
    this.context.stroke();
  };


  /**
   * @todo write docs
   */
  Graphics.prototype.drawGridX = function(axis2D, dX, yLabel, stepsLabel){
    var x0;
    var n;
    var i;
    var x, top, bottom;

    x0 = Math.floor(axis2D.departureFrame.x/dX)*dX;
    n = Math.min( Math.ceil(axis2D.departureFrame.width/dX), 1000 );
    top = Math.min(axis2D.arrivalFrame.y, axis2D.arrivalFrame.y+axis2D.arrivalFrame.height);
    bottom = Math.max(axis2D.arrivalFrame.y, axis2D.arrivalFrame.y+axis2D.arrivalFrame.height);
    stepsLabel = stepsLabel==null?1:stepsLabel;
    for(i=0; i<n; i++){
      x = Math.floor(axis2D.projectX(x0 + i*dX))+0.5;
      this.line(x, top, x, bottom);
      if(yLabel!=null && i%stepsLabel===0) {
        this.fText(String(x0 + i*dX), x, bottom+yLabel);
      }
    }
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.drawGridY = function(axis2D, dY, xLabel, stepsLabel){
    var y0;
    var n;
    var i;
    var y, left, right;

    y0 = Math.floor(axis2D.departureFrame.y/dY)*dY;
    n = Math.min( Math.ceil(axis2D.departureFrame.height/dY), 1000 );
    left = Math.min(axis2D.arrivalFrame.x, axis2D.arrivalFrame.x+axis2D.arrivalFrame.width);
    right = Math.max(axis2D.arrivalFrame.x, axis2D.arrivalFrame.x+axis2D.arrivalFrame.width);
    stepsLabel = stepsLabel==null?1:stepsLabel;
    for(i=0; i<n; i++){
      y = Math.floor(axis2D.projectY(y0 + i*dY))+0.5;
      this.line(left, y, right, y);
      if(xLabel!=null && i%stepsLabel===0) {
        this.fText(String(y0 + i*dY), left+xLabel, y);
      }
    }
  };

  //
  // Ported from Draw.js TODO - organize these appropriately.
  //


  /**
   * @todo write docs
   */
  Graphics.prototype.drawSmoothPolygon = function(polygon, closed, amount) { //TODO: add tx, ty
    amount = amount == null ? 30 : amount;
    var controlPoints;

    if(polygon.length < 2) return null;
    if(polygon.length == 2) {
      var a = Math.atan2(polygon[1].y - polygon[0].y, polygon[1].x - polygon[0].x) - 0.5 * Math.PI;
      var cosa = amount * Math.cos(a);
      var sina = amount * Math.sin(a);
      this.context.moveTo(polygon[0].x, polygon[0].y);
      this.context.bezierCurveTo(
        polygon[0].x + cosa, polygon[0].y + sina,
        polygon[1].x + cosa, polygon[1].y + sina,
        polygon[1].x, polygon[1].y
      );
      this.context.bezierCurveTo(
        polygon[1].x - cosa, polygon[1].y - sina,
        polygon[0].x - cosa, polygon[0].y - sina,
        polygon[0].x, polygon[0].y
      );
      return;
    }
    var i;
    var nPoints = polygon.length;
    var prevPoint = polygon[nPoints - 1];
    var point = polygon[0];
    var nextPoint = polygon[1];
    controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
    var prevCP = controlPoints[1];
    var cP;
    this.context.moveTo(point.x, point.y);
    prevPoint = point;
    var nSteps = nPoints + Number(closed);
    for(i = 1; i < nSteps; i++) {
      point = polygon[i % nPoints];
      nextPoint = polygon[(i + 1) % nPoints];
      controlPoints = GeometryOperators.getSoftenControlPoints(prevPoint, point, nextPoint, amount);
      cP = controlPoints[0];
      this.context.bezierCurveTo(prevCP.x, prevCP.y, cP.x, cP.y, point.x, point.y);
      prevCP = controlPoints[1];
      prevPoint = point;
    }
  };




  /**
   * Draws an ellipse using the current state of the canvas.
   * @param {CanvasRenderingContext2D} context
   * @param {Number} x The center x coordinate
   * @param {Number} y The center y coordinate
   * @param {Number} rW The horizontal radius of the ellipse
   * @param {Number} rH The vertical radius of the ellipse
   */
  Graphics.prototype.drawEllipse = function(x, y, rW, rH) {
    var k = 0.5522848, // 4 * ((√(2) - 1) / 3)
      ox = rW * k, // control point offset horizontal
      oy = rH * k, // control point offset vertical
      xe = x + rW, // x-end
      ye = y + rH; // y-end

    this.context.moveTo(x - rW, y);
    this.context.bezierCurveTo(x - rW, y - oy, x - ox, y - rH, x, y - rH);
    this.context.bezierCurveTo(x + ox, y - rH, xe, y - oy, xe, y);
    this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
    this.context.bezierCurveTo(x - ox, ye, x - rW, y + oy, x - rW, y);
    this.context.moveTo(x - rW, y);
  };

  /**
   * Draws a polygon
   * @param {CanvasRenderingContext2D} context
   * @param {Polygon} Polygon to draw
   * @param {Boolean} close polygon
   * @param {Number} tx horizontal translation
   * @param {Number} ty vertical translation
   */
  Graphics.prototype.drawPolygon = function(polygon, close, tx, ty) {
    tx = tx || 0;
    ty = ty || 0;
    var i;
    this.context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
    for(i = 1; polygon[i] != null; i++) {
      this.context.lineTo(tx + polygon[i].x, ty + polygon[i].y);
    }
    if(close) {
      this.context.lineTo(tx + polygon[0].x, ty + polygon[0].y);
    }
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.drawPolygonWithControlPoints = function(polygon, controlPoints, tx, ty) {
    tx = tx || 0;
    ty = ty || 0;
    var i;
    this.context.moveTo(tx + polygon[0].x, ty + polygon[0].y);
    for(i = 1; polygon[i] != null; i++) {
      this.context.bezierCurveTo(tx + controlPoints[(i - 1) * 2].x, ty + controlPoints[(i - 1) * 2].y,
        tx + controlPoints[i * 2 - 1].x, ty + controlPoints[i * 2 - 1].y,
        tx + polygon[i].x, ty + polygon[i].y);
    }
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.drawBezierPolygon = function(bezierPolygon, tx, ty) {
    tx = tx || 0;
    ty = ty || 0;
    var bI;
    var N = Math.floor((bezierPolygon.length - 1) / 3);
    var i;
    this.context.moveTo(tx + bezierPolygon[0].x, ty + bezierPolygon[0].y);
    for(i = 0; i < N; i++) {
      bI = i * 3 + 1;

      this.context.bezierCurveTo(
        tx + bezierPolygon[bI].x, ty + bezierPolygon[bI].y,
        tx + bezierPolygon[bI + 1].x, ty + bezierPolygon[bI + 1].y,
        tx + bezierPolygon[bI + 2].x, ty + bezierPolygon[bI + 2].y
      );
    }
  };

  /**
   * Draws a rounded rectangle using the current state of the canvas.
   * If you omit the last three params, it will draw a rectangle
   * outline with a 5 pixel border radius
   * @param {CanvasRenderingContext2D} context
   * @param {Number} x The top left x coordinate
   * @param {Number} y The top left y coordinate
   * @param {Number} width The width of the rectangle
   * @param {Number} height The height of the rectangle
   * @param {Number} radius The corner radius. Defaults to 5;
   */
  Graphics.prototype.drawRoundRect = function(x, y, width, height, radius) {
    radius = radius || 0;
    var bottom = y + height;
    this.context.moveTo(x + radius, y);
    this.context.lineTo(x + width - radius, y);
    this.context.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.context.lineTo(x + width, y + height - radius);
    this.context.quadraticCurveTo(x + width, bottom, x + width - radius, bottom);
    this.context.lineTo(x + radius, bottom);
    this.context.quadraticCurveTo(x, bottom, x, bottom - radius);
    this.context.lineTo(x, y + radius);
    this.context.quadraticCurveTo(x, y, x + radius, y);
  };

  /**
   * @todo write docs
   */
  Graphics.prototype.drawTriangleFromBase = function(x, y, base, height, angle) {
    this.context.moveTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
    this.context.lineTo(x + 0.5 * base * Math.cos(angle - Math.PI * 0.5), y + 0.5 * base * Math.sin(angle - Math.PI * 0.5));
    this.context.lineTo(x + height * Math.cos(angle), y + height * Math.sin(angle));
    this.context.lineTo(x + 0.5 * base * Math.cos(angle + Math.PI * 0.5), y + 0.5 * base * Math.sin(angle + Math.PI * 0.5));
  };


  /**
   * @todo write docs
   */
  Graphics.prototype.drawQuadrilater = function(p0, p1, p2, p3, close) {
    close = close == null ? true : close;
    this.context.moveTo(p0.x, p0.y);
    this.context.lineTo(p1.x, p1.y);
    this.context.lineTo(p2.x, p2.y);
    this.context.lineTo(p3.x, p3.y);
    if(close) this.context.lineTo(p0.x, p0.y);
  };

  /**
   * @classdesc Fast Html
   *
   * @namespace
   * @category misc
   */
  function FastHtml() {}
  /**
   * @todo write docs
   */
  FastHtml.expand = function(abreviatedHTML) {
    if(abreviatedHTML == null || abreviatedHTML === "") return "";

    var bit;

    if(abreviatedHTML.split("<").length != abreviatedHTML.split(">").length) return abreviatedHTML;

    var newText = abreviatedHTML;
    if(newText.indexOf("<fs")!=-1){
      bit = "";
      while(bit != null) {
        bit = StringOperators.getFirstTextBetweenStrings(newText, "<fs", ">"); //OperacionesString.textEntreSubStrings(newText, "<fs", ">");
        if(bit != null) newText = newText.replace("<fs" + bit + ">", "<font style=\"font-size:" + Number(bit) + "px\">");
        if(newText.indexOf(">") == -1) bit = null;
      }
    }

    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<ff", ">");
      if(bit != null) newText = newText.replace("<ff" + bit + ">", "<font face=\"" + bit + "\">");
    }

    newText = newText.replace(/¬/, "<br/>");
    newText = newText.replace(/<fcBlack>/g, "<font color=\"#000000\">");
    newText = newText.replace(/<fcWhite>/g, "<font color=\"#FFFFFF\">");
    newText = newText.replace(/<fcRed>/g, "<font color=\"#FF0000\">");
    newText = newText.replace(/<fcGreen>/g, "<font color=\"#00FF00\">");
    newText = newText.replace(/<fcBlue>/g, "<font color=\"#0000FF\">");
    newText = newText.replace(/<fcOrange>/g, "<font color=\"#FFAA00\">");

    newText = newText.replace(/<fcCyan>/g, "<font color=\"#00FFFF\">");
    newText = newText.replace(/<fcYellow>/g, "<font color=\"#FFFF00\">");
    newText = newText.replace(/<fcMagenta>/g, "<font color=\"#FF00FF\">");

    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<fcuint", ">");
      if(bit != null) newText = newText.replace("<fcuint" + bit + ">", "<font color=\"" + ColorOperators.uinttoHEX(bit) + "\">");
    }

    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<frgb", ">");
      if(bit != null) {
        var rgb = bit.split(".");
        newText = newText.replace("<frgb" + bit + ">", "<font color=\"" + ColorOperators.RGBtoHEX(Number(rgb[0]), Number(rgb[1]), Number(rgb[2])) + "\">");
      }
    }

    if(newText.indexOf("<fc")!=-1){
      bit = "";
      while(bit != null) {
        bit = StringOperators.getFirstTextBetweenStrings(newText, "<fc", ">");
        if(bit != null){
          //var newbit = bit[0];// == "#"?bit.substr(1):bit;
          newText = newText.replace("<fc" + bit + ">", "<font color=\"#" + bit + "\">");
        }
      }
    }

    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<tl", ">");
      if(bit != null) newText = newText.replace("<tl" + bit + ">", "<textformat leftmargin=\"" + bit + "\">");
    }

    bit = "";
    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<tv", ">");
      if(bit != null) newText = newText.replace("<tv" + bit + ">", "<textformat leading=\"" + bit + "\">");
    }


    bit = "";
    var href;
    var text;
    var target;


    while(bit != null) {
      bit = StringOperators.getFirstTextBetweenStrings(newText, "<e", ">");
      if(bit != null) {
        href = bit.split("*")[0];
        text = bit.split("*")[1];
        if(bit.split("*").length > 2 && bit.split("*")[2] == "s") {
          target = "_self";
        } else {
          target = "_blank";
        }
        if(href.substr(0, 7) == "http://" ||  href.substr(0, 8) == "https://") {
          newText = newText.replace("<e" + bit + ">", "<u><a href='" + href + "' target='" + target + "'>" + text + "</a></u>");
        } else {
          newText = newText.replace("<e" + bit + ">", "<u><a href='javascript:FastHtml.clickLink(\"" + href + "\")' FastHtml.onclick='event.preventDefault(); clickLink(\"" + href + "\"); return false; '>" + text + "</a></u>");
        }
      }
    }


    newText = newText.replace(/<pl>/g, "<p align=\"left\">");
    newText = newText.replace(/<pc>/g, "<p align=\"center\">");
    newText = newText.replace(/<pr>/g, "<p align=\"right\">");
    newText = newText.replace(/<pj>/g, "<p align=\"justify\">");
    newText = newText.replace(/<\/f>/g, "</font>");
    newText = newText.replace(/<\/t>/g, "</textformat>");

    // c.log("/////////FastHtml convertion////////");
    // c.log(newText);
    // c.log("////////////////////////////////////");

    return newText;
  };

  /**
   * @todo write docs
   */
  FastHtml.clickLink = function(param) {
    FastHtml.linkFunction.call(FastHtml.target, param);
  };

  /**
   * @todo write docs
   */
  FastHtml.findAndPlaceLinks = function(text) {
    var newText = FastHtml._findAndPlaceLinksPrefix(text, "http");
    return FastHtml._findAndPlaceLinksPrefix(newText, "https");
  };

  /**
   * @ignore
   */
  FastHtml._findAndPlaceLinksPrefix = function(text, prefix) {
    var regexp = prefix == 'http' ? /http:\/\//g : /https:\/\//g;
    var blocks = text.split(regexp);
    var blocks2;

    if(blocks.length > 1) {
      blocks2 = [];
      var indexS;
      var url;

      blocks2[0] = blocks[0];

      for(var i = 1; blocks[i] != null; i++) {
        indexS = blocks[i].search(/ |:|;/);
        if(indexS > -1) {
          url = prefix + '://' + blocks[i].substr(0, indexS);
          blocks2[i] = '<e' + url + '*' + url + '>' + blocks[i].substr(indexS);
        } else {
          url = prefix + '://' + blocks[i].substr(0);
          blocks2[i] = '<e' + url + '*' + url + '>';
        }
      }
    }
    return(blocks.length === 0 || blocks.length == 1) ? text : blocks2.join('');
  };

  /**
   * @todo write docs
   */
  FastHtml.findAndPlaceTwitterAdresses = function(text) {
    var blocks = text.split(/@/g);
    var blocks2;
    if(blocks.length > 1) {
      blocks2 = [];
      var indexS;
      var url;
      var accountName;

      blocks2[0] = blocks[0];

      for(var i = 1; blocks[i] != null; i++) {
        indexS = blocks[i].search(/ |:|;/);
        if(indexS > -1) {
          accountName = blocks[i].substr(0, indexS);
          url = 'https://twitter.com/' + accountName;
          blocks2[i] = '<e' + url + '*@' + accountName + '>' + blocks[i].substr(indexS);
        } else {
          accountName = blocks[i].substr(0);
          url = 'https://twitter.com/' + accountName;
          blocks2[i] = '<e' + url + '*@' + accountName + '>';
        }
      }
    }

    return(blocks.length === 0 || blocks.length == 1) ? text : blocks2.join('');
  };

  /**
   * @todo write docs
   */
  FastHtml.getColorTag = function(color) {
    color = ColorOperators.colorStringToHEX(color);
    return "<font color=\"" + color + "\">";
  };

  TextFieldHTML.prototype.constructor = TextFieldHTML;

  /**
   * @classdesc Instanciable class that manages and renders a text in an html div
   *
   * @param configuration configuration Object with parameters (x, y, width, text, fontColor, fontSize, fontName, fontStyle, linkFunction, target…)
   * @constructor
   * @category drawing
   */
  function TextFieldHTML(configuration) {
    configuration = configuration == null ? {} : configuration;

    this.x = configuration.x == null ? 300 : configuration.x;
    this.y = configuration.y == null ? 2 : configuration.y;
    this.width = configuration.width == null ? 200 : configuration.width;

    this.textColor = configuration.textColor == null ? 'black' : configuration.textColor;

    this.backgroundColor = configuration.backgroundColor;

    this.linkFunction = configuration.linkFunction;
    this.target = configuration.target;

    this.fastHTMLactive = configuration.fastHTMLactive == null ? true : configuration.fastHTMLactive;

    this.text = undefined;

    //////////

    this._prevX = undefined;
    this._prevY = undefined;
    this._prevWidth = undefined;
    this._prevHeight = undefined;

    this.zIndex = 33;

    this.main = document.getElementById('maindiv');
    this.div = document.createElement('div2');
    this.div.setAttribute('style', 'position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + ';');
    this.main.appendChild(this.div);

    this.setText(configuration.text == null ? '' : configuration.text);

    this.draw();

    if(this.target != null && this.linkFunction != null) {
      FastHtml.target = this.target;
      FastHtml.linkFunction = this.linkFunction;
    }
  }
  /**
   * @todo write docs
   */
  TextFieldHTML.prototype.draw = function() {
    //c.log('this.width, this._prevWidth', this.width, this._prevWidth);
    if(this.x != this._prevX || this.y != this._prevY || this.width != this._prevWidth || this.height != this._prevHeight) {
      this._prevX = this.x;
      this._prevY = this.y;
      this._prevWidth = this.width;
      this._prevHeight = this.height;
      //this.div.setAttribute('style', 'position:absolute;top:'+this.y+'px;left:'+this.x+'px;z-index:'+this.zIndex+'; width:'+this.width+'px;');//height:'+this.height+'px;');
      this.div.setAttribute('style', 'position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + '; width:' + this.width + 'px; height:' + this.height + 'px;');
    }
  };

  /**
   * @todo write docs
   */
  TextFieldHTML.prototype.setText = function(text) {
    if(this.text != text) {
      this.text = text;
      this.div.innerHTML = this.fastHTMLactive ? FastHtml.expand(text) : text;
    }
  };

  /**
   * @todo write docs
   */
  TextFieldHTML.prototype.getText = function() {
    return this.DOMtext.value;
  };

  //

  TextBox.prototype.constructor = TextBox;

  /**
   * @classdesc Instanciable class that manages and renders a text on the canvas.
   *
   * @description create new TextBox.
   * @param configuration configuration Object with parameters (x, y, width, text, fontColor, fontSize, fontName, fontStyle, warnFunction, target…)
   * @constructor
   * @category drawing
   */
  function TextBox(configuration, graphics) {

    configuration = configuration == null ? {} : configuration; // TODO is this supposed to be an undefined check?
    this.graphics = graphics;

    this.x = configuration.x == null ? 300 : configuration.x;
    this.y = configuration.y == null ? 2 : configuration.y;
    this.width = configuration.width == null ? 200 : configuration.width;

    this.text = configuration.text == null ? '' : configuration.text;

    this.fontColor = configuration.fontColor == null ? 'black' : configuration.fontColor;
    this.fontSize = configuration.fontSize == null ? '14' : configuration.fontSize;
    this.fontName = configuration.fontName == null ? 'arial' : configuration.fontName;

    this.warnFunction = configuration.warnFunction;
    this.target = configuration.target;

    this.lineHeight = configuration.lineHeight == null ? 14 : configuration.lineHeight;

    this.backgroundColor = configuration.backgroundColor;
    this.boxMargin = configuration.boxMargin == null ? 5 : configuration.boxMargin;

    this.lineWidth = configuration.lineWidth == null ? 1 : configuration.lineWidth;

    this.maxWidth = undefined;
    this.links = undefined;
    this.linksType = undefined;
    this.pointPairs = undefined;
    this.overLink = undefined;

    this.setText(this.text);

    this.graphics.on('mouseup', this.mouseUp, this);
  }
  /**
   * @todo write docs
   */
  TextBox.prototype.getMaxWidth = function() {
    return DrawTexts.getMaxTextWidth(this.lines);
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.update = function() {
    this.setText(this.text);
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.setText = function(text) {
    this.text = String(text);

    this.text = TextBox.replaceWikiLinks(this.text);

    var i;
    var j;
    var blocks = this.text.split('<e');
    var indexesPairs;
    if(blocks.length > 1) {
      var index0;
      var index0b;
      var index1;

      this.links = new StringList();
      this.linksType = new StringList();
      indexesPairs = new List();
      var lengthBefore;

      var link;
      var extra;
      var rest;

      for(i = 1; blocks[i] != null; i++) {
        index0 = blocks[i].indexOf("*");
        index1 = blocks[i].indexOf(">");
        index0b = blocks[i].indexOf("*", index0 + 1);
        if(index0 != -1 && index1 != -1 && index0 < index1) {
          link = blocks[i].substr(0, index0);
          //c.log("LINK:{"+link+"}");

          this.links.push(link);

          if(index0b != -1 && index0b < index1 && blocks[i].charAt(index0b + 1) != "b") {
            extra = blocks[i].charAt(index0b + 1);
            //c.log("EXTRA:{"+extra+"}");

            blocks[i] = blocks[i].substring(index0 + 1, index0b) + blocks[i].substr(index1 + 1);
            this.linksType.push('self');
          } else {
            text = blocks[i].substring(index0 + 1, index1);
            //c.log("TEXT:{"+text+"}");

            rest = blocks[i].substr(index1 + 1);
            //c.log("REST:{"+rest+"}");

            blocks[i] = text + rest;
            this.linksType.push('blank');
          }

          lengthBefore = blocks[i - 1].length;
          lengthBefore -= 1 * (blocks[i - 1].split('\\n').length - 1);
          for(j = 0; j < i - 1; j++) {
            lengthBefore += blocks[j].length;
            lengthBefore -= 1 * (blocks[j].split('\\n').length - 1);
          }

          indexesPairs.push(new Interval(lengthBefore, index1 - index0 - 1));
        }
      }

      this.text = blocks.join('');

    } else {
      this.links = null;
      this.pointPairs = null;
    }

    //DrawTexts.setContextTextProperties(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);

    this.graphics.setText(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);

    this.lines = DrawTexts.textWordWrapReturnLines(this.text, this.width, 0, this.lineHeight);
    this.height = this.lines.length * this.lineHeight;

    var lengthAccumulated;
    var line;
    if(this.links != null) {
      var interval;
      lengthAccumulated = 0;
      this.pointPairs = [];
      var w0;
      var w1;
      var y;
      for(i = 0; this.links[i] != null; i++) {
        interval = indexesPairs[i];
        lengthAccumulated = 0;
        for(j = 0; this.lines[j] != null; j++) {
          line = this.lines[j];
          if(interval.x >= lengthAccumulated && interval.x < lengthAccumulated + line.length) {
            w0 = this.graphics.context.measureText(line.substr(0, interval.x - lengthAccumulated)).width;
            w1 = this.graphics.context.measureText(line.substr(0, interval.x + interval.y - lengthAccumulated)).width;
            y = j * this.lineHeight + 0.5;

            this.pointPairs.push({
              "x0": w0,
              "x1": w1,
              "y": y
            });

            break;
          }
          lengthAccumulated += (line.length + 1);
        }
      }
    }

    lengthAccumulated = 0;
    for(j = 0; this.lines[j] != null; j++) {
      line = this.lines[j];
      lengthAccumulated += (line.length + 1);
    }

    // TODO is this supposed to be this.setText (also see below) or a diff setText
    //DrawTexts.setContextTextProperties(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);
    this.graphics.setText(this.fontColor, this.fontSize, this.fontName, null, null, this.fontStyle);

    this.maxWidth = 0;
    for(i = 0; this.lines[i] != null; i++) {
      this.maxWidth = Math.max(this.maxWidth, this.graphics.context.measureText(this.lines[i]).width);
    }
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.draw = function(scale) {
    scale = scale == null ? 1 : scale;

    if(this.backgroundColor != null) {
      this.graphics.context.fillStyle = this.backgroundColor;
      this.graphics.context.fillRect(this.x - this.boxMargin, this.y - this.boxMargin, this.width + 2 * this.boxMargin, this.height + 2 * this.boxMargin);
    }

    this.graphics.setText(this.fontColor, this.fontSize * scale, this.fontName, null, null, this.fontStyle);
    DrawTexts.fillTextRectangleWithTextLines(this.lines, this.x, this.y, 0, this.lineHeight * scale);

    var x0;
    var x1;
    var y0;
    var y1;

    this.overLink = null;

    if(this.pointPairs != null) {
      this.graphics.context.lineWidth = this.lineWidth;
      this.graphics.context.strokeStyle = this.fontColor;
      for(var i = 0; this.pointPairs[i] != null; i++) {
        x0 = this.pointPairs[i].x0 * scale + this.x;
        x1 = this.pointPairs[i].x1 * scale + this.x;
        y0 = this.pointPairs[i].y * scale + this.y;
        y1 = Math.floor(y0 + Number(this.fontSize * scale));
        this.line(x0, x1, y1 + 0.5);
        if(this.graphics.mY > y0 && this.graphics.mY < y1 && this.graphics.mX > x0 && this.graphics.mX < x1) {
          this.graphics.context.canvas.style.cursor = 'pointer';
          this.overLink = i;
        }
      }
    }
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.line = function(x0, x1, y) {
    this.graphics.context.beginPath();
    this.graphics.context.moveTo(x0, y);
    this.graphics.context.lineTo(x1, y);
    this.graphics.context.stroke();
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.mouseUp = function() {
    if(this.overLink != null) {
      var link = this.links[this.overLink];
      var linkType = this.linksType[this.overLink];
      if(link.substr(0, 7) == 'http://' || link.substr(0, 8) == 'https://' || link.substr(0, 4) == 'www.') {
        if(linkType === "blank") {
          window.open(link);
        } else {
          window.open(link, "_self");
        }
      } else {
        this.warnFunction.call(this.target, link);
      }
      this.overLink = null;
    }
  };

  /**
   * @todo write docs
   */
  TextBox.prototype.deactivate = function() {
    this.graphics.off('mouseup', this.mouseUp, this);
  };

  /**
   * @todo write docs
   */
  TextBox.replaceWikiLinks = function(text) {
    var indexOpen = text.indexOf("[");
    var indexClose;
    var textInsideBrackets;
    var parts;
    var externalLink;
    while(indexOpen != -1) {
      indexClose = text.indexOf("]", indexOpen + 1);
      if(indexClose == -1) {
        indexOpen = -1;
      } else {
        textInsideBrackets = text.substring(indexOpen + 1, indexClose);
        console.log('text inside brackets: {' + textInsideBrackets + '}');
        if(textInsideBrackets.indexOf("[") == -1 && textInsideBrackets.indexOf("]") == -1) {
          if(textInsideBrackets.indexOf(" ") != -1) {
            parts = textInsideBrackets.split(" ");
            //c.log('parts[0]: {'+parts[0]+'}');
            //c.log('StringOperators.validateUrl(parts[0]):', StringOperators.validateUrl(parts[0]));
            //c.log('StringOperators.validateUrl(parts[0]):', StringOperators.validateUrl(parts[0]));
            if(StringOperators.validateUrl(parts[0])) {
              //c.log('parts.slice(1).join: {'+parts.slice(1).join(" ")+'}');
              text = text.substr(0, indexOpen) + "<e" + parts[0] + "*" + parts.slice(1).join(" ") + ">" + text.substr(indexClose + 1);
              //c.log('text changed:', text);
              externalLink = true;
            }
          }

          if(!externalLink) {
            text = text.substr(0, indexOpen) + "<e" + textInsideBrackets + "*" + textInsideBrackets + ">" + text.substr(indexClose + 1);
          }

        }
        indexOpen = text.indexOf("[", indexClose);
      }
    }
    //c.log('new text:', text);
    return text;
  };

  InputTextFieldHTML.prototype.constructor = InputTextFieldHTML;


  /**
   * @classdesc Instanciable class that manages and renders a text in a html text area.
   *
   * @param configuration configuration Object with parameters (x, y, width, height, text, fontColor, fontSize, fontName, fontStyle, linkFunction, target…)
   * @constructor
   * @category drawing
   */
  function InputTextFieldHTML(configuration, graphics) {
    this.id = configuration.id == null ? 0 : configuration.id;
    this.graphics = graphics;

    this.target = configuration.target;

    this.x = configuration.x == null ? 0 : configuration.x;
    this.y = configuration.y == null ? 0 : configuration.y;
    this.width = configuration.width == null ? 200 : configuration.width;
    this.height = configuration.height == null ? 20 : configuration.height;
    this.fontSize = configuration.fontSize == null ? 16 : configuration.fontSize;

    this.enterFunction = configuration.enterFunction;
    this.changeFunction = configuration.changeFunction;
    this.focusFunction = configuration.focusFunction;
    this.blurFunction = configuration.blurFunction;

    this.text = configuration.text;

    this.textarea = configuration.textarea == null ? true : configuration.textarea;
    this.readOnly = configuration.readOnly == null ? false : configuration.readOnly;
    this.border = configuration.border == null ? true : configuration.border;
    this.password = configuration.password;

    this.zIndex = 30;

    this.textColor = configuration.textColor == null ? 'black' : configuration.textColor;
    this.backgroundColor = '#FFFFFF';

    this.main = graphics.container;// document.getElementById('maindiv');
    this.div = document.createElement('div2');
    if(this.textarea) {
      this.DOMtext = document.createElement("textarea");
    } else {
      this.DOMtext = document.createElement("input");
    }
    if(this.password) {
      this.DOMtext.setAttribute('type', 'password');
    } else {
      this.DOMtext.setAttribute('type', 'text');
    }
    this.div.setAttribute('style', 'position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + ';');

    if(!this.border) this.DOMtext.setAttribute('style', 'border:none');

    this.div.setAttribute('rows', '1');
    this.main.appendChild(this.div);
    this.div.appendChild(this.DOMtext);
    this.DOMtext.parent = this;
    this.added = true;

    this.DOMtext.readOnly = this.readOnly;

    this.DOMtext.onfocus = function() {
      //e.target = this.parent;
      this.parent._onFocus(this.parent);
    };
    this.DOMtext.onblur = function() {
      //e.target = this.parent;
      this.parent._onBlur(this.parent);
    };

    this.DOMtext.value = "";

    //this.graphics.on("keydown", this.onKeyDown, this);
    this.div.addEventListener("keydown", this.onKeyDown, this);

    this.focus = false;

    if(this.changeFunction != null) this.setChangeFunction(this.changeFunction, this.target);
    if(this.enterFunction != null) this.setEnterFunction(this.enterFunction, this.target);
    if(this.focusFunction != null) this.setFocusFunction(this.focusFunction, this.target);
    if(this.blurFunction != null) this.setBlurFunction(this.blurFunction, this.target);

    if(this.text != null) {
      this.setText(this.text);
    } else {
      this.draw();
    }

    // TODO What is this supposed to do?
    this.DOMtext.addEventListener("mousemove", this.graphics._onMouse, false);
    // TODO find out what this was for onMoveCycle doesn't exist anymore
    //if(this.graphics._cycleOnMouseMovement) this.DOMtext.addEventListener('mousemove', onMoveCycle, false);
  }
  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setBorder = function(value) {
    this.border = value;
    this.DOMtext.setAttribute('style', 'border:0; color: ' + this.textColor + '; width:' + (this.width - 7) + 'px;height:' + (this.height - 7) + 'px; font-size:' + this.fontSize + 'px; border:' + (value ? 'yes' : 'none'));
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.draw = function() {
    if(this.x != this._prevX || this.y != this._prevY || this.width != this._prevWidth || this.height != this._prevHeight || this.text != this._prevText) {
      this._prevX = this.x;
      this._prevY = this.y;
      this._prevWidth = this.width;
      this._prevHeight = this.height;
      this._prevText = this.text;

      // this.DOMtext.style = "none";
      this.DOMtext.style.padding = "0px";
      this.DOMtext.style.border = "0px";
      this.DOMtext.style.borderColor = "#FFFFFF";
      this.DOMtext.style.background = "transparent";
      this.DOMtext.style.resize = "none";

      this.DOMtext.setAttribute('style', 'border: 0; color: ' + this.textColor + '; width:' + (this.width - 7) + 'px;height:' + (this.height - 7) + 'px; font-size:' + this.fontSize + 'px');
      this.div.setAttribute('style', 'border: 0; position:absolute;top:' + this.y + 'px;left:' + this.x + 'px;z-index:' + this.zIndex + ';');
    }
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setText = function(text, activeChange) {
    activeChange = activeChange == null ? true : activeChange;
    this.text = text;
    this.DOMtext.value = text;

    //var timer = setTimeout(this.onKeyDownDelayed, 4, this);
    this.draw();
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.getText = function() {
    return this.DOMtext.value;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.getSelectionStart = function() {
    return this.DOMtext.selectionStart;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.onKeyDown = function(e) {
    var target = e.srcElement.parent;

    target._eKeyDown = e;
    target._keyCode = e.keyCode;

    target.timer = setTimeout(target.onKeyDownDelayed, 4, target);
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.onKeyDownDelayed = function(target) {
    if(target._keyCode == 13 && target.DOMtext == document.activeElement) {
      if(target.enterFunction != null) {
        target.enterFunction.call(target.enterFunctionTarget, target.id);
      }
    }

    if(target.text != target.DOMtext.value) {

      target.text = target.DOMtext.value;
      //var lastChar = target.text.charAt(target.text.length - 1);

      if(target._keyCode != 13) {
        if(target.changeFunction != null) {
          target.changeFunction.call(target.changeFunctionTarget, target.id);
        }
      }
    }

    this.timer = null;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.forceFocus = function() {
    this.DOMtext.focus();
    this.focus = true;
  };

  /**
   * @todo write docs
   */
  // InputTextFieldHTML.prototype.forceUnfocus = function() {
  //   a.push(0); // TODO where does this come from
  // };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.forceBlur = function() {

    this.DOMtext.blur();
    this.focus = false;
  };


  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setEnterFunction = function(enterFunction, target) {
    this.enterFunction = enterFunction;
    this.enterFunctionTarget = target;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setChangeFunction = function(changeFunction, target) {
    this.changeFunction = changeFunction;
    this.changeFunctionTarget = target;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setFocusFunction = function(focusFunction, target) {
    this.focusFunction = focusFunction;
    this.focusFunctionTarget = target;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setBlurFunction = function(blurFunction, target) {
    this.blurFunction = blurFunction;
    this.blurFunctionTarget = target;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setSelection = function(start, end) {
    start = start == null ? 0 : start;
    end = end == null ? this.DOMtext.value.length : end;
    this.DOMtext.selectionStart = start;
    this.DOMtext.selectionEnd = end;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.placeCursor = function(nChar) {
    this.setSelection(nChar);
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.setScrollPosition = function(y) {
    if(y <= 1) y = Math.floor(y * this.DOMtext.scrollHeight);
    this.DOMtext.scrollTop = y;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.getScrollPosition = function() {
    return this.DOMtext.scrollTop;
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.getTextHeight = function() {
    return this.DOMtext.scrollHeight;
  };

  /**
   * @ignore
   */
  InputTextFieldHTML.prototype._onFocus = function(target) {
    target.focus = true;
    if(target.focusFunction != null) target.focusFunction.call(target.focusFunctionTarget, target.id);
  };

  /**
   * @ignore
   */
  InputTextFieldHTML.prototype._onBlur = function(target) {
    target.focus = false;
    if(target.blurFunction != null) target.blurFunction.call(target.blurFunctionTarget, target.id);
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.remove = function() {
    if(this.added) {
      this.div.removeChild(this.DOMtext);
      this.main.removeChild(this.div);
      this.added = false;
    }
  };

  /**
   * @todo write docs
   */
  InputTextFieldHTML.prototype.readd = function() {

    if(!this.added) {
      this.main.appendChild(this.div);
      this.div.appendChild(this.DOMtext);
      this.added = true;
    }
  };

  DragDetection.prototype.constructor = DragDetection;

  /**
   * DragDetection -
   * @param {Object} configuration
   * @param {Number} configuration.mode Mode the DragDetection tool should work under.
   * Possible options:
   * <ul>
   * <li><strong>0</strong>: frame to frame dragging vector (draggingInstance.dragVector register the vectorial change each frame).</li>
   * <li><strong>1</strong>: from click point dragging (draggingInstance.dragVector register the vectorial change from the clicking point).</li>
   * <li><strong>2</strong>: polar (draggingInstance.dragVector.x is dR, draggingInstance.dragVector.y is dA, according to the center).</li>
   * </ul>
   * @param {Object} configuration.target
   * @param {Function} configuration.listenerFunction Callback function executed each time drag is detected.
   * @param {Function} configuration.areaVerificationFunction
   * @param {Number} configuration.factor
   * @constructor
   * @category drawing
   */
  function DragDetection(configuration, graphics) { //mode, listenerFunction, target, areaVerificationFunction){
    this.mode = configuration.mode || 0;
    this.listenerFunction = configuration.listenerFunction;
    this.target = configuration.target;
    this.areaVerificationFunction = configuration.areaVerificationFunction;
    this.graphics = graphics;

    this.factor = configuration.factor == null ? 1 : configuration.factor;
    this.center = new _Point(0, 0);

    this.graphics.on("mousedown", this.onMouse, this);
    this.graphics.on("mouseup", this.onMouse, this);

    this.dragging = false;
    this.mouseClickPosition = new _Point();
    this.mousePosition = new _Point();
    this.r = 0;
    this.a = 0;

    this.idInterval = null;

    this.dragVector = new _Point();
  }
  /**
  * @todo write docs
  */
  DragDetection.prototype.enterframe = function(draggingInstance) {

    switch(draggingInstance.mode) {
      case 0:
        draggingInstance.dragVector.x = (this.graphics.mX - draggingInstance.mousePosition.x) * draggingInstance.factor;
        draggingInstance.dragVector.y = (this.graphics.mY - draggingInstance.mousePosition.y) * draggingInstance.factor;
        draggingInstance.mousePosition.x = this.graphics.mX;
        draggingInstance.mousePosition.y = this.graphics.mY;
        break;
      case 1:
        draggingInstance.dragVector.x = this.graphics.mX - draggingInstance.mouseClickPosition.x;
        draggingInstance.dragVector.y = this.graphics.mY - draggingInstance.mouseClickPosition.y;
        break;
      case 2:
        var dX = this.graphics.mX - draggingInstance.center.x;
        var dY = this.graphics.mY - draggingInstance.center.y;
        var r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        var a = Math.atan2(dY, dX);
        draggingInstance.dragVector.x = r - draggingInstance.r;
        draggingInstance.dragVector.y = a - draggingInstance.a;
        draggingInstance.r = r;
        draggingInstance.a = a;
        break;
    }
    //c.log(draggingInstance, draggingInstance.target, draggingInstance.dragVector);
    draggingInstance.listenerFunction.call(draggingInstance.target, draggingInstance.dragVector);

  };

  /**
  * @todo write docs
  */
  DragDetection.prototype.onMouse = function(event) {
    switch(event.type) {
      case 'mousedown':
        if(this.areaVerificationFunction != null && !this.areaVerificationFunction.call(this.target))
        {
          return;
        }

        this.dragging = true;

        this.mouseClickPosition.x = this.graphics.mX;
        this.mouseClickPosition.y = this.graphics.mY;
        this.mousePosition.x = this.graphics.mX;
        this.mousePosition.y = this.graphics.mY;

        var dX = this.graphics.mX - this.center.x;
        var dY = this.graphics.mY - this.center.y;
        this.r = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
        this.a = Math.atan2(dY, dX);

        this.dragVector.x = 0;
        this.dragVector.y = 0;

        if(this.idInterval != null) {
          clearInterval(this.idInterval);
        }
        this.idInterval = setInterval(this.enterframe.bind(this), 30, this); //[!] this won't work on IE, it´s better to create a new Listener for setInterval
        break;
      case 'mouseup':
        this.simulateMouseUp();
        break;
    }
  };

  /**
  * @todo write docs
  */
  DragDetection.prototype.simulateMouseUp = function() {
    this.dragging = false;
    clearInterval(this.idInterval);
    this.idInterval = null;
  };

  MultiLoader.prototype = {};
  MultiLoader.prototype.constructor = MultiLoader;

  //include(frameworksRoot+"Tools/loaders/Loader.js");

  /**
   * MultiLoader
   * @constructor
   * @category misc
   */
  function MultiLoader() {
    this.urlList = null;
    this.onComplete = null;
    this.iLoaded = 0;
    this.target = null;
    this.loading = false;

    this.indexLoading = undefined;

    ////datas
    this.datasLoaded = null;

    ////images
    this.imagesLoaded = null;

    this.priorityWeights = undefined;
    this.associativeArray = [];

    this.url_to_image = {};

    this.simulateDelay = false;
    this.DELAY_MILLISECONDS = 1000;
    this.timer = undefined;
  }
  MultiLoader.prototype.loadDatas = function(urlList, onComplete, callee) {

    this.urlList = urlList;
    this.target = callee ? callee : arguments.callee;
    this.onComplete = onComplete;

    this.datasLoaded = new List();
    this.nextDataLoading();
  };

  MultiLoader.prototype.nextDataLoading = function() {
    //c.log("MultiLoader.prototype.nextDataLoading | this.iLoaded, this.urlList[this.iLoaded]:", this.iLoaded, this.urlList[this.iLoaded]);
    if(this.iLoaded < this.urlList.length) {
      this.indexLoading = this.iLoaded;
      Loader.loadData(this.urlList[this.indexLoading], this.onCompleteLoadData, this);
      this.loading = true;
    } else {
      this.loading = false;
    }
  };

  MultiLoader.prototype.onCompleteLoadData = function(e) {
    if(this.priorityWeights != null) {
      this.datasLoaded[this.urlList.indexOf(e.url)] = e.result;
    } else {
      this.datasLoaded.push(e.result);
    }
    this.associativeArray[this.indexLoading] = e.result;
    //this.associativeArray[e.url] = e.result;
    var multiE = new LoadEvent();
    multiE.errorType = e.errorType;
    multiE.result = this.datasLoaded;
    multiE.url = e.url;

    if(this.iLoaded + 1 >= this.urlList.length) this.loading = false;

    this.onComplete.call(this.target, multiE);


    this.iLoaded++;
    //c.log('---> this.iLoaded, e.url', this.iLoaded, e.url);
    this.nextDataLoading();
  };


  /////images



  MultiLoader.prototype.loadImages = function(urlList, onComplete, target, priorityWeights) {

    this.urlList = urlList;
    this.target = target ? target : arguments.callee;
    this.onComplete = onComplete;
    this.priorityWeights = priorityWeights;

    this.imagesLoaded = new List();

    this.nextImageLoading();
  };


  MultiLoader.prototype.onCompleteLoadImage = function(e) {
    //c.log("onCompleteLoadImage, e.url, e.result", e.url, e.result);
    if(e.errorType == 1) {
      if(this.priorityWeights != null) {
        //this.imagesLoaded[this.urlList.indexOf(e.url)] = null;
        this.imagesLoaded[this.indexLoading] = null;
      } else {
        this.imagesLoaded.push(null);
      }
      //this.associativeArray[e.url] = -1;
      this.associativeArray[this.indexLoading] = -1;
    } else {
      if(this.priorityWeights != null) {
        //this.imagesLoaded[this.urlList.indexOf(e.url)] = e.result;
        this.imagesLoaded[this.indexLoading] = e.result;
      } else {
        this.imagesLoaded.push(e.result);
      }
      //this.associativeArray[e.url] = e.result;
      this.associativeArray[this.indexLoading] = e.url;
      this.url_to_image[e.url] = e.result;
    }

    var multiE = new LoadEvent();
    multiE.result = this.imagesLoaded;
    multiE.url = e.url;
    multiE.lastImage = e.result;
    multiE.indexImage = this.indexLoading;
    if(this.onComplete != null) this.onComplete.call(this.target, multiE);

    this.loading = false;

    this.iLoaded++;
    this.nextImageLoading();
  };

  MultiLoader.prototype.getImageFromUrl = function(url) {
    return this.url_to_image[url];
  };

  MultiLoader.prototype.setPriorityWeights = function(weights) {
    this.priorityWeights = weights;
    //c.log("this.priorityWeights", this.priorityWeights);
    if(!this.loading) {
      this.nextImageLoading();
    }
  };

  MultiLoader.prototype.nextImageLoading = function(target) {
    //c.log('nextImageLoading', this.iLoaded, "/", this.urlList.length);

    if(this.simulateDelay || target != null) {
      if(target == null) {
        this.loading = true;
        this.timer = setTimeout(this.nextImageLoading, this.DELAY_MILLISECONDS, this);
        return;
      } else {
        target.loading = false;
        target.simulateDelay = false;
        target.nextImageLoading();
        target.simulateDelay = true;
        return;
      }
    }

    if(this.iLoaded < this.urlList.length) {
      if(this.priorityWeights != null) {
        var iMax;
        var max = -99999999;
        var i;

        for(i = 0; this.urlList[i] != null; i++) {
          //if(this.priorityWeights[i]>max && this.associativeArray[this.urlList[i]]==null){
          if(this.priorityWeights[i] > max && this.associativeArray[i] == null) {
            max = this.priorityWeights[i];
            iMax = i;
          }
        }

        //c.log('max:', max);

        if(max > 0) {
          //c.log("MultiLoader | nextImageLoading:", this.urlList[this.iLoaded]);

          this.indexLoading = iMax;

          Loader.loadImage(this.urlList[this.indexLoading], this.onCompleteLoadImage, this);
          //Loader.loadImage(this.urlList[this.iLoaded], this.onCompleteLoadImage, this);

          this.loading = true;
        } else {
          //c.log("MultiLoader stopped due to max wieght <= 0");
        }

      } else {
        this.indexLoading = this.iLoaded;
        //c.log("MultiLoader | nextImageLoading:", this.urlList[this.iLoaded]);
        Loader.loadImage(this.urlList[this.indexLoading], this.onCompleteLoadImage, this);
        this.loading = true;
      }
    } else {
      this.loading = false;
    }
  };

  MultiLoader.prototype.destroy = function() {
    delete this.datasLoaded;
    delete this.imagesLoaded;
  };

  function Navigator() {}
  var userAgent;
  var userAgentVersion;
  Navigator.IE = "IE";
  Navigator.NS = "NS";
  Navigator.IOS = "IOS";

  function detectUserAgent() {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
      userAgent='IE';
      userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
      if(userAgentVersion<9) return null;
    } else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
      userAgent='FIREFOX';
      userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
    } else if (navigator.userAgent.match(/Chrome/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
      userAgent='CHROME';
      userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
    } else if (/Mozilla[\/\s](\d+\.\d+)/.test(navigator.userAgent) || navigator.userAgent.match(/Mozilla/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
      userAgent='MOZILLA';
      userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
    } else if (navigator.userAgent.match(/Safari/) != null){ //test for MSIE x.x;
      userAgent='Safari';
      userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
    } else if(navigator.userAgent.match(/iPad/i) != null){
      userAgent='IOS';
    } else if(navigator.userAgent.match(/iPhone/i) != null){
      userAgent='IOS';
    }
  }

  Navigator.getUserAgent = function() {
    detectUserAgent();
    return userAgent;
  };
  Navigator.getUserAgentVersion = function() {
    detectUserAgent();
    return userAgentVersion;
  };

  /**
   * @classdesc StringUtils
   *
   * @namespace
   * @category strings
   */
  function StringUtils() {}
  /**
   * @todo write docs
   */
  StringUtils.stringtoXML = function(text) {
    var doc;
    if(window.ActiveXObject) {
      doc = new window.ActiveXObject('Microsoft.XMLDOM');
      doc.async = 'false';
      doc.loadXML(text);
    } else {
      var parser = new DOMParser();
      doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
  };

  /**
   *
   * @ignore
   *
   * @classdesc Provides a set of tools that work with JSON.
   *
   * @namespace
   * @category misc
   */
  function JSONUtils() {}
  JSONUtils.stringifyAndPrint = function(object) {
    var jsonString = JSON.stringify(object);
    console.log("__________________________________________________________________________________________________________________________________________________________");
    console.log(jsonString);
    console.log("__________________________________________________________________________________________________________________________________________________________");
  };

  /*
   * This function is not used in the framework.
   * It's used only for GIT / Jenkins tests
   */

   /**
    * @ignore
    */
  JSONUtils.dummy2 = function() {
    return null;
  };

  /**
   * @ignore
   *
   * @classdesc Functions to create interesting console output.
   *
   * @namespace
   * @category misc
   */
  function ConsoleTools() {}
  ConsoleTools._ticTime = undefined;
  ConsoleTools._tacTime = undefined;

  /**
   * @ignore
   */
  ConsoleTools.NumberTableOnConsole = function(table) {
    var message = "";
    var line;
    var number;
    var i;
    var j;

    for(j = 0; j < table[0].length; j++) {
      line = "|";
      for(i = 0; table[i] != null; i++) {
        number = String(Math.floor(100 * table[i][j]) / 100).replace(/0./, ".");
        while(number.length < 3) number = " " + number;
        line += number + "|";
      }
      message += line + "\n";
    }

    console.log(message);

    return message;
  };


  /**
   * @ignore
   */
  ConsoleTools.tic = function(message) {
    message = message || "";

    ConsoleTools._ticTime = ConsoleTools._tacTime = new Date().getTime();
    ConsoleTools._nTacs = 0;
    console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°° tic °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°° [' + message + ']');
  };

  /**
   * @ignore
   */
  ConsoleTools.tac = function(message) {
    message = message || "";

    var lastTac = ConsoleTools._tacTime;
    ConsoleTools._tacTime = new Date().getTime();
    console.log('°°°°°°° tac [' + message + '], t from tic:' + (ConsoleTools._tacTime - ConsoleTools._ticTime) + ', t from last tac:' + ((ConsoleTools._tacTime - lastTac)));
  };

  /**
   * @classdesc Force layout
   *
   * @constructor
   * @category networks
   */
  function Forces(configuration) {
    this.k = configuration.k ? configuration.k : 0.01;
    this.dEqSprings = configuration.dEqSprings ? configuration.dEqSprings : 100;
    this.dEqRepulsors = configuration.dEqRepulsors ? configuration.dEqRepulsors : 500;
    this.friction = configuration.friction ? configuration.friction : 0.8;

    this.nodeList = new NodeList();

    this.forcesList = new List();
    this.equilibriumDistances = new NumberList();
    this.forcesTypeList = new List();
    this.fromNodeList = new NodeList();
    this.toNodeList = new NodeList();

    this._i0 = 0;
  }
  /**
   * eqDistancesMode:
   * 		0: all distances this.dEqSprings
   * 		1: shorter distances for heavy relations
   * 		2: nodes degrees sum proportional to distance
   */
  Forces.prototype.forcesForNetwork = function(network, initRadius, initCenter, eqDistancesMode, addShortRepulsorsOnRelated) {
    initRadius = initRadius || 0;
    initCenter = initCenter || new _Point(0, 0);
    eqDistancesMode = eqDistancesMode == null ? 0 : eqDistancesMode;
    addShortRepulsorsOnRelated = addShortRepulsorsOnRelated == null ? false : addShortRepulsorsOnRelated;


    this.forcesList = new List();
    this.equilibriumDistances = new NumberList();
    this.forcesTypeList = new List();
    this.fromNodeList = new NodeList();
    this.toNodeList = new NodeList();

    var node0;
    var node1;
    var nNodes = network.nodeList.length;
    var i;
    var j;
    var relations = network.relationList;
    var angle;

    for(i = 0; i < nNodes; i++) {
      if(initRadius === 0) {
        this.addNode(network.nodeList[i], new _Point(network.nodeList[i].x, network.nodeList[i].y));
      } else {
        angle = Math.random() * TwoPi;
        this.addNode(network.nodeList[i], new _Point(initCenter.x + initRadius * Math.cos(angle), initCenter.y + initRadius * Math.sin(angle)));
      }
    }

    for(i = 0; i < nNodes - 1; i++) {
      node0 = network.nodeList[i];
      for(j = i + 1; j < nNodes; j++) {
        node1 = network.nodeList[j];
        if(relations.nodesAreConnected(node0, node1)) {
          switch(eqDistancesMode) {
            case 0:
              this.equilibriumDistances.push(this.dEqSprings);
              break;
            case 1:
              this.equilibriumDistances.push((1.1 - relations.getFirstRelationByIds(node0.id, node1.id, false).weight) * this.dEqSprings);
              break;
            case 2:
              this.equilibriumDistances.push(Math.sqrt(Math.min(node0.nodeList.length, node1.nodeList.length)) * this.dEqSprings * 0.1);
              break;
          }

          this.addForce(node0, node1, "Spring");

          if(addShortRepulsorsOnRelated) {
            this.equilibriumDistances.push(this.dEqRepulsors * 0.5);
            this.addForce(node0, node1, "Repulsor");
          }

        } else {
          this.equilibriumDistances.push(this.dEqRepulsors);
          this.addForce(node0, node1, "Repulsor");
        }
      }
    }
  };

  /**
   * @todo write docs
   */
  Forces.prototype.addNode = function(node, initPosition, initSpeed) {
    initPosition = initPosition == null ? new _Point(Math.random() * 200 - 100, Math.random() * 200 - 100) : initPosition;
    initSpeed = initSpeed == null ? new _Point(0, 0) : initSpeed;
    this.nodeList.addNode(node);
    node.x = initPosition.x;
    node.y = initPosition.y;
    node.vx = initSpeed.x;
    node.vy = initSpeed.y;
    node.ax = 0;
    node.ay = 0;
  };

  /**
   * @todo write docs
   */
  Forces.prototype.addForce = function(node0, node1, type, equilibriumDistance) {
    this.fromNodeList.addNode(node0);
    this.toNodeList.addNode(node1);
    this.forcesList.push(node0.id + "*" + node1.id + "*" + type);
    this.forcesTypeList.push(type);
    if(equilibriumDistance != null) this.equilibriumDistances.push(equilibriumDistance);
  };

  /**
   * @todo write docs
   */
  Forces.prototype.calculate = function() {
    var i;
    var node0, node1;
    var type;
    var force;
    var dx, dy, d;
    var eqDistance;

    // 1. reset accelerations
    this._resetAccelerations(); //TODO: this can be removed if accelerations are resetd in applyForces [!]

    // 2. calculate new accelerations from forces
    for(i = 0; this.forcesList[i] != null; i++) {
      node0 = this.fromNodeList[i];
      node1 = this.toNodeList[i];
      type = this.forcesTypeList[i];
      dx = node1.x - node0.x;
      dy = node1.y - node0.y;
      d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      eqDistance = this.equilibriumDistances[i];
      if(type == 'Repulsor' && d > eqDistance) continue;
      if(type == 'Attractor' && d < eqDistance) continue;

      switch(type) {
        case "Spring":
        case "Repulsor":
        case "Attractor":
          force = this.k * (d - eqDistance) / d;
          node0.ax += force * dx;
          node0.ay += force * dy;
          node1.ax -= force * dx;
          node1.ay -= force * dy;
          break;
        case "DirectedSpring":
          force = this.k * (d - eqDistance) / d;
          node1.ax -= force * dx;
          node1.ay -= force * dy;
          break;
        case "DirectedRepulsor":
          if(d < eqDistance) {
            force = this.k * (d - eqDistance) / d;
            node1.ax -= force * dx;
            node1.ay -= force * dy;
          }
          break;
      }
    }
  };

  /**
   * @todo write docs
   */
  Forces.prototype.attractionToPoint = function(point, strength, limit) {
    strength = strength == null ? 1 : strength;
    var node;
    var force;
    var dx;
    var dy;
    var d2;
    for(var i = 0; this.nodeList[i] != null; i++) {
      node = this.nodeList[i];
      dx = point.x - node.x;
      dy = point.y - node.y;
      d2 = Math.pow(dx, 2) + Math.pow(dy, 2);
      if(limit != null) {
        force = Math.min(strength / d2, limit);
      } else {
        force = strength / d2;
      }
      node.ax += force * dx;
      node.ay += force * dy;
    }
  };


  /**
   * @todo write docs
   */
  Forces.prototype.avoidOverlapping = function(delta) {
    delta = delta || 0;

    var i;
    var node0;
    var node1;
    var x0l, y0t, x0r, y0b, x1l, y1t, x1r, y1b;
    var vx;
    var vy;
    var dM = delta * 0.5;
    var l = this.nodeList.length;

    console.log(this.nodeList.length);

    for(i = 0; this.nodeList[i + 1] != null; i++) {
      node0 = this.nodeList[(i + this._i0) % l];
      x0l = node0.x - node0.width * 0.5 - dM;
      x0r = node0.x + node0.width * 0.5 + dM;
      y0t = node0.y - node0.height * 0.5 - dM;
      y0b = node0.y + node0.height * 0.5 + dM;
      for(var j = i + 1; this.nodeList[j] != null; j++) {
        node1 = this.nodeList[(j + this._i0 + i) % l];
        x1l = node1.x - node1.width * 0.5 - dM;
        x1r = node1.x + node1.width * 0.5 + dM;
        y1t = node1.y - node1.height * 0.5 - dM;
        y1b = node1.y + node1.height * 0.5 + dM;
        if(((x0l > x1l && x0l < x1r) ||  (x0r > x1l && x0r < x1r)) && ((y0t > y1t && y0t < y1b) || (y0b > y1t && y0b < y1b))) {
          vx = node1.x - node0.x;
          vy = node1.y - node0.y;

          if(Math.abs(vx) > Math.abs(vy)) {
            if(vx > 0) {
              node0.x -= (x0r - x1l) * 0.5;
              node1.x += (x0r - x1l) * 0.5;
            } else {
              node0.x += (x1r - x0l) * 0.5;
              node1.x -= (x1r - x0l) * 0.5;
            }
          } else {
            if(vy > 0) {
              node0.y -= (y0b - y1t) * 0.5;
              node1.y += (y0b - y1t) * 0.5;
            } else {
              node0.y += (y1b - y0t) * 0.5;
              node1.y -= (y1b - y0t) * 0.5;
            }
          }

          //setStroke(Math.abs(vx)>Math.abs(vy)?'blue':'red');
          //sCircle((node0.x+node1.x)*0.5, (node0.y+node1.y)*0.5, Math.max(Math.abs(vx), Math.abs(vy))*0.5);
        }
      }
    }
    this._i0++;
  };

  /**
   * @todo write docs
   */
  Forces.prototype.avoidOverlappingRadial = function(delta, K) {
    delta = delta || 0;
    K = K || 1;
    var i;
    var node0;
    var node1;
    var l = this.nodeList.length;
    var vx;
    var vy;
    var d;
    var dMin;
    var k;
    var delta2 = delta * 2;

    for(i = 0; this.nodeList[i + 1] != null; i++) {
      node0 = this.nodeList[(i + this._i0) % l];
      for(var j = i + 1; this.nodeList[j] != null; j++) {
        node1 = this.nodeList[(j + this._i0 + i) % l];
        vx = node1.x - node0.x;
        vy = node1.y - node0.y;
        d = Math.pow(vx, 2) + Math.pow(vy, 2);
        dMin = Math.pow(node0.r + node1.r + delta2, 2);
        if(d < dMin) {
          dMin = Math.sqrt(dMin);
          d = Math.sqrt(d);
          k = 0.5 * (dMin - d) / d;
          node0.x -= K * k * vx;
          node0.y -= K * k * vy;
          node1.x += K * k * vx;
          node1.y += K * k * vy;
        }
      }
    }
    this._i0++;
  };

  /**
   * @todo write docs
   */
  Forces.prototype.applyForces = function() {
    var node;

    for(var i = 0; this.nodeList[i] != null; i++) {
      node = this.nodeList[i];
      node.vx += node.ax;
      node.vy += node.ay;
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
    }
  };

  /**
   * @todo write docs
   */
  Forces.prototype.deactivateForcesFromNode = function(node) {
    node.vx = node.vy = node.ax = node.ay = 0;
  };

  /**
   * @todo write docs
   */
  Forces.prototype.destroy = function() {
    delete this.k;
    delete this.dEqSprings;
    delete this.dEqRepulsors;
    delete this.friction;
    this.nodeList.destroy();
    delete this.nodeList;
    this.forcesList.destroy();
    delete this.forcesList;
    this.equilibriumDistances.destroy();
    delete this.equilibriumDistances;
    this.forcesTypeList.destroy();
    delete this.forcesTypeList;
    this.fromNodeList.destroy();
    delete this.fromNodeList;
    this.toNodeList.destroy();
    delete this.toNodeList;
    delete this._i0;
  };

  ///////////////////////////////////////////PRIVATE


  /**
   * @ignore
   */
  Forces.prototype._resetAccelerations = function() {
    var node;
    for(var i = 0; this.nodeList[i] != null; i++) {
      node = this.nodeList[i];
      node.ax = 0;
      node.ay = 0;
    }
  };

  Engine3D.prototype.constructor = Engine3D;

  /**
   * @classdesc Engine3D
   *
   * @param {Object} configuration Configuration for engine
   * @param {Number} configuration.lens Distance of camera from scene
   * @param {Point3D} configuration.angles Initial angle of camera
   * @constructor
   * @example
   * // creates a new Engine3D instance.
   * var engine = new Engine3D({
   *   lens:300
   * });
   * @category geometry
   */
  function Engine3D(configuration) {
    configuration = configuration == null ? {} : configuration;
    this.lens = configuration.lens == null ? 300 : configuration.lens;

    this._freeRotation = false;

    this.setBasis(new Polygon3D(new Point3D(1, 0, 0), new Point3D(0, 1, 0), new Point3D(0, 0, 1)));

    this._cuttingPlane = 10;

    if(configuration.angles != null) this.setAngles(configuration.angles);
  }
  Engine3D.prototype.setBasis = function(point3D) {
    this._basis = point3D.clone();
    this._basisBase = point3D.clone();
    this._provisionalBase = point3D.clone();
  };

  /**
   * setAngles - set viewing angle of camera on 3D scene.
   *
   * @param {Point3D} point3D viewing angle of the camera.
   * @example
   * var engine = new Engine3D();
   * engine.setAngles(new Point3D(0.2,-HalfPi*1.2, 0.05));
   */
  Engine3D.prototype.setAngles = function(point3D) {
    this._angles = point3D.clone();
    this._freeRotation = false;
    this._basis = this.basis3DRotation(this._basisBase, this._angles);
  };

  /**
   * applyRotation - Add rotation to existing 3D scene.
   *
   * @param {Point3D} planeVector rotation vector to add to scene.
   */
  Engine3D.prototype.applyRotation = function(planeVector) {
    if(!this._freeRotation) {
      this._freeRotation = true;
      this.updateAngles();
      this._provisionalBase[0] = this._basis[0].clone();
      this._provisionalBase[1] = this._basis[1].clone();
      this._provisionalBase[2] = this._basis[2].clone();
    }
    this._basis[0] = this.point3DRotation(this._provisionalBase[0], new Point3D(-planeVector.y, planeVector.x, 0));
    this._basis[1] = this.point3DRotation(this._provisionalBase[1], new Point3D(-planeVector.y, planeVector.x, 0));
    this._basis[2] = this.point3DRotation(this._provisionalBase[2], new Point3D(-planeVector.y, planeVector.x, 0));
    this._provisionalBase[0] = this._basis[0].clone();
    this._provisionalBase[1] = this._basis[1].clone();
    this._provisionalBase[2] = this._basis[2].clone();
  };

  /**
   * projectPoint3D - Use the current rotation of the scene and the viewpoint
   * of the camera to project a single point into this space.
   *
   * @param {Point3D} point3D point to project
   */
  Engine3D.prototype.projectPoint3D = function(point3D) {
    var prescale = this.lens / (this.lens + (this._basis[0].z * point3D.x + this._basis[1].z * point3D.y + this._basis[2].z * point3D.z));
    return new Point3D((this._basis[0].x * point3D.x + this._basis[1].x * point3D.y + this._basis[2].x * point3D.z) * prescale, (this._basis[0].y * point3D.x + this._basis[1].y * point3D.y + this._basis[2].y * point3D.z) * prescale, prescale);
  };

  /**
  * @todo write docs
  */
  Engine3D.prototype.projectCoordinates = function(x, y, z) {
    var prescale = this.lens / (this.lens + (this._basis[0].z * x + this._basis[1].z * y + this._basis[2].z * z));
    return new Point3D((this._basis[0].x * x + this._basis[1].x * y + this._basis[2].x * z) * prescale, (this._basis[0].y * x + this._basis[1].y * y + this._basis[2].y * z) * prescale, prescale);
  };

  /**
  * @todo write docs
  */
  Engine3D.prototype.projectPoint3DNode = function(node) {
    var prescale = this.lens / (this.lens + (this._basis[0].z * node.x + this._basis[1].z * node.y + this._basis[2].z * node.z));
    return new Point3D((this._basis[0].x * node.x + this._basis[1].x * node.y + this._basis[2].x * node.z) * prescale, (this._basis[0].y * node.x + this._basis[1].y * node.y + this._basis[2].y * node.z) * prescale, prescale);
  };

  /**
  * @todo write docs
  */
  Engine3D.prototype.scale = function(point3D) {
    return this.lens / (this.lens + (this._basis[0].z * point3D.x + this._basis[1].z * point3D.y + this._basis[2].z * point3D.z));
  };


  /**
  * @todo write docs
  */
  Engine3D.prototype.sortedIndexesByPointsScale = function(polygon3D) {
    var pairsArray = [];
    var i;
    for(i = 0; polygon3D[i] != null; i++) {
      pairsArray[i] = [polygon3D[i], i];
    }

    pairsArray = pairsArray.sort(this._sortingCriteria.bind(this));

    var indexes = new NumberList();

    for(i = 0; polygon3D[i] != null; i++) {
      indexes[i] = pairsArray[i][1];
    }

    return indexes;
  };

  /**
  * @todo write docs
  */
  Engine3D.prototype.sortListByPointsScale = function(list, polygon3D) {
    var pairsArray = [];
    var i;
    for(i = 0; list[i] != null; i++) {
      pairsArray[i] = [polygon3D[i], list[i]];
    }
    
    pairsArray = pairsArray.sort(this._sortingCriteria.bind(this));

    var newList = instantiateWithSameType(list);
    newList.name = list;

    for(i = 0; list[i] != null; i++) {
      newList[i] = pairsArray[i][1];
    }

    return newList;
  };

  /**
  * @todo write docs
  */
  Engine3D.prototype._sortingCriteria = function(array0, array1) {
    var point3D0 = array0[0];
    var point3D1 = array1[0];
    return(this._basis[0].z * point3D0.x + this._basis[1].z * point3D0.y + this._basis[2].z * point3D0.z < this._basis[0].z * point3D1.x + this._basis[1].z * point3D1.y + this._basis[2].z * point3D1.z) ? 1 : -1;
  };


  //private methods

  /**
  * @ignore
  */
  Engine3D.prototype.updateAngles = function() {
    this._angles = this.getEulerAngles();
  };

  /**
  * @ignore
  */
  Engine3D.prototype.getEulerAngles = function() {
    return new Point3D(Math.atan2(-this._basis[1].z, this._basis[2].z), Math.asin(this._basis[0].z), Math.atan2(-this._basis[0].y, this._basis[0].x));
  };


  //rotation


  //these must be at Operators3D

  Engine3D.prototype.basis3DRotation = function(basis, angles) {
    var ca = Math.cos(angles.x);
    var sa = Math.sin(angles.x);
    var cb = Math.cos(angles.y);
    var sb = Math.sin(angles.y);
    var cg = Math.cos(angles.z);
    var sg = Math.sin(angles.z);

    return new Polygon3D(new Point3D(basis[0].x * cg * cb + basis[0].y * (cg * sa * sb + sg * ca) + basis[0].z * (sg * sa - cg * ca * sb), -basis[0].x * sg * cb + basis[0].y * (cg * ca - sg * sa * sb) + basis[0].z * (sg * ca * sb + cg * sa), basis[0].x * sb - basis[0].y * sa * cb + basis[0].z * cb * ca), new Point3D(basis[1].x * cg * cb + basis[1].y * (cg * sa * sb + sg * ca) + basis[1].z * (sg * sa - cg * ca * sb), -basis[1].x * sg * cb + basis[1].y * (cg * ca - sg * sa * sb) + basis[1].z * (sg * ca * sb + cg * sa), basis[1].x * sb - basis[1].y * sa * cb + basis[1].z * cb * ca), new Point3D(basis[2].x * cg * cb + basis[2].y * (cg * sa * sb + sg * ca) + basis[2].z * (sg * sa - cg * ca * sb), -basis[2].x * sg * cb + basis[2].y * (cg * ca - sg * sa * sb) + basis[2].z * (sg * ca * sb + cg * sa), basis[2].x * sb - basis[2].y * sa * cb + basis[2].z * cb * ca));

  };

  Engine3D.prototype.point3DRotation = function(point, angles) {
    var ca = Math.cos(angles.x);
    var sa = Math.sin(angles.x);
    var cb = Math.cos(angles.y);
    var sb = Math.sin(angles.y);
    var cg = Math.cos(angles.z);
    var sg = Math.sin(angles.z);
    return new Point3D(
      point.x * cg * cb + point.y * (cg * sa * sb + sg * ca) + point.z * (sg * sa - cg * ca * sb), -point.x * sg * cb + point.y * (cg * ca - sg * sa * sb) + point.z * (sg * ca * sb + cg * sa),
      point.x * sb - point.y * sa * cb + point.z * cb * ca
    );
  };




  Engine3D.prototype.line3D = function(point0, point1) {
    var polygon = new _Polygon();

    var p0 = point0; //while there's no Transformation3D'
    var prescale0 = this.lens / (this.lens + (this._basis[0].z * p0.x + this._basis[1].z * p0.y + this._basis[2].z * p0.z));

    //
    var p1 = point1;
    var prescale1 = this.lens / (this.lens + (this._basis[0].z * p1.x + this._basis[1].z * p1.y + this._basis[2].z * p1.z));

    if(prescale0 > 0 || prescale1 > 0) {
      if(prescale0 > 0 && prescale1 > 0) {
        polygon.push(new _Point((this._basis[0].x * p0.x + this._basis[1].x * p0.y + this._basis[2].x * p0.z) * prescale0, (this._basis[0].y * p0.x + this._basis[1].y * p0.y + this._basis[2].y * p0.z) * prescale0));
        polygon.push(new _Point((this._basis[0].x * p1.x + this._basis[1].x * p1.y + this._basis[2].x * p1.z) * prescale1, (this._basis[0].y * p1.x + this._basis[1].y * p1.y + this._basis[2].y * p1.z) * prescale1));
        return polygon;
      } else {
        var p0B = new Point3D(this._basis[0].x * p0.x + this._basis[1].x * p0.y + this._basis[2].x * p0.z, this._basis[0].y * p0.x + this._basis[1].y * p0.y + this._basis[2].y * p0.z, this._basis[0].z * p0.x + this._basis[1].z * p0.y + this._basis[2].z * p0.z);
        var p1B = new Point3D(this._basis[0].x * p1.x + this._basis[1].x * p1.y + this._basis[2].x * p1.z, this._basis[0].y * p1.x + this._basis[1].y * p1.y + this._basis[2].y * p1.z, this._basis[0].z * p1.x + this._basis[1].z * p1.y + this._basis[2].z * p1.z);
        var t = (-this.lens + this._cuttingPlane - p0B.z) / (p1B.z - p0B.z);
        var pM = new Point3D(p0B.x + t * (p1B.x - p0B.x), p0B.y + t * (p1B.y - p0B.y), -this.lens + this._cuttingPlane);
        var prescaleM = this.lens / (this.lens + pM.z);
        if(prescale0 > 0) {
          polygon.push(new _Point(p0B.x * prescale0, p0B.y * prescale0));
          polygon.push(new _Point(pM.x * prescaleM, pM.y * prescaleM));
        } else {
          polygon.push(new _Point(pM.x * prescaleM, pM.y * prescaleM));
          polygon.push(new _Point(p1B.x * prescale1, p1B.y * prescale1));
        }
        return polygon;
      }
    }
    return null;
  };

  Engine3D.prototype.quadrilater = function(p0, p1, p2, p3) {
    var polygon3D = new Polygon3D();

    var l0 = this.line3D(p0, p1);
    var l1 = this.line3D(p1, p2);
    var l2 = this.line3D(p2, p3);
    var l3 = this.line3D(p3, p0);

    if(l0 != null) {
      if(l3 == null ||  (l0[0].x != l3[1].x && l0[0].y != l3[1].y)) polygon3D.push(l0[0]);
      polygon3D.push(l0[1]);
    }
    if(l1 != null) {
      if(l0 == null ||  (l1[0].x != l0[1].x && l1[0].y != l0[1].y)) polygon3D.push(l1[0]);
      polygon3D.push(l1[1]);
    }
    if(l2 != null) {
      if(l1 == null || (l2[0].x != l1[1].x && l2[0].y != l1[1].y)) polygon3D.push(l2[0]);
      polygon3D.push(l2[1]);
    }
    if(l3 != null) {
      if(l2 == null || (l3[0].x != l2[1].x && l3[0].y != l2[1].y)) polygon3D.push(l3[0]);
      polygon3D.push(l3[1]);
    }

    return polygon3D;
  };

  function CountryListDraw() {}
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

  /**
   * @classdesc Functions for drawing circles.
   *
   * @namespace
   * @category drawing
   */
  function CircleDraw() {}
  CircleDraw.circlesCloud = function(weights, frame, margin) {
    if(weights == null ||  weights.length === 0) return null;

    margin = margin == null ? 0 : margin;

    var normWeights = NumberListOperators.normalizedToMax(weights).sqrt();
    var circlesPlaced = new Polygon3D();

    var a = 0;
    var r = 0;

    var px = 0;
    var py = 0;
    var center = frame.getCenter();
    var rMax = normWeights[0] * 100;
    var rCircle;
    var firstR;

    var prop = frame.width / frame.height;

    for(var i = 0; normWeights[i] != null; i++) {
      rCircle = normWeights[i] * 100;
      if(i === 0) {
        px = center.x;
        py = center.y;
        firstR = rCircle;
      } else {
        a = 0; //i*0.5;
        r = firstR + rCircle + margin + 0.1;
        while(CircleDraw._pointInCircles(circlesPlaced, px, py, rCircle, margin)) {
          r += 0.1;
          a += r * 0.005;

          px = center.x + prop * r * Math.cos(a);
          py = center.y + r * Math.sin(a);
        }
        rMax = Math.max(rMax, prop * r + normWeights[i] * 100);
      }

      circlesPlaced[i] = new Point3D(px, py, rCircle);
    }

    var circle;
    prop = 0.5 * frame.width / (rMax + 0.001);
    for(i = 0; circlesPlaced[i] != null; i++) {
      circle = circlesPlaced[i];
      circle.x = center.x + (circle.x - center.x) * prop;
      circle.y = center.y + (circle.y - center.y) * prop;
      circle.z *= prop;
    }

    return circlesPlaced;
  };

  CircleDraw._pointInCircles = function(circles, px, py, r, margin) {
    var circle;
    for(var i = 0; circles[i] != null; i++) {
      circle = circles[i];
      if(Math.pow(circle.x - px, 2) + Math.pow(circle.y - py, 2) < Math.pow(circle.z + r + margin, 2)) return true;
    }
    return false;
  };

  /**
   * @classdesc Functions for drawing {@link Color|Colors}.
   *
   * @namespace
   * @category drawing
   */
  function ColorsDraw() {}
  /**
   * draws a color scale, with optional min and max associated values
   * @param  {Rectangle} frame
   * @param  {ColorScale} colorScale
   *
   * @param  {Number} minValue value associated to min color
   * @param  {Number} maxValue value associated to max color
   * tags:draw
   */
  ColorsDraw.drawColorScaleLegend = function(frame, colorScale, minValue, maxValue, graphics) {
    // TODO refactor this to import context from Global and not reassign it.
    var change = frame.memory == null || frame.width != frame.memory.w || frame.height != frame.memory.h || colorScale != frame.memory.cS || minValue != frame.memory.min || maxValue != frame.memory.max;

    if(change) {
      frame.memory = {
        w: frame.width,
        h: frame.height,
        cS: colorScale,
        min: minValue,
        max: maxValue
      };

      ///// capture image 1
      // TODO refactor to not reassign context
      // var newCanvas = document.createElement("canvas");
      // newCanvas.width = frame.width;
      // newCanvas.height = frame.height;
      // var newContext = newCanvas.getContext("2d");
      // newContext.clearRect(0, 0, frame.width, frame.height);
      // var mainContext = context;
      // context = newContext;
      /////

      var x;

      if(frame.width > frame.height) {

        for(x = 0; x < frame.width; x += 2) {
          graphics.setFill(colorScale(x / frame.width));
          graphics.fRect(x, 0, 2, frame.height);
        }

        graphics.setStroke('rgba(0,0,0,0.8)', 3);

        if(minValue != null) {
          graphics.setText('white', 12, null, 'left', 'middle');
          graphics.fsText(minValue, 2, frame.height * 0.5);
        }

        if(maxValue != null) {
          graphics.setText('white', 12, null, 'right', 'middle');
          graphics.fsText(maxValue, frame.width - 2, frame.height * 0.5);
        }
      } else {

        //finis this, with color scale going uppwards, and texts for min max values

        for(x = 0; x < frame.height; x += 2) {
          graphics.setFill(colorScale(x / frame.height));
          graphics.fRect(0, x, frame.width, 2);
        }
      }

      //// capture image 2
      // TODO refactor to not reassign context
      // context = mainContext;
      // frame.memory.image = new Image();
      // frame.memory.image.src = newCanvas.toDataURL();
      ////
    }


    if(frame.memory.image) {
      graphics.drawImage(frame.memory.image, frame.x, frame.y);
    }

  };

  /**
   * @classdesc Functions for drawing {@link List|Lists}.
   *
   * @namespace
   * @category drawing
   */
  function ListDraw() {}
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
  ListDraw.drawList = function(frame, list, returnMode, colorList, textSize, mode, selectedInit, graphics) {
    if(list == null || list.length < 0) return;

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
    var mouseIn = frame.containsPoint(graphics.mP);
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
        y0Follow = Math.min(10 - (hList - frame.height + 20) * ((graphics.mY - (frame.y + 10)) / (frame.height - 20)), 10);
      } else {
        y0Follow = 10 - (hList - frame.height + 20) * frame.memory.selected / list.length;
      }

      frame.memory.y = 0.95 * frame.memory.y + 0.05 * y0Follow;

      y0 = frame.y + frame.memory.y;
    }


    graphics.setText('black', textSize);

    for(i = 0; list[i] != null; i++) {
      y = y0 + dy * i;

      if(y < frame.y) continue;
      if(y + 12 > bottom) break;



      if(returnMode != -1) {

        index = frame.memory.multiSelected.indexOf(i);
        onMulti = multi && index != -1;

        isSelected = multi ? onMulti : frame.memory.selected == i;

        if(isSelected) {
          graphics.setFill('black');
          graphics.fRect(frame.x + 2, y, frame.width - 4, dy);
          graphics.setFill('white');
        } else {
          graphics.setFill('black');
        }
        graphics.fText(list[i].toString(), xTexts, y + 2);

        if(mouseIn && graphics.mY >= y && graphics.mY < y + dy) {
          graphics.setFill('rgba(150,150,150,0.3)');
          if(graphics.fRectM(frame.x + 2, y, frame.width - 4, dy)) {
            graphics.setCursor('pointer');
          }
          if(graphics.MOUSE_DOWN) {
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
        graphics.setFill('black');
      }

      if(colorList) {
        graphics.setFill(colorList == null ? 'rgb(200, 200, 200)' : colorList[i % n]);
        graphics.fRect(x, y + 4, 10, 10);
      }

    }

    return returnMode == 1 ? list[frame.memory.selected] : (multi ? frame.memory.multiSelected : frame.memory.selected);
  };

  function NumberListDraw() {}
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
  NumberListDraw.drawSimpleGraph = function(frame, numberList, margin, xValues, graphics) {
    if(numberList == null || NumberListOperators.normalized(numberList) == null) return;

    if(graphics==null) graphics = frame.graphics; //momentary fix

    margin = margin || 0;

    //setup
    if(frame.memory == null || numberList != frame.memory.numberList) {
      frame.memory = {
        numberList: numberList,
        minmax: numberList.getMinMaxInterval(),
        zero: null
      };
      if(frame.memory.minmax.x > 0 && frame.memory.minmax.y > 0) {
        frame.memory.normalizedList = NumberListOperators.normalizedToMax(numberList);
      } else {
        frame.memory.normalizedList =  NumberListOperators.normalized(numberList);
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

    var mouseOnFrame = subframe.containsPoint(graphics.mP);
    var normalColor = mouseOnFrame ? 'rgb(160,160,160)' : 'black';

    if(frame.memory.zero) {
      var zeroY = subframe.bottom - subframe.height * frame.memory.zero; //Math.max(subframe.bottom - subframe.height*frame.memory.zero, subframe.y);
      for(i = 0; numberList[i] != null; i++) {
        x = subframe.x + i * dx;
        if(mouseOnFrame && graphics.mX > x && graphics.mX < x + dx) {
          overI = i;
          graphics.setFill('black');
        } else {
          graphics.setFill(normalColor);
        }
        graphics.fRect(subframe.x + i * dx, zeroY, dx, -subframe.height * (frame.memory.normalizedList[i] - frame.memory.zero));
      }
    } else {
      for(i = 0; numberList[i] != null; i++) {
        x = subframe.x + i * dx;
        if(mouseOnFrame && graphics.mX > x && graphics.mX < x + dx) {
          overI = i;
          graphics.setFill('black');
        } else {
          graphics.setFill(normalColor);
        }
        graphics.fRect(x, subframe.bottom, dx, -subframe.height * frame.memory.normalizedList[i]);
      }
    }

    var clicked;

    if(overI != -1) {
      graphics.setText('white', 12);
      var text = frame.memory.xTexts[overI];
      var w = graphics.getTextW(text);
      graphics.setFill('rgb(100,100,100)');
      graphics.fLines(
        graphics.mX, graphics.mY,
        graphics.mX + 16, graphics.mY - 10,
        graphics.mX + w + 16, graphics.mY - 10,
        graphics.mX + w + 16, graphics.mY - 30,
        graphics.mX + 6, graphics.mY - 30,
        graphics.mX + 6, graphics.mY - 10
      );
      graphics.setFill('white');
      graphics.fText(text, graphics.mX + 10, graphics.mY - 26);
      if(graphics.MOUSE_DOWN) {
        clicked = overI;
      }
    }

    return clicked;
  };

  function IntervalTableDraw() {}
  IntervalTableDraw.MIN_CHARACTERS_SIZE = 1;

  IntervalTableDraw.drawIntervalsFlowTable = function(intervalsFlowTable, frame, colors, bezier, offValue, graphics) { //, returnHovered){ //TODO: implement rollover detection, using _isOnShape (below)
    frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;
    colors = colors == null ? ColorListGenerators.createCategoricalColors(0, intervalsFlowTable.length, ColorScales.temperature) : colors;
    bezier = bezier || false;
    offValue = offValue == null ? 0.45 : offValue;

    var i;
    var j;

    var nCols = intervalsFlowTable[0].length;
    var dX = frame.width / (nCols - 1);
    var dY = frame.height;

    var point;

    var intervalList;  
    var sY = 0;  
    var x = frame.x;
    var y = frame.y;

    var prevPoint;
    var offX;

    //var nHovered = -1;

    for(i = 0; intervalsFlowTable[i] != null; i++) {
      intervalList = intervalsFlowTable[i];

      graphics.context.fillStyle = colors[i];
      graphics.context.beginPath();

      sY = y;

      point = new _Point(x, intervalList[0].y * dY + sY);
      graphics.context.moveTo(point.x, point.y);

      prevPoint = point;

      for(j = 1; j < nCols; j++) {
        sY = y;

        point = new _Point(j * dX + x, intervalList[j].y * dY + sY);

        if(bezier) {
          offX = (point.x - prevPoint.x) * offValue;
          graphics.context.bezierCurveTo(prevPoint.x + offX, prevPoint.y, point.x - offX, point.y, point.x, point.y);
        } else {
          graphics.context.lineTo(point.x, point.y);
        }

        prevPoint = point;
      }

      point = new _Point((nCols - 1) * dX + x, intervalList[nCols - 1].x * dY + sY);
      graphics.context.lineTo(point.x, point.y);
      prevPoint = point;

      for(j = nCols - 2; j >= 0; j--) {
        sY = y;

        point = new _Point(j * dX + x, intervalList[j].x * dY + sY);

        if(bezier) {
          offX = (point.x - prevPoint.x) * offValue;
          graphics.context.bezierCurveTo(prevPoint.x + offX, prevPoint.y, point.x - offX, point.y, point.x, point.y);

          // if(returnHovered && nHovered==-1 && IntervalTableDraw._isOnShape(prevPoint, point, intervalList[j-1].y*dY+sY, intervalList[j].y*dY+sY, offX, mX, mY)){
          // nHovered = i;
          // }

        } else {
          graphics.context.lineTo(point.x, point.y);
        }

        prevPoint = point;
      }

      point = new _Point(x, intervalList[0].x * dY + sY);
      graphics.context.lineTo(point.x, point.y);

      graphics.context.fill();

    }

    //return nHovered;
  };
  IntervalTableDraw._isOnShape = function(prevPoint, point, prevYsup, newYsup, offX, testX, textY) {
    var t = (testX - prevPoint.x) / (point.x - prevPoint.x);
    var u = 1 - t;

    //Y INF
    this.p0.x = prevPoint.x + t * offX;
    this.p0.y = prevPoint.y;
    this.p1.x = u * (prevPoint.x + offX) + t * (point.x - offX);
    this.p1.y = u * prevPoint.y + t * point.y;
    this.p2.x = point.x - u * offX;
    this.p2.y = point.y;

    this.P0.x = u * this.p0.x + t * this.p1.x;
    this.P0.y = u * this.p0.y + t * this.p1.y;

    this.P1.x = u * this.p1.x + t * this.p2.x;
    this.P1.y = u * this.p1.y + t * this.p2.y;

    var mYInf = u * this.P0.y + t * this.P1.y;

    //Y SUP
    this.p0.y = prevYsup;
    this.p1.y = u * prevYsup + t * newYsup;
    this.p2.y = newYsup;

    this.P0.y = u * this.p0.y + t * this.p1.y;
    this.P1.y = u * this.p1.y + t * this.p2.y;

    var mYSup = u * this.P0.y + t * this.P1.y;

    return textY > mYSup && textY < mYInf;
  };



  IntervalTableDraw.drawCircularIntervalsFlowTable = function(intervalsFlowTable, center, radius, r0, colors, texts, returnHovered, angles, angle0, graphics) {
    var nElements = intervalsFlowTable.length;
    var i;
    var j;

    colors = colors == null ? ColorListOperators.colorListFromColorScale(new ColorScale(ColorOperators.temperatureScale), nElements) : colors;
    center = center == null ? new _Point(100, 100) : center;
    radius = radius == null ? 200 : radius;
    r0 = r0 == null ? 10 : r0;
    angle0 = angle0 == null ? 0 : angle0;

    var nCols = intervalsFlowTable[0].length;
    var dA = TwoPi / nCols;
    var dR = (radius - r0);

    var point;

    var intervalList;  
    var interval;

    var s, textS;

    var prevPoint;
    
    var nR;
    var nR2;

    var offA = dA * 0.3;
    var cosOffA = Math.cos(offA);

    var rT;

    var nHovered = -1;

    var filteredTexts = [];
    var textsX = [];
    var textsY = [];
    var textsSizes = [];
    var textsAngles = [];

    for(i = 0; i < nElements; i++) {

      intervalList = intervalsFlowTable[i];

      graphics.context.fillStyle = colors[i % nElements];

      graphics.context.beginPath();

      point = new _Point(angles == null ? 0 : angles[0] + angle0, (1 - intervalList[0].y) * dR + r0);
      graphics.context.moveTo(point.y * Math.cos(point.x) + center.x, point.y * Math.sin(point.x) + center.y);

      prevPoint = point;

      for(j = 1; j <= nCols; j++) {

        interval = intervalList[j % nCols];
        point = new _Point(angles == null ? j * dA : angles[j % nCols] + angle0, (1 - interval.y) * dR + r0);

        nR = prevPoint.y / cosOffA;
        nR2 = point.y / cosOffA;

        graphics.context.bezierCurveTo(nR * Math.cos(prevPoint.x + offA) + center.x, nR * Math.sin(prevPoint.x + offA) + center.y,
          nR2 * Math.cos(point.x - offA) + center.x, nR2 * Math.sin(point.x - offA) + center.y,
          point.y * Math.cos(point.x) + center.x, point.y * Math.sin(point.x) + center.y);

        if(returnHovered && nHovered == -1 && this._isOnRadialShape(center, graphics.mP, prevPoint.x, point.x, dR * (1 - intervalList[(j - 1) % nCols].y) + r0, dR * (1 - intervalList[(j - 1) % nCols].x) + r0, dR * (1 - intervalList[j % nCols].y) + r0, dR * (1 - intervalList[j % nCols].x) + r0)) {
          nHovered = i;
        }

        prevPoint = point;

        if(texts != null) {
          s = interval.getAmplitude();
          textS = Math.min(Math.sqrt(s * radius) * 3, 28);
          if(textS >= 8) {
            rT = point.y + s * 0.5 * dR;

            textsSizes.push(textS);
            textsAngles.push(point.x + Math.PI * 0.5);

            textsX.push(rT * Math.cos(point.x) + center.x);
            textsY.push(rT * Math.sin(point.x) + center.y);

            filteredTexts.push(texts[i]);
          }
        }
      }

      point = new _Point(angles == null ? 0 : angles[0] + angle0, (1 - intervalList[0].x) * dR + r0);
      graphics.context.lineTo(point.y * Math.cos(point.x) + center.x, point.y * Math.sin(point.x) + center.y);
      prevPoint = point;

      for(j = nCols - 1; j >= 0; j--) {
        point = new _Point(angles == null ? j * dA : angles[j] + angle0, (1 - intervalList[j].x) * dR + r0);

        nR = prevPoint.y / cosOffA;
        nR2 = point.y / cosOffA;

        graphics.context.bezierCurveTo(nR * Math.cos(prevPoint.x - offA) + center.x, nR * Math.sin(prevPoint.x - offA) + center.y,
          nR2 * Math.cos(point.x + offA) + center.x, nR2 * Math.sin(point.x + offA) + center.y,
          point.y * Math.cos(point.x) + center.x, point.y * Math.sin(point.x) + center.y);

        prevPoint = point;
      }

      point = new _Point(angles == null ? 0 : angles[0] + angle0, (1 - intervalList[0].x) * dR + r0);
      graphics.context.lineTo(point.y * Math.cos(point.x) + center.x, point.y * Math.sin(point.x) + center.y);

      graphics.context.fill();

    }

    for(i = 0; filteredTexts[i] != null; i++) {
      graphics.setText('black', textsSizes[i], null, 'center', 'middle');
      graphics.fTextRotated(filteredTexts[i], textsX[i], textsY[i], textsAngles[i]);
    }

    return nHovered;
  };

  IntervalTableDraw._isOnRadialShape = function(center, testPoint, a0, a1, r0a, r0b, r1a, r1b) {
    if(a1 < a0) a1 += TwoPi;

    var ang = center.angleToPoint(testPoint);

    if(ang < 0) ang += TwoPi;
    if(ang > TwoPi) ang -= TwoPi;

    if(ang + TwoPi < a1) ang += TwoPi;
    if(ang - TwoPi > a0) ang -= TwoPi;

    if(ang < a0 || ang > a1) return false;
    var dA = a1 - a0;
    var t = (ang - a0) / dA;

    var pa = GeometryOperators.bezierCurvePoints(a0, r0a, a0 + dA * 0.5, r0a, a1 - dA * 0.5, r1a, a1, r1a, t);
    var pb = GeometryOperators.bezierCurvePoints(a0, r0b, a0 + dA * 0.25, r0b, a1 - dA * 0.25, r1b, a1, r1b, t);

    var r = testPoint.subtract(center).getNorm();

    return r > pa.y && r < pb.y;
  };



  IntervalTableDraw.drawIntervalsWordsFlowTable = function(frame, intervalsFlowTable, texts, colors, typode, graphics) {
    var nElements = intervalsFlowTable.length;

    var i;
    var j;

    colors = colors == null ? ColorListGenerators.createCategoricalColors(0, intervalsFlowTable.length, ColorScales.temperature) : colors;
    frame = frame == null ? new Rectangle(10, 10, 400, 300) : frame;

    var nCols = intervalsFlowTable[0].length;
    var dX = frame.width / (nCols - 1);
    var dY = frame.height;

    var point0;
    var point1;

    var point0Prev = new _Point();
    var point1Prev = new _Point();

    var center;
    var size;

    var intervalList;
    var lastIntervalList = intervalsFlowTable[nElements - 1];
    var sY = 0;
    var x = frame.x;
    var y = frame.y;

    var offX;

    var text;

    if(!typode) {
      graphics.context.strokeStyle = "rgba(255,255,255,0.4)";
    }

    graphics.context.textBaseline = "top";
    graphics.context.textAlign = "left";

    var position;
    var xx;
    var t;
    var jumpX = dX;
    var valueLastInterval;
    var valueX;
    var valueY;
    var nChar;
    var selectedChar;
    var charWidth;
    var fontSize;

    var factX = (nCols - 1) / frame.width;

    var xj0;
    var xj1;


    for(i = 0; intervalsFlowTable[i] != null; i++) {
      intervalList = intervalsFlowTable[i];

      text = " " + texts[i];

      xx = 0;
      nChar = 0;

      position = 0;
      j = 0;
      t = 0;

      sY = (1 - lastIntervalList[0].y) * 0.5 * dY + y;
      point0 = new _Point(x, intervalList[0].x * dY + sY);
      point1 = new _Point(x, intervalList[0].y * dY + sY);

      do {
        nChar++;
        size = (point1.y - point0.y);
        fontSize = Math.floor(0.3 * size + 1);
        if(!typode) graphics.context.font = fontSize + 'px ';
        selectedChar = text.charAt(nChar % text.length);
        charWidth = typode ? fontSize * widthsTypode[selectedChar] : graphics.context.measureText(selectedChar).width + 2;
        jumpX = charWidth * 0.9 || 1;

        xx += jumpX;
        position = factX * xx;
        j = Math.floor(position);
        t = position - j;


        if(j + 2 > nCols) continue;

        xj0 = j / factX;
        xj1 = (j + 1) / factX;

        offX = factX * 0.45;

        valueLastInterval = IntervalTableDraw._bezierValue(xj0, xj1, lastIntervalList[j].y, lastIntervalList[j + 1].y, t, offX);

        sY = (1 - valueLastInterval) * 0.5 * dY + y;

        point0Prev.x = point0.x;
        point0Prev.y = point0.y;
        point1Prev.x = point1.x;
        point1Prev.y = point1.y;

        valueX = IntervalTableDraw._bezierValue(xj0, xj1, intervalList[j].x, intervalList[j + 1].x, t, offX);
        valueY = IntervalTableDraw._bezierValue(xj0, xj1, intervalList[j].y, intervalList[j + 1].y, t, offX);

        point0 = new _Point(xx + x, valueX * dY + sY);
        point1 = new _Point(xx + x, valueY * dY + sY);

        center = new _Point(point0Prev.x + jumpX * 0.5, (point0.y + point1.y + point0Prev.y + point1Prev.y) * 0.25);

        if(typode) {
          graphics.context.strokeStyle = colors[i];
        } else {
          graphics.context.fillStyle = colors[i];
        }

        if(size > IntervalTableDraw.MIN_CHARACTERS_SIZE) {
          if(typode) {
            DrawTextsAdvanced.typodeOnQuadrilater(selectedChar, point0Prev, point0, point1, point1Prev);
          } else {
            graphics.context.save();
            graphics.context.globalAlpha = size / 15;
            DrawTextsAdvanced.textOnQuadrilater(graphics.context, selectedChar, point0Prev, point0, point1, point1Prev, fontSize, 1);
            graphics.context.restore();
          }

        }
      } while (j + 1 < nCols);
    }
  };
  IntervalTableDraw._bezierValue = function(x0, x1, y0, y1, t, offX) {
    var u = 1 - t;
    var p0 = new _Point(x0 + t * offX, y0);
    var p1 = new _Point(u * (x0 + offX) + t * (x1 - offX), u * y0 + t * y1);
    var p2 = new _Point(x1 - u * offX, y1);

    var P0 = new _Point(u * p0.x + t * p1.x, u * p0.y + t * p1.y);
    var P1 = new _Point(u * p1.x + t * p2.x, u * p1.y + t * p2.y);

    return u * P0.y + t * P1.y;
  };

  function NumberTableDraw() {}
  /**
   * draws a matrix, with cells colors associated to values from a ColorScale
   * @param  {Rectangle} frame
   * @param  {NumberTable} numberTable
   *
   * @param  {ColorScale} colorScale
   * @param  {Boolean} listColorsIndependent if true each numberList will be colored to fit the colorScale range
   * @param  {Number} margin
   * @return {Point}
   * tags:draw
   */
  NumberTableDraw.drawNumberTable = function(frame, numberTable, colorScale, listColorsIndependent, margin, graphics) {
    if(frame == null ||  numberTable == null || numberTable.type == null || numberTable.type != "NumberTable" ||  numberTable.length < 2) return null;

    if(graphics==null) graphics = frame.graphics; //momentary fix

    colorScale = colorScale == null ? ColorScales.blueToRed : colorScale;
    listColorsIndependent = listColorsIndependent || false;
    margin = margin == null ? 2 : margin;

    var dX = frame.width / numberTable.length;
    var dY = frame.height / numberTable[0].length;

    var i;
    var j;
    var numberList;
    var x;

    var overCoordinates;

    var minMaxInterval;
    var amp;
    if(!listColorsIndependent) {
      minMaxInterval = numberTable.getMinMaxInterval();
      amp = minMaxInterval.getAmplitude();
    }

    var mouseXOnColumn;

    for(i = 0; numberTable[i] != null; i++) {
      numberList = numberTable[i];
      x = Math.round(frame.x + i * dX);
      mouseXOnColumn = graphics.mX > x && graphics.mX <= x + dX;
      if(listColorsIndependent) {
        minMaxInterval = numberList.getMinMaxInterval();
        amp = minMaxInterval.getAmplitude();
      }
      for(j = 0; numberList[j] != null; j++) {
        graphics.context.fillStyle = colorScale((numberList[j] - minMaxInterval.x) / amp);
        graphics.context.fillRect(x, Math.round(frame.y + j * dY), Math.ceil(dX) - margin, Math.ceil(dY) - margin);
        if(mouseXOnColumn && graphics.mY > frame.y + j * dY && graphics.mY <= frame.y + (j + 1) * dY) overCoordinates = new _Point(i, j);
      }
    }

    return overCoordinates;
  };

  /**
   * draws a ScatterPlot, if the provided NumberTable contains a third NumberList it also draws circles
   * @param  {Rectangle} frame
   * @param  {NumberTable} numberTable with two lists
   *
   * @param  {StringList} texts
   * @param  {ColorList} colors
   * @param  {Number} maxRadius
   * @param  {Boolean} loglog logarithmical scale for both axis
   * @param  {Number} margin in pixels
   * @return {Number} index of rollovered element
   * tags:draw
   */
  NumberTableDraw.drawSimpleScatterPlot = function(frame, numberTable, texts, colors, maxRadius, loglog, margin, graphics) {
    if(frame == null ||  numberTable == null || numberTable.type != "NumberTable" ||  numberTable.length < 2 ||  numberTable[0].length === 0 || numberTable[1].length === 0) return; //todo:provisional, this is System's work

    if(numberTable.length < 2) return;

    maxRadius = maxRadius || 20;
    loglog = loglog || false;
    margin = margin || 0;

    var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
    subframe.bottom = subframe.getBottom();

    var i;
    var x, y;
    var list0 = NumberListOperators.normalized(loglog ? numberTable[0].log(1) : numberTable[0]);
    var list1 = (loglog ? numberTable[1].log(1) :  NumberListOperators.normalized(numberTable[1]));
    var radii = numberTable.length <= 2 ? null :  NumberListOperators.normalized(numberTable[2]).sqrt().factor(maxRadius);
    var nColors = (colors == null) ? null : colors.length;
    var n = Math.min(list0.length, list1.length, (radii == null) ? 300000 : radii.length, (texts == null) ? 300000 : texts.length);
    var iOver;

    for(i = 0; i < n; i++) {
      x = subframe.x + list0[i] * subframe.width;
      y = subframe.bottom - list1[i] * subframe.height;

      if(radii == null) {
        if(NumberTableDraw._drawCrossScatterPlot(x, y, colors == null ? 'rgb(150,150,150)' : colors[i % nColors])) iOver = i;
      } else {
        graphics.setFill(colors == null ? 'rgb(150,150,150)' : colors[i % nColors]);
        if(graphics.fCircleM(x, y, radii[i], radii[i] + 1)) iOver = i;
      }
      if(texts != null) {
        graphics.setText('black', 10);
        graphics.fText(texts[i], x, y);
      }
    }

    if(margin > 7 && list0.name !== "" && list1.name !== "") {
      graphics.setText('black', 10, null, 'right', 'middle');
      graphics.fText(list0.name, subframe.getRight() - 2, subframe.bottom + margin * 0.5);
      graphics.fTextRotated(list1.name, subframe.x - margin * 0.5, subframe.y + 1, -HalfPi);
    }

    if(iOver != null) {
      graphics.setCursor('pointer');
      return iOver;
    }
  };

  NumberTableDraw._drawCrossScatterPlot = function(x, y, color, graphics) {
    graphics.setStroke(color, 1);
    graphics.line(x, y - 2, x, y + 2);
    graphics.line(x - 2, y, x + 2, y);
    return Math.pow(graphics.mX - x, 2) + Math.pow(graphics.mY - y, 2) < 25;
  };

  /**
   * draws a slopegraph
   * @param  {Rectangle} frame
   * @param  {NumberTable} numberTable with at least two numberLists
   * @param  {StringList} texts
   * @return {Object}
   * tags:draw
   */
  NumberTableDraw.drawSlopeGraph = function(frame, numberTable, texts, graphics) {
    if(frame == null ||  numberTable == null || numberTable.type != "NumberTable") return; //todo:provisional, this is System's work

    if(numberTable.length < 2) return;

    var margin = 16;
    var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
    subframe.bottom = subframe.getBottom();

    var i;
    var y0, y1;
    var list0 =  NumberListOperators.normalized(numberTable[0]);
    var list1 =  NumberListOperators.normalized(numberTable[1]);
    var n = Math.min(list0.length, list1.length, texts == null ? 2000 : texts.length);

    var x0 = subframe.x + (texts == null ? 10 : 0.25 * subframe.width);
    var x1 = subframe.getRight() - (texts == null ? 10 : 0.25 * subframe.width);

    graphics.setStroke('black', 1);

    for(i = 0; i < n; i++) {
      y0 = subframe.bottom - list0[i] * subframe.height;
      y1 = subframe.bottom - list1[i] * subframe.height;

      graphics.line(x0, y0, x1, y1);

      if(texts != null && (subframe.bottom - y0) >= 9) {
        graphics.setText('black', 9, null, 'right', 'middle');
        graphics.fText(texts[i], x0 - 2, y0);
      }
      if(texts != null && (subframe.bottom - y1) >= 9) {
        graphics.setText('black', 9, null, 'left', 'middle');
        graphics.fText(texts[i], x1 + 2, y1);
      }
    }
  };


  /**
   * based on a integers NumberTable draws a a matrix of rectangles with colors associated to number of elelments in overCoordinates
   * @param  {Rectangle} frame
   * @param  {Object} coordinates, it could be a polygon, or a numberTable with two lists
   *
   * @param  {ColorScale} colorScale
   * @param  {Number} margin
   * @return {NumberList} list of positions of elements on clicked coordinates
   * tags:draw
   */
  NumberTableDraw.drawDensityMatrix = function(frame, coordinates, colorScale, margin, graphics) {
    if(coordinates == null || coordinates[0] == null) return;

    colorScale = colorScale == null ?
  								ColorScales.whiteToRed
  								:
      typeof colorScale == 'string' ?
  									ColorScales[colorScale]
  									:
      colorScale;
    margin = margin || 0;

    var i, j;
    var x, y;
    var minx, miny;
    var matrixColors;
    var numberTable;
    var polygon;

    //setup
    if(frame.memory == null || coordinates != frame.memory.coordinates || colorScale != frame.memory.colorScale) {

      var isNumberTable = coordinates[0].x == null;
      if(isNumberTable) {
        numberTable = coordinates;
        if(numberTable == null ||  numberTable.length < 2 || numberTable.type != "NumberTable") return;
      } else {
        polygon = coordinates;
      }

      var max = 0;
      var nCols = 0;
      var nLists = 0;
      var matrix = new NumberTable();
      var n = isNumberTable ? numberTable[0].length : polygon.length;

      matrixColors = new Table();

      if(isNumberTable) {
        minx = numberTable[0].getMin();
        miny = numberTable[1].getMin();
      } else {
        minx = polygon[0].x;
        miny = polygon[0].y;
        for(i = 1; i < n; i++) {
          minx = Math.min(polygon[i].x, minx);
          miny = Math.min(polygon[i].y, miny);
        }
      }


      for(i = 0; i < n; i++) {
        if(isNumberTable) {
          x = Math.floor(numberTable[0][i] - minx);
          y = Math.floor(numberTable[1][i] - miny);
        } else {
          x = Math.floor(polygon[i].x - minx);
          y = Math.floor(polygon[i].y - miny);
        }

        if(matrix[x] == null) matrix[x] = new NumberList();
        if(matrix[x][y] == null) matrix[x][y] = 0;
        matrix[x][y]++;
        max = Math.max(max, matrix[x][y]);
        nCols = Math.max(nCols, x + 1);
        nLists = Math.max(nLists, y + 1);
      }

      for(i = 0; i < nCols; i++) {
        if(matrix[i] == null) matrix[i] = new NumberList();
        matrixColors[i] = new ColorList();
        for(j = 0; j < nLists; j++) {
          if(matrix[i][j] == null) matrix[i][j] = 0;
          matrixColors[i][j] = colorScale(matrix[i][j] / max);
        }
      }
      frame.memory = {
        matrixColors: matrixColors,
        coordinates: coordinates,
        colorScale: colorScale,
        selected: null
      };

    } else {
      matrixColors = frame.memory.matrixColors;
    }

    //c.log(matrixColors.length, matrixColors[0].length, matrixColors[0][0]);

    //draw
    var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
    subframe.bottom = subframe.getBottom();
    var dx = subframe.width / matrixColors.length;
    var dy = subframe.height / matrixColors[0].length;
    var prevSelected = frame.memory.selected;

    if(graphics.MOUSE_UP_FAST) frame.memory.selected = null;

    for(i = 0; matrixColors[i] != null; i++) {
      for(j = 0; matrixColors[0][j] != null; j++) {
        graphics.setFill(matrixColors[i][j]);
        if(graphics.fRectM(subframe.x + i * dx, subframe.bottom - (j + 1) * dy, dx + 0.5, dy + 0.5) && graphics.MOUSE_UP_FAST) {
          frame.memory.selected = [i, j];
        }
      }
    }


    //selection
    if(frame.memory.selected) {
      graphics.setStroke('white', 5);
      graphics.sRect(subframe.x + frame.memory.selected[0] * dx - 1, subframe.bottom - (frame.memory.selected[1] + 1) * dy - 1, dx + 1, dy + 1);
      graphics.setStroke('black', 1);
      graphics.sRect(subframe.x + frame.memory.selected[0] * dx - 1, subframe.bottom - (frame.memory.selected[1] + 1) * dy - 1, dx + 1, dy + 1);
    }

    if(prevSelected != frame.memory.selected) {
      if(frame.memory.selected == null) {
        frame.memory.indexes = null;
      } else {
        minx = numberTable[0].getMin();
        miny = numberTable[1].getMin();

        x = frame.memory.selected[0] + minx;
        y = frame.memory.selected[1] + miny;

        frame.memory.indexes = new NumberList();

        for(i = 0; numberTable[0][i] != null; i++) {
          if(numberTable[0][i] == x && numberTable[1][i] == y) frame.memory.indexes.push(i);
        }
      }

    }

    if(frame.memory.selected) return frame.memory.indexes;
  };

  /**
   * draws a steamgraph
   * @param  {Rectangle} frame
   * @param  {NumberTable} numberTable
   *
   * @param {Boolean} normalized normalize each column, making the graph of constant height
   * @param {Boolean} sorted sort flow polygons
   * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons
   * @param {Boolean} bezier draws bezier (soft) curves
   * @param {ColorList} colorList colors of polygons
   * @param {StringList} horizontalLabels to be placed in the bottom
   * @param {Boolean} showValues show values in the stream
   * @param {Number} logFactor if >0 heights will be transformed logaritmically log(logFactor*val + 1)
   * @return {NumberList} list of positions of elements on clicked coordinates
   * tags:draw
   */
  NumberTableDraw.drawStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, bezier, colorList, horizontalLabels, showValues, logFactor, graphics) {
    if(numberTable == null ||  numberTable.length < 2 || numberTable.type != "NumberTable") return;

    bezier = bezier == null ? true : bezier;

    //var self = NumberTableDraw.drawStreamgraph;

    intervalsFactor = intervalsFactor == null ? 1 : intervalsFactor;

    //setup
    if(frame.memory == null || numberTable != frame.memory.numberTable || normalized != frame.memory.normalized || sorted != frame.memory.sorted || intervalsFactor != frame.memory.intervalsFactor || bezier != frame.memory.bezier || frame.width != frame.memory.width || frame.height != frame.memory.height || logFactor != frame.memory.logFactor) {
  		var nT2 = logFactor?numberTable.applyFunction(function(val){return Math.log(logFactor*val+1);}):numberTable;

      frame.memory = {
        numberTable: numberTable,
        normalized: normalized,
        sorted: sorted,
        intervalsFactor: intervalsFactor,
        bezier: bezier,
        flowIntervals: IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(nT2, normalized, sorted), intervalsFactor),
        fOpen: 1,
        names: numberTable.getNames(),
        mXF: graphics.mX,
        width: frame.width,
        height: frame.height,
        logFactor: logFactor,
        image: null
      };
    }

    if(colorList && frame.memory.colorList != colorList) frame.memory.image = null;

    if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
      frame.memory.actualColorList = colorList == null ? ColorListGenerators.createDefaultCategoricalColorList(numberTable.length, 0.7) : colorList;
      frame.memory.colorList = colorList;
    }

    var flowFrame = new Rectangle(0, 0, frame.width, horizontalLabels == null ? frame.height : (frame.height - 14));

    if(frame.memory.image == null) {
      // TODO refactor to not reassign context
      ///// capture image
      // var newCanvas = document.createElement("canvas");
      // newCanvas.width = frame.width;
      // newCanvas.height = frame.height;
      // var newContext = newCanvas.getContext("2d");
      // newContext.clearRect(0, 0, frame.width, frame.height);
      // var mainContext = context;
      // context = newContext;
      // IntervalTableDraw.drawIntervalsFlowTable(frame.memory.flowIntervals, flowFrame, frame.memory.actualColorList, bezier, 0.3);
      // context = mainContext;
      // frame.memory.image = new Image();
      // frame.memory.image.src = newCanvas.toDataURL();
      /////
    }

    var x0, x1;
    if(frame.memory.image) {
      frame.memory.fOpen = 0.8 * frame.memory.fOpen + 0.2 * (frame.containsPoint(graphics.mP) ? 0.8 : 1);
      frame.memory.mXF = 0.7 * frame.memory.mXF + 0.3 * graphics.mX;
      frame.memory.mXF = Math.min(Math.max(frame.memory.mXF, frame.x), frame.getRight());

      if(frame.memory.fOpen < 0.999) {
        graphics.context.save();
        graphics.context.translate(frame.x, frame.y);
        var cut = frame.memory.mXF - frame.x;
        x0 = Math.floor(cut * frame.memory.fOpen);
        x1 = Math.ceil(frame.width - (frame.width - cut) * frame.memory.fOpen);

        graphics.drawImage(frame.memory.image, 0, 0, cut, flowFrame.height, 0, 0, x0, flowFrame.height);
        graphics.drawImage(frame.memory.image, cut, 0, (frame.width - cut), flowFrame.height, x1, 0, (frame.width - cut) * frame.memory.fOpen, flowFrame.height);

        NumberTableDraw._drawPartialFlow(flowFrame, frame.memory.flowIntervals, frame.memory.names, frame.memory.actualColorList, cut, x0, x1, 0.3, sorted, showValues ? numberTable : null);

        graphics.context.restore();
      } else {
        graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
      }
    }

    if(horizontalLabels) NumberTableDraw._drawHorizontalLabels(frame, frame.getBottom() - 5, numberTable, horizontalLabels, x0, x1);
  };

  NumberTableDraw._drawHorizontalLabels = function(frame, y, numberTable, horizontalLabels, x0, x1, graphics) {
    var dx = frame.width / (numberTable[0].length - 1);
    var x;
    var mX2 = Math.min(Math.max(graphics.mX, frame.x + 1), frame.getRight() - 1);
    var iPosDec = (mX2 - frame.x) / dx;
    var iPos = Math.round(iPosDec);

    x0 = x0 == null ? frame.x : x0 + frame.x;
    x1 = x1 == null ? frame.x : x1 + frame.x;

    horizontalLabels.forEach(function(label, i) {
      graphics.setText('black', (i == iPos && x1 > (x0 + 4)) ? 14 : 10, null, 'center', 'middle');

      if(x0 > x1 - 5) {
        x = frame.x + i * dx;
      } else if(iPos == i) {
        x = (x0 + x1) * 0.5 - (x1 - x0) * (iPosDec - iPos);
      } else {
        x = frame.x + i * dx;
        if(x < mX2) {
          x = frame.x + i * dx * frame.memory.fOpen;
        } else if(x > mX2) {
          x = frame.x + i * dx * frame.memory.fOpen + (x1 - x0);
        }
      }
      graphics.fText(horizontalLabels[i], x, y);
    });
  };

  NumberTableDraw._drawPartialFlow = function(frame, flowIntervals, labels, colors, x, x0, x1, OFF_X, sorted, numberTable, graphics) {
    var w = x1 - x0;
    var wForText = numberTable == null ? (x1 - x0) : (x1 - x0) * 0.85;

    var nDays = flowIntervals[0].length;

    var wDay = frame.width / (nDays - 1);

    var iDay = (x - frame.x) / wDay; // Math.min(Math.max((nDays-1)*(x-frame.x)/frame.width, 0), nDays-1);
    iDay = Math.max(Math.min(iDay, nDays - 1), 0);

    var i;
    var i0 = Math.floor(iDay);
    var i1 = Math.ceil(iDay);

    var interval0;
    var interval1;

    var y, h;

    var wt;
    var pt;

    var text;

    var offX = OFF_X * wDay; //*(frame.width-(x1-x0))/nDays; //not taken into account

    //var previOver = iOver;
    var iOver = -1;

    var X0, X1, xx;

    var ts0, ts1;

    for(i = 0; flowIntervals[i] != null; i++) {

      graphics.setFill(colors[i]);
      interval0 = flowIntervals[i][i0];
      interval1 = flowIntervals[i][i1];

      X0 = Math.floor(iDay) * wDay;
      X1 = Math.floor(iDay + 1) * wDay;

      xx = x;

      y = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.x, interval1.x, X0 + offX, X1 - offX, xx);
      h = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.y, interval1.y, X0 + offX, X1 - offX, xx) - y;

      y = y * frame.height + frame.y;
      h *= frame.height;

      //if(h<1) continue;

      if(graphics.fRectM(x0, y, w, h)) iOver = i;

      if(h >= 5 && w > 40) {
        graphics.setText('white', h, null, null, 'middle');

        text = labels[i];

        wt = graphics.getTextW(text);
        pt = wt / wForText;

        if(pt > 1) {
          graphics.setText('white', h / pt, null, null, 'middle');
        }

        graphics.context.fillText(text, x0, y + h * 0.5);

        if(numberTable) {
          wt = graphics.getTextW(text);

          ts0 = Math.min(h, h / pt);
          ts1 = Math.max(ts0 * 0.6, 8);

          graphics.setText('white', ts1, null, null, 'middle');
          graphics.fText(Math.round(numberTable[i][i0]), x0 + wt + w * 0.03, y + (h + (ts0 - ts1) * 0.5) * 0.5);
        }


      }
    }

    return iOver;
  };



  /**
   * draws a circular steamgraph Without labels
   * @param {Rectangle} frame
   * @param {NumberTable} numberTable
   *
   * @param {Boolean} normalized normalize each column, making the graph of constant height
   * @param {Boolean} sorted sort flow polygons
   * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons
   * @param {ColorList} colorList colors of polygons
   * @param {List} names names of rows
   * @return {NumberList} list of positions of elements on clicked coordinates
   * tags:draw
   */
  NumberTableDraw.drawCircularStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, colorList, names, graphics) {
    if(numberTable == null ||  numberTable.length < 2 || numberTable[0].length < 2 || numberTable.type != "NumberTable") return;

    intervalsFactor = intervalsFactor == null ? 1 : intervalsFactor;

    //setup
    if(frame.memory == null || numberTable != frame.memory.numberTable || normalized != frame.memory.normalized || sorted != frame.memory.sorted || intervalsFactor != frame.memory.intervalsFactor || frame.width != frame.memory.width || frame.height != frame.memory.height) {
      frame.memory = {
        numberTable: numberTable,
        normalized: normalized,
        sorted: sorted,
        intervalsFactor: intervalsFactor,
        flowIntervals: IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(numberTable, normalized, sorted), intervalsFactor),
        fOpen: 1,
        names: numberTable.getNames(),
        mXF: graphics.mX,
        width: frame.width,
        height: frame.height,
        radius: Math.min(frame.width, frame.height) * 0.46 - (names == null ? 0 : 8),
        r0: Math.min(frame.width, frame.height) * 0.05,
        angles: new NumberList(),
        zoom: 1,
        angle0: 0,
        image: null
      };

      var dA = TwoPi / numberTable[0].length;
      numberTable[0].forEach(function(val, i) {
        frame.memory.angles[i] = i * dA;
      });
    }
    if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
      frame.memory.actualColorList = colorList == null ? ColorListGenerators.createDefaultCategoricalColorList(numberTable.length, 0.4) : colorList;
      frame.memory.colorList = colorList;
    }

    var mouseOnFrame = frame.containsPoint(graphics.mP);

    if(mouseOnFrame) {
      if(graphics.MOUSE_DOWN) {
        frame.memory.downX = graphics.mX;
        frame.memory.downY = graphics.mY;
        frame.memory.pressed = true;
        frame.memory.zoomPressed = frame.memory.zoom;
        frame.memory.anglePressed = frame.memory.angle0;
      }

      frame.memory.zoom *= (1 - 0.4 * graphics.WHEEL_CHANGE);
    }

    if(graphics.MOUSE_UP) frame.memory.pressed = false;
    if(frame.memory.pressed) {
      var center = frame.getCenter();
      var dx0 = frame.memory.downX - center.x;
      var dy0 = frame.memory.downY - center.y;
      var d0 = Math.sqrt(Math.pow(dx0, 2) + Math.pow(dy0, 2));
      var dx1 = graphics.mX - center.x;
      var dy1 = graphics.mY - center.y;
      var d1 = Math.sqrt(Math.pow(dx1, 2) + Math.pow(dy1, 2));
      frame.memory.zoom = frame.memory.zoomPressed * ((d1 + 5) / (d0 + 5));
      var a0 = Math.atan2(dy0, dx0);
      var a1 = Math.atan2(dy1, dx1);
      frame.memory.angle0 = frame.memory.anglePressed + a1 - a0;
    }

    if(mouseOnFrame) frame.memory.image = null;

    var captureImage = frame.memory.image == null && !mouseOnFrame;
    var drawingImage = !mouseOnFrame && frame.memory.image != null &&  !captureImage;

    if(drawingImage) {
      graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    } else {
      if(captureImage) {
        // TODO refactor to not reassign context
        // var newCanvas = document.createElement("canvas");
        // newCanvas.width = frame.width;
        // newCanvas.height = frame.height;
        // var newContext = newCanvas.getContext("2d");
        // newContext.clearRect(0, 0, frame.width, frame.height);
        // var mainContext = context;
        // context = newContext;
        // var prevFx = frame.x;
        // var prevFy = frame.y;
        // frame.x = 0;
        // frame.y = 0;
        // setFill('white');
        // fRect(0, 0, frame.width, frame.height);
      }

      graphics.context.save();
      graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);

      IntervalTableDraw.drawCircularIntervalsFlowTable(frame.memory.flowIntervals, frame.getCenter(), frame.memory.radius * frame.memory.zoom, frame.memory.r0, frame.memory.actualColorList, frame.memory.names, true, frame.memory.angles, frame.memory.angle0);

      graphics.context.restore();

      if(names) {
        var a;
        var r = frame.memory.radius * frame.memory.zoom + 8;

        graphics.setText('black', 14, null, 'center', 'middle');

        names.forEach(function(name, i) {
          a = frame.memory.angle0 + frame.memory.angles[i];

          graphics.fTextRotated(String(name), frame.getCenter().x + r * Math.cos(a), frame.getCenter().y + r * Math.sin(a), a + HalfPi);
        });
      }


      if(captureImage) {
        // TODO refactor to not reassign context
        // context = mainContext;
        // frame.memory.image = new Image();
        // frame.memory.image.src = newCanvas.toDataURL();
        // frame.x = prevFx;
        // frame.y = prevFy;
        // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
      }
    }
  };

  /**
   * @classdesc Functions for drawing Strings
   *
   * @namespace
   * @category drawing
   */
  function StringDraw() {}
  /**
   * draws a String (if the object is not a string it displays the json)
   * @param  {Rectangle} frame
   * @param  {Object} object normally a String (if not, a conversion will be made)
   *
   * @param  {Number} fontSize
   * @param  {String} fontStyle ex:'bold italic'
   * @param  {Number} margin
   * @return {Object}
   * tags:draw
   */
  StringDraw.drawText = function(frame, object, fontSize, fontStyle, margin, graphics) {
    if(frame==null || object==null) return;

    if(graphics==null) graphics = frame.graphics; //momentary fix

    margin = margin || 10;
    fontSize = fontSize || 12;

    var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
    subframe.bottom = subframe.getBottom();

    var lineHeight = Math.floor(fontSize * 1.2);

    graphics.setText('black', fontSize, null, null, null, fontStyle);

    var significantChange = frame.memory == null || object != frame.memory.object || fontSize != frame.memory.fontSize || fontStyle != frame.memory.fontStyle || margin != frame.memory.margin || frame.width != frame.memory.width || frame.height != frame.memory.height;

    //setup
    if(significantChange) {
      var realString = object == null ?
  						""
  						:
        (typeof object == 'string') ?
  							object
  							:
        JSON.stringify(object, null, "\t");
      frame.memory = {
        textLines: DrawTexts.textWordWrapReturnLines(realString, subframe.width, subframe.height, lineHeight, true, graphics),
        object: object,
        fontSize: fontSize,
        fontStyle: fontStyle,
        margin: margin,
        width: frame.width,
        height: frame.height
      };
    }

    DrawTexts.fillTextRectangleWithTextLines(frame.memory.textLines, subframe.x, subframe.y, subframe.height, lineHeight, null, graphics);
  };

  /**
   * @classdesc Functions for drawing objects.
   *
   * @namespace
   * @category drawing
   */
  function ObjectDraw() {}
  /**
   * counts the number of times the function is called
   * @param  {Rectangle} frame
   * @param  {Object} object
   * tags:draw
   */
  ObjectDraw.count = function(frame, object, graphics) {
    if(graphics==null) graphics = frame.graphics;
    
    if(frame.memory == null) {
      frame.memory = {
        n: 1,
        object: object
      };
    }

    if(frame.memory.object != object) {
      frame.memory.object = object;
      frame.memory.n++;
    }

    if(graphics.MOUSE_DOWN && frame.containsPoint(graphics.mP)) frame.memory.n = 0;

    graphics.setText('black', 12);
    graphics.fText(frame.memory.n, frame.x + 10, frame.y + 10);
  };

  /**
   * @classdesc Operators that contain visualization method algoritms and return a Table with parameters for StringListPrimitive
   *
   * @namespace
   * @category drawing
   */
  function StringListDraw() {}
  /**
   * @todo write docs
   */
  StringListDraw.simpleTagCloud = function(stringList, weights, frame, font, interLineFactor, graphics) {
    font = font == null ? 'Arial' : font;
    interLineFactor = interLineFactor == null ? 1.2 : interLineFactor;

    var i;
    var j;
    var xx;
    var yy;
    var tag;
    var wT;

    var sT;
    var maxST;

    var K = 20;
    var i0Line;

    var normWeigths = NumberListOperators.normalizedToMax(weights);

    var sizes;
    var positions;

    var notFinished = true;

    var trys = 0;

    while(notFinished) {
      var interLine = K * interLineFactor;
      xx = 0;
      yy = 0; //interLine;
      maxST = 0;
      i0Line = 0;

      sizes = new NumberList();
      positions = new _Polygon();

      for(i = 0; stringList[i] != null; i++) {
        tag = stringList[i];
        sT = Math.floor(Math.sqrt(normWeigths[i]) * K);

        sizes.push(sT);

        graphics.context.font = String(sT) + 'px ' + font;
        wT = graphics.context.measureText(tag).width;

        if(xx + wT > frame.width) {
          xx = 0;
          yy += (maxST * interLineFactor + 1);
          maxST = 0;
          for(j = i0Line; j < i; j++) {
            positions[j].y = yy;
          }
          i0Line = i;
        }

        maxST = Math.max(maxST, sT);
        positions.push(new _Point(xx, yy));
        xx += wT + sT * 0.2;
      }

      yy += (maxST * interLineFactor + 1);
      for(j = i0Line; stringList[j] != null; j++) {
        positions[j].y = yy;
      }


      notFinished = false;
      if(yy < frame.height * 0.97) {
        K = 0.5 * K + 0.5 * K * frame.height / (yy + interLine);
        notFinished = true;
      }
      if(yy >= frame.height * 0.995) {
        K = 0.5 * K + 0.5 * K * frame.height / (yy + interLine);
        notFinished = true;
      }
      trys++;
      if(trys > 10) notFinished = false;
    }

    var table = new Table();
    table[0] = stringList;
    table[1] = positions;
    table[2] = sizes;

    return table;
  };



  /**
   * @todo write docs
   */
  StringListDraw.tagCloudRectangles = function(stringList, weights, frame, mode, margin, graphics) {
    mode = mode == null ? 0 : mode;
    margin = margin == null ? 0 : margin;

    var normWeights = NumberListOperators.normalizedToMax(weights.sqrt());

    var roundSizes = (mode === 0);

    var rectangles = new List();
    var textSizes = new NumberList();

    var rectanglesPlaced = new List();

    var dL = 6;

    var a = 0;
    var r = 0;

    var px;
    var py;
    var center;
    var rMax = 0;

    switch(mode) {
      case 0: //open triangle
        px = frame.x;
        py = frame.y;
        break;
      case 2: //rectangle
        var jump = 5;
        var nStep = 0;
        var nSteps = 1;
        var pc = new _Point();
        break;
      case 1: //circle
        px = 0;
        py = 0;
        center = frame.getCenter();
        break;
    }

    var w;
    var h;
    var prop = frame.width / frame.height;

    for(var i = 0; stringList[i] != null; i++) {
      textSizes[i] = roundSizes ? Math.round(normWeights[i] * 12) * dL : normWeights[i] * 12 * dL;

      DrawTexts.setContextTextProperties('black', textSizes[i], graphics.fontName, null, null, 'bold');
      w = Math.ceil((2 + graphics.context.measureText(stringList[i]).width) / dL) * dL;
      h = textSizes[i];

      switch(mode) {
        case 0: //open triangle
          while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
            px += dL;
            py -= dL;
            if(py < frame.y) {
              py = frame.y; //TODO this used to be p.x - but p is not defined.
              px = frame.x;
            }
          }
          break;
        case 1: //circle
          if(i === 0) {
            px = center.x - w * 0.5;
            py = center.y - h * 0.5;
          } else {
            a = i * 0.1;
            r = 0;
            while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
              r += 1;
              a += r * 0.005;

              px = center.x + prop * r * Math.cos(a) - w * 0.5;
              py = center.y + r * Math.sin(a) - h * 0.5;
            }
            rMax = Math.max(rMax, prop * r + w * 0.5);
          }
          break;
        case 2: //rectangle
          if(i === 0) {
            pc = center.clone();
            px = pc.x - w * 0.5;
            py = pc.y - h * 0.5;
          } else {
            nStep = 0;
            nSteps = 1;
            a = 0;
            pc = center.clone();
            while(StringListDraw._pointInRectangles(rectanglesPlaced, px, py, w, h, margin)) {
              nStep++;

              pc.x += prop * jump * Math.cos(a);
              pc.y += jump * Math.sin(a);

              px = pc.x - w * 0.5;
              py = pc.y - h * 0.5;

              if(nStep >= nSteps) {
                a += Math.PI * 0.5;
                nSteps += 0.5;
                nStep = 0;
              }
            }
            rMax = Math.max(Math.abs(pc.x - center.x) + w * 0.5, rMax);
          }
          break;

      }

      rectangles[i] = new Rectangle(px, py, w, h);
      rectanglesPlaced.push(rectangles[i]);
    }

    if(mode == 1 || mode == 2) {
      var rectangle;
      prop = 0.5 * frame.width / rMax;
      for(i = 0; rectangles[i] != null; i++) {
        rectangle = rectangles[i];
        rectangle.x = center.x + (rectangle.x - center.x) * prop;
        rectangle.y = center.y + (rectangle.y - center.y) * prop;
        rectangle.width *= prop;
        rectangle.height *= prop;
        textSizes[i] *= prop;
      }
    }

    var table = new Table();
    table[0] = stringList;
    table[1] = rectangles;
    table[2] = textSizes;

    return table;
  };

  /**
   * @ignore
   */
  StringListDraw._pointInRectangles = function(rectangles, px, py, width, height, margin) {
    var rect;
    for(var i = 0; rectangles[i] != null; i++) {
      rect = rectangles[i];
      if(px + width > (rect.x - margin) && px < (rect.x + rect.width + margin) && (py + height) > (rect.y - margin) && py < (rect.y + rect.height + margin)) return true;
    }
    return false;
  };

  /**
   * @classdesc Functions for drawing {@link Tree|Trees}.
   *
   * @namespace
   * @category drawing
   */
  function TreeDraw() {}
  /**
   * Simple tree visualization with levels in vertical rectangles.
   *
   * @param {Rectangle} frame
   * @param {Tree} tree The Tree to draw.
   *
   * @param {ColorList} levelColors
   * @param {Number} margin
   * tags:draw
   */
  TreeDraw.drawRectanglesTree = function(frame, tree, levelColors, margin) {
    levelColors = levelColors == null ? ColorListGenerators.createCategoricalColors(1, tree.nLevels) : levelColors;
    margin = margin || 1;

    var dX = frame.width / tree.nLevels;
    TreeDraw._drawRectanglesTreeChildren(tree.nodeList[0], new Rectangle(frame.x, frame.y, dX, frame.height), levelColors, margin);
  };

  TreeDraw._drawRectanglesTreeChildren = function(node, frame, colors, margin, graphics) {
    graphics.context.fillStyle = colors[node.level];
    graphics.context.fillRect(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
    var children = node.toNodeList;
    //console.log((node.level, node.name, children.length);
    if(children.length > 0) {
      var i;
      var dY = frame.height / (node.descentWeight - 1);
      var yy = frame.y;
      var h;
      for(i = 0; children[i] != null; i++) {
        h = dY * (children[i].descentWeight);
        TreeDraw._drawRectanglesTreeChildren(children[i], new Rectangle(frame.x + frame.width, yy, frame.width, h), colors, margin);
        yy += h;
      }
    }
  };


  /**
   * Creates a simple treemap visualization.
   *
   * @param {Rectangle} frame
   * @param {Tree} tree The Tree to draw.
   *
   * @param {ColorList} colorList
   * @param {NumberList} weights weights of leaves
   * @param {String} textColor if not provided will be calculated to contrast node color
   * @param {Node} externalSelectedNode node to force selection (by id)
   * @return {Node} selected node
   * tags:draw
   */
  TreeDraw.drawTreemap = function(frame, tree, colorList, weights, textColor, externalSelectedNode, graphics) {
    if(frame==null || tree==null) return;

    if(graphics==null) graphics = frame.graphics; //momentary fix

    var change = frame.memory == null || frame.memory.tree != tree || frame.memory.width != frame.width || frame.memory.height != frame.height || frame.memory.weights != weights;

    if(externalSelectedNode != null) externalSelectedNode = tree.nodeList.getNodeById(externalSelectedNode.id);

    var changeSelection = (externalSelectedNode != null && (frame.memory == null || externalSelectedNode != frame.memory.nodeSelected));

    if(change) {
      var changeInTree = frame.memory != null && frame.memory.tree != null != tree;
      //var changeInWeights = frame.memory != null && frame.memory.weights != weights;

      frame.memory = {
        tree: tree,
        width: frame.width,
        height: frame.height,
        weights: weights,
        nodeSelected: tree.nodeList[0],
        nFLastChange: graphics.nF,
        image: null
      };

      var leaves = (!changeInTree && frame.memory.leaves) ? frame.memory.leaves : tree.getLeaves();
      frame.memory.leaves = leaves;

      if(weights == null) {
        tree.nodeList.forEach(function(node) {
          node._treeMapWeight = node.descentWeight;
        });
      } else {
        leaves.forEach(function(node, i) {
          node._treeMapWeight = weights[i];
        });
        var assignTreemapWeight = function(node) {
          var i;
          if(node.toNodeList.length === 0) {
            return node._treeMapWeight;
          } else {
            node._treeMapWeight = 0;
            for(i = 0; node.toNodeList[i] != null; i++) {
              node._treeMapWeight += assignTreemapWeight(node.toNodeList[i]);
            }
          }
          return node._treeMapWeight;
        };
        assignTreemapWeight(tree.nodeList[0]);
      }

      tree.nodeList[0]._outRectangle = new Rectangle(0, 0, frame.width, frame.height);
      tree.nodeList[0]._inRectangle = TreeDraw._inRectFromOutRect(tree.nodeList[0]._outRectangle);
      TreeDraw._generateRectangles(tree.nodeList[0]);

      frame.memory.focusFrame = TreeDraw._expandRect(tree.nodeList[0]._outRectangle);
      //c.l('frame.memory.focusFrame', frame.memory.focusFrame);

      frame.memory.kx = frame.width / frame.memory.focusFrame.width;
      frame.memory.mx = -frame.memory.kx * frame.memory.focusFrame.x;
      frame.memory.ky = frame.height / frame.memory.focusFrame.height;
      frame.memory.my = -frame.memory.ky * frame.memory.focusFrame.y;

      graphics.setText('black', 12);
      tree.nodeList.forEach(function(node) {
        node._textWidth = graphics.getTextW(node.name);
      });
    }

    if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
      frame.memory.nFLastChange = graphics.nF;
      frame.memory.image = null;
      frame.memory.actualColorList = colorList == null ? ColorListGenerators.createCategoricalColors(0, tree.nLevels, ColorScales.grayToOrange, 0.1) : colorList;
      frame.memory.nodesColorList = new ColorList();
      if(textColor == null) frame.memory.textsColorList = new ColorList();

      if(frame.memory.actualColorList.length <= tree.nLevels) {
        tree.nodeList.forEach(function(node, i) {
          frame.memory.nodesColorList[i] = node._color = frame.memory.actualColorList[node.level % frame.memory.actualColorList.length];
        });
      } else if(frame.memory.actualColorList.length == frame.memory.leaves.length) {
        frame.memory.leaves.forEach(function(node, i) {
          node._color = frame.memory.actualColorList[i];
          node._rgb = ColorOperators.colorStringToRGB(node._color);
        });
        var assignColor = function(node) {
          var i;
          if(node.toNodeList.length === 0) return;

          node._rgb = [0, 0, 0];
          for(i = 0; node.toNodeList[i] != null; i++) {
            assignColor(node.toNodeList[i]);
            node._rgb[0] += node.toNodeList[i]._rgb[0];
            node._rgb[1] += node.toNodeList[i]._rgb[1];
            node._rgb[2] += node.toNodeList[i]._rgb[2];
          }
          node._rgb[0] = Math.floor(node._rgb[0] / node.toNodeList.length);
          node._rgb[1] = Math.floor(node._rgb[1] / node.toNodeList.length);
          node._rgb[2] = Math.floor(node._rgb[2] / node.toNodeList.length);
        };
        assignColor(tree.nodeList[0]);
        tree.nodeList.forEach(function(node, i) {
          if(node._rgb && node._rgbF == null) node._rgbF = [node._rgb[0], node._rgb[1], node._rgb[2]];
          frame.memory.nodesColorList[i] = 'rgb(' + node._rgb[0] + ',' + node._rgb[1] + ',' + node._rgb[2] + ')';
        });
      } else {
        tree.nodeList.forEach(function(node, i) {
          node._color = frame.memory.nodesColorList[i] = frame.memory.actualColorList[i % frame.memory.actualColorList.length];
        });
      }

      if(textColor == null) {
        var rgb;
        tree.nodeList.forEach(function(node, i) {
          rgb = node._color ? ColorOperators.colorStringToRGB(node._color) : [0, 0, 0];
          frame.memory.textsColorList[i] = (rgb[0] + rgb[1] + rgb[2] > 360) ? 'black' : 'white';
        });
      }

      frame.memory.colorList = colorList;
    }

    if(textColor == null) textColor = 'black';

    var kxF = frame.width / frame.memory.focusFrame.width;
    var mxF = -kxF * frame.memory.focusFrame.x;
    var kyF = frame.height / frame.memory.focusFrame.height;
    var myF = -kyF * frame.memory.focusFrame.y;

    var v = kxF > frame.memory.kx ? 0.05 : 0.1;
    var antiv = 1 - v;

    frame.memory.kx = antiv * frame.memory.kx + v * kxF;
    frame.memory.mx = antiv * frame.memory.mx + v * mxF;
    frame.memory.ky = antiv * frame.memory.ky + v * kyF;
    frame.memory.my = antiv * frame.memory.my + v * myF;
    var kx = frame.memory.kx;
    var mx = frame.memory.mx;
    var ky = frame.memory.ky;
    var my = frame.memory.my;

    var tx = function(x) {
      return kx * x + mx;
    };
    var ty = function(y) {
      return ky * y + my;
    };


    var x, y;
    var margTextX, margTextY;
    var textSize;
    var exceedes;
    var rect;
    var overNode = null;
    var overI;
    var mouseOnFrame = frame.containsPoint(graphics.mP);
    var moving = graphics.nF - frame.memory.nFLastChange < 50 || Math.pow(frame.memory.kx - kxF, 2) + Math.pow(frame.memory.ky - kyF, 2) + Math.pow(frame.memory.mx - mxF, 2) + Math.pow(frame.memory.my - myF, 2) > 0.01;
    var captureImage = !moving && frame.memory.image == null && !mouseOnFrame;
    var drawingImage = !moving && !mouseOnFrame && frame.memory.image != null &&  !captureImage && frame.memory.image.width > 0 && !changeSelection;

    if(drawingImage) {
      graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    } else {
      if(captureImage) {
        // TODO refactor this to not reassign context
        // var newCanvas = document.createElement("canvas");
        // newCanvas.width = frame.width;
        // newCanvas.height = frame.height;
        // var newContext = newCanvas.getContext("2d");
        // newContext.clearRect(0, 0, frame.width, frame.height);
        // var mainContext = context;
        // context = newContext;
        // var prevFx = frame.x;
        // var prevFy = frame.y;
        // frame.x = 0;
        // frame.y = 0;
        // setFill('white');
        // fRect(0, 0, frame.width, frame.height);
        // setText('black', 12);
      } else {
        graphics.context.save();
        graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);
      }

      graphics.setStroke('black', 0.2);

      tree.nodeList.forEach(function(node, i) {

        rect = new Rectangle(tx(node._outRectangle.x), ty(node._outRectangle.y), node._outRectangle.width * kx, node._outRectangle.height * ky);

        if(rect.width > 5 && rect.height > 4 && rect.x < frame.width && rect.getRight() > 0 && rect.y < frame.height && rect.getBottom() > 0) {

          x = Math.round(frame.x + rect.x) + 0.5;
          y = Math.round(frame.y + rect.y) + 0.5;

          if(node._rgbF) {
            node._rgbF[0] = 0.95 * node._rgbF[0] + 0.05 * node._rgb[0];
            node._rgbF[1] = 0.95 * node._rgbF[1] + 0.05 * node._rgb[1];
            node._rgbF[2] = 0.95 * node._rgbF[2] + 0.05 * node._rgb[2];
            graphics.setFill('rgb(' + Math.floor(node._rgbF[0]) + ',' + Math.floor(node._rgbF[1]) + ',' + Math.floor(node._rgbF[2]) + ')');
          } else {
            graphics.setFill(frame.memory.nodesColorList[i]);
          }

          if(graphics.fsRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
            overNode = node;
            overI = i;
          }
          if(rect.width > 20) {
            margTextX = rect.width * TreeDraw.PROP_RECT_MARGIN * 0.8;
            margTextY = rect.height * TreeDraw.PROP_RECT_MARGIN * 0.15;
            textSize = rect.height * TreeDraw.PROP_RECT_LABEL - 2;
            if(textSize >= 5) {

              var propTextSpace = (rect.width - 2 * margTextX) / (node._textWidth * textSize / 12);
              exceedes = propTextSpace < 1; //(node._textWidth*textSize/12)>(rect.width-1.2*margTextX);

              if(exceedes) {
                //clipRectangle(x+margTextX, y+margTextY,rect.width-2*margTextX, textSize*2);
                graphics.setText(textColor ? textColor : frame.memory.textsColorList[i], textSize * propTextSpace);
              } else {
                graphics.setText(textColor ? textColor : frame.memory.textsColorList[i], textSize);
              }

              graphics.fText(node.name, x + margTextX, y + margTextY);
              //if(exceedes) context.restore();
            }
          }
        }
      });

      if(captureImage) {
        //c.l('captureImage');
        // TODO refactor this to not reassign context
        // context = mainContext;
        // frame.memory.image = new Image();
        // frame.memory.image.src = newCanvas.toDataURL();
        // frame.x = prevFx;
        // frame.y = prevFy;
        // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
      }
    }

    if(mouseOnFrame) {
      if(overNode) {
        graphics.setCursor('pointer');

        rect = new Rectangle(tx(overNode._outRectangle.x), ty(overNode._outRectangle.y), overNode._outRectangle.width * kx, overNode._outRectangle.height * ky);
        x = Math.round(frame.x + rect.x) + 0.5;
        y = Math.round(frame.y + rect.y) + 0.5;
        graphics.setStroke(textColor ? textColor : frame.memory.textsColorList[overI], 2);
        graphics.sRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

        if(graphics.MOUSE_UP_FAST) {
          frame.memory.focusFrame = TreeDraw._expandRect(overNode._outRectangle);
          frame.memory.nodeSelected = overNode;

          frame.memory.image = null;
        }
      }
      if(graphics.MOUSE_DOWN) {
        frame.memory.prevMX = graphics.mX;
        frame.memory.prevMY = graphics.mY;
      }
      if(graphics.MOUSE_PRESSED) {
        var scale = 5 * frame.memory.focusFrame.width / frame.width;
        frame.memory.focusFrame.x -= (graphics.mX - frame.memory.prevMX) * scale;
        frame.memory.focusFrame.y -= (graphics.mY - frame.memory.prevMY) * scale;

        frame.memory.prevMX = graphics.mX;
        frame.memory.prevMY = graphics.mY;
      }
      if(graphics.WHEEL_CHANGE !== 0) {
        var center = frame.memory.focusFrame.getCenter();
        var zoom = 1 - 0.1 * graphics.WHEEL_CHANGE;
        frame.memory.focusFrame.x = center.x - frame.memory.focusFrame.width * 0.5 * zoom;
        frame.memory.focusFrame.y = center.y - frame.memory.focusFrame.height * 0.5 * zoom;
        frame.memory.focusFrame.width *= zoom;
        frame.memory.focusFrame.height *= zoom;
      }
      if(graphics.MOUSE_PRESSED || graphics.WHEEL_CHANGE !== 0) {
        frame.memory.image = null;
      }
    }

    if(changeSelection) {
      frame.memory.focusFrame = TreeDraw._expandRect(externalSelectedNode._outRectangle);
      frame.memory.nodeSelected = externalSelectedNode;
      frame.memory.image = null;
    }

    if(!captureImage && !drawingImage) graphics.context.restore();


    return frame.memory.nodeSelected;

  };

  /**
   * @ignore
   */
  TreeDraw._generateRectangles = function(node) {

    var weights = new NumberList();
    node.toNodeList.forEach(function(node) {
      weights.push(node._treeMapWeight);
    });

    var rectangles = RectangleOperators.squarify(node._inRectangle, weights, false, false);

    node.toNodeList.forEach(function(child, i) {
      child._outRectangle = TreeDraw._reduceRect(rectangles[i]);
      child._inRectangle = TreeDraw._inRectFromOutRect(child._outRectangle);
      TreeDraw._generateRectangles(child);
    });
  };

  /**
   * @ignore
   */
  TreeDraw._reduceRect = function(rect) {
    return new Rectangle(rect.x + rect.width * TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.y + rect.height * TreeDraw.PROP_RECT_REDUCTION_MARGIN, rect.width * (1 - 2 * TreeDraw.PROP_RECT_REDUCTION_MARGIN), rect.height * (1 - 2 * TreeDraw.PROP_RECT_REDUCTION_MARGIN));
  };
  TreeDraw._expandRect = function(rect) {
    return new Rectangle(rect.x - rect.width * TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.y - rect.height * TreeDraw.PROP_RECT_EXPANTION_MARGIN, rect.width * (1 + 2 * TreeDraw.PROP_RECT_EXPANTION_MARGIN), rect.height * (1 + 2 * TreeDraw.PROP_RECT_EXPANTION_MARGIN));
  };
  TreeDraw._inRectFromOutRect = function(rect) {
    return new Rectangle(rect.x + rect.width * TreeDraw.PROP_RECT_MARGIN, rect.y + rect.height * TreeDraw.PROP_RECT_LABEL, rect.width * (1 - 2 * TreeDraw.PROP_RECT_MARGIN), rect.height * (1 - TreeDraw.PROP_RECT_MARGIN - TreeDraw.PROP_RECT_LABEL));
  };
  TreeDraw.PROP_RECT_MARGIN = 0.03;
  TreeDraw.PROP_RECT_LABEL = 0.2;
  TreeDraw.PROP_RECT_REDUCTION_MARGIN = 0.01;
  TreeDraw.PROP_RECT_EXPANTION_MARGIN = 0.05;



  ///////////////////////////decision tree



  /**
   * Decision tree visualization, tree from {@link TableOperators}'s buildDecisionTree function.
   *
   * @param {Rectangle} frame
   * @param {Tree} tree
   *
   * @param {String} textColor
   * @return {Node} selected node
   * @return {Node} hovered node
   * tags:draw,ds
   */
  TreeDraw.drawDecisionTree = function(frame, tree, textColor, graphics) {
    if(frame==null || tree==null) return;

    if(graphics==null) graphics = frame.graphics; //momentary fix

    var change = frame.memory == null || frame.memory.tree != tree || frame.memory.width != frame.width || frame.memory.height != frame.height;

    textColor = textColor||'black';

    var gap = frame.height * 0.06;
    var hTree = tree.nLevels * (frame.height - gap) / (tree.nLevels + 1);
    var hLevel = hTree / tree.nLevels;
    var changeInResult = false;

    if(change) {
      var changeInTree = frame.memory != null && frame.memory.tree != null && frame.memory.tree != tree;

      frame.memory = {
        tree: tree,
        width: frame.width,
        height: frame.height,
        nodeSelected: tree.nodeList[0],
        nFLastChange: graphics.nF,
        leaves: null,
        image: null
      };

      if(changeInTree || frame.memory.leaves == null) {
        frame.memory.leaves = tree.getLeaves().getSortedByProperty('valueFollowingProbability', false);
      }



      tree.nodeList[0]._outRectangle = new Rectangle(0, 0, frame.width, hTree);
      tree.nodeList[0]._inRectangle = TreeDraw._inRectFromOutRectDecision(tree.nodeList[0]._outRectangle, hLevel);
      TreeDraw._generateRectanglesDecision(tree.nodeList[0], hLevel);

      frame.memory.focusFrame = new Rectangle(0, 0, frame.width, frame.height);
      frame.memory.kx = frame.width / frame.memory.focusFrame.width;
      frame.memory.mx = -frame.memory.kx * frame.memory.focusFrame.x;
      frame.memory.ky = frame.height / frame.memory.focusFrame.height;
      frame.memory.my = -frame.memory.ky * frame.memory.focusFrame.y;

      graphics.setText(textColor, 12);
      tree.nodeList.forEach(function(node) {
        node.label = node.toNodeList.length === 0 ? Math.round(node.valueFollowingProbability * 100) / 100 : node.bestFeatureName;
        node._textWidth = graphics.getTextW(node.label);
      });


    }

    if(frame.memory.followingWeights) {
      tree.nodeList.forEach(function(node) {
        node._treeMapWeight = node.descentWeight;
      });
    }

    var kxF = frame.width / frame.memory.focusFrame.width;
    var mxF = -kxF * frame.memory.focusFrame.x;

    var v = kxF > frame.memory.kx ? 0.05 : 0.1;
    var antiv = 1 - v;

    frame.memory.kx = antiv * frame.memory.kx + v * kxF;
    frame.memory.mx = antiv * frame.memory.mx + v * mxF;
    var kx = frame.memory.kx;
    var mx = frame.memory.mx;

    var tx = function(x) {
      return kx * x + mx;
    };

    var x, y;
    var margTextX, margTextY;
    var textSize;
    var exceedes;
    var rect;
    var overNode = null;
    var overI;
    var mouseOnFrame = frame.containsPoint(graphics.mP);
    //var moving = graphics.nF - frame.memory.nFLastChange < 80 || Math.pow(frame.memory.kx - kxF, 2) + Math.pow(frame.memory.mx - mxF, 2) > 0.001;
    var captureImage = false;//provisional // !moving && frame.memory.image == null && !mouseOnFrame;
    var drawingImage = false;//provisional // !moving && !mouseOnFrame && frame.memory.image != null &&  !captureImage && frame.memory.image.width > 0;
    var yLeaves;
    
    if(drawingImage) {
      graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    } else {
      //c.l('drawing');
      if(captureImage) {
        // TODO refactor this to not reassign context
        // var newCanvas = document.createElement("canvas");
        // newCanvas.width = frame.width;
        // newCanvas.height = frame.height;
        // var newContext = newCanvas.getContext("2d");
        // newContext.clearRect(0, 0, frame.width, frame.height);
        // var mainContext = context;
        // context = newContext;
        // var prevFx = frame.x;
        // var prevFy = frame.y;
        // frame.x = 0;
        // frame.y = 0;
        // setFill('white');
        // fRect(0, 0, frame.width, frame.height);
        // setText('black', 12);
      } else {
        graphics.context.save();
        graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);
      }

      yLeaves = frame.y + hTree + gap;

      graphics.setStroke('black', 0.2);

      tree.nodeList.forEach(function(node, i) {

        rect = new Rectangle(tx(node._outRectangle.x), node._outRectangle.y, node._outRectangle.width * kx, node._outRectangle.height);

        if(rect.x < frame.width && rect.getRight() > 0 && rect.y < frame.height && rect.getBottom() > 0) {

          x = Math.round(frame.x + rect.x) + 0.5;
          y = Math.round(frame.y + rect.y) + 0.5;

          if(node.pattern) {
            graphics.context.fillStyle = node.pattern;
            graphics.context.fillRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

            if(graphics.sRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
              overNode = node;
              overI = i;
            }

          } else {

            graphics.setFill(node._color);

            if(graphics.fsRectM(x, y, Math.floor(rect.width), Math.floor(rect.height))) {
              overNode = node;
              overI = i;
            }
          }

          var realWidth = Math.min(rect.getRight(), frame.width) - Math.max(rect.x, 0);

          if(realWidth > 16) {
            margTextX = rect.width * TreeDraw.PROP_RECT_MARGIN * 0.8;
            margTextY = rect.height * TreeDraw.PROP_RECT_MARGIN * 0.15;
            var tC = textColor ? textColor : frame.memory.textsColorList[i];
            textSize = 18;

            graphics.setText(tC, textSize);
            exceedes = true; //(node._textWidth*textSize/12)>(rect.width-1.2*margTextX);
            if(exceedes) {
              graphics.clipRectangle(x, y - 17, rect.width, rect.height);
            }

            //feature or P
            graphics.fText(node.label, Math.max(x, frame.x) + 8, y + 1);

            if(node.value) {
              textSize = 14;
              graphics.setText(tC, textSize);

              graphics.fText(node.value, Math.max(x, frame.x) + 8, y - 17);
            }

            //size
            if(realWidth - node._textWidth > 60) {
              textSize = 12;
              graphics.setText(tC, textSize, null, 'right');

              graphics.fText("s=" + node.weight, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 1);
              graphics.fText("e=" + Math.round(node.entropy * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 12);
              if(node.toNodeList.length > 0) {
                graphics.fText("P=" + Math.round(node.valueFollowingProbability * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 23);
              }
              graphics.fText("l=" + Math.round(node.lift * 100) / 100, Math.min(frame.x + rect.getRight(), frame.getRight()) - 2, y + 23 + (node.toNodeList.length > 0 ? 11 : 0));
            }

            if(exceedes) {
              graphics.context.restore();
            }
          }
        }
      });

      //leaves

      var x0 = frame.x;
      var w;
      var sx = frame.width / tree.nodeList[0].weight;
      var waitingForMark = true;
      var waitingForDoubleMark = true;
      var waitingForHalfMark = true;
      var waitingFor15Mark = true;
      var waitingFor067Mark = true;


      frame.memory.leaves.forEach(function(node) {
        graphics.setStroke('black', 0.2);

        w = sx * node.weight;

        if(node.pattern) {
          graphics.context.fillStyle = node.pattern;
          graphics.context.fillRect(x0, yLeaves, w, hLevel);

          if(graphics.sRectM(x0, yLeaves, w, hLevel)) {
            overNode = node;
            overI = tree.nodeList.indexOf(node);
          }

        } else {
          graphics.setFill(node._color);
          if(graphics.fsRectM(x0, yLeaves, w, hLevel)) {
            overNode = node;
            overI = tree.nodeList.indexOf(node);
          }
        }

        node._xLeaf = x0;
        node._wLeaf = w;

        graphics.setStroke('black', 1);

        if(waitingForMark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability) {
          waitingForMark = false;
          graphics.setFill('black');
          graphics.fLines(x0, yLeaves - 14, x0 + 4, yLeaves - 8, x0, yLeaves - 2, x0 - 4, yLeaves - 8);
        }
        if(waitingForDoubleMark && node.valueFollowingProbability <= tree.nodeList[0].valueFollowingProbability * 2) {
          waitingForDoubleMark = false;
          graphics.line(x0, yLeaves - 14, x0, yLeaves - 2);
        }
        if(waitingForHalfMark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability * 0.5) {
          waitingForHalfMark = false;
          graphics.line(x0, yLeaves - 14, x0, yLeaves - 2);
        }
        if(waitingFor15Mark && node.valueFollowingProbability <= tree.nodeList[0].valueFollowingProbability * 1.5) {
          waitingFor15Mark = false;
          graphics.line(x0, yLeaves - 8, x0, yLeaves - 2);
        }
        if(waitingFor067Mark && node.valueFollowingProbability < tree.nodeList[0].valueFollowingProbability * 0.66667) {
          waitingFor067Mark = false;
          graphics.line(x0, yLeaves - 8, x0, yLeaves - 2);
        }

        x0 += w;

      });

      if(captureImage) {
        // TODO refactor this to not reassign context
        // context = mainContext;
        // frame.memory.image = new Image();
        // frame.memory.image.src = newCanvas.toDataURL();
        // frame.x = prevFx;
        // frame.y = prevFy;
        // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
      }
    }

    if(mouseOnFrame) {
      if(overNode) {
        graphics.setCursor('pointer');

        //rect = new Rectangle(tx(overNode._outRectangle.x), ty(overNode._outRectangle.y), overNode._outRectangle.width*kx, overNode._outRectangle.height*ky);
        rect = new Rectangle(tx(overNode._outRectangle.x), overNode._outRectangle.y, overNode._outRectangle.width * kx, overNode._outRectangle.height);
        x = Math.round(frame.x + rect.x) + 0.5;
        y = Math.round(frame.y + rect.y) + 0.5;

        graphics.setStroke(textColor ? textColor : frame.memory.textsColorList[overI], 2);

        if(overNode._wLeaf) {
          graphics.setFill('rgba(0,0,0,0.5)');
          graphics.context.beginPath();

          graphics.context.moveTo(x, yLeaves - gap);
          graphics.context.bezierCurveTo(x, yLeaves - 0.65 * gap, overNode._xLeaf, yLeaves - gap * 0.35, overNode._xLeaf, yLeaves);
          graphics.context.lineTo(overNode._xLeaf + overNode._wLeaf, yLeaves);
          graphics.context.bezierCurveTo(overNode._xLeaf + overNode._wLeaf, yLeaves - gap * 0.35, x + rect.width, yLeaves - 0.65 * gap, x + rect.width, yLeaves - gap);
          graphics.context.fill();

          graphics.sRect(overNode._xLeaf, yLeaves, overNode._wLeaf, hLevel);
        }

        graphics.sRect(x, y, Math.floor(rect.width), Math.floor(rect.height));

        if(graphics.MOUSE_UP_FAST) {
          frame.memory.focusFrame = new Rectangle(overNode._outRectangle.x - overNode._outRectangle.width * 0.025, 0, overNode._outRectangle.width * 1.05, frame.height); // TreeDraw._expandRect(overNode._outRectangle);

          if(frame.memory.focusFrame.x < 0) {
            frame.memory.focusFrame.width += frame.memory.focusFrame.x;
            frame.memory.focusFrame.x = 0;
          }

          if(frame.memory.focusFrame.getRight() > frame.width) {
            frame.memory.focusFrame.width -= (frame.memory.focusFrame.getRight() - frame.width);
            frame.memory.focusFrame.x = frame.width - frame.memory.focusFrame.width;
          }


          frame.memory.nodeSelected = overNode;
          changeInResult = true;

          frame.memory.image = null;
        }
      }
      if(graphics.MOUSE_DOWN) {
        frame.memory.prevMX = graphics.mX;
      }
      if(graphics.MOUSE_PRESSED) {
        var scale = 5 * frame.memory.focusFrame.width / frame.width;
        frame.memory.focusFrame.x -= (graphics.mX - frame.memory.prevMX) * scale;
        frame.memory.prevMX = graphics.mX;
      }
      if(graphics.WHEEL_CHANGE !== 0) {
        var center = frame.memory.focusFrame.getCenter();
        var zoom = 1 + 0.1 * graphics.WHEEL_CHANGE;
        frame.memory.focusFrame.x = center.x - frame.memory.focusFrame.width * 0.5 * zoom;
        frame.memory.focusFrame.width *= zoom;
      }
      if(graphics.MOUSE_PRESSED || graphics.WHEEL_CHANGE !== 0) {

        frame.memory.image = null;

      }
    }

    if(!captureImage && !drawingImage) {
      graphics.context.restore();
    }


    if(frame.memory.overNode != overNode) {
      frame.memory.overNode = overNode;
      changeInResult = true;
    }

    if(changeInResult || frame.memory.result == null) {
      frame.memory.result = [
        {
          value: frame.memory.nodeSelected,
          type: 'Node'
        },
        {
          value: frame.memory.overNode,
          type: 'Node'
        }
      ];
    }

    return frame.memory.result;

  };

  /**
   * @ignore
   */
  TreeDraw._generateRectanglesDecision = function(node, hLevel) {

    var weights = new NumberList();
    node.toNodeList.forEach(function(node) {
      weights.push(node.weight);
    });

    var rectangles = TreeDraw._horizontalRectanglesDecision(node._inRectangle, weights);

    node.toNodeList.forEach(function(child, i) {
      child._outRectangle = rectangles[i];
      child._inRectangle = TreeDraw._inRectFromOutRectDecision(child._outRectangle, hLevel);
      TreeDraw._generateRectanglesDecision(child, hLevel);
    });
  };

  /**
   * @ignore
   */
  TreeDraw._inRectFromOutRectDecision = function(rect, hLevel) {
    return new Rectangle(rect.x, rect.y + hLevel, rect.width, rect.height - hLevel);
  };

  /**
   * @ignore
   */
  TreeDraw._horizontalRectanglesDecision = function(rect, weights) {
    var rects = new List();
    var x0 = rect.x;
    var w;
    var newWeights = NumberListOperators.normalizedToSum(weights);

    newWeights.forEach(function(weight) {
      w = weight * rect.width;
      rects.push(new Rectangle(x0, rect.y, w, rect.height));
      x0 += w;
    });

    return rects;
  };

  /**
   * @classdesc Functions for drawing {@link Network|Networks}.
   *
   * @namespace
   * @category drawing
   */
  function NetworkDraw() {}
  /**
   * @ignore
   */
  NetworkDraw._drawNode = function(node, x, y, r, graphics) {
    var over = false;
    if(node.image) {
      graphics.clipCircle(x, y, r);
      graphics.drawImage(node.image, x - r, y - r * 1.3, r * 2, r * 3); //[!] this assumes a 3/2 proportioned image
      graphics.restore();
      over = Math.pow(x - graphics.mX, 2) + Math.pow(y - graphics.mY, 2) <= r * r;
    } else {
      graphics.setFill(node.color == null ? 'rgb(50,50,50)' : node.color);
      over = graphics.fCircleM(x, y, r);
    }
    if(over) {
      graphics.setCursor('pointer');
    }
    return over;
  };


  /**
   * Draws a radial (elliptical) Network
   *
   * @param  {Rectangle} frame A Rectangle indicating the width, height, and location of the drawing area.
   * @param  {Network} network The Network to draw.
   * @return {Node} If a Node in the Network is currently being moused over, it is returned.
   * If no Node is being interacted with, undefined is returned.
   * tags:draw
   */
  NetworkDraw.drawRadialNetwork = function(frame, network, graphics) {
    var r = 1.1 * Math.min(frame.width, frame.height) / network.nodeList.length;
    var rw = frame.width * 0.5 - r;
    var rh = frame.height * 0.5 - r;
    var cxf = frame.x + frame.width * 0.5;
    var cyf = frame.y + frame.height * 0.5;
    var mx, my, d;
    var nodeOver;
    var dA = TwoPi / network.nodeList.length;

    graphics.setFill('black');

    network.nodeList.forEach(function(node, i) {
      node._drawRadialNetwork_x = cxf + rw * Math.cos(i * dA);
      node._drawRadialNetwork_y = cyf + rh * Math.sin(i * dA);
    });

    network.relationList.forEach(function(relation) {
      graphics.setStroke('black', relation.weight * 0.25);
      mx = (relation.node0._drawRadialNetwork_x + relation.node1._drawRadialNetwork_x) * 0.5;
      my = (relation.node0._drawRadialNetwork_y + relation.node1._drawRadialNetwork_y) * 0.5;
      d = Math.sqrt(Math.pow(relation.node0._drawRadialNetwork_x - relation.node1._drawRadialNetwork_x, 2), Math.pow(relation.node0._drawRadialNetwork_y - relation.node1._drawRadialNetwork_y, 2)) + 1;
      mx = (1 - 0.5 * (d / rw)) * mx + 0.5 * (d / rw) * cxf;
      my = (1 - 0.5 * (d / rh)) * my + 0.5 * (d / rh) * cyf;
      graphics.bezier(relation.node0._drawRadialNetwork_x, relation.node0._drawRadialNetwork_y,
        mx, my,
        mx, my,
        relation.node1._drawRadialNetwork_x, relation.node1._drawRadialNetwork_y);
    });

    network.nodeList.forEach(function(node) {
      if(NetworkDraw._drawNode(node, node._drawRadialNetwork_x, node._drawRadialNetwork_y, r)) nodeOver = node;
    });

    return nodeOver;
  };


  /**
   * Draws a Network with nodes placed in coordinates provided by a polygon.
   *
   * @param  {Rectangle} frame
   * @param  {Network} network
   * @param {Polygon} polygon Nodes positions
   *
   * @param {Boolean} respectProportions If true, proportions will be equal for both axis
   * @param {Boolean} logScale uses a logarithmic scale in both axis, applies only if all values are >=0
   * @param {Boolean} drawGrid draws a grid
   * @param {Number} margin
   * @return {Node} If a Node in the Network is currently being moused over, it is returned.
   * If no Node is being interacted with, undefined is returned.
   * tags:draw
   */
  NetworkDraw.drawNetwork2D = function(frame, network, polygon, respectProportions, logScale, drawGrid, margin, graphics) {
    if(network == null || polygon == null || polygon.type != 'Polygon') return;

    respectProportions = respectProportions || false;
    logScale = logScale || false;
    drawGrid = drawGrid || false;
    margin = margin || 0;


    var r = 1.1 * Math.min(frame.width, frame.height) / network.nodeList.length;

    var nodeOver;
    var memory = frame.memory;
    var kx;
    var ky;
    var frameP;
    var frameMargin;
    var changeOnFrame = memory == null || !memory.frame.isEqual(frame);

    if(memory == null || memory.network != network || memory.nNodes != network.nodeList.length || memory.polygon != polygon || changeOnFrame || memory.respectProportions != respectProportions || memory.margin != margin || memory.logScale != logScale || memory.drawGrid != drawGrid) {

      if(memory == null) {
        frame.memory = {};
        memory = frame.memory;
      }
      memory.frame = frame.clone();
      memory.network = network;
      var differentSize = memory.polygon != null && memory.polygon.length != polygon.length;
      memory.polygon = polygon;
      memory.respectProportions = respectProportions;
      memory.logScale = logScale;
      memory.drawGrid = drawGrid;
      memory.margin = margin;
      memory.nNodes = network.nodeList.length;

      frame.bottom = frame.getBottom();
      frame.right = frame.getRight();
      memory.frameMargin = new Rectangle(frame.x + margin, frame.y + margin, frame.width - 2 * margin, frame.height - 2 * margin);
      frameMargin = memory.frameMargin;
      memory.frameMargin.right = memory.frameMargin.getRight();
      memory.frameMargin.bottom = memory.frameMargin.getBottom();
      memory.frameP = polygon.getFrame();
      frameP = memory.frameP;
      frameP.right = frameP.getRight();
      frameP.bottom = frameP.getBottom();


      if(respectProportions) kx = ky = Math.min(kx, ky);
      var project;
      memory.actualLogScale = logScale && frameP.x >= 0 && frameP.y >= 0;
      if(memory.actualLogScale) {
        kx = frameMargin.width / Math.log((frameP.right + 1) / (frameP.x + 1));
        ky = frameMargin.height / Math.log((frameP.bottom + 1) / (frameP.y + 1));
        project = function(p) {
          return new _Point((Math.log(p.x + 1) - Math.log(frameP.x + 1)) * kx + frameMargin.x, frameMargin.bottom - (Math.log(p.y + 1) - Math.log(frameP.y + 1)) * ky);
        };
      } else {
        kx = frameMargin.width / frameP.width;
        ky = frameMargin.height / frameP.height;
        project = function(p) {
          return new _Point((p.x - frameP.x) * kx + frameMargin.x, frameMargin.bottom - (p.y - frameP.y) * ky);
        };
      }
      memory.projectedPolygon = new _Polygon();
      polygon.forEach(function(p, i) {
        memory.projectedPolygon[i] = project(p);
      });

      if(frameP.x <= 0 && frameP.getRight() >= 0) {
        memory.yAxis = (-frameP.x) * kx + frameMargin.x;
      }
      if(frameP.y <= 0 && frameP.getBottom() >= 0) {
        memory.xAxis = frameMargin.bottom - (-frameP.y) * ky;
      }

      if(frame.memory.projectPolygonConvergent == null || changeOnFrame || differentSize) frame.memory.projectPolygonConvergent = memory.projectedPolygon.clone();

    } else {
      frameP = memory.frameP;
      frameMargin = memory.frameMargin;
    }

    graphics.setStroke('rgb(50,50,50)', 2);

    if(memory.xAxis) {
      graphics.line(frameMargin.x, memory.xAxis, memory.frameMargin.right, memory.xAxis);
    }
    if(memory.yAxis) {
      graphics.line(memory.yAxis, memory.frameMargin.y, memory.yAxis, memory.frameMargin.bottom);
    }

    if(frame.containsPoint(graphics.mP)) {
      graphics.setStroke('rgb(50,50,50)', 0.5);
      graphics.line(frame.x + 2, graphics.mY + 0.5, frame.right - 4, graphics.mY + 0.5);
      graphics.line(graphics.mX + 0.5, frame.y + 2, graphics.mX + 0.5, frame.bottom - 4);
    }

    memory.projectPolygonConvergent.approach(memory.projectedPolygon, 0.1);

    network.nodeList.forEach(function(node, i) {
      node.x = memory.projectPolygonConvergent[i].x;
      node.y = memory.projectPolygonConvergent[i].y;
    });

    network.relationList.forEach(function(relation) {
      graphics.setStroke('black', relation.weight * 0.25);
      graphics.line(relation.node0.x, relation.node0.y, relation.node1.x, relation.node1.y);
    });

    network.nodeList.forEach(function(node) {
      if(NetworkDraw._drawNode(node, node.x, node.y, r)) {
        nodeOver = node;
      }
    });

    //values label

    if(frame.containsPoint(graphics.mP)) {
      if(nodeOver == null) {
        if(memory.actualLogScale) {
          NetworkDraw._drawNodeValues(
            Math.floor(10 * (Math.pow(Math.E, Math.log((frameP.right + 1) / (frameP.x + 1)) * (graphics.mX - frameMargin.x) / frameMargin.width) - 1)) / 10,
            Math.floor(10 * (Math.pow(Math.E, Math.log((frameP.bottom + 1) / (frameP.y + 1)) * (frameMargin.bottom - graphics.mY) / frameMargin.height) - 1)) / 10
          );
        } else {
          NetworkDraw._drawNodeValues(
            Math.floor(10 * (frameP.x + frameP.width * (graphics.mX - memory.frameMargin.x) / memory.frameMargin.width)) / 10,
            Math.floor(10 * (frameP.y + frameP.height * (memory.frameMargin.bottom - graphics.mY) / memory.frameMargin.height)) / 10
          );
        }
      } else {
        var index = network.nodeList.indexOf(nodeOver);
        NetworkDraw._drawNodeValues(polygon[index].x, polygon[index].y, nodeOver.name);
      }
    }


    return nodeOver;
  };

  /**
   * @ignore
   */
  NetworkDraw._drawNodeValues = function(vx, vy, name, graphics) {
    var text = (name == null ? '' : (name + ': ')) + vx + ", " + vy;
    graphics.setFill('rgba(50,50,50,0.8)');
    graphics.fRect(graphics.mX - 2, graphics.mY - 2, - graphics.getTextW(text) - 4, -14);
    graphics.setText('white', 12, null, 'right', 'bottom');
    graphics.fText(text, graphics.mX - 4, graphics.mY - 2);
  };


  //to be tested

  /**
   * drawNetworkMatrix
   * @ignore
   */
  NetworkDraw.drawNetworkMatrix = function(frame, network, colors, relationsColorScaleFunction, margin, directed, normalizedNodeWeights, returnHovered, graphics) {
    relationsColorScaleFunction = relationsColorScaleFunction == null ? ColorOperators.grayScale : relationsColorScaleFunction;
    margin = margin == null ? 2 : margin;
    directed = directed == null ? false : directed;

    var i;
    var nodeList = network.nodeList;
    var relationList = network.relationList;
    var relation;

    var useWeights = (normalizedNodeWeights != null);

    var dX = frame.width / (nodeList.length + 1);
    var dY = frame.height / (nodeList.length + 1);
    var w = dX - margin;
    var h = dY - margin;

    var ix;
    var iy;

    var xx = dX;
    var yy = dY;
    var ww;
    var hh;
    var xNodes = [];
    var yNodes = [];
    var wNodes = [];
    var hNodes = [];

    returnHovered = returnHovered && frame.pointIsInside(graphics.mousePoint);

    var hoverValues;
    if(returnHovered) {
      hoverValues = new _Point(-1, -1);
    }

    if(useWeights) {
      dX = frame.width - dX;
      dY = frame.height - dY;
    }

    for(i = 0; nodeList[i] != null; i++) {
      graphics.context.fillStyle = colors[i];
      if(useWeights) {
        ww = dX * normalizedNodeWeights[i];
        hh = dY * normalizedNodeWeights[i];
        graphics.context.fillRect(frame.x + xx, frame.y, ww - margin, h);
        graphics.context.fillRect(frame.x, frame.y + yy, w, hh - margin);

        if(returnHovered) {
          if(graphics.mX > frame.x + xx && graphics.mX < frame.x + xx + ww) hoverValues.x = i;
          if(graphics.mY > frame.y + yy && graphics.mY < frame.y + yy + hh) hoverValues.y = i;
        }
        xNodes[nodeList[i].id] = xx;
        yNodes[nodeList[i].id] = yy;
        wNodes[nodeList[i].id] = ww;
        hNodes[nodeList[i].id] = hh;
        xx += ww;
        yy += hh;



      } else {
        graphics.context.fillRect(frame.x + (i + 1) * dX, frame.y, w, h);
        graphics.context.fillRect(frame.x, frame.y + (i + 1) * dY, w, h);
      }
    }

    for(i = 0; relationList[i] != null; i++) {
      relation = relationList[i];
      graphics.context.fillStyle = relationsColorScaleFunction(relation.weight);
      if(useWeights) {
        graphics.context.fillRect(frame.x + xNodes[relation.node0.id], frame.y + yNodes[relation.node1.id], wNodes[relation.node0.id] - margin, hNodes[relation.node1.id] - margin);
        if(!directed) graphics.context.fillRect(frame.x + yNodes[relation.node1.id], frame.y + xNodes[relation.node0.id], hNodes[relation.node1.id] - margin, wNodes[relation.node0.id] - margin);
      } else {
        ix = nodeList.indexOf(relation.node0) + 1;
        iy = nodeList.indexOf(relation.node1) + 1;
        graphics.context.fillRect(frame.x + ix * dX, frame.y + iy * dY, w, h);
        if(!directed && (ix != iy)) {
          graphics.context.fillRect(frame.x + iy * dX, frame.y + ix * dY, w, h);
        }
      }

    }
    return hoverValues;
  };

  exports.DataModel = DataModel;
  exports.List = List;
  exports.Table = Table;
  exports.Axis = Axis;
  exports.Axis2D = Axis2D;
  exports.Interval = Interval;
  exports.Matrix = Matrix;
  exports.NumberList = NumberList;
  exports.NumberTable = NumberTable;
  exports.DateAxis = DateAxis;
  exports.DateInterval = DateInterval;
  exports.DateList = DateList;
  exports.Country = Country;
  exports.CountryList = CountryList;
  exports.Point = _Point;
  exports.Point3D = Point3D;
  exports.Polygon = _Polygon;
  exports.Polygon3D = Polygon3D;
  exports.Polygon3DList = Polygon3DList;
  exports.PolygonList = PolygonList;
  exports.Rectangle = Rectangle;
  exports.RectangleList = RectangleList;
  exports.ColorList = ColorList;
  exports.ColorScale = ColorScale;
  exports.Space2D = Space2D;
  exports.StringList = StringList;
  exports.Node = _Node;
  exports.Relation = Relation;
  exports.NodeList = NodeList;
  exports.RelationList = RelationList;
  exports.Network = Network;
  exports.Tree = Tree;
  exports.DateListOperators = DateListOperators;
  exports.DateListConversions = DateListConversions;
  exports.DateOperators = DateOperators;
  exports.CountryListOperators = CountryListOperators;
  exports.CountryOperators = CountryOperators;
  exports.GeoOperators = GeoOperators;
  exports.GeometryConversions = GeometryConversions;
  exports.GeometryOperators = GeometryOperators;
  exports.PointOperators = PointOperators;
  exports.PolygonGenerators = PolygonGenerators;
  exports.PolygonOperators = PolygonOperators;
  exports.PolygonListEncodings = PolygonListEncodings;
  exports.PolygonListOperators = PolygonListOperators;
  exports.RectangleOperators = RectangleOperators;
  exports.ColorGenerators = ColorGenerators;
  exports.ColorListGenerators = ColorListGenerators;
  exports.ColorListOperators = ColorListOperators;
  exports.ColorOperators = ColorOperators;
  exports.ColorScales = ColorScales;
  exports.ColorScaleGenerators = ColorScaleGenerators;
  exports.ListGenerators = ListGenerators;
  exports.ListOperators = ListOperators;
  exports.ListConversions = ListConversions;
  exports.TableConversions = TableConversions;
  exports.TableEncodings = TableEncodings;
  exports.TableGenerators = TableGenerators;
  exports.TableOperators = TableOperators;
  exports.IntervalListOperators = IntervalListOperators;
  exports.NumberListConversions = NumberListConversions;
  exports.IntervalTableOperators = IntervalTableOperators;
  exports.MatrixGenerators = MatrixGenerators;
  exports.NumberListGenerators = NumberListGenerators;
  exports.NumberListOperators = NumberListOperators;
  exports.NumberOperators = NumberOperators;
  exports.NumberTableConversions = NumberTableConversions;
  exports.NumberTableFlowOperators = NumberTableFlowOperators;
  exports.NumberTableOperators = NumberTableOperators;
  exports.ObjectOperators = ObjectOperators;
  exports.ObjectConversions = ObjectConversions;
  exports.StringConversions = StringConversions;
  exports.StringListOperators = StringListOperators;
  exports.StringListConversions = StringListConversions;
  exports.StringOperators = StringOperators;
  exports.NetworkConversions = NetworkConversions;
  exports.NetworkEncodings = NetworkEncodings;
  exports.NetworkGenerators = NetworkGenerators;
  exports.NetworkOperators = NetworkOperators;
  exports.TreeConversions = TreeConversions;
  exports.TreeEncodings = TreeEncodings;
  exports.Draw = Draw;
  exports.DrawSimpleVis = DrawSimpleVis;
  exports.DrawTexts = DrawTexts;
  exports.DrawTextsAdvanced = DrawTextsAdvanced;
  exports.Graphics = Graphics;
  exports.DragDetection = DragDetection;
  exports.InputTextFieldHTML = InputTextFieldHTML;
  exports.TextBox = TextBox;
  exports.TextFieldHTML = TextFieldHTML;
  exports.Loader = Loader;
  exports.LoadEvent = LoadEvent;
  exports.MultiLoader = MultiLoader;
  exports.ConsoleTools = ConsoleTools;
  exports.FastHtml = FastHtml;
  exports.JSONUtils = JSONUtils;
  exports.MD5 = MD5;
  exports.StringUtils = StringUtils;
  exports.Navigator = Navigator;
  exports.typeOf = typeOf;
  exports.instantiate = instantiate;
  exports.getShortNameFromDataModelType = getShortNameFromDataModelType;
  exports.getColorFromDataModelType = getColorFromDataModelType;
  exports.getLightColorFromDataModelType = getLightColorFromDataModelType;
  exports.getTextFromObject = getTextFromObject;
  exports.instantiateWithSameType = instantiateWithSameType;
  exports.isArray = isArray;
  exports.evalJavaScriptFunction = evalJavaScriptFunction;
  exports.argumentsToArray = argumentsToArray;
  exports.Forces = Forces;
  exports.Engine3D = Engine3D;
  exports.CountryListDraw = CountryListDraw;
  exports.CircleDraw = CircleDraw;
  exports.ColorsDraw = ColorsDraw;
  exports.ListDraw = ListDraw;
  exports.IntervalTableDraw = IntervalTableDraw;
  exports.NumberTableDraw = NumberTableDraw;
  exports.NumberListDraw = NumberListDraw;
  exports.ObjectDraw = ObjectDraw;
  exports.StringDraw = StringDraw;
  exports.StringListDraw = StringListDraw;
  exports.NetworkDraw = NetworkDraw;
  exports.TreeDraw = TreeDraw;
  exports.setStructureLocalStorage = setStructureLocalStorage;
  exports.getStructureLocalStorageFromSeed = getStructureLocalStorageFromSeed;
  exports.getStructureLocalStorage = getStructureLocalStorage;
  exports.dataModelsInfo = dataModelsInfo;
  exports.TwoPi = TwoPi;
  exports.HalfPi = HalfPi;
  exports.radToGrad = radToGrad;
  exports.gradToRad = gradToRad;

}));
//# sourceMappingURL=moebio_framework.js.map