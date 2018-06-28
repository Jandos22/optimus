import { Router } from '@angular/router';
import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../store';
import * as fromErrorActions from '../../../../../store/actions/errors.actions';

// interfaces
import { PeopleItem } from './../../../../../shared/interface/people.model';

// services
import { NewUserFormHttpService } from '../services/new-user-form-http.service';

@Component({
  selector: 'app-new-user-form-actions',
  styleUrls: ['new-user-form-actions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- <button mat-button (click)="log()">LOG</button> -->

    <button *ngIf="!saving" mat-button (click)="onReset()">RESET</button>

    <button mat-button tabindex="-1" color="primary" class="mat-button__fa-icon"
        [disabled]="fg_fields.invalid || !hasUnsavedPhoto || saving"
        (click)="onSave()">
        <!-- two span els needed to have right vertical alignment -->
        <span *ngIf="saving" class="cta__fa-icon" matTooltip="Saving">
          <fa-icon [icon]="['fas', 'spinner']" [spin]="true"></fa-icon>
        </span>
        <!-- <span class="g_form-button__text">SAVE</span> -->
        <span *ngIf="!saving" class="cta__fa-icon" matTooltip="Save">
          <fa-icon [icon]="['far', 'save']"></fa-icon>
        </span>
    </button>
    `
})
export class NewUserFormActionsComponent implements OnInit, OnDestroy {
  @Input() fg_fields: FormGroup;
  @Input() fg_photo: FormGroup;

  // this is used to activate/disable save button
  hasUnsavedPhoto: boolean;

  // will switch to false when fields will be saved
  // and newly created user received from server
  hasUnsavedFields = true;

  @Output() onReset = new EventEmitter<any>();
  @Output() setFormPhotoID = new EventEmitter<number>();
  @Output() resetArrayBuffer = new EventEmitter<any>();

  $watchArrayBuffer: Subscription;

  // this will show or hide saving spinner
  saving = false;

  constructor(
    private spHttp: NewUserFormHttpService,
    private store_root: Store<fromRoot.RootState>,
    private router: Router
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
    this.saving = true;
    const fields = this.fg_fields.getRawValue() as PeopleItem;

    // unsaved fields need to be saved first
    if (this.hasUnsavedFields) {
      this.saveFields(fields);
    } else if (this.hasUnsavedPhoto) {
      this.savePhoto();
    }
  }

  saveFields(fields: PeopleItem) {
    console.log('Start to save fields:');
    console.log(fields);

    this.spHttp
      .addNewUser(fields)
      .pipe(take(1))
      .subscribe(
        success => this.saveFieldsSuccess(success as PeopleItem),
        error => this.saveFieldsError(error),
        () => console.log('saveFields completed')
      );
  }

  saveFieldsSuccess(success: PeopleItem) {
    console.log('Successfully saved fields:');
    console.log(success);
    this.hasUnsavedFields = false;
    this.setFormPhotoID.emit(success.ID);
    this.whatsNext();
  }

  // quite self describing
  saveFieldsError(error) {
    console.log('error saving fields');
    console.log(error);
    this.saving = false;
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  savePhoto() {
    console.log('Start to save photo:');
    console.log(this.fg_photo.value);
    this.saving = true;
    this.spHttp
      .savePhoto(this.fg_photo.value)
      .pipe(take(1))
      .subscribe(
        success => this.savePhotoSuccess(success),
        error => this.savePhotoError(error),
        () => console.log('savePhoto completed')
      );
  }

  savePhotoSuccess(success) {
    console.log('Successfully saved photo');
    console.log(success);
    this.fg_photo.get('ArrayBuffer').patchValue(new ArrayBuffer(0));
    this.whatsNext();
  }

  savePhotoError(error) {
    console.log('error saving photo');
    console.log(error);
    this.saving = false;
    this.store_root.dispatch(new fromErrorActions.DisplayError(error));
  }

  whatsNext() {
    console.log('has unsaved fields? ');
    console.log(this.hasUnsavedFields);
    console.log('has unsaved photo? ');
    console.log(this.hasUnsavedPhoto);

    if (this.hasUnsavedFields) {
      this.onSave(); // start over
    } else if (this.hasUnsavedPhoto) {
      this.savePhoto();
    } else {
      console.log('All saved, now redirect to home page');
      this.router.navigate(['/']);
    }
  }

  // for debugging and development
  log() {
    console.log(this.fg_fields);
    console.log(this.fg_photo);
  }

  ngOnDestroy() {
    this.$watchArrayBuffer.unsubscribe();
  }
}
