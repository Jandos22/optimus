import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-list',
  styleUrls: ['jobs-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="jobs-list-container" fxFlex
      fxLayout="row wrap" fxLayoutAlign="start start" fxLayoutGap="16px">

      <app-jobs-list-item-v2
        *ngFor="let job of jobs; last as last"
        [job]="job"
        [ngClass]="{'last-item': last}"
        (openForm)="openForm.emit($event)"
        fxLayout="row nowrap">
      </app-jobs-list-item-v2>

    </div>
    `
})
export class JobsListComponent {
  @Input()
  jobs: JobItem[];

  @Output()
  openForm = new EventEmitter<JobItem>();

  constructor() {}
}
