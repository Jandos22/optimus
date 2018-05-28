import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ApiPath, WirelinePath, ProxyPath } from './../shared/constants';

// data models
import { Photo } from './../models/photo.model';
import { FDV } from './../models/fdv.model';
import { FormDigestValue } from '../models/index';
import { CurrentUser } from '../models/current-user.m';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getCurrentUser() {
    // return sprLib.user().info();
    return this.http.get(`${ApiPath}Web/CurrentUser`);
  }

  getLoggedInUser() {
    return this.http.get(`${ApiPath}Web/CurrentUser`);
  }

  checkLoggedInUserRegistered(alias) {
    return this.http.get(
      `${ApiPath}Web/lists/getbytitle('NgPeople')/items?$filter=Alias eq '${alias}'`
    );
  }

  fdv() {
    return this.http.post(`${ApiPath}contextinfo`, {
      headers: new HttpHeaders().set('accept', 'application/json;odata=verbose')
    });
  }

  listitem(list) {
    return (
      'SP.Data.' + list.charAt(0).toUpperCase() + list.slice(1) + 'ListItem'
    );
  }

  addUser(user: any): Observable<any> {
    user = {
      ...user,
      __metadata: {
        type: this.listitem('NgPeople')
      }
    };
    return this.fdv().pipe(
      switchMap((v: FormDigestValue) => {
        return this.http.post(
          `${ApiPath}web/lists/getbytitle('NgPeople')/items`,
          JSON.stringify(user),
          {
            headers: new HttpHeaders()
              .set('accept', 'application/json;odata=verbose')
              .append('content-type', 'application/json;odata=verbose')
              .append('X-RequestDigest', v.FormDigestValue)
          }
        );
      }),
      map(res => {
        return res;
      })
    );
  }

  addPhoto(photo: Photo) {
    return this.getFDV().pipe(
      switchMap((fdv: FDV) => {
        const url = `${ApiPath}web/lists/getbytitle('NgPhotos')/rootfolder/files/add(url='${
          photo.Filename
        }',overwrite='true')`;

        return this.http.post(url, photo.ArrayBuffer, {
          headers: new HttpHeaders()
            .set('accept', 'application/json;odata=verbose')
            .append('Content-Type', 'application/json;odata=verbose')
            .append('X-RequestDigest', fdv.FormDigestValue)
        });
      }),
      map(res => res)
    );
  }

  prepCurrentUserObject(user: CurrentUser) {
    let loginName = user.LoginName;
    let spId = user.Id;

    // used only in development mode, on my Mac
    if (
      loginName === 'i:0i.t|00000003-0000-0ff1-ce00-000000000000|app@sharepoint'
    ) {
      loginName = 'zombayev@slb.com';
      spId = 9;
    }

    const email = loginName.replace('i:0#.f|membership|', '');
    const username = email.replace('@slb.com', '');
    const initials = username.substring(0, 2).toUpperCase();

    return {
      username,
      email,
      initials,
      spId
    };
  }

  prepOptimusUserObject(userdata) {
    if (ApiPath.startsWith('_')) {
      // console.log(userdata);
      userdata.Photo.Url.replace(WirelinePath, ProxyPath);
    }
    return {
      isRegistered: true,
      name: userdata.Name,
      surname: userdata.Surname,
      photo: userdata.Photo.Url,
      location: userdata.Location
    };
  }

  private getFDV() {
    const url = ApiPath + 'contextinfo';
    const headers = new HttpHeaders().set(
      'accept',
      'application/json;odata=verbose'
    );
    return this.http.post(url, { headers });
  }
}
