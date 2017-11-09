import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';
// import * as $ from 'jquery';
import * as sprLib from 'sprestlib';
import * as user from './user.actions';

@Injectable()
export class UserEffects {

    @Effect() getCurrentUser = this.actions$
        .ofType(user.GET_CURRENT_USER)
        .switchMap(() => {
            return sprLib.user().info();
        })
        .mergeMap((data: any) => {

            const email = data.LoginName.replace('i:0#.f|membership|', '');
            const username = email.replace('@slb.com', '');
            const initials = username.substring(0, 2).toUpperCase();

            const currentUser = {
                username: username,
                email: email,
                initials: initials,
                spId: data.Id
            };

            return [
                { type: user.SET_CURRENT_USER,
                  payload: currentUser },
                { type: user.CHECK_CURRENT_USER,
                  payload: username }
                ];
        });

    @Effect() checkCurrentUser = this.actions$
        .ofType(user.CHECK_CURRENT_USER)
        .switchMap((action: user.CheckCurrentUser) => {
            const alias = '\'' + action.payload + '\'';
            return sprLib.list('NgPeople').getItems({
                listCols: ['Id', 'Name', 'Surname', 'Alias', 'Email', 'Photo'],
                queryFilter: 'Alias eq ' + alias
            });
        })
        .map((data: any) => {

            if (data.length > 0) {

                const userdata = data[0];

                const optimusUserData = {
                    isRegistered: true,
                    name: userdata.Name,
                    surname: userdata.Surname,
                    nameSurname: userdata.Name + ' ' + userdata.Surname,
                    surnameName: userdata.Surname + ' ' + userdata.name,
                    photo: userdata.Photo.Url
                };

                console.log(optimusUserData);

                return {
                    type: user.SET_OPTIMUS_USER,
                    payload: optimusUserData
                };

            } else {
                console.log(false);
            }
        });

    constructor(private actions$: Actions,
                private httpClient: HttpClient) {}

}
