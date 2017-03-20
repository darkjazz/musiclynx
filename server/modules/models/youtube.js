var search = require('youtube-search');

const MAX_RESULTS = 10;
const APIKEY = "AIzaSyD3EX9tyyO_Rur72mXbrxteI9S5ImojN9Y";

module.exports.search_videos = function(searchTerm, cb) {
  var searchTerm = decodeURIComponent(req.params.searchTerm);
  search(searchTerm, { maxResults: MAX_RESULTS, key: APIKEY }, function(err, results) {
    if(err) cb(err);
    else cb(results);
  });
}
