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
  selector: 'app-jobs-form-total-depth',
  styleUrls: ['jobs-form-total-depth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="calc(98% - 60px)">

        <input
          matInput
          placeholder="Total Depth"
          [formControl]="totalDepth"
          autocomplete="off">

        <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>

    <mat-form-field fxFlex="60px" [formGroup]="fg_fields">

      <mat-select formControlName="TotalDepthUnits" [disabled]="mode === 'view'">
        <mat-option [value]="'m'">m</mat-option>
        <mat-option [value]="'ft'">ft</mat-option>
      </mat-select>

      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>

    </mat-form-field>
  `
})
export class JobsFormTotalDepthComponent
  implements OnInit, OnDestroy, OnChanges {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  // TD = Total Depth
  totalDepth = new FormControl('');

  $unitsChanges: Subscription;
  $tdChanges: Subscription;

  constructor(private convert: ConverterService) {}

  ngOnInit() {
    // when form control inits
    // then first check units
    // if mode is new, then default to meters
    if (this.mode === 'new') {
      this.fg_fields.controls['TotalDepthUnits'].patchValue('m');
    }

    // this.maybeStartSubscriptions();

    this.initLocal();

    // this.startSubscriptions();
  }

  ngOnChanges(c: SimpleChanges) {
    // react to form mode change
    if (c.mode) {
      console.log('mode change detected');
      if (c.mode.currentValue === 'view') {
        this.totalDepth.disable();
      } else {
        this.totalDepth.enable();
      }

      this.maybeStartSubscriptions();
    }
  }

  ngOnDestroy() {
    if (this.$unitsChanges) {
      this.$unitsChanges.unsubscribe();
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
    this.$unitsChanges = this.fg_fields.controls['TotalDepthUnits'].valueChanges
      .pipe(
        startWith(this.fg_fields.controls['TotalDepthUnits'].value),
        distinctUntilChanged(),
        pairwise()
      )
      .subscribe(units => {
        console.log(units);

        const prev_td = _.toNumber(this.totalDepth.value);
        console.log(prev_td);

        if (units[0] === 'm' && units[1] === 'ft') {
          this.totalDepth.patchValue(this.convert.minft(prev_td).toFixed(2));
        } else if (units[0] === 'ft' && units[1] === 'm') {
          this.totalDepth.patchValue(this.convert.ftinm(prev_td).toFixed(2));
        } else if (units[0] === '' && units[1] === 'm') {
          this.totalDepth.patchValue(prev_td.toFixed(2));
        } else if (units[0] === '' && units[1] === 'ft') {
          this.totalDepth.patchValue(this.convert.minft(prev_td).toFixed(2));
        }
      });

    this.$tdChanges = this.totalDepth.valueChanges
      .pipe(map(td_string => _.toNumber(td_string)))
      .subscribe(td_number => {
        console.log(td_number);
        if (this.fg_fields.controls['TotalDepthUnits'].value === 'm') {
          console.log('this');
          this.fg_fields.controls['TotalDepth'].patchValue(td_number);
        } else if (this.fg_fields.controls['TotalDepthUnits'].value === 'ft') {
          this.fg_fields.controls['TotalDepth'].patchValue(
            this.convert.ftinm(td_number)
          );
        }
      });
  }

  initLocal() {
    const units: string = this.fg_fields.controls['TotalDepthUnits'].value;
    const td: number = this.fg_fields.controls['TotalDepth'].value;
    // if job has TD then assign value according to it's units
    if (td) {
      switch (units) {
        case 'm':
          this.totalDepth.patchValue(td.toFixed(2));
          break;

        case 'ft':
          this.totalDepth.patchValue(this.convert.minft(td).toFixed());
          break;

        default:
          this.totalDepth.patchValue(td.toFixed(2));
          break;
      }
    }
  }

  get hasError() {
    return this.totalDepth.invalid;
  }

  get errorMessage() {
    const required = this.fg_fields.get('TotalDepth').hasError('required');

    return this.totalDepth.touched ? (required ? '... is required' : '') : '';
  }
}
