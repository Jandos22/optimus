import { take, retry } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  JobsSearchParams,
  JobItem
} from './../../../../../../shared/interface/jobs.model';
import { FormMode } from '../../../../../../shared/interface/form.model';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import * as subDays from 'date-fns/sub_days';
import * as endOfToday from 'date-fns/end_of_today';

// interfaces
import { LocationEnt } from '../../../../../../shared/interface/locations.model';

// services
import { JobsService } from '../../../../../jobs/services';

@Component({
  selector: 'app-appraisals-form-job',
  styleUrls: ['appraisals-form-job.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field fxFlex="100" [formGroup]="fg_fields">
      <mat-select [disabled]="mode === 'view'"
        placeholder="Job"
        formControlName="JobId">

        <!-- select toolbar -->
        <div class="appraisals-job-selection-toolbar" fxLayout="row nowrap" fxLayoutAlign="space-between center">
          <div class="toolbar-title" (click)="navigateToJobs()" matTooltip="Open Jobs in new tab">Jobs</div>
          <div class='common-button'>
            <button mat-icon-button matTooltip='Refresh Jobs List' (click)="fetchJobs()">
              <span class='fa_regular'><fa-icon [icon]="['fas', 'sync-alt']" [spin]="fetching"></fa-icon></span>
            </button>
          </div>
        </div>

        <mat-option *ngFor="let item of jobs" [value]="item.Id"
          [matTooltip]="item.Title" class="appraisals-job-option">
            <span>{{ item.RigUpStart | date: 'mediumDate' }} | {{ item.Well }} | {{ item.Title }}</span>
        </mat-option>

      </mat-select>
      <mat-error *ngIf="hasError">{{ errorMessage }}</mat-error>
    </mat-form-field>
    `,
  providers: [JobsService]
})
export class AppraisalsFormJobComponent implements OnInit {
  @Input() fg_fields: FormGroup;
  @Input() mode: FormMode;

  fieldName = 'JobId';
  jobs: JobItem[] = [];

  $fetchJobs: Subscription;
  fetching: boolean;

  // let user select
  // * only jobs that started in last 30 days
  // * only jobs for currently selected location

  constructor(private srv: JobsService) {}

  ngOnInit() {
    // when mode is new or edit
    // start editing logic
    if (this.mode === 'new' || this.mode === 'edit') {
      this.onEditStart();
    }
  }

  // launched from ngOnInit or ngOnChanges if form mode changes
  onEditStart() {
    // fetch list of applicable jobs for selection
    this.fetchJobs();
  }

  fetchJobs() {
    this.fetching = true;

    const params: JobsSearchParams = {
      text: '',
      locations: [this.fg_fields.controls['LocationId'].value],
      afterDate: subDays(endOfToday(), 30)
    };

    const url = this.srv.buildUrl(params);

    this.$fetchJobs = this.srv
      .getDataWithNext(url)
      .pipe(take(1))
      .subscribe(success =>
        this.fetchJobsSuccess(success.d.results as JobItem[])
      );
  }

  fetchJobsSuccess(jobs: JobItem[]) {
    this.fetching = false;
    this.jobs = [...jobs];
  }

  fetchJobsError(error) {
    console.log(error);
    this.fetching = false;
    this.jobs = [];
  }

  navigateToJobs() {
    window.open(
      `https://slb001.sharepoint.com/sites/wireline/optimus/index.aspx#/jobs`,
      '_blank'
    );
  }

  get hasError() {
    return this.fg_fields.controls[this.fieldName].invalid;
  }

  get errorMessage() {
    const control = this.fg_fields.controls[this.fieldName];

    const required = control.hasError('required');

    return control.touched ? (required ? '... is required' : '') : '';
  }
}
