import { SpResponse } from './../../../models/sp-response.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

// constants
import { ApiPath } from '../../../constants';
import { hk_accept, hv_appjson } from '../../../constants/headers';

// interfaces
import { PeopleParams } from './../models/people-params.model';

@Injectable()
export class PeopleService {
  constructor(private http: HttpClient) {}

  getPeopleWithGivenUrl(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        map((response: SpResponse) => {
          if (response.d.results) {
            return response;
          }
        }),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }

  buildUrlToGetPeople(params: PeopleParams) {
    const query = params.query;
    const location = params.location;
    const top = params.top;

    // api url for NgPeople
    let url = `${ApiPath}web/lists/getbytitle('NgPeople')/items`;

    // select only following fields
    const select = '?$select=Id,Alias,Name,Surname,Email,Gin,Location,Photo';
    url += select;

    // $filter by following specific query
    if (query || location) {
      if (query || location !== 'Global') {
        url += `&$filter=`;
      }

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

    // $orderby
    url += `&$orderby=Name desc`;

    // $top
    url += `&$top=${top}`;

    return url;
  }
}
