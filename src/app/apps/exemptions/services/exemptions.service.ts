import { ApiPath } from './../../../constants/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// service is used in following module(s)
import { ExemptionsModule } from '../exemptions.module';

// rxjs
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: ExemptionsModule
})
export class ExemptionsService {
  constructor(private http: HttpClient) {}

  // returns all exemptions for a given location
  getExemptionsOfLocation(location: string) {
    const url = `${ApiPath}web/lists/getbytitle('NgExemptions')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$filter', `Location eq '${location}'`)
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value;
        })
      );
  }

  // returns all exemption groups for a given location
  getExemptionsGroupsOfLocation(location: string) {
    const url = `${ApiPath}web/lists/getbytitle('NgExemptionGroups')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$filter', `Location eq '${location}'`)
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value;
        })
      );
  }
}
