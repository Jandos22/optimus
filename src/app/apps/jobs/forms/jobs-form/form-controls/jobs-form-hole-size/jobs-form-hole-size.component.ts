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
  selector: 'app-jobs-form-hole-size',
  styleUrls: ['jobs-form-hole-size.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="calc(98% - 60px)">

        <input
          matInput
          placeholder="Hole Size"
          [formControl]="holeSize"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>

    <mat-form-field fxFlex="60px" [formGroup]="fg_fields">

      <mat-select formControlName="HoleSizeUnits" [disabled]="mode === 'view'">
        <mat-option [value]="'in'">in</mat-option>
        <mat-option [value]="'mm'">mm</mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormHoleSizeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  // HS or hs = Hole Size
  // stored in database strictly in millimeters (SI units)
  holeSize = new FormControl(''); // default is 6 inches

  defaultValue = '152.4'; // mm
  defaultUnits = 'in';

  initialValue: number;
  initialUnits: string;

  $unitsChanges: Subscription;
  $holeSizeChanges: Subscription;

  constructor(private convert: ConverterService) {}

  ngOnInit() {
    // when form control inits
    // then first check units
    // if mode is new, then default to meters
    if (this.mode === 'new') {
      this.fg_fields.controls['HoleSizeUnits'].patchValue(this.defaultUnits);
      this.fg_fields.controls['HoleSize'].patchValue(this.defaultValue);
    } else {
      this.initialValue = this.fg_fields.controls['HoleSize'].value;
      this.initialUnits = this.fg_fields.controls['HoleSizeUnits'].value;
    }

    this.initLocal();
  }

  resetToInitial() {
    this.holeSize.patchValue(this.initialValue);

    if (this.initialUnits === 'in') {
      this.holeSize.patchValue(
        this.rtz(this.convert.mm2in(this.initialValue).toFixed(2))
      );
    } else if (this.initialUnits === 'mm') {
      this.holeSize.patchValue(this.rtz(this.initialValue.toFixed(2)));
    }
  }

  ngOnChanges(c: SimpleChanges) {
    // react to form mode change
    if (c.mode) {
      console.log('mode change detected');
      if (c.mode.currentValue === 'view') {
        this.holeSize.disable();
        this.resetToInitial();
      } else {
        this.holeSize.enable();
      }

      this.maybeStartSubscriptions();
    }
  }

  ngOnDestroy() {
    if (this.$unitsChanges) {
      this.$unitsChanges.unsubscribe();
    }
    if (this.$holeSizeChanges) {
      this.$holeSizeChanges.unsubscribe();
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
    this.$unitsChanges = this.fg_fields.controls['HoleSizeUnits'].valueChanges
      .pipe(
        startWith(this.fg_fields.controls['HoleSizeUnits'].value),
        distinctUntilChanged(),
        pairwise()
      )
      .subscribe(units => {
        console.log(units);

        const prev_hs = _.toNumber(this.holeSize.value);
        console.log(prev_hs);

        if (units[0] === 'mm' && units[1] === 'in') {
          this.holeSize.patchValue(
            this.rtz(this.convert.mm2in(prev_hs).toFixed(3))
          );
        } else if (units[0] === 'in' && units[1] === 'mm') {
          this.holeSize.patchValue(
            this.rtz(this.convert.in2mm(prev_hs).toFixed(3))
          );
        } else if (!units[0] && units[1] === 'mm') {
          this.holeSize.patchValue(this.rtz(prev_hs.toFixed(3)));

          // if holeSize was already filled, but units where missing
          // then update holeSize as soon as users selects units
          this.fg_fields.controls['HoleSize'].patchValue(prev_hs);
        } else if (!units[0] && units[1] === 'in') {
          this.holeSize.patchValue(
            this.rtz(this.convert.mm2in(prev_hs).toFixed(3))
          );

          // if holeSize was already filled, but units where missing
          // then update holeSize as soon as users selects units
          this.fg_fields.controls['HoleSize'].patchValue(
            this.convert.mm2in(prev_hs)
          );
        }
      });

    this.$holeSizeChanges = this.holeSize.valueChanges
      .pipe(map(hs_string => _.toNumber(hs_string)))
      .subscribe(hs_number => {
        // console.log(hs_number);
        if (this.fg_fields.controls['HoleSizeUnits'].value === 'mm') {
          this.fg_fields.controls['HoleSize'].patchValue(hs_number);
        } else if (this.fg_fields.controls['HoleSizeUnits'].value === 'in') {
          this.fg_fields.controls['HoleSize'].patchValue(
            this.convert.in2mm(hs_number)
          );
        }
      });
  }

  initLocal() {
    const units: string = this.fg_fields.controls['HoleSizeUnits'].value;
    const hs: number = this.fg_fields.controls['HoleSize'].value;

    if (hs) {
      switch (units) {
        case 'mm':
          this.holeSize.patchValue(this.rtz(hs.toFixed(3)));
          break;

        case 'in':
          this.holeSize.patchValue(this.rtz(this.convert.mm2in(hs).toFixed(3)));
          break;

        default:
          this.holeSize.patchValue(this.rtz(hs.toFixed(3)));
          break;
      }
    }
  }

  // remove trailing zeros
  rtz(string: string) {
    // create string array without trailing zeros
    const stripped = _.dropRightWhile(string, v => v === '0' || v === '.');
    console.log(stripped);

    // stringify an array, creates one string with values separated by commas
    const stringified = _.toString(stripped);
    console.log(stringified);

    // remove commas
    const re = /,/g;
    const final = _.replace(stringified, re, '');
    console.log(final);

    return final;
  }

  get hasError() {
    return this.holeSize.invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('HoleSize').hasError('required');

    return this.holeSize.touched ? (required ? '... is required' : '') : '';
  }
}
