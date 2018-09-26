import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, map, retry } from 'rxjs/operators';

// constants
import { ApiPath } from '../constants';

// interfaces
import { PeopleItem } from '../interface/people.model';

// services
import { PeopleService } from '../../apps/people/services';

@Injectable()
export class PeopleLookupService {
  constructor(private peopleService: PeopleService) {}

  getUserById(ID: number) {
    // building url for http call
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${ID})`;
    url += `?$select=${this.peopleService.getSelectFields()}`;
    url += `&$expand=${this.peopleService.getExpandFields()}`;

    // Observable created from Promise
    const getUserById$ = from(sprLib.rest({ url, type: 'GET' }));

    return getUserById$.pipe(
      retry(3),
      take(1),
      map(user => user as PeopleItem[])
    );
  }
}
