import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription, Observable, merge } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

// ngrx
import { Store, select } from '@ngrx/store';

import * as fromRoot from '../../../../../../store';
import * as a_in_errors from '../../../../../../store/actions/errors.actions';

import * as fromPeople from '../../../../store';
import * as a_in_users from '../../../../store/actions/users.action';

// interfaces
import { PeopleItem } from './../../../../../../shared/interface/people.model';

// children
import { PeopleFormActionsEditFieldsComponent } from '..';

// services
import { PeopleFormHttpService } from './../../form-services/people-form-http.service';

@Component({
  selector: 'app-people-form-actions-edit',
  styleUrls: ['people-form-actions-edit.component.scss'],
  template: `
    <!-- btn for saving changes in edit mode -->
    <button mat-raised-button tabindex="-1" color="primary"
        [disabled]="!fg_fields.valid || !hasUnsavedFields || savingChanges"
        (click)="onSaveChanges()">
        <!-- two span els needed to have right vertical alignment -->
        <span *ngIf="savingChanges" class="g_form-button__text has-spinner"><i class="fas fa-spinner fa-spin"></i></span>
        <span class="g_form-button__text">SAVE</span>
    </button>

    <button mat-button tabindex="-1"
      (click)="onCancel()">
      CANCEL
    </button>

    <app-people-form-actions-edit-fields
      [fg_fields]="fg_fields" [initialFields]="initialFields"
      (whenUnsavedFieldsChange)="unsavedFieldsChange($event)">
    </app-people-form-actions-edit-fields>
    `
})
export class PeopleFormActionsEditComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() initialFields: PeopleItem;

  @Output() switchFormMode = new EventEmitter<any>();
  @Output() updateFormGroupFields = new EventEmitter<PeopleItem>();

  unsavedFields = {};

  // activates spinner
  savingChanges = false;
  hasUnsavedFields = false;

  // subscriptions
  $onSaveChanges: Subscription;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_people: Store<fromPeople.PeopleState>,
    private httpService: PeopleFormHttpService
  ) {
    console.log('people-form-actions-edit: initialized');
  }

  ngOnInit() {}

  checkObjectHasProperties(unsavedFields): boolean {
    return Object.keys(unsavedFields).length === 0 &&
      unsavedFields.constructor === Object
      ? false
      : true;
  }

  // triggered from child component
  unsavedFieldsChange(unsavedFields) {
    this.hasUnsavedFields = this.checkObjectHasProperties(unsavedFields);
    this.unsavedFields = { ...unsavedFields };
    console.log(this.unsavedFields);
  }

  onSaveChanges() {
    console.log('save btn clicked, save the following:');
    console.log(this.unsavedFields);
    this.savingChanges = true;
    this.$onSaveChanges = this.httpService
      .updatePeopleItem(this.unsavedFields)
      .subscribe(
        success => this.saveChangesSuccess(success),
        error => this.saveChangesError(error),
        () => console.log('completed')
      )
      .add(() => console.log('unsubscribed'));
  }

  saveChangesSuccess(success: PeopleItem) {
    console.log('successfully updated people item');
    this.savingChanges = false;
    this.$onSaveChanges.unsubscribe();
    this.updateFormGroupFields.emit(success);
    this.store_people.dispatch(
      new a_in_users.UpdateOneUser(success.ID, success)
    );
    this.switchFormMode.emit('view');
  }

  saveChangesError(error) {
    console.log('error when updating people item');
    this.savingChanges = false;
    this.$onSaveChanges.unsubscribe();
    this.store_root.dispatch(new a_in_errors.DisplayError(error));
  }

  onCancel() {}

  ngOnDestroy() {
    console.log('people-form-actions-edit component: "destroyed"');
  }
}
