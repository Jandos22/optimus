import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import { JobsSearchParams } from '../../../shared/interface/jobs.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class JobsService {
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

  buildUrl(params: JobsSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgJobs')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text.replace('#', '%23');
    // locations must be ids array
    const locations = params.locations;
    let top = params.top;

    // job date
    // dates start with empty string
    let beforeDate = '',
      afterDate = '';
    // date object need to be converted into string (ISO)
    if (params.beforeDate) {
      beforeDate = params.beforeDate.toISOString();
    }
    if (params.afterDate) {
      afterDate = params.afterDate.toISOString();
    }

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter is added if one of these is not empty/null
    if (text || locations.length || beforeDate || afterDate) {
      url += `&$filter=`;
    }

    if (text) {
      url += `(`;
      url += `(substringof('${text}',Title))`;
      url += `or(substringof('${text}',iDistrict))`;
      url += `or(substringof('${text}',Well))`;
      url += `or(substringof('${text}',Field))`;
      url += `or(substringof('${text}',Client))`;
      url += `or(substringof('${text}',Rig))`;
      url += `or(substringof('${text}',JSStitle1))`;
      url += `or(substringof('${text}',JSStitle2))`;
      url += `or(substringof('${text}',JSStitle3))`;
      url += `or(substringof('${text}',JSStitle4))`;
      url += `or(substringof('${text}',JSStitle5))`;
      url += `or(substringof('${text}',JSStitle6))`;
      url += `or(substringof('${text}',JSStitle7))`;
      url += `or(substringof('${text}',JSStitle8))`;
      url += `or(substringof('${text}',JSSbody1))`;
      url += `or(substringof('${text}',JSSbody2))`;
      url += `or(substringof('${text}',JSSbody3))`;
      url += `or(substringof('${text}',JSSbody4))`;
      url += `or(substringof('${text}',JSSbody5))`;
      url += `or(substringof('${text}',JSSbody6))`;
      url += `or(substringof('${text}',JSSbody7))`;
      url += `or(substringof('${text}',JSSbody8))`;
      url += `)`;
    }

    if (text && locations.length) {
      url += 'and';
    }

    // locations filter configuration
    if (locations.length) {
      // check if "AND" is needed
      if (text) {
        url += 'and';
      }
      // finds items with given location
      url += `${this.getFilterLocations(locations)}`;
    }

    // beforeDate filter configuration
    if (beforeDate) {
      // check if "AND" is needed
      if (text || locations.length) {
        url += 'and';
      }
      // find items with RigUpStart before given date
      url += `(RigUpStart lt datetime'${beforeDate}')`;
    }

    // $orderby
    url += `&$orderby=RigUpStart desc`;

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
      'Title',
      'iDistrict',
      'JobType',
      'Well',
      'Field',
      'FieldId',
      'Field/Id',
      'Field/Title',
      'Client',
      'ClientId',
      'Client/Id',
      'Client/Title',
      'Rig',
      'RigId',
      'Rig/Id',
      'Rig/Title',
      'TotalDepth',
      'TotalDepthUnits',
      'MaxDeviation',
      'RigUpStart',
      'RigUpEnd',
      'JobDuration',
      'ToolsUsedId',
      'ToolsUsed/Id',
      'ToolsUsed/Title',
      'SummarySections',
      'JSStitle1',
      'JSStitle2',
      'JSStitle3',
      'JSStitle4',
      'JSStitle5',
      'JSStitle6',
      'JSStitle7',
      'JSStitle8',
      'JSSbody1',
      'JSSbody2',
      'JSSbody3',
      'JSSbody4',
      'JSSbody5',
      'JSSbody6',
      'JSSbody7',
      'JSSbody8',
      'LocationId',
      'Location/Id',
      'Location/Title'
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = ['Location', 'Field', 'Client', 'Rig', 'ToolsUsed'];
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
