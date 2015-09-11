var rollup = require( 'rollup' );
var path = require('path');

module.exports = function(grunt) {

  grunt.config('rollup', {
    options: {
      name: 'mo',
      format: 'umd',
      dest: 'dist/moebio_framework.js'
    }
  });
  
  grunt.registerTask('rollup', 'Export the framework as a UMD bundle', function() {
    var done = this.async();
    var options = this.options();
    rollup.rollup({
      // The bundle's starting point. This file will be
      // included, along with the minimum necessary code
      // from its dependencies
      entry: 'src/index',
      resolveId: function ( importee, importer ) {
        var baseDir = '.';
        var fp;
        
        if ( importee[0] !== '.' ) {
          fp = path.resolve(baseDir, importee);
        } else {
          fp = path.resolve( path.dirname(importer, importee) );  
        }

        // Append .js if missing.
        if(fp.indexOf('.js') < 0) {
          fp += '.js';
        }
        
        return fp;
      },
    }).then( function ( bundle ) {
      // Generate bundle + sourcemap
      // var result = bundle.generate({
      //   format: options.format,
      //   moduleId: options.name,
      //   moduleName: options.name,
      //   sourceMap: true
      // });

      // Write out the generated code.
      bundle.write({
        format: options.format,
        moduleId: options.name,
        moduleName: options.name,
        dest: options.dest,
        sourceMap: true
      }).then(function(){
        done();  
      }).catch(function(){
        console.log('Error writing bundle', arguments);
      });

    }).catch(function(err){
      console.log('Error builing library\n', JSON.stringify(err, null, 4));
    }); 
   
  });

};