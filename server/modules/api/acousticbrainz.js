var express = require('express');
var ab = require('../models/acousticbrainz');

var module_ab = express.Router();

module_ab.get('/get_artist/:id', function(req, res) {
  var id = req.params.id;
  ab.get_artist(id, function(cdbr) {
    res.send(cdbr);
  });
});

module_ab.get('/get_similar_artists/:id', function(req, res) {
  var id = req.params.id;
  ab.get_similar_artists(id, function(artists) {
    res.send(artists);
  });
});

module.exports = module_ab;
