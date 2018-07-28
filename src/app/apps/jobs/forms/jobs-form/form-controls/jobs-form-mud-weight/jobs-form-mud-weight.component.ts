import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

// rxjs
import { pairwise, startWith, distinctUntilChanged, map } from 'rxjs/operators';

import * as _ from 'lodash';

// interfaces
import { FormMode } from './../../../../../../shared/interface/form.model';

// services
import { ConverterService } from '../../../../../../shared/services/converter.service';

@Component({
  selector: 'app-jobs-form-mud-weight',
  styleUrls: ['jobs-form-mud-weight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="calc(98% - 60px)">

        <input
          matInput
          placeholder="Mud Weight"
          [formControl]="mudWeight"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>

    <mat-form-field fxFlex="60px" [formGroup]="fg_fields">

      <mat-select formControlName="MudWeightUnits" [disabled]="mode === 'view'">
        <mat-option [value]="'ppg'">ppg</mat-option>
        <mat-option [value]="'kg\/m3'">kg/m3</mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormMudWeightComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  // MW or mw = Mud Weight
  // stored in database strictly in kg/m3 (SI units)
  mudWeight = new FormControl('');

  defaultValue = '1000'; // kg/m3
  defaultUnits = 'ppg'; // ppg

  initialValue: number;
  initialUnits: string;

  $unitsChanges: Subscription;
  $mudWeightChanges: Subscription;

  constructor(private convert: ConverterService) {}

  ngOnInit() {
    // when form control inits
    // then first check units
    // if mode is new, then default to meters
    if (this.mode === 'new') {
      this.fg_fields.controls['MudWeightUnits'].patchValue(this.defaultUnits);
      this.fg_fields.controls['MudWeight'].patchValue(this.defaultValue);
    } else {
      this.initialValue = this.fg_fields.controls['MudWeight'].value;
      this.initialUnits = this.fg_fields.controls['MudWeightUnits'].value;
    }

    this.initLocal();
  }

  resetToInitial() {
    this.mudWeight.patchValue(this.initialValue);

    if (this.initialUnits === 'ppg') {
      this.mudWeight.patchValue(
        this.rtz(this.convert.kgpermcub2ppg(this.initialValue).toFixed(2))
      );
    } else if (this.initialUnits === 'ppg') {
      this.mudWeight.patchValue(this.rtz(this.initialValue.toFixed(2)));
    }
  }

  ngOnChanges(c: SimpleChanges) {
    // react to form mode change
    if (c.mode) {
      console.log('mode change detected');
      if (c.mode.currentValue === 'view') {
        this.mudWeight.disable();
        this.resetToInitial();
      } else {
        this.mudWeight.enable();
      }

      this.maybeStartSubscriptions();
    }
  }

  ngOnDestroy() {
    if (this.$unitsChanges) {
      this.$unitsChanges.unsubscribe();
    }
    if (this.$mudWeightChanges) {
      this.$mudWeightChanges.unsubscribe();
    }
  }

  maybeStartSubscriptions() {
    if (this.mode === 'new' || this.mode === 'edit') {
      this.startSubscriptions();
    }
  }

  startSubscriptions() {
    console.log('start subscriptions');

    // when units change then convert current value
    this.$unitsChanges = this.fg_fields.controls['MudWeightUnits'].valueChanges
      .pipe(
        startWith(this.fg_fields.controls['MudWeightUnits'].value),
        distinctUntilChanged(),
        pairwise()
      )
      .subscribe(units => {
        console.log(units);

        const prev_mw = _.toNumber(this.mudWeight.value);
        console.log(prev_mw);

        if (units[0] === 'kg/m3' && units[1] === 'ppg') {
          this.mudWeight.patchValue(
            this.rtz(this.convert.kgpermcub2ppg(prev_mw).toFixed(2))
          );
        } else if (units[0] === 'ppg' && units[1] === 'kg/m3') {
          this.mudWeight.patchValue(
            this.rtz(this.convert.ppg2kgpermcub(prev_mw).toFixed(2))
          );
        } else if (!units[0] && units[1] === 'kg/m3') {
          this.mudWeight.patchValue(this.rtz(prev_mw.toFixed(2)));
          // if mudWeight was already filled, but units where missing
          // then update mudWeight as soon as users selects units
          this.fg_fields.controls['MudWeight'].patchValue(prev_mw);
        } else if (!units[0] && units[1] === 'ppg') {
          this.mudWeight.patchValue(this.rtz(prev_mw.toFixed(2)));
          // if mudWeight was already filled, but units where missing
          // then update mudWeight as soon as users selects units
          this.fg_fields.controls['MudWeight'].patchValue(
            this.convert.ppg2kgpermcub(prev_mw)
          );
        }
      });

    this.$mudWeightChanges = this.mudWeight.valueChanges
      .pipe(map(mw_string => _.toNumber(mw_string)))
      .subscribe(mw_number => {
        // console.log(mw_number);
        if (this.fg_fields.controls['MudWeightUnits'].value === 'kg/m3') {
          this.fg_fields.controls['MudWeight'].patchValue(mw_number);
        } else if (this.fg_fields.controls['MudWeightUnits'].value === 'ppg') {
          this.fg_fields.controls['MudWeight'].patchValue(
            this.convert.ppg2kgpermcub(mw_number)
          );
        }
      });
  }

  initLocal() {
    const units: string = this.fg_fields.controls['MudWeightUnits'].value;
    const mw: number = this.fg_fields.controls['MudWeight'].value;

    if (mw) {
      switch (units) {
        case 'kg/m3':
          this.mudWeight.patchValue(this.rtz(mw.toFixed(2)));
          break;

        case 'ppg':
          this.mudWeight.patchValue(
            this.rtz(this.convert.kgpermcub2ppg(mw).toFixed(2))
          );
          break;

        default:
          this.mudWeight.patchValue(this.rtz(mw.toFixed(2)));
          break;
      }
    }
  }

  // remove trailing zeros
  rtz(string: string) {
    const hasDot = _.find(string, v => v === '.');
    const number = _.toNumber(string);
    const isInteger = _.isInteger(number);

    // console.log(string);
    // console.log(number);
    // console.log(isInteger);
    // console.log(hasDot);

    if (isInteger) {
      return number.toFixed(0);
    } else if (!isInteger && hasDot === '.') {
      // create string array without trailing zeros
      const stripped = _.dropRightWhile(string, v => v === '0' || v === '.');
      console.log(stripped);

      // stringify an array, creates one string with values separated by commas
      const stringified = _.toString(stripped);
      console.log(stringified);

      // remove commas
      const re = /,/g;

      return _.replace(stringified, re, '');
    } else {
      return string;
    }
  }

  get hasError() {
    return this.mudWeight.invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('MudWeight').hasError('required');

    return this.mudWeight.touched ? (required ? '... is required' : '') : '';
  }
}
