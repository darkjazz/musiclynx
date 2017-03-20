var Couch = require('node-couchdb');

const couch = new Couch();
const dbName = "js_div_db";
const max_links = 30;

module.exports.get_artist = function(id, cb) {
  couch.get(dbName, '_design/views/_view/id_exists', { key: id, group: true }).then((cdbr) => {
    cb(cdbr);
  }, err => {
    if (err.code == "EDOCMISSING") {
      cb({ error: "NOT FOUND" });
    }
    else {
      cb({ error: err });
    }
  });
}

module.exports.get_similar_artists = function(id, cb) {
  couch.get(dbName, '_design/views/_view/all_by_mbid', { 'key': id }).then((cdbr) => {
    var features = { id: id };
    cdbr.data.rows.forEach(function(row) {
      var top = row.value.values.slice(0, max_links);
      features[row.value.type] = top;
    });
    cb(features);
  }, err => {
    if (err.code == "EDOCMISSING") {
      cb({ error: "NOT FOUND" });
    }
    else {
      cb({ error: err });
    }
  })
}
