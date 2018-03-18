import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-people-form-photo',
  styleUrls: ['people-form-photo.component.css'],
  template: `
    <div fxFlex fxLayout="row wrap" fxLayoutAlign="center" [formGroup]="parent">
      <img [src]="parent.get('Photo.Url').value" class="userPhoto">
    </div>
    `
})
export class PeopleFormPhotoComponent implements OnInit {
  @Input() parent: FormGroup;
  constructor() {}

  ngOnInit() {
    this.parent.controls;
  }
}
