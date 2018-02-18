import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { tap, map, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

import { User } from './../models/user.m';

import { ApiPath } from './../../../constants';
import { hk_accept, hv_appjson } from './../../../constants/headers';
import { SpResponse } from '../../../models/sp-response.m';

const ngPeople =
  'web/lists/getbytitle(%27NgPeople%27)/items?$select=Id,Alias,Name,Surname,Email,Gin,Location,Photo';

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getPeople(query: string, location: string): Observable<User[]> {
    let url = ApiPath + ngPeople;

    if (location && query) {
      url = url + '&$filter=(Location eq %27' + location + '%27)';
      url = url + ' and (';
      url = url + ' (substringof(%27' + query + '%27, Alias))';
      url = url + ' or (substringof(%27' + query + '%27, Name))';
      url = url + ' or (substringof(%27' + query + '%27, Surname))';
      url = url + ' or (substringof(%27' + query + '%27, Email))';
      url = url + ' or (substringof(%27' + query + '%27, Gin))';
      url = url + ')';
    } else if (!query) {
      url = url + '&$filter=(Location eq %27' + location + '%27)';
    }

    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        map((response: SpResponse) => {
          if (response.d.results) {
            return response.d.results;
          }
        }),
        catchError((error: any) => Observable.throw(error.json()))
      );
  }
}
