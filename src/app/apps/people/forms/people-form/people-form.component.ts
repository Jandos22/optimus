import { Component, Inject } from '@angular/core';

import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';

// material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// services
import { ValidationService } from '../../../../validators/validation.service';
import { PeopleItem } from '../../models/people-item.model';

@Component({
  selector: 'app-people-form',
  styleUrls: ['people-form.component.css'],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'new' ? 'New User' : (form.get('Name').value + ' ' + form.get('Surname').value)}}</h2>
    <mat-dialog-content>Body</mat-dialog-content>
    <mat-dialog-actions>Actions</mat-dialog-actions>
    `
})
export class PeopleFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // initialize form when component instantiated
    this.initForm(data);
  }

  //
  //
  //
  initForm(data) {
    console.log(data);
    let user: PeopleItem;

    // check if mode is 'new' or 'view'
    const isNew = data.mode === 'new' ? true : false;

    // if mode is 'view' then populate user
    if (!isNew) {
      user = data.item;
    }

    this.form = this.fb.group({
      Name: [isNew ? '' : user.Name, Validators.required],
      Surname: [isNew ? '' : user.Surname, Validators.required],
      Alias: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      Gin: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ]
      ],
      Location: ['', Validators.required],
      Photo: this.fb.group({
        Url: [''],
        Description: ['']
      })
    });
  }
}
