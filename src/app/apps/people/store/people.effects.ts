import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

import * as sprLib from 'sprestlib';
import * as people from './people.actions';
import { PeopleSearch } from '../model/people-search.model';

// PRODUCTION
const apiPath = 'https://slb001.sharepoint.com/sites/wireline/';
// DEVELOPMENT
// const apiPath = '';

const listGetNgPeople = '_api/web/lists/GetByTitle(\'NgPeople\')/items?$select=Id,Alias,Name,Surname,Email,Location,Photo';

const headkey = 'accept';
const headval = 'application/json;odata=verbose';


@Injectable()
export class PeopleEffects {

    @Effect() triggerSearch = this.actions$
        .ofType(people.TRIGGER_SEARCH)
        .switchMap((action: people.TriggerSearch) => {

            const search = action.params;
            let uri = apiPath.concat(listGetNgPeople);

            if (search.location) {
                uri = uri.concat('&$filter=(Location eq \'' + search.location + '\')');
                if (search.query) {
                    uri = uri.concat(' and ('
                        + '(substringof(\'' + search.query + '\', Alias))'
                        + ' or (substringof(\'' + search.query + '\', Name))'
                        + ' or (substringof(\'' + search.query + '\', Surname))'
                        + ' or (substringof(\'' + search.query + '\', Email))'
                      + ')'
                    );
                }
            }

            return this.http.get( uri, { headers: new HttpHeaders().set(headkey, headval) }
            );
        })
        .map((data: any) => {
            console.log(data.d.results.length);
            if (data.d.results.length > 0) {
                return {
                    type: people.UPDATE_PEOPLE_LIST,
                    payload: data.d.results
                };
            }

            if (data.d.results.length === 0) {
                return {
                    type: people.NO_RESULTS
                };
            }

        });

    constructor(private actions$: Actions,
                private http: HttpClient) {}
}
