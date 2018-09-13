import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, map } from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';

// interfaces
// import { PeopleItem } from '../interface/people.model';
import { FieldItem } from '../interface/fields.model';

@Injectable()
export class FieldsLookupService {
  constructor() {}

  getFields(text: string | FieldItem) {
    // building url for http call
    let url = `${ApiPath}/web/lists/getByTitle('NgFields')/items`;
    url += `?$select=${this.getSelectFields()}`;

    if (text) {
      url += `&$filter=substringof('${text}',Title)`;
    }

    // return only top 50 results
    url += `&$top=50`;

    // sort from A to Z
    url += `&$orderby=Title asc`;

    // nothing to expand
    // url += `&$expand=${this.getExpandFields()}`;

    // Observable created from Promise
    const get$ = from(sprLib.rest({ url, type: 'GET' }));

    return get$.pipe(
      take(1),
      map(field => field as FieldItem[])
    );
  }

  getSelectFields() {
    return ['Id', 'ID', 'Title'].toString();
  }

  getExpandFields() {
    return [].toString();
  }
}
