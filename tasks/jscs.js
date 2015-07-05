var buildFileList = require('./shared').buildFileList;

module.exports = function(grunt) {

  grunt.config.set('jscs', {
    options: {
        config: ".jscsrc",
        reporter: require('jscs-stylish').path
      },
      src: buildFileList()
  });

  grunt.loadNpmTasks("grunt-jscs");

};