import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

// rxjs
import { Subscription } from 'rxjs';
import { take, switchMap, startWith, debounceTime } from 'rxjs/operators';

import * as _ from 'lodash';

// services
import { FieldsLookupService } from '../../../services';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { FieldItem } from '../../../interface/fields.model';

@Component({
  selector: 'app-form-control-field-picker',
  styleUrls: ['form-control-field-picker.component.scss'],
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Field'"
        [matAutocomplete]="auto"
        formControlName="text">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onFieldSelect($event)">

        <mat-option *ngFor="let field of fields" [value]="field">
          {{ field.Title }}
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlFieldPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() initial: FieldItem;
  @Input() mode: FormMode;

  fg: FormGroup;
  fields: FieldItem[];

  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(private srv: FieldsLookupService, private fb: FormBuilder) {}

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
        switchMap((text: string) => {
          console.log(text);
          return this.srv.getFields(text);
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
    this.fg_fields.controls['FieldId'].patchValue(field.Id);
  }

  displayFn(field?: FieldItem) {
    // when mode is view then show field name
    if (this.mode === 'view' || (this.mode === 'edit' && !field)) {
      console.log('mode is view or edit');

      if (_.has(this.initial, 'Title')) {
        console.log('field has Title property:' + this.initial.Title);
        return this.initial.Title;
      } else {
        console.log('else');
        return '';
      }
    } else if (field) {
      return field.Title;
    } else {
      return '';
    }
  }

  get hasError() {
    return this.fg_fields.get('FieldId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['FieldId'].hasError('required');

    return this.fg_fields.controls['FieldId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
