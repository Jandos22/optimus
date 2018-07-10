import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// constants
import { ApiPath, PathSlbSp } from '../../../../shared/constants';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-event',
  styleUrls: ['timeline-event.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <mdc-card class="event-card__container">
        <div fxLayout="column" fxLayout.gt-xs="row">
            <mdc-card-media fxFlex="125px" fxFlex.gt-xs="200px"
              [square]="true" *ngIf="event.Attachments"
              [ngStyle]="{ 'background-image': 'url(' + imageUrl + ')'}">

              <mdc-card-media-content fxLayout="column" fxLayoutAlign="start start"
                class="event-card__media-content">
                <div class="event__type" fxLayout="row" fxLayoutGap="8px">
                  <fa-icon [icon]="['fas', getFaIconName(event.EventType.Title)]"></fa-icon>
                  <span>{{ event.EventType.Title }}</span>
                </div>
              </mdc-card-media-content>

            </mdc-card-media>
            <div fxLayout="column" fxLayoutAlign="start"
              [ngClass]="(event.Attachments ? 'event-card__hasimage' : 'event-card__noimage')">

                <div *ngIf="!event.Attachments"
                  class="event__type noimage" fxLayout="row" fxLayoutGap="8px">
                  <fa-icon [icon]="['fas', getFaIconName(event.EventType.Title)]"></fa-icon>
                  <span>{{ event.EventType.Title }}</span>
                </div>

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
        </div>
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
    }
    return ApiPath.startsWith('_') ? `${PathSlbSp}`.concat(path) : path;
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

  withOrwithoutPhoto() {
    return this.event.Attachments
      ? 'event-card__withphoto'
      : 'event-card__nophoto';
  }
}
