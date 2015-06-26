// From https://github.com/thomasboyt/grunt-microlib/blob/master/assets/loader.js
// We could also use https://github.com/jrburke/almond
var define, requireModule;
(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    console.log('define: ', name)
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    console.log('requireModule: ', name)
    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    var mod = registry[name];
    if (!mod) {
      throw new Error("Module '" + name + "' not found.");
    }

    var deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(deps[i]));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;
  };
})();