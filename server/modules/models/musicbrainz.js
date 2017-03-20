var request = require("request");

var mburi = "http://musicbrainz.org";
var artist_search_template = '/ws/2/artist/?query=artist:%&fmt=json';
var user_agent = 'MusicLynx/0.1.0 (a.allik@qmul.ac.uk)';

module.exports.artist_search = function(searchTerm, cb) {
  var query = artist_search_template.replace('%', encodeURIComponent(req.params.searchTerm));
  var options = { method: 'GET', uri: mburi + query,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': user_agent
    }
  };
  request(options, function(err, response, body)
  {
    cb(body);
  });
}
