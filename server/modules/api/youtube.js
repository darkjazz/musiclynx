var express = require('express');
var yt = require('../models/youtube');
var module_yt = express.Router();

module_yt.get('/search_videos/:searchTerm', function(req, res) {
  var searchTerm = decodeURIComponent(req.params.searchTerm);
  yt.search_videos(searchTerm, function(results) {
    res.send(results);
  });
});

module.exports = module_yt;
