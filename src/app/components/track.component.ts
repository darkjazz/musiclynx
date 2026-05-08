import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Howl } from 'howler';
import { MbTrack } from '../objects/mb-track';
import { TrackService } from '../services/track.service';

@Component({
  moduleId: module.id,
  selector: 'track-detail',
  templateUrl: 'track.component.html',
  styleUrls: ['track.component.css']
})
export class TrackComponent implements OnInit, OnDestroy {
  track: MbTrack;
  showSpinner: boolean;
  previewCover: string;
  isPlaying = false;
  private howl: Howl;

  constructor(
    private trackService: TrackService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const mbid = params['id'];
      if (!mbid) { window.history.back(); return; }
      this.stopPreview();
      this.showSpinner = true;
      this.previewCover = null;
      this.trackService.getTrack(mbid).then(track => {
        this.showSpinner = false;
        this.track = track;
        if (track) this.loadPreview(track);
      }).catch(() => { this.showSpinner = false; });
    });
  }

  ngOnDestroy() {
    this.stopPreview();
  }

  private loadPreview(track: MbTrack) {
    this.trackService.getTrackPreview(track.title, track.artist).then(result => {
      if (!result) return;
      this.previewCover = result.cover;
      this.howl = new Howl({
        src: [result.preview],
        html5: true,
        loop: true,
        onstop: () => { this.isPlaying = false; },
      });
    });
  }

  togglePlay() {
    if (!this.howl) return;
    if (this.isPlaying) {
      this.howl.pause();
      this.isPlaying = false;
    } else {
      this.howl.play();
      this.isPlaying = true;
    }
  }

  private stopPreview() {
    if (this.howl) { this.howl.stop(); this.howl.unload(); this.howl = null; }
    this.isPlaying = false;
  }

  formatDuration(seconds: number): string {
    if (!seconds) return '';
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  goToArtist() {
    if (this.track && this.track.artist_mbid && this.track.artist) {
      this.router.navigate(['/artist', this.track.artist_mbid, this.track.artist]);
    }
  }
}
