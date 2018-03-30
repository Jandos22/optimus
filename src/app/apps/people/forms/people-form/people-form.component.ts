import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs/Subscription';
import { map, tap } from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// services
import { ValidationService } from '../../../../validators/validation.service';

// interfaces
import { PeopleItem, PeopleItemChanges } from '../../models/people-item.model';
import { Locations } from './../../../../models/locations.m';

export interface Photo {
  photoExists: boolean;
  photoSelected: boolean;
  photoCropped: boolean;
  photo: string;
  arrayBuffer: ArrayBuffer;
}

// dialog components
import { PeopleFormPhotoPickerComponent } from './people-form-photo-picker/people-form-photo-picker.component';

@Component({
  selector: 'app-people-form',
  styleUrls: ['people-form.component.css'],
  template: `
    <span mat-dialog-title style="text-align: center;">{{ title }}</span>
    <mat-dialog-content>

      <!-- Common -->
      <div fxLayout="row wrap" fxLayoutGap="16px" fxLayoutAlign="start stretch">

        <div fxLayout="row wrap" fxFlex.gt-xs="180px">
          <app-people-form-photo fxFlex
            [photo]="photo" [mode]="mode" (onPhotoPicker)="openPhotoPicker()">
          </app-people-form-photo>
        </div>

        <div fxFlex fxLayout="row wrap" fxLayoutGap.gt-sm="16px">

            <app-people-form-name fxFlex.gt-xs="180px" [parent]="form"></app-people-form-name>
            <app-people-form-surname fxFlex.gt-xs="180px" [parent]="form"></app-people-form-surname>
            <app-people-form-alias fxFlex.gt-xs="180px" [parent]="form"></app-people-form-alias>
            <app-people-form-email fxFlex.gt-xs="180px" [parent]="form"></app-people-form-email>
            <app-people-form-gin fxFlex.gt-xs="180px" [parent]="form"></app-people-form-gin>
            <app-people-form-location fxFlex.gt-xs="180px"
              [parent]="form" [locations]="locations" [disabled]="locationDisabled">
            </app-people-form-location>

        </div>

      </div>

    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row wrap" fxLayoutAlign="end" class="headerfooter">
      <button mat-button tabindex="-1" *ngIf="mode.isEdit || mode.isNew" (click)="onLog()">SHOW FORM VALUES</button>
      <button mat-button tabindex="-1" *ngIf="mode.isView" (click)="onEdit()">EDIT</button>
      <button mat-button tabindex="-1" *ngIf="mode.isEdit || mode.isNew" (click)="onCancel()">CANCEL</button>
      <button mat-button tabindex="-1" *ngIf="mode.isView" (click)="onClose()">CLOSE</button>

      <button mat-button tabindex="-1" color="primary" [disabled]="form.invalid"
        *ngIf="mode.isEdit || mode.isNew" (click)="onSave()">SAVE</button>

    </mat-dialog-actions>
    `
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  photoForm: FormGroup;

  window$: Subscription;
  locations$: Subscription;

  locations: Locations[];
  photo: string;

  changesList: PeopleItemChanges;

  _name$: Subscription;

  constructor(
    private fb: FormBuilder,
    private fromRoot: Store<fromRoot.RootState>,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
    public photoDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // initialize form when component instantiated
    this.initForm();
    this.initPhotoForm();

    // on each breakpoint change, update size of form dialog
    this.window$ = this.fromRoot
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        let width: string;
        // let height: string;
        window.isXS
          ? (width = '80%')
          : window.isS
            ? (width = '440px')
            : window.isM ? (width = '652px') : (width = '832px');

        console.log(width);
        this.dialogRef.updateSize(width);
      });

    this.locations$ = this.fromRoot
      .select(fromRoot.getApplicationLocations)
      .subscribe(locations => (this.locations = locations));
  }

  openPhotoPicker() {
    // you can't open photo picker when mode is view
    let dialogRef = this.photoDialog.open(PeopleFormPhotoPickerComponent, {
      data: {
        photo: this.photo,
        arrayBuffer: this.photoForm.get('ArrayBuffer').value
      }
    });

    dialogRef.afterClosed().subscribe((result: Photo) => {
      console.log(result);
      if (result) {
        this.photo = result.photo;
        this.photoForm.get('ArrayBuffer').setValue(result.arrayBuffer);
        this.photoForm
          .get('Filename')
          .setValue(this.form.get('Alias').value + '.jpg');
      }
      console.log(this.photoForm.get('ArrayBuffer').value.byteLength);
    });
  }

  // ACTION BUTTONS

  onLog() {
    console.log(this.form);
    console.log(this.photoForm);
  }

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.data.mode = 'edit';
    this.initForm();
  }

  onCancel() {
    if (this.mode.isEdit) {
      this.data.mode = 'view';
      this.initForm();
      this.initPhotoForm();
    }
    if (this.mode.isNew) {
      this.onClose();
    }
  }

  //
  initForm() {
    this.form = this.fb.group({
      Name: [this.nameInput, Validators.required],
      Surname: [this.surnameInput, Validators.required],
      Alias: [this.aliasInput, Validators.required],
      Email: [this.emailInput, Validators.required],
      Gin: [
        this.ginInput,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ]
      ],
      Location: [this.locationInput, Validators.required],
      Photo: this.fb.group({
        Url: [this.photoInput['Url']],
        Description: [this.photoInput['Description']]
      })
    });
  }

  initPhotoForm() {
    this.photoForm = this.fb.group({
      Filename: ['', Validators.required],
      ArrayBuffer: [new ArrayBuffer(0), Validators.required]
    });
    this.photo = this.form.get('Photo.Url').value;
  }

  get title() {
    return this.mode.isNew
      ? 'New User'
      : this.user.Name + ' ' + this.user.Surname;
  }

  get mode() {
    const isNew = this.data.mode === 'new' ? true : false;
    const isView = this.data.mode === 'view' ? true : false;
    const isEdit = this.data.mode === 'edit' ? true : false;
    return { isNew, isView, isEdit };
  }

  get user(): PeopleItem {
    return !this.mode.isNew ? this.data.item : '';
  }

  // form values
  get nameInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Name, disabled: true }
        : { value: this.user.Name, disabled: false };
  }
  get surnameInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Surname, disabled: true }
        : this.user.Surname;
  }
  get aliasInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Alias, disabled: true }
        : { value: this.user.Alias, disabled: true };
  }
  get emailInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Email, disabled: true }
        : { value: this.user.Email, disabled: true };
  }
  get ginInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Gin, disabled: true }
        : this.user.Gin;
  }
  get locationInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView || this.mode.isEdit ? this.user.Location : '';
  }
  get locationDisabled() {
    return this.mode.isNew ? false : this.mode.isView ? true : false;
  }
  get photoInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView ? { ...this.user.Photo } : { ...this.user.Photo };
  }

  ngOnDestroy() {
    this.window$.unsubscribe();
    this.locations$.unsubscribe();
  }
}
