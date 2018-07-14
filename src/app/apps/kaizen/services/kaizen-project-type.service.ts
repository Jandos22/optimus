import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// rxjs
import { map } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

// interfaces
import { KaizenProjectType } from '../../../shared/interface/kaizen.model';

@Injectable()
export class KaizenProjectTypeService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getProjectTypes() {
    const url = `${ApiPath}/web/lists/getbytitle('NgKaizenType')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams()
          .set('$select', this.selectFields())
          .append('$expand', this.expandFields())
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value as KaizenProjectType[];
        })
      );
  }

  selectFields() {
    return [
      'ID',
      'Id',
      'Title',
      'ApplicableTo/ID',
      'ApplicableTo/Title'
    ].toString();
  }

  expandFields() {
    return ['ApplicableTo'].toString();
  }
}
