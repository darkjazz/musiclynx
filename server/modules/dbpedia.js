var express = require('express');
var request = require('request');
var qb = require('./query_builder');
var dps = require('dbpedia-sparql-client').default;
var uris = require('./uris').uris;
var b64 = require('base-64');

var module_dbp = express.Router();

var defaultTimeout = 8000;

module_dbp.get('/', function(req, res) {
  console.log('Dbpedia module root')
});

module_dbp.get('/get_artist_abstract/:mbid/:name', function(req, res) {
  var uri = uris.server + '/api/sameas/find_dbpedia_link/' + req.params.mbid + '/' + req.params.name;
  request( { method: 'GET', uri: uri }, function(err, response, body) {
    var query, params;
    var dbpedia_uri = body;
    params = { URI: dbpedia_uri, LANG: "en" };
    query = qb.buildQuery("artist_abstract", params);
    dps.client()
      .query(query)
      .timeout(defaultTimeout)
      .asJson()
      .then(function(r) {
        if (r.results.bindings.length > 0 && dbpedia_uri != r.results.bindings[0].dbpedia_uri.value ) {
          dbpedia_uri = r.results.bindings[0].dbpedia_uri.value;
        }
        var json = {
          about: r.results.bindings[0].about.value,
          abstract: r.results.bindings[0].abs.value,
          dbpedia_uri: dbpedia_uri };
        res.send(json);
      })
      .catch(function(e) { res.send(e) });
  })
});

module_dbp.get('/get_associated_artists/:dbpedia_uri', function(req, res) {
  var query, params;
  params = { URI: b64.decode(req.params.dbpedia_uri), LANG: "en" };
  query = qb.buildQuery("associated_artists", params);
  dps.client()
    .query(query)
    .timeout(defaultTimeout)
    .asJson()
    .then(function(r) {
      var artists = [];
      if (r.results.bindings.length > 0) {
        r.results.bindings.forEach(function(artist) {
          artists.push({ dbpedia_uri: artist.dbpedia_uri.value, name: artist.name.value  })
        });
      }
      res.send(artists);
    })
    .catch(function(e) { res.send(e) });
});

module_dbp.get('/get_categories/:dbpedia_uri', function(req, res) {
  var query, params;
  params = { URI: b64.decode(req.params.dbpedia_uri) };
  query = qb.buildQuery("artist_categories", params);
  console.log(query);
  dps.client()
    .query(query)
    .timeout(defaultTimeout)
    .asJson()
    .then(function(r) {
      res.send(r.results.bindings)
    })
    .catch(function(e) { res.send(e) });
});

module_dbp.get('/get_category_links/:yago_uri/:artist_uri/:limit', function(req, res) {
  var query, params;
  params = { YAGO_URI: b64.decode(req.params.yago_uri),
    ARTIST_URI: b64.decode(req.params.artist_uri),
    LIMIT: req.params.limit };
  query = qb.buildQuery("wikicat_links", params);
  dps.client()
    .query(query)
    .timeout(defaultTimeout)
    .asJson()
    .then(function(r) {
      res.send(r.results.bindings)
    })
    .catch(function(e) { res.send(e) });
});

module_dbp.get('/construct_artist/:mbid/:name', function(req, res) {
  var uri = uris.server + '/api/sameas/find_dbpedia_link/' + req.params.mbid + '/' + req.params.name;
  request( { method: 'GET', uri: uri }, function(err, response, body) {
    var query, params;
    var dbpedia_uri = body;
    params = { URI: dbpedia_uri, LANG: "en" };
    query = qb.buildQuery("construct_artist", params);
    dps.client()
      .query(query)
      .timeout(defaultTimeout)
      .asJson()
      .then(function(r) {
        res.send(r);
      })
      .catch(function(e) { res.send(e) });
  })
});

module.exports = module_dbp;
