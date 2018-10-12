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
        fxLayoutAlign="start start"
        [ngClass]="{
          'issue-open': (issue || failure) && (event.IssueState === 'Open'),
          'issue-closed': (issue || failure) && (event.IssueState === 'Closed')
        }">

        <div class="details"
          [style.zIndex]="zIndexDetails"
          fxLayout="row wrap"
          fxLayoutAlign="start start"
          [ngClass]="{
            'has-photo': event.Attachments,
            'issue-open': (issue || failure) && (event.IssueState === 'Open'),
            'issue-closed': (issue || failure) && (event.IssueState === 'Closed')
            }">

          <div class="date-n-type"
            fxLayout="row nowrap"
            fxLayoutAlign="start start">

            <div class="date">{{ event.EventDate | date: 'mediumDate'}}</div>

            <div class="type"
              *ngIf="event.EventType2"
              [ngClass]="{
                'issue-open': (issue || failure) && (event.IssueState === 'Open'),
                'issue-closed': (issue || failure) && (event.IssueState === 'Closed')
              }"
              fxLayout="row nowrap">
              <div class="middot">&middot;</div>
              <div>{{ event.EventType2 }}</div>
              <div *ngIf="(issue || failure)">/{{ event.IssueState }}</div>
            </div>

          </div>

          <div class="title" (click)="openForm.emit(event)">
            {{ event.Title }}
          </div>

          <div class="summary" (click)="openForm.emit(event)">
            {{ event.Summary}}
          </div>

          <div class="quest" *ngIf="event.QuestRIR">
            <span>Quest: </span>
            <span
              [matTooltip]="getQuestTooltip()"
              matTooltipClass="mytooltip large-text"
              (click)="openQuestReport()"
              [ngClass]="{ hasQPID: checkQPID() }">
              {{ event.QuestRIR }}
            </span>
          </div>

          <div class="intouch" *ngIf="event.InTouch">
            <span>InTouch: </span>
            <span
              [matTooltip]="'Open InTouch page'"
              matTooltipClass="mytooltip large-text"
              (click)="openInTouch()"
              class="link">
              {{ event.InTouch }}
            </span>
          </div>

          <div class="followup"
            *ngIf="(issue || failure)"
            [ngClass]="{
              'issue-open': (issue || failure) && (event.IssueState === 'Open'),
              'issue-closed': (issue || failure) && (event.IssueState === 'Closed')
              }">

            <div class="followupby">{{ event.LastFollowUp | date: 'shortDate' }} &middot; {{event.FollowUpBy.Fullname}}</div>
            {{ event.FollowUp }}

          </div>

        </div>

        <div class="photo-container"
          *ngIf="event.Attachments"
          [style.zIndex]="zIndexPhoto"
          (click)="togglePhoto()"
          [ngClass]="{
            'issue-open': (event.EventType2 === 'Issue') && (event.IssueState === 'Open'),
            'issue-closed': (event.EventType2 === 'Issue') && (event.IssueState === 'Closed')
            }">
          <img class="photo" [src]="imageUrl">
        </div>

        <app-timeline-event-locations
          class="event-locations"
          [locations]="event?.Locations?.results">
        </app-timeline-event-locations>

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

  get issue() {
    return this.event.EventType2 === 'Issue' ? true : false;
  }

  get failure() {
    return this.event.EventType2 === 'Failure' ? true : false;
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

  checkQPID() {
    return this.event.QuestQPID ? true : false;
  }

  openQuestReport() {
    const qpid = this.event.QuestQPID;

    const meeting =
      this.event.EventType2 === 'SQ Meeting' ||
      this.event.EventType2 === 'SET Meeting'
        ? true
        : false;

    if (qpid && meeting) {
      window.open(
        `https://quest.slb.com/quest/Meeting/Meetingview.asp?QPID=${qpid}`,
        '_blank'
      );
    }

    if (qpid && !meeting) {
      window.open(
        `https://quest.slb.com/quest/RIR/RIRview.asp?QPID=${qpid}`,
        '_blank'
      );
    }
  }

  getQuestTooltip() {
    if (this.event.QuestQPID) {
      return 'Open QUEST Report';
    } else {
      return `QPID is missing, can't open QUEST Report`;
    }
  }

  openInTouch() {
    const number = this.event.InTouch;

    if (number) {
      window.open(
        `https://intouchsupport.com/index.cfm?event=content.preview&contentid=${number}`,
        '_blank'
      );
    }
  }
}
