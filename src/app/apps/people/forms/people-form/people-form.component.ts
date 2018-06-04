import {
  PathSlbSp,
  WirelinePath,
  PathOptimus
} from './../../../../shared/constants/index';
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
// ngrx actions
import * as a_in_errors from '../../../../store/actions/errors.actions';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// services
import { PeopleService } from './../../services/people.service';
import { ValidationService } from '../../../../validators/validation.service';
import { AsyncValidationService } from './../../../../validators/async-validation.service';
import { PeopleFormValueService } from './../../services/people-form-value.service';
import { PeopleFormSizeService } from '../../services/people-form-size.service';
import { PeopleFormPhotoService } from './../../services/people-form-photo.service';

// interfaces
import { PeopleItemChanges } from '../../models/people-item.model';
// import { Locations } from './../../../../models/locations.m';
import { LocationEnt } from '../../../../shared/interface/locations.model';
import { WindowProperties } from './../../../../models/window-properties.m';
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
import {
  PeopleFormPhotoPickerComponent,
  UserPhotoState
} from './people-form-photo-picker/people-form-photo-picker.component';
import { FormMode } from '../../../../models/form-mode.model';

@Component({
  selector: 'app-people-form',
  styleUrls: ['people-form.component.css'],
  templateUrl: './people-form.component.html',
  providers: [PeopleFormValueService, PeopleFormSizeService]
})
export class PeopleFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  fg_photo: FormGroup;

  window$: Subscription;
  window: WindowProperties;

  locations$: Subscription;

  locations: LocationEnt[];
  // photo: string;

  changesList: PeopleItemChanges;

  _name$: Subscription;

  // react to value changes in form
  alias$: Subscription;

  updatedFields: Object;

  initialPhoto: Object;
  updatedPhoto: Object;

  formEditingCancelled$: Subject<void>;

  $acceptOnlyNewValues: Subscription;
  $acceptOnlyInitialValues: Subscription;
  fc_changes$: Observable<Object>;

  $acceptOnlyNewPhotoValues: Subscription;
  $acceptOnlyInitialPhotoValues: Subscription;
  fg_photo_changes$: Observable<Object>;

  // observables /to/ form control changes
  fc_name$: Observable<string>;
  fc_surname$: Observable<string>;
  fc_alias$: Observable<string>;
  fc_email$: Observable<string>;
  fc_gin$: Observable<string>;
  fc_location_assigned$: Observable<string>;

  fc_arraybuffer: Observable<ArrayBuffer>;
  fc_filename: Observable<string>;

  // button state properties
  onSaveChangesActive = false;
  onSaveActive = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromRoot.RootState>,
    private asyncValidators: AsyncValidationService,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
    public photoDialog: MatDialog,
    private peopleService: PeopleService,
    private formPhotoService: PeopleFormPhotoService,
    private formValueService: PeopleFormValueService,
    private formSizeService: PeopleFormSizeService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; item?: PeopleItem }
  ) {
    this.initForm(this.formValueService.itemValue(this.data));
    this.initFgPhoto();
  }

  ngOnInit() {
    // initialize form when component instantiated
    // this.initPhotoForm();

    // on each breakpoint change, update size of form dialog
    this.window$ = this.store
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        this.window = window;
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
        this.updatePhotoFilename();
      });
  }

  // *** form group
  // values assigned depending on mode (new, view or edit)
  initForm(item: PeopleItem) {
    this.initialPhoto = { ...this.initialPhoto, ...item.Photo };

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
    // this.updatedPhoto = {};

    // create new subject and then send notification
    // for unsubscribe observable
    this.formEditingCancelled$ = new Subject();

    // when observable notified it cancels subscription
    const unsubscribe$ = this.formEditingCancelled$.pipe(
      tap(_ => console.log('editing cancelled & subscription completed'))
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
          const key = Object.keys(keyValuePair).toString();
          return this.data.item[key] !== keyValuePair[key];
        }),
        takeUntil(unsubscribe$)
      )
      .subscribe(updatedField => {
        this.updatedFields = { ...this.updatedFields, ...updatedField };
        if (!this.updatedFields.hasOwnProperty('ID')) {
          this.updatedFields = {
            ...this.updatedFields,
            ID: this.data.item['ID']
          };
        }
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
        if (Object.keys(this.updatedFields).length === 1) {
          delete this.updatedFields['ID'];
        }
        console.log(this.updatedFields);
      });

    // register observables to listen for photo form control changes
    this.fc_arraybuffer = this.fg_photo.get('ArrayBuffer').valueChanges;
    this.fc_filename = this.fg_photo.get('Filename').valueChanges;

    this.fg_photo_changes$ = merge(
      this.fc_arraybuffer.pipe(map(ArrayBuffer => ({ ArrayBuffer }))),
      this.fc_filename.pipe(map(Filename => ({ Filename })))
    );

    this.$acceptOnlyNewPhotoValues = this.fg_photo_changes$
      .pipe(
        filter((keyValuePair: Object) => {
          const key = Object.keys(keyValuePair).toString();
          return this.initialPhoto[key] !== keyValuePair[key];
        }),
        takeUntil(unsubscribe$)
      )
      .subscribe(updated => {
        this.updatedPhoto = { ...this.updatedPhoto, ...updated };
        if (!this.updatedPhoto.hasOwnProperty('ID')) {
          this.updatedPhoto = {
            ...this.updatedPhoto,
            ID: this.data.item['ID']
          };
        }
        if (!this.updatedPhoto.hasOwnProperty('Filename')) {
          this.updatedPhoto = {
            ...this.updatedPhoto,
            Filename: this.fg_photo.get('Filename').value
          };
        }
        console.log(this.updatedPhoto);
      });

    this.$acceptOnlyInitialPhotoValues = this.fg_photo_changes$
      .pipe(
        filter((keyValuePair: Object) => {
          const key = Object.keys(keyValuePair).toString();
          return this.initialPhoto[key] === keyValuePair[key];
        }),
        takeUntil(unsubscribe$)
      )
      .subscribe(initial => {
        const key = Object.keys(initial).toString();
        // if arraybuffer value is same as initial
        // then delete all properties in updatedPhoto object
        if (key === 'ArrayBuffer') {
          delete this.updatedPhoto[key];
          delete this.updatedPhoto['ID'];
          delete this.updatedPhoto['Filename'];
        }
        // if new Filename value is same as initial
        // need to check if arraybuffer is there
        // if ArrayBuffer is present it means that new photo is present
        // then updatedPhoto object shall receive this Filename value anyway
        if (
          key === 'Filename' &&
          this.updatedPhoto.hasOwnProperty('ArrayBuffer')
        ) {
          this.updatedPhoto = {
            ...this.updatedPhoto,
            Filename: this.fg_photo.get('Filename').value
          };
        }
        console.log(this.updatedPhoto);
      });
  }

  initFgPhoto() {
    this.updatedPhoto = {};
    this.fg_photo = this.fb.group({
      Filename: '',
      ArrayBuffer: new ArrayBuffer(0),
      PhotoUrl: ''
    });
  }

  openPhotoPicker() {
    let dataForPhotoDialogBox;
    if (this.hasUpdatedPhoto) {
      console.log(this.updatedPhoto);
      dataForPhotoDialogBox = {
        hasPhoto: true,
        photoUrl: this.fg_photo.get('PhotoUrl').value
      };
    } else {
      dataForPhotoDialogBox = this.formPhotoService.getDataForPhotoDialogBox(
        this.data.item
      );
    }

    // you can't open photo picker when mode is view
    const dialogRef = this.photoDialog.open(PeopleFormPhotoPickerComponent, {
      data: {
        ...dataForPhotoDialogBox
        // arrayBuffer: this.photoForm.get('ArrayBuffer').value
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        map((data: UserPhotoState) => {
          if (data) {
            return {
              ArrayBuffer: data.new.PhotoArrayBuffer,
              PhotoUrl: data.new.PhotoAfterCrop
            };
          } else {
            return false;
          }
        })
      )
      .subscribe((outcome: any) => {
        if (outcome) {
          this.onReceiveNewPhoto(outcome);
        } else {
          console.log('no photo');
          console.log(this.fg_photo);
        }
      });
  }

  onReceiveNewPhoto(data: { ArrayBuffer: ArrayBuffer; PhotoUrl: string }) {
    this.fg_photo.get('ArrayBuffer').setValue(data.ArrayBuffer);
    this.fg_photo.get('PhotoUrl').setValue(data.PhotoUrl);
    this.updatePhotoFilename();
    console.log(this.fg_photo);
  }

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

  updatePhotoFilename(): void {
    const alias: string = this.form.get('Alias').value;
    this.fg_photo.get('Filename').setValue(alias ? `${alias}.jpg` : '');
  }

  // ACTION BUTTONS

  onLogForm() {
    console.log(this.form);
    console.log(this.form.getRawValue());
    // console.log(this.photoForm);
    // console.log(this.photo);
  }

  // BUTTON in ACTIONS
  // SAVE to ADD user item in 'NgPeople' Sharepoint List
  // ************************************************

  onSave() {
    // spinner icon activates inside save button
    this.onSaveActive = true;
    // observables that gets success or error object
    const create$ = this.peopleService.createNewUser(this.form.getRawValue());
    // subscription for success or error, if error then unsubscribe
    // because user clicks onSave() again to retry (memory leak defense)
    const handler$ = create$.subscribe(
      success => this.onSaveSuccess(success),
      error => {
        this.onSaveError(error);
        handler$.unsubscribe();
      },
      () => console.log('on save complete')
    );
  }

  onSaveSuccess(success) {
    console.log('on save success');
    console.log(success);
    // after successfully saving item, we get it back
    // update current item, then change mode to view
    // and re-init form with new item & mode
    this.onSaveActive = false;
    this.data.item = { ...this.data.item, ...success };
    this.data.mode = 'view';
    this.initForm(this.formValueService.itemValue(this.data));
  }

  onSaveError(error) {
    console.log('on save error');
    console.log(error);
    // errors are caught in subscribe(), then dialog box opens
    // also disable spinner, because saving sequence didn't succeed
    this.store.dispatch(new a_in_errors.DisplayError(error));
    this.onSaveActive = false;
  }

  // BUTTON in ACTIONS
  // SAVE CHANGES to UPDATE user item in 'NgPeople' Sharepoint List
  // ************************************************

  onSaveChanges() {
    console.log(this.updatedFields);
    this.onSaveChangesActive = true;
    return this.peopleService
      .updatePeopleItem(this.updatedFields)
      .subscribe(
        success => this.onSaveChangesSuccess(success),
        error => this.onSaveChangesError(error)
      );
  }

  onSaveChangesFields() {}

  onSaveChangesPhoto() {}

  onSaveChangesFieldsPhoto() {}

  onSaveChangesSuccess(success) {
    // when success object return, close form dialog
    console.log(success);
    this.onSaveChangesActive = false;
    this.data.item = { ...this.data.item, ...success };
    this.data.mode = 'view';
    this.initForm(this.formValueService.itemValue(this.data));
  }

  onSaveChangesError(error) {
    console.log(error);
  }

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
      this.initFgPhoto();
    }
    if (this.mode.isNew) {
      this.dialogRef.close();
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

  get userPhoto() {
    if (this.updatedPhoto.hasOwnProperty('ArrayBuffer')) {
      return this.fg_photo.get('PhotoUrl').value;
    } else {
      if (this.data.item.Attachments) {
        // this.noUserPhoto = false;
        return (
          `${PathSlbSp}` +
          this.data.item.AttachmentFiles.results[0].ServerRelativeUrl
        );
      } else {
        // this.noUserPhoto = true;
        return `${PathOptimus}` + '/assets/no_user_photo.jpg';
      }
    }
  }

  // used to enable/disable save changes button
  get hasUpdatedFields() {
    return Object.keys(this.updatedFields).length === 0 &&
      this.updatedFields.constructor === Object
      ? false
      : true;
  }

  // used to enable/disable save changes button
  get hasUpdatedPhoto() {
    return Object.keys(this.updatedPhoto).length === 0 &&
      this.updatedPhoto.constructor === Object
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
