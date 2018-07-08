import { debounceTime, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  HostListener,
  ElementRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ImageCropperComponent, CropperSettings } from 'ngx-img-cropper';

export interface InitialImage {
  hasImage: boolean;
  imageUrl: string;
}

export interface NewImage {
  ImageBeforeCrop: any;
  ImageAfterCrop: any;
  ImageArrayBuffer: ArrayBuffer;
}

export interface ImagePicker {
  showInitial: boolean;
  showNew: boolean;
  showNoImage: boolean;
  showCropper: boolean;
  selected: boolean;
  cropped: boolean;
}

export interface ImageState {
  initial: InitialImage;
  new: NewImage;
  picker: ImagePicker;
}

// services
import { FormControlImagePickerService } from './../../services/form-control-image-picker.service';

@Component({
  selector: 'app-form-control-image-picker',
  styleUrls: ['form-control-image-picker.component.scss'],
  template: `
  <mdc-card [outlined]="true" id="refWidth">

    <mdc-card-media class="common-form-media-container">

      <!-- if component doesn't have old or new image -->
      <div *ngIf="state.picker.showNoImage" class="no-image" fxLayout="column" fxLayoutAlign="center center">
          <span class='fa_regular'><fa-icon [icon]="['far', 'image']"></fa-icon></span>
      </div>

      <!-- when component has image and didn't select any new iamge -->
      <img *ngIf="state.picker.showInitial" class="imageFullSize"
        [src]="state.initial.imageUrl">

      <!-- when user selected image and didn't yet cropped it -->
      <img-cropper [hidden]="!state.picker.showCropper" #cropper
        [image]="data" [settings]="cropperSettings" (onCrop)="onResizeCrop(data)">
      </img-cropper>

      <!-- when user cropped image -->
      <img *ngIf="state.picker.cropped" class="imageFullSize"
        [src]="data.image">

    </mdc-card-media>

    <mdc-card-actions fxLayout="row" fxLayoutAlign="space-between center" class="actions">

      <!-- <button mat-button (click)="log()">LOG</button> -->

      <button *ngIf="state.picker.selected && state.picker.cropped"
        mat-button (click)="back()">
        BACK TO CROP
      </button>

      <span *ngIf="!state.picker.selected"></span>

      <label for="photoInput" *ngIf="!state.picker.selected">
        <mdc-ripple class="common-file-browse-button"
          [mdc-elevation]="0" [attachTo]="ripple"
          fxLayout="row" fxLayoutAlign="center center">
          <div #rippleSpan>BROWSE</div>
        </mdc-ripple>
      </label>
      <input id="photoInput" type="file" style="display: none;" (change)="fileChangeListener($event)">

      <div class='common-button' *ngIf="state.picker.selected && state.picker.cropped">
        <button mat-icon-button matTooltip='Remove Image' (click)="cancel()">
          <span class='fa_regular'><fa-icon [icon]="['far', 'trash-alt']"></fa-icon></span>
        </button>
      </div>

      <button *ngIf="state.picker.selected && !state.picker.cropped"
        mat-button color='primary' (click)="crop()">
        CROP
      </button>

      <button *ngIf="state.picker.selected && !state.picker.cropped"
        mat-button (click)="cancel()">
        CANCEL
      </button>

    </mdc-card-actions>
  </mdc-card>
  `
})
export class FormControlImagePickerComponent implements OnInit {
  @Input() fg_fields: FormGroup;
  @Input() fg_image: FormGroup;

  // send array buffer as 0 or as new image
  @Output() imageChanged = new EventEmitter<ArrayBuffer>();

  // property for cropper settings
  cropperSettings: CropperSettings;

  // used by ImgCropperComponent
  data: any;

  // file object that accomodate uploaded iamge
  file: File;

  // photo state object to deal with different stages
  state: ImageState;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  constructor(private srv: FormControlImagePickerService) {
    this.initCropperSettings();
  }

  ngOnInit() {
    this.initState();
  }

  initCropperSettings() {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.cropperClass = 'common-image-cropper';
    this.cropperSettings.width = 178;
    this.cropperSettings.height = 100.125;
    this.cropperSettings.croppedWidth = 374;
    this.cropperSettings.croppedHeight = 210.375;
    // this.cropperSettings.canvasWidth = 178;
    // this.cropperSettings.canvasHeight = 100.125;
    this.cropperSettings.dynamicSizing = true;
    this.cropperSettings.fileType = 'image/jpeg';
    this.cropperSettings.cropOnResize = true;
    this.cropperSettings.cropperDrawSettings.strokeColor = '#2196f3';

    // start with blank data object
    // data has image property, which initialy can be url
    this.data = {};
  }

  initState() {
    const hasImage = this.fg_image.get('ImageUrl').value ? true : false;

    this.state = {
      initial: {
        hasImage: hasImage,
        imageUrl: this.fg_image.get('ImageUrl').value
      },
      new: {
        ImageBeforeCrop: '',
        ImageAfterCrop: '',
        ImageArrayBuffer: new ArrayBuffer(0)
      },
      picker: {
        showInitial: hasImage,
        showNew: false,
        showNoImage: !hasImage,
        showCropper: false,
        selected: false,
        cropped: false
      }
    };

    console.log('image picker state initialized:');
    console.log(this.state);
  }

  fileChangeListener($event) {
    // runs when user clicks browse and selects photo
    console.log('new file was selected:');
    console.log($event);

    // reset cropped to false, when photo selected
    this.state.picker = {
      ...this.state.picker,
      cropped: false,
      showInitial: false,
      showNoImage: false,
      selected: true,
      showCropper: true
    };

    console.log(this.state.picker);

    const image: any = new Image();
    const file: File = $event.target.files[0];

    const myReader: FileReader = new FileReader();
    const that = this;

    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      console.log('image successfully read as data url:');
      console.log(image);
      that.state.new.ImageBeforeCrop = image.src;
      console.log(that.state.new);
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

  onResizeCrop(file) {
    const myReader: FileReader = new FileReader();
    const that = this;

    console.log('crop boundaries changed:');
    console.log(file);

    myReader.onloadend = function(loadEvent: any) {
      that.state.new.ImageArrayBuffer = loadEvent.target.result;
      console.log('array buffer was updated:');
      console.log(that.state.new);
    };
    const blob = this.dataURItoBlob(file.image);
    myReader.readAsArrayBuffer(blob);
  }

  log() {
    console.log(this.state);
  }

  crop() {
    // update state
    this.state.new.ImageAfterCrop = this.data.image;

    this.state.picker = {
      ...this.state.picker,
      cropped: true,
      showInitial: false,
      showNew: true,
      showCropper: false
    };

    // send new array buffer up
    this.imageChanged.emit(this.state.new.ImageArrayBuffer);

    console.log('CROP button pressed:');
    console.log(this.state);
  }

  // go back and crop same image again
  // don't reset array buffer,
  // because if user don't recrop it will stay 0
  back() {
    // update state
    this.state.new.ImageAfterCrop = '';
    this.state.picker = {
      ...this.state.picker,
      cropped: false,
      showNew: false,
      showCropper: true
    };

    console.log('BACK button clickeed:');
    console.log(this.state);
  }

  cancel() {
    // update state to initial
    this.initState();
    // send array buffer as 0
    this.imageChanged.emit(new ArrayBuffer(0));

    console.log('CANCEL button clicked:');
    console.log(this.state);
  }

  // Transform dataUrl to Blob
  dataURItoBlob(dataURI) {
    console.log(dataURI);
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
