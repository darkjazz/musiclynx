var express = require('express');
var request = require('request');
var qb = require('./query_builder');
var dps = require('dbpedia-sparql-client').default;
var uris = require('./uris').uris;
var sameas = require('./sameas');

var defaultTimeout = 8000;

module.exports.get_artist_abstract = function(mbid, name, cb) {
  sameas.find_dbpedia_link(mbid, name, function(body) {
    var query, params;
    var dbpedia_uri = body;
    console.log(dbpedia_uri);
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
        cb(json);
      })
      .catch(function(e) { cb(e) });
  })
}

module.exports.get_associated_artists = function(dbpedia_uri, cb) {
  var query, params;
  params = { URI: dbpedia_uri, LANG: "en" };
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
      cb(artists);
    })
    .catch(function(e) { cb(e) });
}

module.exports.get_categories = function(dbpedia_uri, cb) {
  var query, params;
  params = { URI: dbpedia_uri };
  query = qb.buildQuery("artist_categories", params);
  console.log(query);
  dps.client()
    .query(query)
    .timeout(defaultTimeout)
    .asJson()
    .then(function(r) {
      cb(r.results.bindings)
    })
    .catch(function(e) { cb(e) });
}

module.exports.get_category_links = function(yago_uri, artist_uri, limit, cb) {
  var query, params;
  params = { YAGO_URI: yago_uri, ARTIST_URI: artist_uri, LIMIT: limit };
  query = qb.buildQuery("wikicat_links", params);
  dps.client()
    .query(query)
    .timeout(defaultTimeout)
    .asJson()
    .then(function(r) {
      cb(r.results.bindings)
    })
    .catch(function(e) { cb(e) });
}

module.exports.construct_artist = function(mbid, name, cb) {
  sameas.find_dbpedia_link(mbid, name, function(body) {
    var query, params;
    var dbpedia_uri = body;
    params = { URI: dbpedia_uri, LANG: "en" };
    query = qb.buildQuery("construct_artist", params);
    dps.client()
      .query(query)
      .timeout(defaultTimeout)
      .asJson()
      .then(function(r) {
        artist = {}
        if (results.bindings.length > 0) {

        }
        cb(r);
      })
      .catch(function(e) { cb(e) });
  })
}
