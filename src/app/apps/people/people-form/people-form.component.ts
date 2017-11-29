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
      gin: ['', Validators.required],
      email: ['', Validators.required],
      location: ['', Validators.required],
      photo: this.fb.group({
        arraybuffer: ['', Validators.required],
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
    const imageUrl = file.image.replace(/^data:image\/(png|jpg);base64,/, '');
    const imageBuffer = lib64.decode(imageUrl);
    this.userForm.get('photo').get('arraybuffer').setValue(imageBuffer);
    console.log(this.userForm.value);
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

  onSave(userData) {
    this.store.dispatch(new people.SaveNewUser(userData));
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
