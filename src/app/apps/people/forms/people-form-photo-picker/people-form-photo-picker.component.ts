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

export interface UserPhotoInitial {
  hasPhoto: boolean;
  photoUrl: string;
}

export interface UserPhotoNew {
  PhotoBeforeCrop: any;
  PhotoAfterCrop: any;
  // PhotoFilename: string;
  PhotoArrayBuffer: ArrayBuffer;
}

export interface UserPhotoPicker {
  showInitial: boolean;
  showNew: boolean;
  showNoPhoto: boolean;
  showCropper: boolean;
  selected: boolean;
  cropped: boolean;
}

export interface UserPhotoState {
  initial: UserPhotoInitial;
  new: UserPhotoNew;
  picker: UserPhotoPicker;
}

// services
import { PeopleFormPhotoService } from '../people-form/form-services/people-form-photo.service';

@Component({
  selector: 'app-people-form-photo-picker',
  styleUrls: ['people-form-photo-picker.component.css'],
  providers: [PeopleFormPhotoService],
  template: `
    <h3 mat-dialog-title>User Photo</h3>
    <mat-dialog-content>
      <div fxFlex="180px" style="padding-bottom: 16px;">

        <!-- when user does not have photo -->
        <img *ngIf="state.picker.showNoPhoto"
          [src]="photoService.getNoPhotoUrl()">

        <!-- when user has photo and didn't select any new photo -->
        <img *ngIf="state.picker.showInitial"
          [src]="state.initial.photoUrl">

        <!-- when user selected & cropped photo -->
        <img *ngIf="state.picker.cropped"
          [src]="data.image" class="userPhoto">

        <!-- Image Cropper -->
        <img-cropper [hidden]="!state.picker.showCropper" #cropper
          [image]="data" [settings]="cropperSettings" (onCrop)="onCrop(data)">
        </img-cropper>

      </div>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row" fxLayoutAlign="start start" class="actions">

      <!-- when user didn't select photo yet-->
      <label for="photo" *ngIf="!state.picker.selected" >
        <div class="fileBrowseButton" fxLayout="row" fxLayoutAlign="center center">
          <span class="mat-button-wrapper">BROWSE</span>
        </div>
      </label>
      <input id="photo" type="file" style="display: none;" (change)="fileChangeListener($event)" />

      <!-- when user selected photo file and ready to crop it -->
      <button *ngIf="state.picker.selected && !state.picker.cropped"
        mat-raised-button color="primary" (click)="doCrop()">
        CROP
      </button>

      <!-- when user selected photo and cropped it -->
      <button *ngIf="state.picker.selected && state.picker.cropped"
        mat-raised-button color="primary" (click)="onAcceptCropped()">
        ACCEPT
      </button>

      <!-- when user selected photo and cropped it -->
      <button *ngIf="state.picker.selected && state.picker.cropped"
        mat-raised-button (click)="onBackToCrop()">
        BACK
      </button>

      <!-- when user wants to discard any changes and close dialog box -->
      <button *ngIf="(state.picker.selected && !state.picker.cropped)"
        mat-button (click)="onCancelSelected()">
        CANCEL
      </button>
    </mat-dialog-actions>
  `
})
export class PeopleFormPhotoPickerComponent {
  cropperSettings: CropperSettings;

  // used by img-cropper component
  data: any;

  // file object that accomodate uploaded photo
  file: File;

  // photo state object to deal with different stages
  state: UserPhotoState;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(
    public dialogRef: MatDialogRef<PeopleFormPhotoPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public incoming: UserPhotoInitial,
    private photoService: PeopleFormPhotoService
  ) {
    this.initCropperSettings();
    this.onDialogOpen();
  }

  onDialogOpen() {
    // initialize PhotoState
    console.log(this.incoming);
    this.resetPhotoState(this.incoming);
    this.data.image = this.state.initial.photoUrl;
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
    this.cropperSettings.cropperDrawSettings.strokeColor = '#2196f3';

    // start with blank data object
    // data has image property, which initialy can be url
    this.data = {};
  }

  resetPhotoState(incoming: UserPhotoInitial) {
    this.state = {
      initial: { ...incoming },
      new: {
        PhotoBeforeCrop: '',
        PhotoAfterCrop: '',
        // PhotoFilename: '',
        PhotoArrayBuffer: new ArrayBuffer(0)
      },
      picker: {
        showInitial: incoming.hasPhoto,
        showNew: false,
        showNoPhoto: !incoming.hasPhoto,
        showCropper: false,
        selected: false,
        cropped: false
      }
    };
  }

  fileChangeListener($event) {
    // runs when user clicks browse and selects photo
    console.log($event);

    // reset cropped to false, when photo selected
    this.state.picker = {
      ...this.state.picker,
      cropped: false,
      showInitial: false,
      showNoPhoto: false,
      selected: true,
      showCropper: true
    };

    const image: any = new Image();
    const file: File = $event.target.files[0];

    const myReader: FileReader = new FileReader();
    const that = this;

    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      console.log(image);
      that.state.new.PhotoBeforeCrop = image.src;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  doCrop() {
    this.state.new.PhotoAfterCrop = this.data.image;
    this.state.picker = {
      ...this.state.picker,
      cropped: true,
      showInitial: false,
      showNew: true,
      showCropper: false
    };
    // console.log(this.state);
  }

  onCrop(file) {
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function(loadEvent: any) {
      that.state.new.PhotoArrayBuffer = loadEvent.target.result;
    };
    const blob = this.dataURItoBlob(file.image);
    // this.state.new.PhotoDataUrl = file.image;
    myReader.readAsArrayBuffer(blob);
  }

  onAcceptCropped() {
    // accept cropped photo & close form
    // send new photo to the people form
    console.log(this.state);
    this.dialogRef.close(this.state.new);
  }

  onBackToCrop() {
    // go back if user wants to re-crop photo
    this.state.new.PhotoAfterCrop = '';

    // don't reset array buffer,
    // because if user don't recrop it will stay 0
    // this.state.new.PhotoArrayBuffer = new ArrayBuffer(0);

    this.state.picker = {
      ...this.state.picker,
      cropped: false,
      showNew: false,
      showCropper: true
    };
    console.log(this.state);
  }

  onCancelSelected() {
    console.log(this.state);
    this.dialogRef.close();
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
