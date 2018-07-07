import { Pipe, PipeTransform } from '@angular/core';

// import * as _ from 'lodash';

// interfaces
import { LocationEnt } from './../interface/locations.model';

@Pipe({
  name: 'selectLocations'
})
export class SelectLocationsPipe implements PipeTransform {
  transform(locations: LocationEnt[], locationAssignedId: number, accessLevel: number) {

    // for debugging
    // console.log(locations);
    // console.log(locationAssignedId);
    // console.log(accessLevel);

    // filter through array and check condition to pass
    return locations.filter(location => {

      if (accessLevel) {

        // users with Access Level 1 can select only TEST location
        // users are GUESTs, Shared Accounts, Interns
        if (accessLevel === 1 && location.Title === 'TEST') {
          return true;

        // users with Access Level 2 can select TEST location
        // users are mostly Operators, which don't have good English
        } else if (accessLevel === 2 && location.Title === 'TEST') {
          return true;

        // users with Access Level 3 can select own location
        // users are mostly Engineers, which have fluent English
        } else if (accessLevel === 3 && location.ID === locationAssignedId) {
          return true;

        // users with Access Level 4 can select all locations, but not Global
        // users are mostly Line Managers, which can better judge
        // if some content can be shared between locations
        } else if (accessLevel === 4 && location.Title !== 'Global') {
          return true;

        // users with Access Level 5 can select all locations
        // users are mostly OU Managers, which can better judge
        // if some content can be shared globally
        } else if (accessLevel === 5) {
          return true;
        }

      } else {
        // if user's access level is 0, undefined or null
        // then don't pass location
        return false;
      }

    });
  }
}
