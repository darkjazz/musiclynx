import { Injectable } from '@angular/core';
import { Jsonp, Response } from '@angular/http';
import { Howl } from 'howler';

import { Track } from '../objects/track';
import { Observable }     from 'rxjs/rx';

@Injectable()
export class DeezerService {
  //private baseUrl = 'https://api.deezer.com/playlist/1266968331?output=jsonp&callback=JSONP_CALLBACK' //URL to deezer API
  private baseUrl = 'https://api.deezer.com/artist';
  private queryStr = 'limit=13&output=jsonp&callback=JSONP_CALLBACK'

  constructor(private jsonp: Jsonp) { }

  getTracks(artist_id: string): Observable<Track[]> {
    var uri = this.baseUrl + `/${ artist_id }/top?` + this.queryStr;
    let tracks = this.jsonp
      .get(uri)
      .map(mapTracks);
    return tracks;
  }

}

function mapTracks(response:Response) {
  return response.json().data.map(toTrack)
}

function toTrack(r:any): Track{
  let track = <Track>({
    id: r.id,
    title: r.title,
    artist: r.artist.name,
    preview: r.preview,
    cover_small: r.album.cover_small,
    cover_medium: r.album.cover_medium,
    playing: false,
    active: false
  })
  return track;
}
