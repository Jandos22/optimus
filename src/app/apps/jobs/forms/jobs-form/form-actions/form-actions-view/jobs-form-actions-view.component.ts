import { Component, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-jobs-form-actions-view',
  styleUrls: ['jobs-form-actions-view.component.scss'],
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
export class JobsFormActionsViewComponent {
  @Output() switchFormMode = new EventEmitter<FormMode>();
  @Output() closeForm = new EventEmitter<any>();

  constructor() {}
}
