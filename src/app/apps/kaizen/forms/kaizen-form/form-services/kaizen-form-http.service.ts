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
import { KaizenProjectItem } from './../../../../../shared/interface/kaizen.model';
import { ToSaveOneImage } from '../../../../../shared/interface/shared.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';
import { KaizenService } from '../../../services';

@Injectable()
export class KaizenFormHttpService {
  constructor(private sp: SharepointService, private srv: KaizenService) {}

  // returns newly create PeopleItem object
  createProject(newFields: KaizenProjectItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgKaizen',
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateItem(updatedFields): Observable<KaizenProjectItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgKaizen',
          ...fdv
        }).update(updatedFields);
        return from(update$);
      })
    );
  }

  saveImage(image: ToSaveOneImage) {
    // delete old files before any image saving
    return this.cleanUpAttachmentFiles(image).pipe(
      switchMap(success => {
        console.log(success);
        return this.uploadImage(image);
      })
    );
  }

  // if project already has images then delete it
  // if project doesn't have images than return green light for next action
  cleanUpAttachmentFiles(image: ToSaveOneImage) {
    // url constructed to get user object with Attachments and AttachmentsList
    let url = `${ApiPath}/web/lists/getByTitle('NgKaizen')/items(${image.ID})`;
    url += `?$select=ID,Attachments,AttachmentFiles&$expand=AttachmentFiles`;

    const getItem$ = from(sprLib.rest({ url, type: 'GET' }));

    return getItem$.pipe(
      take(1),
      map((item: KaizenProjectItem[]) => {
        console.log('cleaning up attachments: received item');
        console.log(item);

        // check if item has attachments
        if (item[0].Attachments) {
          console.log('item has attachments, deleted them first');
          console.log(item[0].AttachmentFiles.results);
          return item[0].AttachmentFiles.results;
        } else {
          // no files to delete
          return [];
        }
      }),
      mergeMap(files => {
        console.log('received files for deletions:');
        console.log(files.length);

        const files$ = from(files);

        if (files.length) {
          return files$.pipe(
            take(files.length),
            concatMap(file => {
              return from(this.deleteFileByFilename(image.ID, file.FileName));
            }),
            tap(results => console.log('deleted all images'))
          );
        } else {
          return of(true);
        }
      })
    );
  }

  deleteFileByFilename(id: number, filename: string) {
    const fdv$ = this.sp.getFDV();

    let url = `${ApiPath}/web/lists/getByTitle('NgKaizen')`;
    url += `/getItemById(${id})`;
    url += `/AttachmentFiles/getByFileName('${filename}')`;

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
        return from(deleted$);
      })
    );
  }

  uploadImage(image: ToSaveOneImage) {
    const fdv$ = this.sp.getFDV();
    let url = `${ApiPath}/web/lists/getByTitle('NgKaizen')/items(${image.ID})`;
    url += `/AttachmentFiles/add(FileName='Image.jpg')`;
    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const upload$: Promise<any> = sprLib.rest({
          url: url,
          type: 'POST',
          ...fdv,
          data: image.ArrayBuffer
        });
        return from(upload$);
      })
    );
  }

  getItemById(ID: number) {
    let url = `${ApiPath}/web/lists/getbytitle('NgKaizen')/items(${ID})?`;
    url += `$select=${this.srv.getSelectFields()}`;
    url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
