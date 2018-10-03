import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';

import { MusicBrainzService } from '../services/musicbrainz.service';

@Component({
  moduleId: module.id,
  selector: 'artist-search',
  templateUrl: 'artist-search.component.html',
  styleUrls: ['artist-search.component.css'],
  providers: [MusicBrainzService]
})
export class ArtistSearchComponent {

  constructor(
    private musicbrainzService: MusicBrainzService,
    private router: Router) { }

  search(term: string): void {
    let link = ['/search', encodeURIComponent(term) ];
    this.router.navigate(link);
  }

  suggest(term: string): void { }

}
