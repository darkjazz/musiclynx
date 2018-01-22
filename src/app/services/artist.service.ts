import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { Artist } from '../objects/artist';
import { Category } from '../objects/category';
import { Graph } from '../objects/graph';
import { Config } from '../objects/config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Base64 as b64 } from 'js-base64';

const GRAPH_LIMIT = 73;

const FILTER = {
  ranking: 0,
  jaccard: 1,
  collaborative: 2,
  sorensen: 3,
  max_degree: 4,
  heat_prob: 5
}

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

  getFeaturedArtists(): Promise<Artist[]> {
    return this.http.get(Config.server + Config.artist + '/get_featured_artists')
      .toPromise()
      .then((res:Response) => {
        return res.json() as Artist[];
      })
      .catch(this.handleError);
  }

  getLocalArtist(id: string): Promise<Artist> {
    return this.getArtists().then(artists => artists.find(artist => artist.id === id))
  }

  getArtistName(id: string): Promise<string> {
    return this.getLocalArtist(id).then(artist => artist.name);
  }

  constructMusicbrainzArtist(artist: Artist): Promise<Artist> {
    var id = artist.id;
    var name = encodeURIComponent(artist.name);
    var params = `/${ id }/${ name }`;
    return this.http.get(Config.server + Config.artist + '/get_mb_artist' + params)
      .toPromise()
      .then((res:Response) => {
        return res.json() as Artist;
      })
      .catch(this.handleError);
  }

  constructDbpediaArtist(artist: Artist): Promise<Artist> {
    var artist_uri = b64.encode(artist.dbpedia_uri);
    var name = encodeURIComponent(artist.name);
    var params = `/${ artist_uri }/${ name }`;
    return this.http.get(Config.server + Config.artist + '/get_dbp_artist' + params)
      .toPromise()
      .then((res:Response) => {
        return res.json() as Artist;
      })
      .catch(this.handleError);
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

  public getCategoryLinks(category: Category, artist: Artist, limit: Number): Promise<Category> {
    var yago_uri = b64.encode(category.uri);
    var artist_uri = b64.encode(artist.dbpedia_uri);
    var params = `/${ yago_uri }/${ artist_uri }/${ limit }`;
    var uri = Config.server + Config.dbpedia + '/get_category_links' + params;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        return res.json() as Category;
      })
      .catch(this.handleError)
  }

  public getAcousticbrainzLinks(artist: Artist): Promise<Category[]> {
    var param = `/${ artist.id }`;
    return this.http.get(Config.server + Config.artist + '/get_acousticbrainz_artists' + param)
      .toPromise()
      .then((res:Response) => {
        if (Array.isArray(res.json())) return res.json() as Category[];
        else return [];
      })
      .catch(this.handleError);
  }

  public getMoodplayLinks(artist: Artist, limit: Number): Promise<Category> {
    var param = `/${ artist.id }`;
    return this.http.get(Config.server + Config.artist + '/get_moodplay_artists' + param)
      .toPromise()
      .then((res:Response) => {
        return res.json() as Category;
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

  public getDeezerArtistID(artist: Artist): Promise<Number> {
    var term = encodeURIComponent(artist.name);
    var param = `/${ term }`;
    var uri = Config.server + Config.audio + '/get_deezer_id' + param;
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        var json = res.json();
        return json.id as Number;
      })
      .catch(this.handleError)
  }

  public getArtistGraph(artist: Artist): Promise<Graph> {
    var dbpedia_uri = b64.encode(artist.dbpedia_uri);
    var name = encodeURIComponent(artist.name);
    var id = artist.id;
    var limit = GRAPH_LIMIT;
    var filter = FILTER["max_degree"];
    var degree;
    if (artist.categories && artist.categories.length > 0)
      degree = artist.categories.length;
    else
      degree = 0;
    var params = `/${ dbpedia_uri }/${ name }/${ id }/${ limit }/${ filter }/${ degree }`;
    var uri = Config.server + Config.artist + '/get_artist_graph' + params;
    console.log(uri);
    return this.http.get(uri)
      .toPromise()
      .then((res:Response) => {
        return res.json() as Graph;
      })
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
