import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ScrollEventModule } from 'ngx-scroll-event';
import {Routes, RouterModule} from "@angular/router";
import {Location} from '@angular/common';
import { AppRoutingModule }  from './app.routing.module';
import {DndModule} from 'ng2-dnd';
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
    DndModule.forRoot()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
