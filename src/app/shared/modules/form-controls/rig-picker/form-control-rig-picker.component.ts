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
import { RigsService } from '../../../../apps-secondary/rigs/services/rigs.service';

// material
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
  MatDialog
} from '@angular/material';

// interfaces
import { FormMode } from './../../../interface/form.model';
import { RigItem } from '../../../interface/rigs.model';

// components
import { RigsCreateNewRigComponent } from '../../../../apps-secondary/rigs/create-new-rig/rigs-create-new-rig.component';

@Component({
  selector: 'app-form-control-rig-picker',
  styleUrls: ['form-control-rig-picker.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg">

      <input matInput
        #autoCompleteInput
        [placeholder]="'Rig'"
        [matAutocomplete]="auto"
        formControlName="text"
        spellcheck="false">

      <mat-autocomplete #auto="matAutocomplete"
        [displayWith]="displayFn.bind(this)"
        (optionSelected)="onRigSelect($event)">

        <mat-option *ngFor="let rig of rigs" [value]="rig">
          {{ rig.Title }}
        </mat-option>

        <mat-option *ngIf="(mode === 'new' || mode === 'edit')"
          [disabled]="!fg.controls['text'].value || alreadyExists">
          <div class="create-new-option"
            [ngClass]="{ disabled: (!fg.controls['text'].value || alreadyExists) }"
            (click)="openDialog(this.fg.controls['text'].value)">+ create new rig</div>
        </mat-option>

      </mat-autocomplete>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `
})
export class FormControlRigPickerComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input()
  fg_fields: FormGroup;

  @Input()
  initial: RigItem;

  @Input()
  mode: FormMode;

  fg: FormGroup;
  rigs: RigItem[];

  @ViewChild(MatAutocomplete)
  matAutocomplete: MatAutocomplete;

  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger })
  autoComplete: MatAutocompleteTrigger;

  $search: Subscription;
  searching: boolean;

  constructor(
    private srv: RigsService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

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
        switchMap((text: string | RigItem) => {
          console.log(text);
          if (typeof text === 'string') {
            return this.srv.getRigs(text);
          } else if (typeof text === 'object') {
            return this.srv.getRigs(text.Title);
          } else if (typeof text === 'undefined') {
            return this.srv.getRigs('');
          }
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

    // user selected rig from list
    if (rig) {
      // update parent fg_fields
      this.fg_fields.controls['RigId'].patchValue(rig.Id);
    }
  }

  unselectRigsId() {
    if (!this.initial) {
      this.fg_fields.controls['RigId'].patchValue('');
    } else if (this.initial) {
      this.fg_fields.controls['RigId'].patchValue(this.initial.Id);
    }
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

    if (required) {
      this.fg.controls['text'].setErrors({ required: true });
    } else {
      this.fg.controls['text'].setErrors({});
    }

    return required ? 'field must be selected' : '';
  }

  openDialog(rig: string) {
    // console.log(rig);

    // check if rig string is not empty
    if (typeof rig === 'string' && rig.length && !this.alreadyExists) {
      const dialogRef = this.dialog.open(RigsCreateNewRigComponent, {
        data: {
          rig: rig
        }
      });

      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe((newRig: RigItem | undefined) => {
          // console.log(newRig);
          if (newRig) {
            this.fg.controls['text'].patchValue(newRig.Title);
          }
        });
    }
  }

  get alreadyExists() {
    const text: string | RigItem = this.fg.controls['text'].value;
    // if text is empty then just return false
    if (!text) {
      return false;

      // if rigs array and text are not empty
      // then run comparison functions
    } else if (this.rigs.length > 0 && text) {
      // if text is string
      if (typeof text === 'string') {
        const found = _.find(this.rigs, (rig: RigItem) => rig.Title === text);
        return !found ? false : true;
      } else if (typeof text === 'object') {
        const found = _.find(
          this.rigs,
          (rig: RigItem) => rig.Title === text.Title
        );
        return !found ? false : true;
      }
    }
  }
}
