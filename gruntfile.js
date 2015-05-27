'use strict';

// test 28/04/2014 12:24 -- 2
var watchedFiles = [
    "**/*.js",
    "!**/node_modules/**",
    "!dist/*.js",
    "!tests/**"
];

module.exports = function (grunt) {
    var fileList = [];
    grunt.initConfig({
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n'
      },
      dist: {
        // the files to concatenate
        src: fileList,
        // the location of the resulting JS file
        dest: 'dist/framework_concat.js'
      }
    },
    // define source files and their destinations
    uglify: {
        files: {
            src: 'dist/framework_concat.js'//'./*.js',  // source files mask
            ,

            dest: 'dist/',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            ext: '.min.js'   // replace .js to .min.js
        }
    },
    watch: {
        js:  { files: watchedFiles, tasks: [ 'buildFileList', 'concat', 'uglify', 'copy' ] },

    },

    copy: {
      spiral: {
        src: 'dist/framework_concat.js',
        dest: '../spiral/_dev/client/angularSpiral/app/scripts/classes/framework_concat.js'
      },
      spiralMin: {
        src: 'dist/framework_concat.min.js',
        dest: '../spiral/_dev/client/angularSpiral/app/scripts/classes/framework_concat.min.js'
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
    }

});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-gh-pages');
grunt.loadNpmTasks('grunt-jekyll');

// register at least this one task
grunt.registerTask('default', [ 'buildFileList', 'concat', 'uglify', 'copy' ]);


// test task
grunt.registerTask('buildFileList', 'My "buildFileList" task description.', function() {
  var done = this.async();
  var fs = require('fs');
  var filename = "IncludeAll.js";
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;
        var lines = data.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if( line.substr(0, 8)=="include("){
                var fileName = line.substr(24, line.length-27);
                fileList.push( fileName );
            }
        };

        console.log( "fileList to concatenate / uglyfy is " + fileList.length + " lines long" );
        done();
    });
});


//
// Build and deploy static site.
//
grunt.registerTask('deploy', ['jekyll:build', 'gh-pages']);

};
























