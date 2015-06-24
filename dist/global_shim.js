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
    for(var identifier in MF) {
      if(MF.hasOwnProperty(identifier)) {
        window[identifier] = MF[identifier];
        exportCount += 1;
      }
    }

    // Set a listener on MF so that we can transport changes on the object
    // e.g. cX, cY, to the window.
    Object.observe(MF, function(changes){
      changes.forEach(function(change) {
        window[change.name] = MF[change.name];
      });
    });

  } else {

    // Add properties from MF to the window, but create
    // the getters and setters such that these properties
    // proxy to the underlying MF ones.
    Object.keys(MF).forEach(function (prop) {
      exportCount += 1;
      Object.defineProperty(window, prop, {
          // Create a new getter for the property
          get: function () {
              return MF[prop];
          },
          // Create a new setter for the property
          set: function (val) {
              MF[prop] = val;
          }
      })
    });

  }

  console.log("Exported " + exportCount + " identifiers to window");


}());


