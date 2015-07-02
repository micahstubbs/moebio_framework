module.exports = function(grunt) {

  grunt.config('karma', {
    unit: {
      configFile: 'tests/karma.conf.js',
      singleRun: false,
      logLevel: 'WARN'
    }
  });

  grunt.loadNpmTasks('grunt-karma');

};