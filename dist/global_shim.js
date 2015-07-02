// This file re-exports the properties of the framework to
// window. This is there for backwards compatibility with the
// previous structure of the project.
(function(){
  var exportCount = 0;
  var USE_OBJECT_OBSERVE = false;

  // This is is in the manner below using Object.observe, however that only
  // works in chrome. It in theory _should_ be more performant but i haven't actually
  // benchmarked it hence the flag.

  if(Object.observe && USE_OBJECT_OBSERVE) {
    console.log("Using Object.observe")
    for(var identifier in mo) {
      if(mo.hasOwnProperty(identifier)) {
        window[identifier] = mo[identifier];
        exportCount += 1;
      }
    }

    // Set a listener on mo so that we can transport changes on the object
    // e.g. cX, cY, to the window.
    Object.observe(mo, function(changes){
      changes.forEach(function(change) {
        window[change.name] = mo[change.name];
      });
    });

  } else {

    // Add properties from mo to the window, but create
    // the getters and setters such that these properties
    // proxy to the underlying mo ones.
    Object.keys(mo).forEach(function (prop) {
      exportCount += 1;
      Object.defineProperty(window, prop, {
          // Create a new getter for the property
          get: function () {
              return mo[prop];
          },
          // Create a new setter for the property
          set: function (val) {
              mo[prop] = val;
          }
      })
    });

  }

  console.log("Exported " + exportCount + " identifiers to window");


}());
