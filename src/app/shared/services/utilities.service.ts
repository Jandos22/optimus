import { take } from 'rxjs/operators';
import { from } from 'rxjs';
import { Injectable } from '@angular/core';

// constants
import { SlbSpPath } from './../constants/index';

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
}
