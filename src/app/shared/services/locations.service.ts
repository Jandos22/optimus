import { ApiPath } from './../../shared/constants/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  constructor(private http: HttpClient) {}

  // returns all exemptions for a given location
  getLocations() {
    const url = `${ApiPath}web/lists/getbytitle('NgLocations')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$select', `Id,Title`)
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value;
        })
      );
  }

  // method updates only LocationsOfInterest field
  // of a given user (item) in NgPeople list
  updateLocationsOfInterest(object): Promise<any> {
    return sprLib.list('NgPeople').update(object);
  }
}
