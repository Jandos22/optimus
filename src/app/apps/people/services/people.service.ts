import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { throwError, of, from } from 'rxjs';
import { map, mergeMap, catchError, switchMap, take } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../shared/constants';
import { hk_accept, hv_appjson } from '../../../shared/constants/headers';

// interfaces
import {
  PeopleUpdatedPhoto,
  UserSearchParams
} from '../../../shared/interface/people.model';
import { SpResponse } from '../../../shared/interface/sp-response.model';
import { SpGetListItemResult } from '../../../shared/interface/sp-list-item.model';

// services
import { SharepointService } from '../../../shared/services/sharepoint.service';

@Injectable()
export class PeopleService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  getDataWithGivenUrl(url) {
    return this.http
      .get(url, {
        headers: new HttpHeaders().set(hk_accept, hv_appjson)
      })
      .pipe(
        switchMap((response: SpResponse) => {
          // console.log(response.d.results);
          if (response.d.results) {
            return of(response);
          }
        })
        // errors (if any) are caught in search effects
      );
  }

  updatePeopleItem(updatedFields) {
    console.log(updatedFields);
    const fdv$ = this.sp.getFDV();
    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const update$ = new sprLib.list({
          name: 'NgPeople',
          ...fdv
        }).update(updatedFields);

        return from(update$.then(response => response));
      })
    );
  }

  uploadPeopleItemPhoto(updatedPhoto: PeopleUpdatedPhoto) {
    // observable that
    // - receives true if user has file with given filename
    // - receives false if user doesn't have a file with given filename
    const checkByFilename$ = this.checkIfPhotoExists(updatedPhoto);
    const upload$ = this.uploadPhoto(updatedPhoto);
    const delete$ = this.deletePeopleItemPhoto(updatedPhoto);

    // listen to checkIfPhotoExists() results
    // - if user has file with given filename, then delete it
    // - after deletion of file, upload new file
    return checkByFilename$.pipe(
      mergeMap(hasPhoto => {
        console.log('has photo: ' + hasPhoto);
        if (hasPhoto) {
          // observable that
          // - true if photo successfully been deleted
          // - false if photo deletion thrown error
          return delete$.pipe(
            map(deleted => {
              console.log('deleted: ' + deleted);
              return upload$;
            })
            // last work here
          );
        } else {
          return upload$;
        }
      })
    );
  }

  checkIfPhotoExists(updatedPhoto: PeopleUpdatedPhoto) {
    console.log('check if photo exists');
    // url constructed to
    // - get user with Attachments and AttachmentsList
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')`;
    url += `/items(${updatedPhoto.ID})`;
    url += `?$select=Attachments,AttachmentFiles&$expand=AttachmentFiles`;

    const getUserObject$ = this.http.get(url, {
      headers: new HttpHeaders().set(hk_accept, hv_appjson)
    });

    return getUserObject$.pipe(
      take(1),
      map((result: SpGetListItemResult) => {
        console.log(result);
        let hasPhoto = false;
        // check if user has attachments
        if (result.d.Attachments) {
          // check for same Filename
          for (const file of result.d.AttachmentFiles.results) {
            if (file.FileName === updatedPhoto.Filename) {
              hasPhoto = true;
            }
          }
        }
        return hasPhoto;
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }

  uploadPhoto(updatedPhoto) {
    const fdv$ = this.sp.getFDV();
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${
      updatedPhoto.ID
    })`;
    url += `/AttachmentFiles/add(FileName='${updatedPhoto.Filename}')`;
    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const upload$: Promise<any> = sprLib.rest({
          url: url,
          type: 'POST',
          ...fdv,
          data: updatedPhoto.ArrayBuffer
        });
        return from(upload$.then(response => response));
      })
    );
  }

  deletePeopleItemPhoto(updatedPhoto: PeopleUpdatedPhoto) {
    const fdv$ = this.sp.getFDV();

    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')`;
    url += `/getItemById(${updatedPhoto.ID})`;
    url += `/AttachmentFiles/getByFileName('${updatedPhoto.Filename}')`;

    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const deleted$: Promise<any> = sprLib.rest({
          url: url,
          type: 'POST',
          headers: {
            Accept: 'application/json;odata=verbose',
            'X-HTTP-Method': 'DELETE',
            'If-Match': '*',
            'X-RequestDigest': fdv.requestDigest
          }
        });
        return from(
          deleted$.then(response => {
            console.log(response);
            return true;
          })
        );
      })
    );
  }

  createNewUser(userData) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const create$ = new sprLib.list({ name: 'NgPeople', ...fdv }).create(
          userData
        );
        return from(create$);
      })
    );
  }

  buildUrl(params: UserSearchParams, counter?: boolean) {
    // api url for NgPeople
    let url = `${ApiPath}/web/lists/getbytitle('NgPeople')/items?`;

    // parameters
    const query = params.query.replace('#', '%23');
    const locations = params.locations;
    let top = params.top;

    // $select & $expand
    url += `$select=${this.getSelectFields().toString()}`;
    url += `&$expand=${this.getExpandsFields().toString()}`;

    // $filter
    if (query || locations.length) {
      url += `&$filter=`;
    }

    if (query) {
      url += `((substringof('${query}',Name))`;
      url += `or(substringof('${query}',Surname))`;
      url += `or(substringof('${query}',Alias))`;
      url += `or(substringof('${query}',Email))`;
      url += `or(substringof('${query}',Gin)))`;
    }

    if (query && locations.length) {
      url += 'and';
    }

    if (locations.length) {
      url += `${this.getFilterLocationAssigned(locations)}`;
    }

    // $orderby
    url += `&$orderby=Name asc`;

    // $top
    if (top) {
      if (counter) {
        top = 500;
      }
      url += `&$top=${top}`;
    }

    // return combiner url string
    return url;
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'Alias',
      'Name',
      'Surname',
      'Fullname',
      'Shortname',
      'Email',
      'Gin',
      'LocationAssigned/Id',
      'LocationAssigned/Title',
      'LocationAssignedId',
      'PositionId',
      'Position/Id',
      'Position/Title',
      'RolesId',
      'Roles/Id',
      'Roles/Title',
      'Attachments',
      'AttachmentFiles'
    ];
    return $select.toString();
  }

  getExpandsFields() {
    const $expand = [
      'AttachmentFiles',
      'LocationAssigned',
      'Position',
      'Roles'
    ];
    return $expand.toString();
  }

  getFilterLocationAssigned(locations: number[]) {
    if (locations.length) {
      let filter = '';
      const n = locations.length;
      let i = 1;

      for (const location of locations) {
        // if multiple locations then wrap them in brackets
        if (i === 1 && n > 1) {
          filter += `(`;
        }

        filter += `(LocationAssigned/Id eq ${location})`;

        // if current iteration is not last then add 'or'
        if (n > 1 && n !== i) {
          filter += `or`;
        }

        // if last then close brackets
        if (n > 1 && i === n) {
          filter += `)`;
        }

        i++;
      }

      return filter;
    }
  }
}
