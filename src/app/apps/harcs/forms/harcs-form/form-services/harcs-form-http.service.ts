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
import { ApiPath } from '../../../../../shared/constants';

// interface
import {
  SpGetListItemResult,
  SpListItemAttachmentFile
} from '../../../../../shared/interface/sp-list-item.model';
import { HarcItem } from './../../../../../shared/interface/harcs.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';
import { HarcsService } from '../../../services';

@Injectable()
export class HarcsFormHttpService {
  constructor(private sp: SharepointService, private srv: HarcsService) {}

  // returns newly create PeopleItem object
  createHarc(newFields: HarcItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgHarcs',
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateItem(updatedFields): Observable<HarcItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgHarcs',
          ...fdv
        }).update(updatedFields);
        return from(update$);
      })
    );
  }

  getItemById(ID: number) {
    let url = `${ApiPath}/web/lists/getbytitle('NgHarcs')/items(${ID})?`;
    url += `$select=${this.srv.getSelectFields()}`;
    url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
