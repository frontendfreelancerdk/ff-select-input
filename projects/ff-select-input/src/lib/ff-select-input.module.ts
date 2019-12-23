import {NgModule} from '@angular/core';
import {FFSelectInputComponent} from './ff-select-input.component';
import {FFSelectInputService} from './ff-select-input.service';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [FFSelectInputComponent],
  imports: [CommonModule, FormsModule, BrowserAnimationsModule],
  exports: [FFSelectInputComponent],
  providers: [FFSelectInputService]
})
export class FFSelectInputModule {
}
