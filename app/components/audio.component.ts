import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
//import { SpotifyService } from 'angular2-spotify';

@Component({
  moduleId: module.id,
  selector: 'deezer-playlist',
  templateUrl: 'audio.component.html',
  styleUrls: ['audio.component.css']
//  providers: [ SpotifyService ]
})

export class AudioComponent {
  private _artist_id: string;
  private _player_frame: SafeUrl;
  private _player_html = "https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=400&height=350&color=007FEB&layout=dark&size=medium&type=playlist";
  error: any;

  constructor(
//    private spotifyService: SpotifyService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) { }

  @Input()
  set setArtist(artist_id: string) {
    this._artist_id = artist_id;
    this._player_frame = this.sanitizer.bypassSecurityTrustResourceUrl(this._player_html + "&id=artist-" + this._artist_id + "&app_id=1");
    // console.log(this._player_frame);
  }

}
