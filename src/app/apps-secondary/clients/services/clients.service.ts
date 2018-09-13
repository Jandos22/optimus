import { Injectable } from '@angular/core';

// rxjs
import { Observable, of, from } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  concatMap,
  take,
  retry,
  mergeMap,
  reduce,
  tap
} from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

// interface
import {
  SpGetListItemResult,
  SpListItemAttachmentFile
} from '../../../shared/interface/sp-list-item.model';
import { ClientItem } from '../../../shared/interface/clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private sp: SharepointService) {}

  // returns newly create object
  create(columns: ClientItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgClients',
          ...fdv
        }).create(columns);
        return from(create$.then((v: any) => v as ClientItem));
      })
    );
  }

  getClients(text: string) {
    // building url for http call
    let url = `${ApiPath}/web/lists/getByTitle('NgClients')/items`;
    url += `?$select=${this.getSelect()}`;

    if (text) {
      url += `&$filter=substringof('${text}',Title)`;
    }

    // return only top 50 results
    url += `&$top=50`;

    // sort from A to Z
    url += `&$orderby=Title asc`;

    // nothing to expand
    // url += `&$expand=${this.getExpandClients()}`;

    // Observable created from Promise
    const get$ = from(sprLib.rest({ url, type: 'GET' }));

    return get$.pipe(
      take(1),
      map(Client => Client as ClientItem[])
    );
  }

  getSelect() {
    return ['Id', 'ID', 'Title'].toString();
  }

  getExpand() {
    return [].toString();
  }
}
