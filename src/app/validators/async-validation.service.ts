import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { ApiPath } from './../constants/index';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { URLSearchParams } from 'url';

@Injectable({
  providedIn: 'root'
})
export class AsyncValidationService {
  constructor(private http: HttpClient) {}

  // check if alias is already registered (unique? false) or not (unique? true)
  checkAliasUnique(alias: string): Observable<boolean> {
    const url = `${ApiPath}web/lists/getbytitle('NgPeople')/items?`;

    return this.http
      .get(url, {
        params: new HttpParams().set('$filter', `Alias eq '${alias}'`)
      })
      .pipe(
        map((response: { value: any[] }) => {
          console.log(response);
          return response.value.length ? false : true;
        })
      );
  }
}
