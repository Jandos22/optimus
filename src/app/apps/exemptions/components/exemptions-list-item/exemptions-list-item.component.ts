import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { ExemptionItem } from '../../../../shared/interface/exemptions.model';

@Component({
  selector: 'app-exemptions-list-item',
  styleUrls: ['exemptions-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="exemption-row-1">
        <div class="title" (click)="openForm.emit(exemption)">{{exemption.Title}}</div>
      </div>
      <div class="exemption-row-2" fxLayout="row nowrap" fxLayoutGap="8px">

        <div class="status" *ngIf="exemption.Status === 'Pending'">
          {{exemption.Status}}
        </div>

        <div class="date" *ngIf="exemption.Status === 'Approved'"
          matTooltip="Expiry Date">
          {{exemption.ExpiryDate | date: 'mediumDate'}}
        </div>

        <div>&middot;</div>
        <div class="quest"
          [matTooltip]="getQuestTooltip()"
          [ngClass]="{ link: hasQuestQPID() }"
          (click)="openQuest()">
          {{exemption.QuestNumber}}
        </div>
      </div>
    `
})
export class ExemptionsListItemComponent {
  @Input() exemption: ExemptionItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<ExemptionItem>();

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
}
