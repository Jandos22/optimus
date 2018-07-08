import { Injectable } from '@angular/core';

// rxjs
import { from } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

// constants
import { ApiPath } from '../../../../../shared/constants';

// interfaces
import {
  PeopleItem,
  ToSaveUserPhoto
} from '../../../../../shared/interface/people.model';

// services
import { SharepointService } from '../../../../../shared/services/sharepoint.service';

@Injectable()
export class NewUserFormHttpService {
  constructor(private sp: SharepointService) {}

  // list.create() method
  addNewUser(fields: PeopleItem) {
    const fdv$ = this.sp.getFDV();
    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        return from(
          new sprLib.list({ name: 'NgPeople', ...fdv }).create(fields)
        );
      })
    );
  }

  savePhoto(photo: ToSaveUserPhoto) {
    const fdv$ = this.sp.getFDV();

    let url = `${ApiPath}/web/lists/getByTitle('NgPeople')/items(${photo.ID})`;
    url += `/AttachmentFiles/add(FileName='${photo.Filename}')`;

    return fdv$.pipe(
      take(1),
      switchMap(fdv => {
        const upload$ = sprLib.rest({
          url: url,
          type: 'POST',
          ...fdv,
          data: photo.ArrayBuffer
        });
        return from(upload$);
      })
    );
  }
}
