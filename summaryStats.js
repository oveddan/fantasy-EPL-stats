var request = require('request'),
  $ = require('jQuery'),
  async = require('async'),
  _ = require('underscore');

var getCurrentSummaryStats = module.exports.getCurrentSummaryStats = function(callback){
  var currentSummaryStats = [],
    currentPage = 1,
    maxPages = 2;

  async.whilst(
    function () { return currentPage <= maxPages;  },
    function(callback) {
      pullSummaryStatsOfPage(currentPage, function(err, playerStats){
        if(err) callback(err);
        else {
          currentSummaryStats.push(playerStats);
          currentPage++;
        }
      })
    },
    function(err){
      callback(err, currentSummaryStats);
    }
  );
};

var pullSummaryStatsOfPage = function(page, callback){
  var requestUrl = "http://fantasy.premierleague.com/stats/elements/?page=" + 1;
  console.log('requesting from ' + requestUrl);
  request("http://fantasy.premierleague.com/stats/elements/?page=" + 1, function(err, response, body){
    if(err) callback(err);
    else {
      var parsedStats = parseStatsFromHtml(body);
      console.log('calling back with');
      console.log(parsedStats);
      callback(null, parsedStats);
    }
  });
}

var parseStatsFromHtml = module.exports.parseStatsFromHtml = function(pageHtml){
  var $allRows = $(pageHtml).find('.ismTable').first().find('tr'),
    // filter out first row which is header row
    $playerRows = _.rest($allRows, 1);

  var pagePlayerStats = _.map($playerRows, parseCells);
  
  return pagePlayerStats;
}

var parseCells = module.exports.parseCells = function(row){
  /*Header looks like: 
    <th></th>
                <th></th>
                <th>Player</th>
                <th>Team</th>
                <th><abbr title="">Pos</abbr></th>
                <th><abbr title="Teams selected by %">Selected</abbr></th>
                <th>Price</th>
                <th><abbr title="Gameweek points">GW</abbr></th>
                <th><abbr title="Total points">Total</abbr></th>*/
  // cells look like:
    /*<tr>
      <td>0
        <img src="http://cdn.ismfg.net/static/plfpl/img/shirts/data_view/shirt_19.png"
          alt="West Ham"
          title="West Ham"
          class="ismShirtData">
      </td>
      <td>1
        <a href="#502" class="ismInfo ismViewProfile" title="">
          <img src="http://cdn.ismfg.net/static/plfpl/img/icons/infoposs_75.png"
              alt="Player information "
              width="16"
              height="16">
        </a>
      </td>
      2<td>Nolan</td>

      3<td>WHM</td>
      4<td>MID</td>
      5<td>3.9%</td>
      6<td>£6.0</td>
      7<td>0</td>
      8<td>0</td>
    </tr>
    <tr>*/
    var rowNum = 0;
    var $row = $(row),
      $cells = $row.children('td');
      image = $cells.find('img.ismShirtData')[0],
      detailsLink = $cells.find('a.ismViewProfile')[0],
      linkTarget = detailsLink.href;

    var stat = {
      idonsite : linkTarget.substring(linkTarget.indexOf('#') + 1, linkTarget.length),
      lastname : $cells[2].innerHTML,
      team : image.title,
      position : $cells[4].innerHTML,
      selectedBy : parseFloat($cells[5].innerHTML),
      // remove dollar and make float
      price : parseFloat($cells[6].innerHTML.substr(1, $cells[6].innerHTML.length - 1)),
      gwPoints : parseInt($cells[7].innerHTML),
      totalPoints : parseInt($cells[8].innerHTML)
    };

    return stat;
}