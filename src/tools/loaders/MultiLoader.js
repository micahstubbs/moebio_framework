import Loader from "src/tools/loaders/Loader";
import List from "src/dataTypes/lists/List";
import LoadEvent from "src/tools/loaders/LoadEvent";

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
export default MultiLoader;



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
