import { ApiPath } from './../../../../../shared/constants/index';
import { FormMode } from './../../../../../shared/interface/form.model';
import { Injectable } from '@angular/core';

// interface
import { PeopleItem } from '../../../../../shared/interface/people.model';

// constants
import { PathSlbSp, PathOptimus } from '../../../../../shared/constants';

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

  getFileName(item: PeopleItem) {
    if (item.Attachments) {
      return item.AttachmentFiles.results[0].FileName;
    } else {
      return item.Alias + '.jpg';
    }
  }

  getPhotoUrl(item: PeopleItem) {
    if (item.Attachments) {
      const photoUrl = ApiPath.startsWith('_') ? PathSlbSp : '';
      return photoUrl + item.AttachmentFiles.results[0].ServerRelativeUrl;
    } else {
      return this.getNoPhotoUrl();
    }
  }

  getNoPhotoUrl() {
    return PathOptimus + '/assets/no_user_photo.jpg';
  }
}
