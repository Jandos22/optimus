import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';
import { LocationEnt } from '../../../../../shared/interface/locations.model';

@Component({
  selector: 'app-timeline-event-locations',
  styleUrls: ['timeline-event-locations.component.scss'],
  template: `
    {{ show }}
    `
})
export class TimelineEventLocationsComponent implements OnChanges {
  @Input()
  locations: LocationEnt[];

  // locations to show coverted from array
  show: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations && changes.locations.currentValue) {
      this.stringify(changes.locations.currentValue);
    }
  }

  stringify(locations: LocationEnt[]) {
    // create array of location titles like [ KZTZ, KZAS ]
    const array = _.reduce(
      locations,
      (acc: LocationEnt[], item: LocationEnt) => {
        return [...acc, item.Title];
      },
      []
    );

    // join all array elements and separate the with comma-space
    this.show = _.join(array, ', ');
  }
}
