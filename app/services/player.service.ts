import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Howl } from 'howler';

//import { AppComponent } from './components/app.component';

interface PlayListItem {
  id: number;
  playing: boolean;
  cover: string;
  sound: Howl;
}

interface PlayerEvents {
  onEnd$: EventEmitter<any>;
  onStop$: EventEmitter<any>;
  onPlay$: EventEmitter<any>;
  onPause$: EventEmitter<any>;
  playing$: EventEmitter<any>;
}

var han = new EventEmitter();

@Injectable()
export class PlayerService {
  private playList: PlayListItem[];
  private index: number; // keep track of current playing index
  public playerEvents: PlayerEvents;

  constructor() {
    this.index = 0; // set initial index
    this.playerEvents = {
      onEnd$: new EventEmitter(),
      onStop$: new EventEmitter(),
      onPlay$: new EventEmitter(),
      onPause$: new EventEmitter(),
      playing$: new EventEmitter()
    }
  }

  init(tracks) {
    this.playList = initPlaylist(tracks,this.playerEvents,this.playNext);
  }

  playNew(i) {
    newSong(this.playList,i,this.index);
    this.index = i;
  }

  playNext() {
    let index = this.index + 1;
    if(index < this.playList.length) {
      this.playNew(index);
      this.index = index;
    }
  }

  playPrevious() {
    let index = this.index - 1;
    if(index >= 0) {
      this.playNew(index);
      this.index = index;
    }
  }

  stop() {
    stop(this.playList[this.index]);
  }

  play() {
    play(this.playList[this.index]);
  }

  pause() {
    pause(this.playList[this.index]);
  }

}

var playing = false;

function initPlaylist(tracks, playerEvents, playNext):PlayListItem[] {
  return setEvents(toPlaylist(tracks), playerEvents, playNext);
}

function toPlaylist(tracks):PlayListItem[] {
  return tracks.map(toPlaylistItem);
}

function toPlaylistItem(r:any): PlayListItem {
  let PlayListItem = <PlayListItem>({
    id: r.id,
    playing: false,
    cover: r.cover_medium,
    sound: new Howl({src:[r.preview]})
  })
  // console.log('Parsed PlayListItem', PlayListItem)
  return PlayListItem;
}

function setEvents(playList:PlayListItem[],playerEvents:PlayerEvents, playNext): PlayListItem[] {
  playList.forEach((item) => {
    item.sound.on('end', () => {
      togglePlaying();
      playerEvents.onEnd$.emit(null);
      playerEvents.playing$.emit(playing);
    });
    item.sound.on('stop', () => {
      togglePlaying();
      playerEvents.onStop$.emit(null);
      playerEvents.playing$.emit(playing);
    });
    item.sound.on('play', () => {
      togglePlaying();
      playerEvents.onPlay$.emit(null);
      playerEvents.playing$.emit(playing);
    });
    item.sound.on('pause', () => {
      togglePlaying();
      playerEvents.onPause$.emit(null);
      playerEvents.playing$.emit(playing);
    });
  });
  return playList;
}

function togglePlaying() {
  return playing = !playing;
}

function newSong(playlist:PlayListItem[],i:number,index:number):PlayListItem[] {
  let currentSong = playlist[index];
  let newSong = playlist[i];
  if(playing) {
    stop(currentSong)
  }
  play(newSong);
  return playlist;
}

function stop(song:PlayListItem):PlayListItem {
  song.sound.stop();
  song.playing = false;
  return song;
}

function play(song:PlayListItem):PlayListItem {
  song.sound.play();
  song.playing = true;
  return song;
}

function pause(song:PlayListItem):PlayListItem {
  song.sound.pause();
  song.playing = false;
  return song;
}

function clear(): void {
  let currentSong = playlist[index];
  stop(currentSong);
  
}
