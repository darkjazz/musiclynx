import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../objects/artist';
import { Category } from '../objects/category';
import { ArtistService } from '../services/artist.service';

@Component({
  moduleId: module.id,
  selector: 'artist-detail',
  templateUrl: 'artist.component.html',
  styleUrls: ['artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist: Artist;
  associated_artists: Category;
  categories: Category[];
  ab_categories: Category[];
  mood_category: Category;
  error: any;
  promises: Promise<any>[];

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artist = new Artist();
      this.categories = new Array();
      if (params['id']) {
        this.artist.id = params['id'];
        this.getArtist();
      }
      else {
        window.history.back();
      }
    })
  }

  getArtist(): void {
    this.artistService.getCachedArtist(this.artist.id)
      .then(artist => {
        if (artist.id == this.artist.id) {
          this.artist = artist;
        }
        this.promises = [];
        if (!artist.original_image) this.getImage();
        if (!artist.abstract) this.getProfile();
        if (artist.types && artist.types.length > 0) this.showCategories();
        else { if (artist.dbpedia_uri) this.getCategories(); }
        if (artist.associated_artists && artist.associated_artists.length > 0) this.showAssociatedArtists();
        if (artist.dbpedia_uri && (!artist.associated_artists || artist.associated_artists.length == 0))
          this.getAssociatedArtists();
        if (artist.id) this.getAcousticbrainzCategories();
        if (artist.name) this.getMoodplayLinks();
        Promise.all(this.promises).then(() => {
          this.update();
        }).catch(reason => {
          console.log(reason)
        });
      })
  }

  getName(): void {
    var promise = this.artistService.getArtistName(this.artist.id)
      .then(name => { this.artist.name = name });
    this.promises.push(promise);
  }

  getImage(): void {
    var promise = this.artistService.getImage(this.artist.id)
      .then(artist => {
        this.artist.image = artist.image;
        if (artist.original_image) this.artist.original_image = artist.original_image;
        if (artist.entity_id) this.artist.entity_id = artist.entity_id;
      });
    this.promises.push(promise);
  }

  getProfile(): void {
    var promise = this.artistService.getAbstract(this.artist)
      .then(artist => {
        this.artist = artist;
        if (this.artist.dbpedia_uri && !this.artist.types) {
          this.getCategories();
          this.getAssociatedArtists();
        }
      });
    this.promises.push(promise);
  }

  getAssociatedArtists(): void {
    var promise = this.artistService.getAssociatedArtists(this.artist)
      .then(category => {
        if (category.label) {
          this.associated_artists = category;
          this.artist.associated_artists = category.artists;
        }
      });
    this.promises.push(promise);
  }

  getCategories(): void {
    var promise = this.artistService.getCategories(this.artist.dbpedia_uri)
      .then(response => {
        this.categories = response;
        this.artist.types = this.categories.map(cat => cat.dbpedia_uri);
      });
    this.promises.push(promise);
  }

  getAcousticbrainzCategories(): void {
    this.artistService.getAcousticbrainzLinks(this.artist)
      .then(response => {
        this.ab_categories = response;
      })
  }

  getMoodplayLinks(): void {
    this.artistService.getMoodplayLinks(this.artist)
      .then(response => {
        if (response.label) this.mood_category = response;
      });
  }

  showAssociatedArtists(): void {
    this.associated_artists = {
      label: "Associated Artists",
      parent: this.artist,
      artists: this.artist.associated_artists
    } as Category;
  }

  showCategories(): void {
    var artist_categories = new Array()
    this.artist.types.forEach(function(link) {
      var label = link.replace("Wikicat", "").split("/").slice(-1)[0].replace(/([A-Z])/g, ' $1');
      artist_categories.push({ dbpedia_uri: link, label: label });
    });
    this.categories = artist_categories;
  }

  update(): void {
    this.artistService.updateArtist(this.artist);
  }

  goBack(): void {
    window.history.back();
  }
}
