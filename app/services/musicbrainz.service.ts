import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Artist } from '../objects/artist';
import 'rxjs/add/operator/toPromise';

var SERVER_URI = "http://localhost:7757/";

@Injectable()
export class MusicBrainzService {
  url: string;
  headers: Headers;
  artists: Artist[];

  constructor(private http: Http) {  }

  getArtists(searchTerm: string): Promise<Artist[]> {
    searchTerm = encodeURIComponent(searchTerm);
    this.url = SERVER_URI + `api/musicbrainz/artist_search/${ searchTerm }`;
    return this.http.request(this.url, { headers: this.headers })
      .toPromise()
      .then((res:Response) => {
        var artist_search_result:Array<any> = res.json()["artists"] as Array<any>;
        this.artists = new Array<Artist>();
        for (let item of artist_search_result) {
          var artist = new Artist();
          artist.id = item.id;
          artist.name = item.name;
          artist.score = +item.score;
          artist.disambiguation = item.disambiguation ? item.disambiguation : "";
          this.artists.push(artist);
        }
        return this.artists;
      }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
