import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../objects/config';

import { Artist } from '../objects/artist'
import { ArtistService } from '../services/artist.service'

@Component({
  moduleId: module.id,
  selector: 'musiclynx-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  artists: Artist[] = [];
  constructor(private router: Router, private artistService: ArtistService) { }

  ngOnInit(): void {
    this.artistService.getArtists()
      .then(artists => this.artists = artists);
  }

  gotoDetail(artist: Artist): void {
    let link = ['/artist', artist.id, artist.name];
    this.router.navigate(link);
  }
}
