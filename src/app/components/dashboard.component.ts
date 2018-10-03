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
    localStorage.clear();
    if (!sessionStorage["musiclynx-layout"])
      sessionStorage["musiclynx-layout"] = "GRAPH";
    this.artistService.getFeaturedArtists()
      .then(artists => {
        this.artists = artists;
        this.showSpinner = false;
      });
  }

  gotoDetail(artist: Artist): void {
    let link = ['/artist', artist.id, artist.name];
    this.router.navigate(link);
  }
}
