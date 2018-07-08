import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
// import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ApiPath } from '../constants';
import { FDV } from '../interface/form-digest-value.model';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  constructor(private http: HttpClient) {}

  public getFDV() {
    const url = ApiPath + '/contextinfo';
    const headers = new HttpHeaders().set(
      'accept',
      'application/json;odata=verbose'
    );
    return this.http.post(url, { headers }).pipe(
      map((fdv: FDV) => {
        return { requestDigest: fdv.FormDigestValue };
      })
    );
  }
}
