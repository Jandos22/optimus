import {
  Component,
  Input,
  //   Output,
  //   EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-job-summary-list',
  styleUrls: ['jobs-job-summary-list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
        <div class="job-summary-list"
            fxLayout="row wrap" fxLayoutAlign="start start">
            <!-- Job Summary 1 -->
            <div class="job-summary"
                *ngIf="job.JSStitle1"
                [matTooltip]="job.JSSbody1"
                >- {{ job.JSStitle1 }}</div>

            <!-- Job Summary 2 -->
            <div class="job-summary"
                *ngIf="job.JSStitle2"
                [matTooltip]="job.JSSbody2"
                >- {{ job.JSStitle2 }}</div>

            <!-- Job Summary 3 -->
            <div class="job-summary"
                *ngIf="job.JSStitle3"
                [matTooltip]="job.JSSbody3"
                >- {{ job.JSStitle3 }}</div>

            <!-- Job Summary 4 -->
            <div class="job-summary"
                *ngIf="job.JSStitle4"
                [matTooltip]="job.JSSbody4"
                >- {{ job.JSStitle4 }}</div>

            <!-- Job Summary 5 -->
            <div class="job-summary"
                *ngIf="job.JSStitle5"
                [matTooltip]="job.JSSbody5"
                >- {{ job.JSStitle5 }}</div>

            <!-- Job Summary 6 -->
            <div class="job-summary"
                *ngIf="job.JSStitle6"
                [matTooltip]="job.JSSbody6"
                >- {{ job.JSStitle6 }}</div>

            <!-- Job Summary 7 -->
            <div class="job-summary"
                *ngIf="job.JSStitle7"
                [matTooltip]="job.JSSbody7"
                >- {{ job.JSStitle7 }}</div>

            <!-- Job Summary 8 -->
            <div class="job-summary"
                *ngIf="job.JSStitle8"
                [matTooltip]="job.JSSbody8"
                >- {{ job.JSStitle8 }}</div>
        </div>
    `
})
export class JobsJobSummaryListComponent {
  @Input()
  job: JobItem;

  constructor() {}
}
