var striptags = require('striptags');
var fs = require('jsdoc/fs');

/*eslint no-nested-ternary:0, space-infix-ops: 0 */
function clean(childNodes) {
  var cleaned = [];
  childNodes
  .forEach(function (element, index) {
    var i,
    len;

    if ('class' === 'class') {

            var thisFunction = {
                'name': element.name,
                'access': element.access || '',
                'virtual': !!element.virtual,
                'description': element.description ?  striptags(element.description).replace('{@link', '').replace('}', '') : '',
                'params': [ ],
                'examples': []
            };

            cleaned.push(thisFunction);

            if (element.returns) {
                thisFunction.returns = {
                    'type': element.returns[0].type? (element.returns[0].type.names.length === 1? element.returns[0].type.names[0] : element.returns[0].type.names) : '',
                    'description': element.returns[0].description || ''
                };
            }

            if (element.examples) {
                for (i = 0, len = element.examples.length; i < len; i++) {
                    thisFunction.examples.push(element.examples[i]);
                }
            }

            if (element.params) {
                for (i = 0, len = element.params.length; i < len; i++) {
                    thisFunction.params.push({
                        'name': element.params[i].name,
                        'type': element.params[i].type? (element.params[i].type.names.length === 1? element.params[i].type.names[0] : element.params[i].type.names) : '',
                        'description': element.params[i].description || '',
                        'default': element.params[i].defaultvalue || '',
                        'optional': typeof element.params[i].optional === 'boolean'? element.params[i].optional : '',
                        'nullable': typeof element.params[i].nullable === 'boolean'? element.params[i].nullable : ''
                    });
                }
            }
       }
    });
    return cleaned;
}

/**
    @param {TAFFY} data
    @param {object} opts
 */
exports.publish = function(data, opts) {
    var root = {},
        docs;

    data({undocumented: true}).remove();
    docs = data().get(); // <-- an array of Doclet objects

    var cleaned = clean(docs);

    // if (opts.destination === 'console') {
      // console.log(JSON.stringify(cleaned));
      fs.writeFileSync("docs.json", JSON.stringify(cleaned, null, 2), 'utf8');
    // }
    // else {
        // console.log('This template only supports output to the console. Use the option "-d console" when you run JSDoc.');
    // }
};
