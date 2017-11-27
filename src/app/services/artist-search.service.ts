import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Artist } from '../objects/artist';
import { Config } from '../objects/config';

@Injectable()
export class ArtistSearchService {
  url: string;
  artists: Artist[];

  constructor(private http: Http) { }

  search(term: string): Observable<Artist[]> {
    return this.http
      .get(`app/artists/?name=${term}`)
      .map((r: Response) => r.json().data as Artist[])
      .catch((error: any) => {
          console.error('An friendly error occurred', error);
          return Observable.throw(error.message || error);
      });
  }

  // move this function eventually elsewhere
  searchMusicLynxArtists(searchTerm: string): Promise<Artist[]> {
    searchTerm = encodeURIComponent(searchTerm);
    this.url = Config.server + `/musiclynx/artist_search/${ searchTerm }`;
    return this.http.get(this.url)
      .toPromise()
      .then((res:Response) => {
        this.artists = res.json() as Array<Artist>;
        return this.artists;
      }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
