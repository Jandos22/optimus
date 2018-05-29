import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
// import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiPath } from './../constants';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  constructor(private http: HttpClient) {}

  public getFDV() {
    const url = ApiPath + 'contextinfo';
    const headers = new HttpHeaders().set(
      'accept',
      'application/json;odata=verbose'
    );
    return this.http.post(url, { headers }).pipe(tap(v => console.log(v)));
  }
}
