import { Component, OnInit } from '@angular/core';

// this fix is only required in iOS Safari
import * as viewportUnitsBuggyfill from 'viewport-units-buggyfill';
viewportUnitsBuggyfill.init({
  refreshDebounceWait: 50,
  hacks: viewportUnitsBuggyfill.hacks
});

@Component({
  selector: 'app-root',
  template: `<app-layout></app-layout>`,
  styles: []
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
