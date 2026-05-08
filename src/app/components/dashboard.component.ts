import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../objects/config';

import { Artist } from '../objects/artist';
import { ArtistService } from '../services/artist.service';
import { Spinner } from './spinner.component';

@Component({
  moduleId: module.id,
  selector: 'musiclynx-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  artists: Artist[] = [];
  showSpinner: boolean = true;
  constructor(private router: Router, private artistService: ArtistService) { }

  ngOnInit(): void {
    if (!sessionStorage["musiclynx-layout"])
      sessionStorage["musiclynx-layout"] = "GRAPH";
    this.artistService.getFeaturedArtists()
      .then(artists => {
        for (let i = artists.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [artists[i], artists[j]] = [artists[j], artists[i]];
        }
        this.artists = artists;
        this.showSpinner = false;
      });
  }

  checkLastStoreEntry(group: string, storage: string): boolean {
    var last_item = JSON.parse(storage.split(Config.history_separator).pop());
    return !(last_item == group);
  }

  addCatgeoryToStorage() {
    var groupName = "Featured Artists";
    var storage = localStorage.getItem('musiclynx-history');
    if (storage) {
      storage += Config.history_separator + "\"" + groupName + "\"";
    }
    else {
      storage = "\"" + groupName + "\"";
    }
    localStorage.setItem('musiclynx-history', storage);
    this.artistService.logCategory(groupName);
  }

  gotoDetail(artist: Artist): void {
    this.addCatgeoryToStorage();
    let link = ['/artist', artist.id, artist.name];
    this.router.navigate(link);
  }
}
