var request = require('request'),
  $ = require('jQuery'),
  async = require('async'),
  _ = require('underscore');

module.exports.extract2012SummaryStats = function(){

};

var pullStats = function(page, callback){
  request("http://fantasy.premierleague.com/stats/elements/?page=" + 1, function(err, data){
    if(err) callback(err);
    else {
      var parsedStats = parseStatsFromHtml(data);
      callback(parsedStats);
    }
  });
};

var parseStatsFromHtml = module.exports.parseStatsFromHtml = function(pageHtml){
  var $playerRows = $(pageHtml).find('#ismTable').find('tr');  
  var pagePlayerStats = _.map($playerRows.children('td'), parseCells);
}

var parceCells = module.exports.parceCells = function($cells){
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
      <td>
        <img src="http://cdn.ismfg.net/static/plfpl/img/shirts/data_view/shirt_19.png"
          alt="West Ham"
          title="West Ham"
          class="ismShirtData">
      </td>
      <td>
        <a href="#502" class="ismInfo ismViewProfile" title="">
          <img src="http://cdn.ismfg.net/static/plfpl/img/icons/infoposs_75.png"
              alt="Player information "
              width="16"
              height="16">
        </a>
      </td>
      <td>Nolan</td>

      <td>WHM</td>
      <td>MID</td>
      <td>3.9%</td>
      <td>£6.0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>*/
    
    var image = $cells[0].find('img.ismShirtData')[0],
      detailsLink = $cells[1].find('a.ismViewProfile')[0];

    var stat = {
      idonsite = detailsLink.href.substr(1, detailsLink.href.length - 1),
      lastname = $cells[2].innerText,
      team = image.title,
      position = $cells[3].innerText,
      selectedBy = parseFloat($cells[4].innerText),
      // remove dollar and make float
      price = parseFloat($cells[5].innerText.substr(1, $cells[5].innerText.length - 1)),
      gwPoints = parseInt($cells[6].innerText),
      totalPoints = parseInt($cells[7].innerText)
    };

    return stat;
}