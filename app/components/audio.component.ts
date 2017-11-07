import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'player',
  templateUrl: 'audio.component.html',
  styleUrls: ['audio.component.css']
})
export class AudioComponent {
  @Input() playing: boolean;
  @Input() cover: string;
  @Input() title: string;
  @Output() play = new EventEmitter;
  @Output() pause = new EventEmitter;
  @Output() stop = new EventEmitter;
  @Output() previous = new EventEmitter;
  @Output() next = new EventEmitter;

  togglePlay():void {
    if (this.playing) {
      this.pause.emit(null);
    } else {
      this.play.emit(null);
    }
  }
}
