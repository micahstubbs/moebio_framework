/* global module, require */

var buildFileList = require('./tasks/shared').buildFileList;

'use strict';

module.exports = function (grunt) {


  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js:  {
        files: buildFileList().concat('gruntfile.js'),
        tasks: ['build-fast']
      },
    }

  });


  // Load externally defined tasks
  grunt.loadTasks('tasks');

  //
  // Default task - build distribution source
  //
  grunt.registerTask('build-fast', ['rollup']);
  grunt.registerTask('build', ['rollup', 'uglify']);
  grunt.registerTask('default', ['build']);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc:dist' ]);

  //
  // Run tests interactively
  //
  grunt.registerTask('test', [ 'build-fast', 'karma' ]);
};
