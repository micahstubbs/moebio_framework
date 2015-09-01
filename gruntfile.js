/* global grunt, module, require, console */

'use strict';

var moebioPath = "node_modules/moebioFramework";

var examples = ['mouse_movements', 'simple_shapes', 'cube', 'network', 'spanning_tree'];

// Helper function to build the list of files that
// are to be concatenated and minified.
function buildFileList() {

  var fs = require('fs');
  var path = require('path');
  var root = moebioPath + "/src";
  var filename = path.join(root, "all.json");
  var fileList = [];

  var data = fs.readFileSync(filename, 'utf8');
  JSON.parse(data).forEach(function(file) {
    fileList.push(path.join(root,file));
  });

  console.log( "fileList to concatenate / uglyfy is " + fileList.length + " lines long" );
  return fileList;
}

module.exports = function (grunt) {
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.loadNpmTasks('grunt-npm-install');

  grunt.initConfig({

    copy: {
      examples: {
        expand: true,
        cwd: moebioPath + '/examples/',
        src: examples.map(function(f) { return f + "/**"; }),
        dest: 'examples/'
      },
      js: {
        expand: true,
        cwd: moebioPath + '/dist/',
        src: ['*'],
        dest: 'dist/'
      }
    },

    jsdoc : {
      dist : {
        src: buildFileList(),
        jsdoc: "node_modules/.bin/jsdoc",
        options: {
          destination: 'build/docs',
          template : moebioPath + "/docs/moebio-jsdoc",
          configure : moebioPath + "/docs/jsdoc.conf.json",
          readme : moebioPath + "/docs/jsdoc-readme.md"
        }
      }
    },

    jekyll: {
      options: {
        src : './'
      },
      build: {
        options: {
          dest: 'build',
          config: '_config.yml'
        }
      },
      serve: {
        options: {
          dest: 'build',
          serve: true,
          port : 8000,
          auto : true,
          config: '_config.yml',
          baseurl: ' '
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'build',
        repo: 'git@github.com:moebiolabs/moebio_framework.git'
      },
      src: '**/*'
    }

  });

  grunt.registerTask('build', ['npm-install', 'copy:examples', 'copy:js', 'jekyll:build', 'doc']);

  //
  // Default task - build distribution source
  //
  grunt.registerTask('default', ['build']);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc' ]);

  //
  // Build and deploy static site. Building the site will also build
  // the documentation.
  //
  grunt.registerTask('deploy', ['build', 'gh-pages']);

  grunt.registerTask('serve', ['jekyll:serve']);

};
