var cors = require('cors')
var express = require('express');
var bodyParser = require('body-parser');
var av = require('./modules/models/validator');
var uris = require('./modules/models/uris').uris;
var CouchDB = require('node-couchdb');
var fs = require('fs');
var dt = require('date-and-time');
var prefixes = require('./modules/models/prefixes').prefixes;

const dbName = "musiclynx_artists";

var app = module.exports = express();

app.use(cors());

const couch = new CouchDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/musicbrainz', require('./modules/api/musicbrainz'));
app.use('/dbpedia', require('./modules/api/dbpedia'));
app.use('/wikidata', require('./modules/api/wikidata'));
app.use('/sameas', require('./modules/api/sameas'));
app.use('/acousticbrainz', require('./modules/api/acousticbrainz'));
app.use('/moodplay', require('./modules/api/moodplay'));
app.use('/youtube', require('./modules/api/youtube'));

app.get('/', function (req, res) {
  res.send('MusicLynx Server Root..')
});

app.get('/time/', function (req, res) {
  res.send(dt.format(new Date(), 'YYYY-MM-DD[T]HH:mm:ss[Z]'));
});

app.get('/artist/:id', function (req, res) {
  couch.get(dbName, req.params.id).then(( get_res ) => {
    var artist_json = get_res.data;
    if (fs.existsSync(uris.dest_dir + req.params.id + '.jpg')) {
       artist_json.image = uris.dest_dir + req.params.id + '.jpg';
    }
    res.send(artist_json);
  }, err => {
    if (err.code == "EDOCMISSING") {
      res.send({ error: "NOT FOUND" });
    }
    else {
      res.send({ error: err });
    }
  });
});

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

// json-ld context should be added here, not in client !!!!
app.post('/artist/:id', function (req, res) {
  var doc = req.body;
  doc._id = req.params.id;
  if (av.validate(doc)) {
    couch.get(dbName, req.params.id).then(( get_res ) => {
      doc._rev = get_res.data._rev;
      doc["co:count"] += 1;
      doc["dc:date"] = dt.format(new Date(), 'YYYY-MM-DD[T]HH:mm:ss[Z]');
      doc["@context"] = createContext(doc);
      console.log(doc);
      couch.update(dbName, doc).then(( ud_data ) => {
        res.send(ud_data);
      }, err => {
        res.send(ud_data);
      })
    }, err => {
      if (err.code == "EDOCMISSING") {
        doc["co:count"] = 1;
        doc["dc:date"] = dt.format(new Date(), 'YYYY-MM-DD[T]HH:mm:ss[Z]');
        doc["@context"] = createContext(doc);
        console.log(doc);
        couch.insert(dbName, doc).then(( in_data ) => {
          res.send(in_data);
        }, err => {
          res.send(in_data);
        });
      }
    });
  }
  else {
    res.send({ error: "INVALID ARTIST" })
  }
});

app.listen(7757, function () {
  console.log('MusicLynx server listening on port 7757!')
});
