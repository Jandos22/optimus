import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as _ from 'lodash';

import { LocationEnt } from '../../../../shared/interface/locations.model';

@Component({
  selector: `app-locations-card`,
  styleUrls: ['locations-card.component.scss'],
  template: `
    {{ show }}
    `
})
export class LocationsCardComponent implements OnChanges {
  @Input()
  locations: LocationEnt[] | LocationEnt;

  // locations to show coverted from array
  show: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.locations && changes.locations.currentValue) {
      this.stringify(changes.locations.currentValue);
    }
  }

  stringify(locations: LocationEnt[] | LocationEnt) {
    // locations can be a single object or array of objects

    // if array
    if (_.isArray(locations)) {
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

    // if single object
    if (_.isPlainObject(locations)) {
      const location = locations as LocationEnt;
      this.show = location.Title;
    }
  }
}
