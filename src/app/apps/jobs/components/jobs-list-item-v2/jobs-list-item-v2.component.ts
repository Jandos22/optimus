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

import * as _ from 'lodash';

// interfaces
import { JobItem } from '../../../../shared/interface/jobs.model';

@Component({
  selector: 'app-jobs-list-item-v2',
  styleUrls: ['jobs-list-item-v2.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './jobs-list-item-v2.component.html'
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

 openFDP(op_activity_num: string) {

  if (op_activity_num) {
    let fdp = _.split(op_activity_num, '.');

    window.open(
      `https://fdp.slb.com/apps/jobmanagement/#/operation/O.${fdp[1]}.${fdp[2]}/activity/${op_activity_num}/WL`,
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
