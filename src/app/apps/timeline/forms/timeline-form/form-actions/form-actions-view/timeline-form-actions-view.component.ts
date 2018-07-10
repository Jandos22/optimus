import { Component, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-timeline-form-actions-view',
  styleUrls: ['timeline-form-actions-view.component.scss'],
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
export class TimelineFormActionsViewComponent {
  @Output() switchFormMode = new EventEmitter<FormMode>();
  @Output() closeForm = new EventEmitter<any>();

  constructor() {}
}
