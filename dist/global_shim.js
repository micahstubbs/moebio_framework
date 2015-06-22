// This file re-exports the properties of the framework to
// window. This is there for backwards compatibility with the
// previous structure of the project.
(function(){
  var exportCount = 0;
  for(var identifier in MF) {
    if(MF.hasOwnProperty(identifier)) {
      window[identifier] = MF[identifier];
      exportCount += 1;
    }
  }
  console.log("Exported " + exportCount + " identifiers to window");
}());


