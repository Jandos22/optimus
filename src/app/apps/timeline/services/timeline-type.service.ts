import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// rxjs
import { map } from 'rxjs/operators';

// constants
import { ApiPath } from './../../../shared/constants/index';

// services
import { SharepointService } from './../../../shared/services/sharepoint.service';

// interfaces
import { TimelineEventType } from '../../../shared/interface/timeline.model';

@Injectable()
export class TimelineTypeService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // returns all exemptions for a given location
  getEventTypes() {
    const url = `${ApiPath}/web/lists/getbytitle('NgTimelineType')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams()
          .set('$select', this.selectFields())
          .append('$expand', this.expandFields())
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value as TimelineEventType[];
        })
      );
  }

  selectFields() {
    return ['ID', 'Id', 'Title', 'ApplicableTo/ID', 'ApplicableTo/Title'].toString();
  }

  expandFields() {
    return ['ApplicableTo'].toString();
  }
}
