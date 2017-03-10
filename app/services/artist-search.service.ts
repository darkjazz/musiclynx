import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Artist } from '../objects/artist';

@Injectable()
export class ArtistSearchService {
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
}
