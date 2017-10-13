import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../objects/artist';
import { Category } from '../objects/category';
import { Video } from '../objects/video';
import { ArtistService } from '../services/artist.service';
import { YouTubeService } from '../services/youtube.service';

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
  videos: Video[];
  deezer_id: string;
  error: any;

  constructor(
    private artistService: ArtistService,
    private youTubeService: YouTubeService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artist = new Artist();
      if (params['id'] && params['name']) {
        this.artist.name = params['name'];
        if (params['id'].search("http") == -1) {
          this.artist.id = params['id'];
          console.log("Getting MusicBrainz artist");
          this.getMBArtist();
        }
        else {
          this.artist.dbpedia_uri = params['id'];
          console.log("Getting Dbpedia artist");
          this.getDBPArtist();
        }
      }
      else {
        window.history.back();
      }
    })
  }

  getMBArtist(): void {
    this.artistService.constructMusicbrainzArtist(this.artist).then(artist => {
      this.displayArtist(artist);
    }).catch(reason => {
      console.log(reason)
    });
  }

  getDBPArtist(): void {
    this.artistService.constructDbpediaArtist(this.artist).then(artist => {
      this.displayArtist(artist);
    }).catch(reason => {
      console.log(reason)
    });
  }

  displayArtist(artist: Artist): void {
    this.artist = artist;
    if (artist.id) this.getAcousticbrainzCategories();
    if (artist.name) this.getMoodplayLinks();
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

  // showAssociatedArtists(): void {
  //   this.associated_artists = {
  //     label: "Associated Artists",
  //     parent: this.artist,
  //     artists: this.artist.associated_artists
  //   } as Category;
  // }
  //
  getVideos(): void {
    this.youTubeService.getVideos(this.artist.name)
      .then(response => {
        this.videos = response;
      })
  }

  goBack(): void {
    window.history.back();
  }
}
