import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Router } from '@angular/router';

// rxjs
import { of } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';

// material
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// interfaces
import { LocationEnt } from '../../../../shared/interface/locations.model';

// constants
import { WirelinePath } from '../../../../shared/constants';

// entry components
import { NewUserFormPhotoComponent } from '..';

// services
import { ValidationService } from '../../../../validators/validation.service';
import { AsyncValidationService } from '../../../../validators/async-validation.service';
import { NewUserFormHttpService } from './services/new-user-form-http.service';
import { UserService } from '../../../../shared/services/user.service';

export interface Photo {
  photoExists: boolean;
  photoSelected: boolean;
  photoCropped: boolean;
  photo: string;
  arrayBuffer: ArrayBuffer;
}

@Component({
  selector: 'app-new-user-form',
  styleUrls: ['new-user-form.component.scss'],
  templateUrl: 'new-user-form.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [NewUserFormHttpService]
})
export class NewUserFormComponent implements OnInit, OnChanges {
  // take alias from parent component
  // and prepopulate Alias form field
  @Input() alias: string;
  @Input() email: string;
  @Input() locations: LocationEnt[];

  fg_fields: FormGroup;
  fg_photo: FormGroup;

  photoShow: string;

  // disabled: boolean;

  // buttons state
  saving = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private asyncValidators: AsyncValidationService,
    private router: Router
  ) {
    this.initFormFields();
    this.initFormPhoto();
  }

  ngOnInit() {}

  initFormFields() {
    // form initialization
    // alias and email must be disabled for self-registration
    this.fg_fields = this.fb.group({
      Name: ['', Validators.required],
      Surname: ['', Validators.required],
      Alias: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      Gin: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ],
        this.uniqueGin.bind(this)
      ],
      LocationAssignedId: ['', Validators.required]
    });
  }

  initFormPhoto() {
    this.fg_photo = this.fb.group({
      ID: [''],
      Filename: ['', Validators.required],
      ArrayBuffer: [new ArrayBuffer(0), Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // when imported values arrive, assign them accordingly
    // this will pre-populate registration form
    if (this.alias && this.email) {
      this.fg_fields.get('Alias').setValue(this.alias);
      this.fg_fields.get('Email').setValue(this.email);
    }
  }

  openPhotoPicker(): void {
    const dialogRef = this.dialog.open(NewUserFormPhotoComponent, {
      data: {
        photo: this.photoShow,
        arrayBuffer: this.fg_photo.get('ArrayBuffer').value
      }
    });

    dialogRef.afterClosed().subscribe((result: Photo) => {
      console.log('PhotoPicker closed, result is below:');
      console.log(result);
      if (result) {
        this.applyChangesAfterPhotoPickerClosed(result);
      }
    });
  }

  applyChangesAfterPhotoPickerClosed(result) {
    this.photoShow = result.photo;
    this.fg_photo.get('ArrayBuffer').setValue(result.arrayBuffer);
    this.fg_photo
      .get('Filename')
      .setValue(this.fg_fields.get('Alias').value + '.jpg');
  }

  setFormPhotoID(ID) {
    console.log('After receiving new user, set this ID = ' + ID);
    this.fg_photo.get('ID').patchValue(ID);
  }

  resetArrayBuffer() {
    this.fg_photo.get('ArrayBuffer').patchValue(new ArrayBuffer(0));
  }

  onReset() {
    this.initFormPhoto();
    this.photoShow = '';
    this.fg_fields.get('Name').reset();
    this.fg_fields.get('Surname').reset();
    this.fg_fields.get('Gin').reset();
    this.fg_fields.get('Location').reset();
  }

  // getters

  get photo() {
    return this.fg_photo.get('ArrayBuffer').value.byteLength !== 0
      ? true
      : false;
  }

  // async validators

  uniqueGin(control: AbstractControl) {
    // set uniqueGin to false, otherwise it will be valid before async check
    // and if http call be long, then user can have time to click save button
    this.fg_fields.controls['Gin'].setErrors({ notUnique: true });

    return of(control.value).pipe(
      take(1),
      switchMap((gin: number) => {
        return this.asyncValidators.checkGinUnique(gin);
      }),
      map((response: boolean) => {
        return response ? null : { notUnique: true };
      })
    );
  }
}
