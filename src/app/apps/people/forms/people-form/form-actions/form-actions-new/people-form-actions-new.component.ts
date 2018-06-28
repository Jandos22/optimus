import { take } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Observable, Subscription } from 'rxjs';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../../../../../store';
import * as fromPeople from '../../../../store';

// ngrx actions
import * as fromErrorActions from '../../../../../../store/actions/errors.actions';
import * as fromUsersActions from '../../../../store/actions/users.action';

// interfaces
import { PeopleItem } from '../../../../../../shared/interface/people.model';

// services
import { PeopleFormHttpService } from '../../form-services';
import { SpListItemAttachmentFiles } from '../../../../../../shared/interface/sp-list-item-field.model';

@Component({
  selector: 'app-people-form-actions-new',
  styleUrls: ['people-form-actions-new.component.scss'],
  template: `
    <button mat-button color="primary" (click)="log()">F</button>
    <button mat-button tabindex="-1" color="primary" class="mat-button__fa-icon"
      [disabled]="!fg_fields.valid || !hasUnsavedPhoto || savingChanges"
      (click)="onSave()">
      <fa-icon *ngIf="savingChanges" [icon]="['fas', 'spinner']" [spin]="true" matTooltip="Saving changes"></fa-icon>
      <fa-icon *ngIf="!savingChanges" [icon]="['far', 'save']" matTooltip="Save changes"></fa-icon>
    </button>

    <button mat-button tabindex="-1"
      (click)="closeUserForm.emit()">
      CANCEL
    </button>
    `
})
export class PeopleFormActionsNewComponent implements OnInit {
  @Input() fg_fields: FormGroup;
  @Input() fg_photo: FormGroup;

  @Output() closeUserForm = new EventEmitter();

  $watchArrayBuffer: Subscription; // unsubscription handled in ngOnDestroy

  // activates spinner
  savingChanges = false;

  hasUnsavedPhoto = false;

  constructor(
    private store_root: Store<fromRoot.RootState>,
    private store_people: Store<fromPeople.PeopleState>,
    private spHttp: PeopleFormHttpService
  ) {}

  ngOnInit() {
    this.$watchArrayBuffer = this.fg_photo
      .get('ArrayBuffer')
      .valueChanges.subscribe(arrayBuffer =>
        this.onArrayBufferChange(arrayBuffer)
      );
  }

  // user has unsaved photo when ArrayBuffer is not 0
  onArrayBufferChange(arrayBuffer: ArrayBuffer) {
    arrayBuffer.byteLength
      ? (this.hasUnsavedPhoto = true)
      : (this.hasUnsavedPhoto = false);
  }

  onSave() {
    this.savingChanges = true;

    // (1) first save fields,
    // then photo is uploaded in its attachments
    this.saveFields(this.fg_fields.value);
  }

  saveFields(newFields: PeopleItem) {
    this.spHttp
      .addUser(newFields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as PeopleItem),
        error => this.saveFieldsError(error),
        () => console.log('completed adding new user')
      );
  }

  saveFieldsSuccess(newUser: PeopleItem) {
    // add newly created user to users store
    // update fg_photo by adding ID of created user
    // check if form has unsaved photo and upload it
    // if no unsaved photo, then close form
    console.log(newUser);
    this.fg_photo.get('ID').patchValue(newUser.ID);
    this.store_people.dispatch(
      new fromUsersActions.AddOneUser({ ...newUser, id: newUser.ID })
    );
    this.closeFormOrUploadPhoto();
  }

  saveFieldsError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  savePhoto() {
    this.spHttp
      .saveNewPhoto(this.fg_photo.value)
      .pipe(take(1))
      .subscribe(
        success => this.savePhotoSuccess(success),
        error => this.savePhotoError(error),
        () => console.log('completed saving photo of new user')
      );
  }

  savePhotoSuccess(newPhoto) {
    // photo saved, no unsaved photo left
    // prepare changes object to update user item in state
    // update relevant user item by adding photo
    // close form

    this.hasUnsavedPhoto = false;

    const changes: PeopleItem = {
      Attachments: true,
      AttachmentFiles: {
        results: newPhoto
      }
    };

    this.store_people.dispatch(
      new fromUsersActions.UpdateOneUser(this.fg_photo.get('ID').value, changes)
    );

    this.closeFormOrUploadPhoto();
  }

  savePhotoError(error) {
    this.savingChanges = false;
    console.log(error);
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  closeFormOrUploadPhoto() {
    // if form has unsaved photo then upload it
    if (this.hasUnsavedPhoto) {
      this.savingChanges = true;
      this.savePhoto();
    } else {
      this.savingChanges = false;
      this.closeUserForm.emit({
        result: 'success',
        data: this.fg_fields.value
      });
    }
  }

  addIdField(item: PeopleItem) {
    return { ...item, id: item.ID };
  }

  log() {
    console.log(this.fg_fields);
    console.log(this.fg_photo);
  }
}
