import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import {
  HarcsSearchParams,
  HarcItem
} from '../../../shared/interface/harcs.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';
import { SpGetListItemResult } from '../../../shared/interface/sp-list-item.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class HarcsService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithNext(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        switchMap((response: SpResponse) => {
          // console.log(response);
          if (response.d.results) {
            return of(response);
          }
        })
      );
  }

  getData(url) {
    const get$ = from(sprLib.rest({ url }));
    return get$ as Observable<HarcItem[]>;
  }

  buildUrl(params: HarcsSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgHarcs')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text.replace('#', '%23');
    // locations must be ids array
    const locations = params.locations;
    let top = params.top;
    const status = params.status;

    let beforeDate = '',
      afterDate = '';

    if (params.beforeDate) {
      beforeDate = params.beforeDate.toISOString();
    }
    if (params.afterDate) {
      afterDate = params.afterDate.toISOString();
    }

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter
    if (text || locations.length || beforeDate || status) {
      url += `&$filter=`;
    }

    // text filter configuration
    if (text) {
      url += `(`;
      url += `(substringof('${text}',Title))`;
      url += `or(substringof('${text}',HashTags))`;
      url += `or(substringof('${text}',PendingActions))`;
      url += `or(substringof('${text}',Status))`;
      url += `)`;
    }

    if (locations.length) {
      // check if "AND" is needed
      if (text) {
        url += 'and';
      }
      // finds items with given location
      url += `${this.getFilterLocations(locations)}`;
    }

    if (status) {
      // check if "AND" is needed
      if (text || locations.length) {
        url += 'and';
      }
      url += `(Status eq '${status}')`;
    }

    if (beforeDate) {
      // check if "AND" is needed
      if (text || locations.length || status) {
        url += 'and';
      }
      // find items with ExpiryDate before given date
      url += `(ExpiryDate lt datetime'${beforeDate}')`;
    }

    // $orderby
    url += `&$orderby=ExpiryDate asc`;

    // $top
    if (top) {
      if (counter) {
        top = 500;
      }
      url += `&$top=${top}`;
    }

    // return combiner url string
    return url;
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'ExpiryDate',
      'Status',
      'PendingActions',
      'Title',
      'PICId',
      'PIC/ID',
      'PIC/Alias',
      'PIC/Fullname',
      'LocationId',
      'Location/Id',
      'Location/Title',
      'QuestNumber',
      'QuestQPID',
      'HashTags'
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = ['PIC', 'Location'];
    return $expand.toString();
  }

  getFilterLocations(locations: number[]) {
    if (locations.length) {
      let filter = '';
      const n = locations.length;
      let i = 1;

      for (const location of locations) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(Location/Id eq ${location})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }
}
