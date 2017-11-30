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

  cropperSettings: CropperSettings;
  data: any;

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
    this.cropperSettings.width = 150;
    this.cropperSettings.height = 150;
    this.cropperSettings.croppedWidth = 150;
    this.cropperSettings.croppedHeight = 150;
    this.cropperSettings.canvasWidth = 150;
    this.cropperSettings.canvasHeight = 150;
    this.cropperSettings.fileType = 'image/jpeg';

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
      surname: ['', Validators.required],
      alias: ['', Validators.required],
      gin: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      email: ['', Validators.required],
      location: ['', Validators.required],
      photo: this.fb.group({
        arraybuffer: [''],
        photoname: ['']
      })
    });

    // this.forImgArrayBuffer$$ = this.imgArrayBuffer$.subscribe((data: ArrayBuffer) => {
    //   console.log(data);
    // });

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

  getErrorName() {
    const required = this.userForm.controls['name'].hasError('required');
    return this.userForm.controls['name'].touched ?
      (required ? 'Name is required' : '') : '';
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

  doCrop() {
    this.photoState.photoCropped = true;
  }

  onCrop(file) {
    const imageUrl = file.image.replace('data:image/jpeg;base64,/', '');
    const imageBuffer = lib64.decode(imageUrl);
    this.userForm.get('photo').get('arraybuffer').setValue(imageBuffer);

    // console.log(file);

    // const myReader: FileReader = new FileReader();
    // const that = this;

    // myReader.onloadend = function (loadEvent: any) {
    //   console.log(loadEvent);
    //   that.userForm.get('photo').get('arraybuffer').setValue(loadEvent.target.result);
    // };

    // const blob = this.dataURLtoBlob(file.image);

    // console.log(blob);

    // myReader.readAsArrayBuffer(blob);

    // console.log(this.userForm.value);
  }

  dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }

  dataURItoBlob (dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    let byteString = atob(dataURI.split(',')[1]);
  
    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
    // write the bytes of the string to an ArrayBuffer
    let ab = new ArrayBuffer(byteString.length);
  
    // create a view into the buffer
    let ia = new Uint8Array(ab);
  
    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
  
    // write the ArrayBuffer to a blob, and you're done
    let blob = new Blob([ab], {type: mimeString});
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

    // Split Data into 2 objects
    const ngPeopleData = {
        Name: userData.name,
        Surname: userData.surname,
        Alias: userData.alias,
        Email: userData.email,
        Gin: userData.gin.toString(),
        Location: userData.location
      };
    const image = {
        ArrayBuffer: userData.photo.arraybuffer,
        Filename: userData.photo.photoname + 'random.jpg'
      };

    // Add item in NgPeople list
    this.store.dispatch(new sp.AddItem(ngPeopleData, 'NgPeople', image, 'NgPhotos'));

    // Add photo in NgPhotos list

  }

  closeUserForm() {
    this.dialogRef.close();
  }

  logForm() {
    console.log(this.userForm.value);
  }

  ngOnDestroy() {
    console.log('form destroyed');
    this.toResizeForm$$.unsubscribe();
  }

}
