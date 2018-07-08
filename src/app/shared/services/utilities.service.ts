import { PeopleItem } from '../interface/people.model';
import { take } from 'rxjs/operators';
import { from } from 'rxjs';
import { Injectable } from '@angular/core';

// constants
import { SlbSpPath } from '../constants';

// interfaces
import { SpListItemAttachmentFiles } from '../interface/sp-list-item.model';
import { reduce } from 'bluebird';

@Injectable()
export class UtilitiesService {
  constructor() {}

  // a lot of components need to retrive user photo
  // which is the first file in results array
  // given that user.Attachments is true
  photoUrl(attachments: SpListItemAttachmentFiles[]) {
    if (attachments.length) {
      return SlbSpPath + attachments[0].ServerRelativeUrl;
    } else {
      return null;
    }
  }

  userPhoto(user: PeopleItem) {
    if (user.Attachments) {
      if (user.AttachmentFiles.results) {
        return SlbSpPath + user.AttachmentFiles.results[0].ServerRelativeUrl;
      } else {
        return 'assets/no_user.png';
      }
    } else {
      return 'assets/no_user.png';
    }
  }

  // Transform dataUrl to Blob
  dataURItoBlob(dataURI) {
    console.log(dataURI);
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }
}
