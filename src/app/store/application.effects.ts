import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import * as application from './application.actions';
// import * as $ from 'jquery';
import * as sprLib from 'sprestlib';

@Injectable()
export class ApplicationEffects {

    header = new HttpHeaders().set('Accept', 'application/json; odata=verbose');

    @Effect() setTitle = this.actions$
        .ofType(application.CHANGE_APP_NAME)
        .map((action: application.ChangeAppName) => {
            const title = action.payload;
            this._title.setTitle(title + ' - Optimus');
            return {
                type: application.SET_APP_NAME,
                payload: title
            };
        });

    @Effect() getLocations = this.actions$
        .ofType(application.GET_LOCATIONS)
        .switchMap((action: application.GetLocations) => {

            return sprLib.list('NgLocations').getItems(['Id', 'Location']);

            // return this.httpClient.get<any>(
            //     '/_api/web/lists/getbytitle(\'NgLocations\')/items', {
            //         observe: 'body',
            //         headers: this.header
            //     });
        })
        .map((data) => {
            console.log(data);
            return {
                type: application.SET_LOCATIONS,
                payload: data
            };
        });

    constructor(private actions$: Actions,
                private httpClient: HttpClient,
                private _title: Title) {}

}
