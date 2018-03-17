import { Component, OnInit, Inject } from '@angular/core';

import {
  FormArray,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs/Subscription';

// ngrx
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../store';

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
export class PeopleFormComponent implements OnInit {
  form: FormGroup;

  window$: Subscription;

  constructor(
    private fb: FormBuilder,
    private fromRoot: Store<fromRoot.RootState>,
    public dialogRef: MatDialogRef<PeopleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // initialize form when component instantiated
    this.initForm(data);
  }

  ngOnInit() {
    // on each breakpoint change, update size of form dialog
    this.window$ = this.fromRoot
      .select(fromRoot.getLayoutWindow)
      .subscribe(window => {
        let width: string;
        let height: string;
        window.isXS ? ((width = '80%'), (height = '80%')) : (width = '600px');
        console.log(width, height);
        this.dialogRef.updateSize(width, height);
      });
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
