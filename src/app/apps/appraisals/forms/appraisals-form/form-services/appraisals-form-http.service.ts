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

import { AppraisalItem } from '../../../../../shared/interface/appraisals.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';
import { AppraisalsService } from '../../../services';

@Injectable()
export class AppraisalsFormHttpService {
  constructor(private sp: SharepointService, private srv: AppraisalsService) {}

  // returns newly created object
  createAppraisal(newFields: AppraisalItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        console.log(fdv);
        const create$ = new sprLib.list({
          name: 'NgAppraisals',
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateItem(updatedFields): Observable<AppraisalItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgAppraisals',
          ...fdv
        }).update(updatedFields);
        return from(update$);
      })
    );
  }

  getItemById(ID: number) {
    let url = `${ApiPath}/web/lists/getbytitle('${'NgAppraisals'}')/items(${ID})?`;
    url += `$select=${this.srv.getSelectFields()}`;
    url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
