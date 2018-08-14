import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';

// interfaces
import { FormMode } from './../../../../shared/interface/form.model';

@Component({
  selector: 'app-filters-date-range',
  styleUrls: ['filters-date-range.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="183px" [formGroup]="fg_filters">
      <input matInput
        placeholder="After Date"
        [matDatepicker]="afterDate"
        formControlName="afterDate">
      <mat-datepicker-toggle matSuffix [for]="afterDate"></mat-datepicker-toggle>
      <mat-datepicker #afterDate></mat-datepicker>
    </mat-form-field>

    <div class='clear-date' *ngIf="fg_filters?.controls['afterDate']?.value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'clear date'" (click)="clearAfterDate()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>

    <mat-form-field fxFlex="183px" [formGroup]="fg_filters">
      <input matInput
        placeholder="Before Date"
        [matDatepicker]="beforeDate"
        formControlName="beforeDate">
      <mat-datepicker-toggle matSuffix [for]="beforeDate"></mat-datepicker-toggle>
      <mat-datepicker #beforeDate></mat-datepicker>
    </mat-form-field>

    <div class='clear-date' *ngIf="fg_filters?.controls['beforeDate']?.value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'clear date'" (click)="clearBeforeDate()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
  `
})
export class FiltersDateRangeComponent implements OnChanges {
  @Input()
  fg_filters: FormGroup;

  @Input()
  reset: boolean;

  constructor() {}

  clearAfterDate() {
    this.fg_filters.controls['afterDate'].reset();
  }

  clearBeforeDate() {
    this.fg_filters.controls['beforeDate'].reset();
  }

  ngOnChanges(changes: SimpleChanges) {
    // reset can toggle between true or false
    // each time reset value changes
    // run reset workflow
    if (changes.reset && changes.reset.currentValue) {
      if (changes.reset.currentValue !== changes.reset.previousValue) {
        this.clearAfterDate();
        this.clearBeforeDate();
      }
    }
  }
}
