import { ApiPath, PathOptimus } from './../../../../../shared/constants/index';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-photo',
  styleUrls: ['people-form-photo.component.css'],
  template: `
    <div fxFlex fxLayout="row wrap" fxLayoutAlign="center">
      <img [src]="getPhoto" class="userPhoto" [ngClass]="getPhotoClass()" (click)="openPhotoPicker()">
    </div>
    `
})
export class PeopleFormPhotoComponent implements OnInit {
  @Input() photo: string;
  @Input() mode;

  @Output() onPhotoPicker = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  openPhotoPicker() {
    if (!this.mode.isView) {
      this.onPhotoPicker.emit();
    }
  }

  getPhotoClass() {
    return this.mode.isNew || this.mode.isEdit ? 'modeNewOrEdit' : '';
  }

  get getPhoto() {
    return this.photo ? this.photo : this.getNoPhotoUrl();
  }

  getNoPhotoUrl() {
    const noPhoto = '/assets/no_user_photo.jpg';
    return ApiPath.startsWith('_') ? noPhoto : `${PathOptimus}${noPhoto}`;
  }
}
