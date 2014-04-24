fileList = ////dataStructures
    [ 'dataStructures/DataModel.js',

    // some data models require to be before -->
    'dataStructures/lists/List.js',
    'dataStructures/numeric/NumberList.js',
    'dataStructures/structures/elements/Node.js',
    'dataStructures/structures/lists/NodeList.js',
    'dataStructures/structures/lists/RelationList.js',
    'dataStructures/lists/Table.js',

    'dataStructures/dates/DateAxis.js',
    'dataStructures/dates/DateInterval.js',
    'dataStructures/dates/DateList.js',
    'dataStructures/geo/Country.js',
    'dataStructures/geo/CountryList.js',
    'dataStructures/geometry/Point.js',
    'dataStructures/geometry/Point3D.js',
    'dataStructures/geometry/Polygon.js',
    'dataStructures/geometry/Polygon3D.js',
    'dataStructures/geometry/Polygon3DList.js',
    'dataStructures/geometry/PolygonList.js',
    'dataStructures/geometry/Rectangle.js',
    'dataStructures/geometry/RectangleList.js',
    'dataStructures/graphic/ColorList.js',
    'dataStructures/graphic/ColorScale.js',
    'dataStructures/numeric/Axis.js',
    'dataStructures/numeric/Axis2D.js',
    'dataStructures/numeric/Interval.js',
    'dataStructures/numeric/Matrix.js',
    'dataStructures/numeric/NumberTable.js',
    'dataStructures/spaces/Space2D.js',
    'dataStructures/strings/StringList.js',
    'dataStructures/structures/elements/Relation.js',
    'dataStructures/structures/networks/Network.js',
    'dataStructures/structures/networks/Tree.js',

    ////operators
    'operators/dates/DateOperators.js',
    'operators/geo/CountryListOperators.js',
    'operators/geo/CountryOperators.js',
    'operators/geo/GeoOperators.js',
    'operators/geometry/GeometryConvertions.js',
    'operators/geometry/GeometryOperators.js',
    'operators/geometry/PointOperators.js',
    'operators/geometry/PolygonGenerators.js',
    'operators/geometry/PolygonListEncodings.js',
    'operators/geometry/PolygonListOperators.js',
    'operators/geometry/PolygonOperators.js',
    'operators/geometry/RectangleOperators.js',
    'operators/graphic/ColorConvertions.js',
    'operators/graphic/ColorGenerators.js',
    'operators/graphic/ColorListGenerators.js',
    'operators/graphic/ColorListOperators.js',
    'operators/graphic/ColorOperators.js',
    'operators/graphic/ColorScales.js',
    'operators/lists/ListGenerators.js',
    'operators/lists/ListOperators.js',
    'operators/lists/TableEncodings.js',
    'operators/lists/TableGenerators.js',
    'operators/lists/TableOperators.js',
    'operators/numeric/interval/IntervalListOperators.js',
    'operators/numeric/interval/IntervalTableOperators.js',
    'operators/numeric/MatrixGenerators.js',
    'operators/numeric/numberList/NumberListGenerators.js',
    'operators/numeric/numberList/NumberListOperators.js',
    'operators/numeric/NumberOperators.js',
    'operators/numeric/numberTable/NumberTableFlowOperators.js',
    'operators/numeric/numberTable/NumberTableOperators.js',
    'operators/numeric/UniversalNumericOperators.js',
    'operators/strings/StringListOperators.js',
    'operators/strings/StringOperators.js',
    'operators/structures/NetworkConvertions.js',
    'operators/structures/NetworkEncodings.js',
    'operators/structures/NetworkGenerators.js',
    'operators/structures/NetworkOperators.js',
    'operators/structures/TreeEncodings.js',

    ////apis

    ////Tools
    'Tools/graphic/CanvasAndContext.js',
    'Tools/graphic/Draw.js',
    'Tools/graphic/DrawSimpleVis.js',
    'Tools/graphic/DrawTexts.js',
    'Tools/graphic/DrawTextsAdvanced.js',
    'Tools/graphic/SimpleGraphics.js',
    'Tools/interaction/DragDetection.js',
    'Tools/interaction/InputTextField.js',
    'Tools/interaction/InputTextFieldHTML.js',
    'Tools/interaction/Selection.js',
    'Tools/interaction/TextBox.js',
    'Tools/interaction/TextButton.js',
    'Tools/interaction/TextFieldHTML.js',
    'Tools/interaction/ToolTip.js',
    'Tools/loaders/Loader.js',
    'Tools/loaders/LoadEvent.js',
    'Tools/loaders/MultiLoader.js',
    'Tools/physics/Forces.js',
    'Tools/threeD/Engine3D.js',
    'Tools/utils/code/ClassUtils.js',
    'Tools/utils/strings/ConsoleTools.js',
    'Tools/utils/strings/FastHtml.js',
    'Tools/utils/strings/JSONUtils.js',
    'Tools/utils/strings/StringUtils.js',
    'Tools/utils/system/Navigator.js',

    ////visualization
    'visualization/geo/CountryListDraw.js',
    'visualization/geometry/CirclesVisOperators.js',
    'visualization/numeric/IntervalTableDraw.js',
    'visualization/numeric/NumberTableDraw.js',
    'visualization/strings/StringListVisOperators.js',
    'visualization/structures/NetworkDraw.js',
    'visualization/structures/TreeDraw.js',

    ////Global
    'Global.js'];

module.exports = function (grunt) {
    grunt.initConfig({
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: '\n\n'
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
        js:  { files: fileList, tasks: [ 'concat', 'uglify', 'copy' ] },
    },

    copy: {
      main: {
        src: 'dist/framework_concat.min.js',
        dest: '../spiral/_dev/client/angularSpiral/app/scripts/classes/moebioFramework.min.js'
      },
      onSpiralCanvas: {
        src: 'dist/framework_concat.min.js',
        dest: '../SpiralCanvas/classes/moebioFramework.min.js',
      },
      onGeoProspective: {
        src: 'dist/framework_concat.min.js',
        dest: '../Geoprospective/classes/moebioFramework.min.js',
      },
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-copy');

// register at least this one task
grunt.registerTask('default', [ 'concat', 'uglify', 'copy' ]);


};