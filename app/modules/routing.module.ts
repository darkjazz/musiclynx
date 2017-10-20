import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent }   from '../components/dashboard.component';
import { ArtistComponent }      from '../components/artist.component';
import { SearchResultsComponent } from '../components/search-results.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'artist/:id/:name', component: ArtistComponent },
  { path: 'search/:term', component: SearchResultsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}

export const routedComponents = [DashboardComponent, ArtistComponent, SearchResultsComponent];
