import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule }           from "@angular/http";

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../services/in-memory-data.service';

import '../rxjs-extensions'
import { AppComponent }         from '../components/app.component';
import { AppRoutingModule, routedComponents }     from './routing.module';
import { ArtistService }        from '../services/artist.service';
import { MusicBrainzService }   from '../services/musicbrainz.service';
import { YouTubeService }       from '../services/youtube.service';
import { ArtistSearchComponent } from '../components/artist-search.component';
import { CategoryComponent }    from  '../components/category.component';
import { YouTubeComponent }     from '../components/youtube.component';
import { DeezerComponent }      from '../components/deezer.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, AppRoutingModule, HttpModule, InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }) ],
  declarations: [ AppComponent, ArtistSearchComponent, CategoryComponent, YouTubeComponent, DeezerComponent, routedComponents ],
  providers:    [ ArtistService, MusicBrainzService, YouTubeService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
