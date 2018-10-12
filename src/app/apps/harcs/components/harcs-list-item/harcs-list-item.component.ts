import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

import * as differenceInDays from 'date-fns/difference_in_days';
import * as startOfToday from 'date-fns/start_of_today';

// interfaces
import { HarcItem } from '../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-harcs-list-item',
  styleUrls: ['harcs-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <!-- Block white background that decreases its width when days left decrease --->
      <div class="harc-days-left" *ngIf="harc.Status === 'Approved'"
        [ngStyle]="{ 'width': calcWidth() }"
        [ngClass]="{ 'expired': checkIfExpired(), 'soon-expires': (calcDaysLeft() < 15 && !checkIfExpired()) }">
      </div>
      <div class="corner-right" *ngIf="harc.Status === 'Approved'"
        [ngClass]="{ 'expired': checkIfExpired() }"
        [hidden]="calcWidth() !== '99%'">
      </div>

      <div class="harc-inner-container" fxLayout="row wrap" fxLayoutAlign="start start">

        <app-harcs-pic class="harc-pic" [pic]="harc.PIC"></app-harcs-pic>

        <div class="harc-body">
          <div class="harc-row-1">
            <div class="title" (click)="openForm.emit(harc)">{{harc.Title}}</div>
          </div>
          <div class="harc-row-2" fxLayout="row nowrap" fxLayoutGap="12px">

            <div class="status" *ngIf="harc.Status === 'Pending'">
              {{harc.Status}}
            </div>

            <div class="status" *ngIf="checkIfExpired() && harc.Status !== 'Pending'">
              Expired
            </div>

            <div class="date" *ngIf="harc.Status === 'Approved' && !checkIfExpired()"
              matTooltip="Expiry Date">
              {{harc.ExpiryDate | date: 'mediumDate'}}
            </div>

            <div class="quest"
              [matTooltip]="getQuestTooltip()"
              matTooltipClass="mytooltip large-text"
              [ngClass]="{ link: hasQuestQPID() }"
              (click)="openQuest()">
              {{harc.QuestNumber}}
            </div>

            <!-- <div class="days-left" [hidden]="(daysLeftText ? false : true)">&middot;</div> -->
            <div class="days-left" [hidden]="(daysLeftText ? false : true)">{{ daysLeftText }}</div>

          </div>
        </div>

      </div>
    `
})
export class HarcsListItemComponent {
  @Input()
  harc: HarcItem;
  @Input()
  last: boolean;

  @Output()
  openForm = new EventEmitter<HarcItem>();

  daysLeftText: string;

  constructor() {}

  hasQuestQPID() {
    return this.harc.QuestQPID ? true : false;
  }

  openQuest() {
    const qpid = this.harc.QuestQPID;
    if (qpid) {
      window.open(
        `https://quest.slb.com/quest/Harc/HarcVIEW.asp?QID=${qpid}&QPID=${qpid}`,
        '_blank'
      );
    }
  }

  getQuestTooltip() {
    if (this.harc.QuestQPID) {
      return 'Open QUEST HARC';
    } else {
      return `QPID is missing, can't build link to QUEST HARC`;
    }
  }

  calcDaysLeft() {
    return differenceInDays(this.harc.ExpiryDate, startOfToday());
  }

  calcWidth() {
    const daysLeft = this.calcDaysLeft();

    if (daysLeft < 0) {
      this.daysLeftText = '';
      return '99%';
    } else if (daysLeft < 30) {
      this.daysLeftText = daysLeft + ' day(s) left';
      return (daysLeft / 30) * 100 + '%';
    } else if (daysLeft >= 30) {
      this.daysLeftText = '';
      return '99%';
    }
  }

  checkIfExpired() {
    const daysLeft = this.calcDaysLeft();
    return daysLeft < 0 ? true : false;
  }
}
