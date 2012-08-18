var summaryStats = require('./summaryStats');

summaryStats.getCurrentSummaryStats(function(err, data){
  if(err) throw err;
  else {
    console.log('stats gathered:');
    console.log(data);
  }
});