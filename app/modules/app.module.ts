import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { HttpModule, JsonpModule }           from "@angular/http";

// import '../rxjs-extensions'
import { AppComponent }           from '../components/app.component';
import { AppRoutingModule, routedComponents }     from './routing.module';
import { ArtistService }          from '../services/artist.service';
import { MusicBrainzService }     from '../services/musicbrainz.service';
import { YouTubeService }         from '../services/youtube.service';
import { DeezerService }          from '../services/deezer.service';
import { PlayerService }          from '../services/player.service';
import { ArtistSearchComponent }  from '../components/artist-search.component';
import { CategoryComponent }      from  '../components/category.component';
import { YouTubeComponent }       from '../components/youtube.component';
import { AudioComponent }         from '../components/audio.component';
import { SearchResultsComponent } from '../components/search-results.component';
import { Spinner }                from '../components/spinner.component';
import { GraphComponent }         from '../components/graph.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, AppRoutingModule, HttpModule, JsonpModule ],
  declarations: [ AppComponent, ArtistSearchComponent, CategoryComponent, YouTubeComponent, AudioComponent, SearchResultsComponent, Spinner, GraphComponent, routedComponents ],
  providers:    [ ArtistService, MusicBrainzService, YouTubeService, DeezerService, PlayerService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
