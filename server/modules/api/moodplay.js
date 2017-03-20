var express = require('express');
var mp = require('../models/moodplay');
var module_mp = express.Router();

module_mp.get('/get_similar_artists/:name', function(req, res) {
  var name = decodeURIComponent(req.params.name);
  mp.get_similar_artists(name, function(artists) {
    res.send(artists);
  })
});

module.exports = module_mp;
