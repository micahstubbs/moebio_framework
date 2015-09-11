module.exports = function(grunt) {

  grunt.config('uglify', {
    files: {
      src: 'dist/moebio_framework.js',
      dest: 'dist/',   // destination folder
      expand: true,    // allow dynamic building
      flatten: true,   // remove all unnecessary nesting
      ext: '.min.js'   // replace .js to .min.js
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-remove');

};