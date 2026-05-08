export interface MbTrack {
  mbid: string;
  title: string;
  album_name: string;
  length_seconds: number;
  artist?: string;
  artist_mbid?: string;
  bpm?: number;
  key?: string;
}
