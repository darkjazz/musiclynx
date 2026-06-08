import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from '../components/dashboard.component';
import { ArtistComponent }      from '../components/artist.component';
import { SearchResultsComponent } from '../components/search-results.component';
import { TrackComponent }       from '../components/track.component';
import { CommunityComponent }   from '../components/community.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'artist/:id/:name', component: ArtistComponent },
  { path: 'search/:term', component: SearchResultsComponent },
  { path: 'track/:id/:title', component: TrackComponent },
  { path: 'communities', component: CommunityComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

export const routedComponents = [DashboardComponent, ArtistComponent, SearchResultsComponent, TrackComponent, CommunityComponent];
