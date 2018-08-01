import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { throwError, of, from } from 'rxjs';
import {
  map,
  mergeMap,
  catchError,
  switchMap,
  take,
  retry
} from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';
import { hk_accept, hv_appjson } from '../constants/headers';

import { SpResponse } from './../interface/sp-response.model';
import { SpGetListItemResult } from '../interface/sp-list-item.model';

// services
import { SharepointService } from './sharepoint.service';

// interfaces
import { SearchParamsUser } from '../interface/people.model';

@Injectable()
export class SearchUsersService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  searchUsers(query) {
    const url = this.buildUrl(query);
    const search$ = this.getDataWithGivenUrl(url).pipe(retry(3));
    return search$;
  }

  getDataWithGivenUrl(url) {
    const get$ = sprLib.rest({ url });
    return from(get$);
  }

  buildUrl(params: SearchParamsUser) {
    console.log(params);

    let url = `${ApiPath}/web/lists/getbytitle('NgPeople')/items?`;

    // filters
    const text = params.text.replace('#', '%23'); // otherwise http request will throw error
    const locations = params.locations; // locations must be ids array
    const positions = params.positions; // locations must be ids array

    const top = params.top;

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandsFields().toString()}`;

    // $filter add when any of these filter options present
    if (text || locations.length || positions) {
      url += `&$filter=`;
    }

    // text will search only in these fields
    // too many fields to search may slow down response time
    if (text) {
      url += `((substringof('${text}',Name))`;
      url += `or(substringof('${text}',Surname))`;
      url += `or(substringof('${text}',Alias))`;
      url += `or(substringof('${text}',Email))`;
      url += `or(substringof('${text}',Gin)))`;
    }

    // locations filter configuration
    // check if "AND" is needed
    // finds items with given location
    if (locations.length) {
      if (text) {
        url += 'and';
      }
      url += `${this.getFilterLocationAssigned(locations)}`;
    }

    // positions filter configuration
    // check if "AND" is needed
    // finds items with given positions
    if (positions.length) {
      if (text || positions.length) {
        url += 'and';
      }
      url += `${this.getFilterPositions(positions)}`;
    }

    // $orderby
    url += `&$orderby=Surname asc`;

    // $top
    if (top) {
      url += `&$top=${top}`;
    }

    // return combined url string
    return url;
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'Alias',
      'Name',
      'Surname',
      'Fullname',
      'Shortname',
      'Email',
      'Gin',
      'LocationAssignedId',
      'LocationAssigned/Id',
      'LocationAssigned/Title',
      'PositionId',
      'Position/Id',
      'Position/Title',
      //   'RolesId',
      //   'Roles/Id',
      //   'Roles/Title',
      'Attachments',
      'AttachmentFiles'
    ];
    return $select.toString();
  }

  getExpandsFields() {
    const $expand = [
      'AttachmentFiles',
      'LocationAssigned',
      'Position'
      //   'Roles'
    ];
    return $expand.toString();
  }

  getFilterLocationAssigned(locations: number[]) {
    if (locations.length) {
      // start with empty string
      let filter = '';

      // total number of locations in array
      const n = locations.length;

      // iterator should start with 1
      let i = 1;

      for (const location of locations) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(LocationAssigned/Id eq ${location})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last iteration, then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }

  getFilterPositions(positions: number[]) {
    if (positions.length) {
      let filter = '';
      const n = positions.length;
      let i = 1;

      for (const position of positions) {
        // if multiple positions then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(Position/Id eq ${position})`;

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
