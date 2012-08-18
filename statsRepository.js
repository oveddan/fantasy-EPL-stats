var Db = require('mongodb').Db,
  Server = require('mongodb').Server,
 _ = require('underscore'),
 async = require('async');

var saveSummaryStats = module.exports.saveSummaryStats = function(stats, callback){
  var client = new Db('eplstats', new Server("127.0.0.1", 27017, {}), {native_parser:true});
  client.open(function(err, db) {
    if(err) callback(err); else {
      db.collection('summarystats', function(err, collection) {
        if(err) callback(err); 
        else {
          var insert = function(stat, callback){
            console.log('inserting:');
            console.log(stat);
            collection.insert(stat, function(err){
              if(err) callback(err); else {
                console.log('inserted:');
                console.log(stat);
                callback();
              }
            });
          }
          async.forEach(stats, insert, function(err){
            callback(err);
          });
        }      
      });
    }
  });
};