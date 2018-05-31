import { AsyncValidationService } from './../../../../validators/async-validation.service';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

// rxjs
import { Subscription, of, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

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
    <mat-dialog-content fxLayout="column" fxLayout.gt-xs="row" fxLayoutGap.gt-xs="16px">

        <div fxLayout="row" fxLayoutAlign="center start" fxFlex="134px" fxFlex.gt-xs="180px">
          <app-people-form-photo
            [photo]="photo" [mode]="mode" (onPhotoPicker)="openPhotoPicker()">
          </app-people-form-photo>
        </div>

        <div fxLayout="column" fxLayout.gt-xs="row wrap" fxLayoutGap.gt-xs="16px" fxFlex.gt-xs>

            <app-people-form-name fxFlex.gt-xs="180px" [parent]="form" [mode]="mode"></app-people-form-name>
            <app-people-form-surname fxFlex.gt-xs="180px" [parent]="form"></app-people-form-surname>
            <app-people-form-alias fxFlex.gt-xs="180px" [parent]="form"></app-people-form-alias>
            <app-people-form-email fxFlex.gt-xs="180px" [parent]="form"></app-people-form-email>
            <app-people-form-gin fxFlex.gt-xs="180px" [parent]="form"></app-people-form-gin>
            <app-people-form-location fxFlex.gt-xs="180px"
              [parent]="form" [locations]="locations" [disabled]="locationDisabled">
            </app-people-form-location>

        </div>



    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row wrap" fxLayoutAlign="end" class="headerfooter">
      <button mat-button tabindex="-1" *ngIf="mode.isView" (click)="onEdit()">EDIT</button>
      <button mat-button tabindex="-1" *ngIf="mode.isEdit || mode.isNew" (click)="onCancel()">CANCEL</button>
      <button mat-button tabindex="-1" *ngIf="mode.isView" (click)="onClose()">CLOSE</button>

      <button mat-raised-button tabindex="-1" color="primary" [disabled]="!form.valid"
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

  // react to value changes in form
  alias$: Subscription;

  constructor(
    private fb: FormBuilder,
    private fromRoot: Store<fromRoot.RootState>,
    private asyncValidators: AsyncValidationService,
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

        window.isXXS || window.isXS
          ? (width = '80%')
          : window.isS
            ? (width = '440px')
            : window.isM
              ? (width = '652px')
              : (width = '832px');

        console.log(width);
        this.dialogRef.updateSize(width);
      });

    // get locations list from store and update local locations list
    this.locations$ = this.fromRoot
      .select(fromRoot.getAppLocations)
      .subscribe(locations => (this.locations = locations));

    // when alias changed, also update email
    this.alias$ = this.form
      .get('Alias')
      .valueChanges.subscribe((alias: string) => {
        this.form.get('Email').setValue(`${alias}@slb.com`);
        this.updatePhotoFilename();
      });
  }

  // *** form group
  initForm() {
    this.form = this.fb.group({
      Name: [this.nameInput, Validators.required],
      Surname: [this.surnameInput, Validators.required],
      Alias: [
        this.aliasInput,
        Validators.required,
        this.uniqueAlias.bind(this)
      ],
      Email: [this.emailInput, Validators.required],
      Gin: [
        this.ginInput,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ],
        this.uniqueGin.bind(this)
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

  openPhotoPicker() {
    // you can't open photo picker when mode is view
    const dialogRef = this.photoDialog.open(PeopleFormPhotoPickerComponent, {
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
        this.updatePhotoFilename();
      }
      console.log(this.photoForm.get('ArrayBuffer').value.byteLength);
    });
  }

  // Utility Functions

  updatePhotoFilename(): void {
    const alias: string = this.form.get('Alias').value;
    this.photoForm.get('Filename').setValue(alias ? `${alias}.jpg` : '');
  }

  // ACTION BUTTONS

  onSave() {
    console.log(this.form);
    console.log(this.photoForm);
    console.log(this.photo);
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

  // *** form values getters
  // need to outsource them when have chance
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
      ? { value: '@slb.com', disabled: true }
      : this.mode.isView
        ? { value: this.user.Email, disabled: true }
        : { value: this.user.Email, disabled: true };
  }
  get ginInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Gin, disabled: true }
        : { value: this.user.Gin, disabled: true };
  }
  get locationInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView || this.mode.isEdit
        ? this.user.Location
        : '';
  }
  get locationDisabled() {
    return this.mode.isNew ? false : this.mode.isView ? true : false;
  }
  get photoInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { ...this.user.Photo }
        : { ...this.user.Photo };
  }

  // async validators

  // takes 'alias' => checks database => return form error or null
  // I couldn't integrate debounce time, now it just cancels http calls when typing
  uniqueAlias(control: AbstractControl) {
    return of(control.value).pipe(
      take(1),
      switchMap((alias: string) => {
        return this.asyncValidators.checkAliasUnique(alias);
      }),
      map((response: boolean) => {
        return response ? null : { uniqueAlias: true };
      })
    );
  }

  uniqueGin(control: AbstractControl) {
    return of(control.value).pipe(
      take(1),
      switchMap((gin: number) => {
        return this.asyncValidators.checkGinUnique(gin);
      }),
      map((response: boolean) => {
        return response ? null : { unique: true };
      })
    );
  }

  // unsubscribe from Subscription when component is destroyed
  ngOnDestroy() {
    this.window$.unsubscribe();
    this.locations$.unsubscribe();
    this.alias$.unsubscribe();
  }
}
