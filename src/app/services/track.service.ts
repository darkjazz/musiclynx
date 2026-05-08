import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Config } from '../objects/config';
import { MbTrack } from '../objects/mb-track';

@Injectable()
export class TrackService {
  constructor(private http: Http) {}

  searchTracks(term: string): Promise<MbTrack[]> {
    return this.http.get(`${Config.server}${Config.track}/search/${encodeURIComponent(term)}`)
      .toPromise()
      .then((res: Response) => res.json() as MbTrack[])
      .catch(this.handleError);
  }

  getTracksByArtist(artistMbid: string): Promise<MbTrack[]> {
    return this.http.get(`${Config.server}${Config.track}/by_artist/${artistMbid}`)
      .toPromise()
      .then((res: Response) => res.json() as MbTrack[])
      .catch(this.handleError);
  }

  getTrack(mbid: string): Promise<MbTrack> {
    return this.http.get(`${Config.server}${Config.track}/get_track/${mbid}`)
      .toPromise()
      .then((res: Response) => res.json() as MbTrack)
      .catch(this.handleError);
  }

  getTrackGraph(mbid: string): Promise<any> {
    return this.http.get(`${Config.server}${Config.track}/get_graph/${mbid}`)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  getTrackPreview(title: string, artist: string): Promise<{ preview: string, cover: string }> {
    const params = `title=${encodeURIComponent(title)}&artist=${encodeURIComponent(artist)}`;
    return this.http.get(`${Config.server}${Config.audio}/get_track_preview?${params}`)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(() => null);
  }

  private handleError(error: any): Promise<any> {
    console.error('TrackService error', error);
    return Promise.reject(error.message || error);
  }
}
