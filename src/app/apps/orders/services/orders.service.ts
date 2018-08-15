import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take, retry } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import { OrdersSearchParams } from '../../../shared/interface/orders.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithNext(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        retry(3),
        switchMap((response: SpResponse) => {
          console.log(response);
          if (response.d.results) {
            return of(response);
          }
        })
      );
  }

  buildUrl(params: OrdersSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgOrders')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text ? params.text.replace('#', '%23') : null;

    // locations must be ids array
    const locations = params.locations ? params.locations : [];
    // people arrays must be ids array
    const requestors = params.requestors ? params.requestors : [];

    // if top is missing then default is 100
    let top = params.top ? params.top : 100;

    // count filters
    let countFilters = 0;

    // order date
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
    if (
      text ||
      locations.length ||
      beforeDate ||
      afterDate ||
      requestors.length
    ) {
      url += `&$filter=`;
    }

    if (text) {
      countFilters++;
      url += `(`;
      url += `(substringof('${text}',OrderName))`;
      url += `or(substringof('${text}',Ln01))`;
      url += `or(substringof('${text}',Ln01_PN))`;
      url += `or(substringof('${text}',Ln01_OrderNumber))`;
      url += `or(substringof('${text}',Ln01_Comments))`;
      url += `or(substringof('${text}',Ln02))`;
      url += `or(substringof('${text}',Ln02_PN))`;
      url += `or(substringof('${text}',Ln02_OrderNumber))`;
      url += `or(substringof('${text}',Ln02_Comments))`;
      url += `or(substringof('${text}',Ln03))`;
      url += `or(substringof('${text}',Ln03_PN))`;
      url += `or(substringof('${text}',Ln03_OrderNumber))`;
      url += `or(substringof('${text}',Ln03_Comments))`;
      url += `or(substringof('${text}',Ln04))`;
      url += `or(substringof('${text}',Ln04_PN))`;
      url += `or(substringof('${text}',Ln04_OrderNumber))`;
      url += `or(substringof('${text}',Ln04_Comments))`;
      url += `or(substringof('${text}',Ln05))`;
      url += `or(substringof('${text}',Ln05_PN))`;
      url += `or(substringof('${text}',Ln05_OrderNumber))`;
      url += `or(substringof('${text}',Ln05_Comments))`;
      url += `or(substringof('${text}',Ln06))`;
      url += `or(substringof('${text}',Ln06_PN))`;
      url += `or(substringof('${text}',Ln06_OrderNumber))`;
      url += `or(substringof('${text}',Ln06_Comments))`;
      url += `or(substringof('${text}',Ln07))`;
      url += `or(substringof('${text}',Ln07_PN))`;
      url += `or(substringof('${text}',Ln07_OrderNumber))`;
      url += `or(substringof('${text}',Ln07_Comments))`;
      url += `or(substringof('${text}',Ln08))`;
      url += `or(substringof('${text}',Ln08_PN))`;
      url += `or(substringof('${text}',Ln08_OrderNumber))`;
      url += `or(substringof('${text}',Ln08_Comments))`;
      url += `or(substringof('${text}',Ln09))`;
      url += `or(substringof('${text}',Ln09_PN))`;
      url += `or(substringof('${text}',Ln09_OrderNumber))`;
      url += `or(substringof('${text}',Ln09_Comments))`;
      url += `or(substringof('${text}',Ln10))`;
      url += `or(substringof('${text}',Ln10_PN))`;
      url += `or(substringof('${text}',Ln10_OrderNumber))`;
      url += `or(substringof('${text}',Ln10_Comments))`;
      url += `or(substringof('${text}',Ln11))`;
      url += `or(substringof('${text}',Ln11_PN))`;
      url += `or(substringof('${text}',Ln11_OrderNumber))`;
      url += `or(substringof('${text}',Ln11_Comments))`;
      url += `or(substringof('${text}',Ln12))`;
      url += `or(substringof('${text}',Ln12_PN))`;
      url += `or(substringof('${text}',Ln12_OrderNumber))`;
      url += `or(substringof('${text}',Ln12_Comments))`;
      url += `)`;
    }

    // locations filter configuration
    if (locations.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      // finds items with given location
      url += `${this.getFilterLocations(locations)}`;
    }

    // beforeDate filter configuration
    if (beforeDate) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `(OrderDate lt datetime'${beforeDate}')`;
    }

    // afterDate filter configuration
    if (afterDate) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `(OrderDate gt datetime'${afterDate}')`;
    }

    if (requestors.length) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `${this.getFilterRequestors(requestors)}`;
    }

    // $orderby
    url += `&$orderby=OrderDate desc`;

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
      'OrderName',
      'OrderDate',
      'Location',
      'LocationId',
      'Location/Id',
      'Location/Title',
      'Requestor',
      'RequestorId',
      'Requestor/Id',
      'Requestor/Shortname',
      'Requestor/Fullname',
      'ActiveLineItems',
      // #1
      'Ln01_Title',
      'Ln01_Qty',
      'Ln01_PN',
      'Ln01_OrderNumber',
      'Ln01_OrderStatusId',
      'Ln01_Comments',
      // #2
      'Ln02_Title',
      'Ln02_Qty',
      'Ln02_PN',
      'Ln02_OrderNumber',
      'Ln02_OrderStatusId',
      'Ln02_Comments',
      // #3
      'Ln03_Title',
      'Ln03_Qty',
      'Ln03_PN',
      'Ln03_OrderNumber',
      'Ln03_OrderStatusId',
      'Ln03_Comments',
      // #4
      'Ln04_Title',
      'Ln04_Qty',
      'Ln04_PN',
      'Ln04_OrderNumber',
      'Ln04_OrderStatusId',
      'Ln04_Comments',
      // #5
      'Ln05_Title',
      'Ln05_Qty',
      'Ln05_PN',
      'Ln05_OrderNumber',
      'Ln05_OrderStatusId',
      'Ln05_Comments',
      // #6
      'Ln06_Title',
      'Ln06_Qty',
      'Ln06_PN',
      'Ln06_OrderNumber',
      'Ln06_OrderStatusId',
      'Ln06_Comments',
      // #7
      'Ln07_Title',
      'Ln07_Qty',
      'Ln07_PN',
      'Ln07_OrderNumber',
      'Ln07_OrderStatusId',
      'Ln07_Comments',
      // #8
      'Ln08_Title',
      'Ln08_Qty',
      'Ln08_PN',
      'Ln08_OrderNumber',
      'Ln08_OrderStatusId',
      'Ln08_Comments',
      // #9
      'Ln09_Title',
      'Ln09_Qty',
      'Ln09_PN',
      'Ln09_OrderNumber',
      'Ln09_OrderStatusId',
      'Ln09_Comments',
      // #10
      'Ln10_Title',
      'Ln10_Qty',
      'Ln10_PN',
      'Ln10_OrderNumber',
      'Ln10_OrderStatusId',
      'Ln10_Comments',
      // #11
      'Ln11_Title',
      'Ln11_Qty',
      'Ln11_PN',
      'Ln11_OrderNumber',
      'Ln11_OrderStatusId',
      'Ln11_Comments',
      // #12
      'Ln12_Title',
      'Ln12_Qty',
      'Ln12_PN',
      'Ln12_OrderNumber',
      'Ln12_OrderStatusId',
      'Ln12_Comments',
      // update history
      'LastUpdated',
      'LastUpdatedBy',
      'LastUpdatedById',
      'LastUpdatedBy/Id',
      'LastUpdatedBy/Fullname',
      'LastUpdatedBy/Shortname',
      'LastUpdatedFlag'
    ];
    return $select.toString();
  }

  getExpandFields() {
    const $expand = ['Requestor', 'Location', 'LastUpdatedBy'];
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

  // getFilterWell(well: string) {
  //   if (well) {
  //     return `(substringof('${well}',Well))`;
  //   } else {
  //     return '';
  //   }
  // }

  getFilterRequestors(requestors: number[]) {
    if (requestors.length) {
      let filter = '';
      const n = requestors.length;
      let i = 1;

      for (const requestor of requestors) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(Requestor/Id eq ${requestor})`;

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
