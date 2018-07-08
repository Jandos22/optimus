import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, map } from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';

// interfaces
import { PeopleItem } from '../interface/people.model';

@Injectable()
export class PeopleLookupService {
  constructor() {}

  getUserById(ID: number) {
    // building url for http call
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${ID})`;
    url += `?$select=ID,Alias,Fullname,Attachments,AttachmentFiles&$expand=AttachmentFiles`;

    // Observable created from Promise
    const getUserById$ = from(sprLib.rest({ url, type: 'GET' }));

    return getUserById$.pipe(
      take(1),
      map(user => user as PeopleItem)
    );
  }
}
