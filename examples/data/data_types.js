/* globals mo */
function loaded(data) {
  // Understanding Data
  var table = mo.TableEncodings.CSVtoTable(data.result, true);
  console.log(table.getNames());
  console.log(mo.ListOperators.getReport(table[0]));

  console.log(mo.TableOperators.getReport(table));

  console.log(table.getTypes());

  // Show alt way
  console.log("average: " + table[0].getAverage());
  for(var i = 0; i < table.length - 1; i++) {
    console.log("average of " + table.getNames()[i] + ": " + table[i].getAverage());
    console.log("max of " + table.getNames()[i] + ": " + table[i].getMax());
  }

  // table.forEach(function(l,i) {
  //   console.log("average of " + table.getNames()[i] + ": " + l.getAverage());
  // })

  // How many species are there?
  var freqTable = table[4].getFrequenciesTable();
  console.log('Species Counts');
  console.log(mo.TableEncodings.TableToCSV(freqTable));

 // remove?
  var covariance = mo.NumberListOperators.covariance(table[0], table[1]);
  console.log("covariance between " + table.getNames()[0] + " & " + table.getNames()[1]);
  console.log(covariance);

  covariance = mo.NumberListOperators.covariance(table[2], table[3]);
  console.log("covariance between " + table.getNames()[2] + " & " + table.getNames()[3]);
  console.log(covariance);


  var infoGain = mo.TableOperators.getVariablesInformationGain(
    mo.TableOperators.getNumberTableFromTable(table), table[4]);

  console.log(infoGain);

  var kMeans = mo.NumberListOperators.linearKMeans(table[1], 3, true);
  console.log(kMeans);

  for(i = 0; i < kMeans.length; i++) {
    var cluster = table.getSubListsByIndexes(kMeans[i]);
    var clusterFreqTable = cluster[4].getFrequenciesTable();
    var mismatch =  clusterFreqTable[1].getSum() - clusterFreqTable[1].getMax();
    console.log('cluster: ' + i + ', mismatch: ' + mismatch);
  }

  var onlySetosa = mo.TableOperators.filterTableByElementInList(table,4,'setosa', true);
  covariance = mo.NumberListOperators.covariance(onlySetosa[2], onlySetosa[3]);
  console.log(covariance);

  // var agg = mo.TableOperators.pivotTable(table,4, 0, 1, 3);
  // console.log(agg);
}


window.onload = function() {
  mo.Loader.loadData('data/iris.csv', loaded, this);
};
