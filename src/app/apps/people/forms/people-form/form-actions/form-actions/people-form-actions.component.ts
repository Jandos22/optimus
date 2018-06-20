import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from './../../../../../../shared/interface/form.model';

// interfaces
import { PeopleItem } from './../../../../../../shared/interface/people.model';

@Component({
  selector: 'app-people-form-actions',
  styleUrls: ['people-form-actions.component.scss'],
  template: `

    <app-people-form-when-view-buttons
        *ngIf="mode === 'view'"
        (switchFormMode)="switchFormMode.emit($event)">
    </app-people-form-when-view-buttons>

    <app-people-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (updateFormGroupFields)="updateFormGroupFields.emit($event)"
        (switchFormMode)="switchFormMode.emit($event)">
    </app-people-form-actions-edit>

    <app-people-form-when-new-buttons
        *ngIf="mode === 'new'">
    </app-people-form-when-new-buttons>

    `
})
export class PeopleFormActionsComponent {
  @Input() mode: FormMode;
  @Input() fg_fields: FormGroup;
  @Input() initialFields: PeopleItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() updateFormGroupFields = new EventEmitter<PeopleItem>();

  constructor() {}
}
