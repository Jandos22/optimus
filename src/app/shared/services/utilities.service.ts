import { PeopleItem } from './../interface/people.model';
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
}
