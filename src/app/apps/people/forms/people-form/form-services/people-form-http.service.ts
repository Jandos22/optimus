import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable, throwError, of, from } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  concatMap,
  take,
  retry
} from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from './../../../../../shared/constants/index';

// interface
import { SpGetListItemResult } from './../../../../../shared/interface/sp-list-item-field.model';
import {
  PeopleUpdatedPhoto,
  PeopleItem
} from './../../../../../shared/interface/people.model';

// services
import { SharepointService } from './../../../../../shared/services/sharepoint.service';

@Injectable()
export class PeopleFormHttpService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // receives unsavedFields and saves them in NgPeople list
  // returns object with saved fields or error
  updatePeopleItem(updatedFields): Observable<PeopleItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = sprLib
          .list({ name: 'NgPeople', ...fdv })
          .update(updatedFields);
        return from(update$.then(response => response));
      })
    );
  }
}
