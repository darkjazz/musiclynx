import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Artist }         from '../objects/artist';
import { Category }       from '../objects/category';
import { Track }          from '../objects/track';
import { ArtistService }  from '../services/artist.service';
import { PlayerService }  from '../services/player.service';
import { DeezerService }  from '../services/deezer.service';

const MAX_ARTISTS = 30;

@Component({
  moduleId: module.id,
  selector: 'artist-detail',
  templateUrl: 'artist.component.html',
  styleUrls: ['artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist: Artist;
  ab_categories: Category[];
  mood_category: Category;
  lastfm_category: Category;
  deezer_id: string;
  error: any;
  showSpinner: boolean;
  tracks: Array<any>;
  index:number;
  isPlaying: boolean = false;
  cover: string;
  title: string;
  layout: string;

  constructor(
    private artistService: ArtistService,
    private playerService: PlayerService,
    private deezerService: DeezerService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artist = new Artist();
      if (!sessionStorage["musiclynx-layout"])
        sessionStorage["musiclynx-layout"] = "GRAPH";
      this.layout = sessionStorage["musiclynx-layout"];
      if (params['id'] && params['name']) {
        this.artist.name = params['name'];
        if (params['id'].search("http") == -1) {
          this.artist.id = params['id'];
          this.getMBArtist();
        }
        else {
          this.artist.dbpedia_uri = params['id'];
          this.getDBPArtist();
        }
      }
      else {
        window.history.back();
      }
    })
  }

  getMBArtist(): void {
    this.showSpinner = true;
    this.cover = "./assets/deezer.png";
    this.artistService.constructMusicbrainzArtist(this.artist).then(artist => {
      this.displayArtist(artist);
    }).catch(reason => {
      console.log(reason)
    });
  }

  getDBPArtist(): void {
    this.showSpinner = true;
    this.cover = "./assets/deezer.png";
    this.artistService.constructDbpediaArtist(this.artist).then(artist => {
      this.displayArtist(artist);
    }).catch(reason => {
      console.log(reason)
    });
  }

  displayArtist(artist: Artist): void {
    this.showSpinner = false;
    this.artist = artist;
    if (artist.id) this.getAcousticbrainzCategories();
    if (artist.name) this.getMoodplayLinks();
    if (artist.name) this.getDeezerID();
    this.storeInHistory(artist);
  }

  storeInHistory(artist: Artist) {
    var storage = localStorage.getItem('musiclynx-history');
    var artist_string = JSON.stringify({ id: artist.id, name: artist.name });
    if (storage)
      storage += "|" + artist_string;
    else
      storage = artist_string;
    console.log(storage);
    localStorage.setItem("musiclynx-history", storage);
  }

  getImage(): void {
    this.artistService.getImage(this.artist.id)
      .then(artist => {
        this.artist.image = artist.image;
        if (artist.original_image) this.artist.original_image = artist.original_image;
        if (artist.entity_id) this.artist.entity_id = artist.entity_id;
      });
  }

  getAcousticbrainzCategories(): void {
    this.artistService.getAcousticbrainzLinks(this.artist)
      .then(response => {
        this.ab_categories = response;
      })
  }

  getMoodplayLinks(): void {
    this.artistService.getMoodplayLinks(this.artist, MAX_ARTISTS)
      .then(response => {
        if (response.label) this.mood_category = response;
      });
  }

  getLastFMLinks(): void {
    this.artistService.getLastFMLinks(this.artist)
      .then(response => {
        if (response.label) this.lastfm_category = response;
      });
  }

  getDeezerID(): void {
    this.artistService.getDeezerArtistID(this.artist)
      .then(response => {
        this.deezer_id = response.toString();
        this.deezerService.getTracks(this.deezer_id)
          .subscribe(tracks => this.getTracks(tracks));
        let event = this.playerService.playerEvents;
        event.onEnd$
          .subscribe(event$ => this.onEnd());
        event.playing$
          .subscribe(event$ => this.playing(event$));
      }).catch(reason => {
        console.log(reason)
      });
  }

  showGraph(): boolean {
    return this.layout == "GRAPH" && !!this.artist.dbpedia_uri;
  }

  showGrid(): boolean {
    return this.layout == "GRID";
  }

  goBack(): void {
    window.history.back();
  }

  // --------------------- player methods ----------------------
  getTracks(tracks):void {
    if (tracks.length > 0) {
      this.tracks = tracks;
      this.cover = tracks[0].cover_medium;
      this.playerService.init(tracks);
    }
  }

  selectTrack(i):void {
    this.cover = this.tracks[i].cover_medium;
    // this.title = tracks[i].title;
    this.playerService.playNew(i);
    this.index = i;
  }

  play() {
    this.playerService.play();
  }

  pause() {
    this.playerService.pause();
  }

  stop() {
    if(this.isPlaying) {
        this.playerService.stop();
    }
  }

  next() {
    this.playerService.playNext();
  }

  previous() {
    this.playerService.playPrevious();
  }

  playing(playing) {
    this.isPlaying = playing;
  }

  onEnd() {
    this.playerService.playNext();
    this.index += 1;
  }
}
