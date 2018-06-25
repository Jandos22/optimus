import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';
import * as application from '../../../../store/actions/app.actions';

@Component({
  selector: 'app-timeline.timeline-flex-container',
  encapsulation: ViewEncapsulation.None,
  template: `
    <app-timeline-toolbar fxFlex="56px"></app-timeline-toolbar>
    <app-timeline-events-list fxFlex class="flexContent"></app-timeline-events-list>
    <app-timeline-footer fxFlex="56px"></app-timeline-footer>
  `,
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  appName = 'Timeline';

  constructor(private store: Store<fromRoot.RootState>) {}

  ngOnInit() {
    this.store.dispatch(new application.ChangeAppName(this.appName));
  }
}
