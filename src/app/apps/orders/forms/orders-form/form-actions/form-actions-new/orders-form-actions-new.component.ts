import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as _ from 'lodash';

// rxjs
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromOrders from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromOrdersActions from '../../../../store/actions/orders.actions';

// services
import { OrdersFormHttpService } from '../../form-services/orders-form-http.service';

// interfaces
import { OrderItem } from '../../../../../../shared/interface/orders.model';
import { PeopleItem } from '../../../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-form-actions-new',
  styleUrls: ['orders-form-actions-new.component.scss'],
  template: `
    <button mat-button color="primary" (click)="log()">LOG</button>

    <button mat-button color="primary"
      [disabled]="!fg_fields.valid || savingChanges"
      (click)="onSave()">
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="closeForm.emit()">
      CANCEL
    </button>
    `
})
export class OrdersFormActionsNewComponent implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;
  @Input()
  selfUser?: PeopleItem;

  @Output()
  closeForm = new EventEmitter<any>();

  // activates spinner
  savingChanges = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_orders: Store<fromOrders.OrdersState>,
    private spHttp: OrdersFormHttpService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  onSave() {
    this.savingChanges = true;
    this.saveFields(this.fg_fields.getRawValue());
  }

  saveFields(newFields: OrderItem) {
    console.log('');

    // trim out empty fields
    newFields = _.reduce(
      newFields,
      function(acc, value, key) {
        return value ? { ...acc, [key]: value } : { ...acc };
      },
      {}
    );

    console.log(newFields);

    // add last updated info
    newFields = {
      ...newFields,
      LastUpdatedById: this.selfUser.Id,
      LastUpdated: new Date(Date.now())
    };

    this.spHttp
      .createOrder(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as OrderItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new order')
      );
  }

  saveFieldsSuccess(newOrder: OrderItem) {
    // add newly created order to orders store
    console.log('get new order');
    console.log(newOrder);
    this.spHttp
      .getItemById(newOrder.ID)
      .pipe(take(1))
      .subscribe(
        success => this.getNewlyCreatedItemSuccess(success as OrderItem[]),
        error => console.log(error),
        () => console.log('completed getting newly created item')
      );
  }

  getNewlyCreatedItemSuccess(newItemExpanded: OrderItem[]) {
    console.log('get new item expanded');
    console.log(newItemExpanded);
    this.store_orders.dispatch(
      new fromOrdersActions.InsertOneOrder({
        ...newItemExpanded[0],
        id: newItemExpanded[0].ID
      })
    );
    this.finalize();
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  finalize() {
    console.log(this.fg_fields.value);
    this.savingChanges = false;
    this.closeForm.emit({
      result: 'success',
      data: this.fg_fields.value
    });
  }

  log() {
    console.log(this.fg_fields);
    console.log(this.fg_fields.getRawValue());
  }
}
