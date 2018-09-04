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

// interface
import { FieldItem } from '../../../shared/interface/fields.model';
import {
  SpGetListItemResult,
  SpListItemAttachmentFile
} from '../../../shared/interface/sp-list-item.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class FieldsService {
  constructor(private sp: SharepointService) {}

  // returns newly create PeopleItem object
  create(columns: FieldItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgFields',
          ...fdv
        }).create(columns);
        return from(create$.then((v: any) => v as FieldItem));
      })
    );
  }

  //   // receives unsavedFields and saves them in list
  //   // returns object with saved fields or error
  //   updateItem(updatedFields): Observable<JobItem> {
  //     // go ask for form digest value
  //     const fdv$ = this.sp.getFDV();
  //     // when get FDV then run HTTP to update list item
  //     return fdv$.pipe(
  //       switchMap(fdv => {
  //         const update$: Promise<any> = new sprLib.list({
  //           name: 'NgJobs',
  //           ...fdv
  //         }).update(updatedFields);
  //         return from(update$);
  //       })
  //     );
  //   }

  //   getItemById(ID: number) {
  //     let url = `${ApiPath}/web/lists/getbytitle('NgJobs')/items(${ID})?`;
  //     url += `$select=${this.srv.getSelectFields()}`;
  //     url += `&$expand=${this.srv.getExpandFields()}`;
  //     return from(sprLib.rest({ url: url }));
  //   }
}
