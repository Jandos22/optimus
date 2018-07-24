import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { JobItem } from '../../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-form-actions',
  styleUrls: ['jobs-form-actions.component.scss'],
  template: `
    <app-jobs-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-jobs-form-actions-view>

    <app-jobs-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields">
    </app-jobs-form-actions-new>

    <app-jobs-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)">
    </app-jobs-form-actions-edit>
    `
})
export class JobsFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() initialFields: JobItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output() updateDataItem = new EventEmitter<JobItem>();

  constructor() {}
}
