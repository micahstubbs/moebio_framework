var buildFileList = require('./shared').buildFileList;

module.exports = function(grunt) {

  grunt.config('jshint', {
    src: {
      options: {
        jshintrc: true,
        ignores: ['libraries, dist'],
        reporter: require('jshint-stylish')
      },
      src: buildFileList()
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

};