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
  selector: 'app-timeline-event',
  styleUrls: ['timeline-event.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mdc-card class="event-card__container" fxLayout="column" fxLayout.gt-xs="row">

      <!-- if event has image -->
      <app-timeline-event-has-image *ngIf="hasImage"
        [event]="event" (openForm)="openForm.emit($event)"
        fxLayout="column" fxLayout.gt-xs="row">
      </app-timeline-event-has-image>

      <!-- if event has no image -->
      <app-timeline-event-no-image *ngIf="!hasImage"
        [event]="event" (openForm)="openForm.emit($event)"
        fxLayout="row wrap" fxLayoutAlign="start start"
        class="timeline-event-no-image">
      </app-timeline-event-no-image>

    </mdc-card>
    `
})
export class TimelineEventComponent {
  @Input() event: TimelineEventItem;

  @Output() openForm = new EventEmitter<TimelineEventItem>();

  constructor() {}

  get imageUrl() {
    let path = '';
    if (this.event.Attachments) {
      path = this.event.AttachmentFiles.results[0].ServerRelativeUrl;
      return ApiPath.startsWith('_') ? `${PathSlbSp}`.concat(path) : path;
    } else {
      const picture = this.getEventBackground(this.event.EventType.Title);
      path = 'assets/timeline' + picture;
      return ApiPath.startsWith('_') ? path : `${PathOptimus}/`.concat(path);
      // return path;
    }
  }

  get hasImage() {
    return this.event.Attachments ? true : false;
  }

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
