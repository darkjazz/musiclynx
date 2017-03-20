var av = require('./validator');
var uris = require('./uris').uris;
var CouchDB = require('node-couchdb');
var fs = require('fs');
var dt = require('date-and-time');
var prefixes = require('./prefixes').prefixes;

const dbName = "musiclynx_artists";
const couch = new CouchDB();

var createContext = function(obj) {
  var pfxs = prefixes.prefixes;
  var context = {};
  for (var key in obj) {
    if (key.indexOf(":") > -1) {
      pfx = key.substring(0, key.indexOf(":"));
      context[pfx] = pfxs[pfx];
    }
  }
  return context;
}

module.exports.get_artist = function (id, cb) {
  couch.get(dbName, id).then(( get_res ) => {
    var artist_json = get_res.data;
    if (fs.existsSync(uris.dest_dir + id + '.jpg')) {
       artist_json.image = uris.dest_dir + id + '.jpg';
    }
    cb(artist_json);
  }, err => {
    if (err.code == "EDOCMISSING") {
      cb({ error: "NOT FOUND" });
    }
    else {
      cb({ error: err });
    }
  });
}

module.exports.save_artist = function (doc, id, cb) {
  doc._id = id;
  if (av.validate(doc)) {
    couch.get(dbName, id).then(( get_res ) => {
      doc._rev = get_res.data._rev;
      doc["co:count"] += 1;
      doc["dc:date"] = dt.format(new Date(), 'YYYY-MM-DD[T]HH:mm:ss[Z]');
      doc["@context"] = createContext(doc);
      console.log(doc);
      couch.update(dbName, doc).then(( ud_data ) => {
        cb(ud_data);
      }, err => {
        cb(ud_data);
      })
    }, err => {
      if (err.code == "EDOCMISSING") {
        doc["co:count"] = 1;
        doc["dc:date"] = dt.format(new Date(), 'YYYY-MM-DD[T]HH:mm:ss[Z]');
        doc["@context"] = createContext(doc);
        console.log(doc);
        couch.insert(dbName, doc).then(( in_data ) => {
          cb(in_data);
        }, err => {
          cb(in_data);
        });
      }
    });
  }
  else {
    cb({ error: "INVALID ARTIST" })
  }
}
