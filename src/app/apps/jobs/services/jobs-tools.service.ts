import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// rxjs
import { map } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

// interfaces
import { ToolItem } from '../../../shared/interface/tools.model';

@Injectable()
export class JobsToolsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getToolNames() {
    const url = `${ApiPath}/web/lists/getbytitle('NgTools')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$select', this.selectFields())
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value as ToolItem[];
        })
      );
  }

  selectFields() {
    return ['ID', 'Id', 'Title'].toString();
  }
}
