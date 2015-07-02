var SourceMap = require('source-map');
var fs = require('fs');

module.exports = function(grunt) {

 grunt.config('wrap', {
    dist: {
      src: ["vendor/loader.js", "dist/moebio_framework_concat.js"],
      dest: "dist/moebio_framework.js",
      options: {
        barename: "src/index",
        namespace: "mo"
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
        };
        smg.addMapping(toAdd);
      });

      fs.writeFileSync('./dist/moebio_framework.js.map', smg.toString() , 'utf-8');

    });
  });

  grunt.config('uglify', {
    files: {
      src: 'dist/moebio_framework.js',
      dest: 'dist/',   // destination folder
      expand: true,    // allow dynamic building
      flatten: true,   // remove all unnecessary nesting
      ext: '.min.js'   // replace .js to .min.js
    }
  });

  grunt.config('remove', {
    concat: {
      options: {
        trace: true
      },
      fileList: ['dist/moebio_framework_concat.js', 'dist/moebio_framework_concat.js.map']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-remove');

};