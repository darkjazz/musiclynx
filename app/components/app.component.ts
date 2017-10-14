import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template: `
  <nav>
    <a routerLink="/dashboard" routerLinkActive="active">{{title}}</a>
  </nav>
  <router-outlet></router-outlet>
  `,
  styleUrls: ['app.component.css']
})
export class AppComponent {
  title = 'MusicLynx';
}
