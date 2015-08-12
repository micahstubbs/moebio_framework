/* globals $ */
var filter = function() {
  var all;
  var filter;

  var filterInput;

  var self = {};

  self.setup = function() {
    all = $(".side ul ul li, .side ul li, .side h3, .side .space-bottom1");
    filter = all;

    filterInput = $("#filter-input");
    filterInput.on("input", update);

    var clearButton = $("#clear-filter-button");
    clearButton.on("click", clear);
  };

  function update() {
    var exp = new RegExp( filterInput.val(), 'gi' );
    filter = all.filter(function(i) {
      var name = $(this).find('a').text();
      var res = name.match(exp);
      if( res && res.length > 0 ) {
        $(this).removeClass("filtered");
      } else {
        $(this).addClass("filtered");
      }
      return true;
    });
  }

  function clear(e) {
    filterInput.val("");
    update();
    e.preventDefault();
  }

  return self;

};

$( document ).ready(function() {
  var f = filter();
  f.setup();

});
