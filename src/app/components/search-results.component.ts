import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { MusicBrainzService } from '../services/musicbrainz.service';
import { ArtistService } from '../services/artist.service';
import { Artist } from '../objects/artist';
import { Spinner } from './spinner.component';

@Component({
  moduleId: module.id,
  selector: 'search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: ['search-results.component.css'],
  providers: [MusicBrainzService, ArtistService]
})
export class SearchResultsComponent implements OnInit {
  artists: Artist[];
  term: string;
  showNoResults: boolean = false;
  private searchTerms = new Subject<string>();
  showSpinner: boolean = true;

  constructor(
    private musicbrainzService: MusicBrainzService,
    private artistService: ArtistService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artists = [];
      if (params['term']) {
        this.term = decodeURIComponent(params['term']);
        this.musicbrainzService.getArtists(this.term)
          .then(artists => {
            this.showSpinner = false;
            if (artists.length == 0) this.showNoResults = true;
            else this.artists = artists;
          })
          .catch(error => {
              // TODO: real error handling
              console.log(`Error in component ... ${error}`);
              return [];
          });
      }
      else
      {
        window.history.back();
      }
    });
  }

  gotoDetail(artist: Artist): void {
    let link = ['/artist', artist.id, encodeURIComponent(artist.name)];
    this.router.navigate(link);
  }
}
