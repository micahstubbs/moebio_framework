import LoadEvent from "src/tools/loaders/LoadEvent";

function Loader() {}
export default Loader;

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
Loader.loadData = function(url, onLoadData, callee, param, send_object_json) {
  if(Loader.REPORT_LOADING) console.log('load data:', url);
  Loader.n_loading++;

  if(Loader.LOCAL_STORAGE_ENABLED) {
    // TODO track down LocalStorage. localStorage is a thing though (lowercase l);
    var result = LocalStorage.getItem(url);
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
      if(req.status == 200 || (req.status == 0 && req.responseText != null)) {
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
    } catch(e) {
      req = false;
    }
    // branch for IE/Windows ActiveX version
  } else if(window.ActiveXObject) {
    try {
      req = new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch(e) {
      try {
        req = new ActiveXObject("Msxml2.XMLHTTP.3.0");
      } catch(e) {
        try {
          req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
          try {
            req = new ActiveXObject("Microsoft.XMLHTTP");
          } catch(e) {
            req = false;
          }
        }
      }
    }
  }
  if(req) {
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


//TODO this method isn't reference by anything else.
function LoaderRequest(url, method, data) {
  this.url = url;
  this.method = method ? method : "GET";
  this.data = data;
}

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
      req = new ActiveXObject("Msxml2.XMLHTTP");
    } catch(e) {
      try {
        req = new ActiveXObject("Microsoft.XMLHTTP");
      } catch(e) {
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
      if(req.status == 200 || req.status == 0) {
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

      if(req.status == 200 || (req.status == 0 && req.responseText != null)) {
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