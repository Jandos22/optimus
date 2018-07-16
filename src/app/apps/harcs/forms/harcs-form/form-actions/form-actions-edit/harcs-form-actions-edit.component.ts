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
import * as fromHarcs from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromHarcsActions from '../../../../store/actions/harcs.actions';

// interfaces
import { HarcItem } from '../../../../../../shared/interface/harcs.model';

// services
import { HarcsFormHttpService } from '../../form-services/harcs-form-http.service';
import { SpListItemAttachmentFile } from '../../../../../../shared/interface/sp-list-item.model';

@Component({
  selector: 'app-harcs-form-actions-edit',
  styleUrls: ['harcs-form-actions-edit.component.scss'],
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

    <app-harcs-form-actions-edit-fields
      [fg_fields]="fg_fields" [initialFields]="initialFields"
      (whenUnsavedFieldsChange)="unsavedFieldsChange($event)">
    </app-harcs-form-actions-edit-fields>
    `
})
export class HarcsFormActionsEditComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: HarcItem;

  @Output() closeForm = new EventEmitter<any>();
  @Output() switchFormMode = new EventEmitter<any>();

  @Output() updateDataItem = new EventEmitter<HarcItem>();

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
    private store_harcs: Store<fromHarcs.HarcsState>,
    private spHttp: HarcsFormHttpService
  ) {
    console.log('harcs-form-actions-edit: initialized');
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

  saveFields(newFields: HarcItem) {
    console.log('starting to save fields:');
    console.log(newFields);

    this.spHttp
      .updateItem(newFields)
      .pipe(take(1)) // subscription will auto unsubscribe
      .subscribe(
        success => this.saveFieldsSuccess(success as HarcItem),
        error => this.saveFieldsError(error),
        () => console.log('completed updating list item')
      );
  }

  saveFieldsSuccess(updatedItem: HarcItem) {
    console.log('successfully saved fields:');
    console.log(updatedItem);

    // empty out unsaved fields since you saved them just now
    this.unsavedFields = {};
    this.hasUnsavedFields = false;

    this.getAllFieldsOfUpdatedItem(updatedItem);
  }

  getAllFieldsOfUpdatedItem(updatedItem: HarcItem) {
    console.log('getting all fields of updated item:');

    this.spHttp
      .getItemById(updatedItem.ID)
      .pipe(take(1))
      .subscribe(
        success =>
          this.getAllFieldsOfUpdatedItemSuccees(success[0] as HarcItem),
        error => this.getAllFieldsOfUpdatedItemError(error),
        () => console.log('completed getting all fields of updated item')
      );
  }

  getAllFieldsOfUpdatedItemSuccees(fullItem: HarcItem) {
    console.log('successfully got all fields of updated item:');
    console.log(fullItem);

    // now you want to update data.item
    // in case user will want to hit EDIT button again
    this.updateDataItem.emit(fullItem);

    // update item entity in state
    this.store_harcs.dispatch(
      new fromHarcsActions.UpdateOneHarc(fullItem.ID, fullItem)
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
