var request = require('request');
var fsm = require('fuzzy-string-matching');
var qb = require('./query_builder');
var uris = require('./uris').uris;
var b64 = require('base-64');
var wd = require('./wikidata');
var mb = require('./musicbrainz');

var findBestMatch = function(duplicates, name) {
  var best_match, high_score;
  best_match = duplicates[0];
  high_score = fsm(uris.dbpedia_resource + name.replace(" ", "_"), best_match.replace("_(musician)", ""));
  duplicates.forEach(function(uri) {
    if (uri.search(uris.dbpedia_resource) > -1) {
      var score = fsm(uris.dbpedia_resource + name.replace(" ", "_"), uri.replace("_(musician)", ""));
      if (score > high_score) {
        high_score = score;
        best_match = uri;
      }
    }
  });
  if (!best_match.includes(uris.dbpedia_resource)) {
    best_match = uris.dbpedia_resource + name.replace(new RegExp(" ", 'g'), "_");
  }
  return best_match;
}

var findMBID = function(duplicates) {
  var match="";
  duplicates.forEach(function(uri) {
    if (uri.search(uris.bbc_artists) > -1) {
      match = uri.split("/").slice(-1)[0];
    }
  });
  return match;
}

module.exports.find_dbpedia_link = function(mbid, artist_name, cb) {
  var query = uris.bbc_artists + mbid + '#artist';
  request({ method: 'GET', uri: uris.sameas + 'json?uri=' + query }, function(err, response, body)
  {
    var json = JSON.parse(body);
    var match = findBestMatch(json[0]["duplicates"], artist_name);
    cb(match);
  });
}

module.exports.find_musicbrainz_id = function(artist_uri, name, cb) {
  request({ method: 'GET', uri: uris.sameas + 'json?uri=' + artist_uri }, function(err, response, body)
  {
    var json = JSON.parse(body);
    var match = findMBID(json[0]["duplicates"]);
    if (match) {
      var artist = {
        name: decodeURIComponent(name),
        id: match.split('#')[0],
        dbpedia_uri: artist_uri
      }
      cb(artist);
    }
    else {
      if (json.uri) {
        var entity_id = json.uri.split("/").slice(-1)[0];
        wd.get_mbid_by_entityid(entity_id, function(mbid) {
          var wd_artist = {
            id: mbid['mbid'],
            name: name,
            entity_id: entity_id,
            dbpedia_uri: artist_uri
          };
          cb(artist);
        })
      }
      else {
        mb.artist_search(name, function(body) {
          var json = JSON.parse(body);
          console.log(json);
          if (json["artists"].length > 0 && json["artists"][0].score == 100) {
            var artist = {
              id: json["artists"][0].id,
              name: json["artists"][0].name,
              score: 100,
              dbpedia_uri: artist_uri
            };
            cb(artist);
          }
        });
      }
    }
  });
}
