import { ApiPath } from '../../../shared/constants';
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
import * as application from '../../../store/application.actions';
import { PeopleSearch } from '../model/people-search.model';

const listGetNgPeople = 'web/lists/GetByTitle(\'NgPeople\')/items?$select=Id,Alias,Name,Surname,Email,Location,Photo';

const headkey = 'accept';
const headval = 'application/json;odata=verbose';

@Injectable()
export class PeopleEffects {

    @Effect() triggerSearch = this.actions$
        .ofType(people.TRIGGER_SEARCH)
        .switchMap((action: people.TriggerSearch) => {

            const search = action.params;
            let uri = ApiPath.concat(listGetNgPeople);

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

            return this.http.get( uri, { headers: new HttpHeaders().set(headkey, headval) });
        })
        .mergeMap((data: any) => {
            console.log(data.d.results.length);
            if (data.d.results.length > 0) {
                return [
                    {
                        type: people.UPDATE_PEOPLE_LIST,
                        payload: data.d.results
                    },
                    {
                        type: application.FINISH_WORKING
                    }
                ];
            }

            if (data.d.results.length === 0) {
                return [
                    {
                        type: people.NO_RESULTS
                    },
                    {
                        type: application.FINISH_WORKING
                }];
            }

        });

    constructor(private actions$: Actions,
                private http: HttpClient) {}

    getItemType(listname: string) {
        return 'SP.Data' + listname.charAt(0).toUpperCase() + listname.slice(1) + 'ListItem';
    }
}
