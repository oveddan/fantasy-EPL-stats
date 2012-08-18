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
}

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
    
    var image = $cells.find('img.ismShirtData')[0],
      detailsLink = $cells.find('a.ismViewProfile')[0],
      linkTarget = detailsLink.href;

    var stat = {
      idonsite : linkTarget.substring(linkTarget.indexOf('#') + 1, linkTarget.length),
      lastname : $cells[2].innerHTML,
      team : image.title,
      position : $cells[4].innerHTML,
      selectedBy : parseFloat($cells[5].innerHTML) * 0.01,
      // remove dollar and make float
      price : parseFloat($cells[6].innerHTML.substr(1, $cells[6].innerHTML.length - 1)),
      gwPoints : parseInt($cells[7].innerHTML),
      totalPoints : parseInt($cells[8].innerHTML)
    };

    return stat;
}