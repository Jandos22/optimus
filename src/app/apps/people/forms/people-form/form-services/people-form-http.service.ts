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
  retry,
  mergeMap
} from 'rxjs/operators';

// constants
import { ApiPath, WirelinePath } from '../../../../../shared/constants';

// interface
import { SpGetListItemResult } from '../../../../../shared/interface/sp-list-item.model';
import {
  PeopleUpdatedPhoto,
  PeopleItem,
  ToSaveUserPhoto
} from '../../../../../shared/interface/people.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';

@Injectable()
export class PeopleFormHttpService {
  constructor(private http: HttpClient, private sp: SharepointService) {}

  // returns newly create PeopleItem object
  addUser(newFields: PeopleItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgPeople',
          ...fdv
        }).create(newFields);
        return from(create$.then(res => res));
      })
    );
  }

  // receives unsavedFields and saves them in NgPeople list
  // returns object with saved fields or error
  updatePeopleItem(updatedFields): Observable<PeopleItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgPeople',
          ...fdv
        }).update(updatedFields);
        return from(update$.then(response => response));
      })
    );
  }

  saveNewPhoto(photo: ToSaveUserPhoto) {
    return this.cleanUpAttachmentFiles(photo).pipe(
      switchMap(_ => {
        return this.uploadPhoto(photo);
      })
    );
  }

  // if user already has photo then delete it
  // if user doesn't have photo than return green light for next action
  cleanUpAttachmentFiles(photo: ToSaveUserPhoto) {
    // url constructed to get user object with Attachments and AttachmentsList
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${photo.ID})`;
    url += `?$select=Attachments,AttachmentFiles&$expand=AttachmentFiles`;

    const getUserObject$ = from(sprLib.rest({ url, type: 'GET' }));

    return getUserObject$.pipe(
      take(1),
      map((user: any) => {
        console.log(user);
        let hasPhoto = false;
        // check if user has attachments
        if (user[0].Attachments) {
          // check for same Filename
          for (const file of user[0].AttachmentFiles.results) {
            console.log(file);
            if (file.FileName === photo.Filename) {
              hasPhoto = true;
            }
          }
        }
        return hasPhoto;
      }),
      switchMap(hasPhoto => {
        console.log(hasPhoto);
        return hasPhoto ? this.deletePhotoByFilename(photo) : of(true);
      })
    );
  }

  deletePhotoByFilename(photo: ToSaveUserPhoto) {
    const fdv$ = this.sp.getFDV();

    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')`;
    url += `/getItemById(${photo.ID})`;
    url += `/AttachmentFiles/getByFileName('${photo.Filename}')`;

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

  uploadPhoto(photo: ToSaveUserPhoto) {
    const fdv$ = this.sp.getFDV();
    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${photo.ID})`;
    url += `/AttachmentFiles/add(FileName='${photo.Filename}')`;
    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const upload$: Promise<any> = sprLib.rest({
          url: url,
          type: 'POST',
          ...fdv,
          data: photo.ArrayBuffer
        });
        return from(upload$.then(response => response));
      })
    );
  }

  getUserById(ID: number) {
    let url = `${ApiPath}/web/lists/getbytitle('NgPeople')/items(${ID})?`;
    url += `$select=${this.getSelectFields()}`;
    url += `&$expand=${this.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }

  getSelectFields() {
    const $select = [
      'Id',
      'ID',
      'Alias',
      'Name',
      'Surname',
      'Fullname',
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

  getExpandFields() {
    const $expand = [
      'AttachmentFiles',
      'LocationAssigned',
      'Position',
      'Roles'
    ];
    return $expand.toString();
  }
}
