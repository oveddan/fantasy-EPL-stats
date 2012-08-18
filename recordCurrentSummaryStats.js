var summaryStats = require('./summaryStats'),
 statsRepository = require('./statsRepository');

summaryStats.getCurrentSummaryStats(function(err, data){
  if(err) throw err;
  else {
    console.log('stats gathered:');
    console.log(data);

    console.log('saving summary stats');
    statsRepository.saveSummaryStats(data, function(err, result){
      if(err) throw err;
      else console.log('complete');
    });
  }
});