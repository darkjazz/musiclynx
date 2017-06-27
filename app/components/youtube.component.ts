import { Component, EventEmitter, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer} from '@angular/platform-browser';

import { Artist } from '../objects/artist';
import { Video } from '../objects/video';

@Component({
  moduleId: module.id,
  selector: 'youtube-videos',
  templateUrl: 'youtube.component.html',
  styleUrls: ['youtube.component.css']
})

export class YouTubeComponent {
  private _artist: Artist;
  private _current: Video;
  private _videos: Video[];
  error: any;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) { }

  @Input()
  set setArtist(artist: Artist) {
    this._artist = artist;
  }

  @Input()
  set setVideos(videos: Video[]) {
    this._videos = videos;
    this._current = videos[0];
  }

}
