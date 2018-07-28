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
import { RigsLookupService } from './../../../services/rigs-lookup.service';

import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { RigItem } from '../../../interface/rigs.model';

@Component({
  selector: 'app-form-control-rig-picker',
  styleUrls: ['form-control-rig-picker.component.scss'],
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Rig'"
        [matAutocomplete]="auto"
        formControlName="text">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onRigSelect($event)">

        <mat-option *ngFor="let rig of rigs" [value]="rig">
          {{ rig.Title }}
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlRigPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() initial: RigItem;
  @Input() mode: FormMode;

  fg: FormGroup;
  rigs: RigItem[];

  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(private srv: RigsLookupService, private fb: FormBuilder) {}

  ngOnInit() {
    console.log('ngOnInit: FormControlRigPickerComponent');
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
    // search rigs
    this.$search = this.fg.controls['text'].valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        switchMap((text: string) => {
          console.log(text);
          return this.srv.getRigs(text);
        })
      )
      .subscribe(
        (rigs: RigItem[]) => this.searchSuccess(rigs),
        error => this.searchError(error),
        () => console.log('rigs search subscription completed')
      );
  }

  searchSuccess(rigs: RigItem[]) {
    this.searching = false;
    this.rigs = rigs;
  }

  searchError(error) {
    console.log(error);
    this.searching = false;
    this.rigs = [];
  }

  onRigSelect(event: MatAutocompleteSelectedEvent) {
    const rig: RigItem = event.option.value;
    this.fg_fields.controls['RigId'].patchValue(rig.Id);
  }

  displayFn(rig?: RigItem) {
    // when mode is view then show rig name
    if (this.mode === 'view' || (this.mode === 'edit' && !rig)) {
      console.log('mode is view or edit');

      if (_.has(this.initial, 'Title')) {
        console.log('rig has Title property:' + this.initial.Title);
        return this.initial.Title;
      } else {
        console.log('else');
        return '';
      }
    } else if (rig) {
      return rig.Title;
    } else {
      return '';
    }
  }

  get hasError() {
    return this.fg_fields.get('RigId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['RigId'].hasError('required');

    return this.fg_fields.controls['RigId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
