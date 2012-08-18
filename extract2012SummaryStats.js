var request = require('request'),
  $ = require('jQuery'),
  async = require('async'),
  _ = require('underscore');


module.exports = function extract2012SummaryStats(){

};

var pullStats = function(page, callback){
  request("http://fantasy.premierleague.com/stats/elements/page=1" + 1, function(err, data){
    if(err) callback(err);
    else {
      var parsedStats = parseStatsFromHtml(data);
      callback(parsedStats);
    }
  });
};

var parseStatsFromHtml = function(pageHtml){
  var $playerRows = $(pageHtml).find('#ismTable').find('tr');

}