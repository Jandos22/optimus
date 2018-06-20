import { UserPhotoState } from './../../../../../registration/components/new-user-form-photo/new-user-form-photo.component';
import { take, map } from 'rxjs/operators';
import { PeopleFormPhotoPickerComponent } from './../../../people-form-photo-picker/people-form-photo-picker.component';
import { MatDialog } from '@angular/material';
import { FormMode } from './../../../../../../shared/interface/form.model';
import { ApiPath, PathOptimus } from '../../../../../../shared/constants/index';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-photo',
  styleUrls: ['people-form-photo.component.css'],
  template: `
    <div fxFlex fxLayout="row wrap" fxLayoutAlign="center">
      <img [src]="photo.PhotoUrl" class="userPhoto" [ngClass]="getPhotoClass()" (click)="openPhotoPicker()">
    </div>
    `
})
export class PeopleFormPhotoComponent implements OnInit {
  @Input() photo: { Filename: string; PhotoUrl: string };
  @Input() mode: FormMode;

  @Output() onPhotoPicker = new EventEmitter<any>();

  constructor(public photoDialog: MatDialog) {}

  ngOnInit() {}

  openPhotoPicker() {
    let datafordialog;

    if (this.mode === 'new' || this.mode === 'edit') {
      if (this.photo.Filename !== 'nophoto') {
        datafordialog = {
          hasPhoto: true,
          photoUrl: this.photo.PhotoUrl
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
    }

    // dialogRef
    //   .afterClosed()
    //   .pipe(
    //     take(1),
    //     map((data: UserPhotoState) => {
    //       if (data) {
    //         return {
    //           ArrayBuffer: data.new.PhotoArrayBuffer,
    //           PhotoUrl: data.new.PhotoAfterCrop
    //         };
    //       } else {
    //         return false;
    //       }
    //     })
    //   )
    //   .subscribe((outcome: any) => {
    //     if (outcome) {
    //       // this.onReceiveNewPhoto(outcome);
    //     } else {
    //       console.log('no photo');
    //       console.log(this.fg_photo);
    //     }
    //   });
  }

  getPhotoClass() {
    return this.mode === 'new' || this.mode === 'edit' ? 'modeNewOrEdit' : '';
  }
}
