import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// rxjs
import { map } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

// interfaces
import { OrderStatus } from '../../../shared/interface/orders.model';

@Injectable()
export class OrdersFetchService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getOrderStatuses() {
    const url = `${ApiPath}/web/lists/getbytitle('NgOrdersStatus')/items?`;
    return this.http
      .get(url, {
        params: new HttpParams().set('$select', 'Id,Title,PositionInList')
      })
      .pipe(
        map((response: { value: any[] }) => {
          return response.value as OrderStatus[];
        })
      );
  }
}
