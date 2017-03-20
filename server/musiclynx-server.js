var cors = require('cors')
var express = require('express');
var bodyParser = require('body-parser');

var app = module.exports = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/musiclynx', require('./modules/api/musiclynx'));
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

app.listen(7757, function () {
  console.log('MusicLynx server listening on port 7757!')
});
