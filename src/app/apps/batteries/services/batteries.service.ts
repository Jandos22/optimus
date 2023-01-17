import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

// rxjs
import { Observable, of, from } from "rxjs";
import { map, mergeMap, switchMap, take, retry } from "rxjs/operators";

// constants
import { ApiPath, WirelinePath } from "../../../shared/constants";
import { hk_accept, hv_appjson } from "../../../shared/constants/headers";

// interfaces
import { BatteriesSearchParams } from "../../../shared/interface/batteries.model";
import { SpResponse } from "../../../shared/interface/sp-response.model";

// services
import { SharepointService } from "../../../shared/services/sharepoint.service";

@Injectable()
export class BatteriesService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithNext(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        // retry(3),
        switchMap((response: SpResponse) => {
          // console.log(response);
          if (response.d.results) {
            return of(response);
          }
        })
      );
  }

  buildUrl(params: BatteriesSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgBatteries')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text ? params.text.replace("#", "%23") : null;

    // # status is a string
    const status = params.status ? params.status : "All";

    // const well = params.well ? params.well.replace('#', '%23') : null;

    // # locations must be ids array
    const locations = params.locations ? params.locations : [];

    // people arrays must be ids array
    // const engineers = params.engineers ? params.engineers : [];
    // const operators = params.operators ? params.operators : [];

    // # if top is missing then default is 100
    let top = params.top ? params.top : 100;

    // count filters
    let countFilters = 0;

    // job date
    // dates start with empty string
    // let beforeDate = '',
    //   afterDate = '';
    // // date object need to be converted into string (ISO)
    // if (params.beforeDate) {
    //   beforeDate = params.beforeDate.toISOString();
    // }
    // if (params.afterDate) {
    //   afterDate = params.afterDate.toISOString();
    // }

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter is added if one of these is not empty/null
    if (
      text ||
      locations.length ||
      status
      // afterDate ||
      // well ||
      // engineers.length
    ) {
      url += `&$filter=`;
    }

    if (text) {
      countFilters++;
      url += `(`;
      url += `(substringof('${text}',Serial))`;
      url += `or(substringof('${text}',PN))`;
      url += `)`;
    }

    // status filter configuration
    if (status && status !== "All") {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += "and";
      }

      if (status !== "All") {
        countFilters++;
        url += `(Status eq '${status}')`;
      }
    }

    // locations filter configuration
    if (locations.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += "and";
      }
      countFilters++;
      // finds items with given location
      url += `${this.getFilterLocations(locations)}`;
    }

    // $orderby
    url += `&$orderby=Serial asc`;

    // $top
    if (top) {
      if (counter) {
        top = 10000;
      }
      url += `&$top=${top}`;
    }

    // return combiner url string
    return url;
  }

  addAndOrNot(counter) {
    if (counter > 0) {
      return "and";
    } else {
      return "";
    }
  }

  getSelectFields() {
    const $select = [
      "Id",
      "ID",
      "Title",
      "Serial",
      "PN",
      "Hours",
      "Status",
      "RichText",
      "Location",
      "LocationId",
      "Location/Id",
      "Location/Title",
      "LastUpdated",
      "LastUpdatedBy",
      "LastUpdatedById",
      "LastUpdatedBy/Id",
      "LastUpdatedBy/Alias"
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = [
      "Location",
      "LastUpdatedBy"
      // 'Client',
      // 'Rig',
      // 'ToolsUsed',
      // 'Engineers',
      // 'Operators'
    ];
    return $expand.toString();
  }

  getFilterLocations(locations: number[]) {
    if (locations.length) {
      let filter = "";
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

  deleteItemById(id: number) {
    const fdv$ = this.sp.getFDV();

    const url = `${ApiPath}/web/lists/getByTitle('NgBatteries')/items(${id})`;

    return fdv$.pipe(
      retry(3),
      switchMap(fdv => {
        console.log(fdv);
        console.log("deleting: " + id);

        const delete$: Promise<any> = sprLib.rest({
          url: url,
          type: "POST",
          headers: {
            Accept: "application/json;odata=verbose",
            "X-HTTP-Method": "DELETE",
            "If-Match": "*",
            "X-RequestDigest": fdv.requestDigest
          }
        });
        return from(delete$);
      })
    );
  }
}
