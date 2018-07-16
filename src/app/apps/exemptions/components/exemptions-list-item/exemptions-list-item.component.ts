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
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list-item',
  styleUrls: ['exemptions-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <!-- Block white background that decreases its width when days left decrease --->
      <div class="exemption-days-left" *ngIf="exemption.Status === 'Approved'"
        [ngStyle]="{ 'width': calcWidth() }"
        [ngClass]="{ 'expired': checkIfExpired(), 'soon-expires': (calcDaysLeft() < 15 && !checkIfExpired()) }">
      </div>
      <div class="corner-right" *ngIf="exemption.Status === 'Approved'"
        [ngClass]="{ 'expired': checkIfExpired() }"
        [hidden]="calcWidth() !== '99%'">
      </div>

      <div class="exemption-row-1">
        <div class="title" (click)="openForm.emit(exemption)">{{exemption.Title}}</div>
      </div>
      <div class="exemption-row-2" fxLayout="row nowrap" fxLayoutGap="12px">

        <div class="status" *ngIf="exemption.Status === 'Pending'">
          {{exemption.Status}}
        </div>

        <div class="status" *ngIf="checkIfExpired()">
          Expired
        </div>

        <div class="date" *ngIf="exemption.Status === 'Approved' && !checkIfExpired()"
          matTooltip="Expiry Date">
          {{exemption.ExpiryDate | date: 'mediumDate'}}
        </div>

        <!-- <div>&middot;</div> -->
        <div class="quest"
          [matTooltip]="getQuestTooltip()"
          [ngClass]="{ link: hasQuestQPID() }"
          (click)="openQuest()">
          {{exemption.QuestNumber}}
        </div>

        <!-- <div class="days-left" [hidden]="(daysLeftText ? false : true)">&middot;</div> -->
        <div class="days-left" [hidden]="(daysLeftText ? false : true)">{{ daysLeftText }}</div>

      </div>
    `
})
export class ExemptionsListItemComponent {
  @Input() exemption: ExemptionItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<ExemptionItem>();

  daysLeftText: string;

  constructor() {}

  hasQuestQPID() {
    return this.exemption.QuestQPID ? true : false;
  }

  openQuest() {
    const qpid = this.exemption.QuestQPID;
    if (qpid) {
      window.open(
        `https://quest.slb.com/quest/Exemption/ExemptionVIEW.asp?QID=${qpid}&QPID=${qpid}`,
        '_blank'
      );
    }
  }

  getQuestTooltip() {
    if (this.exemption.QuestQPID) {
      return 'Open QUEST Exemption';
    } else {
      return `QPID is missing, can't build link to QUEST Exemption`;
    }
  }

  calcDaysLeft() {
    return differenceInDays(this.exemption.ExpiryDate, startOfToday());
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
