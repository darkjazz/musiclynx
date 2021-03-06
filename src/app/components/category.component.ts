import { Component, Input, OnInit } from '@angular/core';
import { trigger,
    state,
    style,
    transition,
    animate,
    keyframes } from '@angular/animations';
import { Router } from '@angular/router';
import { Artist } from '../objects/artist';
import { Category } from '../objects/category';
import { ArtistService } from '../services/artist.service';

const MAX_LINKS = 30;

@Component({
  moduleId: module.id,
  selector: 'category-links',
  templateUrl: 'category.component.html',
  styleUrls: ['category.component.css']
  // animations: [
  //   trigger('triggerState', [
  //     state('show', style({ height: '100%' })),
  //     state('hide', style({ height: '0' })),
  //     transition('hide => show', animate('200ms')),
  //     transition('show => hide', animate('200ms'))
  //   ])
  // ]
})

export class CategoryComponent implements OnInit {
  private _category: Category;
  private _artist: Artist;
  state: string = 'hide';

  constructor(private artistService: ArtistService, private router: Router) { }

  ngOnInit(): void {
    if (!this._category.artists) this.getArtists();
  }

  @Input()
  set setCategory(category: Category) {
    this._category = category;
  }

  get getCategory(): Category { if (this._category.artists && this._category.artists.length > 0 && this._category.label.indexOf("Albums") == -1) return this._category; }

  @Input()
  set setArtist(artist: Artist) {
    this._artist = artist;
  }

  get getArtist(): Artist { return this._artist; }

  getArtists(): void {
    if (!this._category.artists) {
      this.artistService.getCategoryLinks(this._category, this._artist, MAX_LINKS)
        .then(response => {
          this._category = response;
          this.state == 'show';
        });
    }
    {
      this.state = (this.state === 'show' ? 'hide': 'show');
    }
  }

  gotoDetail(artist: Artist): void {
    var link;
    if ('id' in artist && artist.id) {
      let link = ['/artist', artist.id, artist.name ];
      this.router.navigate(link);
    }
    else
    {
      let link = ['/artist', artist.dbpedia_uri, artist.name ];
      this.router.navigate(link);
    }

  }

}
