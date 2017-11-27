import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as fromPeople from '../store/people.reducer';

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material';

import { WindowProperties } from '../../../shared/interfaces/window-properties.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class PeopleFormComponent implements OnInit, OnDestroy {

  window$: Observable<WindowProperties>;

  toResizeForm$$: Subscription;

  fieldsContainer: string;
  fieldsContainerAlign: string;

  userForm: FormGroup;

  constructor(
    public store: Store<fromPeople.FeatureState>,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<PeopleFormComponent>
  ) {

    // Observable: watch changes in layout.window
    this.window$ = this.store.select('layout', 'window');

    this.fieldsContainer = 'row';
    this.fieldsContainer = '';
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
      location: ['', Validators.required]
    });

  }


  resizeForm(window: WindowProperties) {
    console.log(window);
    let width: string;
    if (window.isXS) {
      width = '90%';
    } else {
      width = '636px';
    }
    this.fieldsContainer = this.checkLayout(window);
    this.fieldsContainerAlign = this.checkLayoutAlign(window);
    this.dialogRef.updateSize(width);
  }

  checkLayout(window: WindowProperties) {
    console.log('checking layout');
    if (window.isS800 || window.isXS) {
      return 'column';
    } else {
      return 'row';
    }
  }

  checkLayoutAlign(window: WindowProperties) {
    console.log('checking layout');
    if (window.isS800 || window.isXS) {
      return 'space-around';
    } else {
      return '';
    }
  }

  calcFlex(window) {
    console.log(window);
  }

  getErrorName() {
    const required = this.userForm.controls['name'].hasError('required');
    return this.userForm.controls['name'].touched ?
      (required ? 'Name is required' : '') : '';
  }

  logForm() {
    console.log(this.userForm);
    console.log(this.userForm.invalid);
  }

  closeUserForm() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    console.log('form destroyed');
    this.toResizeForm$$.unsubscribe();
  }

}
