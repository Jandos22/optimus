import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { throwError, of, from } from 'rxjs';
import { map, mergeMap, catchError, switchMap, take } from 'rxjs/operators';

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
    const search$ = this.getDataWithGivenUrl(url);
    return search$;
  }

  getDataWithGivenUrl(url) {
    const get$ = sprLib.rest({ url });
    return from(get$);
  }

  buildUrl(query: SearchParamsUser) {
    // api url for NgPeople
    let url = `${ApiPath}/web/lists/getbytitle('NgPeople')/items?`;

    // parameters
    const text = query.text.replace('#', '%23');
    const locations = query.locations;

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandsFields().toString()}`;

    // $filter
    if (text || locations.length) {
      url += `&$filter=`;
    }

    if (text) {
      url += `((substringof('${text}',Name))`;
      url += `or(substringof('${text}',Surname))`;
      url += `or(substringof('${text}',Alias))`;
      url += `or(substringof('${text}',Email))`;
      url += `or(substringof('${text}',Gin)))`;
    }

    if (text && locations.length) {
      url += 'and';
    }

    if (locations.length) {
      url += `${this.getFilterLocationAssigned(locations)}`;
    }

    // $orderby
    url += `&$orderby=Name asc`;

    // return combiner url string
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
}
