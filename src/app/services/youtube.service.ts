import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Video } from '../objects/video';
import { Config } from '../objects/config';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class YouTubeService {
  url: string;
  videos: Video[];

  constructor(private http: Http) {  }

  getVideos(searchTerm: string): Promise<Video[]> {
    searchTerm = encodeURIComponent(searchTerm);
    this.url = Config.server + `/youtube/search_videos/${ searchTerm }`;
    return this.http.get(this.url)
      .toPromise()
      .then((res:Response) => {
        this.videos = res.json() as Array<Video>;
        return this.videos;
      }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
