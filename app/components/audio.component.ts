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

export class AudioComponent implements OnInit, AfterContentInit {
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
      this._player_attributes = {
        "format": "square",
        "autoplay": "false",
        "playlist": "true",
        "width": Config.deezer_player_width,
        "height": Config.deezer_player_height,
        "color": "007FEB",
        "layout": "dark",
        "size": "medium",
        "type": "radio",
        "app_id": 1
      }
    }

  @Input()
  set setArtist(artist_id: string) {
    this._artist_id = artist_id;
    console.log();
    this.makePlayerSource();
    // this._player_frame = this.sanitizer.bypassSecurityTrustResourceUrl(this._player_html + "&id=artist-" + this._artist_id + "&app_id=1");
    // console.log(this._player_frame);
  }

  ngOnInit() {}

  ngAfterContentInit() {}

  makePlayerSource(): void {
    var source = Config.deezer_player_uri + "?";
    Object.keys(this._player_attributes).forEach(function(key) {
      source += key + "=" + this._player_attributes[key] + "&";
    });
    source += "id=artist-" + this._artist_id;
    this._player_src = source;
    this.addScript();
  }

  addScript(): void {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "./assets/player.js";
    this.elementRef.nativeElement.appendChild(s);
  }

}
