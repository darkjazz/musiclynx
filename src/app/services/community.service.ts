import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Config } from '../objects/config';

export interface Community {
  id: number;
  name: string;
  content_type: string;
  artist_count: number;
  top_genres: string[];
}

@Injectable()
export class CommunityService {
  constructor(private http: Http) {}

  getCommunities(): Promise<Community[]> {
    return this.http.get(Config.server + Config.community + '/list')
      .toPromise()
      .then((res: Response) => res.json() as Community[])
      .catch(err => {
        console.error('Error loading communities', err);
        return [];
      });
  }

  getGraphUrl(): string {
    return Config.server + Config.community + '/graph';
  }
}
