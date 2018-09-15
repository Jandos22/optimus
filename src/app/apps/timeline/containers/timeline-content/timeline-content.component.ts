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
  selector: 'app-timeline-content',
  styleUrls: ['timeline-content.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <!--
    <div class="timeline__events__list--container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start">
      <app-timeline-event *ngFor="let event of events; last as last" [event]="event"
        class="timeline-event-container"
        (openForm)="openForm.emit($event)">
      </app-timeline-event>
    </div>
    -->
    <div class="timeline-list-container"
      fxFlex
      fxLayout="row wrap"
      fxLayoutAlign="start start"
      fxLayoutGap="16px">

      <app-timeline-event-v2
        class="item"
        *ngFor="let event of events; last as last"
        [ngClass]="{'last-item': last}"
        [event]="event"
        (openForm)="openForm.emit($event)">
      </app-timeline-event-v2>

    </div>
    `
})
export class TimelineContentComponent {
  @Input() events: TimelineEventItem[];

  @Output() openForm = new EventEmitter<TimelineEventItem>();

  constructor() {}
}
