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
      <div
        class="jobtype"
        fxFlex="8px"
        [matTooltip]="'Job Type: ' + job.JobType"
        [ngClass]="{
          ch: job.JobType === 'CH',
          oh: job.JobType === 'OH'
        }"
      ></div>

      <div class="job-col-body" fxFlex="calc(100% - 8px)">
        <div
          class="job-row-1"
          fxLayout="row nowrap"
          fxLayoutAlign="start center"
          fxLayoutGap="12px"
        >
          <div
            class="date"
            matTooltip="Job Date"
            matTooltipClass="mytooltip large-text"
          >
            {{ job.RigUpStart | date: 'mediumDate' }}
          </div>

          <div
            class="iDistrict"
            (click)="openJRI(job.iDistrict)"
            matTooltip="open JRI"
            matTooltipClass="mytooltip large-text"
          >
            iD: {{ job.iDistrict }}
          </div>

          <div
            fxLayout="row nowrap"
            fxLayoutAlign="start center"
            fxLayoutGap="2px"
          >
            <div
              class="JobFolder"
              (click)="openJobFolder(job.JobFolder)"
              *ngIf="job.JobFolder?.Url"
              matTooltip="open Job Folder (via IE 11 only)"
              matTooltipClass="mytooltip large-text"
            >
              JF
            </div>

            <div *ngIf="job.JobFolder?.Url && job.JobArchive?.Url">
              /
            </div>

            <div
              class="JobArchive"
              (click)="openJobArchive(job.JobArchive)"
              *ngIf="job.JobArchive?.Url"
              matTooltip="open Job Archive (via IE 11 only)"
              matTooltipClass="mytooltip large-text"
            >
              JA
            </div>
          </div>
        </div>

        <div
          class="job-row-2"
          fxLayout="row nowrap"
          fxLayoutAlign="start start"
          fxLayoutGap="12px"
        >
          <div
            class="well"
            (click)="openForm.emit(job)"
            [matTooltip]="job.Well + ', ' + job.Rig.Title"
          >
            {{ job.Well }}
          </div>
          <div class="title" (click)="openForm.emit(job)">
            {{ job.Title }}
          </div>
        </div>

        <!-- Job Summary List -->
        <div
          class="job-row-3"
          *ngIf="job.JSStitle1"
          fxLayout="row wrap"
          fxLayoutAlign="start start"
        >
          <div fxFlex="100" class="job-data">
            <span class="title">Rig: </span>
            <span class="value">{{ job.Rig.Title }}</span>
          </div>

          <div fxFlex="100" class="job-data" *ngIf="job.MaxDeviation">
            <span class="title">Deviation: </span>
            <span class="value">{{ job.MaxDeviation }}</span>
          </div>

          <app-jobs-job-summary-list
            fxFlex="100"
            class="jobs-job-summary-list"
            [job]="job"
            (click)="openForm.emit(job)"
          >
          </app-jobs-job-summary-list>
        </div>
      </div>

      <app-locations-card class="locations-card" [locations]="job?.Location">
      </app-locations-card>
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

  openJobFolder(link) {
    if (link) {
      window.open(`${link.Url}`, '_blank');
    }
  }

  openJobArchive(link) {
    if (link) {
      window.open(`${link.Url}`, '_blank');
    }
  }
}
