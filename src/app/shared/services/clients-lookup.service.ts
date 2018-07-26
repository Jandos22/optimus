import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, map } from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';

// interfaces
import { ClientItem } from '../interface/clients.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsLookupService {
  constructor() {}

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
