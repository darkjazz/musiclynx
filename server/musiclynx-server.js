var cors = require('cors')
var express = require('express');
var app = module.exports = express();

app.use(cors());

app.use('/api/musicbrainz', require('./modules/musicbrainz'));
app.use('/api/dbpedia', require('./modules/dbpedia'));
app.use('/api/wikidata', require('./modules/wikidata'));
app.use('/api/sameas', require('./modules/sameas'));
//app.use('/api/acousticbrainz', require('./modules/acousticbrainz'));

app.get('/', function (req, res) {
  res.send('MusicLynx Server Root..')
});

app.listen(7757, function () {
  console.log('MusicLynx server listening on port 7757!')
});
