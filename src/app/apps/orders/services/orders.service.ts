import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as subDays from 'date-fns/sub_days';

// rxjs
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, switchMap, take, retry } from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import {
  OrdersSearchParams,
  OrderItem
} from '../../../shared/interface/orders.model';
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

  getData(url) {
    const get$ = from(sprLib.rest({ url }));
    return get$ as Observable<OrderItem[]>;
  }

  buildUrl(params: OrdersSearchParams, counter?: boolean) {
    let url = `${ApiPath}/web/lists/getbytitle('NgOrders')/items?`;

    // parameters

    // # needs to be replaced, otherwise http request to sharepoint will through error
    const text = params.text ? params.text.replace('#', '%23') : null;

    // locations must be ids array
    const locations = params.locations ? params.locations : [];

    const orderName = params.orderName
      ? params.orderName.replace('#', '%23')
      : null;

    const lastUpdate = params.lastUpdate ? params.lastUpdate : null;

    const orderStatus = params.orderStatus ? params.orderStatus : null;

    const orderNumber = params.orderNumber
      ? params.orderNumber.replace('#', '%23')
      : null;

    const partNumber = params.partNumber
      ? params.partNumber.replace('#', '%23')
      : null;

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
    // url += `$select=${this.getSelectFields().toString()}`;
    // url += `&$expand=${this.getExpandFields().toString()}`;

    // $filter is added if one of these is not empty/null
    if (
      text ||
      locations.length ||
      beforeDate ||
      afterDate ||
      requestors.length
    ) {
      url += `$filter=`;
    }

    if (text) {
      countFilters++;
      url += `(substringof('${text}',OrderName))`;
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

    // ORDER NAME filter
    if (orderName) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `(substringof('${orderName}',OrderName))`;
    }

    // LAST UPDATE filter
    if (lastUpdate) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `${this.getFilterLastUpdate(lastUpdate)}`;
    }

    // ORDER STATUS filter
    if (orderStatus) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `${this.getFilterOrderStatus(orderStatus)}`;
    }

    // ORDER NUMBER filter
    if (orderNumber) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `${this.getFilterOrderNumber(orderNumber)}`;
    }

    // PART NUMBER filter
    if (partNumber) {
      // check if "AND" is needed
      if (countFilters > 0) {
        url += 'and';
      }
      countFilters++;
      url += `${this.getFilterPartNumber(partNumber)}`;
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

  getFilterLastUpdate(n: number) {
    // 1 for old
    // 2 for recent
    // 3 for orders without LastUpdateFlag

    let filter = '';

    // subtract 14 days from now
    const oldDate = subDays(Date.now(), 14).toISOString();

    if (n && n === 1) {
      filter += `(`;
      filter += `(LastUpdatedFlag eq 1)`;
      filter += `and(LastUpdated lt datetime'${oldDate}')`;
      filter += `)`;
    } else if (n && n === 2) {
      filter += `(`;
      filter += `(LastUpdatedFlag eq 1)`;
      filter += `and(LastUpdated gt datetime'${oldDate}')`;
      filter += `)`;
    } else if (n && n === 3) {
      filter += `(LastUpdatedFlag eq 0)`;
    } else {
      return '';
    }
    return filter;
  }

  getFilterOrderNumber(orderNumber: string) {
    let filter = '';
    if (orderNumber) {
      filter += `(`;
      filter += `(substringof('${orderNumber}',Ln01_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln02_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln03_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln04_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln05_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln06_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln07_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln08_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln09_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln10_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln11_OrderNumber))`;
      filter += `or(substringof('${orderNumber}',Ln12_OrderNumber))`;
      filter += `)`;
    } else {
      return '';
    }
    return filter;
  }

  getFilterPartNumber(partNumber: string) {
    let filter = '';
    if (partNumber) {
      filter += `(`;
      filter += `(substringof('${partNumber}',Ln01_PN))`;
      filter += `or(substringof('${partNumber}',Ln02_PN))`;
      filter += `or(substringof('${partNumber}',Ln03_PN))`;
      filter += `or(substringof('${partNumber}',Ln04_PN))`;
      filter += `or(substringof('${partNumber}',Ln05_PN))`;
      filter += `or(substringof('${partNumber}',Ln06_PN))`;
      filter += `or(substringof('${partNumber}',Ln07_PN))`;
      filter += `or(substringof('${partNumber}',Ln08_PN))`;
      filter += `or(substringof('${partNumber}',Ln09_PN))`;
      filter += `or(substringof('${partNumber}',Ln10_PN))`;
      filter += `or(substringof('${partNumber}',Ln11_PN))`;
      filter += `or(substringof('${partNumber}',Ln12_PN))`;
      filter += `)`;
    } else {
      return '';
    }
    return filter;
  }

  getFilterOrderStatus(orderStatusId: number) {
    let filter = '';
    if (orderStatusId) {
      filter += `(`;
      filter += `(Ln01_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln02_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln03_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln04_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln05_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln06_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln07_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln08_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln09_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln10_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln11_OrderStatusId eq ${orderStatusId})`;
      filter += `or(Ln12_OrderStatusId eq ${orderStatusId})`;
      filter += `)`;
    } else {
      return '';
    }
    return filter;
  }

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
