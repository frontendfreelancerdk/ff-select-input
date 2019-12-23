import {Component} from '@angular/core';

@Component({
  selector: 'ff-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ff-select-input-app';
  disabled: boolean = false;

  log(e) {
    console.log(e);
  }
}
