import { Component, Input, Inject, Injectable, OnInit, AfterContentInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Config } from '../objects/config';

@Component({
  moduleId: module.id,
  selector: 'deezer-playlist',
  templateUrl: 'audio.component.html',
  styleUrls: ['audio.component.css']
})

export class AudioComponent {
  private _artist_id: string;
  private _player_frame: SafeUrl;
  private _player_src: string;
  private _player_width: Number;
  private _player_height: Number;
  private _player_attributes: Object;
  error: any;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private elementRef: ElementRef
  ) {
      this._player_width = Config.deezer_player_width;
      this._player_height = Config.deezer_player_height;
    }

  @Input()
  set setArtist(artist_id: string) {
    this._artist_id = artist_id;
    this.makePlayerSource();
  }

  makePlayerSource(): void {
    var player_uri;
    this._player_attributes = {
      "format": "square",
      "autoplay": "false",
      "playlist": "false",
      "width": Config.deezer_player_width,
      "height": Config.deezer_player_height,
      "color": "007FEB",
      "layout": "dark",
      "size": "small",
      "type": "radio",
      "app_id": "258682",
      "id": "artist-" + this._artist_id
    }
    player_uri = Config.deezer_player_uri + "?" + Object.keys(this._player_attributes).map((key)=>{
      return key + "=" + this._player_attributes[key];
    }).join("&");
    this._player_src = this.sanitizer.bypassSecurityTrustResourceUrl(player_uri);

  }

  addScript(): void {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "./assets/player.js";
    this.elementRef.nativeElement.appendChild(s);
  }

}
