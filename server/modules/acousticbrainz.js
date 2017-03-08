var express = require('express');
var Couch = require('node-couchdb');

const couch = new Couch();
const dbName = "js_div_db";
const max_links = 30;

var module_ab = express.Router();

module_ab.get('/get_artist/:id', function(req, res) {
  var id = req.params.id;
  couch.get(dbName, '_design/views/_view/id_exists', { key: id, group: true }).then((cdbr) => {
    res.send(cdbr)
  }, err => {
    if (err.code == "EDOCMISSING") {
      res.send({ error: "NOT FOUND" });
    }
    else {
      res.send({ error: err });
    }
  });
});

module_ab.get('/get_similar_artists/:id', function(req, res) {
  var id = req.params.id;
  couch.get(dbName, '_design/views/_view/all_by_mbid', { 'key': id }).then((cdbr) => {
    var features = { id: id };
    cdbr.data.rows.forEach(function(row) {
      var top = row.value.values.slice(0, max_links);
      features[row.value.type] = top;
    });
    res.send(features);
  }, err => {
    if (err.code == "EDOCMISSING") {
      res.send({ error: "NOT FOUND" });
    }
    else {
      res.send({ error: err });
    }
  })
});

module.exports = module_ab;
