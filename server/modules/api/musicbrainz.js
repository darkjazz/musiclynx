var express = require('express');
var mb = require('../models/musicbrainz');
var module_mb = express.Router();

module_mb.get('/', function(req, res) {
  console.log('MusicBrainz module root')
});

module_mb.get('/artist_search/:searchTerm', function(req, res) {
  var searchTerm = req.params.searchTerm;
  mb.artist_search(searchTerm, function(artists) {
    res.send(artists);
  });
});

module.exports = module_mb;
