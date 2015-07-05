var fs = require('fs');
var path = require('path');

// Helper function to build the list of files that
// are to be concatenated and minified.
var _cachedFileList;
function buildFileList() {
  if(_cachedFileList === undefined) {
    var root = "src";
    var filename = path.join(root, "all.json");
    var fileList = [];

    var data = fs.readFileSync(filename, 'utf8');
    JSON.parse(data).forEach(function(file) {
      fileList.push(path.join(root,file));
    });

    console.log( "fileList to concatenate / uglyfy is " + fileList.length + " lines long" );

    if(_cachedFileList === undefined) {
      _cachedFileList = fileList;
    }
  }
  return _cachedFileList;
}

module.exports = {
	buildFileList: buildFileList
};