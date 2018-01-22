import { Component } from '@angular/core';

@Component({
  selector: 'layout',
  templateUrl: 'layout.component.html',
  styleUrls: ['layout.component.css']
})
export class LayoutComponent {

  chooseLayout(selection) {
    if (selection == 0)
      console.log("graph");
    else
      console.log("grid");
  }

}
