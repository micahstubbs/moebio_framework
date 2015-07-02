var buildFileList = require('./shared').buildFileList;

module.exports = function(grunt) {

  // This task is not currently used, but
  // can be used to build the codebase into
  // individual (not concatenated) AMD modules.
  // However this build would not deal with circular
  // dependencies.
  // Transpile es6 modules to AMD.
  grunt.config.set('esperanto', {
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
    }
  });

  // This task would be used with the above one
  // if you wanted to concat those files into one.
  // However with cyclic dependencies, an AMD loader
  // wont actually be able to load parts of the framework

  grunt.config.set('concat', {
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
  });

  // Transpile ES6 modules to AMD. Bundling into one
  // concatenated module and handling cyclic dependencies.
  //
  // Note this currently relies on using the esperanto script
  // directly rather than the grunt plugin.
  grunt.config.set('shell', {
    esperanto_bundle: {
      command: './node_modules/esperanto/bin/index.js -b -i src/index.js -s -o dist/moebio_framework_concat.js -a src/index -m'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-esperanto');
  grunt.loadNpmTasks('grunt-shell');

};
