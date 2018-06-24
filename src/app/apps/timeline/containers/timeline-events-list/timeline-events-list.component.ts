import { Component } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromTimeline from '../../store';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-events-list',
  styleUrls: ['timeline-events-list.component.scss'],
  template: `
    <app-timeline-event *ngFor="let event of (events$ | async)" [event]="event"></app-timeline-event>
    `
})
export class TimelineEventsListComponent {
  events$: Observable<TimelineEventItem[]>;

  constructor(private store_timeline: Store<fromTimeline.TimelineState>) {
    this.events$ = this.store_timeline.pipe(
      select(fromTimeline.selectAllEvents)
    );
  }
}
