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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// services
import { ValidationService } from '../../../../validators/validation.service';
import { PeopleItem } from '../../models/people-item.model';

@Component({
  selector: 'app-people-form',
  styleUrls: ['people-form.component.css'],
  template: `
    <span mat-dialog-title style="text-align: center;">{{ title }}</span>
    <mat-dialog-content>
    
      <!-- Common -->
      <div fxLayout="row wrap" fxLayoutGap="16px" fxLayoutAlign="start stretch">

        <div fxLayout="row wrap" fxFlex.gt-xs="180px">
          <app-people-form-photo fxFlex [parent]="form"></app-people-form-photo>
        </div>
        
        <div fxFlex fxLayout="row wrap" fxLayoutAlign="space-between start">
          <div fxLayout="row wrap" fxLayoutGap.gt-sm="16px">
            <app-people-form-name fxFlex.gt-xs="180px" [parent]="form"></app-people-form-name>
            <app-people-form-surname fxFlex.gt-xs="180px" [parent]="form"></app-people-form-surname>
            <app-people-form-alias fxFlex.gt-xs="180px" [parent]="form"></app-people-form-alias>
            <app-people-form-email fxFlex.gt-xs="180px" [parent]="form"></app-people-form-email>
            <app-people-form-gin fxFlex.gt-xs="180px" [parent]="form"></app-people-form-gin>
            <app-people-form-location fxFlex.gt-xs="180px" [parent]="form"></app-people-form-location>
          </div>
        </div>

      </div>
      
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row wrap" fxLayoutAlign="end" class="headerfooter">
      <button mat-button tabindex="-1">EDIT</button>
      <button mat-button tabindex="-1" (click)="onClose()">CLOSE</button>
    </mat-dialog-actions>
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
        // let height: string;
        window.isXS
          ? (width = '80%')
          : window.isS
            ? (width = '440px')
            : window.isM ? (width = '652px') : (width = '832px');

        console.log(width);
        this.dialogRef.updateSize(width);
      });
  }

  // ACTION BUTTONS

  onClose() {
    this.dialogRef.close();
  }

  //
  //
  //
  initForm(data) {
    console.log(data);
    let user: PeopleItem;

    // check if mode is 'new' or 'view'
    const isNew = data.mode === 'new' ? true : false;
    const isView = data.mode === 'view' ? true : false;

    // if mode is 'view' then populate user
    if (!isNew) {
      user = data.item;
    }

    this.form = this.fb.group({
      Name: [this.nameInput, Validators.required],
      Surname: [this.surnameInput, Validators.required],
      Alias: [this.aliasInput, Validators.required],
      Email: [this.emailInput, Validators.required],
      Gin: [
        this.ginInput,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          ValidationService.onlyNumbers
        ]
      ],
      Location: [this.locationInput, Validators.required],
      Photo: this.fb.group({
        Url: [isNew ? '' : user.Photo.Url],
        Description: [isNew ? '' : user.Photo.Description]
      })
    });
  }

  get title() {
    return this.mode.isNew
      ? 'New User'
      : this.user.Name + ' ' + this.user.Surname;
  }

  get mode() {
    const isNew = this.data.mode === 'new' ? true : false;
    const isView = this.data.mode === 'view' ? true : false;
    const isEdit = this.data.mode === 'edit' ? true : false;
    return { isNew, isView, isEdit };
  }

  get user(): PeopleItem {
    return !this.mode.isNew ? this.data.item : '';
  }

  get nameInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Name, disabled: true }
        : this.user.Name;
  }
  get surnameInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Surname, disabled: true }
        : this.user.Surname;
  }
  get aliasInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Alias, disabled: true }
        : this.user.Alias;
  }
  get emailInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Email, disabled: true }
        : this.user.Email;
  }
  get ginInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Gin, disabled: true }
        : this.user.Gin;
  }
  get locationInput() {
    return this.mode.isNew
      ? ''
      : this.mode.isView
        ? { value: this.user.Location, disabled: true }
        : this.user.Location;
  }
}
