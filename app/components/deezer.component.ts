import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  selector: 'deezer-playlist',
  templateUrl: 'deezer.component.html',
  styleUrls: ['deezer.component.css']
})

export class DeezerComponent {
  private _artist_id: string;
  private _player_frame: SafeUrl;
  private _player_html = "https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=400&height=350&color=007FEB&layout=dark&size=medium&type=playlist";
  error: any;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) { }

  @Input()
  set setArtist(artist_id: string) {
    this._artist_id = artist_id;
    this._player_frame = this.sanitizer.bypassSecurityTrustResourceUrl(this._player_html + "&id=artist-" + this._artist_id + "&app_id=1");
    // console.log(this._player_frame);
  }

}
