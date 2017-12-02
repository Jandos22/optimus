import * as sp from './../../../store/sp.actions';
import { UserPhotoState } from './../model/user-photo-state.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromPeople from '../store/people.reducer';
import * as people from '../store/people.actions';

import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material';

import { WindowProperties } from '../../../shared/interfaces/window-properties.model';
import { Observable } from 'rxjs/Observable';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

import * as lib64 from 'base64-arraybuffer';
import { PeopleForm } from '../model/people-form.model';
import { WirelinePath } from '../../../shared/constants';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleFormComponent implements OnInit, OnDestroy {

  window$: Observable<WindowProperties>;

  toResizeForm$$: Subscription;

  userForm: FormGroup;
    alias$$: Subscription;


  cropperSettings: CropperSettings;
  data: any;

  file: File;

  photoState: UserPhotoState;

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  constructor(
    public store: Store<fromPeople.FeatureState>,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
  ) {

    // Observable: watch changes in layout.window
    this.window$ = this.store.select('layout', 'window');

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 180;
    this.cropperSettings.height = 180;
    this.cropperSettings.croppedWidth = 180;
    this.cropperSettings.croppedHeight = 180;
    this.cropperSettings.canvasWidth = 180;
    this.cropperSettings.canvasHeight = 180;
    this.cropperSettings.fileType = 'image/jpeg';
    this.cropperSettings.cropOnResize = true;

    this.photoState = {
      newUser: true,
      photoExists: false,
      photoSelected: false,
      photoCropped: false
    };

    this.data = {};

  }

  ngOnInit() {
    // Subscription: react to the changes
    this.toResizeForm$$ = this.window$.subscribe((window: WindowProperties) => {
      this.resizeForm(window);
    });

    // Initialize User Form
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      alias: [''],
      gin: [''],
      email: ['', [Validators.required, Validators.email]],
      location: [''],
      photoUrl: this.fb.group({
        Url: [''],
        Description: ['']
      }),
      photo: this.fb.group({
        arraybuffer: [''],
        photoname: ['']
      })
    });

    this.alias$$ = this.userForm.get('alias').valueChanges.subscribe((val) => {
      this.userForm.get('email').setValue(val + '@slb.com');
      this.userForm.get('photo').get('photoname').setValue(val + '.jpg');
      this.userForm.get('photoUrl').get('Url').setValue(WirelinePath + 'NgPhotos/' + val + '.jpg');
      this.userForm.get('photoUrl').get('Description').setValue(val);
    });

  }


  resizeForm(window: WindowProperties) {
    console.log(window);
    let width: string;
    if (window.isXS) {
      width = '90%';
    } else {
      width = '636px';
    }
    this.dialogRef.updateSize(width);
  }

  fileChangeListener($event) {

    console.log($event);

    // reset cropped to false, when photo selected
    this.photoState.photoCropped = false;
    this.photoState.photoSelected = true;

    const image: any = new Image();
    const file: File = $event.target.files[0];

    const myReader: FileReader = new FileReader();
    const that = this;

    myReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        console.log(image);
        that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);

  }

  sendFile(file) {
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      that.userForm.get('photo').get('arraybuffer').setValue(loadEvent.target.result);
    };
    myReader.readAsArrayBuffer(file);
  }

  _base64ToArrayBuffer(base64) {
    let binary_string =  window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

  doCrop() {
    this.photoState.photoCropped = true;
  }

  onCrop(file) {
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      that.userForm.get('photo').get('arraybuffer').setValue(loadEvent.target.result);
    };
    const blob = this.dataURItoBlob(file.image);
    myReader.readAsArrayBuffer(blob);
    console.log(this.userForm.value);
  }


  // Transform dataUrl to Blob
  dataURItoBlob (dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], {type: mimeString});
    return blob;
  }

  cancelSelected() {
    // this.data = {};
    this.photoState.photoCropped = false;
    this.photoState.photoSelected = false;

    const photoInput = <HTMLInputElement>document.getElementById('photo');
    photoInput.value = null;

    this.cropper.cropper.reset();

    this.userForm.get('photo').get('arraybuffer').setValue('');
    this.userForm.get('photo').get('photoname').setValue('');

    console.log(this.userForm.get('photo').get('arraybuffer').value);

  }

  onSave(userData: PeopleForm) {

    console.log(userData);

    // Split Data into 2 objects
    const ngPeopleData = {
        Name: userData.name,
        Surname: userData.surname,
        Alias: userData.alias,
        Email: userData.email,
        Gin: userData.gin.toString(),
        Photo: {
          Url: userData.photoUrl.Url,
          Description: userData.photoUrl.Description
        },
        Location: userData.location,
      };
    const image = {
        ArrayBuffer: userData.photo.arraybuffer,
        Filename: userData.photo.photoname
      };

    // Add item in NgPeople list
    this.store.dispatch(new sp.AddItem(ngPeopleData, 'NgPeople'));

    // Add photo in NgPhotos list
    this.store.dispatch(new sp.AddImage(image, 'NgPhotos'));

  }

  closeUserForm() {
    this.dialogRef.close();
  }

  logForm() {
    console.log(this.userForm.value);
  }


  // ERROR MESSAGES
  // For each form control

  getErrorName() {
    const required = this.userForm.controls['name'].hasError('required');
    return this.userForm.controls['name'].touched ?
      (required ? 'Name is required' : '') : '';
  }

  // WHEN COMPONENT DESTROYED
  // Unsubscribe() from Observables

  ngOnDestroy() {
    console.log('form destroyed');
    this.toResizeForm$$.unsubscribe();
    this.alias$$.unsubscribe();
  }

}
