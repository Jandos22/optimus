import { PeopleSearch } from './../../people/model/people-search.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

import * as sprLib from 'sprestlib';

import * as harcs from './harcs.actions';

// PRODUCTION
const apiPath = 'https://slb001.sharepoint.com/sites/wireline/';
// DEVELOPMENT
// const apiPath = '';
const listCols = 'Id,Title,Group,Number,Status,Location,ValidTo,QPID';
const listGetNgHARCs = '_api/web/lists/GetByTitle(\'NgHARCs\')/items?$select=' + listCols;

const headkey = 'accept';
const headval = 'application/json;odata=verbose';

@Injectable()
export class HarcsEffects {

    @Effect() triggerSearch = this.actions$
        .ofType(harcs.TRIGGER_SEARCH)
        .switchMap((action: harcs.TriggerSearch) => {

            const search = action.params;
            let uri = apiPath.concat(listGetNgHARCs);

            if (search) {
                uri = uri.concat('&$filter=(Location eq \'' + search.location + '\')');
                if (search.query) {
                    uri = uri.concat(' and ('
                        + '(substringof(\'' + search.query + '\', Title))'
                        + ' or (substringof(\'' + search.query + '\', Group))'
                        + ' or (substringof(\'' + search.query + '\', Number))'
                        + ' or (substringof(\'' + search.query + '\', Status))'
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
                    type: harcs.UPDATE_HARCS_LIST,
                    payload: data.d.results
                };
            }

            if (data.d.results.length === 0) {
                return {
                    type: harcs.NO_RESULTS
                };
            }
        });

    constructor(private actions$: Actions,
        private http: HttpClient ) {}
}
