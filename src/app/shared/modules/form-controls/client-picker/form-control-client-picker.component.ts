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
import { ClientsLookupService } from './../../../services/clients-lookup.service';

import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { ClientItem } from '../../../interface/clients.model';

@Component({
  selector: 'app-form-control-client-picker',
  styleUrls: ['form-control-client-picker.component.scss'],
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Client'"
        [matAutocomplete]="auto"
        formControlName="text">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onClientSelect($event)">

        <mat-option *ngFor="let client of clients" [value]="client">
          {{ client.Title }}
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlClientPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() initial: ClientItem;
  @Input() mode: FormMode;

  fg: FormGroup;
  clients: ClientItem[];

  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(private srv: ClientsLookupService, private fb: FormBuilder) {}

  ngOnInit() {
    console.log('ngOnInit: FormControlClientPickerComponent');
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
    // search clients
    this.$search = this.fg.controls['text'].valueChanges
      .pipe(
        startWith(''),
        debounceTime(600),
        switchMap((text: string) => {
          console.log(text);
          return this.srv.getClients(text);
        })
      )
      .subscribe(
        (clients: ClientItem[]) => this.searchSuccess(clients),
        error => this.searchError(error),
        () => console.log('clients search subscription completed')
      );
  }

  searchSuccess(clients: ClientItem[]) {
    this.searching = false;
    this.clients = clients;
  }

  searchError(error) {
    console.log(error);
    this.searching = false;
    this.clients = [];
  }

  onClientSelect(event: MatAutocompleteSelectedEvent) {
    const client: ClientItem = event.option.value;
    this.fg_fields.controls['ClientId'].patchValue(client.Id);
  }

  displayFn(client?: ClientItem) {
    // when mode is view then show client name
    if (this.mode === 'view' || (this.mode === 'edit' && !client)) {
      console.log('mode is view or edit');

      if (_.has(this.initial, 'Title')) {
        console.log('client has Title property:' + this.initial.Title);
        return this.initial.Title;
      } else {
        console.log('else');
        return '';
      }
    } else if (client) {
      return client.Title;
    } else {
      return '';
    }
  }

  get hasError() {
    return this.fg_fields.get('ClientId').invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['ClientId'].hasError('required');

    return this.fg_fields.controls['ClientId'].touched
      ? required
        ? '... is required'
        : ''
      : '';
  }
}
