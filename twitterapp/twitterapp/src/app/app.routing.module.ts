import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', component: AppComponent,pathMatch: 'full' },
  { path: 'search', component: AppComponent,pathMatch: 'full'},
  { path: '', component: AppComponent,pathMatch: 'full'},
  //{ path: 'tweet/:id', component: TimelineComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}