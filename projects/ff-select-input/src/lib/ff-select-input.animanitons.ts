import {animate, state, style, transition, trigger} from '@angular/animations';

export const slideInOut = trigger('slideInOut', [
  state('void, initial, hidden', style({height: 0})),
  state('visible', style({height: '*'})),
  transition('* => visible', [
    style({height: 0}),
    animate('150ms linear')
  ]),
  transition('* => hidden', animate('200ms linear', style({height: 0})))
]);
