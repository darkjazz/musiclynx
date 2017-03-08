var express = require('express');
var request = require('request');
var uris = require('./uris').uris;
var qb = require('./query_builder');

var module_mp = express.Router();

const MAX_ARTISTS = 30;

module_mp.get('/get_similar_artists/:name', function(req, res) {
  var name = decodeURIComponent(req.params.name);
  var params = { ARTIST: name, LIMIT: MAX_ARTISTS };
  var query = qb.buildQuery("moodplay_artists", params);
  var options = { method: 'GET', uri: uris.mood_uri + "/mood?query=" + encodeURIComponent(query) + "&output=json" };
  request(options, function(err, response, body) {
    var json = JSON.parse(body);
    var artists = [];
    if (json.results.bindings.length > 1) {
      json.results.bindings.forEach(function(artist) {
        artists.push({ id: artist.mbid.value, name: artist.artist.value });
      });
    }
    res.send(artists);
  });
})

module.exports = module_mp;
