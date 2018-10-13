import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';
import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';
import { AppraisalRights } from '../../store';

@Component({
  selector: 'app-appraisals-list',
  styleUrls: ['appraisals-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <div class="appraisals-list-container" fxFlex id="PrintAppraisals"
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <div class="is-private">Appraisals are CONFIDENTIAL</div>

      <div *ngIf="position.isOther" class="is-other">
        <p>Only PSDM, FEFS, OP, FDE and WFC have access to appraisals.</p>
        <p>But, you will see appraisals that were submitted by you in the past.</p>
      </div>

      <app-appraisal-group
        *ngFor="let job of appraisalGroups; last as last"
        [job]="job"
        [ngClass]="{'last-item': last}"
        (openForm)="openForm.emit($event)"
        fxLayout="row nowrap">
      </app-appraisal-group>

    </div>
    `
})
export class AppraisalsListComponent {
  @Input()
  appraisalGroups: AppraisalGroupItem[];

  @Input()
  position: AppraisalRights;

  @Output()
  openForm = new EventEmitter<AppraisalItem>();

  constructor() {}
}
