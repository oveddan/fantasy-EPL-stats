var should = require('chai').should(),
  $ = require('jQuery'),
  summaryStats = require('../summaryStats');


describe('parseCells', function(){
  // setup
  it('it should parse cells to stat', function(){
    // SETUP
    var htmlToParse = 
    '<tr><td>' + 
    '<img src="http://cdn.ismfg.net/static/plfpl/img/shirts/data_view/shirt_6_1.png" alt="Liverpool" title="Liverpool" class="ismShirtData"></td>' + 
    '<td><a href="#144" class="ismInfo ismViewProfile" title="">' + 
    '<img src="http://cdn.ismfg.net/static/plfpl/img/icons/info.png" alt="Player information " width="16" height="16"></a></td>' + 
    '<td>Reina</td><td>LIV</td><td>GKP</td><td>6.0%</td><td>£6.0</td><td>50</td><td>122</td></tr>';

    var expectedStat = {
        idonsite : '144',
        lastname : 'Reina',
        team : 'Liverpool',
        position : 'GKP',
        selectedBy : 0.060,
        // remove dollar and make float
        price : 6.0,
        gwPoints : 50,
        totalPoints : 122
      };
    // TEST
    var actualStat = summaryStats.parceCells($(htmlToParse).children('td'));
    // SHOULD
    actualStat.should.eql(expectedStat);
  });
});