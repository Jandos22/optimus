import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-events-list',
  styleUrls: ['timeline-events-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="timeline__events__list--container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start">

      <app-timeline-event fx *ngFor="let event of events; last as last" [event]="event"
        class="timeline-event-container"
        (openForm)="openForm.emit($event)">
      </app-timeline-event>

    </div>
    `
})
export class TimelineEventsListComponent {
  @Input() events: TimelineEventItem[];

  @Output() openForm = new EventEmitter<TimelineEventItem>();

  constructor() {}
}
