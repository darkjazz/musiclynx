var request = require('request');
var images = require('images');
var image_downloader = require('image-downloader');
var uris = require('./uris').uris;
var qb = require('./query_builder');
var fs = require('fs');

var max_size = 400;

var getImageUri = function(file_name, callback) {
  var request_uri = uris.wikimedia_uri + file_name + "&format=json";
  request({ method: 'GET', uri: request_uri }, function(err, response, body) {
    var json = JSON.parse(body);
    var img_obj = json.query.pages;
    var img_info = img_obj[Object.keys(img_obj)[0]].imageinfo;
    if (img_info.length == 1) {
      img_uri = img_info[0].url;
      if (err) {
        return callback(err);
      }
      return callback(null, img_uri);
    }
  });
};

var downloadImage = function(image_uri, callback) {
  console.log("Downloading " + image_uri);
  var options = {
    url: image_uri,
    dest: uris.source_dir,
    done: function(err, filename, image) {
        if (err) callback(err);
        callback(null, filename);
    },
  };
  image_downloader(options);
}

module.exports.get_reduced_image = function(mbid, cb) {
  var query, params, req_uri;
  if (fs.existsSync(uris.dest_dir + mbid + '.jpg')) {
    console.log("sending local uri: " + uris.dest_dir + mbid + '.jpg');
    cb({ local_uri: uris.dest_dir + mbid + '.jpg' });
  }
  else
  {
    params = { MBID: mbid };
    query = qb.buildQuery("image_by_mbid", params);
    var options = { method: 'GET', uri: uris.wikidata_uri + "sparql?query=" + encodeURIComponent(query) + "&format=json" };
    request(options, function(err, response, body) {
      var wd_file_id, wd_file_name, img_uri, img, wd_entity_id;
      var json = JSON.parse(body);
      if (json.results.bindings.length == 1) {
        wd_file_id = json.results.bindings[0].image_uri.value;
        wd_entity_id = json.results.bindings[0].entity_id.value;
        wd_file_name = wd_file_id.split("/").slice(-1)[0];
        getImageUri(wd_file_name, function(error, img_uri) {
          if (error) cb(error);
          downloadImage(img_uri, function(error, filename) {
            if (error) cb(error);
            var save_name = uris.dest_dir + mbid + "." + filename.split(".").slice(-1)[0].toLowerCase();
            console.log("reducing " + filename + " to " + save_name);
            images(filename).size(max_size).save(save_name);
            cb({ local_uri: save_name, original_uri: img_uri, entity_id: wd_entity_id });
          });
        });
      }
    });
  }
}

module.exports.get_mbid_by_entityid = function(entity_id, cb) {
  var options, params, query;
  params = { ENTITYID: entity_id };
  query = qb.buildQuery("mbid_by_entityid", params);
  options = { method: 'GET', uri: uris.wikidata_uri + "sparql?query=" + encodeURIComponent(query) + "&format=json" };
  request(options, function(err, response, body) {
    var json = JSON.parse(body);
    var result = {};
    if (json.results.bindings && json.results.bindings.length == 1) {
      result['mbid'] = json.results.bindings[0].mbid.value;
    }
    cb(result);
  });
}
