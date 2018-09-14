import { Component, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-harcs-form-actions-view',
  styleUrls: ['harcs-form-actions-view.component.scss'],
  template: `
    <button mat-icon-button tabindex="-1" matTooltip="delete HARC"
      (click)="deleteItem.emit()" class="harcs-delete-button">
      <span class='fa_regular'><fa-icon [icon]="['far', 'trash-alt']"></fa-icon></span>
    </button>

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
export class HarcsFormActionsViewComponent {
  @Output()
  switchFormMode = new EventEmitter<FormMode>();

  @Output()
  closeForm = new EventEmitter<any>();

  @Output()
  deleteItem = new EventEmitter<any>();

  constructor() {}
}
