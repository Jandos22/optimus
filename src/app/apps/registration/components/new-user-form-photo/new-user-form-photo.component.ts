import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';

import {
  ImageCropperComponent,
  CropperSettings,
  Bounds
} from 'ng2-img-cropper';

import {
  MatDialog,
  MatDialogRef,
  MatDialogTitle,
  MAT_DIALOG_DATA
} from '@angular/material';

export interface UserPhotoState {
  photoExists: boolean;
  photoSelected: boolean;
  photoCropped: boolean;
  photo: string;
  arrayBuffer: ArrayBuffer;
}

@Component({
  selector: 'app-new-user-form-photo',
  styleUrls: ['new-user-form-photo.component.css'],
  templateUrl: 'new-user-form-photo.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class NewUserFormPhotoComponent {
  cropperSettings: CropperSettings;
  data: any;
  file: File;
  photoState: UserPhotoState;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(
    public dialogRef: MatDialogRef<NewUserFormPhotoComponent>,
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    this.initCropperSettings();
    this.onDialogOpen();
  }

  initCropperSettings() {
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
  }

  onDialogOpen() {
    this.resetPhotoState();

    this.data = {};

    console.log(this.input.photo);

    if (this.input.photo) {
      this.photoState = {
        photoExists: true,
        photoSelected: false,
        photoCropped: true,
        photo: this.input.photo,
        arrayBuffer: this.input.arrayBuffer
      };
      this.data.image = this.input.photo;
    }
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

    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      console.log(image);
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  doCrop() {
    this.photoState.photoCropped = true;
    console.log(this.photoState);
  }

  onCrop(file) {
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function(loadEvent: any) {
      that.photoState.arrayBuffer = loadEvent.target.result;
    };
    const blob = this.dataURItoBlob(file.image);
    this.photoState.photo = file.image;
    myReader.readAsArrayBuffer(blob);
  }

  // Transform dataUrl to Blob
  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  onOk() {
    this.dialogRef.close(this.photoState);
  }

  onCancel() {
    if (this.photoState.photoExists) {
      this.dialogRef.close();
    } else {
      this.resetPhotoState();
      this.dialogRef.close(this.photoState);
    }
  }

  resetPhotoState() {
    this.photoState = {
      photoExists: false,
      photoSelected: false,
      photoCropped: false,
      photo: '',
      arrayBuffer: new ArrayBuffer(0)
    };
  }
}
