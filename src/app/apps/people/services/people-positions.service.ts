import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// rxjs
import { map } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

// interfaces
import { UserPosition } from '../../../shared/interface/people.model';

@Injectable()
export class PeoplePositionsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getUserPositions() {
    const url = `${ApiPath}/web/lists/getbytitle('NgPeoplePositions')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$select', this.selectFields())
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value as UserPosition[];
        })
      );
  }

  selectFields() {
    return ['ID', 'Id', 'Title', 'AccessLevel'].toString();
  }
}
