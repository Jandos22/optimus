import { ApiPath } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { of, from } from 'rxjs';
import { map, tap, take, concatMap } from 'rxjs/operators';

import { SharepointService } from './sharepoint.service';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // returns all exemptions for a given location
  getLocations() {
    const url = `${ApiPath}/web/lists/getbytitle('NgLocations')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams()
          .set('$select', this.selectFields())
          .append('$expand', this.expandFields())
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value;
        })
      );
  }

  updateLocationsOfInterest(object) {
    const fdv$ = this.sp.getFDV();
    return fdv$.pipe(
      take(1),
      concatMap(fdv => {
        console.log(fdv);

        const update$ = new sprLib.list({ name: 'NgPeople', ...fdv }).update(
          object
        );

        return from(update$.then(response => response));
      })
    );
  }

  selectFields() {
    return [
      'Id',
      'Title',
      'PositionInList',
      'ApplicationsInUse/ID',
      'ApplicationsInUse/Title',
      'ApplicationsInUse/RouterLink',
      'ApplicationsInUse/AppPositionNumber',
      'HasLocations',
      'HasLocationsId',
      'HasLocations/Title',
      'HasLocations/Id'
    ].toString();
  }

  expandFields() {
    return ['ApplicationsInUse', 'HasLocations'].toString();
  }
}
