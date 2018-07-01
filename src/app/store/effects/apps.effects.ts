import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

// ngrx
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as fromAppsActions from '../actions/apps.actions';
import * as fromErrorsActions from '../actions/errors.actions';

// rxjs
import { map, mergeMap, switchMap, catchError, tap } from 'rxjs/operators';

import * as _ from 'lodash';

// services
import { AppsService } from './../../shared/services/apps.service';

// interfaces
import { AppItem } from './../../shared/interface/applications.model';

@Injectable()
export class AppsEffects {
  constructor(
    private actions$: Actions,
    private title: Title,
    private srv: AppsService
  ) {}

  @Effect({ dispatch: false })
  setTitle = this.actions$.pipe(
    ofType(fromAppsActions.AppsActionTypes.SET_APP_NAME),
    tap((action: fromAppsActions.SetAppName) => {
      action.payload === 'Timeline'
        ? this.title.setTitle('Optimus')
        : this.title.setTitle(action.payload + ' - Optimus');
    })
  );

  @Effect()
  getAllApps = this.actions$.pipe(
    ofType(fromAppsActions.AppsActionTypes.GET_ALL_APPS),
    switchMap(x => {
      const get$ = this.srv.getAllApps();

      return get$.pipe(
        map((apps: AppItem[]) => {
          // console.log('apps before sorting');
          // console.log(apps);

          apps = _.sortBy(apps, (v: AppItem) => v.AppPositionNumber);
          // console.log('apps after sorting');
          // console.log(apps);

          apps = _.map(apps, function(app: AppItem) {
            return { ...app, id: app.ID };
          });
          // console.log('apps after mapping id');
          // console.log(apps);

          return new fromAppsActions.GetAllAppsSuccess(apps);
        })
      );
    })
  );
}
