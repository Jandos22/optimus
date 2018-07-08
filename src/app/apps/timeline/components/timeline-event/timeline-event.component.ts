import { Component, Input, ViewEncapsulation } from '@angular/core';

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
        <mdc-card-primary-action fxLayout="column" fxLayout.gt-xs="row">
            <mdc-card-media fxFlex="125px" fxFlex.gt-xs="200px"
              [square]="true" *ngIf="event.Attachments"
              [ngStyle]="{ 'background-image': 'url(' + imageUrl + ')'}">
            </mdc-card-media>
            <div fxLayout="column" fxLayoutGap="8px"
              [className]="withOrwithoutPhoto()">
                <div class="event__type" fxLayoutGap="8px">
                  <fa-icon [icon]="['fas', getFaIconName(event.EventType.Title)]"></fa-icon>
                  <span>{{ event.EventType.Title }}</span>
                </div>
                <div class="event__title">{{ event.Title }}</div>
                <span class="event__summary">{{ event.Summary }}</span>
                <span fxFlex></span>
                <app-timeline-event-reporters class="event-card__reporters--container"
                    [reporters]="event.EventReporters.results" [eventDate]="event.EventDate">
                </app-timeline-event-reporters>
            </div>
        </mdc-card-primary-action>
    </mdc-card>
    `
})
export class TimelineEventComponent {
  @Input() event: TimelineEventItem;
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
