import { Component, OnInit } from '@angular/core';
import { Config } from '../objects/config';
import { Router } from '@angular/router';
import { ArtistService } from '../services/artist.service';

@Component({
  selector: 'history',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.scss']
})
export class HistoryComponent implements OnInit {

  history_string: string;
  history_list: string[];

  constructor(private router: Router, private artistService: ArtistService) { }

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

  navigate(artist) {
    window.location.reload();
    let link = ['/artist', artist.id, artist.name];
    this.router.navigate(link);
  }

  clear() {
    localStorage.clear();
    window.location.reload();
  }

  showArtistArrow(artist): boolean {
    var categoryClicked = true;
    var index = this.history_list.indexOf(artist);
    if (index == this.history_list.length - 1 || this.history_list[index].hasOwnProperty('id') ||
      this.isSpecialCategory(this.history_list[this.history_list.indexOf(artist) + 1])
    )
    {
      categoryClicked = false;
    }
    return
  }

  isSpecialCategory(category): boolean {
    return (
      category.label == "Featured Artists" ||
      category.label == "History" ||
      category.label.indexOf("Search for") > -1
    );
  }

}
