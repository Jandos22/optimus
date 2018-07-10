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
    url += `?$select=${this.getSelectFields()}`;
    url += `&$expand=${this.getExpandFields()}`;

    // Observable created from Promise
    const getUserById$ = from(sprLib.rest({ url, type: 'GET' }));

    return getUserById$.pipe(
      take(1),
      map(user => user as PeopleItem)
    );
  }

  getSelectFields() {
    return [
      'Id',
      'Name',
      'Surname',
      'Fullname',
      'Alias',
      'Attachments',
      'AttachmentFiles',
      'LocationAssignedId',
      'LocationAssigned/Title',
      'LocationsOfInterestId',
      'LocationsOfInterest/Title',
      'PositionId',
      'Position/Title',
      'Position/AccessLevel',
      'Roles',
      'Roles/Id',
      'Roles/Title'
    ].toString();
  }

  getExpandFields() {
    return [
      'AttachmentFiles',
      'LocationAssigned',
      'LocationsOfInterest',
      'Position',
      'Roles'
    ].toString();
  }
}
