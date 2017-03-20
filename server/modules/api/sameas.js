var express = require('express');
var b64 = require('base-64');
var sameas = require('../models/sameas');

var module_sa = express.Router();

module_sa.get('/', function(req, res) {
  console.log('Sameas module root')
});

module_sa.get('/find_dbpedia_link/:mbid/:name', function(req, res) {
  var artist_name = req.params.name;
  var mbid = req.params.mbid;
  sameas.find_dbpedia_link(mbid, artist_name, function(match) {
    res.send(match);
  });
});

module_sa.get('/find_musicbrainz_id/:artist_uri/:name', function(req, res) {
  var artist_uri = b64.decode(req.params.artist_uri);
  var name = req.params.name;
  sameas.find_musicbrainz_id(artist_uri, name, function(artist) {
    res.send(artist);
  })
});

module.exports = module_sa;
