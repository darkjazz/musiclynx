import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { MusicBrainzService } from '../services/musicbrainz.service';
import { TrackService } from '../services/track.service';
import { Artist } from '../objects/artist';
import { MbTrack } from '../objects/mb-track';

@Component({
  moduleId: module.id,
  selector: 'search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: ['search-results.component.css'],
  providers: [MusicBrainzService, TrackService]
})
export class SearchResultsComponent implements OnInit {
  artists: Artist[] = [];
  tracks: MbTrack[] = [];
  term: string;
  showSpinner = true;
  showNoResults = false;

  constructor(
    private musicbrainzService: MusicBrainzService,
    private trackService: TrackService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artists = [];
      this.tracks = [];
      this.showNoResults = false;
      this.showSpinner = true;

      if (!params['term']) { window.history.back(); return; }

      this.term = decodeURIComponent(params['term']);

      Promise.all([
        this.musicbrainzService.getArtists(this.term).catch(() => []),
        this.trackService.searchTracks(this.term).catch(() => []),
      ]).then(([artists, tracks]) => {
        this.showSpinner = false;
        this.artists = artists;
        this.tracks = tracks;
        if (artists.length === 0 && tracks.length === 0) this.showNoResults = true;
      });
    });
  }

  gotoArtist(artist: Artist): void {
    this.router.navigate(['/artist', artist.id, encodeURIComponent(artist.name)]);
  }

  gotoTrack(track: MbTrack): void {
    this.router.navigate(['/track', track.mbid, encodeURIComponent(track.title)]);
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '';
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }
}
