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
  selector: 'app-jobs-list-item',
  styleUrls: ['jobs-list-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div class="job-row-1">

        <div class="title" (click)="openForm.emit(job)">{{job.Title}}</div>

      </div>

      <div class="job-row-2" fxLayout="row nowrap" fxLayoutGap="12px">

        <div class="date"
          matTooltip="Job Date">
          {{job.RigUpStart | date: 'mediumDate'}}
        </div>

      </div>
    `
})
export class JobsListItemComponent {
  @Input() job: JobItem;
  @Input() last: boolean;

  @Output() openForm = new EventEmitter<JobItem>();

  constructor() {}
}
