/**
 * @ignore
 *
 * @classdesc Functions to create interesting console output.
 *
 * @namespace
 * @category misc
 */
function ConsoleTools() {}
export default ConsoleTools;


ConsoleTools._ticTime = undefined;
ConsoleTools._tacTime = undefined;

/**
 * @ignore
 */
ConsoleTools.NumberTableOnConsole = function(table) {
  var message = "";
  var line;
  var number;
  var i;
  var j;

  for(j = 0; j < table[0].length; j++) {
    line = "|";
    for(i = 0; table[i] != null; i++) {
      number = String(Math.floor(100 * table[i][j]) / 100).replace(/0./, ".");
      while(number.length < 3) number = " " + number;
      line += number + "|";
    }
    message += line + "\n";
  }

  console.log(message);

  return message;
};


/**
 * @ignore
 */
ConsoleTools.tic = function(message) {
  message = message || "";

  ConsoleTools._ticTime = ConsoleTools._tacTime = new Date().getTime();
  ConsoleTools._nTacs = 0;
  console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°° tic °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°° [' + message + ']');
};

/**
 * @ignore
 */
ConsoleTools.tac = function(message) {
  message = message || "";

  var lastTac = ConsoleTools._tacTime;
  ConsoleTools._tacTime = new Date().getTime();
  console.log('°°°°°°° tac [' + message + '], t from tic:' + (ConsoleTools._tacTime - ConsoleTools._ticTime) + ', t from last tac:' + ((ConsoleTools._tacTime - lastTac)));
};
