import { Component, OnInit } from '@angular/core';
import { Config } from '../objects/config';

@Component({
  selector: 'history',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.scss']
})
export class HistoryComponent implements OnInit {

  history_string: string;
  history_list: string[];

  ngOnInit() {
    this.history_string = localStorage.getItem('musiclynx-history');
    if (this.history_string)
      this.history_list = this.history_string.split(Config.history_separator).map(item => {
        var obj = JSON.parse(item);
        if (typeof obj === 'string')
          return { label: obj, type: "category" };
        else
          return obj;
      });
  }

  makeURI(artist) {
    return Config.base_uri + "/artist/" + artist.id + "/" + encodeURIComponent(artist.name);
  }

  clear() {
    localStorage.clear();
    window.location.reload();
  }

  create() {

  }

}
