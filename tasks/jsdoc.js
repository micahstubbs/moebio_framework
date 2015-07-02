var buildFileList = require('./shared').buildFileList;

module.exports = function(grunt) {

  grunt.config.set('jsdoc', {
    dist : {
      src: buildFileList(),
      jsdoc: "node_modules/.bin/jsdoc",
      options: {
        destination: 'docs/build/',
        template : "docs/moebio-jsdoc",
        configure : "docs/jsdoc.conf.json",
        readme : "docs/jsdoc-readme.md"
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');

};