import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MusicBrainzService } from '../services/musicbrainz.service';
import { Artist } from '../objects/artist';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'artist-search',
  templateUrl: 'artist-search.component.html',
  styleUrls: ['artist-search.component.css'],
  providers: [MusicBrainzService]
})
export class ArtistSearchComponent {
  artists: Artist[];
  private searchTerms = new Subject<string>();

  constructor(
    private musicbrainzService: MusicBrainzService,
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

  // ngOnInit(): void {
  //   // this.artists = this.searchTerms
  //   //   .debounceTime(300)        // wait for 300ms pause in events
  //   //   .distinctUntilChanged()   // ignore if next search term is same as previous
  //   //   .switchMap(term => term   // switch to new observable each time
  //   //     // return the http search observable
  //   //     ? this.musicbrainzService.getArtists(term)
  //   //     // or the observable of empty artists if no search term
  //   //     : Observable.of<Artist[]>([]))
  //   //   .catch(error => {
  //   //     // TODO: real error handling
  //   //     console.log(`Error in component ... ${error}`);
  //   //     return Observable.of<Artist[]>([]);
  //   //   });
  // }

  gotoDetail(artist: Artist): void {
    let link = ['/artist', artist.id, artist.name];
    this.router.navigate(link);
  }
}
