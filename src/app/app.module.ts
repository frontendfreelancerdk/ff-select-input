import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FFSelectInputModule} from 'ff-select-input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FFSelectInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
