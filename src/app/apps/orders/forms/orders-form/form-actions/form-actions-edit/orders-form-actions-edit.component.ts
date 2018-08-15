import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import * as _ from 'lodash';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromOrders from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromOrdersActions from '../../../../store/actions/orders.actions';

// interfaces
import { OrderItem } from '../../../../../../shared/interface/orders.model';

// services
import { OrdersFormHttpService } from '../../form-services/orders-form-http.service';
import { SpListItemAttachmentFile } from '../../../../../../shared/interface/sp-list-item.model';
import { PeopleItem } from '../../../../../../shared/interface/people.model';

@Component({
  selector: 'app-orders-form-actions-edit',
  styleUrls: ['orders-form-actions-edit.component.scss'],
  template: `
    <!-- <button mat-button color="warn" (click)="log()">LOG</button> -->

    <button mat-button color="primary" tabindex="-1"
      [disabled]="!fg_fields.valid || !hasUnsavedFields || savingChanges"
      (click)="onSave()">
      <span *ngIf="!savingChanges">SAVE</span>
      <span *ngIf="savingChanges">SAVING </span>
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="switchFormMode.emit('view')">
      CANCEL
    </button>

    <app-orders-form-actions-edit-fields
      [fg_fields]="fg_fields" [initialFields]="initialFields"
      (whenUnsavedFieldsChange)="unsavedFieldsChange($event)">
    </app-orders-form-actions-edit-fields>
    `
})
export class OrdersFormActionsEditComponent implements OnInit, OnDestroy {
  @Input()
  fg_fields: FormGroup;
  @Input()
  initialFields: OrderItem;
  @Input()
  selfUser?: PeopleItem;

  @Output()
  closeForm = new EventEmitter<any>();
  @Output()
  switchFormMode = new EventEmitter<any>();

  @Output()
  updateDataItem = new EventEmitter<OrderItem>();

  // activates spinner
  savingChanges = false;

  // toggles save button
  hasUnsavedFields = false;

  // collector
  unsavedFields = {}; // start with empty object

  // subscriptions
  // $saveChangesFields: Subscription;
  // $saveChangesImage: Subscription;
  $watchArrayBuffer: Subscription;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_orders: Store<fromOrders.OrdersState>,
    private spHttp: OrdersFormHttpService
  ) {
    console.log('orders-form-actions-edit: initialized');
  }

  ngOnInit() {}

  ngOnDestroy() {}

  // triggered from child component
  unsavedFieldsChange(unsavedFields: Object) {
    this.hasUnsavedFields = _.size(unsavedFields) ? true : false;
    this.unsavedFields = { ...unsavedFields };

    console.log('unsaved fields changed:');
    console.log(this.unsavedFields);
  }

  // SAVE button
  onSave() {
    this.savingChanges = true;

    // (1) first save unsaved fields
    if (this.hasUnsavedFields) {
      this.saveFields(this.unsavedFields);

      // (2) if no fields nor image to save then do nothing
    } else {
      console.log('nothing to save, buddy!');
    }
  }

  saveFields(newFields: OrderItem) {
    console.log('starting to save fields:');
    console.log(newFields);

    // add last updated info
    newFields = {
      ...newFields,
      LastUpdatedById: this.selfUser.Id,
      LastUpdated: new Date(Date.now())
    };

    this.spHttp
      .updateItem(newFields)
      .pipe(take(1)) // subscription will auto unsubscribe
      .subscribe(
        success => this.saveFieldsSuccess(success as OrderItem),
        error => this.saveFieldsError(error),
        () => console.log('completed updating list item')
      );
  }

  saveFieldsSuccess(updatedItem: OrderItem) {
    console.log('successfully saved fields:');
    console.log(updatedItem);

    // empty out unsaved fields since you saved them just now
    this.unsavedFields = {};
    this.hasUnsavedFields = false;

    this.getAllFieldsOfUpdatedItem(updatedItem);
  }

  getAllFieldsOfUpdatedItem(updatedItem: OrderItem) {
    console.log('getting all fields of updated item:');

    this.spHttp
      .getItemById(updatedItem.ID)
      .pipe(take(1))
      .subscribe(
        success =>
          this.getAllFieldsOfUpdatedItemSuccees(success[0] as OrderItem),
        error => this.getAllFieldsOfUpdatedItemError(error),
        () => console.log('completed getting all fields of updated item')
      );
  }

  getAllFieldsOfUpdatedItemSuccees(fullItem: OrderItem) {
    console.log('successfully got all fields of updated item:');
    console.log(fullItem);

    // now you want to update data.item
    // in case user will want to hit EDIT button again
    this.updateDataItem.emit(fullItem);

    // update item entity in state
    this.store_orders.dispatch(
      new fromOrdersActions.UpdateOneOrder(fullItem.ID, fullItem)
    );

    // function that checks if anything left to save
    // if yes, it will run save workflows
    // if not, then switch mode to view
    this.finalize();
  }

  getAllFieldsOfUpdatedItemError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  finalize() {
    console.log('completed saving everything:');
    this.savingChanges = false;
    this.switchFormMode.emit('view');
  }

  log() {
    console.log(this.fg_fields);
    console.log(this.fg_fields.getRawValue());
  }
}
