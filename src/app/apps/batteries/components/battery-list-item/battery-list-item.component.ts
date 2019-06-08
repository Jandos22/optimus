import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { BatteryItem } from '../../../../shared/interface/batteries.model';

@Component({
  selector: 'app-battery-list-item',
  styleUrls: ['battery-list-item.component.scss'],
  templateUrl: 'battery-list-item.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class BatteryListItemComponent {
  @Input()
  battery: BatteryItem;

  @Input()
  last: boolean;

  @Output()
  openForm = new EventEmitter<BatteryItem>();

  constructor() {}

  getHoursLeft(hours: number) {
    if (_.isNumber(hours)) {
      return `${70 - hours} hour(s) left`;
    } else {
      return 'unknown';
    }
  }

  getBatteryIcon(hours: number) {
    if (hours === 0) {
      return 'battery-full';
    }

    if (hours > 0 && hours < 17.5) {
      return 'battery-three-quarters';
    }

    if (hours >= 17.5 && hours < 35) {
      return 'battery-half';
    }

    if (hours >= 35 && hours < 52.5) {
      return 'battery-quarter';
    }

    if (hours >= 52.5) {
      return 'battery-empty';
    }
  }

  getBatteryLevel(hours: number, status: string) {
    if (status === 'Disposed') {
      return 'battery-no-charge';
    } else {
      // recieve hours used and depending on that,
      // return a class name that would then used to specify background color
      return hours === 0
        ? 'battery-new'
        : hours > 0 && hours < 70
        ? 'battery-has-charge'
        : (hours => 70)
        ? 'battery-no-charge'
        : 'not a valid number';
    }
  }

  getChipColor(status: string) {
    return status === 'New'
      ? ''
      : status === 'InUse'
      ? 'primary'
      : status === 'FmtOut' || status === 'Disposed'
      ? 'accent'
      : '';
  }
}
