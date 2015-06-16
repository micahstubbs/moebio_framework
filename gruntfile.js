/* global grunt, module, require, console */

'use strict';

// Helper function to build the list of files that
// are to be concatenated and minified.
var _cachedFileList;
function buildFileList() {
  if(_cachedFileList === undefined) {
    var fs = require('fs');
    var path = require('path');
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

module.exports = function (grunt) {
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs");

  grunt.loadNpmTasks('grunt-esperanto');

  grunt.initConfig({

    // Transpile source from es6 module syntax
    // to AMD.
    esperanto: {
      options: {
        type: 'amd',
        filePathAsModule: true,
        bundleOpts : {
          strict: true,
          useStrict: true
        },
        fileNameAsModule: true
      },
      files: {
        expand: true,
        src: buildFileList(),
        dest: 'tmp/amd/'
      },
    },

    // Concatenate the built AMD files into one file
    concat: {
      dist: {
        options: {
          separator: '\n',
          nonull: true
        },
        // the files to concatenate
        src: 'tmp/amd/**/*.js',
        // the location of the resulting JS file
        dest: 'dist/moebio_framework_concat.js'
      }
    },

    // Wraps the concatenated project file in a single namespace.
    wrap: {
      dist: {
        src: ["vendor/loader.js", "dist/moebio_framework_concat.js"],
        dest: "dist/moebio_framework.js",
        options: {
          barename: "src/index",
          namespace: "MF"
        }
      }
    },

    uglify: {
      files: {
        src: 'dist/moebio_framework.js',
        dest: 'dist/',   // destination folder
        expand: true,    // allow dynamic building
        flatten: true,   // remove all unnecessary nesting
        ext: '.min.js'   // replace .js to .min.js
      }
    },

    watch: {
      js:  {
        files: buildFileList(),
        tasks: [ 'esperanto', 'concat', 'wrap:dist']
      },
    },

    jsdoc : {
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
    },

    jshint: {
      options: {
        jshintrc: true,
        ignores: ['libraries, dist'],
        reporter: require('jshint-stylish')
      },
      src: buildFileList()
    },

    jscs: {
      options: {
        config: ".jscsrc",
        reporter: require('jscs-stylish').path
      },
      src: buildFileList()
    }
  });

  // Wraps the concatenated project file in a single namespace which is
  // exported to window.
  grunt.registerMultiTask('wrap', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach(function(f) {
      var output = ["(function(globals) {"];

      output.push.apply(output, f.src.map(grunt.file.read));

      output.push(grunt.template.process(
        'window.<%= namespace %> = requireModule("<%= barename %>");', {
        data: {
          namespace: opts.namespace,
          barename: opts.barename
        }
      }));
      output.push('})(window);');

      grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
    });
  });

  //
  // Default task - build distribution source
  //
  grunt.registerTask('default', ['esperanto', 'concat', 'wrap:dist', 'uglify']);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc' ]);

};
