import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable ,  Subject } from 'rxjs';

import { MusicBrainzService } from '../services/musicbrainz.service';
import { Config } from '../objects/config';

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
    if (term) {
      let link = ['/search', encodeURIComponent(term) ];
      this.storeInHistory(term);
      this.router.navigate(link);      
    }
  }

  storeInHistory(term: string) {
    var storage = localStorage.getItem('musiclynx-history');
    var search = "\"Search for " + term + "\"";
    if (storage) {
      storage += Config.history_separator + search;
    }
    else {
      storage = search;
    }
    localStorage.setItem("musiclynx-history", storage);
  }

}
