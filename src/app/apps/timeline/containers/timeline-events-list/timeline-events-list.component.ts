import { Component, Input, ViewEncapsulation } from '@angular/core';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-events-list',
  styleUrls: ['timeline-events-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="timeline__events__list--container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-timeline-event *ngFor="let event of events; last as last" [event]="event"
        [className]="last ? 'event-last' : ''">
      </app-timeline-event>

    </div>
    `
})
export class TimelineEventsListComponent {
  @Input() events: TimelineEventItem[];

  constructor() {}
}
