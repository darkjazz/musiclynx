import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Artist, ArtistMap } from '../objects/artist';
import { Category } from '../objects/category';
import { Config } from '../objects/config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import * as b64 from 'base-64';

@Injectable()
export class ArtistService {
  private artistsUrl = 'app/artists'
  constructor(private http: Http) { }

  getArtists(): Promise<Artist[]> {
    return this.http
      .get(this.artistsUrl)
      .toPromise()
      .then(response => response.json().data as Artist[])
      .catch(this.handleError);
  }

  getArtist(id: string): Promise<Artist> {
    return this.getArtists().then(artists => artists.find(artist => artist.id === id))
  }

  getArtistName(id: string): Promise<string> {
    return this.getArtist(id).then(artist => artist.name);
  }

  getCachedArtist(id: string): Promise<Artist> {
    var param = `/${ id }`;
    return this.http.get(Config.server + '/musiclynx/artist' + param)
      .toPromise()
      .then((res:Response) => {
        var artist_json = res.json();
        var artist;
        if ("error" in artist_json) {
          artist = new Artist();
        }
        else {
          artist = this.deserialize(artist_json);
          if ("image" in artist_json) artist.image = "./server/" + artist_json.image;
        }
        return artist;
      })
  }

  public getImage (id: string): Promise<Artist> {
    var param = `/${ id }`;
    return this.http.get(Config.server + Config.wikidata + '/get_reduced_image' + param)
      .toPromise()
      .then((res:Response) => {
        var response = res.json();
        var artist = new Artist();
        artist.image = "./" + response.local_uri;
        if ("original_uri" in response) artist.original_image = response.original_uri;
        if ("entity_id" in response) artist.entity_id = response.entity_id;
        return artist;
      })
      .catch(this.handleError);
  }

  // public getDBPediaURI(artist: Artist): Promise<Artist> {
  //   return new Promise<Artist>;
  // }

  public getAbstract(artist: Artist): Promise<Artist> {
    var encoded_uri = b64.encode(artist.dbpedia_uri);
    var param = `/${ encoded_uri }`;
    var uri = Config.server + Config.dbpedia + '/get_artist_abstract_directly' + param;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var response = res.json();
        artist.abstract = response.abstract;
        artist.dbpedia_uri = response.dbpedia_uri;
        artist.wikipedia_uri = response.about;
        return artist;
      })
      .catch(this.handleError)
  }

  public getAssociatedArtists(artist: Artist): Promise<Category> {
    var encoded_uri = b64.encode(artist.dbpedia_uri);
    var param = `/${ encoded_uri }`;
    var uri = Config.server + Config.dbpedia + '/get_associated_artists' + param;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var artists = res.json();
        var category = new Category();
        if (artists.length > 0) {
          category.label = "Associated Artists";
          category.parent = artist;
          category.artists = artists;
        }
        return category;
      })
      .catch(this.handleError)
  }

  public getCategories(dbpedia_uri: string): Promise<Category[]> {
    var encoded_uri = b64.encode(dbpedia_uri);
    var param = `/${ encoded_uri }`;
    var uri = Config.server + Config.dbpedia + '/get_categories' + param;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        var links = [];
        if (json.length > 0) {
          json.forEach(function(row){
            var label = row.yago.value.replace("Wikicat", "").split("/").slice(-1)[0].replace(/([A-Z0-9]+)/g, ' $1');
            console.log(label);
            links.push({ dbpedia_uri: row.yago.value, label: label });
          });
        }
        return links;
      })
      .catch(this.handleError)
  }

  public getCategoryLinks(category: Category, artist: Artist, limit: Number): Promise<Category> {
    var yago_uri = b64.encode(category.dbpedia_uri);
    var artist_uri = b64.encode(artist.dbpedia_uri);
    var params = `/${ yago_uri }/${ artist_uri }/${ limit }`;
    var uri = Config.server + Config.dbpedia + '/get_category_links' + params;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        var artists = [];
        json.forEach(function(row) {
          artists.push({ dbpedia_uri: row.uri.value, name: row.name.value });
        });
        category.artists = artists;
        return category;
      })
      .catch(this.handleError)
  }

  public getAcousticbrainzLinks(artist: Artist): Promise<Category[]> {
    var param = `/${ artist.id }`;
    return this.http.get(Config.server + Config.acousticbrainz + '/get_similar_artists' + param)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        var categories = new Array();
        var map = {
          "Rhythm": "Acousticbrainz Similar Artists By Rhythm",
          "Tonal": "Acousticbrainz Similar Artists By Tonality",
          "Timbral": "Acousticbrainz Similar Artists By Timbre"
        };
        if ("Rhythm" in json && "Tonal" in json && "Timbral" in json) {
          for (var key in map) {
            var category = new Category();
            category.label = map[key];
            category.parent = artist;
            category.artists = json[key].map(json_artist => {
              var artist = new Artist();
              artist.id = json_artist.id;
              artist.name = json_artist.name;
              return artist;
            });
            categories.push(category);
          }
        }
        return categories;
      })
      .catch(this.handleError);
  }

  public getMoodplayLinks(artist: Artist, limit: Number): Promise<Category> {
    var name = encodeURIComponent(artist.name);
    var params = `/${ name }/${ limit }`;
    return this.http.get(Config.server + Config.moodplay + '/get_similar_artists' + params)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        var category = new Category();
        if (json.length > 0) {
            category.label = "Moodplay Similar Artists";
            category.parent = artist;
            category.artists = json;
        }
        return category;
      })
      .catch(this.handleError);
  }

  public getLastFMLinks(artist: Artist): Promise<Category> {
    var name = encodeURIComponent(artist.name);
    var id = artist.id;
    var params = `/${ id }/${ name }`;
    return this.http.get(Config.server + Config.lastfm + '/get_similar_artists' + params)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        var category = new Category();
        if (json.length > 0) {
            category.label = "Last.FM Similar Artists";
            category.parent = artist;
            category.artists = json;
        }
        return category;
      })
      .catch(this.handleError);
  }

  public getMusicbrainzID(artist: Artist): Promise<Artist> {
    var artist_uri = b64.encode(artist.dbpedia_uri);
    var artist_name = encodeURIComponent(artist.name);
    var params = `/${ artist_uri }/${ artist_name }`;
    var uri = Config.server + Config.sameas + '/find_musicbrainz_id' + params;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var artist = res.json();
        return artist;
      })
      .catch(this.handleError)
  }

  public updateArtist(artist: Artist): Promise<Artist> {
    var uri = Config.server + '/artist' + `/${ artist.id }`;
    var body = this.serialize(artist);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(uri, body, options)
      .toPromise()
      .then((res:Response) => {
        return new Artist();
      })
      .catch(this.handleError)
  }

  private serialize(artist: Artist): string {
    var artist_json = {};
    for (var key in ArtistMap) {
      var json_key = ArtistMap[key];
      artist_json[json_key] = artist[key];
    }
    return JSON.stringify(artist_json);
  }

  private deserialize(artist_json: any): Artist {
    var artist = new Artist();
    artist.id = artist_json._id;
    for (var key in ArtistMap) {
      var map_value = ArtistMap[key];
      artist[key] = artist_json[map_value];
    }
    return artist;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
