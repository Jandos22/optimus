import { Component, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-appraisals-form-actions-view',
  styleUrls: ['appraisals-form-actions-view.component.scss'],
  template: `
    <button mat-button tabindex="-1" color='primary'
        (click)="switchFormMode.emit('edit')">
        EDIT
    </button>

    <button mat-button tabindex="-1"
        (click)="closeForm.emit()">
        CLOSE
    </button>
  `
})
export class AppraisalsFormActionsViewComponent {
  @Output() switchFormMode = new EventEmitter<FormMode>();
  @Output() closeForm = new EventEmitter<any>();

  constructor() {}
}
