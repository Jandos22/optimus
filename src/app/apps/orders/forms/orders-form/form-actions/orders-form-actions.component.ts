import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromOrders from '../../../store';

// rxjs
import { take } from 'rxjs/operators';

// material
import { MatDialog } from '@angular/material';

// services
import { OrdersService } from '../../../services';

// types
import { FormMode } from '../../../../../shared/interface/form.model';

// interfaces
import { SpListItemAttachmentFiles } from '../../../../../shared/interface/sp-list-item.model';
import { OrderItem } from '../../../../../shared/interface/orders.model';
import { PeopleItem } from './../../../../../shared/interface/people.model';

// entry components
import {
  DeleteListItemComponent,
  DeleteListItemRetryComponent
} from '../../../../../shared/components';

@Component({
  selector: 'app-orders-form-actions',
  styleUrls: ['orders-form-actions.component.scss'],
  template: `
    <app-orders-form-actions-view
      *ngIf="mode === 'view'"
      class="form-actions-view"
      fxLayout="row nowrap"
      fxLayoutAlign="end center"
      (closeForm)="closeForm.emit()"
      (deleteItem)="onDelete()"
      (switchFormMode)="switchFormMode.emit($event)">
    </app-orders-form-actions-view>

    <app-orders-form-actions-new
        *ngIf="mode === 'new'"
        fxLayout="row nowrap"
        fxLayoutAlign="end center"
        (closeForm)="closeForm.emit($event)"
        [fg_fields]="fg_fields" [selfUser]="selfUser">
    </app-orders-form-actions-new>

    <app-orders-form-actions-edit
        *ngIf="mode === 'edit'"
        fxLayout="row nowrap"
        fxLayoutAlign="end center"
        [fg_fields]="fg_fields"
        [initialFields]="initialFields"
        [selfUser]="selfUser"
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

  constructor(
    private store_harcs: Store<fromOrders.OrdersState>,
    private srv: OrdersService,
    public deleteDialog: MatDialog,
    public retryDeleteDialog: MatDialog
  ) {}

  onDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log('deleted');
            console.log(deleted);
            this.store_harcs.dispatch(
              new fromOrders.DeleteOne(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log('could not delete');
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log('do nothing');
      }
    });
  }

  onRetryDelete(): void {
    const dialogRef = this.deleteDialog.open(DeleteListItemRetryComponent);

    dialogRef.afterClosed().subscribe(result => {
      // if true, then delete list item
      if (result) {
        const delete$ = this.srv.deleteItemById(this.initialFields.Id);
        delete$.pipe(take(1)).subscribe(
          deleted => {
            console.log('deleted');
            console.log(deleted);
            this.store_harcs.dispatch(
              new fromOrders.DeleteOne(this.initialFields.Id)
            );
            this.closeForm.emit();
          },
          error => {
            console.log('could not delete');
            console.log(error);
            this.onRetryDelete();
          }
        );
      } else {
        console.log('do nothing');
      }
    });
  }
}
