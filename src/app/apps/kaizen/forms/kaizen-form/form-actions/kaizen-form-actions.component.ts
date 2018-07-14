import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { KaizenProjectItem } from '../../../../../shared/interface/kaizen.model';

@Component({
  selector: 'app-kaizen-form-actions',
  styleUrls: ['kaizen-form-actions.component.scss'],
  template: `
    <app-kaizen-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-kaizen-form-actions-view>

    <app-kaizen-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image">
    </app-kaizen-form-actions-new>

    <app-kaizen-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [fg_image]="fg_image"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)"
        (updateDataItemImage)="updateDataItemImage.emit($event)">
    </app-kaizen-form-actions-edit>
    `
})
export class KaizenFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() fg_image: FormGroup;
  @Input() initialFields: KaizenProjectItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output() updateDataItem = new EventEmitter<KaizenProjectItem>();
  @Output()
  updateDataItemImage = new EventEmitter<SpListItemAttachmentFiles[]>();

  constructor() {}
}
