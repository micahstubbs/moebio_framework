/* global grunt, module, require, console */

var SourceMap = require('source-map');
var fs = require('fs');
var path = require('path');

'use strict';

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

module.exports = function (grunt) {
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-jscs");
  grunt.loadNpmTasks('grunt-karma');

  grunt.loadNpmTasks('grunt-esperanto');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-remove');

  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-git');

  grunt.initConfig({

    // Transpile source from es6 module syntax to AMD.
    esperanto: {
      options: {
        type: 'amd',
        filePathAsModule: true,
        bundleOpts : {
          strict: true,
          useStrict: true
        }
      },
      files: {
        expand: true,
        src: buildFileList(),
        dest: 'tmp/amd/'
      },
    },


    // Transpile and concat the code.
    //
    // We are using the esperanto command directly because
    // it can correctly handle circular dependencies.
    shell: {
      esperanto_bundle: {
        command: './node_modules/esperanto/bin/index.js -b -i src/index.js -s -o dist/moebio_framework_concat.js -a src/index -m'
      }
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
          namespace: "mo"
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

    remove: {
      concat: {
        options: {
          trace: true
        },
        fileList: ['dist/moebio_framework_concat.js', 'dist/moebio_framework_concat.js.map']
      }
    },

    watch: {
      js:  {
        files: buildFileList().concat('gruntfile.js'),
        tasks: ['shell:esperanto_bundle', 'wrap:dist']
      },
    },

    'string-replace': {
      version: {
        files: {
          'src/Version.js' : 'src/Version.js'
        },
        options: {
          replacements: [{
            pattern: /version\s*=\s*['"](\d+\.\d+\.\d+)['"]/g,
            replacement: 'version = "<%= pkg.version %>"'
          }]
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),

    release: {
      options: {
        bump: true,
        npm: false,
        afterBump: ['string-replace:version'],
        beforeRelease: ['default', 'gitadd:build', 'gitcommit:build']
      }
    },

    gitadd: {
      build: {
        options: {
          force: false
        },
        files: {
          src: ['src/Version.js', 'dist/*']
        }
      }
    },

    gitcommit: {
      build: {
        options: {
          message: 'updating dist files',
          allowEmpty: true
        },
        files: {
          src: ['src/Version.js', 'dist/*']
        }
      }
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
    },

    karma: {
      unit: {
        configFile: 'tests/karma.conf.js',
        singleRun: false,
        logLevel: 'WARN'
      }
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
      var result = grunt.template.process(output.join("\n"));

      // Make the link to the source map relative. We also have to move it
      // to the right place since we have wrapped the concatenated file with
      // some new stuff (the loader and IIFE).

      var sourceMapUrl = result.match("//# sourceMappingURL=.+")[0];
      result = result.replace(/\/\/# sourceMappingURL=.+/, "");

      // Make sourceMapUrl relative
      var sourceMapFilePath = sourceMapUrl.match("=(.+)")[0];
      var smName = sourceMapFilePath.split("/")
      smName = smName[smName.length - 1];

      sourceMapFilePath = sourceMapUrl.replace(/=(.+)/, "=./" + smName);
      sourceMapFilePath = sourceMapFilePath.replace("_concat", "");

      // Append the source map link to the end.
      result = result.concat("\n"+sourceMapFilePath);

      grunt.file.write(f.dest, result);

      // Adjust the sourcemap file itself to account for the loader and wrapping code.
      // we will actually generate a new sourcemap file that corresponds to the
      // new filed we generated about.
      var srcMapStr = fs.readFileSync("./dist/moebio_framework_concat.js.map");
      var srcMap = JSON.parse(srcMapStr);

      var smc = new SourceMap.SourceMapConsumer(srcMap);
      var newMappings = [];
      smc.eachMapping(function (m) {
        m.generatedLine = m.generatedLine + 38 + 1;
        newMappings.push(m);
      });

      var newSrcMap = {};
      newSrcMap.version = srcMap.version;
      newSrcMap.file = srcMap.file;
      newSrcMap.sources = srcMap.sources;
      newSrcMap.sourcesContent = srcMap.sourcesContent;
      newSrcMap.names = srcMap.names;

      var smg = new SourceMap.SourceMapGenerator(newSrcMap);
      newMappings.forEach(function(m){
        var toAdd = {
          generated: {
            line: m.generatedLine,
            column: m.generatedColumn
          },
          original: {
            line: m.originalLine,
            column: m.originalColumn
          },
          source: m.source
        }
        smg.addMapping(toAdd);
      });

      fs.writeFileSync('./dist/moebio_framework.js.map', smg.toString() , 'utf-8');

    });
  });

  //
  // Default task - build distribution source
  //
  // grunt.registerTask('default', ['esperanto', 'concat', 'wrap:dist', 'uglify']);
  grunt.registerTask('default', ['shell:esperanto_bundle', 'wrap:dist', 'remove:concat', 'uglify']);

  //
  // Build documentation
  //
  grunt.registerTask('doc', [ 'jsdoc' ]);

  //
  // Run tests interactively
  //
  grunt.registerTask('test', [ 'karma' ]);

  grunt.registerTask('build_commit', ['default', 'gitadd:build', 'gitcommit:build']);

};
