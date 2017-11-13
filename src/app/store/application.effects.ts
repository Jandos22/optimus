import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import * as application from './application.actions';
// import * as $ from 'jquery';
import * as sprLib from 'sprestlib';
import { Locations } from '../shared/interfaces/locations.model';

@Injectable()
export class ApplicationEffects {

    @Effect() setTitle = this.actions$
        .ofType(application.CHANGE_APP_NAME)
        .map((action: application.ChangeAppName) => {
            const title = action.payload;

            title === 'Home' ? this._title.setTitle('Optimus') : this._title.setTitle(title + ' - Optimus');

            return {
                type: application.SET_APP_NAME,
                payload: title
            };
        });

    @Effect() getLocations = this.actions$
        .ofType(application.GET_LOCATIONS)
        .switchMap((action: application.GetLocations) => {
            return sprLib.list('NgLocations').getItems(['Id', 'Location']);
        })
        .map((data: Locations[]) => {
            return {
                type: application.SET_LOCATIONS,
                payload: data
            };
        });

    constructor(private actions$: Actions,
                private httpClient: HttpClient,
                private _title: Title) {}

}
