import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

// constants
import { ApiPath, PathSlbSp, PathOptimus } from '../../../../shared/constants';

// interfaces
import { TimelineEventItem } from '../../../../shared/interface/timeline.model';

@Component({
  selector: 'app-timeline-event-v2',
  styleUrls: ['timeline-event-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper"
      fxLayout="row nowrap"
      fxLayoutAlign="start start">

      <app-timeline-event-reporters-v3
        class="reporters"
        [reportersId]="event?.EventReportersId?.results">
      </app-timeline-event-reporters-v3>

      <!-- Event -->
      <div class="event"
        fxLayout="row nowrap"
        fxLayoutAlign="start start">

        <div class="details"
          [ngClass]="{ 'has-photo': event.Attachments }"
          [style.zIndex]="zIndexDetails"
          fxLayout="row wrap"
          fxLayoutAlign="start start">

          <div class="date-n-type"
            fxLayout="row nowrap"
            fxLayoutAlign="start start">

            <div class="date">{{ event.EventDate | date: 'mediumDate'}}</div>

            <div class="type"
              *ngIf="event.EventType2"
              fxLayout="row nowrap">
              <div class="middot">&middot;</div>
              <div>{{ event.EventType2 }}</div>
            </div>

          </div>

          <div class="title" (click)="openForm.emit(event)">
            {{ event.Title }}
          </div>

          <div class="summary">
            {{ event.Summary}}
          </div>

        </div>

        <div class="photo-container"
          *ngIf="event.Attachments"
          [style.zIndex]="zIndexPhoto"
          (click)="togglePhoto()">
          <img class="photo"  [src]="imageUrl">
        </div>

      </div>

    </div>
    `
})
export class TimelineEventV2Component {
  @Input()
  event: TimelineEventItem;

  @Output()
  openForm = new EventEmitter<TimelineEventItem>();

  showPhoto: boolean;
  zIndexPhoto = 1;
  zIndexDetails = 2;

  // reportersWidth = '36px'; // default width for 1 reporter

  constructor(private cd: ChangeDetectorRef) {}

  // calcReportersWidth(quantity: number) {
  //   const width = 18 + quantity * 18;
  //   this.reportersWidth = width.toString() + 'px';
  //   this.cd.detectChanges();
  // }

  get imageUrl() {
    let path = '';
    if (this.event.Attachments) {
      path = this.event.AttachmentFiles.results[0].ServerRelativeUrl;
      return ApiPath.startsWith('_') ? `${PathSlbSp}`.concat(path) : path;
    } else {
      return path;
    }
  }

  togglePhoto() {
    if (!this.showPhoto) {
      this.showPhoto = true;
      this.zIndexPhoto = 2;
      this.zIndexDetails = 1;
    } else if (this.showPhoto) {
      this.showPhoto = false;
      this.zIndexPhoto = 1;
      this.zIndexDetails = 2;
    }
  }
}
