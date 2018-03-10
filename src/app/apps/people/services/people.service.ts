import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { ApiPath } from '../../../constants';
import { hk_accept, hv_appjson } from '../../../constants/headers';

@Injectable()
export class PeopleService {
  constructor(private http: HttpClient) {}

  getPeople(location, query) {
    const select = '$select=Id,Alias,Name,Surname,Email,Gin,Location,Photo';
    let url = `${ApiPath}web/lists/getbytitle('NgPeople')/items`;

    if (query || location) {
      url += `?$filter=`;

      if (query) {
        url += `((substringof('${query}',Name))`;
        url += `or(substringof('${query}',Surname))`;
        url += `or(substringof('${query}',Alias))`;
        url += `or(substringof('${query}',Email))`;
        url += `or(substringof('${query}',Gin)))`;
      }

      if (query && location && location !== 'Global') {
        url += `and`;
      }

      if (location && location !== 'Global') {
        url += `(Location eq '${location}')`;
      }
    }

    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        map((response: any) => {
          if (response.d.results) {
            return response.d.results;
          }
        }),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
