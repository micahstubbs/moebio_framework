/* global grunt, module, require, console */

'use strict';

var watchedFiles = [
  "**/*.js",
  "!**/node_modules/**",
  "!dist/*.js",
  "!tests/**",
  "!docs/**"
];

// Helper function to build the list of files that
// are to be concatenated and minified.
function buildFileList() {

  var fs = require('fs');
  var path = require('path');
  var root = "src";
  var filename = path.join(root, "all.json");
  var fileList = [];

  var data = fs.readFileSync(filename, 'utf8');
  JSON.parse(data).forEach(function(file) {
    fileList.push(path.join(root,file));
  });

  // var lines = data.split("\n");
  //
  // for (var i = 0; i < lines.length; i++) {
  //   var line = lines[i];
  //   if( line.substr(0, 8)=="include("){
  //     var fileName = line.substr(24, line.length-27);
  //     fileList.push( fileName );
  //   }
  // }
  console.log( "fileList to concatenate / uglyfy is " + fileList.length + " lines long" );
  return fileList;

}

module.exports = function (grunt) {
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-jekyll');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs");


  grunt.initConfig({

    concat: {
      dist: {
        options: {
          separator: '\n',
          nonull: true
        },
        // the files to concatenate
        src: buildFileList(),
        // the location of the resulting JS file
        dest: 'dist/framework_concat.js'
      }
    },

    uglify: {
      files: {
        src: 'dist/framework_concat.js',
        dest: 'dist/',   // destination folder
        expand: true,    // allow dynamic building
        flatten: true,   // remove all unnecessary nesting
        ext: '.min.js'   // replace .js to .min.js
      }
    },

    watch: {
      js:  {
        files: watchedFiles,
        tasks: [ 'concat', 'uglify', 'copy' ]
      },
    },

    copy: {
      spiral: {
        src: 'dist/framework_concat.js',
        dest: '../spiral/_dev/client/angularSpiral/app/scripts/classes/framework_concat.js'
      },
      spiralMin: {
        src: 'dist/framework_concat.min.js',
        dest: '../spiral/_dev/client/angularSpiral/app/scripts/classes/framework_concat.min.js'
      },
      site_js: {
        expand: true,
        cwd: 'dist/',
        src: ['framework_concat.js', 'framework_concat.min.js'],
        dest: 'site/source/examples/js/'
      }
    },

    jsdoc : {
      dist : {
        src: buildFileList(),
        jsdoc: "node_modules/.bin/jsdoc",
        options: {
          destination: 'site/build/docs',
          template : "docs/moebio-jsdoc",
          configure : "docs/jsdoc.conf.json",
          readme : "docs/jsdoc-readme.md"
        }
      }
    },

    jekyll: {
      options: {
        src : 'site/source'
      },
      build: {
        options: {
          dest: 'site/build',
          config: 'site/source/_config.yml'
        }
      },
      serve: {
        options: {
          dest: '.jekyll',
          serve: true,
          port : 8000,
          auto : true,
          config: 'site/source/_config.yml'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'site/build',
        repo: 'git@github.com:bocoup/moebio_framework.git'
      },
      src: '**/*'
    },

    jshint: {
      options: {
        jshintrc: true,
        ignores: ['libraries, dist'],
        reporter: require('jshint-stylish')
      },
      src: ['*.js', 'Tools/**/*.js', 'dataStructures/**/*.js', 'operators/**/*.js',
        'apis/**/*.js', 'Tools/**/*.js', 'Tools/**/*.js', 'visualization/**/*.js',
        'tests/**/*.js']
    },

    jscs: {
      options: {
        config: ".jscsrc",
        reporter: require('jscs-stylish').path
      },
      src: ['*.js', 'Tools/**/*.js', 'dataStructures/**/*.js', 'operators/**/*.js',
        'apis/**/*.js', 'Tools/**/*.js', 'Tools/**/*.js', 'visualization/**/*.js',
        'tests/**/*.js']
    }

  });

  //
  // Default task - build distribution source
  //
  grunt.registerTask('default', ['concat', 'uglify', 'copy' ]);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc' ]);

  //
  // Build and deploy static site. Building the site will also build
  // the documentation.
  //
  grunt.registerTask('build-site', ['jekyll:build', 'doc']);
  grunt.registerTask('deploy-site', ['build-site', 'gh-pages']);

};
