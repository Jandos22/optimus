import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { OrderItem } from '../../../../../shared/interface/orders.model';
import { PeopleItem } from './../../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-form-actions',
  styleUrls: ['orders-form-actions.component.scss'],
  template: `
    <app-orders-form-actions-view
      *ngIf="mode === 'view'"
      (closeForm)="closeForm.emit()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-orders-form-actions-view>

    <app-orders-form-actions-new
        *ngIf="mode === 'new'"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields" [selfUser]="selfUser">
    </app-orders-form-actions-new>

    <app-orders-form-actions-edit
        *ngIf="mode === 'edit'"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        (switchFormMode)="switchFormMode.emit($event)"
        (updateDataItem)="updateDataItem.emit($event)">
    </app-orders-form-actions-edit>
    `
})
export class OrdersFormActionsComponent {
  @Input()
  mode: FormMode;
  @Input()
  fg_fields: FormGroup;
  @Input()
  initialFields: OrderItem;
  @Input()
  selfUser?: PeopleItem;

  @Output()
  switchFormMode = new EventEmitter<any>();
  @Output()
  closeForm = new EventEmitter<any>();

  // triggered after saving fields and/or image
  @Output()
  updateDataItem = new EventEmitter<OrderItem>();

  constructor() {}
}
