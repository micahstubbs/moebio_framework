/* globals mo */
function loaded(data) {
  // Understanding Data
  var fullText=  data.result;

  fullText = mo.StringOperators.removeEnters(fullText);
  fullText = mo.StringOperators.removeEnters(fullText);
  console.log("full text length: " + fullText.length);

  var words = mo.StringOperators.getWords(fullText, true, true, true);
  window.words = words;

  var sentences = mo.StringOperators.split(fullText, ".");
  console.log("# of sentences: " + sentences.length);
  console.log(sentences);
}


window.onload = function() {
  mo.Loader.loadData('data/sherlock_holmes.txt', loaded, this);
};
