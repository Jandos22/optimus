import { Injectable } from '@angular/core';

// interface
import { PeopleItem } from './../../../shared/interface/people.model';

// constants
import { PathSlbSp, PathOptimus } from '../../../shared/constants';

@Injectable()
export class PeopleFormPhotoService {
  constructor() {}

  getDataForPhotoDialogBox(user: PeopleItem) {
    if (user.Attachments) {
      return {
        hasPhoto: true,
        photoUrl:
          `${PathSlbSp}` + user.AttachmentFiles.results[0].ServerRelativeUrl
      };
    } else {
      return {
        hasPhoto: false,
        photoUrl: ''
      };
    }
  }

  getNoPhotoUrl() {
    return PathOptimus + '/assets/no_user_photo.jpg';
  }
}
