module.exports = function(grunt) {

  grunt.config.set('string-replace', {
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
  });

  grunt.config.set('release', {
    options: {
      bump: true,
      npm: true,
      afterBump: ['string-replace:version'],
      beforeRelease: ['default', 'gitadd:build', 'gitcommit:build']
    }
  });

  grunt.config.set('gitadd', {
    build: {
      options: {
        force: true
      },
      files: {
        src: ['src/Version.js', 'dist/*']
      }
    }
  });

  grunt.config.set('gitcommit', {
    build: {
      options: {
        force: false
      },
      files: {
        src: ['src/Version.js', 'dist/*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-git');

};
