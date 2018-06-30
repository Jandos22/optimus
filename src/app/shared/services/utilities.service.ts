import { Injectable } from '@angular/core';

// ngrx
import { Store, select } from '@ngrx/store';
import * as fromRoot from '../../store';

// constants
import { ApiPath, SlbSpPath } from './../constants/index';

// interfaces
import { SpListItemAttachmentFiles } from '../interface/sp-list-item-field.model';
import { take } from 'rxjs/operators';
import { LocationEnt } from '../interface/locations.model';
import { Observable } from 'rxjs';

@Injectable()
export class UtilitiesService {
  constructor(private store_root: Store<fromRoot.RootState>) {}

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
