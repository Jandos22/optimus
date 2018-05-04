import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// rxjs
import { map, switchMap, mergeMap } from 'rxjs/operators';

import * as fromUser from '../actions/user.action';
import * as fromApplication from '../actions/application.action';

import { ApiPath, WirelinePath, ProxyPath } from '../../constants';

import { UserService } from '../../services/index';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private userService: UserService
  ) {}

  @Effect()
  getCurrentUser$ = this.actions$.ofType(fromUser.GET_CURRENT_USER).pipe(
    switchMap(() => this.userService.getCurrentUser()),
    mergeMap((data: any) => {
      const currentUser = this.userService.prepCurrentUserObject(data);
      return [
        new fromUser.SetCurrentUser(currentUser),
        new fromUser.CheckCurrentUser(currentUser.username)
      ];
    })
  );

  @Effect()
  checkCurrentUser$ = this.actions$.ofType(fromUser.CHECK_CURRENT_USER).pipe(
    switchMap((action: fromUser.CheckCurrentUser) => {
      const alias = '%27' + action.payload + '%27';

      let url = `${ApiPath}Web/lists/getbytitle('NgPeople')/items?`;
      url += '$selec=Id,Name,Surname,Alias,Email,Photo,Location';
      url += `&$filter=Alias eq ${alias}`;

      return this.http.get(url);

      // return sprLib.list('NgPeople').getItems({
      //   listCols: [
      //     'Id',
      //     'Name',
      //     'Surname',
      //     'Alias',
      //     'Email',
      //     'Photo',
      //     'Location'
      //   ],
      //   queryFilter: 'Alias eq ' + alias
      // });
    }),
    mergeMap((data: any) => {
      if (data.length > 0) {
        const userdata = data[0];
        const api = ApiPath;
        if (api.length === 5) {
          userdata.Photo.Url.replace(WirelinePath, ProxyPath);
        }

        const optimusUserData = {
          isRegistered: true,
          name: userdata.Name,
          surname: userdata.Surname,
          photo: userdata.Photo.Url,
          location: userdata.Location
        };

        return [
          new fromUser.SetOptimusUser(optimusUserData),
          new fromApplication.SetSelectedLocation(userdata.Location)
        ];
      } else {
        console.log(false);
      }
    })
  );
}
