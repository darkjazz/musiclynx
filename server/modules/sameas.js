var express = require('express');
var request = require('request');
var fsm = require('fuzzy-string-matching');
var qb = require('./query_builder');
var uris = require('./uris').uris;

var module_sa = express.Router();

var findBestMatch = function(duplicates, name) {
  var best_match, high_score;
  best_match = duplicates[0];
  console.log(best_match);
  high_score = fsm(uris.dbpedia_resource + name.replace(" ", "_"), best_match.replace("_(musician)", ""));
  duplicates.forEach(function(uri) {
    if (uri.search(uris.dbpedia_resource) > -1) {
      var score = fsm(uris.dbpedia_resource + name.replace(" ", "_"), uri.replace("_(musician)", ""));
      if (score > high_score) {
        high_score = score;
        best_match = uri;
      }
    }
  });
  console.log(best_match);
  if (!best_match.includes(uris.dbpedia_resource)) {
    best_match = uris.dbpedia_resource + name.replace(new RegExp(" ", 'g'), "_");
  }
  return best_match;
};

var findMBID = function(duplicates) {

};

module_sa.get('/', function(req, res) {
  console.log('Sameas module root')
});

module_sa.get('/find_dbpedia_link/:mbid/:name', function(req, res) {
  var artist_name = req.params.name;
  var query = uris.bbc_artists + req.params.mbid + '#artist';
  request({ method: 'GET', uri: uris.sameas + 'json?uri=' + query }, function(err, response, body)
  {
    var json = JSON.parse(body);
    var match = findBestMatch(json[0]["duplicates"], artist_name);
    res.send(match);
  });
});

module_sa.get('/find_musicbrainz_id/:artist_uri', function(req, res) {
  var artist_uri = req.params.artist_uri;
  request({ method: 'GET', uri: uris.sameas + 'json?uri=' + artist_uri }, function(err, response, body)
  {
    var json = JSON.parse(body);
    console.log(json[0]);
    var match = findMBID(json[0]["duplicates"])
    res.send(match);
  });
})

module.exports = module_sa;
