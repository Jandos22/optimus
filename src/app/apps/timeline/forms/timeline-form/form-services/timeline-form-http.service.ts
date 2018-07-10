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
  reduce
} from 'rxjs/operators';

// constants
import { ApiPath } from '../../../../../shared/constants';

// interface
import {
  SpGetListItemResult,
  SpListItemAttachmentFile
} from '../../../../../shared/interface/sp-list-item.model';
import {
  TimelineEventItem,
  ToSaveEventImage
} from './../../../../../shared/interface/timeline.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';
import { TimelineService } from '../../../services';

@Injectable()
export class TimelineFormHttpService {
  constructor(private sp: SharepointService, private srv: TimelineService) {}

  // returns newly create PeopleItem object
  createEvent(newFields: TimelineEventItem) {
    const fdv$ = this.sp.getFDV();

    return fdv$.pipe(
      switchMap(fdv => {
        const create$ = new sprLib.list({
          name: 'NgTimeline',
          ...fdv
        }).create(newFields);
        return from(create$);
      })
    );
  }

  // receives unsavedFields and saves them in list
  // returns object with saved fields or error
  updateEventItem(updatedFields): Observable<TimelineEventItem> {
    // go ask for form digest value
    const fdv$ = this.sp.getFDV();
    // when get FDV then run HTTP to update list item
    return fdv$.pipe(
      switchMap(fdv => {
        const update$: Promise<any> = new sprLib.list({
          name: 'NgTimeline',
          ...fdv
        }).update(updatedFields);
        return from(update$.then(response => response));
      })
    );
  }

  saveImage(image: ToSaveEventImage) {
    // delete old files before any image saving
    return this.cleanUpAttachmentFiles(image).pipe(
      switchMap(success => {
        return this.uploadImage(image);
      })
    );
  }

  // if event already has images then delete it
  // if event doesn't have images than return green light for next action
  cleanUpAttachmentFiles(image: ToSaveEventImage) {
    // url constructed to get user object with Attachments and AttachmentsList
    let url = `${ApiPath}/web/lists/getByTitle('NgTimeline')/items(${
      image.ID
    })`;
    url += `?$select=Attachments,AttachmentFiles&$expand=AttachmentFiles`;

    const getItem$ = from(sprLib.rest({ url, type: 'GET' }));

    return getItem$.pipe(
      take(1),
      map((item: TimelineEventItem[]) => {
        console.log('cleaning up attachments: received item');
        console.log(item);

        // check if item has attachments
        if (item[0].Attachments) {
          // files and observable from files
          const files = item[0].AttachmentFiles.results;
          const files$: Observable<SpListItemAttachmentFile> = from(files);

          // run the pipe to delete files one by one
          return files$.pipe(
            take(Number(files.length)),
            concatMap(file => {
              return this.deleteFileByFilename(item[0].ID, file.FileName);
            }),
            reduce(
              (
                acc: SpListItemAttachmentFile[],
                curr: SpListItemAttachmentFile[]
              ) => {
                return [...acc, curr[0]];
              },
              []
            )
          );
        } else {
          return from([]) as Observable<SpListItemAttachmentFile[]>;
        }
      }),
      map(deleted => {
        console.log(
          'item checked for attachments and clean up done if was necessary'
        );
        console.log(deleted);
        return true;
      })
    );
  }

  deleteFileByFilename(id: number, filename: string) {
    const fdv$ = this.sp.getFDV();

    let url = `${ApiPath}/web/lists/getByTitle('NgTimeline')`;
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

  uploadImage(image: ToSaveEventImage) {
    const fdv$ = this.sp.getFDV();
    let url = `${ApiPath}/web/lists/getByTitle('NgTimeline')/items(${
      image.ID
    })`;
    url += `/AttachmentFiles/add(FileName='EventImage.jpg')`;
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
    let url = `${ApiPath}/web/lists/getbytitle('NgTimeline')/items(${ID})?`;
    url += `$select=${this.srv.getSelectFields()}`;
    url += `&$expand=${this.srv.getExpandFields()}`;
    return from(sprLib.rest({ url: url }));
  }
}
