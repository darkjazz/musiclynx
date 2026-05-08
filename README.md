## MusicLynx

MusicLynx is a web platform for music discovery that collects information and reveals connections between artists from a range of online sources including [MusicBrainz](https://musicbrainz.org), [Dbpedia](https://dbpedia.org), [Wikidata](https://wikidata.org), [LastFM](http://last.fm), [Deezer](http://deezer.com), [Spotify](http://spotify.com), [Youtube](http://youtube.com), [Vimeo](http://vimeo.com), [AcousticBrainz](http://acousticbrainz.org), and others.

## Components

MusicLynx front-end is developed in [Angular2](https://angular.io), while the data server is implemented in [Express](https://expressjs.com).

## Running locally

Start the API server first (see `musiclynx-server/README.md`). The UI expects it at `http://localhost:8080`.

Then start the Angular dev server from the `musiclynx/` directory:
```
ng serve
```

The app is served at `http://localhost:4200`.

**Note:** This project uses Angular 6 / webpack 3, which requires Node.js 18 or earlier with the legacy OpenSSL provider:
```
NODE_OPTIONS=--openssl-legacy-provider ng serve
```

The server component lives at `../musiclynx-server/`.

## Github pages deployment

This branch is used for the static version development of MusicLynx. The built version is deployed to  Github pages: http://musiclynx.github.io

## License

GNU General Public License v3.0, see [LICENSE.md](https://github.com/darkjazz/musiclynx/blob/static/LICENSE.md)
