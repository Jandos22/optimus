import { Component, Output, EventEmitter } from '@angular/core';

import { FormMode } from './../../../../../../shared/interface/form.model';

@Component({
  selector: 'app-orders-form-actions-view',
  styleUrls: ['orders-form-actions-view.component.scss'],
  template: `
    <!-- DELETE -->
    <button mat-icon-button tabindex="-1" matTooltip="delete order"
      (click)="deleteItem.emit()" class="delete-button">
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
export class OrdersFormActionsViewComponent {
  @Output()
  switchFormMode = new EventEmitter<FormMode>();

  @Output()
  closeForm = new EventEmitter<any>();

  @Output()
  deleteItem = new EventEmitter<any>();

  constructor() {}
}
