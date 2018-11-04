import { ApiPath } from '../constants';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

// rxjs
import { map } from 'rxjs/operators';

// services
import { SharepointService } from './sharepoint.service';

// interfaces
import { AppItem } from '../interface/applications.model';

@Injectable({
  providedIn: 'root'
})
export class AppsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // returns all exemptions for a given location
  getAllApps() {
    const url = `${ApiPath}/web/lists/getbytitle('NgApps')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$select', this.selectFields())
      })
      .pipe(
        map((response: { value: AppItem[] }) => {
          return response.value;
        })
      );
  }

  selectFields() {
    return [
      'Id',
      'Title',
      'RouterLink',
      'AppPositionNumber',
      'Tooltip'
    ].toString();
  }

  expandFields() {
    return [''].toString();
  }
}
