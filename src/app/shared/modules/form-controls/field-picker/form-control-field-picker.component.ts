import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take, switchMap, startWith, debounceTime, tap } from 'rxjs/operators';

import * as _ from 'lodash';

// services
import { FieldsLookupService } from '../../../services';

// material
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
  MatDialog
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { FieldItem } from '../../../interface/fields.model';

// components
import { FieldsCreateNewFieldComponent } from '../../../../apps-secondary/fields/create-new-field/fields-create-new-field.component';

@Component({
  selector: 'app-form-control-field-picker',
  styleUrls: ['form-control-field-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Field'"
        [matAutocomplete]="auto"
        formControlName="text"
        spellcheck="false">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onFieldSelect($event)">

        <mat-option *ngFor="let field of fields" [value]="field">
          {{ field.Title }}
        </mat-option>

        <mat-option *ngIf="(mode === 'new' || mode === 'edit')"
          [disabled]="!fg.controls['text'].value || alreadyExists">
          <div class="create-new-option"
            [ngClass]="{ disabled: (!fg.controls['text'].value || alreadyExists) }"
            (click)="openDialog(this.fg.controls['text'].value)">+ create new field</div>
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlFieldPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input()
  fg_fields: FormGroup;

  @Input()
  initial: FieldItem;

  @Input()
  mode: FormMode;

  fg: FormGroup;
  fields: FieldItem[];

  @ViewChild(MatAutocomplete)
  matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(
    private srv: FieldsLookupService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('ngOnInit: FormControlFieldPickerComponent');
    this.initFormGroup(this.mode);
  }

  ngOnDestroy() {
    if (this.$search) {
      this.$search.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // when form mode changes
    if (changes.mode) {
      this.initFormGroup(changes.mode.currentValue);
    }
  }

  initFormGroup(mode: FormMode) {
    console.log('initFormGroup');
    console.log(mode);

    // initialize form group for searching users
    this.createFormGroup();

    if (mode === 'view') {
      console.log(this.initial);
      this.displayFn(this.initial);
    } else {
      console.log('initSubscriptions when mode edit or new');
      this.initSubscriptions();
    }
  }

  createFormGroup() {
    this.fg = this.fb.group({
      text: this.getTextFormControl(this.mode)
    });
  }

  getTextFormControl(mode: FormMode) {
    switch (mode) {
      case 'new':
        return { value: '', disabled: false };
      case 'view':
        return { value: '', disabled: true };
      case 'edit':
        return { value: '', disabled: false };
    }
  }

  initSubscriptions() {
    // search fields
    this.$search = this.fg.controls['text'].valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        switchMap((text: string | FieldItem) => {
          // console.log(text);
          if (typeof text === 'string') {
            return this.srv.getFields(text);
          } else if (typeof text === 'object') {
            return this.srv.getFields(text.Title);
          } else if (typeof text === 'undefined') {
            return this.srv.getFields('');
          }
        })
      )
      .subscribe(
        (fields: FieldItem[]) => this.searchSuccess(fields),
        error => this.searchError(error),
        () => console.log('fields search subscription completed')
      );
  }

  searchSuccess(fields: FieldItem[]) {
    this.searching = false;
    this.fields = fields;
  }

  searchError(error) {
    console.log(error);
    this.searching = false;
    this.fields = [];
  }

  onFieldSelect(event: MatAutocompleteSelectedEvent) {
    const field: FieldItem = event.option.value;

    // user selected field from list
    if (field) {
      // update parent fg_fields
      this.fg_fields.controls['FieldId'].patchValue(field.Id);
    }
  }

  unselectFieldsId() {
    if (!this.initial) {
      this.fg_fields.controls['FieldId'].patchValue('');
    } else if (this.initial) {
      this.fg_fields.controls['FieldId'].patchValue(this.initial.Id);
    }
  }

  displayFn(field?: FieldItem) {
    // when mode is view then show field name
    if (this.mode === 'view' || (this.mode === 'edit' && !field)) {
      // console.log('mode is view or edit');

      if (_.has(this.initial, 'Title')) {
        // console.log('field has Title property:' + this.initial.Title);
        return this.initial.Title;
      } else {
        // console.log('else');
        return '';
      }
    } else if (field) {
      return field.Title;
    } else {
      return '';
    }
  }

  get hasError() {
    const invalid = this.fg_fields.get('FieldId').invalid;
    return invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['FieldId'].hasError('required');

    if (required) {
      this.fg.controls['text'].setErrors({ required: true });
    } else {
      this.fg.controls['text'].setErrors({});
    }

    return required ? 'field must be selected' : '';
  }

  openDialog(field: string) {
    // console.log(field);

    // check if field string is not empty
    if (typeof field === 'string' && field.length && !this.alreadyExists) {
      const dialogRef = this.dialog.open(FieldsCreateNewFieldComponent, {
        data: {
          field: field
        }
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((newField: FieldItem | undefined) => {
          // console.log(newField);
          if (newField) {
            this.fg.controls['text'].patchValue(newField.Title);
          }
        });
    }
  }

  get alreadyExists() {
    const text: string | FieldItem = this.fg.controls['text'].value;
    // if text is empty then just return false
    if (!text) {
      return false;

      // if fields array and text are not empty
      // then run comparison functions
    } else if (this.fields.length > 0 && text) {
      // if text is string
      if (typeof text === 'string') {
        const found = _.find(
          this.fields,
          (field: FieldItem) => field.Title === text
        );
        return !found ? false : true;
      } else if (typeof text === 'object') {
        const found = _.find(
          this.fields,
          (field: FieldItem) => field.Title === text.Title
        );
        return !found ? false : true;
      }
    }
  }
}
