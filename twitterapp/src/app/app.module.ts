import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import {Routes, RouterModule} from "@angular/router";
import {Location} from '@angular/common';
import { AppRoutingModule }  from './app.routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ScrollEventModule,
    AppRoutingModule,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
