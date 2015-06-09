/**
 * @classdesc Provides a set of tools that work with Numbers.
 *
 * @namespace
 * @category numbers
 */
function NumberOperators() {}

NumberOperators.numberToString = function(value, nDecimals, powersMode, unit) {
  var string = value.toFixed(nDecimals);
  while(string.charAt(string.length - 1) == '0') {
    string = string.substring(0, string.length - 1);
  }
  if(string.charAt(string.length - 1) == '.') string = string.substring(0, string.length - 1);
  return string;
};

/**
 * decent method to create pseudo random numbers
 * @param {Object} seed
 */
NumberOperators.getRandomWithSeed = function(seed) {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / (233280.0);
};

NumberOperators.numberFromBinaryPositions = function(binaryPositions) {
  var i;
  var n = 0;
  for(i = 0; binaryPositions[i] != null; i++) {
    n += Math.pow(2, binaryPositions[i]);
  }
  return n;
};

NumberOperators.numberFromBinaryValues = function(binaryValues) {
  var n = 0;
  for(var i = 0; binaryValues[i] != null; i++) {
    n += binaryValues[i] == 1 ? Math.pow(2, i) : 0;
  }
  return n;
};

NumberOperators.powersOfTwoDecomposition = function(number, length) {
  // var i;
  // var powers = StringList.fromArray(Number(number).toString(2).split('')).toNumberList().getReversed();
  // var n = powers.length;
  // for(i=n; i<length; i++){
  //   powers.push(0);
  // }
  // return powers;



  var powers = new NumberList();

  var constructingNumber = 0;
  var biggestPower;

  while(constructingNumber < number) {
    biggestPower = Math.floor(Math.log(number) / Math.LN2);
    powers[biggestPower] = 1;
    number -= Math.pow(2, biggestPower);
  }

  var length = Math.max(powers.length, length == null ? 0 : length);

  for(var i = 0; i < length; i++) {
    powers[i] = powers[i] == 1 ? 1 : 0;
  }

  return powers;
};

NumberOperators.positionsFromBinaryValues = function(binaryValues) {
  var i;
  var positions = new NumberList();
  for(i = 0; binaryValues[i] != null; i++) {
    if(binaryValues[i] == 1) positions.push(i);
  }
  return positions;
};

//////////Random Generator with Seed, From http://baagoe.org/en/w/index.php/Better_random_numbers_for_javascript

NumberOperators._Alea = function() {
  return(function(args) {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if(args.length == 0) {
      args = [+new Date()];
    }
    var mash = NumberOperators._Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for(var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if(s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if(s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if(s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() +
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  }(Array.prototype.slice.call(arguments)));
};

NumberOperators._Mash = function() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for(var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return(n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
};
