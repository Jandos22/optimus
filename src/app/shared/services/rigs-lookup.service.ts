import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, map } from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';

// interfaces
import { RigItem } from '../interface/rigs.model';

@Injectable({
  providedIn: 'root'
})
export class RigsLookupService {
  constructor() {}

  getRigs(text: string) {
    // building url for http call
    let url = `${ApiPath}/web/lists/getByTitle('NgRigs')/items`;
    url += `?$select=${this.getSelect()}`;

    if (text) {
      url += `&$filter=substringof('${text}',Title)`;
    }

    // return only top 50 results
    url += `&$top=50`;

    // sort from A to Z
    url += `&$orderby=Title asc`;

    // nothing to expand
    // url += `&$expand=${this.getExpandRigs()}`;

    // Observable created from Promise
    const get$ = from(sprLib.rest({ url, type: 'GET' }));

    return get$.pipe(
      take(1),
      map(Rig => Rig as RigItem[])
    );
  }

  getSelect() {
    return ['Id', 'ID', 'Title'].toString();
  }

  getExpand() {
    return [].toString();
  }
}
