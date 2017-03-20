var request = require('request');
var uris = require('./uris').uris;
var qb = require('./query_builder');

const MAX_ARTISTS = 30;

module.exports.get_similar_artists = function(name, cb) {
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
    cb(artists);
  });
}
