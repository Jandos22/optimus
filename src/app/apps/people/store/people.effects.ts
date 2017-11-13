import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/mergeMap';

import * as sprLib from 'sprestlib';

import * as people from './people.actions';

@Injectable()
export class PeopleEffects {

    @Effect({dispatch: false}) navigatedToPeople = this.actions$
        .ofType(people.NAVIGATED_TO_PEOPLE)
        .switchMap(() => {
            return sprLib.list('NgPeople').getItems();
        })
        .do((data) => {
            console.log(data);
        });

    constructor(private actions$: Actions) {}
}
