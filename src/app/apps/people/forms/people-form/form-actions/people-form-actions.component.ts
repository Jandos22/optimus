import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from './../../../../../shared/interface/form.model';

// interfaces
import { PeopleItem } from './../../../../../shared/interface/people.model';
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';

@Component({
  selector: 'app-people-form-actions',
  styleUrls: ['people-form-actions.component.scss'],
  template: `

    <app-people-form-actions-view
        *ngIf="mode === 'view'"
        (closeUserForm)="closeUserForm.emit()"
        (switchFormMode)="switchFormMode.emit($event)">
    </app-people-form-actions-view>

    <app-people-form-actions-new
        *ngIf="mode === 'new'"
        (closeUserForm)="closeUserForm.emit($event)"
        [fg_fields]="fg_fields"
        [fg_photo]="fg_photo">
    </app-people-form-actions-new>

    <app-people-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [fg_photo]="fg_photo"
        [initialFields]="initialFields"
        (updateFormGroupFields)="updateFormGroupFields.emit($event)"
        (updateFormGroupPhoto)="updateFormGroupPhoto.emit($event)"
        (switchFormMode)="switchFormMode.emit($event)">
    </app-people-form-actions-edit>
    `
})
export class PeopleFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() fg_photo: FormGroup;
  @Input() initialFields: PeopleItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() updateFormGroupFields = new EventEmitter<PeopleItem>();
  @Output()
  updateFormGroupPhoto = new EventEmitter<SpListItemAttachmentFiles[]>();
  @Output() closeUserForm = new EventEmitter();

  constructor() {}
}
