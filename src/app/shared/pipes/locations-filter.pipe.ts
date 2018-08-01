import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

// interfaces
import { LocationEnt } from '../interface/locations.model';

@Pipe({
  name: 'filterLocations'
})
export class LocationsFilterPipe implements PipeTransform {
  transform(locations: LocationEnt[], exclude: string[]) {
    // for debugging
    console.log(locations);
    console.log(exclude);

    // filter through array and check condition to pass
    return locations.filter(location => {
      const toExclude = _.find(exclude, exc => exc === location.Title);
      return !toExclude;
    });
  }
}
