import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MusicBrainzService } from '../services/musicbrainz.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../objects/artist';

@Component({
  moduleId: module.id,
  selector: 'artist-search',
  templateUrl: 'artist-search.component.html',
  styleUrls: ['artist-search.component.css'],
  providers: [MusicBrainzService, ArtistService]
})
export class ArtistSearchComponent {
  artists: Artist[];
  private searchTerms = new Subject<string>();

  constructor(
    private musicbrainzService: MusicBrainzService,
    private artistService: ArtistService,
    private router: Router) { }

  search(term: string): void {
    // Push a search term into the observable stream.
    this.artists = [];
    this.musicbrainzService.getArtists(term)
      .then(artists => this.artists = artists)
      .catch(error => {
          // TODO: real error handling
          console.log(`Error in component ... ${error}`);
          return [];
        });
  }

  suggest(term: string): void { }

  gotoDetail(artist: Artist): void {
    this.artistService.updateArtist(artist)
      .then(() => {
        let link = ['/artist', artist.id];
        this.router.navigate(link);
      })
  }
}
