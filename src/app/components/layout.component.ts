import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.scss']
})
export class LayoutComponent {

  currentLayout: string;
  constructor() {
    this.getCurrentLayout();
  }

  getCurrentLayout() {
    this.currentLayout = sessionStorage["musiclynx-layout"];
  }

  chooseLayout(selection) {
    this.currentLayout = selection;
    sessionStorage["musiclynx-layout"] = selection;
  }

  close() {
    window.location.reload();
  }
}
