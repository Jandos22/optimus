import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// rxjs
import { Observable, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { PeopleFormPhotoPickerComponent } from './../../../people-form-photo-picker/people-form-photo-picker.component';
import { MatDialog } from '@angular/material';
import { FormMode } from './../../../../../../shared/interface/form.model';

// constants
import { ApiPath, PathOptimus } from '../../../../../../shared/constants/index';

// interfaces
import { UserPhotoState } from './../../../../../registration/components/new-user-form-photo/new-user-form-photo.component';

@Component({
  selector: 'app-people-form-photo',
  styleUrls: ['people-form-photo.component.css'],
  template: `
    <div fxFlex fxLayout="row wrap" fxLayoutAlign="center">
      <!-- show when user doesn't have unsaved photo -->
      <img [src]="fg_photo.get('PhotoUrl').value" class="userPhoto" [ngClass]="getPhotoClass()" (click)="openPhotoPicker()">
      <!-- show when user has unsaved photo
      <img *ngIf="hasUnsavedPhoto"
        [src]="fg_photo.get('PhotoUrl').value" class="userPhoto" [ngClass]="getPhotoClass()" (click)="openPhotoPicker()"> -->
    </div>
    `
})
export class PeopleFormPhotoComponent implements OnInit, OnDestroy {
  @Input() fg_photo: FormGroup;
  @Input() mode: FormMode;

  @Output() photoChanged = new EventEmitter<any>();

  $arrayBuffer: Subscription; // unsubscribed in onDestroy
  photoUrl: Observable<string>;

  hasUnsavedPhoto = false;

  constructor(public photoDialog: MatDialog) {}

  ngOnInit() {
    this.photoUrl = this.fg_photo.get('PhotoUrl').valueChanges;

    this.$arrayBuffer = this.fg_photo
      .get('ArrayBuffer')
      .valueChanges.subscribe(arrayBuffer =>
        this.onArrayBufferChange(arrayBuffer)
      );
  }

  onArrayBufferChange(arrayBuffer: ArrayBuffer) {
    if (arrayBuffer.byteLength) {
      this.hasUnsavedPhoto = true;
    } else {
      this.hasUnsavedPhoto = false;
    }
  }

  openPhotoPicker() {
    let datafordialog;

    if (this.mode === 'new' || this.mode === 'edit') {
      if (this.fg_photo.get('Filename').value !== 'nophoto') {
        datafordialog = {
          hasPhoto: true,
          photoUrl: this.fg_photo.get('PhotoUrl').value
        };
      } else {
        datafordialog = {
          hasPhoto: false,
          photoUrl: ''
        };
      }

      // you can't open photo picker when mode is view
      const dialogRef = this.photoDialog.open(PeopleFormPhotoPickerComponent, {
        data: {
          ...datafordialog
        }
      });

      dialogRef
        .afterClosed()
        .pipe(
          take(1),
          map((data: any) => {
            console.log(data);
            if (data) {
              return {
                ArrayBuffer: data.PhotoArrayBuffer,
                PhotoUrl: data.PhotoAfterCrop
              };
            } else {
              return false;
            }
          })
        )
        .subscribe((outcome: any) => {
          if (outcome) {
            this.onPhotoChange(outcome);
          } else {
            console.log('no photo');
            // console.log(this.fg_photo);
          }
        })
        .add(_ => console.log('completed'));
    }
  }

  onPhotoChange(newPhoto) {
    console.log(newPhoto);
    this.photoChanged.emit(newPhoto);
  }

  getPhotoClass() {
    return this.mode === 'new' || this.mode === 'edit' ? 'modeNewOrEdit' : '';
  }

  ngOnDestroy() {
    this.$arrayBuffer.unsubscribe();
  }
}
