import { UserService } from './../../../../services/user.service';
import { WirelinePath } from './../../../../constants/index';

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
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import 'rxjs/add/operator/take';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ValidationService } from './../../../../validators/validation.service';

import { Locations } from './../../../../models/locations.m';

import { NewUserFormPhotoComponent } from '../index';

export interface Photo {
  photoExists: boolean;
  photoSelected: boolean;
  photoCropped: boolean;
  photo: string;
  arrayBuffer: ArrayBuffer;
}

@Component({
  selector: 'app-new-user-form',
  styleUrls: ['new-user-form.component.css'],
  templateUrl: 'new-user-form.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class NewUserFormComponent implements OnInit, OnChanges {
  // take alias from parent component
  // and prepopulate Alias form field
  @Input() alias: string;
  @Input() email: string;
  @Input() locations: Locations[];

  form: FormGroup;
  photoForm: FormGroup;

  photoShow: string;

  disabled: boolean;

  // buttons state
  saving = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router
  ) {
    this.initForm();
    this.initPhotoForm();
  }

  ngOnInit() {
    this.disabled = true;

    // this.form.get('Gin').valueChanges.subscribe(next => {
    //   console.log(next, this.form.get('Gin').errors);
    // });

    this.form.get('Alias').valueChanges.subscribe(alias => {
      this.form
        .get('Photo.Url')
        .setValue(WirelinePath + '/NgPhotos/' + alias + '.jpg');
      this.form.get('Photo.Description').setValue(alias);
    });
  }

  initForm() {
    // form initialization
    this.form = this.fb.group({
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
        ]
      ],
      Location: ['', Validators.required],
      Photo: this.fb.group({
        Url: [''],
        Description: ['']
      })
    });
  }

  initPhotoForm() {
    this.photoForm = this.fb.group({
      Filename: ['', Validators.required],
      ArrayBuffer: [new ArrayBuffer(0), Validators.required]
    });
    console.log(this.photoForm.get('ArrayBuffer').value.byteLength);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.alias && this.email) {
      this.form.get('Alias').setValue(this.alias);
      this.form.get('Email').setValue(this.email);
      this.form.get('Photo.Description').setValue(this.alias);
      this.form
        .get('Photo.Url')
        .setValue(`${WirelinePath}/NgPhotos/${this.alias}.jpg`);
    }
  }

  openPhotoPicker(): void {
    let dialogRef = this.dialog.open(NewUserFormPhotoComponent, {
      data: {
        photo: this.photoShow,
        arrayBuffer: this.photoForm.get('ArrayBuffer').value
      }
    });

    dialogRef.afterClosed().subscribe((result: Photo) => {
      console.log(result);
      if (result) {
        this.photoShow = result.photo;
        this.photoForm.get('ArrayBuffer').setValue(result.arrayBuffer);
        this.photoForm
          .get('Filename')
          .setValue(this.form.get('Alias').value + '.jpg');
      }
      console.log(this.photoForm.get('ArrayBuffer').value.byteLength);
    });
  }

  onReset() {
    this.initPhotoForm();
    this.photoShow = '';
    this.form.get('Name').reset();
    this.form.get('Surname').reset();
    this.form.get('Gin').reset();
    this.form.get('Location').reset();
  }

  onSave() {
    // set saving to true and show user inactive saving button
    this.saving = true;

    // adding user and photo
    return this.userService
      .addUser(this.form.getRawValue())
      .toPromise()
      .then(data => {
        if (data.d) {
          return this.userService.addPhoto(this.photoForm.value).toPromise();
        }
      })
      .then((res: any) => {
        if (res.d) {
          this.router.navigate(['home']);
        }
      });
  }

  // getters

  get photo() {
    return this.photoForm.get('ArrayBuffer').value.byteLength !== 0
      ? true
      : false;
  }

  // Error Message Functions

  getError_Name() {
    const required = this.form.controls['Name'].hasError('required');

    return this.form.controls['Name'].touched
      ? required ? 'Name is required' : ''
      : '';
  }

  getError_Surname() {
    const required = this.form.controls['Surname'].hasError('required');

    return this.form.controls['Surname'].touched
      ? required ? 'Surname is required' : ''
      : '';
  }

  getError_Gin() {
    const required = this.form.controls['Gin'].hasError('required');
    const min = this.form.controls['Gin'].hasError('minlength');
    const max = this.form.controls['Gin'].hasError('maxlength');
    const onlyNumbers = this.form.controls['Gin'].hasError('onlyNumbers');

    return this.form.controls['Gin'].touched
      ? required
        ? 'GIN number is required'
        : onlyNumbers
          ? 'Only numbers allowed'
          : min || max ? '8 digits required' : ''
      : '';
  }

  getError_Location() {
    const required = this.form.controls['Location'].hasError('required');
    return this.form.controls['Location'].touched
      ? required ? 'Location is required' : ''
      : '';
  }
}
