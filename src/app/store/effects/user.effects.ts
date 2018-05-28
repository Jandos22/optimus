import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// rxjs
import { map, switchMap, mergeMap } from 'rxjs/operators';

import * as fromUser from '../actions/user.actions';
import * as a_in_app from '../actions/app.actions';

import { ApiPath, WirelinePath, ProxyPath } from '../../shared/constants';

import { UserService } from '../../shared/services';

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
      const alias = action.payload;

      let url = `${ApiPath}Web/lists/getbytitle('NgPeople')/items?`;
      url += '$selec=Id,Name,Surname,Alias,Email,Photo,Location';
      url += `&$filter=Alias eq '${alias}'`;

      return this.http.get(url);
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
          new a_in_app.SetSelectedLocation(userdata.Location)
        ];
      } else {
        console.log(false);
      }
    })
  );
}
