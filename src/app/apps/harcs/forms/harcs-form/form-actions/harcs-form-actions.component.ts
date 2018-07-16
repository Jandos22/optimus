import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { HarcItem } from '../../../../../shared/interface/harcs.model';

@Component({
  selector: 'app-harcs-form-actions',
  styleUrls: ['harcs-form-actions.component.scss'],
  template: `
    <app-harcs-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-harcs-form-actions-view>

    <app-harcs-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields">
    </app-harcs-form-actions-new>

    <app-harcs-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)">
    </app-harcs-form-actions-edit>
    `
})
export class HarcsFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() initialFields: HarcItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output() updateDataItem = new EventEmitter<HarcItem>();

  constructor() {}
}
