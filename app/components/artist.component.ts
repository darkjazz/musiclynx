import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../objects/artist';
import { ArtistService } from '../services/artist.service';

@Component({
  moduleId: module.id,
  selector: 'artist-detail',
  templateUrl: 'artist.component.html',
  styleUrls: ['artist.component.css']
})
export class ArtistComponent implements OnInit {
  artist: Artist;
  categories: Object[];
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private artistService: ArtistService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artist = new Artist();
      this.navigated = true;
      if (params['id'] && params['name']) {
        this.artist.id = params['id'];
        this.artist.name = params['name'];
        this.getImage();
        this.getAbstract();
      }
      else
      {
        this.navigated = false;
      }
    })
  }

  getImage(): void {
    this.artistService.getImage(this.artist.id)
      .then(image => { this.artist.image = image });
  }

  getAbstract(): void {
    this.artistService.getAbstract(this.artist)
      .then(response => {
        this.artist.abstract = response.abstract;
        this.artist.dbpedia_uri = response.dbpedia_uri;
        this.artist.wikipedia_uri = response.about;
        if (this.artist.dbpedia_uri) {
          this.getCategories();
        }
      });
  }

  getCategories(): void {
    this.artistService.getCategories(this.artist.dbpedia_uri)
      .then(response => this.categories = response)
  }

  goBack(): void {
    if (this.navigated) { window.history.back(); }
  }
}
