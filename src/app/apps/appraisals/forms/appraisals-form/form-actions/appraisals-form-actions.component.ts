import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { AppraisalItem } from '../../../../../shared/interface/appraisals.model';

@Component({
  selector: 'app-appraisals-form-actions',
  styleUrls: ['appraisals-form-actions.component.scss'],
  template: `
    <app-appraisals-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-appraisals-form-actions-view>

    <app-appraisals-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields">
    </app-appraisals-form-actions-new>

    <app-appraisals-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)">
    </app-appraisals-form-actions-edit>
    `
})
export class AppraisalsFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() initialFields: AppraisalItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output() updateDataItem = new EventEmitter<AppraisalItem>();

  constructor() {}
}
