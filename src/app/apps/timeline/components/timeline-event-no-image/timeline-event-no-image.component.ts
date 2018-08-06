import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// constants
import { ApiPath, PathSlbSp, PathOptimus } from '../../../../shared/constants';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-event-no-image',
  styleUrls: ['timeline-event-no-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="timeline-event-no-image-container"
      fxLayout="row wrap" fxLayoutAlign="start stretch">

      <div class="event-location-and-type"
        fxLayout="row wrap" fxLayoutAlign="start center"
        fxLayout.gt-xs="row wrap" fxLayoutAlign="space-between start">

        <div class="date" fxFlex="82px" fxFlex.gt-xs="167px">{{ event.EventDate | date: 'mediumDate' }}</div>

        <div fxFlex fxFlex.gt-xs="1px"></div>

        <div class="location-and-type" fxLayout="row nowrap">

          <div class="location" *ngFor="let location of event.Locations?.results; last as last">
            {{ location.Title }}<span> &middot;</span>
          </div>

          <div class="type">
            {{ event.EventType.Title }}
          </div>

        </div>

      </div>

      <div class="event-no-photo-body"
        fxLayout="row wrap" fxLayoutAlign="start start">

        <div class="title" (click)="openForm.emit(event)">
          {{ event.Title }}
        </div>

        <div class="summary" (click)="openForm.emit(event)">
          {{ event.Summary }}
        </div>
      </div>

      <app-timeline-event-reporters-2 class="timeline-event-reporters-2"
        [reporters]="event.EventReporters.results">
      </app-timeline-event-reporters-2>

    </div>
    `
})
export class TimelineEventNoImageComponent {
  @Input() event: TimelineEventItem;

  @Output() openForm = new EventEmitter<TimelineEventItem>();

  constructor() {}

  getFaIconName(eventType: string) {
    switch (eventType) {
      case 'General':
        return 'bullhorn';

      case 'Equipment IN':
        return 'plane-arrival';

      default:
        return 'bullhorn';
    }
  }

  getEventBackground(eventType: string) {
    switch (eventType) {
      case 'General':
        return '/general.png';

      case 'Equipment IN':
        return '/equipment_in_v3.png';

      default:
        return '/general.png';
    }
  }

  withOrwithoutPhoto() {
    return this.event.Attachments
      ? 'event-card__withphoto'
      : 'event-card__nophoto';
  }
}
