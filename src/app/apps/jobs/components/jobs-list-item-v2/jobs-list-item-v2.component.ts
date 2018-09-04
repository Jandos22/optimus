import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// import * as differenceInDays from 'date-fns/difference_in_days';
// import * as startOfToday from 'date-fns/start_of_today';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-list-item-v2',
  styleUrls: ['jobs-list-item-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="job-container" fxFlex="100" fxLayout="row nowrap">
      <!-- color depends on Job Type: OH or CH -->
      <div class="jobtype" fxFlex="8px" [matTooltip]="'Job Type: ' + job.JobType"
        [ngClass]="{
          ch: (job.JobType === 'CH'),
          oh: (job.JobType === 'OH')
        }">
      </div>

      <div class="job-col-body" fxFlex="calc(100% - 8px)">
        <div class="job-row-1" fxLayout="row nowrap" fxLayoutAlign="start center" fxLayoutGap="12px">

          <div class="date"
            matTooltip="Job Date">
            {{ job.RigUpStart | date: 'mediumDate' }}
          </div>

          <div class="iDistrict" (click)="openJRI(job.iDistrict)"
            matTooltip="open JRI">
            iD: {{ job.iDistrict }}
          </div>

        </div>

        <div class="job-row-2" fxLayout="row nowrap" fxLayoutAlign="start start" fxLayoutGap="12px">

          <div class="well" (click)="openForm.emit(job)" [matTooltip]="job.Well + ', '">
            {{ job.Well }}
          </div>
          <div class="title" (click)="openForm.emit(job)">
            {{ job.Title }}
          </div>

        </div>

        <!-- Job Summary List -->
        <div class="job-row-3" fxLayout="row nowrap" fxLayoutAlign="start start">

          <app-jobs-job-summary-list
            fxFlex
            class="jobs-job-summary-list"
            [job]="job"
            (click)="openForm.emit(job)">
          </app-jobs-job-summary-list>

        </div>
      </div>
    </div>
    `
})
export class JobsListItemV2Component {
  @Input()
  job: JobItem;

  @Input()
  last: boolean;

  @Output()
  openForm = new EventEmitter<JobItem>();

  constructor() {}

  openJRI(iDistrict: string) {
    if (iDistrict) {
      window.open(
        `https://operationsportal.slb.com/fsmhome/pages/JRIQuestions.aspx?jobid=${iDistrict}&category=0`,
        '_blank'
      );
    }
  }
}
