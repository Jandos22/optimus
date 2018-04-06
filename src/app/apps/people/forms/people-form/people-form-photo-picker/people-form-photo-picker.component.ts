import { Component, Inject, ViewChild } from '@angular/core';

import {
  ImageCropperComponent,
  CropperSettings,
  Bounds
} from 'ngx-img-cropper';

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
  selector: 'app-people-form-photo-picker',
  styleUrls: ['people-form-photo-picker.component.css'],
  template: `
    <h3 mat-dialog-title>User Photo</h3>
    <mat-dialog-content>
      <div fxFlex="180px" style="padding-bottom: 16px;">
        <!-- Ready Photo -->
        <img [src]="data.image" class="userPhoto" *ngIf="photoState.photoCropped">
        <!-- Image Cropper -->
        <img-cropper [hidden]="photoState.photoCropped" #cropper
        [image]="data" [settings]="cropperSettings" (onCrop)="onCrop(data)">
        </img-cropper>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row" fxLayoutAlign="start start" class="actions">

      <label for="photo" *ngIf="!photoState.photoSelected" >
        <div class="fileBrowseButton" fxLayout="row" fxLayoutAlign="center center">
          <span class="mat-button-wrapper">BROWSE</span>
        </div>
      </label>
      <input id="photo" type="file" style="display: none;" (change)="fileChangeListener($event)" />

      <button mat-raised-button color="primary" (click)="doCrop()" *ngIf="photoState.photoSelected && !photoState.photoCropped">
          CROP
      </button>
      <button mat-raised-button color="primary" (click)="onOk()" *ngIf="photoState.photoSelected && photoState.photoCropped">
          OK
      </button>
      <button mat-button (click)="onCancel()" *ngIf="photoState.photoSelected || photoState.photoExists">
          CANCEL
      </button>
    </mat-dialog-actions>
  `
})
export class PeopleFormPhotoPickerComponent {
  cropperSettings: CropperSettings;
  data: any;
  file: File;
  photoState: UserPhotoState;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(
    public dialogRef: MatDialogRef<PeopleFormPhotoPickerComponent>,
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
    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgb(103, 58, 183)';
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

  resetPhotoState() {
    this.photoState = {
      photoExists: false,
      photoSelected: false,
      photoCropped: false,
      photo: '',
      arrayBuffer: new ArrayBuffer(0)
    };
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
}
