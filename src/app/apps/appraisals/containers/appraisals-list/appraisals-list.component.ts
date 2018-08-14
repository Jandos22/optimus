import { AppraisalGroupItem } from './../../../../shared/interface/appraisals.model';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { AppraisalItem } from '../../../../shared/interface/appraisals.model';

@Component({
  selector: 'app-appraisals-list',
  styleUrls: ['appraisals-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="appraisals-list-container" fxFlex id="PrintAppraisals"
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

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

  @Output()
  openForm = new EventEmitter<AppraisalItem>();

  constructor() {}
}
