import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// forms
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-jobs-filters-job-type',
  styleUrls: ['jobs-filters-job-type.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field [formGroup]="fg_filters">
      <mat-select
        placeholder="Job Type"
        formControlName="jobType">
        <mat-option
          *ngFor="let item of jobTypes"
          [value]="item">
            {{ item }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <!-- RESET BUTTON -->
    <div class='quick-filter-button'
      *ngIf="this.fg_filters.controls['jobType'].value"
      fxLayout="row nowrap" fxLayoutAlign="center center"
      [matTooltip]="'Reset Filter'" (click)="reset()">
      <fa-icon [icon]="['fas', 'times']"></fa-icon>
    </div>
    `
})
export class JobsFiltersJobTypeComponent {
  @Input()
  fg_filters: FormGroup;

  jobTypes: string[] = ['CH', 'OH'];

  constructor() {}

  reset() {
    this.fg_filters.controls['jobType'].reset();
  }
}
