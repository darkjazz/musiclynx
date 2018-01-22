import { NgModule }                 from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { FormsModule }              from '@angular/forms';
import { HttpModule, JsonpModule }  from "@angular/http";
import { MatSidenavModule, MatIconModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { OverlayModule }            from '@angular/cdk/overlay';
import { PortalModule }             from '@angular/cdk/portal';

// import '../rxjs-extensions'
import { AppComponent }             from '../components/app.component';
import { AppRoutingModule, routedComponents } from './routing.module';
import { ArtistService }            from '../services/artist.service';
import { MusicBrainzService }       from '../services/musicbrainz.service';
import { YouTubeService }           from '../services/youtube.service';
import { DeezerService }            from '../services/deezer.service';
import { PlayerService }            from '../services/player.service';
import { ArtistSearchComponent }    from '../components/artist-search.component';
import { CategoryComponent }        from '../components/category.component';
import { YouTubeComponent }         from '../components/youtube.component';
import { AudioComponent }           from '../components/audio.component';
import { SearchResultsComponent }   from '../components/search-results.component';
import { Spinner }                  from '../components/spinner.component';
import { GraphComponent }           from '../components/graph.component';
import { Menu }                     from '../components/menu.component';
import { InfoComponent }            from '../components/info.component';
import { DemoComponent }            from '../components/demo.component';
import { LayoutComponent }          from '../components/layout.component';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    OverlayModule,
    PortalModule
  ],
  declarations: [
    AppComponent,
    ArtistSearchComponent,
    CategoryComponent,
    YouTubeComponent,
    AudioComponent,
    SearchResultsComponent,
    Spinner,
    GraphComponent,
    Menu,
    InfoComponent,
    DemoComponent,
    LayoutComponent,
    routedComponents
  ],
  providers:    [ ArtistService, MusicBrainzService, YouTubeService, DeezerService, PlayerService ],
  bootstrap:    [ AppComponent ],
  entryComponents: [ InfoComponent, DemoComponent, LayoutComponent ]
})
export class AppModule { }
