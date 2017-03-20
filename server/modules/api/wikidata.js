var express = require('express');
var wd = require('../models/wikidata');
var module_wd = express.Router();

module_wd.get('/', function(req, res) {
  console.log('Wikidata module root')
});

module_wd.get('/get_reduced_image/:mbid', function(req, res, next) {
  var mbid = req.params.mbid;
  wd.get_reduced_image(mbid, function(img) {
    res.send(img);
  })
});

module_wd.get('/get_mbid_by_entityid/:entity_id', function(req, res) {
  var entity_id = req.params.entity_id;
  wd.get_mbid_by_entityid(entity_id, function(mbid) {
    res.send(mbid);
  })
});

module.exports = module_wd;
