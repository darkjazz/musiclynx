var express = require('express');
var search = require('youtube-search');

var module_yt = express.Router();

const MAX_RESULTS = 10;
const APIKEY = "AIzaSyD3EX9tyyO_Rur72mXbrxteI9S5ImojN9Y";

module_yt.get('/search_videos/:searchTerm', function(req, res) {
  var searchTerm = decodeURIComponent(req.params.searchTerm);
  search(searchTerm, { maxResults: MAX_RESULTS, key: APIKEY }, function(err, results) {
    if(err) res.send(err);
    else res.send(results);
  });
});

module.exports = module_yt;
