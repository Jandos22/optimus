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
  selector: 'app-timeline-event-has-image',
  styleUrls: ['timeline-event-has-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mdc-card-media *ngIf="hasImage"
      fxFlex="125px" fxFlex.gt-xs="200px"
      [square]="true"
      [ngStyle]="{ 'background-image': 'url(' + imageUrl + ')'}">

      <mdc-card-media-content fxLayout="column" fxLayoutAlign="start start"
        class="event-card__media-content">
        <div class="event__type" fxLayout="row" fxLayoutGap="8px">
          <!-- <fa-icon [icon]="['fas', getFaIconName(event.EventType.Title)]"></fa-icon> -->
          <span>{{ event.Locations?.results[0].Title }}</span>
          <span>&middot;</span>
          <span>{{ event.EventType.Title }}</span>
        </div>
      </mdc-card-media-content>

    </mdc-card-media>
    <div fxLayout="column" fxLayoutAlign="start"
      [ngClass]="(event.Attachments ? 'event-card__hasimage' : 'event-card__noimage')">

        <div class="event__title" (click)="openForm.emit(event)">
          {{ event.Title }}
        </div>

        <span class="event__summary" (click)="openForm.emit(event)">
          {{ event.Summary }}
        </span>

        <div class="event__hashtags" *ngIf="event.HashTags">{{ event.HashTags }}</div>

        <div fxFlex></div>

        <app-timeline-event-reporters
          class="event-card__reporters--container"
            [reporters]="event.EventReporters.results" [eventDate]="event.EventDate">
        </app-timeline-event-reporters>
    </div>
    `
})
export class TimelineEventHasImageComponent {
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
