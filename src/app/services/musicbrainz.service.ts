import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Artist } from '../objects/artist';
import { Config } from '../objects/config';


@Injectable()
export class MusicBrainzService {
  url: string;
  headers: Headers;
  artists: Artist[];

  constructor(private http: Http) {  }

  getArtists(searchTerm: string): Promise<Artist[]> {
    searchTerm = encodeURIComponent(searchTerm);
    this.url = Config.server + `/musicbrainz/artist_search/${ searchTerm }/${ sessionStorage["user-guid"] }`;
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
          artist.disambiguation = item.disambiguation ? item.disambiguation : this.disambiguate(item);
          this.artists.push(artist);
        }
        return this.artists;
      }).catch(this.handleError);
  }

  disambiguate(artist:Object): string {
    var items = Array<string>();
    if (artist["type"]) items.push(artist["type"]);
    if (artist["begin-area"]) items.push(artist["begin-area"]["name"]);
    if (artist["area"]) items.push(artist["area"]["name"]);
    if (artist["tags"]) artist["tags"].map(tag => items.push(tag["name"]));
    return items.join(", ");
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
