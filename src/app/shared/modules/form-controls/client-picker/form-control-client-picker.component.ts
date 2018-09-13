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
import { take, switchMap, startWith, debounceTime } from 'rxjs/operators';

import * as _ from 'lodash';

// services
import { ClientsService } from '../../../../apps-secondary/clients/services/clients.service';

// material
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
  MatDialog
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { ClientItem } from '../../../interface/clients.model';

// components
import { ClientsCreateNewClientComponent } from '../../../../apps-secondary/clients/create-new-client/clients-create-new-client.component';

@Component({
  selector: 'app-form-control-client-picker',
  styleUrls: ['form-control-client-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Client'"
        [matAutocomplete]="auto"
        formControlName="text"
        spellcheck="false">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onClientSelect($event)">

        <mat-option *ngFor="let client of clients" [value]="client">
          {{ client.Title }}
        </mat-option>

        <mat-option *ngIf="(mode === 'new' || mode === 'edit')"
          [disabled]="!fg.controls['text'].value || alreadyExists">
          <div class="create-new-option"
            [ngClass]="{ disabled: (!fg.controls['text'].value || alreadyExists) }"
            (click)="openDialog(this.fg.controls['text'].value)">+ create new client</div>
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlClientPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input()
  fg_fields: FormGroup;

  @Input()
  initial: ClientItem;

  @Input()
  mode: FormMode;

  fg: FormGroup;
  clients: ClientItem[];

  @ViewChild(MatAutocomplete)
  matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(
    private srv: ClientsService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

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
        switchMap((text: string | ClientItem) => {
          console.log(text);
          if (typeof text === 'string') {
            return this.srv.getClients(text);
          } else if (typeof text === 'object') {
            return this.srv.getClients(text.Title);
          } else if (typeof text === 'undefined') {
            return this.srv.getClients('');
          }
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

    // user selected client from list
    if (client) {
      // update parent fg_fields
      this.fg_fields.controls['ClientId'].patchValue(client.Id);
    }
  }

  unselectClientsId() {
    if (!this.initial) {
      this.fg_fields.controls['ClientId'].patchValue('');
    } else if (this.initial) {
      this.fg_fields.controls['ClientId'].patchValue(this.initial.Id);
    }
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
    const invalid = this.fg_fields.get('ClientId').invalid;
    return invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.controls['ClientId'].hasError('required');

    if (required) {
      this.fg.controls['text'].setErrors({ required: true });
    } else {
      this.fg.controls['text'].setErrors({});
    }

    return required ? 'field must be selected' : '';
  }

  openDialog(client: string) {
    // console.log(client);

    // check if client string is not empty
    if (typeof client === 'string' && client.length && !this.alreadyExists) {
      const dialogRef = this.dialog.open(ClientsCreateNewClientComponent, {
        data: {
          client: client
        }
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((newClient: ClientItem | undefined) => {
          // console.log(newClient);
          if (newClient) {
            this.fg.controls['text'].patchValue(newClient.Title);
          }
        });
    }
  }

  get alreadyExists() {
    const text: string | ClientItem = this.fg.controls['text'].value;
    // if text is empty then just return false
    if (!text) {
      return false;

      // if clients array and text are not empty
      // then run comparison functions
    } else if (this.clients.length > 0 && text) {
      // if text is string
      if (typeof text === 'string') {
        const found = _.find(
          this.clients,
          (client: ClientItem) => client.Title === text
        );
        return !found ? false : true;
      } else if (typeof text === 'object') {
        const found = _.find(
          this.clients,
          (client: ClientItem) => client.Title === text.Title
        );
        return !found ? false : true;
      }
    }
  }
}
