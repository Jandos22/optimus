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
import {
  Subscription,
  Observable,
  of,
  from,
  merge,
  fromEvent,
  Subject
} from 'rxjs';
import {
  map,
  tap,
  switchMap,
  take,
  filter,
  pluck,
  takeUntil
} from 'rxjs/operators';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// services
import { ValidationService } from '../../../../validators/validation.service';
import { AsyncValidationService } from './../../../../validators/async-validation.service';
import { PeopleFormValueService } from './../../services/people-form-value.service';
import { PeopleFormSizeService } from '../../services/people-form-size.service';

// interfaces
import { PeopleItemChanges } from '../../models/people-item.model';
// import { Locations } from './../../../../models/locations.m';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import {
  PeopleItem,
  PeopleItemObject
} from './../../../../shared/interface/people.model';

export interface Photo {
  photoExists: boolean;
  photoSelected: boolean;
  photoCropped: boolean;
  photo: string;
  arrayBuffer: ArrayBuffer;
}

// dialog components
import { PeopleFormPhotoPickerComponent } from './people-form-photo-picker/people-form-photo-picker.component';
import { FormMode } from '../../../../models/form-mode.model';

@Component({
  selector: 'app-people-form',
  styleUrls: ['people-form.component.css'],
  template: `
    <span mat-dialog-title style="text-align: center;">{{ title }}</span>
    <mat-dialog-content fxLayout="column" fxLayout.gt-xs="row" fxLayoutGap.gt-xs="16px">

        <!--
        <div fxLayout="row" fxLayoutAlign="center start" fxFlex="134px" fxFlex.gt-xs="180px">
          <app-people-form-photo
            [photo]="photo" [mode]="mode" (onPhotoPicker)="openPhotoPicker()">
          </app-people-form-photo>
        </div>
        -->

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

      <button mat-button tabindex="-1"
        *ngIf="mode.isEdit || mode.isNew"
        (click)="onCancel()" class="people-form__btn--cancel">CANCEL</button>

      <button mat-button tabindex="-1" *ngIf="mode.isView" (click)="onClose()">CLOSE</button>

      <button mat-raised-button tabindex="-1" color="primary" [disabled]="!form.valid"
        *ngIf="mode.isNew" (click)="onSave()">SAVE</button>

      <button mat-raised-button tabindex="-1" color="primary" [disabled]="!form.valid || !hasUpdatedFields"
        *ngIf="mode.isEdit" (click)="onSaveChanges()">SAVE</button>

    </mat-dialog-actions>
    `,
  providers: [PeopleFormValueService, PeopleFormSizeService]
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  // photoForm: FormGroup;

  window$: Subscription;
  locations$: Subscription;

  locations: LocationEnt[];
  // photo: string;

  changesList: PeopleItemChanges;

  _name$: Subscription;

  // react to value changes in form
  alias$: Subscription;

  user: PeopleItem;

  updatedFields: Object;

  formEditingCancelled$: Subject<void>;

  $acceptOnlyNewValues: Subscription;
  $acceptOnlyInitialValues: Subscription;

  fc_changes$: Observable<Object>;

  // observables /to/ form control changes
  fc_name$: Observable<string>;
  fc_surname$: Observable<string>;
  fc_alias$: Observable<string>;
  fc_email$: Observable<string>;
  fc_gin$: Observable<string>;
  fc_location_assigned$: Observable<string>;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.RootState>,
    private asyncValidators: AsyncValidationService,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
    public photoDialog: MatDialog,
    private formValueService: PeopleFormValueService,
    private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; item?: PeopleItem }
  ) {
    this.initForm(this.formValueService.itemValue(this.data));
  }

  ngOnInit() {
    // initialize form when component instantiated
    // this.initForm(this.formValueService.itemValue(this.data));
    // this.initPhotoForm();

    // on each breakpoint change, update size of form dialog
    this.window$ = this.store
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        this.dialogRef.updateSize(this.formSizeService.width(window));
      });

    // get locations list from store and update local locations list
    this.locations$ = this.store
      .select(fromRoot.selectAllLocations)
      .subscribe(locations => (this.locations = locations));

    // when alias changed, also update email
    this.alias$ = this.form
      .get('Alias')
      .valueChanges.subscribe((alias: string) => {
        this.form.get('Email').setValue(`${alias}@slb.com`);
        // this.updatePhotoFilename();
      });
  }

  // *** form group
  // values assigned depending on mode (new, view or edit)
  initForm(item: PeopleItem) {
    console.log(item);
    this.form = this.fb.group({
      Name: [
        this.formValueService.initNameValue(this.mode, item.Name),
        Validators.required
      ],
      Surname: [
        this.formValueService.initSurnameValue(this.mode, item.Surname),
        Validators.required
      ],
      Alias: [
        this.formValueService.initAliasValue(this.mode, item.Alias),
        Validators.required,
        this.uniqueAlias.bind(this)
      ],
      Email: [
        this.formValueService.initEmailValue(this.mode, item.Email),
        Validators.required
      ],
      Gin: [
        this.formValueService.initGinValue(this.mode, item.Gin),
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ],
        this.uniqueGin.bind(this)
      ],
      LocationAssignedId: [
        this.formValueService.initLocationAssignedIdValue(
          this.mode,
          item.LocationAssignedId
        ),
        Validators.required
      ]
      // Photo: this.fb.group({
      //   Url: [this.photoInput['Url']],
      //   Description: [this.photoInput['Description']]
      // })
    });

    if (this.data.mode === 'edit') {
      this.StartEditingForm();
    }
  }

  StartEditingForm() {
    // collection of updated form control values
    // start with empty object
    this.updatedFields = {};

    // create new subject and then send notification
    // for unsubscribe observable
    this.formEditingCancelled$ = new Subject();

    // when observable notified it cancels subscription
    const unsubscribe$ = this.formEditingCancelled$.pipe(
      tap(v => console.log('editing cancelled & subscription completed'))
    );

    // register observables to listen for form control changes
    this.fc_name$ = this.form.get('Name').valueChanges;
    this.fc_surname$ = this.form.get('Surname').valueChanges;
    this.fc_alias$ = this.form.get('Alias').valueChanges;
    this.fc_email$ = this.form.get('Email').valueChanges;
    this.fc_gin$ = this.form.get('Gin').valueChanges;
    this.fc_location_assigned$ = this.form.get(
      'LocationAssignedId'
    ).valueChanges;

    // merge all form control listeners and emit one object at a time
    this.fc_changes$ = merge(
      this.fc_name$.pipe(map(Name => ({ Name }))),
      this.fc_surname$.pipe(map(Surname => ({ Surname }))),
      this.fc_alias$.pipe(map(Alias => ({ Alias }))),
      this.fc_email$.pipe(map(Email => ({ Email }))),
      this.fc_gin$.pipe(map(Gin => ({ Gin }))),
      this.fc_location_assigned$.pipe(
        map(LocationAssignedId => ({ LocationAssignedId }))
      )
    );

    // subscription that get values only if they differ from initial
    // then new value added into collection of updated values
    this.$acceptOnlyNewValues = this.fc_changes$
      .pipe(
        filter((keyValuePair: Object) => {
          console.log(keyValuePair);
          const key = Object.keys(keyValuePair).toString();
          return this.data.item[key] !== keyValuePair[key];
        }),
        takeUntil(unsubscribe$)
      )
      .subscribe(updatedField => {
        this.updatedFields = { ...this.updatedFields, ...updatedField };
        console.log(this.updatedFields);
      });

    this.$acceptOnlyInitialValues = this.fc_changes$
      .pipe(
        filter((keyValuePair: Object) => {
          const key = Object.keys(keyValuePair).toString();
          return this.data.item[key] === keyValuePair[key];
        }),
        takeUntil(unsubscribe$)
      )
      .subscribe(initial => {
        delete this.updatedFields[Object.keys(initial).toString()];
        console.log(this.updatedFields);
      });
  }

  // initPhotoForm() {
  //   this.photoForm = this.fb.group({
  //     Filename: ['', Validators.required],
  //     ArrayBuffer: [new ArrayBuffer(0), Validators.required]
  //   });
  //   this.photo = this.form.get('Photo.Url').value;
  // }

  // openPhotoPicker() {
  //   // you can't open photo picker when mode is view
  //   const dialogRef = this.photoDialog.open(PeopleFormPhotoPickerComponent, {
  //     data: {
  //       photo: this.photo,
  //       arrayBuffer: this.photoForm.get('ArrayBuffer').value
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe((result: Photo) => {
  //     console.log(result);
  //     if (result) {
  //       this.photo = result.photo;
  //       this.photoForm.get('ArrayBuffer').setValue(result.arrayBuffer);
  //       this.updatePhotoFilename();
  //     }
  //     console.log(this.photoForm.get('ArrayBuffer').value.byteLength);
  //   });
  // }

  // Utility Functions

  // updatePhotoFilename(): void {
  //   const alias: string = this.form.get('Alias').value;
  //   this.photoForm.get('Filename').setValue(alias ? `${alias}.jpg` : '');
  // }

  // ACTION BUTTONS

  onSave() {
    console.log(this.form);
    // console.log(this.photoForm);
    // console.log(this.photo);
  }

  onSaveChanges() {}

  onClose() {
    this.dialogRef.close();
  }

  onEdit() {
    this.data.mode = 'edit';
    this.initForm(this.formValueService.itemValue(this.data));
  }

  onCancel() {
    if (this.mode.isEdit) {
      this.data.mode = 'view';
      this.formEditingCancelled$.next();
      this.formEditingCancelled$.complete();
      this.initForm(this.formValueService.itemValue(this.data));
      // this.initPhotoForm();
    }
    if (this.mode.isNew) {
      this.onClose();
    }
  }

  get title() {
    return this.mode.isNew
      ? 'New User'
      : this.data.item.Name + ' ' + this.data.item.Surname;
  }

  get mode() {
    const isNew = this.data.mode === 'new' ? true : false;
    const isView = this.data.mode === 'view' ? true : false;
    const isEdit = this.data.mode === 'edit' ? true : false;
    return { isNew, isView, isEdit };
  }

  // used to enable/disable save changes button
  get hasUpdatedFields() {
    return Object.keys(this.updatedFields).length === 0 &&
      this.updatedFields.constructor === Object
      ? false
      : true;
  }

  // get user(): PeopleItem | null {
  //   return !this.mode.isNew ? this.data.item : null;
  // }

  get locationDisabled() {
    return this.mode.isNew ? false : this.mode.isView ? true : false;
  }
  // get photoInput() {
  //   return this.mode.isNew
  //     ? ''
  //     : this.mode.isView
  //       ? { ...this.user.Photo }
  //       : { ...this.user.Photo };
  // }

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
